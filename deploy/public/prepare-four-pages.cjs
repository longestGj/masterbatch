const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../..');
const sources = [
  ['P005', '.local/p005-page.json', 'documents', '/documents/', 'http://127.0.0.1:18086/'],
  ['P017', '.local/p017-page.json', 'bk020', '/products/bk020/', 'http://127.0.0.1:18086/'],
  ['P006', '.worktrees/p006-github/.local/p006-page.json', 'rfq', '/rfq/', null],
  ['P011', '.worktrees/p006-github/.local/p011-page.json', 'privacy', '/privacy/', null],
];
for (const [id, file, slug, route, localHome] of sources) {
  const source = JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
  if (source.stable_id !== id || source.slug !== slug || source.status !== 'publish' ||
      (localHome && (source.home !== localHome || source.route !== route))) {
    throw new Error(`Unexpected ${id} local source identity.`);
  }
  if (id === 'P017' && (source.parent_stable_id !== 'P002' || source.photo_id !== 13)) throw new Error('P017 parent or media changed.');
  if ((id === 'P006' || id === 'P011') && (source.home || source.route || source.template)) throw new Error(`${id} source shape changed.`);
  if (localHome) source.content = source.content.replaceAll(localHome.slice(0,-1), 'https://152.70.109.64');
  source.home = 'https://152.70.109.64/';
  source.route = route;
  if (source.content.includes('127.0.0.1') || source.content.includes(':18086') || source.content.includes(':18087')) throw new Error(`Local URL remains in ${id}.`);
  fs.writeFileSync(path.join(root, `.local/${id.toLowerCase()}-public.json`), JSON.stringify(source, null, 2));
  console.log(`Prepared ${id} public payload.`);
}
