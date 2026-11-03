"""Run veraPDF (PDF/UA-1 profile) over files; report compliance and failed rule clauses."""
import sys, json, subprocess, os, collections, glob
VERA=os.environ.get("VERA","/tmp/claude-0/-home-user-Anything/c433a216-0855-511a-a5fa-3041f1d0860c/scratchpad/vera/vera.sh")
def validate(paths):
    out={}
    for i in range(0,len(paths),20):
        chunk=paths[i:i+20]
        r=subprocess.run([VERA,"--flavour","ua1","--format","json",*chunk],capture_output=True,text=True,timeout=600)
        try: j=json.loads(r.stdout)
        except Exception: 
            for p in chunk: out[p]={"error":r.stdout[-200:]}
            continue
        for job in j["report"]["jobs"]:
            name=job["itemDetails"]["name"]; vr=job.get("validationResult") or [{}]
            vr=vr[0] if isinstance(vr,list) else vr
            d=vr.get("details",{}); fails=[f'{s["clause"]}-{s["testNumber"]}' for s in d.get("ruleSummaries",[]) if s.get("ruleStatus")=="FAILED"]
            out[name]={"compliant":vr.get("compliant"),"failed_rules":fails,"failed_checks":d.get("failedChecks")}
    return out
if __name__=="__main__":
    label=sys.argv[1]; paths=sorted(sum([glob.glob(p) for p in sys.argv[2:]],[]))
    res=validate(paths); c=collections.Counter(r for v in res.values() for r in v.get("failed_rules",[]))
    ok=sum(1 for v in res.values() if v.get("compliant"))
    print(f"{label}: {ok}/{len(res)} PDF/UA-1 compliant | top failed rules: {c.most_common(8)}")
    json.dump(res, open(f"vera-{label}.json","w"), indent=1)
