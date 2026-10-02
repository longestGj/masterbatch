/* Focused saved-data, HTTP and responsive checks for the local P003 Core Page. */
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const deps = 'C:/Users/longe/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const {chromium} = require(path.join(deps, 'playwright'));
const {marked} = require(path.join(deps, 'marked'));
const env = Object.fromEntries(fs.readFileSync(path.join(root, '.env'), 'utf8').split(/\r?\n/)
  .filter(line => line.includes('=')).map(line => [line.slice(0, line.indexOf('=')), line.slice(line.indexOf('=') + 1).replace(/^"|"$/g, '')]));
if (env.COMPOSE_PROJECT_NAME !== 'ge-masterbatch-local-20261002' || env.WP_PORT !== '18086') throw new Error('Wrong local target.');
const base = 'http://127.0.0.1:18086';
const spec = fs.readFileSync(path.join(root, 'planning/pages/P003.md'), 'utf8');
const copy = spec.split('### Buyer-visible page copy')[1].split('### Action meanings and destination checks')[0].trim();
const reference = marked.parse(copy);
const payload = JSON.parse(fs.readFileSync(path.join(root, '.local/p003-page.json'), 'utf8'));
const output = path.join(root, '.local/runtime'); fs.mkdirSync(output, {recursive:true});
const assert = (condition, message) => {if (!condition) throw new Error(message);};

(async () => {
  const browser = await chromium.launch({headless:true});
  try {
    const page = await browser.newPage();
    const failures = [];
    page.on('pageerror', error => failures.push('script: ' + error.message));
    page.on('response', response => {
      if (response.url().startsWith(base) && response.status() >= 400) failures.push(response.status() + ' ' + new URL(response.url()).pathname);
    });
    for (const width of [1440, 768, 390]) {
      await page.setViewportSize({width, height:1000});
      const response = await page.goto(base + '/about/', {waitUntil:'networkidle'});
      assert(response?.status() === 200, 'About HTTP failed');
      assert(response.headers()['x-robots-tag']?.includes('noindex'), 'Local noindex header missing');
      await page.evaluate(async () => {for (const image of document.images) await image.decode();});
      const actual = await page.evaluate(html => {
        const expected = document.createElement('div'); expected.innerHTML = html;
        const main = document.querySelector('main');
        const links = el => [...el.querySelectorAll('a')].map(a => [a.textContent.trim(), a.getAttribute('href')]);
        return {
          width:innerWidth, scrollWidth:document.documentElement.scrollWidth,
          sections:main.querySelectorAll('.ge-about-section').length, h1:main.querySelectorAll('h1').length,
          h2:main.querySelectorAll('h2').length, images:main.querySelectorAll('img').length,
          brokenImages:[...document.images].filter(image => !image.naturalWidth).length,
          textMatch:main.textContent.replace(/\s/g, '') === expected.textContent.replace(/\s/g, ''),
          links:links(main), expectedLinks:links(expected),
          title:document.title, description:document.querySelector('meta[name="description"]')?.content,
          canonical:document.querySelector('link[rel="canonical"]')?.href,
          shortActions:[...document.querySelectorAll('.wp-block-button__link')]
            .filter(a => a.checkVisibility() && a.getBoundingClientRect().height < 48).length
        };
      }, reference);
      assert(actual.scrollWidth === width, 'Horizontal overflow at ' + width);
      assert(actual.sections === 8 && actual.h1 === 1 && actual.h2 === 7, 'About structure differs at ' + width);
      assert(actual.textMatch && JSON.stringify(actual.links) === JSON.stringify(actual.expectedLinks), 'Approved copy or actions differ at ' + width);
      assert(actual.images === 3 && actual.brokenImages === 0, 'About media failed at ' + width);
      assert(actual.title === payload.seo.title && actual.description === payload.seo.description, 'Search presentation differs');
      assert(actual.canonical === base + '/about/' && actual.shortActions === 0, 'Canonical or action geometry differs');
      await page.screenshot({path:path.join(output, `about-${width}.png`), fullPage:true});
      console.log(JSON.stringify({width, sections:actual.sections, h1:actual.h1, h2:actual.h2,
        bodyActions:actual.links.length, images:actual.images, overflow:false, copyMatch:true}));
    }
    for (const width of [320, 600, 601, 760, 761, 1100, 1101]) {
      await page.setViewportSize({width, height:1000});
      assert(await page.evaluate(() => document.documentElement.scrollWidth === innerWidth), 'Breakpoint overflow at ' + width);
    }
    await page.setViewportSize({width:390, height:1000}); await page.goto(base + '/about/', {waitUntil:'networkidle'});
    await page.locator('.ge-mobile-menu summary').click();
    assert(await page.locator('.ge-mobile-menu').getAttribute('open') !== null, 'Phone menu did not open');
    assert(await page.evaluate(() => document.documentElement.scrollWidth === innerWidth), 'Open menu overflow');
    await page.locator('.ge-mobile-menu summary').click();
    await page.goto(base + '/about/', {waitUntil:'networkidle'});
    await page.keyboard.press('Tab'); await page.keyboard.press('Enter');
    assert(await page.evaluate(() => document.activeElement.id === 'main-content'), 'Skip link failed');
    await page.locator('.ge-about-m8 .wp-block-button__link').first().focus();
    assert(await page.evaluate(() => document.activeElement.matches(':focus-visible') &&
      getComputedStyle(document.activeElement).outlineWidth === '3px'), 'Action focus failed');
    assert(failures.length === 0, 'Frontend failures: ' + failures.join(', '));
    const routes = [];
    for (const [, route] of await page.evaluate(() => [...document.querySelectorAll('main a')].map(a => [a.textContent.trim(), a.getAttribute('href')]))) {
      routes.push({path:route, status:(await page.request.get(base + route)).status()});
    }
    console.log(JSON.stringify({menu:'passed', skipLink:'passed', focus:'passed', frontendErrors:0, routes}));

    const editor = await browser.newPage();
    await editor.goto(base + '/wp-login.php', {waitUntil:'domcontentloaded'});
    await editor.locator('#user_login').fill(env.WP_ADMIN_USER);
    await editor.locator('#user_pass').fill(env.WP_ADMIN_PASSWORD);
    await Promise.all([
      editor.waitForURL(url => url.pathname.startsWith('/wp-admin/'), {waitUntil:'domcontentloaded'}),
      editor.locator('#wp-submit').click()
    ]);
    const publicRest = await editor.request.get(base + '/wp-json/wp/v2/pages?slug=about');
    assert(publicRest.ok(), 'Public page identity read failed');
    const records = await publicRest.json();
    assert(records.length === 1, 'Expected one saved About page');
    const id = records[0].id;
    await editor.goto(base + '/wp-admin/post.php?post=' + id + '&action=edit', {waitUntil:'domcontentloaded'});
    await editor.waitForFunction(() => window.wp?.data?.select('core/block-editor')?.getBlocks()?.length > 0);
    const saved = await editor.evaluate(id => wp.apiFetch({path:'/wp/v2/pages/' + id + '?context=edit'}), id);
    assert(saved.id === id && saved.status === 'publish' && saved.template === payload.template, 'Saved Core Page identity/template differs');
    assert(saved.content.raw === payload.content, 'Saved Core blocks differ from generated source');
    assert(saved.meta._ge_seo_title === payload.seo.title &&
      saved.meta._ge_seo_description === payload.seo.description, 'Saved SEO values differ');
    const blocks = await editor.evaluate(() => {
      const all = [];
      const visit = items => items.forEach(block => {all.push(block); visit(block.innerBlocks || []);});
      visit(wp.data.select('core/block-editor').getBlocks());
      return {count:all.length, invalid:all.filter(block => !block.isValid).length,
        customHTML:all.filter(block => block.name === 'core/html').length};
    });
    assert(blocks.count > 30 && blocks.invalid === 0 && blocks.customHTML === 0, 'Native editor blocks failed');
    console.log(JSON.stringify({savedPageId:saved.id, status:saved.status, template:saved.template,
      savedContentMatch:true, savedSeoMatch:true, editor:blocks}));
  } finally {await browser.close();}
})().catch(error => {console.error(error.message); process.exitCode = 1;});
