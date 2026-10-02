const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../..');
const source = JSON.parse(fs.readFileSync(path.join(root, '.local/p013-page.json'), 'utf8'));
if (source.stable_id !== 'P013' || source.slug !== 'black-masterbatch' ||
    source.route !== '/products/black-masterbatch/' ||
    source.home !== 'http://127.0.0.1:18086/' || source.status !== 'publish' ||
    source.template !== 'page-templates/sectioned-page.php' || source.contact_mode !== 'email') {
  throw new Error('Unexpected local P013 source identity.');
}
source.content = source.content.replaceAll('http://127.0.0.1:18086', 'https://152.70.109.64');
source.home = 'https://152.70.109.64/';
if (source.content.includes('127.0.0.1') || source.content.includes(':18086')) throw new Error('Local URL remains.');
fs.writeFileSync(path.join(root, '.local/p013-public.json'), JSON.stringify(source, null, 2));
console.log('Prepared scoped P013 public payload.');
