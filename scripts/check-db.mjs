import Database from "better-sqlite3";
const db = new Database("data.db");
const posts = db.prepare("SELECT id, slug, status, published_at FROM ec_posts ORDER BY published_at DESC").all();
console.log(`Total: ${posts.length} posts`);
posts.forEach(p => console.log(`  [${p.status}] ${p.slug} (${p.published_at})`));
