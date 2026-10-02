/* Gate 3 drawing source. The buyer copy is read from the owner-confirmed P013 Page Spec. */
const fs = require('node:fs');
const path = require('node:path');
const {pathToFileURL} = require('node:url');
const deps = 'C:/Users/longe/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const {marked} = require(path.join(deps, 'marked'));
const {chromium} = require(path.join(deps, 'playwright'));

const out = __dirname;
const spec = fs.readFileSync(path.resolve(out, '../../pages/P013.md'), 'utf8');
const copy = spec.split('### Buyer-visible page copy')[1].split('### End buyer-visible page copy')[0].trim();
if (!copy || !copy.startsWith('# Black Masterbatch Manufacturer in China')) throw new Error('Confirmed buyer copy not found.');

const icon = name => fs.readFileSync(path.resolve(out, `../P001/assets/icons/${name}.svg`), 'utf8')
  .replace(/<title>[^<]*<\/title>/, '')
  .replace('<svg ', '<svg class="ui-icon" aria-hidden="true" focusable="false" ');
const arrow = icon('arrow-up-right');
const routeLinks = md => md
  .replace(/\*\*Explore Model Information\*\* → model range on this page/g, '[Explore Model Information](#model-range)')
  .replace(/\*\*([^*]+)\*\* → (\/[\w\-/]+)/g, '[$1]($2)');
function render(md) {
  return marked.parse(routeLinks(md), {gfm:true});
}
const tokens = marked.lexer(copy);
const groups = [[]];
for (const token of tokens) {
  if (token.type === 'heading' && token.depth === 2) groups.push([]);
  groups[groups.length - 1].push(token);
}
if (groups.length !== 6) throw new Error(`Expected six approved body modules, found ${groups.length}.`);
const tokenHtml = ts => render(ts.map(t => t.raw).join(''));
const actionClass = label => label === 'Discuss Your Requirements' ? 'primary' : 'secondary';
function actionList(html) {
  return html.replace(/<ul>\s*<li><a href="([^"]+)">([^<]+)<\/a><\/li>\s*<li><a href="([^"]+)">([^<]+)<\/a><\/li>\s*<\/ul>/g,
    (_, u1, l1, u2, l2) => `<div class="actions"><a class="btn ${actionClass(l1)}" href="${u1}">${l1}${arrow}</a><a class="btn ${actionClass(l2)}" href="${u2}">${l2}${arrow}</a></div>`);
}
function labeledTables(html) {
  return html.replace(/<table>([\s\S]*?)<\/table>/g, (_, body) => {
    const heads = [...body.matchAll(/<th[^>]*>([\s\S]*?)<\/th>/g)].map(m => m[1].replace(/<[^>]+>/g,'').trim());
    let col = 0;
    const content = body.replace(/<tr>|<td([^>]*)>/g, (match, attrs) => {
      if (match === '<tr>') { col = 0; return match; }
      return `<td${attrs} data-label="${heads[col++] || ''}">`;
    });
    return `<table>${content}</table>`;
  });
}
const navItems = [['Black Masterbatch','/products/black-masterbatch'],['Products','/products'],['Applications','/applications'],['About GE','/about']];
const nav = navItems.map(([label, url]) => `<a href="${url}">${label}</a>`).join('');
const brand = `<a class="brand" href="/" aria-label="GE Chemical homepage"><img src="../P001/assets/ge-logo-candidate.png" alt="GE Chemical &amp; Polymer Group Co., Ltd."></a>`;
const inquiry = `<a class="btn primary header-cta" href="/rfq">Discuss Your Requirements${arrow}</a>`;
const header = `<header class="site-header"><div class="shell header-inner">${brand}<nav class="desktop-nav" aria-label="Primary navigation">${nav}</nav><div class="tablet-inquiry">${inquiry}</div><details class="mobile-menu"><summary>Menu <span class="menu-open">${icon('menu')}</span><span class="menu-close">${icon('close')}</span></summary><nav aria-label="Mobile navigation">${nav}${inquiry}</nav></details></div></header>`;
const footerColumn = (label, items) => `<div class="footer-column"><p class="footer-title">${label}</p><nav aria-label="${label}">${items.map(([text,url]) => `<a href="${url}">${text}</a>`).join('')}</nav></div>`;
const footer = `<footer class="site-footer"><div class="shell footer-grid"><div class="footer-identity">${brand}<p>Binzhou, Shandong, China</p>${inquiry}</div>${footerColumn('Products', [['Black Masterbatch','/products/black-masterbatch'],['White Masterbatch','/products/white-masterbatch'],['Color Masterbatch','/products/color-masterbatch'],['Desiccant Masterbatch','/products/desiccant-defoaming-masterbatch']])}${footerColumn('Company', [['About GE','/about'],['Manufacturing & Quality','/manufacturing-quality']])}${footerColumn('Information', [['Applications','/applications'],['Product Documents','/documents'],['Masterbatch Questions','/faq']])}</div></footer>`;

const hero = actionList(tokenHtml(groups[0]));
const trust = tokenHtml(groups[1]);
const models = labeledTables(tokenHtml(groups[2]));
const info = tokenHtml(groups[3]);
const guide = tokenHtml(groups[4]);
const close = actionList(tokenHtml(groups[5]));
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>P013 — Gate 3 visual draft</title><link rel="icon" type="image/png" href="../P001/assets/ge-brandmark-candidate.png"><link rel="stylesheet" href="p013-visual.css"></head><body><aside class="draft-note">P013 · Gate 3 visual draft · Planned links shown for layout review</aside>${header}<main><section class="hero module"><div class="shell hero-layout"><div class="hero-copy">${hero}</div><div class="hero-art" aria-hidden="true"><div class="grain-field"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div><div class="art-line"></div><div class="art-line"></div><div class="art-line"></div></div></div></section><section class="trust module"><div class="shell"><div class="section-grid"><div class="section-heading">${tokenHtml(groups[1].slice(0,1))}</div><div class="trust-points">${tokenHtml(groups[1].slice(1))}</div></div></div></section><section class="models module" id="model-range"><div class="shell">${models}</div></section><section class="information module"><div class="shell section-grid"><div class="section-heading">${tokenHtml(groups[3].slice(0,1))}</div><div class="section-body">${tokenHtml(groups[3].slice(1))}</div></div></section><section class="guide module"><div class="shell section-grid"><div class="section-heading">${tokenHtml(groups[4].slice(0,1))}</div><div class="section-body">${tokenHtml(groups[4].slice(1))}</div></div></section><section class="closing module"><div class="shell section-grid"><div class="section-heading">${tokenHtml(groups[5].slice(0,1))}</div><div class="section-body">${actionList(tokenHtml(groups[5].slice(1)))}</div></div></section></main>${footer}</body></html>`;
fs.writeFileSync(path.join(out, 'p013-visual.html'), html, 'utf8');

async function draw() {
  const browser = await chromium.launch({headless:true});
  for (const width of [1440,768,390]) {
    const page = await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1});
    await page.goto(pathToFileURL(path.join(out, 'p013-visual.html')).href);
    await page.screenshot({path:path.join(out,`p013-${width}.png`),fullPage:true});
    const result = await page.evaluate(() => ({
      width:document.documentElement.scrollWidth,
      pageHeight:document.documentElement.scrollHeight,
      headings:[...document.querySelectorAll('main h1,main h2')].map(n=>n.textContent.trim()),
      modelRows:document.querySelectorAll('.models tbody tr').length,
      images:[...document.images].map(i=>({alt:i.alt,loaded:i.complete&&i.naturalWidth>0}))
    }));
    if (result.width > width) throw new Error(`Horizontal overflow at ${width}: ${result.width}`);
    if (result.modelRows !== 7) throw new Error(`Expected seven model rows at ${width}.`);
    if (result.images.some(i=>!i.loaded)) throw new Error(`Image failed to load at ${width}.`);
    process.stdout.write(`${width}: ${JSON.stringify(result)}\n`);
    await page.close();
  }
  await browser.close();
}
draw().catch(e=>{console.error(e); process.exitCode=1;});
