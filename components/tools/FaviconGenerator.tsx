"use client";

import { useState, useRef, useCallback } from "react";
import JSZip from "jszip";
import { FAVICON_SIZES, resizeImageToBlob, WEBMANIFEST, HEAD_SNIPPET } from "@/lib/favicon";

export default function FaviconGenerator() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [previews, setPreviews] = useState<{ size: number; name: string; url: string }[]>([]);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const src = URL.createObjectURL(file);
    setImageSrc(src);
    setGenerating(true);
    setPreviews([]);

    const results: { size: number; name: string; url: string }[] = [];
    for (const { size, name } of FAVICON_SIZES) {
      const blob = await resizeImageToBlob(src, size);
      results.push({ size, name, url: URL.createObjectURL(blob) });
    }
    setPreviews(results);
    setGenerating(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const downloadZip = async () => {
    if (!imageSrc) return;
    setGenerating(true);
    const zip = new JSZip();

    for (const { size, name } of FAVICON_SIZES) {
      const blob = await resizeImageToBlob(imageSrc, size);
      zip.file(name, blob);
    }
    zip.file("site.webmanifest", WEBMANIFEST());
    zip.file("head-snippet.html", HEAD_SNIPPET);

    const content = await zip.generateAsync({ type: "blob" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(content);
    a.download = "favicons.zip";
    a.click();
    setGenerating(false);
  };

  const copySnippet = () => {
    navigator.clipboard.writeText(HEAD_SNIPPET);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-2">🖼️ Favicon Generator</h1>
      <p className="text-gray-400 mb-8">Upload any image → download all favicon sizes + manifest as a .zip</p>

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-gray-700 rounded-2xl p-12 text-center cursor-pointer hover:border-sky-500 hover:bg-sky-500/5 transition-colors"
      >
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleInputChange} />
        {imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageSrc} alt="Uploaded" className="mx-auto h-24 w-24 object-cover rounded-lg mb-3" />
        ) : (
          <div className="text-5xl mb-3">📤</div>
        )}
        <p className="text-gray-400 text-sm">
          {imageSrc ? "Click or drop to replace image" : "Drop an image here, or click to browse"}
        </p>
        <p className="text-gray-600 text-xs mt-1">PNG, JPG, SVG, WebP accepted</p>
      </div>

      {/* Previews */}
      {generating && (
        <div className="mt-8 text-center text-gray-400 animate-pulse">Generating previews…</div>
      )}

      {previews.length > 0 && (
        <>
          <div className="mt-8 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-4">
            {previews.map(({ size, name, url }) => (
              <div key={name} className="flex flex-col items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={name}
                  width={size > 64 ? 64 : size}
                  height={size > 64 ? 64 : size}
                  className="rounded border border-gray-700"
                  style={{ imageRendering: "pixelated" }}
                />
                <span className="text-xs text-gray-500">{size}×{size}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={downloadZip}
              disabled={generating}
              className="bg-sky-600 hover:bg-sky-500 text-white px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              Download .zip
            </button>
            <button
              onClick={copySnippet}
              className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors border border-gray-700"
            >
              {copied ? "✓ Copied!" : "Copy <head> snippet"}
            </button>
          </div>

          <pre className="mt-6 bg-gray-900 border border-gray-800 rounded-xl p-4 text-sm text-green-400 overflow-x-auto font-mono">
            {HEAD_SNIPPET}
          </pre>
        </>
      )}
    </div>
  );
}
