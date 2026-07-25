export function normalizeContentTitle(value: string | null | undefined): string {
	return (value ?? "").replace(/\\"/g, '"');
}
