"""Generate labeled test fixtures: realistic documents rendered by Chromium (tagged PDFs = ground truth),
then stripped of tags (untagged) and rasterized (scanned-like). All fixtures are synthetic and labeled as such."""
import asyncio, os, json
from playwright.async_api import async_playwright
HERE = os.path.dirname(os.path.abspath(__file__)); FX = os.path.join(HERE, "fixtures")
DOCS = {
"benefits_letter": """<h1>County of Alameda — Social Services Agency</h1><p>Notice of Action: CalFresh Recertification</p>
<p>Date: October 14, 2026<br>Case Number: 1234567</p><h2>What you need to do</h2><p>Your CalFresh benefits are scheduled to end on <b>November 30, 2026</b> unless you complete recertification. You must complete the following steps:</p>
<ol><li>Complete the attached recertification form (SAR 7).</li><li>Provide proof of income for the last 30 days.</li><li>Attend a phone interview on November 10, 2026 at 9:30 AM.</li></ol>
<h2>Your household information</h2><table><tr><th>Member</th><th>Relationship</th><th>Included</th></tr><tr><td>Maria L.</td><td>Self</td><td>Yes</td></tr><tr><td>Jose L.</td><td>Child</td><td>Yes</td></tr><tr><td>Ana L.</td><td>Child</td><td>Yes</td></tr></table>
<h2>Your rights</h2><p>If you disagree with this action you may request a state hearing within 90 days. Call 1-800-952-5253 (TTY 1-800-952-8349).</p><p><img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAiIGhlaWdodD0iNDAiPjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iNDAiIGZpbGw9IiMzMzYiLz48L3N2Zz4=" alt="County seal" width="120" height="40"></p>""",
"syllabus": """<h1>CS 61A — Structure and Interpretation of Computer Programs</h1><p>Fall 2026 · Section 03 · Instructor: Dr. R. Chen · Office hours: Tue 2–4 PM</p>
<h2>Course description</h2><p>This course introduces programming and computer science using Python, Scheme, and SQL. Students learn abstraction, recursion, and interpreters.</p>
<h2>Grading</h2><table><tr><th>Component</th><th>Weight</th><th>Notes</th></tr><tr><td>Homework</td><td>15%</td><td>Weekly, lowest two dropped</td></tr><tr><td>Projects</td><td>35%</td><td>Four projects</td></tr><tr><td>Midterms</td><td>25%</td><td>Two exams</td></tr><tr><td>Final</td><td>25%</td><td>Cumulative</td></tr></table>
<h2>Weekly schedule</h2><table><tr><th>Week</th><th>Topic</th><th>Reading</th></tr><tr><td>1</td><td>Functions</td><td>Ch. 1.1–1.3</td></tr><tr><td>2</td><td>Higher-order functions</td><td>Ch. 1.4–1.6</td></tr><tr><td>3</td><td>Recursion</td><td>Ch. 1.7</td></tr><tr><td>4</td><td>Data abstraction</td><td>Ch. 2.1–2.3</td></tr></table>
<h2>Accommodations</h2><p>Students with disabilities should contact the Disabled Students Program to arrange accommodations.</p><ul><li>Extended time on exams</li><li>Note-taking support</li><li>Accessible course materials</li></ul>""",
"city_agenda": """<h1>City of Manteca — City Council Regular Meeting Agenda</h1><p>Tuesday, November 4, 2026, 7:00 PM · Council Chambers, 1001 W. Center St.</p>
<h2>1. Call to order</h2><p>Pledge of Allegiance and roll call.</p><h2>2. Public comment</h2><p>Members of the public may address the Council on any item within its jurisdiction for up to three minutes.</p>
<h2>3. Consent calendar</h2><ol><li>Approve minutes of October 21, 2026 meeting.</li><li>Accept the Public Records Request Annual Report (510 requests received in 2026).</li><li>Authorize purchase of redaction software not to exceed $48,000.</li></ol>
<h2>4. Public hearings</h2><p>4.1 Ordinance 2026-14 amending the Accessory Dwelling Unit standards to comply with SB 543 shot-clock requirements.</p>
<h2>5. Adjournment</h2><table><tr><th>Item</th><th>Staff contact</th><th>Phone</th></tr><tr><td>3.2</td><td>City Clerk</td><td>(209) 456-8000</td></tr><tr><td>4.1</td><td>Planning Director</td><td>(209) 456-8500</td></tr></table>""",
"two_column_report": """<h1>Quarterly Accessibility Report</h1><p>Office of Digital Services · Q3 2026</p><div class="cols"><div><h2>Summary</h2><p>During the third quarter the office remediated 1,240 documents and reviewed 86 web properties. Conformance rose from 37% to 52% of top-viewed documents.</p><h2>Methods</h2><p>Documents were assessed with automated checks and manual screen-reader review using NVDA and VoiceOver.</p></div><div><h2>Findings</h2><ul><li>Scanned PDFs remain the largest category of failures.</li><li>Untagged forms announce unlabeled edit boxes.</li><li>Reading order errors affect 1 in 5 multi-column pages.</li></ul><h2>Next steps</h2><p>Prioritize benefits letters and forms for remediation before April 2027.</p></div></div>""",
"form": """<h1>Request for Alternative Format</h1><p>Use this form to request documents in an accessible format.</p>
<form><p><label for="n">Full name</label> <input id="n" name="fullname"></p><p><label for="e">Email address</label> <input id="e" name="email"></p><p><label for="d">Document title</label> <input id="d" name="doc"></p>
<fieldset><legend>Requested format</legend><p><input type="checkbox" id="f1" name="braille"><label for="f1">Braille</label></p><p><input type="checkbox" id="f2" name="largeprint"><label for="f2">Large print</label></p><p><input type="checkbox" id="f3" name="tagged"><label for="f3">Tagged PDF</label></p></fieldset>
<p><label for="c">Additional comments</label><br><textarea id="c" name="comments" rows="3" cols="40"></textarea></p></form><h2>Where to send</h2><p>Mail to: ADA Coordinator, 1001 W. Center St., Manteca, CA 95337.</p>"""}
CSS = "<style>body{font-family:Georgia,serif;font-size:11pt;margin:36px} table{border-collapse:collapse} th,td{border:1px solid #444;padding:4px 8px} .cols{display:flex;gap:24px} .cols>div{flex:1} input,textarea{border:1px solid #333}</style>"
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page()
        for name, body in DOCS.items():
            await pg.set_content(f"<!doctype html><html lang='en'><head><meta charset='utf-8'><title>{name}</title>{CSS}</head><body>{body}</body></html>")
            await pg.pdf(path=os.path.join(FX, f"{name}.tagged.pdf"), format="Letter", tagged=True)
        await b.close()
    print("rendered", list(DOCS))
asyncio.run(main())
