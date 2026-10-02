/* Serialize owner-confirmed P002 as editable installed WordPress Core blocks. */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
const deps = 'C:/Users/longe/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const {marked} = require(path.join(deps, 'marked'));
const {chromium} = require(path.join(deps, 'playwright'));
const source = fs.readFileSync(path.join(root, 'planning/pages/P002.md'), 'utf8');
const copy = source.split('### Begin buyer-visible Full Copy')[1]?.split('### End buyer-visible Full Copy')[0]?.trim();
if (!copy || !source.includes('Owner visual acceptance and local implementation authorization')) throw Error('Missing P002 build authority.');
const seo = source.split('### Candidate SEO title and meta description')[1]?.split('### Begin buyer-visible Full Copy')[0] || '';
const title = seo.match(/- SEO title: `([^`]+)`/)?.[1];
const description = seo.match(/- Meta description: `([^`]+)`/)?.[1];
if (!title || !description || /mailto:|jenny@|email app/i.test(copy)) throw Error('Invalid P002 source.');
const env = Object.fromEntries(fs.readFileSync(path.join(root, '.env'), 'utf8').split(/\r?\n/).filter(x=>x.includes('='))
  .map(x=>[x.slice(0,x.indexOf('=')),x.slice(x.indexOf('=')+1).replace(/^"|"$/g,'')]));
if (env.COMPOSE_PROJECT_NAME !== 'ge-masterbatch-local-20261002' || env.WP_PORT !== '18086') throw Error('Wrong local target.');
const base = 'http://127.0.0.1:18086';
const photo = JSON.parse(fs.readFileSync(path.join(root,'.local/p001-media.json'),'utf8')).granules;
const groups=[[]];
for (const t of marked.lexer(copy)) {if(t.type==='heading'&&t.depth===2)groups.push([]);if(t.type!=='space')groups.at(-1).push(t);}
const headings=['Masterbatch Products','Choose Your Next Step','Explore the Black Masterbatch Range','Not Sure Which Product or Model to Ask About?'];
if(groups.length!==4||groups.some((g,i)=>g[0]?.text!==headings[i]))throw Error('P002 section order changed.');
const prepared=groups.map(g=>g.map(t=>({...t,
 html:['heading','paragraph'].includes(t.type)?marked.parseInline(t.text):null,
 action:t.type==='paragraph'&&t.tokens?.length===1&&t.tokens[0].type==='link'?{label:t.tokens[0].text,url:t.tokens[0].href}:null,
 header:t.type==='table'?t.header.map(c=>({content:marked.parseInline(c.text),tag:'th'})):null,
 rows:t.type==='table'?t.rows.map(r=>({cells:r.map(c=>({content:marked.parseInline(c.text),tag:'td'}))})):null
})));
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage();
  await page.goto(base+'/wp-login.php');
  await page.locator('#user_login').fill(env.WP_ADMIN_USER);
  await page.locator('#user_pass').fill(env.WP_ADMIN_PASSWORD);
  await Promise.all([page.waitForURL(u=>u.pathname.startsWith('/wp-admin/')) ,page.locator('#wp-submit').click()]);
  // Read an existing editor rather than create/autosave a temporary page.
  await page.goto(base+'/wp-admin/post.php?post=64&action=edit');
  await page.waitForFunction(()=>window.wp?.blocks?.getBlockType('core/table'));
  const content=await page.evaluate(({s,photo})=>{
   const b=wp.blocks.createBlock;
   const group=(cls,children,tagName='div',anchor)=>b('core/group',{className:cls,tagName,...(anchor?{anchor}:{})},children);
   const button=t=>b('core/button',{text:t.label,url:t.url,className:'is-style-ge-'+(t.url==='/rfq'?'primary':'secondary')});
   const tokens=items=>{const out=[];for(const t of items){
    if(t.type==='heading')out.push(b('core/heading',{level:t.depth,content:t.html}));
    else if(t.action){const previous=out.at(-1);if(previous?.name==='core/buttons')previous.innerBlocks.push(button(t.action));else out.push(b('core/buttons',{className:'ge-actions'},[button(t.action)]));}
    else if(t.type==='paragraph')out.push(b('core/paragraph',{content:t.html}));
    else if(t.type==='table')out.push(b('core/table',{className:'ge-p002-family-table',head:[{cells:t.header}],body:t.rows,hasFixedLayout:false}));
    else throw Error('Unsupported P002 content token: '+t.type);
   }return out;};
   const section=(n,items,anchor)=>group('ge-module ge-p002-section ge-p002-m'+n,[group('ge-container',items)],'section',anchor);
   const split=items=>group('ge-p002-section-grid',[group('ge-p002-section-heading',tokens(items.slice(0,1))),group('ge-p002-section-body',tokens(items.slice(1)))]);
   const blocks=[group('ge-p002',[
    section(1,[group('ge-p002-hero-grid',[
     group('ge-p002-hero-copy',tokens(s[0])),
     b('core/image',{id:photo.id,url:photo.url,alt:'Black masterbatch granules',sizeSlug:'full',linkDestination:'none',className:'ge-p002-hero-photo'})])]),
    section(2,tokens(s[1]),'choose-your-next-step'),section(3,[split(s[2])]),section(4,[split(s[3])])])];
   const serialized=wp.blocks.serialize(blocks);const parsed=wp.blocks.parse(serialized);let invalid=0;
   const visit=bs=>bs.forEach(x=>{if(!x.isValid)invalid++;visit(x.innerBlocks||[]);});visit(parsed);
   if(invalid)throw Error('Invalid serialized P002 Core blocks.');return serialized;
  },{s:prepared,photo});
  const payload={stable_id:'P002',slug:'products',route:'/products/',title:'Products',status:'publish',
   template:'page-templates/sectioned-page.php',home:base+'/',content,source_hash:crypto.createHash('sha256').update(copy).digest('hex'),
   seo:{title,description},photo_id:photo.id};
  fs.writeFileSync(path.join(root,'.local/p002-page.json'),JSON.stringify(payload,null,2));
  console.log(JSON.stringify({page:'P002',modules:4,photo:photo.id,serializer:'installed Core',payload:'.local/p002-page.json'}));
 }finally{await browser.close();}
})().catch(e=>{console.error(e.message);process.exitCode=1;});
