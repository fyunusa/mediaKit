import AudioTrimmer from "@/components/tools/AudioTrimmer";

export const metadata = {
  title: "Audio Trimmer — MediaKit",
  description: "Upload MP3/WAV, set trim points, and download — all in-browser via FFmpeg WASM.",
};

export default function Page() {
  return <AudioTrimmer />;
}
