const FEATURED_IMAGE_OVERRIDES: Record<string, string> = {
	"dung-lam-content-neu-chua-tra-loi-duoc-3-cau-hoi-nay": "/media/images/lucy/2148552177.jpg",
	"content-thau-cam-khi-su-tu-te-tro-thanh-loi-the-canh-tranh": "/media/images/lucy/2148854508.jpg",
	"3-sai-lam-khien-content-team-cua-ban-kiet-suc-nhung-khong-co-hieu-qua": "/media/images/lucy/25951.jpg",
	"chuyen-minh-tu-tho-viet-writer-sang-nguoi-hoach-dinh-strategist": "/media/images/lucy/28066.jpg",
	"brand-voice-thu-giup-thuong-hieu-khong-bi-hoa-tan-giua-ky-nguyen-ai": "/media/images/lucy/6851.jpg",
};

export function getPostFeaturedImage(
	slugOrId: string | null | undefined,
	featuredImage: unknown,
	title?: string | null,
): unknown {
	if (slugOrId && FEATURED_IMAGE_OVERRIDES[slugOrId]) {
		return FEATURED_IMAGE_OVERRIDES[slugOrId];
	}

	return featuredImage;
}
