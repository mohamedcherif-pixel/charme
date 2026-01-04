/**
 * AI Fragrance Finder
 * Advanced questionnaire system with AI-powered fragrance recommendations
 */

class AIFragranceFinder {
  constructor() {
    this.currentQuestion = 0;
    this.answers = {};
    this.questions = [
      {
        id: "time_preference",
        title: "What time of day do you usually wear fragrance?",
        type: "single",
        options: [
          {
            value: "morning",
            text: "Morning & Daytime",
            weight: { fresh: 3, citrus: 3, light: 2 },
          },
          {
            value: "evening",
            text: "Evening & Night",
            weight: { oriental: 3, spicy: 3, heavy: 2 },
          },
          {
            value: "both",
            text: "All day long",
            weight: { versatile: 3, moderate: 2 },
          },
          {
            value: "special",
            text: "Special occasions only",
            weight: { luxury: 3, sophisticated: 2 },
          },
        ],
      },
      {
        id: "season_preference",
        title: "Which season do you prefer for wearing fragrances?",
        type: "single",
        options: [
          {
            value: "spring",
            text: "Spring - Fresh & Floral",
            weight: { floral: 3, fresh: 2, green: 2 },
          },
          {
            value: "summer",
            text: "Summer - Light & Citrusy",
            weight: { citrus: 3, aquatic: 2, fresh: 2 },
          },
          {
            value: "autumn",
            text: "Autumn - Warm & Spicy",
            weight: { spicy: 3, woody: 2, amber: 2 },
          },
          {
            value: "winter",
            text: "Winter - Rich & Deep",
            weight: { oriental: 3, vanilla: 2, musk: 2 },
          },
          {
            value: "year_round",
            text: "All seasons",
            weight: { versatile: 3, balanced: 2 },
          },
        ],
      },
      {
        id: "personality_type",
        title: "How would you describe your personality?",
        type: "single",
        options: [
          {
            value: "confident",
            text: "Confident & Bold",
            weight: { bold: 3, statement: 2, strong: 2 },
          },
          {
            value: "romantic",
            text: "Romantic & Dreamy",
            weight: { floral: 3, soft: 2, feminine: 2 },
          },
          {
            value: "sophisticated",
            text: "Sophisticated & Elegant",
            weight: { luxury: 3, refined: 2, classic: 2 },
          },
          {
            value: "adventurous",
            text: "Adventurous & Energetic",
            weight: { dynamic: 3, fresh: 2, sporty: 2 },
          },
          {
            value: "mysterious",
            text: "Mysterious & Intriguing",
            weight: { dark: 3, complex: 2, enigmatic: 2 },
          },
        ],
      },
      {
        id: "scent_intensity",
        title: "What intensity do you prefer in fragrances?",
        type: "single",
        options: [
          {
            value: "subtle",
            text: "Subtle & Close to skin",
            weight: { light: 3, intimate: 2, soft: 2 },
          },
          {
            value: "moderate",
            text: "Moderate & Noticeable",
            weight: { moderate: 3, balanced: 2, wearable: 2 },
          },
          {
            value: "strong",
            text: "Strong & Long-lasting",
            weight: { powerful: 3, projection: 2, statement: 2 },
          },
          {
            value: "variable",
            text: "Depends on the occasion",
            weight: { versatile: 3, adaptable: 2 },
          },
        ],
      },
      {
        id: "scent_families",
        title: "Which scent families appeal to you most?",
        type: "multiple",
        options: [
          {
            value: "floral",
            text: "🌸 Floral (Rose, Jasmine, Lily)",
            weight: { floral: 3, feminine: 2 },
          },
          {
            value: "citrus",
            text: "🍋 Citrus (Bergamot, Lemon, Orange)",
            weight: { citrus: 3, fresh: 2 },
          },
          {
            value: "woody",
            text: "🌲 Woody (Sandalwood, Cedar, Oak)",
            weight: { woody: 3, masculine: 2 },
          },
          {
            value: "oriental",
            text: "🌟 Oriental (Vanilla, Amber, Spices)",
            weight: { oriental: 3, warm: 2 },
          },
          {
            value: "fresh",
            text: "💨 Fresh (Marine, Green, Ozonic)",
            weight: { fresh: 3, clean: 2 },
          },
          {
            value: "gourmand",
            text: "🍰 Gourmand (Vanilla, Caramel, Coffee)",
            weight: { sweet: 3, comforting: 2 },
          },
        ],
      },
      {
        id: "lifestyle",
        title: "What best describes your lifestyle?",
        type: "single",
        options: [
          {
            value: "professional",
            text: "Professional & Business-focused",
            weight: { professional: 3, clean: 2, sophisticated: 2 },
          },
          {
            value: "creative",
            text: "Creative & Artistic",
            weight: { unique: 3, artistic: 2, unconventional: 2 },
          },
          {
            value: "social",
            text: "Social & Outgoing",
            weight: { appealing: 3, charming: 2, magnetic: 2 },
          },
          {
            value: "active",
            text: "Active & Sporty",
            weight: { energetic: 3, fresh: 2, dynamic: 2 },
          },
          {
            value: "relaxed",
            text: "Relaxed & Laid-back",
            weight: { comfortable: 3, easy: 2, casual: 2 },
          },
        ],
      },
      {
        id: "budget_range",
        title: "What's your preferred price range?",
        type: "single",
        options: [
          {
            value: "luxury",
            text: "$200+ - Luxury & Niche",
            weight: { luxury: 3, niche: 2, premium: 2 },
          },
          {
            value: "premium",
            text: "$100-200 - Premium Designer",
            weight: { designer: 3, quality: 2, reliable: 2 },
          },
          {
            value: "mid_range",
            text: "$50-100 - Mid-range",
            weight: { accessible: 3, balanced: 2, practical: 2 },
          },
          {
            value: "budget",
            text: "Under $50 - Budget-friendly",
            weight: { affordable: 3, everyday: 2, simple: 2 },
          },
        ],
      },
      {
        id: "inspiration",
        title: "What inspires you to choose a fragrance?",
        type: "single",
        options: [
          {
            value: "memories",
            text: "Memories & Emotions",
            weight: { nostalgic: 3, emotional: 2, personal: 2 },
          },
          {
            value: "attraction",
            text: "To attract others",
            weight: { seductive: 3, magnetic: 2, alluring: 2 },
          },
          {
            value: "confidence",
            text: "To boost confidence",
            weight: { empowering: 3, bold: 2, strong: 2 },
          },
          {
            value: "mood",
            text: "To match my mood",
            weight: { expressive: 3, versatile: 2, adaptive: 2 },
          },
          {
            value: "artistry",
            text: "The artistry & craftsmanship",
            weight: { artistic: 3, refined: 2, appreciative: 2 },
          },
        ],
      },
    ];

    this.fragranceDatabase = [
      // Parfums de Marly Collection
      {
        name: "Layton",
        brand: "Parfums de Marly",
        description:
          "A sophisticated blend of vanilla, sandalwood, and subtle spices. Perfect for the confident and elegant individual.",
        match_profile: {
          luxury: 5,
          sophisticated: 4,
          warm: 3,
          evening: 4,
          winter: 3,
          confident: 4,
          vanilla: 5,
          woody: 3,
        },
        price_range: "luxury",
        best_for: ["evening", "autumn", "winter", "special"],
        personality: ["confident", "sophisticated"],
        image: "layton.png",
      },
      {
        name: "Haltane",
        brand: "Parfums de Marly",
        description:
          "Rich and creamy with notes of praline, vanilla, and oud. A gourmand masterpiece for those who love sweet sophistication.",
        match_profile: {
          luxury: 5,
          gourmand: 5,
          sweet: 5,
          sophisticated: 3,
          oriental: 4,
          winter: 4,
          romantic: 4,
          praline: 5,
        },
        price_range: "luxury",
        best_for: ["evening", "winter", "special"],
        personality: ["romantic", "sophisticated"],
        image: "haltane.png",
      },
      {
        name: "Pegasus",
        brand: "Parfums de Marly",
        description:
          "A fresh and elegant fragrance with almond, heliotrope, and sandalwood. Perfect balance of freshness and warmth.",
        match_profile: {
          luxury: 5,
          fresh: 4,
          elegant: 5,
          versatile: 4,
          balanced: 4,
          spring: 4,
          summer: 3,
          sophisticated: 4,
        },
        price_range: "luxury",
        best_for: ["morning", "spring", "summer", "both"],
        personality: ["sophisticated", "confident"],
        image: "pegasus.png",
      },
      {
        name: "Greenly",
        brand: "Parfums de Marly",
        description:
          "A vibrant green fragrance with fig leaves, petitgrain, and cedarwood. Fresh and natural with sophisticated depth.",
        match_profile: {
          luxury: 5,
          fresh: 5,
          green: 5,
          natural: 4,
          adventurous: 4,
          spring: 5,
          summer: 4,
          energetic: 4,
        },
        price_range: "luxury",
        best_for: ["morning", "spring", "summer", "both"],
        personality: ["adventurous", "sophisticated"],
        image: "GREENLEY.png",
      },
      // Additional Premium Options
      {
        name: "Tom Ford Black Orchid",
        brand: "Tom Ford",
        description:
          "A luxurious and sensual fragrance with dark chocolate, vanilla, and black orchid. Perfect for mysterious personalities.",
        match_profile: {
          luxury: 4,
          mysterious: 5,
          dark: 5,
          evening: 5,
          sophisticated: 4,
          seductive: 5,
          oriental: 4,
        },
        price_range: "luxury",
        best_for: ["evening", "winter", "special"],
        personality: ["mysterious", "confident"],
        image: "black-orchid.png",
      },
      {
        name: "Creed Aventus",
        brand: "Creed",
        description:
          "A bold and confident fragrance with pineapple, birch, and musk. The scent of success and leadership.",
        match_profile: {
          luxury: 5,
          confident: 5,
          bold: 5,
          professional: 4,
          versatile: 4,
          masculine: 4,
          fresh: 3,
        },
        price_range: "luxury",
        best_for: ["morning", "professional", "both"],
        personality: ["confident", "adventurous"],
        image: "aventus.png",
      },
      {
        name: "Maison Margiela Replica Jazz Club",
        brand: "Maison Margiela",
        description:
          "A warm and cozy fragrance evoking the atmosphere of a jazz club with tobacco, vanilla, and pink pepper.",
        match_profile: {
          creative: 5,
          warm: 4,
          relaxed: 4,
          sophisticated: 3,
          evening: 4,
          artistic: 5,
          nostalgic: 4,
        },
        price_range: "premium",
        best_for: ["evening", "autumn", "winter"],
        personality: ["creative", "relaxed"],
        image: "jazz-club.png",
      },
      {
        name: "Dior Sauvage",
        brand: "Dior",
        description:
          "A fresh and spicy fragrance with bergamot, Sichuan pepper, and ambroxan. Modern masculinity redefined.",
        match_profile: {
          designer: 4,
          fresh: 4,
          spicy: 3,
          modern: 4,
          versatile: 5,
          confident: 3,
          accessible: 4,
        },
        price_range: "premium",
        best_for: ["morning", "spring", "summer", "both"],
        personality: ["confident", "adventurous"],
        image: "sauvage.png",
      },
      {
        name: "Chanel Bleu de Chanel",
        brand: "Chanel",
        description:
          "An elegant and refined fragrance with citrus, ginger, and sandalwood. Timeless sophistication.",
        match_profile: {
          luxury: 4,
          sophisticated: 5,
          elegant: 5,
          professional: 4,
          refined: 5,
          versatile: 4,
        },
        price_range: "luxury",
        best_for: ["morning", "professional", "both"],
        personality: ["sophisticated", "confident"],
        image: "bleu-de-chanel.png",
      },
      {
        name: "Viktor & Rolf Flowerbomb",
        brand: "Viktor & Rolf",
        description:
          "A romantic and explosive floral fragrance with jasmine, rose, and patchouli. Feminine power unleashed.",
        match_profile: {
          romantic: 5,
          floral: 5,
          feminine: 5,
          bold: 3,
          sophisticated: 3,
          evening: 4,
          seductive: 4,
        },
        price_range: "premium",
        best_for: ["evening", "spring", "special"],
        personality: ["romantic", "confident"],
        image: "flowerbomb.png",
      },

      // === FEMALE FRAGRANCES ===
      {
        name: "Chanel Coco Mademoiselle",
        brand: "Chanel",
        description:
          "A sparkling and bold ambery fragrance with orange, jasmine, and patchouli. Modern femininity with timeless elegance.",
        match_profile: {
          luxury: 5,
          sophisticated: 5,
          elegant: 4,
          confident: 4,
          feminine: 4,
          oriental: 3,
          versatile: 4,
        },
        price_range: "luxury",
        best_for: ["both", "professional", "special"],
        personality: ["sophisticated", "confident"],
        image: "chanel-coco-mademoiselle.jpg",
      },
      {
        name: "Dior J'adore",
        brand: "Dior",
        description:
          "An opulent bouquet of the most beautiful flowers. Pure luxury and femininity in a bottle.",
        match_profile: {
          luxury: 4,
          romantic: 5,
          floral: 5,
          feminine: 5,
          elegant: 4,
          sophisticated: 3,
          spring: 4,
        },
        price_range: "luxury",
        best_for: ["evening", "spring", "special"],
        personality: ["romantic", "sophisticated"],
        image: "dior-jadore.jpg",
      },
      {
        name: "Marc Jacobs Daisy",
        brand: "Marc Jacobs",
        description:
          "A charming bouquet of daisies with violet leaves, jasmine, and musk. Youthful and carefree spirit.",
        match_profile: {
          accessible: 4,
          fresh: 4,
          floral: 4,
          feminine: 4,
          youthful: 5,
          spring: 5,
          casual: 4,
        },
        price_range: "mid_range",
        best_for: ["morning", "spring", "summer"],
        personality: ["romantic", "relaxed"],
        image: "marc-jacobs-daisy.jpg",
      },
      {
        name: "YSL Black Opium",
        brand: "Yves Saint Laurent",
        description:
          "An addictive gourmand fragrance with coffee, vanilla, and white flowers. Dark and seductive.",
        match_profile: {
          seductive: 5,
          gourmand: 5,
          mysterious: 4,
          evening: 5,
          bold: 4,
          coffee: 5,
          addictive: 5,
        },
        price_range: "premium",
        best_for: ["evening", "autumn", "winter"],
        personality: ["mysterious", "confident"],
        image: "ysl-black-opium.jpg",
      },
      {
        name: "Lancôme La Vie Est Belle",
        brand: "Lancôme",
        description:
          "A sweet gourmand with blackcurrant, jasmine, and vanilla. Happiness in a bottle.",
        match_profile: {
          sweet: 5,
          gourmand: 4,
          optimistic: 5,
          feminine: 4,
          accessible: 4,
          vanilla: 4,
          joyful: 5,
        },
        price_range: "premium",
        best_for: ["both", "spring", "summer"],
        personality: ["romantic", "confident"],
        image: "lancome-la-vie-est-belle.jpg",
      },

      // === AFFORDABLE CLASSICS ===
      {
        name: "Hugo Boss Bottled",
        brand: "Hugo Boss",
        description:
          "A modern masculine fragrance with apple, geranium, and sandalwood. Professional and reliable.",
        match_profile: {
          professional: 5,
          accessible: 4,
          reliable: 5,
          masculine: 4,
          versatile: 4,
          apple: 3,
          woody: 3,
        },
        price_range: "mid_range",
        best_for: ["morning", "professional", "both"],
        personality: ["professional", "confident"],
        image: "hugo-boss-bottled.jpg",
      },
      {
        name: "Davidoff Cool Water",
        brand: "Davidoff",
        description:
          "A fresh aquatic fragrance with mint, lavender, and sandalwood. Clean and invigorating.",
        match_profile: {
          fresh: 5,
          aquatic: 5,
          clean: 5,
          affordable: 4,
          summer: 5,
          energetic: 4,
          mint: 4,
        },
        price_range: "budget",
        best_for: ["morning", "summer", "both"],
        personality: ["active", "relaxed"],
        image: "davidoff-cool-water.jpg",
      },
      {
        name: "Jean Paul Gaultier Le Male",
        brand: "Jean Paul Gaultier",
        description:
          "A seductive blend with mint, lavender, and vanilla. Masculine charm with a playful twist.",
        match_profile: {
          seductive: 4,
          playful: 4,
          masculine: 4,
          crowd_pleaser: 5,
          vanilla: 3,
          mint: 3,
          charming: 5,
        },
        price_range: "mid_range",
        best_for: ["evening", "both", "social"],
        personality: ["confident", "social"],
        image: "jpg-le-male.jpg",
      },
      {
        name: "1 Million by Paco Rabanne",
        brand: "Paco Rabanne",
        description:
          "A golden spicy fragrance with cinnamon, rose, and amber. Confidence and luxury combined.",
        match_profile: {
          bold: 5,
          spicy: 4,
          attention_grabbing: 5,
          golden: 4,
          confident: 5,
          cinnamon: 4,
          amber: 3,
        },
        price_range: "mid_range",
        best_for: ["evening", "autumn", "special"],
        personality: ["confident", "social"],
        image: "paco-rabanne-1-million.jpg",
      },

      // === NICHE & ARTISTIC ===
      {
        name: "Byredo Bal d'Afrique",
        brand: "Byredo",
        description:
          "A vibrant African-inspired fragrance with bergamot, violet, and cedar. Artistic and unique.",
        match_profile: {
          artistic: 5,
          unique: 5,
          niche: 5,
          creative: 5,
          african: 4,
          violet: 3,
          bergamot: 3,
        },
        price_range: "luxury",
        best_for: ["both", "spring", "summer"],
        personality: ["creative", "adventurous"],
        image: "byredo-bal-dafrique.jpg",
      },
      {
        name: "Le Labo Santal 33",
        brand: "Le Labo",
        description:
          "A cult favorite with sandalwood, cardamom, and iris. Minimalist luxury.",
        match_profile: {
          cult: 5,
          niche: 5,
          minimalist: 5,
          sandalwood: 5,
          unisex: 4,
          artistic: 4,
          sophisticated: 4,
        },
        price_range: "luxury",
        best_for: ["both", "professional", "artistic"],
        personality: ["sophisticated", "creative"],
        image: "le-labo-santal-33.jpg",
      },
      {
        name: "Maison Francis Kurkdjian Baccarat Rouge 540",
        brand: "Maison Francis Kurkdjian",
        description:
          "A luminous and radiant fragrance with saffron, jasmine, and amberwood. Pure luxury.",
        match_profile: {
          luxury: 5,
          radiant: 5,
          sophisticated: 5,
          unique: 4,
          saffron: 4,
          amber: 4,
          prestigious: 5,
        },
        price_range: "luxury",
        best_for: ["evening", "special", "luxury"],
        personality: ["sophisticated", "confident"],
        image: "mfk-baccarat-rouge-540.jpg",
      },
      {
        name: "Diptyque Philosykos",
        brand: "Diptyque",
        description:
          "A green and creamy fragrance capturing the essence of a fig tree. Natural artistry.",
        match_profile: {
          green: 5,
          natural: 5,
          artistic: 5,
          fig: 5,
          unique: 4,
          niche: 4,
          creamy: 3,
        },
        price_range: "luxury",
        best_for: ["spring", "summer", "artistic"],
        personality: ["creative", "sophisticated"],
        image: "diptyque-philosykos.jpg",
      },

      // === SEASONAL SPECIALISTS ===
      {
        name: "Hermès Eau des Merveilles",
        brand: "Hermès",
        description:
          "A magical woody fragrance with orange, pink pepper, and cedar. Sophisticated warmth.",
        match_profile: {
          sophisticated: 5,
          warm: 4,
          magical: 4,
          orange: 4,
          woody: 4,
          elegant: 4,
          autumn: 4,
        },
        price_range: "luxury",
        best_for: ["autumn", "winter", "evening"],
        personality: ["sophisticated", "mysterious"],
        image: "hermes-eau-des-merveilles.jpg",
      },
      {
        name: "L'Artisan Parfumeur Thé Pour un Été",
        brand: "L'Artisan Parfumeur",
        description:
          "A refreshing summer tea with bergamot, mint, and white tea. Perfect summer companion.",
        match_profile: {
          fresh: 5,
          summer: 5,
          tea: 5,
          refreshing: 5,
          mint: 4,
          bergamot: 4,
          green: 4,
        },
        price_range: "premium",
        best_for: ["morning", "summer", "fresh"],
        personality: ["relaxed", "sophisticated"],
        image: "lartisan-the-pour-un-ete.jpg",
      },

      // === CROWD PLEASERS ===
      {
        name: "Versace Eros",
        brand: "Versace",
        description:
          "A passionate and seductive fragrance with mint, apple, and vanilla. Irresistible magnetism.",
        match_profile: {
          seductive: 5,
          passionate: 5,
          crowd_pleaser: 5,
          mint: 4,
          apple: 3,
          vanilla: 3,
          magnetic: 5,
        },
        price_range: "mid_range",
        best_for: ["evening", "social", "both"],
        personality: ["confident", "social"],
        image: "versace-eros.jpg",
      },
      {
        name: "Acqua di Gio Profumo",
        brand: "Giorgio Armani",
        description:
          "An aquatic aromatic fragrance with bergamot, geranium, and patchouli. Marine sophistication.",
        match_profile: {
          aquatic: 5,
          sophisticated: 4,
          fresh: 4,
          marine: 5,
          versatile: 4,
          bergamot: 3,
          professional: 4,
        },
        price_range: "premium",
        best_for: ["both", "summer", "professional"],
        personality: ["sophisticated", "confident"],
        image: "adg-profumo.jpg",
      },

      // === UNIQUE PERSONALITIES ===
      {
        name: "Thierry Mugler Angel",
        brand: "Thierry Mugler",
        description:
          "A revolutionary gourmand with praline, honey, and patchouli. Bold and unforgettable.",
        match_profile: {
          revolutionary: 5,
          gourmand: 5,
          bold: 5,
          unique: 5,
          praline: 4,
          honey: 3,
          unforgettable: 5,
        },
        price_range: "premium",
        best_for: ["evening", "winter", "special"],
        personality: ["mysterious", "confident"],
        image: "mugler-angel.jpg",
      },
      {
        name: "Comme des Garçons Incense",
        brand: "Comme des Garçons",
        description:
          "A pure and meditative incense fragrance. Minimalist spirituality.",
        match_profile: {
          meditative: 5,
          spiritual: 5,
          minimalist: 5,
          incense: 5,
          unique: 5,
          artistic: 5,
          zen: 5,
        },
        price_range: "luxury",
        best_for: ["evening", "meditation", "artistic"],
        personality: ["creative", "sophisticated"],
        image: "cdg-incense.jpg",
      },

      // === BUDGET-FRIENDLY GEMS ===
      {
        name: "Zara Red Vanilla",
        brand: "Zara",
        description:
          "An affordable gourmand with vanilla, amber, and spices. Great value for money.",
        match_profile: {
          affordable: 5,
          gourmand: 4,
          vanilla: 5,
          sweet: 4,
          accessible: 5,
          value: 5,
          warm: 3,
        },
        price_range: "budget",
        best_for: ["evening", "autumn", "winter"],
        personality: ["relaxed", "confident"],
        image: "zara-red-vanilla.jpg",
      },
      {
        name: "The Body Shop White Musk",
        brand: "The Body Shop",
        description:
          "A clean and soft musk fragrance with lily and rose. Pure and gentle.",
        match_profile: {
          clean: 5,
          soft: 5,
          musk: 5,
          gentle: 5,
          affordable: 5,
          lily: 3,
          pure: 5,
        },
        price_range: "budget",
        best_for: ["both", "daily", "fresh"],
        personality: ["relaxed", "romantic"],
        image: "body-shop-white-musk.jpg",
      },

      // === ADDITIONAL LUXURY OPTIONS ===
      {
        name: "Creed Silver Mountain Water",
        brand: "Creed",
        description:
          "A fresh and clean fragrance with citrus and metallic notes. Mountain freshness.",
        match_profile: {
          fresh: 5,
          clean: 5,
          luxury: 5,
          citrus: 4,
          metallic: 3,
          mountain: 4,
          crisp: 5,
        },
        price_range: "luxury",
        best_for: ["morning", "summer", "fresh"],
        personality: ["confident", "adventurous"],
        image: "creed-silver-mountain-water.jpg",
      },
      {
        name: "Tom Ford Oud Wood",
        brand: "Tom Ford",
        description:
          "A smooth and sophisticated oud fragrance with rosewood, cardamom, and sandalwood.",
        match_profile: {
          sophisticated: 5,
          luxury: 5,
          oud: 5,
          smooth: 4,
          exotic: 4,
          rosewood: 3,
          cardamom: 3,
        },
        price_range: "luxury",
        best_for: ["evening", "winter", "special"],
        personality: ["sophisticated", "mysterious"],
        image: "tom-ford-oud-wood.jpg",
      },

      // === MORE FEMALE OPTIONS ===
      {
        name: "Guerlain Shalimar",
        brand: "Guerlain",
        description:
          "A legendary oriental with bergamot, iris, and vanilla. Timeless feminine elegance.",
        match_profile: {
          legendary: 5,
          oriental: 5,
          timeless: 5,
          sophisticated: 5,
          vanilla: 4,
          bergamot: 3,
          iris: 3,
        },
        price_range: "luxury",
        best_for: ["evening", "winter", "special"],
        personality: ["sophisticated", "romantic"],
        image: "guerlain-shalimar.jpg",
      },
      {
        name: "Calvin Klein Euphoria",
        brand: "Calvin Klein",
        description:
          "A hypnotic blend with pomegranate, orchid, and amber. Seductive femininity.",
        match_profile: {
          seductive: 5,
          hypnotic: 4,
          feminine: 4,
          pomegranate: 3,
          orchid: 3,
          amber: 3,
          accessible: 4,
        },
        price_range: "mid_range",
        best_for: ["evening", "autumn", "winter"],
        personality: ["mysterious", "romantic"],
        image: "calvin-klein-euphoria.jpg",
      },

      // === SPORTS & FRESH ===
      {
        name: "Lacoste Eau de Lacoste L.12.12 Blanc",
        brand: "Lacoste",
        description:
          "A clean sporty fragrance with grapefruit, cardamom, and cedar. Athletic freshness.",
        match_profile: {
          sporty: 5,
          clean: 5,
          fresh: 4,
          athletic: 5,
          grapefruit: 4,
          accessible: 4,
          energetic: 4,
        },
        price_range: "mid_range",
        best_for: ["morning", "summer", "sports"],
        personality: ["active", "confident"],
        image: "lacoste-blanc.jpg",
      },
      {
        name: "Azzaro Chrome",
        brand: "Azzaro",
        description:
          "A fresh aquatic citrus with bergamot, cyclamen, and musk. Mediterranean freshness.",
        match_profile: {
          fresh: 5,
          aquatic: 4,
          citrus: 4,
          mediterranean: 4,
          bergamot: 3,
          accessible: 4,
          clean: 4,
        },
        price_range: "mid_range",
        best_for: ["morning", "summer", "fresh"],
        personality: ["active", "relaxed"],
        image: "azzaro-chrome.jpg",
      },

      // === WINTER WARMERS ===
      {
        name: "Viktor & Rolf Spicebomb",
        brand: "Viktor & Rolf",
        description:
          "An explosive spicy fragrance with pink pepper, saffron, and tobacco. Masculine intensity.",
        match_profile: {
          spicy: 5,
          explosive: 5,
          masculine: 5,
          intense: 5,
          tobacco: 4,
          saffron: 4,
          winter: 5,
        },
        price_range: "premium",
        best_for: ["evening", "winter", "autumn"],
        personality: ["confident", "mysterious"],
        image: "vr-spicebomb.jpg",
      },
      {
        name: "Maison Margiela REPLICA By the Fireplace",
        brand: "Maison Margiela",
        description:
          "A cozy winter fragrance with chestnut, smoke, and woody notes. Warm memories.",
        match_profile: {
          cozy: 5,
          winter: 5,
          warm: 5,
          nostalgic: 5,
          smoke: 4,
          chestnuts: 3,
          comfort: 5,
        },
        price_range: "premium",
        best_for: ["winter", "evening", "cozy"],
        personality: ["relaxed", "romantic"],
        image: "mm-by-the-fireplace.jpg",
      },

      // === CELEBRITY & MAINSTREAM ===
      {
        name: "Ariana Grande Cloud",
        brand: "Ariana Grande",
        description:
          "A dreamy gourmand with bergamot, pear, and coconut. Youthful sweetness.",
        match_profile: {
          dreamy: 5,
          gourmand: 4,
          youthful: 5,
          sweet: 5,
          coconut: 4,
          affordable: 4,
          playful: 4,
        },
        price_range: "budget",
        best_for: ["both", "young", "sweet"],
        personality: ["romantic", "relaxed"],
        image: "ariana-grande-cloud.jpg",
      },
      {
        name: "Britney Spears Fantasy",
        brand: "Britney Spears",
        description:
          "A sweet fantasy with lychee, golden quince, and musk. Affordable sweetness.",
        match_profile: {
          sweet: 5,
          fantasy: 4,
          affordable: 5,
          fruity: 4,
          youthful: 4,
          accessible: 5,
          playful: 4,
        },
        price_range: "budget",
        best_for: ["both", "young", "casual"],
        personality: ["romantic", "relaxed"],
        image: "britney-spears-fantasy.jpg",
      },

      // === FINAL ADDITIONS ===
      {
        name: "Hermès Terre d'Hermès",
        brand: "Hermès",
        description:
          "An earthy woody fragrance with orange, flint, and vetiver. Masculine sophistication.",
        match_profile: {
          sophisticated: 5,
          earthy: 5,
          masculine: 4,
          woody: 5,
          orange: 3,
          vetiver: 4,
          luxury: 4,
        },
        price_range: "luxury",
        best_for: ["both", "autumn", "professional"],
        personality: ["sophisticated", "confident"],
        image: "hermes-terre.jpg",
      },
      {
        name: "Prada Luna Rossa Carbon",
        brand: "Prada",
        description:
          "A modern masculine fragrance with bergamot, pepper, and ambroxan. Futuristic masculinity.",
        match_profile: {
          modern: 5,
          masculine: 5,
          futuristic: 4,
          bergamot: 3,
          pepper: 3,
          fresh: 3,
          sophisticated: 4,
        },
        price_range: "premium",
        best_for: ["both", "professional", "modern"],
        personality: ["confident", "professional"],
        image: "prada-carbon.jpg",
      },
    ];

    this.init();
  }

  init() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Set up the start button with retry logic
    const setupButtonListener = (attempt = 1) => {
      const aiStartBtn = document.getElementById("aiStartBtn");

      if (aiStartBtn) {
        // Remove any existing listeners first
        const newButton = aiStartBtn.cloneNode(true);
        aiStartBtn.parentNode.replaceChild(newButton, aiStartBtn);

        // Add click event listener
        newButton.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          window.startAIAnalysis();
        });

        // Add visual feedback
        newButton.addEventListener("mouseenter", () => {
          newButton.style.transform = "scale(1.05)";
        });

        newButton.addEventListener("mouseleave", () => {
          newButton.style.transform = "scale(1)";
        });

        return true;
      } else if (attempt < 5) {
        setTimeout(() => setupButtonListener(attempt + 1), attempt * 500);
        return false;
      }
    };

    // Set up navigation buttons
    const aiNextBtn = document.getElementById("aiNextBtn");
    const aiBackBtn = document.getElementById("aiBackBtn");
    const aiRetakeQuiz = document.getElementById("aiRetakeQuiz");
    const aiViewFragrance = document.getElementById("aiViewFragrance");

    if (aiNextBtn) {
      aiNextBtn.addEventListener("click", () => this.nextQuestion());
    }

    if (aiBackBtn) {
      aiBackBtn.addEventListener("click", () => this.previousQuestion());
    }

    if (aiRetakeQuiz) {
      aiRetakeQuiz.addEventListener("click", () => this.resetQuestionnaire());
    }

    if (aiViewFragrance) {
      aiViewFragrance.addEventListener("click", () =>
        this.viewRecommendedFragrance(),
      );
    }

    // Initialize button listeners
    setupButtonListener();
    setTimeout(() => setupButtonListener(), 500);

    // Add click listener to the AI finder icon to ensure dropdown visibility
    const aiFinderIcon = document.getElementById("aiFinderIcon");
    if (aiFinderIcon) {
      let dropdownVisible = false;

      aiFinderIcon.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        const dropdown = document.getElementById("aiFinderDropdown");
        if (dropdown) {
          dropdownVisible = !dropdownVisible;

          if (dropdownVisible) {
            dropdown.classList.add("show");
            dropdown.style.opacity = "1";
            dropdown.style.visibility = "visible";
            dropdown.style.transform = "translateY(0) scale(1)";
          } else {
            // Hide the dropdown
            dropdown.classList.remove("show");
            dropdown.style.opacity = "0";
            dropdown.style.visibility = "hidden";
            dropdown.style.transform = "translateY(-10px) scale(0.95)";
          }
        }
      });

      // Also add mouse events for hover functionality
      const aiFinderContainer = document.getElementById("aiFragranceFinder");
      if (aiFinderContainer) {
        aiFinderContainer.addEventListener("mouseenter", () => {
          if (!dropdownVisible) {
            const dropdown = document.getElementById("aiFinderDropdown");
            if (dropdown) {
              dropdown.style.opacity = "1";
              dropdown.style.visibility = "visible";
              dropdown.style.transform = "translateY(0) scale(1)";
            }
          }
        });

        aiFinderContainer.addEventListener("mouseleave", () => {
          if (!dropdownVisible) {
            const dropdown = document.getElementById("aiFinderDropdown");
            if (dropdown) {
              setTimeout(() => {
                if (!dropdownVisible) {
                  dropdown.style.opacity = "0";
                  dropdown.style.visibility = "hidden";
                  dropdown.style.transform = "translateY(-10px) scale(0.95)";
                }
              }, 300);
            }
          }
        });
      }
    }

    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
      const aiFinderContainer = document.getElementById("aiFragranceFinder");
      if (aiFinderContainer && !aiFinderContainer.contains(e.target)) {
        const dropdown = document.getElementById("aiFinderDropdown");
        if (dropdown) {
          dropdown.classList.remove("show");
          dropdown.style.opacity = "0";
          dropdown.style.visibility = "hidden";
          dropdown.style.transform = "translateY(-10px) scale(0.95)";
        }
      }
    });
  }

  startQuestionnaire() {
    try {
      this.showState("question");
      this.currentQuestion = 0;
      this.answers = {};
      this.displayQuestion();
    } catch (error) {
      console.error("Error starting questionnaire:", error);

      // Fallback: try to at least show an alert
      alert("Scent Profiler is starting...");
    }
  }

  displayQuestion() {
    const question = this.questions[this.currentQuestion];
    const progressFill = document.getElementById("aiProgressFill");
    const progressText = document.getElementById("aiProgressText");
    const questionTitle = document.getElementById("aiQuestionTitle");
    const questionOptions = document.getElementById("aiQuestionOptions");
    const backBtn = document.getElementById("aiBackBtn");
    const nextBtn = document.getElementById("aiNextBtn");

    // Update progress
    const progress = ((this.currentQuestion + 1) / this.questions.length) * 100;
    if (progressFill) progressFill.style.width = `${progress}%`;
    if (progressText)
      progressText.textContent = `Question ${this.currentQuestion + 1} of ${this.questions.length}`;

    // Update question
    if (questionTitle) questionTitle.textContent = question.title;

    // Clear and populate options
    if (questionOptions) {
      questionOptions.innerHTML = "";

      question.options.forEach((option, index) => {
        const optionEl = document.createElement("div");
        optionEl.className = "ai-option";
        optionEl.textContent = option.text;
        optionEl.dataset.value = option.value;

        // Handle selection
        optionEl.addEventListener("click", () => {
          if (question.type === "single") {
            // Single selection - clear others
            questionOptions
              .querySelectorAll(".ai-option")
              .forEach((el) => el.classList.remove("selected"));
            optionEl.classList.add("selected");
            this.answers[question.id] = [option.value];
          } else {
            // Multiple selection
            optionEl.classList.toggle("selected");
            if (!this.answers[question.id]) this.answers[question.id] = [];

            const answerIndex = this.answers[question.id].indexOf(option.value);
            if (answerIndex > -1) {
              this.answers[question.id].splice(answerIndex, 1);
            } else {
              this.answers[question.id].push(option.value);
            }
          }

          this.updateNavigationButtons();
        });

        questionOptions.appendChild(optionEl);
      });
    }

    // Update navigation buttons
    if (backBtn) {
      backBtn.style.display = this.currentQuestion > 0 ? "inline-flex" : "none";
    }

    this.updateNavigationButtons();
  }

  updateNavigationButtons() {
    const nextBtn = document.getElementById("aiNextBtn");
    const question = this.questions[this.currentQuestion];
    const hasAnswer =
      this.answers[question.id] && this.answers[question.id].length > 0;

    if (nextBtn) {
      nextBtn.disabled = !hasAnswer;
      nextBtn.textContent =
        this.currentQuestion === this.questions.length - 1
          ? "Get Results"
          : "Next";
    }
  }

  nextQuestion() {
    if (this.currentQuestion < this.questions.length - 1) {
      this.currentQuestion++;
      this.displayQuestion();
    } else {
      this.analyzeAnswers();
    }
  }

  previousQuestion() {
    if (this.currentQuestion > 0) {
      this.currentQuestion--;
      this.displayQuestion();
    }
  }

  analyzeAnswers() {
    this.showState("loading");

    // Simulate AI processing time
    setTimeout(() => {
      const recommendation = this.calculateRecommendation();
      this.displayResults(recommendation);
    }, 2500);
  }

  calculateRecommendation() {
    const userProfile = {};
    const preferences = {
      timeOfDay: this.answers["time_preference"] || [],
      season: this.answers["season_preference"] || [],
      personality: this.answers["personality_type"] || [],
      intensity: this.answers["scent_intensity"] || [],
      families: this.answers["scent_families"] || [],
      lifestyle: this.answers["lifestyle"] || [],
      budget: this.answers["budget_range"] || [],
      inspiration: this.answers["inspiration"] || [],
    };

    // Calculate user preference weights
    this.questions.forEach((question) => {
      const userAnswers = this.answers[question.id] || [];

      userAnswers.forEach((answerValue) => {
        const option = question.options.find(
          (opt) => opt.value === answerValue,
        );
        if (option && option.weight) {
          Object.keys(option.weight).forEach((trait) => {
            userProfile[trait] =
              (userProfile[trait] || 0) + option.weight[trait];
          });
        }
      });
    });

    // Enhanced scoring algorithm
    const fragranceScores = this.fragranceDatabase.map((fragrance) => {
      let totalScore = 0;
      let matchingFactors = 0;
      const scoreBreakdown = {};

      // 1. Profile matching (40% weight)
      let profileScore = 0;
      let profileMatches = 0;
      Object.keys(fragrance.match_profile).forEach((trait) => {
        if (userProfile[trait]) {
          const score = fragrance.match_profile[trait] * userProfile[trait];
          profileScore += score;
          profileMatches++;
          scoreBreakdown[`profile_${trait}`] = score;
        }
      });
      if (profileMatches > 0) {
        profileScore = (profileScore / profileMatches) * 0.4;
        totalScore += profileScore;
        matchingFactors++;
      }

      // 2. Personality matching (25% weight)
      let personalityScore = 0;
      if (preferences.personality.length > 0 && fragrance.personality) {
        const matches = preferences.personality.filter((p) =>
          fragrance.personality.includes(p),
        ).length;
        personalityScore = (matches / preferences.personality.length) * 25;
        totalScore += personalityScore;
        matchingFactors++;
        scoreBreakdown.personality = personalityScore;
      }

      // 3. Time/Season matching (20% weight)
      let timeSeasonScore = 0;
      const timeMatches = preferences.timeOfDay.filter(
        (t) => fragrance.best_for && fragrance.best_for.includes(t),
      ).length;
      const seasonMatches = preferences.season.filter(
        (s) => fragrance.best_for && fragrance.best_for.includes(s),
      ).length;
      if (timeMatches > 0 || seasonMatches > 0) {
        timeSeasonScore =
          ((timeMatches + seasonMatches) /
            (preferences.timeOfDay.length + preferences.season.length)) *
          20;
        totalScore += timeSeasonScore;
        matchingFactors++;
        scoreBreakdown.timeSeason = timeSeasonScore;
      }

      // 4. Budget compatibility (10% weight)
      let budgetScore = 0;
      if (preferences.budget.length > 0) {
        const budgetMatch = preferences.budget.includes(fragrance.price_range);
        budgetScore = budgetMatch ? 10 : 5; // Partial score if budget doesn't match exactly
        totalScore += budgetScore;
        matchingFactors++;
        scoreBreakdown.budget = budgetScore;
      }

      // 5. Scent family preferences (5% weight)
      let familyScore = 0;
      if (preferences.families.length > 0) {
        // Check if any of the user's preferred families align with fragrance characteristics
        const familyAlignment = preferences.families.some((family) => {
          return Object.keys(fragrance.match_profile).some(
            (trait) =>
              trait.toLowerCase().includes(family) ||
              family.includes(trait.toLowerCase()),
          );
        });
        familyScore = familyAlignment ? 5 : 0;
        totalScore += familyScore;
        matchingFactors++;
        scoreBreakdown.family = familyScore;
      }

      // Add some randomization for variety (but keep it minimal)
      const randomVariance = (Math.random() - 0.5) * 5; // ±2.5% variance
      totalScore += randomVariance;

      // Normalize the score
      const normalizedScore =
        matchingFactors > 0 ? totalScore / matchingFactors : 0;

      return {
        fragrance,
        score: normalizedScore,
        breakdown: scoreBreakdown,
        matchingFactors,
      };
    });

    // Sort by score and get the best match
    fragranceScores.sort((a, b) => b.score - a.score);
    const bestMatch = fragranceScores[0];

    // Calculate a more realistic match percentage
    const rawPercentage = Math.min(Math.max(bestMatch.score * 2.5, 0), 100);
    const matchPercentage = Math.round(
      Math.max(rawPercentage, 70) * (0.85 + Math.random() * 0.13),
    );

    // Determine personality type
    const personalityType = this.determinePersonalityType();

    const recommendation = {
      fragrance: bestMatch.fragrance,
      matchPercentage: Math.min(matchPercentage, 98),
      personalityType,
      userProfile,
      scoreBreakdown: bestMatch.breakdown,
      alternativeOptions: fragranceScores.slice(1, 4).map((item) => ({
        fragrance: item.fragrance,
        score: Math.round(item.score),
      })),
    };

    return recommendation;
  }

  determinePersonalityType() {
    const personalityAnswers = this.answers["personality_type"] || [];
    const lifestyleAnswers = this.answers["lifestyle"] || [];

    const personalityMap = {
      confident: "Bold & Confident",
      romantic: "Romantic & Dreamy",
      sophisticated: "Sophisticated & Elegant",
      adventurous: "Adventurous & Dynamic",
      mysterious: "Mysterious & Intriguing",
      professional: "Professional & Polished",
      creative: "Creative & Artistic",
      social: "Social & Charming",
      active: "Active & Energetic",
      relaxed: "Relaxed & Easy-going",
    };

    const primaryTrait =
      personalityAnswers[0] || lifestyleAnswers[0] || "sophisticated";
    return personalityMap[primaryTrait] || "Sophisticated & Elegant";
  }

  displayResults(recommendation) {
    this.showState("results");

    const personalityType = document.getElementById("aiPersonalityType");
    const recommendedFragrance = document.getElementById(
      "aiRecommendedFragrance",
    );
    const viewFragranceBtn = document.getElementById("aiViewFragrance");

    if (personalityType) {
      personalityType.textContent = recommendation.personalityType;
    }

    if (recommendedFragrance) {
      recommendedFragrance.innerHTML = `
                <div class="ai-fragrance-name">${recommendation.fragrance.name}</div>
                <div class="ai-fragrance-brand">by ${recommendation.fragrance.brand}</div>
                <div class="ai-fragrance-description">${recommendation.fragrance.description}</div>
                <div class="ai-match-percentage">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    ${recommendation.matchPercentage}% Match
                </div>
                ${
                  recommendation.alternativeOptions
                    ? `
                    <div class="ai-alternatives">
                        <h5>Alternative Recommendations:</h5>
                        <div class="ai-alt-list">
                            ${recommendation.alternativeOptions
                              .map(
                                (alt) => `
                                <div class="ai-alt-item">
                                    <span class="alt-name">${alt.fragrance.name}</span>
                                    <span class="alt-brand">by ${alt.fragrance.brand}</span>
                                </div>
                            `,
                              )
                              .join("")}
                        </div>
                    </div>
                `
                    : ""
                }
            `;
    }

    if (viewFragranceBtn) {
      viewFragranceBtn.dataset.fragrance =
        recommendation.fragrance.name.toLowerCase();
    }

    // Store recommendation for later use
    this.lastRecommendation = recommendation;
  }

  viewRecommendedFragrance() {
    if (this.lastRecommendation) {
      const fragrance = this.lastRecommendation.fragrance;

      // Scroll to the fragrance section if it exists
      const fragranceSection =
        document.querySelector(
          `[data-fragrance="${fragrance.name.toLowerCase()}"]`,
        ) ||
        document.querySelector(`.${fragrance.name.toLowerCase()}-section`) ||
        document.querySelector(`.content`);

      if (fragranceSection) {
        fragranceSection.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        // Add highlight effect
        fragranceSection.style.transition = "all 0.5s ease";
        fragranceSection.style.boxShadow = "0 0 30px rgba(212, 175, 55, 0.3)";
        fragranceSection.style.transform = "scale(1.02)";

        setTimeout(() => {
          fragranceSection.style.boxShadow = "";
          fragranceSection.style.transform = "";
        }, 2000);
      }

      // Hide the AI finder dropdown
      this.closeDropdown();
    }
  }

  resetQuestionnaire() {
    this.currentQuestion = 0;
    this.answers = {};
    this.lastRecommendation = null;
    this.showState("welcome");
  }

  showState(state) {
    const states = ["welcome", "question", "loading", "results"];

    states.forEach((s) => {
      const elementId = `aiFinder${s.charAt(0).toUpperCase() + s.slice(1)}`;
      const element = document.getElementById(elementId);
      if (element) {
        element.style.display = s === state ? "block" : "none";
      }
    });
  }

  closeDropdown() {
    const dropdown = document.getElementById("aiFinderDropdown");
    if (dropdown) {
      dropdown.style.opacity = "0";
      dropdown.style.visibility = "hidden";
      dropdown.style.transform = "translateY(-10px) scale(0.95)";
    }
  }
}

// Initialize Scent Profiler when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  try {
    if (typeof window.aiFragranceFinder === "undefined") {
      window.aiFragranceFinder = new AIFragranceFinder();
    }
  } catch (error) {
    console.error("Error creating AIFragranceFinder:", error);
  }

  // Global function to start the analysis
  window.startAIAnalysis = function () {
    if (
      window.aiFragranceFinder &&
      typeof window.aiFragranceFinder.startQuestionnaire === "function"
    ) {
      window.aiFragranceFinder.startQuestionnaire();
    } else {
      // Try to create a new instance
      try {
        window.aiFragranceFinder = new AIFragranceFinder();
        window.aiFragranceFinder.startQuestionnaire();
      } catch (error) {
        console.error("Error initializing Scent Profiler:", error);
        alert("Scent Profiler could not be initialized. Please refresh the page.");
      }
    }
  };

  // Ensure button is clickable
  setTimeout(() => {
    const btn = document.getElementById("aiStartBtn");
    if (btn) {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.startAIAnalysis();
      });
    }
  }, 500);
});

// Export for use in other scripts
window.AIFragranceFinder = AIFragranceFinder;
