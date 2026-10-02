/* Serialize the approved P013 copy as editable WordPress Core blocks. */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
const deps = 'C:/Users/longe/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const {marked} = require(path.join(deps, 'marked'));
const {chromium} = require(path.join(deps, 'playwright'));
const source = fs.readFileSync(path.join(root, 'planning/pages/P013.md'), 'utf8');
const copy = source.split('### Buyer-visible page copy')[1]?.split('### End buyer-visible page copy')[0]?.trim();
if (!copy || !source.includes('Owner visual approval, 2026-10-02') ||
    !source.includes('Owner decision, 2026-10-02:')) throw new Error('Approved P013 source is missing.');
const seo = source.split('### SEO title and meta description')[1]?.split('### Buyer-visible page copy')[0] || '';
const seoTitle = seo.match(/\*\*Title:\*\* (.+)/)?.[1];
const seoDescription = seo.match(/\*\*Meta description:\*\* (.+)/)?.[1];
if (!seoTitle || !seoDescription) throw new Error('P013 search presentation is missing.');
const env = Object.fromEntries(fs.readFileSync(path.join(root, '.env'), 'utf8').split(/\r?\n/)
  .filter(line => line.includes('=')).map(line => [line.slice(0, line.indexOf('=')), line.slice(line.indexOf('=') + 1).replace(/^"|"$/g, '')]));
if (env.COMPOSE_PROJECT_NAME !== 'ge-masterbatch-local-20261002' || env.WP_PORT !== '18086') throw new Error('Wrong local site identity.');
const base = 'http://127.0.0.1:18086';
const contactMode = process.env.P013_CONTACT_MODE || 'omit';
if (!['email', 'omit', 'planned'].includes(contactMode)) throw new Error('Unknown contact mode.');
const contactUrl = contactMode === 'email' ? 'mailto:jenny@ge-masterbatch.com?subject=Black%20Masterbatch%20Requirements' :
  contactMode === 'planned' ? '/rfq' : null;
const sections = [[]];
for (const token of marked.lexer(copy)) {
  if (token.type === 'heading' && token.depth === 2) sections.push([]);
  if (token.type !== 'space') sections[sections.length - 1].push(token);
}
if (sections.length !== 6) throw new Error(`Expected six approved modules; got ${sections.length}.`);
const expected = ['Black Masterbatch Manufacturer in China','Why Evaluate GE Black Masterbatch?',
  'Black Masterbatch Model Range','Review Model Information','Need Help Selecting a Black Masterbatch?',
  'Discuss Your Black Masterbatch Requirements'];
sections.forEach((tokens, i) => {
  if (tokens[0]?.type !== 'heading' || tokens[0].text !== expected[i]) throw new Error('P013 module order changed: ' + i);
});
const models = ['BK020','BK025','BK030','BK035','BK040','PT-300','PT-450P'];
for (const model of models) if (!copy.includes(`**${model}** →`)) throw new Error('Model missing: ' + model);

function localize(tokens) {
  return tokens.map(t => {
    if (t.type !== 'paragraph') return t;
    let value = t.text;
    if (value.startsWith('For company background,')) value = 'For company background, see **About GE** → /about.';
    if (value.startsWith('**Need technical documents?**') && contactMode === 'email')
      value = '**Need technical documents?** [Contact GE](mailto:jenny@ge-masterbatch.com?subject=Black%20Masterbatch%20Documents) about information for the relevant model.';
    else if (value.startsWith('**Need technical documents?**')) return null;
    if (value.startsWith('Read **How to Choose Black Masterbatch**')) return null;
    value = value.replace(/\*\*([^*]+)\*\* → (\/[^\s.,)]+)/g, (_, label, route) =>
      route === '/about' || route === '/products/bk020' ? `[${label}](${route === '/products/bk020' ? route + '/' : route})` : `**${label}**`);
    return {...t, text:value};
  }).filter(Boolean);
}
const pageSections = sections.map(localize);

(async () => {
  const browser = await chromium.launch({headless:true});
  try {
    const page = await browser.newPage();
    await page.goto(base + '/wp-login.php', {waitUntil:'domcontentloaded'});
    await page.locator('#user_login').fill(env.WP_ADMIN_USER);
    await page.locator('#user_pass').fill(env.WP_ADMIN_PASSWORD);
    await Promise.all([
      page.waitForURL(url => url.pathname.startsWith('/wp-admin/'), {waitUntil:'domcontentloaded'}),
      page.locator('#wp-submit').click()
    ]);
    await page.goto(base + '/wp-admin/post-new.php?post_type=page', {waitUntil:'domcontentloaded'});
    await page.waitForFunction(() => window.wp?.blocks?.getBlockType('core/table') && window.wp?.blocks?.getBlockType('core/group'));
    const content = await page.evaluate(({s, contactUrl}) => {
      const b = wp.blocks.createBlock;
      const group = (cls, children, tagName='div', anchor) => b('core/group',
        {className:cls, tagName, ...(anchor ? {anchor} : {})}, children);
      const heading = t => b('core/heading', {level:t.depth, content:t.html});
      const para = t => b('core/paragraph', {content:t.html});
      const action = (label, url, style) => b('core/button',
        {text:label, url, className:'is-style-ge-' + style});
      const actions = () => group('ge-p013-action-wrap', [b('core/buttons', {className:'ge-actions'}, [
        ...(contactUrl ? [action('Discuss Your Requirements', contactUrl, 'primary')] : []),
        action('Explore Model Information', '#model-range', 'secondary')
      ])]);
      const table = (t, cls) => {
        const cells = row => row.map(cell => ({content:cell.html, tag:cell.header ? 'th' : 'td'}));
        return b('core/table', {className:cls, head:[{cells:cells(t.header)}],
          body:t.rows.map(row => ({cells:cells(row)})), hasFixedLayout:false});
      };
      const section = (n, children, anchor) => group('ge-module ge-p013-section ge-p013-m' + n,
        [group('ge-container', children)], 'section', anchor);
      const modules = [
        section(1, [group('ge-p013-hero-grid', [
          group('ge-p013-hero-copy', [heading(s[0][0]), para(s[0][1]), para(s[0][2]), actions()]),
          group('ge-p013-hero-art', [])])]),
        section(2, [group('ge-p013-section-grid', [
          group('ge-p013-section-heading', [heading(s[1][0])]),
          group('ge-p013-trust-points', s[1].slice(1).map(para))])]),
        section(3, [heading(s[2][0]), para(s[2][1]), heading(s[2][2]),
          table(s[2][3], 'ge-p013-model-table ge-p013-bk-table'),
          heading(s[2][4]), table(s[2][5], 'ge-p013-model-table ge-p013-pt-table'),
          para(s[2][6]), para(s[2][7])], 'model-range'),
        section(4, [group('ge-p013-section-grid', [
          group('ge-p013-section-heading', [heading(s[3][0])]),
          group('ge-p013-section-body', s[3].slice(1).map(para))])]),
        section(5, [group('ge-p013-section-grid', [
          group('ge-p013-section-heading', [heading(s[4][0])]),
          group('ge-p013-section-body', s[4].slice(1).map(para))])]),
        section(6, [group('ge-p013-section-grid', [
          group('ge-p013-section-heading', [heading(s[5][0])]),
          group('ge-p013-section-body', [para(s[5][1]), actions()])])])
      ];
      const content = wp.blocks.serialize([group('ge-p013', modules)]);
      const parsed = wp.blocks.parse(content);
      const invalid = [];
      const visit = items => items.forEach(block => {if (!block.isValid) invalid.push(block.name); visit(block.innerBlocks || []);});
      visit(parsed);
      if (invalid.length) throw new Error('Invalid Core blocks: ' + invalid.join(','));
      return content;
    }, {s:pageSections.map(tokens => tokens.map(t => ({type:t.type, depth:t.depth,
      html:t.type === 'heading' || t.type === 'paragraph' ? marked.parseInline(t.text) : undefined,
      header:t.type === 'table' ? t.header.map(cell => ({html:marked.parseInline(cell.text), header:true})) : undefined,
      rows:t.type === 'table' ? t.rows.map(row => row.map(cell => ({html:marked.parseInline(cell.text.includes('**BK020** → /products/bk020') ? cell.text.replace('**BK020** → /products/bk020','**[BK020](/products/bk020/)**') : cell.text.replace(/\s*→\s*\/[^\s]+/, '')), header:false}))) : undefined}))), contactUrl});
    const payload = {stable_id:'P013', slug:'black-masterbatch', route:'/products/black-masterbatch/',
      title:'Black Masterbatch', status:'publish', template:'page-templates/sectioned-page.php',
      home:base + '/', content, source_hash:crypto.createHash('sha256').update(copy).digest('hex'),
      seo:{title:seoTitle, description:seoDescription}, contact_mode:contactMode};
    fs.mkdirSync(path.join(root, '.local'), {recursive:true});
    fs.writeFileSync(path.join(root, '.local/p013-page.json'), JSON.stringify(payload, null, 2));
    console.log(JSON.stringify({page:'P013', modules:6, models:7, contactMode,
      serializer:'installed WordPress Core editor', payload:'.local/p013-page.json'}));
  } finally {await browser.close();}
})().catch(error => {console.error(error.message); process.exitCode = 1;});
