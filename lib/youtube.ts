export function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&\n?#]+)/,
    /(?:youtu\.be\/)([^&\n?#]+)/,
    /(?:youtube\.com\/embed\/)([^&\n?#]+)/,
    /(?:youtube\.com\/shorts\/)([^&\n?#]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export const THUMBNAIL_QUALITIES = [
  { key: "maxresdefault", label: "Max Resolution", resolution: "1280×720" },
  { key: "sddefault", label: "Standard", resolution: "640×480" },
  { key: "hqdefault", label: "High Quality", resolution: "480×360" },
  { key: "mqdefault", label: "Medium Quality", resolution: "320×180" },
  { key: "default", label: "Default", resolution: "120×90" },
] as const;

export function getThumbnailUrl(videoId: string, quality: string): string {
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
}
