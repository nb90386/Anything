"""1) Extract ground-truth structure from Chromium-tagged PDFs. 2) Produce untagged copies (struct tree + marked content removed). 3) Produce scanned (image-only) copies."""
import pikepdf, pdfplumber, json, glob, os, io, sys
import pypdfium2 as pdfium
from PIL import Image
LEAF = {"/H1","/H2","/H3","/P","/LI","/TH","/TD","/Figure","/Caption","/Lbl"}
def mcids_of(e):
    out=[]; k=e.get("/K")
    if k is None: return out
    items = list(k) if isinstance(k, pikepdf.Array) else [k]
    for it in items:
        if isinstance(it, pikepdf.Dictionary):
            if "/MCID" in it: out.append(int(it.MCID))
            elif "/S" in it: out += mcids_of(it)
        else:
            try: out.append(int(it))
            except Exception: pass
    return out
def gt_blocks(path):
    pdf = pikepdf.open(path)
    with pdfplumber.open(path) as pl:
        chars = pl.pages[0].chars
    txt = {}
    for c in chars: txt.setdefault(c.get("mcid"), []).append(c["text"])
    def t(mcs): return "".join("".join(txt.get(m, [])) for m in mcs).strip()
    blocks=[]
    def walk(e):
        if isinstance(e, pikepdf.Array):
            for x in e: walk(x); 
            return
        if not (isinstance(e, pikepdf.Dictionary) and "/S" in e): return
        s = str(e.S)
        if s == "/Table":
            rows=[]
            for tr in (e.K if isinstance(e.K, pikepdf.Array) else [e.K]):
                if not isinstance(tr, pikepdf.Dictionary) or str(tr.get("/S"))!="/TR": continue
                cells=[]
                for td in (tr.K if isinstance(tr.K, pikepdf.Array) else [tr.K]):
                    if not isinstance(td, pikepdf.Dictionary): continue
                    cells.append({"th": str(td.S)=="/TH", "text": t(mcids_of(td))})
                rows.append(cells)
            blocks.append({"type":"Table","rows":rows}); return
        if s == "/L":
            items=[]
            for li in (e.K if isinstance(e.K, pikepdf.Array) else [e.K]):
                if not isinstance(li, pikepdf.Dictionary) or str(li.get("/S"))!="/LI": continue
                body=[k for k in (li.K if isinstance(li.K, pikepdf.Array) else [li.K]) if isinstance(k, pikepdf.Dictionary) and str(k.get("/S"))!="/Lbl"]
                items.append(t(sum((mcids_of(b) for b in body), [])))
            blocks.append({"type":"List","items":items}); return
        if s == "/Figure":
            blocks.append({"type":"Figure","alt": str(e.get("/Alt",""))}); return
        if s in ("/H1","/H2","/H3","/P"):
            tx = t(mcids_of(e))
            if tx: blocks.append({"type": s[1:], "text": tx})
            return
        if "/K" in e: walk(e.K)
    walk(pdf.Root.StructTreeRoot.K)
    return blocks
def strip_tags(src, dst):
    pdf = pikepdf.open(src)
    for k in ("/StructTreeRoot","/MarkInfo"):
        if k in pdf.Root: del pdf.Root[k]
    for page in pdf.pages:
        ops = pikepdf.parse_content_stream(page)
        new = [(o, op) for o, op in ops if str(op) not in ("BDC","EMC","BMC")]
        page.Contents = pdf.make_stream(pikepdf.unparse_content_stream(new))
        if "/StructParents" in page.obj: del page.obj["/StructParents"]
    pdf.save(dst)
def scan(src, dst, dpi=200):
    doc = pdfium.PdfDocument(src); img = doc[0].render(scale=dpi/72).to_pil().convert("RGB")
    img.save(dst, "PDF", resolution=dpi)
gt = {}
for f in sorted(glob.glob("fixtures/*.tagged.pdf")):
    name = os.path.basename(f).replace(".tagged.pdf","")
    gt[name] = gt_blocks(f)
    strip_tags(f, f"fixtures/{name}.untagged.pdf")
    scan(f, f"fixtures/{name}.scanned.pdf")
    n = len(gt[name]); print(name, "GT blocks:", n, [b["type"] for b in gt[name]])
json.dump(gt, open("fixtures/ground_truth.json","w"), indent=1)
# verify untagged has no struct tree and scanned has no text
for name in gt:
    u = pikepdf.open(f"fixtures/{name}.untagged.pdf"); 
    with pdfplumber.open(f"fixtures/{name}.scanned.pdf") as s: nchars = len(s.pages[0].chars)
    with pdfplumber.open(f"fixtures/{name}.untagged.pdf") as s2: nchars2 = len(s2.pages[0].chars)
    print(name, "untagged struct:", "/StructTreeRoot" in u.Root, "untagged chars:", nchars2, "scanned chars:", nchars)
print(json.dumps(gt["benefits_letter"], indent=0)[:900])
