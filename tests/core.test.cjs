'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.join(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const core=html.match(/<script id="kome-core">([\s\S]*?)<\/script>/)[1];
const context=vm.createContext({});
vm.runInContext(core,context);
const K=context.Kome;
const clone=x=>JSON.parse(JSON.stringify(x));
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} != ${b}`);
test('the single HTML contains syntactically valid inline application and math',()=>{
  new vm.Script(core);
  new vm.Script(html.match(/<script id="kome-app">([\s\S]*?)<\/script>/)[1]);
  assert.ok(!/<script\b[^>]*\bsrc=|@import|https?:\/\/[^"']*\.(?:woff|css)/i.test(html));
});
test('default food arithmetic preserves independent energy and macros',()=>{
  const s=K.defaults(),m=s.meals[0],t=K.mealTotal(m);
  near(75*K.FOOD.rice.kcal/100,268.5);
  near(175*K.FOOD.chicken.kcal/100,262.5);
  near(400*K.FOOD.standard.kcal/100,160);
  near(5*K.FOOD.oil.kcal/100,44.2);
  near(t.kcal,735.2);near(t.p,42.125);near(t.c,95.25);near(t.f,19.375);
  const d=K.dayTotal(s);near(d.kcal,1470.4);near(d.p,84.25);
  assert.notEqual(t.kcal,t.p*4+t.c*4+t.f*9);
  near(K.go(m.rice),.5);near(K.go(m.rice*2),1);
});
test('tiers add independently and never move rice or chicken',()=>{
  const m=K.defaults().meals[0],base=K.mealTotal(m);
  m.light=200;m.starchy=150;
  near(K.mealTotal(m).kcal,base.kcal+50+127.5);
  assert.equal(m.rice,75);assert.equal(m.chicken,175);
  for(const name of ['regular','extra','larger','autumn','green','summer']){
    const p=K.preset(m,name);assert.equal(p.rice,75);assert.equal(p.chicken,175);
  }
});
test('rice cooker preset is modest and explicit',()=>{
  const m=K.preset({...K.defaults().meals[0],recipe:'cooker'},'regular');
  assert.equal(m.standard,100);assert.equal(m.light+m.standard+m.starchy,100);
  assert.equal(m.rice,75);assert.equal(m.chicken,175);
});
test('snacks are counted once across both independent meals',()=>{
  const s=K.defaults();s.snacks.whey=30;s.snacks.skyr=200;s.snacks.almonds=25;
  near(K.snackTotal(s.snacks).kcal,384.75);
  near(K.snackTotal(s.snacks).p,51.25);
  near(K.dayTotal(s).kcal,1855.15);
  s.meals[1].standard=100;near(K.dayTotal(s).kcal,1735.15);
});
test('edited food assumptions affect all estimates without changing quantities',()=>{
  const s=K.defaults();s.nutrition.chicken.kcal=180;s.nutrition.whey.p=70;s.snacks.whey=30;
  near(K.dayTotal(s).kcal,1695.4);near(K.snackTotal(s.snacks,s.nutrition).p,21);
  assert.equal(s.meals[0].chicken,175);
});
test('six 175 g portions in a 1050 g pack and a partial bag',()=>{
  const a=K.portions(1050);assert.equal(a.count,6);assert.equal(a.remainder,0);assert.equal(a.bags,6);
  const b=K.portions(1100);assert.equal(b.count,6);assert.equal(b.remainder,50);assert.equal(b.bags,7);
  assert.equal(K.portions(0).bags,0);
});
test('backup round trip covers all persistent fields',()=>{
  const s=clone(K.defaults());s.theme='dark';s.meals[1].light=235;s.sessions=[{date:'2026-01-02',workout:'B'}];s.swaps={A0:3,B4:2};s.walking={date:'2026-01-02',minutes:17};s.checkin={date:'2026-01-02',workout:'A',sets:{'A0-0':true}};
  assert.deepEqual(clone(K.validate(JSON.parse(JSON.stringify(s)))),s);
});
test('malformed, non-finite, out-of-range and wrong-version backups are rejected',()=>{
  const cases=[s=>s.version=2,s=>s.meals=[],s=>s.meals[0].rice=-1,s=>s.meals[0].oil=21,s=>s.meals[0].chicken=Infinity,s=>s.meals[0].standard=NaN,s=>s.meals[0].starchy=401,s=>s.meals[0].rice='75',s=>s.meals[0].rice=75.5,s=>s.meals[0].recipe='<img onerror=alert(1)>',s=>s.theme='evil',s=>s.energy=0,s=>s.proteinMin=200,s=>s.snacks.whey=1001,s=>s.pantry=['<script>'],s=>s.nutrition.rice.p=101,s=>s.nutrition.oil.kcal=-1,s=>s.sessions=[{date:'2026-02-30',workout:'A'}],s=>s.swaps={constructor:1},s=>s.swaps={A9:1},s=>s.checkin.sets={'A0-0':'true'},s=>s.shoppingDays=15,s=>s.pack=-1];
  for(const change of cases){const s=clone(K.defaults());change(s);assert.throws(()=>K.validate(s));}
  for(const s of [null,[],{},'hello',42])assert.throws(()=>K.validate(s));
});
test('unknown object properties and imported display strings are discarded',()=>{
  const s=clone(K.defaults());s.nutrition.rice.name='<img src=x onerror=alert(1)>';s.nutrition.rice.evil='no';s.secret='no';s.meals[0].evil='no';
  const out=K.validate(s);assert.equal(out.nutrition.rice.name,K.FOOD.rice.name);assert.equal(out.secret,undefined);assert.equal(out.meals[0].evil,undefined);assert.equal(out.nutrition.rice.evil,undefined);
});
test('zero and maximum boundary meals are valid and finite',()=>{
  for(const edge of [0,1]){const s=clone(K.defaults());for(const m of s.meals)for(const [k,range]of Object.entries(K.LIMITS))m[k]=range[edge];const result=K.validate(s);for(const n of Object.values(K.dayTotal(result)))assert.ok(Number.isFinite(n)&&n>=0);}
});
test('service worker and manifest remain relative to a project subpath',()=>{
  const manifest=JSON.parse(fs.readFileSync(path.join(root,'manifest.webmanifest'),'utf8'));
  assert.equal(manifest.start_url,'./');assert.equal(manifest.scope,'./');
  const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');new vm.Script(sw);
  assert.ok(html.includes("register('./sw.js')"));assert.ok(sw.includes("new URL('./', self.location.href)"));
  for(const asset of ['index.html','sw.js','manifest.webmanifest','icon.svg','apple-touch-icon.png'])assert.ok(fs.existsSync(path.join(root,asset)),asset);
});
