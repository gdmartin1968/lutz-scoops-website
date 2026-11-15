const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
const path=require('node:path');
const os=require('node:os');
const {pathToFileURL}=require('node:url');
(async()=>{
 const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
 const {preview}=await import(pathToFileURL(path.resolve('node_modules/vite/dist/node/index.js')).href);
 const server=await preview({preview:{host:'127.0.0.1',port:4192,strictPort:true}}),browser=await chromium.launch({channel:'chrome',headless:true});
 const labels={GF:'Gluten Free',CF:'Corn Free',EF:'Egg Free',SF:'Soy Free',NF:'Nut Free',DF:'Dairy Free',V:'Vegan'};
 const codes=Object.keys(labels),output=path.join(os.tmpdir(),'lutz-dietary-badges-qa');await fs.mkdir(output,{recursive:true});
 const flavors=Array.from({length:8},(_,i)=>({id:i+100,name:i===0?'All seven':i===1?'No positive claims':'Flavor '+i,slug:'fixture-'+i,description:'Fixture description',imageUrl:'/images/flavors/cookie-monster.png',featuredRank:null,dietaryMetadata:Object.fromEntries(codes.map((code,index)=>[code,{value:i===1?(index%2?'unknown':'no'):'yes',reviewed:true}]))}));
 try{
 for(const width of [375,430,768,1440]){
  const context=await browser.newContext({viewport:{width,height:900},hasTouch:true}),page=await context.newPage(),errors=[],writes=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(r.method()!=='GET')writes.push(r.method()+' '+r.url());});
  await page.route('https://os.lutzscoops.us/api/public/flavors',r=>r.fulfill({json:{count:91,available:flavors,featured:[]}}));
  await page.goto('http://127.0.0.1:4192/flavors',{waitUntil:'domcontentloaded'});await page.getByText('91 flavors available now',{exact:true}).waitFor();
  const legend=page.getByRole('region',{name:'Dietary legend',exact:true});assert.equal(await legend.locator('dt').count(),7);
  assert.deepEqual(await legend.locator('dt').allTextContents(),codes);assert.deepEqual(await legend.locator('dd').allTextContents(),Object.values(labels));
  await legend.getByText('Dietary labels reflect ingredient information. Products are handled in a shared environment, so cross-contact is possible. Please ask our team about specific allergies.',{exact:true}).waitFor();
  assert.deepEqual(await page.locator('article[data-flavor-id]').evaluateAll(nodes=>nodes.map(n=>Number(n.dataset.flavorId))),flavors.map(f=>f.id));
  assert.equal(await page.locator('[data-flavor-id="101"] [aria-label="Dietary information"]').count(),0,'No badges for no/unknown claims');
  const card=page.locator('[data-flavor-id="100"]');assert.deepEqual(await card.locator('ul button').allTextContents(),codes);
  async function checkTooltip(label){
   const tip=page.getByRole('tooltip');await tip.waitFor();assert.equal(await tip.innerText(),label);
   const details=await tip.evaluate(el=>{const r=el.getBoundingClientRect(),header=document.querySelector('header').getBoundingClientRect();return {portal:el.parentElement===document.body,inside:r.left>=0&&r.top>=header.bottom&&r.right<=innerWidth&&r.bottom<=innerHeight,hit:document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)===el};});
   assert.deepEqual(details,{portal:true,inside:true,hit:true},'Tooltip is outside clipping cards, above content, inside viewport, below navigation');
  }
  for(const code of codes){
   const badge=card.getByRole('button',{name:`${code}: ${labels[code]}`,exact:true});assert.ok(await badge.evaluate(el=>{const r=el.getBoundingClientRect();return r.width>=24&&r.height>=24;}),'Minimum touch target');await badge.hover();await checkTooltip(`${code}: ${labels[code]}`);
   await page.getByRole('tooltip').hover();await page.waitForTimeout(180);assert.ok(await page.getByRole('tooltip').isVisible(),'Hovering tooltip preserves it');
   await page.keyboard.press('Escape');assert.equal(await page.getByRole('tooltip').count(),0);
   await badge.focus();await checkTooltip(`${code}: ${labels[code]}`);assert.equal(await badge.getAttribute('aria-describedby'),await page.getByRole('tooltip').getAttribute('id'));
   await page.keyboard.press('Escape');
  }
  await card.getByRole('button',{name:'GF: Gluten Free',exact:true}).focus();await page.keyboard.press('Tab');await checkTooltip('CF: Corn Free');await page.keyboard.press('Escape');
  await page.getByRole('heading',{name:'All seven',exact:true}).tap();await card.getByRole('button',{name:'DF: Dairy Free',exact:true}).tap();await checkTooltip('DF: Dairy Free');
  await page.getByRole('heading',{name:'All seven',exact:true}).tap();assert.equal(await page.getByRole('tooltip').count(),0,'Outside tap dismisses');
  const edge=page.locator('article').last().getByRole('button',{name:'V: Vegan',exact:true});await edge.focus();await checkTooltip('V: Vegan');
  await page.screenshot({path:path.join(output,`dietary-${width}.png`),fullPage:true});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`No overflow at ${width}`);
  assert.deepEqual(writes,[]);assert.deepEqual(errors,[]);await context.close();
 }
 console.log('Dietary labels/legend/notice, canonical positive badges/order/API count, hover/focus/Tab/Escape/touch/outside dismissal, unclipped viewport-safe tooltips, zero writes/errors passed at 375/430/768/1440px. Screenshots: '+output);
 }finally{await browser.close();await server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
