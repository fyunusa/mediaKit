"use client";

import { useState, useRef, useCallback } from "react";
import JSZip from "jszip";
import { PWA_ICON_SIZES, generatePWAIcon, generateManifest } from "@/lib/pwa-assets";

export default function PWAAssetGenerator() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [appName, setAppName] = useState("My App");
  const [shortName, setShortName] = useState("App");
  const [themeColor, setThemeColor] = useState("#6366f1");
  const [startUrl, setStartUrl] = useState("/");
  const [display, setDisplay] = useState("standalone");
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [manifestPreview, setManifestPreview] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    setImageSrc(URL.createObjectURL(file));
  }, []);

  const updateManifest = () => {
    setManifestPreview(generateManifest({ name: appName, shortName, themeColor, bgColor, startUrl, display }));
  };

  const downloadZip = async () => {
    if (!imageSrc) return;
    setGenerating(true);
    setProgress(0);
    const zip = new JSZip();
    const total = PWA_ICON_SIZES.length;

    for (let i = 0; i < total; i++) {
      const { size, name, maskable } = PWA_ICON_SIZES[i];
      const blob = await generatePWAIcon(imageSrc, size, maskable, bgColor);
      zip.file(name, blob);
      setProgress(Math.round(((i + 1) / total) * 100));
    }

    const manifest = generateManifest({ name: appName, shortName, themeColor, bgColor, startUrl, display });
    zip.file("manifest.json", manifest);

    const content = await zip.generateAsync({ type: "blob" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(content);
    a.download = "pwa-assets.zip";
    a.click();
    setGenerating(false);
    setProgress(0);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-2">⚙️ PWA Asset Generator</h1>
      <p className="text-gray-400 mb-8">
        Generate all PWA icons (regular + maskable) and a ready-to-use <code className="text-sky-400">manifest.json</code> in one click.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Icon upload */}
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">App Icon</label>
            <div
              onClick={() => inputRef.current?.click()}
              onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center cursor-pointer hover:border-sky-500 hover:bg-sky-500/5 transition-colors"
            >
              <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
              {imageSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imageSrc} alt="Icon" className="mx-auto h-20 w-20 object-cover mb-2 rounded-2xl ring-2 ring-gray-700" />
              ) : (
                <div className="text-4xl mb-2">📤</div>
              )}
              <p className="text-xs text-gray-500">{imageSrc ? "Click to replace" : "Drop a square icon (1024×1024 recommended)"}</p>
            </div>
          </div>

          {/* Maskable background */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Maskable icon background</label>
            <div className="flex items-center gap-3">
              <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)}
                className="w-12 h-10 rounded-lg border border-gray-700 bg-gray-900 cursor-pointer p-1" />
              <input type="text" value={bgColor} onChange={(e) => setBgColor(e.target.value)}
                className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-sky-500" />
            </div>
          </div>

          {/* Maskable preview */}
          {imageSrc && (
            <div className="flex gap-4 items-center">
              <div>
                <p className="text-xs text-gray-500 mb-1.5">Regular</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageSrc} alt="regular" className="w-16 h-16 rounded-xl object-cover ring-1 ring-gray-700" />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1.5">Maskable (safe zone)</p>
                <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center" style={{ backgroundColor: bgColor }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imageSrc} alt="maskable" className="w-[80%] h-[80%] object-contain" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Manifest fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1.5">App Name</label>
            <input value={appName} onChange={(e) => setAppName(e.target.value)} onBlur={updateManifest}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-sky-500" />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1.5">Short Name (≤12 chars)</label>
            <input value={shortName} maxLength={12} onChange={(e) => setShortName(e.target.value)} onBlur={updateManifest}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-sky-500" />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1.5">Theme Color</label>
            <div className="flex items-center gap-3">
              <input type="color" value={themeColor} onChange={(e) => setThemeColor(e.target.value)} onBlur={updateManifest}
                className="w-12 h-10 rounded-lg border border-gray-700 bg-gray-900 cursor-pointer p-1" />
              <input type="text" value={themeColor} onChange={(e) => setThemeColor(e.target.value)} onBlur={updateManifest}
                className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-sky-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1.5">Start URL</label>
            <input value={startUrl} onChange={(e) => setStartUrl(e.target.value)} onBlur={updateManifest}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-sky-500" />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1.5">Display mode</label>
            <select value={display} onChange={(e) => { setDisplay(e.target.value); updateManifest(); }}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-sky-500">
              <option value="standalone">standalone</option>
              <option value="fullscreen">fullscreen</option>
              <option value="minimal-ui">minimal-ui</option>
              <option value="browser">browser</option>
            </select>
          </div>
        </div>
      </div>

      {/* Manifest preview */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-gray-400 font-medium">manifest.json preview</p>
          <button
            onClick={() => { updateManifest(); }}
            className="text-xs text-sky-400 hover:text-sky-300 transition-colors"
          >
            Refresh
          </button>
        </div>
        <pre className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-xs text-green-400 overflow-x-auto font-mono max-h-64 overflow-y-auto">
          {manifestPreview || generateManifest({ name: appName, shortName, themeColor, bgColor, startUrl, display })}
        </pre>
      </div>

      {/* Icons list */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-6">
        <p className="text-sm text-gray-400 mb-3 font-medium">{PWA_ICON_SIZES.length} icons will be generated:</p>
        <div className="flex flex-wrap gap-2">
          {PWA_ICON_SIZES.map((s) => (
            <span key={s.name} className={`text-xs border rounded-full px-2.5 py-0.5 ${s.maskable ? "bg-purple-900/30 border-purple-700 text-purple-300" : "bg-gray-800 border-gray-700 text-gray-400"}`}>
              {s.maskable ? "✦ " : ""}{s.size}×{s.size}
            </span>
          ))}
        </div>
        <p className="text-xs text-purple-400 mt-2">✦ = maskable (with safe zone background)</p>
      </div>

      <button
        onClick={downloadZip}
        disabled={!imageSrc || generating}
        className="w-full bg-sky-600 hover:bg-sky-500 disabled:opacity-40 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors"
      >
        {generating ? `Generating… ${progress}%` : "Download all icons + manifest.json as .zip"}
      </button>
    </div>
  );
}
