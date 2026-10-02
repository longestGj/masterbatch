/* Static Gate 3 drawing source. Reads the single P001 copy source; no WordPress work. */
const fs = require('node:fs');
const path = require('node:path');
const {pathToFileURL} = require('node:url');
const deps = 'C:/Users/longe/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const {marked} = require(path.join(deps, 'marked'));
const {chromium} = require(path.join(deps, 'playwright'));
const out = __dirname;
const spec = path.resolve(out, '../../pages/P001.md');
const source = fs.readFileSync(spec, 'utf8');
const copy = source.split('<!-- BEGIN P001 FULL BUYER COPY -->')[1].split('<!-- END P001 FULL BUYER COPY -->')[0].trim();
const tokens = marked.lexer(copy);
const groups = [[]];
for (const token of tokens) {
  if (token.type === 'heading' && token.depth === 2) groups.push([]);
  groups[groups.length - 1].push(token);
}
if (groups.length !== 9) throw new Error('Expected the nine approved body modules.');
const icon = name => fs.readFileSync(path.join(out,'assets/icons',name+'.svg'),'utf8').replace(/<title>[^<]*<\/title>/,'').replace('<svg ', '<svg class="ui-icon" aria-hidden="true" focusable="false" ');
const html = ts => marked.parser(ts).replace(/<p>(<a href="[^"]*">)([^<]*)<\/a><\/p>/g, (all,start,label)=>`<p class="action">${start}${label}${icon('arrow-up-right')}</a></p>`);
const media = name => '../../inputs/Cmp_Info/PIC&Vedio/' + encodeURIComponent(name);
const photo = (name, alt) => `<figure><img src="${media(name)}" alt="${alt}"></figure>`;
const section = (i, body, cls='') => `<section class="module m${i} ${cls}" data-module="${i}"><div class="container">${body}</div></section>`;
const brand = html([groups[0][0]]);
const brandLockup = `<div class="brand-lockup"><a class="brand-graphic" href="/" data-shared-copy aria-label="GE Chemical homepage"><img class="brand-logo" src="assets/ge-logo-candidate.png" alt="GE Chemical &amp; Polymer Group Co., Ltd."></a><div class="brand-legal">${brand}</div></div>`;
const heroTokens = groups[0].slice(1);
// Shared chrome is a design proposal, separate from the owner-confirmed body copy.
const navItems = [
  ['Black Masterbatch','/products/black-masterbatch'],
  ['Products','/products'],
  ['Applications','/applications'],
  ['About GE','/about']
];
const navLinks = navItems.map(([label,href])=>`<a href="${href}">${label}</a>`).join('');
const inquiryLink = `<a class="header-inquiry" href="/rfq">Discuss Your Requirements ${icon('arrow-up-right')}</a>`;
const header = `<header class="identity">${brandLockup}<nav class="desktop-nav" aria-label="Primary navigation" data-shared-copy>${navLinks}</nav><div class="desktop-inquiry" data-shared-copy>${inquiryLink}</div><details class="mobile-menu" data-shared-copy><summary>Menu <span class="menu-open-icon">${icon('menu')}</span><span class="menu-close-icon">${icon('close')}</span></summary><nav aria-label="Mobile navigation">${navLinks}${inquiryLink}</nav></details></header>`;
let body = section(1, `${header}<div class="hero-grid"><div class="hero-copy">${html(heroTokens)}</div>${photo('微信图片_20260707174840_213_1.jpg', 'Black granules in a supplied product photograph')}</div>`);
const modelsHtml = html(groups[1].slice(5)).replace(/(<li><a href="[^"]*">)([^<]*)(<\/a><\/li>)/g,(all,start,label,end)=>start+label+icon('arrow-up-right')+end);
body += section(2, `<div class="black-grid"><div class="black-intro">${html(groups[1].slice(0, 5))}</div><div class="model-entries">${modelsHtml}</div></div>`);
const g = groups[2].filter(t=>t.type !== 'space');
let statIndex = 0;
const statsHtml = html([g[2]]).replace(/<li>/g,()=>'<li>'+icon(['factory','pellets','globe'][statIndex++]));
body += section(3, `<div class="section-intro">${html(g.slice(0,2))}</div><div class="stats">${statsHtml}</div><div class="cooperation">${html([g[3]])}<div class="reasons">${g.slice(4).map((t,i)=>html([t]).replace('<p>','<p>'+icon(['factory','globe','pellets'][i]))).join('')}</div></div>`);
const p = groups[3].filter(t=>t.type !== 'space');
body += section(4, `<div class="section-intro">${html(p.slice(0,2))}</div><div class="portfolio">${[2,4,6].map((idx,n)=>`<article class="product-card tone${n}"><span class="product-mark" aria-hidden="true">${icon(['pellets','color','desiccant'][n])}</span>${html(p.slice(idx,idx+2))}</article>`).join('')}</div>${html(p.slice(8))}`);
let appIndex = 0;
const appsHtml = html(groups[4]).replace(/<li>(<a href="[^"]*">)([^<]*)<\/a><\/li>/g,(all,start,label)=>`<li>${start}${icon(['film','injection','extrusion','recycle'][appIndex++])}<span class="application-label">${label}</span>${icon('arrow-up-right')}</a></li>`);
body += section(5, `<div class="section-intro">${appsHtml}</div>`);
body += section(6, `<div class="company-grid"><div>${html(groups[5])}</div>${photo('微信图片_20260707174840_214_1.jpg', 'Workshop buildings and yard in a supplied site photograph')}</div>`);
body += section(7, `<div class="documents-grid">${photo('ge-chemical-masterbatch-workshop-equipment.jpg', 'Equipment in a supplied workshop photograph')}<div><div class="section-icon-pair" aria-hidden="true">${icon('laboratory')}${icon('documents')}</div>${html(groups[6])}</div></div>`);
const faq = groups[7].filter(t=>t.type !== 'space');
let questions = '';
for (let i=1;i<faq.length-1;i+=2) questions += `<article class="faq-item">${html(faq.slice(i,i+2))}</article>`;
body += section(8, `<div class="faq-grid">${html([faq[0]])}<div class="faq-list">${questions}${html([faq[faq.length-1]])}</div></div>`);
body += section(9, `<div class="inquiry-mark" aria-hidden="true">${icon('message')}</div>${html(groups[8])}`);
const footerColumn = (label, items)=>`<div class="footer-column"><p class="footer-title">${label}</p><nav aria-label="${label}">${items.map(([text,href])=>`<a href="${href}">${text}</a>`).join('')}</nav></div>`;
const footer = `<footer class="site-footer" data-shared-copy><div class="container"><div class="footer-grid"><div class="footer-identity">${brandLockup}<p>Binzhou, Shandong, China</p><a class="footer-inquiry" href="/rfq">Discuss Your Requirements ${icon('arrow-up-right')}</a></div>${footerColumn('Products', [['Black Masterbatch','/products/black-masterbatch'],['White Masterbatch','/products/white-masterbatch'],['Color Masterbatch','/products/color-masterbatch'],['Desiccant Masterbatch','/products/desiccant-defoaming-masterbatch']])}${footerColumn('Company', [['About GE','/about'],['Manufacturing & Quality','/manufacturing-quality']])}${footerColumn('Information', [['Applications','/applications'],['Product Documents','/documents'],['Masterbatch Questions','/faq']])}</div></div></footer>`;
const css = `
:root{--ink:#202623;--muted:#59645d;--paper:#f5f5ef;--line:#d5dad1;--accent:#d3e78d;--green:#34473b}*{box-sizing:border-box}body{margin:0;background:var(--paper);font-family:Arial,Helvetica,sans-serif;color:var(--ink);font-size:17px;line-height:1.65}a{color:inherit;text-underline-offset:5px}a:focus-visible{outline:3px solid #668821;outline-offset:5px}.draft-note{padding:12px 24px;background:#e4e6dd;color:#454f46;font-size:12px;letter-spacing:.025em;text-align:center;border-bottom:1px solid #ccd0c4}.container{max-width:1280px;margin:auto;padding:80px 64px}.module{border-bottom:1px solid var(--line)}h1,h2,h3,p,ul,figure{margin-top:0}h1,h2,h3{line-height:1.13;font-weight:600;letter-spacing:-.04em}h1{font-size:66px;margin-bottom:26px;max-width:660px}h2{font-size:40px;margin-bottom:22px;max-width:660px}h3{font-size:22px;margin-bottom:16px;letter-spacing:-.025em}p{margin-bottom:22px;color:var(--muted)}ul{padding:0;list-style:none}figure{margin:0;overflow:hidden;background:#d7ddd5}img{width:100%;height:100%;object-fit:cover;display:block}.section-intro{max-width:760px}p>a:only-child{display:inline-flex;align-items:center;gap:18px;font-size:15px;line-height:1.4;font-weight:600;text-decoration:none;border-bottom:1px solid currentColor;padding:9px 0}p>a:only-child:after{content:'↗';font-size:20px;line-height:1}.identity{padding-bottom:36px;border-bottom:1px solid var(--line);margin-bottom:48px}.identity p{margin:0;color:var(--ink);font-size:16px}.m1 .container{padding-top:26px;padding-bottom:64px}.hero-grid{display:grid;grid-template-columns:1.12fr .88fr;gap:56px;align-items:center}.hero-grid figure{height:540px;border-radius:2px}.hero-copy>p:nth-of-type(1){font-size:21px;line-height:1.35;color:var(--green);margin-bottom:22px}.hero-copy>p:nth-of-type(2){font-size:17px}.hero-copy>p:nth-of-type(3){font-size:15px;max-width:510px}.hero-copy>p:nth-of-type(4)>a,.m9 a{padding:15px 22px;background:var(--green);color:white;border:0}.hero-copy>p:nth-of-type(4){display:inline-block;margin:0 18px 0 0}.hero-copy>p:nth-of-type(5){display:inline-block;margin:16px 0 0}.m2{background:var(--ink);color:#fafbf6}.m2 p{color:#cbd4cc}.black-grid{display:grid;grid-template-columns:1fr 1fr;gap:80px}.black-intro p>a{color:var(--accent)}.model-entries{padding-top:6px}.model-entries ul{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.model-entries li a{display:block;padding:19px 12px;border:1px solid #5b665c;background:#2b342e;text-decoration:none;font-size:18px;line-height:1.25;text-align:center}.model-entries li:last-child{grid-column:span 2}.model-entries li a:after{content:' ↗';color:var(--accent);font-size:15px}.stats ul{display:grid;grid-template-columns:repeat(3,1fr);gap:28px;margin:38px 0 46px}.stats li{border-top:2px solid var(--green);padding:24px 16px 24px 0;font-size:25px;line-height:1.35}.stats strong{font-weight:500}.cooperation{border-top:1px solid var(--line);padding-top:28px}.cooperation h3{font-size:20px;margin-bottom:24px}.reasons{display:grid;grid-template-columns:repeat(3,1fr);gap:28px}.reasons p{font-size:15px;margin-bottom:0}.reasons strong{color:var(--ink)}.m4{background:#fff}.portfolio{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin:34px 0 26px}.product-card{padding:30px 24px;border:1px solid var(--line);background:var(--paper);min-height:215px}.product-card p{margin:0}.product-card a{font-size:14px}.product-mark{width:46px;height:46px;border:1px solid #bac2b4;display:block;border-radius:50%;margin-bottom:25px;background:#fdfdf8}.tone1 .product-mark{background:conic-gradient(#435640,#b7c968,#d5aa74,#748c98,#435640)}.tone2 .product-mark{background:#c2c9b2}.m5 .section-intro{max-width:none}.m5 p{max-width:760px}.m5 ul{display:grid;grid-template-columns:repeat(2,1fr);border-top:1px solid var(--line);gap:0 40px;margin:35px 0 24px}.m5 li{border-bottom:1px solid var(--line)}.m5 li a{display:flex;justify-content:space-between;padding:24px 0;text-decoration:none;font-size:22px;line-height:1.35}.m5 li a:after{content:'↗';margin-left:18px}.m6{background:#e7ebe1}.company-grid,.documents-grid{display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center}.company-grid figure{height:390px}.company-grid p,.documents-grid p{font-size:16px}.company-grid p:has(>a),.documents-grid p:has(>a){display:inline-block;margin-right:22px;margin-bottom:12px}.documents-grid figure{height:380px}.documents-grid h2{font-size:36px}.m7{background:#fff}.faq-grid{display:grid;grid-template-columns:.75fr 1.25fr;gap:70px}.faq-grid>h2{max-width:320px}.faq-item{padding:24px 0;border-bottom:1px solid var(--line)}.faq-item:first-child{padding-top:0}.faq-item h3{font-size:20px;letter-spacing:-.02em}.faq-item p{font-size:16px;margin:0}.faq-list>p{margin-top:20px;margin-bottom:0}.m9{background:var(--green);color:white;border:0}.m9 .container{padding-top:70px;padding-bottom:70px}.m9 h2{font-size:46px;max-width:720px}.m9 p{color:#d9e1d6;max-width:670px}.m9 a{background:var(--accent);color:var(--ink)}.m9 p:last-child{margin-bottom:0}
@media(max-width:1000px){.container{padding:56px 36px}h1{font-size:49px}h2{font-size:33px}.hero-grid{gap:30px;grid-template-columns:1.05fr .95fr}.hero-grid figure{height:530px}.hero-copy>p:nth-of-type(1){font-size:19px}.black-grid{gap:35px}.model-entries ul{grid-template-columns:repeat(2,1fr)}.model-entries li:last-child{grid-column:span 2}.stats ul{gap:24px}.stats li{font-size:22px;padding-right:0}.reasons{gap:22px}.portfolio{gap:12px}.product-card{padding:25px 16px}.product-card h3{font-size:21px}.product-card a{font-size:13px}.company-grid,.documents-grid{gap:30px}.company-grid figure{height:430px}.documents-grid figure{height:410px}.documents-grid h2{font-size:31px}.faq-grid{gap:35px;grid-template-columns:.8fr 1.2fr}.m9 h2{font-size:39px}}
@media(max-width:600px){body{font-size:16px}.draft-note{padding:10px 20px;font-size:11px;text-align:left}.container{padding:44px 24px}.identity{padding-bottom:24px;margin-bottom:30px}.identity p{font-size:13px;line-height:1.5}.m1 .container{padding-top:20px;padding-bottom:36px}.hero-grid,.black-grid,.company-grid,.documents-grid,.faq-grid{grid-template-columns:1fr;gap:28px}h1{font-size:43px;line-height:1.07;margin-bottom:24px;letter-spacing:-.045em}h2{font-size:31px;margin-bottom:20px}.hero-copy>p:nth-of-type(1){font-size:19px}.hero-copy>p:nth-of-type(2){font-size:16px}.hero-copy>p:nth-of-type(3){font-size:15px}.hero-copy>p:nth-of-type(4),.hero-copy>p:nth-of-type(5){display:block;margin:0 0 14px}.hero-copy>p:nth-of-type(4)>a{justify-content:space-between;width:100%}.hero-grid figure{height:240px;object-position:50% 50%}.black-grid{gap:20px}.model-entries p{font-size:15px}.model-entries li a{padding:18px 8px;font-size:17px}.stats ul{grid-template-columns:1fr;gap:0;margin:24px 0 30px}.stats li{font-size:24px;padding:19px 0;border-top:1px solid var(--line)}.stats li:first-child{border-top:2px solid var(--green)}.reasons{grid-template-columns:1fr;gap:18px}.portfolio{grid-template-columns:1fr;gap:14px;margin:25px 0}.product-card{min-height:0;padding:22px;display:grid;grid-template-columns:46px 1fr;column-gap:20px;align-items:start}.product-mark{grid-row:span 2;margin:0}.product-card h3{font-size:23px;margin-bottom:10px}.product-card a{font-size:14px}.m5 ul{grid-template-columns:1fr;margin-top:25px}.m5 li a{font-size:21px;padding:21px 0}.company-grid figure{height:245px}.documents-grid figure{height:245px}.documents-grid>figure{order:2}.documents-grid h2{font-size:31px}.company-grid p:has(>a),.documents-grid p:has(>a){display:block;margin:0 0 12px}.faq-grid>h2{max-width:none;margin-bottom:0}.faq-item h3{font-size:20px}.faq-item p{font-size:16px}.m9 .container{padding:46px 24px}.m9 h2{font-size:34px}.m9 a{justify-content:space-between;width:100%}}
`;
const chromeCss = `
.identity{display:flex;align-items:center;gap:24px;position:relative;padding-bottom:26px;margin-bottom:48px}.identity>p{flex:1;max-width:270px;font-size:14px;line-height:1.4}.desktop-nav{display:flex;align-items:center;gap:22px;margin-left:auto}.desktop-nav>a{font-size:14px;line-height:1.4;white-space:nowrap;text-decoration:none}.desktop-nav>a:first-child{font-weight:700}.header-inquiry{display:flex;align-items:center;justify-content:space-between;gap:14px;background:var(--green);color:white;text-decoration:none;font-size:13px;line-height:1.4;padding:14px 16px;min-height:48px;white-space:nowrap}.mobile-menu{display:none}.site-footer{background:var(--ink);color:#f4f6ef;border-top:1px solid #677465}.site-footer .container{padding-top:55px;padding-bottom:55px}.footer-grid{display:grid;grid-template-columns:1.3fr 1fr 1fr 1fr;gap:36px}.footer-identity>p:first-child{font-size:18px;line-height:1.45;color:#f4f6ef;margin-bottom:16px;max-width:270px}.footer-identity>p{font-size:14px;color:#cbd4cc;margin-bottom:20px}.footer-identity>a{font-size:14px;font-weight:600;color:var(--accent)}.footer-title{font-size:14px;color:#fff;font-weight:700;margin-bottom:18px}.footer-column nav{display:flex;flex-direction:column;align-items:flex-start;gap:12px}.footer-column a{font-size:14px;line-height:1.5;color:#cbd4cc;text-decoration:none}.footer-column a:hover,.desktop-nav a:hover{text-decoration:underline}
@media(max-width:1100px){.desktop-nav{display:none}.desktop-inquiry{margin-left:auto}.mobile-menu{display:block}.mobile-menu summary{display:flex;align-items:center;gap:10px;list-style:none;cursor:pointer;padding:12px 0;font-size:14px;min-height:48px}.mobile-menu summary::-webkit-details-marker{display:none}.mobile-menu nav{position:absolute;left:0;right:0;top:calc(100% - 1px);z-index:1;background:var(--paper);border:1px solid var(--line);padding:18px 22px;box-shadow:0 10px 18px #20262315}.mobile-menu nav>a:not(.header-inquiry){display:block;text-decoration:none;font-size:17px;line-height:1.4;padding:14px 0;border-bottom:1px solid var(--line)}.mobile-menu nav>a:first-child{font-weight:700}.mobile-menu nav>.header-inquiry{margin-top:18px}.footer-grid{grid-template-columns:1fr 1fr;gap:35px 50px}.footer-identity>p:first-child{max-width:320px}}
@media(max-width:600px){.identity{gap:16px;padding-bottom:22px;margin-bottom:30px}.identity>p{font-size:13px;max-width:260px}.desktop-inquiry{display:none}.mobile-menu{margin-left:auto;flex-shrink:0}.mobile-menu summary{font-size:13px}.mobile-menu summary span{font-size:20px}.site-footer .container{padding-top:36px;padding-bottom:36px}.footer-grid{grid-template-columns:1fr;gap:28px}.footer-identity>p:first-child{font-size:20px;max-width:320px}.footer-column nav{gap:10px}.footer-title{font-size:16px;margin-bottom:12px}.footer-column a{font-size:15px}.mobile-menu nav{padding:14px 20px}.m9 p.action>a{padding:15px 22px}}
`;
const assetCss = `
.ui-icon{display:inline-block;width:22px;height:22px;vertical-align:middle;flex-shrink:0;color:inherit}.brand-lockup{position:relative;flex-shrink:0;width:280px}.brand-graphic{display:block;text-decoration:none}.brand-logo{width:280px;height:80px;object-fit:cover;object-position:50% 52%}.brand-legal{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}.identity .brand-lockup{margin-right:auto}.product-mark{display:flex;align-items:center;justify-content:center;background:transparent!important;color:var(--green)}.product-mark .ui-icon{width:28px;height:28px}.stats li>.ui-icon{display:block;width:28px;height:28px;margin-bottom:16px;color:var(--green)}.reasons p>.ui-icon{display:block;margin-bottom:14px;color:var(--green)}.model-entries li a{display:flex;align-items:center;justify-content:center;gap:8px}.model-entries li a>.ui-icon{height:16px;width:16px;color:var(--accent)}p.action>a:after,.model-entries li a:after,.m5 li a:after{content:none!important}p.action>a>.ui-icon{height:20px;width:20px}.m5 li a{gap:14px;justify-content:flex-start}.m5 li a>.application-label{flex:1}.m5 li a>.ui-icon:first-child{height:26px;width:26px;color:var(--green)}.m5 li a>.ui-icon:last-child{height:20px;width:20px}.section-icon-pair{display:flex;gap:15px;margin-bottom:18px;color:var(--green)}.section-icon-pair .ui-icon{width:32px;height:32px}.inquiry-mark{margin-bottom:20px;color:var(--accent)}.inquiry-mark .ui-icon{width:36px;height:36px}.header-inquiry>.ui-icon{height:16px;width:16px}.menu-close-icon{display:none}.mobile-menu[open] .menu-open-icon{display:none}.mobile-menu[open] .menu-close-icon{display:inline-block}.site-footer .brand-graphic{background:var(--paper);border-radius:3px;margin-bottom:20px}.site-footer .brand-logo{width:100%;height:80px}.site-footer .brand-lockup{width:270px;max-width:100%;margin-bottom:20px}.footer-inquiry{display:inline-flex;gap:8px;align-items:center}.footer-inquiry .ui-icon{height:15px;width:15px}
@media(max-width:600px){.identity{gap:12px}.identity .brand-lockup{width:238px}.identity .brand-logo{width:238px;height:68px}.mobile-menu summary{gap:8px}.mobile-menu summary .ui-icon{width:20px;height:20px}.stats li>.ui-icon{display:inline-block;margin:0 12px 0 0;width:25px;height:25px}.m5 li a{gap:12px}.m5 li a>.application-label{font-size:20px}.site-footer .brand-lockup{width:290px}.site-footer .brand-logo{height:86px}}
`;
const visualCss = css.replaceAll('p>a:only-child','p.action>a') + '.m9 p.action>a{padding:15px 22px;background:var(--accent);color:var(--ink);border:0}' + chromeCss + assetCss + '.site-footer .brand-graphic{background:transparent}.site-footer .brand-logo{filter:grayscale(1) brightness(0) invert(1)}';
const doc = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="icon" type="image/png" href="assets/ge-brandmark-candidate.png"><title>P001 — Gate 3 visual draft</title><style>${visualCss}</style></head><body><aside class="draft-note">P001 · Gate 3 visual draft · Logo approved · Icons, styling, navigation and footer proposed for owner review · Contact details pending</aside><main>${body}</main>${footer}</body></html>`;
fs.writeFileSync(path.join(out, 'homepage-visual.html'), doc);

(async()=>{
  const browser = await chromium.launch({headless:true});
  try {
    for (const width of [1440,768,390]) {
      const page = await browser.newPage({viewport:{width,height:1000},deviceScaleFactor:1});
      await page.goto(pathToFileURL(path.join(out,'homepage-visual.html')).href);
      await page.evaluate(()=>Promise.all(Array.from(document.images).map(img=>img.decode())));
      const check = await page.evaluate(()=>{
        const approved = document.querySelector('main').cloneNode(true);
        approved.querySelectorAll('[data-shared-copy]').forEach(el=>el.remove());
        return {
        width:innerWidth,scrollWidth:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight,
        modules:document.querySelectorAll('main section').length,h1:document.querySelectorAll('main h1').length,
        headings:Array.from(document.querySelectorAll('main h2')).map(x=>x.textContent),
        faq:document.querySelectorAll('.faq-item').length,
        missingImages:Array.from(document.images).filter(x=>!x.naturalWidth).length,
        closingCtaHeight:document.querySelector('.m9 a').getBoundingClientRect().height,
        bodyCopy:approved.textContent,
        links:Array.from(approved.querySelectorAll('a')).map(a=>({text:a.textContent,href:a.getAttribute('href')})),
        footer:document.querySelectorAll('.site-footer').length,
        logos:document.querySelectorAll('.brand-logo').length,
        interfaceIcons:document.querySelectorAll('.ui-icon').length,
        favicon:document.querySelector('link[rel="icon"]').getAttribute('href')
      }});
      // Meaningful content guard: full source text and destination identities must survive drawing.
      const reference = await page.evaluate(s=>{const el=document.createElement('div');el.innerHTML=s;return {text:el.innerText||el.textContent,links:Array.from(el.querySelectorAll('a')).map(a=>({text:a.textContent,href:a.getAttribute('href')}))}},marked.parse(copy));
      // DOM grouping adds separators only; compare text after removing whitespace entirely.
      if (check.bodyCopy.replace(/\s/g,'')!==reference.text.replace(/\s/g,'')) throw new Error('Copy differs in the visual source.');
      if(JSON.stringify(check.links)!==JSON.stringify(reference.links)) throw new Error('Link labels or destinations differ.');
      if(check.scrollWidth>width||check.modules!==9||check.h1!==1||check.faq!==5||check.missingImages||check.closingCtaHeight<48||check.logos!==2||!check.interfaceIcons) throw new Error('Visual geometry/content check failed.');
      await page.screenshot({path:path.join(out,`homepage-${width}.png`),fullPage:true});
      // Readable crops are temporary inspection views, retained with the drawing assets.
      if(process.argv.includes('--inspect')) {
        const strips = await page.locator('main section').evaluateAll(els=>els.map(el=>({y:el.getBoundingClientRect().top+scrollY,height:el.getBoundingClientRect().height})));
        for(const [i,r] of strips.entries()) {
          await page.screenshot({path:path.join(out,`inspect-${width}-${i+1}.png`),fullPage:true,clip:{x:0,y:r.y,width,height:r.height}});
        }
      }
      if(width===1440) await page.locator('main section').first().screenshot({path:path.join(out,'homepage-desktop-hero.png')});
      await page.locator('.site-footer').screenshot({path:path.join(out,`homepage-footer-${width}.png`)});
      if(width===390){
        await page.evaluate(()=>window.scrollTo(0,0));
        await page.locator('.mobile-menu').evaluate(el=>el.open=true);
        const menu = await page.locator('.identity').boundingBox();
        const panel = await page.locator('.mobile-menu nav').boundingBox();
        await page.screenshot({path:path.join(out,'homepage-mobile-menu.png'),clip:{x:0,y:menu.y,width,height:panel.y+panel.height-menu.y+20},fullPage:true});
        const expandedWidth = await page.evaluate(()=>document.documentElement.scrollWidth);
        if(expandedWidth>width) throw new Error('Expanded mobile-menu drawing overflows.');
      }
      delete check.bodyCopy;delete check.links;
      console.log(JSON.stringify(check));
      await page.close();
    }
  } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
