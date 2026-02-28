const fs = require('fs');

// =========================================================================
// 10 NEW PERFUMES TO ADD
// Each has: id, brand, location, name, image, quality types, prices,
//           colors, scent notes, performance stats, description, reddit review,
//           mood/season, ratings data, visualization type
// =========================================================================

const newPerfumes = [
    {
        id: 'yvsl',
        sectionClass: 'yvsl-section',
        cssClass: 'yvsl',
        brand: 'YVES SAINT LAURENT',
        location: 'PARIS',
        name: 'Y Eau de Parfum',
        image: 'ysl-y-edp.png',
        qualityTypes: ['edp', 'parfum'],
        qualityLabels: ['Eau de Parfum', 'Intense'],
        qualityDescs: ['Fresh aromatic blend', 'Deeper concentration'],
        prices: [50, 65],
        colors: { dark: '#1a1a2e', heading: '#16213e', accent: '#0f3460', light: '#533483', muted: '#2c3e6e', secondary: '#4a5a8a', rgb_accent: '15, 52, 96', rgb_light: '83, 52, 131' },
        profileSubtitle: 'Bold • Fresh • Modern',
        scentAxes: ['Aromatic', 'Woody', 'Amber', 'Fresh', 'Spicy'],
        scentValues: [90, 82, 70, 88, 65],
        radarPoints: '150,36 254,112 210,228 90,228 46,112',
        radarDotsX: [150, 254, 210, 90, 46],
        radarDotsY: [36, 112, 228, 228, 112],
        longevity: '8-10 hours', longevityPct: 82, projection: 'Strong', projectionPct: 85, versatility: 'Very High', versatilityPct: 88,
        topNotes: [{emoji:'🍎', name:'Apple', intensity:'Crisp'}, {emoji:'🌿', name:'Sage', intensity:'Fresh'}],
        heartNotes: [{emoji:'🌸', name:'Geranium', intensity:'Floral'}, {emoji:'🪻', name:'Lavender', intensity:'Aromatic'}],
        baseNotes: [{emoji:'🪵', name:'Cedarwood', intensity:'Warm'}, {emoji:'🫧', name:'Ambergris', intensity:'Deep'}],
        descTitle: 'Fresh Aromatic', descYear: '2017',
        descTexts: [
            'Y Eau de Parfum opens with a bold burst of crisp <strong>apple</strong> and aromatic <strong>sage</strong>, creating a fresh and invigorating first impression. The sharpness is perfectly balanced, modern and confident.',
            'The heart reveals elegant <strong>geranium</strong> and calming <strong>lavender</strong>, while the base settles into warm <strong>cedarwood</strong> and sensual <strong>ambergris</strong>. A versatile signature scent that works from boardroom to evening.'
        ],
        longevityBars: [{l:'very weak',w:5,c:1},{l:'weak',w:8,c:2},{l:'moderate',w:20,c:3},{l:'long lasting',w:40,c:4},{l:'eternal',w:27,c:5}],
        sillageBars: [{l:'intimate',w:8,c:1},{l:'moderate',w:22,c:2},{l:'strong',w:42,c:3},{l:'enormous',w:28,c:4}],
        genderBars: [{l:'female',w:5,c:1},{l:'more female',w:8,c:2},{l:'unisex',w:22,c:3},{l:'more male',w:40,c:4},{l:'male',w:25,c:5}],
        priceBars: [{l:'way overpriced',w:5,c:1},{l:'overpriced',w:12,c:2},{l:'ok',w:30,c:3},{l:'good value',w:35,c:4},{l:'great value',w:18,c:5}],
        redditUser: 'u/fresh_scent_king', redditTime: '2 weeks ago', redditVotes: '1.8k', redditComments: '423',
        redditReview: '"Y EDP is the ultimate daily driver. Fresh enough for the office, powerful enough for a night out. The apple-sage opening is addictive, and the dry down is chef\'s kiss. Easily gets 8+ hours on my skin. If you want one fragrance to cover all occasions, this is it."',
        moods: [{e:'😍',l:'love',a:true},{e:'😊',l:'like',a:false},{e:'😐',l:'ok',a:false},{e:'😞',l:'dislike',a:false},{e:'😤',l:'hate',a:false}],
        seasons: [{e:'❄️',l:'winter',a:false},{e:'🌸',l:'spring',a:true},{e:'☀️',l:'summer',a:false},{e:'🍂',l:'fall',a:true},{e:'☀️',l:'day',a:true},{e:'🌙',l:'night',a:true}],
        score: '4.25', votes: '8,900',
        perfumeDesc: '<strong>Y Eau de Parfum</strong> by <strong>Yves Saint Laurent</strong> is an Aromatic Fougere fragrance. <strong>Y EDP</strong> was launched in 2018. The nose behind this fragrance is Dominique Ropion.'
    },
    {
        id: 'aquadigio',
        sectionClass: 'aquadigio-section',
        cssClass: 'aquadigio',
        brand: 'GIORGIO ARMANI',
        location: 'MILANO',
        name: 'Acqua di Giò Profumo',
        image: 'acqua-di-gio-profumo.png',
        qualityTypes: ['edp', 'parfum'],
        qualityLabels: ['Eau de Parfum', 'Parfum'],
        qualityDescs: ['Ocean-inspired blend', 'Richest concentration'],
        prices: [55, 70],
        colors: { dark: '#1a3a4a', heading: '#0d4f6e', accent: '#2980b9', light: '#5dade2', muted: '#3d7ea6', secondary: '#6ba3c7', rgb_accent: '41, 128, 185', rgb_light: '93, 173, 226' },
        profileSubtitle: 'Aquatic • Fresh • Woody',
        scentAxes: ['Aquatic', 'Citrus', 'Woody', 'Aromatic', 'Amber'],
        scentValues: [95, 88, 75, 70, 65],
        radarPoints: '150,33 258,105 216,232 84,232 42,105',
        radarDotsX: [150, 258, 216, 84, 42],
        radarDotsY: [33, 105, 232, 232, 105],
        longevity: '8-10 hours', longevityPct: 80, projection: 'Moderate-Strong', projectionPct: 75, versatility: 'Very High', versatilityPct: 90,
        topNotes: [{emoji:'🍋', name:'Bergamot', intensity:'Bright'}, {emoji:'🌊', name:'Sea Notes', intensity:'Fresh'}],
        heartNotes: [{emoji:'🌿', name:'Rosemary', intensity:'Aromatic'}, {emoji:'🌺', name:'Geranium', intensity:'Floral'}],
        baseNotes: [{emoji:'🪨', name:'Patchouli', intensity:'Earthy'}, {emoji:'🌲', name:'Incense', intensity:'Smoky'}],
        descTitle: 'Aquatic Aromatic', descYear: '2015',
        descTexts: [
            'Acqua di Giò Profumo opens with a refreshing wave of <strong>bergamot</strong> and sparkling <strong>sea notes</strong>, instantly evoking the warmth of the Mediterranean coast. The opening is both familiar and elevated.',
            'The heart blends aromatic <strong>rosemary</strong> with soft <strong>geranium</strong>, while the base anchors with earthy <strong>patchouli</strong> and mystical <strong>incense</strong>. A modern aquatic masterpiece that transcends the original.'
        ],
        longevityBars: [{l:'very weak',w:3,c:1},{l:'weak',w:10,c:2},{l:'moderate',w:25,c:3},{l:'long lasting',w:40,c:4},{l:'eternal',w:22,c:5}],
        sillageBars: [{l:'intimate',w:10,c:1},{l:'moderate',w:30,c:2},{l:'strong',w:38,c:3},{l:'enormous',w:22,c:4}],
        genderBars: [{l:'female',w:3,c:1},{l:'more female',w:5,c:2},{l:'unisex',w:20,c:3},{l:'more male',w:42,c:4},{l:'male',w:30,c:5}],
        priceBars: [{l:'way overpriced',w:5,c:1},{l:'overpriced',w:15,c:2},{l:'ok',w:28,c:3},{l:'good value',w:35,c:4},{l:'great value',w:17,c:5}],
        redditUser: 'u/aquatic_nose', redditTime: '1 month ago', redditVotes: '3.1k', redditComments: '678',
        redditReview: '"Acqua di Giò Profumo is what happens when you take a legendary scent and make it grow up. The original AdG was my teen fragrance, but Profumo? That\'s a MAN\'s fragrance. Refined, deeper, longer lasting. The incense in the drydown is magnificent. 10/10 would recommend."',
        moods: [{e:'😍',l:'love',a:true},{e:'😊',l:'like',a:false},{e:'😐',l:'ok',a:false},{e:'😞',l:'dislike',a:false},{e:'😤',l:'hate',a:false}],
        seasons: [{e:'❄️',l:'winter',a:false},{e:'🌸',l:'spring',a:true},{e:'☀️',l:'summer',a:true},{e:'🍂',l:'fall',a:false},{e:'☀️',l:'day',a:true},{e:'🌙',l:'night',a:false}],
        score: '4.48', votes: '15,200',
        perfumeDesc: '<strong>Acqua di Giò Profumo</strong> by <strong>Giorgio Armani</strong> is a Aquatic Aromatic fragrance. <strong>Acqua di Giò Profumo</strong> was launched in 2015. The nose behind this fragrance is Alberto Morillas.'
    },
    {
        id: 'dy',
        sectionClass: 'dy-section',
        cssClass: 'dy',
        brand: 'DOLCE & GABBANA',
        location: 'NAPOLI',
        name: 'The One EDP',
        image: 'dg-the-one-edp.png',
        qualityTypes: ['edp', 'parfum'],
        qualityLabels: ['Eau de Parfum', 'Parfum'],
        qualityDescs: ['Classic warm blend', 'Superior concentration'],
        prices: [50, 65],
        colors: { dark: '#3d2b1f', heading: '#5c3a21', accent: '#b8860b', light: '#d4a843', muted: '#8B6914', secondary: '#c49a3c', rgb_accent: '184, 134, 11', rgb_light: '212, 168, 67' },
        profileSubtitle: 'Warm • Spicy • Tobacco',
        scentAxes: ['Tobacco', 'Amber', 'Spicy', 'Woody', 'Sweet'],
        scentValues: [88, 92, 80, 75, 85],
        radarPoints: '150,38 250,115 205,225 95,225 50,115',
        radarDotsX: [150, 250, 205, 95, 50],
        radarDotsY: [38, 115, 225, 225, 115],
        longevity: '8-10 hours', longevityPct: 85, projection: 'Moderate', projectionPct: 68, versatility: 'Moderate-High', versatilityPct: 72,
        topNotes: [{emoji:'🍊', name:'Grapefruit', intensity:'Zesty'}, {emoji:'🫚', name:'Ginger', intensity:'Spicy'}],
        heartNotes: [{emoji:'🪻', name:'Cardamom', intensity:'Warm'}, {emoji:'🌸', name:'Orange Blossom', intensity:'Sweet'}],
        baseNotes: [{emoji:'🍯', name:'Amber', intensity:'Rich'}, {emoji:'🪵', name:'Cedarwood', intensity:'Smooth'}],
        descTitle: 'Amber Spicy', descYear: '2008',
        descTexts: [
            'The One EDP opens with an invigorating burst of <strong>grapefruit</strong> and fiery <strong>ginger</strong>, creating a warm and immediately appealing first impression. The citrus-spice balance is perfectly calibrated.',
            'The heart unfolds with exotic <strong>cardamom</strong> and intoxicating <strong>orange blossom</strong>, while the base reveals rich <strong>amber</strong> and smooth <strong>cedarwood</strong>. A refined gentleman\'s fragrance that embodies Italian sophistication.'
        ],
        longevityBars: [{l:'very weak',w:4,c:1},{l:'weak',w:10,c:2},{l:'moderate',w:22,c:3},{l:'long lasting',w:38,c:4},{l:'eternal',w:26,c:5}],
        sillageBars: [{l:'intimate',w:12,c:1},{l:'moderate',w:35,c:2},{l:'strong',w:35,c:3},{l:'enormous',w:18,c:4}],
        genderBars: [{l:'female',w:2,c:1},{l:'more female',w:5,c:2},{l:'unisex',w:18,c:3},{l:'more male',w:42,c:4},{l:'male',w:33,c:5}],
        priceBars: [{l:'way overpriced',w:3,c:1},{l:'overpriced',w:10,c:2},{l:'ok',w:25,c:3},{l:'good value',w:40,c:4},{l:'great value',w:22,c:5}],
        redditUser: 'u/italian_scent_lover', redditTime: '3 weeks ago', redditVotes: '2.2k', redditComments: '512',
        redditReview: '"D&G The One is THE quintessential date night fragrance. Warm, inviting, and incredibly sexy without being overpowering. Every time I wear this, I get compliments. The amber-tobacco drydown is comfort in a bottle. A modern classic."',
        moods: [{e:'😍',l:'love',a:true},{e:'😊',l:'like',a:false},{e:'😐',l:'ok',a:false},{e:'😞',l:'dislike',a:false},{e:'😤',l:'hate',a:false}],
        seasons: [{e:'❄️',l:'winter',a:true},{e:'🌸',l:'spring',a:false},{e:'☀️',l:'summer',a:false},{e:'🍂',l:'fall',a:true},{e:'☀️',l:'day',a:false},{e:'🌙',l:'night',a:true}],
        score: '4.35', votes: '11,500',
        perfumeDesc: '<strong>The One Eau de Parfum</strong> by <strong>Dolce&Gabbana</strong> is a Amber Spicy fragrance. <strong>The One EDP</strong> was launched in 2008. The nose behind this fragrance is Olivier Polge.'
    },
    {
        id: 'versaceeros',
        sectionClass: 'versaceeros-section',
        cssClass: 'versaceeros',
        brand: 'VERSACE',
        location: 'MILANO',
        name: 'Eros',
        image: 'versace-eros.png',
        qualityTypes: ['edt', 'edp'],
        qualityLabels: ['Eau de Toilette', 'Eau de Parfum'],
        qualityDescs: ['Classic fresh formulation', 'Richer concentration'],
        prices: [45, 60],
        colors: { dark: '#0a3d5c', heading: '#0d5f8a', accent: '#1abc9c', light: '#2ecc71', muted: '#148f77', secondary: '#45b39d', rgb_accent: '26, 188, 156', rgb_light: '46, 204, 113' },
        profileSubtitle: 'Fresh • Mythical • Aromatic',
        scentAxes: ['Fresh', 'Sweet', 'Aromatic', 'Woody', 'Amber'],
        scentValues: [92, 85, 78, 72, 68],
        radarPoints: '150,34 256,110 213,230 87,230 44,110',
        radarDotsX: [150, 256, 213, 87, 44],
        radarDotsY: [34, 110, 230, 230, 110],
        longevity: '6-8 hours', longevityPct: 72, projection: 'Strong', projectionPct: 82, versatility: 'High', versatilityPct: 78,
        topNotes: [{emoji:'🍬', name:'Mint', intensity:'Cool'}, {emoji:'🍏', name:'Green Apple', intensity:'Fresh'}],
        heartNotes: [{emoji:'🌿', name:'Tonka Bean', intensity:'Sweet'}, {emoji:'🌸', name:'Geranium', intensity:'Aromatic'}],
        baseNotes: [{emoji:'🪨', name:'Musk', intensity:'Clean'}, {emoji:'🌲', name:'Cedarwood', intensity:'Earthy'}],
        descTitle: 'Aromatic Fresh', descYear: '2012',
        descTexts: [
            'Versace Eros opens with an electrifying blast of cool <strong>mint</strong> and crisp <strong>green apple</strong>, creating an immediately energizing and youthful impression. The freshness is bold and unapologetic.',
            'The heart reveals sweet <strong>tonka bean</strong> and aromatic <strong>geranium</strong>, while the base settles into clean <strong>musk</strong> and earthy <strong>cedarwood</strong>. Named after the Greek god of love, this fragrance is designed to conquer.'
        ],
        longevityBars: [{l:'very weak',w:5,c:1},{l:'weak',w:12,c:2},{l:'moderate',w:30,c:3},{l:'long lasting',w:35,c:4},{l:'eternal',w:18,c:5}],
        sillageBars: [{l:'intimate',w:5,c:1},{l:'moderate',w:20,c:2},{l:'strong',w:45,c:3},{l:'enormous',w:30,c:4}],
        genderBars: [{l:'female',w:2,c:1},{l:'more female',w:3,c:2},{l:'unisex',w:10,c:3},{l:'more male',w:35,c:4},{l:'male',w:50,c:5}],
        priceBars: [{l:'way overpriced',w:3,c:1},{l:'overpriced',w:8,c:2},{l:'ok',w:22,c:3},{l:'good value',w:42,c:4},{l:'great value',w:25,c:5}],
        redditUser: 'u/eros_unleashed', redditTime: '5 days ago', redditVotes: '2.8k', redditComments: '634',
        redditReview: '"Versace Eros is a BEAST. I\'m not exaggerating — every time I wear this in public, someone asks what I\'m wearing. The mint-tonka combo is pure magic. This is the fragrance that turned me into a fraghead. Perfect for clubs, dates, or anytime you want to make an impression."',
        moods: [{e:'😍',l:'love',a:true},{e:'😊',l:'like',a:false},{e:'😐',l:'ok',a:false},{e:'😞',l:'dislike',a:false},{e:'😤',l:'hate',a:false}],
        seasons: [{e:'❄️',l:'winter',a:false},{e:'🌸',l:'spring',a:true},{e:'☀️',l:'summer',a:true},{e:'🍂',l:'fall',a:false},{e:'☀️',l:'day',a:true},{e:'🌙',l:'night',a:true}],
        score: '4.18', votes: '18,700',
        perfumeDesc: '<strong>Eros</strong> by <strong>Versace</strong> is an Aromatic Fougere fragrance. <strong>Eros</strong> was launched in 2012. The nose behind this fragrance is Aurelien Guichard.'
    },
    {
        id: 'jpgultramale',
        sectionClass: 'jpgultramale-section',
        cssClass: 'jpgultramale',
        brand: 'JEAN PAUL GAULTIER',
        location: 'PARIS',
        name: 'Ultra Male',
        image: 'jpg-ultra-male.png',
        qualityTypes: ['edt', 'edp'],
        qualityLabels: ['Eau de Toilette', 'Intense'],
        qualityDescs: ['Sweet aromatic blend', 'Amplified intensity'],
        prices: [50, 65],
        colors: { dark: '#2d1b4e', heading: '#4a2c7c', accent: '#7b68ee', light: '#9b89f5', muted: '#6a5acd', secondary: '#8a7adf', rgb_accent: '123, 104, 238', rgb_light: '155, 137, 245' },
        profileSubtitle: 'Sweet • Bold • Hypnotic',
        scentAxes: ['Sweet', 'Aromatic', 'Spicy', 'Woody', 'Amber'],
        scentValues: [95, 82, 78, 70, 88],
        radarPoints: '150,33 257,108 215,230 85,230 43,108',
        radarDotsX: [150, 257, 215, 85, 43],
        radarDotsY: [33, 108, 230, 230, 108],
        longevity: '8-10+ hours', longevityPct: 88, projection: 'Beast Mode', projectionPct: 92, versatility: 'Moderate', versatilityPct: 58,
        topNotes: [{emoji:'🍐', name:'Pear', intensity:'Juicy'}, {emoji:'🪻', name:'Lavender', intensity:'Sweet'}],
        heartNotes: [{emoji:'🌺', name:'Black Vanilla', intensity:'Dark'}, {emoji:'🧊', name:'Cinnamon', intensity:'Spicy'}],
        baseNotes: [{emoji:'🪵', name:'Amber Wood', intensity:'Rich'}, {emoji:'🧴', name:'Musk', intensity:'Warm'}],
        descTitle: 'Sweet Oriental', descYear: '2015',
        descTexts: [
            'Ultra Male opens with a seductive burst of juicy <strong>pear</strong> and sweetened <strong>lavender</strong>, instantly creating a bold, attention-grabbing aura. The sweetness is amplified beyond the original Le Male formula.',
            'The heart darkens with rich <strong>black vanilla</strong> and fiery <strong>cinnamon</strong>, while the base envelops with <strong>amber wood</strong> and sensual <strong>musk</strong>. This is a fragrance designed to be noticed — a sweet bomb with character.'
        ],
        longevityBars: [{l:'very weak',w:3,c:1},{l:'weak',w:5,c:2},{l:'moderate',w:15,c:3},{l:'long lasting',w:42,c:4},{l:'eternal',w:35,c:5}],
        sillageBars: [{l:'intimate',w:3,c:1},{l:'moderate',w:12,c:2},{l:'strong',w:40,c:3},{l:'enormous',w:45,c:4}],
        genderBars: [{l:'female',w:2,c:1},{l:'more female',w:3,c:2},{l:'unisex',w:12,c:3},{l:'more male',w:35,c:4},{l:'male',w:48,c:5}],
        priceBars: [{l:'way overpriced',w:4,c:1},{l:'overpriced',w:10,c:2},{l:'ok',w:25,c:3},{l:'good value',w:38,c:4},{l:'great value',w:23,c:5}],
        redditUser: 'u/sweetbomb_fraghead', redditTime: '1 week ago', redditVotes: '2.5k', redditComments: '489',
        redditReview: '"Ultra Male is basically a cheat code for getting compliments. I sprayed it once before going to a party and literally couldn\'t stop people from asking about it. The pear-vanilla-lavender combo is INSANE. Yes, it\'s sweet. Yes, it\'s loud. And yes, it WORKS. Club king fragrance."',
        moods: [{e:'😍',l:'love',a:true},{e:'😊',l:'like',a:false},{e:'😐',l:'ok',a:false},{e:'😞',l:'dislike',a:false},{e:'😤',l:'hate',a:false}],
        seasons: [{e:'❄️',l:'winter',a:true},{e:'🌸',l:'spring',a:false},{e:'☀️',l:'summer',a:false},{e:'🍂',l:'fall',a:true},{e:'☀️',l:'day',a:false},{e:'🌙',l:'night',a:true}],
        score: '4.32', votes: '10,100',
        perfumeDesc: '<strong>Ultra Male</strong> by <strong>Jean Paul Gaultier</strong> is a Sweet Oriental fragrance. <strong>Ultra Male</strong> was launched in 2015. The nose behind this fragrance is Francis Kurkdjian.'
    },
    {
        id: 'invictus',
        sectionClass: 'invictus-section',
        cssClass: 'invictus',
        brand: 'PACO RABANNE',
        location: 'PARIS',
        name: 'Invictus',
        image: 'paco-rabanne-invictus.png',
        qualityTypes: ['edt', 'edp'],
        qualityLabels: ['Eau de Toilette', 'Eau de Parfum'],
        qualityDescs: ['Fresh sporty blend', 'Intensified formula'],
        prices: [40, 55],
        colors: { dark: '#263238', heading: '#37474f', accent: '#78909c', light: '#90a4ae', muted: '#607d8b', secondary: '#b0bec5', rgb_accent: '120, 144, 156', rgb_light: '144, 164, 174' },
        profileSubtitle: 'Sporty • Fresh • Energetic',
        scentAxes: ['Fresh', 'Aquatic', 'Sweet', 'Woody', 'Aromatic'],
        scentValues: [90, 85, 80, 65, 75],
        radarPoints: '150,36 253,112 211,228 89,228 47,112',
        radarDotsX: [150, 253, 211, 89, 47],
        radarDotsY: [36, 112, 228, 228, 112],
        longevity: '6-8 hours', longevityPct: 68, projection: 'Moderate-Strong', projectionPct: 75, versatility: 'Very High', versatilityPct: 85,
        topNotes: [{emoji:'🌊', name:'Marine Accord', intensity:'Fresh'}, {emoji:'🍊', name:'Grapefruit', intensity:'Zesty'}],
        heartNotes: [{emoji:'🌿', name:'Bay Leaf', intensity:'Aromatic'}, {emoji:'🌸', name:'Jasmine', intensity:'Floral'}],
        baseNotes: [{emoji:'🪵', name:'Guaiac Wood', intensity:'Warm'}, {emoji:'🍯', name:'Amber', intensity:'Sweet'}],
        descTitle: 'Aquatic Woody', descYear: '2013',
        descTexts: [
            'Invictus opens with a tidal wave of <strong>marine accord</strong> and zesty <strong>grapefruit</strong>, delivering an instant shot of energy and freshness. The sporty dynamism is evident from the very first spray.',
            'The heart brings aromatic <strong>bay leaf</strong> and delicate <strong>jasmine</strong>, while the base grounds with warm <strong>guaiac wood</strong> and sweet <strong>amber</strong>. The trophy-shaped bottle reflects its purpose — a scent designed for victory.'
        ],
        longevityBars: [{l:'very weak',w:8,c:1},{l:'weak',w:15,c:2},{l:'moderate',w:35,c:3},{l:'long lasting',w:30,c:4},{l:'eternal',w:12,c:5}],
        sillageBars: [{l:'intimate',w:8,c:1},{l:'moderate',w:28,c:2},{l:'strong',w:40,c:3},{l:'enormous',w:24,c:4}],
        genderBars: [{l:'female',w:2,c:1},{l:'more female',w:3,c:2},{l:'unisex',w:12,c:3},{l:'more male',w:38,c:4},{l:'male',w:45,c:5}],
        priceBars: [{l:'way overpriced',w:3,c:1},{l:'overpriced',w:8,c:2},{l:'ok',w:20,c:3},{l:'good value',w:40,c:4},{l:'great value',w:29,c:5}],
        redditUser: 'u/gym_fragrance_bro', redditTime: '2 weeks ago', redditVotes: '1.9k', redditComments: '412',
        redditReview: '"Invictus is the go-to gym/sport fragrance. Fresh, energetic, and people around you will definitely notice. The marine-amber combo is super addictive. Great value for money too. My gym bag essential. Works amazingly in warm weather."',
        moods: [{e:'😍',l:'love',a:false},{e:'😊',l:'like',a:true},{e:'😐',l:'ok',a:false},{e:'😞',l:'dislike',a:false},{e:'😤',l:'hate',a:false}],
        seasons: [{e:'❄️',l:'winter',a:false},{e:'🌸',l:'spring',a:true},{e:'☀️',l:'summer',a:true},{e:'🍂',l:'fall',a:false},{e:'☀️',l:'day',a:true},{e:'🌙',l:'night',a:false}],
        score: '3.98', votes: '20,300',
        perfumeDesc: '<strong>Invictus</strong> by <strong>Paco Rabanne</strong> is a Aquatic Woody fragrance. <strong>Invictus</strong> was launched in 2013. The nose behind this fragrance is Veronique Nyberg and Olivier Polge.'
    },
    {
        id: 'valentinouomo',
        sectionClass: 'valentinouomo-section',
        cssClass: 'valentinouomo',
        brand: 'VALENTINO',
        location: 'ROMA',
        name: 'Uomo Born in Roma',
        image: 'valentino-uomo.png',
        qualityTypes: ['edp', 'parfum'],
        qualityLabels: ['Eau de Parfum', 'Intense'],
        qualityDescs: ['Italian elegance blend', 'Deeper expression'],
        prices: [55, 70],
        colors: { dark: '#3e1f1f', heading: '#5c2e2e', accent: '#c0392b', light: '#e74c3c', muted: '#922B21', secondary: '#d35400', rgb_accent: '192, 57, 43', rgb_light: '231, 76, 60' },
        profileSubtitle: 'Roman • Sweet • Bold',
        scentAxes: ['Sweet', 'Woody', 'Smoky', 'Spicy', 'Amber'],
        scentValues: [88, 82, 78, 85, 90],
        radarPoints: '150,38 252,114 212,226 88,226 48,114',
        radarDotsX: [150, 252, 212, 88, 48],
        radarDotsY: [38, 114, 226, 226, 114],
        longevity: '8-12 hours', longevityPct: 88, projection: 'Strong', projectionPct: 82, versatility: 'Moderate-High', versatilityPct: 70,
        topNotes: [{emoji:'🌿', name:'Ginger', intensity:'Spicy'}, {emoji:'🍊', name:'Mandarin', intensity:'Sweet'}],
        heartNotes: [{emoji:'🌹', name:'Sage Leaf', intensity:'Aromatic'}, {emoji:'🌰', name:'Virginia Cedar', intensity:'Smoky'}],
        baseNotes: [{emoji:'🍯', name:'Vetiver', intensity:'Earthy'}, {emoji:'🪵', name:'Bourbon Vanilla', intensity:'Warm'}],
        descTitle: 'Sweet Smoky Woody', descYear: '2019',
        descTexts: [
            'Uomo Born in Roma opens with a vibrant fusion of spicy <strong>ginger</strong> and sweet <strong>mandarin</strong>, capturing the energy and charm of the Eternal City. The opening is both refreshing and warm.',
            'The heart reveals aromatic <strong>sage</strong> and smoldering <strong>Virginia cedar</strong>, while the base settles with earthy <strong>vetiver</strong> and luscious <strong>bourbon vanilla</strong>. A fragrance that embodies the contrast of ancient Rome and modern style.'
        ],
        longevityBars: [{l:'very weak',w:3,c:1},{l:'weak',w:6,c:2},{l:'moderate',w:18,c:3},{l:'long lasting',w:42,c:4},{l:'eternal',w:31,c:5}],
        sillageBars: [{l:'intimate',w:5,c:1},{l:'moderate',w:18,c:2},{l:'strong',w:45,c:3},{l:'enormous',w:32,c:4}],
        genderBars: [{l:'female',w:3,c:1},{l:'more female',w:5,c:2},{l:'unisex',w:15,c:3},{l:'more male',w:42,c:4},{l:'male',w:35,c:5}],
        priceBars: [{l:'way overpriced',w:5,c:1},{l:'overpriced',w:12,c:2},{l:'ok',w:28,c:3},{l:'good value',w:35,c:4},{l:'great value',w:20,c:5}],
        redditUser: 'u/roman_niche_fan', redditTime: '4 days ago', redditVotes: '1.6k', redditComments: '356',
        redditReview: '"Born in Roma is becoming my new signature. The sage-vanilla combo is absolutely intoxicating. It\'s sweet without being juvenile, smoky without being too heavy. The performance is stellar — easily lasts all day. Perfect for cold weather dates. Valentino knocked it out of the park."',
        moods: [{e:'😍',l:'love',a:true},{e:'😊',l:'like',a:false},{e:'😐',l:'ok',a:false},{e:'😞',l:'dislike',a:false},{e:'😤',l:'hate',a:false}],
        seasons: [{e:'❄️',l:'winter',a:true},{e:'🌸',l:'spring',a:false},{e:'☀️',l:'summer',a:false},{e:'🍂',l:'fall',a:true},{e:'☀️',l:'day',a:false},{e:'🌙',l:'night',a:true}],
        score: '4.40', votes: '7,800',
        perfumeDesc: '<strong>Uomo Born in Roma</strong> by <strong>Valentino</strong> is a Sweet Smoky fragrance. <strong>Born in Roma</strong> was launched in 2019. The nose behind this fragrance is Sonia Constant.'
    },
    {
        id: 'spicebomb',
        sectionClass: 'spicebomb-section',
        cssClass: 'spicebomb',
        brand: 'VIKTOR & ROLF',
        location: 'AMSTERDAM',
        name: 'Spicebomb Extreme',
        image: 'spicebomb-extreme.png',
        qualityTypes: ['edp', 'parfum'],
        qualityLabels: ['Eau de Parfum', 'Extreme'],
        qualityDescs: ['Bold spicy formula', 'Maximum intensity'],
        prices: [55, 70],
        colors: { dark: '#1a0a0a', heading: '#3d1c1c', accent: '#8b0000', light: '#b22222', muted: '#a52a2a', secondary: '#cd5c5c', rgb_accent: '139, 0, 0', rgb_light: '178, 34, 34' },
        profileSubtitle: 'Explosive • Spicy • Addictive',
        scentAxes: ['Spicy', 'Sweet', 'Tobacco', 'Vanilla', 'Woody'],
        scentValues: [95, 88, 85, 82, 72],
        radarPoints: '150,33 258,105 218,232 82,232 42,105',
        radarDotsX: [150, 258, 218, 82, 42],
        radarDotsY: [33, 105, 232, 232, 105],
        longevity: '10-12+ hours', longevityPct: 92, projection: 'Beast Mode', projectionPct: 90, versatility: 'Moderate', versatilityPct: 55,
        topNotes: [{emoji:'🌶️', name:'Black Pepper', intensity:'Hot'}, {emoji:'🫚', name:'Ginger', intensity:'Fiery'}],
        heartNotes: [{emoji:'🧊', name:'Cinnamon', intensity:'Warm'}, {emoji:'🍂', name:'Tobacco', intensity:'Rich'}],
        baseNotes: [{emoji:'🍯', name:'Vanilla', intensity:'Sweet'}, {emoji:'🪵', name:'Oud', intensity:'Dark'}],
        descTitle: 'Spicy Oriental', descYear: '2015',
        descTexts: [
            'Spicebomb Extreme opens with an explosive burst of <strong>black pepper</strong> and fiery <strong>ginger</strong>, delivering a sensory detonation. True to its grenade-shaped bottle, this fragrance is designed to make an impact.',
            'The heart intensifies with warm <strong>cinnamon</strong> and rich <strong>tobacco</strong>, while the base melts into sweet <strong>vanilla</strong> and dark <strong>oud</strong>. This is the extreme version for a reason — it\'s louder, sweeter, and more addictive than the original.'
        ],
        longevityBars: [{l:'very weak',w:2,c:1},{l:'weak',w:4,c:2},{l:'moderate',w:12,c:3},{l:'long lasting',w:38,c:4},{l:'eternal',w:44,c:5}],
        sillageBars: [{l:'intimate',w:3,c:1},{l:'moderate',w:10,c:2},{l:'strong',w:38,c:3},{l:'enormous',w:49,c:4}],
        genderBars: [{l:'female',w:2,c:1},{l:'more female',w:3,c:2},{l:'unisex',w:10,c:3},{l:'more male',w:38,c:4},{l:'male',w:47,c:5}],
        priceBars: [{l:'way overpriced',w:5,c:1},{l:'overpriced',w:12,c:2},{l:'ok',w:25,c:3},{l:'good value',w:35,c:4},{l:'great value',w:23,c:5}],
        redditUser: 'u/spice_lord_77', redditTime: '6 days ago', redditVotes: '2.1k', redditComments: '478',
        redditReview: '"Spicebomb Extreme is absolutely NUCLEAR. The vanilla-tobacco drydown is addictive beyond belief. I wore this to a winter gala and my wife couldn\'t stop hugging me. The performance is monstrous — I can still pick it up on my scarf 3 days later. This is a cold-weather KING."',
        moods: [{e:'😍',l:'love',a:true},{e:'😊',l:'like',a:false},{e:'😐',l:'ok',a:false},{e:'😞',l:'dislike',a:false},{e:'😤',l:'hate',a:false}],
        seasons: [{e:'❄️',l:'winter',a:true},{e:'🌸',l:'spring',a:false},{e:'☀️',l:'summer',a:false},{e:'🍂',l:'fall',a:true},{e:'☀️',l:'day',a:false},{e:'🌙',l:'night',a:true}],
        score: '4.45', votes: '9,200',
        perfumeDesc: '<strong>Spicebomb Extreme</strong> by <strong>Viktor&Rolf</strong> is a Spicy Oriental fragrance. <strong>Spicebomb Extreme</strong> was launched in 2015. The nose behind this fragrance is Nathalie Lorson.'
    },
    {
        id: 'explorer',
        sectionClass: 'explorer-section',
        cssClass: 'explorer',
        brand: 'MONTBLANC',
        location: 'HAMBURG',
        name: 'Explorer',
        image: 'montblanc-explorer.png',
        qualityTypes: ['edp', 'parfum'],
        qualityLabels: ['Eau de Parfum', 'Parfum'],
        qualityDescs: ['Adventurous blend', 'Premium blend'],
        prices: [40, 55],
        colors: { dark: '#1b2631', heading: '#2c3e50', accent: '#2e86c1', light: '#5dade2', muted: '#1a5276', secondary: '#7fb3d3', rgb_accent: '46, 134, 193', rgb_light: '93, 173, 226' },
        profileSubtitle: 'Adventurous • Woody • Aromatic',
        scentAxes: ['Woody', 'Aromatic', 'Leather', 'Citrus', 'Earthy'],
        scentValues: [88, 82, 78, 85, 72],
        radarPoints: '150,38 251,114 209,225 91,225 49,114',
        radarDotsX: [150, 251, 209, 91, 49],
        radarDotsY: [38, 114, 225, 225, 114],
        longevity: '6-8 hours', longevityPct: 72, projection: 'Moderate', projectionPct: 65, versatility: 'Very High', versatilityPct: 88,
        topNotes: [{emoji:'🍋', name:'Bergamot', intensity:'Bright'}, {emoji:'🌿', name:'Clary Sage', intensity:'Green'}],
        heartNotes: [{emoji:'🧥', name:'Leather', intensity:'Suede'}, {emoji:'🌹', name:'Vetiver', intensity:'Earthy'}],
        baseNotes: [{emoji:'🪵', name:'Patchouli', intensity:'Dark'}, {emoji:'🍂', name:'Ambroxan', intensity:'Warm'}],
        descTitle: 'Woody Aromatic', descYear: '2019',
        descTexts: [
            'Explorer opens with a bright and energizing blend of <strong>bergamot</strong> and herbaceous <strong>clary sage</strong>, instantly creating a sense of movement and adventure. The freshness suggests open spaces and untrodden paths.',
            'The heart develops a supple <strong>leather</strong> note intertwined with earthy <strong>vetiver</strong>, while the base reveals deep <strong>patchouli</strong> and warm <strong>ambroxan</strong>. Often compared to Aventus at a fraction of the price, Explorer is the smart enthusiast\'s choice.'
        ],
        longevityBars: [{l:'very weak',w:6,c:1},{l:'weak',w:15,c:2},{l:'moderate',w:32,c:3},{l:'long lasting',w:32,c:4},{l:'eternal',w:15,c:5}],
        sillageBars: [{l:'intimate',w:12,c:1},{l:'moderate',w:35,c:2},{l:'strong',w:35,c:3},{l:'enormous',w:18,c:4}],
        genderBars: [{l:'female',w:3,c:1},{l:'more female',w:5,c:2},{l:'unisex',w:18,c:3},{l:'more male',w:42,c:4},{l:'male',w:32,c:5}],
        priceBars: [{l:'way overpriced',w:2,c:1},{l:'overpriced',w:5,c:2},{l:'ok',w:15,c:3},{l:'good value',w:38,c:4},{l:'great value',w:40,c:5}],
        redditUser: 'u/budget_beast_finder', redditTime: '3 weeks ago', redditVotes: '3.4k', redditComments: '789',
        redditReview: '"If you can\'t afford Aventus, Explorer is your answer. I own both and honestly, Explorer holds its own beautifully. The bergamot-patchouli combo is clean and versatile. I wear it to work, dates, gym — everywhere. Best bang for your buck in the fragrance game. Period."',
        moods: [{e:'😍',l:'love',a:false},{e:'😊',l:'like',a:true},{e:'😐',l:'ok',a:false},{e:'😞',l:'dislike',a:false},{e:'😤',l:'hate',a:false}],
        seasons: [{e:'❄️',l:'winter',a:false},{e:'🌸',l:'spring',a:true},{e:'☀️',l:'summer',a:true},{e:'🍂',l:'fall',a:true},{e:'☀️',l:'day',a:true},{e:'🌙',l:'night',a:false}],
        score: '4.05', votes: '13,400',
        perfumeDesc: '<strong>Explorer</strong> by <strong>Montblanc</strong> is a Woody Aromatic fragrance. <strong>Explorer</strong> was launched in 2019. The nose behind this fragrance is Jordi Fernandez and Antoine Maisondieu.'
    },
    {
        id: 'blv',
        sectionClass: 'blv-section',
        cssClass: 'blv',
        brand: 'BVLGARI',
        location: 'ROMA',
        name: 'Man in Black',
        image: 'bvlgari-man-in-black.png',
        qualityTypes: ['edp', 'parfum'],
        qualityLabels: ['Eau de Parfum', 'Parfum'],
        qualityDescs: ['Dark oriental blend', 'Purest expression'],
        prices: [55, 75],
        colors: { dark: '#0d0d0d', heading: '#1c1c1c', accent: '#b8860b', light: '#cd950c', muted: '#8B6914', secondary: '#daa520', rgb_accent: '184, 134, 11', rgb_light: '205, 149, 12' },
        profileSubtitle: 'Dark • Leather • Oriental',
        scentAxes: ['Leather', 'Spicy', 'Amber', 'Woody', 'Sweet'],
        scentValues: [92, 88, 85, 78, 72],
        radarPoints: '150,34 256,108 214,228 86,228 44,108',
        radarDotsX: [150, 256, 214, 86, 44],
        radarDotsY: [34, 108, 228, 228, 108],
        longevity: '8-10+ hours', longevityPct: 85, projection: 'Moderate-Strong', projectionPct: 78, versatility: 'Moderate', versatilityPct: 60,
        topNotes: [{emoji:'🌶️', name:'Black Spices', intensity:'Sharp'}, {emoji:'🍊', name:'Bergamot', intensity:'Citrus'}],
        heartNotes: [{emoji:'🧥', name:'Leather', intensity:'Rich'}, {emoji:'🌹', name:'Iris', intensity:'Powdery'}],
        baseNotes: [{emoji:'🍯', name:'Benzoin', intensity:'Sweet'}, {emoji:'🪨', name:'Musk', intensity:'Dark'}],
        descTitle: 'Leather Oriental', descYear: '2014',
        descTexts: [
            'Man in Black opens with an assertive blend of <strong>black spices</strong> and zesty <strong>bergamot</strong>, establishing an immediate sense of dark sophistication. The opening is bold yet refined.',
            'The heart reveals luxurious <strong>leather</strong> intertwined with powdery <strong>iris</strong>, while the base deepens with sweet <strong>benzoin</strong> and dark <strong>musk</strong>. A nighttime powerhouse that channels old-world Italian glamour with a modern edge.'
        ],
        longevityBars: [{l:'very weak',w:3,c:1},{l:'weak',w:7,c:2},{l:'moderate',w:20,c:3},{l:'long lasting',w:40,c:4},{l:'eternal',w:30,c:5}],
        sillageBars: [{l:'intimate',w:8,c:1},{l:'moderate',w:22,c:2},{l:'strong',w:42,c:3},{l:'enormous',w:28,c:4}],
        genderBars: [{l:'female',w:2,c:1},{l:'more female',w:3,c:2},{l:'unisex',w:12,c:3},{l:'more male',w:38,c:4},{l:'male',w:45,c:5}],
        priceBars: [{l:'way overpriced',w:4,c:1},{l:'overpriced',w:10,c:2},{l:'ok',w:22,c:3},{l:'good value',w:38,c:4},{l:'great value',w:26,c:5}],
        redditUser: 'u/dark_scent_connoisseur', redditTime: '2 weeks ago', redditVotes: '1.7k', redditComments: '389',
        redditReview: '"Man in Black is criminally underrated. The rum-leather-benzoin combo creates something truly unique. This is the fragrance equivalent of a perfectly tailored black suit. The projection is ideal — people close to you will be mesmerized but you won\'t suffocate a room. Pure class."',
        moods: [{e:'😍',l:'love',a:true},{e:'😊',l:'like',a:false},{e:'😐',l:'ok',a:false},{e:'😞',l:'dislike',a:false},{e:'😤',l:'hate',a:false}],
        seasons: [{e:'❄️',l:'winter',a:true},{e:'🌸',l:'spring',a:false},{e:'☀️',l:'summer',a:false},{e:'🍂',l:'fall',a:true},{e:'☀️',l:'day',a:false},{e:'🌙',l:'night',a:true}],
        score: '4.22', votes: '6,800',
        perfumeDesc: '<strong>Man in Black</strong> by <strong>Bvlgari</strong> is a Leather Oriental fragrance. <strong>Man in Black</strong> was launched in 2014. The nose behind this fragrance is Alberto Morillas.'
    }
];

// =========================================================================
// GENERATE HTML FOR EACH PERFUME
// =========================================================================
function generatePerfumeHTML(p) {
    const q1 = p.qualityTypes[0];
    const q2 = p.qualityTypes[1];
    const ratingColors = [p.colors.accent, p.colors.muted, p.colors.secondary, p.colors.light, p.colors.light];
    
    function genBars(bars, prefix) {
        return bars.map((b, i) => {
            const color = ratingColors[i % ratingColors.length];
            const count = Math.floor(b.w * 30 + 50);
            return `                                <div class="${p.cssClass}-rating-item"><span class="${p.cssClass}-rating-label">${b.l}</span><div class="${p.cssClass}-rating-bar"><div class="${p.cssClass}-bar-fill" style="width: ${b.w}%; background-color: ${color}"></div></div><span class="${p.cssClass}-rating-count">${count}</span></div>`;
        }).join('\n');
    }

    return `
            <!-- Extra Transition Section -->
            <section class="content ${p.cssClass}-transition-section" style="min-height: 200px; height: 200px">
            </section>

            <section class="content ${p.sectionClass}" id="${p.id}">
                <div class="${p.cssClass}-main-container ${p.cssClass}-theme">

                    <div class="perfume-top-row">

                    <!-- ${p.name} Image and Product Info -->
                    <div class="${p.cssClass}-product-section">
                        <img
                            src="${p.image}"
                            alt="${p.name} Perfume"
                            class="${p.cssClass}-image"
                        />

                        <div class="product-info-section">
                            <div class="product-header-row">
                                <div class="product-info">
                                    <h1 class="brand-name">${p.brand}</h1>
                                    <h2 class="brand-location">${p.location}</h2>
                                    <h3 class="product-name">${p.name}</h3>
                                </div>
                            </div>
                            <div class="product-price-container">
                                <div class="price-badge">
                                    <div class="price-ornament top-left"></div>
                                    <div class="price-ornament top-right"></div>
                                    <div class="price-ornament bottom-left"></div>
                                    <div class="price-ornament bottom-right"></div>
                                    <div class="price-shimmer"></div>
                                    <div class="product-price">
                                        <span class="price-currency">${p.prices[0]}</span>
                                        <span class="price-unit">dt</span>
                                    </div>
                                    <div class="price-glow"></div>
                                </div>
                                <div class="price-subtitle">Premium Collection</div>
                            </div>

                            <!-- ${p.name} Favorites and Cart Buttons -->
                            <div class="product-actions-buttons">
                                <div class="favorite-btn-middle-container">
                                    <button class="favorite-btn" data-product="${p.id}" id="${p.id}FavoriteBtn">
                                        <div class="favorite-icon">
                                            <svg class="heart-outline" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                                            <svg class="heart-filled" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                                        </div>
                                        <span class="favorite-text">Add to Favorites</span>
                                    </button>
                                </div>
                                <div class="cart-btn-container">
                                    <button class="add-to-cart-btn" data-product="${p.id}" data-price="${p.prices[0]}" id="${p.id}CartBtn">
                                        <div class="cart-icon">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="m1 1 4 4 2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                                        </div>
                                        <span class="cart-text">Add to Cart</span>
                                    </button>
                                </div>
                            </div>

                            <div class="quality-selector-container">
                                <div class="quality-header">
                                    <h4 class="quality-title">Select Quality</h4>
                                    <div class="quality-subtitle">Choose Your Preference</div>
                                </div>
                                <div class="quality-options quality-selector">
                                    <div class="quality-option" data-quality="${q1}" data-price="${p.prices[0]}">
                                        <input type="radio" id="${p.id}-${q1}-quality" name="${p.id}-quality" value="${q1}" checked />
                                        <label for="${p.id}-${q1}-quality" class="quality-label">
                                            <div class="quality-badge">
                                                <div class="quality-ornament top-left"></div>
                                                <div class="quality-ornament top-right"></div>
                                                <div class="quality-ornament bottom-left"></div>
                                                <div class="quality-ornament bottom-right"></div>
                                                <div class="quality-shimmer"></div>
                                                <div class="quality-content">
                                                    <div class="quality-name">${p.qualityLabels[0]}</div>
                                                    <div class="quality-description">${p.qualityDescs[0]}</div>
                                                </div>
                                                <div class="quality-glow"></div>
                                                <div class="selection-indicator"></div>
                                            </div>
                                        </label>
                                    </div>
                                    <div class="quality-option" data-quality="${q2}" data-price="${p.prices[1]}">
                                        <input type="radio" id="${p.id}-${q2}-quality" name="${p.id}-quality" value="${q2}" />
                                        <label for="${p.id}-${q2}-quality" class="quality-label">
                                            <div class="quality-badge">
                                                <div class="quality-ornament top-left"></div>
                                                <div class="quality-ornament top-right"></div>
                                                <div class="quality-ornament bottom-left"></div>
                                                <div class="quality-ornament bottom-right"></div>
                                                <div class="quality-shimmer"></div>
                                                <div class="quality-content">
                                                    <div class="quality-name">${p.qualityLabels[1]}</div>
                                                    <div class="quality-description">${p.qualityDescs[1]}</div>
                                                </div>
                                                <div class="quality-glow"></div>
                                                <div class="selection-indicator"></div>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- ${p.name} Scent Profile - RADAR CHART -->
                    <div class="${p.cssClass}-profiles-container">
                        <div class="${p.cssClass}-scent-profile">
                            <div class="profile-container ${p.cssClass}-profile-card">
                                <div class="profile-header">
                                    <h3 class="profile-title">Scent Profile</h3>
                                    <div class="profile-subtitle">${p.profileSubtitle}</div>
                                </div>

                                <!-- Radar Chart -->
                                <div class="${p.cssClass}-radar-section">
                                    <div class="${p.cssClass}-radar-container">
                                        <svg class="${p.cssClass}-radar-svg" viewBox="0 0 300 300">
                                            <!-- Grid lines -->
                                            <polygon class="radar-grid" points="150,30 270,98 234,242 66,242 30,98" fill="none" stroke="rgba(${p.colors.rgb_accent},0.15)" stroke-width="1"/>
                                            <polygon class="radar-grid" points="150,60 240,108 214,222 86,222 60,108" fill="none" stroke="rgba(${p.colors.rgb_accent},0.12)" stroke-width="1"/>
                                            <polygon class="radar-grid" points="150,90 210,118 194,202 106,202 90,118" fill="none" stroke="rgba(${p.colors.rgb_accent},0.08)" stroke-width="1"/>
                                            <!-- Axis lines -->
                                            <line x1="150" y1="150" x2="150" y2="30" stroke="rgba(${p.colors.rgb_accent},0.2)" stroke-width="1"/>
                                            <line x1="150" y1="150" x2="270" y2="98" stroke="rgba(${p.colors.rgb_accent},0.2)" stroke-width="1"/>
                                            <line x1="150" y1="150" x2="234" y2="242" stroke="rgba(${p.colors.rgb_accent},0.2)" stroke-width="1"/>
                                            <line x1="150" y1="150" x2="66" y2="242" stroke="rgba(${p.colors.rgb_accent},0.2)" stroke-width="1"/>
                                            <line x1="150" y1="150" x2="30" y2="98" stroke="rgba(${p.colors.rgb_accent},0.2)" stroke-width="1"/>
                                            <!-- Data polygon -->
                                            <polygon class="${p.cssClass}-radar-data" 
                                                points="${p.radarPoints}" 
                                                fill="rgba(${p.colors.rgb_accent},0.25)" 
                                                stroke="${p.colors.accent}" 
                                                stroke-width="2.5"/>
                                            <!-- Data points -->${p.radarDotsX.map((x, i) => `
                                            <circle cx="${x}" cy="${p.radarDotsY[i]}" r="5" fill="${p.colors.accent}" stroke="white" stroke-width="2"/>`).join('')}
                                        </svg>
                                        <!-- Labels -->
                                        <div class="${p.cssClass}-radar-labels">${p.scentAxes.map((axis, i) => `
                                            <div class="${p.cssClass}-radar-label pos-${i}"><span class="label-name">${axis}</span><span class="label-value">${p.scentValues[i]}%</span></div>`).join('')}
                                        </div>
                                    </div>

                                    <!-- Performance Metrics -->
                                    <div class="${p.cssClass}-metrics">
                                        <div class="${p.cssClass}-metric-item">
                                            <div class="metric-icon">⏱️</div>
                                            <div class="metric-info">
                                                <div class="metric-label">Longevity</div>
                                                <div class="metric-value">${p.longevity}</div>
                                                <div class="metric-bar"><div class="metric-fill ${p.cssClass}-fill" style="width: ${p.longevityPct}%"></div></div>
                                            </div>
                                        </div>
                                        <div class="${p.cssClass}-metric-item">
                                            <div class="metric-icon">🌊</div>
                                            <div class="metric-info">
                                                <div class="metric-label">Projection</div>
                                                <div class="metric-value">${p.projection}</div>
                                                <div class="metric-bar"><div class="metric-fill ${p.cssClass}-fill" style="width: ${p.projectionPct}%"></div></div>
                                            </div>
                                        </div>
                                        <div class="${p.cssClass}-metric-item">
                                            <div class="metric-icon">🎯</div>
                                            <div class="metric-info">
                                                <div class="metric-label">Versatility</div>
                                                <div class="metric-value">${p.versatility}</div>
                                                <div class="metric-bar"><div class="metric-fill ${p.cssClass}-fill" style="width: ${p.versatilityPct}%"></div></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- ${p.name} Ingredients -->
                        <div class="${p.cssClass}-ingredients">
                            <div class="profile-container ${p.cssClass}-profile-card">
                                <div class="profile-header">
                                    <h3 class="profile-title">Ingredients</h3>
                                    <div class="profile-subtitle">${p.profileSubtitle}</div>
                                </div>
                                <div class="${p.cssClass}-crystal-notes">
                                    <div class="${p.cssClass}-note-tier">
                                        <div class="${p.cssClass}-tier-label"><span class="${p.cssClass}-tier-icon">✨</span> Top Notes <span class="${p.cssClass}-tier-time">0-30 min</span></div>
                                        <div class="${p.cssClass}-crystal-grid">${p.topNotes.map(n => `
                                            <div class="${p.cssClass}-crystal-card"><div class="${p.cssClass}-crystal-emoji">${n.emoji}</div><div class="${p.cssClass}-crystal-name">${n.name}</div><div class="${p.cssClass}-crystal-intensity">${n.intensity}</div></div>`).join('')}
                                        </div>
                                    </div>
                                    <div class="${p.cssClass}-note-tier">
                                        <div class="${p.cssClass}-tier-label"><span class="${p.cssClass}-tier-icon">💖</span> Heart Notes <span class="${p.cssClass}-tier-time">30min-4hrs</span></div>
                                        <div class="${p.cssClass}-crystal-grid">${p.heartNotes.map(n => `
                                            <div class="${p.cssClass}-crystal-card"><div class="${p.cssClass}-crystal-emoji">${n.emoji}</div><div class="${p.cssClass}-crystal-name">${n.name}</div><div class="${p.cssClass}-crystal-intensity">${n.intensity}</div></div>`).join('')}
                                        </div>
                                    </div>
                                    <div class="${p.cssClass}-note-tier">
                                        <div class="${p.cssClass}-tier-label"><span class="${p.cssClass}-tier-icon">💎</span> Base Notes <span class="${p.cssClass}-tier-time">4-12+ hrs</span></div>
                                        <div class="${p.cssClass}-crystal-grid">${p.baseNotes.map(n => `
                                            <div class="${p.cssClass}-crystal-card"><div class="${p.cssClass}-crystal-emoji">${n.emoji}</div><div class="${p.cssClass}-crystal-name">${n.name}</div><div class="${p.cssClass}-crystal-intensity">${n.intensity}</div></div>`).join('')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    </div>

                <!-- ${p.name} Scent Description -->
                <div class="${p.cssClass}-fragrance-description">
                    <div class="${p.cssClass}-description-header">
                        <h4 class="${p.cssClass}-description-title">Scent Profile</h4>
                        <div class="${p.cssClass}-description-subtitle">${p.descTitle} — ${p.descYear}</div>
                    </div>
                    <div class="${p.cssClass}-description-content">${p.descTexts.map(t => `
                        <p class="${p.cssClass}-description-text">${t}</p>`).join('')}
                    </div>
                </div>

                <!-- ${p.name} Performance Metrics -->
                <div class="${p.cssClass}-additional-ratings">
                    <div class="${p.cssClass}-rating-row">
                        <div class="${p.cssClass}-rating-category">
                            <div class="${p.cssClass}-category-header">
                                <div class="${p.cssClass}-category-icon">⏱️</div>
                                <h4 class="${p.cssClass}-category-title">LONGEVITY</h4>
                                <span class="${p.cssClass}-no-vote">no vote</span>
                            </div>
                            <div class="${p.cssClass}-rating-bars">
${genBars(p.longevityBars)}
                            </div>
                        </div>
                        <div class="${p.cssClass}-rating-category">
                            <div class="${p.cssClass}-category-header">
                                <div class="${p.cssClass}-category-icon">💨</div>
                                <h4 class="${p.cssClass}-category-title">SILLAGE</h4>
                                <span class="${p.cssClass}-no-vote">no vote</span>
                            </div>
                            <div class="${p.cssClass}-rating-bars">
${genBars(p.sillageBars)}
                            </div>
                        </div>
                    </div>
                    <div class="${p.cssClass}-rating-row">
                        <div class="${p.cssClass}-rating-category">
                            <div class="${p.cssClass}-category-header">
                                <div class="${p.cssClass}-category-icon">👤</div>
                                <h4 class="${p.cssClass}-category-title">GENDER</h4>
                                <span class="${p.cssClass}-no-vote">no vote</span>
                            </div>
                            <div class="${p.cssClass}-rating-bars">
${genBars(p.genderBars)}
                            </div>
                        </div>
                        <div class="${p.cssClass}-rating-category">
                            <div class="${p.cssClass}-category-header">
                                <div class="${p.cssClass}-category-icon">💰</div>
                                <h4 class="${p.cssClass}-category-title">PRICE VALUE</h4>
                                <span class="${p.cssClass}-no-vote">no vote</span>
                            </div>
                            <div class="${p.cssClass}-rating-bars">
${genBars(p.priceBars)}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ${p.name} Reddit Review -->
                <div class="${p.cssClass}-reddit-review-container">
                    <div class="${p.cssClass}-reddit-card">
                        <div class="${p.cssClass}-reddit-header">
                            <div class="${p.cssClass}-reddit-votes">
                                <button class="${p.cssClass}-vote-btn upvote">▲</button>
                                <span class="${p.cssClass}-vote-count">${p.redditVotes}</span>
                                <button class="${p.cssClass}-vote-btn downvote">▼</button>
                            </div>
                            <div class="${p.cssClass}-reddit-sub">
                                <span class="${p.cssClass}-subreddit">r/fragrance</span>
                                <span class="${p.cssClass}-post-dot">•</span>
                                <span class="${p.cssClass}-post-info">Posted by ${p.redditUser} ${p.redditTime}</span>
                            </div>
                        </div>
                        <div class="${p.cssClass}-reddit-content">
                            <div class="${p.cssClass}-reddit-user">
                                <div class="${p.cssClass}-user-avatar">
                                    <img src="data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='20' fill='${encodeURIComponent(p.colors.accent)}'/%3E%3Cpath d='M20 8c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12S26.627 8 20 8zm0 6c1.657 0 3 1.343 3 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3zm0 18c-3.315 0-6.168-1.69-7.848-4.256.024-2.598 5.216-4.024 7.848-4.024s7.824 1.426 7.848 4.024C26.168 30.31 23.315 32 20 32z' fill='white'/%3E%3C/svg%3E" alt="User Avatar" />
                                </div>
                                <div class="${p.cssClass}-user-details">
                                    <span class="${p.cssClass}-username">${p.redditUser}</span>
                                    <span class="${p.cssClass}-post-time">${p.redditTime}</span>
                                </div>
                            </div>
                            <div class="${p.cssClass}-reddit-text"><p>${p.redditReview}</p></div>
                            <div class="${p.cssClass}-reddit-engagement">
                                <div class="${p.cssClass}-engagement-item"><span class="${p.cssClass}-engagement-icon">💬</span><span class="${p.cssClass}-engagement-count">${p.redditComments} comments</span></div>
                                <div class="${p.cssClass}-engagement-item"><span class="${p.cssClass}-engagement-icon">🔗</span><span class="${p.cssClass}-engagement-text">Share</span></div>
                                <div class="${p.cssClass}-engagement-item"><span class="${p.cssClass}-engagement-icon">⭐</span><span class="${p.cssClass}-engagement-text">Save</span></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ${p.name} Mood and Seasonal Indicators -->
                <div class="${p.cssClass}-perfume-rating">
                    <div class="${p.cssClass}-rating-indicators">
                        <div class="${p.cssClass}-mood-indicators">${p.moods.map(m => `
                            <div class="${p.cssClass}-indicator-item${m.a?' active':''}"><div class="${p.cssClass}-indicator-icon">${m.e}</div><span class="${p.cssClass}-indicator-label">${m.l}</span><div class="${p.cssClass}-indicator-bar"></div></div>`).join('')}
                        </div>
                        <div class="${p.cssClass}-seasonal-indicators">${p.seasons.map(s => `
                            <div class="${p.cssClass}-indicator-item${s.a?' active':''}"><div class="${p.cssClass}-indicator-icon">${s.e}</div><span class="${p.cssClass}-indicator-label">${s.l}</span><div class="${p.cssClass}-indicator-bar"></div></div>`).join('')}
                        </div>
                    </div>
                    <div class="${p.cssClass}-rating-score">
                        <h3 class="${p.cssClass}-rating-title">Perfume rating <span class="${p.cssClass}-score">${p.score}</span> out of 5 with <span class="${p.cssClass}-votes">${p.votes}</span> votes</h3>
                    </div>

                    <div class="${p.cssClass}-perfume-description">
                        <p>${p.perfumeDesc}</p>
                    </div>
                </div>

                    <!-- ${p.name} Reviews Section -->
                    <div class="reviews-section" id="${p.id}-reviews">
                        <div class="reviews-header">
                            <h3 class="reviews-title"><span class="reviews-icon">💬</span> User Reviews & Comments</h3>
                            <div class="reviews-stats"><span class="reviews-count" id="${p.id}-reviews-count">0 reviews</span></div>
                        </div>
                        <div class="add-review-container" id="${p.id}-add-review" style="display: none">
                            <div class="add-review-form">
                                <div class="review-form-header">
                                    <div class="user-avatar-small" id="${p.id}-review-avatar"><img src="" alt="Your Avatar" /></div>
                                    <div class="review-form-info">
                                        <span class="review-form-username" id="${p.id}-review-username">Your Name</span>
                                        <span class="review-form-subtitle">Share your experience with ${p.name}</span>
                                    </div>
                                </div>
                                <div class="review-rating-container">
                                    <span class="rating-label">Your Rating:</span>
                                    <div class="star-rating" id="${p.id}-star-rating">
                                        <span class="star" data-rating="1">★</span>
                                        <span class="star" data-rating="2">★</span>
                                        <span class="star" data-rating="3">★</span>
                                        <span class="star" data-rating="4">★</span>
                                        <span class="star" data-rating="5">★</span>
                                    </div>
                                </div>
                                <textarea class="review-textarea" id="${p.id}-review-text" placeholder="Share your thoughts about ${p.name}... How does it smell? How's the performance?" maxlength="500"></textarea>
                                <div class="review-form-actions">
                                    <div class="character-count"><span id="${p.id}-char-count">0</span>/500</div>
                                    <div class="review-buttons">
                                        <button class="review-btn cancel-btn" id="${p.id}-cancel-review">Cancel</button>
                                        <button class="review-btn submit-btn" id="${p.id}-submit-review">Post Review</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="review-signin-prompt" id="${p.id}-signin-prompt">
                            <div class="signin-prompt-content">
                                <div class="signin-prompt-icon">🔒</div>
                                <h4>Share Your Experience</h4>
                                <p>Sign in to write a review for ${p.name}.</p>
                                <button class="signin-prompt-btn">Sign In to Review</button>
                            </div>
                        </div>
                        <div class="reviews-list" id="${p.id}-reviews-list"></div>
                        <div class="load-more-container" id="${p.id}-load-more" style="display: none">
                            <button class="load-more-btn" id="${p.id}-load-more-btn">Load More Reviews</button>
                        </div>
                    </div>
                </div>
            </section>
`;
}

// =========================================================================
// GENERATE CSS FOR EACH PERFUME (based on baccaratrouge template)
// =========================================================================
function generatePerfumeCSS(p) {
    const c = p.colors;
    return `/* ============================================================================
   ${p.brand} — ${p.name} Theme
   Unique: Radar Chart, Crystal Shard Cards, Glassmorphism
   ============================================================================ */

/* Main Container */
.${p.cssClass}-main-container {
    max-width: 1600px !important;
    margin: 0 auto !important;
    padding: 60px 30px !important;
    display: flex !important;
    flex-direction: column !important;
    gap: 50px !important;
    position: relative !important;
}

.${p.cssClass}-theme {
    color: ${c.dark} !important;
}

.${p.cssClass}-theme .brand-name {
    color: ${c.heading} !important;
    font-family: 'Playfair Display', serif !important;
    letter-spacing: 3px !important;
}

.${p.cssClass}-theme .brand-location {
    color: ${c.accent} !important;
    letter-spacing: 5px !important;
}

.${p.cssClass}-theme .product-name {
    color: ${c.dark} !important;
    font-family: 'Playfair Display', serif !important;
    font-style: italic !important;
}

.${p.cssClass}-theme .price-badge {
    background: linear-gradient(135deg, ${c.accent}, ${c.light}) !important;
    border: 2px solid ${c.accent} !important;
}

.${p.cssClass}-theme .price-glow {
    background: radial-gradient(circle, rgba(${c.rgb_accent},0.3) 0%, transparent 70%) !important;
}

.${p.cssClass}-theme .quality-badge {
    border: 1px solid rgba(${c.rgb_accent},0.3) !important;
    background: rgba(${c.rgb_accent},0.04) !important;
}

.${p.cssClass}-theme .quality-name {
    color: ${c.muted} !important;
}

.${p.cssClass}-theme .quality-description {
    color: ${c.accent} !important;
}

.${p.cssClass}-theme .quality-option input:checked + .quality-label .quality-badge {
    border-color: ${c.accent} !important;
    background: rgba(${c.rgb_accent},0.08) !important;
    box-shadow: none !important;
}

.${p.cssClass}-theme .quality-option input:checked + .quality-label .quality-name {
    color: ${c.heading} !important;
    font-weight: 600 !important;
}

.${p.cssClass}-theme .quality-option input:checked + .quality-label .quality-description {
    color: ${c.muted} !important;
}

.${p.cssClass}-theme .selection-indicator {
    border-color: rgba(${c.rgb_accent},0.4) !important;
}

.${p.cssClass}-theme .quality-option input:checked + .quality-label .selection-indicator {
    border-color: ${c.accent} !important;
    background: rgba(${c.rgb_accent},0.1) !important;
    box-shadow: none !important;
}

.${p.cssClass}-theme .quality-option input:checked + .quality-label .selection-indicator::after {
    background: ${c.accent} !important;
    box-shadow: none !important;
}

.${p.cssClass}-theme .quality-shimmer {
    background: linear-gradient(90deg, transparent, rgba(${c.rgb_accent},0.1), transparent) !important;
}

.${p.cssClass}-theme .quality-glow {
    display: none !important;
}

.${p.cssClass}-theme .quality-ornament {
    border-color: rgba(${c.rgb_accent},0.3) !important;
}

.${p.cssClass}-theme .quality-option input:checked + .quality-label .quality-ornament {
    border-color: ${c.accent} !important;
    box-shadow: none !important;
}

/* Product Section */
.${p.cssClass}-product-section {
    display: flex !important;
    align-items: center !important;
    gap: 50px !important;
    flex-wrap: wrap !important;
    justify-content: center !important;
}

.${p.cssClass}-image {
    width: 320px !important;
    height: auto !important;
    max-height: 440px !important;
    object-fit: contain !important;
    filter: drop-shadow(0 20px 40px rgba(${c.rgb_accent},0.25)) !important;
    transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), filter 0.6s ease !important;
}

.${p.cssClass}-image:hover {
    transform: scale(1.05) translateY(-10px) !important;
    filter: drop-shadow(0 30px 60px rgba(${c.rgb_accent},0.35)) !important;
}

/* Profiles Container */
.${p.cssClass}-profiles-container {
    display: grid !important;
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    gap: 30px !important;
    align-items: stretch !important;
}

/* Profile Card - Glassmorphism */
.${p.cssClass}-profile-card {
    background: rgba(255,255,255,0.6) !important;
    backdrop-filter: blur(20px) !important;
    -webkit-backdrop-filter: blur(20px) !important;
    border: 1px solid rgba(${c.rgb_accent},0.2) !important;
    border-radius: 20px !important;
    padding: 30px !important;
    box-shadow: 0 8px 32px rgba(${c.rgb_accent},0.1) !important;
}

.${p.cssClass}-profile-card .profile-title {
    color: ${c.heading} !important;
    font-family: 'Playfair Display', serif !important;
}

.${p.cssClass}-profile-card .profile-subtitle {
    color: ${c.accent} !important;
}

/* Radar Chart */
.${p.cssClass}-scent-profile { flex: 1 !important; min-width: 300px !important; }
.${p.cssClass}-radar-section { display: flex !important; flex-direction: column !important; gap: 30px !important; }
.${p.cssClass}-radar-container { position: relative !important; width: 100% !important; max-width: 320px !important; margin: 0 auto !important; aspect-ratio: 1 !important; }
.${p.cssClass}-radar-svg { width: 100% !important; height: 100% !important; }
.${p.cssClass}-radar-data { animation: ${p.cssClass}RadarPulse 3s ease-in-out infinite !important; }

@keyframes ${p.cssClass}RadarPulse {
    0%, 100% { opacity: 0.85; }
    50% { opacity: 1; }
}

.${p.cssClass}-radar-labels { position: absolute !important; top: 0 !important; left: 0 !important; width: 100% !important; height: 100% !important; pointer-events: none !important; }
.${p.cssClass}-radar-label { position: absolute !important; display: flex !important; flex-direction: column !important; align-items: center !important; transform: translate(-50%, -50%) !important; }
.${p.cssClass}-radar-label .label-name { font-size: 0.75rem !important; font-weight: 600 !important; color: ${c.heading} !important; text-transform: uppercase !important; letter-spacing: 0.5px !important; }
.${p.cssClass}-radar-label .label-value { font-size: 0.65rem !important; color: ${c.accent} !important; font-weight: 500 !important; }
.${p.cssClass}-radar-label.pos-0 { top: 2%; left: 50%; }
.${p.cssClass}-radar-label.pos-1 { top: 28%; left: 96%; }
.${p.cssClass}-radar-label.pos-2 { top: 88%; left: 82%; }
.${p.cssClass}-radar-label.pos-3 { top: 88%; left: 18%; }
.${p.cssClass}-radar-label.pos-4 { top: 28%; left: 4%; }

/* Crystal Shard Notes */
.${p.cssClass}-ingredients { flex: 1 !important; min-width: 300px !important; }
.${p.cssClass}-crystal-notes { display: flex !important; flex-direction: column !important; gap: 25px !important; }
.${p.cssClass}-note-tier { margin-bottom: 10px !important; }
.${p.cssClass}-tier-label { display: flex !important; align-items: center !important; gap: 8px !important; font-size: 0.85rem !important; font-weight: 600 !important; color: ${c.heading} !important; text-transform: uppercase !important; letter-spacing: 1px !important; margin-bottom: 12px !important; }
.${p.cssClass}-tier-icon { font-size: 1rem !important; }
.${p.cssClass}-tier-time { font-size: 0.7rem !important; color: ${c.accent} !important; font-weight: 400 !important; margin-left: auto !important; }
.${p.cssClass}-crystal-grid { display: flex !important; gap: 12px !important; flex-wrap: wrap !important; }
.${p.cssClass}-crystal-card {
    background: linear-gradient(135deg, rgba(255,255,255,0.8), rgba(${c.rgb_accent},0.06)) !important;
    backdrop-filter: blur(10px) !important;
    border: 1px solid rgba(${c.rgb_accent},0.2) !important;
    border-radius: 16px !important;
    padding: 16px 20px !important;
    display: flex !important; flex-direction: column !important; align-items: center !important; gap: 6px !important;
    flex: 1 !important; min-width: 90px !important;
    transition: transform 0.3s ease, box-shadow 0.3s ease !important;
    position: relative !important; overflow: hidden !important;
}
.${p.cssClass}-crystal-card::before {
    content: '' !important; position: absolute !important; top: -50% !important; left: -50% !important;
    width: 200% !important; height: 200% !important;
    background: linear-gradient(45deg, transparent 40%, rgba(${c.rgb_accent},0.08) 50%, transparent 60%) !important;
    animation: ${p.cssClass}CrystalShimmer 4s ease-in-out infinite !important;
}
@keyframes ${p.cssClass}CrystalShimmer {
    0% { transform: translateX(-100%) rotate(45deg); }
    100% { transform: translateX(100%) rotate(45deg); }
}
.${p.cssClass}-crystal-card:hover { transform: translateY(-5px) scale(1.05) !important; box-shadow: 0 12px 30px rgba(${c.rgb_accent},0.2) !important; }
.${p.cssClass}-crystal-emoji { font-size: 1.8rem !important; position: relative !important; z-index: 1 !important; }
.${p.cssClass}-crystal-name { font-size: 0.8rem !important; font-weight: 600 !important; color: ${c.dark} !important; position: relative !important; z-index: 1 !important; }
.${p.cssClass}-crystal-intensity { font-size: 0.65rem !important; color: ${c.accent} !important; text-transform: uppercase !important; letter-spacing: 0.5px !important; position: relative !important; z-index: 1 !important; }

/* Metrics */
.${p.cssClass}-metrics { display: flex !important; flex-direction: column !important; gap: 16px !important; }
.${p.cssClass}-metric-item { display: flex !important; align-items: center !important; gap: 12px !important; }
.${p.cssClass}-fill { background: linear-gradient(90deg, ${c.accent}, ${c.light}) !important; border-radius: 10px !important; height: 100% !important; transition: width 1s ease !important; }

/* Description */
.${p.cssClass}-fragrance-description { background: rgba(255,255,255,0.5) !important; backdrop-filter: blur(15px) !important; border: 1px solid rgba(${c.rgb_accent},0.15) !important; border-radius: 20px !important; padding: 35px !important; }
.${p.cssClass}-description-title { color: ${c.heading} !important; font-family: 'Playfair Display', serif !important; font-size: 1.4rem !important; margin-bottom: 5px !important; }
.${p.cssClass}-description-subtitle { color: ${c.accent} !important; font-size: 0.85rem !important; margin-bottom: 20px !important; }
.${p.cssClass}-description-text { color: ${c.dark} !important; line-height: 1.8 !important; margin-bottom: 15px !important; }
.${p.cssClass}-description-text strong { color: ${c.heading} !important; }

/* Rating Bars */
.${p.cssClass}-additional-ratings { display: flex !important; flex-direction: column !important; gap: 25px !important; }
.${p.cssClass}-rating-row { display: flex !important; gap: 25px !important; flex-wrap: wrap !important; }
.${p.cssClass}-rating-category { flex: 1 !important; min-width: 280px !important; background: rgba(255,255,255,0.5) !important; backdrop-filter: blur(10px) !important; border: 1px solid rgba(${c.rgb_accent},0.15) !important; border-radius: 16px !important; padding: 20px !important; }
.${p.cssClass}-category-header { display: flex !important; align-items: center !important; gap: 8px !important; margin-bottom: 15px !important; }
.${p.cssClass}-category-title { font-size: 0.8rem !important; font-weight: 700 !important; letter-spacing: 2px !important; color: ${c.heading} !important; }
.${p.cssClass}-category-icon { font-size: 1rem !important; }
.${p.cssClass}-no-vote { font-size: 0.7rem !important; color: ${c.accent} !important; margin-left: auto !important; }
.${p.cssClass}-rating-bars { display: flex !important; flex-direction: column !important; gap: 8px !important; }
.${p.cssClass}-rating-item { display: flex !important; align-items: center !important; gap: 10px !important; }
.${p.cssClass}-rating-label { font-size: 0.72rem !important; color: ${c.secondary} !important; min-width: 85px !important; text-align: right !important; }
.${p.cssClass}-rating-bar { flex: 1 !important; height: 8px !important; background: rgba(${c.rgb_accent},0.1) !important; border-radius: 10px !important; overflow: hidden !important; }
.${p.cssClass}-bar-fill { height: 100% !important; border-radius: 10px !important; transition: width 0.8s ease !important; }
.${p.cssClass}-rating-count { font-size: 0.7rem !important; color: ${c.accent} !important; min-width: 35px !important; }

/* Reddit Review */
.${p.cssClass}-reddit-review-container { margin-top: 10px !important; }
.${p.cssClass}-reddit-card { background: rgba(255,255,255,0.6) !important; backdrop-filter: blur(15px) !important; border: 1px solid rgba(${c.rgb_accent},0.2) !important; border-radius: 16px !important; padding: 25px !important; overflow: hidden !important; }
.${p.cssClass}-reddit-header { display: flex !important; align-items: center !important; gap: 15px !important; margin-bottom: 15px !important; padding-bottom: 12px !important; border-bottom: 1px solid rgba(${c.rgb_accent},0.1) !important; }
.${p.cssClass}-reddit-votes { display: flex !important; flex-direction: column !important; align-items: center !important; gap: 3px !important; }
.${p.cssClass}-vote-btn { background: none !important; border: none !important; color: ${c.accent} !important; cursor: pointer !important; font-size: 0.8rem !important; padding: 2px !important; }
.${p.cssClass}-vote-count { font-size: 0.85rem !important; font-weight: 700 !important; color: ${c.heading} !important; }
.${p.cssClass}-subreddit { font-weight: 700 !important; color: ${c.heading} !important; font-size: 0.85rem !important; }
.${p.cssClass}-post-dot { color: ${c.accent} !important; margin: 0 5px !important; }
.${p.cssClass}-post-info, .${p.cssClass}-post-time { color: ${c.secondary} !important; font-size: 0.75rem !important; }
.${p.cssClass}-user-avatar img { width: 36px !important; height: 36px !important; border-radius: 50% !important; }
.${p.cssClass}-reddit-user { display: flex !important; align-items: center !important; gap: 10px !important; margin-bottom: 12px !important; }
.${p.cssClass}-user-details { display: flex !important; flex-direction: column !important; }
.${p.cssClass}-username { font-weight: 600 !important; color: ${c.heading} !important; font-size: 0.85rem !important; }
.${p.cssClass}-reddit-text p { color: ${c.dark} !important; line-height: 1.7 !important; font-style: italic !important; }
.${p.cssClass}-reddit-engagement { display: flex !important; gap: 20px !important; margin-top: 15px !important; padding-top: 12px !important; border-top: 1px solid rgba(${c.rgb_accent},0.1) !important; }
.${p.cssClass}-engagement-item { display: flex !important; align-items: center !important; gap: 5px !important; font-size: 0.8rem !important; color: ${c.secondary} !important; }

/* Mood/Season Indicators */
.${p.cssClass}-perfume-rating { padding: 30px 0 !important; }
.${p.cssClass}-rating-indicators { display: flex !important; gap: 30px !important; flex-wrap: wrap !important; margin-bottom: 25px !important; }
.${p.cssClass}-mood-indicators, .${p.cssClass}-seasonal-indicators { display: flex !important; gap: 12px !important; flex-wrap: wrap !important; }
.${p.cssClass}-indicator-item { display: flex !important; flex-direction: column !important; align-items: center !important; gap: 5px !important; opacity: 0.4 !important; transition: opacity 0.3s ease !important; }
.${p.cssClass}-indicator-item.active { opacity: 1 !important; }
.${p.cssClass}-indicator-icon { font-size: 1.3rem !important; }
.${p.cssClass}-indicator-label { font-size: 0.65rem !important; text-transform: uppercase !important; letter-spacing: 0.5px !important; color: ${c.secondary} !important; }
.${p.cssClass}-indicator-bar { width: 30px !important; height: 3px !important; background: rgba(${c.rgb_accent},0.2) !important; border-radius: 2px !important; }
.${p.cssClass}-indicator-item.active .${p.cssClass}-indicator-bar { background: ${c.accent} !important; }
.${p.cssClass}-rating-title { font-size: 1rem !important; color: ${c.dark} !important; font-weight: 400 !important; }
.${p.cssClass}-score { font-weight: 700 !important; color: ${c.heading} !important; font-size: 1.3rem !important; }
.${p.cssClass}-votes { font-weight: 600 !important; color: ${c.accent} !important; }
.${p.cssClass}-perfume-description p { color: ${c.dark} !important; line-height: 1.7 !important; margin-top: 15px !important; }
.${p.cssClass}-perfume-description strong { color: ${c.heading} !important; }

/* Favourite & Cart Buttons */
.${p.cssClass}-theme .favorite-btn { color: ${c.heading} !important; border: 1px solid rgba(${c.rgb_accent}, 0.3) !important; background: transparent !important; }
.${p.cssClass}-theme .favorite-btn:hover { background: rgba(${c.rgb_accent}, 0.08) !important; border-color: ${c.accent} !important; color: ${c.heading} !important; box-shadow: 0 4px 20px rgba(${c.rgb_accent}, 0.2) !important; }
.${p.cssClass}-theme .favorite-btn .heart-outline, .${p.cssClass}-theme .favorite-btn .heart-filled { color: ${c.accent} !important; }
.${p.cssClass}-theme .favorite-btn.favorited { background: rgba(${c.rgb_accent}, 0.06) !important; border-color: ${c.accent} !important; color: ${c.heading} !important; }
.${p.cssClass}-theme .add-to-cart-btn { color: ${c.heading} !important; border: 1px solid rgba(${c.rgb_accent}, 0.3) !important; background: transparent !important; }
.${p.cssClass}-theme .add-to-cart-btn:hover { background: rgba(${c.rgb_accent}, 0.08) !important; border-color: ${c.accent} !important; box-shadow: 0 4px 20px rgba(${c.rgb_accent}, 0.2) !important; }
.${p.cssClass}-theme .add-to-cart-btn .cart-icon svg { color: ${c.heading} !important; stroke: ${c.heading} !important; }
.${p.cssClass}-theme .add-to-cart-btn.added { border-color: rgba(229, 72, 77, 0.3) !important; color: #dc3545 !important; }

/* Price Section */
.${p.cssClass}-theme .product-price { color: #fff !important; text-shadow: 0 1px 3px rgba(0,0,0,0.2) !important; }
.${p.cssClass}-theme .price-currency, .${p.cssClass}-theme .price-unit { color: rgba(255,255,255,0.85) !important; }
.${p.cssClass}-theme .price-subtitle { color: rgba(${c.rgb_accent}, 0.5) !important; letter-spacing: 3px !important; }
.${p.cssClass}-theme .price-ornament { border-color: rgba(${c.rgb_accent}, 0.35) !important; }
.${p.cssClass}-theme .price-badge:hover .price-ornament { border-color: ${c.accent} !important; }

/* Card Enhancements */
.${p.cssClass}-theme .product-actions-buttons { position: relative !important; }
.${p.cssClass}-theme .product-actions-buttons::before { content: '' !important; position: absolute !important; top: -15px !important; left: 15% !important; right: 15% !important; height: 1px !important; background: linear-gradient(90deg, transparent, rgba(${c.rgb_accent}, 0.25), transparent) !important; }

/* Responsive */
@media (max-width: 768px) {
    .${p.cssClass}-product-section { flex-direction: column !important; text-align: center !important; }
    .${p.cssClass}-image { width: 250px !important; }
    .${p.cssClass}-profiles-container { flex-direction: row !important; flex-wrap: nowrap !important; overflow-x: auto !important; }
    .${p.cssClass}-rating-row { flex-direction: column !important; }
}
`;
}


// =========================================================================
// EXECUTE: Generate all files
// =========================================================================

// 1. Generate HTML for all perfumes
let allHTML = '';
for (const p of newPerfumes) {
    allHTML += generatePerfumeHTML(p);
}
fs.writeFileSync('new-perfumes-html.txt', allHTML);
console.log('Generated HTML for ' + newPerfumes.length + ' perfumes → new-perfumes-html.txt');

// 2. Generate CSS files
for (const p of newPerfumes) {
    const cssContent = generatePerfumeCSS(p);
    const cssFile = `css/${p.cssClass}-profile.css`;
    fs.writeFileSync(cssFile, cssContent);
    console.log('Created ' + cssFile);
}

// 3. Output the list of new fragrance IDs for script.js update
console.log('\nNew fragrance IDs to add to script.js arrays:');
console.log(newPerfumes.map(p => `"${p.id}"`).join(', '));

// 4. Output CSS link tags for index.html head
console.log('\nCSS link tags for <head>:');
for (const p of newPerfumes) {
    console.log(`<link rel="stylesheet" href="css/${p.cssClass}-profile.css" />`);
}

console.log('\nDone! Now inject the HTML from new-perfumes-html.txt into index.html before the final empty sections.');
