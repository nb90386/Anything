import { describe, expect, it } from "vitest";
import { segmentContract } from "@/lib/ai/mock/segment";

describe("segmentContract", () => {
  it("splits numbered ALL-CAPS headings into distinct segments", () => {
    const text = `PREAMBLE TEXT

1. DEFINITIONS

Some definitions text here that is long enough.

2. TERM AND TERMINATION

Termination text goes here and is also long enough to count.`;

    const segments = segmentContract(text);
    expect(segments.length).toBe(2);
    expect(segments[0].heading).toBe("Definitions");
    expect(segments[1].heading).toBe("Term And Termination");
    expect(segments[0].order).toBe(1);
    expect(segments[1].order).toBe(2);
  });

  it("falls back to paragraph splitting when no numbered headings exist", () => {
    const text = `This is the first paragraph with enough text to count as a real paragraph.

This is the second paragraph, also long enough to be captured by the fallback splitter.`;

    const segments = segmentContract(text);
    expect(segments.length).toBe(2);
  });

  it("ignores short noise paragraphs in fallback mode", () => {
    const text = `Hi

This is a real paragraph with plenty of content to pass the length filter applied by the fallback splitter.`;
    const segments = segmentContract(text);
    expect(segments.every((s) => s.text.length > 30)).toBe(true);
  });
});
