"use client";

import { useState, useRef, useCallback } from "react";
import JSZip from "jszip";
import { APP_ICON_SIZES, resizeToBlob } from "@/lib/app-icons";

type Platform = "all" | "ios" | "android";

export default function AppIconGenerator() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [platform, setPlatform] = useState<Platform>("all");
  const [rounded, setRounded] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    setImageSrc(URL.createObjectURL(file));
  }, []);

  const filteredSizes = APP_ICON_SIZES.filter(
    (s) => platform === "all" || s.platform === platform
  );

  const downloadZip = async () => {
    if (!imageSrc) return;
    setGenerating(true);
    setProgress(0);
    const zip = new JSZip();
    const total = filteredSizes.length;

    for (let i = 0; i < total; i++) {
      const { size, name } = filteredSizes[i];
      const blob = await resizeToBlob(imageSrc, size, rounded && filteredSizes[i].platform === "ios");
      zip.file(name, blob);
      setProgress(Math.round(((i + 1) / total) * 100));
    }

    const content = await zip.generateAsync({ type: "blob" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(content);
    a.download = `app-icons-${platform}.zip`;
    a.click();
    setGenerating(false);
    setProgress(0);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-2">📱 App Icon Generator</h1>
      <p className="text-gray-400 mb-8">
        Upload one image → generate every iOS and Android icon size as a .zip.
      </p>

      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-gray-700 rounded-2xl p-12 text-center cursor-pointer hover:border-sky-500 hover:bg-sky-500/5 transition-colors mb-8"
      >
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        {imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageSrc} alt="Uploaded" className="mx-auto h-24 w-24 object-cover rounded-2xl mb-3 ring-2 ring-gray-700" />
        ) : (
          <div className="text-5xl mb-3">📤</div>
        )}
        <p className="text-gray-400 text-sm">{imageSrc ? "Click or drop to replace" : "Drop image here, or click to browse"}</p>
        <p className="text-gray-600 text-xs mt-1">PNG, JPG, SVG, WebP — use a square image for best results</p>
      </div>

      {/* Options */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-6 flex flex-wrap gap-6 items-center">
        <div>
          <p className="text-sm text-gray-400 mb-2">Platform</p>
          <div className="flex gap-2">
            {(["all", "ios", "android"] as Platform[]).map((p) => (
              <button
                key={p}
                onClick={() => setPlatform(p)}
                className={`px-3 py-1.5 rounded-lg text-sm border transition-colors capitalize ${
                  platform === p
                    ? "bg-sky-600 border-sky-500 text-white"
                    : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500"
                }`}
              >
                {p === "all" ? "iOS + Android" : p === "ios" ? "iOS only" : "Android only"}
              </button>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-3 cursor-pointer select-none">
          <div
            onClick={() => setRounded(!rounded)}
            className={`relative w-10 h-6 rounded-full transition-colors ${rounded ? "bg-sky-600" : "bg-gray-700"}`}
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${rounded ? "translate-x-5" : "translate-x-1"}`} />
          </div>
          <span className="text-sm text-gray-300">Round iOS corners</span>
        </label>
      </div>

      {/* Size table */}
      {imageSrc && (
        <div className="mb-6 overflow-hidden rounded-xl border border-gray-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-900 border-b border-gray-800">
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Preview</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">File</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Size</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Purpose</th>
              </tr>
            </thead>
            <tbody>
              {filteredSizes.map(({ size, name, label, platform: p }) => (
                <tr key={name} className="border-b border-gray-800/50 last:border-0 hover:bg-gray-900/50">
                  <td className="px-4 py-2.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imageSrc}
                      alt={name}
                      className={`object-cover bg-gray-800 ${rounded && p === "ios" ? "rounded-[22%]" : "rounded"}`}
                      style={{ width: Math.min(size, 40), height: Math.min(size, 40) }}
                    />
                  </td>
                  <td className="px-4 py-2.5 font-mono text-gray-300 text-xs">{name}</td>
                  <td className="px-4 py-2.5 text-gray-400">{size}×{size}</td>
                  <td className="px-4 py-2.5 text-gray-500 text-xs">{label}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button
        onClick={downloadZip}
        disabled={!imageSrc || generating}
        className="w-full bg-sky-600 hover:bg-sky-500 disabled:opacity-40 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors"
      >
        {generating ? `Generating… ${progress}%` : `Download ${filteredSizes.length} icons as .zip`}
      </button>
    </div>
  );
}
