#!/usr/bin/env python3
"""Merge data/problems-*.json into 02-problem-database.csv (+ json). Dedup by normalized title."""
import json, glob, csv, re, sys, os
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
recs = []
for f in sorted(glob.glob(os.path.join(root, "data", "problems-*.json"))):
    try:
        data = json.load(open(f))
    except Exception as e:
        print("BAD JSON", f, e, file=sys.stderr); continue
    if isinstance(data, dict):
        data = data.get("problems") or data.get("records") or list(data.values())
    for r in data:
        r["_file"] = os.path.basename(f)
        recs.append(r)
def norm(s): return re.sub(r"[^a-z0-9]+", " ", (s or "").lower()).strip()
seen = {}; out = []
for r in recs:
    k = norm(r.get("title", ""))[:60]
    if k in seen: continue
    seen[k] = 1; out.append(r)
cols = ["id","domain","title","affected_user","job_to_be_done","current_process","what_fails","failure_frequency","cost_of_failure","existing_workaround","who_pays_today","firsthand_evidence","evidence_strength","key_unknowns","technical_unlock","why_now","existing_solutions","verification_status","source_urls","source_dates","source_types","n_sources"]
with open(os.path.join(root, "02-problem-database.csv"), "w", newline="") as fh:
    w = csv.DictWriter(fh, fieldnames=cols, extrasaction="ignore"); w.writeheader()
    for r in out:
        srcs = r.get("sources") or []
        r["source_urls"] = " | ".join(s.get("url","") for s in srcs if isinstance(s, dict))
        r["source_dates"] = " | ".join(str(s.get("date","")) for s in srcs if isinstance(s, dict))
        r["source_types"] = " | ".join(str(s.get("type","")) for s in srcs if isinstance(s, dict))
        r["n_sources"] = len(srcs)
        w.writerow({c: (json.dumps(r.get(c)) if isinstance(r.get(c), (list, dict)) else r.get(c, "")) for c in cols})
json.dump(out, open(os.path.join(root, "data", "problem-database.json"), "w"), indent=1)
from collections import Counter
print(len(recs), "records,", len(out), "after dedup")
print(Counter(r.get("domain") for r in out))
print(Counter(r.get("evidence_strength") for r in out))
print(Counter(r.get("verification_status") for r in out))
