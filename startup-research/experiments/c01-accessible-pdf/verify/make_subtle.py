"""Subtle single-element defects (harder than the blanket ones): one H2 -> P, one adjacent swap of top-level blocks, one TH -> TD, one LI -> P."""
import pikepdf, glob, os, json
HERE=os.path.dirname(os.path.abspath(__file__)); FX=os.path.join(os.path.dirname(HERE),"fixtures"); OUT=os.path.join(HERE,"cases_subtle"); os.makedirs(OUT,exist_ok=True)
def elems(pdf):
    out=[]
    def walk(e):
        if isinstance(e, pikepdf.Array):
            for x in e: walk(x)
        elif isinstance(e, pikepdf.Dictionary) and "/S" in e:
            out.append(e); 
            if "/K" in e: walk(e.K)
    walk(pdf.Root.StructTreeRoot.K); return out
man=[]
for f in sorted(glob.glob(f"{FX}/*.tagged.pdf")):
    name=os.path.basename(f).replace(".tagged.pdf","")
    for defect in ["one_heading_as_p","one_swap","one_th_as_td","one_li_as_p"]:
        pdf=pikepdf.open(f); E=elems(pdf); ok=False
        if defect=="one_heading_as_p":
            hs=[e for e in E if str(e.S)=="/H2"]
            if len(hs)>=2: hs[len(hs)//2].S=pikepdf.Name("/P"); ok=True
        elif defect=="one_th_as_td":
            th=[e for e in E if str(e.S)=="/TH"]
            if th: th[1 if len(th)>1 else 0].S=pikepdf.Name("/TD"); ok=True
        elif defect=="one_li_as_p":
            li=[e for e in E if str(e.S)=="/LI"]
            if len(li)>=2: li[-1].S=pikepdf.Name("/P"); ok=True
        elif defect=="one_swap":
            k=pdf.Root.StructTreeRoot.K; d=k[0] if isinstance(k,pikepdf.Array) else k; kids=list(d.K)
            idx=[i for i in range(2,len(kids)-1) if str(kids[i].get("/S"))=="/P" and str(kids[i+1].get("/S")) in ("/P","/H2")]
            if idx: i=idx[0]; kids[i],kids[i+1]=kids[i+1],kids[i]; d.K=pikepdf.Array(kids); ok=True
        if ok:
            p=f"{OUT}/{name}__{defect}.pdf"; pdf.save(p); man.append({"doc":name,"defect":defect,"path":p})
json.dump(man, open(f"{HERE}/manifest_subtle.json","w"), indent=1); print(len(man),"subtle cases")
