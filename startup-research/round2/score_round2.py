"""Round-2 scoring with founder's new weights (CRITERIA.md). Scores 0-10, judgment-based; justifications inline."""
W={"speed":25,"spend":15,"can_sell":15,"market":15,"impact":10,"ai_margin":10,"defense":5,"risk":5}
C=[
("R1","Done-for-you Title II accessibility remediation (documents + caption QA) for public bodies, verifier-checked",
 dict(speed=7,spend=9,can_sell=6,market=8,impact=9,ai_margin=6,defense=6,risk=6),
 "17 local bodies with 2026 spending ($7.5k-$60k); $3-12/page list; CA city managers can buy $10-50k without bids; deadline Apr 26 2027 is 5.5 months away; pipeline measured: ~45% of real pages pass after one automatic fix round, the rest need human work; minor must contract via parent LLC; DOJ may weaken rule."),
("R2","Permit + PTO/interconnection desk for small CA solar/battery/EV-charger installers",
 dict(speed=7,spend=6,can_sell=6,market=5,impact=6,ai_margin=6,defense=3,risk=5),
 "Vendor-page prices $130-749/project; small installers decide fast; needs PE-stamp partner, installer portal credentials, error liability; residential solar contracting after 25D ended; SolarAPP+ and offshore drafters compress price; automation untested."),
("R3","Credentialing/payer enrollment for small therapy practices",
 dict(speed=5,spend=7,can_sell=4,market=7,impact=6,ai_margin=5,defense=4,risk=4),
 "$100-300 per payer; payers take months (slow cash); handles SSNs and provider PII; Headway/Alma/Medallion compete."),
("R4","Catch-up bookkeeping before tax season",
 dict(speed=7,spend=7,can_sell=4,market=7,impact=4,ai_margin=6,defense=2,risk=6),
 "$150-500 per backlog month; seasonal; owners hesitate to give a minor bank access; crowded; weak path to a company."),
("R5","Grant writing for small nonprofits",
 dict(speed=5,spend=6,can_sell=5,market=6,impact=7,ai_margin=6,defense=2,risk=6),
 "$500-15,000 per proposal; outcome uncertain; commission fees considered unethical; slow award cycles."),
("R6","Trucking owner-operator back office (detention recovery, invoicing)",
 dict(speed=6,spend=5,can_sell=5,market=7,impact=5,ai_margin=5,defense=3,risk=6),
 "Dispatch 5-10% of gross; detention recovery hard to collect; DockPay and dispatch services exist; trust barrier."),
("R7","ADU plan-check corrections / expediting",
 dict(speed=4,spend=7,can_sell=4,market=5,impact=6,ai_margin=4,defense=3,risk=5),
 "$1.5-9k per project but design revisions need licensed designers; one-off buyers."),
("R8","Verification-only SaaS (round-1 winner)",
 dict(speed=3,spend=3,can_sell=6,market=6,impact=8,ai_margin=9,defense=6,risk=7),
 "No one shown to pay for verification separately; red team's most likely cause of death; slower money."),
]
rows=[]
for cid,name,s,why in C:
    t=sum(s[k]*W[k] for k in W)/10; rows.append((t,cid,name,s,why))
rows.sort(reverse=True)
for t,cid,name,s,why in rows: print(f"{t:5.1f} {cid} {name}")
import random; random.seed(3); wins={}
for i in range(300):
    w={k:W[k]*random.uniform(0.5,1.5) for k in W}
    top=max(C,key=lambda c: sum(c[2][k]*w[k] for k in w))[0]; wins[top]=wins.get(top,0)+1
print("win share over 300 random weightings:", {k:f"{v/3:.0f}%" for k,v in sorted(wins.items(), key=lambda x:-x[1])})
with open("round2-scores.csv","w") as f:
    f.write("score,id,name,"+",".join(W)+",justification\n")
    for t,cid,name,s,why in rows: f.write(f'{t},{cid},"{name}",'+",".join(str(s[k]) for k in W)+f',"{why}"\n')
