"use client";

import { useState, useEffect } from "react";
import { ALL_FONTS, getFontPairings, googleFontsUrl, type FontPair } from "@/lib/fonts";

const SAMPLE_TEXTS = {
  headline: "The Quick Brown Fox",
  paragraph: "Typography is the art and technique of arranging type to make written language legible, readable, and appealing when displayed.",
  ui: "Button · Label · Navigation · Caption",
};

type SampleKey = keyof typeof SAMPLE_TEXTS;

export default function FontPairing() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState("Inter");
  const [pairings, setPairings] = useState<FontPair[]>([]);
  const [sampleKey, setSampleKey] = useState<SampleKey>("headline");
  const [copied, setCopied] = useState<string | null>(null);

  const filtered = ALL_FONTS.filter((f) =>
    f.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const pairs = getFontPairings(selected);
    setPairings(pairs);
    // Inject fonts
    const fonts = [selected, ...pairs.map((p) => p.font)];
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = googleFontsUrl(fonts);
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, [selected]);

  const copyImport = (font: string) => {
    const css = `@import url('${googleFontsUrl([font])}');`;
    navigator.clipboard.writeText(css);
    setCopied(font);
    setTimeout(() => setCopied(null), 2000);
  };

  const copyBothImport = (pair: FontPair) => {
    const css = `@import url('${googleFontsUrl([selected, pair.font])}');`;
    navigator.clipboard.writeText(css);
    setCopied(`${selected}+${pair.font}`);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-2">🔤 Font Pairing Suggester</h1>
      <p className="text-gray-400 mb-8">Pick a primary Google Font → get 3 curated pairings with live preview.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Font selector */}
        <div className="lg:col-span-1">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search fonts…"
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-600 text-sm mb-3 focus:outline-none focus:border-sky-500"
          />
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden max-h-96 overflow-y-auto">
            {filtered.map((font) => (
              <button
                key={font}
                onClick={() => setSelected(font)}
                className={`w-full text-left px-4 py-3 text-sm border-b border-gray-800 last:border-0 transition-colors ${
                  selected === font
                    ? "bg-sky-600/20 text-sky-400"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
                style={{ fontFamily: `"${font}", sans-serif` }}
              >
                {font}
              </button>
            ))}
          </div>
        </div>

        {/* Pairings */}
        <div className="lg:col-span-2 space-y-5">
          {/* Sample text toggle */}
          <div className="flex gap-2">
            {(Object.keys(SAMPLE_TEXTS) as SampleKey[]).map((k) => (
              <button
                key={k}
                onClick={() => setSampleKey(k)}
                className={`px-3 py-1 rounded-lg text-xs border transition-colors capitalize ${
                  sampleKey === k
                    ? "bg-sky-600 border-sky-500 text-white"
                    : "bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-500"
                }`}
              >
                {k}
              </button>
            ))}
          </div>

          {/* Primary font preview */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-xs text-sky-400 uppercase tracking-wider">Primary font</span>
                <p className="text-white font-medium">{selected}</p>
              </div>
              <button
                onClick={() => copyImport(selected)}
                className="text-xs bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 px-3 py-1.5 rounded-lg transition-colors"
              >
                {copied === selected ? "✓ Copied" : "Copy @import"}
              </button>
            </div>
            <p
              className="text-2xl text-white leading-relaxed"
              style={{ fontFamily: `"${selected}", sans-serif` }}
            >
              {SAMPLE_TEXTS[sampleKey]}
            </p>
          </div>

          {pairings.map((pair) => (
            <div key={pair.font} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs text-purple-400 uppercase tracking-wider">Pair with</span>
                    <span className="text-xs bg-gray-800 border border-gray-700 text-gray-400 rounded-full px-2 py-0.5">
                      {pair.role}
                    </span>
                  </div>
                  <p className="text-white font-medium">{pair.font}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{pair.reason}</p>
                </div>
                <button
                  onClick={() => copyBothImport(pair)}
                  className="text-xs bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 px-3 py-1.5 rounded-lg transition-colors shrink-0 ml-3"
                >
                  {copied === `${selected}+${pair.font}` ? "✓ Copied" : "Copy both"}
                </button>
              </div>
              <div className="space-y-2">
                <p
                  className="text-2xl font-bold text-white leading-tight"
                  style={{ fontFamily: `"${selected}", sans-serif` }}
                >
                  {sampleKey === "headline" ? selected : SAMPLE_TEXTS[sampleKey]}
                </p>
                <p
                  className="text-base text-gray-300 leading-relaxed"
                  style={{ fontFamily: `"${pair.font}", sans-serif` }}
                >
                  {SAMPLE_TEXTS[sampleKey]}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
