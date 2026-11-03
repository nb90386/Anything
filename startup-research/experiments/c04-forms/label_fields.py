"""Form-field accessible-name test: draw numbered field boxes on page 1 of a real IRS 1040, ask Claude to write a tooltip (/TU) per field, write them into the PDF."""
import pikepdf, pypdfium2 as pdfium, json, subprocess, sys
from PIL import ImageDraw, ImageFont
pdf=pikepdf.open("f1040.pdf"); page=pdf.pages[0]; H=float(page.mediabox[3]); scale=110/72
img=pdfium.PdfDocument("f1040.pdf")[0].render(scale=scale).to_pil().convert("RGB"); d=ImageDraw.Draw(img)
fields=[]
for a in page.obj.get("/Annots",[]):
    if a.get("/Subtype")!="/Widget": continue
    f=a if "/FT" in a else a.get("/Parent",a)
    ft=str(f.get("/FT", a.get("/FT","")))
    r=[float(x) for x in a.Rect]; x0,y0,x1,y1=r[0]*scale,(H-r[3])*scale,r[2]*scale,(H-r[1])*scale
    i=len(fields); fields.append({"i":i,"type":{"/Tx":"text","/Btn":"checkbox/radio","/Ch":"choice"}.get(ft,ft),"name":str(f.get("/T",""))})
    d.rectangle([x0,y0,x1,y1], outline=(255,0,0), width=1); d.text((x0+1,y0), str(i), fill=(0,0,255))
img.save("f1040_p1_numbered.png"); json.dump(fields, open("fields.json","w"), indent=0); print(len(fields),"widgets on page 1")
prompt=f"""The image at {__import__('os').path.abspath('f1040_p1_numbered.png')} is page 1 of IRS Form 1040 with every fillable field outlined in red and numbered in blue.
For each numbered field, write the accessible name a screen-reader user should hear (a short tooltip, e.g. "Line 1a, Total amount from Form(s) W-2, box 1" or "Filing status: Single"). Use the printed text near the field. Fields: {json.dumps([{k:f[k] for k in ('i','type')} for f in fields])}
Return ONLY JSON: {{"labels":[{{"i":0,"tu":"..."}}, ...]}}"""
r=subprocess.run(["claude","-p","--model","claude-sonnet-5-5","--allowedTools","Read","--output-format","json","--max-turns","4",prompt],capture_output=True,text=True,timeout=600,stdin=subprocess.DEVNULL)
j=json.loads(r.stdout); t=j["result"]; labels=json.loads(t[t.find("{"):t.rfind("}")+1])["labels"]
json.dump({"labels":labels,"cost_usd":j.get("total_cost_usd")}, open("labels.json","w"), indent=1)
print("labels:",len(labels),"cost",j.get("total_cost_usd"))
