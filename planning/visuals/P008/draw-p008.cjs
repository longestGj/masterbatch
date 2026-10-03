/* Gate 3 drawing source only. Exact body copy comes from owner-confirmed P008. */
const fs = require('node:fs');
const path = require('node:path');
const {pathToFileURL} = require('node:url');
const deps = 'C:/Users/longe/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const {marked} = require(path.join(deps, 'marked'));
const {chromium} = require(path.join(deps, 'playwright'));
const out = __dirname;
const spec = fs.readFileSync(path.resolve(out, '../../pages/P008.md'), 'utf8');
const copy = spec.split('### Begin buyer-visible Full Copy')[1].split('### End buyer-visible Full Copy')[0].trim();
const groups = [[]];
for (const token of marked.lexer(copy)) {
  if (token.type === 'heading' && token.depth === 2) groups.push([]);
  groups.at(-1).push(token);
}
if (groups.length !== 4) throw Error('Expected the four approved sections');
const icon = name => fs.readFileSync(path.resolve(out, `../P001/assets/icons/${name}.svg`), 'utf8')
  .replace(/<title>[^<]*<\/title>/, '')
  .replace('<svg ', '<svg class="ui-icon" aria-hidden="true" focusable="false" ');
const arrow = icon('arrow-up-right');
const render = tokens => marked.parser(tokens).replace(/<p><a href="([^"]+)">([^<]+)<\/a><\/p>/g,
  (_, href, label) => `<p class="action"><a class="${href === '/rfq/' ? 'btn primary' : href === '/products/' ? 'btn secondary' : 'text-link'}" href="${href}">${label}${arrow}</a></p>`);
const subdivide = tokens => {
  const parts = [[]];
  for (const token of tokens) {
    if (token.type === 'heading' && token.depth === 3) parts.push([]);
    parts.at(-1).push(token);
  }
  return parts;
};
const topics = subdivide(groups[1]);
const paths = subdivide(groups[2]);
if (topics.length !== 5 || paths.length !== 4) throw Error('Expected four topics and three evaluation paths');
const topicIcons = ['film', 'injection', 'extrusion', 'recycle'];
const nav = [['Black Masterbatch', '/products/black-masterbatch'], ['Products', '/products'], ['Applications', '/applications'], ['About GE', '/about']]
  .map(([label, href]) => `<a href="${href}"${href === '/applications' ? ' aria-current="page"' : ''}>${label}</a>`).join('');
const brand = '<a class="brand" href="/" aria-label="GE Chemical homepage"><img src="../P001/assets/ge-logo-candidate.png" alt="GE Chemical &amp; Polymer Group Co., Ltd."></a>';
const inquiry = `<a class="btn primary header-cta" href="/rfq">Discuss Your Requirements${arrow}</a>`;
const header = `<header class="site-header" data-shared-chrome><div class="shell header-inner">${brand}<nav class="desktop-nav" aria-label="Primary navigation">${nav}</nav><div class="tablet-inquiry">${inquiry}</div><details class="mobile-menu"><summary>Menu <span class="menu-open">${icon('menu')}</span><span class="menu-close">${icon('close')}</span></summary><nav aria-label="Mobile navigation">${nav}${inquiry}</nav></details></div></header>`;
const footerColumn = (label, links) => `<div class="footer-column"><p class="footer-title">${label}</p><nav aria-label="${label}">${links.map(([text, href]) => `<a href="${href}">${text}</a>`).join('')}</nav></div>`;
const footer = `<footer class="site-footer" data-shared-chrome><div class="shell footer-grid"><div class="footer-identity">${brand}<p>Binzhou, Shandong, China</p>${inquiry}</div>${footerColumn('Products', [['Black Masterbatch', '/products/black-masterbatch'], ['White Masterbatch', '/products/white-masterbatch'], ['Color Masterbatch', '/products/color-masterbatch'], ['Desiccant Masterbatch', '/products/desiccant-defoaming-masterbatch']])}${footerColumn('Company', [['About GE', '/about'], ['Manufacturing &amp; Quality', '/manufacturing-quality']])}${footerColumn('Information', [['Applications', '/applications'], ['Product Documents', '/documents'], ['Masterbatch Questions', '/faq']])}</div></footer>`;
// Decorative category illustration using only existing approved interface icons.
const artwork = `<div class="topic-art" aria-hidden="true"><div class="art-cross"></div>${topicIcons.map(name => `<span class="art-node">${icon(name)}</span>`).join('')}</div>`;
const topicRows = topics.slice(1).map((tokens, index) => `<article class="topic-row"><div class="topic-symbol" aria-hidden="true">${icon(topicIcons[index])}</div><div class="topic-name">${render(tokens.slice(0, 1))}</div><div class="topic-description">${render(tokens.slice(1))}</div></article>`).join('');
const evaluation = paths.slice(1).map((tokens, index) => `<article class="evaluation-path path-${index}">${render(tokens)}</article>`).join('');
const approvedPass = spec.split('## Gate 2 Pass 2 — Full Copy candidate')[1];
const seoTitle = approvedPass.match(/- SEO title: \*\*(.*?)\*\*/)[1];
const seoMeta = approvedPass.match(/- Meta description: \*\*(.*?)\*\*/)[1];
const escape = value => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escape(seoTitle)}</title><meta name="description" content="${escape(seoMeta)}"><link rel="icon" href="../P001/assets/ge-brandmark-candidate.png"><link rel="stylesheet" href="p008-visual.css"></head><body>${header}<main><section class="hero module"><div class="shell hero-layout"><div class="hero-copy">${render(groups[0])}</div>${artwork}</div></section><section class="topics module"><div class="shell"><div class="section-intro">${render(topics[0])}</div><div class="topic-list">${topicRows}</div></div></section><section class="evaluation module"><div class="shell"><div class="section-intro">${render(paths[0])}</div><div class="evaluation-grid">${evaluation}</div></div></section><section class="closing module"><div class="shell section-grid"><div class="section-heading">${render(groups[3].slice(0, 1))}</div><div class="section-body">${render(groups[3].slice(1))}</div></div></section></main>${footer}</body></html>`;
fs.writeFileSync(path.join(out, 'p008-visual.html'), html, 'utf8');

async function draw() {
  const browser = await chromium.launch({headless: true});
  try {
    const baseline = await browser.newPage();
    await baseline.setContent('<main>' + marked.parse(copy) + '</main>');
    const normalize = value => value.replace(/\s+/g, ' ').trim();
    const expectedText = (await baseline.locator('main h1, main h2, main h3, main p').allTextContents()).map(normalize);
    const expectedLinks = await baseline.locator('main a').evaluateAll(links => links.map(a => ({label: a.textContent.trim(), href: a.getAttribute('href')})));
    await baseline.close();
    for (const width of [1440, 768, 390]) {
      const page = await browser.newPage({viewport: {width, height: 900}, deviceScaleFactor: 1});
      await page.goto(pathToFileURL(path.join(out, 'p008-visual.html')).href);
      await page.screenshot({path: path.join(out, `p008-${width}.png`), fullPage: true});
      const text = (await page.locator('main h1, main h2, main h3, main p').allTextContents()).map(normalize);
      const check = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        height: document.documentElement.scrollHeight,
        sections: document.querySelectorAll('main > section').length,
        h1: document.querySelectorAll('main h1').length,
        topics: document.querySelectorAll('.topic-row').length,
        topicLinks: document.querySelectorAll('.topic-row a').length,
        evaluationRfq: document.querySelectorAll('.evaluation a[href="/rfq/"]').length,
        inquiry: document.querySelectorAll('main a[href="/rfq/"]').length,
        imagesLoaded: [...document.images].every(img => img.complete && img.naturalWidth > 0),
        links: [...document.querySelectorAll('main a')].map(a => ({label: a.textContent.trim(), href: a.getAttribute('href')}))
      }));
      if (JSON.stringify(text) !== JSON.stringify(expectedText)) throw Error(`Copy drift at ${width}`);
      if (JSON.stringify(check.links) !== JSON.stringify(expectedLinks)) throw Error(`Link drift at ${width}`);
      if (check.scrollWidth > width || check.sections !== 4 || check.h1 !== 1 || check.topics !== 4 || check.topicLinks !== 0 || check.evaluationRfq !== 0 || check.inquiry !== 1 || !check.imagesLoaded) throw Error(`Drawing issue ${width}: ${JSON.stringify(check)}`);
      console.log(width, JSON.stringify(check));
      for (const section of ['hero', 'topics', 'evaluation', 'closing']) {
        await page.locator('.' + section).screenshot({path: path.join(out, `p008-${section}-${width}.png`)});
      }
      await page.close();
    }
  } finally {
    await browser.close();
  }
}
draw().catch(error => {console.error(error); process.exitCode = 1;});
