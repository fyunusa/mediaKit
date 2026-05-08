export interface SplashSize {
  width: number;
  height: number;
  name: string;
  label: string;
  platform: "ios" | "android";
}

export const SPLASH_SIZES: SplashSize[] = [
  // iOS – portrait (width × height)
  { width: 1290, height: 2796, name: "splash-1290x2796.png", label: 'iPhone 14 Pro Max (@3x)', platform: "ios" },
  { width: 1179, height: 2556, name: "splash-1179x2556.png", label: 'iPhone 14 Pro (@3x)', platform: "ios" },
  { width: 1242, height: 2688, name: "splash-1242x2688.png", label: 'iPhone XS Max (@3x)', platform: "ios" },
  { width: 1125, height: 2436, name: "splash-1125x2436.png", label: 'iPhone X/XS (@3x)', platform: "ios" },
  { width: 828,  height: 1792, name: "splash-828x1792.png",  label: 'iPhone XR (@2x)', platform: "ios" },
  { width: 750,  height: 1334, name: "splash-750x1334.png",  label: 'iPhone 8 (@2x)', platform: "ios" },
  { width: 1242, height: 2208, name: "splash-1242x2208.png", label: 'iPhone 8 Plus (@3x)', platform: "ios" },
  { width: 1536, height: 2048, name: "splash-1536x2048.png", label: 'iPad Air/Mini (@2x)', platform: "ios" },
  { width: 2048, height: 2732, name: "splash-2048x2732.png", label: 'iPad Pro 12.9 (@2x)', platform: "ios" },
  // Android
  { width: 320,  height: 480,  name: "splash-ldpi.png",    label: 'ldpi (320×480)', platform: "android" },
  { width: 480,  height: 800,  name: "splash-mdpi.png",    label: 'mdpi (480×800)', platform: "android" },
  { width: 720,  height: 1280, name: "splash-hdpi.png",    label: 'hdpi (720×1280)', platform: "android" },
  { width: 960,  height: 1600, name: "splash-xhdpi.png",   label: 'xhdpi (960×1600)', platform: "android" },
  { width: 1280, height: 1920, name: "splash-xxhdpi.png",  label: 'xxhdpi (1280×1920)', platform: "android" },
  { width: 1440, height: 2560, name: "splash-xxxhdpi.png", label: 'xxxhdpi (1440×2560)', platform: "android" },
];

export async function generateSplash(
  logoSrc: string | null,
  bgColor: string,
  width: number,
  height: number,
  logoScale = 0.3
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d")!;

    // Background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    const draw = () => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("toBlob failed"));
      }, "image/png");
    };

    if (!logoSrc) {
      draw();
      return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const logoW = Math.round(Math.min(width, height) * logoScale);
      const logoH = Math.round((img.height / img.width) * logoW);
      const x = Math.round((width - logoW) / 2);
      const y = Math.round((height - logoH) / 2);
      ctx.drawImage(img, x, y, logoW, logoH);
      draw();
    };
    img.onerror = reject;
    img.src = logoSrc;
  });
}
