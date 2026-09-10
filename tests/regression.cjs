/* Isolated regression tests: business logic and simulated DOM, not browser layout tests. */
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const assert = require('node:assert/strict');
const crypto = require('node:crypto').webcrypto;
const root = path.resolve(__dirname, '../site');
let assertions = 0;
function check(value, message) { assert.ok(value, message); assertions++; }
function environment(local = {}, blocked = false, session = {}) {
  const ids = new Map(), ready = [], events = {}, alerts = [], timers = new Map(); let timerId = 0;
  class Element {
    constructor(tag = 'div') { this.tagName = tag.toUpperCase(); this.children = []; this.attrs = {}; this.value = ''; this.textContent = ''; this.style = {}; this.handlers = {}; this.disabled = false; this.hidden = false; this._classes = new Set(); this.classList = {
      add: c => this._classes.add(c), remove: c => this._classes.delete(c), contains: c => this._classes.has(c),
      toggle: (c,v) => { if (v === undefined) v = !this._classes.has(c); v ? this._classes.add(c) : this._classes.delete(c); return v; }
    }; }
    set className(v) { this._classes = new Set(v.split(/\s+/)); }
    get className() { return [...this._classes].join(' '); }
    set innerHTML(v) { this.html = v; this.children = []; }
    get innerHTML() { return this.html || ''; }
    appendChild(e) { this.children.push(e); e.parentElement = this; return e; }
    prepend(e) { this.children.unshift(e); e.parentElement = this; }
    remove() { if (this.parentElement) this.parentElement.children = this.parentElement.children.filter(e => e !== this); }
    setAttribute(k,v) { this.attrs[k] = String(v); }
    getAttribute(k) { return this.attrs[k] ?? null; }
    addEventListener(k,f) { (this.handlers[k] ||= []).push(f); }
    click() { if (this.disabled) return; if (this.onclick) this.onclick(); (this.handlers.click || []).forEach(f => f({preventDefault(){}})); }
    focus() {}
    querySelectorAll(selector) { const nodes = this.children.flatMap(e => [e,...e.querySelectorAll('*')]); if (selector === '*') return nodes; if (selector.startsWith('.')) return nodes.filter(e => e.classList.contains(selector.slice(1))); return []; }
    querySelector(s) { return this.querySelectorAll(s)[0] || null; }
    closest() { return this.parentElement || this; }
  }
  const get = id => { if (!ids.has(id)) { const e = new Element(); e.id = id; ids.set(id,e); } return ids.get(id); };
  const storage = bag => ({getItem(k){if(blocked)throw Error('blocked');return bag[k]??null;},setItem(k,v){if(blocked)throw Error('blocked');bag[k]=String(v);}});
  const doc = {body:new Element('body'),cookie:'',getElementById:get,querySelector:s=>s.startsWith('#')?get(s.slice(1)):null,querySelectorAll:()=>[],createElement:t=>new Element(t),createTextNode:t=>({textContent:t}),addEventListener:(n,f)=>{if(n==='DOMContentLoaded')ready.push(f);}};
  const ctx = {document:doc,localStorage:storage(local),sessionStorage:storage(session),Event:class{constructor(type){this.type=type;}},crypto,Uint32Array,URLSearchParams,
    location:{protocol:'http:',pathname:'/index.html',search:'',reload(){}},console:{log(){}},atob:s=>Buffer.from(s,'base64').toString('binary'),alert:m=>alerts.push(m),confirm:()=>true,
    setTimeout:f=>{timers.set(++timerId,f);return timerId;},setInterval:f=>{timers.set(++timerId,f);return timerId;},clearInterval:id=>timers.delete(id),clearTimeout:id=>timers.delete(id),matchMedia:()=>({matches:true}),
    addEventListener:(n,f)=>(events[n] ||= []).push(f),dispatchEvent:e=>(events[e.type]||[]).forEach(f=>f(e))};
  ctx.window=ctx; vm.createContext(ctx);
  const run = (s,name='test') => vm.runInContext(s,ctx,{filename:name});
  const load = name => run(fs.readFileSync(path.join(root,name),'utf8'),name);
  const page = (name, instrument=s=>s) => {for(const m of fs.readFileSync(path.join(root,name),'utf8').matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)){if(m[1].trim())run(instrument(m[1]),name);}};
  const start = () => {ready.forEach(f=>f()); if(ctx.onload)ctx.onload();};
  return {ctx,doc,get,run,load,page,start,local,session,alerts,timers};
}
// Stored progress migration, malformed values, disabled storage, and synchronization.
for (const invalid of ['broken','null','{}','42','["true",1]']) {
  const e=environment({collectedFlags:invalid});e.load('assets/js/lab-state.js');check(e.ctx.CDLabState.readFlags().length===18,'normalized 18 flags');check(e.ctx.CDLabState.countFlags()===0,'invalid values are not achievements');
}
for (const local of [{linuxLabSolved:'true'},{collectedFlags:JSON.stringify(Array.from({length:18},(_,i)=>i===17))}]) {
  const e=environment(local);e.load('assets/js/lab-state.js');check(e.ctx.CDLabState.isLinuxSolved(),'either legacy completion unlocks Expert');
  e.ctx.CDLabState.writeFlags([]);check(!e.ctx.CDLabState.isLinuxSolved(),'reset clears both legacy completion keys');
}
{
 const e=environment({},true);e.load('assets/js/lab-state.js');e.ctx.CDLabState.setFlag(18);check(e.ctx.CDLabState.isLinuxSolved(),'blocked storage retains page state');check(e.ctx.CDLabState.storageUnavailable(),'storage limitation is detectable');
}
{
 const local={};const a=environment(local),b=environment(local);a.load('assets/js/lab-state.js');b.load('assets/js/lab-state.js');a.ctx.CDLabState.setFlag(1);b.ctx.CDLabState.setFlag(2);check(a.ctx.CDLabState.countFlags()===2,'sequential writes from separate contexts preserve other flags');
}
// Home completion, Linux entry, persistent gates and hash pair.
{
 const e=environment();e.load('assets/js/lab-state.js');e.load('assets/js/home.js');
 for(let n=1;n<=18;n++){for(const id of n===7?['flag7a','flag7b']:['flag'+n]){const task=e.doc.createElement('div');task.className='task';task.appendChild(e.get(id));}}
 e.get('flag18').value='{LINUX_EXPLORER}';e.run("checkFlag(18,'e0xJTlVYX0VYUExPUkVSfQ==')");check(e.ctx.CDLabState.isLinuxSolved(),'home Linux flag unlocks Expert');
 e.get('analysis-password').value='user123';e.run('unlockAnalysis()');check(e.local['cdl-unlock-analysis']==='true','analysis gate persists');
 e.get('advanced-password').value='ArchiveDelta27';e.run('unlockAdvanced()');check(e.local['cdl-unlock-advanced']==='true','advanced gate persists');
 e.get('teacher-password').value='Teachers1x1';e.run('unlockTeacher()');check(e.session['cdl-unlock-teacher']==='true','teacher unlock stays in tab session');
 e.get('flag7a').value='{LET_HIM_COOK}';e.get('flag7b').value='{ADD_A_PINCH_OF_SALT}';e.run('checkHashFlags()');check(e.ctx.CDLabState.hasFlag(7),'hash pair saved');
 e.ctx.CDLabState.writeFlags(Array(18).fill(true));check(e.get('completion').textContent.includes('{Mission_accomplished}'),'completion available without external confetti');check(!e.get('completion').classList.contains('hidden'),'completion visible');
}
// Password heuristics, random generator and empty master-password guard.
{
 const e=environment();e.load('assets/js/password-lab.js');
 for(const value of ['a'.repeat(25),'abc'.repeat(12),'Password123456789!','1234567890123456789012345']) check(!e.run('assessPassword('+JSON.stringify(value)+').eligible'),'predictable password rejected');
 check(e.run("assessPassword('Kiesel Laterne Wolke Zitrone').eligible"),'long distinct-word demonstration accepted');
 for(let i=0;i<100;i++){const pw=e.run('generateSecurePassword()');check(pw.length===20&&/[A-Z]/.test(pw)&&/[a-z]/.test(pw)&&/\d/.test(pw)&&/[!@#$%^&*()]/.test(pw),'generator includes promised categories');check(e.run('assessPassword('+JSON.stringify(pw)+').eligible'),'generated demo meets lesson goal');}
 e.run('showStoredPasswords()');check(e.get('stored-passwords').classList.contains('hidden'),'empty master does not open vault');
 e.run('generateMasterPassword()');e.get('master-password-input').value=e.run('masterPassword');e.run('showStoredPasswords()');check(!e.get('stored-passwords').classList.contains('hidden'),'generated master opens vault');
 e.run('generateMasterPassword()');check(e.get('stored-passwords').classList.contains('hidden'),'regeneration closes old vault');
}
// Hash: both task answers and salt checksum.
{
 const e=environment();e.page('hash.html');for(const answer of ['password','test']){e.get('flag1').value=answer;e.run("checkFlag('password','{LET_HIM_COOK}')");check(e.alerts.at(-1).includes('{LET_HIM_COOK}'),'both advertised hash answers accepted');}
 const md5=require('node:crypto').createHash('md5').update('password1232023').digest('hex');e.get('flag2').value=md5;e.run('checkBonusFlag()');check(e.alerts.at(-1).includes('{ADD_A_PINCH_OF_SALT}'),'salt answer verified independently');
}
// SQL: all three interactions required; no tautology for plain text alone.
{
 const e=environment();e.load('assets/js/lab-state.js');e.page('sql-lab.html');e.start();
 check(e.run("insecureQuery('or true').length")===0,'SQL literal or true does not become injection');
 e.get('safe-name').value='alice';e.get('run-safe-demo').click();check(!e.get('sql-earned-flag').textContent,'normal search alone has no flag');
 const payload="' OR '1'='1' --";e.get('unsafe-name').value=payload;e.get('run-unsafe-demo').click();check(!e.get('sql-earned-flag').textContent,'injection alone has no completion');
 e.get('secure-name').value='bob';e.get('run-secure-demo').click();check(!e.get('sql-earned-flag').textContent,'different secure input does not complete mission');
 e.get('secure-name').value=payload;e.get('run-secure-demo').click();check(e.get('sql-earned-flag').textContent.includes('{YOUDIDWHAT?}'),'SQL mission awards exact expected flag');
}
// Quiz: cannot skip, no auto advance, retry only mistakes, final flag after correction.
{
 const e=environment();e.page('phishingquiz.html',s=>s.replace('let currentEmailIndex = 0;','window.testPool = emailPool; let currentEmailIndex = 0;'));e.start();
 const count=e.ctx.testPool.length;const initial=e.get('email-header').textContent;e.get('next-email-btn').click();check(initial===e.get('email-header').textContent,'unanswered quiz mail cannot be skipped');
 for(let i=0;i<count;i++){
  const mail=e.ctx.testPool.find(m=>e.get('email-header').textContent.includes(m.sender));assert.ok(mail);
  const choice=i===0?!mail.isPhishing:mail.isPhishing;e.get(choice?'phishing-btn':'not-phishing-btn').click();check(e.timers.size===0,'quiz never auto advances');e.get('next-email-btn').click();
 }
 check(!e.get('result').textContent.includes('{CAUGHT_ALL_THE_PHISH}'),'wrong answer prevents final flag');
 const retry=e.get('result').children.find(c=>c.tagName==='BUTTON');check(Boolean(retry),'targeted retry offered');retry.click();
 const mail=e.ctx.testPool.find(m=>e.get('email-header').textContent.includes(m.sender));e.get(mail.isPhishing?'phishing-btn':'not-phishing-btn').click();e.get('next-email-btn').click();check(e.get('result').textContent.includes('{CAUGHT_ALL_THE_PHISH}'),'corrected quiz awards flag');
}
// Social engineering: timed chat, answer gating, delayed reply, and retry.
{
 const e=environment();e.page('social-engineering.html');e.start();const count=e.run('scenarios.length');
 function tick(){const [id,fn]=[...e.timers.entries()][0];e.timers.delete(id);fn();}
 function drain(){let limit=50;while(e.timers.size&&limit-->0)tick();assert.ok(limit>0);}
 check(e.get('chat-window').children.length===1,'chat starts with a single message');
 check(e.get('choices-container').children.length===0,'answers wait for the conversation');
 check(e.timers.size===1,'one timer for the next message');
 tick();check(e.get('chat-window').children.length===2,'second message arrives on the next tick');
 e.run('loadScenario(); loadScenario()');check(e.timers.size===1,'scenario restart cancels stale timers');
 for(let i=0;i<count;i++){
  drain();
  check(e.get('choices-container').children.length>0,'choices appear after the chat');
  e.run('handleChoice(scenarios[currentScenarioIndex].conversation.find(s=>s.type==="choice").choices.find(c=>c.correct==='+String(i!==0)+'))');
  check(e.get('choices-container').children.length===0,'next button waits for final reply');
  drain();e.get('choices-container').children[0].click();
 }
 check(!e.get('flag-container').children.some(c=>c.textContent.includes('{DEFENDER_OF_TRUST}')),'social wrong choice does not earn flag');
 e.get('choices-container').children[0].click();
 check(e.get('chat-window').children.length===1,'retry also starts one message at a time');
 drain();e.run('handleChoice(scenarios[currentScenarioIndex].conversation.find(s=>s.type==="choice").choices.find(c=>c.correct))');drain();e.get('choices-container').children[0].click();
 check(e.get('flag-container').children.some(c=>c.textContent.includes('{DEFENDER_OF_TRUST}')),'social correction earns flag');
 check(e.timers.size===0,'no pending chat timers after completion');
}
// Repeated brute-force clicks cancel the previous run.
{
 const e=environment();e.page('bruteforce.html');e.get('targetUsername').value='admin';e.run('startSimulation(); startSimulation()');check(e.timers.size===1,'single brute force timer');
 const callback=[...e.timers.values()][0];for(let i=0;i<68&&e.timers.size;i++)callback();check(e.get('simulation').textContent.includes('SUCCESS'),'simulation still reaches admin password');check(e.timers.size===0,'successful scan clears timer');
}
console.log(`PASS: ${assertions} isolated assertions. Browser visual QA is not covered by this harness.`);
