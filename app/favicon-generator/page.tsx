import FaviconGenerator from "@/components/tools/FaviconGenerator";

export const metadata = {
  title: "Favicon Generator — MediaKit",
  description: "Upload any image and get all favicon sizes + HTML snippet, bundled in a .zip.",
};

export default function Page() {
  return <FaviconGenerator />;
}
