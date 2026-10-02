/* Actual local HTTP, editor persistence and responsive checks. Credentials never enter output. */
const fs=require('node:fs');const path=require('node:path');
const root=path.resolve(__dirname,'..');
const deps='C:/Users/longe/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const {chromium}=require(path.join(deps,'playwright'));const {marked}=require(path.join(deps,'marked'));
const config=Object.fromEntries(fs.readFileSync(path.join(root,'.env'),'utf8').split(/\r?\n/).filter(x=>x.includes('=')).map(x=>[x.slice(0,x.indexOf('=')),x.slice(x.indexOf('=')+1).replace(/^"|"$/g,'')]));
const base='http://127.0.0.1:'+config.WP_PORT;
const payload=JSON.parse(fs.readFileSync(path.join(root,'.local/p001-page.json'),'utf8'));
const spec=fs.readFileSync(path.join(root,'planning/pages/P001.md'),'utf8');
const copy=spec.split('<!-- BEGIN P001 FULL BUYER COPY -->')[1].split('<!-- END P001 FULL BUYER COPY -->')[0].trim();
const output=path.join(root,'.local/runtime');fs.mkdirSync(output,{recursive:true});
const assert=(condition,message)=>{if(!condition)throw new Error(message);};
let stage='frontend';
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage();const failures=[];
  page.on('pageerror',()=>failures.push('Frontend script error'));
  page.on('response',r=>{if(r.url().startsWith(base)&&r.status()>=400)failures.push(r.status()+' '+new URL(r.url()).pathname);});
  for(const width of [1440,768,390]){
   await page.setViewportSize({width,height:1000});
   const response=await page.goto(base,{waitUntil:'networkidle'});
   assert(response.status()===200,'Homepage HTTP failed');
   assert(response.headers()['x-robots-tag']?.includes('noindex'),'Local index protection missing');
   await page.evaluate(async()=>{for(let y=0;y<document.documentElement.scrollHeight;y+=700){window.scrollTo(0,y);await new Promise(resolve=>setTimeout(resolve,75));}await Promise.all([...document.images].map(img=>img.decode()));window.scrollTo(0,0);});
   const check=await page.evaluate(reference=>{
    const expected=document.createElement('div');expected.innerHTML=reference;
    const main=document.querySelector('main');const links=el=>[...el.querySelectorAll('a')].map(a=>({text:a.textContent.trim(),href:a.getAttribute('href')}));
    return {width:innerWidth,scrollWidth:document.documentElement.scrollWidth,modules:main.querySelectorAll('.ge-module').length,h1:document.querySelectorAll('h1').length,faq:main.querySelectorAll('.ge-faq-item').length,models:main.querySelectorAll('.ge-model-entries li a').length,
     copyMatch:main.textContent.replace(/\s/g,'')===expected.textContent.replace(/\s/g,''),linksMatch:JSON.stringify(links(main))===JSON.stringify(links(expected)),
     missingImages:[...document.images].filter(img=>!img.naturalWidth).length,title:document.title,description:document.querySelector('meta[name="description"]')?.content,
     canonical:document.querySelector('link[rel="canonical"]')?.href,robots:document.querySelector('meta[name="robots"]')?.content,
     invalidActions:[...document.querySelectorAll('.wp-block-button__link,.ge-inquiry-menu a')].filter(a=>a.checkVisibility()).filter(a=>{const s=getComputedStyle(a);return a.getBoundingClientRect().height<48||s.fontSize!=='15px';}).length,
     schema:JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent)['@graph'].map(item=>item['@type']),favicon:!!document.querySelector('link[rel="icon"]')};
   },marked.parse(copy));
   console.log(JSON.stringify(check));
   assert(check.scrollWidth===width&&check.modules===9&&check.h1===1&&check.faq===5&&check.models===7,'Homepage structure/layout differs');
   assert(check.copyMatch&&check.linksMatch,'Confirmed copy or link order changed');
   assert(check.missingImages===0&&check.invalidActions===0,'Media/action geometry failure');
   assert(check.title===payload.seo.title&&check.description===payload.seo.description,'Saved SEO values differ');
   assert(check.canonical===base+'/'&&check.robots.includes('noindex')&&check.favicon,'Canonical/index/site-icon check failed');
   await page.screenshot({path:path.join(output,'homepage-'+width+'.png'),fullPage:true});
   await page.locator('.ge-m1').screenshot({path:path.join(output,'hero-'+width+'.png')});
   await page.locator('.ge-m2').screenshot({path:path.join(output,'models-'+width+'.png')});
   await page.locator('.site-footer').screenshot({path:path.join(output,'footer-'+width+'.png')});
   await page.locator('.site-header').screenshot({path:path.join(output,'header-'+width+'.png')});
   for(let module=3;module<=9;module++) await page.locator('.ge-m'+module).screenshot({path:path.join(output,'module-'+module+'-'+width+'.png')});
  }
  for(const width of [320,600,601,760,761,1100,1101]){
   await page.setViewportSize({width,height:1000});
   assert(await page.evaluate(()=>document.documentElement.scrollWidth===innerWidth),'Breakpoint overflow at '+width);
  }
  await page.setViewportSize({width:390,height:1000});await page.evaluate(()=>window.scrollTo(0,0));
  await page.locator('.ge-mobile-menu summary').click();
  assert(await page.locator('.ge-mobile-menu').getAttribute('open')!==null,'Mobile menu did not open');
  assert(await page.evaluate(()=>document.documentElement.scrollWidth===innerWidth),'Open menu overflow');
  const menuBottom=await page.locator('.ge-mobile-menu nav').evaluate(el=>Math.ceil(el.getBoundingClientRect().bottom));
  await page.screenshot({path:path.join(output,'mobile-menu.png'),clip:{x:0,y:0,width:390,height:menuBottom+16}});
  await page.locator('.ge-mobile-menu summary').click();
  await page.setViewportSize({width:1440,height:1000});await page.goto(base,{waitUntil:'networkidle'});
  await page.keyboard.press('Tab');await page.keyboard.press('Enter');
  assert(await page.evaluate(()=>document.activeElement.id==='main-content'),'Skip link did not reach main content');
  await page.locator('.ge-hero-copy .is-style-ge-primary a').focus();
  const focus=await page.evaluate(()=>document.activeElement.matches(':focus-visible')&&getComputedStyle(document.activeElement).outlineWidth==='3px');
  assert(focus,'Visible action focus missing');
  assert(failures.length===0,'Failed frontend resources or script errors: '+failures.join(', '));
  console.log(JSON.stringify({breakpoints:'passed',menu:'opened/closed',skipLink:'passed',focus:'passed',frontendErrors:0}));
  const paths=await page.evaluate(()=>[...new Set([...document.querySelectorAll('a[href]')].map(a=>a.getAttribute('href')).filter(h=>h.startsWith('/')&&!h.startsWith('/#')))]);
  const routes=[];for(const route of paths){const response=await page.request.get(base+route);routes.push({path:route,status:response.status()});}
  fs.writeFileSync(path.join(output,'routes.json'),JSON.stringify(routes,null,2)+'\n');
  console.log(JSON.stringify({destinationRoutes:routes.length,available:routes.filter(r=>r.status===200).length,deferred404:routes.filter(r=>r.status===404).length}));
  stage='editor';
  const editor=await browser.newPage();await editor.goto(base+'/wp-login.php',{waitUntil:'domcontentloaded'});
  await editor.locator('#user_login').fill(config.WP_ADMIN_USER);await editor.locator('#user_pass').fill(config.WP_ADMIN_PASSWORD);
  await Promise.all([editor.waitForURL(url=>url.pathname.startsWith('/wp-admin/'),{waitUntil:'domcontentloaded'}),editor.locator('#wp-submit').click()]);
  const id=(await editor.request.get(base+'/wp-json/wp/v2/pages?slug=ge-home')).json();
  const pageRecord=(await id)[0];assert(pageRecord,'Owned homepage not found');
  await editor.goto(base+'/wp-admin/post.php?post='+pageRecord.id+'&action=edit',{waitUntil:'domcontentloaded'});
  await editor.waitForFunction(()=>wp?.data?.select('core/block-editor')?.getBlocks()?.length===9);
  const editorCheck=await editor.evaluate(()=>{const all=[];const visit=bs=>bs.forEach(b=>{all.push(b);visit(b.innerBlocks||[])});visit(wp.data.select('core/block-editor').getBlocks());return {blocks:all.length,invalid:all.filter(b=>!b.isValid).length,customHTML:all.filter(b=>b.name==='core/html').length};});
  assert(!editorCheck.invalid&&!editorCheck.customHTML,'Editor has invalid or non-native HTML blocks');
  await editor.evaluate(()=>{const find=bs=>{for(const b of bs){if(b.name==='core/paragraph'&&String(b.attributes.content).startsWith('GE is a China-based'))return b;const inner=find(b.innerBlocks||[]);if(inner)return inner;}};const block=find(wp.data.select('core/block-editor').getBlocks());window.geVerification={clientId:block.clientId,content:block.attributes.content};wp.data.dispatch('core/block-editor').updateBlockAttributes(block.clientId,{content:block.attributes.content+' Local editing verification.'});});
  try{
   await editor.evaluate(()=>wp.data.dispatch('core/editor').savePost());
   await page.goto(base,{waitUntil:'networkidle'});assert((await page.locator('main').textContent()).includes('Local editing verification.'),'Editor save did not reach HTTP');
  }finally{
   await editor.evaluate(()=>{wp.data.dispatch('core/block-editor').updateBlockAttributes(window.geVerification.clientId,{content:window.geVerification.content});return wp.data.dispatch('core/editor').savePost();});
  }
  await page.goto(base,{waitUntil:'networkidle'});assert(!(await page.locator('main').textContent()).includes('Local editing verification.'),'Editor verification copy was not restored');
  console.log(JSON.stringify({editor:editorCheck,savedChangeRendered:true,originalCopyRestored:true}));
 }finally{await browser.close();}
})().catch(error=>{console.error(stage==='editor'?'Editor persistence check failed; inspect private local diagnostics without exposing login details.':error.message);process.exitCode=1;});
