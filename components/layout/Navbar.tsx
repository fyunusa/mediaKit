import Link from "next/link";

const tools = [
  { href: "/favicon-generator", label: "Favicon Generator" },
  { href: "/og-image-generator", label: "OG Image" },
  { href: "/youtube-thumbnail", label: "Thumbnails" },
  { href: "/audio-trimmer", label: "Audio Trimmer" },
  { href: "/font-studio", label: "Font Studio" },
  { href: "/app-icon-generator", label: "App Icons" },
  { href: "/splash-screen-generator", label: "Splash Screens" },
  { href: "/pwa-asset-generator", label: "PWA Assets" },
];

export default function Navbar() {
  return (
    <nav className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
        <Link href="/" className="flex items-center gap-2 font-bold text-white text-lg tracking-tight">
          <span className="text-sky-400">⚡</span>
          MediaKit
        </Link>
        <div className="hidden md:flex items-center gap-1">
          {tools.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="px-3 py-1.5 rounded-md text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            >
              {t.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
