"use client";

import { useState, useRef, useEffect, useCallback } from "react";

export default function AudioTrimmer() {
  const [file, setFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);
  const [trimming, setTrimming] = useState(false);
  const [ffmpegReady, setFfmpegReady] = useState(false);
  const [loadingFFmpeg, setLoadingFFmpeg] = useState(false);
  const [ffmpegError, setFfmpegError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const ffmpegRef = useRef<import("@ffmpeg/ffmpeg").FFmpeg | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const initFFmpeg = useCallback(async () => {
    if (ffmpegReady || loadingFFmpeg) return;
    setLoadingFFmpeg(true);
    setFfmpegError(null);
    try {
      const { FFmpeg } = await import("@ffmpeg/ffmpeg");
      const { toBlobURL } = await import("@ffmpeg/util");
      const ffmpeg = new FFmpeg();
      const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
      });
      ffmpegRef.current = ffmpeg;
      setFfmpegReady(true);
    } catch (err) {
      setFfmpegError(
        "Failed to load FFmpeg WASM. This tool requires a browser with SharedArrayBuffer support (served with COOP/COEP headers). On Netlify this works automatically."
      );
      console.error(err);
    } finally {
      setLoadingFFmpeg(false);
    }
  }, [ffmpegReady, loadingFFmpeg]);

  const handleFile = useCallback(
    (f: File) => {
      setFile(f);
      const url = URL.createObjectURL(f);
      setAudioUrl(url);
      setStart(0);
      setEnd(0);
      initFFmpeg();
    },
    [initFFmpeg]
  );

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audioUrl) return;
    const onLoaded = () => {
      setDuration(audio.duration);
      setEnd(audio.duration);
    };
    audio.addEventListener("loadedmetadata", onLoaded);
    return () => audio.removeEventListener("loadedmetadata", onLoaded);
  }, [audioUrl]);

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = (s % 60).toFixed(1).padStart(4, "0");
    return `${m}:${sec}`;
  };

  const trimAndDownload = async () => {
    if (!file || !ffmpegRef.current) return;
    setTrimming(true);
    try {
      const { fetchFile } = await import("@ffmpeg/util");
      const ffmpeg = ffmpegRef.current;
      const ext = file.name.endsWith(".wav") ? "wav" : "mp3";
      await ffmpeg.writeFile(`input.${ext}`, await fetchFile(file));
      await ffmpeg.exec([
        "-i", `input.${ext}`,
        "-ss", String(start),
        "-to", String(end),
        "-c", "copy",
        `output.${ext}`,
      ]);
      const data = await ffmpeg.readFile(`output.${ext}`);
      // Copy into a plain ArrayBuffer to satisfy Blob constructor typing
      const rawData = data as Uint8Array;
      const copy = new Uint8Array(rawData.length);
      copy.set(rawData);
      const blob = new Blob([copy], { type: ext === "wav" ? "audio/wav" : "audio/mpeg" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `trimmed.${ext}`;
      a.click();
    } catch (err) {
      console.error(err);
      alert("Trim failed. See console for details.");
    } finally {
      setTrimming(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-2">✂️ Audio Trimmer</h1>
      <p className="text-gray-400 mb-8">Upload MP3/WAV → set trim points → download. All in-browser, no uploads.</p>

      {/* File input */}
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-gray-700 rounded-2xl p-10 text-center cursor-pointer hover:border-sky-500 hover:bg-sky-500/5 transition-colors mb-8"
      >
        <input ref={inputRef} type="file" accept=".mp3,.wav,audio/mpeg,audio/wav" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        <div className="text-4xl mb-3">🎵</div>
        <p className="text-gray-400 text-sm">{file ? file.name : "Drop an MP3 or WAV, or click to browse"}</p>
      </div>

      {ffmpegError && (
        <div className="bg-red-950 border border-red-800 text-red-300 rounded-xl p-4 text-sm mb-6">
          {ffmpegError}
        </div>
      )}

      {loadingFFmpeg && (
        <div className="text-center text-sky-400 animate-pulse mb-6 text-sm">
          Loading FFmpeg WASM (first load ~5–10s)…
        </div>
      )}

      {audioUrl && (
        <div className="space-y-6">
          <audio ref={audioRef} src={audioUrl} controls className="w-full rounded-lg" />

          {duration > 0 && (
            <>
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>File duration: <span className="text-white">{fmt(duration)}</span></span>
                  <span>Trim duration: <span className="text-sky-400">{fmt(end - start)}</span></span>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Start: <span className="text-white">{fmt(start)}</span></label>
                  <input
                    type="range" min={0} max={end - 0.1} step={0.1}
                    value={start}
                    onChange={(e) => setStart(Number(e.target.value))}
                    className="w-full accent-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">End: <span className="text-white">{fmt(end)}</span></label>
                  <input
                    type="range" min={start + 0.1} max={duration} step={0.1}
                    value={end}
                    onChange={(e) => setEnd(Number(e.target.value))}
                    className="w-full accent-sky-500"
                  />
                </div>
              </div>

              <button
                onClick={trimAndDownload}
                disabled={trimming || !ffmpegReady}
                className="w-full bg-sky-600 hover:bg-sky-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors"
              >
                {trimming ? "Trimming…" : !ffmpegReady ? "Loading FFmpeg…" : "Trim & Download"}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
