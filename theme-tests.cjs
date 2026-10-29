// Pokretanje: node theme-tests.cjs (bez dodatnih biblioteka).
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const source = fs.readFileSync(require('node:path').join(__dirname, 'theme.js'), 'utf8');
function launch(storage, blocked = false) {
  const button = { attrs: {}, setAttribute(key, value) { this.attrs[key] = value; }, addEventListener(type, fn) { this[type] = fn; } };
  const message = { textContent: '' };
  const document = {
    documentElement: { dataset: {} },
    querySelector: selector => selector === '#theme-toggle' ? button : message,
    addEventListener(type, fn) { this[type] = fn; }
  };
  vm.runInNewContext(source, { document, localStorage: {
    getItem(key) { if (blocked) throw Error('blocked'); return storage[key] ?? null; },
    setItem(key, value) { if (blocked) throw Error('blocked'); storage[key] = value; }
  } });
  // Tema se primenjuje i pre nego što je ostatak stranice spreman.
  const initialTheme = document.documentElement.dataset.theme;
  document.DOMContentLoaded();
  return { button, message, initialTheme, theme: () => document.documentElement.dataset.theme };
}
const storage = { 'moji-zadaci-v1': '[{"text":"Sačuvan zadatak","completed":false}]' };
const originalTasks = storage['moji-zadaci-v1'];
let app = launch(storage);
assert.equal(app.initialTheme, 'light');
assert.equal(app.button.textContent, 'Tamna tema');
assert.equal(app.button.attrs['aria-pressed'], 'false');
app.button.click();
assert.equal(app.theme(), 'dark');
assert.equal(app.button.textContent, 'Svetla tema');
assert.equal(app.button.attrs['aria-pressed'], 'true');
assert.equal(storage['moji-zadaci-tema-v1'], 'dark');
assert.equal(storage['moji-zadaci-v1'], originalTasks);
app = launch(storage);
assert.equal(app.initialTheme, 'dark');
assert.equal(app.button.attrs['aria-label'], 'Prebaci na svetlu temu');
app.button.click();
assert.equal(app.theme(), 'light');
assert.equal(storage['moji-zadaci-tema-v1'], 'light');
assert.equal(launch(storage).initialTheme, 'light');
assert.equal(launch({ 'moji-zadaci-tema-v1': 'neispravna-tema' }).initialTheme, 'light');
app = launch({}, true);
app.button.click();
assert.equal(app.theme(), 'dark');
assert.match(app.message.textContent, /nije sačuvan/);
assert.equal(storage['moji-zadaci-v1'], originalTasks);
console.log('Provere teme prolaze: oba smera prebacivanja, ponovno učitavanje izbora, pristupačne oznake, neispravan izbor, blokirano skladište i očuvani zadaci.');
