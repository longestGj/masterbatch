// Gate 3 drawing source only; no WordPress implementation behavior.
const fs = require('node:fs');
const path = require('node:path');
const {pathToFileURL} = require('node:url');
const {chromium} = require('C:/Users/longe/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const out = __dirname;
(async () => {
  const browser = await chromium.launch({headless:true});
  for (const width of [1440,768,390]) {
    const page = await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1});
    await page.goto(pathToFileURL(path.join(out,'p017-visual.html')).href);
    await page.screenshot({path:path.join(out,`p017-${width}.png`),fullPage:true});
    const state = await page.evaluate(() => ({width:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight,images:[...document.images].map(x=>x.complete&&x.naturalWidth>0),facts:document.querySelectorAll('.facts tbody tr').length,headings:[...document.querySelectorAll('main h1,main h2')].map(x=>x.textContent.trim())}));
    if(state.width>width||state.images.includes(false)||state.facts!==5) throw new Error(`${width}: ${JSON.stringify(state)}`);
    process.stdout.write(`${width}: ${JSON.stringify(state)}\n`);
    await page.close();
  }
  await browser.close();
})().catch(e=>{console.error(e);process.exitCode=1});
