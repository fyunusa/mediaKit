"use client";

import { useState } from "react";
import JSZip from "jszip";
import { extractVideoId, THUMBNAIL_QUALITIES, getThumbnailUrl } from "@/lib/youtube";

export default function YoutubeThumbnail() {
  const [url, setUrl] = useState("");
  const [videoId, setVideoId] = useState<string | null>(null);
  const [available, setAvailable] = useState<Record<string, boolean>>({});

  const handleExtract = () => {
    const id = extractVideoId(url.trim());
    if (!id) {
      alert("Could not extract a video ID from that URL. Please try again.");
      return;
    }
    setVideoId(id);
    setAvailable({});
  };

  const handleImageLoad = (key: string) => {
    setAvailable((prev) => ({ ...prev, [key]: true }));
  };

  const handleImageError = (key: string) => {
    setAvailable((prev) => ({ ...prev, [key]: false }));
  };

  const downloadSingle = async (key: string) => {
    if (!videoId) return;
    const thumbUrl = getThumbnailUrl(videoId, key);
    const res = await fetch(thumbUrl);
    const blob = await res.blob();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `thumbnail-${key}.jpg`;
    a.click();
  };

  const downloadAll = async () => {
    if (!videoId) return;
    const zip = new JSZip();
    for (const { key } of THUMBNAIL_QUALITIES) {
      if (available[key] !== false) {
        try {
          const res = await fetch(getThumbnailUrl(videoId, key));
          if (res.ok) zip.file(`thumbnail-${key}.jpg`, await res.blob());
        } catch {
          // skip unavailable
        }
      }
    }
    const content = await zip.generateAsync({ type: "blob" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(content);
    a.download = `thumbnails-${videoId}.zip`;
    a.click();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-2">🎬 YouTube Thumbnail Extractor</h1>
      <p className="text-gray-400 mb-8">Paste any YouTube URL → download all thumbnail sizes. No API key needed.</p>

      <div className="flex gap-3 mb-8">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleExtract()}
          placeholder="https://youtu.be/dQw4w9WgXcQ or https://www.youtube.com/watch?v=..."
          className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-sky-500 text-sm"
        />
        <button
          onClick={handleExtract}
          className="bg-sky-600 hover:bg-sky-500 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shrink-0"
        >
          Extract
        </button>
      </div>

      {videoId && (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">
              Video ID: <span className="text-gray-300 font-mono">{videoId}</span>
            </p>
            <button
              onClick={downloadAll}
              className="text-sm bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Download all as .zip
            </button>
          </div>

          <div className="space-y-4">
            {THUMBNAIL_QUALITIES.map(({ key, label, resolution }) => {
              const thumbUrl = getThumbnailUrl(videoId, key);
              const isAvail = available[key];
              return (
                <div
                  key={key}
                  className="flex items-center gap-4 bg-gray-900 border border-gray-800 rounded-xl p-4"
                >
                  {/* Hidden img to detect availability */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={thumbUrl}
                    alt={label}
                    className={`rounded-lg object-cover flex-shrink-0 ${isAvail === false ? "hidden" : ""}`}
                    style={{ width: 160, height: 90 }}
                    onLoad={() => handleImageLoad(key)}
                    onError={() => handleImageError(key)}
                    crossOrigin="anonymous"
                  />
                  {isAvail === false && (
                    <div
                      className="rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0 text-gray-600 text-xs"
                      style={{ width: 160, height: 90 }}
                    >
                      Not available
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white text-sm">{label}</p>
                    <p className="text-gray-500 text-xs">{resolution}</p>
                  </div>
                  <button
                    onClick={() => downloadSingle(key)}
                    disabled={isAvail === false}
                    className="text-sm bg-sky-600 hover:bg-sky-500 disabled:opacity-40 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors shrink-0"
                  >
                    Download
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
