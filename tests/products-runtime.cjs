/* Scoped P002 saved-content, rendering, navigation and editor verification. */
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const deps='C:/Users/longe/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const {chromium}=require(path.join(deps,'playwright'));const {marked}=require(path.join(deps,'marked'));
const env=Object.fromEntries(fs.readFileSync(path.join(root,'.env'),'utf8').split(/\r?\n/).filter(x=>x.includes('='))
 .map(x=>[x.slice(0,x.indexOf('=')),x.slice(x.indexOf('=')+1).replace(/^"|"$/g,'')]));
if(env.COMPOSE_PROJECT_NAME!=='ge-masterbatch-local-20261002'||env.WP_PORT!=='18086')throw Error('Wrong P002 test target.');
const base='http://127.0.0.1:18086';const payload=JSON.parse(fs.readFileSync(path.join(root,'.local/p002-page.json'),'utf8'));
const spec=fs.readFileSync(path.join(root,'planning/pages/P002.md'),'utf8');
const copy=spec.split('### Begin buyer-visible Full Copy')[1].split('### End buyer-visible Full Copy')[0].trim();
const out=path.join(root,'.local/runtime');fs.mkdirSync(out,{recursive:true});
const assert=(ok,msg)=>{if(!ok)throw Error(msg);};const clean=s=>s.replace(/\s+/g,' ').trim();
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const baseline=await browser.newPage();await baseline.setContent('<main>'+marked.parse(copy)+'</main>');
  const expectedText=(await baseline.locator('main h1,main h2,main h3,main p,main li').allTextContents()).map(clean);
  const expectedLinks=await baseline.locator('main a').evaluateAll(as=>as.map(a=>({label:a.textContent.trim(),href:a.getAttribute('href')})));
  await baseline.close();const page=await browser.newPage();const failures=[];
  page.on('pageerror',e=>failures.push(e.message));
  // The owner-selected form route is separately reported; its known missing Page is not a P002 asset failure.
  page.on('response',r=>{if(r.url().startsWith(base)&&r.status()>=400&&!['/rfq','/manufacturing-quality','/products/white-masterbatch','/products/desiccant-defoaming-masterbatch'].includes(new URL(r.url()).pathname.replace(/\/$/,'')))failures.push(r.status()+' '+new URL(r.url()).pathname);});
  for(const width of [1440,768,390]){
   await page.setViewportSize({width,height:1000});const response=await page.goto(base+'/products/',{waitUntil:'networkidle'});
   assert(response.status()===200,'P002 HTTP failed');
   const text=(await page.locator('main h1,main h2,main h3,main p,main li,main .wp-block-button__link').allTextContents()).map(clean);
   assert(JSON.stringify(text)===JSON.stringify(expectedText),'Rendered copy mismatch '+width);
   const actual=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,
    modules:document.querySelectorAll('.ge-p002-section').length,h1:document.querySelectorAll('main h1').length,
    families:document.querySelectorAll('.ge-p002-m2 h3').length,tables:document.querySelectorAll('main table').length,
    links:[...document.querySelectorAll('main a')].map(a=>({label:a.textContent.trim(),href:a.getAttribute('href')})),
    images:[...document.images].every(i=>i.complete&&i.naturalWidth),photo:document.querySelector('.ge-p002-black-photo img')?.alt,

    title:document.title,meta:document.querySelector('meta[name="description"]')?.content,canonical:document.querySelector('link[rel="canonical"]')?.href,
    short:[...document.querySelectorAll('main .wp-block-button__link')].filter(a=>a.getBoundingClientRect().height<48).length,
    css:!![...document.styleSheets].find(s=>s.href?.includes('products.css')),

    email:document.body.innerText.includes('jenny@')||!!document.querySelector('a[href^="mailto:"]')}));
   assert(actual.scroll===width&&actual.modules===5&&actual.h1===1&&actual.families===4&&actual.tables===0,'Structure/overflow '+width);
   assert(actual.images&&actual.photo==='Black masterbatch granules','Photo delivery differs');
   assert(actual.css&&actual.short===0,'Action/layout style failed');assert(!actual.email,'Public email remains');
   assert(JSON.stringify(actual.links)===JSON.stringify(expectedLinks),'Rendered actions differ');
   assert(actual.title===payload.seo.title&&actual.meta===payload.seo.description&&actual.canonical===base+'/products/','Search presentation differs');
   assert(response.headers()['x-robots-tag']?.includes('noindex'),'No local noindex header');
   await page.screenshot({path:path.join(out,`products-${width}.png`),fullPage:true});
   await page.locator('.ge-p002-m1').screenshot({path:path.join(out,`products-hero-${width}.png`)});
   await page.locator('.ge-p002-m2').screenshot({path:path.join(out,`products-families-${width}.png`)});
   console.log(JSON.stringify({width,modules:5,families:4,exactCopy:true,links:actual.links.length,noOverflow:true,images:true,seo:true}));
  }
  for(const width of [320,600,601,760,761,860,861,1000,1001,1100,1101]){
   await page.setViewportSize({width,height:1000});assert(await page.evaluate(()=>document.documentElement.scrollWidth===innerWidth),'Breakpoint overflow '+width);
  }
  await page.setViewportSize({width:390,height:1000});
  await page.locator('.ge-mobile-menu summary').click();assert(await page.locator('.ge-mobile-menu').getAttribute('open')!==null,'Menu failed');
  assert(await page.evaluate(()=>document.documentElement.scrollWidth===innerWidth),'Menu overflow');await page.locator('.ge-mobile-menu summary').click();
  await page.goto(base+'/products/');await page.keyboard.press('Tab');await page.keyboard.press('Enter');
  assert(await page.evaluate(()=>document.activeElement.id==='main-content'),'Skip link failed');
  await page.locator('.ge-p002-m5 .wp-block-button__link').first().focus();
  assert(await page.evaluate(()=>document.activeElement.matches(':focus-visible')&&getComputedStyle(document.activeElement).outlineWidth==='3px'),'Focus failed');
  await page.locator('main a[href="#product-families"]').first().click();assert(new URL(page.url()).hash==='#product-families','Anchor action failed');
  await page.locator('main a[href="/products/black-masterbatch"]').first().click();assert((await page.request.get(page.url())).status()===200,'P013 route failed');
  await page.goto(base+'/products/');await page.locator('.ge-p002-m5 .wp-block-button__link').first().click();
  const form=await page.request.get(page.url());assert(new URL(page.url()).pathname.replace(/\/$/,'')==='/rfq','Form entrance target differs');
  console.log(JSON.stringify({formDestination:'/rfq',http:form.status(),formAvailable:form.status()===200,submission:'not tested'}));
  const routes=[...new Set(expectedLinks.map(a=>a.href).filter(h=>h.startsWith('/')))];
  for(const route of routes){const response=await page.request.get(base+route);if(['/documents','/products/black-masterbatch'].includes(route))assert(response.status()===200,'Established destination unavailable: '+route);console.log(JSON.stringify({destination:route,http:response.status(),available:response.status()===200}));}
  // Saved content and actual native editor, read only.
  const editor=await browser.newPage();await editor.goto(base+'/wp-login.php');
  await editor.locator('#user_login').fill(env.WP_ADMIN_USER);await editor.locator('#user_pass').fill(env.WP_ADMIN_PASSWORD);
  await Promise.all([editor.waitForURL(u=>u.pathname.startsWith('/wp-admin/')),editor.locator('#wp-submit').click()]);
  await editor.goto(base+'/wp-admin/post.php?post=67&action=edit');
  await editor.waitForFunction(()=>wp.data.select('core/block-editor').getBlocks().length>0);
  const saved=await editor.evaluate(()=>wp.apiFetch({path:'/wp/v2/pages/67?context=edit'}));
  assert(saved.slug==='products'&&saved.status==='publish'&&saved.template===payload.template&&saved.content.raw===payload.content,'Saved P002 differs');
  assert(saved.meta._ge_seo_title===payload.seo.title&&saved.meta._ge_seo_description===payload.seo.description,'Saved SEO mismatch');
  const blocks=await editor.evaluate(()=>{let count=0,invalid=0,customHTML=0,tables=0;const visit=bs=>bs.forEach(b=>{count++;if(!b.isValid)invalid++;if(b.name==='core/html')customHTML++;if(b.name==='core/table')tables++;visit(b.innerBlocks||[]);});visit(wp.data.select('core/block-editor').getBlocks());return{count,invalid,customHTML,tables};});
  assert(blocks.count>25&&blocks.invalid===0&&blocks.customHTML===0&&blocks.tables===0,'Native editor failed');
  assert(failures.length===0,'Frontend errors: '+failures.join(', '));
  console.log(JSON.stringify({savedPage:67,contentMatch:true,blocks,menu:true,anchor:true,skipLink:true,focus:true,frontendErrors:0}));
 }finally{await browser.close();}
})().catch(e=>{console.error(e.message);process.exitCode=1;});
