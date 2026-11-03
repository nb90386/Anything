// Render semantic HTML (from extracted Markdown) to tagged PDFs with Chromium.
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
(async () => { const dir = process.argv[2]; const b = await chromium.launch(); const pg = await b.newPage();
  for (const f of fs.readdirSync(dir).filter(x => x.endsWith('.html'))) {
    await pg.setContent(fs.readFileSync(path.join(dir, f), 'utf8'));
    await pg.pdf({ path: path.join(dir, f.replace('.html', '.pdf')), format: 'Letter', tagged: true }); }
  await b.close(); })();
