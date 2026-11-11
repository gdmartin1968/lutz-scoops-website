const assert=require('node:assert/strict');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
(async()=>{
 const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
 const {preview}=await import(pathToFileURL(path.resolve('node_modules/vite/dist/node/index.js')).href);
 const server=await preview({preview:{host:'127.0.0.1',port:4187,strictPort:true}}),browser=await chromium.launch({channel:'chrome',headless:true});
 try{
 for(const width of [375,768,1024,1440]){
  const context=await browser.newContext({viewport:{width,height:1000}}),page=await context.newPage();let warning=true;
  const flavors=Array.from({length:48},(_,i)=>({id:i+1,name:'Fixture '+(i+1),slug:'fixture-'+i,description:null,imageUrl:'/images/flavors/cookie-monster.png',featuredRank:i<6?i+1:null,dietaryMetadata:{GF:{value:'yes',reviewed:true}},almostOut:i===0&&warning}));
  await page.route('https://os.lutzscoops.us/api/public/flavors',r=>{const available=flavors.map(f=>({...f,almostOut:f.id===1&&warning}));return r.fulfill({json:{count:48,available,featured:available.slice(0,6)}});});
  await page.goto('http://127.0.0.1:4187/flavors',{waitUntil:'domcontentloaded'});await page.getByText('48 flavors available now',{exact:true}).waitFor();
  assert.equal(await page.locator('[data-flavor-id]').count(),48,'Website is not capped at 40');const card=page.locator('[data-flavor-id="1"]');await card.getByText('ALMOST OUT',{exact:true}).waitFor();
  assert.equal(await card.evaluate(el=>getComputedStyle(el).animationDuration),'30s');
  const samples=await card.evaluate(el=>{const a=el.getAnimations()[0];a.pause();const sample=t=>{a.currentTime=t;return {shadow:getComputedStyle(el).boxShadow,rect:JSON.stringify(el.getBoundingClientRect().toJSON())};};return [sample(500),sample(10000),sample(29000),sample(30500)];});
  assert.notEqual(samples[0].shadow,samples[1].shadow);assert.equal(samples[1].shadow,samples[2].shadow);assert.equal(samples[0].shadow,samples[3].shadow);assert.equal(samples[0].rect,samples[1].rect,'No animation layout shift');
  await page.emulateMedia({reducedMotion:'reduce'});assert.equal(await card.evaluate(el=>getComputedStyle(el).animationName),'none');await card.getByText('ALMOST OUT',{exact:true}).waitFor();
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));warning=false;await page.getByText('ALMOST OUT',{exact:true}).waitFor({state:'detached',timeout:8000});
  assert.equal(await page.locator('[data-flavor-id]').first().getAttribute('data-flavor-id'),'1','Warning never reorders flavors');await context.close();
 }
 console.log('Website 48 uncapped cards, persistent badge, 30-second cycle/5-second pulse/25-second rest/repeat, reduced motion, live clear, stable layout/order and no overflow passed at all four widths.');
 }finally{await browser.close();await server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
