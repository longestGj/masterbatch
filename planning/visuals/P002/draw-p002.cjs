/* Gate 3 drawing source only. Exact body copy is parsed from owner-confirmed P002. */
const fs = require('node:fs');
const path = require('node:path');
const {pathToFileURL} = require('node:url');
const deps = 'C:/Users/longe/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const {marked} = require(path.join(deps,'marked'));
const {chromium} = require(path.join(deps,'playwright'));
const out = __dirname;
const spec = fs.readFileSync(path.resolve(out,'../../pages/P002.md'),'utf8');
const copy = spec.split('### Begin buyer-visible Full Copy')[1].split('### End buyer-visible Full Copy')[0].trim();
const tokens = marked.lexer(copy);
const groups = [[]];
for(const t of tokens){if(t.type==='heading' && t.depth===2)groups.push([]);groups.at(-1).push(t);}
if(groups.length!==4)throw Error('Expected four approved modules');
const icon = name => fs.readFileSync(path.resolve(out,`../P001/assets/icons/${name}.svg`),'utf8').replace(/<title>[^<]*<\/title>/,'').replace('<svg ','<svg class="ui-icon" aria-hidden="true" focusable="false" ');
const arrow=icon('arrow-up-right');
const render = ts => marked.parser(ts).replace(/<p><a href="([^"]+)">([^<]+)<\/a><\/p>/g,(_,url,label)=>`<p class="action"><a class="btn ${url.startsWith('mailto:')?'primary':'secondary'}" href="${url}">${label}${arrow}</a></p>`);
const nav=[['Black Masterbatch','/products/black-masterbatch'],['Products','/products'],['Applications','/applications'],['About GE','/about']].map(([s,u])=>`<a href="${u}">${s}</a>`).join('');
const brand=`<a class="brand" href="/" aria-label="GE Chemical homepage"><img src="../P001/assets/ge-logo-candidate.png" alt="GE Chemical &amp; Polymer Group Co., Ltd."></a>`;
const inquiry=`<a class="btn primary header-cta" href="/rfq">Discuss Your Requirements${arrow}</a>`;
const header=`<header class="site-header" data-shared-chrome><div class="shell header-inner">${brand}<nav class="desktop-nav" aria-label="Primary navigation">${nav}</nav><div class="tablet-inquiry">${inquiry}</div><details class="mobile-menu"><summary>Menu <span class="menu-open">${icon('menu')}</span><span class="menu-close">${icon('close')}</span></summary><nav aria-label="Mobile navigation">${nav}${inquiry}</nav></details></div></header>`;
const column=(s,items)=>`<div class="footer-column"><p class="footer-title">${s}</p><nav aria-label="${s}">${items.map(([l,u])=>`<a href="${u}">${l}</a>`).join('')}</nav></div>`;
const footer=`<footer class="site-footer" data-shared-chrome><div class="shell footer-grid"><div class="footer-identity">${brand}<p>Binzhou, Shandong, China</p>${inquiry}</div>${column('Products',[['Black Masterbatch','/products/black-masterbatch'],['White Masterbatch','/products/white-masterbatch'],['Color Masterbatch','/products/color-masterbatch'],['Desiccant Masterbatch','/products/desiccant-defoaming-masterbatch']])}${column('Company',[['About GE','/about'],['Manufacturing & Quality','/manufacturing-quality']])}${column('Information',[['Applications','/applications'],['Product Documents','/documents'],['Masterbatch Questions','/faq']])}</div></footer>`;
let family=render(groups[1]);
family=family.replace(/<table>([\s\S]*?)<\/table>/g,(_,body)=>{
  const heads=[...body.matchAll(/<th\b[^>]*>([\s\S]*?)<\/th>/g)].map(m=>m[1]);
  let col=0;
  body=body.replace(/<tr>|<td>/g,m=>{if(m==='<tr>'){col=0;return m;}return `<td data-label="${heads[col++]}">`;});
  let row=0;
  body=body.replace(/<tbody>([\s\S]*?)<\/tbody>/,(_,b)=>'<tbody>'+b.replace(/<tr>/g,()=>`<tr class="family-row ${row++===0?'lead-family':''}">` )+'</tbody>');
  return `<table class="family-table">${body}</table>`;
});
const split=ts=>`<div class="section-heading">${render(ts.slice(0,1))}</div><div class="section-body">${render(ts.slice(1))}</div>`;
// Supplied photo, unchanged. Black-family illustration only; no named-grade implication.
const photoUrl='../../inputs/Cmp_Info/PIC&Vedio/'+encodeURIComponent('微信图片_20260707174840_213_1.jpg');
const artwork=`<figure class="hero-photo"><img src="${photoUrl}" alt="Black masterbatch granules"></figure>`;
const title='Masterbatch Products: Black, White, Color & Desiccant | GE';
const meta="Explore GE's plastic masterbatch products. Review black masterbatch grades, ask about white, color or desiccant products, or discuss your needs without a model.";
const html=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title.replace(/&/g,'&amp;')}</title><meta name="description" content="${meta}"><link rel="icon" href="../P001/assets/ge-brandmark-candidate.png"><link rel="stylesheet" href="p002-visual.css"></head><body>${header}<main><section class="hero module"><div class="shell hero-layout"><div class="hero-copy">${render(groups[0])}</div>${artwork}</div></section><section class="families module" id="choose-your-next-step"><div class="shell">${family}</div></section><section class="black-range module"><div class="shell section-grid">${split(groups[2])}</div></section><section class="closing module"><div class="shell section-grid">${split(groups[3])}</div></section></main>${footer}</body></html>`;
fs.writeFileSync(path.join(out,'p002-visual.html'),html,'utf8');
async function draw(){
 const browser=await chromium.launch({headless:true});
 const baseline=await browser.newPage();
 await baseline.setContent('<main>'+marked.parse(copy)+'</main>');
 const expected=await baseline.locator('main h1, main h2, main p, main th, main td').allTextContents();
 const expectedLinks=await baseline.locator('main a').evaluateAll(as=>as.map(a=>({label:a.textContent.trim(),href:a.getAttribute('href')})));
 await baseline.close();
 for(const width of [1440,768,390]){
  const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1});
  await page.goto(pathToFileURL(path.join(out,'p002-visual.html')).href);
  await page.screenshot({path:path.join(out,`p002-${width}.png`),fullPage:true});
  const normalize=s=>s.replace(/\s+/g,' ').trim();
  const text=await page.locator('main h1, main h2, main p, main th, main td').allTextContents();
  if(JSON.stringify(text.map(normalize))!==JSON.stringify(expected.map(normalize)))throw Error(`Copy drift at ${width}`);
  const result=await page.evaluate(()=>({width:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight,rows:document.querySelectorAll('tbody tr').length,images:[...document.images].every(i=>i.complete&&i.naturalWidth),links:[...document.querySelectorAll('main a')].map(a=>({label:a.textContent.trim(),href:a.getAttribute('href')}))}));
  if(result.width>width||result.rows!==4||!result.images)throw Error(`Visual issue ${width}: ${JSON.stringify(result)}`);
  if(JSON.stringify(result.links)!==JSON.stringify(expectedLinks))throw Error(`Link drift ${width}`);
  console.log(width,JSON.stringify(result));
  if(width===1440)await page.locator('.hero').screenshot({path:path.join(out,'p002-hero-1440.png')});
  await page.close();
 }
 await browser.close();
}
draw().catch(e=>{console.error(e);process.exitCode=1;});




