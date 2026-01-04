const fs = require('fs');

// Read the current fragrance database file
let fileContent = fs.readFileSync('js/fragrance-api-service.js', 'utf8');

// Define typical concentrations and sizes for different fragrance types
const fragranceData = {
  // Parfums de Marly - typically EDP
  "Layton": { concentration: "EDP", sizes: ["75ml", "125ml"] },
  "Haltane": { concentration: "EDP", sizes: ["75ml", "125ml"] },
  "Pegasus": { concentration: "EDP", sizes: ["75ml", "125ml"] },
  "Herod": { concentration: "EDP", sizes: ["75ml", "125ml"] },
  "Greenley": { concentration: "EDP", sizes: ["75ml", "125ml"] },
  "Delina": { concentration: "EDP", sizes: ["75ml", "125ml"] },
  "Oajan": { concentration: "EDP", sizes: ["75ml", "125ml"] },
  "Kalan": { concentration: "EDP", sizes: ["75ml", "125ml"] },
  "Carlisle": { concentration: "EDP", sizes: ["75ml", "125ml"] },
  "Sedley": { concentration: "EDP", sizes: ["75ml", "125ml"] },

  // Creed - typically EDP/Millesime
  "Creed Aventus": { concentration: "EDP", sizes: ["50ml", "100ml", "120ml"] },
  "Creed Silver Mountain Water": { concentration: "EDP", sizes: ["50ml", "100ml", "120ml"] },
  "Creed Green Irish Tweed": { concentration: "EDP", sizes: ["50ml", "100ml", "120ml"] },
  "Creed Virgin Island Water": { concentration: "EDP", sizes: ["50ml", "100ml", "120ml"] },
  "Creed Millisime Imperial": { concentration: "EDP", sizes: ["50ml", "100ml", "120ml"] },

  // Tom Ford - typically EDP
  "Tom Ford Black Orchid": { concentration: "EDP", sizes: ["50ml", "100ml"] },
  "Tom Ford Oud Wood": { concentration: "EDP", sizes: ["50ml", "100ml"] },
  "Tom Ford Tobacco Vanille": { concentration: "EDP", sizes: ["50ml", "100ml"] },
  "Tom Ford Lost Cherry": { concentration: "EDP", sizes: ["50ml", "100ml"] },
  "Tom Ford Fucking Fabulous": { concentration: "EDP", sizes: ["50ml", "100ml"] },

  // Chanel - mixed concentrations
  "Chanel Coco Mademoiselle": { concentration: "EDP", sizes: ["50ml", "100ml"] },
  "Chanel No. 5": { concentration: "EDP", sizes: ["50ml", "100ml"] },
  "Chanel Allure Homme Sport": { concentration: "EDT", sizes: ["50ml", "100ml", "150ml"] },
  "Chanel Bleu de Chanel": { concentration: "EDP", sizes: ["50ml", "100ml", "150ml"] },
  "Chanel Chance": { concentration: "EDT", sizes: ["50ml", "100ml", "150ml"] },

  // Dior - mixed concentrations
  "Dior Sauvage": { concentration: "EDT", sizes: ["60ml", "100ml", "200ml"] },
  "Dior Sauvage Elixir": { concentration: "Parfum", sizes: ["60ml", "100ml"] },
  "Dior Homme": { concentration: "EDT", sizes: ["50ml", "100ml", "150ml"] },
  "Dior Miss Dior": { concentration: "EDP", sizes: ["50ml", "100ml"] },
  "Dior J'adore": { concentration: "EDP", sizes: ["50ml", "100ml"] },

  // YSL - mixed concentrations
  "Yves Saint Laurent Libre": { concentration: "EDP", sizes: ["50ml", "90ml"] },
  "Yves Saint Laurent Y": { concentration: "EDT", sizes: ["60ml", "100ml"] },
  "Yves Saint Laurent La Nuit de l'Homme": { concentration: "EDT", sizes: ["60ml", "100ml"] },
  "Yves Saint Laurent Black Opium": { concentration: "EDP", sizes: ["50ml", "90ml"] },

  // Armani - mixed concentrations
  "Giorgio Armani Acqua di Gio": { concentration: "EDT", sizes: ["50ml", "100ml", "200ml"] },
  "Giorgio Armani Code": { concentration: "EDT", sizes: ["50ml", "75ml", "110ml"] },
  "Giorgio Armani Si": { concentration: "EDP", sizes: ["50ml", "100ml"] },

  // Calvin Klein - typically EDT
  "Calvin Klein Euphoria": { concentration: "EDP", sizes: ["50ml", "100ml"] },
  "Calvin Klein Eternity": { concentration: "EDP", sizes: ["50ml", "100ml"] },
  "Calvin Klein Obsession": { concentration: "EDT", sizes: ["75ml", "125ml"] },
  "Calvin Klein CK One": { concentration: "EDT", sizes: ["50ml", "100ml", "200ml"] },
  "Calvin Klein Escape": { concentration: "EDP", sizes: ["50ml", "100ml"] },

  // Hugo Boss - typically EDT
  "Hugo Boss The Scent": { concentration: "EDT", sizes: ["50ml", "100ml", "200ml"] },
  "Hugo Boss Femme": { concentration: "EDP", sizes: ["50ml", "75ml"] },
  "Hugo Boss Bottled": { concentration: "EDT", sizes: ["50ml", "100ml", "200ml"] },

  // Burberry - mixed
  "Burberry Her": { concentration: "EDP", sizes: ["50ml", "100ml"] },
  "Burberry Brit": { concentration: "EDT", sizes: ["50ml", "100ml"] },
  "Burberry My Burberry": { concentration: "EDP", sizes: ["50ml", "90ml"] },
  "Burberry London for Men": { concentration: "EDT", sizes: ["50ml", "100ml"] },

  // Versace - typically EDT
  "Versace Eros": { concentration: "EDT", sizes: ["50ml", "100ml", "200ml"] },
  "Versace Dylan Blue": { concentration: "EDT", sizes: ["50ml", "100ml", "200ml"] },
  "Versace Crystal Noir": { concentration: "EDT", sizes: ["50ml", "90ml"] },
  "Versace Bright Crystal": { concentration: "EDT", sizes: ["50ml", "90ml", "200ml"] },

  // Paco Rabanne - mixed
  "Paco Rabanne Olympea": { concentration: "EDP", sizes: ["50ml", "80ml"] },
  "Paco Rabanne Lady Million": { concentration: "EDP", sizes: ["50ml", "80ml"] },
  "Paco Rabanne 1 Million": { concentration: "EDT", sizes: ["50ml", "100ml", "200ml"] },
  "Paco Rabanne Invictus": { concentration: "EDT", sizes: ["50ml", "100ml", "200ml"] },

  // Lattafa - typically EDP/Oil based
  "Lattafa Raghba": { concentration: "EDP", sizes: ["100ml"] },
  "Lattafa Yara": { concentration: "EDP", sizes: ["100ml"] },
  "Lattafa Asad": { concentration: "EDP", sizes: ["100ml"] },

  // Armaf - typically EDP
  "Armaf Club de Nuit Intense": { concentration: "EDP", sizes: ["105ml"] },
  "Armaf Hunter Intense": { concentration: "EDP", sizes: ["100ml"] },
  "Armaf Tres Nuit": { concentration: "EDP", sizes: ["100ml"] },

  // Afnan - typically EDP
  "Afnan 9pm": { concentration: "EDP", sizes: ["100ml"] },
  "Afnan Supremacy Silver": { concentration: "EDP", sizes: ["100ml"] },

  // Azzaro - typically EDT
  "Azzaro Chrome": { concentration: "EDT", sizes: ["50ml", "100ml", "200ml"] },
  "Azzaro Wanted": { concentration: "EDT", sizes: ["50ml", "100ml", "150ml"] },
  "Azzaro Wanted by Night": { concentration: "EDP", sizes: ["50ml", "100ml", "150ml"] },

  // Davidoff - typically EDT
  "Davidoff Cool Water": { concentration: "EDT", sizes: ["75ml", "125ml", "200ml"] },
  "Davidoff The Game": { concentration: "EDT", sizes: ["60ml", "100ml"] },

  // Clinique - typically EDT
  "Clinique Happy": { concentration: "EDP", sizes: ["50ml", "100ml"] },
  "Clinique Aromatics Elixir": { concentration: "Parfum", sizes: ["45ml", "100ml"] },

  // Elizabeth Arden - typically EDT
  "Elizabeth Arden Green Tea": { concentration: "EDT", sizes: ["50ml", "100ml"] },
  "Elizabeth Arden Red Door": { concentration: "EDT", sizes: ["50ml", "100ml"] },

  // Coach - typically EDP
  "Coach Floral": { concentration: "EDP", sizes: ["50ml", "90ml"] },
  "Coach Dreams": { concentration: "EDP", sizes: ["60ml", "90ml"] },

  // Jimmy Choo - typically EDP
  "Jimmy Choo": { concentration: "EDP", sizes: ["60ml", "100ml"] },
  "Jimmy Choo Fever": { concentration: "EDP", sizes: ["60ml", "100ml"] },

  // Issey Miyake - typically EDT
  "Issey Miyake L'Eau d'Issey": { concentration: "EDT", sizes: ["50ml", "100ml", "125ml"] },
  "Issey Miyake A Drop d'Issey": { concentration: "EDP", sizes: ["50ml", "90ml"] },

  // Ralph Lauren - mixed
  "Ralph Lauren Polo": { concentration: "EDT", sizes: ["59ml", "118ml", "237ml"] },
  "Ralph Lauren Romance": { concentration: "EDP", sizes: ["50ml", "100ml"] },

  // Estee Lauder - typically EDP
  "Estee Lauder Modern Muse": { concentration: "EDP", sizes: ["50ml", "100ml"] },
  "Estee Lauder Private Collection": { concentration: "EDP", sizes: ["50ml", "85ml"] }
};

console.log('Adding concentration and size data to fragrance database...');

// Process each fragrance entry
Object.entries(fragranceData).forEach(([fragranceName, data]) => {
  const { concentration, sizes } = data;
  
  // Find the fragrance entry in the file and add concentration and sizes
  const fragrancePattern = new RegExp(`("${fragranceName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}":\\s*{[^}]*?image:\\s*"[^"]*",\\s*available:\\s*(?:true|false),?)`, 'g');
  
  fileContent = fileContent.replace(fragrancePattern, (match) => {
    // Check if concentration and sizes are already present
    if (match.includes('concentration:') || match.includes('sizes:')) {
      return match; // Already has the fields, skip
    }
    
    // Add concentration and sizes before the closing brace
    return match.replace(/(available:\s*(?:true|false),?)/, `$1
        concentration: "${concentration}",
        sizes: ${JSON.stringify(sizes)},`);
  });
});

// Write the updated content back to the file
fs.writeFileSync('js/fragrance-api-service.js', fileContent, 'utf8');

console.log('Successfully added concentration and size data to fragrance database!');
