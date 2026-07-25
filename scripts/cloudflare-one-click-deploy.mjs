import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { extname, resolve } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const Database = require("better-sqlite3");

const root = process.cwd();
const seedDb = resolve(root, ".tmp-one-click-seed.db");
const importSql = resolve(root, ".tmp-one-click-d1-import.sql");
const d1Config = resolve(root, ".tmp-one-click-wrangler.jsonc");
const seedFile = "seed/seed.json";
const mediaExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".svg", ".gif", ".ico", ".pdf", ".txt"]);

function run(command, args, options = {}) {
	const result = spawnSync(command, args, {
		cwd: root,
		env: { ...process.env, ...options.env },
		encoding: "utf8",
		stdio: options.capture ? "pipe" : "inherit",
	});

	if (result.status !== 0) {
		if (options.capture) {
			if (result.stdout) process.stdout.write(result.stdout);
			if (result.stderr) process.stderr.write(result.stderr);
		}
		throw new Error(`Command failed: ${command} ${args.join(" ")}`);
	}

	return `${result.stdout ?? ""}${result.stderr ?? ""}`;
}

function pnpm(args, options) {
	if (process.env.npm_execpath) {
		return run(process.execPath, [process.env.npm_execpath, ...args], options);
	}
	return run("corepack", ["pnpm", ...args], options);
}

function wrangler(args, options) {
	return pnpm(["exec", "wrangler", ...args], options);
}

function extractWorkerUrl(output) {
	const matches = output.match(/https:\/\/[^\s]+\.workers\.dev/g);
	return matches?.at(-1);
}

function readWranglerConfig() {
	const jsonc = readFileSync(resolve(root, "wrangler.jsonc"), "utf8")
		.replace(/\/\/.*$/gm, "")
		.replace(/,\s*([}\]])/g, "$1");
	return JSON.parse(jsonc);
}

function createD1ConfigArgs() {
	const config = readWranglerConfig();
	const database = config.d1_databases?.find((binding) => binding.binding === "DB");
	if (!database?.database_name) throw new Error("No DB D1 database configured in wrangler.jsonc.");
	if (database.database_id) return ["--config", "wrangler.jsonc"];

	const output = wrangler(["d1", "list", "--json"], { capture: true });
	const databases = JSON.parse(output);
	const remote = databases.find((entry) => entry.name === database.database_name);
	if (!remote?.uuid) {
		throw new Error(`Could not find D1 database "${database.database_name}". Run wrangler deploy first.`);
	}

	const patched = {
		...config,
		d1_databases: config.d1_databases.map((binding) =>
			binding.binding === "DB" ? { ...binding, database_id: remote.uuid } : binding,
		),
	};
	writeFileSync(d1Config, JSON.stringify(patched, null, "\t"), "utf8");
	return ["--config", d1Config];
}

function sqlIdent(value) {
	return `"${String(value).replace(/"/g, '""')}"`;
}

function sqlLiteral(value) {
	if (value === null || value === undefined) return "NULL";
	if (typeof value === "number") return Number.isFinite(value) ? String(value) : "NULL";
	if (typeof value === "bigint") return String(value);
	if (Buffer.isBuffer(value) || value instanceof Uint8Array) return `X'${Buffer.from(value).toString("hex")}'`;
	return `'${String(value).replace(/'/g, "''")}'`;
}

function createSeedSql() {
	for (const file of [seedDb, importSql, `${seedDb}-shm`, `${seedDb}-wal`]) {
		if (existsSync(file)) rmSync(file, { force: true });
	}

	pnpm(["exec", "emdash", "seed", seedFile, "--database", seedDb, "--on-conflict", "update"]);

	const db = new Database(seedDb, { readonly: true });
	const objects = db.prepare(`
		SELECT type, name, tbl_name, sql
		FROM sqlite_master
		WHERE sql IS NOT NULL AND name NOT LIKE 'sqlite_%'
		ORDER BY CASE type WHEN 'table' THEN 0 WHEN 'index' THEN 1 WHEN 'trigger' THEN 2 WHEN 'view' THEN 3 ELSE 4 END, name
	`).all();

	const virtualTables = new Set(
		objects.filter((object) => /CREATE\s+VIRTUAL\s+TABLE/i.test(object.sql)).map((object) => object.name),
	);
	const isFtsShadow = (name) => [...virtualTables].some((table) => name.startsWith(`${table}_`));
	const lines = ["PRAGMA foreign_keys=OFF;"];

	for (const object of objects.filter((object) => object.type === "view")) {
		lines.push(`DROP VIEW IF EXISTS ${sqlIdent(object.name)};`);
	}
	for (const object of objects.filter((object) => object.type === "trigger")) {
		lines.push(`DROP TRIGGER IF EXISTS ${sqlIdent(object.name)};`);
	}
	for (const object of objects.filter((object) => object.type === "table" && !isFtsShadow(object.name))) {
		lines.push(`DROP TABLE IF EXISTS ${sqlIdent(object.name)};`);
	}

	for (const object of objects) {
		if (isFtsShadow(object.name) || isFtsShadow(object.tbl_name)) continue;

		if (object.type === "table") {
			lines.push(`${object.sql};`);
			if (virtualTables.has(object.name)) continue;

			const columns = db.prepare(`PRAGMA table_info(${sqlIdent(object.name)})`).all().map((column) => column.name);
			const rows = db.prepare(`SELECT * FROM ${sqlIdent(object.name)}`).all();
			for (const row of rows) {
				lines.push(
					`INSERT INTO ${sqlIdent(object.name)} (${columns.map(sqlIdent).join(", ")}) VALUES (${columns
						.map((column) => sqlLiteral(row[column]))
						.join(", ")});`,
				);
			}
		} else {
			lines.push(`${object.sql};`);
		}
	}

	db.close();
	writeFileSync(importSql, `${lines.join("\n")}\n`, "utf8");
}

function remotePostCount() {
	try {
		const configArgs = createD1ConfigArgs();
		const output = wrangler([
			"d1",
			"execute",
			"DB",
			...configArgs,
			"--remote",
			"--command",
			"SELECT COUNT(*) AS count FROM ec_posts;",
			"--json",
		], { capture: true });
		const payload = JSON.parse(output);
		return Number(payload?.[0]?.results?.[0]?.count ?? 0);
	} catch {
		return null;
	}
}

function seedDatabaseIfNeeded() {
	const count = remotePostCount();
	if (count && count > 0) {
		console.log(`Remote D1 already has ${count} posts. Skipping seed import.`);
		return;
	}

	console.log("Seeding remote D1 database from seed/seed.json...");
	createSeedSql();
	wrangler(["d1", "execute", "DB", ...createD1ConfigArgs(), "--remote", "--file", importSql, "--yes"]);
}

function contentTypeFor(file) {
	const ext = extname(file).toLowerCase();
	if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
	if (ext === ".png") return "image/png";
	if (ext === ".svg") return "image/svg+xml; charset=utf-8";
	if (ext === ".webp") return "image/webp";
	if (ext === ".gif") return "image/gif";
	if (ext === ".ico") return "image/x-icon";
	if (ext === ".pdf") return "application/pdf";
	if (ext === ".txt") return "text/plain; charset=utf-8";
	return "application/octet-stream";
}

function listMediaFiles() {
	const output = run("git", ["ls-files", "public"], { capture: true });
	return output
		.split(/\r?\n/)
		.filter(Boolean)
		.filter((file) => mediaExtensions.has(extname(file).toLowerCase()));
}

function uploadMedia() {
	const config = readWranglerConfig();
	const bucket = config.r2_buckets?.find((binding) => binding.binding === "MEDIA")?.bucket_name;
	if (!bucket) {
		console.log("No MEDIA R2 bucket configured. Skipping media upload.");
		return;
	}

	const files = listMediaFiles();
	console.log(`Uploading ${files.length} media files to R2 bucket ${bucket}...`);
	for (const file of files) {
		const key = file.replace(/^public\//, "").replace(/\\/g, "/");
		wrangler([
			"r2",
			"object",
			"put",
			`${bucket}/${key}`,
			"--remote",
			"--file",
			file,
			"--content-type",
			contentTypeFor(file),
			"--cache-control",
			"public, max-age=31536000, immutable",
		]);
	}
}

function deployWithSiteUrl(siteUrl) {
	pnpm(["run", "build"], siteUrl ? { env: { SITE_URL: siteUrl } } : undefined);
	return extractWorkerUrl(wrangler(["deploy"], { capture: true, env: siteUrl ? { SITE_URL: siteUrl } : undefined }));
}

const firstUrl = deployWithSiteUrl(process.env.SITE_URL);
seedDatabaseIfNeeded();
uploadMedia();

const finalUrl = process.env.SITE_URL || firstUrl;
if (finalUrl) {
	deployWithSiteUrl(finalUrl);
	console.log(`Website: ${finalUrl}`);
	console.log(`EmDash admin: ${finalUrl}/_emdash/admin`);
}
