/* Focused runtime review for the local P013 Core Page. */
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const deps = 'C:/Users/longe/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const {chromium} = require(path.join(deps, 'playwright'));
const env = Object.fromEntries(fs.readFileSync(path.join(root, '.env'), 'utf8').split(/\r?\n/)
  .filter(line => line.includes('=')).map(line => [line.slice(0, line.indexOf('=')), line.slice(line.indexOf('=') + 1).replace(/^"|"$/g, '')]));
if (env.COMPOSE_PROJECT_NAME !== 'ge-masterbatch-local-20261002' || env.WP_PORT !== '18086') throw new Error('Wrong local target.');
const base = 'http://127.0.0.1:18086';
const route = '/products/black-masterbatch/';
const payload = JSON.parse(fs.readFileSync(path.join(root, '.local/p013-page.json'), 'utf8'));
const output = path.join(root, '.local/runtime'); fs.mkdirSync(output, {recursive:true});
const assert = (ok, message) => {if (!ok) throw new Error(message);};

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
      const response = await page.goto(base + route, {waitUntil:'networkidle'});
      assert(response?.status() === 200 && page.url() === base + route, 'P013 URL failed');
      const actual = await page.evaluate(() => {
        const main = document.querySelector('main');
        const rows = [...main.querySelectorAll('.ge-p013-model-table tbody tr')]
          .map(row => [...row.cells].map(cell => cell.textContent.replace(/\s+/g, ' ').trim()).join(' '));
        return {width:innerWidth, scrollWidth:document.documentElement.scrollWidth,
          modules:main.querySelectorAll('.ge-p013-section').length, h1:main.querySelectorAll('h1').length,
          h2:main.querySelectorAll('h2').length, rows,
          title:document.title, description:document.querySelector('meta[name="description"]')?.content,
          canonical:document.querySelector('link[rel="canonical"]')?.href,
          mainLinks:[...main.querySelectorAll('a')].map(a => ({label:a.textContent.trim(), href:a.getAttribute('href')})),
          shortActions:[...main.querySelectorAll('.wp-block-button__link')]
            .filter(a => a.getBoundingClientRect().height < 48).length,
          css:!![...document.styleSheets].find(s => s.href?.includes('black-masterbatch.css'))};
      });
      assert(actual.scrollWidth === width, 'Horizontal overflow at ' + width);
      assert(actual.modules === 6 && actual.h1 === 1 && actual.h2 === 5, 'P013 modules/headings differ');
      assert(actual.rows.length === 7 && actual.rows[0].includes('BK020 20% LLDPE + LDPE 47.8%') &&
        actual.rows[4].includes('BK040 40% LLDPE + LDPE 5.8%') &&
        actual.rows[5].includes('PT-300 25% LLDPE + LDPE 41.8% CaCO₃') &&
        actual.rows[6].includes('PT-450P 42% P-type Virgin LLDPE Without filler'), 'Model facts differ: ' + JSON.stringify(actual.rows));
      assert(actual.title === payload.seo.title && actual.description === payload.seo.description,
        'Search presentation differs');
      assert(actual.canonical === base + route, 'Canonical route differs');
      assert(actual.css && actual.shortActions === 0, 'Stylesheet or action geometry differs');
      assert(actual.mainLinks.filter(x => x.href === '#model-range').length === 2 &&
        actual.mainLinks.filter(x => x.href.startsWith('mailto:jenny@ge-masterbatch.com')).length === 3 &&
        actual.mainLinks.some(x => x.href === '/about') &&
        actual.mainLinks.every(x => x.href === '/about' || x.href === '#model-range' || x.href.startsWith('mailto:')),
        'P013 body has missing or inactive destinations');
      assert(response.headers()['x-robots-tag']?.includes('noindex'), 'Local noindex header missing');
      await page.screenshot({path:path.join(output, `black-masterbatch-${width}.png`), fullPage:true});
      console.log(JSON.stringify({width, modules:actual.modules, models:actual.rows.length,
        bodyLinks:actual.mainLinks.length, overflow:false, seo:true}));
    }
    for (const width of [320, 600, 601, 760, 761, 1000, 1001]) {
      await page.setViewportSize({width, height:1000});
      assert(await page.evaluate(() => document.documentElement.scrollWidth === innerWidth), 'Breakpoint overflow at ' + width);
    }
    await page.setViewportSize({width:390, height:1000});
    await page.goto(base + route, {waitUntil:'networkidle'});
    await page.locator('.ge-mobile-menu summary').click();
    assert(await page.locator('.ge-mobile-menu').getAttribute('open') !== null, 'Phone menu did not open');
    assert(await page.evaluate(() => document.documentElement.scrollWidth === innerWidth), 'Open menu overflow');
    await page.locator('.ge-mobile-menu summary').click();
    await page.goto(base + route, {waitUntil:'networkidle'});
    await page.keyboard.press('Tab'); await page.keyboard.press('Enter');
    assert(await page.evaluate(() => document.activeElement.id === 'main-content'), 'Skip link failed');
    await page.locator('.ge-p013-m6 .wp-block-button__link').first().focus();
    assert(await page.evaluate(() => document.activeElement.matches(':focus-visible') &&
      getComputedStyle(document.activeElement).outlineWidth === '3px'), 'Action focus failed');
    assert(failures.length === 0, 'Frontend failures: ' + failures.join(', '));

    const editor = await browser.newPage();
    await editor.goto(base + '/wp-login.php', {waitUntil:'domcontentloaded'});
    await editor.locator('#user_login').fill(env.WP_ADMIN_USER);
    await editor.locator('#user_pass').fill(env.WP_ADMIN_PASSWORD);
    await Promise.all([
      editor.waitForURL(url => url.pathname.startsWith('/wp-admin/'), {waitUntil:'domcontentloaded'}),
      editor.locator('#wp-submit').click()
    ]);
    const records = await (await editor.request.get(base + '/wp-json/wp/v2/pages?slug=black-masterbatch')).json();
    assert(records.length === 1, 'Expected one saved P013 page');
    const id = records[0].id;
    await editor.goto(base + '/wp-admin/post.php?post=' + id + '&action=edit', {waitUntil:'domcontentloaded'});
    await editor.waitForFunction(() => window.wp?.data?.select('core/block-editor')?.getBlocks()?.length > 0);
    const saved = await editor.evaluate(id => wp.apiFetch({path:'/wp/v2/pages/' + id + '?context=edit'}), id);
    assert(saved.id === id && saved.status === 'publish' && saved.template === payload.template,
      'Saved P013 identity/template differs');
    assert(saved.content.raw === payload.content, 'Saved Core blocks differ from generated source');
    assert(saved.meta._ge_seo_title === payload.seo.title &&
      saved.meta._ge_seo_description === payload.seo.description, 'Saved SEO values differ');
    const blocks = await editor.evaluate(() => {
      const all = [];
      const visit = items => items.forEach(block => {all.push(block); visit(block.innerBlocks || []);});
      visit(wp.data.select('core/block-editor').getBlocks());
      return {count:all.length, invalid:all.filter(block => !block.isValid).length,
        customHTML:all.filter(block => block.name === 'core/html').length,
        tables:all.filter(block => block.name === 'core/table').length};
    });
    assert(blocks.count > 30 && blocks.invalid === 0 && blocks.customHTML === 0 && blocks.tables === 2,
      'Native editor blocks failed');
    console.log(JSON.stringify({savedPageId:id, status:saved.status, template:saved.template,
      savedContentMatch:true, savedSeoMatch:true, editor:blocks,
      menu:'passed', skipLink:'passed', focus:'passed', frontendErrors:0}));
  } finally {await browser.close();}
})().catch(error => {console.error(error.message); process.exitCode = 1;});
