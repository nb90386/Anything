"""Summarize verifier detection on injected-defect cases (blanket + subtle) for each model."""
import json, glob, os, sys
HERE=os.path.dirname(os.path.abspath(__file__))
MAP={"heading_as_p":"heading_missing","one_heading_as_p":"heading_missing","heading_level":"heading_level","reading_order":"reading_order","one_swap":"reading_order",
     "table_no_headers":"table_headers","one_th_as_td":"table_headers","list_as_p":"list_structure","one_li_as_p":"list_structure","untagged_content":"missing_content"}
RULEMAP={"heading_level":"heading_level","table_no_headers":"table_headers","untagged_content":"missing_content"}
out={}
for f in sorted(glob.glob(f"{HERE}/results-claude-*-manifest*.json")):
    model=os.path.basename(f).split("-manifest")[0].replace("results-",""); setname="subtle" if "subtle" in f else "blanket"
    R=json.load(open(f)); det=tot=fp=clean=0; extra=0; rule_det=0; errs=0; cost=[]; secs=[]
    for k,v in R.items():
        if v["defect"]=="odl_output": continue
        sem=v["semantic"]
        if "error" in sem: errs+=1; continue
        cost.append(sem.get("cost_usd") or 0); secs.append(sem.get("secs") or 0)
        major={d.get("category") for d in sem.get("defects",[]) if d.get("severity")=="major"}
        anysev={d.get("category") for d in sem.get("defects",[])}
        if v["defect"]=="clean":
            clean+=1; fp+= bool(major); continue
        tot+=1; target=MAP[v["defect"]]; det+= target in major; extra+= len(major-{target})>0
        rule_det+= RULEMAP.get(v["defect"]) in v["rule"] if v["defect"] in RULEMAP else (len(v["rule"])>0 and False)
    key=f"{model} / {setname}"
    out[key]={"defects_detected":f"{det}/{tot}","clean_false_flags":f"{fp}/{clean}","cases_with_extra_wrong_categories":extra,"rule_checker_detected":f"{rule_det}/{tot}","errors":errs,
              "mean_cost_usd":round(sum(cost)/max(1,len(cost)),4),"mean_secs":round(sum(secs)/max(1,len(secs)),1)}
for k,v in out.items(): print(k, v)
json.dump(out, open(f"{HERE}/summary.json","w"), indent=1)
