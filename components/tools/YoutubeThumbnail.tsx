"use client";

import { useState, useRef, useCallback } from "react";
import JSZip from "jszip";
import { extractVideoId, THUMBNAIL_QUALITIES, getThumbnailUrl } from "@/lib/youtube";

type Mode = "youtube" | "local";

interface CapturedFrame {
  id: string;
  timestamp: number;
  dataUrl: string;
  label: string;
}

function fmtTime(s: number) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = (s % 60).toFixed(2).padStart(5, "0");
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${sec}` : `${m}:${sec}`;
}

// ─── YouTube section ─────────────────────────────────────────────────────────

function YouTubeSection() {
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
        } catch { /* skip unavailable */ }
      }
    }
    const content = await zip.generateAsync({ type: "blob" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(content);
    a.download = `thumbnails-${videoId}.zip`;
    a.click();
  };

  return (
    <div>
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
                <div key={key} className="flex items-center gap-4 bg-gray-900 border border-gray-800 rounded-xl p-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={thumbUrl}
                    alt={label}
                    className={`rounded-lg object-cover flex-shrink-0 ${isAvail === false ? "hidden" : ""}`}
                    style={{ width: 160, height: 90 }}
                    onLoad={() => setAvailable((p) => ({ ...p, [key]: true }))}
                    onError={() => setAvailable((p) => ({ ...p, [key]: false }))}
                    crossOrigin="anonymous"
                  />
                  {isAvail === false && (
                    <div className="rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0 text-gray-600 text-xs" style={{ width: 160, height: 90 }}>
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

// ─── Local Video section ──────────────────────────────────────────────────────

function LocalVideoSection() {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [frames, setFrames] = useState<CapturedFrame[]>([]);
  const [autoCount, setAutoCount] = useState(6);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("video/")) {
      alert("Please upload a video file (MP4, WebM, MOV, etc.)");
      return;
    }
    setVideoSrc(URL.createObjectURL(file));
    setFileName(file.name.replace(/\.[^.]+$/, ""));
    setFrames([]);
    setCurrentTime(0);
  }, []);

  const captureFrame = useCallback((time?: number): CapturedFrame | null => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return null;

    const t = time ?? video.currentTime;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/png");
    return {
      id: `${Date.now()}-${Math.random()}`,
      timestamp: t,
      dataUrl,
      label: `frame-${fmtTime(t).replace(/:/g, "-").replace(".", "s")}.png`,
    };
  }, []);

  const handleCapture = () => {
    const frame = captureFrame();
    if (frame) setFrames((prev) => [...prev, frame]);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const t = Number(e.target.value);
    setCurrentTime(t);
    if (videoRef.current) videoRef.current.currentTime = t;
  };

  // Capture N frames spread evenly across the video
  const captureAuto = async () => {
    const video = videoRef.current;
    if (!video || duration === 0) return;
    const captured: CapturedFrame[] = [];

    for (let i = 0; i < autoCount; i++) {
      const t = (duration / autoCount) * i + duration / autoCount / 2;
      await new Promise<void>((resolve) => {
        const onSeeked = () => {
          video.removeEventListener("seeked", onSeeked);
          resolve();
        };
        video.addEventListener("seeked", onSeeked);
        video.currentTime = t;
      });
      const frame = captureFrame(t);
      if (frame) captured.push(frame);
    }
    setFrames((prev) => [...prev, ...captured]);
  };

  const downloadFrame = (frame: CapturedFrame) => {
    const a = document.createElement("a");
    a.href = frame.dataUrl;
    a.download = `${fileName}-${frame.label}`;
    a.click();
  };

  const downloadAllFrames = async () => {
    if (frames.length === 0) return;
    const zip = new JSZip();
    frames.forEach((f) => {
      const base64 = f.dataUrl.split(",")[1];
      zip.file(`${fileName}-${f.label}`, base64, { base64: true });
    });
    const content = await zip.generateAsync({ type: "blob" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(content);
    a.download = `${fileName}-frames.zip`;
    a.click();
  };

  const removeFrame = (id: string) => setFrames((prev) => prev.filter((f) => f.id !== id));

  return (
    <div>
      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-gray-700 rounded-2xl p-10 text-center cursor-pointer hover:border-sky-500 hover:bg-sky-500/5 transition-colors mb-8"
      >
        <input ref={inputRef} type="file" accept="video/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        <div className="text-4xl mb-3">🎬</div>
        <p className="text-gray-400 text-sm">{videoSrc ? fileName || "Video loaded" : "Drop a video file, or click to browse"}</p>
        <p className="text-gray-600 text-xs mt-1">MP4, WebM, MOV, AVI, MKV supported</p>
      </div>

      {/* Hidden canvas for frame capture */}
      <canvas ref={canvasRef} className="hidden" />

      {videoSrc && (
        <div className="space-y-6">
          {/* Video player */}
          <video
            ref={videoRef}
            src={videoSrc}
            className="w-full rounded-xl border border-gray-800 bg-black"
            onLoadedMetadata={() => {
              const v = videoRef.current!;
              setDuration(v.duration);
              setCurrentTime(0);
            }}
            onTimeUpdate={() => {
              if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
            }}
            controls
          />

          {/* Seek + capture */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
            <div>
              <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                <span>{fmtTime(currentTime)}</span>
                <span>{fmtTime(duration)}</span>
              </div>
              <input
                type="range"
                min={0}
                max={duration}
                step={1 / 30}
                value={currentTime}
                onChange={handleSeek}
                className="w-full accent-sky-500"
              />
            </div>

            <div className="flex flex-wrap gap-3 items-center">
              <button
                onClick={handleCapture}
                className="bg-sky-600 hover:bg-sky-500 text-white px-5 py-2.5 rounded-lg font-medium transition-colors text-sm"
              >
                📸 Capture current frame
              </button>

              <div className="flex items-center gap-2 ml-auto">
                <label className="text-sm text-gray-400">Auto-capture</label>
                <select
                  value={autoCount}
                  onChange={(e) => setAutoCount(Number(e.target.value))}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-2 text-white text-sm focus:outline-none focus:border-sky-500"
                >
                  {[3, 5, 6, 9, 12].map((n) => <option key={n} value={n}>{n} frames</option>)}
                </select>
                <button
                  onClick={captureAuto}
                  className="bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  Spread evenly
                </button>
              </div>
            </div>
          </div>

          {/* Captured frames */}
          {frames.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-gray-300">{frames.length} frame{frames.length !== 1 ? "s" : ""} captured</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFrames([])}
                    className="text-xs text-gray-500 hover:text-red-400 transition-colors"
                  >
                    Clear all
                  </button>
                  <button
                    onClick={downloadAllFrames}
                    className="text-sm bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Download all as .zip
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {frames.map((frame) => (
                  <div key={frame.id} className="relative group rounded-xl overflow-hidden border border-gray-800 bg-gray-900">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={frame.dataUrl} alt={frame.label} className="w-full aspect-video object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={() => downloadFrame(frame)}
                        className="bg-sky-600 hover:bg-sky-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium"
                      >
                        Download
                      </button>
                      <button
                        onClick={() => removeFrame(frame.id)}
                        className="bg-gray-700 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs"
                      >
                        ✕
                      </button>
                    </div>
                    <p className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs px-2 py-1 truncate">
                      {fmtTime(frame.timestamp)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function YoutubeThumbnail() {
  const [mode, setMode] = useState<Mode>("youtube");

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-2">🎬 Thumbnail Extractor</h1>
      <p className="text-gray-400 mb-6">Extract thumbnails from YouTube URLs or capture frames from any local video.</p>

      {/* Mode switcher */}
      <div className="flex gap-1 bg-gray-900 border border-gray-800 rounded-xl p-1 w-fit mb-8">
        <button
          onClick={() => setMode("youtube")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === "youtube" ? "bg-sky-600 text-white" : "text-gray-400 hover:text-white"
          }`}
        >
          YouTube URL
        </button>
        <button
          onClick={() => setMode("local")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === "local" ? "bg-sky-600 text-white" : "text-gray-400 hover:text-white"
          }`}
        >
          Local Video File
        </button>
      </div>

      {mode === "youtube" ? <YouTubeSection /> : <LocalVideoSection />}
    </div>
  );
}
