// Run with an existing Playwright installation (PLAYWRIGHT_MODULE can name its absolute path).
// Set PUBLIC_MENU_QA_OUTPUT for screenshots; LIVE_WEBSITE_URL enables read-only release checks.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
(async()=>{
  const root=path.resolve(__dirname,"..");
  const {chromium}=require(process.env.PLAYWRIGHT_MODULE || "playwright");
  const {fixtures,expectedPrices}=await import(pathToFileURL(path.join(__dirname,"public-menu-fixtures.ts")).href);
  const output=process.env.PUBLIC_MENU_QA_OUTPUT || path.join(require("node:os").tmpdir(),"lutz-menu-qa");
  fs.mkdirSync(output,{recursive:true});
  const live=process.env.LIVE_WEBSITE_URL;
  let server;
  if(!live){
    const {preview}=await import(pathToFileURL(path.join(root,"node_modules/vite/dist/node/index.js")).href);
    server=await preview({root,preview:{host:"127.0.0.1",port:4176,strictPort:true}});
  }
  const base=live || "http://127.0.0.1:4176";
  const browser=await chromium.launch({headless:true,channel:"chrome"});
  const api="https://os.lutzscoops.us/api/public/menu";
  const names=["Premium Ice Cream","Milkshakes","Sundaes","Coffee & Espresso","Açaí Bowls","Floats & More"];
  const report=[];
  try{
    if(live){
      const apiContext=await browser.newContext();
      const response=await apiContext.request.get(api);
      assert.equal(response.status(),200);
      const feed=await response.json();
      assert.equal(feed.count,0,"production visibility must remain unchanged");
      assert.deepEqual(feed.items,[]);
      report.push({api,status:200,count:feed.count});
      await apiContext.close();
    }
    for(const state of live?["live"]:["populated","empty","error"]){
      for(const width of [375,390,430,768,1024,1440,1920]){
        const page=await browser.newPage({viewport:{width,height:900},reducedMotion:"reduce"});
        let calls=0;
        page.on("request",request=>{if(request.url()===api)calls++;});
        if(!live){
          await page.route(api,route=>route.fulfill({status:state==="error"?503:200,contentType:"application/json",
            body:JSON.stringify({generatedAt:"2026-09-09T20:00:00Z",count:state==="populated"?fixtures.length:0,items:state==="populated"?fixtures:[]})}));
          await page.route("https://os.lutzscoops.us/api/public/flavors",route=>route.fulfill({contentType:"application/json",body:JSON.stringify({count:0,available:[],featured:[]})}));
        }
        const responsePromise=page.waitForResponse(api);
        const response=await page.goto(base+"/");
        assert.equal(response.status(),200);
        await responsePromise;
        const section=page.locator("#menu");
        await section.scrollIntoViewIfNeeded();
        assert.deepEqual(await section.locator("article h3").allTextContents(),names);
        if(state==="populated"){
          await section.getByText("From $7.99",{exact:true}).waitFor();
          assert.deepEqual(await section.locator("article").evaluateAll(nodes=>nodes.map(n=>Array.from(n.querySelectorAll("p")).at(-1).textContent)),Object.values(expectedPrices));
        }else{
          assert.doesNotMatch(await section.innerText(),/From \$/);
        }
        assert.doesNotMatch(await section.innerText(),/From \$0\.50|From \$0\.99|From \$1\.00/);
        assert.equal(calls,1);
        assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),"no horizontal overflow");
        assert.equal(await section.locator("article").count(),6);
        await section.screenshot({path:path.join(output,state+"-"+width+".png")});
        report.push({state,width,cards:6,calls,result:"PASS"});
        if(live && width===390){
          await page.evaluate(()=>window.scrollTo(0,0));
          await page.getByRole("button",{name:"Open navigation"}).click();
          await page.getByRole("navigation",{name:"Mobile navigation"}).getByRole("link",{name:"Flavors",exact:true}).click();
          await page.waitForURL(base+"/flavors");
          await page.getByRole("status").filter({hasText:"0 flavors available now"}).waitFor();
          assert.equal(await page.locator("article").count(),0);
          assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
          assert.equal(await page.getByRole("heading",{name:"Today’s Flavors",exact:true}).count(),1);
          await page.screenshot({path:path.join(output,"live-flavors-390.png"),fullPage:true});
          report.push({route:"/flavors",width:390,result:"PASS"});
        }
        await page.close();
      }
    }
    fs.writeFileSync(path.join(output,"report.json"),JSON.stringify(report,null,2));
    console.log(JSON.stringify(report,null,2));
  }finally{
    await browser.close();
    if(server)await new Promise(resolve=>server.httpServer.close(resolve));
  }
})().catch(error=>{console.error(error);process.exitCode=1;});
