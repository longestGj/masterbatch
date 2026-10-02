/* Serialize the owner-approved P005 Full Copy as editable WordPress Core blocks. */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
const deps = 'C:/Users/longe/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const {marked} = require(path.join(deps, 'marked'));
const {chromium} = require(path.join(deps, 'playwright'));

const source = fs.readFileSync(path.join(root, 'planning/pages/P005.md'), 'utf8');
if (!source.includes('Owner decision, 2026-10-03: “同意，审核通过。执行下一步”'))
  throw new Error('P005 Full Copy approval is missing.');
const full = source.split('## Gate 2 Pass 2 — Full Copy candidate')[1]?.split('### Link and state notes')[0] || '';
const buyer = full.split('### Hero')[1]?.trim();
const seoTitle = full.match(/\*\*SEO title:\*\* (.+)/)?.[1];
const seoDescription = full.match(/\*\*Meta description:\*\* (.+)/)?.[1];
if (!buyer || !seoTitle || !seoDescription) throw new Error('P005 source copy or SEO is missing.');
const expected = ['Masterbatch Technical Documents', 'Choose the Document for Your Review',
  'Technical Data Sheets by Model', 'Safety Information and Specific Test Records',
  'Tell GE What You Need to Review'];
const groups = [[]];
for (const token of marked.lexer(buyer)) {
  if (token.type === 'heading' && token.depth === 3) groups.push([]);
  if (token.type !== 'space') groups.at(-1).push(token);
}
if (groups.length !== 5 || groups.some((group, i) => group[0]?.text !== expected[i]))
  throw new Error('P005 approved section order changed.');
const [hero, guide, tds, safety, closing] = groups;
if (hero.length !== 3 || guide.length !== 3 || tds.length !== 5 || safety.length !== 3 || closing.length !== 3 ||
    guide[1].type !== 'table' || guide[1].rows.length !== 3 || tds[2].type !== 'list' || tds[2].items.length !== 7)
  throw new Error('P005 approved content shape changed; review the mapping.');
const models = tds[2].items.map(item => item.text);
if (models.join('|') !== 'BK020|BK025|BK030|BK035|BK040|PT-300|PT-450P')
  throw new Error('P005 black-model identity changed.');
const email = 'mailto:jenny@ge-masterbatch.com?subject=Product%20document%20question';
if (!hero[2].text.includes(email) || !closing[2].text.includes(email))
  throw new Error('P005 approved email action changed.');
const noteStart = hero[2].text.indexOf('This opens an email draft');
if (noteStart < 0) throw new Error('P005 email explanation changed.');
const env = Object.fromEntries(fs.readFileSync(path.join(root, '.env'), 'utf8').split(/\r?\n/)
  .filter(line => line.includes('=')).map(line => [line.slice(0, line.indexOf('=')),
    line.slice(line.indexOf('=') + 1).replace(/^"|"$/g, '')]));
if (env.COMPOSE_PROJECT_NAME !== 'ge-masterbatch-local-20261002' || env.WP_PORT !== '18086')
  throw new Error('Wrong local site identity.');

const prepared = {
  heading: hero[0].text,
  hero: marked.parseInline(hero[1].text),
  emailNote: marked.parseInline(hero[2].text.slice(noteStart)),
  guide: guide[1].rows.map((row, i) => ({number: String(i + 1).padStart(2, '0'),
    question: marked.parseInline(row[0].text), kind: marked.parseInline(row[1].text),
    answer: marked.parseInline(row[2].text)})),
  coa: marked.parseInline(guide[2].text),
  tdsIntro: marked.parseInline(tds[1].text),
  models,
  tdsBody: marked.parseInline(tds[3].text),
  blackLink: '<a href="/products/black-masterbatch/">Explore Black Masterbatch</a>',
  sds: marked.parseInline(safety[1].text),
  reports: marked.parseInline(safety[2].text),
  closing: marked.parseInline(closing[1].text),
};
if (!prepared.emailNote.startsWith('This opens an email draft') || prepared.emailNote.includes('`'))
  throw new Error('P005 email note did not parse as expected.');

(async () => {
  const browser = await chromium.launch({headless:true});
  try {
    const page = await browser.newPage();
    await page.goto('http://127.0.0.1:18086/wp-login.php', {waitUntil:'domcontentloaded'});
    await page.locator('#user_login').fill(env.WP_ADMIN_USER);
    await page.locator('#user_pass').fill(env.WP_ADMIN_PASSWORD);
    await Promise.all([
      page.waitForURL(url => url.pathname.startsWith('/wp-admin/'), {waitUntil:'domcontentloaded'}),
      page.locator('#wp-submit').click(),
    ]);
    // The installed editor is the source of truth for Core block serialization.
    await page.goto('http://127.0.0.1:18086/wp-admin/post.php?post=64&action=edit', {waitUntil:'domcontentloaded'});
    await page.waitForFunction(() => window.wp?.blocks?.getBlockType('core/list-item') && window.wp?.blocks?.getBlockType('core/group'));
    const content = await page.evaluate((data) => {
      const b = wp.blocks.createBlock;
      const group = (cls, children, tagName='div') => b('core/group', {className:cls, tagName}, children);
      const para = (html, cls) => b('core/paragraph', {content:html, ...(cls ? {className:cls} : {})});
      const heading = (html, level) => b('core/heading', {content:html, level});
      const section = (n, children) => group('ge-module ge-p005-section ge-p005-m' + n,
        [group('ge-container', children)], 'section');
      const action = label => b('core/buttons', {className:'ge-actions'}, [
        b('core/button', {text:label, url:data.email, className:'is-style-ge-primary'})]);
      const cards = data.guide.map(row => group('ge-p005-decision-card', [
        para(row.number, 'ge-p005-number'), heading(row.question, 3),
        para(row.kind, 'ge-p005-kind'), para(row.answer, 'ge-p005-answer')], 'article'));
      const modules = [
        section(1, [group('ge-p005-hero-grid', [
          group('ge-p005-hero-copy', [heading(data.heading, 1), para(data.hero),
            action('Ask GE About a Document'), para(data.emailNote, 'ge-p005-email-note')]),
          group('ge-p005-document-art', [])])]),
        section(2, [group('ge-p005-section-grid', [
          group('ge-p005-section-heading', [heading('Choose the Document for Your Review', 2)]),
          group('ge-p005-decision-list', cards)]), para(data.coa, 'ge-p005-coa-note')]),
        section(3, [group('ge-p005-section-grid', [
          group('ge-p005-section-heading', [heading('Technical Data Sheets by Model', 2), para(data.tdsIntro)]),
          group('ge-p005-section-body', [
            b('core/list', {className:'ge-p005-model-list'},
              data.models.map(model => b('core/list-item', {content:model}))),
            para(data.tdsBody), para('For the black product range, ' + data.blackLink + '.', 'ge-p005-black-link')])])]),
        section(4, [group('ge-p005-section-grid', [
          group('ge-p005-section-heading', [heading('Safety Information and Specific Test Records', 2)]),
          group('ge-p005-section-body', [para(data.sds), para(data.reports)])])]),
        section(5, [group('ge-p005-section-grid', [
          group('ge-p005-section-heading', [heading('Tell GE What You Need to Review', 2)]),
          group('ge-p005-section-body', [para(data.closing), action('Email GE About Documents')])])]),
      ];
      const serialized = wp.blocks.serialize([group('ge-p005', modules)]);
      const invalid = [];
      const visit = blocks => blocks.forEach(block => {
        if (!block.isValid) invalid.push(block.name);
        visit(block.innerBlocks || []);
      });
      visit(wp.blocks.parse(serialized));
      if (invalid.length) throw new Error('Invalid Core blocks: ' + invalid.join(','));
      return serialized;
    }, {...prepared, email});
    const payload = {stable_id:'P005', slug:'documents', route:'/documents/',
      title:'Masterbatch Technical Documents', status:'publish',
      template:'page-templates/sectioned-page.php', home:'http://127.0.0.1:18086/',
      content, source_hash:crypto.createHash('sha256').update(buyer).digest('hex'),
      seo:{title:seoTitle, description:seoDescription}};
    fs.mkdirSync(path.join(root, '.local'), {recursive:true});
    fs.writeFileSync(path.join(root, '.local/p005-page.json'), JSON.stringify(payload, null, 2));
    console.log(JSON.stringify({page:'P005', modules:5, models:7,
      serializer:'installed WordPress Core editor', payload:'.local/p005-page.json'}));
  } finally { await browser.close(); }
})().catch(error => { console.error(error.message); process.exitCode = 1; });
