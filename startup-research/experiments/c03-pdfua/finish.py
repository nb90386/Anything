"""Deterministic PDF/UA finishing pass (no AI):
- XMP metadata with pdfuaid:part=1 and dc:title; ViewerPreferences/DisplayDocTitle; MarkInfo/Marked; Lang
- Page /Tabs /S (structure order) for pages with annotations
- Struct elements wrongly typed /Artifact -> remove from tree and convert their marked content to artifacts in the content stream
- Heading normalization: first heading becomes H1; no skipped levels (H1->H4 becomes H1->H2)"""
import pikepdf, sys, os, glob, re
def struct_elems(pdf):
    out=[]
    def walk(e, parent):
        if isinstance(e, pikepdf.Array):
            for x in list(e): walk(x, parent)
        elif isinstance(e, pikepdf.Dictionary) and "/S" in e:
            out.append((e,parent))
            if "/K" in e: walk(e.K, e)
    walk(pdf.Root.StructTreeRoot.K, None); return out
def mcids(e):
    k=e.get("/K"); ids=[]
    for it in (list(k) if isinstance(k,pikepdf.Array) else ([k] if k is not None else [])):
        if isinstance(it,pikepdf.Dictionary) and "/MCID" in it: ids.append(int(it.MCID))
        elif not isinstance(it,pikepdf.Dictionary):
            try: ids.append(int(it))
            except Exception: pass
    return ids
def finish(src, dst, title=None):
    pdf=pikepdf.open(src)
    title = title or os.path.splitext(os.path.basename(src))[0]
    with pdf.open_metadata(set_pikepdf_as_editor=False) as m:
        m["dc:title"]=title
        m["pdfuaid:part"]="1"
    pdf.Root.Lang=pikepdf.String(str(pdf.Root.get("/Lang","en-US")))
    vp=pdf.Root.get("/ViewerPreferences") or pikepdf.Dictionary(); vp.DisplayDocTitle=True; pdf.Root.ViewerPreferences=vp
    mi=pdf.Root.get("/MarkInfo") or pikepdf.Dictionary(); mi.Marked=True; pdf.Root.MarkInfo=mi
    if "/Info" in pdf.trailer: pdf.trailer.Info.Title=pikepdf.String(title)
    for page in pdf.pages:
        if "/Annots" in page.obj: page.obj.Tabs=pikepdf.Name("/S")
    if "/StructTreeRoot" in pdf.Root:
        E=struct_elems(pdf)
        # 1) artifacts typed as struct elements
        art_mcids=set()
        for e,parent in E:
            if str(e.S)=="/Artifact":
                art_mcids.update(mcids(e))
                if parent is not None and isinstance(parent.get("/K"),pikepdf.Array):
                    parent.K=pikepdf.Array([x for x in parent.K if not (isinstance(x,pikepdf.Dictionary) and x.objgen==e.objgen)])
        if art_mcids:
            for page in pdf.pages:
                ops=pikepdf.parse_content_stream(page); new=[]
                for operands, op in ops:
                    if str(op)=="BDC" and len(operands)==2 and isinstance(operands[1],pikepdf.Dictionary) and "/MCID" in operands[1] and int(operands[1].MCID) in art_mcids:
                        new.append(([pikepdf.Name("/Artifact")], pikepdf.Operator("BMC")))
                    else: new.append((operands, op))
                page.Contents=pdf.make_stream(pikepdf.unparse_content_stream(new))
        # 2) heading normalization
        E=struct_elems(pdf); heads=[e for e,_ in E if re.fullmatch(r"/H[1-6]", str(e.S))]
        prev=0
        for i,e in enumerate(heads):
            lvl=int(str(e.S)[2])
            if i==0: lvl=1
            elif lvl>prev+1: lvl=prev+1
            e.S=pikepdf.Name(f"/H{lvl}"); prev=lvl
    # 3) incomplete CIDSet entries (PDF/UA 7.21.4.2): remove; CIDSet is optional
    for obj in pdf.objects:
        if isinstance(obj, pikepdf.Dictionary) and obj.get("/Type")=="/FontDescriptor" and "/CIDSet" in obj:
            del obj["/CIDSet"]
    pdf.save(dst)
if __name__=="__main__":
    out=sys.argv[1]; os.makedirs(out, exist_ok=True)
    for f in sorted(sum([glob.glob(p) for p in sys.argv[2:]],[])):
        try: finish(f, os.path.join(out, os.path.basename(f)))
        except Exception as ex: print("ERR", f, ex)
