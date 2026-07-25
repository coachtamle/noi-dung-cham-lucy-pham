import handler from "@astrojs/cloudflare/entrypoints/server";

const contentTypes: Record<string, string> = {
	".jpg": "image/jpeg",
	".jpeg": "image/jpeg",
	".png": "image/png",
	".svg": "image/svg+xml; charset=utf-8",
	".webp": "image/webp",
	".gif": "image/gif",
	".ico": "image/x-icon",
	".pdf": "application/pdf",
	".txt": "text/plain; charset=utf-8",
};

function contentTypeFor(pathname: string): string {
	const ext = pathname.match(/\.[^.\/]+$/)?.[0]?.toLowerCase() ?? "";
	return contentTypes[ext] ?? "application/octet-stream";
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext) {
		const url = new URL(request.url);
		if (url.pathname.startsWith("/media/")) {
			const key = decodeURIComponent(url.pathname.slice("/media/".length));
			const object = await env.MEDIA.get(key);
			if (!object) return new Response("Not found", { status: 404 });

			const headers = new Headers();
			object.writeHttpMetadata(headers);
			if (!headers.has("content-type")) headers.set("content-type", contentTypeFor(key));
			headers.set("etag", object.httpEtag);
			headers.set("cache-control", "public, max-age=31536000, immutable");
			return new Response(object.body, { headers });
		}

		return handler.fetch(request, env, ctx);
	},
};
