/* P017 approved copy -> installed WordPress Core serializer. Local only. */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const {pathToFileURL} = require('node:url');
const root = path.resolve(__dirname, '..');
const {chromium} = require('C:/Users/longe/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const specPath = path.join(root, 'planning/pages/P017.md');
const spec = fs.readFileSync(specPath, 'utf8');
if (!spec.includes('Owner Gate 3 approval') || !spec.includes('不公开完整比例')) throw new Error('P017 approvals missing.');
const visual = fs.readFileSync(path.join(root, 'planning/visuals/P017/p017-visual.html'), 'utf8');
const env = Object.fromEntries(fs.readFileSync(path.join(root, '.env'), 'utf8').split(/\r?\n/)
  .filter(x => x.includes('=')).map(x => [x.slice(0, x.indexOf('=')), x.slice(x.indexOf('=') + 1).replace(/^"|"$/g, '')]));
if (env.COMPOSE_PROJECT_NAME !== 'ge-masterbatch-local-20261002' || env.WP_PORT !== '18086') throw new Error('Wrong local target.');
const base = 'http://127.0.0.1:18086';
const media = JSON.parse(fs.readFileSync(path.join(root, '.local/p001-media.json'), 'utf8')).granules;
(async () => {
  const browser = await chromium.launch({headless:true});
  try {
    const page = await browser.newPage();
    await page.goto(pathToFileURL(path.join(root, 'planning/visuals/P017/p017-visual.html')).href);
    const s = await page.evaluate(() => {
      const q = x => document.querySelector(x), all = x => [...document.querySelectorAll(x)];
      const text = x => q(x).textContent.trim(), html = x => q(x).innerHTML;
      return {
        title:document.title, description:q('meta[name="description"]').content,
        hero:{eyebrow:text('.eyebrow'), heading:text('h1'), paragraphs:all('.hero-copy>p:not(.eyebrow)').map(x=>x.innerHTML),
          caption:text('figcaption'), snapshotLabel:text('.snapshot-label'), snapshot:all('.snapshot-grid>div').map(x=>({label:x.querySelector('span').textContent,value:x.querySelector('strong').textContent}))},
        specs:{heading:text('.specs h2'), lead:html('.specs .intro p'), items:all('.spec').map(x=>({label:x.querySelector('span').textContent,value:x.querySelector('strong').textContent,note:x.querySelector('p')?.innerHTML})), detail:html('.minor-detail')},
        uses:{heading:text('.uses h2'), lead:html('.uses .intro p'), items:all('.use-grid>div').map(x=>x.textContent), note:html('.use-note')},
        composition:{heading:text('.composition h2'), lead:html('.composition .intro p'), note:html('.composition-note')},
        compare:{heading:text('.compare h2'), lead:html('.compare .intro p'), head:all('.compare-head>span').map(x=>x.textContent), rows:all('.compare-row').map(x=>[...x.children].map(c=>c.textContent)), note:html('.compare-note')},
        boundary:{heading:text('.boundary h2'), body:html('.boundary p')},
        evidence:{heading:text('.evidence h2'), lead:html('.evidence-inner>div>p'), links:all('.evidence-links>a').map(x=>({label:x.textContent.replace(/\s*↗$/,''),url:x.getAttribute('href'),note:x.nextElementSibling.textContent}))},
        contact:{heading:text('.contact h2'), lead:html('.contact-grid>div>p'), items:all('.hint-list>li').map(x=>x.innerHTML), product:html('.contact-action>p')}
      };
    });
    if (s.specs.items.length !== 5 || /22%|47\.8%|99\.8%|10%/.test(await page.locator('main').innerText())) throw new Error('Unexpected public composition.');
    // Keep the single Page Spec's approved Full Copy synchronized with the visual.
    const lines = ['<!-- BEGIN P017 APPROVED FULL COPY -->', `**SEO title:** ${s.title}`, `**Meta description:** ${s.description}`, '', '### Hero', s.hero.eyebrow, `# ${s.hero.heading}`, ...s.hero.paragraphs, '**Ask About BK020** → /rfq/', s.hero.caption, s.hero.snapshotLabel,
      ...s.hero.snapshot.map(x=>`${x.label}: ${x.value}`), `### ${s.specs.heading}`, s.specs.lead,
      ...s.specs.items.map(x=>`- **${x.label}: ${x.value}**${x.note ? ' — '+x.note : ''}`), s.specs.detail,
      `### ${s.uses.heading}`, s.uses.lead, ...s.uses.items.map(x=>'- '+x), s.uses.note,
      `### ${s.composition.heading}`, s.composition.lead, s.composition.note,
      `### ${s.compare.heading}`, s.compare.lead, ['| '+s.compare.head.join(' | ')+' |', '|---|---|---|', ...s.compare.rows.map(x=>'| '+x.join(' | ')+' |')].join('\n'), s.compare.note, '**Explore the Black Masterbatch Range** → /products/black-masterbatch/',
      `### ${s.boundary.heading}`, s.boundary.body, `### ${s.evidence.heading}`, s.evidence.lead,
      ...s.evidence.links.map(x=>`**${x.label}** → ${x.url}\n\n${x.note}`), `### ${s.contact.heading}`, s.contact.lead, ...s.contact.items.map(x=>'- '+x), s.contact.product,
      '**Ask About BK020** → /rfq/', '**Explore the Black Masterbatch Range** → /products/black-masterbatch/', '<!-- END P017 APPROVED FULL COPY -->'];
    const copySection = spec.indexOf('## Gate 2 Pass 2');
    const marker = spec.indexOf('<!-- BEGIN P017 APPROVED FULL COPY -->', copySection);
    const start = marker >= 0 ? marker : spec.indexOf('**SEO title:**', copySection);
    const end = spec.indexOf('Initial independent Gate 2 Full Copy Buyer Review', start);
    if (start < 0 || end < 0) throw new Error('Full Copy boundaries missing.');
    const notes = '\n\n### Link and action scope notes (not buyer-visible copy)\n\nThe owner-approved final visual supersedes the earlier email action and conditional entrance presentation. P006 /rfq/ and P004 /manufacturing-quality/ remain planned future destinations; P017 does not implement their behavior or promise inquiry submission, prefill, receipt or document delivery. P005 owns document scope without original-file download promises. P013 owns generic black-masterbatch intent; P017 owns BK020 model/entity intent. P033 is not added. Full formulation ratios remain internal only.\n\n';
    const current = fs.readFileSync(specPath, 'utf8');
    // Replace only this canonical region; do not rewrite unrelated approval history.
    fs.writeFileSync(specPath, current.slice(0,start)+lines.join('\n\n')+notes+current.slice(end));
    await page.goto(base+'/wp-login.php');
    await page.locator('#user_login').fill(env.WP_ADMIN_USER);
    await page.locator('#user_pass').fill(env.WP_ADMIN_PASSWORD);
    await Promise.all([page.waitForURL(u=>u.pathname.startsWith('/wp-admin/')),page.locator('#wp-submit').click()]);
    // Load the existing native editor only for its serializer; do not save another record.
    await page.goto(base+'/wp-admin/post.php?post=67&action=edit');
    await page.waitForFunction(()=>window.wp?.blocks?.getBlockType('core/group')&&wp.blocks.getBlockType('core/table'));
    const content = await page.evaluate(({s,media}) => {
      const b=wp.blocks.createBlock;
      const g=(cls,kids,tagName='div')=>b('core/group',{className:cls,tagName},kids);
      const p=(content,className)=>b('core/paragraph',{content,className});
      const h=(content,level=2)=>b('core/heading',{content,level});
      const button=(text,url,style='primary')=>b('core/button',{text,url,className:'is-style-ge-'+style});
      const buttons=kids=>b('core/buttons',{className:'ge-actions'},kids);
      const ask=()=>button('Ask About BK020','/rfq/');
      const range=()=>button('Explore the Black Masterbatch Range','/products/black-masterbatch/','text');
      const section=(n,cls,kids)=>g('ge-module ge-p017-'+cls,[g('ge-container',kids)],'section');
      const fact=(x,cls)=>g(cls,[p(x.label,'ge-p017-label'),p(x.value,'ge-p017-value'),...(x.note?[p(x.note,'ge-p017-note')]:[])]);
      const modules=[
        section(1,'hero',[g('ge-p017-hero-grid',[
          g('ge-p017-hero-copy',[p(s.hero.eyebrow,'ge-p017-eyebrow'),h(s.hero.heading,1),p(s.hero.paragraphs[0],'ge-p017-lead'),p(s.hero.paragraphs[1]),buttons([ask()])]),
          g('ge-p017-hero-media',[b('core/image',{id:media.id,url:media.url,alt:s.hero.caption,caption:s.hero.caption,sizeSlug:'large',className:'ge-p017-photo'}),g('ge-p017-snapshot',[p(s.hero.snapshotLabel,'ge-p017-eyebrow'),g('ge-p017-snapshot-grid',s.hero.snapshot.map(x=>fact(x,'ge-p017-snapshot-fact')))])])])]),
        section(2,'specs',[h(s.specs.heading),p(s.specs.lead),g('ge-p017-spec-grid',s.specs.items.map(x=>fact(x,'ge-p017-spec'))),p(s.specs.detail,'ge-p017-minor')]),
        section(3,'uses',[h(s.uses.heading),p(s.uses.lead),g('ge-p017-use-grid',s.uses.items.map(x=>p(x))),p(s.uses.note)]),
        section(4,'composition',[h(s.composition.heading),p(s.composition.lead),p(s.composition.note,'ge-p017-minor')]),
        section(5,'compare',[h(s.compare.heading),p(s.compare.lead),b('core/table',{className:'ge-p017-compare-table',hasFixedLayout:false,head:[{cells:s.compare.head.map(content=>({content,tag:'th'}))}],body:s.compare.rows.map(row=>({cells:row.map((content,i)=>({content,tag:i===0?'th':'td'}))}))}),p(s.compare.note,'ge-p017-minor'),buttons([range()])]),
        section(6,'boundary',[g('ge-p017-boundary-grid',[h(s.boundary.heading),p(s.boundary.body)])]),
        section(7,'evidence',[g('ge-p017-evidence-grid',[g('',[h(s.evidence.heading),p(s.evidence.lead)]),g('ge-p017-evidence-links',s.evidence.links.flatMap(x=>[buttons([button(x.label,x.url,'text')]),p(x.note,'ge-p017-minor')]))])]),
        section(8,'contact',[g('ge-p017-contact-grid',[g('',[h(s.contact.heading),p(s.contact.lead),b('core/list',{className:'ge-p017-hints'},s.contact.items.map(content=>b('core/list-item',{content})))]),g('ge-p017-contact-action',[p(s.contact.product),buttons([ask(),button('Explore the Black Masterbatch Range','/products/black-masterbatch/','secondary')])])])])
      ];
      const content=wp.blocks.serialize([g('ge-p017',modules)]);
      const check=items=>items.forEach(x=>{if(!x.isValid)throw new Error('Invalid native block '+x.name);check(x.innerBlocks||[]);});
      check(wp.blocks.parse(content));
      return content;
    },{s,media});
    const payload={stable_id:'P017',slug:'bk020',route:'/products/bk020/',title:'BK020 Black Masterbatch',status:'publish',template:'page-templates/sectioned-page.php',home:base+'/',content,photo_id:media.id,parent_stable_id:'P002',source_hash:crypto.createHash('sha256').update(visual).digest('hex'),seo:{title:s.title,description:s.description}};
    fs.writeFileSync(path.join(root,'.local/p017-page.json'),JSON.stringify(payload,null,2));
    console.log('P017: eight valid native Core sections serialized; approved Full Copy synchronized.');
  } finally {await browser.close();}
})().catch(e=>{console.error(e.message);process.exitCode=1;});
