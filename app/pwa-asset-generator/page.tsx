import PWAAssetGenerator from "@/components/tools/PWAAssetGenerator";

export const metadata = {
  title: "PWA Asset Generator — MediaKit",
  description: "Generate maskable icons, all PWA icon sizes, and a manifest.json from one image.",
};

export default function Page() {
  return <PWAAssetGenerator />;
}
