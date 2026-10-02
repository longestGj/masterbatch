/* Build the local P006 Core-block payload from the confirmed Page Spec. */
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname,'..');
const deps = 'C:/Users/longe/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const {marked} = require(path.join(deps,'marked'));
const {chromium} = require(path.join(deps,'playwright'));
const source = fs.readFileSync(path.join(root,'planning/pages/P006.md'),'utf8');
const copy = source.split('### Buyer-visible page text in reading order')[1]?.split('### Source, scope and unresolved decisions')[0];
if (!copy) throw new Error('P006 confirmed copy section missing.');
const tokens = marked.lexer(copy).filter(t=>t.type!=='space');
const headingIndex = text => tokens.findIndex(t=>t.type==='heading' && t.text===text);
const heading = text => {const i=headingIndex(text); if(i<0)throw new Error('Missing heading: '+text); return tokens[i];};
const following = text => {const i=headingIndex(text); if(tokens[i+1]?.type!=='paragraph')throw new Error('Missing paragraph: '+text);return tokens[i+1];};
const intentsIndex = headingIndex('What would you like to discuss?');
const intentList = tokens.slice(intentsIndex+1).find(t=>t.type==='list');
if (!intentList || intentList.items.length!==3) throw new Error('Three request intents required.');
const intentItems = intentList.items.map(item=>{
  const match=item.text.match(/^\*\*(.+?)\*\*\s+—\s+([\s\S]+)$/);
  if(!match)throw new Error('Unexpected intent format');
  return {title:match[1],body:marked.parseInline(match[2])};
});
const trust = following('A starting point for your discussion with GE').text
  .replace(/\*\*About GE\*\* → P003 `\/about` \(activate after destination check\)/,'[About GE](/about)');
const env = Object.fromEntries(fs.readFileSync(path.join(root,'.env'),'utf8').split(/\r?\n/)
  .filter(line=>line.includes('=')).map(line=>[line.slice(0,line.indexOf('=')),line.slice(line.indexOf('=')+1)]));
const url = 'http://127.0.0.1:'+env.WP_PORT;
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage();
  await page.goto(url+'/wp-login.php');
  await page.locator('#user_login').fill(env.WP_ADMIN_USER);
  await page.locator('#user_pass').fill(env.WP_ADMIN_PASSWORD);
  await Promise.all([page.waitForURL(u=>u.pathname.startsWith('/wp-admin/')),
    page.locator('#wp-submit').click()]);
  await page.goto(url+'/wp-admin/post-new.php?post_type=page');
  await page.waitForFunction(()=>window.wp?.blocks?.getBlockType('core/group') && window.wp?.blocks?.getBlockType('core/shortcode'));
  const content=await page.evaluate(({headings,paragraphs,intentItems,trust})=>{
   const b=wp.blocks.createBlock;
   const group=(cls,items,anchor)=>b('core/group',{tagName:'section',className:cls,...(anchor?{anchor}: {})},items);
   const h=(level,content)=>b('core/heading',{level,content});
   const p=(content)=>b('core/paragraph',{content});
   const button=(label,target)=>b('core/buttons',{},[b('core/button',{text:label,url:target,className:'is-style-ge-primary'})]);
   const modules=[];
   modules.push(group('ge-rfq-hero',[h(1,headings.hero),p(paragraphs.hero),button('Tell us about your project','#ge-rfq-form')]));
   modules.push(group('ge-rfq-trust',[h(2,headings.trust),p(trust)]));
   modules.push(group('ge-rfq-intents',[h(2,headings.intents),p(paragraphs.intents),
     group('ge-rfq-intent-cards',intentItems.map(item=>group('ge-rfq-intent-card',[h(3,item.title),p(item.body)])))]));
   modules.push(group('ge-rfq-form-section',[h(2,headings.form),p(paragraphs.form),b('core/shortcode',{text:'[ge_inquiry_form]'})],'ge-rfq-form'));
   modules.push(group('ge-rfq-next',[h(2,headings.next),p(paragraphs.next)]));
   modules.push(group('ge-rfq-routes',[h(2,'Another way to contact GE'),
     p('If you prefer email, <a href="mailto:jenny@ge-masterbatch.com">Email Jenny</a>. This is a direct contact choice, not evidence that a form submission reached her inbox.'),
     h(2,'Explore before you inquire'),
     p('If you want to assess products or supporting information first:'),
     b('core/list',{},[
      b('core/list-item',{content:'<a href="/products/black-masterbatch">Explore black masterbatch</a>'}),
      b('core/list-item',{content:'<a href="/documents">View documents</a>'}),
      b('core/list-item',{content:'<a href="/about">About GE</a>'})
     ])]));
   const saved=wp.blocks.serialize(modules);
   const bad=[]; const visit=bs=>bs.forEach(block=>{if(!block.isValid)bad.push(block.name);visit(block.innerBlocks||[])});
   visit(wp.blocks.parse(saved));
   if(bad.length)throw new Error('Invalid Core blocks: '+bad.join(','));
   return saved;
  },{
   headings:{hero:heading('Tell GE about your masterbatch requirement').text,
    trust:heading('A starting point for your discussion with GE').text,
    intents:heading('What would you like to discuss?').text,
    form:heading('Send your inquiry').text,
    next:heading('What happens after you contact GE?').text},
   paragraphs:{hero:marked.parseInline(following('Tell GE about your masterbatch requirement').text),
    intents:marked.parseInline(following('What would you like to discuss?').text),
    form:marked.parseInline(following('Send your inquiry').text),
    next:marked.parseInline(following('What happens after you contact GE?').text)},
   intentItems,trust:marked.parseInline(trust)
  });
  const out=path.join(root,'.local');fs.mkdirSync(out,{recursive:true});
  fs.writeFileSync(path.join(out,'p006-page.json'),JSON.stringify({stable_id:'P006',slug:'rfq',title:'Masterbatch Inquiry',status:'publish',content},null,2));
  process.stdout.write('P006 Core-block payload created in private local directory.\n');
 }finally{await browser.close()}
})().catch(()=>{process.stderr.write('P006 Core-block generation failed; inspect the local editor and approved source.\n');process.exitCode=1});
