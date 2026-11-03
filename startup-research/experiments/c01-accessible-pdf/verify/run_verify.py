import sys, json, os, glob
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from verifiers import rule_check, semantic_check
HERE=os.path.dirname(os.path.abspath(__file__)); model=sys.argv[1] if len(sys.argv)>1 else "claude-sonnet-5-5"
mf=sys.argv[2] if len(sys.argv)>2 else "manifest.json"; cases=json.load(open(f"{HERE}/{mf}"))
for f in (sorted(glob.glob(f"{os.path.dirname(HERE)}/out/odl/*.untagged_tagged.pdf")) if mf=="manifest.json" else []):
    cases.append({"doc": os.path.basename(f).split(".")[0], "defect": "odl_output", "path": f})
os.makedirs(f"{HERE}/img", exist_ok=True); resf=f"{HERE}/results-{model}-{mf.replace('.json','')}.json"
res=json.load(open(resf)) if os.path.exists(resf) else {}
for c in cases:
    key=f'{c["doc"]}__{c["defect"]}'
    if key in res and "error" not in res[key]["semantic"]: continue
    sem=semantic_check(c["path"], model=model, workdir=f"{HERE}/img")
    res[key]={**c, "rule": rule_check(c["path"]), "semantic": sem}
    json.dump(res, open(resf,"w"), indent=1)
    cats=sorted(set(d.get("category") for d in sem.get("defects",[]) if d.get("severity","major")=="major")) if "defects" in sem else sem.get("error","")[:80]
    print(f'{c["doc"]:18s} {c["defect"]:17s} rule={res[key]["rule"]} semantic(major)={cats} {sem.get("secs")}s ${sem.get("cost_usd")}', flush=True)
