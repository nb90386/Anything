# CEO pitch message (v0.1, superseded)

> This is the v0.1 message, kept for history. The current pitch message for the Revenue Intelligence and Contract
> Risk Command Center is [`docs/demo/pitch-message.md`](../demo/pitch-message.md); use that one.

Send this via LinkedIn, email, or wherever you have a warm line to Malbek's CEO or another member of leadership.
Fill in the bracketed placeholders before sending. Keep it this short - a wall of text undoes the point.

---

**Subject: An independent CLM demo I built after studying Malbek - would love your feedback**

Hi [Name],

I've spent the last [day / few days] going deep on Malbek - the product, BusinessIQ, the AI/Bek positioning, your
competitive set (Ironclad, Icertis, DocuSign CLM, Conga, Agiloft, Sirion, LinkSquares, SpotDraft), and what CLM
buyers actually complain about. Rather than send a resume, I built something.

**[Contract Intelligence Copilot](LINK)** is a working CLM app I designed and built independently, inspired by the
problems your product space solves - not a Malbek clone, and not affiliated with Malbek in any way. It:

- Parses real PDF/DOCX/text contracts and classifies every clause into 14 legal categories
- Flags risk (uncapped liability, one-sided indemnification, auto-renewal traps, and more) with a plain-English
  recommendation for each finding
- Tracks obligations with live overdue/due-soon status, diffs contract amendments clause-by-clause, and rolls a
  portfolio up into a BusinessIQ-style commercial intelligence dashboard
- Runs a natural-language chat over any contract, grounded in and citing the actual clauses
- Works instantly, offline, with zero API keys - the analysis engine is a real rule-based system I wrote myself,
  with a clean interface to swap in Claude or GPT with one environment variable

It's a full-stack build: Next.js/TypeScript, a real SQLite data model, hand-rolled TF-IDF search, Playwright
end-to-end tests, and product/architecture docs I'd expect a real team to want before shipping. I also wrote up
what I learned about the CLM market and where I think the interesting product opportunities are - happy to share
that separately if useful.

I'd love five minutes of feedback, or to talk about whether there's an internship fit at Malbek. Either way, thank
you for building a product interesting enough to make me want to spend a weekend on this.

[Your Name]
[Your email / LinkedIn]
[Link to the deployed demo or GitHub repo]

---

## Notes for you before sending

- Fill in the demo link once deployed (or link the GitHub repo if not deploying).
- If sending cold (no warm intro), a shorter LinkedIn-message version works better than email - trim the third
  paragraph.
- Consider attaching or linking `docs/research/malbek-research-report.md` only if asked for more depth - leading
  with it up front reads as trying too hard.
- Proofread the placeholders. Nothing undercuts "I pay attention to detail" like a stray `[Name]`.
