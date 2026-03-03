const fs = require('fs');
let script = fs.readFileSync('script.js', 'utf8');

const factoryStart = script.indexOf('function createParallaxUpdater(element, triggerOffset, range, transformFn) {');
const factoryEnd = script.indexOf('  const newSectionParallaxUpdaters = [];');

const newFactory = `function createParallaxUpdater(element, triggerOffset, range, transformFn) {
    let _lastEased = -1; // skip redundant style writes
    let section = element.closest('.content') || element.parentElement;

    return function() {
      if (!section) return;
      
      const scrollTop = (window._globalScrollTop !== undefined ? window._globalScrollTop : (window.pageYOffset || document.documentElement.scrollTop));
      const windowH = window.innerHeight;
      const sectionTop = _getOffsetTop(section);
      
      const triggerPoint = sectionTop - windowH * triggerOffset;
      let eased;
      if (scrollTop > triggerPoint) {
        const progress = Math.min((scrollTop - triggerPoint) / range, 1);
        eased = 1 - Math.pow(1 - progress, 4);
      } else {
        eased = 0;
      }
      
      // Round to 3 decimals to reduce redundant writes
      eased = Math.round(eased * 1000) / 1000;
      if (eased === _lastEased) return;
      _lastEased = eased;
      
      if (eased > 0 && eased < 1) { // Active movement phase
        activateParallaxElement(element);
        element.classList.add('parallax-active');
      } else {
        // Returned to bounds, restore normal hover transitions smoothly
        element.classList.remove('parallax-active');
      }
      
      const { transform, opacity } = transformFn(eased);
      element.style.transform = transform;
      element.style.opacity = opacity;
    };
  }

`;

script = script.substring(0, factoryStart) + newFactory + script.substring(factoryEnd);
fs.writeFileSync('script.js', script);
console.log('Fixed createParallaxUpdater!');
