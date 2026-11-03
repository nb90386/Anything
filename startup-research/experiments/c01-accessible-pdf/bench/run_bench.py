"""Run a vision-language model (Claude via headless CLI) on a deterministic sample of opendataloader-bench PDFs,
score with the benchmark's own metric code (copied, Apache-2.0), and validate the scorer by reproducing published scores."""
import json, os, sys, subprocess, time, random, glob
import pypdfium2 as pdfium
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, os.path.join(HERE, "eval"))
from evaluator_reading_order import evaluate_reading_order
from evaluator_table import evaluate_table
from evaluator_heading_level import evaluate_heading_level
EXT = sys.argv[1]; MODEL = sys.argv[2]; N_T = int(sys.argv[3]); N_H = int(sys.argv[4]); MODE = sys.argv[5] if len(sys.argv)>5 else "run"
PROMPT = """Convert the PDF page image at {img} into clean Markdown that preserves the document's logical structure, for use as an accessible version.
Rules: transcribe all body text exactly in correct reading order (multi-column: finish each column before the next); use # / ## / ### for real headings only;
render tables as Markdown pipe tables with a header row; use - for bulleted lists; omit running headers, footers and page numbers; do not describe images; output ONLY the Markdown."""
def score(gt, pred):
    nid, nid_s = evaluate_reading_order(gt, pred); teds, teds_s = evaluate_table(gt, pred); mhs, mhs_s = evaluate_heading_level(gt, pred)
    comps = [x for x in (nid, teds, mhs) if x is not None]
    return {"overall": sum(comps)/len(comps) if comps else None, "nid": nid, "teds": teds, "mhs": mhs}
ref = json.load(open(f"{EXT}/prediction/opendataloader-hybrid/evaluation.json"))["documents"]
tdocs = sorted(d["document_id"] for d in ref if d["scores"]["teds"] is not None)
hdocs = sorted(d["document_id"] for d in ref if d["scores"]["mhs"] is not None and d["scores"]["teds"] is None)
odocs = sorted(d["document_id"] for d in ref if d["scores"]["mhs"] is None and d["scores"]["teds"] is None)
rnd = random.Random(42); sample = rnd.sample(tdocs, N_T) + rnd.sample(hdocs, N_H) + rnd.sample(odocs, max(0, N_H//3))
if MODE == "validate":
    # reproduce published per-doc scores for two engines using the copied scorer
    for eng in ("opendataloader-hybrid", "docling"):
        pub = {d["document_id"]: d["scores"] for d in json.load(open(f"{EXT}/prediction/{eng}/evaluation.json"))["documents"]}
        diffs = []
        for doc in sample:
            gt = open(f"{EXT}/ground-truth/markdown/{doc}.md").read(); pr = open(f"{EXT}/prediction/{eng}/markdown/{doc}.md").read()
            s = score(gt, pr); diffs.append(abs((s["overall"] or 0) - (pub[doc]["overall"] or 0)))
        print(eng, "max |ours - published| overall over sample:", round(max(diffs), 6)); 
    sys.exit()
os.makedirs(f"{HERE}/pred/{MODEL}", exist_ok=True); rows = []
for doc in sample:
    out = f"{HERE}/pred/{MODEL}/{doc}.md"; meta = f"{HERE}/pred/{MODEL}/{doc}.meta.json"
    if not os.path.exists(out):
        img = f"{HERE}/pred/{MODEL}/{doc}.png"; pdfium.PdfDocument(f"{EXT}/pdfs/{doc}.pdf")[0].render(scale=150/72).to_pil().save(img)
        t0 = time.time()
        r = subprocess.run(["claude","-p","--model",MODEL,"--allowedTools","Read","--output-format","json","--max-turns","4",PROMPT.format(img=img)], capture_output=True, text=True, timeout=400, stdin=subprocess.DEVNULL)
        dt = time.time()-t0
        try: j = json.loads(r.stdout); md = j.get("result","")
        except Exception: print(doc, "ERR", (r.stdout+r.stderr)[-200:]); continue
        if md.strip().startswith("```"): md = md.strip().strip("`").split("\n",1)[1] if "\n" in md else md
        if "hit your" in md and "limit" in md: print(doc, "RATE LIMIT"); break
        open(out,"w").write(md); json.dump({"secs": round(dt,1), "cost_usd": j.get("total_cost_usd")}, open(meta,"w"))
        os.remove(img)
    m = json.load(open(meta)); gt = open(f"{EXT}/ground-truth/markdown/{doc}.md").read()
    s = score(gt, open(out).read()); s.update({"doc": doc, **m}); rows.append(s)
    print(doc, {k: (round(v,3) if isinstance(v,float) else v) for k,v in s.items() if k!="doc"}, flush=True)
json.dump({"model": MODEL, "sample": sample, "rows": rows}, open(f"{HERE}/results-{MODEL}.json","w"), indent=1)
# comparison on the same sample
engines = ["opendataloader", "opendataloader-hybrid", "docling", "nutrient", "marker", "mineru"]
def mean(xs): xs=[x for x in xs if x is not None]; return round(sum(xs)/len(xs),3) if xs else None
done = [r["doc"] for r in rows]
print(f"\nSAME-SAMPLE COMPARISON (n={len(done)} docs; published per-doc scores for other engines)")
print(f"{'engine':24s} overall    nid   teds    mhs")
ours = {k: mean([r[k] for r in rows]) for k in ("overall","nid","teds","mhs")}
print(f"{MODEL:24s} {ours['overall']}  {ours['nid']}  {ours['teds']}  {ours['mhs']}  $/page={mean([r.get('cost_usd') for r in rows])} s/page={mean([r.get('secs') for r in rows])}")
for eng in engines:
    p = f"{EXT}/prediction/{eng}/evaluation.json"
    if not os.path.exists(p): continue
    pub = {d["document_id"]: d["scores"] for d in json.load(open(p))["documents"]}
    print(f"{eng:24s} {mean([pub[d]['overall'] for d in done])}  {mean([pub[d]['nid'] for d in done])}  {mean([pub[d]['teds'] for d in done])}  {mean([pub[d]['mhs'] for d in done])}")
