/* Read-only local browser check of analytics choice. No live GA4 request is sent. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {chromium} = require('C:/Users/longe/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root = path.resolve(__dirname, '..');
const env = Object.fromEntries(fs.readFileSync(path.join(root,'.env'),'utf8').split(/\r?\n/)
  .filter(s=>s.includes('=')).map(s=>[s.slice(0,s.indexOf('=')),s.slice(s.indexOf('=')+1)]));
if (env.COMPOSE_PROJECT_NAME !== 'ge-p006-test-20261003' || env.WP_PORT !== '18087')
  throw new Error('Unexpected local target');
const url = 'http://127.0.0.1:18087/rfq/';

(async()=>{
  const browser = await chromium.launch({headless:true});
  try {
    const context = await browser.newContext({viewport:{width:390,height:900}});
    const page = await context.newPage();
    const requests=[];
    page.on('request',r=>{if(r.url().includes('googletagmanager.com/gtag')) requests.push(r.url())});
    await page.goto(url,{waitUntil:'networkidle'});
    const rootNode = page.locator('.ge-analytics-choice');
    assert.equal(await rootNode.getAttribute('data-measurement-id'),'G-60H18F67V4');
    assert.equal(await rootNode.getAttribute('data-preview-only'),'1');
    assert.equal(await page.getByRole('region',{name:'Analytics choice'}).isVisible(),true);
    assert.equal(requests.length,0);
    await page.getByRole('button',{name:'Decline analytics'}).click();
    assert.equal(await page.evaluate(()=>localStorage.getItem('ge_analytics_choice_v1')),'declined');
    await page.reload({waitUntil:'networkidle'});
    assert.equal(await page.getByRole('region',{name:'Analytics choice'}).isHidden(),true);
    await page.getByRole('button',{name:'Privacy settings'}).click();
    await page.getByRole('button',{name:'Allow analytics'}).click();
    assert.equal(await rootNode.getAttribute('data-preview-accepted'),'1');
    assert.equal(requests.length,0);
    await page.reload({waitUntil:'networkidle'});
    assert.equal(await page.getByRole('region',{name:'Analytics choice'}).isHidden(),true);
    assert.equal(await rootNode.getAttribute('data-preview-accepted'),'1');
    await page.evaluate(()=>{document.cookie='_ga=synthetic-test; Path=/';});
    await page.getByRole('button',{name:'Privacy settings'}).click();
    await page.getByRole('button',{name:'Decline analytics'}).click();
    await page.waitForLoadState('networkidle');
    assert.equal(await page.evaluate(()=>localStorage.getItem('ge_analytics_choice_v1')),'declined');
    assert.equal(await page.evaluate(()=>document.cookie.includes('_ga=synthetic-test')),false);
    assert.equal(requests.length,0);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);

    const liveContext = await browser.newContext();
    const livePage = await liveContext.newPage();
    const outgoing=[];
    await livePage.route(/https:\/\/[^/]*googletagmanager\.com\//,route=>{
      outgoing.push(route.request().url());
      return route.fulfill({status:200,contentType:'application/javascript',body:''});
    });
    await livePage.route('**/rfq/',async route=>{
      const response=await route.fetch();
      const html=(await response.text()).replace('data-preview-only="1"','data-preview-only="0"');
      return route.fulfill({response,body:html});
    });
    await livePage.goto(url,{waitUntil:'networkidle'});
    assert.equal(await livePage.locator('.ge-analytics-choice').getAttribute('data-preview-only'),'0');
    assert.equal(outgoing.length,0);
    await livePage.getByRole('button',{name:'Allow analytics'}).click();
    await livePage.waitForTimeout(300);
    assert.equal(outgoing.some(x=>x.includes('id=G-60H18F67V4')),true);
    process.stdout.write('PASS: default-off, decline, consent persistence, change choice and consent-only GA4 load; Google request mocked.\n');
  } finally {await browser.close()}
})().catch(e=>{process.stderr.write('FAIL: '+e.stack+'\n');process.exitCode=1});
