# C01 feasibility experiments

See `../../09-technical-feasibility.md` for results and reproduction steps.

- `fixtures/` — synthetic labeled test documents (HTML source in `docs.json`), tagged ground truth, untagged and scanned variants, `ground_truth.json`.
- `out/` — fixture predictions (Claude) and OpenDataLoader outputs (`out/odl`).
- `bench/` — real-document extraction on opendataloader-bench; `eval/` holds the benchmark's Apache-2.0 metric modules (copied, unmodified); `pred/` holds model outputs; `results-*.json`.
- `verify/` — defect injection, rule checker, semantic verifier, results on injected, subtle, and real auto-tagged cases; `summary.json`.
- `loop/` — closed-loop extract→tag→verify on real pages.
