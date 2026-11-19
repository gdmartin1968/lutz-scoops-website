const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {pathToFileURL} = require('node:url');
(async () => {
  const root = path.resolve(__dirname, '..');
  const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
  const {preview} = await import(pathToFileURL(path.join(root, 'node_modules/vite/dist/node/index.js')).href);
  const server = await preview({root, preview: {host:'127.0.0.1', port:4187, strictPort:true}});
  const browser = await chromium.launch({headless:true, channel:'chrome'});
  const base = 'http://127.0.0.1:4187';
  const output = process.env.CAKE_QA_OUTPUT;
  try {
    const raw = await (await fetch(base+'/ice-cream-cakes')).text();
    assert.match(raw, /og:image[^>]+birthday-celebration/);
    for (const width of [375,430,768,1440]) {
      const page = await browser.newPage({viewport:{width,height:1000}});
      const errors=[];page.on('pageerror',e=>errors.push(e.message));
      let posts=0;let mode='failure';let healthy=true;
      await page.route('https://os.lutzscoops.us/api/public/cake-inquiries',async route=>{
        if(route.request().method()==='GET')return route.fulfill({json:{available:healthy}});
        posts++; await new Promise(resolve=>setTimeout(resolve,150));
        if(mode==='failure')return route.fulfill({status:503,json:{message:'Test delivery failure. Please call before trying again.'}});
        return route.fulfill({status:201,json:{received:true,reference:'fixture-receipt-123'}});
      });
      await page.goto(base+'/ice-cream-cakes',{waitUntil:'networkidle'});
      assert.equal(await page.locator('h1').innerText(),'Ice Cream\nCakes');
      assert.equal(await page.locator('.cake-card').count(),5);
      assert.deepEqual(await page.locator('.cake-card strong').allTextContents(),['$34.99','$39.99','$39.99','$49.99','$44.99']);
      for(const img of await page.locator('.cakes-page img').all()){await img.scrollIntoViewIfNeeded();await img.evaluate(e=>e.decode());}
      assert.equal(await page.locator('.cakes-page img').evaluateAll(es=>es.every(e=>e.complete&&e.naturalWidth>0)),true);
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no overflow');
      assert.equal(await page.getByText('Cake images are illustrative. Final designs may vary.').count(),1);
      if(width<1024){await page.getByRole('button',{name:'Open navigation'}).click();assert.equal(await page.getByRole('navigation',{name:'Mobile navigation'}).getByRole('link',{name:'Cakes',exact:true}).getAttribute('href'),'/ice-cream-cakes');await page.getByRole('button',{name:'Close navigation'}).click();}
      else assert.equal(await page.getByRole('navigation',{name:'Primary navigation'}).getByRole('link',{name:'Cakes',exact:true}).getAttribute('href'),'/ice-cream-cakes');
      const form=page.getByRole('form',{name:'Cake inquiry'});const button=form.getByRole('button',{name:'Send Cake Inquiry'});
      await button.click();assert.equal(posts,0,'required fields block submission');
      for(const [name,value]of Object.entries({name:'Visual QA fixture',phone:'2025550145',email:'test@example.com',pickupDate:'2099-12-20',servings:'12'}))await form.locator(`[name="${name}"]`).fill(value);
      await button.click();await page.getByRole('alert').filter({hasText:'Test delivery failure'}).waitFor();assert.equal(await page.locator('.cake-success').count(),0);
      mode='success';await button.click();await page.locator('.cake-success').waitFor();assert.equal(posts,2);assert.equal(await form.count(),0);assert.equal(await page.locator('.cake-reference').innerText(),'Inquiry reference: fixture-receipt-123');
      await page.reload({waitUntil:'networkidle'});
      if(output){for(const img of await page.locator('.cakes-page img').all()){await img.scrollIntoViewIfNeeded();await img.evaluate(e=>e.decode());}await page.evaluate(()=>window.scrollTo(0,0));await page.waitForTimeout(300);fs.mkdirSync(output,{recursive:true});await page.screenshot({path:path.join(output,`cakes-${width}.png`),fullPage:true});await page.locator('.cake-hero').screenshot({path:path.join(output,`cakes-hero-${width}.png`)});}
      healthy=false;await page.reload({waitUntil:'networkidle'});assert.equal(await page.getByRole('button',{name:'Send Cake Inquiry'}).isDisabled(),true);assert.equal(await page.getByRole('alert').filter({hasText:'currently unavailable'}).count(),1);
      assert.deepEqual(errors,[]);await page.close();console.log(`${width}px: gallery, images, nav, overflow, validation, failure/success and unavailable delivery PASS`);
    }
    const page=await browser.newPage();
    for(const route of ['/','/flavors','/menu','/about','/visit','/order-online']){const response=await page.goto(base+route,{waitUntil:'domcontentloaded'});assert.equal(response.status(),200);assert.equal(await page.getByRole('banner').count(),1);assert.equal(await page.getByRole('contentinfo').count(),1);console.log(`${route}: accessible`);}
    await page.close();
  } finally {await browser.close();await new Promise(resolve=>server.httpServer.close(resolve));}
})().catch(error=>{console.error(error);process.exitCode=1;});
