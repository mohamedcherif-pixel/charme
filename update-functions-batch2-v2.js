const fs = require('fs');

let script = fs.readFileSync('script.js', 'utf8');

// ============================================================================
// 1) Update getProductDetails() #2 — simpler version with just name/brand/image
// ============================================================================

// Use regex to find blv entry and the closing of products object
const pd2Pattern = /blv:\s*\{\s*name:\s*"Man in Black",\s*brand:\s*"Bvlgari",\s*image:\s*"bvlgari-man-in-black\.png"\s*\},?\s*\};\s*return products\[productId\];/;

const pd2Match = script.match(pd2Pattern);
if (pd2Match) {
    const newPD2 = `blv: { name: "Man in Black", brand: "Bvlgari", image: "bvlgari-man-in-black.png" },
      diorhomme: { name: "Homme Intense", brand: "Dior", image: "dior-homme-intense.png" },
      allure: { name: "Allure Homme Sport", brand: "Chanel", image: "chanel-allure-sport.png" },
      tuscanleather: { name: "Tuscan Leather", brand: "Tom Ford", image: "tom-ford-tuscan-leather.png" },
      armanicode: { name: "Armani Code Absolu", brand: "Giorgio Armani", image: "armani-code-absolu.png" },
      lhommeideal: { name: "L'Homme Idéal EDP", brand: "Guerlain", image: "guerlain-lhomme-ideal.png" },
      terredhermes: { name: "Terre d'Hermès", brand: "Hermès", image: "terre-dhermes.png" },
      gentleman: { name: "Gentleman EDP", brand: "Givenchy", image: "givenchy-gentleman.png" },
      wantedbynight: { name: "The Most Wanted", brand: "Azzaro", image: "azzaro-most-wanted.png" },
      kbyDG: { name: "K by Dolce & Gabbana", brand: "Dolce & Gabbana", image: "k-by-dg.png" },
      leaudissey: { name: "L'Eau d'Issey Pour Homme", brand: "Issey Miyake", image: "issey-miyake-pour-homme.png" },
      chbadboy: { name: "Bad Boy", brand: "Carolina Herrera", image: "carolina-herrera-bad-boy.png" },
      ysllibre: { name: "Libre EDP", brand: "Yves Saint Laurent", image: "ysl-libre.png" },
      fireplace: { name: "By the Fireplace", brand: "Maison Margiela", image: "margiela-fireplace.png" },
      pradacarbon: { name: "Luna Rossa Carbon", brand: "Prada", image: "prada-luna-rossa-carbon.png" },
      burberryhero: { name: "Hero EDP", brand: "Burberry", image: "burberry-hero.png" },
      narcisoforhim: { name: "For Him Bleu Noir", brand: "Narciso Rodriguez", image: "narciso-bleu-noir.png" },
      cketernity: { name: "Eternity for Men", brand: "Calvin Klein", image: "ck-eternity.png" },
      gucciguilty: { name: "Guilty Pour Homme", brand: "Gucci", image: "gucci-guilty.png" },
      valentinodonna: { name: "Born in Roma Donna", brand: "Valentino", image: "valentino-donna.png" },
      greenirish: { name: "Green Irish Tweed", brand: "Creed", image: "creed-green-irish-tweed.png" },
      egoiste: { name: "Égoïste Platinum", brand: "Chanel", image: "chanel-egoiste.png" },
      amenpure: { name: "A*Men Pure Havane", brand: "Mugler", image: "mugler-pure-havane.png" },
      declarationcartier: { name: "Déclaration d'un Soir", brand: "Cartier", image: "cartier-declaration.png" },
      laween: { name: "La Yuqawam", brand: "Rasasi", image: "rasasi-la-yuqawam.png" },
      cedarsmancera: { name: "Cedrat Boisé", brand: "Mancera", image: "mancera-cedrat-boise.png" },
      reflectionman: { name: "Reflection Man", brand: "Amouage", image: "amouage-reflection-man.png" },
      sedley: { name: "Sedley", brand: "Parfums de Marly", image: "pdm-sedley.png" },
      sideeffect: { name: "Side Effect", brand: "Initio", image: "initio-side-effect.png" },
      naxos: { name: "Naxos", brand: "Xerjoff", image: "xerjoff-naxos.png" },
      grandSoir: { name: "Grand Soir", brand: "Maison Francis Kurkdjian", image: "mfk-grand-soir.png" },
    };
    return products[productId];`;
    
    script = script.replace(pd2Pattern, newPD2);
    console.log('✓ Updated getProductDetails() #2');
} else {
    console.log('✗ Could not find getProductDetails() #2');
}

// ============================================================================
// 2) Update getFragranceData() — add entries before closing
// ============================================================================

const gfdPattern = /image:\s*'bvlgari-man-in-black\.png'\s*\}\s*\};\s*return fragrances\[fragranceId\]/;

const gfdMatch = script.match(gfdPattern);
if (gfdMatch) {
    const newGFD = `image: 'bvlgari-man-in-black.png'
      },
      diorhomme: { name: 'Homme Intense', brand: 'Dior', price: '$50', image: 'dior-homme-intense.png' },
      allure: { name: 'Allure Homme Sport', brand: 'Chanel', price: '$50', image: 'chanel-allure-sport.png' },
      tuscanleather: { name: 'Tuscan Leather', brand: 'Tom Ford', price: '$65', image: 'tom-ford-tuscan-leather.png' },
      armanicode: { name: 'Armani Code Absolu', brand: 'Giorgio Armani', price: '$45', image: 'armani-code-absolu.png' },
      lhommeideal: { name: "L'Homme Idéal EDP", brand: 'Guerlain', price: '$50', image: 'guerlain-lhomme-ideal.png' },
      terredhermes: { name: "Terre d'Hermès", brand: 'Hermès', price: '$55', image: 'terre-dhermes.png' },
      gentleman: { name: 'Gentleman EDP', brand: 'Givenchy', price: '$45', image: 'givenchy-gentleman.png' },
      wantedbynight: { name: 'The Most Wanted', brand: 'Azzaro', price: '$40', image: 'azzaro-most-wanted.png' },
      kbyDG: { name: 'K by Dolce & Gabbana', brand: 'Dolce & Gabbana', price: '$40', image: 'k-by-dg.png' },
      leaudissey: { name: "L'Eau d'Issey Pour Homme", brand: 'Issey Miyake', price: '$35', image: 'issey-miyake-pour-homme.png' },
      chbadboy: { name: 'Bad Boy', brand: 'Carolina Herrera', price: '$45', image: 'carolina-herrera-bad-boy.png' },
      ysllibre: { name: 'Libre EDP', brand: 'Yves Saint Laurent', price: '$50', image: 'ysl-libre.png' },
      fireplace: { name: 'By the Fireplace', brand: 'Maison Margiela', price: '$55', image: 'margiela-fireplace.png' },
      pradacarbon: { name: 'Luna Rossa Carbon', brand: 'Prada', price: '$45', image: 'prada-luna-rossa-carbon.png' },
      burberryhero: { name: 'Hero EDP', brand: 'Burberry', price: '$45', image: 'burberry-hero.png' },
      narcisoforhim: { name: 'For Him Bleu Noir', brand: 'Narciso Rodriguez', price: '$45', image: 'narciso-bleu-noir.png' },
      cketernity: { name: 'Eternity for Men', brand: 'Calvin Klein', price: '$30', image: 'ck-eternity.png' },
      gucciguilty: { name: 'Guilty Pour Homme', brand: 'Gucci', price: '$45', image: 'gucci-guilty.png' },
      valentinodonna: { name: 'Born in Roma Donna', brand: 'Valentino', price: '$50', image: 'valentino-donna.png' },
      greenirish: { name: 'Green Irish Tweed', brand: 'Creed', price: '$65', image: 'creed-green-irish-tweed.png' },
      egoiste: { name: 'Égoïste Platinum', brand: 'Chanel', price: '$50', image: 'chanel-egoiste.png' },
      amenpure: { name: "A*Men Pure Havane", brand: 'Mugler', price: '$45', image: 'mugler-pure-havane.png' },
      declarationcartier: { name: "Déclaration d'un Soir", brand: 'Cartier', price: '$45', image: 'cartier-declaration.png' },
      laween: { name: 'La Yuqawam', brand: 'Rasasi', price: '$40', image: 'rasasi-la-yuqawam.png' },
      cedarsmancera: { name: 'Cedrat Boisé', brand: 'Mancera', price: '$45', image: 'mancera-cedrat-boise.png' },
      reflectionman: { name: 'Reflection Man', brand: 'Amouage', price: '$60', image: 'amouage-reflection-man.png' },
      sedley: { name: 'Sedley', brand: 'Parfums de Marly', price: '$60', image: 'pdm-sedley.png' },
      sideeffect: { name: 'Side Effect', brand: 'Initio', price: '$60', image: 'initio-side-effect.png' },
      naxos: { name: 'Naxos', brand: 'Xerjoff', price: '$65', image: 'xerjoff-naxos.png' },
      grandSoir: { name: 'Grand Soir', brand: 'Maison Francis Kurkdjian', price: '$65', image: 'mfk-grand-soir.png' }
    };

    return fragrances[fragranceId]`;
    
    script = script.replace(gfdPattern, newGFD);
    console.log('✓ Updated getFragranceData()');
} else {
    console.log('✗ Could not find getFragranceData() blv entry');
}

fs.writeFileSync('script.js', script);
console.log('✓ Saved script.js');
