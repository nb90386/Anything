// Splits raw contract text into clause-sized chunks. Handles the numbered
// "N. HEADING" style used throughout the sample contracts and most real-world
// commercial agreements; falls back to paragraph splitting for free-form text.

export interface RawSegment {
  heading: string;
  text: string;
  order: number;
}

const HEADING_RE = /^(?:ARTICLE|SECTION)?\s*(\d{1,2}(?:\.\d{1,2})?)\.?\s+([A-Z][A-Z0-9 &,/'\-()]{3,70})\s*$/;

export function segmentContract(rawText: string): RawSegment[] {
  const lines = rawText.replace(/\r\n/g, "\n").split("\n");
  const segments: RawSegment[] = [];
  let current: RawSegment | null = null;
  let order = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    const match = trimmed.match(HEADING_RE);
    if (match) {
      if (current && current.text.trim().length > 0) {
        segments.push(current);
      }
      order += 1;
      current = { heading: toTitleCase(match[2].trim()), text: "", order };
    } else if (current) {
      current.text += (current.text ? "\n" : "") + line;
    }
  }
  if (current && current.text.trim().length > 0) {
    segments.push(current);
  }

  if (segments.length >= 2) {
    return segments.map((s) => ({ ...s, text: s.text.trim() }));
  }

  // Fallback: split on blank lines into paragraph-level "clauses".
  const paragraphs = rawText
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter((p) => p.length > 30);

  return paragraphs.map((p, i) => ({
    heading: guessHeadingFromParagraph(p),
    text: p,
    order: i + 1,
  }));
}

function toTitleCase(s: string): string {
  return s
    .toLowerCase()
    .split(" ")
    .map((w) => (w.length > 2 ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

function guessHeadingFromParagraph(p: string): string {
  const firstSentence = p.split(/(?<=[.!?])\s/)[0].slice(0, 60);
  return firstSentence.length < p.length ? `${firstSentence}…` : firstSentence;
}
