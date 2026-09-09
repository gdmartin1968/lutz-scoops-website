import assert from "node:assert/strict";
import {
  PUBLIC_MENU_URL, fetchPublicMenu, findHighlightItems, formatStartingPrice,
  getStartingPrice, isPublicMenuResponse, resolveHighlightPrice, type MenuHighlightKey,
} from "../src/lib/public-menu.ts";
import { fixtures, expectedPrices, item, variant } from "./public-menu-fixtures.ts";

assert.equal(PUBLIC_MENU_URL, "https://os.lutzscoops.us/api/public/menu");
for (const key of Object.keys(expectedPrices) as MenuHighlightKey[]) {
  assert.equal(resolveHighlightPrice(fixtures,key),expectedPrices[key],key);
  assert.equal(resolveHighlightPrice([],key),null,"empty feed has no price");
  const reversed = [...fixtures].reverse().map(item=>({...item,variants:[...item.variants].reverse()}));
  assert.equal(resolveHighlightPrice(reversed,key),expectedPrices[key],"API order cannot change a starting price");
}
assert.equal(findHighlightItems(fixtures,"sundaes").length,4,"aggregate individual Sundaes category items");
assert.equal(resolveHighlightPrice([
  item("Regular Bowl","BÓWLS",[variant("Regular","14.50")]),
  item("Seasonal Bowl"," bowls ",[variant("Regular","12.50")]),
],"acaiBowls"),"From $12.50","multiple category items and normalized category matching");

for (const name of ["Açaí Bowls","Acai Bowls","Ac\u0327ai\u0301 Bowls"]) {
  assert.equal(resolveHighlightPrice([item(name,null,[variant(null,"12.50")])],"acaiBowls"),"From $12.50","Unicode-safe exact fallback");
}
assert.equal(resolveHighlightPrice([item("Scoops",null,[variant("Kiddie","4.99")])],"iceCream"),"From $4.99");
assert.equal(resolveHighlightPrice([item("Ice",null,[variant(null,"0.25")])],"iceCream"),null,"no partial-name matching");
assert.equal(resolveHighlightPrice([
  item("Hot Fudge","Sundaes",[variant("Regular","8.50")]),
  item("Sundaes",null,[variant("Regular","1.00")]),
],"sundaes"),"From $8.50","canonical category wins over legacy alias fallback");
assert.equal(resolveHighlightPrice([
  item("Floats & Ice Cream Sodas","Milkshakes",[variant("Regular","7.99")]),
  fixtures[1],
],"milkshakes"),"From $8.50","separately named floats must not lower shake price");
assert.equal(resolveHighlightPrice([
  item("Floats & Ice Cream Sodas","Shakes & Floats",[variant("Regular","7.99")]),
],"floatsAndMore"),"From $7.99","exact item fallback for older broad categories");

const canonicalFloat = item("Floats & Ice Cream Sodas","Shakes & Floats",[
  variant("Ice Cream Float 16 oz","7.99"), variant("Ice Cream Soda 16 oz","7.99"),
]);
const competingFloatRecords = [
  item("QA Specialty Drink","Floats & Ice Cream Sodas",[variant("Regular","5.99")]),
  item("Floats & More","Shakes & Floats",[variant("Regular","5.99")]),
];
assert.equal(resolveHighlightPrice([canonicalFloat,...competingFloatRecords],"floatsAndMore"),"From $7.99");
assert.equal(resolveHighlightPrice(competingFloatRecords,"floatsAndMore"),null,"canonical item absent means no price");
assert.equal(resolveHighlightPrice([item(" floats & ICE cream sodas ",null,[variant("Regular","9.25")])],"floatsAndMore"),"From $9.25","normalized canonical match, price derived from data");
assert.equal(resolveHighlightPrice([item("Floats & Ice Cream Sodas",null,[variant("Upgrade","1.00")]),...competingFloatRecords],"floatsAndMore"),null,"no category fallback when canonical item has no base price");

for (const label of ["Add Malt Powder","Vegan Milkshake Upgrade","Add Flavor Shot","Malt Add-on","Malt Addon","Extra Shot","Extra Toppings"]) {
  for (const v of [variant(label,"0.50",null),variant(null,"0.50",label)]) {
    assert.equal(getStartingPrice(item("Milkshakes","Milkshakes",[v])),null,label+" in either label is not a base");
  }
}
for (const label of ["Extra Large","Extra Small","Double Espresso Shot","Affogato","Latte from","Milkshakes 16 oz","Addison Special"]) {
  assert.equal(getStartingPrice(item("Coffee & Cocoa","Coffee & Cocoa",[variant(label,"1.99") ])),1.99,label+" is a legitimate product/size");
}
assert.equal(resolveHighlightPrice([item("Milkshakes","Milkshakes",[variant("Upgrade","1.00")])],"milkshakes"),null);
assert.equal(getStartingPrice(item("Scoops","Scoops",[])),null);
for (const price of ["n/a","NaN","Infinity","-1.00","","4.999","not a price"]) {
  assert.equal(getStartingPrice(item("Scoops","Scoops",[variant("Regular",price)])),null,price);
}
assert.equal(getStartingPrice(item("Scoops","Scoops",[variant("Regular","bad"),variant("Large","$4.99")])),4.99);
assert.equal(getStartingPrice(item("Coffee","Coffee & Cocoa",[variant("Small","0.25")])),.25,"no arbitrary price floor");
assert.equal(formatStartingPrice(null),null);
assert.equal(formatStartingPrice(8.5),"From $8.50");

const envelope=(items: unknown[])=>({generatedAt:"2026-09-09T20:00:00Z",count:items.length,items});
assert.ok(isPublicMenuResponse(envelope(fixtures)));
assert.ok(isPublicMenuResponse(envelope([])));
assert.ok(isPublicMenuResponse(envelope([item("Scoops",null,[])])));
assert.equal(isPublicMenuResponse({...envelope([]),count:1}),false);
assert.equal(isPublicMenuResponse({...envelope([]),items:null}),false);
assert.equal(isPublicMenuResponse(envelope([{...fixtures[0],category:42}])),false);
assert.equal(isPublicMenuResponse(envelope([{...fixtures[0],variants:[{...variant("Regular","4.99"),price:4.99}]}])),false);
assert.equal(isPublicMenuResponse(envelope([{...fixtures[0],variants:null}])),false);

const originalFetch=globalThis.fetch;
try {
  globalThis.fetch=async()=>new Response(JSON.stringify(envelope(fixtures)));
  assert.equal((await fetchPublicMenu()).items.length,fixtures.length);
  globalThis.fetch=async()=>new Response(JSON.stringify(envelope([])));
  assert.deepEqual((await fetchPublicMenu()).items,[]);
  globalThis.fetch=async()=>new Response("",{status:503});
  await assert.rejects(fetchPublicMenu);
  globalThis.fetch=async()=>{throw new TypeError("Network failure");};
  await assert.rejects(fetchPublicMenu);
  globalThis.fetch=async()=>new Response('{"items":null}');
  await assert.rejects(fetchPublicMenu);
} finally {globalThis.fetch=originalFetch;}

console.log("Public menu tests passed: all six prices, category aggregation, modifiers in both labels, exact fallback, Unicode, order, invalid prices, empty/error and DTO validation.");
