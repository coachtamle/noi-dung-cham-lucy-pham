import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface NewsletterEnv extends Env {
	NEWSLETTER_SIGNUP_WEBHOOK_URL?: string;
	NEWSLETTER_SECRET?: string;
}

function json(message: string, status: number) {
	return new Response(JSON.stringify({ message }), {
		status,
		headers: {
			"Content-Type": "application/json; charset=utf-8",
			"Cache-Control": "no-store",
		},
	});
}

export const POST: APIRoute = async ({ request, url }) => {
	const newsletterEnv = env as NewsletterEnv;
	const origin = request.headers.get("Origin");
	if (origin && new URL(origin).host !== url.host) {
		return json("Yêu cầu đăng ký không hợp lệ.", 403);
	}

	let payload: { email?: unknown; website?: unknown; source?: unknown };

	try {
		payload = await request.json();
	} catch {
		return json("Dữ liệu đăng ký không hợp lệ.", 400);
	}

	if (typeof payload.website === "string" && payload.website.trim()) {
		return json("Đăng ký thành công. Cảm ơn bạn!", 200);
	}

	if (typeof payload.email !== "string") {
		return json("Vui lòng nhập địa chỉ email.", 400);
	}

	const email = payload.email.trim().toLowerCase();
	if (email.length > 254 || !EMAIL_PATTERN.test(email)) {
		return json("Địa chỉ email chưa đúng. Bạn kiểm tra lại nhé.", 400);
	}
	const source = typeof payload.source === "string" && payload.source.startsWith("/")
		? payload.source.slice(0, 200)
		: "/posts";

	try {
		await newsletterEnv.DB.prepare(`
			CREATE TABLE IF NOT EXISTS newsletter_subscribers (
				email TEXT PRIMARY KEY,
				status TEXT NOT NULL DEFAULT 'active',
				source TEXT NOT NULL DEFAULT 'website',
				subscribed_at TEXT NOT NULL,
				updated_at TEXT NOT NULL
			)
		`).run();

		const now = new Date().toISOString();
		await newsletterEnv.DB.prepare(`
			INSERT INTO newsletter_subscribers (email, status, source, subscribed_at, updated_at)
			VALUES (?, 'active', ?, ?, ?)
			ON CONFLICT(email) DO UPDATE SET
				status = 'active',
				source = excluded.source,
				updated_at = excluded.updated_at
		`).bind(email, source, now, now).run();

		if (newsletterEnv.NEWSLETTER_SIGNUP_WEBHOOK_URL) {
			const webhookResponse = await fetch(newsletterEnv.NEWSLETTER_SIGNUP_WEBHOOK_URL, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					secret: newsletterEnv.NEWSLETTER_SECRET ?? "",
					email,
					source,
					subscribedAt: now,
				}),
			});

			if (!webhookResponse.ok) {
				console.error("Newsletter signup webhook failed", webhookResponse.status);
			}
		}

		return json("Đăng ký thành công. Bài viết mới sẽ được gửi tới email của bạn.", 200);
	} catch (error) {
		console.error("Newsletter subscription failed", error);
		return json("Chưa thể lưu email lúc này. Bạn vui lòng thử lại sau.", 500);
	}
};
