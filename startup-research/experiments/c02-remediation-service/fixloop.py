"""Done-for-you remediation test on real pages:
OpenDataLoader auto-tag (visual preserved) -> semantic verify -> LLM proposes tag edits by element id -> apply with pikepdf -> deterministic fixes (/Lang, /Title) -> re-verify.
Outputs per-page: before/after major findings, edits applied, cost, time."""
import sys, os, json, glob, subprocess, time, shutil
import pikepdf, pdfplumber, pypdfium2 as pdfium
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "c01-accessible-pdf", "verify"))
import verifiers
HERE=os.path.dirname(os.path.abspath(__file__)); SRC=sys.argv[1]; MODEL=sys.argv[2] if len(sys.argv)>2 else "claude-sonnet-5-5"
os.makedirs(f"{HERE}/work", exist_ok=True)
ROLES={"H1","H2","H3","H4","P","LI","L","TH","TD","Figure","Caption","Lbl","LBody","Table","TR","Artifact"}
def elements(pdf):
    out=[]
    def walk(e, parent):
        if isinstance(e, pikepdf.Array):
            for x in e: walk(x, parent)
        elif isinstance(e, pikepdf.Dictionary) and "/S" in e:
            out.append((e, parent)); 
            if "/K" in e: walk(e.K, e)
    walk(pdf.Root.StructTreeRoot.K, None); return out
def serialize(path):
    pdf=pikepdf.open(path)
    with pdfplumber.open(path) as pl: chars=pl.pages[0].chars
    txt={}
    for c in chars: txt.setdefault(c.get("mcid"),[]).append(c["text"])
    lines=[]; E=elements(pdf)
    for i,(e,p) in enumerate(E):
        k=e.get("/K"); ids=[]
        for it in (list(k) if isinstance(k,pikepdf.Array) else ([k] if k is not None else [])):
            if isinstance(it,pikepdf.Dictionary) and "/MCID" in it: ids.append(int(it.MCID))
            elif not isinstance(it,pikepdf.Dictionary):
                try: ids.append(int(it))
                except Exception: pass
        t="".join("".join(txt.get(m,[])) for m in ids).strip()[:160]
        depth=0; q=p
        while q is not None:
            depth+=1; q=next((pp for ee,pp in E if ee.objgen==q.objgen), None) if hasattr(q,"objgen") else None
            if depth>8: break
        alt=f' [Alt="{e.get("/Alt")}"]' if "/Alt" in e else ""
        lines.append(f"[{i}] {'  '*min(depth,6)}{str(e.S)[1:]}{': '+t if t else ''}{alt}")
    return "\n".join(lines)
FIX_PROMPT="""You are remediating a tagged PDF so it works for screen-reader users. The page image is at {img}.
Below is the tag tree; each element has an id in brackets. Propose minimal edits so the tags match the visible structure.
Allowed edits:
- {{"id":N,"role":"H1|H2|H3|H4|P|LI|TH|TD|Caption|Figure"}}  change an element's role (e.g., a visible heading tagged P -> H2; header cells TD -> TH)
- {{"id":N,"alt":"concise alt text"}}  set alt text on a Figure (describe purpose/content; for decorative images use "")
- {{"id":N,"artifact":true}}  mark running headers/footers/page numbers/decoration as artifact
- {{"reorder_top":[ids...]}}  new order of the top-level children of the document root (only if reading order is wrong)
Do not invent text. If something cannot be fixed with these edits (e.g., a table that was never detected, list items that need regrouping), list it under "unfixable".
TAG TREE:
{tree}
Return ONLY JSON: {{"edits":[...],"unfixable":["short reason", ...]}}"""
def claude(prompt):
    r=subprocess.run(["claude","-p","--model",MODEL,"--allowedTools","Read","--output-format","json","--max-turns","4",prompt],capture_output=True,text=True,timeout=400,stdin=subprocess.DEVNULL)
    j=json.loads(r.stdout); t=j.get("result",""); return json.loads(t[t.find("{"):t.rfind("}")+1]), j.get("total_cost_usd") or 0
def apply(src, dst, edits):
    pdf=pikepdf.open(src); E=[e for e,_ in elements(pdf)]; applied=0
    pdf.Root.Lang=pikepdf.String("en-US"); applied+=0
    for ed in edits:
        try:
            if "reorder_top" in ed:
                k=pdf.Root.StructTreeRoot.K; d=k[0] if isinstance(k,pikepdf.Array) else k
                kids=list(d.K); idx={E[i].objgen:i for i in range(len(E))}
                want=[E[i] for i in ed["reorder_top"] if 0<=i<len(E)]
                wantset={w.objgen for w in want}
                rest=[x for x in kids if not (isinstance(x,pikepdf.Dictionary) and x.objgen in wantset)]
                if want: d.K=pikepdf.Array(want+rest); applied+=1
                continue
            e=E[int(ed["id"])]
            if "role" in ed and ed["role"] in ROLES: e.S=pikepdf.Name("/"+ed["role"]); applied+=1
            if "alt" in ed: e.Alt=pikepdf.String(ed["alt"]); applied+=1
            if ed.get("artifact"): e.S=pikepdf.Name("/Artifact"); applied+=1
        except Exception: pass
    pdf.save(dst); return applied
def major(sem): return sorted({d.get("category") for d in sem.get("defects",[]) if d.get("severity")=="major"})
resf=f"{HERE}/results-{MODEL}.json"; res=json.load(open(resf)) if os.path.exists(resf) else {}
for tp in sorted(glob.glob(f"{SRC}/*_tagged.pdf")):
    doc=os.path.basename(tp).replace("_tagged.pdf","")
    if doc in res: continue
    t0=time.time(); cost=0
    before=verifiers.semantic_check(tp, model=MODEL, workdir=f"{HERE}/work"); cost+=before.get("cost_usd") or 0
    rec={"before":major(before)}
    if not rec["before"]:
        fixed=f"{HERE}/work/{doc}_fixed.pdf"; apply(tp, fixed, []); rec.update({"edits":0,"unfixable":[],"after":[],"rule_after":verifiers.rule_check(fixed)})
    else:
        img=f"{HERE}/work/{doc}.png"; pdfium.PdfDocument(tp)[0].render(scale=150/72).to_pil().save(img)
        try:
            out,c=claude(FIX_PROMPT.format(img=img, tree=serialize(tp))); cost+=c
        except Exception as ex:
            out={"edits":[],"unfixable":["fix call failed"]}
        fixed=f"{HERE}/work/{doc}_fixed.pdf"; n=apply(tp, fixed, out.get("edits",[]))
        after=verifiers.semantic_check(fixed, model=MODEL, workdir=f"{HERE}/work"); cost+=after.get("cost_usd") or 0
        rec.update({"edits":n,"unfixable":out.get("unfixable",[]),"after":major(after),"rule_after":verifiers.rule_check(fixed)})
    rec.update({"cost_usd":round(cost,4),"secs":round(time.time()-t0,1)}); res[doc]=rec
    json.dump(res, open(resf,"w"), indent=1)
    print(doc, "before:",rec["before"],"| edits:",rec["edits"],"| after:",rec["after"],"| rule_after:",rec["rule_after"],"| unfixable:",len(rec["unfixable"]),f"| ${rec['cost_usd']} {rec['secs']}s", flush=True)
