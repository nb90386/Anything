#!/usr/bin/env python3
"""Build 03-source-library.md: every URL cited in data/ files, grouped by originating file, with source type and date where recorded."""
import json, glob, os, re
root=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
out=["# 03 — Source Library","","Every URL cited in this research, grouped by the file that cites it. Retrieval dates: 2026-11-02/03 unless noted. Problem-record sources carry the agent-assigned source type and source date. URLs were taken from search results or GitHub pages; none were constructed by hand. Inclusion here does not mean a source was independently verified beyond what the citing file states.",""]
seen=set(); total=0
out.append("## A. Problem database sources (from data/problems-*.json)"); out.append("")
out.append("| Problem | Source type | Source date | URL | What it shows |"); out.append("|---|---|---|---|---|")
for f in sorted(glob.glob(f"{root}/data/problems-*.json")):
    for r in json.load(open(f)):
        for s in r.get("sources",[]) or []:
            if not isinstance(s,dict): continue
            u=s.get("url","").strip()
            if not u: continue
            total+=1; seen.add(u)
            note=(s.get("note","") or "").replace("|","/").replace("\n"," ")[:140]
            out.append(f"| {r.get('id')} | {s.get('type','')} | {s.get('date','')} | {u} | {note} |")
for f in sorted(glob.glob(f"{root}/data/*.md")):
    name=os.path.basename(f)
    if name in ("AGENT_BRIEF.md",): continue
    urls=[]
    for u in re.findall(r"https?://[^\s\)\]>|`\"]+", open(f).read()):
        u=u.rstrip(".,;")
        if u not in urls: urls.append(u)
    if not urls: continue
    out.append(""); out.append(f"## {name} ({len(urls)} URLs)"); out.append("")
    for u in urls: out.append(f"- {u}"); seen.add(u)
open(f"{root}/03-source-library.md","w").write("\n".join(out)+"\n")
print("problem-source citations:", total, "| unique URLs overall:", len(seen))
