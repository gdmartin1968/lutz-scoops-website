const {assertAlmostOutCycle}=require('./almost-out-browser-contract.cjs');
const assert=require('node:assert/strict');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
(async()=>{
 const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
 const {preview}=await import(pathToFileURL(path.resolve('node_modules/vite/dist/node/index.js')).href);
 const server=await preview({preview:{host:'127.0.0.1',port:4187,strictPort:true}}),browser=await chromium.launch({channel:'chrome',headless:true});
 try{
 for(const width of [375,768,1024,1440]){
  const context=await browser.newContext({viewport:{width,height:1000}}),page=await context.newPage();let warning=true;const writes=[];page.on('request',r=>{if(r.method()!=='GET')writes.push(r.method()+' '+r.url());});
  const flavors=Array.from({length:48},(_,i)=>({id:i+1,name:'Fixture '+(i+1),slug:'fixture-'+i,description:null,imageUrl:'/images/flavors/cookie-monster.png',featuredRank:i<6?i+1:null,dietaryMetadata:{GF:{value:'yes',reviewed:true}},almostOut:i===0&&warning}));
  await page.route('https://os.lutzscoops.us/api/public/flavors',r=>{const available=flavors.map(f=>({...f,almostOut:f.id===1&&warning}));return r.fulfill({json:{count:48,available,featured:available.slice(0,6)}});});
  await page.clock.install({time:new Date('2030-01-01T00:00:00Z')});await page.clock.pauseAt(new Date('2030-01-01T00:00:00Z'));
  await page.goto('http://127.0.0.1:4187/flavors',{waitUntil:'domcontentloaded'});await page.getByText('48 flavors available now',{exact:true}).waitFor();
  assert.equal(await page.locator('[data-flavor-id]').count(),48,'Website is not capped at 40');const card=page.locator('[data-flavor-id="1"]');await card.getByText('ALMOST OUT',{exact:true}).waitFor();
  const order=await page.locator('[data-flavor-id]').evaluateAll(els=>els.map(el=>el.dataset.flavorId));
  const images=await page.locator('[data-flavor-id] img').evaluateAll(els=>els.map(el=>el.getAttribute('src')));
  assert.equal(await page.locator('[data-flavor-id="2"] .almost-out-indicator').count(),0,'False state has no badge');
  await assertAlmostOutCycle(page,card);
  assert.deepEqual(await page.locator('[data-flavor-id]').evaluateAll(els=>els.map(el=>el.dataset.flavorId)),order);
  assert.deepEqual(await page.locator('[data-flavor-id] img').evaluateAll(els=>els.map(el=>el.getAttribute('src'))),images);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));warning=false;await page.clock.runFor(5000);await page.locator('.almost-out-indicator').waitFor({state:'detached',timeout:8000});
  assert.equal(await page.locator('[data-flavor-id]').first().getAttribute('data-flavor-id'),'1','Warning never reorders flavors');// Homepage featured cards use the same presentation without changing their six ranks/order.
  warning=true;await page.clock.runFor(25000);await page.goto('http://127.0.0.1:4187/',{waitUntil:'domcontentloaded'});
  const featured=page.locator('#flavors article');await featured.first().waitFor();assert.equal(await featured.count(),6);
  const featuredNames=await featured.locator('h3').allTextContents();await assertAlmostOutCycle(page,featured.first());assert.deepEqual(await featured.locator('h3').allTextContents(),featuredNames);
  assert.equal(await featured.nth(1).locator('.almost-out-indicator').count(),0);
  assert.deepEqual(writes,[],'Presentation never writes business state');
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await context.close();
 }
 console.log('Website 48 uncapped cards, 5-second-only badge, 30-second cycle/5-second pulse/25-second rest/repeat, reduced motion, live clear, stable layout/order and no overflow passed at all four widths.');
 }finally{await browser.close();await server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
