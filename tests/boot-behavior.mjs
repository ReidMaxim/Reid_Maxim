import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const source=readFileSync(new URL('../script.js',import.meta.url),'utf8');
function harness({reduce=false,seen=false,hash=''}={}) {
 const handlers={},timers=[];let frames=0;
 const el=id=>({id,hidden:id==='boot',style:{},classList:{add(){},remove(){}},focus(){},addEventListener(type,fn){handlers[id+':'+type]=fn;},after(){}});
 const boot=el('boot'),art=el('boot-art'),skip=el('skip'),replay=el('replay'),page=el('page'),body=el('body');
 const elements={boot,'boot-art':art,skip,replay};
 const motion={matches:reduce,addEventListener(type,fn){handlers['motion:'+type]=fn;}};
 const context={document:{body,activeElement:body,getElementById:id=>elements[id],createElement:()=>page,querySelector:()=>el('anchor'),addEventListener(type,fn){handlers['document:'+type]=fn;}},matchMedia:()=>motion,location:{hash},sessionStorage:{getItem:()=>seen?'seen':null,setItem(){}},window:{scrollTo(){}},setTimeout(fn){timers.push(fn);return 1;},clearTimeout(){},requestAnimationFrame(){frames++;return 1;},cancelAnimationFrame(){}};
 vm.runInNewContext(source,context);return {boot,page,handlers,timers,get frames(){return frames;}};
}
const reduced=harness({reduce:true});assert.equal(reduced.boot.hidden,true);reduced.handlers['replay:click']();assert.equal(reduced.boot.hidden,true);assert.equal(reduced.timers.length,0);
assert.equal(harness({seen:true}).boot.hidden,true);assert.equal(harness({hash:'#research'}).boot.hidden,true);
const loading=harness();assert.equal(loading.boot.hidden,false);assert.equal(loading.page.inert,true);loading.handlers['skip:click']();assert.equal(loading.boot.hidden,true);assert.equal(loading.page.inert,false);
const failure=harness();failure.timers[0]();assert.equal(failure.boot.hidden,true);assert.equal(failure.page.inert,false);
const change=harness();change.handlers['motion:change']({matches:true});assert.equal(change.boot.hidden,true);
console.log('PASS: reduced-motion bypass and replay guard, repeat-visit/hash bypass, skip release, asset-load timeout, preference-change exit. VM behavior tests; not browser media emulation.');
