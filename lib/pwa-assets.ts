export interface PWAIconSize {
  size: number;
  name: string;
  maskable: boolean;
  purpose: string;
}

export const PWA_ICON_SIZES: PWAIconSize[] = [
  { size: 48,  name: "icon-48.png",  maskable: false, purpose: "any" },
  { size: 72,  name: "icon-72.png",  maskable: false, purpose: "any" },
  { size: 96,  name: "icon-96.png",  maskable: false, purpose: "any" },
  { size: 128, name: "icon-128.png", maskable: false, purpose: "any" },
  { size: 144, name: "icon-144.png", maskable: false, purpose: "any" },
  { size: 152, name: "icon-152.png", maskable: false, purpose: "any" },
  { size: 192, name: "icon-192.png", maskable: false, purpose: "any" },
  { size: 384, name: "icon-384.png", maskable: false, purpose: "any" },
  { size: 512, name: "icon-512.png", maskable: false, purpose: "any" },
  // Maskable — icon centred in a safe zone (80% of canvas), background filled
  { size: 192, name: "maskable-192.png", maskable: true, purpose: "maskable" },
  { size: 512, name: "maskable-512.png", maskable: true, purpose: "maskable" },
];

export async function generatePWAIcon(
  src: string,
  size: number,
  maskable: boolean,
  bgColor: string
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d")!;

      if (maskable) {
        // Fill background
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, size, size);
        // Draw icon centred within the 80% safe zone
        const safeSize = Math.round(size * 0.8);
        const offset = Math.round((size - safeSize) / 2);
        ctx.drawImage(img, offset, offset, safeSize, safeSize);
      } else {
        ctx.drawImage(img, 0, 0, size, size);
      }

      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("toBlob failed"));
      }, "image/png");
    };
    img.onerror = reject;
    img.src = src;
  });
}

export function generateManifest(opts: {
  name: string;
  shortName: string;
  themeColor: string;
  bgColor: string;
  startUrl: string;
  display: string;
}): string {
  const icons = PWA_ICON_SIZES.map((icon) => ({
    src: `/${icon.name}`,
    sizes: `${icon.size}x${icon.size}`,
    type: "image/png",
    purpose: icon.purpose,
  }));

  return JSON.stringify(
    {
      name: opts.name,
      short_name: opts.shortName,
      description: opts.name,
      start_url: opts.startUrl,
      display: opts.display,
      background_color: opts.bgColor,
      theme_color: opts.themeColor,
      icons,
    },
    null,
    2
  );
}
