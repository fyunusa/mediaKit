export type OGTheme = "dark-pro" | "light-clean" | "gradient-dusk" | "terminal" | "magazine";

export interface OGOptions {
  title: string;
  subtitle: string;
  author: string;
  theme: OGTheme;
}

export function drawOGImage(canvas: HTMLCanvasElement, options: OGOptions) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  canvas.width = 1200;
  canvas.height = 630;

  const { title, subtitle, author, theme } = options;

  // Background
  if (theme === "dark-pro") {
    ctx.fillStyle = "#0f0f0f";
    ctx.fillRect(0, 0, 1200, 630);
    // subtle grid
    ctx.strokeStyle = "rgba(255,255,255,0.04)";
    ctx.lineWidth = 1;
    for (let x = 0; x < 1200; x += 60) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 630); ctx.stroke();
    }
    for (let y = 0; y < 630; y += 60) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(1200, y); ctx.stroke();
    }
    // accent bar
    ctx.fillStyle = "#00ffcc";
    ctx.fillRect(60, 200, 6, 200);
  } else if (theme === "light-clean") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 1200, 630);
    ctx.fillStyle = "#2563eb";
    ctx.fillRect(0, 0, 1200, 8);
  } else if (theme === "gradient-dusk") {
    const grad = ctx.createLinearGradient(0, 0, 1200, 630);
    grad.addColorStop(0, "#4c1d95");
    grad.addColorStop(0.5, "#831843");
    grad.addColorStop(1, "#1e1b4b");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1200, 630);
    // mesh blobs
    const radGrad = ctx.createRadialGradient(300, 200, 0, 300, 200, 400);
    radGrad.addColorStop(0, "rgba(251,191,36,0.15)");
    radGrad.addColorStop(1, "transparent");
    ctx.fillStyle = radGrad;
    ctx.fillRect(0, 0, 1200, 630);
  } else if (theme === "terminal") {
    ctx.fillStyle = "#0d1117";
    ctx.fillRect(0, 0, 1200, 630);
    // scanlines
    for (let y = 0; y < 630; y += 4) {
      ctx.fillStyle = "rgba(0,0,0,0.15)";
      ctx.fillRect(0, y, 1200, 2);
    }
    // glow line
    ctx.fillStyle = "#39ff14";
    ctx.fillRect(60, 560, 80, 3);
  } else if (theme === "magazine") {
    ctx.fillStyle = "#f5f0e8";
    ctx.fillRect(0, 0, 1200, 630);
    ctx.fillStyle = "#dc2626";
    ctx.fillRect(0, 0, 1200, 12);
    ctx.fillRect(0, 618, 1200, 12);
  }

  // Title text
  const titleColor =
    theme === "light-clean"
      ? "#111827"
      : theme === "magazine"
      ? "#111827"
      : theme === "terminal"
      ? "#39ff14"
      : theme === "dark-pro"
      ? "#ffffff"
      : "#ffffff";

  const accentColor =
    theme === "dark-pro"
      ? "#00ffcc"
      : theme === "light-clean"
      ? "#2563eb"
      : theme === "gradient-dusk"
      ? "#fbbf24"
      : theme === "terminal"
      ? "#39ff14"
      : "#dc2626";

  ctx.fillStyle = titleColor;
  ctx.font = `bold 72px ${theme === "magazine" ? "Georgia, serif" : theme === "terminal" ? "monospace" : "Arial, sans-serif"}`;
  ctx.textBaseline = "top";

  // Word-wrap title
  const maxWidth = 1000;
  const words = (title || "Your Title Here").split(" ");
  let line = "";
  let y = 180;
  for (const word of words) {
    const test = line + word + " ";
    if (ctx.measureText(test).width > maxWidth && line !== "") {
      ctx.fillText(line.trim(), 100, y);
      line = word + " ";
      y += 90;
    } else {
      line = test;
    }
  }
  ctx.fillText(line.trim(), 100, y);
  y += 100;

  // Subtitle — word-wrapped
  if (subtitle) {
    ctx.fillStyle = theme === "light-clean" || theme === "magazine" ? "#6b7280" : "rgba(255,255,255,0.65)";
    ctx.font = `32px ${theme === "magazine" ? "Georgia, serif" : "Arial, sans-serif"}`;
    const subWords = subtitle.split(" ");
    let subLine = "";
    const subMaxWidth = 1000;
    const subLineHeight = 44;
    for (const word of subWords) {
      const test = subLine + word + " ";
      if (ctx.measureText(test).width > subMaxWidth && subLine !== "") {
        if (y + subLineHeight > 560) break; // stop before overflowing into author area
        ctx.fillText(subLine.trim(), 100, y);
        subLine = word + " ";
        y += subLineHeight;
      } else {
        subLine = test;
      }
    }
    if (y + subLineHeight <= 560) ctx.fillText(subLine.trim(), 100, y);
    y += subLineHeight;
  }

  // Author / site name
  if (author) {
    ctx.fillStyle = accentColor;
    ctx.font = "bold 24px Arial, sans-serif";
    ctx.fillText(author, 100, 570);
  }
}
