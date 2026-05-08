"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import JSZip from "jszip";
import { SPLASH_SIZES, generateSplash } from "@/lib/splash";

type Platform = "all" | "ios" | "android";

export default function SplashScreenGenerator() {
  const [logoSrc, setLogoSrc] = useState<string | null>(null);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [logoScale, setLogoScale] = useState(30);
  const [platform, setPlatform] = useState<Platform>("all");
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredSizes = SPLASH_SIZES.filter(
    (s) => platform === "all" || s.platform === platform
  );

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    setLogoSrc(URL.createObjectURL(file));
  }, []);

  // Update preview whenever settings change (use first size as preview)
  useEffect(() => {
    let cancelled = false;
    const preview = SPLASH_SIZES[0];
    generateSplash(logoSrc, bgColor, preview.width, preview.height, logoScale / 100)
      .then((blob) => {
        if (!cancelled) setPreviewUrl(URL.createObjectURL(blob));
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [logoSrc, bgColor, logoScale]);

  const downloadZip = async () => {
    setGenerating(true);
    setProgress(0);
    const zip = new JSZip();
    const total = filteredSizes.length;

    for (let i = 0; i < total; i++) {
      const { width, height, name } = filteredSizes[i];
      const blob = await generateSplash(logoSrc, bgColor, width, height, logoScale / 100);
      zip.file(name, blob);
      setProgress(Math.round(((i + 1) / total) * 100));
    }

    const content = await zip.generateAsync({ type: "blob" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(content);
    a.download = `splash-screens-${platform}.zip`;
    a.click();
    setGenerating(false);
    setProgress(0);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-2">🌅 Splash Screen Generator</h1>
      <p className="text-gray-400 mb-8">
        Set a background color, upload an optional logo → generate every splash screen density as a .zip.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Controls */}
        <div className="space-y-5">
          {/* Logo upload */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Logo / Icon (optional)</label>
            <div
              onClick={() => inputRef.current?.click()}
              onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center cursor-pointer hover:border-sky-500 hover:bg-sky-500/5 transition-colors"
            >
              <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
              {logoSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoSrc} alt="Logo" className="mx-auto h-16 w-16 object-contain mb-2 rounded" />
              ) : (
                <div className="text-3xl mb-2">📤</div>
              )}
              <p className="text-xs text-gray-500">{logoSrc ? "Click to replace logo" : "Drop logo here (PNG with transparency recommended)"}</p>
            </div>
          </div>

          {/* Background color */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Background Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-12 h-10 rounded-lg border border-gray-700 bg-gray-900 cursor-pointer p-1"
              />
              <input
                type="text"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-sky-500"
              />
            </div>
            <div className="flex gap-2 mt-2 flex-wrap">
              {["#ffffff", "#000000", "#1e293b", "#0f172a", "#f8fafc", "#6366f1"].map((c) => (
                <button
                  key={c}
                  onClick={() => setBgColor(c)}
                  className="w-7 h-7 rounded-full border-2 border-gray-700 hover:border-sky-500 transition-colors"
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
            </div>
          </div>

          {/* Logo scale */}
          {logoSrc && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Logo size: <span className="text-sky-400">{logoScale}%</span> of screen short side
              </label>
              <input
                type="range"
                min={10}
                max={80}
                value={logoScale}
                onChange={(e) => setLogoScale(Number(e.target.value))}
                className="w-full accent-sky-500"
              />
            </div>
          )}

          {/* Platform filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Platform</label>
            <div className="flex gap-2">
              {(["all", "ios", "android"] as Platform[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPlatform(p)}
                  className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                    platform === p
                      ? "bg-sky-600 border-sky-500 text-white"
                      : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500"
                  }`}
                >
                  {p === "all" ? "iOS + Android" : p === "ios" ? "iOS" : "Android"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Preview */}
        <div>
          <p className="text-xs text-gray-500 mb-2">Preview (iPhone 14 Pro Max proportion)</p>
          <div
            className="rounded-2xl overflow-hidden border border-gray-800 flex items-center justify-center"
            style={{ aspectRatio: "9/19.5", background: bgColor, maxHeight: 480 }}
          >
            {logoSrc && previewUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoSrc}
                alt="Logo preview"
                className="object-contain"
                style={{ width: `${logoScale}%`, height: `${logoScale}%` }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Sizes list */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-6">
        <p className="text-sm text-gray-400 mb-3 font-medium">{filteredSizes.length} sizes will be generated:</p>
        <div className="flex flex-wrap gap-2">
          {filteredSizes.map((s) => (
            <span key={s.name} className="text-xs bg-gray-800 border border-gray-700 text-gray-400 rounded-full px-2.5 py-0.5">
              {s.width}×{s.height}
            </span>
          ))}
        </div>
      </div>

      <button
        onClick={downloadZip}
        disabled={generating}
        className="w-full bg-sky-600 hover:bg-sky-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors"
      >
        {generating ? `Generating… ${progress}%` : `Download ${filteredSizes.length} splash screens as .zip`}
      </button>
    </div>
  );
}
