"""v2 fixer: adds structural regrouping edits (build tables and lists from existing tagged paragraphs) on top of v1 role/alt/order edits,
then the deterministic PDF/UA finishing pass, then both gates (veraPDF PDF/UA-1 + semantic verifier). Runs only on pages that failed v1."""
import sys, os, json, glob, subprocess, time
import pikepdf, pypdfium2 as pdfium
HERE=os.path.dirname(os.path.abspath(__file__)); EXP=os.path.dirname(HERE)
sys.path.insert(0, f"{EXP}/c01-accessible-pdf/verify"); sys.path.insert(0, f"{EXP}/c03-pdfua"); sys.path.insert(0, HERE)
import verifiers, finish, vera_batch
sys.argv=[sys.argv[0], f"{EXP}/c01-accessible-pdf/verify/real/odl", "claude-sonnet-5-5"]
from fixloop import elements, serialize, claude, major
MODEL="claude-sonnet-5-5"; SRC=f"{EXP}/c01-accessible-pdf/verify/real/odl"
PROMPT="""You are remediating a tagged PDF for screen-reader users. The page image is at {img}. The tag tree is below; each element has an id in brackets.
Problems a checker found on this page: {problems}
Allowed edits (use the minimum needed):
- {{"id":N,"role":"H1|H2|H3|H4|P|TH|TD|Caption|Figure"}}
- {{"id":N,"alt":"concise alt text"}} for Figure elements
- {{"id":N,"artifact":true}} for running headers/footers/page numbers/decoration
- {{"reorder_top":[ids...]}} new order of the document root's children
- {{"make_table":{{"rows":[[id,id,...],[id,...]],"header_rows":1}}}} build a table from existing elements; each cell is one existing element id (use null for an empty cell); all ids must be siblings in the tree
- {{"make_list":[id,id,...]}} turn existing sibling elements into list items, in order
Do not invent text. List anything you cannot fix under "unfixable".
TAG TREE:
{tree}
Return ONLY JSON: {{"edits":[...],"unfixable":[...]}}"""
def new_elem(pdf, S, parent, kids):
    d=pdf.make_indirect(pikepdf.Dictionary(Type=pikepdf.Name("/StructElem"), S=pikepdf.Name(S), P=parent, K=pikepdf.Array(kids)))
    for k in kids:
        if isinstance(k,pikepdf.Dictionary) and "/S" in k: k.P=d
    return d
def apply(src, dst, edits):
    pdf=pikepdf.open(src); E=elements(pdf); EL=[e for e,_ in E]; PAR={e.objgen:p for e,p in E}; n=0
    def siblings_ok(ids):
        ps={PAR[EL[i].objgen].objgen if PAR[EL[i].objgen] is not None else None for i in ids}
        return len(ps)==1 and None not in ps
    def replace_in_parent(ids, newnode):
        par=PAR[EL[ids[0]].objgen]; kids=list(par.K) if isinstance(par.K,pikepdf.Array) else [par.K]
        gens={EL[i].objgen for i in ids}; out=[]; placed=False
        for k in kids:
            if isinstance(k,pikepdf.Dictionary) and k.objgen in gens:
                if not placed: out.append(newnode); placed=True
            else: out.append(k)
        par.K=pikepdf.Array(out); newnode.P=par
    for ed in edits:
        try:
            if "make_table" in ed:
                rows=ed["make_table"]["rows"]; hr=int(ed["make_table"].get("header_rows",1))
                ids=[i for r in rows for i in r if i is not None and 0<=i<len(EL)]
                if not ids or not siblings_ok(ids): continue
                par=PAR[EL[ids[0]].objgen]; trs=[]
                for ri,r in enumerate(rows):
                    cells=[]
                    for i in r:
                        role="/TH" if ri<hr else "/TD"
                        if i is None: cells.append(new_elem(pdf, role, par, []))
                        else:
                            el=EL[i]; c=new_elem(pdf, role, par, [el]); el.S=pikepdf.Name("/P"); cells.append(c)
                    trs.append(new_elem(pdf,"/TR",par,cells))
                tbl=new_elem(pdf,"/Table",par,trs)
                for tr in trs: tr.P=tbl
                for tr in trs:
                    for c in tr.K: c.P=tr
                replace_in_parent(ids, tbl); n+=1
            elif "make_list" in ed:
                ids=[i for i in ed["make_list"] if 0<=i<len(EL)]
                if len(ids)<2 or not siblings_ok(ids): continue
                par=PAR[EL[ids[0]].objgen]; lis=[]
                for i in ids:
                    el=EL[i]; body=new_elem(pdf,"/LBody",par,[el]); el.S=pikepdf.Name("/P"); li=new_elem(pdf,"/LI",par,[body]); body.P=li; lis.append(li)
                L=new_elem(pdf,"/L",par,lis)
                for li in lis: li.P=L
                replace_in_parent(ids, L); n+=1
            elif "reorder_top" in ed:
                k=pdf.Root.StructTreeRoot.K; d=k[0] if isinstance(k,pikepdf.Array) else k
                want=[EL[i] for i in ed["reorder_top"] if 0<=i<len(EL)]; ws={w.objgen for w in want}
                rest=[x for x in d.K if not (isinstance(x,pikepdf.Dictionary) and x.objgen in ws)]
                if want: d.K=pikepdf.Array(want+rest); n+=1
            else:
                e=EL[int(ed["id"])]
                if "role" in ed: e.S=pikepdf.Name("/"+ed["role"]); n+=1
                if "alt" in ed: e.Alt=pikepdf.String(ed["alt"]); n+=1
                if ed.get("artifact"): e.S=pikepdf.Name("/Artifact"); n+=1
        except Exception as ex: pass
    pdf.save(dst); return n
v1=json.load(open(f"{HERE}/results-{MODEL}.json")); resf=f"{HERE}/results-v2.json"; res=json.load(open(resf)) if os.path.exists(resf) else {}
os.makedirs(f"{HERE}/work2", exist_ok=True)
for doc,r1 in sorted(v1.items()):
    if not r1["after"] or doc in res: continue
    src=f"{SRC}/{doc}_tagged.pdf"; t0=time.time()
    img=f"{HERE}/work2/{doc}.png"; pdfium.PdfDocument(src)[0].render(scale=150/72).to_pil().save(img)
    try: out,cost=claude(PROMPT.format(img=img, problems=", ".join(r1["before"]), tree=serialize(src)))
    except Exception: out,cost={"edits":[],"unfixable":["call failed"]},0
    fx=f"{HERE}/work2/{doc}_fx.pdf"; n=apply(src, fx, out.get("edits",[]))
    fin=f"{HERE}/work2/{doc}_final.pdf"; finish.finish(fx, fin, title=doc)
    sem=verifiers.semantic_check(fin, model=MODEL, workdir=f"{HERE}/work2"); cost+=sem.get("cost_usd") or 0
    ua=vera_batch.validate([fin])[fin]
    res[doc]={"v1_after":r1["after"],"edits":n,"semantic_after":major(sem),"pdfua_compliant":ua.get("compliant"),"pdfua_failed":ua.get("failed_rules"),"unfixable":out.get("unfixable",[]),"cost_usd":round(cost,4),"secs":round(time.time()-t0,1)}
    json.dump(res, open(resf,"w"), indent=1)
    print(doc, "v1:",r1["after"],"| edits:",n,"| v2 semantic:",res[doc]["semantic_after"],"| PDF/UA:",ua.get("compliant"),ua.get("failed_rules"), flush=True)
