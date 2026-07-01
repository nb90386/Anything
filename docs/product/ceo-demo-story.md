# CEO Demo Story: Narrative Arc

> Independent portfolio demo, not affiliated with Malbek Inc. This is the narrative outline for a CEO-facing walkthrough of the Malbek Revenue Intelligence and Contract Risk Command Center. It is a story arc, not a minute-by-minute script; the detailed script belongs in a separate `docs/product/demo-script.md` follow-on (the v0.1 version of that file already exists and will be revised alongside this arc, not here).

## Audience and framing

This story is written for a CEO or board member with limited patience for technical detail and a strong bias toward "show me the number, then show me you can back it up." It assumes the demo follows this document's arc but is not read aloud from it; the actual screen time favors the product, not narration.

## Act 1: The specific business problem, framed in dollars and risk

Open with a claim that is uncomfortable and specific, not abstract. Not "companies lose money on contracts," but: **"Right now, this portfolio of contracts has $[X] in revenue we are contractually owed and are not collecting this quarter, and nobody would have known that number without opening this dashboard."**

The number should come from the Executive BusinessIQ Dashboard, visible within the first ten seconds of the demo. It should be paired immediately with a second, harder question: **"and here are the three contracts driving most of it."** This is the moment that separates this demo from a generic AI-features tour: the opening move is a dollar figure with a name attached, not a feature list.

Follow immediately with the risk half of the same coin: **"separately, here's where our contract risk is concentrated,"** pointing at the Contract Risk Radar. The pairing matters: leakage is money already being lost, risk is money that could be lost next. A CEO should feel both in the first two minutes.

## Act 2: How the product surfaces it

This act walks the CEO from the headline numbers down into the mechanics, in the following order, each step deepening trust rather than adding new claims:

1. **Click into a leakage figure.** Show that the number is not a black box: it traces to a specific clause (e.g., a 3% annual escalator that was never applied), the specific contract, and the specific date the escalator should have triggered. This is the single most important beat in the whole demo: it proves the number is real math over real contract text, not a vibe.

2. **Pivot to the Risk Radar.** Show the same portfolio from a different angle: instead of "what are we losing," "what's exposed." Demonstrate that a contract that shows up in both the leakage view and the highest-risk zone of the radar is not a coincidence, it's the same underlying data model surfaced two ways, which is the actual point of the product.

3. **Show Clause Drift on that same contract's history.** If it has amendments, show that its liability or indemnification language has moved further from the house playbook with each amendment, visualized as a trend, not just a flag. This is where the story shifts from "here's a problem" to "here's how the problem got worse over time, and we would have caught it at amendment two instead of amendment five."

4. **Show a Negotiation Intelligence brief for the same or a related contract.** Close the loop on "how did we get here": this deal took an unusually high number of negotiation rounds, and the concessions moved in a specific, identifiable direction. This turns the story from a static risk report into a pattern the organization can learn from and apply to the next negotiation.

5. **Switch roles.** Briefly show the same underlying data through the Finance, Legal, and Procurement command centers to demonstrate that this is one data model serving different questions, not four separate tools stitched together. Keep this beat short: the point is proof of architecture, not a second full tour.

6. **Export the board pack.** Close Act 2 by generating the unified report, live, from the same data just walked through. The CEO should see the exact numbers they just watched get explained land on a clean, board-ready page.

## Act 3: The close, why this matters to Malbek's customers, and why it was built

End by naming the honest version of the pitch, not an inflated one:

- **Acknowledge directly that Malbek's own BusinessIQ, and competitors like Icertis and Sirion, already detect revenue leakage and clause deviation.** This is a point in the demo's favor, not against it: it proves the builder understands the real market rather than inventing a strawman. The line to land: "the detection problem is being solved industry-wide. The delivery problem, getting an executive from zero to a specific, trustworthy, actionable number in one screen, is not solved nearly as well, anywhere."
- **State plainly what this demo is:** a portfolio project built to demonstrate the product and engineering thinking behind exactly the kind of intelligence layer a modern CLM company is racing to build, using Malbek's own market position and public roadmap as the reference point, with informal permission to use Malbek's branding inside this private, non-public demo.
- **Land on why it matters to Malbek's actual customers, not just as a portfolio exercise:** every enterprise buyer evaluating a CLM in 2026 is being sold on "AI finds money and risk in your contracts." The vendors who win that evaluation will be the ones whose executives can open the product and get an answer in one screen, with full traceability, not the ones with the most impressive-sounding model underneath. That is the product thesis this demo exists to prove, in miniature, buildable by one person in a bounded timeframe.
- **Close on intent, not features:** this was built to show exactly the kind of systems-level thinking, real data modeling, honest positioning against real competitors, and design discipline that the builder would bring to a role on a team building this for real.

## What to deliberately leave out of this narrative

- No claim that this out-performs or replaces BusinessIQ's actual proprietary technology (LIVEGraph, Context Threading). The story's credibility depends on not overreaching here.
- No dwelling on the mock-AI mechanics mid-story; that belongs in a technical Q&A after the narrative, not inside the business narrative itself.
- No apologizing for what's out of scope (real auth, real billing integration). If asked, answer honestly and briefly, then return to the story; do not lead with caveats.
