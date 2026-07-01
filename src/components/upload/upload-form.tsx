"use client";

import { cloneElement, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  CheckCircle2,
  File as FileIcon,
  FileText,
  Loader2,
  UploadCloud,
  Wand2,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { CONTRACT_TYPES, DEPARTMENTS } from "@/lib/validation";
import type { Contract } from "@/lib/types";

const SAMPLES: { name: string; title: string; counterparty: string; type: (typeof CONTRACT_TYPES)[number]; text: string }[] = [
  {
    name: "Vendor MSA (risky liability)",
    title: "Master Services Agreement: Northwind Logistics",
    counterparty: "Northwind Logistics Inc.",
    type: "MSA",
    text: `MASTER SERVICES AGREEMENT

This Master Services Agreement ("Agreement") is entered into between Acme Corp ("Client") and Northwind Logistics Inc. ("Vendor") for the provision of freight coordination and warehousing services.

1. SERVICES. Vendor shall provide logistics coordination, warehousing, and last-mile delivery services as described in each Statement of Work executed under this Agreement. Vendor shall use commercially reasonable efforts to meet agreed service levels.

2. LIMITATION OF LIABILITY. Vendor's total liability arising out of or related to this Agreement, whether in contract, tort, or otherwise, shall be UNCAPPED and Vendor shall indemnify Client for any and all direct, indirect, incidental, special, and consequential damages, including lost profits, arising from any breach, negligence, or service failure, without limitation as to amount or duration.

3. TERM AND AUTO-RENEWAL. This Agreement shall commence on the Effective Date and continue for an initial term of twelve (12) months. Thereafter, this Agreement shall automatically renew for successive twelve (12) month terms unless either party provides written notice of non-renewal at least ninety (90) days prior to the end of the then-current term.

4. PAYMENT TERMS. Client shall pay all undisputed invoices within thirty (30) days of receipt. Late payments accrue interest at 1.5% per month.`,
  },
  {
    name: "Mutual NDA (standard)",
    title: "Mutual Non-Disclosure Agreement: Bright Path Studios",
    counterparty: "Bright Path Studios LLC",
    type: "NDA",
    text: `MUTUAL NON-DISCLOSURE AGREEMENT

This Mutual Non-Disclosure Agreement is made between Acme Corp and Bright Path Studios LLC for the purpose of evaluating a potential business relationship.

1. CONFIDENTIAL INFORMATION. Each party may disclose certain confidential business, technical, and financial information to the other party. The receiving party agrees to protect such information using the same degree of care it uses for its own confidential information, but no less than reasonable care.

2. TERM. This Agreement shall remain in effect for two (2) years from the Effective Date. Confidentiality obligations with respect to any Confidential Information disclosed during the term shall survive for three (3) years following disclosure.

3. GOVERNING LAW. This Agreement shall be governed by the laws of the State of Delaware, without regard to its conflict of law principles. Any dispute shall be resolved in the state or federal courts located in Delaware.`,
  },
  {
    name: "SaaS Subscription (data privacy)",
    title: "SaaS Subscription Agreement: Cirrus Analytics",
    counterparty: "Cirrus Analytics Inc.",
    type: "SaaS Subscription",
    text: `SAAS SUBSCRIPTION AGREEMENT

This Agreement governs Client's subscription to the Cirrus Analytics platform ("Service").

1. DATA PROCESSING. Vendor may process Client's customer data, including personal data of end users, on servers located in multiple jurisdictions, including outside the United States and European Economic Area, without additional notice to Client. Vendor will implement industry-standard security measures.

2. SERVICE LEVEL. Vendor commits to 99.5% monthly uptime, excluding scheduled maintenance. Client's sole remedy for downtime is a service credit equal to 5% of monthly fees per hour of unplanned downtime, capped at 25% of monthly fees.

3. FEES AND RENEWAL. Client shall pay the annual subscription fee in advance. This Agreement automatically renews annually unless Client provides written notice of cancellation at least sixty (60) days before renewal, and renewal pricing may increase by up to 8% year over year.

4. TERMINATION. Either party may terminate for uncured material breach with thirty (30) days' notice. Client data will be available for export for thirty (30) days post-termination, after which it will be permanently deleted.`,
  },
];

type Mode = "file" | "paste";

interface FormState {
  title: string;
  counterparty: string;
  type: string;
  department: string;
  ownerName: string;
  value: string;
  currency: string;
  effectiveDate: string;
  expirationDate: string;
  autoRenew: boolean;
  renewalNoticeDays: string;
}

const INITIAL_STATE: FormState = {
  title: "",
  counterparty: "",
  type: CONTRACT_TYPES[0],
  department: DEPARTMENTS[0],
  ownerName: "",
  value: "",
  currency: "USD",
  effectiveDate: "",
  expirationDate: "",
  autoRenew: false,
  renewalNoticeDays: "",
};

export function UploadForm() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("file");
  const [file, setFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canSubmit = useMemo(() => {
    const hasContent = mode === "file" ? !!file : pastedText.trim().length >= 50;
    return (
      hasContent &&
      form.title.trim().length >= 2 &&
      form.counterparty.trim().length >= 1 &&
      form.ownerName.trim().length >= 1 &&
      form.value.trim() !== "" &&
      form.effectiveDate.trim() !== "" &&
      !submitting
    );
  }, [mode, file, pastedText, form, submitting]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const f = files[0];
    const ext = f.name.toLowerCase().split(".").pop();
    if (!ext || !["pdf", "docx", "txt", "md"].includes(ext)) {
      setError("Unsupported file type. Please upload a PDF, DOCX, or TXT file.");
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setError("File exceeds the 10MB upload limit for this demo.");
      return;
    }
    setError(null);
    setFile(f);
  }

  function applySample(sample: (typeof SAMPLES)[number]) {
    setMode("paste");
    setPastedText(sample.text);
    setForm((prev) => ({
      ...prev,
      title: prev.title || sample.title,
      counterparty: prev.counterparty || sample.counterparty,
      type: sample.type,
      ownerName: prev.ownerName || "Demo User",
      value: prev.value || "120000",
      effectiveDate: prev.effectiveDate || new Date().toISOString().slice(0, 10),
    }));
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);

    try {
      const fd = new FormData();
      if (mode === "file" && file) {
        fd.append("file", file);
        // The server ignores `text` when a file is present, but validation requires it to be non-empty.
        fd.append("text", "placeholder placeholder placeholder placeholder placeholder placeholder placeholder");
      } else {
        fd.append("text", pastedText);
      }
      fd.append("title", form.title);
      fd.append("counterparty", form.counterparty);
      fd.append("type", form.type);
      fd.append("department", form.department);
      fd.append("ownerName", form.ownerName);
      fd.append("value", form.value);
      fd.append("currency", form.currency || "USD");
      fd.append("effectiveDate", form.effectiveDate);
      if (form.expirationDate) fd.append("expirationDate", form.expirationDate);
      fd.append("autoRenew", form.autoRenew ? "true" : "false");
      if (form.autoRenew && form.renewalNoticeDays) fd.append("renewalNoticeDays", form.renewalNoticeDays);

      const res = await fetch("/api/contracts", { method: "POST", body: fd });
      const data = (await res.json()) as { ok: boolean; contract?: Contract; error?: string };

      if (!data.ok || !data.contract) {
        setError(data.error ?? "Something went wrong while processing this contract.");
        setSubmitting(false);
        return;
      }

      router.push(`/contracts/${data.contract.id}`);
    } catch (err) {
      setError((err as Error).message || "Unexpected error while uploading.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-5">
      {/* Left: source */}
      <div className="space-y-5 lg:col-span-3">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Step 1 &middot; Source</CardTitle>
              <CardDescription>Upload a file or paste raw contract text.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <Tabs value={mode} onValueChange={(v) => setMode(v as Mode)}>
              <TabsList>
                <TabsTrigger value="file">Upload a file</TabsTrigger>
                <TabsTrigger value="paste">Paste text</TabsTrigger>
              </TabsList>

              <TabsContent value="file" className="mt-4">
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragActive(true);
                  }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragActive(false);
                    handleFiles(e.dataTransfer.files);
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl2 border-2 border-dashed px-6 py-12 text-center transition-colors",
                    dragActive
                      ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10"
                      : "border-ink-200 bg-ink-25 hover:border-brand-300 dark:border-ink-700 dark:bg-ink-900/40"
                  )}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx,.txt,.md"
                    className="hidden"
                    onChange={(e) => handleFiles(e.target.files)}
                  />
                  {file ? (
                    <>
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300">
                        <FileIcon className="h-6 w-6" />
                      </div>
                      <p className="text-sm font-medium text-ink-800 dark:text-ink-100">{file.name}</p>
                      <p className="text-xs text-ink-400">{(file.size / 1024).toFixed(0)} KB</p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFile(null);
                          if (fileInputRef.current) fileInputRef.current.value = "";
                        }}
                      >
                        <X className="h-3.5 w-3.5" />
                        Remove
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ink-100 text-ink-400 dark:bg-ink-800 dark:text-ink-500">
                        <UploadCloud className="h-6 w-6" />
                      </div>
                      <p className="text-sm font-medium text-ink-700 dark:text-ink-200">
                        Drag & drop a file, or click to browse
                      </p>
                      <p className="text-xs text-ink-400">PDF, DOCX, or TXT &middot; up to 10MB</p>
                    </>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="paste" className="mt-4">
                <Textarea
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder="Paste the full contract text here..."
                  className="min-h-[260px] font-mono text-[13px]"
                />
                <p className="mt-1.5 text-xs text-ink-400">
                  {pastedText.trim().length} characters {pastedText.trim().length < 50 ? "(minimum 50)" : ""}
                </p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>No file handy?</CardTitle>
              <CardDescription>Try a sample contract to see the ingestion pipeline run end to end.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-3 pt-4 sm:grid-cols-3">
            {SAMPLES.map((sample) => (
              <button
                key={sample.name}
                type="button"
                onClick={() => applySample(sample)}
                className="flex flex-col items-start gap-2 rounded-lg border border-ink-100 bg-white p-4 text-left transition-colors hover:border-brand-300 hover:bg-brand-50/40 dark:border-ink-800 dark:bg-ink-900 dark:hover:border-brand-500/40 dark:hover:bg-brand-500/5"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
                  <Wand2 className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-ink-800 dark:text-ink-100">{sample.name}</p>
                  <p className="mt-0.5 text-xs text-ink-400">Demo sample &middot; {sample.type}</p>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Right: metadata */}
      <div className="space-y-5 lg:col-span-2">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Step 2 &middot; Details</CardTitle>
              <CardDescription>Metadata used for portfolio tracking and search.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <Field label="Title" required>
              <Input value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="e.g. MSA - Acme Vendor" />
            </Field>
            <Field label="Counterparty" required>
              <Input value={form.counterparty} onChange={(e) => update("counterparty", e.target.value)} placeholder="e.g. Northwind Logistics Inc." />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Contract type" required>
                <Select value={form.type} onChange={(e) => update("type", e.target.value)}>
                  {CONTRACT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Department" required>
                <Select value={form.department} onChange={(e) => update("department", e.target.value)}>
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>
            <Field label="Owner name" required>
              <Input value={form.ownerName} onChange={(e) => update("ownerName", e.target.value)} placeholder="e.g. Jordan Blake" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Value" required>
                <Input
                  type="number"
                  min={0}
                  value={form.value}
                  onChange={(e) => update("value", e.target.value)}
                  placeholder="120000"
                />
              </Field>
              <Field label="Currency">
                <Input value={form.currency} onChange={(e) => update("currency", e.target.value.toUpperCase())} maxLength={3} />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Effective date" required>
                <Input type="date" value={form.effectiveDate} onChange={(e) => update("effectiveDate", e.target.value)} />
              </Field>
              <Field label="Expiration date">
                <Input type="date" value={form.expirationDate} onChange={(e) => update("expirationDate", e.target.value)} />
              </Field>
            </div>
            <label className="flex items-center gap-2 text-sm font-medium text-ink-700 dark:text-ink-200">
              <input
                type="checkbox"
                checked={form.autoRenew}
                onChange={(e) => update("autoRenew", e.target.checked)}
                className="h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-brand-500 dark:border-ink-600"
              />
              Auto-renews
            </label>
            {form.autoRenew ? (
              <Field label="Renewal notice period (days)">
                <Input
                  type="number"
                  min={0}
                  value={form.renewalNoticeDays}
                  onChange={(e) => update("renewalNoticeDays", e.target.value)}
                  placeholder="90"
                />
              </Field>
            ) : null}
          </CardContent>
        </Card>

        {error ? (
          <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        ) : null}

        <Button type="submit" size="lg" className="w-full" disabled={!canSubmit}>
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Parsing contract, classifying clauses, extracting risks...
            </>
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4" />
              Ingest contract
            </>
          )}
        </Button>
        <p className="text-center text-xs text-ink-400">
          <FileText className="mr-1 inline h-3 w-3" />
          Text is parsed, segmented into clauses, and risk-scored by the offline analysis engine. No data leaves this demo.
        </p>
      </div>
    </form>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactElement }) {
  const fieldId = useId();
  return (
    <div>
      <label
        htmlFor={fieldId}
        className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-400 dark:text-ink-500"
      >
        {label}
        {required ? <span className="text-red-500"> *</span> : null}
      </label>
      {cloneElement(children, { id: fieldId })}
    </div>
  );
}
