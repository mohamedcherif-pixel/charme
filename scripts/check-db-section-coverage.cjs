const fs = require('fs');
const vm = require('vm');

const servicePath = 'js/fragrance-api-service.js';
const code = fs.readFileSync(servicePath, 'utf8');

const sandbox = {
  console,
  window: {},
  document: {},
  setTimeout: () => {},
  clearTimeout: () => {},
};
vm.createContext(sandbox);
vm.runInContext(code, sandbox);

const FragranceAPIService = sandbox.window.FragranceAPIService || sandbox.FragranceAPIService;
if (!FragranceAPIService) {
  console.log('Could not load FragranceAPIService');
  process.exit(1);
}

const service = new FragranceAPIService();
const dbNames = Object.keys(service.comprehensiveDatabase || {});

const indexHtml = fs.readFileSync('index.html', 'utf8');
const sectionIds = [...indexHtml.matchAll(/<section class="content [^"]*" id="([^"]+)"/g)].map((m) => m[1]);

console.log(`Database fragrances: ${dbNames.length}`);
console.log(`Page section IDs: ${sectionIds.length}`);
