import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { getEmDashEntry } from "emdash";
import { normalizeContentTitle } from "../../../utils/content-text";

interface NewsletterEnv extends Env {
	NEWSLETTER_MAILER_URL?: string;
	NEWSLETTER_SECRET?: string;
}

interface WebhookPayload {
	event?: unknown;
	collection?: unknown;
	resourceId?: unknown;
	metadata?: {
		slug?: unknown;
		status?: unknown;
	};
}

function json(message: string, status: number, extra: Record<string, unknown> = {}) {
	return new Response(JSON.stringify({ message, ...extra }), {
		status,
		headers: {
			"Content-Type": "application/json; charset=utf-8",
			"Cache-Control": "no-store",
		},
	});
}

function escapeHtml(value: string) {
	return value.replace(/[&<>"']/g, (character) => ({
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		'"': "&quot;",
		"'": "&#039;",
	})[character] ?? character);
}

export const POST: APIRoute = async ({ request, url }) => {
	const newsletterEnv = env as NewsletterEnv;
	if (!newsletterEnv.NEWSLETTER_SECRET || !newsletterEnv.NEWSLETTER_MAILER_URL) {
		return json("Newsletter mailer chưa được cấu hình.", 503);
	}

	const authorization = request.headers.get("Authorization");
	if (authorization !== `Bearer ${newsletterEnv.NEWSLETTER_SECRET}`) {
		return json("Không có quyền gửi newsletter.", 401);
	}

	let payload: WebhookPayload;
	try {
		payload = await request.json();
	} catch {
		return json("Webhook không hợp lệ.", 400);
	}

	const slug = typeof payload.metadata?.slug === "string" ? payload.metadata.slug : "";
	const status = payload.metadata?.status;
	const resourceId = typeof payload.resourceId === "string" ? payload.resourceId : "";
	if (payload.collection !== "posts" || !slug || !resourceId) {
		return json("Sự kiện không thuộc bài viết.", 202);
	}
	if (status !== "published") {
		return json("Bài viết chưa được xuất bản.", 202);
	}

	await newsletterEnv.DB.batch([
		newsletterEnv.DB.prepare(`
			CREATE TABLE IF NOT EXISTS newsletter_subscribers (
				email TEXT PRIMARY KEY,
				status TEXT NOT NULL DEFAULT 'active',
				source TEXT NOT NULL DEFAULT 'website',
				subscribed_at TEXT NOT NULL,
				updated_at TEXT NOT NULL
			)
		`),
		newsletterEnv.DB.prepare(`
			CREATE TABLE IF NOT EXISTS newsletter_deliveries (
				resource_id TEXT PRIMARY KEY,
				slug TEXT NOT NULL,
				status TEXT NOT NULL,
				recipient_count INTEGER NOT NULL DEFAULT 0,
				created_at TEXT NOT NULL,
				sent_at TEXT
			)
		`),
	]);

	const now = new Date().toISOString();
	const claim = await newsletterEnv.DB.prepare(`
		INSERT OR IGNORE INTO newsletter_deliveries
			(resource_id, slug, status, recipient_count, created_at)
		VALUES (?, ?, 'processing', 0, ?)
	`).bind(resourceId, slug, now).run();

	if (!claim.meta.changes) {
		return json("Bài viết này đã được xử lý trước đó.", 200);
	}

	try {
		const [{ entry: post }, subscribers] = await Promise.all([
			getEmDashEntry("posts", slug),
			newsletterEnv.DB.prepare(`
				SELECT email
				FROM newsletter_subscribers
				WHERE status = 'active'
				ORDER BY subscribed_at ASC
			`).all<{ email: string }>(),
		]);

		if (!post) throw new Error(`Không tìm thấy bài viết ${slug}`);

		const recipients = subscribers.results.map(({ email }) => email);
		const articleUrl = new URL(`/posts/${slug}`, url.origin).href;
		const title = normalizeContentTitle(post.data.title);
		const excerpt = typeof post.data.excerpt === "string" ? post.data.excerpt : "";
		const html = `
			<div style="font-family:Inter,Arial,sans-serif;max-width:620px;margin:0 auto;color:#1f2925;line-height:1.65">
				<p style="color:#237a60;font-weight:700">N?i Dung Ch?m</p>
				<h1 style="font-size:26px;line-height:1.3">${escapeHtml(title)}</h1>
				${excerpt ? `<p>${escapeHtml(excerpt)}</p>` : ""}
				<p><a href="${articleUrl}" style="display:inline-block;padding:11px 18px;background:#237a60;color:#fff;text-decoration:none;border-radius:4px;font-weight:700">Đọc bài viết mới</a></p>
				<p style="font-size:13px;color:#68736e">
					Bạn nhận được email này vì đã đăng ký thành viên tại lucyphamcontent.com.
					<a href="mailto:lucypham.content@gmail.com?subject=Hủy đăng ký nhận bài viết">Hủy đăng ký</a>
				</p>
			</div>
		`;

		for (let index = 0; index < recipients.length; index += 75) {
			const response = await fetch(newsletterEnv.NEWSLETTER_MAILER_URL, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					secret: newsletterEnv.NEWSLETTER_SECRET,
					recipients: recipients.slice(index, index + 75),
					subject: `Bài viết mới: ${title}`,
					html,
					text: `${title}\n\n${excerpt}\n\nĐọc bài viết: ${articleUrl}\n\nHủy đăng ký: gửi email tới lucypham.content@gmail.com`,
				}),
			});

			if (!response.ok) {
				throw new Error(`Mailer trả về HTTP ${response.status}`);
			}
		}

		await newsletterEnv.DB.prepare(`
			UPDATE newsletter_deliveries
			SET status = 'sent', recipient_count = ?, sent_at = ?
			WHERE resource_id = ?
		`).bind(recipients.length, new Date().toISOString(), resourceId).run();

		return json("Đã gửi thông báo bài viết mới.", 200, { recipients: recipients.length });
	} catch (error) {
		await newsletterEnv.DB.prepare(
			"DELETE FROM newsletter_deliveries WHERE resource_id = ? AND status = 'processing'",
		).bind(resourceId).run();
		console.error("Newsletter notification failed", error);
		return json("Không thể gửi thông báo bài viết mới.", 502);
	}
};
