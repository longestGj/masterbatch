/* Original SVG interface icons and a static candidate-asset sheet. */
const fs = require('node:fs');
const path = require('node:path');
const {pathToFileURL} = require('node:url');
const {chromium} = require('C:/Users/longe/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root = __dirname;
const shapes = {
  factory:'<path d="M3 21V10l6 3V8l6 3V5h5v16H3Z"/><path d="M15 5V3h5v2M6 17h1m3 0h1m5 0h1m0-4h1"/>',
  globe:'<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18M5 6.5h14M5 17.5h14"/>',
  pellets:'<circle cx="8" cy="7" r="3"/><circle cx="17" cy="8" r="3"/><circle cx="6" cy="16" r="3"/><circle cx="15" cy="17" r="3"/>',
  color:'<path d="M12 3a9 9 0 1 0 0 18h1a2 2 0 0 0 1.3-3.5 1.8 1.8 0 0 1 1.2-3.2H18A3 3 0 0 0 21 11a9 9 0 0 0-9-8Z"/><circle cx="7" cy="10" r=".6"/><circle cx="11" cy="7" r=".6"/><circle cx="16" cy="8" r=".6"/><circle cx="7.5" cy="15" r=".6"/>',
  desiccant:'<path d="M12 3c-2 3-7 8-7 12a7 7 0 0 0 14 0c0-4-5-9-7-12Z"/><path d="m4 20 16-16"/>',
  film:'<ellipse cx="7" cy="12" rx="4" ry="8"/><ellipse cx="7" cy="12" rx="1.2" ry="3"/><path d="M7 4h9c3 0 5 4 5 8s-2 8-5 8H7m14-8v8h-5"/>',
  injection:'<path d="M3 20h18M4 20V6h5v14M15 20V6h5v14M9 10h6m-3-7v7m-3 6h6"/><path d="M10 3h4m-3 9h2v4h-2z"/>',
  extrusion:'<path d="M3 9h11v6H3zM14 10h4v4h-4M18 12h4M5 9V5h6v4"/><path d="M5 18h9m-6-3v3m6-3v3"/>',
  recycle:'<path d="m8 4 4-2 4 7m-4-7 4 7m0 0-4-1m4 1 1-4M20 11l2 4-7 4m7-4-7 4m0 0 1-4m-1 4 4 1M11 21H7L3 14m4 7-4-7m0 0 4 1m-4-1-1 4"/>',
  laboratory:'<path d="M9 3h6m-5 0v6l-6 9a2 2 0 0 0 1.7 3h12.6a2 2 0 0 0 1.7-3l-6-9V3M7 14h10"/><circle cx="10" cy="17" r=".5"/><circle cx="14" cy="18" r=".5"/>',
  documents:'<path d="M6 3h8l4 4v14H6zM14 3v5h4M9 12h6M9 16h6"/><path d="M3 7v14"/>',
  message:'<path d="M4 4h16v12H9l-5 5V4Z"/><path d="M8 8h8M8 12h5"/>',
  'arrow-up-right':'<path d="M6 18 18 6M6 6h12v12"/>',
  menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
  close:'<path d="m6 6 12 12M18 6 6 18"/>'
};
const svg = (body, label)=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><title>${label}</title>${body}</svg>`;
for(const [name,body] of Object.entries(shapes)) fs.writeFileSync(path.join(root,'assets/icons',name+'.svg'),svg(body,name));
const tiles = Object.entries(shapes).map(([name,body])=>`<div class="tile">${svg(body,name)}<span>${name}</span></div>`).join('');
const gallery = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>P001 — Brand and icon candidates</title><style>
*{box-sizing:border-box}body{margin:0;font:16px Arial,sans-serif;background:#f5f5ef;color:#202623;padding:48px 64px}h1{font-size:32px;margin:0 0 12px}p{color:#59645d;margin:0 0 32px;line-height:1.5}.logos{display:grid;grid-template-columns:1fr 1fr;gap:24px}.logo-panel{padding:26px;background:#fff;border:1px solid #d5dad1}.logo-panel h2{font-size:18px;margin:0 0 24px}.logo{display:block;width:100%;height:150px;object-fit:cover;object-position:50% 52%}.dark{background:#202623;color:#f5f5ef}.dark .logo{background:transparent;filter:grayscale(1) brightness(0) invert(1)}h2{font-size:24px;margin-top:35px}.sizes{display:flex;align-items:center;gap:40px;padding:24px;background:white;border:1px solid #d5dad1}.size{display:flex;gap:12px;align-items:center;font-size:13px}.icons{display:grid;grid-template-columns:repeat(5,1fr);gap:16px}.tile{display:flex;gap:20px;align-items:center;background:white;border:1px solid #d5dad1;padding:24px 18px}.tile svg{height:30px;width:30px;color:#34473b;flex-shrink:0}.tile span{font-size:13px}.candidate{font-size:12px;margin-top:30px;color:#59645d}
</style></head><body><h1>GE — Brand & Icon Candidates</h1><p>P001 visual assets · New identity proposal · Homepage copy remains unchanged</p><div class="logos"><div class="logo-panel"><h2>Header logo</h2><img class="logo" src="assets/ge-logo-candidate.png" alt="GE Chemical & Polymer Group Co., Ltd."></div><div class="logo-panel dark"><h2>Footer logo presentation</h2><img class="logo" src="assets/ge-logo-candidate.png" alt="GE Chemical & Polymer Group Co., Ltd."></div></div><h2>Website icon — small-size previews</h2><div class="sizes">${[16,32,48,64,128].map(size=>`<div class="size"><img src="assets/ge-brandmark-candidate.png" alt="GE mark" width="${size}" height="${size}"><span>${size}px</span></div>`).join('')}</div><h2>Interface & Section Icons</h2><div class="icons">${tiles}</div><p class="candidate">Generated Logo PNGs retain transparency. The SVG icons are original drawings. Browser-tab use and production asset optimization require implementation checks.</p></body></html>`;
fs.writeFileSync(path.join(root,'brand-icons.html'),gallery);
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});
  await page.goto(pathToFileURL(path.join(root,'brand-icons.html')).href);
  await page.evaluate(()=>Promise.all([...document.images].map(img=>img.decode())));
  await page.screenshot({path:path.join(root,'brand-icons-preview.png'),fullPage:true});
  console.log(JSON.stringify({icons:Object.keys(shapes).length,preview:'brand-icons-preview.png'}));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
