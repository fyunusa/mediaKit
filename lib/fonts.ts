export interface FontPair {
  font: string;
  role: string;
  reason: string;
}

export const FONT_PAIRINGS: Record<string, FontPair[]> = {
  "Playfair Display": [
    { font: "Source Sans Pro", role: "body", reason: "Humanist sans balances the editorial serif" },
    { font: "Lato", role: "body", reason: "Clean and neutral, lets the display font shine" },
    { font: "Space Mono", role: "accent/code", reason: "Retro-tech contrast against classical serif" },
  ],
  "Inter": [
    { font: "Merriweather", role: "body long-form", reason: "High-legibility serif for reading comfort" },
    { font: "DM Serif Display", role: "heading", reason: "Elegant contrast for editorial feel" },
    { font: "JetBrains Mono", role: "code/accent", reason: "Technical pairing for dev-focused content" },
  ],
  "Roboto": [
    { font: "Roboto Slab", role: "heading", reason: "Sibling slab for consistent visual language" },
    { font: "Playfair Display", role: "heading", reason: "Editorial elegance against neutral body" },
    { font: "Lora", role: "body", reason: "Warm serif for long-form reading" },
  ],
  "Open Sans": [
    { font: "Raleway", role: "heading", reason: "Geometric elegance as a heading counterpart" },
    { font: "Merriweather", role: "body", reason: "High-legibility serif complement" },
    { font: "Oswald", role: "heading", reason: "Condensed impact for bold headlines" },
  ],
  "Montserrat": [
    { font: "Cormorant Garamond", role: "body", reason: "Classic elegance against geometric sans" },
    { font: "Source Serif Pro", role: "body", reason: "Readable serif for long-form content" },
    { font: "Space Mono", role: "code/accent", reason: "Techy contrast for digital branding" },
  ],
  "Lato": [
    { font: "Playfair Display", role: "heading", reason: "High contrast serif headline" },
    { font: "Merriweather", role: "body", reason: "Traditional editorial pairing" },
    { font: "PT Serif", role: "body", reason: "Warm, book-like reading experience" },
  ],
  "Poppins": [
    { font: "Playfair Display", role: "heading", reason: "Classic elegance vs modern geometric" },
    { font: "Libre Baskerville", role: "body", reason: "Refined serif for text blocks" },
    { font: "Inconsolata", role: "code/accent", reason: "Clean mono for technical content" },
  ],
  "Raleway": [
    { font: "Crimson Text", role: "body", reason: "Old-style serif for editorial warmth" },
    { font: "Lato", role: "body", reason: "Neutral sans for functional sections" },
    { font: "EB Garamond", role: "body", reason: "Traditional book typography" },
  ],
  "Oswald": [
    { font: "Quattrocento", role: "body", reason: "Renaissance serif balancing bold condensed" },
    { font: "Lato", role: "body", reason: "Neutral versatile body text" },
    { font: "PT Sans", role: "body", reason: "Humanist sans with good legibility" },
  ],
  "Nunito": [
    { font: "Nunito Sans", role: "body", reason: "Consistent sibling for body text" },
    { font: "Merriweather", role: "body", reason: "Rounded sans + classic serif contrast" },
    { font: "Libre Baskerville", role: "body", reason: "Book-like reading feel" },
  ],
  "Ubuntu": [
    { font: "Ubuntu Mono", role: "code", reason: "Consistent monospace family member" },
    { font: "Merriweather", role: "body", reason: "Serif contrast for long-form content" },
    { font: "Source Code Pro", role: "code", reason: "Technical precision for code blocks" },
  ],
  "Source Sans Pro": [
    { font: "Source Serif Pro", role: "body", reason: "Consistent family pairing" },
    { font: "Source Code Pro", role: "code", reason: "Full Source family trio" },
    { font: "Playfair Display", role: "heading", reason: "Elegant editorial contrast" },
  ],
  "Josefin Sans": [
    { font: "Josefin Slab", role: "heading", reason: "Geometric family pairing" },
    { font: "EB Garamond", role: "body", reason: "Classic serif for body content" },
    { font: "Cormorant Garamond", role: "body", reason: "Elegant long-form reading" },
  ],
  "DM Sans": [
    { font: "DM Serif Display", role: "heading", reason: "Consistent DM family contrast" },
    { font: "DM Serif Text", role: "body", reason: "Full DM family system" },
    { font: "Space Mono", role: "code", reason: "Technical accent for UI details" },
  ],
  "Fira Sans": [
    { font: "Fira Code", role: "code", reason: "Consistent Fira family for code" },
    { font: "Merriweather", role: "body", reason: "Classic serif for reading comfort" },
    { font: "Playfair Display", role: "heading", reason: "Editorial display contrast" },
  ],
};

export const ALL_FONTS = Object.keys(FONT_PAIRINGS);

export function getFontPairings(primaryFont: string): FontPair[] {
  if (FONT_PAIRINGS[primaryFont]) return FONT_PAIRINGS[primaryFont];

  // Heuristic fallback
  return [
    { font: "Merriweather", role: "body", reason: "High-legibility serif pairing" },
    { font: "Playfair Display", role: "heading", reason: "Elegant editorial display font" },
    { font: "Space Mono", role: "code/accent", reason: "Technical monospace accent" },
  ];
}

export function googleFontsUrl(fonts: string[]): string {
  const families = fonts
    .map((f) => `family=${encodeURIComponent(f)}:wght@400;700`)
    .join("&");
  return `https://fonts.googleapis.com/css2?${families}&display=swap`;
}

// ── Font Studio catalog ───────────────────────────────────────────────────────

export type FontCategory =
  | "sans-serif"
  | "serif"
  | "display"
  | "monospace"
  | "handwriting";

export type FontMood =
  | "elegant"
  | "playful"
  | "minimal"
  | "bold"
  | "technical"
  | "warm"
  | "editorial"
  | "modern"
  | "retro"
  | "condensed";

export interface FontMeta {
  name: string;
  category: FontCategory;
  moods: FontMood[];
  weights: number[];
}

export const FONT_CATALOG: FontMeta[] = [
  // ── Sans-serif ──
  { name: "Inter",            category: "sans-serif", moods: ["minimal","modern","technical"],    weights: [100,200,300,400,500,600,700,800,900] },
  { name: "Roboto",           category: "sans-serif", moods: ["minimal","modern","warm"],         weights: [100,300,400,500,700,900] },
  { name: "Open Sans",        category: "sans-serif", moods: ["minimal","warm","modern"],         weights: [300,400,500,600,700,800] },
  { name: "Poppins",          category: "sans-serif", moods: ["modern","playful","bold"],         weights: [100,200,300,400,500,600,700,800,900] },
  { name: "Montserrat",       category: "sans-serif", moods: ["bold","modern","elegant"],         weights: [100,200,300,400,500,600,700,800,900] },
  { name: "Nunito",           category: "sans-serif", moods: ["playful","warm","modern"],         weights: [200,300,400,500,600,700,800,900] },
  { name: "Raleway",          category: "sans-serif", moods: ["elegant","minimal","modern"],      weights: [100,200,300,400,500,600,700,800,900] },
  { name: "Lato",             category: "sans-serif", moods: ["minimal","warm","modern"],         weights: [100,300,400,700,900] },
  { name: "DM Sans",          category: "sans-serif", moods: ["minimal","modern"],                weights: [100,200,300,400,500,600,700,800,900] },
  { name: "Fira Sans",        category: "sans-serif", moods: ["technical","modern","minimal"],    weights: [100,200,300,400,500,600,700,800,900] },
  { name: "Ubuntu",           category: "sans-serif", moods: ["modern","warm","technical"],       weights: [300,400,500,700] },
  { name: "Josefin Sans",     category: "sans-serif", moods: ["elegant","minimal","retro"],       weights: [100,200,300,400,500,600,700] },
  { name: "Oswald",           category: "sans-serif", moods: ["bold","condensed","modern"],       weights: [200,300,400,500,600,700] },
  { name: "Rubik",            category: "sans-serif", moods: ["modern","playful","warm"],         weights: [300,400,500,600,700,800,900] },
  { name: "Work Sans",        category: "sans-serif", moods: ["minimal","modern"],                weights: [100,200,300,400,500,600,700,800,900] },
  { name: "Manrope",          category: "sans-serif", moods: ["modern","minimal","elegant"],      weights: [200,300,400,500,600,700,800] },
  { name: "Plus Jakarta Sans",category: "sans-serif", moods: ["modern","minimal"],                weights: [200,300,400,500,600,700,800] },
  { name: "Barlow",           category: "sans-serif", moods: ["minimal","modern","bold"],         weights: [100,200,300,400,500,600,700,800,900] },
  { name: "Cabin",            category: "sans-serif", moods: ["warm","modern","minimal"],         weights: [400,500,600,700] },
  { name: "Quicksand",        category: "sans-serif", moods: ["playful","warm","modern"],         weights: [300,400,500,600,700] },
  { name: "Exo 2",            category: "sans-serif", moods: ["technical","modern","bold"],       weights: [100,200,300,400,500,600,700,800,900] },
  { name: "Mulish",           category: "sans-serif", moods: ["minimal","modern"],                weights: [200,300,400,500,600,700,800,900] },
  { name: "Outfit",           category: "sans-serif", moods: ["modern","minimal","playful"],      weights: [100,200,300,400,500,600,700,800,900] },
  { name: "Space Grotesk",    category: "sans-serif", moods: ["modern","technical","bold"],       weights: [300,400,500,600,700] },
  { name: "Sora",             category: "sans-serif", moods: ["modern","minimal"],                weights: [100,200,300,400,500,600,700,800] },
  // ── Serif ──
  { name: "Playfair Display", category: "serif", moods: ["elegant","editorial","bold"],           weights: [400,500,600,700,800,900] },
  { name: "Merriweather",     category: "serif", moods: ["warm","editorial","modern"],            weights: [300,400,700,900] },
  { name: "Lora",             category: "serif", moods: ["warm","editorial","elegant"],           weights: [400,500,600,700] },
  { name: "EB Garamond",      category: "serif", moods: ["elegant","editorial","retro"],          weights: [400,500,600,700,800] },
  { name: "Cormorant Garamond",category: "serif", moods: ["elegant","editorial"],                 weights: [300,400,500,600,700] },
  { name: "Libre Baskerville",category: "serif", moods: ["editorial","warm"],                    weights: [400,700] },
  { name: "Source Serif Pro", category: "serif", moods: ["editorial","modern","minimal"],         weights: [200,300,400,600,700,900] },
  { name: "DM Serif Display", category: "serif", moods: ["elegant","editorial","bold"],           weights: [400] },
  { name: "PT Serif",         category: "serif", moods: ["editorial","warm","modern"],            weights: [400,700] },
  { name: "Crimson Text",     category: "serif", moods: ["editorial","warm","retro"],             weights: [400,600,700] },
  { name: "Spectral",         category: "serif", moods: ["editorial","elegant"],                  weights: [200,300,400,500,600,700,800] },
  { name: "Libre Caslon Text",category: "serif", moods: ["editorial","warm"],                    weights: [400,700] },
  // ── Display ──
  { name: "Bebas Neue",       category: "display", moods: ["bold","condensed","modern"],         weights: [400] },
  { name: "Anton",            category: "display", moods: ["bold","condensed"],                  weights: [400] },
  { name: "Righteous",        category: "display", moods: ["bold","retro","playful"],             weights: [400] },
  { name: "Abril Fatface",    category: "display", moods: ["bold","editorial","retro"],           weights: [400] },
  { name: "Lobster",          category: "display", moods: ["retro","playful","bold"],             weights: [400] },
  { name: "Fredoka One",      category: "display", moods: ["playful","warm","bold"],              weights: [400] },
  { name: "Comfortaa",        category: "display", moods: ["playful","warm","modern"],            weights: [300,400,500,600,700] },
  { name: "Pacifico",         category: "display", moods: ["retro","playful","warm"],             weights: [400] },
  { name: "Alfa Slab One",    category: "display", moods: ["bold","retro"],                      weights: [400] },
  { name: "Boogaloo",         category: "display", moods: ["playful","retro"],                   weights: [400] },
  { name: "Titan One",        category: "display", moods: ["bold","playful"],                    weights: [400] },
  { name: "Passion One",      category: "display", moods: ["bold","condensed","modern"],         weights: [400,700,900] },
  // ── Monospace ──
  { name: "JetBrains Mono",   category: "monospace", moods: ["technical","modern","minimal"],    weights: [100,200,300,400,500,600,700,800] },
  { name: "Fira Code",        category: "monospace", moods: ["technical","modern"],              weights: [300,400,500,600,700] },
  { name: "Source Code Pro",  category: "monospace", moods: ["technical","minimal"],             weights: [200,300,400,500,600,700,800,900] },
  { name: "Space Mono",       category: "monospace", moods: ["technical","retro","bold"],        weights: [400,700] },
  { name: "Inconsolata",      category: "monospace", moods: ["technical","minimal"],             weights: [200,300,400,500,600,700,800,900] },
  { name: "Roboto Mono",      category: "monospace", moods: ["technical","modern"],              weights: [100,200,300,400,500,600,700] },
  { name: "IBM Plex Mono",    category: "monospace", moods: ["technical","modern","minimal"],    weights: [100,200,300,400,500,600,700] },
  { name: "Courier Prime",    category: "monospace", moods: ["technical","retro","editorial"],   weights: [400,700] },
  // ── Handwriting ──
  { name: "Dancing Script",   category: "handwriting", moods: ["elegant","playful","warm"],      weights: [400,500,600,700] },
  { name: "Caveat",           category: "handwriting", moods: ["playful","warm"],                weights: [400,500,600,700] },
  { name: "Satisfy",          category: "handwriting", moods: ["elegant","retro"],               weights: [400] },
  { name: "Great Vibes",      category: "handwriting", moods: ["elegant","warm"],                weights: [400] },
  { name: "Kalam",            category: "handwriting", moods: ["warm","playful"],                weights: [300,400,700] },
  { name: "Patrick Hand",     category: "handwriting", moods: ["playful","warm"],                weights: [400] },
  { name: "Indie Flower",     category: "handwriting", moods: ["playful","warm"],                weights: [400] },
  { name: "Sacramento",       category: "handwriting", moods: ["elegant","warm"],                weights: [400] },
  { name: "Permanent Marker", category: "handwriting", moods: ["bold","playful"],                weights: [400] },
];
