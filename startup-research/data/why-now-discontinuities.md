# Why-Now: Structural Discontinuities, late 2026

Compiled 2026-11-02. Purpose: evidence base for judging "why now" on startup candidates.

**Evidence labels.** `[V]` = number/date appeared in a search result or GitHub page fetched in this run; URL in Sources. `[KB]` = analyst knowledge (cutoff mid-2026), NOT verified in this run, no URL; treat as a lead to confirm. `[C]` = sources conflict. Status: shipped / announced / rumored.

**Method limit.** The shared web-search budget was exhausted after 16 searches; remaining facts came from GitHub READMEs (the only other fetchable host). Sections 7–10 and 12 are therefore thinner and lean on `[KB]`. Several 2026 pricing/benchmark roundups are SEO aggregators with inconsistent model names; I report only numbers that recur across them and flag the rest.

---

## 1. Inference cost curve (shipped)

| Tier | Mar 2023 | 2025 | Oct 2026 (reported) |
|---|---|---|---|
| Frontier flagship | GPT-4: $30 in / $60 out per 1M `[V]` | Opus 4-class ~$15/$75; GPT-4o $5/$15 (May 2024) `[V]` | Claude Opus 5.5 $4/$20; Sonnet 5.5 $2/$10; Gemini 3.1 Pro $2/$12 (<200K ctx); "GPT-6 Sol" $2/$10 `[V][C]`; top-end Fable 5.1 $10/$50 `[V]` |
| Budget tier | GPT-3.5 ~$2/$2 `[KB]` | Gemini Flash-Lite ~$0.10 in `[V]` | Haiku 5.5 $0.10/$0.50 (<100K prompt; 5x above that) `[V]`; "GPT-6 Luna" $0.10/$0.50 `[V][C]` |
| Open-weight hosted | n/a | Llama 3.3 70B $0.10/$0.32 (DeepInfra) `[V]` | gpt-oss-120B $0.037/$0.17 (DeepInfra) or $0.15/$0.60 (Groq/Together) `[V][C]`; DeepSeek V4-Flash $0.09–0.10 / $0.18–0.20; V4 Pro $1.30/$2.60 DeepInfra vs $1.74/$3.48 Together/Fireworks `[V]`; Qwen3 235B $0.09/$0.10 DeepInfra `[V]` |

- Discounts stack: Anthropic Batch = 50% off all five current models; cache reads ~0.1x input (Sonnet 5.5 cache read cut to $0.10 on 2025-10-07… reported as "October 7", year ambiguous) `[V]`. Groq: batch and caching each halve the rate and stack `[V]`.
- GPT-4-class quality: $60 → ~$0.20–0.40 output per 1M, i.e. 150–300x in 3.5 years `[V]`. Epoch-style estimates: 10x–50x/yr at constant capability `[V]`. **Flagship price has not fallen**—it has stayed $30–60 out at the frontier until this year's $20–25 flagships `[V]`.
- Caveat: reasoning models consume far more tokens per task, which partly offsets per-token declines `[V]`.

**Solo-founder enablement:** a product doing 10M output tokens/month on a Sonnet-class model costs ~$100 (batch ~$50); on open-weight ~$2–5. Unit economics that killed 2023 "GPT-wrapper" ideas now clear at consumer price points.

## 2. Open-weight SOTA, Oct 2026 (shipped)

| Model | Size | License | Notes |
|---|---|---|---|
| Kimi K3 (Moonshot) | 2.8T MoE (reported) | prev. K2: Modified MIT `[V]` | "Top open model" in Oct roundups; 88.3 Terminal-Bench 2.1 `[V]` (aggregator; unverified) |
| DeepSeek V4 Pro / Flash | n/s | V3.2 was MIT `[V]` | Reported to match frontier on SWE-bench Verified at a fraction of cost `[V]`; 1M-context Flash for cheap throughput |
| Qwen3.8-2.4T-A95B (2026-08-12) and Qwen3.8-27B (2026-08-14) | 2.4T MoE / 27B dense | Apache-2.0 (repo; weights per HF card) `[V]` | 262,144-token context `[V]`; a "Qwen3.8 Max" tops OSWorld-Verified per one tracker `[V][C]` |
| gpt-oss-120B / 20B | 117B (5.1B active) / 21B (3.6B active) | Apache-2.0 `[V]` | 120B fits one 80GB GPU (MXFP4); 20B "runs within 16GB" `[V]` |
| Gemma 4 | E2B, E4B, 26B-A4B, 31B `[V]` | Gemma terms (n/s) | Gemma 3n E2B/E4B is the on-device line: text+image+video+audio `[V]` |
| Llama 4 Scout/Maverick (2025-04-05) | 17B active, 16E/128E | Llama license (700M-MAU clause `[KB]`) | 10M / 1M context `[V]`; largely absent from 2026 leaderboards `[V]` |
| Mistral Small 3.1 24B | 24B | n/s (Apache per `[KB]`) | mistral-inference repo now archived `[V]` |

- Gap to frontier: ~20 points on a general index (Sept 2026 comparison) but parity on coding (SWE-bench) `[V]`. Chinese labs dominate the open frontier `[V]`.
- Runs on a 16GB Mac: Qwen 3.5 9B Q4 (~6.6GB, 20–40 tok/s), Qwen3 8B, Llama 3.1 8B, Phi-4-mini (2.5GB, ~46 tok/s on M3 Pro) `[V]`. 4GB VPS CPU-only: nothing tested in sources; only 2–3GB Q4 models (Phi-4-mini, Qwen 3.5 4B) are plausible `[V]` (inference, not measurement).

**Specialized small models**
- Document OCR: OmniDocBench v1.6 leaders—PaddleOCR-VL-1.6 96.33 (vendor), MinerU2.5-Pro 95.75, GLM-OCR 95.15, ABot-OCR 93.3, dots.ocr 90.5, DeepSeek-OCR-2 90.17 `[V][C]`. PP-OCRv5 is 5M params and SOTA among specialized OCR models `[V]`. DeepSeek-OCR (MIT, 2025-10-20; OCR-2 2026-01-27) ~2,500 tok/s on one A100-40G `[V]`.
- Handwriting: still unsolved. WildHandBench (2026): best model 71.85% vs human 77.09% across 18 models; errors "prior-driven" `[V]`. Vendor "Good" handwriting ratings are qualitative `[V]`. **Test on your own documents.**
- Speech: NVIDIA Parakeet-tdt-0.6b-v3 (25 European languages, Aug 2025), Parakeet-unified-en-0.6b (offline + streaming, 160ms min latency, Apr 2026), Canary-Qwen-2.5B 5.63% WER on Open ASR Leaderboard `[V]`; NeMo Apache-2.0 `[V]`. Per-hour cloud pricing: not retrieved this run.
- Embeddings/rerankers: not retrieved this run `[KB]`: Qwen3-Embedding/Reranker (Apache-2.0) and bge families remain the default self-host choice.

## 3. Local / offline intelligence (shipped)

- llama.cpp: Metal, CUDA, Vulkan, HIP, SYCL, OpenCL, WebGPU; NPU paths for Huawei Ascend (CANN), Intel NPU (OpenVINO, in progress), Snapdragon Hexagon; 1.5–8-bit quants; VLM + audio; CPU+GPU hybrid offload; OpenAI-compatible `llama serve` `[V]`.
- Ollama: `ollama launch` wires local models into Claude Code, Codex, Copilot CLI, OpenCode etc.; MLX runtime default on Apple Silicon since 0.40 `[V]`.
- Apple Foundation Models (iOS 26): ~3B on-device, 2-bit QAT, ~4,096-token session, A17 Pro/M1+, no entitlement; weak at world knowledge/reasoning; guardrails `[V]`. Reported 2026: 20B sparse "Core Advanced" (1–4B active) on iPhone 17 Pro and third-party provider support at WWDC 2026 `[V]` (unconfirmed against Apple docs).
- Speech on-device: whisper.cpp (Core ML/ANE >3x speedup; tiny 273MB → large 3.9GB RAM; diarization only experimental speaker-turn tagging) `[V]`; sherpa-onnx (streaming ASR, TTS, **speaker diarization**, VAD; Android/iOS/WearOS/RPi/Jetson/RK3588; Rockchip/Qualcomm/Ascend/OpenVINO NPUs; Apache-2.0) `[V]`.
- What doesn't run well locally: >14B dense on 16GB without offload `[V]`; multi-speaker labeled diarization in whisper.cpp `[V]`; long-context reasoning on phone-class models (4K window) `[V]`.

**Enablement:** a privacy-first, zero-marginal-cost app (transcription, document capture, form-filling) with no inference bill is now a weekend build.

## 4. Agent reliability (shipped, benchmarks saturating)

| Benchmark | 2023/24 baseline | Oct 2026 |
|---|---|---|
| OSWorld-Verified | GPT-4o ~12% (15 steps) `[KB]` | Qwen3.8 Max 86.1%, Claude Fable 5 / Mythos 5 85% (BenchLM 2026-10-29); framework run 90.19% (100 steps); above human baseline (~72%) `[V][C]` |
| OSWorld 2.0 | n/a | GPT-6 Astra 72.6% vs Opus 4.8 20.6% binary / 54.8% partial at 500 steps `[V][C]`—metrics differ; treat as unsolved |
| WebArena | 812 tasks; GPT-4 ~14% `[KB]` | leaderboard not retrieved |
| tau2-bench | retail/airline/telecom pass^k | v2.0 adds banking, intake (200+ tasks), 6 languages, voice; 2.0 scores not comparable to 1.x `[V]` |
| METR time horizon | — | doubling ~every 7 months (50% success) `[V]`; latest horizon values not retrieved |

- Failure modes documented: step-limit sensitivity, binary vs partial-credit gaps, vendor self-reporting (Coasty 82–85.6% unverified) `[V]`; tau2 moved to semantic LLM judges because substring checks were brittle `[V]`.
- Coding productivity: METR's 2025 RCT found experienced devs 19% slower with AI while believing 20% faster; Feb 2026 update says speedups "now seem likely" but 30–50% of devs withheld tasks, making results unreliable (CI −38% to +9%) `[V]`.

**Enablement:** desktop/browser automation on "verified" task distributions is near-human; long-horizon (OSWorld 2.0) is not. Build products around short, verifiable loops with eval harnesses, not open-ended autonomy.

## 5. Agent protocols and plumbing

| Item | Status | Facts |
|---|---|---|
| MCP | shipped | Spec schema dated 2026-07-28 `[V]`; registry preview since 2025-09-08, API v0.1 freeze 2025-10-24, GitHub OIDC/DNS/HTTP namespace verification `[V]`; ~3,012 official-registry servers Mar 2026, 9,599 names by May 2026 `[V]`; 382 NVD CVEs mention MCP (324 in 2026), e.g. CVE-2026-33032 CVSS 9.8 `[V]`; 9 of 11 public registries compromisable (OX) `[V]`; only 8.5% of registry servers use OAuth `[V]`; 67,057-server arXiv study found hijack conditions `[V]`. |
| A2A | shipped | Linux Foundation, Google-contributed, Apache-2.0, SDKs in 6 languages, Agent Cards `[V]` |
| Agent Skills (SKILL.md) | shipped | Open spec at agentskills.io; Claude Code/claude.ai/API; repo 186.8k stars `[V]`; Stripe ships skills + plugins for Claude Code/Codex/Cursor `[V]` |
| OpenAI Apps SDK | shipped (dev mode) | ChatGPT apps = MCP servers returning widgets via `_meta.ui.resourceUri`; no public directory/submission process on README `[V]` |
| ACP (OpenAI+Stripe) | beta | releases 2025-09-29 → 2026-04-17 (cart, feed, orders, auth, MCP) `[V]` |
| AP2 (Google) | shipped, SDK not on PyPI | Apache-2.0; partners not listed on README `[V]` |
| x402 (Coinbase → x402 Foundation) | shipped | HTTP 402 flow, `exact`/`upto`/batch-settlement schemes, multi-chain SDKs, `@x402/mcp` `[V]` |
| Visa Intelligent Commerce / Mastercard Agent Pay | announced `[KB]` | not retrieved this run |
| Agent auth | preview | Auth0 AI: user auth for agents, API calls on behalf of users, RAG authorization, async confirmation; "under heavy development" `[V]`; Stripe remote MCP with OAuth `[V]` |

**Enablement:** distribution + payments + identity primitives exist but are immature and insecure—a wedge for security, registry-curation, and auth tooling.

## 6. Multimodal (shipped)

- Documents: see §2—specialized 1–5B OCR models beat generalist VLMs on layout benchmarks at ~2,500 tok/s per A100 `[V]`.
- Speech: 0.6B models do 25-language streaming at 160ms `[V]`; diarization on-device via sherpa-onnx `[V]`; accents/noisy real-world WER not retrieved.
- Video: Gemma 3n accepts video+audio on-device `[V]`; cloud video pricing not retrieved `[KB]`.
- Physical-world vision: VLA policies (pi0, pi0.5, SmolVLA) open in LeRobot; SO-101 arm BOM $121.94 (follower) / $229.88 (pair), STS3215 servos, Apache-2.0 `[V]`.

## 7. Regulatory deadlines (compliance demand)

| Rule | Deadline | Status |
|---|---|---|
| EU AI Act Art. 50 transparency (chatbot/synthetic-content disclosure) | **2026-08-02** (in force); legacy systems to 2026-12-02 `[V]` | shipped |
| EU AI Act Annex III high-risk | moved to **2027-12-02**; Annex I products **2028-08-02** (Reg. 2026/1744, OJ 2026-07-24) `[V]` | shipped (deferral, not repeal) |
| EU Cyber Resilience Act | reporting 2026-09-11; full 2027-12-11 `[KB]` | unverified |
| ADA Title II web/app accessibility (WCAG 2.1 AA) | 2026-04-24 (large entities), 2027-04-26 (small) `[KB]` | unverified |
| Colorado AI Act | delayed to 2026-06-30 `[KB]` | unverified |
| California SB 53 (frontier transparency) | signed 2025-09 `[KB]` | unverified |
| Texas TRAIGA | 2026-01-01 `[KB]` | unverified |
| CMS-0057-F prior-auth APIs | 2027-01-01 `[KB]` | unverified |
| CMMC 2.0 phase-in | from 2025-11-10 `[KB]` | unverified |
| Medicaid work requirements (OBBBA) | 2027-01-01 `[KB]` | unverified |
| CFPB 1033 open banking | rule under reconsideration after 2025 litigation `[KB]` | uncertain |

**Enablement:** Art. 50 is live now for every EU-facing chatbot; high-risk tooling has 13 months of runway—build the "AI Act documentation" product in 2027, sell transparency/labeling today.

## 8. Labor economics

- Stanford "Canaries" Aug 2026 update: 22–25-year-olds in most-AI-exposed jobs are 19% below peers (was 13%); employment down ~11% since 2022 in the 40% most-exposed jobs vs +10% in least-exposed; driven by hiring freezes, not layoffs; pay flat `[V]`. Attribution contested `[V]`.
- BLS 2026 series, trades/healthcare-admin wages: not retrieved `[KB]`.

**Enablement:** juniors are the unhired cohort → founders and customers alike; "replace the junior analyst" is now a validated demand story.

## 9. Hardware / energy (not retrieved; `[KB]` only)

GPU cloud: H100 ~$1.79/hr on DeepInfra `[V]`. DRAM/HBM price spikes, grid-interconnect queues and GPU availability were not searchable this run. Robotics: see §6 ($122 arm) `[V]`.

## 10. Open data infrastructure (`[KB]` only)

TEFCA QHIN go-live, CMS interoperability APIs, open-banking status: not retrieved. Hugging Face hosts "thousands" of robotics datasets in LeRobotDataset format `[V]`.

## 11. Cost of building software

- Claims vs measurement: METR 2025: −19%; 2026: likely positive but unmeasurable due to task-selection bias `[V]`. "93% adoption, ~10% gains" framing circulates `[V]`.
- Protocol/skills ecosystems (MCP, Skills, Apps SDK) make integrations copyable in days `[V]`. **Implication:** code is not a moat; data access, distribution slots, regulatory trust, and eval harnesses are.

## 12. Consumer adoption

- ChatGPT: 900M weekly users, 50M paid (OpenAI, Feb 2026) `[V]`; 1.2B WAU claimed for DevDay 2026-09-29 (no primary source found) `[V][C]`.
- Claude: paid subscriptions "more than doubled" since 2026-01-01 (Anthropic, Mar 2026) `[V]`; third-party MAU estimates 18M–271M; Sensor Tower 245M (May 2026) `[V][C]`.

## 13. Distribution channels

- ChatGPT apps via Apps SDK/MCP (dev mode; directory process undocumented) `[V]`; ACP checkout inside ChatGPT (beta) `[V]`.
- Claude: Skills marketplaces (`/plugin marketplace add`), Notion partner skills, Claude Code plugins `[V]`.
- MCP official registry (preview) + Smithery (dominant, unverified) `[V]`.
- Ollama `launch` integrations; Stripe plugins for Claude Code/Codex/Cursor/Grok Build `[V]`.
- TikTok/other social: not retrieved.

---

## Sources (all URLs appeared in this run's results)

Pricing: https://www.spheron.network/blog/llm-api-pricing-comparison-gpt-claude-gemini-deepseek-2026/ · https://www.morphllm.com/llm-api · https://benchlm.ai/blog/posts/llm-pricing-2026 · https://benchlm.ai/anthropic/api-pricing · https://www.finout.io/blog/anthropic-api-pricing · https://www.maximem.ai/blog/claude-api-pricing-2026 · https://www.morphllm.com/comparisons/groq-vs-deepinfra · https://costbench.com/software/llm-api-providers/deepinfra/ · https://capitalandcompute.net/ai-inference-providers/groq/ · https://pricepertoken.com/pricing-page/model/openai-gpt-4 · https://capitalandcompute.net/blog/cost-per-token-over-time/ · https://tokencostcalculator.pages.dev/llm-price-history/
Open weights: https://www.morphllm.com/best-open-source-llm · https://kingy.ai/news/best-open-weight-ai-models-in-2026-glm-5-2-vs-deepseek-v4-vs-kimi-k2-6-vs-qwen-vs-mistral/ · https://arxiv.org/pdf/2508.03153 · https://github.com/openai/gpt-oss · https://github.com/QwenLM/Qwen3.5 · https://github.com/MoonshotAI/Kimi-K2 · https://github.com/deepseek-ai/DeepSeek-V3.2-Exp · https://github.com/meta-llama/llama-models · https://github.com/google-gemini/gemma-cookbook · https://github.com/mistralai/mistral-inference
OCR/speech: https://arxiv.org/pdf/2608.22959 · https://regolo.ai/deepseek-ocr-vs-glm-ocr-vs-paddleocr-benchmark-2026/ · https://www.spheron.network/blog/best-open-source-ocr-vlm-self-host-gpu-cloud-2026/ · https://arxiv.org/pdf/2605.27978 · https://arxiv.org/pdf/2603.24373 · https://blog.roboflow.com/best-open-source-ocr-models/ · https://github.com/deepseek-ai/DeepSeek-OCR · https://github.com/NVIDIA-NeMo/NeMo · https://github.com/ggml-org/whisper.cpp · https://github.com/k2-fsa/sherpa-onnx
Local: https://github.com/ggml-org/llama.cpp · https://github.com/ollama/ollama · https://insiderllm.com/guides/best-local-llms-mac-2026/ · https://localaimaster.com/mac/best-llm-16gb-mac · https://www.natashatherobot.com/p/apple-foundation-models · https://dev.to/arshtechpro/wwdc-2026-apple-just-opened-the-foundation-models-framework-to-any-llm-provider-5ejn · https://hackernoon.com/a-developers-guide-to-apples-foundation-models-framework-in-ios-26
Agents: https://benchlm.ai/benchmarks/osworld-verified · https://benchlm.ai/benchmarks/osworld2 · https://decodethefuture.org/en/ai-agent-benchmarks-2026/ · https://github.com/xlang-ai/OSWorld · https://github.com/web-arena-x/webarena · https://github.com/sierra-research/tau2-bench · https://github.com/METR/eval-analysis-public · https://x.com/METR_Evals/status/2026355544668385373 · https://www.matthewswong.com/en/blog/metr-developer-productivity-2026-uplift-update/ · https://philippdubach.com/posts/93-of-developers-use-ai-coding-tools.-productivity-hasnt-moved./
Protocols: https://github.com/modelcontextprotocol/modelcontextprotocol · https://github.com/modelcontextprotocol/registry · https://www.digitalapplied.com/blog/mcp-adoption-statistics-2026-model-context-protocol · https://nimblebrain.ai/blog/state-of-mcp-security-2026/ · https://the-agent-report.com/2026/07/mcp-security-landscape-2026-vulnerabilities-mitigations/ · https://arxiv.org/abs/2510.16558 · https://authzed.com/blog/timeline-mcp-breaches · https://github.com/a2aproject/A2A · https://github.com/anthropics/skills · https://github.com/openai/openai-apps-sdk-examples · https://github.com/agentic-commerce-protocol/agentic-commerce-protocol · https://github.com/google-agentic-commerce/AP2 · https://github.com/coinbase/x402 · https://github.com/auth0/auth0-ai-js · https://github.com/stripe/agent-toolkit
Robotics: https://github.com/TheRobotStudio/SO-ARM100 · https://github.com/huggingface/lerobot
Regulation: https://usercentrics.com/knowledge-hub/eu-ai-act-high-risk-delay-article-50-transparency-consent/ · https://labs.cloudsecurityalliance.org/research/csa-research-note-eu-ai-act-omnibus-vii-deadline-delay-20260/ · https://www.joneswalker.com/en/insights/blogs/ai-law-blog/yes-august-2-still-matters-the-eu-approved-a-high-risk-ai-delay-but-most-trans.html · https://www.orrick.com/en/Insights/2026/07/EU-AI-Act-Update-Digital-Omnibus-Finalizes-8-Compliance-Changes · https://cdp.cooley.com/digital-ai-omnibus-delays-key-deadlines-introduces-new-rules/
Labor/adoption: https://slashdot.org/story/26/08/25/1756243/ai-is-hitting-entry-level-jobs-hardest-stanford-study-finds · https://intuitionlabs.ai/articles/ai-entry-level-employment-hiring-data · https://launchready.ai/insights/ai-workforce/stanford-young-workers-ai-employment-gap-19-percent · https://techcrunch.com/2026/02/27/chatgpt-reaches-900m-weekly-active-users · https://techcrunch.com/2026/03/28/anthropics-claude-popularity-with-paying-consumers-is-skyrocketing · https://www.businessofapps.com/data/claude-statistics/ · https://technologychecker.io/blog/chatgpt-statistics
