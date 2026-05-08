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
