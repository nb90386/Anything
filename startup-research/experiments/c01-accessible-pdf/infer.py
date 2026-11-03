"""Structure inference: render page -> image (+ text layer words when available) -> Claude via headless CLI -> structure JSON."""
import json, os, subprocess, sys, time, glob
import pypdfium2 as pdfium, pdfplumber
HERE = os.path.dirname(os.path.abspath(__file__))
PROMPT = """You are a document-accessibility structure analyzer. Read the page image at {img}.{textlayer}
Return ONLY a JSON array describing the page's logical structure in correct reading order (for multi-column layouts, follow the column flow, not visual rows). Block schema:
- {{"type":"H1"|"H2"|"H3","text":...}} for headings (H1 = document title, H2 = section headings)
- {{"type":"P","text":...}} for paragraphs (join line breaks inside a paragraph with a space; a line break that is forced inside one paragraph, like Date/Case Number lines, still counts as one P)
- {{"type":"List","items":[...]}} for bulleted/numbered lists (item text without the bullet/number)
- {{"type":"Table","rows":[[{{"th":true|false,"text":...}},...],...]}} for tables (header cells th=true)
- {{"type":"Figure","alt":"short alt text"}} for images/logos/seals
- {{"type":"FormField","label":...,"kind":"text"|"checkbox"|"textarea"}} for fill-in fields (a label plus a box)
Transcribe text exactly as printed. Do not add commentary. Output only the JSON array."""
def words_json(pdf_path):
    with pdfplumber.open(pdf_path) as pl:
        ws = pl.pages[0].extract_words(extra_attrs=["size"])
    return [{"t": w["text"], "x": round(w["x0"]), "y": round(w["top"]), "s": round(w["size"],1)} for w in ws]
def run(name, variant, model):
    pdf_path = f"{HERE}/fixtures/{name}.{variant}.pdf"; img = f"{HERE}/out/{name}.{variant}.png"
    pdfium.PdfDocument(pdf_path)[0].render(scale=150/72).to_pil().save(img)
    tl = ""
    if variant == "untagged":
        tl = " A text layer with word positions (x,y in points from top-left, s=font size) is provided to help with exact transcription and reading order: " + json.dumps(words_json(pdf_path))[:12000]
    prompt = PROMPT.format(img=img, textlayer=tl)
    t0 = time.time()
    r = subprocess.run(["claude","-p","--model",model,"--allowedTools","Read","--output-format","json","--max-turns","4",prompt], capture_output=True, text=True, timeout=300, stdin=subprocess.DEVNULL)
    dt = time.time()-t0
    try: j = json.loads(r.stdout)
    except Exception: return {"error": r.stdout[-500:]+r.stderr[-500:], "secs": dt}
    txt = j.get("result","")
    s = txt.find("["); e = txt.rfind("]")
    try: blocks = json.loads(txt[s:e+1])
    except Exception: blocks = None
    return {"blocks": blocks, "secs": round(dt,1), "cost_usd": j.get("total_cost_usd"), "usage": j.get("usage"), "raw": txt[:300] if blocks is None else None}
if __name__ == "__main__":
    model = sys.argv[1] if len(sys.argv)>1 else "claude-sonnet-5-5"
    variants = sys.argv[2].split(",") if len(sys.argv)>2 else ["untagged","scanned"]
    names = [os.path.basename(f).replace(".tagged.pdf","") for f in sorted(glob.glob(f"{HERE}/fixtures/*.tagged.pdf"))]
    for n in names:
        for v in variants:
            res = run(n, v, model)
            out = f"{HERE}/out/{n}.{v}.{model}.pred.json"; json.dump(res, open(out,"w"), indent=1)
            nb = len(res["blocks"]) if res.get("blocks") else None
            print(f"{n:18s} {v:9s} blocks={nb} secs={res.get('secs')} cost={res.get('cost_usd')} {'ERR '+str(res.get('error') or res.get('raw'))[:120] if nb is None else ''}", flush=True)
