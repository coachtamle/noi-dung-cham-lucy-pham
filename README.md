# Noi Dung Cham - Lucy Pham

Website EmDash/Astro cho thuong hieu Lucy Pham, da duoc dua len GitHub moi va deploy len Cloudflare Workers.

## One-click Deploy

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/web1trangvn/noi-dung-cham-lucy-pham)

Khach hang co the bam nut tren de tao mot site rieng trong tai khoan Cloudflare cua ho. Cloudflare se clone repo, tao Worker moi va provision cac binding can thiet tu `wrangler.jsonc`.

Sau khi deploy xong:

- Website se co dang `https://<worker-name>.<account-subdomain>.workers.dev`
- Link quan tri EmDash: `https://<worker-name>.<account-subdomain>.workers.dev/_emdash/admin`
- Database D1, R2 bucket va KV session se duoc tao rieng cho site do.
- Script `pnpm run deploy` se tu seed noi dung ban dau vao D1 va upload media tu `public/` len R2.

Luu y: Cloudflare Deploy Button chi ho tro repo GitHub/GitLab public. Repo nay can de public neu muon khach hang ben ngoai bam deploy truc tiep.

## Lien ket chinh

- GitHub repo: https://github.com/web1trangvn/noi-dung-cham-lucy-pham
- Website production: https://noi-dung-cham-lucy-pham.web1trangdotcom.workers.dev
- Cloudflare Worker: `noi-dung-cham-lucy-pham`
- D1 database: `noi-dung-cham-lucy-pham-db`
- D1 database ID: `5679b962-934b-42b1-9447-4f692f25ac95`
- R2 bucket: `noi-dung-cham-lucy-pham-media`
- KV session namespace: `SESSION` - `471bf353056642a4b42b76d24a5e5b43`

## Cau truc quan trong

- `src/`: code giao dien va route Astro.
- `src/worker.ts`: Worker entry, co route `/media/*` de lay file tu R2.
- `src/pages/`: cac trang public cua website.
- `src/pages/posts/`: trang danh sach blog va trang chi tiet bai viet.
- `src/styles/theme.css`: bien mau, font va style tong the.
- `public/images/lucy/`: anh Lucy dang dung trong website.
- `seed/seed.json`: du lieu seed cua EmDash.
- `wrangler.jsonc`: cau hinh Cloudflare Worker, D1, R2 va KV.

## Chay local

```bash
corepack pnpm install
corepack pnpm dev
```

Neu muon dung file helper tren Windows:

```bash
.\start-dev-server.cmd
```

## Build va deploy

Build truoc de kiem tra loi:

```bash
corepack pnpm build
```

Deploy len Cloudflare:

```bash
corepack pnpm run deploy
```

Lenh deploy nay se:

- Build Astro.
- Deploy Worker de Cloudflare tao D1/R2/KV neu chua co.
- Seed D1 tu `seed/seed.json` neu database dang trong.
- Upload media tu `public/` len R2 bucket `MEDIA`.
- Deploy lai voi `SITE_URL` dung theo URL workers.dev vua duoc tao.

Neu chi muon deploy Worker nhanh, khong seed/upload lai:

```bash
corepack pnpm run deploy:worker
```

## Database D1

Kiem tra so bai blog tren database online:

```bash
corepack pnpm wrangler d1 execute noi-dung-cham-lucy-pham-db --remote --command "SELECT COUNT(*) AS count FROM ec_posts;" --json
```

Website hien da import database local len D1 online, trong do co 5 bai blog.

## Media R2

Media public tren website duoc doc qua route:

```text
/media/<duong-dan-file-trong-R2>
```

Vi du:

```text
https://noi-dung-cham-lucy-pham.web1trangdotcom.workers.dev/media/images/lucy/logo.svg
```

Upload them file vao R2:

```bash
corepack pnpm wrangler r2 object put noi-dung-cham-lucy-pham-media/path/to/file.jpg --remote --file ./public/path/to/file.jpg
```

## Ghi chu Cloudflare

Ban deploy hien tai da tat `sandboxRunner`, `marketplace` va `webhookNotifierPlugin` cua EmDash vi tai khoan Cloudflare hien tai chua bat Workers paid plan. Neu can dung Dynamic Workers/sandbox cua EmDash sau nay, nang cap Workers plan roi bat lai cac cau hinh nay trong `astro.config.mjs`, `src/worker.ts` va `wrangler.jsonc`.

## Git

Remote moi:

```bash
origin https://github.com/web1trangvn/noi-dung-cham-lucy-pham.git
```

Remote repo goc cu duoc giu lai de tham chieu:

```bash
upstream-original https://github.com/thanconghuy/noidungxanh.com.git
```
