"""Two verifiers for tagged PDFs.
rule_check: deterministic checks approximating PDF/UA machine-checkable rules (struct tree present, untagged text, first heading H1 / skipped levels,
            tables without header cells, figures without alt). NOT veraPDF; a stand-in (veraPDF could not be installed in this sandbox).
semantic_check: an LLM judge sees the rendered page and the tag tree in screen-reader order and reports mismatches."""
import pikepdf, pdfplumber, json, os, re, subprocess, time, sys
import pypdfium2 as pdfium
def tag_tree(path):
    pdf = pikepdf.open(path)
    with pdfplumber.open(path) as pl: chars = pl.pages[0].chars
    txt = {}
    for c in chars: txt.setdefault(c.get("mcid"), []).append(c["text"])
    lines=[]; referenced=set(); heads=[]; tables=[]; figs=[]
    def mc(e):
        out=[]; k=e.get("/K")
        if k is None: return out
        for it in (list(k) if isinstance(k, pikepdf.Array) else [k]):
            if isinstance(it, pikepdf.Dictionary):
                if "/MCID" in it: out.append(int(it.MCID))
            else:
                try: out.append(int(it))
                except Exception: pass
        return out
    def walk(e, d):
        if isinstance(e, pikepdf.Array):
            for x in e: walk(x, d); 
            return
        if not (isinstance(e, pikepdf.Dictionary) and "/S" in e): return
        s=str(e.S)[1:]; ids=mc(e); referenced.update(ids)
        t="".join("".join(txt.get(i,[])) for i in ids).strip()
        if s in ("NonStruct","Span") and t: lines.append("  "*d+"text: "+t)
        elif s not in ("NonStruct","Span"):
            lines.append("  "*d+s+(": "+t if t else "") + (f' [Alt="{e.get("/Alt")}"]' if "/Alt" in e else ""))
        if re.fullmatch(r"H[1-6]", s): heads.append(int(s[1]))
        if s=="Table": tables.append(e)
        if s=="Figure": figs.append(e)
        if "/K" in e: walk(e.K, d+1)
    walk(pdf.Root.StructTreeRoot.K, 0)
    unref = "".join(c["text"] for c in chars if c.get("mcid") is not None and c.get("mcid") not in referenced).strip()
    untagged_raw = "".join(c["text"] for c in chars if c.get("mcid") is None).strip()
    tables_have_th = [has_th(t) for t in tables]; figs_have_alt = ["/Alt" in fg for fg in figs]
    return {"lines": lines, "heads": heads, "tables_have_th": tables_have_th, "figs_have_alt": figs_have_alt, "unreferenced_text": unref + untagged_raw, "lang": "/Lang" in pdf.Root, "marked": bool(pdf.Root.get("/MarkInfo") and pdf.Root.MarkInfo.get("/Marked"))}
def has_th(table):
    found=False
    def walk(e):
        nonlocal found
        if isinstance(e, pikepdf.Array):
            for x in e: walk(x)
        elif isinstance(e, pikepdf.Dictionary) and "/S" in e:
            if str(e.S)=="/TH": found=True
            if "/K" in e: walk(e.K)
    walk(table.K); return found
def rule_check(path):
    T = tag_tree(path); f=[]
    if not T["marked"]: f.append("not_marked")
    if not T["lang"]: f.append("missing_lang")
    if T["unreferenced_text"]: f.append("missing_content")
    if T["heads"] and T["heads"][0]!=1: f.append("heading_level")
    if any(b-a>1 for a,b in zip(T["heads"], T["heads"][1:])): f.append("heading_level")
    if not all(T["tables_have_th"]): f.append("table_headers")
    if not all(T["figs_have_alt"]): f.append("alt_text")
    return sorted(set(f))
PROMPT = """You are auditing whether a tagged PDF works for a screen-reader user. The rendered page is at {img}.
Below is the PDF's tag tree in the exact order a screen reader traverses it (role: text). Compare it to what a sighted reader sees.
Report only real, user-impacting mismatches, in these categories:
- heading_missing: visually evident headings tagged as paragraphs or plain text
- heading_level: heading levels that do not match the visual hierarchy (e.g., section headings tagged H4 under an H1, or skipped levels)
- reading_order: tag order differs from the logical visual reading order
- table_headers: tables whose header row/column is not tagged as header cells
- list_structure: visual lists not tagged as lists/list items
- missing_content: visible meaningful text absent from the tag tree
- alt_text: images with missing or meaningless alt text
TAG TREE:
{tree}
Return ONLY JSON: {{"defects":[{{"category":"...","severity":"major|minor","evidence":"short"}}],"pass":true|false}}. Use an empty list if the structure is correct."""
def semantic_check(path, model="claude-sonnet-5-5", workdir="/tmp"):
    T = tag_tree(path); img = os.path.join(workdir, os.path.basename(path).replace(".pdf",".png"))
    pdfium.PdfDocument(path)[0].render(scale=150/72).to_pil().save(img)
    t0=time.time()
    r = subprocess.run(["claude","-p","--model",model,"--allowedTools","Read","--output-format","json","--max-turns","4",PROMPT.format(img=img, tree="\n".join(T["lines"]))], capture_output=True, text=True, timeout=400, stdin=subprocess.DEVNULL)
    dt=time.time()-t0
    try:
        j=json.loads(r.stdout); res=j.get("result",""); s=res.find("{"); e=res.rfind("}"); out=json.loads(res[s:e+1])
        return {"defects": out.get("defects",[]), "pass": out.get("pass"), "secs": round(dt,1), "cost_usd": j.get("total_cost_usd")}
    except Exception as ex:
        return {"error": (r.stdout+r.stderr)[-300:], "secs": round(dt,1)}
