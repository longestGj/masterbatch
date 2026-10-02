/* Local-only HTTP/browser acceptance for the P006 inquiry journey. */
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const {chromium}=require('C:/Users/longe/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const env=Object.fromEntries(fs.readFileSync(path.join(root,'.env'),'utf8').split(/\r?\n/)
 .filter(s=>s.includes('=')).map(s=>[s.slice(0,s.indexOf('=')),s.slice(s.indexOf('=')+1)]));
if(env.COMPOSE_PROJECT_NAME!=='ge-p006-test-20261003'||env.WP_PORT!=='18087')throw new Error('Unexpected local target');
const base='http://127.0.0.1:'+env.WP_PORT;
const out=path.join(root,'.local','runtime');fs.mkdirSync(out,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true});
 let detail;
 try{
  const page=await browser.newPage({viewport:{width:1440,height:900}});
  await page.goto(base+'/rfq/',{waitUntil:'networkidle'});
  assert.equal(await page.locator('main h1').count(),1);
  assert.equal(await page.locator('.ge-rfq-form:visible').count(),1);
  assert.equal(await page.locator('#ge-rfq-form').count(),1);
  for(const width of [1440,768,390]){
   await page.setViewportSize({width,height:900});
   await page.screenshot({path:path.join(out,`rfq-${width}.png`),fullPage:true});
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`Horizontal overflow at ${width}`);
  }
  const form=page.locator('.ge-rfq-form');
  const nonce=await form.locator('[name="nonce"]').inputValue();
  const invalid=await page.evaluate(async({nonce})=>{
   const data=new FormData();
   Object.entries({action:'ge_rfq_submit',nonce,submission_token:crypto.randomUUID(),
    intent:'model',company:'',email:'buyer@example.test',message:'We want to discuss a model.'})
    .forEach(([k,v])=>data.set(k,v));
   const response=await fetch('/wp-admin/admin-ajax.php',{method:'POST',body:data});
   return {status:response.status,body:await response.json()};
  },{nonce});
  assert.equal(invalid.status,422);
  assert.equal(invalid.body.data.field,'company');
  await form.locator('[name="intent"][value="model"]').check();
  await form.locator('[name="company"]').fill('RFQ Runtime Fixture');
  await form.locator('[name="email"]').fill('buyer@example.test');
  await form.locator('[name="message"]').fill('We need a project discussion without a known model.');
  await form.locator('[name="product"]').selectOption('not-sure');
  const validity=await form.evaluate(el=>({valid:el.checkValidity(),invalid:[...el.querySelectorAll(':invalid')].map(x=>({name:x.name,message:x.validationMessage})),script:[...document.scripts].filter(x=>x.src.includes('form.js')).map(x=>x.src)}));
  assert.equal(validity.valid,true,JSON.stringify(validity));
  const [response]=await Promise.all([
   page.waitForResponse(r=>r.url().includes('admin-ajax.php')&&r.request().method()==='POST'),
   form.locator('button[type="submit"]').click()
  ]);
  assert.equal(response.status(),200);
  assert.deepEqual(await response.json(),{success:true,data:{saved:true}});
  await page.locator('.ge-rfq-result').getByText('Your inquiry was saved for review.').waitFor();
  assert.equal(await form.isHidden(),true);
  assert.equal((await page.locator('.ge-rfq-result').innerText()).includes('email'),false);
  const admin=await browser.newPage();
  await admin.goto(base+'/wp-login.php');
  await admin.locator('#user_login').fill(env.WP_ADMIN_USER);
  await admin.locator('#user_pass').fill(env.WP_ADMIN_PASSWORD);
  await Promise.all([admin.waitForURL(u=>u.pathname.startsWith('/wp-admin/')),
   admin.locator('#wp-submit').click()]);
  await admin.goto(base+'/wp-admin/admin.php?page=ge-inquiries');
  await admin.getByRole('link',{name:'RFQ Runtime Fixture'}).click();
  detail=admin.url();
  assert.match(await admin.locator('main, .wrap').last().innerText(),/blocked_local/);
  assert.match(await admin.locator('main, .wrap').last().innerText(),/buyer@example\.test/);
  admin.once('dialog',dialog=>dialog.accept());
  await Promise.all([admin.waitForURL(u=>u.searchParams.get('page')==='ge-inquiries'&&!u.searchParams.has('inquiry')),
   admin.getByRole('button',{name:'Delete inquiry'}).click()]);
  assert.equal(await admin.getByRole('link',{name:'RFQ Runtime Fixture'}).count(),0);
  process.stdout.write('PASS: P006 HTTP, responsive layout, invalid input, save-only buyer success, internal blocked mail, admin view/delete.\n');
 }finally{await browser.close()}
})().catch(e=>{process.stderr.write('FAIL: '+e.message+'\n');process.exitCode=1});
