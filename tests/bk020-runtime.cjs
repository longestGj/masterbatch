/* Scoped local saved-content, rendering and responsive checks for P017. */
const fs=require('node:fs');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const {chromium}=require('C:/Users/longe/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve(__dirname,'..'), base='http://127.0.0.1:18086';
const out=path.join(root,'.local/p017-runtime');
fs.mkdirSync(out,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const reference=await browser.newPage();
  await reference.goto(pathToFileURL(path.join(root,'planning/visuals/P017/p017-visual.html')).href);
  const facts=await reference.locator('main h1,main h2,main p,.spec span,.spec strong,.snapshot-grid span,.snapshot-grid strong,.use-grid>div,.compare-head span,.compare-row>* ,main li,figcaption').allTextContents();
  await reference.close();
  const checks=[];
  for(const width of [1440,768,390]){
   const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1});
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   const response=await page.goto(base+'/products/bk020/',{waitUntil:'networkidle'});
   if(response.status()!==200)throw new Error('P017 did not return 200');
   const state=await page.evaluate(()=>({
    width:document.documentElement.scrollWidth,
    headings:[...document.querySelectorAll('main h1,main h2')].map(x=>x.textContent.trim()),
    text:document.querySelector('main').textContent.replace(/\s+/g,' ').trim(),
    images:[...document.images].map(x=>x.complete&&x.naturalWidth>0),
    specs:document.querySelectorAll('.ge-p017-spec').length,
    sections:document.querySelectorAll('.ge-p017>section').length,
    title:document.title,description:document.querySelector('meta[name="description"]')?.content,
    canonical:document.querySelector('link[rel="canonical"]')?.href,
    robots:document.querySelector('meta[name="robots"]')?.content,
    links:[...document.querySelectorAll('main a')].map(x=>({text:x.textContent.trim(),href:x.getAttribute('href')}))
   }));
   if(state.width>width||state.images.includes(false)||state.specs!==5||state.sections!==8||errors.length)throw new Error('P017 layout/assets/sections failed '+JSON.stringify({width,state,errors}));
   for(const fact of facts){if(!state.text.includes(fact.replace(/\s+/g,' ').trim()))throw new Error('Approved text missing: '+fact);}
   if(/22%|47\.8%|99\.8%|10%|Good dispersion|no carbon black spot|mailto:/.test(state.text))throw new Error('Private ratio or unsupported public copy');
   if(state.title!=='BK020 Black Masterbatch | GE Chemical'||state.canonical!==base+'/products/bk020/'||!state.robots?.includes('noindex'))throw new Error('Local SEO/canonical/robots mismatch');
   for(const x of state.links.filter(x=>x.text==='Ask About BK020'))if(x.href!=='/rfq/')throw new Error('Unexpected inquiry path');
   if(width===390){await page.locator('.ge-mobile-menu summary').click();if(!await page.locator('.ge-mobile-menu nav').isVisible())throw new Error('Mobile menu failed');await page.locator('.ge-mobile-menu summary').click();}
   // Switch to keyboard modality after the mobile-menu pointer checks.
   await page.keyboard.press('Tab');
   await page.locator('main a').first().focus();
   const focus=await page.locator('main a').first().evaluate(x=>({focused:document.activeElement===x,outline:getComputedStyle(x).outlineStyle}));
   if(!focus.focused||focus.outline==='none')throw new Error('CTA focus missing');
   await page.screenshot({path:path.join(out,`p017-${width}.png`),fullPage:true});
   checks.push({width,height:await page.evaluate(()=>document.documentElement.scrollHeight),specs:state.specs,sections:state.sections,imagesLoaded:true,title:state.title,canonical:state.canonical,robots:state.robots,errors});
   await page.close();
  }
  const probe=await browser.newPage();
  const routes={};
  for(const route of ['/products/black-masterbatch/','/documents/','/manufacturing-quality/','/rfq/','/products/','/about/','/']){
   const response=await probe.goto(base+route);routes[route]=response.status();
  }
  if(routes['/products/black-masterbatch/']!==200||routes['/documents/']!==200||routes['/products/']!==200||routes['/about/']!==200||routes['/']!==200)throw new Error('Existing related route regression');
  const env=Object.fromEntries(fs.readFileSync(path.join(root,'.env'),'utf8').split(/\r?\n/).filter(x=>x.includes('=')).map(x=>[x.slice(0,x.indexOf('=')),x.slice(x.indexOf('=')+1).replace(/^"|"$/g,'')]));
  await probe.goto(base+'/wp-login.php');
  await probe.locator('#user_login').fill(env.WP_ADMIN_USER);await probe.locator('#user_pass').fill(env.WP_ADMIN_PASSWORD);
  await Promise.all([probe.waitForURL(u=>u.pathname.startsWith('/wp-admin/')),probe.locator('#wp-submit').click()]);
  await probe.goto(base+'/wp-admin/post.php?post=71&action=edit');
  await probe.waitForFunction(()=>window.wp?.data?.select('core/editor')?.getCurrentPostId()===71&&wp.data.select('core/block-editor')?.getBlocks()?.length>0);
  const editor=await probe.evaluate(()=>{
   const blocks=wp.data.select('core/block-editor').getBlocks(),invalid=[],names=new Set();
   const visit=xs=>xs.forEach(x=>{names.add(x.name);if(!x.isValid)invalid.push(x.name);visit(x.innerBlocks||[]);});visit(blocks);
   return {id:wp.data.select('core/editor').getCurrentPostId(),invalid,names:[...names],content:wp.data.select('core/editor').getEditedPostContent()};
  });
  const payload=JSON.parse(fs.readFileSync(path.join(root,'.local/p017-page.json'),'utf8'));
  if(editor.invalid.length||editor.names.some(x=>!x.startsWith('core/'))||editor.content!==payload.content)throw new Error('Saved native content differs from payload or has invalid blocks');
  await probe.close();
  const result={pageId:editor.id,checks,routes,editor:{invalid:editor.invalid,names:editor.names,payloadMatch:true},inquiry:'future route only; no form/context/delivery claim verified'};
  fs.writeFileSync(path.join(out,'checks.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result));
 }finally{await browser.close();}
})().catch(e=>{console.error(e.message);process.exitCode=1;});
