# Malbek Contract Intelligence Copilot - Product Vision

> **Independent portfolio project.** Not affiliated with, endorsed by, or built in partnership with Malbek Inc. This is a demo application built by a job applicant to demonstrate product and engineering thinking relevant to the contract lifecycle management (CLM) space Malbek operates in.

## The Problem

Contracts are where a company's real commercial terms live - pricing, obligations, renewal dates, liability exposure, compliance requirements - but that information is locked inside unstructured PDFs and Word documents scattered across shared drives and inboxes. Industry research (WorldCC, Deloitte/DocuSign) consistently points to the same pattern: organizations lose an estimated **9.2% of annual revenue** to poor contract management, and legal/commercial teams burn enormous time re-reading documents to answer questions that should be a query, not a research project - "which contracts auto-renew this quarter," "what's our aggregate liability exposure to this vendor," "did this clause change between v1 and v3."

The pain isn't that AI can't read a contract anymore - every CLM vendor claims that today. The pain is trust and scope: point solutions produce confident-sounding summaries with no visible source, and almost every "AI contract" demo on the market stops at a single document, when the real value is portfolio-wide synthesis across dozens or hundreds of agreements at once.

## Who It's For

This demo is built for two audiences simultaneously, by design:

1. **The end users it's modeled on** - Legal counsel, Sales/RevOps, Finance/Procurement analysts, and executives, mirroring Malbek's own named target functions. Each has a genuinely different question to ask of the same contract portfolio.
2. **Malbek's own leadership**, evaluating this as a portfolio piece. The product is deliberately scoped to demonstrate the kind of systems-level, data-model-first thinking that separates a real CLM builder from someone wrapping a chatbot around a PDF upload button.

## Why Now

Two forces make this the right moment for this kind of demo:

- **AI-native CLM is the active battleground.** Malbek's own 2025-2026 roadmap (Bek, Conversational Contracts, BusinessIQ) and every major competitor (Ironclad's Jurist, LinkSquares' LinkAI, Icertis Copilot) are racing to prove AI reasoning over contract data is trustworthy, not just plausible-sounding. A demo that takes explainability and structured data seriously speaks directly to that race.
- **Portfolio-level intelligence, not single-document chat, is the frontier.** BusinessIQ's entire pitch is cross-document commercial intelligence. Most public "AI contract" demos never get past a single-PDF Q&A bot. Building for the portfolio view from day one is a meaningful, achievable differentiator for a solo builder.

## What "Great" Looks Like

A visitor - technical or not - should be able to watch a five-minute walkthrough and come away believing three things:

1. **The data model is real.** Contracts, clauses, risks, obligations, versions, and approvals are modeled as connected entities, not a flat table with a JSON blob of AI output bolted on.
2. **The AI is honest.** Every extracted risk or clause classification traces back to the exact source sentence that produced it, whether the underlying engine is the deterministic mock or a live LLM. Nothing is asserted without a citation.
3. **It scales in ambition beyond one document.** The same underlying data powers a portfolio dashboard, a commercial-insights view, and cross-repository search - because that's where actual CLM value lives, and it's the harder problem to model well.

## North Star

**Turn a pile of unstructured contracts into a queryable, explainable, portfolio-wide source of truth - in minutes, without any external infrastructure, and without ever asserting a fact the system can't point back to in the source text.**

Every feature decision in this build is a test against that sentence: does it make the portfolio more queryable, more explainable, or more complete - or is it scope that doesn't serve the core narrative.
