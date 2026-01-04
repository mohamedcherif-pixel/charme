const fs = require('fs');

// Read the current fragrance database file
let fileContent = fs.readFileSync('js/fragrance-api-service.js', 'utf8');

// Define concentration and size mappings for different fragrance categories
const fragranceSpecs = {
  // Parfums de Marly entries
  "Pegasus": { concentration: "EDP", sizes: ["75ml", "125ml"] },
  "Herod": { concentration: "EDP", sizes: ["75ml", "125ml"] },
  "Greenley": { concentration: "EDP", sizes: ["75ml", "125ml"] },
  "Delina": { concentration: "EDP", sizes: ["75ml", "125ml"] },
  "Oajan": { concentration: "EDP", sizes: ["75ml", "125ml"] },
  "Kalan": { concentration: "EDP", sizes: ["75ml", "125ml"] },
  "Carlisle": { concentration: "EDP", sizes: ["75ml", "125ml"] },
  "Sedley": { concentration: "EDP", sizes: ["75ml", "125ml"] },
  "Percival": { concentration: "EDP", sizes: ["75ml", "125ml"] },
  "Godolphin": { concentration: "EDP", sizes: ["75ml", "125ml"] },

  // Creed entries
  "Creed Aventus": { concentration: "EDP", sizes: ["50ml", "100ml", "120ml"] },
  "Creed Silver Mountain Water": { concentration: "EDP", sizes: ["50ml", "100ml", "120ml"] },
  "Creed Green Irish Tweed": { concentration: "EDP", sizes: ["50ml", "100ml", "120ml"] },
  "Creed Virgin Island Water": { concentration: "EDP", sizes: ["50ml", "100ml", "120ml"] },
  "Creed Millisime Imperial": { concentration: "EDP", sizes: ["50ml", "100ml", "120ml"] },
  "Creed Royal Oud": { concentration: "EDP", sizes: ["50ml", "100ml", "120ml"] },

  // Tom Ford entries
  "Tom Ford Black Orchid": { concentration: "EDP", sizes: ["50ml", "100ml"] },
  "Tom Ford Oud Wood": { concentration: "EDP", sizes: ["50ml", "100ml"] },
  "Tom Ford Tobacco Vanille": { concentration: "EDP", sizes: ["50ml", "100ml"] },
  "Tom Ford Lost Cherry": { concentration: "EDP", sizes: ["50ml", "100ml"] },
  "Tom Ford Fucking Fabulous": { concentration: "EDP", sizes: ["50ml", "100ml"] },
  "Tom Ford Noir Extreme": { concentration: "EDP", sizes: ["50ml", "100ml"] },
  "Tom Ford Grey Vetiver": { concentration: "EDP", sizes: ["50ml", "100ml"] },

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
  "Paco Rabanne 1 Million": { concentration: "EDT", sizes: ["50ml", "100ml", "200ml"] },
  "Paco Rabanne Invictus": { concentration: "EDT", sizes: ["50ml", "100ml", "200ml"] },

  // Lattafa entries
  "Lattafa Raghba": { concentration: "EDP", sizes: ["100ml"] },
  "Lattafa Yara": { concentration: "EDP", sizes: ["100ml"] },
  "Lattafa Asad": { concentration: "EDP", sizes: ["100ml"] },

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

  // Additional designer entries
  "Clinique Happy": { concentration: "EDP", sizes: ["50ml", "100ml"] },
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

console.log('Adding concentration and size specifications to fragrance database...');

let updateCount = 0;

// Function to add specs to a fragrance entry
function addSpecsToFragrance(fragranceName, specs) {
  const { concentration, sizes } = specs;
  
  // Create regex pattern to find the fragrance entry
  const patterns = [
    // Pattern for quoted fragrance names
    new RegExp(`("${fragranceName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}":\\s*{[^}]*?available:\\s*(?:true|false),)(?!\n\\s*concentration:)`, 'g'),
    // Pattern for unquoted fragrance names (like Layton:)
    new RegExp(`(${fragranceName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}:\\s*{[^}]*?available:\\s*(?:true|false),)(?!\n\\s*concentration:)`, 'g')
  ];
  
  patterns.forEach(pattern => {
    fileContent = fileContent.replace(pattern, (match) => {
      updateCount++;
      return match + `\n        concentration: "${concentration}",\n        sizes: ${JSON.stringify(sizes)},`;
    });
  });
}

// Process all fragrance entries
Object.entries(fragranceSpecs).forEach(([fragranceName, specs]) => {
  addSpecsToFragrance(fragranceName, specs);
});

// Write the updated content back to the file
fs.writeFileSync('js/fragrance-api-service.js', fileContent, 'utf8');

console.log(`Successfully added concentration and size data to ${updateCount} fragrance entries!`);
