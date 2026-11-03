"""Closed loop: extracted Markdown (Sonnet) -> semantic HTML -> Chromium tagged PDF -> semantic verifier vs ORIGINAL page image.
Measures the share of pages the automated pipeline cannot clear without a human (drives review cost)."""
import sys, os, json, glob, subprocess, markdown
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "verify"))
import verifiers
import pypdfium2 as pdfium
HERE=os.path.dirname(os.path.abspath(__file__)); EXT=sys.argv[1]; SRC=os.path.join(os.path.dirname(HERE),"bench","pred","claude-sonnet-5-5")
CSS="<style>body{font-family:Arial,sans-serif;font-size:11pt;margin:40px} table{border-collapse:collapse} th,td{border:1px solid #555;padding:3px 6px}</style>"
for md in sorted(glob.glob(f"{SRC}/*.md")):
    doc=os.path.basename(md)[:-3]; txt=open(md).read()
    if "API Error" in txt: continue
    html=markdown.markdown(txt, extensions=["tables"])
    open(f"{HERE}/pdf/{doc}.html","w").write(f"<!doctype html><html lang='en'><head><meta charset='utf-8'><title>{doc}</title>{CSS}</head><body>{html}</body></html>")
subprocess.run(["node", f"{HERE}/render.js", f"{HERE}/pdf"], check=True)
PROMPT_ORIG = verifiers.PROMPT.replace("The rendered page is at {img}.", "The ORIGINAL page (what the accessible version must faithfully represent) is at {img}.")
resf=f"{HERE}/results-loop.json"; res=json.load(open(resf)) if os.path.exists(resf) else {}
for p in sorted(glob.glob(f"{HERE}/pdf/*.pdf")):
    doc=os.path.basename(p)[:-4]
    if doc in res and "error" not in res[doc]: continue
    img=f"{HERE}/pdf/{doc}.orig.png"; pdfium.PdfDocument(f"{EXT}/pdfs/{doc}.pdf")[0].render(scale=150/72).to_pil().save(img)
    T=verifiers.tag_tree(p); prompt=PROMPT_ORIG.format(img=img, tree="\n".join(T["lines"]))
    r=subprocess.run(["claude","-p","--model","claude-sonnet-5-5","--allowedTools","Read","--output-format","json","--max-turns","4",prompt],capture_output=True,text=True,timeout=400,stdin=subprocess.DEVNULL)
    try:
        j=json.loads(r.stdout); t=j.get("result",""); o=json.loads(t[t.find("{"):t.rfind("}")+1])
        res[doc]={"defects":o.get("defects",[]),"cost_usd":j.get("total_cost_usd"),"rule":verifiers.rule_check(p)}
    except Exception: res[doc]={"error":(r.stdout+r.stderr)[-200:]}
    json.dump(res, open(resf,"w"), indent=1)
    maj=sorted({d["category"] for d in res[doc].get("defects",[]) if d.get("severity")=="major"})
    print(doc, "major:", maj, "minor:", sorted({d["category"] for d in res[doc].get("defects",[]) if d.get("severity")!="major"}), "rule:", res[doc].get("rule"), flush=True)
