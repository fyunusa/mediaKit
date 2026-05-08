import Link from "next/link";

const tools = [
  {
    href: "/favicon-generator",
    icon: "🖼️",
    title: "Favicon Generator",
    description:
      "Upload any image → get all standard favicon sizes (16px–512px) + ready-to-paste <link> tags, bundled in a .zip.",
    tags: ["Canvas API", "JSZip"],
  },
  {
    href: "/og-image-generator",
    icon: "📸",
    title: "OG Image Generator",
    description:
      "Type title + subtitle, pick a visual theme → live 1200×630 canvas preview → download as og-image.png.",
    tags: ["Canvas API", "5 themes"],
  },
  {
    href: "/youtube-thumbnail",
    icon: "🎬",
    title: "Thumbnail Extractor",
    description:
      "Paste a YouTube URL to grab all thumbnail sizes, or upload any local video to capture frames at any timestamp.",
    tags: ["YouTube", "Local video", "Canvas API"],
  },
  {
    href: "/audio-trimmer",
    icon: "✂️",
    title: "Audio Trimmer",
    description:
      "Upload MP3/WAV → waveform renders in-browser → drag handles to trim → download the cut clip. No server.",
    tags: ["WaveSurfer.js", "FFmpeg WASM"],
  },
  {
    href: "/font-studio",
    icon: "🔤",
    title: "Font Studio",
    description:
      "Test any Google Font live with full controls, discover fonts by mood & category, and get curated pairings — 65+ fonts.",
    tags: ["Google Fonts", "65+ fonts", "3 modes"],
  },
  {
    href: "/app-icon-generator",
    icon: "📱",
    title: "App Icon Generator",
    description:
      "Upload one image → generate every iOS and Android app icon size (from 20px to 1024px) as a .zip.",
    tags: ["iOS", "Android", "Canvas API"],
  },
  {
    href: "/splash-screen-generator",
    icon: "🌅",
    title: "Splash Screen Generator",
    description:
      "Set a background color, upload an optional logo → get every iOS + Android splash screen density as a .zip.",
    tags: ["iOS", "Android", "Color picker"],
  },
  {
    href: "/pwa-asset-generator",
    icon: "⚙️",
    title: "PWA Asset Generator",
    description:
      "Generate all PWA icon sizes, maskable icons (safe-zone background), and a ready-to-use manifest.json.",
    tags: ["Maskable icons", "manifest.json"],
  },
];

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-sky-500/10 border border-sky-500/20 rounded-full px-4 py-1.5 text-sky-400 text-sm mb-6">
          <span>⚡</span> 100% in-browser · No uploads · No accounts · 9 tools
        </div>
        <h1 className="text-4xl sm:text-6xl font-bold text-white mb-4 tracking-tight">
          Free Media &amp; Creative Tools
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          A fast, privacy-first collection of utilities that run entirely in your browser.
          Pick a tool and get to work instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group relative bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-sky-500/50 hover:bg-gray-800/50 transition-all duration-200"
          >
            <div className="text-3xl mb-3">{tool.icon}</div>
            <h2 className="text-lg font-semibold text-white mb-2 group-hover:text-sky-400 transition-colors">
              {tool.title}
            </h2>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">{tool.description}</p>
            <div className="flex flex-wrap gap-2">
              {tool.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-gray-800 border border-gray-700 text-gray-400 rounded-full px-2.5 py-0.5"
                >
                  {tag}
                </span>
              ))}
            </div>
            <span className="absolute top-4 right-4 text-gray-600 group-hover:text-sky-400 transition-colors text-lg">
              →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
