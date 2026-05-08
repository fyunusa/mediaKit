"use client";

import { useState, useEffect, useMemo } from "react";
import {
  FONT_CATALOG,
  ALL_FONTS,
  getFontPairings,
  googleFontsUrl,
  type FontCategory,
  type FontMood,
  type FontPair,
} from "@/lib/fonts";

type Tab = "test" | "match" | "pair";
type SampleKey = "headline" | "paragraph" | "ui";

const SAMPLE_TEXTS: Record<SampleKey, string> = {
  headline: "The Quick Brown Fox",
  paragraph:
    "Typography is the art and technique of arranging type to make written language legible, readable, and appealing when displayed.",
  ui: "Button · Label · Navigation · Caption",
};

function gFontsAllWeights(font: string, weights: number[]): string {
  return `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
    font
  )}:wght@${weights.join(";")}&display=swap`;
}

// ─── TEST TAB ─────────────────────────────────────────────────────────────────

function TestTab() {
  const [text, setText] = useState(
    "The quick brown fox jumps over the lazy dog"
  );
  const [fontSearch, setFontSearch] = useState("");
  const [selectedFont, setSelectedFont] = useState("Inter");
  const [fontSize, setFontSize] = useState(48);
  const [fontWeight, setFontWeight] = useState(400);
  const [lineHeight, setLineHeight] = useState(1.3);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [copied, setCopied] = useState<string | null>(null);

  const fontMeta = FONT_CATALOG.find((f) => f.name === selectedFont);
  const weights = fontMeta?.weights ?? [300, 400, 500, 600, 700];

  const filteredFonts = useMemo(
    () =>
      FONT_CATALOG.map((f) => f.name).filter((n) =>
        n.toLowerCase().includes(fontSearch.toLowerCase())
      ),
    [fontSearch]
  );

  useEffect(() => {
    const meta = FONT_CATALOG.find((f) => f.name === selectedFont);
    const w = meta?.weights ?? [400, 700];
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = gFontsAllWeights(selectedFont, w);
    document.head.appendChild(link);
    return () => {
      if (document.head.contains(link)) document.head.removeChild(link);
    };
  }, [selectedFont]);

  const selectFont = (name: string) => {
    const meta = FONT_CATALOG.find((f) => f.name === name);
    const w = meta?.weights ?? [400];
    setSelectedFont(name);
    setFontSearch("");
    if (!w.includes(fontWeight)) {
      const closest = w.reduce((p, c) =>
        Math.abs(c - fontWeight) < Math.abs(p - fontWeight) ? c : p
      );
      setFontWeight(closest);
    }
  };

  const importSnippet = `@import url('${gFontsAllWeights(selectedFont, weights)}');`;
  const cssSnippet = `font-family: '${selectedFont}', sans-serif;\nfont-size: ${fontSize}px;\nfont-weight: ${fontWeight};\nline-height: ${lineHeight};\nletter-spacing: ${letterSpacing}px;`;

  const copy = (str: string, key: string) => {
    navigator.clipboard.writeText(str);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
      {/* ── Controls ── */}
      <div className="space-y-5">
        <div>
          <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1.5">
            Your text
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-sky-500 resize-none"
          />
        </div>

        <div>
          <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1.5">
            Font{" "}
            <span className="text-gray-700 normal-case">
              ({FONT_CATALOG.length} available)
            </span>
          </label>
          <input
            value={fontSearch}
            onChange={(e) => setFontSearch(e.target.value)}
            placeholder="Search…"
            className="w-full bg-gray-900 border border-gray-700 rounded-t-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-sky-500"
          />
          <div className="bg-gray-900 border border-gray-700 border-t-0 rounded-b-lg overflow-y-auto max-h-44">
            {filteredFonts.length === 0 ? (
              <p className="px-3 py-4 text-gray-600 text-sm text-center">
                No fonts match
              </p>
            ) : (
              filteredFonts.map((font) => (
                <button
                  key={font}
                  onClick={() => selectFont(font)}
                  className={`w-full text-left px-3 py-2 text-sm border-b border-gray-800 last:border-0 transition-colors ${
                    selectedFont === font
                      ? "bg-sky-600/20 text-sky-400"
                      : "text-gray-300 hover:bg-gray-800"
                  }`}
                >
                  {font}
                </button>
              ))
            )}
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-1.5">
            <label className="text-xs text-gray-500 uppercase tracking-wider">
              Size
            </label>
            <span className="text-xs text-sky-400">{fontSize}px</span>
          </div>
          <input
            type="range"
            min={12}
            max={120}
            step={1}
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="w-full accent-sky-500"
          />
        </div>

        <div>
          <label className="text-xs text-gray-500 uppercase tracking-wider block mb-2">
            Weight
          </label>
          <div className="flex flex-wrap gap-1.5">
            {weights.map((w) => (
              <button
                key={w}
                onClick={() => setFontWeight(w)}
                className={`px-2.5 py-1 rounded text-xs border transition-colors ${
                  fontWeight === w
                    ? "bg-sky-600 border-sky-500 text-white"
                    : "bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-500"
                }`}
              >
                {w}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-1.5">
            <label className="text-xs text-gray-500 uppercase tracking-wider">
              Line height
            </label>
            <span className="text-xs text-sky-400">{lineHeight.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min={0.8}
            max={3}
            step={0.05}
            value={lineHeight}
            onChange={(e) => setLineHeight(Number(e.target.value))}
            className="w-full accent-sky-500"
          />
        </div>

        <div>
          <div className="flex justify-between mb-1.5">
            <label className="text-xs text-gray-500 uppercase tracking-wider">
              Letter spacing
            </label>
            <span className="text-xs text-sky-400">{letterSpacing}px</span>
          </div>
          <input
            type="range"
            min={-2}
            max={20}
            step={0.5}
            value={letterSpacing}
            onChange={(e) => setLetterSpacing(Number(e.target.value))}
            className="w-full accent-sky-500"
          />
        </div>
      </div>

      {/* ── Preview + Snippets ── */}
      <div className="flex flex-col gap-4">
        <div className="flex-1 bg-gray-900 border border-gray-800 rounded-2xl p-8 min-h-52 flex items-center">
          <p
            style={{
              fontFamily: `"${selectedFont}", sans-serif`,
              fontSize: `${fontSize}px`,
              fontWeight,
              lineHeight,
              letterSpacing: `${letterSpacing}px`,
              color: "white",
              wordBreak: "break-word",
            }}
          >
            {text || "Start typing above…"}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="text-white font-medium">{selectedFont}</span>
          <span className="text-xs bg-gray-800 border border-gray-700 text-gray-400 rounded-full px-2.5 py-0.5 capitalize">
            {fontMeta?.category ?? ""}
          </span>
          {fontMeta?.moods.slice(0, 2).map((m) => (
            <span key={m} className="text-xs text-gray-600 capitalize">
              {m}
            </span>
          ))}
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-800">
            <span className="text-xs text-gray-500 font-mono">@import</span>
            <button
              onClick={() => copy(importSnippet, "import")}
              className="text-xs bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 px-3 py-1 rounded-lg transition-colors"
            >
              {copied === "import" ? "✓ Copied" : "Copy"}
            </button>
          </div>
          <pre className="px-4 py-3 text-xs text-sky-300 overflow-x-auto whitespace-pre-wrap break-all">
            {importSnippet}
          </pre>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-800">
            <span className="text-xs text-gray-500 font-mono">CSS</span>
            <button
              onClick={() => copy(cssSnippet, "css")}
              className="text-xs bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 px-3 py-1 rounded-lg transition-colors"
            >
              {copied === "css" ? "✓ Copied" : "Copy"}
            </button>
          </div>
          <pre className="px-4 py-3 text-xs text-purple-300 overflow-x-auto">
            {cssSnippet}
          </pre>
        </div>
      </div>
    </div>
  );
}

// ─── MATCH TAB ────────────────────────────────────────────────────────────────

const ALL_MOODS: FontMood[] = [
  "elegant",
  "playful",
  "minimal",
  "bold",
  "technical",
  "warm",
  "editorial",
  "modern",
  "retro",
  "condensed",
];

const CATEGORY_LABELS: Record<string, string> = {
  all: "All",
  "sans-serif": "Sans-serif",
  serif: "Serif",
  display: "Display",
  monospace: "Mono",
  handwriting: "Script",
};

function MatchTab() {
  const [activeCategory, setActiveCategory] = useState<FontCategory | "all">(
    "all"
  );
  const [activeMoods, setActiveMoods] = useState<FontMood[]>([]);
  const [sample, setSample] = useState(
    "The quick brown fox jumps over the lazy dog"
  );
  const [copied, setCopied] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      FONT_CATALOG.filter((f) => {
        if (activeCategory !== "all" && f.category !== activeCategory)
          return false;
        if (
          activeMoods.length > 0 &&
          !activeMoods.some((m) => f.moods.includes(m))
        )
          return false;
        return true;
      }),
    [activeCategory, activeMoods]
  );

  useEffect(() => {
    const names = filtered.slice(0, 30).map((f) => f.name);
    if (names.length === 0) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = googleFontsUrl(names);
    document.head.appendChild(link);
    return () => {
      if (document.head.contains(link)) document.head.removeChild(link);
    };
  }, [filtered]);

  const toggleMood = (mood: FontMood) =>
    setActiveMoods((prev) =>
      prev.includes(mood) ? prev.filter((m) => m !== mood) : [...prev, mood]
    );

  const copyImport = (name: string) => {
    const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
      name
    )}:wght@400;700&display=swap`;
    navigator.clipboard.writeText(`@import url('${url}');`);
    setCopied(name);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-6">
      <input
        value={sample}
        onChange={(e) => setSample(e.target.value)}
        placeholder="Sample text…"
        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-sky-500"
      />

      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
          Category
        </p>
        <div className="flex flex-wrap gap-2">
          {(
            [
              "all",
              "sans-serif",
              "serif",
              "display",
              "monospace",
              "handwriting",
            ] as const
          ).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs border transition-colors ${
                activeCategory === cat
                  ? "bg-sky-600 border-sky-500 text-white"
                  : "bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-500"
              }`}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-gray-500 uppercase tracking-wider">
            Vibe / Mood{" "}
            <span className="normal-case text-gray-600">(multi-select)</span>
          </p>
          {activeMoods.length > 0 && (
            <button
              onClick={() => setActiveMoods([])}
              className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {ALL_MOODS.map((mood) => (
            <button
              key={mood}
              onClick={() => toggleMood(mood)}
              className={`px-3 py-1.5 rounded-full text-xs border transition-colors capitalize ${
                activeMoods.includes(mood)
                  ? "bg-purple-600 border-purple-500 text-white"
                  : "bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-500"
              }`}
            >
              {mood}
            </button>
          ))}
        </div>
      </div>

      <p className="text-sm text-gray-500">
        {filtered.length} font{filtered.length !== 1 ? "s" : ""}
        {filtered.length === FONT_CATALOG.length
          ? " (showing all)"
          : " match your filters"}
      </p>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-600">
          <p className="text-4xl mb-3">🔍</p>
          <p>No fonts match those filters. Try fewer selections.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.slice(0, 30).map((font) => (
            <div
              key={font.name}
              className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-600 transition-colors group"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-white text-sm font-medium leading-tight">
                    {font.name}
                  </p>
                  <span className="text-xs text-gray-600 capitalize">
                    {font.category}
                  </span>
                </div>
                <button
                  onClick={() => copyImport(font.name)}
                  className="text-xs bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-400 px-2.5 py-1 rounded-lg transition-colors opacity-0 group-hover:opacity-100 shrink-0 ml-2"
                >
                  {copied === font.name ? "✓" : "@import"}
                </button>
              </div>
              <p
                style={{
                  fontFamily: `"${font.name}", sans-serif`,
                  fontWeight: 400,
                }}
                className="text-gray-200 text-lg leading-snug"
              >
                {sample || "The quick brown fox"}
              </p>
              <div className="flex flex-wrap gap-1 mt-3">
                {font.moods.map((m) => (
                  <span
                    key={m}
                    className="text-xs bg-gray-800 text-gray-600 rounded-full px-2 py-0.5 capitalize"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          ))}
          {filtered.length > 30 && (
            <div className="sm:col-span-2 lg:col-span-3 text-center py-4 text-gray-600 text-sm">
              Showing 30 of {filtered.length}. Narrow your filters to see more
              specific results.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── PAIR TAB ─────────────────────────────────────────────────────────────────

function PairTab() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState("Inter");
  const [sampleKey, setSampleKey] = useState<SampleKey>("headline");
  const [copied, setCopied] = useState<string | null>(null);

  const pairings: FontPair[] = getFontPairings(selected);
  const filteredFonts = ALL_FONTS.filter((f) =>
    f.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const pairs = getFontPairings(selected);
    const fonts = [selected, ...pairs.map((p) => p.font)];
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = googleFontsUrl(fonts);
    document.head.appendChild(link);
    return () => {
      if (document.head.contains(link)) document.head.removeChild(link);
    };
  }, [selected]);

  const copy = (str: string, key: string) => {
    navigator.clipboard.writeText(str);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
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
          {filteredFonts.map((font) => (
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

        {/* Primary font */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-xs text-sky-400 uppercase tracking-wider">
                Primary font
              </span>
              <p className="text-white font-medium">{selected}</p>
            </div>
            <button
              onClick={() =>
                copy(`@import url('${googleFontsUrl([selected])}');`, selected)
              }
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

        {pairings.map((pair) => {
          const pairKey = `${selected}+${pair.font}`;
          return (
            <div
              key={pair.font}
              className="bg-gray-900 border border-gray-800 rounded-xl p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs text-purple-400 uppercase tracking-wider">
                      Pair with
                    </span>
                    <span className="text-xs bg-gray-800 border border-gray-700 text-gray-400 rounded-full px-2 py-0.5">
                      {pair.role}
                    </span>
                  </div>
                  <p className="text-white font-medium">{pair.font}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{pair.reason}</p>
                </div>
                <button
                  onClick={() =>
                    copy(
                      `@import url('${googleFontsUrl([selected, pair.font])}');`,
                      pairKey
                    )
                  }
                  className="text-xs bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 px-3 py-1.5 rounded-lg transition-colors shrink-0 ml-4"
                >
                  {copied === pairKey ? "✓ Copied" : "Copy both"}
                </button>
              </div>
              <div className="space-y-2">
                <p
                  className="text-xl text-white"
                  style={{ fontFamily: `"${selected}", sans-serif` }}
                >
                  {SAMPLE_TEXTS[sampleKey]}
                </p>
                <p
                  className="text-base text-gray-400"
                  style={{ fontFamily: `"${pair.font}", sans-serif` }}
                >
                  {SAMPLE_TEXTS[sampleKey]}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

const TABS: { id: Tab; label: string }[] = [
  { id: "test", label: "Test" },
  { id: "match", label: "Match" },
  { id: "pair", label: "Pair" },
];

export default function FontStudio() {
  const [tab, setTab] = useState<Tab>("test");

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-2">🔤 Font Studio</h1>
      <p className="text-gray-400 mb-8">
        Test any Google Font live, discover fonts by vibe, and find perfect
        pairings — all in one place.
      </p>

      <div className="flex gap-1 bg-gray-900 border border-gray-800 rounded-xl p-1 w-fit mb-8">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t.id
                ? "bg-sky-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "test" && <TestTab />}
      {tab === "match" && <MatchTab />}
      {tab === "pair" && <PairTab />}
    </div>
  );
}
