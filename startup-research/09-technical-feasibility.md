# 09 — Technical Feasibility

Date: 2026-11-02/03. All code, inputs and raw outputs are in `experiments/c01-accessible-pdf/`. Every number below was produced by code in that folder in this session. Nothing here involved real users, customers, or private data.

## 1. Riskiest assumptions tested

The leading candidate began as "a vision-language model remediates PDFs better than existing tools". Competitive analysis showed free and incumbent engines already do this. So two assumptions were tested, in this order:

1. **The original invention:** is a VLM materially better than the best free engine at recovering document structure from real PDFs? If yes, the engine is the moat.
2. **The refined invention:** can an automated semantic verifier detect the tagging errors that make a PDF unusable to a screen-reader user, which syntax-level checks pass? If yes, an independent verification layer is technically possible.

A third measurement estimated the cost driver: the share of pages an automated fix-and-verify loop cannot clear without a human.

## 2. Setup

| Item | Detail |
|---|---|
| Synthetic fixtures (labeled as such) | 5 single-page documents written in HTML to resemble a benefits notice, a syllabus, a city agenda, a two-column report and a form. Rendered by Chromium to tagged PDFs, which serve as ground truth. Variants: untagged (tags stripped with pikepdf; text kept) and scanned (rasterized at 200 dpi; no text). |
| Real documents | `opendataloader-bench` (Apache-2.0, cloned from GitHub): 200 real-world single-page PDFs with ground-truth Markdown and published per-document scores for 12 engines. A deterministic random sample (seed 42) of 32 pages was used: 14 with tables, 14 with headings, 4 plain text. |
| Scorer validation | The benchmark's own metric modules (reading order NID, table TEDS, heading MHS) were copied with attribution and driven by our script. They reproduced the published per-document scores of two engines exactly (max difference 0.0). |
| Models | Claude Sonnet 5.5 and Claude Haiku 5.5 via the Claude Code CLI in headless mode. Cost figures are the CLI's reported API-equivalent cost per call. |
| Baselines | OpenDataLoader PDF 2.x installed from PyPI (local Java engine; tagged-PDF output). A deterministic rule checker approximating PDF/UA machine checks (struct tree present, language set, untagged text, first heading H1 and skipped levels, tables without header cells, figures without alt). veraPDF itself could not be installed in this sandbox, so the rule checker is a stand-in. |

## 3. Experiment A — structure extraction on real documents

Same 32 pages for every engine. One Sonnet page failed because the API blocked the output with a content filter while transcribing a page from a copyrighted book; results are shown with and without it.

| Engine | Overall | Reading order (NID) | Tables (TEDS) | Headings (MHS) | Cost/page | Time/page |
|---|---|---|---|---|---|---|
| Claude Sonnet 5.5 (n=31, filter failure excluded) | 0.906 | 0.921 | 0.929 | 0.876 | $0.062 | 9.7 s |
| Claude Sonnet 5.5 (n=32, failure scored as is) | 0.878 | 0.894 | 0.929 | 0.832 | $0.062 | 9.7 s |
| Claude Haiku 5.5 (n=32) | 0.873 | 0.892 | 0.911 | 0.827 | $0.004 | 13.4 s |
| OpenDataLoader hybrid (published scores, same pages) | 0.892–0.895 | 0.903–0.906 | 0.914 | 0.868–0.873 | free (CPU) | 0.46 s |
| marker | 0.883–0.886 | 0.899–0.902 | 0.893 | 0.849–0.853 | free | slow |
| docling | 0.852–0.856 | 0.864–0.867 | 0.841 | 0.846–0.852 | free | 0.76 s |
| OpenDataLoader default | 0.753–0.760 | 0.844–0.848 | 0.419 | 0.823–0.831 | free | 0.015 s |

On the synthetic fixtures, Sonnet recovered structure almost perfectly (mean content recall 0.95–1.0, role accuracy 1.0, reading order 1.0, table cells 1.0), on both untagged and scanned variants. OpenDataLoader's default mode recovered nothing from scanned pages (no OCR without its hybrid server) and had heading F1 0.705 on untagged pages.

**Result: the original invention fails.** A frontier VLM is at parity with the best free engine on real pages (difference within noise at n=31). It costs about $0.06 per page against roughly zero, or $0.004 per page with Haiku at slightly lower quality. Structure extraction is a commodity and cannot be the moat. Two notes for the product: a content filter can block verbatim transcription of copyrighted material, and one page scored low because Sonnet turned a bar chart into a data table, which is arguably better for accessibility but penalized by an extraction benchmark.

## 4. Experiment B — semantic verification versus rule checks

Defects were injected into the correctly tagged fixtures with pikepdf. The visual page is unchanged; only the tag tree is wrong. This is the failure mode a sighted reviewer cannot see.

- **Blanket defects (27):** all H2 tagged as P; all H2 tagged as H4; top-level sections reversed; all TH tagged as TD; lists tagged as Div/P; one paragraph removed from the tag tree.
- **Subtle defects (15):** one H2 tagged as P; one adjacent swap; one TH tagged as TD; one LI tagged as P.
- **Clean controls (5):** the untouched tagged originals.

The semantic verifier sees the rendered page image plus the tag tree serialized in screen-reader order and reports mismatches by category and severity. Only "major" findings count as detections.

| Test | Semantic verifier (Sonnet) | Semantic verifier (Haiku) | Rule checker |
|---|---|---|---|
| Blanket defects detected | 27/27 = 100% (95% CI 87–100%) | 24/27 = 89% (71–98%); the 3 misses were list defects it reported as minor | 13/27 = 48% (29–68%) |
| Subtle defects detected | 13/15 = 87% (60–98%) | 11/15 = 73% (45–92%) | 0/15 = 0% (0–22%) |
| False flags on clean controls | 0/5 (0–52%) | 0/5 | 0/5 |
| Cost per page | $0.059 | $0.004 | ~0 |

The rule checker catches what syntax can catch: skipped heading levels, missing header cells, untagged text. It passes every case where headings are tagged as paragraphs, lists are flattened, or reading order is wrong, because those are valid tags with wrong meaning.

## 5. Experiment C — verifying real auto-tagged output

The 32 real benchmark pages were auto-tagged by OpenDataLoader (free engine, tagged-PDF output). Both verifiers then judged the tagged PDFs. Ground truth for "this page has a real table/heading defect" comes from the benchmark: TEDS < 0.85 or MHS < 0.85 for OpenDataLoader's own output on that page.

| Measure | Semantic verifier (Sonnet) | Rule checker |
|---|---|---|
| Pages with defective tables flagged (table_headers) | 8/10 = 80% (44–97%); 9/10 if a "missing content" flag counts | 0/10 |
| Pages with defective heading structure flagged | 3/5 = 60% (15–95%) | 0/5 |
| False flags on correct tables and heading structures | 0/19 (0–18%) | n/a |
| Pages flagged for anything | 23/32 | 32/32 (missing language tag on every output, a real but trivial defect) |

On the five synthetic untagged fixtures, OpenDataLoader's tagged output passed the rule checker 4 times out of 5. The semantic verifier flagged real problems on all 5, and each flag matched an error our structural scorer measured independently: headings missed, lists flattened to paragraphs, form content dropped.

## 6. Experiment D — closed loop: what still needs a human?

Sonnet's extracted Markdown for 31 real pages was converted to semantic HTML, rendered by Chromium to tagged PDFs, and judged by the semantic verifier against the original page image.

| Outcome | Pages |
|---|---|
| No major finding | 22/31 |
| Major finding of any kind | 9/31 = 29% (95% CI 14–48%) |
| Major finding other than missing alt text | 4/31 = 13% (4–30%) |

Six of the nine flags were missing alt text. The extraction prompt told the model not to describe images, so these flags are a fixable pipeline artifact. The rule checker also flagged skipped heading levels on many outputs because the Markdown used ## without #, another pipeline fix. The remaining structural flags were one table, one list, and two content/order issues.

## 7. What this does and does not prove

Proven in this session (VERIFIED by observed test):
- Structure extraction by a VLM is roughly equal to the best free engine on real single-page documents. The engine is not a moat.
- An LLM semantic verifier catches classes of tagging errors that syntax-level checks structurally cannot, on both injected and naturally occurring defects, at $0.004–$0.06 per page.
- Real auto-tagged output from a leading free engine routinely contains semantic errors that a syntax check passes.
- An automated extract→tag→verify loop clears most single pages; roughly 13–29% are left for human review, depending on alt-text handling.

Not proven (UNVALIDATED):
- **Agreement with blind users.** Every ground truth here is a proxy (tag trees or extraction benchmarks). Nobody has checked whether the verifier's verdicts match what NVDA, JAWS or VoiceOver users actually experience on task completion. This is the decisive technical test.
- **Real-document false-positive rate.** The confidence intervals are wide (0/19 still allows up to 18%). A false-flag rate above about 5% makes human review costs dominate (see 06).
- **Multi-page documents.** Agenda packets are hundreds of pages. Cross-page reading order, split tables, document-wide heading hierarchy, bookmarks and links were not tested.
- **Forms.** AcroForm field labels and tab order were not tested, and forms are the documents that stay mandated.
- **Test-taxonomy leakage.** The injected defects came from the same taxonomy the verifier prompt uses. A blind test set built by someone else is needed.
- **Judge independence.** When the same model family extracts and verifies, the two can share blind spots. A cross-family verifier, or human calibration, is needed.
- **Run-to-run variance** was not measured.

## 8. Reproduce

```
cd startup-research/experiments/c01-accessible-pdf
node render.js && python3 gt_and_strip.py          # fixtures + ground truth
python3 infer.py claude-sonnet-5-5 untagged,scanned  # fixture extraction
python3 score.py                                     # fixture scoring
python3 bench/run_bench.py <opendataloader-bench path> claude-sonnet-5-5 14 14 validate   # scorer check
python3 bench/run_bench.py <opendataloader-bench path> claude-sonnet-5-5 14 14            # real-page extraction
python3 verify/make_cases.py && python3 verify/make_subtle.py
python3 verify/run_verify.py claude-sonnet-5-5 manifest.json && python3 verify/run_verify.py claude-sonnet-5-5 manifest_subtle.json
python3 verify/run_real.py <opendataloader-bench path> && python3 loop/run_loop.py <opendataloader-bench path>
python3 verify/summarize.py
```

Dependencies: Python 3.13 (pikepdf, pdfplumber, pypdfium2, rapidfuzz, apted, lxml, beautifulsoup4, markdown, opendataloader-pdf, scipy for intervals), Node 22 with Playwright/Chromium, Java (for OpenDataLoader), and the `claude` CLI. The benchmark repo is not vendored; clone `github.com/opendataloader-project/opendataloader-bench`.

## 9. Total experiment cost

Roughly 230 model calls, about $9 at the CLI-reported API-equivalent rate, all within the existing subscription. No paid accounts were created.
