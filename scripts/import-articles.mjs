import fs from "fs";
import path from "path";

const ARTICLES_DIR =
	"G:/My Drive/#Web1trang/BLOGPROJECT/customers/KH05-bui-minh-trang/articles-markdown";
const SEED_PATH = "./seed/seed.json";

const PILLAR_TAG = {
	"Content thấu cảm": "content-thau-cam",
	"Blog": "blog",
	"Tài liệu": "tai-lieu",
};

function parseFrontmatter(rawContent) {
	const content = rawContent.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
	const match = content.match(/^---\n([\s\S]*?)\n---/);
	if (!match) return { meta: {}, body: content };

	const meta = {};
	for (const line of match[1].split("\n")) {
		const colonIdx = line.indexOf(":");
		if (colonIdx > 0) {
			const key = line.slice(0, colonIdx).trim();
			const val = line.slice(colonIdx + 1).trim().replace(/^"|"$/g, "");
			meta[key] = val;
		}
	}

	return { meta, body: content.slice(match[0].length).trim() };
}

function mdToPortableText(md) {
	const blocks = [];
	let keyIdx = 0;

	for (const rawLine of md.split("\n")) {
		const line = rawLine.trim();
		if (!line) continue;
		const style = line.startsWith("## ") ? "h2" : line.startsWith("### ") ? "h3" : "normal";
		const text = line.replace(/^#{2,3}\s+/, "").replace(/^\-\s+/, "");
		blocks.push({
			_type: "block",
			style,
			listItem: rawLine.trim().startsWith("- ") ? "bullet" : undefined,
			level: rawLine.trim().startsWith("- ") ? 1 : undefined,
			children: [{ _type: "span", text, _key: `k${keyIdx++}` }],
			_key: `k${keyIdx++}`,
		});
	}

	return blocks;
}

if (!fs.existsSync(ARTICLES_DIR)) {
	throw new Error(`Articles directory not found: ${ARTICLES_DIR}`);
}

const files = fs.readdirSync(ARTICLES_DIR).filter((file) => file.endsWith(".md"));
const posts = files.map((file) => {
	const raw = fs.readFileSync(path.join(ARTICLES_DIR, file), "utf8");
	const { meta, body } = parseFrontmatter(raw);
	const slug = meta.slug || path.basename(file, ".md");
	const tagSlug = PILLAR_TAG[meta.pillar] || "content-thau-cam";

	return {
		id: `post-minh-trang-${slug}`,
		slug,
		status: "published",
		publishedAt: meta.published_at || new Date().toISOString(),
		bylines: [{ byline: "byline-minh-trang" }],
		taxonomies: { tag: [tagSlug] },
		data: {
			title: meta.title || slug,
			excerpt: meta.subtitle || body.slice(0, 220).trim(),
			content: mdToPortableText(body),
			featured_image: `/images/thumb-${slug}.svg`,
		},
	};
});

const seed = JSON.parse(fs.readFileSync(SEED_PATH, "utf8"));
seed.content.posts = posts;
fs.writeFileSync(SEED_PATH, JSON.stringify(seed, null, "\t"), "utf8");
console.log(`Updated seed.json with ${posts.length} posts`);
