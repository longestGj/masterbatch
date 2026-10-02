/* Build a local P003 payload with the installed WordPress Core block serializer. */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
const deps = 'C:/Users/longe/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const {marked} = require(path.join(deps, 'marked'));
const {chromium} = require(path.join(deps, 'playwright'));
const source = fs.readFileSync(path.join(root, 'planning/pages/P003.md'), 'utf8');
const copy = source.split('### Buyer-visible page copy')[1]?.split('### Action meanings and destination checks')[0]?.trim();
if (!copy || !source.includes('**Owner Full Copy decision — 2026-10-02:**') ||
    !source.includes('Owner visual decision — 2026-10-02')) throw new Error('Approved P003 source is missing.');
const groups = [[]];
for (const token of marked.lexer(copy)) {
  if (token.type === 'heading' && token.depth === 2) groups.push([]);
  if (token.type !== 'space') groups[groups.length - 1].push(token);
}
if (groups.length !== 8) throw new Error(`Expected eight About sections; got ${groups.length}.`);
const seoSection = source.split('### SEO title and meta description')[1]?.split('### Buyer-visible page copy')[0] || '';
const seoTitle = seoSection.match(/\*\*SEO title:\*\* (.+)/)?.[1];
const seoDescription = seoSection.match(/\*\*Meta description:\*\* (.+)/)?.[1];
if (!seoTitle || !seoDescription) throw new Error('P003 search presentation is missing.');
const media = JSON.parse(fs.readFileSync(path.join(root, '.local/p001-media.json'), 'utf8'));
for (const key of ['factory', 'granules', 'equipment']) {
  if (!Number.isInteger(media[key]?.id) || !media[key]?.url || !media[key]?.alt) throw new Error('Approved source media is unavailable: ' + key);
}
const env = Object.fromEntries(fs.readFileSync(path.join(root, '.env'), 'utf8').split(/\r?\n/)
  .filter(line => line.includes('=')).map(line => [line.slice(0, line.indexOf('=')), line.slice(line.indexOf('=') + 1).replace(/^"|"$/g, '')]));
if (env.COMPOSE_PROJECT_NAME !== 'ge-masterbatch-local-20261002' || env.WP_PORT !== '18086') throw new Error('Wrong local site identity.');
const base = 'http://127.0.0.1:18086';
const htmlGroups = groups.map(tokens => tokens.map(t => ({type:t.type, depth:t.depth,
  html:t.type === 'heading' || t.type === 'paragraph' ? marked.parseInline(t.text) : undefined,
  items:t.type === 'list' ? t.items.map(item => marked.parseInline(item.text)) : undefined})));

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
    await page.waitForFunction(() => window.wp?.blocks?.getBlockType('core/group') && window.wp?.blocks?.getBlockType('core/list-item'));
    const content = await page.evaluate(({g, media}) => {
      const b = wp.blocks.createBlock;
      const group = (cls, children, tagName='div') => b('core/group', {className:cls, tagName}, children);
      const heading = token => b('core/heading', {level:token.depth, content:token.html});
      const paragraph = token => b('core/paragraph', {content:token.html});
      const button = (token, style='ge-text') => {
        const wrapper = document.createElement('div'); wrapper.innerHTML = token.html;
        const anchor = wrapper.querySelector('a');
        if (!anchor || wrapper.textContent.trim() !== anchor.textContent.trim()) throw new Error('Expected one approved action link.');
        return b('core/button', {text:anchor.innerHTML, url:anchor.getAttribute('href'), className:'is-style-' + style});
      };
      const actions = (tokens, styles=[]) => b('core/buttons', {className:'ge-actions'}, tokens.map((token, i) => button(token, styles[i] || 'ge-text')));
      const image = (key, cls) => b('core/image', {id:media[key].id, url:media[key].url, alt:media[key].alt,
        sizeSlug:'full', linkDestination:'none', className:cls});
      const section = (n, children) => group('ge-module ge-about-section ge-about-m' + n,
        [group('ge-container', children)], 'section');
      const modules = [
        section(1, [group('ge-about-hero-grid', [
          group('ge-about-hero-copy', [heading(g[0][0]), paragraph(g[0][1]), paragraph(g[0][2])]),
          image('factory', 'ge-about-hero-photo')])]),
        section(2, [group('ge-about-product-grid', [
          group('ge-about-product-copy', [heading(g[1][0]), paragraph(g[1][1]), actions([g[1][2]])]),
          image('granules', 'ge-about-product-photo')])]),
        section(3, [group('ge-about-reader-grid', [
          group('ge-about-reader-heading', [heading(g[2][0])]),
          group('ge-about-reader-copy', [paragraph(g[2][1])])])]),
        section(4, [heading(g[3][0]), group('ge-about-facts', [paragraph(g[3][1]),
          b('core/list', {}, g[3][2].items.map(item => b('core/list-item', {content:item})))])]),
        section(5, [group('ge-about-trust-grid', [group('ge-about-trust-copy', [heading(g[4][0]), paragraph(g[4][1])])])]),
        section(6, [group('ge-about-manufacturing-grid', [image('equipment', 'ge-about-equipment-photo'),
          group('ge-about-manufacturing-copy', [heading(g[5][0]), paragraph(g[5][1]), actions([g[5][2]])])])]),
        section(7, [group('ge-about-documents-grid', [group('ge-about-documents-copy', [heading(g[6][0]),
          paragraph(g[6][1]), actions([g[6][2]])])])]),
        section(8, [group('ge-about-next-grid', [group('ge-about-next-copy', [heading(g[7][0]),
          paragraph(g[7][1]), actions(g[7].slice(2), ['ge-primary', 'ge-secondary'])])])])
      ];
      const content = wp.blocks.serialize([group('ge-about', modules)]);
      const parsed = wp.blocks.parse(content);
      const invalid = [];
      const visit = items => items.forEach(block => {if (!block.isValid) invalid.push(block.name); visit(block.innerBlocks || []);});
      visit(parsed);
      if (invalid.length) throw new Error('Invalid Core blocks: ' + invalid.join(','));
      return content;
    }, {g:htmlGroups, media});
    const payload = {stable_id:'P003', slug:'about', title:'About GE', status:'publish',
      template:'page-templates/sectioned-page.php', home:base + '/', content,
      source_hash:crypto.createHash('sha256').update(copy).digest('hex'),
      seo:{title:seoTitle, description:seoDescription},
      media:['factory','granules','equipment'].map(key => media[key].id)};
    fs.writeFileSync(path.join(root, '.local/p003-page.json'), JSON.stringify(payload, null, 2));
    console.log(JSON.stringify({page:'P003', sections:8, media:payload.media.length,
      serializer:'installed WordPress Core editor', payload:'.local/p003-page.json'}));
  } finally {await browser.close();}
})().catch(() => {console.error('Native About generation failed; inspect the local editor without exposing credentials.'); process.exitCode = 1;});
