const fs = require('fs');

let content = fs.readFileSync('script.js', 'utf8');

// Insert the resetParallaxElement function at the top (after import statements / global vars if needed, let's put it near the top)
const resetFunction = `
// Caches element zero-state to prevent layout thrashing
const _parallaxZeroState = new WeakSet();
function resetParallaxElement(element, transformString) {
  if (!element || _parallaxZeroState.has(element)) return;
  element.classList.remove("parallax-active");
  element.style.transform = transformString;
  element.style.opacity = "0";
  _parallaxZeroState.add(element);
}
// Removes from zero-state set when made active
function activateParallaxElement(element) {
  if (element && _parallaxZeroState.has(element)) {
    _parallaxZeroState.delete(element);
  }
}
`;

if (!content.includes('resetParallaxElement')) {
  content = resetFunction + '\n' + content;
}

// Now replace element.classList.remove("parallax-active") blocks inside else blocks
// Pattern looks for:
// <element>.classList.remove("parallax-active");
// <element>.style.transform = "<transform>";
// <element>.style.opacity = "0";
const replaceRegex = /(\w+)\.classList\.remove\((["'])parallax-active\2\);\s*\n\s*\1\.style\.transform\s*=\s*(["'])([^"']+)\3;\s*\n\s*\1\.style\.opacity\s*=\s*(["'])0\5;/g;

content = content.replace(replaceRegex, (match, el, q1, q2, transformStr) => {
  return `resetParallaxElement(${el}, "${transformStr}");`;
});

// We also need to add activateParallaxElement(el) where it adds parallax-active
const addRegex = /(\w+)\.classList\.add\((["'])parallax-active\2\);/g;
content = content.replace(addRegex, (match, el) => {
  return `activateParallaxElement(${el});\n        ${match}`;
});

fs.writeFileSync('script.js', content, 'utf8');
console.log("Patched script.js!");
