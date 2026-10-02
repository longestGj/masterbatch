const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '../..');
const source = JSON.parse(fs.readFileSync(path.join(root, '.local/p003-page.json'), 'utf8'));
const oldBase = 'http://127.0.0.1:18086';
const newBase = 'https://152.70.109.64';

if (source.stable_id !== 'P003' || source.slug !== 'about' ||
    source.home !== oldBase + '/' || source.status !== 'publish' ||
    source.template !== 'page-templates/sectioned-page.php' ||
    JSON.stringify(source.media) !== JSON.stringify([12, 13, 14])) {
  throw new Error('Unexpected local About source identity.');
}

const replacements = source.content.split(oldBase).length - 1;
if (replacements < 3) throw new Error('Expected local media URLs were not found.');
source.content = source.content.replaceAll(oldBase, newBase);
source.home = newBase + '/';
if (source.content.includes('127.0.0.1') || source.content.includes(':18086')) {
  throw new Error('Local URL remains in About content.');
}

const destination = path.join(root, '.local/p003-public.json');
fs.writeFileSync(destination, JSON.stringify(source, null, 2));
console.log(JSON.stringify({page: 'P003', url: newBase + '/about/', replacements, file: '.local/p003-public.json'}));
