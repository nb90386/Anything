#!/usr/bin/env python3
"""Weighted scoring + sensitivity analysis. Input: 07-scoring-model.csv (scores 0-10 per criterion)."""
import csv, os, itertools, random, sys
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
W = {"severity":20,"mvp_feasibility":15,"defensibility":15,"why_now":10,"insight":10,"scale":10,"distribution":10,"founder_fit":5,"risk":5}
ALL = list(csv.DictReader(open(os.path.join(root,"07-scoring-model.csv"))))
STAGE = sys.argv[1] if len(sys.argv)>1 else "pass2-post-competition-and-experiment"
rows = [r for r in ALL if r.get("stage","pass1-desk")==STAGE]
print("STAGE:", STAGE)
def total(r, w):
    return sum(float(r[k])*w[k] for k in w)/10.0
def rank(w):
    return sorted(rows, key=lambda r: -total(r, w))
base = rank(W)
print("BASE RANKING (score /100):")
for i, r in enumerate(base, 1):
    flag = " [HARD-REJECT: %s]" % r["hard_reject"] if r.get("hard_reject") else ""
    print(f"{i:2d}. {total(r,W):5.1f}  {r['id']:7s} {r['name']}{flag}")
# Sensitivity: perturb each weight +/- 50%, and random Dirichlet-like perturbations
print("\nSENSITIVITY (winner under alternative weightings):")
alive = [r for r in rows if not r.get("hard_reject")]
wins = {}
schemes = {}
for k in W:
    for f in (0.5, 1.5):
        w = dict(W); w[k] = W[k]*f; schemes[f"{k}x{f}"] = w
schemes["equal"] = {k:1 for k in W}
schemes["feasibility-heavy"] = dict(W, mvp_feasibility=30, distribution=15)
schemes["moat-heavy"] = dict(W, defensibility=30, scale=15)
schemes["severity-heavy"] = dict(W, severity=35)
random.seed(7)
for i in range(200):
    schemes[f"rand{i}"] = {k: W[k]*random.uniform(0.5,1.5) for k in W}
for name, w in schemes.items():
    top = sorted(alive, key=lambda r: -total(r, w))[0]["id"]
    wins[top] = wins.get(top, 0) + 1
    if not name.startswith("rand"):
        print(f"  {name:22s} -> {top}")
print("\nWin share across", len(schemes), "weightings:", {k: f"{v/len(schemes):.0%}" for k,v in sorted(wins.items(), key=lambda x:-x[1])})
