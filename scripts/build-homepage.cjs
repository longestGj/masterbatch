/* Builds a local import payload using the installed WordPress editor's own Core serializer. */
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const deps='C:/Users/longe/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const {marked}=require(path.join(deps,'marked'));
const {chromium}=require(path.join(deps,'playwright'));
const local=path.join(root,'.local');
fs.mkdirSync(path.join(local,'assets'),{recursive:true});
const files={
 logo:['planning/visuals/P001/assets/ge-logo-candidate.png','ge-logo.png','GE Chemical & Polymer Group Co., Ltd.'],
 brandmark:['planning/visuals/P001/assets/ge-brandmark-candidate.png','ge-brandmark.png','GE mark'],
 factory:['planning/inputs/Cmp_Info/PIC&Vedio/微信图片_20260707174840_214_1.jpg','ge-workshop-yard.jpg','Workshop buildings and yard in a supplied site photograph'],
 granules:['planning/inputs/Cmp_Info/PIC&Vedio/微信图片_20260707174840_213_1.jpg','ge-black-granules.jpg','Black granules in a supplied product photograph'],
 equipment:['planning/inputs/Cmp_Info/PIC&Vedio/ge-chemical-masterbatch-workshop-equipment.jpg','ge-workshop-equipment.jpg','Equipment in a supplied workshop photograph']
};
const assets={};
for(const [key,[source,file,alt]] of Object.entries(files)){
 fs.copyFileSync(path.join(root,source),path.join(local,'assets',file));
 assets[key]={file,title:alt,alt};
}
fs.writeFileSync(path.join(local,'p001-assets.json'),JSON.stringify(assets,null,2));
if(process.argv.includes('--assets-only'))process.exit(0);
const source=fs.readFileSync(path.join(root,'planning/pages/P001.md'),'utf8');
const copy=source.split('<!-- BEGIN P001 FULL BUYER COPY -->')[1].split('<!-- END P001 FULL BUYER COPY -->')[0].trim();
const tokens=marked.lexer(copy);
const groups=[[]];
for(const token of tokens){if(token.type==='heading'&&token.depth===2)groups.push([]);if(token.type!=='space')groups[groups.length-1].push(token);}
if(groups.length!==9)throw new Error('Expected the confirmed nine homepage modules.');
const menus={
 primary:[['Black Masterbatch','/products/black-masterbatch'],['Products','/products'],['Applications','/applications'],['About GE','/about']],
 inquiry:[['Discuss Your Requirements','/rfq']],
 'footer-products':[['Black Masterbatch','/products/black-masterbatch'],['White Masterbatch','/products/white-masterbatch'],['Color Masterbatch','/products/color-masterbatch'],['Desiccant Masterbatch','/products/desiccant-defoaming-masterbatch']],
 'footer-company':[['About GE','/about'],['Manufacturing & Quality','/manufacturing-quality']],
 'footer-information':[['Applications','/applications'],['Product Documents','/documents'],['Masterbatch Questions','/faq']]
};
const credentials=Object.fromEntries(fs.readFileSync(path.join(root,'.env'),'utf8').split(/\r?\n/).filter(x=>x.includes('=')).map(x=>[x.slice(0,x.indexOf('=')),x.slice(x.indexOf('=')+1).replace(/^"|"$/g,'')]));
const url='http://127.0.0.1:'+credentials.WP_PORT;
const images=JSON.parse(fs.readFileSync(path.join(local,'p001-media.json'),'utf8'));
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage();
  await page.goto(url+'/wp-login.php');
  await page.locator('#user_login').fill(credentials.WP_ADMIN_USER);
  await page.locator('#user_pass').fill(credentials.WP_ADMIN_PASSWORD);
  await Promise.all([page.waitForURL(current=>current.pathname.startsWith('/wp-admin/'),{waitUntil:'domcontentloaded'}),page.locator('#wp-submit').click()]);
  await page.goto(url+'/wp-admin/post-new.php?post_type=page',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.wp?.blocks?.getBlockType('core/group')&&window.wp?.blocks?.getBlockType('core/image'));
  const nativeGroups=groups.map(ts=>ts.map(t=>({...t,html:t.type==='paragraph'||t.type==='heading'?marked.parseInline(t.text):undefined,items:t.type==='list'?t.items.map(i=>marked.parseInline(i.text)):undefined})));
  const content=await page.evaluate(({g,images})=>{
   const b=wp.blocks.createBlock;
   const group=(cls,children,tag='div')=>b('core/group',{className:cls,tagName:tag},children);
   const heading=t=>b('core/heading',{level:t.depth,content:t.html});
   const paragraph=(t,cls)=>b('core/paragraph',{content:t.html,className:cls});
   const button=(t,style='ge-text')=>{const el=document.createElement('div');el.innerHTML=t.html;const a=el.querySelector('a');return b('core/button',{text:a.innerHTML,url:a.getAttribute('href'),className:'is-style-'+style});};
   const actions=(ts,styles=[])=>b('core/buttons',{className:'ge-actions'},ts.map((t,i)=>button(t,styles[i]||'ge-text')));
   const list=t=>b('core/list',{},t.items.map(content=>b('core/list-item',{content})));
   const image=(key,cls)=>b('core/image',{id:images[key].id,url:images[key].url,alt:images[key].alt,sizeSlug:'full',linkDestination:'none',className:cls});
   const module=(i,children)=>group('ge-module ge-m'+i,[group('ge-container',children)],'section');
   const modules=[];
   modules.push(module(1,[group('ge-hero-grid',[
    group('ge-hero-copy',[paragraph(g[0][0],'ge-brand-identity'),heading(g[0][1]),paragraph(g[0][2],'ge-lead'),paragraph(g[0][3]),paragraph(g[0][4],'ge-hero-note'),actions(g[0].slice(5),['ge-primary','ge-secondary'])]),
    group('ge-hero-media',[image('factory','ge-hero-factory'),image('granules','ge-hero-product')])
   ])]));
   modules.push(module(2,[group('ge-black-grid',[
    group('ge-black-intro',[heading(g[1][0]),paragraph(g[1][1]),actions([g[1][2]],['ge-secondary'])]),
    group('ge-model-entries',[paragraph(g[1][3]),list({...g[1][4],items:g[1][4].items})])
   ])]));
   modules.push(module(3,[group('ge-section-intro',[heading(g[2][0]),paragraph(g[2][1])]),
    group('ge-stats',g[2][2].items.map(html=>b('core/paragraph',{content:html}))),
    group('ge-cooperation',[heading(g[2][3]),group('ge-reasons',g[2].slice(4).map(t=>paragraph(t)))])
   ]));
   modules.push(module(4,[group('ge-section-intro',[heading(g[3][0]),paragraph(g[3][1])]),
    group('ge-portfolio',[2,4,6].map((idx,n)=>group('ge-product-card ge-product-'+['white','color','desiccant'][n],[heading(g[3][idx]),actions([g[3][idx+1]])],'article'))),actions([g[3][8]])
   ]));
   modules.push(module(5,[group('ge-applications',[heading(g[4][0]),paragraph(g[4][1]),list(g[4][2]),actions([g[4][3]])])]));
   modules.push(module(6,[group('ge-company-grid',[group('ge-company-copy',[heading(g[5][0]),paragraph(g[5][1]),paragraph(g[5][2]),actions(g[5].slice(3))]),image('factory','ge-company-photo')])]));
   modules.push(module(7,[group('ge-documents-grid',[image('equipment','ge-equipment-photo'),group('ge-documents-copy',[heading(g[6][0]),paragraph(g[6][1]),paragraph(g[6][2]),actions(g[6].slice(3))])])]));
   const faqs=[];for(let i=1;i<g[7].length-1;i+=2)faqs.push(group('ge-faq-item',[heading(g[7][i]),paragraph(g[7][i+1])],'article'));
   modules.push(module(8,[group('ge-faq-grid',[heading(g[7][0]),group('ge-faq-list',[...faqs,actions([g[7][g[7].length-1]])])])]));
   modules.push(module(9,[heading(g[8][0]),paragraph(g[8][1]),actions([g[8][2]],['ge-primary'])]));
   const saved=wp.blocks.serialize(modules);
   const parsed=wp.blocks.parse(saved);
   const invalid=[];const check=blocks=>blocks.forEach(block=>{if(!block.isValid)invalid.push(block.name);check(block.innerBlocks||[]);});check(parsed);
   if(invalid.length)throw new Error('Invalid native block serialization: '+invalid.join(','));
   return saved;
  },{g:nativeGroups,images});
  const seoSection=source.split('### SEO title and meta description')[1].split('### Buyer-visible page copy')[0];
  const title=seoSection.match(/- Title: `([^`]+)`/)[1];
  const description=seoSection.match(/- Meta description: `([^`]+)`/)[1];
  fs.writeFileSync(path.join(local,'p001-page.json'),JSON.stringify({stable_id:'P001',slug:'ge-home',title:'Homepage',status:'publish',content,seo:{title,description},menus,branding:{logo:images.logo.id,icon:images.brandmark.id,location:'Binzhou, Shandong, China'}},null,2));
  console.log(JSON.stringify({modules:9,serializer:'installed WordPress Core editor',payload:'.local/p001-page.json'}));
 }finally{await browser.close();}
})().catch(()=>{console.error('Native homepage generation failed; inspect the local editor/runtime without exposing login details.');process.exitCode=1;});
