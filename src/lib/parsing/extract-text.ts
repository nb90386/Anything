export interface ExtractResult {
  text: string;
  warning: string | null;
}

const MAX_BYTES = 10 * 1024 * 1024; // 10MB

export async function extractTextFromFile(buffer: Buffer, fileName: string): Promise<ExtractResult> {
  if (buffer.byteLength > MAX_BYTES) {
    throw new Error("File exceeds the 10MB upload limit for this demo.");
  }

  const ext = fileName.toLowerCase().split(".").pop() ?? "";

  if (ext === "pdf") {
    const pdfParse = (await import("pdf-parse")).default;
    const result = await pdfParse(buffer);
    if (!result.text.trim()) {
      return { text: "", warning: "This PDF appears to be scanned/image-based — no extractable text was found. Try a text-based PDF or paste the contract text directly." };
    }
    return { text: normalize(result.text), warning: null };
  }

  if (ext === "docx") {
    const mammoth = await import("mammoth");
    const result = await mammoth.extractRawText({ buffer });
    return { text: normalize(result.value), warning: result.messages.length > 0 ? "Some DOCX formatting could not be converted; text content was preserved." : null };
  }

  if (ext === "txt" || ext === "md") {
    return { text: normalize(buffer.toString("utf-8")), warning: null };
  }

  throw new Error(`Unsupported file type ".${ext}". Please upload a PDF, DOCX, or TXT file.`);
}

function normalize(text: string): string {
  return text.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}
