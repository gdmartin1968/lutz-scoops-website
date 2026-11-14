// Shared TV/website browser contract: actual presentation and boundary timers.
const assert=require('node:assert/strict');
exports.assertAlmostOutCycle=async function(page,card){
 const now=await page.evaluate(()=>Date.now());await page.clock.pauseAt(Math.ceil((now+1)/30000)*30000);
 const normal=await card.evaluate(el=>{
  const badge=el.querySelector('.almost-out-indicator');el.classList.remove('almost-out-card');badge.style.display='none';
  const s=getComputedStyle(el),value={shadow:s.boxShadow,border:s.border,outline:s.outline,background:s.background,transform:s.transform,rect:JSON.stringify(el.getBoundingClientRect().toJSON()),children:Array.from(el.querySelectorAll('img,h2,h3,ul')).map(c=>JSON.stringify(c.getBoundingClientRect().toJSON()))};
  el.classList.add('almost-out-card');badge.style.removeProperty('display');return value;
 });
 const pulse=await card.evaluate(el=>{const computed=getComputedStyle(el,'::after').animationName;const a=el.getAnimations({subtree:true}).find(a=>a.animationName==='almost-out-pulse');if(!a)throw Error('Missing pulse: '+computed);a.pause();a.currentTime=0;const first=getComputedStyle(el,'::after').opacity;a.currentTime=500;return {first,second:getComputedStyle(el,'::after').opacity};});assert.notEqual(pulse.first,pulse.second);
 let previous=0;
 for(const t of [0,4999,5000,29999,30000,35000]){
  await page.clock.runFor(t-previous);previous=t;
  const value=await card.evaluate(el=>{const s=getComputedStyle(el),pseudo=getComputedStyle(el,'::after'),badge=el.querySelector('.almost-out-indicator');return {visible:getComputedStyle(badge).display!=='none',text:el.innerText.includes('ALMOST OUT'),animation:pseudo.animationName,content:pseudo.content,visual:{shadow:s.boxShadow,border:s.border,outline:s.outline,background:s.background,transform:s.transform,rect:JSON.stringify(el.getBoundingClientRect().toJSON()),children:Array.from(el.querySelectorAll('img,h2,h3,ul')).map(c=>JSON.stringify(c.getBoundingClientRect().toJSON()))}};});
  const warning=t%30000<5000;assert.equal(value.visible,warning,'Badge at '+t);assert.equal(value.text,warning,'Visible text at '+t);assert.deepEqual(value.visual,normal,'Exact normal styling/geometry at '+t);assert.equal(value.animation,warning?'almost-out-pulse':'none','Animation only in warning window');if(!warning)assert.equal(value.content,'none');
 }
 await page.emulateMedia({reducedMotion:'reduce'});
 for(const advance of [0,25000]){
  await page.clock.runFor(advance);
  const reduced=await card.evaluate(el=>({pulse:getComputedStyle(el,'::after').animationName,badge:getComputedStyle(el.querySelector('.almost-out-indicator')).display}));assert.equal(reduced.pulse,'none');assert.notEqual(reduced.badge,'none');await card.getByText('ALMOST OUT',{exact:true}).waitFor();
 }
 await page.emulateMedia({reducedMotion:'no-preference'});
};
