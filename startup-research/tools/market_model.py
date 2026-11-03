#!/usr/bin/env python3
"""Bottom-up market and unit-economics model for the three finalists. Every input is tagged:
V = VERIFIED in this research (source in 06-market-sizing.md), I = INFERRED, A = ASSUMED (unvalidated)."""
import itertools, json
def fmt(x): return f"${x/1e6:,.1f}M" if x>=1e6 else f"${x/1e3:,.0f}K"
print("="*100); print("F1 VERIFIED ACCESSIBILITY — new-document flow, US public sector (pages/yr x price/page)")
# segments: (name, entity_count, tag, pages_per_entity_per_year {bear,base,bull}, tag)
SEG = [
 ("Cities >=50k pop (2027 deadline)",            800,   "I: 752-817 per search results", (8_000, 20_000, 40_000), "A"),
 ("Counties >=50k pop (2027 deadline)",          1_000, "A: ~1/3 of 3,143 counties",     (10_000, 30_000, 60_000), "A"),
 ("Public colleges, non-LMS documents",          1_600, "A: public share of ~3,900 Title IV institutions", (3_000, 10_000, 25_000), "A"),
 ("State agencies",                              5_000, "A: ~100 agencies x 50 states",  (5_000, 20_000, 50_000), "A"),
 ("Smaller local governments (2028 deadline)",  88_000, "I: ~90.8k local govts (2022 Census of Governments, training knowledge; verify)", (100, 800, 2_000), "A"),
 ("K-12 districts",                             12_500, "I: ~12.5k school districts (same census; verify)", (500, 2_000, 5_000), "A"),
]
PRICE = {"bear": 0.40, "base": 0.75, "bull": 1.25}   # A: verified page incl. remediation; anchors: manual $3-15/pg (V), AI bureaus $0.06-0.50 (V)
for sc_i, sc in enumerate(["bear","base","bull"]):
    tot=0; rows=[]
    for name,n,_,pp,_ in SEG:
        v = n*pp[sc_i]*PRICE[sc]; tot+=v; rows.append((name, v))
    print(f"  {sc:5s} price ${PRICE[sc]:.2f}/page -> US public-sector TAM {fmt(tot)}/yr  | " + "; ".join(f"{n.split('(')[0].strip()}: {fmt(v)}" for n,v in rows))
# SAM: wedge = cities+counties >=50k + public colleges non-LMS, reachable via direct + cooperative contracts
sam = {sc: sum(SEG[i][1]*SEG[i][3][j]*PRICE[sc] for i in (0,1,2)) for j,sc in enumerate(["bear","base","bull"])}
print("  SAM (cities+counties>=50k + public colleges non-LMS):", {k: fmt(v) for k,v in sam.items()})
# SOM: customers x ACV
for sc,(cust,acv) in {"bear":(8,6_000),"base":(25,12_000),"bull":(60,20_000)}.items():
    print(f"  SOM by month 24 ({sc}): {cust} entities x {fmt(acv)} ACV = {fmt(cust*acv)} ARR   [A]")
print("\n  Unit economics per verified page (A unless noted):")
def unit(price, extract=0.004, verify=0.06, flag_rate=0.25, review_min=4, reviewer_hr=30, reverify=0.5, infra=0.005):
    # extract: Haiku $0.004/page (V, this lab); verify: Sonnet $0.06/page (V) or Haiku ~$0.004 (V if Haiku verifier holds)
    human = flag_rate*review_min/60*reviewer_hr
    cogs = extract + verify*(1+reverify*flag_rate) + human + infra
    return cogs, (price-cogs)/price
for label, kw in [("base: Sonnet verify, 25% flagged, 4 min review @$30/h", {}),
                  ("cheap verify (Haiku), 15% flagged", {"verify":0.005,"flag_rate":0.15}),
                  ("bad case: 50% flagged, 8 min review", {"flag_rate":0.5,"review_min":8}),
                  ("worst: 70% flagged, 10 min review", {"flag_rate":0.7,"review_min":10})]:
    for sc in ("bear","base","bull"):
        c,m = unit(PRICE[sc], **kw)
        print(f"    {label:55s} price ${PRICE[sc]:.2f}: COGS ${c:.3f}/page, gross margin {m*100:5.1f}%")
print("\n  Verification-only API (for remediation vendors/auditors): price $0.05-0.15/page; COGS $0.005-0.065 (V: measured model costs)")
print("\n  Billion-dollar check: $1B valuation at ~10x ARR needs ~$100M ARR. US public-sector base TAM above is the ceiling for the wedge;")
print("  reaching $100M requires private-sector documents (EAA, ADA Title III, HHS 504 recipients), web/app semantic QA, and becoming the default verifier.")
print("="*100); print("F2 INTAKE-FLOOD DEFENSE (public-records add-on)")
for sc,(agencies,acv) in {"bear":(2_000,3_000),"base":(5_000,6_000),"bull":(9_000,10_000)}.items():
    print(f"  {sc}: {agencies} agencies with material request volume [A] x {fmt(acv)} add-on ACV [A; anchor: portals $9.5K-$40K/yr V] = TAM {fmt(agencies*acv)}")
print("  CA first (SB 1159/AB 1821 effective 2027-01-01): 482 cities + 58 counties [I] x $5K = SAM", fmt(540*5_000))
print("="*100); print("F3 PHARMACY FLOOR-LAW EVIDENCE ENGINE")
for sc,(stores,mrr) in {"bear":(2_000,79),"base":(4_000,149),"bull":(8_000,249)}.items():
    print(f"  {sc}: {stores} stores in floor-law states [A] x ${mrr}/mo [A; anchors RxDelta $199-799, nadaclookup $29 V] = {fmt(stores*mrr*12)}/yr")
print("  Whole US independent channel: ~18.5k stores [V: NCPA 18-19k] x $149/mo =", fmt(18_500*149*12))
