"""Score predicted document structure against ground truth (from Chromium-tagged originals).
Units: headings (with level), paragraphs, list items, table cells (with row/col/header). Metrics per doc:
content_recall, content_precision, role_acc (on matched), heading_f1 (exact level), order_tau (Kendall over matched non-table units),
table_cell_acc (text+position+header flag), text_sim (mean similarity of matched units), form_fields_found (form doc only)."""
import json, glob, os, re, sys
from difflib import SequenceMatcher
HERE = os.path.dirname(os.path.abspath(__file__))
FORM_LABELS = ["Full name","Email address","Document title","Braille","Large print","Tagged PDF","Additional comments"]
def norm(s): return re.sub(r"\s+", "", (s or "").lower())
def sim(a, b): return SequenceMatcher(None, norm(a), norm(b)).ratio()
def flatten(blocks):
    u = []
    for b in blocks or []:
        t = b.get("type")
        if t in ("H1","H2","H3","H4","P","FormField","Caption"):
            txt = b.get("text") or b.get("label") or ""
            if txt.strip(): u.append({"role": "FIELD" if t=="FormField" else ("P" if t=="Caption" else t), "text": txt})
        elif t == "List":
            for it in b.get("items", []): u.append({"role":"LI","text": it if isinstance(it,str) else str(it)})
        elif t == "Table":
            for r, row in enumerate(b.get("rows", [])):
                for c, cell in enumerate(row):
                    if isinstance(cell, dict) and (cell.get("text") or "").strip():
                        u.append({"role": "TH" if cell.get("th") else "TD", "text": cell["text"], "r": r, "c": c, "table": True})
    return u
def odl_blocks(path):
    j = json.load(open(path)); out = []
    def text_of(e):
        if e.get("content"): return e["content"]
        return " ".join(text_of(k) for k in e.get("kids", []) if isinstance(k, dict)).strip()
    for e in j["kids"]:
        t = e["type"]
        if t == "heading": out.append({"type": e.get("pdfua_tag","H2") if e.get("pdfua_tag","").startswith("H") else "H2", "text": e.get("content","")})
        elif t in ("paragraph","text block","caption"): out.append({"type":"P","text": text_of(e)})
        elif t == "list": out.append({"type":"List","items":[text_of(li) for li in e.get("list items", e.get("kids", []))]})
        elif t == "table":
            rows=[]
            for tr in e.get("rows", []):
                rows.append([{"th": bool(c.get("is_header")) or c.get("pdfua_tag")=="TH", "text": text_of(c)} for c in tr.get("cells", [])])
            out.append({"type":"Table","rows":rows})
        elif t == "image": out.append({"type":"Figure","alt":""})
    return out
def kendall(seq):
    n=len(seq); 
    if n<2: return 1.0
    conc=disc=0
    for i in range(n):
        for k in range(i+1,n):
            if seq[i]<seq[k]: conc+=1
            elif seq[i]>seq[k]: disc+=1
    return (conc-disc)/max(1,conc+disc)
def score(gt_blocks, pred_blocks, is_form=False):
    G = flatten(gt_blocks); P = flatten(pred_blocks) if pred_blocks is not None else []
    used=set(); matches=[]
    for gi, g in enumerate(G):
        best=(0,None)
        for pi, p in enumerate(P):
            if pi in used: continue
            s=sim(g["text"], p["text"])
            if s>best[0]: best=(s,pi)
        if best[0]>=0.8: used.add(best[1]); matches.append((gi,best[1],best[0]))
    rec = len(matches)/max(1,len(G)); prec = len(matches)/max(1,len(P))
    def role_ok(g,p):
        if g["role"]==p["role"]: return True
        if is_form and g["role"]=="P" and p["role"]=="FIELD": return True
        return False
    role_acc = sum(role_ok(G[g],P[p]) for g,p,_ in matches)/max(1,len(matches))
    gh=[(i,u) for i,u in enumerate(G) if u["role"].startswith("H")]; ph=[(i,u) for i,u in enumerate(P) if u["role"].startswith("H")]
    mh=sum(1 for g,p,_ in matches if G[g]["role"].startswith("H") and G[g]["role"]==P[p]["role"])
    hp = mh/max(1,len(ph)); hr = mh/max(1,len(gh)); hf = 2*hp*hr/max(1e-9,hp+hr)
    nt=[(g,p) for g,p,_ in matches if not G[g].get("table")]
    tau = kendall([p for g,p in sorted(nt)])
    gt_cells=[(i,u) for i,u in enumerate(G) if u.get("table")]
    md={g:p for g,p,_ in matches}
    cell_ok=sum(1 for i,u in gt_cells if i in md and P[md[i]].get("table") and P[md[i]]["role"]==u["role"])
    tca = cell_ok/max(1,len(gt_cells)) if gt_cells else None
    tsim = sum(s for _,_,s in matches)/max(1,len(matches))
    ff=None
    if is_form:
        fl=[u["text"] for u in P if u["role"]=="FIELD"]
        ff=sum(1 for L in FORM_LABELS if any(sim(L,x)>0.8 or norm(L) in norm(x) for x in fl))/len(FORM_LABELS)
    return {"n_gt":len(G),"n_pred":len(P),"content_recall":round(rec,3),"content_precision":round(prec,3),"role_acc":round(role_acc,3),
            "heading_f1":round(hf,3),"order_tau":round(tau,3),"table_cell_acc":None if tca is None else round(tca,3),"text_sim":round(tsim,3),"form_fields_found":ff}
if __name__=="__main__":
    gt=json.load(open(f"{HERE}/fixtures/ground_truth.json")); rows=[]
    systems = {}
    for f in sorted(glob.glob(f"{HERE}/out/*.pred.json")):
        n,v,m=os.path.basename(f).replace(".pred.json","").split(".",2)
        j=json.load(open(f)); systems.setdefault((m,v),{})[n]=(j.get("blocks"), j.get("secs"), j.get("cost_usd"))
    for f in sorted(glob.glob(f"{HERE}/out/odl/*.json")):
        b=os.path.basename(f)[:-5]; n,v=b.split(".")
        systems.setdefault(("opendataloader-2.x",v),{})[n]=(odl_blocks(f),None,0.0)
    for (m,v),docs in sorted(systems.items()):
        for n,(blocks,secs,cost) in sorted(docs.items()):
            s=score(gt[n],blocks,is_form=(n=="form")); s.update({"system":m,"variant":v,"doc":n,"secs":secs,"cost_usd":cost}); rows.append(s)
    json.dump(rows, open(f"{HERE}/results.json","w"), indent=1)
    keys=["content_recall","content_precision","role_acc","heading_f1","order_tau","table_cell_acc","text_sim"]
    print(f"{'system':22s} {'variant':9s} {'doc':18s} " + " ".join(f"{k[:9]:>9s}" for k in keys)+"  fields   secs   $")
    for r in rows:
        print(f"{r['system']:22s} {r['variant']:9s} {r['doc']:18s} " + " ".join(f"{('-' if r[k] is None else r[k]):>9}" for k in keys)+f"  {r['form_fields_found'] if r['form_fields_found'] is not None else '-':>5} {r['secs'] or '-':>6} {round(r['cost_usd'],3) if r['cost_usd'] is not None else '-'}")
    print("\nMEANS by system/variant:")
    from collections import defaultdict
    agg=defaultdict(list)
    for r in rows: agg[(r['system'],r['variant'])].append(r)
    for (m,v),rs in sorted(agg.items()):
        def mean(k):
            xs=[r[k] for r in rs if r[k] is not None]; return round(sum(xs)/len(xs),3) if xs else None
        costs=[r['cost_usd'] for r in rs if r['cost_usd'] is not None]; secs=[r['secs'] for r in rs if r['secs']]
        print(f"{m:22s} {v:9s} n={len(rs)} " + " ".join(f"{k[:9]}={mean(k)}" for k in keys) + f" $/page={round(sum(costs)/len(costs),4) if costs else '-'} s/page={round(sum(secs)/len(secs),1) if secs else '-'}")
