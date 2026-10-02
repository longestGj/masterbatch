/* P003 Gate 3 drawing source. Reads owner-confirmed copy; makes no WordPress changes. */
const fs = require('node:fs');
const path = require('node:path');
const {pathToFileURL} = require('node:url');
const deps = 'C:/Users/longe/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const {marked} = require(path.join(deps, 'marked'));
const {chromium} = require(path.join(deps, 'playwright'));
const out = __dirname;
const spec = fs.readFileSync(path.resolve(out, '../../pages/P003.md'), 'utf8');
const copy = spec.split('### Buyer-visible page copy')[1].split('### Action meanings and destination checks')[0].trim();
if (!copy || !spec.includes('**Owner Full Copy decision — 2026-10-02:**')) throw new Error('Approved P003 Full Copy not found.');
const groups = [[]];
for (const token of marked.lexer(copy)) {
  if (token.type === 'heading' && token.depth === 2) groups.push([]);
  groups[groups.length - 1].push(token);
}
if (groups.length !== 8) throw new Error(`Expected Hero and seven approved sections, got ${groups.length}.`);
const icon = name => fs.readFileSync(path.resolve(out, '../P001/assets/icons', `${name}.svg`), 'utf8')
  .replace(/<title>[^<]*<\/title>/, '')
  .replace('<svg ', '<svg class="ui-icon" aria-hidden="true" focusable="false" ');
const arrow = icon('arrow-up-right');
const render = tokens => marked.parser(tokens)
  .replace(/<p><a href="([^"]*)">([^<]*)<\/a><\/p>/g, (_, href, label) => {
    const kind = href === '/products' ? 'btn-primary' : href === '/rfq' ? 'btn-secondary' : 'btn-text';
    return `<p class="action"><a class="btn ${kind}" href="${href}">${label}${arrow}</a></p>`;
  });
const media = name => '../../inputs/Cmp_Info/PIC&Vedio/' + encodeURIComponent(name);
const photo = (name, alt, className='') => `<figure class="${className}"><img src="${media(name)}" alt="${alt}"></figure>`;
const logo = `<div class="brand-lockup"><a class="brand-graphic" href="/" aria-label="GE Chemical homepage"><img src="../P001/assets/ge-logo-candidate.png" alt="GE Chemical &amp; Polymer Group Co., Ltd."></a></div>`;
const navItems = [
  ['Black Masterbatch', '/products/black-masterbatch'],
  ['Products', '/products'],
  ['Applications', '/applications'],
  ['About GE', '/about']
];
const nav = navItems.map(([label, href]) => `<a href="${href}"${href === '/about' ? ' aria-current="page"' : ''}>${label}</a>`).join('');
const inquiry = `<a class="btn btn-primary header-inquiry" href="/rfq">Discuss Your Requirements${arrow}</a>`;
const header = `<header class="site-header"><div class="container header-inner">${logo}<nav class="desktop-nav" aria-label="Primary navigation">${nav}</nav><div class="desktop-inquiry">${inquiry}</div><details class="mobile-menu"><summary>Menu <span class="menu-open-icon">${icon('menu')}</span><span class="menu-close-icon">${icon('close')}</span></summary><nav aria-label="Mobile navigation">${nav}${inquiry}</nav></details></div></header>`;
const footer = `<footer class="site-footer"><div class="container footer-grid"><div class="footer-identity">${logo}<p>Binzhou, Shandong, China</p><a class="btn btn-primary footer-inquiry" href="/rfq">Discuss Your Requirements${arrow}</a></div><div class="footer-column"><p class="footer-title">Products</p><nav aria-label="Products"><a href="/products/black-masterbatch">Black Masterbatch</a><a href="/products/white-masterbatch">White Masterbatch</a><a href="/products/color-masterbatch">Color Masterbatch</a><a href="/products/desiccant-defoaming-masterbatch">Desiccant Masterbatch</a></nav></div><div class="footer-column"><p class="footer-title">Company</p><nav aria-label="Company"><a href="/about">About GE</a><a href="/manufacturing-quality">Manufacturing &amp; Quality</a></nav></div><div class="footer-column"><p class="footer-title">Information</p><nav aria-label="Information"><a href="/applications">Applications</a><a href="/documents">Product Documents</a><a href="/faq">Masterbatch Questions</a></nav></div></div></footer>`;
const section = (n, inner, cls='') => `<section class="module m${n} ${cls}" data-module="${n}"><div class="container">${inner}</div></section>`;

let body = section(1, `<div class="hero-grid"><div class="hero-copy">${render(groups[0])}</div>${photo('微信图片_20260707174840_214_1.jpg', 'Workshop buildings and yard in a supplied photograph', 'hero-photo')}</div>`, 'hero');
body += section(2, `<div class="product-grid"><div class="product-copy">${render(groups[1])}</div>${photo('微信图片_20260707174840_213_1.jpg', 'Black granules in a supplied photograph', 'granule-photo')}</div>`, 'product');
body += section(3, `<div class="reader-grid"><div class="reader-heading">${render(groups[2].slice(0,1))}</div><div class="reader-copy">${render(groups[2].slice(1))}</div></div>`, 'readers');
body += section(4, `<div class="fact-heading">${render(groups[3].slice(0,1))}</div><div class="fact-body">${render(groups[3].slice(1))}</div>`, 'facts');
body += section(5, `<div class="trust-grid"><div class="trust-mark" aria-hidden="true">${icon('globe')}</div><div class="trust-copy">${render(groups[4])}</div></div>`, 'trust');
body += section(6, `<div class="manufacturing-grid">${photo('ge-chemical-masterbatch-workshop-equipment.jpg', 'Equipment in a supplied workshop photograph', 'equipment-photo')}<div class="manufacturing-copy">${render(groups[5])}</div></div>`, 'manufacturing');
body += section(7, `<div class="documents-grid"><div class="documents-mark" aria-hidden="true">${icon('documents')}</div><div class="documents-copy">${render(groups[6])}</div></div>`, 'documents');
body += section(8, `<div class="next-grid"><div class="next-mark" aria-hidden="true">${icon('message')}</div><div class="next-copy">${render(groups[7])}</div></div>`, 'next');

const css = `
:root{--ink:#202623;--muted:#59645d;--paper:#f5f5ef;--line:#d5dad1;--green:#34473b;--accent:#d3e78d;--focus:#668821}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--paper);color:var(--ink);font:17px/1.65 Arial,Helvetica,sans-serif}a{color:inherit;text-underline-offset:5px}a:focus-visible,summary:focus-visible{outline:3px solid var(--focus);outline-offset:4px}h1,h2,p,ul,figure{margin-top:0}h1,h2{font-weight:600;line-height:1.12;letter-spacing:-.04em}h1{font-size:66px;margin-bottom:28px}h2{font-size:40px;margin-bottom:20px}p{color:var(--muted);margin-bottom:20px}figure{margin:0;overflow:hidden}img{display:block;width:100%;height:100%;object-fit:cover}.container{max-width:1280px;margin:auto;padding:76px 64px}.module{border-bottom:1px solid var(--line)}.draft-note{padding:10px 24px;text-align:center;background:#e4e6dd;border-bottom:1px solid #ccd0c4;color:#48524a;font-size:12px;letter-spacing:.02em}
.ui-icon{display:inline-block;width:20px;height:20px;vertical-align:middle;flex-shrink:0}.btn{display:inline-flex;align-items:center;justify-content:center;gap:12px;min-height:48px;max-width:100%;padding:12px 18px;border-radius:10px;border:1px solid transparent;font-size:15px;font-weight:600;line-height:1.4;text-decoration:none;transition:background-color .16s ease,border-color .16s ease}.btn .ui-icon{width:18px;height:18px}.btn-primary{background:var(--green);border-color:var(--green);color:white}.btn-primary:hover{background:#293d30;border-color:#293d30}.btn-primary:active{background:#223627;border-color:#223627}.btn-secondary{border-color:#aebbad;color:var(--green)}.btn-secondary:hover{background:#e8ede3;border-color:#879781}.btn-secondary:active{background:#dde5d7}.btn-text{padding:8px 0;border:0;border-radius:6px;color:var(--green);justify-content:flex-start}.btn-text:hover{text-decoration:underline}.action{margin:22px 0 0}.action+.action{margin-top:12px}
.site-header .container{padding-top:24px;padding-bottom:25px}.header-inner{display:flex;align-items:center;gap:24px;position:relative;border-bottom:1px solid var(--line)}.brand-lockup{width:280px;flex-shrink:0}.brand-graphic{display:block}.brand-graphic img{width:280px;height:80px;object-fit:cover;object-position:50% 52%}.desktop-nav{display:flex;align-items:center;gap:22px;margin-left:auto}.desktop-nav a{font-size:14px;white-space:nowrap;text-decoration:none}.desktop-nav a[aria-current]{font-weight:700}.desktop-nav a:hover{text-decoration:underline}.header-inquiry{font-size:15px;white-space:nowrap}.mobile-menu{display:none}
.m1 .container{padding-top:35px;padding-bottom:90px}.hero-grid{display:grid;grid-template-columns:1.13fr .87fr;gap:60px;align-items:center}.hero-copy{max-width:650px}.hero-copy p:first-of-type{color:var(--green);font-size:21px;line-height:1.45}.hero-copy p:last-child{max-width:560px}.hero-photo{height:515px;border-radius:14px;position:relative}.hero-photo img{object-position:50% 53%;transform:scale(1.16)}.hero-photo:after{content:"";position:absolute;left:0;right:0;bottom:0;height:5px;background:var(--accent)}
.m2{background:var(--ink);color:#f8faf4}.m2 p{color:#cbd4cc}.product-grid{display:grid;grid-template-columns:1fr .8fr;gap:100px;align-items:center}.product-copy{max-width:600px}.product-copy h2{max-width:510px}.granule-photo{height:350px;border-radius:12px}.m2 .btn-text{color:var(--accent)}
.m3{background:#e7ebe1}.reader-grid{display:grid;grid-template-columns:.82fr 1.18fr;gap:80px;align-items:start}.reader-copy p{font-size:21px;line-height:1.52;max-width:680px;color:var(--green);margin-bottom:0}
.m4 .container{padding-top:86px;padding-bottom:90px}.fact-heading h2{margin-bottom:32px}.fact-body>p{font-size:18px;color:var(--green);margin-bottom:16px}.fact-body ul{padding:0;margin:0;list-style:none;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}.fact-body li{min-height:205px;border-top:2px solid var(--green);padding:22px 14px 10px 0;font-size:21px;line-height:1.4}.fact-body strong{font-weight:600;color:var(--ink)}
.m5{background:#fff}.trust-grid{display:grid;grid-template-columns:80px 1fr;gap:35px;align-items:start}.trust-mark{width:64px;height:64px;border:1px solid var(--line);border-radius:50%;display:flex;align-items:center;justify-content:center;color:var(--green)}.trust-mark .ui-icon{width:31px;height:31px}.trust-copy p{font-size:20px;line-height:1.55;max-width:930px;margin-bottom:0}
.m6{background:#e7ebe1}.manufacturing-grid{display:grid;grid-template-columns:.94fr 1.06fr;gap:70px;align-items:center}.equipment-photo{height:420px;border-radius:12px}.manufacturing-copy p{max-width:530px}
.documents-grid{display:grid;grid-template-columns:75px 1fr;gap:35px;align-items:start}.documents-mark{width:64px;height:64px;border:1px solid var(--line);border-radius:12px;display:flex;align-items:center;justify-content:center;color:var(--green)}.documents-mark .ui-icon{width:31px;height:31px}.documents-copy{max-width:840px}.documents-copy p{max-width:780px}
.m8{background:var(--green);color:#fff;border:0}.m8 .container{padding-top:76px;padding-bottom:82px}.next-grid{display:grid;grid-template-columns:75px 1fr;gap:35px}.next-mark{color:var(--accent);padding-top:6px}.next-mark .ui-icon{width:45px;height:45px}.next-copy h2{font-size:46px}.next-copy p{color:#d9e1d6;max-width:680px}.next-copy .action{display:inline-block;margin:14px 14px 0 0}.m8 .btn-primary{background:var(--accent);border-color:var(--accent);color:var(--ink)}.m8 .btn-primary:hover{background:#e0ecb0;border-color:#e0ecb0}.m8 .btn-secondary{border-color:#8a9d87;color:#fff}.m8 .btn-secondary:hover{background:#405747;border-color:#b2c6a6}
.site-footer{background:var(--ink);color:#f4f6ef}.site-footer .container{padding-top:55px;padding-bottom:55px}.footer-grid{display:grid;grid-template-columns:1.3fr 1fr 1fr 1fr;gap:36px}.site-footer .brand-graphic img{filter:grayscale(1) brightness(0) invert(1)}.footer-identity p{font-size:14px;color:#cbd4cc;margin:5px 0 20px}.footer-inquiry{background:var(--accent);border-color:var(--accent);color:var(--ink)}.footer-inquiry:hover{background:#e0ecb0;border-color:#e0ecb0}.footer-title{font-size:14px;color:#fff;font-weight:700;margin-bottom:18px}.footer-column nav{display:flex;flex-direction:column;align-items:flex-start;gap:12px}.footer-column a{font-size:14px;line-height:1.5;color:#cbd4cc;text-decoration:none}.footer-column a:hover{text-decoration:underline}
@media(max-width:1100px){.desktop-nav{display:none}.desktop-inquiry{margin-left:auto}.mobile-menu{display:block}.mobile-menu summary{display:flex;align-items:center;gap:10px;list-style:none;cursor:pointer;padding:12px 0;font-size:14px;min-height:48px}.mobile-menu summary::-webkit-details-marker{display:none}.mobile-menu nav{position:absolute;left:0;right:0;top:calc(100% - 1px);z-index:4;background:var(--paper);border:1px solid var(--line);padding:18px 22px;box-shadow:0 10px 18px #20262315;border-radius:0 0 12px 12px}.mobile-menu nav>a:not(.header-inquiry){display:block;text-decoration:none;font-size:17px;padding:14px 0;border-bottom:1px solid var(--line)}.mobile-menu nav>a[aria-current]{font-weight:700}.mobile-menu nav>.header-inquiry{margin-top:18px}.menu-close-icon{display:none}.mobile-menu[open] .menu-open-icon{display:none}.mobile-menu[open] .menu-close-icon{display:inline-block}.footer-grid{grid-template-columns:1fr 1fr;gap:35px 50px}}
@media(max-width:1000px){.container{padding:58px 36px}h1{font-size:49px}h2{font-size:33px}.hero-grid{gap:34px;grid-template-columns:1.05fr .95fr}.hero-photo{height:470px}.hero-copy p:first-of-type{font-size:19px}.product-grid{gap:40px}.granule-photo{height:310px}.reader-grid{gap:40px}.fact-body ul{grid-template-columns:repeat(2,1fr);gap:15px 25px}.fact-body li{min-height:145px}.manufacturing-grid{gap:36px}.equipment-photo{height:370px}.next-copy h2{font-size:39px}}
@media(max-width:760px){.desktop-inquiry{display:none}.mobile-menu{margin-left:auto}.mobile-menu nav>.header-inquiry{width:100%;justify-content:space-between;white-space:normal}.hero-grid,.product-grid,.reader-grid,.manufacturing-grid{grid-template-columns:1fr}.hero-photo{height:390px}.product-grid{gap:30px}.granule-photo{height:300px}.reader-grid{gap:4px}.manufacturing-grid{gap:28px}.equipment-photo{height:300px}}
@media(max-width:600px){body{font-size:16px}.draft-note{text-align:left;font-size:11px;padding:9px 20px}.container{padding:48px 24px}.site-header .container{padding-top:15px;padding-bottom:19px}.brand-lockup,.brand-graphic img{width:238px}.brand-graphic img{height:68px}.header-inner{gap:12px}.mobile-menu summary{font-size:13px;gap:8px}.mobile-menu summary .ui-icon{width:20px;height:20px}.mobile-menu nav{padding:14px 20px}.m1 .container{padding-top:40px;padding-bottom:54px}h1{font-size:43px;line-height:1.07;letter-spacing:-.045em;margin-bottom:25px}h2{font-size:31px;margin-bottom:20px}.hero-grid{gap:24px}.hero-copy p:first-of-type{font-size:19px}.hero-photo{height:250px}.hero-photo img{transform:scale(1.12)}.granule-photo{height:235px}.reader-copy p{font-size:19px}.m4 .container{padding-top:52px;padding-bottom:56px}.fact-heading h2{margin-bottom:24px}.fact-body>p{font-size:16px}.fact-body ul{grid-template-columns:1fr;gap:0}.fact-body li{min-height:0;border-top:1px solid var(--line);padding:18px 0;font-size:21px}.fact-body li:first-child{border-top:2px solid var(--green)}.trust-grid,.documents-grid,.next-grid{grid-template-columns:1fr;gap:20px}.trust-copy p{font-size:18px}.equipment-photo{height:240px}.m8 .container{padding-top:50px;padding-bottom:58px}.next-copy h2{font-size:34px}.next-copy .action{display:block;margin:12px 0 0}.next-copy .btn{width:100%;justify-content:space-between}.site-footer .container{padding-top:38px;padding-bottom:42px}.footer-grid{grid-template-columns:1fr;gap:25px}.footer-inquiry{width:100%;justify-content:space-between}.footer-column nav{gap:10px}.footer-column a{font-size:15px}.footer-title{font-size:16px;margin-bottom:12px}.site-footer .brand-lockup,.site-footer .brand-graphic img{width:290px}.site-footer .brand-graphic img{height:86px}}
@media(max-width:360px){.brand-lockup,.brand-graphic img{width:190px}.brand-graphic img{height:55px}h1{font-size:38px}}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}.btn{transition:none}}
`;
const doc = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="icon" type="image/png" href="../P001/assets/ge-brandmark-candidate.png"><title>P003 — Gate 3 About visual draft</title><style>${css}</style></head><body><aside class="draft-note">P003 · Gate 3 visual draft · supplied photos provisional; attribution, rights and captions pending</aside>${header}<main>${body}</main>${footer}</body></html>`;
fs.writeFileSync(path.join(out, 'about-visual.html'), doc);

(async () => {
  const browser = await chromium.launch({headless:true});
  try {
    for (const width of [1440, 768, 390]) {
      const page = await browser.newPage({viewport:{width,height:1000},deviceScaleFactor:1});
      await page.goto(pathToFileURL(path.join(out, 'about-visual.html')).href);
      await page.evaluate(() => Promise.all(Array.from(document.images).map(img => img.decode())));
      const check = await page.evaluate(() => ({
        width:innerWidth, scrollWidth:document.documentElement.scrollWidth, height:document.documentElement.scrollHeight,
        bodyText:document.querySelector('main').textContent,
        bodyLinks:Array.from(document.querySelectorAll('main a')).map(a => [a.textContent.trim(), a.getAttribute('href')]),
        headings:Array.from(document.querySelectorAll('main h1, main h2')).map(h => h.textContent),
        sections:document.querySelectorAll('main section').length,
        brokenImages:Array.from(document.images).filter(i => !i.naturalWidth).length,
        shortActions:Array.from(document.querySelectorAll('a.btn')).filter(a => a.getClientRects().length && a.getBoundingClientRect().height < 48).length
      }));
      const reference = await page.evaluate(html => {const el=document.createElement('div');el.innerHTML=html;return {text:el.textContent,links:Array.from(el.querySelectorAll('a')).map(a=>[a.textContent.trim(),a.getAttribute('href')])}}, marked.parse(copy));
      if (check.bodyText.replace(/\s/g,'') !== reference.text.replace(/\s/g,'')) throw new Error(`Buyer copy changed at ${width}px.`);
      if (JSON.stringify(check.bodyLinks) !== JSON.stringify(reference.links)) throw new Error(`Body action changed at ${width}px.`);
      if (check.scrollWidth > width || check.sections !== 8 || check.headings.length !== 8 || check.brokenImages || check.shortActions) throw new Error(`Geometry/media check failed at ${width}px: ${JSON.stringify(check)}`);
      await page.screenshot({path:path.join(out,`about-${width}.png`),fullPage:true});
      if (width === 390) {
        await page.locator('.mobile-menu').evaluate(el => el.open=true);
        const headerBox=await page.locator('.site-header').boundingBox();
        const panelBox=await page.locator('.mobile-menu nav').boundingBox();
        await page.screenshot({path:path.join(out,'about-mobile-menu.png'),clip:{x:0,y:headerBox.y,width,height:panelBox.y+panelBox.height-headerBox.y+15}});
        if ((await page.evaluate(()=>document.documentElement.scrollWidth)) > width) throw new Error('Expanded mobile menu overflows.');
      }
      console.log(JSON.stringify({width,height:check.height,sections:check.sections,headings:check.headings,bodyLinks:check.bodyLinks,brokenImages:check.brokenImages,shortActions:check.shortActions}));
      await page.close();
    }
  } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
