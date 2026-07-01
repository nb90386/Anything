import { Sparkles } from "lucide-react";
import { UploadForm } from "@/components/upload/upload-form";

export default function UploadPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-6 py-8">
      <div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 dark:border-brand-500/30 dark:bg-brand-500/10 dark:text-brand-300">
          <Sparkles className="h-3.5 w-3.5" />
          Real parsing + real clause extraction
        </span>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-ink-950 dark:text-white">
          Ingest a contract
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-ink-500 dark:text-ink-400">
          Upload a PDF, DOCX, or TXT file — or paste raw contract text — and the analysis engine will segment
          clauses, classify categories, extract risks, and build a briefing in seconds.
        </p>
      </div>

      <UploadForm />
    </div>
  );
}
