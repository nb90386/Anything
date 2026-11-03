import sys, os, json, glob
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__))); sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),"bench","eval"))
from verifiers import rule_check, semantic_check
from evaluator_table import evaluate_table
from evaluator_heading_level import evaluate_heading_level
EXT=sys.argv[1]; HERE=os.path.dirname(os.path.abspath(__file__)); resf=f"{HERE}/results-real.json"
res=json.load(open(resf)) if os.path.exists(resf) else {}
for tp in sorted(glob.glob(f"{HERE}/real/odl/*_tagged.pdf")):
    doc=os.path.basename(tp).replace("_tagged.pdf","")
    if doc in res and "error" not in res[doc]["semantic"]: continue
    gt=open(f"{EXT}/ground-truth/markdown/{doc}.md").read(); md=open(f"{HERE}/real/odl/{doc}.md").read()
    mhs,_=evaluate_heading_level(gt, md); teds,_=evaluate_table(gt, md)
    try: rc=rule_check(tp)
    except Exception as e: rc=["rule_error:"+str(e)[:60]]
    sem=semantic_check(tp, workdir=f"{HERE}/img")
    res[doc]={"mhs":mhs,"teds":teds,"rule":rc,"semantic":sem}; json.dump(res, open(resf,"w"), indent=1)
    cats=sorted(set(d.get("category") for d in sem.get("defects",[]) if d.get("severity")=="major")) if "defects" in sem else "ERR"
    print(doc, "mhs=",None if mhs is None else round(mhs,2), "teds=",None if teds is None else round(teds,2), "rule=",rc, "sem=",cats, flush=True)
