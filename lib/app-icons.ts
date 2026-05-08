export interface IconSize {
  size: number;
  name: string;
  platform: "ios" | "android" | "both";
  label: string;
}

export const APP_ICON_SIZES: IconSize[] = [
  // iOS
  { size: 20,   name: "icon-20.png",    platform: "ios",     label: "Notification (1x)" },
  { size: 40,   name: "icon-40.png",    platform: "ios",     label: "Notification (2x)" },
  { size: 60,   name: "icon-60.png",    platform: "ios",     label: "Notification (3x)" },
  { size: 29,   name: "icon-29.png",    platform: "ios",     label: "Settings (1x)" },
  { size: 58,   name: "icon-58.png",    platform: "ios",     label: "Settings (2x)" },
  { size: 87,   name: "icon-87.png",    platform: "ios",     label: "Settings (3x)" },
  { size: 76,   name: "icon-76.png",    platform: "ios",     label: "iPad (1x)" },
  { size: 152,  name: "icon-152.png",   platform: "ios",     label: "iPad (2x)" },
  { size: 167,  name: "icon-167.png",   platform: "ios",     label: "iPad Pro (2x)" },
  { size: 120,  name: "icon-120.png",   platform: "ios",     label: "iPhone (2x)" },
  { size: 180,  name: "icon-180.png",   platform: "ios",     label: "iPhone (3x)" },
  { size: 1024, name: "icon-1024.png",  platform: "ios",     label: "App Store" },
  // Android
  { size: 36,   name: "mipmap-ldpi.png",    platform: "android", label: "ldpi (36×36)" },
  { size: 48,   name: "mipmap-mdpi.png",    platform: "android", label: "mdpi (48×48)" },
  { size: 72,   name: "mipmap-hdpi.png",    platform: "android", label: "hdpi (72×72)" },
  { size: 96,   name: "mipmap-xhdpi.png",   platform: "android", label: "xhdpi (96×96)" },
  { size: 144,  name: "mipmap-xxhdpi.png",  platform: "android", label: "xxhdpi (144×144)" },
  { size: 192,  name: "mipmap-xxxhdpi.png", platform: "android", label: "xxxhdpi (192×192)" },
  { size: 512,  name: "play-store.png",     platform: "android", label: "Play Store (512×512)" },
];

export async function resizeToBlob(
  src: string,
  size: number,
  rounded = false
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d")!;
      if (rounded) {
        const r = size * 0.225; // iOS-style corner radius ~22.5%
        ctx.beginPath();
        ctx.moveTo(r, 0);
        ctx.lineTo(size - r, 0);
        ctx.quadraticCurveTo(size, 0, size, r);
        ctx.lineTo(size, size - r);
        ctx.quadraticCurveTo(size, size, size - r, size);
        ctx.lineTo(r, size);
        ctx.quadraticCurveTo(0, size, 0, size - r);
        ctx.lineTo(0, r);
        ctx.quadraticCurveTo(0, 0, r, 0);
        ctx.closePath();
        ctx.clip();
      }
      ctx.drawImage(img, 0, 0, size, size);
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("toBlob failed"));
      }, "image/png");
    };
    img.onerror = reject;
    img.src = src;
  });
}
