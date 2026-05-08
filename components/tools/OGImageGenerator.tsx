"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { drawOGImage, type OGTheme } from "@/lib/og-canvas";

const THEMES: { id: OGTheme; label: string }[] = [
  { id: "dark-pro", label: "Dark Pro" },
  { id: "light-clean", label: "Light Clean" },
  { id: "gradient-dusk", label: "Gradient Dusk" },
  { id: "terminal", label: "Terminal" },
  { id: "magazine", label: "Magazine" },
];

export default function OGImageGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [title, setTitle] = useState("Your Awesome Page Title");
  const [subtitle, setSubtitle] = useState("A brief description that tells visitors what to expect");
  const [author, setAuthor] = useState("mysite.com");
  const [theme, setTheme] = useState<OGTheme>("dark-pro");

  const redraw = useCallback(() => {
    if (canvasRef.current) {
      drawOGImage(canvasRef.current, { title, subtitle, author, theme });
    }
  }, [title, subtitle, author, theme]);

  useEffect(() => {
    const timer = setTimeout(redraw, 150);
    return () => clearTimeout(timer);
  }, [redraw]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "og-image.png";
    a.click();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-2">📸 OG Image Generator</h1>
      <p className="text-gray-400 mb-8">Create a perfect 1200×630 Open Graph image — live preview, no uploads.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Controls */}
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Your page title"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-sky-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Subtitle</label>
            <input
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Brief description"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-sky-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Author / Site name</label>
            <input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="mysite.com"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-sky-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Theme</label>
            <div className="flex flex-wrap gap-2">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                    theme === t.id
                      ? "bg-sky-600 border-sky-500 text-white"
                      : "bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-500"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={download}
            className="w-full bg-sky-600 hover:bg-sky-500 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Download og-image.png
          </button>
        </div>

        {/* Canvas preview */}
        <div>
          <p className="text-xs text-gray-500 mb-2">Preview (scaled down)</p>
          <div className="rounded-xl overflow-hidden border border-gray-800 bg-gray-900">
            <canvas
              ref={canvasRef}
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </div>
          <p className="text-xs text-gray-600 mt-2 text-right">Output: 1200 × 630 px</p>
        </div>
      </div>
    </div>
  );
}
