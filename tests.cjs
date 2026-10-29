// Pokretanje: node tests.cjs (samo ugrađeni Node.js moduli).
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const source = fs.readFileSync(require('node:path').join(__dirname,'script.js'),'utf8');
class Element {
  constructor() { this.children=[]; this.value=''; this.textContent=''; this.listeners={}; }
  append(...nodes) { this.children.push(...nodes); }
  replaceChildren() { this.children=[]; }
  addEventListener(name,fn) { this.listeners[name]=fn; }
  setAttribute() {} focus() {} reportValidity() {} setCustomValidity(text) { this.validation=text; }
  querySelector(tag) { return this.children.find(node=>node.tag===tag) || this.children.map(node=>node.querySelector(tag)).find(Boolean); }
  fire(name) { this.listeners[name]({preventDefault(){}}); }
}
function launch(storage, broken=false) {
  const elements = new Map();
  const get = selector => { if(!elements.has(selector)) elements.set(selector,new Element()); return elements.get(selector); };
  ['#filter-status','#filter-priority','#filter-due'].forEach(id=>get(id).value='svi');
  get('#task-priority').value='srednji';
  get('#task-form').reset = () => { get('#task-input').value='';get('#task-priority').value='srednji';get('#task-due').value=''; };
  const context = vm.createContext({document:{querySelector:get,createElement(tag){const e=new Element();e.tag=tag;return e;}},localStorage:{getItem(key){return storage[key]||null;},setItem(key,value){if(broken)throw Error('blocked');storage[key]=value;}},Intl,Date,setInterval(){}});
  vm.runInContext(source,context);
  return {get,read:expression=>vm.runInContext(expression,context),add(text,priority='srednji',due=''){get('#task-input').value=text;get('#task-priority').value=priority;get('#task-due').value=due;get('#task-form').fire('submit');}};
}
const storage={'moji-zadaci-v1':JSON.stringify([{text:'Stari zadatak',completed:false}])};
let app=launch(storage);
assert.equal(app.read('tasks[0].priority'),'srednji');
assert.equal(app.read('tasks[0].due'),'');
app.add('  Važan izveštaj  ','visok','2020-01-01');
app.add('Kupovina','nizak');
assert.equal(app.read('tasks.length'),3);
assert.equal(app.read('tasks[1].text'),'Važan izveštaj');
assert.equal(JSON.parse(storage['moji-zadaci-v1'])[1].due,'2020-01-01');
app.get('#search').value='VAZAN'; app.get('#search').fire('input');
assert.equal(app.get('#task-list').children.length,1);
app.get('#filter-priority').value='nizak';app.get('#filter-priority').fire('change');
assert.equal(app.get('#task-list').children.length,0);
assert.equal(app.get('#empty-state').hidden,false);
app.get('#reset-filters').fire('click');
assert.equal(app.get('#task-list').children.length,3);
app.get('#filter-due').value='kasni';app.get('#filter-due').fire('change');
assert.equal(app.get('#task-list').children.length,1);
const checkbox=app.get('#task-list').children[0].querySelector('input'); checkbox.checked=true;checkbox.fire('change');
assert.equal(app.get('#task-list').children.length,0);
assert.equal(JSON.parse(storage['moji-zadaci-v1'])[1].completed,true);
app=launch(storage);
assert.equal(app.read('tasks.length'),3);
assert.equal(app.read('tasks[1].completed'),true);
assert.equal(app.read('tasks[1].priority'),'visok');
app.get('#filter-status').value='zavrseni';app.get('#filter-status').fire('change');
assert.equal(app.get('#task-list').children.length,1);
app.get('#task-list').children[0].querySelector('button').fire('click');
assert.equal(app.read('tasks.length'),2);
assert.equal(JSON.parse(storage['moji-zadaci-v1']).some(t=>t.text==='Važan izveštaj'),false);
app=launch(storage);assert.equal(app.read('tasks.length'),2);
app.add('   ');assert.equal(app.read('tasks.length'),2);
app.get('#filter-due').value='bez';app.get('#filter-due').fire('change');assert.equal(app.get('#task-list').children.length,2);
app.get('#reset-filters').fire('click');
app.add('<img src=x onerror=alert(1)>');
assert.equal(app.get('#task-list').children[2].querySelector('label').children[1].textContent,'<img src=x onerror=alert(1)>');
assert.equal(app.read('validDate("2026-02-30")'),false);
assert.equal(app.read('validDate("2028-02-29")'),true);
app.add('Danas','srednji',app.read('today()'));app.get('#filter-due').value='danas';app.get('#filter-due').fire('change');assert.equal(app.get('#task-list').children.length,1);
assert.equal(launch({'moji-zadaci-v1':'{broken'}).read('tasks.length'),0);
const blocked=launch({},true);blocked.add('Privremeno');assert.match(blocked.get('#status').textContent,/Čuvanje nije uspelo/);
console.log('Sve provere prolaze: migracija, dodavanje, prioriteti, datumi, kombinovani filteri, pretraga, završavanje, brisanje, ponovno učitavanje, neispravni podaci i blokirano čuvanje.');
