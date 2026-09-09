// Browser integration QA. Uses an existing Playwright installation; no new framework required.
// PLAYWRIGHT_MODULE may point to the bundled playwright package.
// FLAVORS_QA_OUTPUT controls where screenshots and the report are written.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

(async () => {
  const root = path.resolve(__dirname, "..");
  const { preview } = await import(pathToFileURL(path.join(root, "node_modules/vite/dist/node/index.js")).href);
  const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
  const output = process.env.FLAVORS_QA_OUTPUT || path.join(require("node:os").tmpdir(), "lutz-flavors-qa");
  fs.mkdirSync(output, {recursive:true});
  const server = await preview({root, preview:{host:"127.0.0.1",port:4175,strictPort:true}});
  const browser = await chromium.launch({headless:true, channel:"chrome"});
  const widths = [375,390,430,768,1024,1440,1920];
  const base = "http://127.0.0.1:4175";
  const api = "https://os.lutzscoops.us/api/public/flavors";
  const item = (id,name,imageUrl,description,extra={}) => ({
    id,name,slug:null,imageUrl,description,featuredRank:null,
    dietaryMetadata:{GF:{value:"yes",reviewed:true},DF:{value:"no",reviewed:true},V:{value:"unknown",reviewed:false}},
    showAskStaff:false,containsAllergens:[],...extra
  });
  // Fixtures exist only in this test process, never in production source.
  const available = [
    item(987654,"QA Chocolate","/images/flavors/double-chocolate.png","A description supplied by the test response.",{containsAllergens:["milk","soy"]}),
    item(876543,"QA Missing Photo",null,null,{showAskStaff:true}),
    item(765432,"QA Broken Photo","/qa-missing-image.png","Long descriptions and dietary badges should wrap comfortably.",{
      dietaryMetadata:Object.fromEntries(["GF","CF","EF","SF","NF","DF","V"].map(code=>[code,{value:"yes",reviewed:true}]))}),
    item(654321,"QA Long Flavor Name That Wraps Across Multiple Lines","/images/flavors/ube.png",null)
  ];
  const feed={count:4,available,featured:[item(1,"FEATURED_ONLY_SECRET",null,null)],flavors:[item(2,"COMPATIBILITY_SECRET",null,null)]};
  const report=[];
  try {
    for (const state of ["populated","empty","error"]) {
      for (const width of widths) {
        const page=await browser.newPage({viewport:{width,height:900},reducedMotion:"reduce"});
        let calls=0;
        await page.route(api,route=>{
          calls++;
          return route.fulfill({status:state==="error"?503:200,contentType:"application/json",
            body:JSON.stringify(state==="empty"?{count:0,available:[],featured:[]}:feed)});
        });
        await page.goto(base+"/flavors");
        await page.getByRole("heading",{name:"Today’s Flavors",exact:true}).waitFor();
        await page.getByRole("status").filter({hasText:state==="error"?"temporarily unavailable":state==="empty"?"0 flavors":"4 flavors"}).waitFor();
        assert.equal(calls,1,"one flavor request per page");
        assert.equal(await page.title(),"Today’s Flavors | Lutz Scoops");
        assert.match(await page.locator('meta[name="description"]').getAttribute("content"),/Lutz, Florida/);
        if(state==="populated"){
          assert.deepEqual(await page.locator("article h2").allTextContents(),available.map(f=>f.name));
          assert.equal(await page.locator("article").count(),4);
          await page.getByText("QA Broken Photo",{exact:true}).scrollIntoViewIfNeeded();
          await page.locator("article").nth(2).getByText("Photo coming soon",{exact:true}).waitFor();
          assert.equal(await page.locator("article").nth(1).locator("img").count(),0);
          assert.equal(await page.locator("article").nth(1).getByText("Ask Staff about dietary and allergen details.").count(),1);
          assert.deepEqual(await page.locator("article").first().locator("li").allTextContents(),["GF"]);
          assert.match(await page.locator("article").first().innerText(),/Contains: milk, soy/);
          assert.doesNotMatch(await page.locator("main").innerText(),/987654|876543|FEATURED_ONLY_SECRET|COMPATIBILITY_SECRET|featuredRank|supplier/);
          const cards=await page.locator("article").evaluateAll(nodes=>nodes.map(n=>n.getBoundingClientRect().width));
          assert.ok(cards.every(w=>w>=260),JSON.stringify(cards));
          const imageRatios=await page.locator("article > div:first-child").evaluateAll(nodes=>nodes.map(n=>{const r=n.getBoundingClientRect();return r.width/r.height;}));
          assert.ok(imageRatios.every(r=>Math.abs(r-.8)<.01));
        }else{
          assert.equal(await page.locator("article").count(),0);
          assert.equal(await page.getByRole("heading",{name:state==="empty"?"A fresh look at the scoop case":"Let’s check with the scoop crew"}).count(),1);
        }
        await page.evaluate(()=>window.scrollTo(0,0));
        assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),"no horizontal overflow");
        const visibleOverflow=await page.locator("h1,h2,article p,article li").evaluateAll(nodes=>nodes.some(n=>n.scrollWidth>n.clientWidth+1));
        assert.equal(visibleOverflow,false,"headings, descriptions and badges fit");
        for(const link of await page.getByRole("link",{name:"Order Online",exact:true}).all()){
          assert.equal(await link.getAttribute("href"),"https://lutzscoops.square.site/");
        }
        if(width<1024){
          await page.getByRole("button",{name:"Open navigation"}).click();
          assert.equal(await page.getByRole("navigation",{name:"Mobile navigation"}).getByRole("link",{name:"Flavors",exact:true}).getAttribute("href"),"/flavors");
          assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),"open mobile nav fits");
          await page.getByRole("button",{name:"Close navigation"}).click();
        }else{
          assert.equal(await page.getByRole("navigation",{name:"Primary navigation"}).getByRole("link",{name:"Flavors",exact:true}).getAttribute("href"),"/flavors");
        }
        await page.screenshot({path:path.join(output,state+"-"+width+".png"),fullPage:true});
        report.push({state,width,result:"PASS",calls});
        await page.close();
      }
    }
    const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:"reduce"});
    await page.route(api,route=>route.fulfill({contentType:"application/json",body:JSON.stringify({count:0,available:[],featured:[]})}));
    await page.goto(base+"/");
    assert.equal(await page.getByRole("link",{name:"View Flavors",exact:true}).getAttribute("href"),"/flavors");
    assert.equal(await page.getByRole("link",{name:"View Today's Flavors",exact:true}).getAttribute("href"),"/flavors");
    await page.getByRole("button",{name:"Open navigation"}).click();
    await page.getByRole("navigation",{name:"Mobile navigation"}).getByRole("link",{name:"Flavors",exact:true}).click();
    await page.waitForURL(base+"/flavors");
    await page.getByRole("heading",{name:"Today’s Flavors"}).waitFor();
    await page.getByRole("link",{name:"Visit Lutz Scoops"}).click();
    await page.waitForURL(base+"/#visit");
    assert.equal(await page.locator("#visit").count(),1);
    await page.goto(base+"/flavors/");
    await page.getByRole("heading",{name:"Today’s Flavors"}).waitFor();
    await page.close();
    fs.writeFileSync(path.join(output,"report.json"),JSON.stringify(report,null,2));
    console.log("PASS: 21 state/viewport cases, request count, cards, dietary/allergens, imagery, mobile navigation, homepage links, deep links and SEO.");
  }finally{
    await browser.close();
    await new Promise(resolve=>server.httpServer.close(resolve));
  }
})().catch(error=>{console.error(error);process.exitCode=1;});
