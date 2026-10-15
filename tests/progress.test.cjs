const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const dir=path.join(__dirname,'../dist');
const ctx=vm.createContext({});
vm.runInContext(fs.readFileSync(path.join(dir,'progress.js'),'utf8')+'\n'+fs.readFileSync(path.join(dir,'extra-cases.js'),'utf8')+'\n'+fs.readFileSync(path.join(dir,'app.js'),'utf8').split("const KEY=")[0]+'\nthis.restore = raw => readProgress(raw,cases);',ctx);
const restore=value=>JSON.parse(JSON.stringify(ctx.restore(typeof value==='string'?value:JSON.stringify(value))));
test('Missing, malformed and primitive data recover to a playable empty state',()=>{
  for(const value of [null,'{broken',42,[],true]) assert.deepEqual(restore(value),{best:{},current:0,runs:{}});
});
test('Legacy saves retain best scores and current case',()=>{
  assert.deepEqual(restore({best:{0:850,7:1000},current:7}),{best:{0:850,7:1000},current:7,runs:{}});
});
test('Invalid case IDs and scores cannot inflate completion or totals',()=>{
  const result=restore({best:{0:1000,'01':1000,'1.5':1000,20:1000,'-1':1000,2:1001,3:-1,4:'1000',5:1.5},current:999});
  assert.deepEqual(result.best,{'0':1000});assert.equal(result.current,0);
});
test('Array-shaped score maps are rejected',()=>assert.deepEqual(restore({best:[1000]}).best,{}));
test('Partial investigation roundtrips, including power, hints and wrong answers',()=>{
  const run={power:false,tests:[0,2],wrong:[0,3],hint:true,penalty:400,diagnosed:false,solved:false};
  assert.deepEqual(restore({runs:{1:run}}).runs['1'],run);
});
test('Penalty is derived from unique wrong answers and one hint',()=>{
  const run=restore({runs:{1:{tests:[0,0,2,999],wrong:[0,0,1,2,9],hint:true,penalty:-100}}}).runs['1'];
  assert.deepEqual(run.tests,[0,2]);assert.deepEqual(run.wrong,[0,2]);assert.equal(run.penalty,400);
});
test('Unrepaired source cannot become powered on by restoring a save',()=>{
  assert.equal(restore({runs:{0:{tests:[0,2],diagnosed:true,power:true}}}).runs['0'].power,false);
});
test('Completed investigation retains result and safe powered state',()=>{
  const run=restore({runs:{0:{tests:[0,2],diagnosed:true,solved:true,power:false}}}).runs['0'];
  assert.equal(run.solved,true);assert.equal(run.power,true);
});
test('Incomplete evidence cannot restore a completed diagnostic',()=>{
  const run=restore({runs:{2:{tests:[0],diagnosed:true,solved:true}}}).runs['2'];
  assert.equal(run.diagnosed,false);assert.equal(run.solved,false);
});
test('Invalid run records do not prevent valid cases from loading',()=>{
  const result=restore({runs:{1:null,2:[],99:{},3:{tests:'invalid',wrong:null}}});
  assert.deepEqual(Object.keys(result.runs),['3']);assert.deepEqual(result.runs['3'].tests,[]);
});
test('All 20 cases have playable and distinct definitions',()=>{
  const all=JSON.parse(vm.runInContext('JSON.stringify(cases)',ctx));
  assert.equal(all.length,20);assert.equal(new Set(all.map(c=>c.title)).size,20);
  for(const c of all){assert.equal(c.tests.length,3);assert.equal(c.options.length,4);assert.ok(Number.isInteger(c.answer)&&c.answer>=0&&c.answer<4);assert.ok(c.repair&&c.why&&c.hint);for(const t of c.tests){assert.equal(t.length,3);assert.ok(['on','off','any'].includes(t[2]));}}
});
test('Eight-case saves migrate without losing scores or completing twenty cases',()=>{
  const best=Object.fromEntries(Array.from({length:8},(_,i)=>[i,1000]));
  const loaded=restore({best,current:7});assert.deepEqual(loaded.best,best);assert.equal(Object.keys(loaded.best).length,8);assert.equal(Object.values(loaded.best).reduce((a,b)=>a+b,0),8000);
});
test('New case 20 supports saved investigation and total reaches 20000',()=>{
  const best=Object.fromEntries(Array.from({length:20},(_,i)=>[i,1000]));
  const loaded=restore({best,current:19,runs:{19:{tests:[0,1,2],diagnosed:true,solved:true}}});
  assert.equal(loaded.current,19);assert.equal(loaded.runs['19'].solved,true);assert.equal(Object.values(loaded.best).reduce((a,b)=>a+b,0),20000);
});
