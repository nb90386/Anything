# 01 — Research Methodology

Date: 2026-11-02 (session start). Founder brief: "Operation Zero".

## 1. Environment inventory (VERIFIED 2026-11-02)

| Capability | Status | Notes |
|---|---|---|
| WebSearch (standard/extended) | Available | Primary discovery engine. Server-side; not subject to sandbox egress policy. |
| WebFetch | Partial | Works for github.com and raw.githubusercontent.com. ycombinator.com, news.ycombinator.com, reddit.com, arxiv.org, hn.algolia.com, thielfellowship.org fail DNS (outside allowed domains). |
| Raw HTTP (curl/node/python) | Mostly blocked | CONNECT 403 for news/forum/government hosts. Allowed: npm and PyPI registries, raw.githubusercontent.com, and `git clone` of public GitHub repositories (discovered on day 2; used to obtain opendataloader-bench and the veraPDF corpus). |
| GitHub API / gh CLI | Scoped | Only nb90386/anything. Cannot read other repos through the API. |
| Perplexity / Sonar / Deep Research | Not available | No key, no MCP. Not used. No access invented. |
| Brave / search API keys | None | — |
| Parallel subagents (Agent tool) | Available | Used for domain research fan-out (14 agents in discovery phase). |
| Node 22, Python 3.13, Playwright, Chromium | Installed | Used for local scripts and experiments. |
| Ollama / local models | Not installed in sandbox | Founder has it locally; not used here. |
| Claude Max, ChatGPT Plus, Vercel, Supabase, DO VPS | Founder-owned | Not touched from this session. |
| MCP servers | GitHub (scoped), Notion, Canva, Gmail, Google Drive, Claude Docs | None used for research; Gmail/Drive not read (no authorization to use personal data). |
| last30days-skill (mvanhorn) | Inspected, NOT installed | 66k stars, MIT. Requires direct network to Reddit/HN/X — impossible in this sandbox. Its "score by engagement" idea is applied manually via WebSearch extended mode. |
| roast-room (nateherkai) | Inspected, NOT installed | 1.8k stars, MIT, Node server + Python optional pipeline, prompt-driven persona council ("simulations of Bezos/PG/Hormozi/Buffett..."). Could not clone (no network). Its persona-council structure is replicated with the 8 skeptical perspectives required by the brief; simulated figures are never presented as endorsements. |
| founder-skill (Jakeschincariol) | Inspected, NOT installed | 2.4k stars, MIT, 11 prompt skills + 4 stdlib Python tools (unit economics, Van Westendorp, simulated panel). Its competitor/CFO/pricing/launch structure is reused as a checklist; its simulated consumer panel is explicitly NOT used as demand evidence. |
| Vercel agent skills | Not installed | Deferred until implementation; no implementation work in this session. |

Security note: no third-party code was executed. No accounts created, nothing purchased, no messages sent.

## 2. Process

1. Problem discovery before ideas. 12 domain agents + 1 wildcard agent, each briefed with `data/AGENT_BRIEF.md` and the record schema `data/PROBLEM_SCHEMA.json`. Each writes `data/problems-<DOMAIN>.json` and a short summary. Sources must be URLs that appeared in search results; quotes are paraphrased; no fabrication.
2. Why-now research in parallel (`data/why-now-discontinuities.md`) and YC/Thiel context (`data/yc-thiel-context.md`).
3. Merge + deduplicate into `02-problem-database.csv` with a local script (`tools/merge_problems.py`).
4. Candidate generation (20–30) from the problem database, 16 fields each → `04-opportunity-longlist.md`.
5. Scoring with the brief's weighted framework → `07-scoring-model.csv` (+ `tools/score.py` with sensitivity analysis). Hard-rejection rules applied before scoring.
6. Competitive analysis for the top 8 (agents) → `05-competitive-analysis.md`.
7. Red team the 3 finalists with 8 adversarial perspectives → `08-red-team-verdicts.md`.
8. Technical feasibility experiment on the riskiest assumption of the top 1–2 → `experiments/` + `09-technical-feasibility.md`.
9. Market sizing, validation plan, 90-day plan, architecture, investor assessment.
10. Executive decision written last, placed first.

## 3. Evidence labels used throughout

- VERIFIED: supported by a credible source found in this session (URL recorded) or an observed test.
- INFERRED: reasoned conclusion from available evidence.
- ASSUMED: input not yet confirmed.
- UNVALIDATED: critical claim requiring real-world testing with real people.

Source types: firsthand_complaint, primary_statistic, published_study, industry_commentary, speculation.

## 4. Known limitations of this research session

- No direct reads of Reddit/HN threads; firsthand complaints are reached through search-engine snippets and syntheses, which lowers quote fidelity. Everything firsthand is paraphrased.
- No Perplexity cross-check.
- YC RFS and Thiel FAQ pages could not be fetched directly; reconstructed from secondary coverage and labeled as such.
- No customer interviews occurred. All commercial validation is PENDING until the founder talks to real people.

## 5. Changes during the session

- Day 1: the shared per-turn WebSearch budget (200 calls across all agents) was exhausted by the first 14-agent fan-out. Later phases used fewer, better-briefed agents (8 competition agents, 1 red-team agent).
- Day 1→2: the account's 5-hour usage limit interrupted one competition agent and the experiment; both resumed after reset. The model serving the session changed from Fable 5.1 to Opus 5.5 at the user's direction.
- Day 2: discovering that public GitHub repos could be cloned made a real-document benchmark possible (09).
- Scoring was run twice: pass 1 from desk research, pass 2 after competitive analysis and experiments (07). The winner's score fell from 73.5 to 66.0; the ranking of the top two did not change under any of 222 weightings in either pass, which reflects my scoring and should be read as judgment, not measurement.
