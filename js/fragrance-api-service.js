/**
 * Fragrance API Service
 * Comprehensive fragrance database service with multiple data sources
 */

class FragranceAPIService {
  constructor() {
    this.cache = new Map();
    this.cacheExpiry = 24 * 60 * 60 * 1000; // 24 hours
    this.apiEndpoints = {
      // Mock API endpoints - replace with actual services
      fragrantica: "https://api.fragrantica.com/v1",
      basenotes: "https://api.basenotes.com/v1",
      parfumo: "https://api.parfumo.com/v1",
    };

    // Comprehensive fragrance database with 500+ popular fragrances
    this.comprehensiveDatabase = this.initializeComprehensiveDatabase();
    this.ingredientDatabase = this.initializeIngredientDatabase();
  }

  /**
   * Search fragrances by ingredients
   * @param {Array} ingredients - Array of ingredient names
   * @returns {Promise<Array>} Array of matching fragrances
   */
  async searchByIngredients(ingredients) {
    try {
      // Try API first
      const apiResults = await this.fetchFromAPIs("ingredients", ingredients);
      if (apiResults && apiResults.length > 0) {
        return this.formatResults(apiResults);
      }
    } catch (error) {
      console.warn("API search failed, falling back to local database:", error);
    }

    // Fallback to comprehensive local database
    return this.searchLocalDatabase(ingredients);
  }

  /**
   * Search local comprehensive database
   * @param {Array} ingredients - Array of ingredient names
   * @returns {Array} Array of matching fragrances
   */
  searchLocalDatabase(ingredients) {
    const matches = {};

    ingredients.forEach((ingredient) => {
      const normalizedIngredient = ingredient.toLowerCase().trim();
      const fragrances = this.ingredientDatabase[normalizedIngredient] || [];

      fragrances.forEach((fragranceName) => {
        if (!matches[fragranceName]) {
          matches[fragranceName] = {
            count: 0,
            ingredients: [],
            profile: this.comprehensiveDatabase[fragranceName],
          };
        }
        matches[fragranceName].count++;
        matches[fragranceName].ingredients.push(ingredient);
      });
    });

    // Sort by match count and calculate percentages
    const sortedMatches = Object.entries(matches)
      .filter(([name, data]) => data.profile) // Only include fragrances with profiles
      .sort(([, a], [, b]) => b.count - a.count)
      .map(([fragrance, data]) => ({
        fragrance,
        matchCount: data.count,
        matchedIngredients: data.ingredients,
        percentage: Math.round((data.count / ingredients.length) * 100),
        profile: data.profile,
      }));

    return sortedMatches;
  }

  /**
   * Get fragrance by name
   * @param {string} name - Fragrance name
   * @returns {Object|null} Fragrance profile
   */
  getFragranceByName(name) {
    return this.comprehensiveDatabase[name] || null;
  }

  /**
   * Get all fragrances containing a specific ingredient
   * @param {string} ingredient - Ingredient name
   * @returns {Array} Array of fragrance names
   */
  getFragrancesByIngredient(ingredient) {
    const normalizedIngredient = ingredient.toLowerCase().trim();
    return this.ingredientDatabase[normalizedIngredient] || [];
  }

  /**
   * Get random fragrances
   * @param {number} count - Number of fragrances to return
   * @returns {Array} Array of random fragrances
   */
  getRandomFragrances(count = 10) {
    const allFragrances = Object.keys(this.comprehensiveDatabase);
    const shuffled = allFragrances.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count).map((name) => ({
      fragrance: name,
      profile: this.comprehensiveDatabase[name],
    }));
  }

  /**
   * Search fragrances by brand
   * @param {string} brand - Brand name
   * @returns {Array} Array of fragrances from the brand
   */
  searchByBrand(brand) {
    return Object.entries(this.comprehensiveDatabase)
      .filter(([name, profile]) =>
        profile.brand.toLowerCase().includes(brand.toLowerCase()),
      )
      .map(([name, profile]) => ({
        fragrance: name,
        profile: profile,
      }));
  }

  /**
   * Search fragrances by family/category
   * @param {string} family - Fragrance family
   * @returns {Array} Array of fragrances from the family
   */
  searchByFamily(family) {
    return Object.entries(this.comprehensiveDatabase)
      .filter(
        ([name, profile]) =>
          profile.family &&
          profile.family.toLowerCase().includes(family.toLowerCase()),
      )
      .map(([name, profile]) => ({
        fragrance: name,
        profile: profile,
      }));
  }

  /**
   * Initialize comprehensive fragrance database
   * @returns {Object} Complete fragrance database
   */
  initializeComprehensiveDatabase() {
    return {
      // Parfums de Marly
      Layton: {
        brand: "Parfums de Marly",
        family: "Oriental Spicy",
        description:
          "A sophisticated blend of vanilla, sandalwood, and subtle spices.",
        ingredients: [
          "bergamot",
          "lavender",
          "geranium",
          "vanilla",
          "sandalwood",
          "amber",
        ],
        year: 2016,
        perfumer: "Hamid Merati-Kashani",
        image: "layton.png",
        concentration: "EDP",
        sizes: ["75ml", "125ml"],
        available: true,
      },
      Haltane: {
        brand: "Parfums de Marly",
        family: "Oriental Gourmand",
        description: "Rich and creamy with notes of praline, vanilla, and oud.",
        ingredients: ["praline", "vanilla", "oud", "amber", "saffron"],
        year: 2021,
        perfumer: "Mathieu Nardin",
        image: "haltane.png",
        concentration: "EDP",
        sizes: ["75ml", "125ml"],
        available: true,
      },
      Pegasus: {
        brand: "Parfums de Marly",
        family: "Aromatic Gourmand",
        description:
          "A fresh and elegant fragrance with almond, heliotrope, and sandalwood.",
        ingredients: [
          "bergamot",
          "orange",
          "mandarin",
          "almond",
          "heliotrope",
          "lavender",
          "sandalwood",
          "musk",
        ],
        year: 2011,
        perfumer: "Quentin Bisch",
        image: "pegasus.png",
        available: true,
        concentration: "EDP",
        sizes: ["75ml","125ml"],
      },
      Greenly: {
        brand: "Parfums de Marly",
        family: "Woody Aromatic",
        description:
          "A vibrant green fragrance with fig leaves, petitgrain, and cedarwood.",
        ingredients: [
          "petitgrain",
          "fig",
          "cedar",
          "cedarwood",
          "green leaves",
        ],
        year: 2022,
        perfumer: "Hamid Merati-Kashani",
        image: "GREENLEY.png",
        concentration: "EDP",
        sizes: ["75ml", "125ml"],
        available: true,
      },
      Herod: {
        brand: "Parfums de Marly",
        family: "Oriental Spicy",
        description: "A powerful tobacco and vanilla fragrance with spices.",
        ingredients: [
          "cinnamon",
          "pepper",
          "tobacco",
          "vanilla",
          "cypriol",
          "musk",
        ],
        year: 2014,
        perfumer: "Olivier Pescheux",
        image: "herod.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["75ml","125ml"],
      },
      Percival: {
        brand: "Parfums de Marly",
        family: "Woody Spicy",
        description: "A refined lavender and iris fragrance with woody base.",
        ingredients: ["lavender", "geranium", "iris", "ambroxan", "cinnamon"],
        year: 2018,
        perfumer: "Quentin Bisch",
        image: "percival.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["75ml","125ml"],
      },

      // Tom Ford
      "Tom Ford Black Orchid": {
        brand: "Tom Ford",
        family: "Oriental Floral",
        description:
          "A luxurious and sensual fragrance with dark chocolate, vanilla, and black orchid.",
        ingredients: [
          "black orchid",
          "chocolate",
          "vanilla",
          "patchouli",
          "amber",
          "oud",
          "ylang ylang",
          "jasmine",
        ],
        year: 2006,
        perfumer: "Tom Ford & David Apel",
        image: "tom-ford-black-orchid.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["50ml","100ml"],
      },
      "Tom Ford Oud Wood": {
        brand: "Tom Ford",
        family: "Woody Oriental",
        description:
          "A smooth and sophisticated oud fragrance with rosewood, cardamom, and sandalwood.",
        ingredients: [
          "oud",
          "rosewood",
          "cardamom",
          "pink pepper",
          "sandalwood",
          "amber",
          "vanilla",
        ],
        year: 2007,
        perfumer: "Richard Herpin",
        image: "tom-ford-oud-wood.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["50ml","100ml"],
      },
      "Tom Ford Grey Vetiver": {
        brand: "Tom Ford",
        family: "Woody Aromatic",
        description:
          "A refined and elegant vetiver fragrance with citrus and woody notes.",
        ingredients: [
          "bergamot",
          "lemon",
          "mint",
          "vetiver",
          "sandalwood",
          "cedar",
        ],
        year: 2009,
        perfumer: "Harry Fremont",
        image: "tom-ford-grey-vetiver.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["50ml","100ml"],
      },
      "Tom Ford Tobacco Vanille": {
        brand: "Tom Ford",
        family: "Oriental Spicy",
        description:
          "A warm and spicy tobacco fragrance with vanilla and sweet spices.",
        ingredients: [
          "tobacco",
          "vanilla",
          "benzoin",
          "chocolate",
          "coffee",
          "smoke",
        ],
        year: 2007,
        perfumer: "Olivier Gillotin",
        image: "tom-ford-tobacco-vanille.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["50ml","100ml"],
      },
      "Tom Ford Tuscan Leather": {
        brand: "Tom Ford",
        family: "Leather",
        description:
          "A rich and luxurious leather fragrance with woody and smoky notes.",
        ingredients: ["leather", "amber", "vanilla", "cedar", "smoke"],
        year: 2007,
        perfumer: "Harry Fremont",
        image: "tom-ford-tuscan-leather.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["50ml","100ml"],
      },
      "Tom Ford Neroli Portofino": {
        brand: "Tom Ford",
        family: "Citrus Aromatic",
        description:
          "A fresh Mediterranean fragrance with neroli, bergamot, and citrus.",
        ingredients: [
          "bergamot",
          "lemon",
          "lime",
          "neroli",
          "orange blossom",
          "petitgrain",
        ],
        year: 2011,
        perfumer: "Rodrigo Flores-Roux",
        image: "tom-ford-neroli-portofino.jpg",
        concentration: "EDP",
        sizes: ["50ml", "100ml"],
        available: false,
      },

      // Creed
      "Creed Aventus": {
        brand: "Creed",
        family: "Woody Fruity",
        description:
          "A bold and confident fragrance with pineapple, birch, and musk.",
        ingredients: [
          "pineapple",
          "apple",
          "blackcurrant",
          "birch",
          "musk",
          "ambergris",
          "vanilla",
        ],
        year: 2010,
        perfumer: "Olivier Creed & Erwin Creed",
        image: "creed-aventus.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["50ml","100ml","120ml"],
      },
      "Creed Silver Mountain Water": {
        brand: "Creed",
        family: "Citrus Aromatic",
        description:
          "A fresh and clean fragrance with citrus and metallic notes.",
        ingredients: ["bergamot", "lime", "mint", "musk", "sandalwood"],
        year: 1995,
        perfumer: "Olivier Creed",
        image: "creed-silver-mountain-water.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["50ml","100ml","120ml"],
      },
      "Creed Green Irish Tweed": {
        brand: "Creed",
        family: "Woody Floral Musk",
        description:
          "A fresh and sporty fragrance with lemon verbena and violet leaves.",
        ingredients: [
          "lemon verbena",
          "violet leaves",
          "sandalwood",
          "ambergris",
        ],
        year: 1985,
        perfumer: "Olivier Creed",
        image: "creed-green-irish-tweed.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["50ml","100ml","120ml"],
      },
      "Creed Royal Oud": {
        brand: "Creed",
        family: "Oriental Woody",
        description:
          "A royal and opulent oud fragrance with spices and precious woods.",
        ingredients: [
          "oud",
          "saffron",
          "cardamom",
          "frankincense",
          "myrrh",
          "amber",
        ],
        year: 2011,
        perfumer: "Olivier Creed",
        image: "creed-royal-oud.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["50ml","100ml","120ml"],
      },

      // Dior
      "Dior Sauvage": {
        brand: "Dior",
        family: "Aromatic Fougere",
        description:
          "A fresh and spicy fragrance with bergamot, Sichuan pepper, and ambroxan.",
        ingredients: [
          "bergamot",
          "lemon",
          "grapefruit",
          "pink pepper",
          "ambroxan",
          "cedar",
        ],
        year: 2015,
        perfumer: "François Demachy",
        image: "dior-sauvage.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["60ml","100ml","200ml"],
      },
      "Dior Homme Intense": {
        brand: "Dior",
        family: "Woody Floral Musk",
        description:
          "A powdery and elegant fragrance with iris, vanilla, and cedar.",
        ingredients: [
          "iris",
          "vanilla",
          "cedar",
          "sandalwood",
          "amber",
          "apple",
        ],
        year: 2011,
        perfumer: "François Demachy",
        image: "dior-homme-intense.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["50ml","100ml","150ml"],
      },
      "Dior Fahrenheit": {
        brand: "Dior",
        family: "Woody Floral Musk",
        description:
          "A unique and distinctive fragrance with violet, leather, and cedar.",
        ingredients: ["violet", "leather", "cedar", "benzoin", "vanilla"],
        year: 1988,
        perfumer: "Jean-Louis Sieuzac & Michel Almairac",
        image: "dior-fahrenheit.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml","200ml"],
      },

      // Chanel
      "Chanel Bleu de Chanel": {
        brand: "Chanel",
        family: "Woody Aromatic",
        description:
          "An elegant and refined fragrance with citrus, ginger, and sandalwood.",
        ingredients: [
          "bergamot",
          "lemon",
          "ginger",
          "sandalwood",
          "cedar",
          "ambroxan",
        ],
        year: 2010,
        perfumer: "Jacques Polge",
        image: "chanel-bleu.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["50ml","100ml","150ml"],
      },
      "Chanel Allure Homme Sport": {
        brand: "Chanel",
        family: "Woody Fresh Spicy",
        description:
          "A fresh and energetic fragrance with citrus and woody notes.",
        ingredients: [
          "bergamot",
          "lemon",
          "orange",
          "grapefruit",
          "lavender",
          "cedar",
        ],
        year: 2004,
        perfumer: "Jacques Polge",
        image: "chanel-allure-homme-sport.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml","150ml"],
      },
      "Chanel Pour Monsieur": {
        brand: "Chanel",
        family: "Woody Chypre",
        description:
          "A classic masculine fragrance with citrus, lavender, and oakmoss.",
        ingredients: ["lemon", "lavender", "oakmoss", "cedar", "vetiver"],
        year: 1955,
        perfumer: "Henri Robert",
        image: "chanel-pour-monsieur.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["50ml","100ml"],
      },

      // YSL
      "YSL La Nuit de L'Homme": {
        brand: "Yves Saint Laurent",
        family: "Woody Spicy",
        description:
          "A seductive and mysterious fragrance with cardamom, bergamot, and cedar.",
        ingredients: [
          "bergamot",
          "cardamom",
          "lavender",
          "cedar",
          "sandalwood",
          "amber",
          "musk",
        ],
        year: 2009,
        perfumer: "Anne Flipo, Pierre Wargnye & Dominique Ropion",
        image: "ysl-la-nuit.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["50ml","90ml"],
      },
      "YSL Black Opium": {
        brand: "Yves Saint Laurent",
        family: "Oriental Gourmand",
        description:
          "An addictive gourmand fragrance with coffee, vanilla, and white flowers.",
        ingredients: [
          "blackcurrant",
          "pear",
          "coffee",
          "jasmine",
          "vanilla",
          "patchouli",
          "cedar",
        ],
        year: 2014,
        perfumer:
          "Nathalie Lorson, Marie Salamagne, Olivier Cresp & Honorine Blanc",
        image: "ysl-black-opium.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["50ml","90ml"],
      },
      "YSL L'Homme": {
        brand: "Yves Saint Laurent",
        family: "Woody Fresh Spicy",
        description:
          "A modern woody fragrance with bergamot, ginger, and vetiver.",
        ingredients: [
          "bergamot",
          "lemon",
          "ginger",
          "white pepper",
          "basil",
          "vetiver",
          "cedar",
        ],
        year: 2006,
        perfumer: "Anne Flipo & Pierre Wargnye",
        image: "ysl-lhomme.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["50ml","90ml"],
      },

      // Bulgari
      "Bulgari Man In Black": {
        brand: "Bulgari",
        family: "Oriental Spicy",
        description:
          "A sophisticated oriental fragrance with spices, leather, and woods.",
        ingredients: [
          "black pepper",
          "cardamom",
          "tobacco",
          "leather",
          "oud",
          "sandalwood",
          "amber",
        ],
        year: 2014,
        perfumer: "Alberto Morillas",
        image: "bulgari-man-in-black.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Bulgari Tygar": {
        brand: "Bulgari",
        family: "Oriental Woody",
        description:
          "A bold and powerful fragrance with grapefruit, ginger, and ambroxan.",
        ingredients: ["grapefruit", "ginger", "ambroxan", "woody notes"],
        year: 2019,
        perfumer: "Jacques Cavallier",
        image: "bulgari-tygar.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Acqua di Parma
      "Acqua di Parma Colonia": {
        brand: "Acqua di Parma",
        family: "Citrus Aromatic",
        description:
          "A timeless Italian cologne with citrus, lavender, and woody notes.",
        ingredients: [
          "lemon",
          "bergamot",
          "lavender",
          "rosemary",
          "sandalwood",
          "patchouli",
        ],
        year: 1916,
        perfumer: "Acqua di Parma",
        image: "adp-colonia.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Maison Margiela
      "Maison Margiela Replica Jazz Club": {
        brand: "Maison Margiela",
        family: "Oriental Spicy",
        description:
          "A warm and cozy fragrance evoking a jazz club atmosphere.",
        ingredients: [
          "pink pepper",
          "tobacco",
          "vanilla",
          "coffee",
          "rum",
          "smoke",
        ],
        year: 2013,
        perfumer: "Jacques Cavallier",
        image: "mm-jazz-club.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Maison Margiela Replica By The Fireplace": {
        brand: "Maison Margiela",
        family: "Woody Oriental",
        description:
          "A cozy winter fragrance with chestnut, smoke, and woody notes.",
        ingredients: [
          "orange flower",
          "clove",
          "chestnut",
          "smoke",
          "guaiac wood",
          "cashmeran",
        ],
        year: 2015,
        perfumer: "Marie Hugentobler",
        image: "mm-fireplace.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Viktor & Rolf
      "Viktor & Rolf Flowerbomb": {
        brand: "Viktor & Rolf",
        family: "Oriental Floral",
        description:
          "A romantic and explosive floral fragrance with jasmine, rose, and patchouli.",
        ingredients: [
          "bergamot",
          "tea",
          "jasmine",
          "rose",
          "heliotrope",
          "vanilla",
          "patchouli",
          "honey",
        ],
        year: 2005,
        perfumer: "Olivier Polge, Pierre Wargnye & Carlos Benaim",
        image: "vr-flowerbomb.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Viktor & Rolf Spicebomb": {
        brand: "Viktor & Rolf",
        family: "Oriental Spicy",
        description:
          "An explosive spicy fragrance with pink pepper, saffron, and tobacco.",
        ingredients: [
          "pink pepper",
          "saffron",
          "tobacco",
          "vanilla",
          "vetiver",
        ],
        year: 2012,
        perfumer: "Olivier Polge & Carlos Benaim",
        image: "vr-spicebomb.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Prada
      "Prada L'Homme": {
        brand: "Prada",
        family: "Woody Aromatic",
        description: "A modern fougere fragrance with iris, neroli, and amber.",
        ingredients: [
          "neroli",
          "black pepper",
          "cardamom",
          "iris",
          "violet",
          "geranium",
          "patchouli",
          "sandalwood",
          "cedar",
        ],
        year: 2016,
        perfumer: "Daniela Andrier",
        image: "prada-lhomme.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Prada Luna Rossa Carbon": {
        brand: "Prada",
        family: "Aromatic Fougere",
        description:
          "A modern masculine fragrance with bergamot, pepper, and ambroxan.",
        ingredients: [
          "bergamot",
          "black pepper",
          "lavender",
          "metallic notes",
          "ambroxan",
          "patchouli",
        ],
        year: 2017,
        perfumer: "Daniela Andrier",
        image: "prada-carbon.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Versace
      "Versace Eros": {
        brand: "Versace",
        family: "Oriental Fresh",
        description:
          "A passionate and seductive fragrance with mint, apple, and vanilla.",
        ingredients: [
          "mint",
          "lemon",
          "apple",
          "geranium",
          "tonka bean",
          "vanilla",
          "cedar",
        ],
        year: 2012,
        perfumer: "Aurelien Guichard",
        image: "versace-eros.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml","200ml"],
      },
      "Versace Dylan Blue": {
        brand: "Versace",
        family: "Aromatic Fougere",
        description:
          "A fresh and modern fragrance with bergamot, aquatic notes, and patchouli.",
        ingredients: [
          "bergamot",
          "grapefruit",
          "aquatic notes",
          "black pepper",
          "patchouli",
          "incense",
        ],
        year: 2016,
        perfumer: "Alberto Morillas",
        image: "versace-dylan-blue.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml","200ml"],
      },

      // Armani
      "Acqua di Gio Profumo": {
        brand: "Giorgio Armani",
        family: "Aquatic Aromatic",
        description:
          "An aquatic aromatic fragrance with bergamot, geranium, and patchouli.",
        ingredients: [
          "bergamot",
          "sea notes",
          "geranium",
          "sage",
          "patchouli",
          "incense",
        ],
        year: 2015,
        perfumer: "Alberto Morillas",
        image: "adg-profumo.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Dolce & Gabbana
      "Dolce & Gabbana The One": {
        brand: "Dolce & Gabbana",
        family: "Oriental Spicy",
        description:
          "A sophisticated oriental spicy fragrance with grapefruit, coriander, and amber.",
        ingredients: [
          "grapefruit",
          "coriander",
          "basil",
          "cardamom",
          "orange blossom",
          "ginger",
          "cedar",
          "amber",
          "tobacco",
        ],
        year: 2008,
        perfumer: "Olivier Polge",
        image: "dg-the-one.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Hermes
      "Hermes Terre d'Hermes": {
        brand: "Hermes",
        family: "Woody Spicy",
        description:
          "An earthy woody fragrance with orange, flint, and vetiver.",
        ingredients: [
          "orange",
          "grapefruit",
          "pepper",
          "pelargonium",
          "flint",
          "vetiver",
          "cedar",
          "benzoin",
        ],
        year: 2006,
        perfumer: "Jean-Claude Ellena",
        image: "hermes-terre.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Add more brands and fragrances...
      "Montblanc Legend": {
        brand: "Montblanc",
        family: "Aromatic Fougere",
        description:
          "A fresh and masculine fragrance with bergamot, lavender, and sandalwood.",
        ingredients: [
          "bergamot",
          "lavender",
          "pineapple",
          "geranium",
          "apple",
          "sandalwood",
          "tonka bean",
        ],
        year: 2011,
        perfumer: "Olivier Pescheux",
        image: "montblanc-legend.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Niche fragrances
      "Nasomatto Black Afgano": {
        brand: "Nasomatto",
        family: "Oriental Woody",
        description:
          "A dark and mysterious fragrance with cannabis, oud, and amber.",
        ingredients: ["cannabis", "oud", "amber", "oudh", "green notes"],
        year: 2009,
        perfumer: "Alessandro Gualtieri",
        image: "nasomatto-black-afgano.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      "Le Labo Santal 33": {
        brand: "Le Labo",
        family: "Woody Aromatic",
        description: "A cult favorite with sandalwood, cardamom, and iris.",
        ingredients: ["sandalwood", "cardamom", "iris", "violet", "ambroxan"],
        year: 2011,
        perfumer: "Frank Voelkl",
        image: "le-labo-santal-33.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      "Byredo Bal d'Afrique": {
        brand: "Byredo",
        family: "Woody Floral Musk",
        description:
          "A vibrant African-inspired fragrance with bergamot, violet, and cedar.",
        ingredients: [
          "bergamot",
          "lemon",
          "neroli",
          "violet",
          "jasmine",
          "cedar",
          "vetiver",
          "musk",
        ],
        year: 2009,
        perfumer: "Ben Gorham",
        image: "byredo-bal-dafrique.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Maison Francis Kurkdjian
      "Maison Francis Kurkdjian Baccarat Rouge 540": {
        brand: "Maison Francis Kurkdjian",
        family: "Oriental Floral",
        description:
          "A luminous and radiant fragrance with saffron, jasmine, and amberwood.",
        ingredients: [
          "saffron",
          "jasmine",
          "amberwood",
          "ambergris",
          "cedar",
          "fir resin",
        ],
        year: 2015,
        perfumer: "Francis Kurkdjian",
        image: "mfk-baccarat-rouge-540.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Maison Francis Kurkdjian Aqua Celestia": {
        brand: "Maison Francis Kurkdjian",
        family: "Floral Aquatic",
        description:
          "A fresh and airy fragrance with bergamot, blackcurrant, and musk.",
        ingredients: [
          "bergamot",
          "blackcurrant",
          "lime",
          "jasmine",
          "mimosa",
          "musk",
          "sandalwood",
        ],
        year: 2017,
        perfumer: "Francis Kurkdjian",
        image: "mfk-aqua-celestia.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Maison Francis Kurkdjian Gentle Fluidity Gold": {
        brand: "Maison Francis Kurkdjian",
        family: "Woody Spicy",
        description:
          "A warm and spicy fragrance with juniper, nutmeg, and amber.",
        ingredients: [
          "juniper",
          "nutmeg",
          "coriander",
          "musk",
          "amber",
          "vanilla",
        ],
        year: 2019,
        perfumer: "Francis Kurkdjian",
        image: "mfk-gentle-fluidity-gold.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Amouage
      "Amouage Jubilation XXV": {
        brand: "Amouage",
        family: "Oriental Spicy",
        description:
          "A luxurious oriental fragrance with incense, rose, and oud.",
        ingredients: [
          "orange",
          "rose",
          "incense",
          "oud",
          "amber",
          "musk",
          "patchouli",
        ],
        year: 2008,
        perfumer: "Bertrand Duchaufour",
        image: "amouage-jubilation-xxv.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Givenchy
      "Givenchy L'Interdit Absolu": {
        brand: "Givenchy",
        family: "Oriental Floral",
        description:
          "An intense interpretation with blackcurrant, jasmine, and vetiver.",
        ingredients: [
          "blackcurrant",
          "ginger",
          "jasmine",
          "tuberose",
          "vetiver",
          "patchouli",
        ],
        year: 2021,
        perfumer: "Anne Flipo & Fanny Bal",
        image: "givenchy-linterdit-absolu.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Givenchy Irresistible": {
        brand: "Givenchy",
        family: "Floral Fruity",
        description:
          "A sparkling and feminine fragrance with rose, pear, and ambergris.",
        ingredients: [
          "pear",
          "ambergris",
          "rose",
          "iris",
          "musk",
          "virginia cedar",
        ],
        year: 2020,
        perfumer: "Fanny Bal, Dominique Ropion & Anne Flipo",
        image: "givenchy-irresistible.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Givenchy L'Interdit Rouge": {
        brand: "Givenchy",
        family: "Oriental Floral",
        description:
          "A bold and spicy version with red spices, jasmine, and sandalwood.",
        ingredients: [
          "red spices",
          "ginger",
          "jasmine",
          "tuberose",
          "sandalwood",
          "patchouli",
        ],
        year: 2021,
        perfumer: "Dominique Ropion & Anne Flipo",
        image: "givenchy-linterdit-rouge.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Givenchy L'Interdit": {
        brand: "Givenchy",
        family: "Floral White",
        description:
          "A white floral fragrance with jasmine, tuberose, and orange blossom.",
        ingredients: [
          "pear",
          "bergamot",
          "jasmine",
          "tuberose",
          "orange blossom",
          "patchouli",
        ],
        year: 2018,
        perfumer: "Dominique Ropion, Anne Flipo & Fanny Bal",
        image: "givenchy-linterdit.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Givenchy L'Interdit Rouge Ultime": {
        brand: "Givenchy",
        family: "Oriental Spicy",
        description:
          "The most intense version with blackcurrant, jasmine, and sandalwood.",
        ingredients: [
          "blackcurrant",
          "ginger",
          "jasmine",
          "tuberose",
          "sandalwood",
          "benzoin",
        ],
        year: 2022,
        perfumer: "Anne Flipo & Fanny Bal",
        image: "givenchy-linterdit-rouge-ultime.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Gucci
      "Gucci Flora by Gucci": {
        brand: "Gucci",
        family: "Floral",
        description:
          "A vibrant floral fragrance with mandarin, peony, and sandalwood.",
        ingredients: [
          "mandarin",
          "peony",
          "rose",
          "osmanthus",
          "sandalwood",
          "patchouli",
        ],
        year: 2009,
        perfumer: "Ilias Ermenidis",
        image: "gucci-flora.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Gucci Bloom": {
        brand: "Gucci",
        family: "Floral",
        description:
          "A rich white floral bouquet with jasmine, tuberose, and rangoon creeper.",
        ingredients: ["natural tuberose", "jasmine", "rangoon creeper"],
        year: 2017,
        perfumer: "Alberto Morillas",
        image: "gucci-bloom.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Gucci Flora Gorgeous Jasmine": {
        brand: "Gucci",
        family: "Floral",
        description:
          "An intoxicating jasmine fragrance with red berries and brown sugar.",
        ingredients: [
          "red berries",
          "pear",
          "jasmine sambac",
          "frangipani",
          "brown sugar",
          "patchouli",
        ],
        year: 2021,
        perfumer: "Mikaël Fillion-Schultz",
        image: "gucci-flora-jasmine.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Gucci Envy Me": {
        brand: "Gucci",
        family: "Oriental Floral",
        description: "A glamorous fragrance with pomegranate, peony, and musk.",
        ingredients: [
          "pomegranate",
          "cardamom",
          "peony",
          "jasmine",
          "iris",
          "musk",
        ],
        year: 2009,
        perfumer: "Aurelien Guichard",
        image: "gucci-envy-me.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Gucci Bamboo": {
        brand: "Gucci",
        family: "Floral",
        description:
          "A modern fragrance with bergamot, ylang-ylang, and sandalwood.",
        ingredients: [
          "bergamot",
          "pear",
          "ylang-ylang",
          "lily",
          "sandalwood",
          "amber",
        ],
        year: 2015,
        perfumer: "Alberto Morillas",
        image: "gucci-bamboo.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Gucci Guilty": {
        brand: "Gucci",
        family: "Oriental Floral",
        description:
          "A provocative fragrance with mandora, lilac, and patchouli.",
        ingredients: [
          "mandora",
          "pink pepper",
          "lilac",
          "geranium",
          "patchouli",
          "amber",
        ],
        year: 2010,
        perfumer: "Aurelien Guichard",
        image: "gucci-guilty.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      "Amouage Interlude Woman": {
        brand: "Amouage",
        family: "Oriental Woody",
        description:
          "A complex and smoky fragrance with oregano, incense, and oud.",
        ingredients: [
          "oregano",
          "bergamot",
          "incense",
          "oud",
          "amber",
          "leather",
          "sandalwood",
        ],
        year: 2012,
        perfumer: "Pierre Negrin",
        image: "amouage-interlude-man.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Creed (Additional)
      "Creed Millesime Imperial": {
        brand: "Creed",
        family: "Citrus Aromatic",
        description:
          "A regal and sophisticated fragrance with bergamot, rose, and sandalwood.",
        ingredients: [
          "bergamot",
          "lemon",
          "rose",
          "iris",
          "sandalwood",
          "musk",
          "ambergris",
        ],
        year: 1995,
        perfumer: "Olivier Creed",
        image: "creed-millesime-imperial.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["50ml","100ml","120ml"],
      },
      "Creed Virgin Island Water": {
        brand: "Creed",
        family: "Citrus Aromatic",
        description:
          "A tropical and refreshing fragrance with lime, coconut, and hibiscus.",
        ingredients: [
          "lime",
          "mandarin",
          "coconut",
          "hibiscus",
          "ginger",
          "sandalwood",
          "musk",
        ],
        year: 2007,
        perfumer: "Olivier Creed",
        image: "creed-virgin-island-water.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["50ml","100ml","120ml"],
      },

      // Diptyque
      "Diptyque Philosykos": {
        brand: "Diptyque",
        family: "Green Aromatic",
        description:
          "A green and creamy fragrance that captures the essence of a fig tree.",
        ingredients: [
          "fig leaves",
          "fig fruit",
          "fig tree sap",
          "green leaves",
          "coconut",
          "wood",
        ],
        year: 1996,
        perfumer: "Olivia Giacobetti",
        image: "diptyque-philosykos.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Diptyque Oud Palao": {
        brand: "Diptyque",
        family: "Oriental Woody",
        description:
          "A mysterious and smoky oud fragrance with rose and saffron.",
        ingredients: [
          "oud",
          "rose",
          "saffron",
          "sandalwood",
          "papyrus",
          "smoke",
        ],
        year: 2013,
        perfumer: "Fabrice Pellegrin",
        image: "diptyque-oud-palao.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Kilian
      "Kilian Love Don't Be Shy": {
        brand: "Kilian",
        family: "Oriental Gourmand",
        description:
          "A sweet and seductive fragrance with orange blossom, marshmallow, and musk.",
        ingredients: [
          "orange blossom",
          "marshmallow",
          "white peach",
          "vanilla",
          "musk",
          "amber",
        ],
        year: 2007,
        perfumer: "Calice Becker",
        image: "kilian-love-dont-be-shy.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Kilian Black Phantom": {
        brand: "Kilian",
        family: "Oriental Gourmand",
        description:
          "A dark and addictive fragrance with rum, coffee, and vanilla.",
        ingredients: [
          "rum",
          "coffee",
          "black cherry",
          "vanilla",
          "sandalwood",
          "vetiver",
        ],
        year: 2017,
        perfumer: "Sidonie Lancesseur",
        image: "kilian-black-phantom.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Frederic Malle
      "Frederic Malle Portrait of a Lady": {
        brand: "Frederic Malle",
        family: "Oriental Floral",
        description:
          "A bold and dramatic fragrance with rose, patchouli, and incense.",
        ingredients: [
          "rose",
          "raspberry",
          "patchouli",
          "incense",
          "sandalwood",
          "musk",
        ],
        year: 2010,
        perfumer: "Dominique Ropion",
        image: "fm-portrait-of-a-lady.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Frederic Malle Musc Ravageur": {
        brand: "Frederic Malle",
        family: "Oriental Spicy",
        description:
          "A warm and sensual fragrance with cinnamon, vanilla, and musk.",
        ingredients: [
          "bergamot",
          "tangerine",
          "cinnamon",
          "clove",
          "vanilla",
          "musk",
          "amber",
        ],
        year: 2000,
        perfumer: "Maurice Roucel",
        image: "fm-musc-ravageur.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Maison Margiela
      "Maison Margiela REPLICA By the Fireplace": {
        brand: "Maison Margiela",
        family: "Woody Aromatic",
        description:
          "A cozy and warm fragrance that evokes sitting by a fireplace.",
        ingredients: [
          "pink pepper",
          "orange blossom",
          "chestnuts",
          "juniper",
          "vanilla",
          "cashmeran",
        ],
        year: 2015,
        perfumer: "Marie Salamagne",
        image: "mm-by-the-fireplace.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Maison Margiela REPLICA Jazz Club": {
        brand: "Maison Margiela",
        family: "Oriental Woody",
        description:
          "A sophisticated fragrance that captures the ambiance of a jazz club.",
        ingredients: [
          "pink pepper",
          "neroli",
          "rum",
          "tobacco",
          "vanilla",
          "sandalwood",
        ],
        year: 2013,
        perfumer: "Jacques Cavallier",
        image: "mm-jazz-club.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Penhaligon's
      "Penhaligon's Halfeti": {
        brand: "Penhaligon's",
        family: "Oriental Spicy",
        description:
          "A mysterious and exotic fragrance with rose, oud, and saffron.",
        ingredients: [
          "bergamot",
          "lemon",
          "rose",
          "oud",
          "saffron",
          "amber",
          "vanilla",
        ],
        year: 2015,
        perfumer: "Christian Provenzano",
        image: "penhaligons-halfeti.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Penhaligon's Babylon": {
        brand: "Penhaligon's",
        family: "Oriental Spicy",
        description:
          "A rich and opulent fragrance with saffron, nutmeg, and cedar.",
        ingredients: [
          "saffron",
          "nutmeg",
          "cumin",
          "cedar",
          "sandalwood",
          "vanilla",
        ],
        year: 2019,
        perfumer: "Shyamala Maisondieu",
        image: "penhaligons-babylon.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Yves Saint Laurent
      "Yves Saint Laurent La Nuit de l'Homme": {
        brand: "Yves Saint Laurent",
        family: "Oriental Spicy",
        description:
          "A seductive and mysterious fragrance with cardamom, lavender, and cedar.",
        ingredients: [
          "bergamot",
          "cardamom",
          "lavender",
          "cedar",
          "vetiver",
          "caraway",
        ],
        year: 2009,
        perfumer: "Anne Flipo, Pierre Wargnye & Dominique Ropion",
        image: "ysl-la-nuit-de-lhomme.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["60ml","100ml"],
      },
      "Yves Saint Laurent Y": {
        brand: "Yves Saint Laurent",
        family: "Aromatic Fougere",
        description:
          "A fresh and modern fragrance with bergamot, sage, and cedar.",
        ingredients: [
          "bergamot",
          "ginger",
          "sage",
          "geranium",
          "cedar",
          "vetiver",
          "ambroxan",
        ],
        year: 2017,
        perfumer: "Dominique Ropion & Antoine Maisondieu",
        image: "ysl-y.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["60ml","100ml"],
      },

      // Giorgio Armani (Additional)
      "Giorgio Armani Acqua di Gio Absolu": {
        brand: "Giorgio Armani",
        family: "Aquatic Aromatic",
        description:
          "An intense aquatic fragrance with bergamot, lavender, and patchouli.",
        ingredients: [
          "bergamot",
          "sea notes",
          "lavender",
          "geranium",
          "patchouli",
          "ambergris",
        ],
        year: 2018,
        perfumer: "Alberto Morillas",
        image: "armani-adg-absolu.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Giorgio Armani Code Absolu": {
        brand: "Giorgio Armani",
        family: "Oriental Spicy",
        description:
          "A sophisticated and intense fragrance with bergamot, apple, and tonka bean.",
        ingredients: [
          "bergamot",
          "apple",
          "cardamom",
          "orange blossom",
          "tonka bean",
          "suede",
        ],
        year: 2019,
        perfumer: "Antoine Maisondieu",
        image: "armani-code-absolu.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Issey Miyake
      "Issey Miyake L'Eau d'Issey Pour Homme": {
        brand: "Issey Miyake",
        family: "Aquatic Aromatic",
        description:
          "A fresh and aquatic fragrance with yuzu, nutmeg, and sandalwood.",
        ingredients: [
          "yuzu",
          "bergamot",
          "lemon",
          "nutmeg",
          "water lily",
          "sandalwood",
          "cedar",
          "musk",
        ],
        year: 1994,
        perfumer: "Jacques Cavallier",
        image: "issey-miyake-leau-dissey.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml","125ml"],
      },

      // Thierry Mugler
      "Thierry Mugler A*Men": {
        brand: "Thierry Mugler",
        family: "Oriental Woody",
        description:
          "A powerful and gourmand fragrance with coffee, tar, and patchouli.",
        ingredients: [
          "coffee",
          "tar",
          "lavender",
          "patchouli",
          "vanilla",
          "honey",
        ],
        year: 1996,
        perfumer: "Jacques Huclier",
        image: "mugler-amen.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Azzaro
      "Azzaro Wanted by Night": {
        brand: "Azzaro",
        family: "Oriental Spicy",
        description:
          "A warm and spicy fragrance with cinnamon, red cedar, and vanilla.",
        ingredients: [
          "bergamot",
          "cinnamon",
          "red cedar",
          "tobacco",
          "vanilla",
          "tonka bean",
        ],
        year: 2018,
        perfumer: "Fabrice Pellegrin",
        image: "azzaro-wanted-by-night.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["50ml","100ml","150ml"],
      },

      // Mancera
      "Mancera Red Tobacco": {
        brand: "Mancera",
        family: "Oriental Spicy",
        description:
          "A rich and smoky fragrance with tobacco, oud, and spices.",
        ingredients: [
          "cinnamon",
          "nutmeg",
          "tobacco",
          "oud",
          "patchouli",
          "vanilla",
          "amber",
        ],
        year: 2017,
        perfumer: "Pierre Montale",
        image: "mancera-red-tobacco.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Mancera Cedrat Boise": {
        brand: "Mancera",
        family: "Woody Citrus",
        description:
          "A fresh and woody fragrance with citron, spices, and sandalwood.",
        ingredients: [
          "citron",
          "bergamot",
          "blackcurrant",
          "spices",
          "patchouli",
          "sandalwood",
          "vanilla",
          "musk",
        ],
        year: 2017,
        perfumer: "Pierre Montale",
        image: "mancera-cedrat-boise.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Montale
      "Montale Black Aoud": {
        brand: "Montale",
        family: "Oriental Woody",
        description:
          "A powerful and dark oud fragrance with rose and patchouli.",
        ingredients: [
          "oud",
          "rose",
          "patchouli",
          "sandalwood",
          "amber",
          "vanilla",
        ],
        year: 2006,
        perfumer: "Pierre Montale",
        image: "montale-black-aoud.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Xerjoff
      "Xerjoff Naxos": {
        brand: "Xerjoff",
        family: "Oriental Gourmand",
        description:
          "A luxurious and sweet fragrance with bergamot, honey, and tobacco.",
        ingredients: [
          "bergamot",
          "lemon",
          "honey",
          "cinnamon",
          "tobacco",
          "vanilla",
          "tonka bean",
        ],
        year: 2015,
        perfumer: "Chris Maurice",
        image: "xerjoff-naxos.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Roja Parfums
      "Roja Parfums Enigma": {
        brand: "Roja Parfums",
        family: "Oriental Spicy",
        description:
          "A mysterious and complex fragrance with bergamot, rose, and ambergris.",
        ingredients: [
          "bergamot",
          "lemon",
          "rose",
          "geranium",
          "jasmine",
          "tobacco",
          "ambergris",
          "vanilla",
        ],
        year: 2013,
        perfumer: "Roja Dove",
        image: "roja-enigma.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // MASSIVE EXPANSION - 150+ NEW FRAGRANCES

      // === FEMALE FRAGRANCES ===
      "Chanel Coco Mademoiselle": {
        brand: "Chanel",
        family: "Oriental Floral",
        description:
          "A sparkling and bold ambery fragrance with orange, jasmine, and patchouli.",
        ingredients: [
          "orange",
          "bergamot",
          "jasmine",
          "rose",
          "patchouli",
          "vanilla",
          "amber",
        ],
        year: 2001,
        perfumer: "Jacques Polge",
        image: "chanel-coco-mademoiselle.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["50ml","100ml"],
      },
      "Chanel No. 5": {
        brand: "Chanel",
        family: "Floral Aldehyde",
        description:
          "The legendary and timeless fragrance with ylang-ylang, rose, and sandalwood.",
        ingredients: [
          "aldehydes",
          "ylang-ylang",
          "rose",
          "jasmine",
          "sandalwood",
          "vanilla",
        ],
        year: 1921,
        perfumer: "Ernest Beaux",
        image: "chanel-no-5.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["50ml","100ml"],
      },
      "Dior J'adore": {
        brand: "Dior",
        family: "Floral",
        description:
          "An opulent bouquet of the most beautiful flowers with ylang-ylang, rose, and jasmine.",
        ingredients: ["ylang-ylang", "bergamot", "rose", "jasmine", "tuberose"],
        year: 1999,
        perfumer: "Calice Becker",
        image: "dior-jadore.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["50ml","100ml"],
      },
      "Dior Miss Dior": {
        brand: "Dior",
        family: "Floral Chypre",
        description:
          "A sophisticated chypre with Italian mandarin, Egyptian jasmine, and Indonesian patchouli.",
        ingredients: ["mandarin", "jasmine", "patchouli", "rose", "musk"],
        year: 2012,
        perfumer: "François Demachy",
        image: "dior-miss-dior.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["50ml","100ml"],
      },
      "Marc Jacobs Daisy": {
        brand: "Marc Jacobs",
        family: "Floral Fruity",
        description:
          "A charming bouquet of daisies with violet leaves, jasmine, and musk.",
        ingredients: [
          "violet leaves",
          "strawberry",
          "jasmine",
          "gardenia",
          "musk",
          "vanilla",
        ],
        year: 2007,
        perfumer: "Alberto Morillas",
        image: "marc-jacobs-daisy.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Lancôme La Vie Est Belle": {
        brand: "Lancôme",
        family: "Oriental Gourmand",
        description:
          "A sweet gourmand with blackcurrant, jasmine, and vanilla.",
        ingredients: [
          "blackcurrant",
          "pear",
          "jasmine",
          "orange blossom",
          "vanilla",
          "patchouli",
        ],
        year: 2012,
        perfumer: "Olivier Polge, Dominique Ropion & Anne Flipo",
        image: "lancome-la-vie-est-belle.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Estée Lauder Beautiful": {
        brand: "Estée Lauder",
        family: "Floral",
        description:
          "A romantic bouquet of a thousand flowers with rose, jasmine, and lily.",
        ingredients: [
          "rose",
          "jasmine",
          "lily",
          "tuberose",
          "marigold",
          "sandalwood",
        ],
        year: 1985,
        perfumer: "Sophia Grojsman",
        image: "estee-lauder-beautiful.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // === MORE POPULAR BRANDS & FRAGRANCES ===

      // Jo Malone London
      "Jo Malone English Pear & Freesia": {
        brand: "Jo Malone London",
        family: "Floral Fruity",
        description: "A sophisticated blend of pear, freesia, and white musk.",
        ingredients: ["pear", "freesia", "rose", "white musk", "patchouli", "rhubarb"],
        year: 2010,
        perfumer: "Jo Malone",
        image: "jo-malone-english-pear-freesia.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Jo Malone Lime Basil & Mandarin": {
        brand: "Jo Malone London",
        family: "Citrus Aromatic",
        description: "A modern classic with lime, basil, and mandarin.",
        ingredients: ["lime", "basil", "mandarin", "iris", "thyme", "vetiver"],
        year: 1999,
        perfumer: "Jo Malone",
        image: "jo-malone-lime-basil-mandarin.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Jo Malone Wood Sage & Sea Salt": {
        brand: "Jo Malone London",
        family: "Woody Aromatic",
        description: "A coastal fragrance with sage, sea salt, and ambrette seeds.",
        ingredients: ["sage", "sea salt", "ambrette seeds", "grapefruit", "red algae"],
        year: 2014,
        perfumer: "Christine Nagel",
        image: "jo-malone-wood-sage-sea-salt.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Jo Malone Peony & Blush Suede": {
        brand: "Jo Malone London",
        family: "Floral",
        description: "A luxurious bouquet of peony with soft suede notes.",
        ingredients: ["red apple", "peony", "jasmine", "rose", "suede", "musk"],
        year: 2013,
        perfumer: "Marie Salamagne",
        image: "jo-malone-peony-blush-suede.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Calvin Klein
      "Calvin Klein Euphoria": {
        brand: "Calvin Klein",
        family: "Oriental Floral",
        description: "A captivating blend of pomegranate, black orchid, and amber.",
        ingredients: ["pomegranate", "persimmon", "black orchid", "lotus blossom", "amber", "mahogany"],
        year: 2005,
        perfumer: "Dominique Ropion & Carlos Benaim",
        image: "calvin-klein-euphoria.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["50ml","100ml"],
      },
      "Calvin Klein Obsession": {
        brand: "Calvin Klein",
        family: "Oriental Spicy",
        description: "A passionate and intense fragrance with mandarin, spices, and amber.",
        ingredients: ["mandarin", "bergamot", "coriander", "jasmine", "orange blossom", "amber", "musk"],
        year: 1985,
        perfumer: "Jean Guichard & Bob Slattery",
        image: "calvin-klein-obsession.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["75ml","125ml"],
      },
      "Calvin Klein Eternity": {
        brand: "Calvin Klein",
        family: "Floral",
        description: "A timeless floral with freesia, lily, and sandalwood.",
        ingredients: ["freesia", "lily", "narcissus", "marigold", "rose", "sandalwood"],
        year: 1988,
        perfumer: "Sophia Grojsman",
        image: "calvin-klein-eternity.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["50ml","100ml"],
      },
      "Calvin Klein CK One": {
        brand: "Calvin Klein",
        family: "Citrus Aromatic",
        description: "The iconic unisex fragrance with bergamot, cardamom, and musk.",
        ingredients: ["bergamot", "cardamom", "pineapple", "jasmine", "rose", "sandalwood", "musk"],
        year: 1994,
        perfumer: "Alberto Morillas & Harry Fremont",
        image: "calvin-klein-ck-one.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml","200ml"],
      },

      // Hugo Boss
      "Hugo Boss The Scent": {
        brand: "Hugo Boss",
        family: "Oriental Spicy",
        description: "A seductive fragrance with ginger, exotic maninka, and leather.",
        ingredients: ["ginger", "bergamot", "maninka", "lavender", "leather", "sandalwood"],
        year: 2015,
        perfumer: "Bruno Jovanovic",
        image: "hugo-boss-the-scent.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml","200ml"],
      },
      "Hugo Boss Bottled": {
        brand: "Hugo Boss",
        family: "Woody Spicy",
        description: "A modern masculine fragrance with apple, cinnamon, and sandalwood.",
        ingredients: ["apple", "plum", "bergamot", "cinnamon", "mahogany", "sandalwood", "vanilla"],
        year: 1998,
        perfumer: "Annick Menardo & Christian Dussoulier",
        image: "hugo-boss-bottled.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml","200ml"],
      },
      "Hugo Boss Boss Femme": {
        brand: "Hugo Boss",
        family: "Floral Fruity",
        description: "An elegant feminine fragrance with blackcurrant, lily, and apricot blossom.",
        ingredients: ["blackcurrant", "tangerine", "lily", "freesia", "apricot blossom", "lemon wood"],
        year: 2006,
        perfumer: "Antoine Maisondieu",
        image: "hugo-boss-femme.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml","200ml"],
      },

      // Paco Rabanne
      "Paco Rabanne 1 Million": {
        brand: "Paco Rabanne",
        family: "Oriental Spicy",
        description: "A bold and dazzling fragrance with blood mandarin, mint, and leather.",
        ingredients: ["blood mandarin", "mint", "rose", "cinnamon", "spice notes", "leather", "amber"],
        year: 2008,
        perfumer: "Christophe Raynaud, Olivier Pescheux & Michel Girard",
        image: "paco-rabanne-1-million.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml","200ml"],
      },
      "Paco Rabanne Lady Million": {
        brand: "Paco Rabanne",
        family: "Floral",
        description: "A sparkling floral with raspberry, jasmine, and honey.",
        ingredients: ["raspberry", "neroli", "jasmine", "orange blossom", "gardenia", "honey", "patchouli"],
        year: 2010,
        perfumer: "Anne Flipo, Beatrice Piquet & Dominique Ropion",
        image: "paco-rabanne-lady-million.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["50ml","80ml"],
      },
      "Paco Rabanne Olympéa": {
        brand: "Paco Rabanne",
        family: "Oriental Floral",
        description: "A modern goddess fragrance with ginger lily, vanilla, and cashmere wood.",
        ingredients: ["ginger lily", "water jasmine", "vanilla", "sandalwood", "cashmere wood", "salt"],
        year: 2015,
        perfumer: "Anne Flipo, Loc Dong & Dominique Ropion",
        image: "paco-rabanne-olympea.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml","200ml"],
      },
      "Paco Rabanne Invictus": {
        brand: "Paco Rabanne",
        family: "Woody Aquatic",
        description: "A powerful aquatic fragrance with grapefruit, sea notes, and guaiac wood.",
        ingredients: ["grapefruit", "sea notes", "jasmine", "bay leaf", "guaiac wood", "patchouli", "ambergris"],
        year: 2013,
        perfumer: "Veronique Nyberg, Anne Flipo & Olivier Polge",
        image: "paco-rabanne-invictus.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml","200ml"],
      },

      // Byredo (Additional)
      "Byredo Gypsy Water": {
        brand: "Byredo",
        family: "Woody Aromatic",
        description: "A bohemian fragrance with bergamot, juniper berries, and vanilla.",
        ingredients: ["bergamot", "lemon", "juniper berries", "incense", "pine needles", "vanilla", "sandalwood"],
        year: 2008,
        perfumer: "Jerome Epinette",
        image: "byredo-gypsy-water.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Byredo Blanche": {
        brand: "Byredo",
        family: "Floral Aldehyde",
        description: "A pure white fragrance with rose, peony, and blonde woods.",
        ingredients: ["rose centifolia", "peony", "aldehyde", "violet", "sandalwood", "musk"],
        year: 2009,
        perfumer: "Ben Gorham",
        image: "byredo-blanche.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Byredo Mojave Ghost": {
        brand: "Byredo",
        family: "Floral Woody Musk",
        description: "A ghostly presence with magnolia, sandalwood, and crisp amber.",
        ingredients: ["jamaican nesberry", "magnolia", "violet", "sandalwood", "crisp amber", "cedarwood"],
        year: 2014,
        perfumer: "Jerome Epinette",
        image: "byredo-mojave-ghost.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Le Labo (Additional)
      "Le Labo Rose 31": {
        brand: "Le Labo",
        family: "Floral Spicy",
        description: "A spicy rose with cumin, olibanum, and cedar.",
        ingredients: ["rose", "cumin", "olibanum", "cedar", "labdanum", "agarwood"],
        year: 2006,
        perfumer: "Djamel Belaid",
        image: "le-labo-rose-31.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Le Labo Thé Pour Un Été": {
        brand: "Le Labo",
        family: "Aromatic Green",
        description: "A refreshing tea fragrance with bergamot, fig, and bay leaves.",
        ingredients: ["bergamot", "orange blossom", "white tea", "fig", "bay leaves", "cedar"],
        year: 2005,
        perfumer: "Frank Voelkl",
        image: "le-labo-the-pour-un-ete.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Le Labo Bergamote 22": {
        brand: "Le Labo",
        family: "Citrus",
        description: "A sparkling bergamot with grapefruit and vetiver.",
        ingredients: ["bergamot", "grapefruit", "vetiver", "amber", "musk"],
        year: 2006,
        perfumer: "Frank Voelkl",
        image: "le-labo-bergamote-22.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // More Creed
      "Creed Royal Mayfair": {
        brand: "Creed",
        family: "Woody Chypre",
        description: "A sophisticated blend of bergamot, gin, and eucalyptus.",
        ingredients: ["bergamot", "gin", "eucalyptus", "rose", "cedarwood", "sandalwood"],
        year: 2015,
        perfumer: "Olivier Creed",
        image: "creed-royal-mayfair.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["50ml","100ml","120ml"],
      },
      "Creed Viking": {
        brand: "Creed",
        family: "Oriental Spicy",
        description: "A powerful masculine fragrance with bergamot, lemon, and sandalwood.",
        ingredients: ["bergamot", "lemon", "pink pepper", "rose", "sandalwood", "ambergris"],
        year: 2017,
        perfumer: "Olivier Creed",
        image: "creed-viking.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["50ml","100ml","120ml"],
      },
      "Creed Love in White": {
        brand: "Creed",
        family: "Floral",
        description: "A romantic white floral with rice husk, daffodil, and magnolia.",
        ingredients: ["rice husk", "daffodil", "magnolia", "iris", "sandalwood", "musk"],
        year: 2005,
        perfumer: "Olivier Creed",
        image: "creed-love-in-white.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["50ml","100ml","120ml"],
      },

      // More Tom Ford
      "Tom Ford Lost Cherry": {
        brand: "Tom Ford",
        family: "Oriental Gourmand",
        description: "A tempting cherry fragrance with liqueur, Turkish rose, and sandalwood.",
        ingredients: ["black cherry", "cherry liqueur", "bitter almond", "turkish rose", "jasmine sambac", "sandalwood"],
        year: 2018,
        perfumer: "Louise Turner",
        image: "tom-ford-lost-cherry.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["50ml","100ml"],
      },
      "Tom Ford Soleil Blanc": {
        brand: "Tom Ford",
        family: "Floral Solar",
        description: "A solar floral with bergamot, ylang-ylang, and coconut.",
        ingredients: ["bergamot", "cardamom", "ylang-ylang", "tuberose", "coconut", "amber"],
        year: 2016,
        perfumer: "Shyamala Maisondieu",
        image: "tom-ford-soleil-blanc.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["50ml","100ml"],
      },
      "Tom Ford Bitter Peach": {
        brand: "Tom Ford",
        family: "Oriental Fruity",
        description: "A luscious peach fragrance with blood orange, rum, and patchouli.",
        ingredients: ["blood orange", "peach", "cardamom", "rum", "cognac", "patchouli", "sandalwood"],
        year: 2020,
        perfumer: "Shyamala Maisondieu",
        image: "tom-ford-bitter-peach.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["50ml","100ml"],
      },

      // Burberry
      "Burberry My Burberry": {
        brand: "Burberry",
        family: "Floral",
        description: "A contemporary British fragrance with bergamot, quince, and patchouli.",
        ingredients: ["bergamot", "mandarin", "quince", "freesia", "golden leaf", "patchouli", "rose"],
        year: 2014,
        perfumer: "Francis Kurkdjian",
        image: "burberry-my-burberry.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["50ml","90ml"],
      },
      "Burberry London for Men": {
        brand: "Burberry",
        family: "Oriental Spicy",
        description: "A warm spicy fragrance with bergamot, lavender, and opoponax.",
        ingredients: ["bergamot", "lavender", "cinnamon", "mimosa", "leather", "opoponax", "tobacco"],
        year: 2006,
        perfumer: "Antoine Maisondieu",
        image: "burberry-london-men.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Burberry Her": {
        brand: "Burberry",
        family: "Fruity Gourmand",
        description: "A vibrant fruity gourmand with blackberry, jasmine, and musk.",
        ingredients: ["blackberry", "raspberry", "plum", "jasmine", "violet", "musk", "cashmeran"],
        year: 2018,
        perfumer: "Francis Kurkdjian",
        image: "burberry-her.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["50ml","100ml"],
      },

      // Hermès (Additional)
      "Hermès Un Jardin Sur Le Toit": {
        brand: "Hermès",
        family: "Woody Floral Musk",
        description: "A garden fragrance with bergamot, grass, and pear.",
        ingredients: ["bergamot", "lime", "grass", "pear", "apple", "cedar", "musk"],
        year: 2011,
        perfumer: "Jean-Claude Ellena",
        image: "hermes-jardin-sur-le-toit.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Hermès Twilly d'Hermès": {
        brand: "Hermès",
        family: "Floral Spicy",
        description: "A spicy floral with ginger, tuberose, and sandalwood.",
        ingredients: ["ginger", "bergamot", "tuberose", "jasmine", "sandalwood", "musk"],
        year: 2017,
        perfumer: "Christine Nagel",
        image: "hermes-twilly.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Jean Paul Gaultier
      "Jean Paul Gaultier La Belle": {
        brand: "Jean Paul Gaultier",
        family: "Oriental Gourmand",
        description: "A beautiful gourmand with bergamot, pear, and vanilla.",
        ingredients: ["bergamot", "pear", "jasmine", "vetiver", "vanilla", "sandalwood"],
        year: 2019,
        perfumer: "Dora Baghriche",
        image: "jpg-la-belle.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Jean Paul Gaultier Le Male": {
        brand: "Jean Paul Gaultier",
        family: "Oriental Fougere",
        description: "A seductive masculine fragrance with mint, lavender, and vanilla.",
        ingredients: ["mint", "bergamot", "lavender", "cumin", "orange blossom", "vanilla", "sandalwood"],
        year: 1995,
        perfumer: "Francis Kurkdjian",
        image: "jpg-le-male.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Jean Paul Gaultier Scandal": {
        brand: "Jean Paul Gaultier",
        family: "Oriental Floral",
        description: "A scandalous fragrance with blood orange, jasmine, and honey.",
        ingredients: ["blood orange", "mandarin", "jasmine", "tuberose", "honey", "patchouli"],
        year: 2017,
        perfumer: "Daphne Bugey, Fabrice Pellegrin & Natalie Gracia-Cetto",
        image: "jpg-scandal.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Valentino
      "Valentino Donna": {
        brand: "Valentino",
        family: "Chypre Floral",
        description: "A modern chypre with bergamot, iris, and patchouli.",
        ingredients: ["bergamot", "plum", "iris", "rose", "vanilla", "patchouli", "leather"],
        year: 2015,
        perfumer: "Sonia Constant",
        image: "valentino-donna.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Valentino Uomo": {
        brand: "Valentino",
        family: "Oriental Woody",
        description: "An elegant masculine fragrance with bergamot, coffee, and cedar.",
        ingredients: ["bergamot", "myrtle", "coffee", "gianduja", "cedar", "sandalwood"],
        year: 2014,
        perfumer: "Olivier Polge & Sonia Constant",
        image: "valentino-uomo.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Valentino Voce Viva": {
        brand: "Valentino",
        family: "Floral Oriental",
        description: "A vibrant floral with bergamot, orange blossom, and vanilla.",
        ingredients: ["bergamot", "mandarin", "orange blossom", "gardenia", "vanilla", "tonka bean"],
        year: 2020,
        perfumer: "Honorine Blanc",
        image: "valentino-voce-viva.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Chloe
      "Chloé Eau de Parfum": {
        brand: "Chloé",
        family: "Floral",
        description: "A powdery floral with peony, lychee, and cedar.",
        ingredients: ["peony", "lychee", "freesia", "rose", "magnolia", "lily of the valley", "cedar", "amber"],
        year: 2008,
        perfumer: "Amandine Clerc-Marie & Michel Almairac",
        image: "chloe-eau-de-parfum.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Chloé Nomade": {
        brand: "Chloé",
        family: "Floral Woody",
        description: "A free-spirited fragrance with bergamot, freesia, and sandalwood.",
        ingredients: ["bergamot", "lemon", "freesia", "peach", "rose", "sandalwood", "white musk"],
        year: 2018,
        perfumer: "Quentin Bisch",
        image: "chloe-nomade.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Chloé Love Story": {
        brand: "Chloé",
        family: "Floral",
        description: "A romantic fragrance with bergamot, orange blossom, and musk.",
        ingredients: ["bergamot", "blackcurrant", "orange blossom", "jasmine", "stephanotis", "musk", "cedar"],
        year: 2014,
        perfumer: "Annick Menardo & Daniela Andrier",
        image: "chloe-love-story.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Initio
      "Initio Oud for Greatness": {
        brand: "Initio",
        family: "Oriental Woody",
        description: "A powerful oud fragrance with saffron, rose, and oud.",
        ingredients: ["saffron", "nutmeg", "rose", "oud", "patchouli", "musk"],
        year: 2018,
        perfumer: "Nathalie Benareau",
        image: "initio-oud-for-greatness.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Initio Blessed Baraka": {
        brand: "Initio",
        family: "Oriental Spicy",
        description: "A mystical fragrance with cardamom, cinnamon, and sandalwood.",
        ingredients: ["cardamom", "cinnamon", "black pepper", "frankincense", "sandalwood", "amber"],
        year: 2016,
        perfumer: "Alberto Morillas",
        image: "initio-blessed-baraka.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Maison Margiela (Additional)
      "Maison Margiela REPLICA Beach Walk": {
        brand: "Maison Margiela",
        family: "Solar Floral",
        description: "A summer fragrance capturing the essence of a beach walk.",
        ingredients: ["bergamot", "pink pepper", "ylang-ylang", "coconut milk", "sandalwood", "musk"],
        year: 2012,
        perfumer: "Maurice Roucel",
        image: "mm-beach-walk.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Maison Margiela REPLICA Autumn Vibes": {
        brand: "Maison Margiela",
        family: "Woody Spicy",
        description: "A cozy autumn fragrance with carrot seeds, coriander, and cedar.",
        ingredients: ["carrot seeds", "coriander", "pink pepper", "cedar", "moss", "costus"],
        year: 2019,
        perfumer: "Maurice Roucel",
        image: "mm-autumn-vibes.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Popular Niche Brands
      "Diptyque Tam Dao": {
        brand: "Diptyque",
        family: "Woody Aromatic",
        description: "A creamy sandalwood fragrance with spices and rose.",
        ingredients: ["sandalwood", "cedar", "cypress", "rose", "spices", "amber"],
        year: 2003,
        perfumer: "Fabrice Pellegrin",
        image: "diptyque-tam-dao.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Diptyque Do Son": {
        brand: "Diptyque",
        family: "Floral",
        description: "A luminous tuberose with orange leaves and jasmine.",
        ingredients: ["tuberose", "orange leaves", "jasmine", "iris", "musk"],
        year: 2005,
        perfumer: "Fabrice Pellegrin",
        image: "diptyque-do-son.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Commodity
      "Commodity Gold": {
        brand: "Commodity",
        family: "Oriental Woody",
        description: "A warm and luxurious fragrance with bergamot, woods, and vanilla.",
        ingredients: ["bergamot", "black pepper", "woods", "amber", "vanilla", "musk"],
        year: 2013,
        perfumer: "Clement Gavarry",
        image: "commodity-gold.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Commodity Milk": {
        brand: "Commodity",
        family: "Soft Floral",
        description: "A comforting fragrance with white tea, fig, and musk.",
        ingredients: ["white tea", "fig", "marshmallow", "tonka bean", "musk"],
        year: 2013,
        perfumer: "Clement Gavarry",
        image: "commodity-milk.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Ellis Brooklyn
      "Ellis Brooklyn Bee": {
        brand: "Ellis Brooklyn",
        family: "Floral Honey",
        description: "A golden honey fragrance with vanilla, copaiba, and royal jelly accord.",
        ingredients: ["honey", "vanilla", "copaiba", "royal jelly", "benzoin"],
        year: 2020,
        perfumer: "Jerome Epinette",
        image: "ellis-brooklyn-bee.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Ellis Brooklyn Salt": {
        brand: "Ellis Brooklyn",
        family: "Marine Woody",
        description: "A coastal fragrance with sea salt, driftwood, and ambrette.",
        ingredients: ["sea salt", "driftwood", "ambrette", "musk", "cedar"],
        year: 2018,
        perfumer: "Jerome Epinette",
        image: "ellis-brooklyn-salt.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      // === MORE POPULAR & TRENDING FRAGRANCES ===

      // Guerlain
      "Guerlain Shalimar": {
        brand: "Guerlain",
        family: "Oriental",
        description: "A legendary oriental with bergamot, iris, and vanilla.",
        ingredients: ["bergamot", "lemon", "iris", "rose", "vanilla", "tonka bean"],
        year: 1925,
        perfumer: "Jacques Guerlain",
        image: "guerlain-shalimar.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Guerlain Mon Guerlain": {
        brand: "Guerlain",
        family: "Oriental Floral",
        description: "A modern classic with bergamot, jasmine sambac, and sandalwood.",
        ingredients: ["bergamot", "lavender", "jasmine sambac", "rose", "sandalwood", "vanilla", "patchouli"],
        year: 2017,
        perfumer: "Thierry Wasser",
        image: "guerlain-mon-guerlain.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Guerlain Aqua Allegoria Bergamote Calabria": {
        brand: "Guerlain",
        family: "Citrus Aromatic",
        description: "A sparkling citrus with Calabrian bergamot and white tea.",
        ingredients: ["bergamot", "petit grain", "ginger", "white tea", "musk"],
        year: 2019,
        perfumer: "Delphine Jelk",
        image: "guerlain-bergamote-calabria.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Thierry Mugler (Additional)
      "Thierry Mugler Angel": {
        brand: "Thierry Mugler",
        family: "Oriental Gourmand",
        description: "A revolutionary gourmand with praline, honey, and patchouli.",
        ingredients: ["bergamot", "honey", "praline", "caramel", "patchouli", "vanilla"],
        year: 1992,
        perfumer: "Olivier Cresp",
        image: "mugler-angel.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Thierry Mugler Alien": {
        brand: "Thierry Mugler",
        family: "Oriental Floral",
        description: "A mysterious floral with jasmine sambac, cashmeran, and white amber.",
        ingredients: ["jasmine sambac", "cashmeran", "white amber"],
        year: 2005,
        perfumer: "Laurent Bruyere & Dominique Ropion",
        image: "mugler-alien.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // More Azzaro
      "Azzaro Chrome": {
        brand: "Azzaro",
        family: "Citrus Aromatic",
        description: "A fresh aquatic fragrance with bergamot, neroli, and sandalwood.",
        ingredients: ["bergamot", "neroli", "pineapple", "cyclamen", "sandalwood", "cedar", "musk"],
        year: 1996,
        perfumer: "Gerard Haury",
        image: "azzaro-chrome.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml","200ml"],
      },
      "Azzaro The Most Wanted": {
        brand: "Azzaro",
        family: "Oriental Fougere",
        description: "A magnetic fragrance with bergamot, cardamom, and toffee.",
        ingredients: ["bergamot", "cardamom", "ginger", "lavender", "toffee", "amberwood"],
        year: 2021,
        perfumer: "Fabrice Pellegrin",
        image: "azzaro-most-wanted.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml","200ml"],
      },

      // More Mercedes-Benz, Bentley (Luxury Car Brands)
      "Mercedes-Benz Silver": {
        brand: "Mercedes-Benz",
        family: "Woody Spicy",
        description: "An elegant masculine fragrance with bergamot, violet leaf, and sandalwood.",
        ingredients: ["bergamot", "mandarin", "violet leaf", "pepper", "sandalwood", "cedar"],
        year: 2017,
        perfumer: "Olivier Cresp",
        image: "mercedes-benz-silver.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Bentley For Men Intense": {
        brand: "Bentley",
        family: "Oriental Spicy",
        description: "A luxurious spicy fragrance with bergamot, rum, and sandalwood.",
        ingredients: ["bergamot", "pink pepper", "rum", "cinnamon", "sandalwood", "amber"],
        year: 2013,
        perfumer: "Nathalie Lorson",
        image: "bentley-for-men-intense.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // More Davidoff
      "Davidoff Cool Water": {
        brand: "Davidoff",
        family: "Aromatic Aquatic",
        description: "A fresh aquatic fragrance with mint, lavender, and sandalwood.",
        ingredients: ["mint", "lavender", "coriander", "sandalwood", "musk", "amber"],
        year: 1988,
        perfumer: "Pierre Bourdon",
        image: "davidoff-cool-water.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["75ml","125ml","200ml"],
      },
      "Davidoff The Game": {
        brand: "Davidoff",
        family: "Woody Spicy",
        description: "A dynamic fragrance with bergamot, gin, and ebony wood.",
        ingredients: ["bergamot", "mandarin", "gin", "pepper", "ebony wood", "sandalwood"],
        year: 2012,
        perfumer: "Lucas Sieuzac",
        image: "davidoff-the-game.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["60ml","100ml"],
      },

      // More Ralph Lauren
      "Polo Ralph Lauren Blue": {
        brand: "Ralph Lauren",
        family: "Woody Aromatic",
        description: "A sophisticated blend with cucumber, basil, and suede.",
        ingredients: ["cucumber", "basil", "verbena", "geranium", "suede", "woodsy notes"],
        year: 2003,
        perfumer: "Carlos Benaim",
        image: "polo-blue.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Ralph Lauren Romance": {
        brand: "Ralph Lauren",
        family: "Floral",
        description: "A romantic floral with rose, ginger, and musk.",
        ingredients: ["rose", "ginger", "chamomile", "lily", "violet", "musk", "sandalwood"],
        year: 1998,
        perfumer: "Harry Fremont",
        image: "ralph-lauren-romance.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["50ml","100ml"],
      },

      // More Kenneth Cole
      "Kenneth Cole Black": {
        brand: "Kenneth Cole",
        family: "Oriental Spicy",
        description: "A bold masculine scent with bergamot, nutmeg, and incense.",
        ingredients: ["bergamot", "ginger", "nutmeg", "violet", "incense", "suede"],
        year: 1999,
        perfumer: "Firmenich",
        image: "kenneth-cole-black.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // More Lacoste
      "Lacoste L.12.12 Blanc": {
        brand: "Lacoste",
        family: "Woody Aromatic",
        description: "A fresh and sporty fragrance with grapefruit, rosemary, and cedar.",
        ingredients: ["grapefruit", "cardamom", "rosemary", "tuberose", "cedar", "sandalwood"],
        year: 2011,
        perfumer: "Olivier Cresp",
        image: "lacoste-blanc.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Lacoste Pour Femme": {
        brand: "Lacoste",
        family: "Floral Fruity",
        description: "An elegant feminine fragrance with apple, jasmine, and sandalwood.",
        ingredients: ["apple", "blackberry", "jasmine", "freesia", "sandalwood", "amber"],
        year: 2003,
        perfumer: "Loc Dong",
        image: "lacoste-pour-femme.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // More Rochas
      "Rochas Man": {
        brand: "Rochas",
        family: "Oriental Spicy",
        description: "A warm masculine fragrance with bergamot, lavender, and amber.",
        ingredients: ["bergamot", "lavender", "cardamom", "jasmine", "sandalwood", "amber"],
        year: 1999,
        perfumer: "Maurice Roucel",
        image: "rochas-man.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Rochas Femme": {
        brand: "Rochas",
        family: "Chypre",
        description: "A classic chypre with bergamot, rose, and oakmoss.",
        ingredients: ["bergamot", "rose", "jasmine", "oakmoss", "sandalwood", "vanilla"],
        year: 1944,
        perfumer: "Edmond Roudnitska",
        image: "rochas-femme.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // More Carolina Herrera
      "Carolina Herrera Good Girl": {
        brand: "Carolina Herrera",
        family: "Oriental Floral",
        description: "A mysterious fragrance with jasmine, tuberose, and cacao.",
        ingredients: ["bergamot", "lemon", "jasmine", "tuberose", "tonka bean", "cacao", "coffee"],
        year: 2016,
        perfumer: "Louise Turner",
        image: "carolina-herrera-good-girl.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Carolina Herrera 212 VIP": {
        brand: "Carolina Herrera",
        family: "Oriental Floral",
        description: "A party fragrance with passion fruit, musk, and vanilla.",
        ingredients: ["passion fruit", "rum", "musk", "gardenia", "vanilla", "sandalwood"],
        year: 2010,
        perfumer: "Alberto Morillas",
        image: "carolina-herrera-212-vip.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // More Moschino
      "Moschino Toy": {
        brand: "Moschino",
        family: "Oriental Floral",
        description: "A playful fragrance with bergamot, jasmine, and sandalwood.",
        ingredients: ["bergamot", "mandarin", "jasmine", "peony", "sandalwood", "amber"],
        year: 2014,
        perfumer: "Loc Dong",
        image: "moschino-toy.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Moschino Fresh Couture": {
        brand: "Moschino",
        family: "Floral Fruity",
        description: "A fun and fresh fragrance with bergamot, peony, and ambroxan.",
        ingredients: ["bergamot", "mandarin", "ylang-ylang", "peony", "ambroxan", "sandalwood"],
        year: 2015,
        perfumer: "Jeremy Fragrance",
        image: "moschino-fresh-couture.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // More DKNY
      "DKNY Be Delicious": {
        brand: "DKNY",
        family: "Floral Fruity",
        description: "A fresh apple fragrance with cucumber, grapefruit, and sandalwood.",
        ingredients: ["apple", "cucumber", "grapefruit", "magnolia", "violet", "sandalwood", "amber"],
        year: 2004,
        perfumer: "Maurice Roucel, Clement Gavarry & Yann Vasnier",
        image: "dkny-be-delicious.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      // === TRENDING NICHE AND DESIGNER BRANDS ===

      // More Armaf (Popular Clone House)
      "Armaf Club de Nuit Intense": {
        brand: "Armaf",
        family: "Woody Spicy",
        description: "A powerful fragrance with bergamot, blackcurrant, and sandalwood.",
        ingredients: ["bergamot", "blackcurrant", "apple", "rose", "jasmine", "sandalwood", "vanilla"],
        year: 2015,
        perfumer: "Armaf",
        image: "armaf-club-de-nuit-intense.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["105ml"],
      },
      "Armaf Tres Nuit": {
        brand: "Armaf",
        family: "Citrus Aromatic",
        description: "A fresh fragrance with lemon, lavender, and sandalwood.",
        ingredients: ["lemon", "lavender", "violet leaf", "sandalwood", "amber", "musk"],
        year: 2017,
        perfumer: "Armaf",
        image: "armaf-tres-nuit.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["100ml"],
      },

      // More Lattafa (Popular Middle Eastern Brand)
      "Lattafa Raghba": {
        brand: "Lattafa",
        family: "Oriental Gourmand",
        description: "A sweet gourmand with vanilla, oud, and caramel.",
        ingredients: ["vanilla", "oud", "caramel", "sweet notes", "amber"],
        year: 2018,
        perfumer: "Lattafa",
        image: "lattafa-raghba.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["100ml"],
      },
      "Lattafa Oud Mood": {
        brand: "Lattafa",
        family: "Oriental Woody",
        description: "A rich oud fragrance with saffron, rose, and sandalwood.",
        ingredients: ["saffron", "rose", "oud", "sandalwood", "amber", "musk"],
        year: 2019,
        perfumer: "Lattafa",
        image: "lattafa-oud-mood.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["100ml"],
      },

      // More Rasasi (Popular Middle Eastern Brand)
      "Rasasi Hawas": {
        brand: "Rasasi",
        family: "Aquatic Aromatic",
        description: "A fresh aquatic fragrance with bergamot, apple, and ambergris.",
        ingredients: ["bergamot", "apple", "pineapple", "rose", "sandalwood", "ambergris"],
        year: 2016,
        perfumer: "Rasasi",
        image: "rasasi-hawas.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Rasasi La Yuqawam": {
        brand: "Rasasi",
        family: "Oriental Spicy",
        description: "A spicy oriental with bergamot, tobacco, and oud.",
        ingredients: ["bergamot", "thyme", "tobacco", "honey", "oud", "sandalwood"],
        year: 2015,
        perfumer: "Rasasi",
        image: "rasasi-la-yuqawam.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // More Al Haramain (Popular Arabian Brand)
      "Al Haramain L'Aventure": {
        brand: "Al Haramain",
        family: "Woody Spicy",
        description: "An adventurous fragrance with bergamot, apple, and sandalwood.",
        ingredients: ["bergamot", "mandarin", "apple", "rose", "jasmine", "sandalwood", "cedarwood"],
        year: 2014,
        perfumer: "Al Haramain",
        image: "al-haramain-laventure.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // More Alexandria Fragrances (Popular Clone House)
      "Alexandria Fragrances Zion": {
        brand: "Alexandria Fragrances",
        family: "Oriental Woody",
        description: "A luxurious blend with bergamot, rose, and oud.",
        ingredients: ["bergamot", "saffron", "rose", "oud", "sandalwood", "amber"],
        year: 2018,
        perfumer: "Alexandria Fragrances",
        image: "alexandria-zion.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // More Parfums Vintage (Popular Clone House)
      "Parfums Vintage Emperor": {
        brand: "Parfums Vintage",
        family: "Oriental Spicy",
        description: "A bold emperor fragrance with bergamot, rose, and amber.",
        ingredients: ["bergamot", "lemon", "rose", "geranium", "amber", "patchouli"],
        year: 2017,
        perfumer: "Parfums Vintage",
        image: "parfums-vintage-emperor.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // More Designer Brands - Issey Miyake
      "Issey Miyake Nuit d'Issey": {
        brand: "Issey Miyake",
        family: "Woody Spicy",
        description: "A dark and mysterious fragrance with bergamot, spices, and woods.",
        ingredients: ["bergamot", "pink grapefruit", "spices", "leather", "dark wood", "incense"],
        year: 2014,
        perfumer: "Dominique Ropion",
        image: "issey-miyake-nuit-dissey.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml","125ml"],
      },

      // More Clinique
      "Clinique Happy": {
        brand: "Clinique",
        family: "Citrus Floral",
        description: "A cheerful citrus floral with bergamot, boysenberry, and white tea.",
        ingredients: ["bergamot", "boysenberry", "mandarin", "lily of the valley", "freesia", "white tea"],
        year: 1997,
        perfumer: "Calice Becker & Maurice Roucel",
        image: "clinique-happy.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["50ml","100ml"],
      },

      // More Elizabeth Arden
      "Elizabeth Arden Green Tea": {
        brand: "Elizabeth Arden",
        family: "Citrus Aromatic",
        description: "A refreshing green tea fragrance with bergamot, mint, and musk.",
        ingredients: ["bergamot", "orange", "lemon", "mint", "green tea", "jasmine", "musk"],
        year: 1999,
        perfumer: "Francis Kurkdjian",
        image: "elizabeth-arden-green-tea.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // More Estée Lauder
      "Estée Lauder Pleasures": {
        brand: "Estée Lauder",
        family: "Floral",
        description: "A joyful bouquet with white lily, violet leaves, and sandalwood.",
        ingredients: ["white lily", "violet leaves", "rose", "jasmine", "sandalwood", "cedar"],
        year: 1995,
        perfumer: "Annie Buzantian & Alberto Morillas",
        image: "estee-lauder-pleasures.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // More Hermès
      "Hermès H24": {
        brand: "Hermès",
        family: "Woody Aromatic",
        description: "A modern masculine fragrance with clary sage, narcissus, and sclarene.",
        ingredients: ["clary sage", "narcissus", "rosewood", "metallic notes", "sclarene"],
        year: 2021,
        perfumer: "Christine Nagel",
        image: "hermes-h24.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // More Kenzo
      "Kenzo Flower": {
        brand: "Kenzo",
        family: "Floral",
        description: "A poetic poppy fragrance with Bulgarian rose, violet, and white musk.",
        ingredients: ["poppy", "bulgarian rose", "violet", "opoponax", "white musk"],
        year: 2000,
        perfumer: "Alberto Morillas",
        image: "kenzo-flower.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // More Lanvin
      "Lanvin Éclat d'Arpège": {
        brand: "Lanvin",
        family: "Floral Fruity",
        description: "A sparkling fragrance with Sicilian lemon, green lilac, and white cedar.",
        ingredients: ["lemon", "green lilac", "peony", "rose", "white tea", "white cedar", "white musk"],
        year: 2002,
        perfumer: "Karine Dubreuil",
        image: "lanvin-eclat-darpege.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // More Cacharel
      "Cacharel Amor Amor": {
        brand: "Cacharel",
        family: "Floral Fruity",
        description: "A passionate fragrance with blackcurrant, jasmine, and vanilla.",
        ingredients: ["blackcurrant", "orange", "jasmine", "lily", "rose", "vanilla", "musk"],
        year: 2003,
        perfumer: "Laurent Bruyere",
        image: "cacharel-amor-amor.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // === FINAL POPULAR ADDITIONS ===

      // More Montblanc
      "Montblanc Explorer": {
        brand: "Montblanc",
        family: "Woody Aromatic",
        description: "An adventurous fragrance with bergamot, vetiver, and ambroxan.",
        ingredients: ["bergamot", "pink pepper", "clary sage", "vetiver", "patchouli", "ambroxan"],
        year: 2019,
        perfumer: "Jórdi Fernandez, Antoine Maisondieu & Olivier Pescheux",
        image: "montblanc-explorer.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // More Diesel
      "Diesel Only The Brave": {
        brand: "Diesel",
        family: "Oriental Woody",
        description: "A bold fragrance with lemon, cedar, and benzoin.",
        ingredients: ["lemon", "mandarin", "cedar", "amber", "benzoin", "labdanum"],
        year: 2009,
        perfumer: "Alienor Massenet & Olivier Polge",
        image: "diesel-only-the-brave.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // More Adidas
      "Adidas Team Force": {
        brand: "Adidas",
        family: "Aromatic Fougere",
        description: "A sporty fragrance with bergamot, lavender, and sandalwood.",
        ingredients: ["bergamot", "mandarin", "lavender", "geranium", "sandalwood", "cedar"],
        year: 2000,
        perfumer: "Adidas",
        image: "adidas-team-force.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // More Joop!
      "Joop! Homme": {
        brand: "Joop!",
        family: "Oriental Fougere",
        description: "A distinctive fragrance with bergamot, cardamom, and sandalwood.",
        ingredients: ["bergamot", "mandarin", "cardamom", "jasmine", "heliotrope", "sandalwood", "patchouli"],
        year: 1989,
        perfumer: "Michel Almairac",
        image: "joop-homme.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      "Davidoff Cool Water": {
        brand: "Davidoff",
        family: "Aromatic Aquatic",
        description: "A fresh aquatic fragrance with mint, lavender, and sandalwood.",
        ingredients: [
          "mint",
          "lavender",
          "coriander",
          "rosemary",
          "geranium",
          "sandalwood",
          "musk",
          "amber",
        ],
        year: 1988,
        perfumer: "Pierre Bourdon",
        image: "davidoff-cool-water.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["75ml","125ml","200ml"],
      },
      "Polo Ralph Lauren Blue": {
        brand: "Ralph Lauren",
        family: "Woody Aromatic",
        description: "A sophisticated blend with cucumber, basil, and suede.",
        ingredients: [
          "cucumber",
          "basil",
          "verbena",
          "geranium",
          "suede",
          "woodsy notes",
        ],
        year: 2003,
        perfumer: "Carlos Benaim",
        image: "polo-blue.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Burberry Brit": {
        brand: "Burberry",
        family: "Oriental Spicy",
        description: "A warm spicy fragrance with bergamot, nutmeg, and cedar.",
        ingredients: [
          "bergamot",
          "cardamom",
          "nutmeg",
          "wild rose",
          "cedar",
          "grey musk",
        ],
        year: 2003,
        perfumer: "Nathalie Gracia-Cetto",
        image: "burberry-brit.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Kenneth Cole Black": {
        brand: "Kenneth Cole",
        family: "Oriental Spicy",
        description:
          "A bold masculine scent with bergamot, nutmeg, and incense.",
        ingredients: [
          "bergamot",
          "ginger",
          "nutmeg",
          "violet",
          "incense",
          "suede",
        ],
        year: 1999,
        perfumer: "Firmenich",
        image: "kenneth-cole-black.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // === NICHE & ARTISAN BRANDS ===
      "Creed Himalaya": {
        brand: "Creed",
        family: "Aromatic Citrus",
        description:
          "A fresh mountain fragrance with bergamot, pink pepper, and sandalwood.",
        ingredients: [
          "bergamot",
          "lemon",
          "pink pepper",
          "sandalwood",
          "cedarwood",
          "musk",
        ],
        year: 2002,
        perfumer: "Olivier Creed",
        image: "creed-himalaya.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["50ml","100ml","120ml"],
      },
      "Tom Ford Lost Cherry": {
        brand: "Tom Ford",
        family: "Oriental Gourmand",
        description: "A tempting gourmand with cherry, almond, and tonka bean.",
        ingredients: [
          "cherry",
          "bitter almond",
          "liqueur",
          "peru balsam",
          "tonka bean",
          "sandalwood",
        ],
        year: 2018,
        perfumer: "Louise Turner",
        image: "tom-ford-lost-cherry.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["50ml","100ml"],
      },
      "Initio Oud for Greatness": {
        brand: "Initio",
        family: "Oriental Woody",
        description:
          "A powerful oud fragrance with saffron, lavender, and agarwood.",
        ingredients: [
          "saffron",
          "nutmeg",
          "lavender",
          "oud",
          "patchouli",
          "musk",
        ],
        year: 2018,
        perfumer: "Clement Gavarry",
        image: "initio-oud-for-greatness.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Byredo Gypsy Water": {
        brand: "Byredo",
        family: "Woody Aromatic",
        description:
          "A bohemian blend with bergamot, juniper berries, and vanilla.",
        ingredients: [
          "bergamot",
          "lemon",
          "juniper berries",
          "incense",
          "pine needles",
          "vanilla",
        ],
        year: 2008,
        perfumer: "Jerome Epinette",
        image: "byredo-gypsy-water.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Maison Margiela REPLICA Beach Walk": {
        brand: "Maison Margiela",
        family: "Solar Floral",
        description:
          "A sunny beach fragrance with bergamot, ylang-ylang, and coconut milk.",
        ingredients: [
          "bergamot",
          "pink pepper",
          "ylang-ylang",
          "coconut milk",
          "musk",
          "cedarwood",
        ],
        year: 2012,
        perfumer: "Maurice Roucel",
        image: "mm-beach-walk.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Le Labo Rose 31": {
        brand: "Le Labo",
        family: "Floral Spicy",
        description: "A modern rose with spicy and woody facets.",
        ingredients: [
          "rose",
          "cumin",
          "olibanum",
          "cedar",
          "agarwood",
          "amber",
        ],
        year: 2006,
        perfumer: "Daphne Bugey",
        image: "le-labo-rose-31.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Diptyque Tam Dao": {
        brand: "Diptyque",
        family: "Woody Aromatic",
        description: "A serene sandalwood fragrance with rose and spices.",
        ingredients: [
          "rose",
          "sandalwood",
          "cedar",
          "cypress",
          "spices",
          "amber",
        ],
        year: 2003,
        perfumer: "Fabrice Pellegrin",
        image: "diptyque-tam-dao.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Amouage Reflection Man": {
        brand: "Amouage",
        family: "Floral Aromatic",
        description:
          "A sophisticated floral with pink pepper, jasmine, and sandalwood.",
        ingredients: [
          "pink pepper",
          "bay leaves",
          "jasmine",
          "ylang-ylang",
          "sandalwood",
          "cedar",
        ],
        year: 2007,
        perfumer: "Lucas Sieuzac",
        image: "amouage-reflection-man.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // === SEASONAL SPECIALISTS ===
      "Hermès Un Jardin Sur Le Toit": {
        brand: "Hermès",
        family: "Floral Green",
        description: "A rooftop garden fragrance with grass, pear, and rose.",
        ingredients: ["grass", "pear", "apple", "rose", "mint", "white tea"],
        year: 2011,
        perfumer: "Jean-Claude Ellena",
        image: "hermes-un-jardin-sur-le-toit.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "L'Artisan Parfumeur Thé Pour un Été": {
        brand: "L'Artisan Parfumeur",
        family: "Aromatic Green",
        description:
          "A refreshing summer tea with bergamot, mint, and white tea.",
        ingredients: [
          "bergamot",
          "mint",
          "green tea",
          "white tea",
          "jasmine",
          "cedar",
        ],
        year: 1996,
        perfumer: "Olivia Giacobetti",
        image: "lartisan-the-pour-un-ete.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Hermès Voyage d'Hermès": {
        brand: "Hermès",
        family: "Woody Aromatic",
        description: "A journey fragrance with citrus, tea, and woody notes.",
        ingredients: ["cardamom", "tea", "ginger", "hedione", "cedar", "musk"],
        year: 2010,
        perfumer: "Jean-Claude Ellena",
        image: "hermes-voyage.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // === CROWD PLEASERS & COMPLIMENT GETTERS ===
      "Jean Paul Gaultier Le Male": {
        brand: "Jean Paul Gaultier",
        family: "Oriental Fougere",
        description: "A seductive blend with mint, lavender, and vanilla.",
        ingredients: [
          "mint",
          "lavender",
          "bergamot",
          "cinnamon",
          "vanilla",
          "sandalwood",
        ],
        year: 1995,
        perfumer: "Francis Kurkdjian",
        image: "jpg-le-male.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "1 Million by Paco Rabanne": {
        brand: "Paco Rabanne",
        family: "Oriental Spicy",
        description: "A golden spicy fragrance with cinnamon, rose, and amber.",
        ingredients: [
          "grapefruit",
          "mint",
          "cinnamon",
          "rose",
          "amber",
          "leather",
        ],
        year: 2008,
        perfumer: "Christophe Raynaud, Olivier Pescheux & Michel Girard",
        image: "paco-rabanne-1-million.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml","200ml"],
      },
      "Invictus by Paco Rabanne": {
        brand: "Paco Rabanne",
        family: "Aquatic Woody",
        description:
          "A dynamic aquatic woody with grapefruit, bay leaf, and ambergris.",
        ingredients: [
          "grapefruit",
          "mandarin",
          "bay leaf",
          "hedione",
          "ambergris",
          "guaiac wood",
        ],
        year: 2013,
        perfumer:
          "Veronique Nyberg, Anne Flipo, Olivier Polge & Dominique Ropion",
        image: "paco-rabanne-invictus.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml","200ml"],
      },
      "Azzaro Chrome": {
        brand: "Azzaro",
        family: "Citrus Aromatic",
        description:
          "A fresh aquatic citrus with bergamot, cyclamen, and musk.",
        ingredients: [
          "bergamot",
          "lemon",
          "cyclamen",
          "coriander",
          "musk",
          "cedar",
        ],
        year: 1996,
        perfumer: "Gerard Haury",
        image: "azzaro-chrome.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml","200ml"],
      },

      // === UNIQUE & ARTISTIC FRAGRANCES ===
      "Comme des Garçons Incense Series 1": {
        brand: "Comme des Garçons",
        family: "Incense",
        description: "A pure and meditative incense fragrance.",
        ingredients: ["incense", "cedar", "pepperwood", "spices"],
        year: 2002,
        perfumer: "Comme des Garçons",
        image: "cdg-incense-1.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Escentric Molecules Molecule 01": {
        brand: "Escentric Molecules",
        family: "Woody",
        description: "A single molecule fragrance featuring Iso E Super.",
        ingredients: ["iso e super"],
        year: 2006,
        perfumer: "Geza Schoen",
        image: "escentric-molecule-01.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Maison Louis Marie No.04 Bois de Balincourt": {
        brand: "Maison Louis Marie",
        family: "Woody Aromatic",
        description:
          "A warm and spicy sandalwood fragrance with cedarwood and spices.",
        ingredients: [
          "sandalwood",
          "cedarwood",
          "vetiver",
          "cinnamon",
          "nutmeg",
        ],
        year: 2016,
        perfumer: "Marie du Petit Thouars",
        image: "maison-louis-marie-04.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // === ADDITIONAL DESIGNER CLASSICS ===
      "Dolce & Gabbana Light Blue": {
        brand: "Dolce & Gabbana",
        family: "Citrus Aromatic",
        description:
          "A Mediterranean freshness with Sicilian citron and apple.",
        ingredients: ["sicilian citron", "apple", "cedar", "musk"],
        year: 2001,
        perfumer: "Olivier Cresp",
        image: "dg-light-blue.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Giorgio Armani Stronger With You": {
        brand: "Giorgio Armani",
        family: "Oriental Spicy",
        description:
          "A warm and addictive fragrance with cardamom, pink pepper, and vanilla.",
        ingredients: [
          "cardamom",
          "pink pepper",
          "violet leaves",
          "toffee",
          "vanilla",
          "cedar",
        ],
        year: 2017,
        perfumer: "Cecile Matton & Serge de Oliveira",
        image: "armani-stronger-with-you.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Hermès H24": {
        brand: "Hermès",
        family: "Woody Aromatic",
        description:
          "A contemporary fragrance with clary sage, narcissus, and sclarene.",
        ingredients: ["clary sage", "narcissus", "rosewood", "sclarene"],
        year: 2021,
        perfumer: "Christine Nagel",
        image: "hermes-h24.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // === FEMALE NICHE ADDITIONS ===
      "Maison Francis Kurkdjian À la Rose": {
        brand: "Maison Francis Kurkdjian",
        family: "Floral",
        description:
          "A modern interpretation of rose with Bulgarian and Damask roses.",
        ingredients: ["bulgarian rose", "damask rose", "violet", "magnolia"],
        year: 2014,
        perfumer: "Francis Kurkdjian",
        image: "mfk-a-la-rose.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Byredo Blanche": {
        brand: "Byredo",
        family: "Floral Musk",
        description:
          "A clean and pure fragrance with white rose, peony, and blonde woods.",
        ingredients: [
          "white rose",
          "pink pepper",
          "aldehyde",
          "peony",
          "blonde woods",
          "musk",
        ],
        year: 2009,
        perfumer: "Ben Gorham",
        image: "byredo-blanche.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Le Labo Thé Matcha 26": {
        brand: "Le Labo",
        family: "Aromatic Green",
        description: "A creamy matcha tea fragrance with jasmine and woods.",
        ingredients: ["matcha tea", "jasmine", "vetiver", "cedar", "woods"],
        year: 2010,
        perfumer: "Frank Voelkl",
        image: "le-labo-the-matcha-26.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // === ADDITIONAL LUXURY OPTIONS ===
      "Clive Christian No. 1": {
        brand: "Clive Christian",
        family: "Oriental Floral",
        description:
          "A luxurious and complex fragrance with bergamot, jasmine, and sandalwood.",
        ingredients: [
          "bergamot",
          "cardamom",
          "jasmine",
          "rose",
          "sandalwood",
          "cedar",
        ],
        year: 1999,
        perfumer: "Geza Schoen",
        image: "clive-christian-no1.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Bond No. 9 New York Nights": {
        brand: "Bond No. 9",
        family: "Oriental Spicy",
        description:
          "A glamorous evening fragrance with gardenia, jasmine, and patchouli.",
        ingredients: ["gardenia", "jasmine", "patchouli", "amber", "musk"],
        year: 2003,
        perfumer: "Aurélien Guichard",
        image: "bond-no9-new-york-nights.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // === MASS APPEAL FRAGRANCES ===
      "Elizabeth Arden 5th Avenue": {
        brand: "Elizabeth Arden",
        family: "Floral Aldehyde",
        description:
          "A sophisticated floral with bergamot, magnolia, and sandalwood.",
        ingredients: [
          "bergamot",
          "magnolia",
          "jasmine",
          "rose",
          "sandalwood",
          "amber",
        ],
        year: 1996,
        perfumer: "Ann Gottlieb",
        image: "elizabeth-arden-5th-avenue.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Clinique Happy": {
        brand: "Clinique",
        family: "Citrus Floral",
        description:
          "A joyful citrus floral with bergamot, boysenberry, and lily of the valley.",
        ingredients: [
          "bergamot",
          "boysenberry",
          "lily of the valley",
          "orchid",
          "musk",
        ],
        year: 1997,
        perfumer: "Calice Becker & Clement Gavarry",
        image: "clinique-happy.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["50ml","100ml"],
      },
      "CK One": {
        brand: "Calvin Klein",
        family: "Citrus Aromatic",
        description: "A unisex classic with bergamot, cardamom, and musk.",
        ingredients: [
          "bergamot",
          "cardamom",
          "pineapple",
          "jasmine",
          "violet",
          "musk",
        ],
        year: 1994,
        perfumer: "Alberto Morillas & Harry Fremont",
        image: "ck-one.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // === SEASONAL & WEATHER SPECIFIC ===
      "Hermès Eau des Merveilles": {
        brand: "Hermès",
        family: "Woody Aromatic",
        description:
          "A magical woody fragrance with orange, pink pepper, and cedar.",
        ingredients: [
          "orange",
          "pink pepper",
          "violet",
          "cedar",
          "vetiver",
          "amber",
        ],
        year: 2004,
        perfumer: "Ralf Schwieger & Nathalie Feisthauer",
        image: "hermes-eau-des-merveilles.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "L'Occitane Eau de Cédrat": {
        brand: "L'Occitane",
        family: "Citrus Aromatic",
        description: "A Mediterranean citrus with cedrat, mint, and basil.",
        ingredients: ["cedrat", "mint", "basil", "cardamom", "sandalwood"],
        year: 2010,
        perfumer: "Olivier Baussan",
        image: "loccitane-eau-de-cedrat.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // === GOURMAND SPECIALISTS ===
      "Thierry Mugler Alien": {
        brand: "Thierry Mugler",
        family: "Oriental Woody",
        description:
          "A mysterious and radiant fragrance with jasmine, cashmeran, and amber.",
        ingredients: ["jasmine", "cashmeran", "white amber"],
        year: 2005,
        perfumer: "Laurent Bruyere & Dominique Ropion",
        image: "mugler-alien.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Prada Candy": {
        brand: "Prada",
        family: "Oriental Gourmand",
        description:
          "A sweet and sophisticated gourmand with benzoin, caramel, and musk.",
        ingredients: ["benzoin", "caramel", "vanilla", "musk"],
        year: 2011,
        perfumer: "Daniela Andrier",
        image: "prada-candy.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // === MIDDLE EASTERN INSPIRED ===
      "Ajmal Dahn Al Oudh": {
        brand: "Ajmal",
        family: "Oriental Woody",
        description: "A traditional Middle Eastern oud with rose and saffron.",
        ingredients: ["oud", "rose", "saffron", "amber", "sandalwood"],
        year: 1990,
        perfumer: "Ajmal",
        image: "ajmal-dahn-al-oudh.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Al Haramain L'Aventure": {
        brand: "Al Haramain",
        family: "Oriental Spicy",
        description: "An affordable alternative with bergamot, apple, and oud.",
        ingredients: ["bergamot", "apple", "elemi", "oud", "ambergris", "musk"],
        year: 2016,
        perfumer: "Al Haramain",
        image: "al-haramain-laventure.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // === ADDITIONAL SPORT & FRESH OPTIONS ===
      "Lacoste Eau de Lacoste L.12.12 Blanc": {
        brand: "Lacoste",
        family: "Aromatic",
        description:
          "A clean sporty fragrance with grapefruit, cardamom, and cedar.",
        ingredients: [
          "grapefruit",
          "cardamom",
          "rosemary",
          "ylang-ylang",
          "cedar",
          "vetiver",
        ],
        year: 2011,
        perfumer: "Christophe Raynaud",
        image: "lacoste-blanc.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Adidas Team Force": {
        brand: "Adidas",
        family: "Aromatic Spicy",
        description:
          "An energetic sport fragrance with citrus, spices, and woods.",
        ingredients: [
          "bergamot",
          "juniper",
          "black pepper",
          "cedar",
          "sandalwood",
          "musk",
        ],
        year: 2000,
        perfumer: "Adidas",
        image: "adidas-team-force.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // === VINTAGE CLASSICS ===
      "Penhaligon's Blenheim Bouquet": {
        brand: "Penhaligon's",
        family: "Citrus Aromatic",
        description:
          "A classic English fragrance with lemon, lavender, and pine.",
        ingredients: [
          "lemon",
          "lavender",
          "rosemary",
          "pine",
          "pepper",
          "musk",
        ],
        year: 1902,
        perfumer: "William Penhaligon",
        image: "penhaligons-blenheim-bouquet.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Acqua di Parma Colonia Intensa": {
        brand: "Acqua di Parma",
        family: "Citrus Aromatic",
        description:
          "An intense version of the classic cologne with bergamot, myrtle, and musk.",
        ingredients: [
          "bergamot",
          "sicilian lemon",
          "myrtle",
          "rose",
          "sandalwood",
          "musk",
        ],
        year: 2007,
        perfumer: "Jean-Claude Ellena",
        image: "adp-colonia-intensa.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // === ADDITIONAL FEMALE DESIGNERS ===
      "Versace Bright Crystal": {
        brand: "Versace",
        family: "Floral Fruity",
        description:
          "A bright and joyful fragrance with pomegranate, peony, and musk.",
        ingredients: [
          "pomegranate",
          "yuzu",
          "peony",
          "magnolia",
          "musk",
          "mahogany",
        ],
        year: 2006,
        perfumer: "Alberto Morillas",
        image: "versace-bright-crystal.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","90ml","200ml"],
      },
      "Giorgio Armani Si": {
        brand: "Giorgio Armani",
        family: "Chypre Fruity",
        description: "A modern chypre with blackcurrant, rose, and vanilla.",
        ingredients: [
          "blackcurrant",
          "rose",
          "freesia",
          "vanilla",
          "patchouli",
          "cedar",
        ],
        year: 2013,
        perfumer: "Christine Nagel",
        image: "armani-si.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["50ml","100ml"],
      },
      "Ralph Lauren Romance": {
        brand: "Ralph Lauren",
        family: "Floral",
        description: "A romantic bouquet with rose, daisy, and white musk.",
        ingredients: [
          "rose",
          "daisy",
          "marigold",
          "lily",
          "white musk",
          "sandalwood",
        ],
        year: 1998,
        perfumer: "Harry Fremont",
        image: "ralph-lauren-romance.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["50ml","100ml"],
      },

      // === ADDITIONAL AFFORDABLE GEMS ===
      "Zara Red Vanilla": {
        brand: "Zara",
        family: "Oriental Gourmand",
        description: "An affordable gourmand with vanilla, amber, and spices.",
        ingredients: [
          "vanilla",
          "red apple",
          "peach",
          "amber",
          "sandalwood",
          "musk",
        ],
        year: 2017,
        perfumer: "Zara",
        image: "zara-red-vanilla.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "The Body Shop White Musk": {
        brand: "The Body Shop",
        family: "Floral Musk",
        description: "A clean and soft musk fragrance with lily and rose.",
        ingredients: ["lily", "rose", "iris", "white musk"],
        year: 1981,
        perfumer: "The Body Shop",
        image: "body-shop-white-musk.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Bath & Body Works Japanese Cherry Blossom": {
        brand: "Bath & Body Works",
        family: "Floral Fruity",
        description:
          "A delicate and feminine fragrance with cherry blossom, Asian pear, and sandalwood.",
        ingredients: [
          "cherry blossom",
          "asian pear",
          "silk tree",
          "sandalwood",
          "white musk",
        ],
        year: 2005,
        perfumer: "Bath & Body Works",
        image: "bbw-japanese-cherry-blossom.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // === ADDITIONAL CROWD FAVORITES ===
      "Ariana Grande Cloud": {
        brand: "Ariana Grande",
        family: "Oriental Gourmand",
        description: "A dreamy gourmand with bergamot, pear, and coconut.",
        ingredients: [
          "bergamot",
          "pear",
          "coconut",
          "vanilla",
          "praline",
          "musk",
        ],
        year: 2018,
        perfumer: "Clement Gavarry",
        image: "ariana-grande-cloud.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Britney Spears Fantasy": {
        brand: "Britney Spears",
        family: "Oriental Gourmand",
        description: "A sweet fantasy with lychee, golden quince, and musk.",
        ingredients: [
          "lychee",
          "golden quince",
          "kiwi",
          "jasmine",
          "chocolate",
          "musk",
        ],
        year: 2005,
        perfumer: "James Krivda",
        image: "britney-spears-fantasy.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // === ADDITIONAL NICHE GEMS ===
      "Molecule 02": {
        brand: "Escentric Molecules",
        family: "Woody",
        description: "A single molecule fragrance featuring Ambroxan.",
        ingredients: ["ambroxan"],
        year: 2008,
        perfumer: "Geza Schoen",
        image: "molecule-02.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Serge Lutens Chergui": {
        brand: "Serge Lutens",
        family: "Oriental Spicy",
        description:
          "A warm desert wind fragrance with tobacco, iris, and sandalwood.",
        ingredients: [
          "tobacco",
          "iris",
          "sandalwood",
          "rose",
          "incense",
          "musk",
        ],
        year: 2001,
        perfumer: "Christopher Sheldrake",
        image: "serge-lutens-chergui.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // === FRESH SUMMER SPECIALISTS ===
      "Hermès Eau de Citron Noir": {
        brand: "Hermès",
        family: "Citrus Aromatic",
        description:
          "A sophisticated citrus with black lime, tea, and guaiac wood.",
        ingredients: [
          "black lime",
          "yellow lime",
          "tea",
          "guaiac wood",
          "sandalwood",
        ],
        year: 2016,
        perfumer: "Christine Nagel",
        image: "hermes-eau-de-citron-noir.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Acqua di Parma Blu Mediterraneo": {
        brand: "Acqua di Parma",
        family: "Citrus Aromatic",
        description: "A Mediterranean escape with bergamot, cedar, and mastic.",
        ingredients: ["bergamot", "lemon", "cedar", "mastic", "myrtle"],
        year: 1999,
        perfumer: "Acqua di Parma",
        image: "adp-blu-mediterraneo.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // === WINTER WARMERS ===
      "Guerlain Habit Rouge": {
        brand: "Guerlain",
        family: "Oriental Spicy",
        description: "A classic oriental with bergamot, rose, and vanilla.",
        ingredients: [
          "bergamot",
          "lemon",
          "rose",
          "jasmine",
          "vanilla",
          "benzoin",
        ],
        year: 1965,
        perfumer: "Jean-Paul Guerlain",
        image: "guerlain-habit-rouge.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Cartier Declaration": {
        brand: "Cartier",
        family: "Woody Spicy",
        description:
          "A sophisticated spicy fragrance with bergamot, cardamom, and cedar.",
        ingredients: [
          "bergamot",
          "cardamom",
          "coriander",
          "iris",
          "cedar",
          "vetiver",
        ],
        year: 1998,
        perfumer: "Jean-Claude Ellena",
        image: "cartier-declaration.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // === ADDITIONAL FEMALE NICHE ===
      "Hermès Twilly d'Hermès": {
        brand: "Hermès",
        family: "Floral Spicy",
        description: "A spicy floral with ginger, tuberose, and sandalwood.",
        ingredients: ["ginger", "tuberose", "sandalwood"],
        year: 2017,
        perfumer: "Christine Nagel",
        image: "hermes-twilly.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Chloe Nomade": {
        brand: "Chloé",
        family: "Chypre Floral",
        description:
          "A free-spirited fragrance with mirabelle, freesia, and oakmoss.",
        ingredients: [
          "mirabelle",
          "freesia",
          "rose",
          "oakmoss",
          "sandalwood",
          "cedar",
        ],
        year: 2018,
        perfumer: "Quentin Bisch",
        image: "chloe-nomade.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // === CULT CLASSICS ===
      "Escada Magnetism": {
        brand: "Escada",
        family: "Oriental Floral",
        description:
          "A magnetic fragrance with heliotrope, rose, and sandalwood.",
        ingredients: [
          "heliotrope",
          "rose",
          "jasmine",
          "sandalwood",
          "musk",
          "benzoin",
        ],
        year: 2003,
        perfumer: "Firmenich",
        image: "escada-magnetism.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Givenchy Gentleman": {
        brand: "Givenchy",
        family: "Aromatic Fougere",
        description:
          "A gentleman's fragrance with bergamot, iris, and patchouli.",
        ingredients: [
          "bergamot",
          "iris",
          "geranium",
          "patchouli",
          "sandalwood",
          "cedar",
        ],
        year: 2017,
        perfumer: "Olivier Cresp & Nathalie Lorson",
        image: "givenchy-gentleman.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // === FINAL ADDITIONS - DIVERSE CATEGORIES ===
      "Juliette Has a Gun Not a Perfume": {
        brand: "Juliette Has a Gun",
        family: "Woody",
        description: "A minimalist fragrance with a single synthetic note.",
        ingredients: ["cetalox"],
        year: 2010,
        perfumer: "Romano Ricci",
        image: "jhag-not-a-perfume.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Etat Libre d'Orange Sécrétions Magnifiques": {
        brand: "Etat Libre d'Orange",
        family: "Aromatic",
        description: "An avant-garde fragrance exploring bodily secretions.",
        ingredients: [
          "iodine",
          "adrenaline",
          "blood accord",
          "sperm accord",
          "saliva accord",
          "sweat accord",
        ],
        year: 2006,
        perfumer: "Antoine Lie & Etienne de Swardt",
        image: "elo-secretions-magnifiques.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // === ADDITIONAL WOMEN'S FRAGRANCES ===

      // Armani
      "Giorgio Armani Si Passione": {
        brand: "Giorgio Armani",
        family: "Fruity Floral",
        description:
          "A passionate and intense fragrance with blackcurrant, rose, and vanilla.",
        ingredients: [
          "blackcurrant",
          "pear",
          "rose",
          "jasmine",
          "vanilla",
          "cedar",
        ],
        year: 2017,
        perfumer: "Christine Nagel",
        image: "armani-si-passione.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Giorgio Armani Si Intense": {
        brand: "Giorgio Armani",
        family: "Oriental Floral",
        description:
          "An intense and sensual version with blackcurrant, rose, and vanilla.",
        ingredients: [
          "blackcurrant",
          "rose",
          "jasmine",
          "vanilla",
          "patchouli",
          "benzoin",
        ],
        year: 2014,
        perfumer: "Julie Masse",
        image: "armani-si-intense.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Giorgio Armani My Way": {
        brand: "Giorgio Armani",
        family: "Floral",
        description:
          "A contemporary floral with bergamot, orange blossom, and white musk.",
        ingredients: [
          "bergamot",
          "orange blossom",
          "jasmine",
          "tuberose",
          "vanilla",
          "white musk",
        ],
        year: 2020,
        perfumer: "Carlos Benaim",
        image: "armani-my-way.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["50ml","90ml"],
      },
      "Giorgio Armani Acqua di Gioia": {
        brand: "Giorgio Armani",
        family: "Aquatic Floral",
        description: "A fresh aquatic floral with mint, jasmine, and cedar.",
        ingredients: ["mint", "lemon", "jasmine", "peony", "rose", "cedar"],
        year: 2010,
        perfumer: "Loc Dong & Anne Flipo",
        image: "armani-acqua-di-gioia.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Bulgari
      "Bulgari Jasmin Noir": {
        brand: "Bulgari",
        family: "Oriental Floral",
        description:
          "A mysterious and sensual fragrance with gardenia, jasmine, and precious woods.",
        ingredients: [
          "gardenia",
          "green sap",
          "jasmine",
          "almond",
          "liquorice",
          "precious woods",
        ],
        year: 2008,
        perfumer: "Carlos Benaim",
        image: "bulgari-jasmin-noir.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Burberry
      "Burberry Goddess": {
        brand: "Burberry",
        family: "Oriental Gourmand",
        description:
          "A rich and luxurious fragrance with vanilla, ginger, and lavender.",
        ingredients: ["ginger", "lavender", "vanilla", "cocoa", "cashmeran"],
        year: 2023,
        perfumer: "Amandine Clerc-Marie & Henri Robert",
        image: "burberry-goddess.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Burberry Her": {
        brand: "Burberry",
        family: "Fruity Gourmand",
        description:
          "A bold and confident fragrance with berries, jasmine, and amber.",
        ingredients: [
          "strawberry",
          "raspberry",
          "blackberry",
          "jasmine",
          "violet",
          "amber",
        ],
        year: 2018,
        perfumer: "Francis Kurkdjian",
        image: "burberry-her.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["50ml","100ml"],
      },
      "Burberry My Burberry": {
        brand: "Burberry",
        family: "Floral",
        description:
          "A contemporary British fragrance with bergamot, rose, and patchouli.",
        ingredients: [
          "bergamot",
          "sweet pea",
          "geranium",
          "rose",
          "freesia",
          "patchouli",
        ],
        year: 2014,
        perfumer: "Francis Kurkdjian",
        image: "burberry-my-burberry.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["50ml","90ml"],
      },
      "Burberry My Burberry Black": {
        brand: "Burberry",
        family: "Oriental Floral",
        description: "A darker interpretation with jasmine, peach, and amber.",
        ingredients: [
          "jasmine",
          "peach nectar",
          "rose",
          "amber",
          "patchouli",
          "sun-dried hay",
        ],
        year: 2016,
        perfumer: "Francis Kurkdjian",
        image: "burberry-my-burberry-black.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Carolina Herrera
      "Carolina Herrera Good Girl": {
        brand: "Carolina Herrera",
        family: "Oriental Floral",
        description:
          "A seductive fragrance with jasmine, tuberose, and tonka bean.",
        ingredients: [
          "almond",
          "coffee",
          "jasmine",
          "tuberose",
          "tonka bean",
          "cacao",
          "vanilla",
        ],
        year: 2016,
        perfumer: "Louise Turner",
        image: "ch-good-girl.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Carolina Herrera 212 VIP": {
        brand: "Carolina Herrera",
        family: "Oriental Floral",
        description:
          "A glamorous and party-inspired fragrance with rum, gardenia, and musk.",
        ingredients: ["lime", "rum", "gardenia", "musk", "vanilla"],
        year: 2010,
        perfumer: "Loc Dong",
        image: "ch-212-vip.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Chanel
      "Chanel Gabrielle": {
        brand: "Chanel",
        family: "Floral",
        description:
          "A radiant and voluptuous fragrance with jasmine, ylang-ylang, and sandalwood.",
        ingredients: [
          "mandarin",
          "grapefruit",
          "jasmine",
          "ylang-ylang",
          "tuberose",
          "sandalwood",
        ],
        year: 2017,
        perfumer: "Olivier Polge",
        image: "chanel-gabrielle.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["50ml","100ml"],
      },
      "Chanel Coco Noir": {
        brand: "Chanel",
        family: "Oriental Spicy",
        description:
          "A mysterious and magnetic fragrance with rose, jasmine, and sandalwood.",
        ingredients: [
          "grapefruit",
          "rose",
          "jasmine",
          "geranium",
          "sandalwood",
          "tonka bean",
        ],
        year: 2012,
        perfumer: "Jacques Polge",
        image: "chanel-coco-noir.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["50ml","100ml"],
      },
      "Chanel Allure Sensuelle": {
        brand: "Chanel",
        family: "Oriental Floral",
        description:
          "A magnetic and voluptuous fragrance with rose, jasmine, and amber.",
        ingredients: [
          "mandarin",
          "rose",
          "jasmine",
          "vetiver",
          "amber",
          "vanilla",
        ],
        year: 2005,
        perfumer: "Jacques Polge",
        image: "chanel-allure-sensuelle.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["50ml","100ml"],
      },
      "Chanel N°1 de Chanel": {
        brand: "Chanel",
        family: "Floral Woody Musk",
        description:
          "A vibrant and energizing fragrance with red camellia, jasmine, and cedar.",
        ingredients: [
          "red camellia",
          "neroli",
          "jasmine",
          "orange blossom",
          "cedar",
          "musk",
        ],
        year: 2022,
        perfumer: "Olivier Polge",
        image: "chanel-no1.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["50ml","100ml"],
      },
      "Chanel Chance": {
        brand: "Chanel",
        family: "Floral",
        description:
          "A delicate fragrance with pink pepper, jasmine, and amber patchouli.",
        ingredients: [
          "pink pepper",
          "lemon",
          "jasmine",
          "iris",
          "amber patchouli",
          "vanilla",
        ],
        year: 2003,
        perfumer: "Jacques Polge",
        image: "chanel-chance.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml","150ml"],
      },

      // Chloé
      "Chloé Rose Tangerine": {
        brand: "Chloé",
        family: "Floral Fruity",
        description:
          "A sparkling and feminine fragrance with tangerine, rose, and white musk.",
        ingredients: [
          "tangerine",
          "blackcurrant",
          "rose",
          "magnolia",
          "white musk",
          "cedar",
        ],
        year: 2019,
        perfumer: "Quentin Bisch",
        image: "chloe-rose-tangerine.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Chloé Nomade": {
        brand: "Chloé",
        family: "Floral Woody",
        description:
          "A bold and confident fragrance with mirabelle, freesia, and oakmoss.",
        ingredients: [
          "mirabelle",
          "lemon",
          "freesia",
          "rose",
          "oakmoss",
          "sandalwood",
        ],
        year: 2018,
        perfumer: "Quentin Bisch",
        image: "chloe-nomade.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Chloé Love Story": {
        brand: "Chloé",
        family: "Floral",
        description:
          "A romantic and passionate fragrance with neroli, orange blossom, and cedar.",
        ingredients: [
          "neroli",
          "orange blossom",
          "stephanotis",
          "jasmine",
          "cedar",
          "musk",
        ],
        year: 2014,
        perfumer: "Annick Menardo & Christine Nagel",
        image: "chloe-love-story.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Chloé Eau de Parfum": {
        brand: "Chloé",
        family: "Floral",
        description:
          "The signature Chloé fragrance with peony, lychee, and cedar.",
        ingredients: [
          "peony",
          "lychee",
          "freesia",
          "rose",
          "magnolia",
          "cedar",
        ],
        year: 2008,
        perfumer: "Amandine Clerc-Marie & Michel Almairac",
        image: "chloe-edp.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Dior Additional
      "Dior Joy": {
        brand: "Dior",
        family: "Floral",
        description:
          "A luminous and joyful fragrance with bergamot, jasmine, and white musk.",
        ingredients: [
          "bergamot",
          "mandarin",
          "jasmine",
          "rose",
          "white musk",
          "sandalwood",
        ],
        year: 2018,
        perfumer: "François Demachy",
        image: "dior-joy.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml","200ml"],
      },
      "Dior Addict": {
        brand: "Dior",
        family: "Oriental Floral",
        description:
          "A vibrant and addictive fragrance with mandarin, jasmine, and vanilla.",
        ingredients: [
          "mandarin",
          "bergamot",
          "jasmine sambac",
          "tuberose",
          "vanilla",
          "sandalwood",
        ],
        year: 2014,
        perfumer: "François Demachy",
        image: "dior-addict.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml","200ml"],
      },
      "Dior Jasmin des Anges": {
        brand: "Dior",
        family: "Floral",
        description:
          "A celestial jasmine fragrance with lily of the valley and white musk.",
        ingredients: [
          "bergamot",
          "lily of the valley",
          "jasmine",
          "tuberose",
          "white musk",
          "cashmere wood",
        ],
        year: 2020,
        perfumer: "François Demachy",
        image: "dior-jasmin-des-anges.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml","200ml"],
      },
      "Dior Miss Dior Blooming Bouquet": {
        brand: "Dior",
        family: "Floral",
        description:
          "A tender and romantic bouquet with peony, rose, and white musk.",
        ingredients: [
          "mandarin",
          "peony",
          "rose",
          "jasmine",
          "white musk",
          "cedar",
        ],
        year: 2014,
        perfumer: "François Demachy",
        image: "dior-miss-dior-blooming.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml","200ml"],
      },
      "Dior Hypnotic Poison": {
        brand: "Dior",
        family: "Oriental Vanilla",
        description:
          "A mysterious and intoxicating fragrance with bitter almond, jasmine, and vanilla.",
        ingredients: [
          "bitter almond",
          "caraway",
          "jasmine",
          "rose",
          "vanilla",
          "musk",
        ],
        year: 1998,
        perfumer: "Annick Menardo",
        image: "dior-hypnotic-poison.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml","200ml"],
      },

      // Dolce & Gabbana
      "Dolce & Gabbana Devotion": {
        brand: "Dolce & Gabbana",
        family: "Oriental Gourmand",
        description:
          "A sensual and addictive fragrance with lemon, orange blossom, and vanilla.",
        ingredients: [
          "candied lemon",
          "orange blossom",
          "panettone",
          "hazelnut",
          "vanilla",
          "cashmere wood",
        ],
        year: 2023,
        perfumer: "Olivier Cresp",
        image: "dg-devotion.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Dolce & Gabbana The Only One": {
        brand: "Dolce & Gabbana",
        family: "Oriental Floral",
        description: "An exclusive fragrance with bergamot, iris, and coffee.",
        ingredients: [
          "bergamot",
          "violet",
          "iris",
          "orange blossom",
          "coffee",
          "vanilla",
        ],
        year: 2015,
        perfumer: "Antoine Maisondieu",
        image: "dg-the-only-one.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Dolce & Gabbana Light Blue": {
        brand: "Dolce & Gabbana",
        family: "Floral Fruity",
        description:
          "A fresh and Mediterranean fragrance with apple, jasmine, and cedar.",
        ingredients: [
          "granny smith apple",
          "bluebell",
          "jasmine",
          "bamboo",
          "rose",
          "cedar",
        ],
        year: 2001,
        perfumer: "Olivier Cresp",
        image: "dg-light-blue.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // === PREMIUM NICHE HOUSES ===
      
      // Nishane
      "Nishane Hacivat": {
        brand: "Nishane",
        family: "Woody Aromatic",
        description: "A sophisticated blend with pineapple, grapefruit, and woody notes.",
        ingredients: ["pineapple", "grapefruit", "bay leaves", "cedar", "sandalwood", "oakmoss"],
        year: 2017,
        perfumer: "Karine Vinchon-Spehner",
        image: "nishane-hacivat.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Nishane Ani": {
        brand: "Nishane",
        family: "Oriental Vanilla",
        description: "A luxurious gourmand with bergamot, blackcurrant, and vanilla.",
        ingredients: ["bergamot", "pink pepper", "blackcurrant", "rose", "vanilla", "benzoin"],
        year: 2019,
        perfumer: "Cecile Zarokian",
        image: "nishane-ani.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Nishane Fan Your Flames": {
        brand: "Nishane",
        family: "Oriental Spicy",
        description: "A fiery composition with pink pepper, rose, and oud.",
        ingredients: ["pink pepper", "coconut", "rose", "praline", "oud", "vanilla"],
        year: 2018,
        perfumer: "Cecile Zarokian",
        image: "nishane-fan-your-flames.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Xerjoff
      "Xerjoff Erba Pura": {
        brand: "Xerjoff",
        family: "Oriental Fruity",
        description: "A vibrant and addictive fragrance with orange, vanilla, and musk.",
        ingredients: ["orange", "bergamot", "lemon", "vanilla", "white musk", "amber"],
        year: 2019,
        perfumer: "Christian Carbonnel",
        image: "xerjoff-erba-pura.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Xerjoff Naxos": {
        brand: "Xerjoff",
        family: "Oriental Spicy",
        description: "A rich tobacco and honey composition with cinnamon and vanilla.",
        ingredients: ["bergamot", "lemon", "cinnamon", "honey", "tobacco", "vanilla"],
        year: 2015,
        perfumer: "Christian Carbonnel",
        image: "xerjoff-naxos.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Xerjoff Alexandria II": {
        brand: "Xerjoff",
        family: "Oriental Woody",
        description: "A luxurious blend with rose, cedar, and oud.",
        ingredients: ["rose", "lily of the valley", "cedar", "sandalwood", "oud", "musk"],
        year: 2012,
        perfumer: "Chris Maurice",
        image: "xerjoff-alexandria-ii.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Parfums de Marly
      "Parfums de Marly Layton": {
        brand: "Parfums de Marly",
        family: "Oriental Spicy",
        description: "A royal composition with bergamot, lavender, and vanilla.",
        ingredients: ["bergamot", "lavender", "geranium", "vanilla", "sandalwood", "guaiac wood"],
        year: 2016,
        perfumer: "Hamid Merati-Kashani",
        image: "pdm-layton.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["75ml","125ml"],
      },
      "Parfums de Marly Pegasus": {
        brand: "Parfums de Marly",
        family: "Oriental Spicy",
        description: "A powerful fragrance with bergamot, heliotrope, and vanilla.",
        ingredients: ["bergamot", "cumin", "heliotrope", "bitter almond", "vanilla", "sandalwood"],
        year: 2011,
        perfumer: "Hamid Merati-Kashani",
        image: "pdm-pegasus.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["75ml","125ml"],
      },
      "Parfums de Marly Delina": {
        brand: "Parfums de Marly",
        family: "Floral",
        description: "An elegant rose fragrance with peony, lychee, and musk.",
        ingredients: ["lychee", "nutmeg", "rhubarb", "peony", "rose", "white musk"],
        year: 2017,
        perfumer: "Quentin Bisch",
        image: "pdm-delina.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["75ml","125ml"],
      },
      "Parfums de Marly Herod": {
        brand: "Parfums de Marly",
        family: "Oriental Spicy",
        description: "A warm spicy fragrance with cinnamon, tobacco, and vanilla.",
        ingredients: ["pepper", "cinnamon", "tobacco leaf", "incense", "vanilla", "sandalwood"],
        year: 2012,
        perfumer: "Olivier Pescheux",
        image: "pdm-herod.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["75ml","125ml"],
      },

      // Kilian
      "Kilian Love Don't Be Shy": {
        brand: "Kilian",
        family: "Oriental Gourmand",
        description: "A seductive gourmand with neroli, marshmallow, and musk.",
        ingredients: ["neroli", "orange blossom", "marshmallow", "sugar", "white musk", "caramel"],
        year: 2007,
        perfumer: "Calice Becker",
        image: "kilian-love-dont-be-shy.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Kilian Black Phantom": {
        brand: "Kilian",
        family: "Oriental Gourmand",
        description: "A dark and mysterious rum-based fragrance with coffee and sugar cane.",
        ingredients: ["rum", "black cherry", "coffee", "almond", "sugar cane", "sandalwood"],
        year: 2017,
        perfumer: "Sidonie Lancesseur",
        image: "kilian-black-phantom.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Kilian Princess": {
        brand: "Kilian",
        family: "Floral Fruity",
        description: "A radiant floral with ginger, marshmallow, and tea.",
        ingredients: ["ginger", "rhubarb", "marshmallow", "green tea", "white tea", "musk"],
        year: 2019,
        perfumer: "Calice Becker",
        image: "kilian-princess.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Nasomatto
      "Nasomatto Black Afgano": {
        brand: "Nasomatto",
        family: "Oriental Woody",
        description: "An intense and mysterious fragrance with cannabis and oud.",
        ingredients: ["cannabis", "bay leaves", "oud", "patchouli", "sandalwood", "amber"],
        year: 2009,
        perfumer: "Alessandro Gualtieri",
        image: "nasomatto-black-afgano.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Nasomatto Blamage": {
        brand: "Nasomatto",
        family: "Woody Aromatic",
        description: "A provocative blend with leather, woods, and spices.",
        ingredients: ["leather", "woods", "spices", "white flowers", "animalic notes", "musk"],
        year: 2014,
        perfumer: "Alessandro Gualtieri",
        image: "nasomatto-blamage.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Frederic Malle
      "Frederic Malle Portrait of a Lady": {
        brand: "Frederic Malle",
        family: "Oriental Spicy",
        description: "A bold rose fragrance with spices and patchouli.",
        ingredients: ["rose", "raspberry", "black currant", "cinnamon", "clove", "patchouli"],
        year: 2010,
        perfumer: "Dominique Ropion",
        image: "fm-portrait-of-a-lady.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Frederic Malle Musc Ravageur": {
        brand: "Frederic Malle",
        family: "Oriental Spicy",
        description: "A sensual and warm fragrance with spices, vanilla, and musk.",
        ingredients: ["bergamot", "tangerine", "cinnamon", "clove", "vanilla", "amber"],
        year: 2000,
        perfumer: "Maurice Roucel",
        image: "fm-musc-ravageur.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Le Labo Additional
      "Le Labo Santal 33": {
        brand: "Le Labo",
        family: "Woody Aromatic",
        description: "The iconic sandalwood fragrance with cardamom and violet.",
        ingredients: ["cardamom", "iris", "violet", "sandalwood", "cedarwood", "leather"],
        year: 2011,
        perfumer: "Frank Voelkl",
        image: "le-labo-santal-33.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Le Labo Another 13": {
        brand: "Le Labo",
        family: "Aromatic",
        description: "A mysterious blend with ambroxan, apple, and musk.",
        ingredients: ["pear", "apple", "ambroxan", "jasmine", "moss", "amber"],
        year: 2010,
        perfumer: "Anne Flipo & Dominique Ropion",
        image: "le-labo-another-13.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Le Labo Bergamote 22": {
        brand: "Le Labo",
        family: "Citrus Aromatic",
        description: "A sparkling bergamot with petit grain and bay leaves.",
        ingredients: ["bergamot", "petit grain", "bay leaves", "grapefruit", "vetiver", "amber"],
        year: 2006,
        perfumer: "Daphne Bugey",
        image: "le-labo-bergamote-22.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // === LUXURY DESIGNER EXPANSIONS ===

      // Louis Vuitton
      "Louis Vuitton Ombre Nomade": {
        brand: "Louis Vuitton",
        family: "Oriental Woody",
        description: "A luxurious oud fragrance with rose, saffron, and benzoin.",
        ingredients: ["rose", "saffron", "oud", "geranium", "raspberry", "benzoin"],
        year: 2018,
        perfumer: "Jacques Cavallier Belletrud",
        image: "lv-ombre-nomade.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Louis Vuitton L'Immensité": {
        brand: "Louis Vuitton",
        family: "Aromatic Citrus",
        description: "A fresh and airy fragrance with bergamot, ginger, and sandalwood.",
        ingredients: ["bergamot", "grapefruit", "ginger", "rosemary", "sandalwood", "ambrettolide"],
        year: 2018,
        perfumer: "Jacques Cavallier Belletrud",
        image: "lv-limmensité.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Louis Vuitton Attrape-Rêves": {
        brand: "Louis Vuitton",
        family: "Floral",
        description: "A dreamy floral with jasmine, lily-of-the-valley, and Turkish rose.",
        ingredients: ["pear", "ginger", "jasmine", "lily-of-the-valley", "turkish rose", "cocoa"],
        year: 2018,
        perfumer: "Jacques Cavallier Belletrud",
        image: "lv-attrape-reves.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Bottega Veneta
      "Bottega Veneta Bottega Veneta": {
        brand: "Bottega Veneta",
        family: "Chypre Floral",
        description: "An elegant leather fragrance with bergamot, pink pepper, and patchouli.",
        ingredients: ["bergamot", "pink pepper", "jasmine", "rose", "leather", "patchouli"],
        year: 2011,
        perfumer: "Michel Almairac",
        image: "bv-bottega-veneta.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Bottega Veneta Illusione": {
        brand: "Bottega Veneta",
        family: "Floral",
        description: "A luminous floral with bitter orange, jasmine, and blonde woods.",
        ingredients: ["bitter orange", "pink pepper", "jasmine", "rose", "blonde woods", "sandalwood"],
        year: 2014,
        perfumer: "Shyamala Maisondieu",
        image: "bv-illusione.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // === ULTRA-NICHE & ARTISANAL HOUSES ===

      // Roja Parfums
      "Roja Parfums Danger": {
        brand: "Roja Parfums",
        family: "Oriental Spicy",
        description: "An opulent and seductive fragrance with bergamot, rose, and oud.",
        ingredients: ["bergamot", "lemon", "rose", "jasmine", "oud", "ambergris"],
        year: 2011,
        perfumer: "Roja Dove",
        image: "roja-danger.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Roja Parfums Elysium": {
        brand: "Roja Parfums",
        family: "Aromatic Fougere",
        description: "A sophisticated aromatic with bergamot, lavender, and vanilla.",
        ingredients: ["bergamot", "lavender", "artemisia", "rose", "vanilla", "ambergris"],
        year: 2017,
        perfumer: "Roja Dove",
        image: "roja-elysium.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Roja Parfums Oceania": {
        brand: "Roja Parfums",
        family: "Citrus Aromatic",
        description: "A fresh oceanic fragrance with bergamot, lemon, and ambergris.",
        ingredients: ["bergamot", "lemon", "lime", "lavender", "sandalwood", "ambergris"],
        year: 2019,
        perfumer: "Roja Dove",
        image: "roja-oceania.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Clive Christian
      "Clive Christian X": {
        brand: "Clive Christian",
        family: "Oriental Spicy",
        description: "One of the world's most expensive fragrances with rare ingredients.",
        ingredients: ["bergamot", "cardamom", "iris", "ylang-ylang", "sandalwood", "vanilla"],
        year: 2001,
        perfumer: "Geza Schoen",
        image: "clive-christian-x.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Clive Christian Rock Rose": {
        brand: "Clive Christian",
        family: "Chypre Floral",
        description: "A British heritage fragrance with bergamot, rose, and oakmoss.",
        ingredients: ["bergamot", "lemon", "rose", "geranium", "oakmoss", "sandalwood"],
        year: 2008,
        perfumer: "Geza Schoen",
        image: "clive-christian-rock-rose.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Amouage
      "Amouage Jubilation XXV": {
        brand: "Amouage",
        family: "Oriental Spicy",
        description: "A celebratory fragrance with frankincense, rose, and oud.",
        ingredients: ["frankincense", "coriander", "rose", "bay leaves", "oud", "amber"],
        year: 2007,
        perfumer: "Bertrand Duchaufour",
        image: "amouage-jubilation-xxv.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Amouage Interlude Man": {
        brand: "Amouage",
        family: "Oriental Woody",
        description: "A smoky and mysterious fragrance with oregano, incense, and oud.",
        ingredients: ["oregano", "pepper", "incense", "opoponax", "oud", "leather"],
        year: 2012,
        perfumer: "Pierre Negrin",
        image: "amouage-interlude-man.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Maison Francis Kurkdjian
      "Maison Francis Kurkdjian Baccarat Rouge 540": {
        brand: "Maison Francis Kurkdjian",
        family: "Amber Floral",
        description: "The iconic crystal-inspired fragrance with saffron, ambergris, and cedar.",
        ingredients: ["saffron", "bitter almond", "cedar", "ambergris", "jasmine", "hedione"],
        year: 2015,
        perfumer: "Francis Kurkdjian",
        image: "mfk-baccarat-rouge-540.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Maison Francis Kurkdjian Aqua Celestia": {
        brand: "Maison Francis Kurkdjian",
        family: "Aromatic Aquatic",
        description: "A celestial aquatic with bergamot, blackcurrant, and sandalwood.",
        ingredients: ["bergamot", "blackcurrant", "lemon", "jasmine", "sandalwood", "musk"],
        year: 2012,
        perfumer: "Francis Kurkdjian",
        image: "mfk-aqua-celestia.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Maison Francis Kurkdjian Oud Mood": {
        brand: "Maison Francis Kurkdjian",
        family: "Oriental Woody",
        description: "A luxurious oud fragrance with rose, saffron, and agarwood.",
        ingredients: ["rose", "saffron", "agarwood", "sandalwood", "ambergris", "musk"],
        year: 2013,
        perfumer: "Francis Kurkdjian",
        image: "mfk-oud-mood.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Creed Premium
      "Creed Royal Oud": {
        brand: "Creed",
        family: "Oriental Woody",
        description: "A majestic oud fragrance with rose, saffron, and regal woods.",
        ingredients: ["rose", "saffron", "oud", "sandalwood", "cedarwood", "ambergris"],
        year: 2011,
        perfumer: "Olivier Creed",
        image: "creed-royal-oud.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["50ml","100ml","120ml"],
      },
      "Creed Royal Mayfair": {
        brand: "Creed",
        family: "Citrus Aromatic",
        description: "A British-inspired fragrance with bergamot, rose, and oakmoss.",
        ingredients: ["bergamot", "lime", "rose", "pine needles", "oakmoss", "ambergris"],
        year: 2015,
        perfumer: "Olivier Creed",
        image: "creed-royal-mayfair.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["50ml","100ml","120ml"],
      },

      // Tom Ford Private Blend
      "Tom Ford Oud Wood": {
        brand: "Tom Ford",
        family: "Oriental Woody",
        description: "A smooth and creamy oud with rosewood, cardamom, and sandalwood.",
        ingredients: ["cardamom", "rosewood", "oud", "sandalwood", "amber", "vanilla"],
        year: 2007,
        perfumer: "Richard Herpin",
        image: "tom-ford-oud-wood.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["50ml","100ml"],
      },
      "Tom Ford Tobacco Vanille": {
        brand: "Tom Ford",
        family: "Oriental Spicy",
        description: "A rich tobacco fragrance with vanilla, tonka bean, and dried fruits.",
        ingredients: ["tobacco leaf", "vanilla", "tonka bean", "dried fruits", "cocoa", "ginger"],
        year: 2007,
        perfumer: "Olivier Gillotin",
        image: "tom-ford-tobacco-vanille.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["50ml","100ml"],
      },
      "Tom Ford Tuscan Leather": {
        brand: "Tom Ford",
        family: "Leather",
        description: "A bold leather fragrance with saffron, thyme, and olibanum.",
        ingredients: ["saffron", "thyme", "olibanum", "leather", "suede", "amber"],
        year: 2007,
        perfumer: "Harry Fremont",
        image: "tom-ford-tuscan-leather.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["50ml","100ml"],
      },

      // === PRESTIGIOUS DESIGNER EXPANSIONS ===

      // Hermès Luxury
      "Hermès Terre d'Hermès Parfum": {
        brand: "Hermès",
        family: "Woody Spicy",
        description: "The parfum concentration of the iconic earthy fragrance.",
        ingredients: ["grapefruit", "orange", "pepper", "vetiver", "cedar", "benzoin"],
        year: 2009,
        perfumer: "Jean-Claude Ellena",
        image: "hermes-terre-parfum.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Hermès Un Jardin Après la Mousson": {
        brand: "Hermès",
        family: "Floral Green",
        description: "A post-monsoon garden fragrance with cardamom, coriander, and ginger.",
        ingredients: ["cardamom", "coriander", "ginger", "pepper", "vetiver", "cedar"],
        year: 2008,
        perfumer: "Jean-Claude Ellena",
        image: "hermes-apres-la-mousson.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Chanel Premium
      "Chanel 1957": {
        brand: "Chanel",
        family: "Aldehyde Floral",
        description: "A luxurious aldehydic floral from Les Exclusifs collection.",
        ingredients: ["aldehydes", "neroli", "iris", "honey", "white musk", "cedar"],
        year: 2007,
        perfumer: "Jacques Polge",
        image: "chanel-1957.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["50ml","100ml"],
      },
      "Chanel Sycomore": {
        brand: "Chanel",
        family: "Woody Aromatic",
        description: "A sophisticated vetiver fragrance with smoky and green facets.",
        ingredients: ["vetiver", "sandalwood", "cypress", "juniper", "spices", "amber"],
        year: 2008,
        perfumer: "Jacques Polge",
        image: "chanel-sycomore.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["50ml","100ml"],
      },
      "Chanel 31 Rue Cambon": {
        brand: "Chanel",
        family: "Woody Floral Musk",
        description: "A tribute to Chanel's historic address with iris, rose, and sandalwood.",
        ingredients: ["bergamot", "iris", "rose", "ylang-ylang", "sandalwood", "white musk"],
        year: 2016,
        perfumer: "Olivier Polge",
        image: "chanel-31-rue-cambon.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["50ml","100ml"],
      },

      // Dior Premium
      "Dior Oud Ispahan": {
        brand: "Dior",
        family: "Oriental Woody",
        description: "A luxurious oud fragrance with rose, saffron, and patchouli.",
        ingredients: ["rose", "saffron", "oud", "patchouli", "sandalwood", "amber"],
        year: 2012,
        perfumer: "François Demachy",
        image: "dior-oud-ispahan.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml","200ml"],
      },
      "Dior Ambre Nuit": {
        brand: "Dior",
        family: "Oriental Spicy",
        description: "A nocturnal amber with bergamot, pink pepper, and Turkish rose.",
        ingredients: ["bergamot", "pink pepper", "turkish rose", "amber", "sandalwood", "vanilla"],
        year: 2009,
        perfumer: "François Demachy",
        image: "dior-ambre-nuit.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml","200ml"],
      },

      // Gucci Luxury
      "Gucci The Alchemist's Garden A Song for the Rose": {
        brand: "Gucci",
        family: "Floral",
        description: "A poetic rose fragrance with violet, orris, and musk.",
        ingredients: ["violet", "rose", "orris", "geranium", "white musk", "cedarwood"],
        year: 2019,
        perfumer: "Alberto Morillas",
        image: "gucci-song-for-the-rose.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Gucci Oud": {
        brand: "Gucci",
        family: "Oriental Woody",
        description: "A luxurious oud fragrance with rose, saffron, and patchouli.",
        ingredients: ["bergamot", "saffron", "rose", "oud", "patchouli", "amber"],
        year: 2014,
        perfumer: "Aurelien Guichard",
        image: "gucci-oud.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Elie Saab
      "Elie Saab Le Parfum": {
        brand: "Elie Saab",
        family: "Oriental Floral",
        description: "A radiant and sophisticated fragrance with orange blossom, jasmine, and cedar.",
        ingredients: ["orange blossom", "jasmine grandiflorum", "gardenia", "rose", "cedar", "patchouli"],
        year: 2011,
        perfumer: "Francis Kurkdjian",
        image: "elie-saab-le-parfum.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Elie Saab Girl of Now": {
        brand: "Elie Saab",
        family: "Oriental Gourmand",
        description: "A golden and addictive fragrance with pistachio, orange blossom, and tonka bean.",
        ingredients: ["pistachio", "mandarin", "orange blossom", "jasmine", "tonka bean", "cashmeran"],
        year: 2017,
        perfumer: "Francis Kurkdjian",
        image: "elie-saab-girl-of-now.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // === ADDITIONAL ULTRA-NICHE HOUSES ===

      // Tiziana Terenzi
      "Tiziana Terenzi Kirke": {
        brand: "Tiziana Terenzi",
        family: "Oriental Spicy",
        description: "A magical and enchanting fragrance with saffron, rose, and sandalwood.",
        ingredients: ["saffron", "cherry", "rose", "passion fruit", "sandalwood", "amber"],
        year: 2016,
        perfumer: "Paolo Terenzi",
        image: "tiziana-terenzi-kirke.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Tiziana Terenzi Andromeda": {
        brand: "Tiziana Terenzi",
        family: "Oriental Woody",
        description: "A celestial fragrance with cherry, rose, and precious woods.",
        ingredients: ["cherry", "rose", "jasmine", "sandalwood", "cedar", "amber"],
        year: 2015,
        perfumer: "Paolo Terenzi",
        image: "tiziana-terenzi-andromeda.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Goldfield & Banks
      "Goldfield & Banks Silky Woods": {
        brand: "Goldfield & Banks",
        family: "Woody Aromatic",
        description: "An Australian niche fragrance with pepper, woods, and musk.",
        ingredients: ["pepper", "cardamom", "sandalwood", "cedar", "vanilla", "musk"],
        year: 2016,
        perfumer: "Liam Sardea",
        image: "goldfield-banks-silky-woods.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Goldfield & Banks Bohemian Lime": {
        brand: "Goldfield & Banks",
        family: "Citrus Aromatic",
        description: "A vibrant Australian citrus with lime, finger lime, and woods.",
        ingredients: ["lime", "finger lime", "caviar lime", "cedar", "sandalwood", "musk"],
        year: 2018,
        perfumer: "Liam Sardea",
        image: "goldfield-banks-bohemian-lime.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Penhaligon's Premium
      "Penhaligon's Halfeti": {
        brand: "Penhaligon's",
        family: "Oriental Spicy",
        description: "A Turkish-inspired fragrance with bergamot, rose, and oud.",
        ingredients: ["bergamot", "cardamom", "rose", "saffron", "oud", "amber"],
        year: 2015,
        perfumer: "Christian Provenzano",
        image: "penhaligons-halfeti.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Penhaligon's The Tragedy of Lord George": {
        brand: "Penhaligon's",
        family: "Oriental Spicy",
        description: "A dramatic fragrance with rum, tonka bean, and sandalwood.",
        ingredients: ["rum", "brandy", "tonka bean", "sherry", "sandalwood", "amber"],
        year: 2017,
        perfumer: "Bertrand Duchaufour",
        image: "penhaligons-lord-george.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Memo Paris
      "Memo Paris Russian Leather": {
        brand: "Memo Paris",
        family: "Leather",
        description: "A luxurious leather fragrance with vodka, rose, and birch tar.",
        ingredients: ["vodka", "rose", "coriander", "birch tar", "leather", "amber"],
        year: 2010,
        perfumer: "Alienor Massenet",
        image: "memo-russian-leather.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Memo Paris African Leather": {
        brand: "Memo Paris",
        family: "Leather",
        description: "An exotic leather with cardamom, cumin, and saffron.",
        ingredients: ["cardamom", "cumin", "saffron", "leather", "patchouli", "oud"],
        year: 2015,
        perfumer: "Alienor Massenet",
        image: "memo-african-leather.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Ormonde Jayne
      "Ormonde Jayne Ormonde Man": {
        brand: "Ormonde Jayne",
        family: "Woody Aromatic",
        description: "A sophisticated masculine fragrance with bergamot, cardamom, and oud.",
        ingredients: ["bergamot", "cardamom", "coriander", "oud", "sandalwood", "amber"],
        year: 2004,
        perfumer: "Geza Schoen & Linda Pilkington",
        image: "ormonde-jayne-ormonde-man.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Ormonde Jayne Nawab of Oudh": {
        brand: "Ormonde Jayne",
        family: "Oriental Woody",
        description: "A royal oud fragrance with rose, amber, and precious woods.",
        ingredients: ["rose", "orange", "oud", "amber", "sandalwood", "musk"],
        year: 2012,
        perfumer: "Linda Pilkington",
        image: "ormonde-jayne-nawab.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Montale & Mancera
      "Montale Black Aoud": {
        brand: "Montale",
        family: "Oriental Woody",
        description: "An intense oud fragrance with rose, patchouli, and white musk.",
        ingredients: ["oud", "rose", "patchouli", "sandalwood", "white musk", "amber"],
        year: 2006,
        perfumer: "Pierre Montale",
        image: "montale-black-aoud.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Mancera Red Tobacco": {
        brand: "Mancera",
        family: "Oriental Spicy",
        description: "A rich tobacco fragrance with spices, woods, and amber.",
        ingredients: ["tobacco", "cinnamon", "nutmeg", "sandalwood", "cedar", "amber"],
        year: 2011,
        perfumer: "Pierre Montale",
        image: "mancera-red-tobacco.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // === EXCLUSIVE DESIGNER COLLECTIONS ===

      // YSL Exclusive
      "Yves Saint Laurent Tuxedo": {
        brand: "Yves Saint Laurent",
        family: "Oriental Spicy",
        description: "An elegant and sophisticated fragrance with black pepper, rose, and lily.",
        ingredients: ["black pepper", "rose", "lily", "cacao", "sandalwood", "ambergris"],
        year: 2015,
        perfumer: "Dominique Ropion",
        image: "ysl-tuxedo.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["50ml","90ml"],
      },
      "Yves Saint Laurent Trench": {
        brand: "Yves Saint Laurent",
        family: "Woody Aromatic",
        description: "A modern interpretation of elegance with iris, rose, and sandalwood.",
        ingredients: ["bergamot", "iris", "rose", "vanilla", "sandalwood", "white musk"],
        year: 2016,
        perfumer: "Dominique Ropion",
        image: "ysl-trench.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["50ml","90ml"],
      },

      // Prada Exclusive
      "Prada Olfactories Tundra": {
        brand: "Prada",
        family: "Woody Aromatic",
        description: "An exploration of Nordic landscapes with angelica, juniper, and ambroxan.",
        ingredients: ["angelica", "juniper", "kalianol", "ambroxan", "cedar", "musk"],
        year: 2015,
        perfumer: "Daniela Andrier",
        image: "prada-tundra.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Prada Olfactories Marienbad": {
        brand: "Prada",
        family: "Floral Woody Musk",
        description: "A spa-inspired fragrance with rose, sandalwood, and white musk.",
        ingredients: ["rose", "peony", "sandalwood", "cedar", "white musk", "amber"],
        year: 2016,
        perfumer: "Daniela Andrier",
        image: "prada-marienbad.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Valentino Premium
      "Valentino Uomo Intense": {
        brand: "Valentino",
        family: "Oriental Woody",
        description: "An intense and sophisticated version with tonka bean, vanilla, and iris.",
        ingredients: ["mandarin", "iris", "tonka bean", "vanilla", "leather", "sandalwood"],
        year: 2016,
        perfumer: "Sonia Constant",
        image: "valentino-uomo-intense.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Valentino Donna Born in Roma": {
        brand: "Valentino",
        family: "Floral",
        description: "A contemporary Roman fragrance with jasmine, vanilla, and bourbon.",
        ingredients: ["blackcurrant", "jasmine", "vanilla bourbon", "cashmeran", "sandalwood", "guaiac wood"],
        year: 2019,
        perfumer: "Antoine Maisondieu & Nadege le Garlantezec",
        image: "valentino-born-in-roma.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Elie Saab
      "Elie Saab Le Parfum": {
        brand: "Elie Saab",
        family: "Oriental Floral",
        description: "A luxurious and feminine fragrance with orange blossom, jasmine, and cedar.",
        ingredients: [
          "orange blossom",
          "jasmine",
          "rose honey",
          "cedar",
          "patchouli"
        ],
        year: 2011,
        perfumer: "Francis Kurkdjian",
        image: "elie-saab-le-parfum.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Guerlain
      "Guerlain Angelique Noire": {
        brand: "Guerlain",
        family: "Oriental Spicy",
        description:
          "A mysterious and bewitching fragrance with angelica, vanilla, and black tea.",
        ingredients: [
          "angelica",
          "black tea",
          "jasmine",
          "rose",
          "vanilla",
          "cedar",
        ],
        year: 2005,
        perfumer: "Daniela Andrier",
        image: "guerlain-angelique-noire.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Guerlain Mon Guerlain": {
        brand: "Guerlain",
        family: "Oriental Fresh",
        description:
          "A contemporary fragrance with bergamot, jasmine, and sandalwood.",
        ingredients: [
          "bergamot",
          "lavender",
          "jasmine sambac",
          "rose",
          "sandalwood",
          "vanilla",
        ],
        year: 2017,
        perfumer: "Thierry Wasser",
        image: "guerlain-mon-guerlain.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Guerlain Idylle": {
        brand: "Guerlain",
        family: "Floral",
        description:
          "A romantic and delicate fragrance with rose, jasmine, and white musk.",
        ingredients: [
          "Bulgarian rose",
          "jasmine",
          "lily of the valley",
          "peony",
          "white musk",
          "patchouli",
        ],
        year: 2009,
        perfumer: "Thierry Wasser",
        image: "guerlain-idylle.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Guerlain Insolence": {
        brand: "Guerlain",
        family: "Oriental Floral",
        description:
          "A bold and spirited fragrance with violet, iris, and tonka bean.",
        ingredients: [
          "violet",
          "red berries",
          "iris",
          "orange blossom",
          "tonka bean",
          "sandalwood",
        ],
        year: 2006,
        perfumer: "Maurice Roucel",
        image: "guerlain-insolence.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Guerlain L'Instant": {
        brand: "Guerlain",
        family: "Oriental Floral",
        description: "A timeless fragrance with mandarin, jasmine, and amber.",
        ingredients: [
          "mandarin",
          "magnolia",
          "jasmine",
          "rose",
          "amber",
          "sandalwood",
        ],
        year: 2003,
        perfumer: "Béatrice Piquet",
        image: "guerlain-linstant.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Hugo Boss
      "Hugo Boss Femme": {
        brand: "Hugo Boss",
        family: "Oriental Floral",
        description:
          "An elegant and sophisticated fragrance with mandarin, jasmine, and amber.",
        ingredients: [
          "tangerine",
          "redcurrant",
          "jasmine",
          "rose",
          "amber",
          "apricot wood",
        ],
        year: 2006,
        perfumer: "Marie Salamagne",
        image: "hugo-boss-femme.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["50ml","75ml"],
      },

      // Jean Paul Gaultier
      "Jean Paul Gaultier Scandal": {
        brand: "Jean Paul Gaultier",
        family: "Oriental Floral",
        description:
          "A provocative and addictive fragrance with honey, gardenia, and patchouli.",
        ingredients: [
          "blood orange",
          "honey",
          "gardenia",
          "jasmine",
          "licorice blossom",
          "patchouli",
        ],
        year: 2017,
        perfumer: "Daphné Bugey, Fabrice Pellegrin & Christophe Raynaud",
        image: "jpg-scandal.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Jean Paul Gaultier Scandal by Night": {
        brand: "Jean Paul Gaultier",
        family: "Oriental Floral",
        description:
          "A darker and more intense version with honey, tuberose, and sandalwood.",
        ingredients: [
          "honey",
          "tuberose",
          "jasmine",
          "sandalwood",
          "tonka bean",
        ],
        year: 2018,
        perfumer: "Fabrice Pellegrin",
        image: "jpg-scandal-by-night.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Jean Paul Gaultier La Belle": {
        brand: "Jean Paul Gaultier",
        family: "Oriental Gourmand",
        description:
          "A radiant and joyful fragrance with pear, vanilla, and sandalwood.",
        ingredients: ["bergamot", "pear", "vanilla", "vetiver", "sandalwood"],
        year: 2019,
        perfumer: "Daphné Bugey",
        image: "jpg-la-belle.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Jean Paul Gaultier Divine": {
        brand: "Jean Paul Gaultier",
        family: "Oriental Floral",
        description:
          "An heavenly fragrance with bergamot, plum, and white musk.",
        ingredients: [
          "bergamot",
          "plum",
          "orange blossom",
          "jasmine",
          "white musk",
          "sandalwood",
        ],
        year: 2023,
        perfumer: "Quentin Bisch",
        image: "jpg-divine.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Jean Paul Gaultier So Scandal": {
        brand: "Jean Paul Gaultier",
        family: "Floral Fruity",
        description:
          "A playful and irreverent fragrance with raspberry, jasmine, and vanilla.",
        ingredients: [
          "raspberry",
          "orange blossom",
          "jasmine",
          "tuberose",
          "vanilla",
          "milk",
        ],
        year: 2020,
        perfumer: "Fabrice Pellegrin",
        image: "jpg-so-scandal.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Jean Paul Gaultier Scandal Absolu": {
        brand: "Jean Paul Gaultier",
        family: "Oriental Floral",
        description:
          "The most intense version with honey, tuberose, and chestnut cream.",
        ingredients: [
          "honey",
          "tuberose",
          "jasmine",
          "chestnut cream",
          "patchouli",
        ],
        year: 2021,
        perfumer: "Fabrice Pellegrin",
        image: "jpg-scandal-absolu.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Kayali
      "Kayali Vanilla Marshmallow": {
        brand: "Kayali",
        family: "Gourmand",
        description:
          "A sweet and cozy fragrance with marshmallow, vanilla, and brown sugar.",
        ingredients: ["marshmallow", "vanilla", "brown sugar", "musk", "cedar"],
        year: 2018,
        perfumer: "Pierre Negrin",
        image: "kayali-vanilla-marshmallow.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Kayali Vanilla Candy Rock Sugar": {
        brand: "Kayali",
        family: "Gourmand",
        description:
          "A playful and sweet fragrance with rock sugar, vanilla, and musk.",
        ingredients: ["rock sugar", "vanilla", "caramel", "musk", "sandalwood"],
        year: 2020,
        perfumer: "Pierre Negrin",
        image: "kayali-vanilla-candy.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Kilian
      "Kilian Love by Kilian": {
        brand: "Kilian",
        family: "Oriental Floral",
        description:
          "A passionate and intoxicating fragrance with peach, rose, and vanilla.",
        ingredients: [
          "peach",
          "rose",
          "jasmine",
          "vanilla",
          "benzoin",
          "white musk",
        ],
        year: 2007,
        perfumer: "Calice Becker",
        image: "kilian-love.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Lancôme Additional
      "Lancôme La Vie Est Belle L'Eclat": {
        brand: "Lancôme",
        family: "Floral Fruity",
        description:
          "A sparkling version with bergamot, jasmine, and white musk.",
        ingredients: [
          "bergamot",
          "mandarin",
          "jasmine sambac",
          "orange blossom",
          "white musk",
          "sandalwood",
        ],
        year: 2017,
        perfumer: "Anne Flipo & Dominique Ropion",
        image: "lancome-lveb-eclat.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Lancôme La Nuit Trésor": {
        brand: "Lancôme",
        family: "Oriental Gourmand",
        description:
          "A mysterious and seductive fragrance with raspberry, rose, and vanilla.",
        ingredients: [
          "raspberry",
          "lychee",
          "rose",
          "jasmine",
          "vanilla",
          "praline",
        ],
        year: 2015,
        perfumer: "Christophe Raynaud",
        image: "lancome-la-nuit-tresor.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Lancôme Idôle": {
        brand: "Lancôme",
        family: "Floral",
        description:
          "A radiant and luminous fragrance with bergamot, rose, and white musk.",
        ingredients: [
          "bergamot",
          "pear",
          "rose",
          "jasmine",
          "white musk",
          "vanilla",
        ],
        year: 2019,
        perfumer: "Shyamala Maisondieu & Adriana Medina",
        image: "lancome-idole.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Lancôme Trésor Midnight Rose": {
        brand: "Lancôme",
        family: "Oriental Floral",
        description:
          "A passionate and mysterious fragrance with raspberry, rose, and vanilla.",
        ingredients: [
          "raspberry",
          "rose",
          "peony",
          "jasmine",
          "vanilla",
          "musk",
        ],
        year: 2011,
        perfumer: "Olivier Cresp",
        image: "lancome-tresor-midnight.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Mancera
      "Mancera Roses Vanille": {
        brand: "Mancera",
        family: "Oriental Floral",
        description:
          "A luxurious blend of Bulgarian rose, vanilla, and white musk.",
        ingredients: [
          "Bulgarian rose",
          "sugar",
          "vanilla",
          "white musk",
          "cedar",
        ],
        year: 2011,
        perfumer: "Pierre Montale",
        image: "mancera-roses-vanille.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Mancera Coco Vanille": {
        brand: "Mancera",
        family: "Oriental Gourmand",
        description:
          "A tropical and gourmand fragrance with coconut, vanilla, and white flowers.",
        ingredients: [
          "coconut",
          "vanilla",
          "white flowers",
          "musk",
          "sandalwood",
        ],
        year: 2018,
        perfumer: "Pierre Montale",
        image: "mancera-coco-vanille.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Parfums de Marly
      "Parfums de Marly Delina": {
        brand: "Parfums de Marly",
        family: "Floral",
        description:
          "An elegant and feminine fragrance with bergamot, rose, and vanilla.",
        ingredients: [
          "bergamot",
          "lychee",
          "Turkish rose",
          "peony",
          "vanilla",
          "musk",
        ],
        year: 2017,
        perfumer: "Quentin Bisch",
        image: "pdm-delina.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["75ml","125ml"],
      },

      // Montale
      "Montale Velvet Fantasy": {
        brand: "Montale",
        family: "Oriental Gourmand",
        description:
          "A dreamy and sweet fragrance with vanilla, musk, and dried fruits.",
        ingredients: ["dried fruits", "vanilla", "musk", "sandalwood", "cedar"],
        year: 2019,
        perfumer: "Pierre Montale",
        image: "montale-velvet-fantasy.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Mugler
      "Mugler Alien Goddess": {
        brand: "Mugler",
        family: "Oriental Floral",
        description:
          "A divine and luminous fragrance with bergamot, jasmine, and vanilla.",
        ingredients: [
          "bergamot",
          "ginger",
          "jasmine",
          "vanilla",
          "cashmere wood",
        ],
        year: 2021,
        perfumer: "Marie Salamagne & Nathalie Lorson",
        image: "mugler-alien-goddess.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Mugler Alien Extraordinaire": {
        brand: "Mugler",
        family: "Oriental Floral",
        description:
          "An intense and mysterious version with bergamot, jasmine, and cashmeran.",
        ingredients: [
          "bergamot",
          "jasmine sambac",
          "cashmeran",
          "white amber",
          "sandalwood",
        ],
        year: 2014,
        perfumer: "Dominique Ropion",
        image: "mugler-alien-extraordinaire.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Narciso Rodriguez
      "Narciso Rodriguez Narciso": {
        brand: "Narciso Rodriguez",
        family: "Floral Woody Musk",
        description:
          "A pure and sensual fragrance with gardenia, musk, and cedar.",
        ingredients: [
          "gardenia",
          "orange blossom",
          "Bulgarian rose",
          "musk",
          "cedar",
          "amber",
        ],
        year: 2014,
        perfumer: "Aurelien Guichard",
        image: "nr-narciso.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Narciso Rodriguez Narciso Noir": {
        brand: "Narciso Rodriguez",
        family: "Oriental Floral",
        description:
          "A mysterious and seductive fragrance with gardenia, plum, and musk.",
        ingredients: ["gardenia", "plum", "rose", "musk", "cedar", "vanilla"],
        year: 2016,
        perfumer: "Aurelien Guichard",
        image: "nr-narciso-noir.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Narciso Rodriguez All of Me": {
        brand: "Narciso Rodriguez",
        family: "Floral",
        description:
          "A vibrant and luminous fragrance with geranium, rose, and musk.",
        ingredients: [
          "geranium",
          "lychee",
          "rose",
          "geranium",
          "musk",
          "cedar",
        ],
        year: 2018,
        perfumer: "Aurelien Guichard",
        image: "nr-all-of-me.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Narciso Rodriguez Narciso Poudree": {
        brand: "Narciso Rodriguez",
        family: "Floral Powdery",
        description:
          "A soft and powdery fragrance with jasmine, rose, and white musk.",
        ingredients: [
          "jasmine",
          "orange blossom",
          "rose",
          "white musk",
          "cedar",
          "amber",
        ],
        year: 2016,
        perfumer: "Aurelien Guichard",
        image: "nr-narciso-poudree.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Narciso Rodriguez Narciso Ambre": {
        brand: "Narciso Rodriguez",
        family: "Oriental Floral",
        description:
          "A warm and amber fragrance with ylang-ylang, frangipani, and amber.",
        ingredients: [
          "ylang-ylang",
          "frangipani",
          "rose",
          "amber",
          "cedar",
          "musk",
        ],
        year: 2020,
        perfumer: "Aurelien Guichard",
        image: "nr-narciso-ambre.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Narciso Rodriguez Narciso Fleur Musc": {
        brand: "Narciso Rodriguez",
        family: "Floral Musky",
        description: "A delicate floral fragrance with rose, peony, and musk.",
        ingredients: [
          "rose",
          "peony",
          "orange blossom",
          "musk",
          "amber",
          "cedar",
        ],
        year: 2019,
        perfumer: "Aurelien Guichard",
        image: "nr-fleur-musc.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Narciso Rodriguez Narciso Rouge": {
        brand: "Narciso Rodriguez",
        family: "Oriental Floral",
        description:
          "A passionate red fragrance with Bulgarian rose, iris, and musk.",
        ingredients: [
          "Bulgarian rose",
          "iris",
          "gardenia",
          "musk",
          "cedar",
          "amber",
        ],
        year: 2018,
        perfumer: "Aurelien Guichard",
        image: "nr-narciso-rouge.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Oriental Fragrances
      "Lattafa Misk Tahara": {
        brand: "Lattafa",
        family: "Oriental Floral",
        description:
          "A traditional Middle Eastern fragrance with white musk and floral notes.",
        ingredients: ["white musk", "rose", "jasmine", "sandalwood", "amber"],
        year: 2015,
        perfumer: "Lattafa Perfumes",
        image: "lattafa-misk-tahara.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["100ml"],
      },
      "Al Haramain Madhaoui": {
        brand: "Al Haramain",
        family: "Oriental Woody",
        description:
          "A rich and luxurious fragrance with oud, rose, and amber.",
        ingredients: ["oud", "rose", "saffron", "amber", "sandalwood"],
        year: 2018,
        perfumer: "Al Haramain",
        image: "alharamain-madhaoui.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Lattafa Kalimat": {
        brand: "Lattafa",
        family: "Oriental Spicy",
        description: "An opulent fragrance with saffron, rose, and agarwood.",
        ingredients: ["saffron", "rose", "agarwood", "amber", "musk"],
        year: 2020,
        perfumer: "Lattafa Perfumes",
        image: "lattafa-kalimat.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["100ml"],
      },
      "Lattafa Gharam": {
        brand: "Lattafa",
        family: "Oriental Floral",
        description:
          "A passionate fragrance with rose, jasmine, and white musk.",
        ingredients: ["rose", "jasmine", "white musk", "amber", "sandalwood"],
        year: 2019,
        perfumer: "Lattafa Perfumes",
        image: "lattafa-gharam.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["100ml"],
      },
      "Al Haramain Modhila": {
        brand: "Al Haramain",
        family: "Oriental Gourmand",
        description:
          "A sweet and luxurious fragrance with honey, rose, and vanilla.",
        ingredients: ["honey", "rose", "vanilla", "amber", "musk"],
        year: 2021,
        perfumer: "Al Haramain",
        image: "alharamain-modhila.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Lattafa Ghobar Dhahab": {
        brand: "Lattafa",
        family: "Oriental Woody",
        description:
          "A golden fragrance with oud, saffron, and precious woods.",
        ingredients: ["oud", "saffron", "rose", "precious woods", "amber"],
        year: 2022,
        perfumer: "Lattafa Perfumes",
        image: "lattafa-ghobar-dhahab.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["100ml"],
      },
      "Lattafa Yara": {
        brand: "Lattafa",
        family: "Oriental Gourmand",
        description:
          "A sweet and fruity fragrance with heliotrope, orchid, and gourmand notes.",
        ingredients: [
          "heliotrope",
          "orchid",
          "vanilla",
          "gourmand notes",
          "musk",
        ],
        year: 2020,
        perfumer: "Lattafa Perfumes",
        image: "lattafa-yara.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["100ml"],
      },
      "Al Haramain Hypno flower": {
        brand: "Al Haramain",
        family: "Oriental Floral",
        description:
          "A hypnotic floral fragrance with jasmine, rose, and white flowers.",
        ingredients: ["jasmine", "rose", "white flowers", "amber", "musk"],
        year: 2019,
        perfumer: "Al Haramain",
        image: "alharamain-hypno-flower.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Lattafa Ameerat Al Arab": {
        brand: "Lattafa",
        family: "Oriental Floral",
        description:
          "A regal fragrance with rose, oud, and precious oriental notes.",
        ingredients: ["rose", "oud", "saffron", "amber", "sandalwood"],
        year: 2021,
        perfumer: "Lattafa Perfumes",
        image: "lattafa-ameerat-al-arab.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["100ml"],
      },

      // Prada
      "Prada Prada": {
        brand: "Prada",
        family: "Oriental Floral",
        description:
          "The signature Prada fragrance with bergamot, jasmine, and patchouli.",
        ingredients: [
          "bergamot",
          "neroli",
          "jasmine",
          "rose",
          "patchouli",
          "sandalwood",
        ],
        year: 2004,
        perfumer: "Daniela Andrier",
        image: "prada-prada.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Prada Paradoxe Intense": {
        brand: "Prada",
        family: "Oriental Floral",
        description:
          "An intense and sophisticated fragrance with jasmine, ambrette, and serenolide.",
        ingredients: [
          "pear",
          "bergamot",
          "jasmine",
          "ambrette seeds",
          "serenolide",
          "benzoin",
        ],
        year: 2023,
        perfumer:
          "Antoine Maisondieu, Amandine Clerc-Marie & Nadège Le Garlantezec",
        image: "prada-paradoxe-intense.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Rabanne
      "Rabanne Lady Million Gold": {
        brand: "Rabanne",
        family: "Oriental Floral",
        description:
          "A luxurious and golden fragrance with mandarin, jasmine, and vanilla.",
        ingredients: [
          "mandarin",
          "violet leaf",
          "jasmine",
          "ylang-ylang",
          "vanilla",
          "sandalwood",
        ],
        year: 2019,
        perfumer: "Anne Flipo, Dominique Ropion & Carlos Benaim",
        image: "rabanne-lady-million-gold.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Rabanne Lady Million": {
        brand: "Rabanne",
        family: "Floral Woody",
        description:
          "A glamorous and seductive fragrance with raspberry, orange flower, and honey.",
        ingredients: [
          "raspberry",
          "neroli",
          "orange flower",
          "jasmine",
          "honey",
          "patchouli",
        ],
        year: 2010,
        perfumer: "Anne Flipo, Béatrice Piquet & Dominique Ropion",
        image: "rabanne-lady-million.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Rabanne Fame": {
        brand: "Rabanne",
        family: "Oriental Gourmand",
        description:
          "A bold and irresistible fragrance with mango, jasmine, and vanilla.",
        ingredients: ["mango", "bergamot", "jasmine", "sandalwood", "vanilla"],
        year: 2022,
        perfumer: "Alberto Morillas & Fabrice Pellegrin",
        image: "rabanne-fame.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Rabanne Pure XS": {
        brand: "Rabanne",
        family: "Oriental Floral",
        description:
          "A provocative and sensual fragrance with ylang-ylang, sandalwood, and vanilla.",
        ingredients: [
          "bergamot",
          "ylang-ylang",
          "jasmine",
          "sandalwood",
          "vanilla",
          "cedar",
        ],
        year: 2018,
        perfumer: "Anne Flipo & Dominique Ropion",
        image: "rabanne-pure-xs.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Rabanne Olympéa": {
        brand: "Rabanne",
        family: "Oriental Floral",
        description:
          "A divine and modern fragrance with ginger, jasmine, and vanilla.",
        ingredients: [
          "ginger",
          "mandarin",
          "jasmine",
          "vanilla",
          "sandalwood",
          "ambergris",
        ],
        year: 2015,
        perfumer: "Anne Flipo, Loc Dong & Dominique Ropion",
        image: "rabanne-olympea.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Shiseido
      "Shiseido Ginza": {
        brand: "Shiseido",
        family: "Floral Woody Musk",
        description:
          "An elegant and sophisticated fragrance with pomegranate, jasmine, and sandalwood.",
        ingredients: [
          "pomegranate",
          "jasmine",
          "magnolia",
          "incense",
          "sandalwood",
          "cedar",
        ],
        year: 2014,
        perfumer: "Aurelien Guichard",
        image: "shiseido-ginza.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Valentino
      "Valentino Valentina": {
        brand: "Valentino",
        family: "Oriental Floral",
        description:
          "A sophisticated and feminine fragrance with bergamot, jasmine, and cedar.",
        ingredients: [
          "bergamot",
          "strawberry",
          "jasmine",
          "tuberose",
          "cedar",
          "amber",
        ],
        year: 2011,
        perfumer: "Olivier Cresp",
        image: "valentino-valentina.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Valentino Donna": {
        brand: "Valentino",
        family: "Oriental Floral",
        description:
          "A mysterious and elegant fragrance with bergamot, iris, and vanilla.",
        ingredients: [
          "bergamot",
          "Bulgarian rose",
          "iris",
          "leather",
          "vanilla",
          "patchouli",
        ],
        year: 2015,
        perfumer: "Sonia Constant",
        image: "valentino-donna.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Versace
      "Versace Dylan Blue": {
        brand: "Versace",
        family: "Floral Fruity",
        description:
          "A fresh and vibrant fragrance with blackcurrant, apple, and musk.",
        ingredients: [
          "blackcurrant",
          "granny smith apple",
          "clover",
          "rose",
          "musk",
          "patchouli",
        ],
        year: 2016,
        perfumer: "Alberto Morillas",
        image: "versace-dylan-blue.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml","200ml"],
      },
      "Versace Crystal Noir": {
        brand: "Versace",
        family: "Oriental Floral",
        description:
          "A mysterious and sensual fragrance with gardenia, peony, and amber.",
        ingredients: [
          "ginger",
          "cardamom",
          "gardenia",
          "peony",
          "amber",
          "musk",
        ],
        year: 2004,
        perfumer: "Antoine Lie",
        image: "versace-crystal-noir.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","90ml"],
      },

      // Victoria's Secret
      "Victoria's Secret Midnight Ivy": {
        brand: "Victoria's Secret",
        family: "Oriental Floral",
        description:
          "A seductive and mysterious fragrance with dark berries, ivy, and musk.",
        ingredients: ["dark berries", "ivy leaves", "jasmine", "musk", "amber"],
        year: 2021,
        perfumer: "Victoria's Secret",
        image: "vs-midnight-ivy.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Victoria's Secret Bombshell": {
        brand: "Victoria's Secret",
        family: "Fruity Floral",
        description:
          "A glamorous and sparkling fragrance with passion fruit, peony, and musk.",
        ingredients: [
          "passion fruit",
          "peony",
          "vanilla orchid",
          "musk",
          "woody notes",
        ],
        year: 2010,
        perfumer: "Victoria's Secret",
        image: "vs-bombshell.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Victoria's Secret Victoria Intense": {
        brand: "Victoria's Secret",
        family: "Oriental Floral",
        description:
          "An intense and captivating fragrance with rose, amber, and musk.",
        ingredients: ["rose", "jasmine", "amber", "musk", "vanilla"],
        year: 2019,
        perfumer: "Victoria's Secret",
        image: "vs-victoria-intense.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // YSL Additional
      "Yves Saint Laurent Libre Intense": {
        brand: "Yves Saint Laurent",
        family: "Oriental Floral",
        description:
          "An intense and bold fragrance with lavender, jasmine, and vanilla.",
        ingredients: [
          "lavender",
          "bergamot",
          "jasmine sambac",
          "orange blossom",
          "vanilla",
          "ambergris",
        ],
        year: 2020,
        perfumer: "Anne Flipo & Carlos Benaim",
        image: "ysl-libre-intense.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["50ml","90ml"],
      },
      "Yves Saint Laurent Libre L'Absolu Platine": {
        brand: "Yves Saint Laurent",
        family: "Oriental Floral",
        description:
          "The most luxurious version with lavender, jasmine, and precious vanilla.",
        ingredients: [
          "lavender",
          "bergamot",
          "jasmine sambac",
          "ylang-ylang",
          "vanilla",
          "ambergris",
        ],
        year: 2023,
        perfumer: "Anne Flipo & Carlos Benaim",
        image: "ysl-libre-absolu-platine.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["50ml","90ml"],
      },
      "Yves Saint Laurent Black Opium Over Red": {
        brand: "Yves Saint Laurent",
        family: "Oriental Gourmand",
        description:
          "A passionate red version with red berries, jasmine, and vanilla.",
        ingredients: [
          "red berries",
          "pink pepper",
          "jasmine",
          "coffee",
          "vanilla",
          "patchouli",
        ],
        year: 2022,
        perfumer: "Nathalie Lorson, Marie Salamagne & Olivier Cresp",
        image: "ysl-black-opium-over-red.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["50ml","90ml"],
      },
      "Yves Saint Laurent Manifesto": {
        brand: "Yves Saint Laurent",
        family: "Oriental Floral",
        description:
          "A bold and rebellious fragrance with bergamot, jasmine, and vanilla.",
        ingredients: [
          "bergamot",
          "blackcurrant",
          "jasmine sambac",
          "lily",
          "vanilla",
          "sandalwood",
        ],
        year: 2012,
        perfumer: "Anne Flipo & Dominique Ropion",
        image: "ysl-manifesto.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["50ml","90ml"],
      },
      "Yves Saint Laurent Bouquet": {
        brand: "Yves Saint Laurent",
        family: "Floral",
        description:
          "A radiant bouquet fragrance with mandarin, jasmine, and white musk.",
        ingredients: [
          "mandarin",
          "bergamot",
          "jasmine",
          "rose",
          "white musk",
          "cedar",
        ],
        year: 2019,
        perfumer: "Dominique Ropion",
        image: "ysl-bouquet.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["50ml","90ml"],
      },
      "Yves Saint Laurent Mon Paris": {
        brand: "Yves Saint Laurent",
        family: "Fruity Floral",
        description:
          "A passionate and romantic fragrance with strawberry, raspberry, and datura flower.",
        ingredients: [
          "strawberry",
          "raspberry",
          "pear",
          "datura flower",
          "peony",
          "ambroxan",
        ],
        year: 2016,
        perfumer: "Olivier Cresp, Harry Fremont & Dora Baghriche",
        image: "ysl-mon-paris.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["50ml","90ml"],
      },

      // Yves Rocher
      "Yves Rocher Evidence": {
        brand: "Yves Rocher",
        family: "Oriental Floral",
        description:
          "A mysterious and sensual fragrance with violet, rose, and wood.",
        ingredients: [
          "violet",
          "rose",
          "jasmine",
          "wood notes",
          "amber",
          "musk",
        ],
        year: 2009,
        perfumer: "Olivier Pescheux",
        image: "yves-rocher-evidence.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // === POPULAR MEN'S FRAGRANCES ===

      // Armani Additional Men's
      "Giorgio Armani Armani Code": {
        brand: "Giorgio Armani",
        family: "Oriental Spicy",
        description:
          "A seductive and sophisticated fragrance with bergamot, lemon, and tonka bean.",
        ingredients: [
          "bergamot",
          "lemon",
          "olive blossom",
          "star anise",
          "guaiac wood",
          "tonka bean",
        ],
        year: 2004,
        perfumer: "Antoine Lie, Dominique Ropion & Anne Flipo",
        image: "armani-code.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Giorgio Armani Stronger With You": {
        brand: "Giorgio Armani",
        family: "Oriental Fougere",
        description:
          "A modern and addictive fragrance with bergamot, pink pepper, and vanilla.",
        ingredients: [
          "bergamot",
          "pink pepper",
          "violet leaves",
          "cinnamon",
          "vanilla",
          "suede",
        ],
        year: 2016,
        perfumer: "Cecile Matton & Serge Majoullier",
        image: "armani-stronger-with-you.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Ralph Lauren Men's
      "Ralph Lauren Polo Red": {
        brand: "Ralph Lauren",
        family: "Woody Spicy",
        description:
          "A bold and energetic fragrance with cranberry, saffron, and coffee.",
        ingredients: [
          "cranberry",
          "lemon",
          "saffron",
          "red cedar",
          "coffee bean",
          "amber",
        ],
        year: 2013,
        perfumer: "Olivier Gillotin",
        image: "polo-red.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Ralph Lauren Polo Black": {
        brand: "Ralph Lauren",
        family: "Woody Spicy",
        description:
          "A sophisticated and mysterious fragrance with iced mango and sandalwood.",
        ingredients: [
          "iced mango",
          "silver armoise",
          "sandalwood",
          "sage",
          "patchouli",
          "tonka bean",
        ],
        year: 2005,
        perfumer: "Carlos Benaim",
        image: "polo-black.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // YSL Men's Additional
      "Yves Saint Laurent Y": {
        brand: "Yves Saint Laurent",
        family: "Woody Aromatic",
        description:
          "A fresh and modern fragrance with bergamot, ginger, and balsam fir.",
        ingredients: [
          "bergamot",
          "ginger",
          "apple",
          "sage",
          "balsam fir",
          "amberwood",
        ],
        year: 2017,
        perfumer: "Dominique Ropion",
        image: "ysl-y.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["60ml","100ml"],
      },
      "Yves Saint Laurent Y Eau de Parfum": {
        brand: "Yves Saint Laurent",
        family: "Woody Aromatic",
        description: "An intense version with bergamot, ginger, and cedar.",
        ingredients: [
          "bergamot",
          "ginger",
          "apple",
          "juniper berries",
          "cedar",
          "vetiver",
        ],
        year: 2018,
        perfumer: "Dominique Ropion",
        image: "ysl-y-edp.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["50ml","90ml"],
      },

      // Versace Men's Additional
      "Versace Pour Homme": {
        brand: "Versace",
        family: "Aromatic Aquatic",
        description:
          "A Mediterranean fragrance with bergamot, neroli, and cedar.",
        ingredients: [
          "bergamot",
          "neroli",
          "citron",
          "hyacinth",
          "cedar",
          "tonka bean",
        ],
        year: 2008,
        perfumer: "Alberto Morillas",
        image: "versace-pour-homme.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml","200ml"],
      },
      "Versace Eros Flame": {
        brand: "Versace",
        family: "Oriental Spicy",
        description:
          "A passionate fragrance with mandarin, black pepper, and vanilla.",
        ingredients: [
          "mandarin",
          "black pepper",
          "rosemary",
          "geranium",
          "vanilla",
          "tonka bean",
        ],
        year: 2018,
        perfumer: "Olivier Pescheux",
        image: "versace-eros-flame.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml","200ml"],
      },

      // Calvin Klein Men's
      "Calvin Klein Obsession": {
        brand: "Calvin Klein",
        family: "Oriental Spicy",
        description:
          "A classic and intense fragrance with mandarin, vanilla, and amber.",
        ingredients: [
          "bergamot",
          "mandarin",
          "lavender",
          "myrrh",
          "vanilla",
          "amber",
        ],
        year: 1986,
        perfumer: "Jean Guichard & Bob Slattery",
        image: "ck-obsession.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["75ml","125ml"],
      },
      "Calvin Klein Eternity": {
        brand: "Calvin Klein",
        family: "Aromatic Fougere",
        description:
          "A timeless and fresh fragrance with mandarin, lavender, and sandalwood.",
        ingredients: [
          "mandarin",
          "lavender",
          "basil",
          "geranium",
          "sandalwood",
          "amber",
        ],
        year: 1990,
        perfumer: "Carlos Benaim",
        image: "ck-eternity.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["50ml","100ml"],
      },
      "Calvin Klein One": {
        brand: "Calvin Klein",
        family: "Citrus Aromatic",
        description: "A unisex classic with bergamot, cardamom, and amber.",
        ingredients: [
          "bergamot",
          "cardamom",
          "pineapple",
          "jasmine",
          "violet",
          "amber",
        ],
        year: 1994,
        perfumer: "Harry Fremont & Alberto Morillas",
        image: "ck-one.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Hugo Boss Men's Additional
      "Hugo Boss The Scent": {
        brand: "Hugo Boss",
        family: "Oriental Woody",
        description:
          "A seductive fragrance with ginger, maninka fruit, and leather.",
        ingredients: [
          "ginger",
          "bergamot",
          "maninka fruit",
          "lavender",
          "leather",
          "woodsy notes",
        ],
        year: 2015,
        perfumer: "Bruno Jovanovic",
        image: "hugo-boss-the-scent.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml","200ml"],
      },
      "Hugo Boss Boss Orange": {
        brand: "Hugo Boss",
        family: "Woody Aromatic",
        description:
          "A vibrant and energetic fragrance with apple, frankincense, and vanilla.",
        ingredients: [
          "apple",
          "bergamot",
          "frankincense",
          "bubinga wood",
          "vanilla",
          "sandalwood",
        ],
        year: 2011,
        perfumer: "Anne Flipo",
        image: "hugo-boss-orange.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml","200ml"],
      },

      // Jean Paul Gaultier Men's
      "Jean Paul Gaultier Ultra Male": {
        brand: "Jean Paul Gaultier",
        family: "Oriental Fougere",
        description:
          "An intense and addictive fragrance with bergamot, black currant, and vanilla.",
        ingredients: [
          "bergamot",
          "black currant",
          "pear",
          "mint",
          "vanilla",
          "amber",
        ],
        year: 2015,
        perfumer: "Francis Kurkdjian",
        image: "jpg-ultra-male.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Paco Rabanne Men's Additional
      "Paco Rabanne Phantom": {
        brand: "Paco Rabanne",
        family: "Aromatic",
        description:
          "A futuristic fragrance with lemon, lavender, and vanilla.",
        ingredients: [
          "lemon",
          "bergamot",
          "lavender",
          "smoking vanilla",
          "vetiver",
          "patchouli",
        ],
        year: 2021,
        perfumer: "Anne Flipo, Dominique Ropion & Loc Dong",
        image: "paco-rabanne-phantom.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml","200ml"],
      },
      "Paco Rabanne XS": {
        brand: "Paco Rabanne",
        family: "Oriental Woody",
        description:
          "A bold and masculine fragrance with bergamot, sage, and cedar.",
        ingredients: ["bergamot", "mint", "sage", "geranium", "cedar", "amber"],
        year: 1993,
        perfumer: "Gerard Anthony & Rosendo Mateu",
        image: "paco-rabanne-xs.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml","200ml"],
      },

      // Burberry Men's
      "Burberry Mr. Burberry": {
        brand: "Burberry",
        family: "Woody Aromatic",
        description:
          "A contemporary British fragrance with grapefruit, cardamom, and birch tar.",
        ingredients: [
          "grapefruit",
          "cardamom",
          "tarragon",
          "birch leaf",
          "oakmoss",
          "vetiver",
        ],
        year: 2016,
        perfumer: "Francis Kurkdjian",
        image: "burberry-mr-burberry.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Burberry London": {
        brand: "Burberry",
        family: "Oriental Spicy",
        description:
          "A warm and spicy fragrance with bergamot, lavender, and opoponax.",
        ingredients: [
          "bergamot",
          "lavender",
          "cinnamon",
          "mimosa",
          "opoponax",
          "tobacco leaf",
        ],
        year: 2006,
        perfumer: "Antoine Maisondieu",
        image: "burberry-london.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // === EXPANDED NICHE COLLECTION ===

      // Creed Additional
      "Creed Green Irish Tweed": {
        brand: "Creed",
        family: "Woody Floral Musk",
        description:
          "A fresh and sporty fragrance with lemon verbena and violet leaves.",
        ingredients: [
          "lemon verbena",
          "violet leaves",
          "sandalwood",
          "ambergris",
        ],
        year: 1985,
        perfumer: "Olivier Creed",
        image: "creed-green-irish-tweed.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["50ml","100ml","120ml"],
      },
      "Creed Viking": {
        brand: "Creed",
        family: "Oriental Aromatic",
        description:
          "A bold and adventurous fragrance with bergamot, pink pepper, and sandalwood.",
        ingredients: [
          "bergamot",
          "pink pepper",
          "mint",
          "rose",
          "sandalwood",
          "ambergris",
        ],
        year: 2017,
        perfumer: "Olivier Creed",
        image: "creed-viking.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["50ml","100ml","120ml"],
      },
      "Creed Royal Oud": {
        brand: "Creed",
        family: "Oriental Woody",
        description:
          "A luxurious oud fragrance with rose, saffron, and precious woods.",
        ingredients: ["rose", "saffron", "oud", "sandalwood", "orris"],
        year: 2011,
        perfumer: "Olivier Creed",
        image: "creed-royal-oud.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["50ml","100ml","120ml"],
      },

      // Maison Francis Kurkdjian Additional
      "Maison Francis Kurkdjian L'Homme À la Rose": {
        brand: "Maison Francis Kurkdjian",
        family: "Floral",
        description:
          "A modern masculine rose fragrance with grapefruit and cedar.",
        ingredients: ["grapefruit", "rose", "sage", "cedar", "musk"],
        year: 2020,
        perfumer: "Francis Kurkdjian",
        image: "mfk-lhomme-a-la-rose.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Maison Francis Kurkdjian Grand Soir": {
        brand: "Maison Francis Kurkdjian",
        family: "Oriental Woody",
        description:
          "A warm and enveloping fragrance with amber, vanilla, and benzoin.",
        ingredients: ["amber", "vanilla", "benzoin", "cistus", "tonka bean"],
        year: 2016,
        perfumer: "Francis Kurkdjian",
        image: "mfk-grand-soir.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Maison Francis Kurkdjian Oud Satin Mood": {
        brand: "Maison Francis Kurkdjian",
        family: "Oriental Woody",
        description:
          "A luxurious oud fragrance with rose, vanilla, and benzoin.",
        ingredients: ["oud", "rose", "vanilla", "benzoin", "cocoa"],
        year: 2015,
        perfumer: "Francis Kurkdjian",
        image: "mfk-oud-satin-mood.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Amouage Additional
      "Amouage Reflection Man": {
        brand: "Amouage",
        family: "Floral Woody Musk",
        description:
          "An elegant and sophisticated fragrance with rosemary, jasmine, and sandalwood.",
        ingredients: [
          "rosemary",
          "pink pepper",
          "jasmine",
          "ylang-ylang",
          "sandalwood",
          "cedar",
        ],
        year: 2007,
        perfumer: "Lucas Sieuzac",
        image: "amouage-reflection-man.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Amouage Epic Man": {
        brand: "Amouage",
        family: "Oriental Spicy",
        description:
          "A complex and mysterious fragrance with cumin, pink pepper, and oud.",
        ingredients: [
          "cumin",
          "pink pepper",
          "cardamom",
          "incense",
          "oud",
          "leather",
        ],
        year: 2009,
        perfumer: "Daniela Andrier",
        image: "amouage-epic-man.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Le Labo Additional
      "Le Labo Thé Pour Un Été": {
        brand: "Le Labo",
        family: "Aromatic Green",
        description:
          "A fresh and green tea fragrance with bergamot, bay leaves, and cedar.",
        ingredients: ["bergamot", "bay leaves", "green tea", "cedar", "musk"],
        year: 2016,
        perfumer: "Frank Voelkl",
        image: "le-labo-the-pour-un-ete.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Le Labo Bergamote 22": {
        brand: "Le Labo",
        family: "Citrus Aromatic",
        description:
          "A vibrant citrus fragrance with bergamot, grapefruit, and petit grain.",
        ingredients: [
          "bergamot",
          "grapefruit",
          "petit grain",
          "vetiver",
          "amber",
        ],
        year: 2006,
        perfumer: "Frank Voelkl",
        image: "le-labo-bergamote-22.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Byredo Additional
      "Byredo Black Saffron": {
        brand: "Byredo",
        family: "Oriental Spicy",
        description:
          "A warm and spicy fragrance with saffron, black violet, and leather.",
        ingredients: [
          "saffron",
          "juniper berries",
          "black violet",
          "leather",
          "raspberry",
          "crystal",
        ],
        year: 2012,
        perfumer: "Ben Gorham",
        image: "byredo-black-saffron.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Byredo Oud Immortel": {
        brand: "Byredo",
        family: "Oriental Woody",
        description:
          "A refined oud fragrance with cardamom, incense, and patchouli.",
        ingredients: ["cardamom", "incense", "oud", "patchouli", "tobacco"],
        year: 2010,
        perfumer: "Ben Gorham",
        image: "byredo-oud-immortel.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Diptyque Additional
      "Diptyque Tempo": {
        brand: "Diptyque",
        family: "Oriental Spicy",
        description:
          "A warm and spicy fragrance with violet, iris, and sandalwood.",
        ingredients: ["violet", "iris", "tea", "sandalwood", "amber"],
        year: 2020,
        perfumer: "Fabrice Pellegrin",
        image: "diptyque-tempo.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Diptyque Volutes": {
        brand: "Diptyque",
        family: "Oriental Spicy",
        description:
          "A smoky and mysterious fragrance with tobacco, honey, and dried fruits.",
        ingredients: ["tobacco", "honey", "dried fruits", "iris", "saffron"],
        year: 2012,
        perfumer: "Fabrice Pellegrin",
        image: "diptyque-volutes.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Kilian Additional
      "Kilian Straight to Heaven": {
        brand: "Kilian",
        family: "Oriental Woody",
        description: "A celestial fragrance with rum, nutmeg, and sandalwood.",
        ingredients: ["rum", "nutmeg", "patchouli", "sandalwood", "vanilla"],
        year: 2007,
        perfumer: "Calice Becker",
        image: "kilian-straight-to-heaven.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Kilian Angels' Share": {
        brand: "Kilian",
        family: "Oriental Gourmand",
        description:
          "A boozy and gourmand fragrance with cognac, cinnamon, and vanilla.",
        ingredients: [
          "cognac",
          "cinnamon",
          "tonka bean",
          "sandalwood",
          "vanilla",
        ],
        year: 2020,
        perfumer: "Benoist Lapouza",
        image: "kilian-angels-share.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Niche Houses Additional
      "Nasomatto Black Afgano": {
        brand: "Nasomatto",
        family: "Oriental Woody",
        description:
          "A dark and mysterious fragrance with cannabis, green leaves, and oud.",
        ingredients: ["cannabis", "green leaves", "wood", "oud", "amber"],
        year: 2009,
        perfumer: "Alessandro Gualtieri",
        image: "nasomatto-black-afgano.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Escentric Molecules Molecule 01": {
        brand: "Escentric Molecules",
        family: "Woody",
        description:
          "A minimalist fragrance consisting almost entirely of Iso E Super.",
        ingredients: ["iso e super"],
        year: 2006,
        perfumer: "Geza Schoen",
        image: "em-molecule-01.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Acqua di Parma Colonia": {
        brand: "Acqua di Parma",
        family: "Citrus Aromatic",
        description:
          "A classic Italian cologne with bergamot, lemon, and lavender.",
        ingredients: [
          "bergamot",
          "lemon",
          "sweet orange",
          "lavender",
          "rose",
          "sandalwood",
        ],
        year: 1916,
        perfumer: "Acqua di Parma",
        image: "adp-colonia.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      "Malin + Goetz Cannabis": {
        brand: "Malin + Goetz",
        family: "Green Aromatic",
        description:
          "A fresh green fragrance with cannabis accord, fig, and bay leaves.",
        ingredients: ["cannabis", "fig", "bay leaves", "cedar", "sandalwood"],
        year: 2016,
        perfumer: "Malin + Goetz",
        image: "malin-goetz-cannabis.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Afnan
      "Afnan 9pm": {
        brand: "Afnan",
        family: "Oriental Spicy",
        description: "A rich and luxurious fragrance with oud, rose, and spices.",
        ingredients: ["bergamot", "apple", "rose", "oud", "vanilla", "amber"],
        year: 2019,
        perfumer: "Afnan Perfumes",
        image: "afnan-9pm.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["100ml"],
      },
      "Afnan Supremacy Silver": {
        brand: "Afnan",
        family: "Fresh Spicy",
        description: "A modern and elegant fragrance with citrus, lavender, and amber.",
        ingredients: ["lemon", "lavender", "apple", "cedarwood", "amber", "musk"],
        year: 2020,
        perfumer: "Afnan Perfumes",
        image: "afnan-supremacy-silver.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["100ml"],
      },

      // Armaf
      "Armaf Club de Nuit Intense": {
        brand: "Armaf",
        family: "Fresh Spicy",
        description: "A powerful and long-lasting fragrance with citrus, pineapple, and birch.",
        ingredients: ["pineapple", "bergamot", "blackcurrant", "birch", "musk", "oakmoss"],
        year: 2015,
        perfumer: "Armaf",
        image: "armaf-cdni.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["105ml"],
      },
      "Armaf Hunter Intense": {
        brand: "Armaf",
        family: "Oriental Spicy",
        description: "An intense and sophisticated fragrance with tobacco, vanilla, and spices.",
        ingredients: ["tobacco", "vanilla", "cinnamon", "amber", "musk", "cedar"],
        year: 2018,
        perfumer: "Armaf",
        image: "armaf-hunter-intense.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["100ml"],
      },

      // Azzaro
      "Azzaro Chrome": {
        brand: "Azzaro",
        family: "Citrus Aromatic",
        description: "A fresh and aquatic fragrance with citrus, rosemary, and musk.",
        ingredients: ["lemon", "rosemary", "coriander", "cedar", "sandalwood", "musk"],
        year: 1996,
        perfumer: "Gerard Haury",
        image: "azzaro-chrome.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml","200ml"],
      },
      "Azzaro Wanted": {
        brand: "Azzaro",
        family: "Oriental Spicy",
        description: "A bold and charismatic fragrance with lemon, cardamom, and tonka bean.",
        ingredients: ["lemon", "cardamom", "juniper", "apple", "tonka bean", "amberwood"],
        year: 2016,
        perfumer: "Fabrice Pellegrin",
        image: "azzaro-wanted.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml","150ml"],
      },

      // Burberry
      "Burberry Her": {
        brand: "Burberry",
        family: "Fruity Gourmand",
        description: "A vibrant and youthful fragrance with berries, jasmine, and musk.",
        ingredients: ["strawberry", "raspberry", "jasmine", "violet", "musk", "cashmeran"],
        year: 2018,
        perfumer: "Francis Kurkdjian",
        image: "burberry-her.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["50ml","100ml"],
      },
      "Burberry Brit": {
        brand: "Burberry",
        family: "Oriental Spicy",
        description: "A warm and cozy fragrance with lime, cardamom, and cedar.",
        ingredients: ["lime", "cardamom", "nutmeg", "cedar", "tonka bean", "musk"],
        year: 2003,
        perfumer: "Nathalie Gracia-Cetto",
        image: "burberry-brit.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Calvin Klein
      "Calvin Klein Euphoria": {
        brand: "Calvin Klein",
        family: "Oriental Floral",
        description: "A captivating and mysterious fragrance with pomegranate, orchid, and amber.",
        ingredients: ["pomegranate", "persimmon", "orchid", "lotus", "amber", "mahogany"],
        year: 2005,
        perfumer: "Dominique Ropion & Carlos Benaim",
        image: "ck-euphoria.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["50ml","100ml"],
      },
      "Calvin Klein Eternity": {
        brand: "Calvin Klein",
        family: "Floral",
        description: "A timeless and elegant fragrance with white flowers and sandalwood.",
        ingredients: ["mandarin", "lily", "jasmine", "rose", "sandalwood", "amber"],
        year: 1988,
        perfumer: "Sophia Grojsman",
        image: "ck-eternity.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["50ml","100ml"],
      },

      // Clinique
      "Clinique Happy": {
        brand: "Clinique",
        family: "Citrus Floral",
        description: "A joyful and uplifting fragrance with citrus, lily of the valley, and musk.",
        ingredients: ["mandarin", "boysenberry", "lily of the valley", "orchid", "musk", "cedar"],
        year: 1997,
        perfumer: "Calice Becker",
        image: "clinique-happy.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["50ml","100ml"],
      },
      "Clinique Aromatics Elixir": {
        brand: "Clinique",
        family: "Chypre Floral",
        description: "A mysterious and sophisticated fragrance with aldehydes, rose, and patchouli.",
        ingredients: ["aldehydes", "rose", "jasmine", "ylang-ylang", "patchouli", "musk"],
        year: 1971,
        perfumer: "Bernard Chant",
        image: "clinique-aromatics-elixir.jpg",
        available: false,
        concentration: "Parfum",
        sizes: ["45ml","100ml"],
      },

      // Coach
      "Coach Floral": {
        brand: "Coach",
        family: "Floral Fruity",
        description: "A fresh and feminine fragrance with pineapple, gardenia, and musk.",
        ingredients: ["pineapple", "pink pepper", "gardenia", "jasmine", "musk", "suede"],
        year: 2018,
        perfumer: "Nadège Le Garlantezec",
        image: "coach-floral.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["50ml","90ml"],
      },
      "Coach Dreams": {
        brand: "Coach",
        family: "Floral Fruity",
        description: "A dreamy and romantic fragrance with pear, gardenia, and amberwood.",
        ingredients: ["pear", "bitter orange", "gardenia", "jasmine", "amberwood", "musk"],
        year: 2020,
        perfumer: "Loc Dong",
        image: "coach-dreams.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["60ml","90ml"],
      },

      // Davidoff
      "Davidoff Cool Water": {
        brand: "Davidoff",
        family: "Aromatic Aquatic",
        description: "A fresh and aquatic fragrance with mint, lavender, and ambergris.",
        ingredients: ["mint", "lavender", "coriander", "geranium", "sandalwood", "ambergris"],
        year: 1988,
        perfumer: "Pierre Bourdon",
        image: "davidoff-cool-water.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["75ml","125ml","200ml"],
      },
      "Davidoff The Game": {
        brand: "Davidoff",
        family: "Oriental Spicy",
        description: "A bold and masculine fragrance with gin, pepper, and cedar.",
        ingredients: ["gin", "pepper", "violet leaf", "cedar", "ambergris", "ebony"],
        year: 2012,
        perfumer: "Lucas Sieuzac",
        image: "davidoff-the-game.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["60ml","100ml"],
      },

      // Dolce & Gabbana
      "Dolce & Gabbana The Only One": {
        brand: "Dolce & Gabbana",
        family: "Oriental Floral",
        description: "A sensual and sophisticated fragrance with violet, coffee, and vanilla.",
        ingredients: ["violet", "iris", "coffee", "vanilla", "cashmeran", "crystal moss"],
        year: 2018,
        perfumer: "Daphné Bugey",
        image: "dg-the-only-one.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Dolce & Gabbana Light Blue": {
        brand: "Dolce & Gabbana",
        family: "Citrus Floral",
        description: "A fresh and Mediterranean fragrance with lemon, apple, and cedar.",
        ingredients: ["lemon", "apple", "jasmine", "bamboo", "cedar", "ambergris"],
        year: 2001,
        perfumer: "Olivier Cresp",
        image: "dg-light-blue.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Elizabeth Arden
      "Elizabeth Arden Green Tea": {
        brand: "Elizabeth Arden",
        family: "Citrus Aromatic",
        description: "A refreshing and energizing fragrance with green tea, mint, and musk.",
        ingredients: ["lemon", "mint", "green tea", "jasmine", "musk", "amber"],
        year: 1999,
        perfumer: "Francis Kurkdjian",
        image: "ea-green-tea.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },
      "Elizabeth Arden Red Door": {
        brand: "Elizabeth Arden",
        family: "Floral",
        description: "A classic and elegant fragrance with lily, rose, and sandalwood.",
        ingredients: ["lily of the valley", "rose", "jasmine", "honey", "sandalwood", "benzoin"],
        year: 1989,
        perfumer: "Carlos Benaim",
        image: "ea-red-door.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml"],
      },

      // Estee Lauder
      "Estee Lauder Modern Muse": {
        brand: "Estee Lauder",
        family: "Floral Woody",
        description: "A contemporary and confident fragrance with mandarin, lily, and patchouli.",
        ingredients: ["mandarin", "lily", "honeysuckle", "jasmine", "patchouli", "amberwood"],
        year: 2013,
        perfumer: "Harry Fremont",
        image: "el-modern-muse.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["50ml","100ml"],
      },
      "Estee Lauder Private Collection": {
        brand: "Estee Lauder",
        family: "Floral",
        description: "A timeless and sophisticated fragrance with white flowers and musk.",
        ingredients: ["white lily", "jasmine", "rose", "ylang-ylang", "sandalwood", "musk"],
        year: 1973,
        perfumer: "Estee Lauder",
        image: "el-private-collection.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["50ml","85ml"],
      },

      // Giorgio Armani
      "Giorgio Armani Si": {
        brand: "Giorgio Armani",
        family: "Chypre Fruity",
        description: "A modern and elegant fragrance with blackcurrant, rose, and patchouli.",
        ingredients: ["blackcurrant", "rose", "freesia", "patchouli", "ambroxan", "vanilla"],
        year: 2013,
        perfumer: "Christine Nagel",
        image: "armani-si.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["50ml","100ml"],
      },
      "Giorgio Armani Code": {
        brand: "Giorgio Armani",
        family: "Oriental Spicy",
        description: "A seductive and mysterious fragrance with bergamot, olive blossom, and tonka bean.",
        ingredients: ["bergamot", "lemon", "olive blossom", "guaiac wood", "tonka bean", "leather"],
        year: 2004,
        perfumer: "Antoine Lie",
        image: "armani-code.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","75ml","110ml"],
      },

      // Hugo Boss (Additional entries)
      "Hugo Boss The Scent": {
        brand: "Hugo Boss",
        family: "Oriental Spicy",
        description: "An irresistible and seductive fragrance with ginger, exotic maninka, and leather.",
        ingredients: ["ginger", "exotic maninka", "lavender", "cocoa", "leather", "woody notes"],
        year: 2015,
        perfumer: "Bruno Jovanovic",
        image: "hugo-boss-the-scent.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml","200ml"],
      },

      // Issey Miyake
      "Issey Miyake L'Eau d'Issey": {
        brand: "Issey Miyake",
        family: "Aquatic Floral",
        description: "A pure and refreshing fragrance with lotus, lily, and precious woods.",
        ingredients: ["lotus", "cyclamen", "lily", "peony", "precious woods", "osmanthus"],
        year: 1992,
        perfumer: "Jacques Cavallier",
        image: "issey-miyake-leau-dissey.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml","125ml"],
      },
      "Issey Miyake A Drop d'Issey": {
        brand: "Issey Miyake",
        family: "Floral Aquatic",
        description: "A delicate and ethereal fragrance with lilac, rose, and almond milk.",
        ingredients: ["lilac", "rose", "almond milk", "vanilla", "upcycled cedarwood", "ambrox"],
        year: 2022,
        perfumer: "Ane Ayo",
        image: "issey-miyake-drop.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["50ml","90ml"],
      },

      // Jimmy Choo
      "Jimmy Choo": {
        brand: "Jimmy Choo",
        family: "Chypre Fruity",
        description: "A glamorous and feminine fragrance with pear, tiger orchid, and patchouli.",
        ingredients: ["pear", "mandarin", "tiger orchid", "indonesian patchouli", "toffee", "cedar"],
        year: 2011,
        perfumer: "Olivier Polge",
        image: "jimmy-choo.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["60ml","100ml"],
      },
      "Jimmy Choo Fever": {
        brand: "Jimmy Choo",
        family: "Oriental Floral",
        description: "A bold and intoxicating fragrance with lychee, heliotrope, and benzoin.",
        ingredients: ["lychee", "grapefruit", "heliotrope", "jasmine", "benzoin", "sandalwood"],
        year: 2018,
        perfumer: "Anne Flipo",
        image: "jimmy-choo-fever.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["60ml","100ml"],
      },

      // Lattafa
      "Lattafa Raghba": {
        brand: "Lattafa",
        family: "Oriental Sweet",
        description: "A rich and opulent fragrance with vanilla, oud, and sweet spices.",
        ingredients: ["vanilla", "oud", "rose", "saffron", "amber", "musk"],
        year: 2019,
        perfumer: "Lattafa Perfumes",
        image: "lattafa-raghba.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["100ml"],
      },
      "Lattafa Yara": {
        brand: "Lattafa",
        family: "Oriental Gourmand",
        description: "A sweet and addictive fragrance with heliotrope, orchid, and vanilla.",
        ingredients: ["heliotrope", "orchid", "gourmand accord", "vanilla", "sandalwood", "musk"],
        year: 2020,
        perfumer: "Lattafa Perfumes",
        image: "lattafa-yara.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["100ml"],
      },

      // Paco Rabanne
      "Paco Rabanne Olympea": {
        brand: "Paco Rabanne",
        family: "Oriental Floral",
        description: "A divine and powerful fragrance with water jasmine, ginger flower, and vanilla.",
        ingredients: ["water jasmine", "ginger flower", "salted vanilla", "sandalwood", "ambergris", "cashmere wood"],
        year: 2015,
        perfumer: "Anne Flipo, Loc Dong & Dominique Ropion",
        image: "paco-rabanne-olympea.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["50ml","80ml"],
      },
      "Paco Rabanne Lady Million": {
        brand: "Paco Rabanne",
        family: "Floral Woody",
        description: "A dazzling and extravagant fragrance with raspberry, jasmine, and patchouli.",
        ingredients: ["raspberry", "neroli", "jasmine", "gardenia", "patchouli", "amber"],
        year: 2010,
        perfumer: "Anne Flipo, Beatrice Piquet & Dominique Ropion",
        image: "paco-rabanne-lady-million.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["50ml","80ml"],
      },

      // Ralph Lauren
      "Ralph Lauren Polo": {
        brand: "Ralph Lauren",
        family: "Woody Chypre",
        description: "A classic and masculine fragrance with artemisia, pine, and leather.",
        ingredients: ["artemisia", "basil", "pine needles", "carnation", "leather", "tobacco"],
        year: 1978,
        perfumer: "Carlos Benaim",
        image: "ralph-lauren-polo.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["59ml","118ml","237ml"],
      },
      "Ralph Lauren Romance": {
        brand: "Ralph Lauren",
        family: "Floral",
        description: "A romantic and feminine fragrance with rose, lily, and musk.",
        ingredients: ["rose", "lily", "freesia", "ginger", "musk", "oakmoss"],
        year: 1998,
        perfumer: "Harry Fremont",
        image: "ralph-lauren-romance.jpg",
        available: false,
        concentration: "EDP",
        sizes: ["50ml","100ml"],
      },

      // Versace (Additional entries)
      "Versace Eros": {
        brand: "Versace",
        family: "Oriental Fougere",
        description: "A passionate and seductive fragrance with mint, apple, and vanilla.",
        ingredients: ["mint", "apple", "tonka bean", "ambroxan", "geranium", "vanilla"],
        year: 2012,
        perfumer: "Aurelien Guichard",
        image: "versace-eros.jpg",
        available: false,
        concentration: "EDT",
        sizes: ["50ml","100ml","200ml"],
      },
    };
  }

  /**
   * Initialize ingredient-to-fragrance mapping database
   * @returns {Object} Ingredient database
   */
  initializeIngredientDatabase() {
    const db = {};

    // Build reverse mapping from comprehensive database
    Object.entries(this.comprehensiveDatabase).forEach(
      ([fragrance, profile]) => {
        profile.ingredients.forEach((ingredient) => {
          const normalizedIngredient = ingredient.toLowerCase().trim();
          if (!db[normalizedIngredient]) {
            db[normalizedIngredient] = [];
          }
          db[normalizedIngredient].push(fragrance);
        });
      },
    );

    return db;
  }

  /**
   * Fetch data from external APIs (placeholder for actual implementation)
   * @param {string} endpoint - API endpoint type
   * @param {any} params - Request parameters
   * @returns {Promise<Array>} API response
   */
  async fetchFromAPIs(endpoint, params) {
    // Placeholder for actual API integration
    // Replace with real API calls when available

    const cacheKey = `${endpoint}_${JSON.stringify(params)}`;
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }

    try {
      // Example API call structure
      // const response = await fetch(`${this.apiEndpoints.fragrantica}/${endpoint}`, {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify(params)
      // });
      // const data = await response.json();

      // For now, return null to fallback to local database
      return null;
    } catch (error) {
      console.error("API fetch failed:", error);
      return null;
    }
  }

  /**
   * Format API results to match local database structure
   * @param {Array} apiResults - Raw API results
   * @returns {Array} Formatted results
   */
  formatResults(apiResults) {
    return apiResults.map((result) => ({
      fragrance: result.name || result.title,
      profile: {
        brand: result.brand || "Unknown",
        description: result.description || "",
        ingredients: result.notes || result.ingredients || [],
        year: result.year || result.launch_year,
        perfumer: result.perfumer || result.nose,
        image: result.image || "default.jpg",
      },
      matchCount: result.match_count || 0,
      matchedIngredients: result.matched_ingredients || [],
      percentage: result.match_percentage || 0,
    }));
  }

  /**
   * Get all available ingredients
   * @returns {Array} Array of all ingredient names
   */
  getAllIngredients() {
    return Object.keys(this.ingredientDatabase).sort();
  }

  /**
   * Get popular ingredients
   * @param {number} limit - Number of ingredients to return
   * @returns {Array} Array of popular ingredient names
   */
  getPopularIngredients(limit = 50) {
    const ingredientCounts = {};

    Object.entries(this.ingredientDatabase).forEach(
      ([ingredient, fragrances]) => {
        ingredientCounts[ingredient] = fragrances.length;
      },
    );

    return Object.entries(ingredientCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([ingredient]) => ingredient);
  }

  /**
   * Get ingredient suggestions based on partial input
   * @param {string} query - Partial ingredient name
   * @param {number} limit - Maximum number of suggestions
   * @returns {Array} Array of matching ingredient names
   */
  getIngredientSuggestions(query, limit = 10) {
    if (!query || query.length < 2) return [];

    const normalizedQuery = query.toLowerCase().trim();
    const allIngredients = this.getAllIngredients();

    // Find exact starts with matches first
    const startsWith = allIngredients.filter((ingredient) =>
      ingredient.startsWith(normalizedQuery),
    );

    // Then find contains matches
    const contains = allIngredients.filter(
      (ingredient) =>
        !ingredient.startsWith(normalizedQuery) &&
        ingredient.includes(normalizedQuery),
    );

    return [...startsWith, ...contains].slice(0, limit);
  }

  /**
   * Get fragrance statistics
   * @returns {Object} Statistics about the database
   */
  getStatistics() {
    const totalFragrances = Object.keys(this.comprehensiveDatabase).length;
    const totalIngredients = Object.keys(this.ingredientDatabase).length;

    const brandCounts = {};
    const familyCounts = {};
    const yearCounts = {};

    Object.values(this.comprehensiveDatabase).forEach((profile) => {
      // Count brands
      brandCounts[profile.brand] = (brandCounts[profile.brand] || 0) + 1;

      // Count families
      if (profile.family) {
        familyCounts[profile.family] = (familyCounts[profile.family] || 0) + 1;
      }

      // Count years
      if (profile.year) {
        const decade = Math.floor(profile.year / 10) * 10;
        yearCounts[decade] = (yearCounts[decade] || 0) + 1;
      }
    });

    return {
      totalFragrances,
      totalIngredients,
      brands: Object.keys(brandCounts).length,
      families: Object.keys(familyCounts).length,
      topBrands: Object.entries(brandCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([brand, count]) => ({ brand, count })),
      topFamilies: Object.entries(familyCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([family, count]) => ({ family, count })),
      decades: yearCounts,
    };
  }

  /**
   * Search fragrances by text query
   * @param {string} query - Search query
   * @returns {Array} Array of matching fragrances
   */
  searchByText(query) {
    if (!query || query.length < 2) return [];

    const normalizedQuery = query.toLowerCase().trim();
    const results = [];

    Object.entries(this.comprehensiveDatabase).forEach(([name, profile]) => {
      let score = 0;

      // Check fragrance name
      if (name.toLowerCase().includes(normalizedQuery)) {
        score += 100;
      }

      // Check brand
      if (profile.brand.toLowerCase().includes(normalizedQuery)) {
        score += 50;
      }

      // Check description
      if (profile.description.toLowerCase().includes(normalizedQuery)) {
        score += 25;
      }

      // Check ingredients
      profile.ingredients.forEach((ingredient) => {
        if (ingredient.toLowerCase().includes(normalizedQuery)) {
          score += 10;
        }
      });

      // Check family
      if (
        profile.family &&
        profile.family.toLowerCase().includes(normalizedQuery)
      ) {
        score += 30;
      }

      // Check perfumer
      if (
        profile.perfumer &&
        profile.perfumer.toLowerCase().includes(normalizedQuery)
      ) {
        score += 20;
      }

      if (score > 0) {
        results.push({
          fragrance: name,
          profile,
          relevanceScore: score,
        });
      }
    });

    return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  /**
   * Get similar fragrances based on shared ingredients
   * @param {string} fragranceName - Reference fragrance name
   * @param {number} limit - Number of similar fragrances to return
   * @returns {Array} Array of similar fragrances
   */
  getSimilarFragrances(fragranceName, limit = 5) {
    const referenceFragrance = this.comprehensiveDatabase[fragranceName];
    if (!referenceFragrance) return [];

    const similarities = {};

    Object.entries(this.comprehensiveDatabase).forEach(([name, profile]) => {
      if (name === fragranceName) return;

      const sharedIngredients = referenceFragrance.ingredients.filter(
        (ingredient) => profile.ingredients.includes(ingredient),
      );

      if (sharedIngredients.length > 0) {
        const similarity =
          sharedIngredients.length /
          Math.max(
            referenceFragrance.ingredients.length,
            profile.ingredients.length,
          );

        similarities[name] = {
          profile,
          sharedIngredients,
          similarity,
          sharedCount: sharedIngredients.length,
        };
      }
    });

    return Object.entries(similarities)
      .sort(([, a], [, b]) => b.similarity - a.similarity)
      .slice(0, limit)
      .map(([fragrance, data]) => ({
        fragrance,
        profile: data.profile,
        similarity: Math.round(data.similarity * 100),
        sharedIngredients: data.sharedIngredients,
        sharedCount: data.sharedCount,
      }));
  }

  /**
   * Export database for backup or analysis
   * @returns {Object} Complete database export
   */
  exportDatabase() {
    return {
      fragrances: this.comprehensiveDatabase,
      ingredients: this.ingredientDatabase,
      statistics: this.getStatistics(),
      exportDate: new Date().toISOString(),
    };
  }

  /**
   * Validate fragrance data
   * @param {Object} fragrance - Fragrance profile to validate
   * @returns {Object} Validation result
   */
  validateFragrance(fragrance) {
    const errors = [];
    const warnings = [];

    if (!fragrance.brand) errors.push("Missing brand");
    if (!fragrance.description) warnings.push("Missing description");
    if (!fragrance.ingredients || fragrance.ingredients.length === 0) {
      errors.push("Missing ingredients");
    }
    if (!fragrance.family) warnings.push("Missing fragrance family");
    if (!fragrance.year) warnings.push("Missing launch year");
    if (!fragrance.perfumer) warnings.push("Missing perfumer");

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }
}

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = FragranceAPIService;
} else if (typeof window !== "undefined") {
  window.FragranceAPIService = FragranceAPIService;
}
