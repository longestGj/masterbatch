const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../..');
const source = JSON.parse(fs.readFileSync(path.join(root, '.local/p002-page.json'), 'utf8'));
const oldBase = 'http://127.0.0.1:18086';
const newBase = 'https://152.70.109.64';
if (source.stable_id !== 'P002' || source.slug !== 'products' ||
    source.route !== '/products/' || source.home !== oldBase + '/' ||
    source.status !== 'publish' || source.photo_id !== 13 ||
    source.template !== 'page-templates/sectioned-page.php') {
  throw new Error('Unexpected local P002 source identity.');
}
if (!source.content.includes(oldBase + '/wp-content/uploads/')) throw new Error('P002 local image URL missing.');
source.content = source.content.replaceAll(oldBase, newBase);
source.home = newBase + '/';
if (source.content.includes('127.0.0.1') || source.content.includes(':18086')) throw new Error('Local URL remains.');
fs.writeFileSync(path.join(root, '.local/p002-public.json'), JSON.stringify(source, null, 2));
console.log('Prepared scoped P002 public payload.');
