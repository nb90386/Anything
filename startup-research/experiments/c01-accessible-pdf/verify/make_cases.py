"""Inject realistic semantic tagging defects into correctly tagged PDFs. Visual content is unchanged; only the tag tree is wrong.
Defects: heading_as_p (all H2 -> P), heading_level (H2 -> H4), reading_order (top-level sections reversed after the title),
table_no_headers (TH -> TD), list_as_p (L/LI -> Div/P), untagged_content (one paragraph's struct element removed => unmarked text; a syntax check should catch this)."""
import pikepdf, glob, os, json, copy
HERE = os.path.dirname(os.path.abspath(__file__)); FX = os.path.join(os.path.dirname(HERE), "fixtures"); OUT = os.path.join(HERE, "cases")
def elems(pdf):
    out=[]
    def walk(e):
        if isinstance(e, pikepdf.Array):
            for x in e: walk(x)
        elif isinstance(e, pikepdf.Dictionary) and "/S" in e:
            out.append(e)
            if "/K" in e: walk(e.K)
    walk(pdf.Root.StructTreeRoot.K); return out
def doc_root(pdf):
    k = pdf.Root.StructTreeRoot.K
    d = k[0] if isinstance(k, pikepdf.Array) else k
    return d
manifest=[]
for f in sorted(glob.glob(f"{FX}/*.tagged.pdf")):
    name=os.path.basename(f).replace(".tagged.pdf","")
    def save(pdf, defect):
        p=f"{OUT}/{name}__{defect}.pdf"; pdf.save(p); manifest.append({"doc":name,"defect":defect,"path":p})
    save(pikepdf.open(f), "clean")
    for defect in ["heading_as_p","heading_level","reading_order","table_no_headers","list_as_p","untagged_content"]:
        pdf=pikepdf.open(f); E=elems(pdf); changed=False
        if defect=="heading_as_p":
            for e in E:
                if str(e.S)=="/H2": e.S=pikepdf.Name("/P"); changed=True
        elif defect=="heading_level":
            for e in E:
                if str(e.S)=="/H2": e.S=pikepdf.Name("/H4"); changed=True
        elif defect=="table_no_headers":
            for e in E:
                if str(e.S)=="/TH": e.S=pikepdf.Name("/TD"); changed=True
        elif defect=="list_as_p":
            for e in E:
                if str(e.S)=="/L": e.S=pikepdf.Name("/Div"); changed=True
                elif str(e.S)=="/LI": e.S=pikepdf.Name("/P"); changed=True
        elif defect=="reading_order":
            d=doc_root(pdf); kids=list(d.K)
            if len(kids)>4:
                new=kids[:2]+kids[2:][::-1]; d.K=pikepdf.Array(new); changed=True
        elif defect=="untagged_content":
            d=doc_root(pdf); kids=list(d.K)
            ps=[i for i,k in enumerate(kids) if isinstance(k,pikepdf.Dictionary) and str(k.get("/S"))=="/P"]
            if ps:
                i=ps[len(ps)//2]; del kids[i]; d.K=pikepdf.Array(kids); changed=True
        if changed: save(pdf, defect)
json.dump(manifest, open(f"{HERE}/manifest.json","w"), indent=1)
from collections import Counter; print(len(manifest),"cases", Counter(m["defect"] for m in manifest))
