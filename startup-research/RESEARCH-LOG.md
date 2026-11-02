# Research Log (resume point for compaction/interruption)

Date: 2026-11-02. Founder brief: Operation Zero. Output folder: startup-research/.

## Environment facts (verified 2026-11-02)
- Raw outbound HTTP from sandbox: BLOCKED by network policy (CONNECT 403) except npm/pypi registries.
- WebSearch tool: WORKS (standard + extended). Primary research engine.
- WebFetch tool: works for github.com / raw.githubusercontent.com only; ycombinator.com, news.ycombinator.com, reddit.com, arxiv.org, hn.algolia.com, thielfellowship.org all fail DNS (not in allowed domains).
- gh CLI / GitHub MCP: scoped to nb90386/anything only. Cannot read other repos via API (WebFetch of github.com pages works).
- No Perplexity access. No Brave/Search API keys. No Ollama installed. Node 22, Python 3.13, Playwright present.
- last30days-skill: needs direct network to Reddit/HN/etc. -> cannot run here. Roast Room / founder-skill: prompt-only personas; will reuse their perspective structure directly rather than installing (no network to clone; content read via WebFetch).

## Progress
- [x] Environment inventory
- [ ] Problem database (agents launched per domain; outputs in data/problems-*.json)
- [ ] Why-now discontinuities
- [ ] Candidates + scoring
- [ ] Competitive analysis top 8
- [ ] Red team top 3
- [ ] Feasibility experiment
- [ ] Market/validation/plan/architecture/YC-Thiel
- [ ] Executive decision + commit

## Constraint discovered 2026-11-02
- WebSearch budget: 200 calls per turn, shared by all agents. The 14 discovery agents exhausted it within the first fan-out. Agents must finish with what they gathered; later phases must be budgeted (~200 searches per user turn). Mitigation: fewer, better-briefed agents per phase; prioritize kill-evidence and competitor checks over breadth.

## 2026-11-02 — Candidates and scoring
- 24 candidates written (04-opportunity-longlist.md), scored (07-scoring-model.csv, tools/score.py). Base ranking: C01 73.5, C02 68.5, C07 65.5, C06 64.5, C03 63.5, C04 61.5, C05 60.0, C11 58.5. Hard rejects: C16 (CROA), C19, C20, C22, C23, C24.
- CAUTION: C01 wins 100% of 222 weight perturbations. That is a sign the scorer (me) may be anchored; competitive analysis and red team must try to kill C01 specifically. Scores are subjective judgments; all justifications are in the CSV.
- Top 8 for competitive analysis: C01, C02, C07, C06, C03, C04, C05, C11.
