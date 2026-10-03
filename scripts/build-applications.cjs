/* Prepare approved P008 content as editable Core blocks using the installed editor. */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const {execFileSync} = require('node:child_process');
const root = path.resolve(__dirname, '..');
const deps = 'C:/Users/longe/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const {marked} = require(path.join(deps, 'marked'));
const {chromium} = require(path.join(deps, 'playwright'));
const source = fs.readFileSync(path.join(root, 'planning/pages/P008.md'), 'utf8');
if (!source.includes('“同意，审查通过，进入Wordpress实现。”')) throw Error('Missing P008 implementation approval.');
const full = source.split('## Gate 2 Pass 2 — Full Copy candidate')[1];
const buyer = full?.split('### Begin buyer-visible Full Copy')[1]?.split('### End buyer-visible Full Copy')[0].trim();
const seoTitle = full?.match(/- SEO title: \*\*(.*?)\*\*/)?.[1];
const seoDescription = full?.match(/- Meta description: \*\*(.*?)\*\*/)?.[1];
if (!buyer || !seoTitle || !seoDescription) throw Error('Missing approved P008 copy/SEO.');
const groups = [[]];
for (const token of marked.lexer(buyer)) {
  if (token.type === 'space') continue;
  if (token.type === 'heading' && token.depth === 2) groups.push([]);
  groups.at(-1).push(token);
}
const expected = ['Masterbatch Application Information', 'Find Your Application Topic', 'Continue Your Evaluation', 'Discuss Your Application Requirements'];
if (groups.length !== 4 || groups.some((group, index) => group[0]?.text !== expected[index])) throw Error('P008 section order changed.');
const subdivide = tokens => {
  const parts = [[]];
  for (const token of tokens) {
    if (token.type === 'heading' && token.depth === 3) parts.push([]);
    parts.at(-1).push(token);
  }
  return parts;
};
const topics = subdivide(groups[1]);
const paths = subdivide(groups[2]);
if (topics.length !== 5 || paths.length !== 4) throw Error('P008 topic/path count changed.');
if (topics.slice(1).some(group => group.length !== 2 || group[1].type !== 'paragraph') ||
    groups[0].length !== 2 || groups[3].length !== 3) throw Error('P008 content shape changed; review the mapping.');
const bodyLinks = groups.flat().flatMap(token => (token.tokens || []).filter(t => t.type === 'link'));
if (bodyLinks.length !== 4 || bodyLinks.filter(link => link.href === '/rfq/').length !== 1) throw Error('P008 action responsibility changed.');
const prepare = token => ({type: token.type, depth: token.depth, html: marked.parseInline(token.text || ''),
  ...(token.tokens?.length === 1 && token.tokens[0].type === 'link' ? {action: {label: token.tokens[0].text, href: token.tokens[0].href}} : {})});
const data = {hero: groups[0].map(prepare), topicIntro: topics[0].map(prepare),
  topics: topics.slice(1).map(group => group.map(prepare)), evaluationIntro: paths[0].map(prepare),
  paths: paths.slice(1).map(group => group.map(prepare)), closing: groups[3].map(prepare)};
const env = Object.fromEntries(fs.readFileSync(path.join(root, '.env'), 'utf8').split(/\r?\n/)
  .filter(line => line.includes('=')).map(line => [line.slice(0, line.indexOf('=')), line.slice(line.indexOf('=') + 1).replace(/^"|"$/g, '')]));
if (env.COMPOSE_PROJECT_NAME !== 'ge-masterbatch-local-20261002' || env.WP_PORT !== '18086') throw Error('Wrong P008 local target.');
async function build() {
  const browser = await chromium.launch({headless: true});
  try {
    const page = await browser.newPage();
    const bootstrap = JSON.parse(execFileSync('docker', ['compose', 'run', '--rm', 'cli', 'eval-file',
      '/workspace/scripts/block-serializer-bootstrap.php'], {cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit']}));
    // A transient document loads installed Core scripts without opening any Page editor or acquiring an edit lock.
    await page.goto('http://127.0.0.1:18086/');
    await page.setContent(bootstrap.html);
    await page.waitForFunction(() => typeof window.wp?.blockLibrary?.registerCoreBlocks === 'function');
    await page.evaluate(() => wp.blockLibrary.registerCoreBlocks());
    await page.waitForFunction(() => window.wp?.blocks?.getBlockType('core/group') && window.wp?.blocks?.getBlockType('core/button'));
    const content = await page.evaluate(data => {
      const b = wp.blocks.createBlock;
      const group = (className, children, tagName = 'div') => b('core/group', {className, tagName}, children);
      const convert = tokens => tokens.map(token => {
        if (token.type === 'heading') return b('core/heading', {content: token.html, level: token.depth});
        if (token.action) return b('core/buttons', {className: 'ge-actions'}, [b('core/button', {
          text: token.action.label, url: token.action.href, className: 'is-style-ge-' +
            (token.action.href === '/rfq/' ? 'primary' : token.action.href === '/products/' ? 'secondary' : 'text')})]);
        if (token.type === 'paragraph') return b('core/paragraph', {content: token.html});
        throw Error('Unsupported P008 token: ' + token.type);
      });
      const names = ['film', 'injection', 'extrusion', 'recycle'];
      const section = (n, children) => group('ge-module ge-p008-section ge-p008-m' + n, [group('ge-container', children)], 'section');
      const art = group('ge-p008-topic-art', [group('ge-p008-art-cross', []), ...names.map(name => group('ge-p008-art-node ge-p008-' + name, []))]);
      const rows = data.topics.map((tokens, index) => group('ge-p008-topic-row', [
        group('ge-p008-topic-symbol ge-p008-' + names[index], []),
        group('ge-p008-topic-name', convert(tokens.slice(0, 1))),
        group('ge-p008-topic-description', convert(tokens.slice(1)))], 'article'));
      const paths = data.paths.map((tokens, index) => group('ge-p008-evaluation-path ge-p008-path-' + index, convert(tokens), 'article'));
      const sections = [
        section(1, [group('ge-p008-hero-grid', [group('ge-p008-hero-copy', convert(data.hero)), art])]),
        section(2, [group('ge-p008-section-intro', convert(data.topicIntro)), group('ge-p008-topic-list', rows)]),
        section(3, [group('ge-p008-section-intro', convert(data.evaluationIntro)), group('ge-p008-evaluation-grid', paths)]),
        section(4, [group('ge-p008-section-grid', [group('ge-p008-section-heading', convert(data.closing.slice(0, 1))),
          group('ge-p008-section-body', convert(data.closing.slice(1)))])])
      ];
      const saved = wp.blocks.serialize([group('ge-p008', sections)]);
      const invalid = [];
      const visit = blocks => blocks.forEach(block => {if (!block.isValid) invalid.push(block.name); visit(block.innerBlocks || []);});
      visit(wp.blocks.parse(saved));
      if (invalid.length) throw Error('Invalid Core blocks: ' + invalid.join(','));
      return saved;
    }, data);
    const payload = {stable_id: 'P008', slug: 'applications', route: '/applications/', title: expected[0],
      status: 'publish', template: 'page-templates/sectioned-page.php', home: 'http://127.0.0.1:18086/', content,
      source_hash: crypto.createHash('sha256').update(buyer).digest('hex'), seo: {title: seoTitle, description: seoDescription}};
    fs.mkdirSync(path.join(root, '.local'), {recursive: true});
    fs.writeFileSync(path.join(root, '.local/p008-page.json'), JSON.stringify(payload, null, 2));
    console.log(JSON.stringify({page: 'P008', sections: 4, topics: 4, actions: 4, serializer: 'installed WordPress Core editor', payload: '.local/p008-page.json'}));
  } finally {await browser.close();}
}
build().catch(error => {console.error(error.message); process.exitCode = 1;});
