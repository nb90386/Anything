// Render fixture HTML to tagged PDFs with Chromium (ground truth structure comes from the HTML semantics).
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
(async () => {
  const { docs, css } = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/docs.json')));
  const b = await chromium.launch(); const pg = await b.newPage();
  for (const [name, body] of Object.entries(docs)) {
    await pg.setContent(`<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${name}</title>${css}</head><body>${body}</body></html>`);
    await pg.pdf({ path: path.join(__dirname, 'fixtures', `${name}.tagged.pdf`), format: 'Letter', tagged: true, printBackground: true });
    console.log('rendered', name);
  }
  await b.close();
})();
