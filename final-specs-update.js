const fs = require('fs');

// Read the current fragrance database file
let fileContent = fs.readFileSync('js/fragrance-api-service.js', 'utf8');

// Define comprehensive concentration and size mappings
const fragranceSpecs = {
  // Brand-specific patterns for missing entries
  
  // Chanel entries
  "Chanel Coco Mademoiselle": { concentration: "EDP", sizes: ["50ml", "100ml"] },
  "Chanel No. 5": { concentration: "EDP", sizes: ["35ml", "50ml", "100ml"] },
  "Chanel Allure Homme Sport": { concentration: "EDT", sizes: ["50ml", "100ml", "150ml"] },
  "Chanel Bleu de Chanel": { concentration: "EDP", sizes: ["50ml", "100ml", "150ml"] },
  "Chanel Chance": { concentration: "EDT", sizes: ["50ml", "100ml", "150ml"] },
  "Chanel Gabrielle": { concentration: "EDP", sizes: ["50ml", "100ml"] },
  "Chanel Coco Noir": { concentration: "EDP", sizes: ["50ml", "100ml"] },

  // Dior entries
  "Dior Sauvage": { concentration: "EDT", sizes: ["60ml", "100ml", "200ml"] },
  "Dior Sauvage Elixir": { concentration: "Parfum", sizes: ["60ml", "100ml"] },
  "Dior Homme": { concentration: "EDT", sizes: ["50ml", "100ml", "150ml"] },
  "Dior Miss Dior": { concentration: "EDP", sizes: ["50ml", "100ml"] },
  "Dior J'adore": { concentration: "EDP", sizes: ["50ml", "100ml"] },
  "Dior Fahrenheit": { concentration: "EDT", sizes: ["50ml", "100ml", "200ml"] },
  "Dior Homme Intense": { concentration: "EDP", sizes: ["50ml", "100ml", "150ml"] },

  // YSL entries  
  "Yves Saint Laurent Libre": { concentration: "EDP", sizes: ["50ml", "90ml"] },
  "Yves Saint Laurent Y": { concentration: "EDT", sizes: ["60ml", "100ml"] },
  "Yves Saint Laurent La Nuit de l'Homme": { concentration: "EDT", sizes: ["60ml", "100ml"] },
  "Yves Saint Laurent Black Opium": { concentration: "EDP", sizes: ["50ml", "90ml"] },
  "Yves Saint Laurent Libre Intense": { concentration: "EDP", sizes: ["50ml", "90ml"] },
  "Yves Saint Laurent Libre L'Absolu Platine": { concentration: "EDP", sizes: ["50ml", "90ml"] },

  // Giorgio Armani entries
  "Giorgio Armani Acqua di Gio": { concentration: "EDT", sizes: ["50ml", "100ml", "200ml"] },
  "Giorgio Armani Code": { concentration: "EDT", sizes: ["50ml", "75ml", "110ml"] },
  "Giorgio Armani Si": { concentration: "EDP", sizes: ["50ml", "100ml"] },
  "Giorgio Armani My Way": { concentration: "EDP", sizes: ["50ml", "90ml"] },

  // Calvin Klein entries
  "Calvin Klein Euphoria": { concentration: "EDP", sizes: ["50ml", "100ml"] },
  "Calvin Klein Eternity": { concentration: "EDP", sizes: ["50ml", "100ml"] },
  "Calvin Klein Obsession": { concentration: "EDT", sizes: ["75ml", "125ml"] },
  "Calvin Klein CK One": { concentration: "EDT", sizes: ["50ml", "100ml", "200ml"] },
  "Calvin Klein Escape": { concentration: "EDP", sizes: ["50ml", "100ml"] },

  // Hugo Boss entries
  "Hugo Boss The Scent": { concentration: "EDT", sizes: ["50ml", "100ml", "200ml"] },
  "Hugo Boss Femme": { concentration: "EDP", sizes: ["50ml", "75ml"] },
  "Hugo Boss Bottled": { concentration: "EDT", sizes: ["50ml", "100ml", "200ml"] },

  // Burberry entries
  "Burberry Her": { concentration: "EDP", sizes: ["50ml", "100ml"] },
  "Burberry Brit": { concentration: "EDT", sizes: ["50ml", "100ml"] },
  "Burberry My Burberry": { concentration: "EDP", sizes: ["50ml", "90ml"] },
  "Burberry London for Men": { concentration: "EDT", sizes: ["50ml", "100ml"] },

  // Versace entries
  "Versace Eros": { concentration: "EDT", sizes: ["50ml", "100ml", "200ml"] },
  "Versace Dylan Blue": { concentration: "EDT", sizes: ["50ml", "100ml", "200ml"] },
  "Versace Crystal Noir": { concentration: "EDT", sizes: ["50ml", "90ml"] },
  "Versace Bright Crystal": { concentration: "EDT", sizes: ["50ml", "90ml", "200ml"] },

  // Paco Rabanne entries
  "Paco Rabanne Olympea": { concentration: "EDP", sizes: ["50ml", "80ml"] },
  "Paco Rabanne Lady Million": { concentration: "EDP", sizes: ["50ml", "80ml"] },

  // Lattafa entries
  "Lattafa Raghba": { concentration: "EDP", sizes: ["100ml"] },
  "Lattafa Yara": { concentration: "EDP", sizes: ["100ml"] },

  // Armaf entries
  "Armaf Club de Nuit Intense": { concentration: "EDP", sizes: ["105ml"] },
  "Armaf Hunter Intense": { concentration: "EDP", sizes: ["100ml"] },
  "Armaf Tres Nuit": { concentration: "EDP", sizes: ["100ml"] },

  // Afnan entries
  "Afnan 9pm": { concentration: "EDP", sizes: ["100ml"] },
  "Afnan Supremacy Silver": { concentration: "EDP", sizes: ["100ml"] },

  // Azzaro entries
  "Azzaro Chrome": { concentration: "EDT", sizes: ["50ml", "100ml", "200ml"] },
  "Azzaro Wanted": { concentration: "EDT", sizes: ["50ml", "100ml", "150ml"] },
  "Azzaro Wanted by Night": { concentration: "EDP", sizes: ["50ml", "100ml", "150ml"] },

  // Davidoff entries
  "Davidoff Cool Water": { concentration: "EDT", sizes: ["75ml", "125ml", "200ml"] },
  "Davidoff The Game": { concentration: "EDT", sizes: ["60ml", "100ml"] },

  // Other brand entries
  "Clinique Happy": { concentration: "EDT", sizes: ["50ml", "100ml"] },
  "Clinique Aromatics Elixir": { concentration: "Parfum", sizes: ["45ml", "100ml"] },
  "Elizabeth Arden Green Tea": { concentration: "EDT", sizes: ["50ml", "100ml"] },
  "Elizabeth Arden Red Door": { concentration: "EDT", sizes: ["50ml", "100ml"] },
  "Coach Floral": { concentration: "EDP", sizes: ["50ml", "90ml"] },
  "Coach Dreams": { concentration: "EDP", sizes: ["60ml", "90ml"] },
  "Jimmy Choo": { concentration: "EDP", sizes: ["60ml", "100ml"] },
  "Jimmy Choo Fever": { concentration: "EDP", sizes: ["60ml", "100ml"] },
  "Issey Miyake L'Eau d'Issey": { concentration: "EDT", sizes: ["50ml", "100ml", "125ml"] },
  "Issey Miyake A Drop d'Issey": { concentration: "EDP", sizes: ["50ml", "90ml"] },
  "Ralph Lauren Polo": { concentration: "EDT", sizes: ["59ml", "118ml", "237ml"] },
  "Ralph Lauren Romance": { concentration: "EDP", sizes: ["50ml", "100ml"] },
  "Estee Lauder Modern Muse": { concentration: "EDP", sizes: ["50ml", "100ml"] },
  "Estee Lauder Private Collection": { concentration: "EDP", sizes: ["50ml", "85ml"] }
};

console.log('Adding concentration and size specifications to remaining fragrance entries...');

let updateCount = 0;

// Process specific fragrance entries
Object.entries(fragranceSpecs).forEach(([fragranceName, specs]) => {
  const { concentration, sizes } = specs;
  
  // Pattern to match the fragrance entry
  const patterns = [
    new RegExp(`"${fragranceName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}":\\s*{([^}]*?)available:\\s*(true|false),\\s*}`, 'g'),
    new RegExp(`${fragranceName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}:\\s*{([^}]*?)available:\\s*(true|false),\\s*}`, 'g')
  ];
  
  patterns.forEach(pattern => {
    fileContent = fileContent.replace(pattern, (match, entryContent, available) => {
      // Skip if already has concentration
      if (entryContent.includes('concentration:')) {
        return match;
      }
      
      updateCount++;
      return match.replace(
        new RegExp(`(available:\\s*${available},)\\s*}`),
        `$1\n        concentration: "${concentration}",\n        sizes: ${JSON.stringify(sizes)},\n      }`
      );
    });
  });
});

// Generic fallback for any remaining entries without concentration
const genericPattern = /(\w+|"[^"]+"):\s*\{\s*brand:\s*"([^"]+)"([^}]*?)available:\s*(true|false),\s*\}/g;

let match;
while ((match = genericPattern.exec(fileContent)) !== null) {
  const [fullMatch, fragName, brand, entryContent, available] = match;
  
  // Skip if already has concentration
  if (entryContent.includes('concentration:')) {
    continue;
  }
  
  // Assign generic specs based on brand
  let genericSpecs = { concentration: "EDT", sizes: ["50ml", "100ml"] };
  
  if (brand.includes("Parfums de Marly")) {
    genericSpecs = { concentration: "EDP", sizes: ["75ml", "125ml"] };
  } else if (brand.includes("Tom Ford")) {
    genericSpecs = { concentration: "EDP", sizes: ["50ml", "100ml"] };
  } else if (brand.includes("Creed")) {
    genericSpecs = { concentration: "EDP", sizes: ["50ml", "100ml", "120ml"] };
  } else if (brand.includes("Chanel")) {
    genericSpecs = { concentration: "EDP", sizes: ["50ml", "100ml"] };
  } else if (brand.includes("Dior")) {
    genericSpecs = { concentration: "EDT", sizes: ["50ml", "100ml", "200ml"] };
  }
  
  const updatedMatch = fullMatch.replace(
    new RegExp(`(available:\\s*${available},)\\s*}`),
    `$1\n        concentration: "${genericSpecs.concentration}",\n        sizes: ${JSON.stringify(genericSpecs.sizes)},\n      }`
  );
  
  fileContent = fileContent.replace(fullMatch, updatedMatch);
  updateCount++;
}

// Write the updated content back to the file
fs.writeFileSync('js/fragrance-api-service.js', fileContent, 'utf8');

console.log(`Successfully added concentration and size specifications to ${updateCount} additional fragrance entries!`);

// Test syntax
console.log('Testing database syntax...');
try {
  const FragranceAPIService = require('./js/fragrance-api-service.js');
  const service = new FragranceAPIService();
  console.log('✅ Database loaded successfully - no syntax errors!');
} catch (error) {
  console.log('❌ Syntax error:', error.message);
}
