const fs = require('fs');

// ============================================================================
// MEGA PERFUME EXPANSION — Generate 30 new perfumes
// ============================================================================

const newPerfumes = [
  // Dior
  { id: 'diorhomme', brand: 'DIOR', location: 'PARIS', name: 'Homme Intense', price: 50, image: 'dior-homme-intense.png', accent: '#4a4a6a', accent2: '#7a7aa0', bgColor: '#0a0a14', rating: '4.35', votes: '8,200', description: '<strong>Dior Homme Intense</strong> by <strong>Dior</strong> is an Iris Amber fragrance. It was launched in 2011. The nose behind this fragrance is François Demachy.', topNotes: ['Iris', 'Lavender', 'Pear'], midNotes: ['Cedar', 'Vetiver', 'Virginia Cedar'], baseNotes: ['Musk', 'Vanilla', 'Leather'], scentData: { woody: 85, floral: 90, powdery: 70, fresh: 40, sweet: 55 }, redditQuote: '"Dior Homme Intense is liquid elegance. The iris note is absolutely divine — sophisticated, powdery, and incredibly refined. This is what a well-dressed man smells like."', moods: ['love', 'like'], seasons: ['spring', 'fall', 'night'] },
  // Chanel
  { id: 'allure', brand: 'CHANEL', location: 'PARIS', name: 'Allure Homme Sport', price: 50, image: 'chanel-allure-sport.png', accent: '#8b8b8b', accent2: '#c0c0c0', bgColor: '#0f0f0f', rating: '4.18', votes: '7,500', description: '<strong>Allure Homme Sport</strong> by <strong>Chanel</strong> is an Aromatic Woody fragrance. It was launched in 2004.', topNotes: ['Orange', 'Aldehydes', 'Sea Notes'], midNotes: ['Pepper', 'Cedar', 'Neroli'], baseNotes: ['Tonka Bean', 'Musk', 'Vanilla'], scentData: { woody: 70, fresh: 85, citrus: 80, aromatic: 60, spicy: 45 }, redditQuote: '"Allure Homme Sport is the definition of clean, sporty masculinity. Perfect for the gym, the office, or a casual date. Versatility king."', moods: ['like', 'love'], seasons: ['spring', 'summer', 'day'] },
  // Tom Ford
  { id: 'tuscanleather', brand: 'TOM FORD', location: 'NEW YORK', name: 'Tuscan Leather', price: 65, image: 'tom-ford-tuscan-leather.png', accent: '#8b4513', accent2: '#a0522d', bgColor: '#1a0e08', rating: '4.41', votes: '9,100', description: '<strong>Tuscan Leather</strong> by <strong>Tom Ford</strong> is a Leather Chypre fragrance. It was launched in 2007.', topNotes: ['Raspberry', 'Saffron', 'Thyme'], midNotes: ['Olibanum', 'Night Blooming Jasmine', 'Leather'], baseNotes: ['Amber', 'Woody Notes', 'Suede'], scentData: { leather: 95, woody: 70, fruity: 55, spicy: 65, smoky: 80 }, redditQuote: '"Tuscan Leather is a leather bomb in the best possible way. It opens with this gorgeous raspberry-saffron combo that dries down into the most luxurious leather scent. Beast mode performance."', moods: ['love'], seasons: ['fall', 'winter', 'night'] },
  // Armani
  { id: 'armanicode', brand: 'GIORGIO ARMANI', location: 'MILANO', name: 'Armani Code Absolu', price: 45, image: 'armani-code-absolu.png', accent: '#6b3a5a', accent2: '#9e5a85', bgColor: '#12060e', rating: '4.12', votes: '5,800', description: '<strong>Armani Code Absolu</strong> by <strong>Giorgio Armani</strong> is an Oriental Spicy fragrance. It was launched in 2019.', topNotes: ['Mandarin Orange', 'Green Apple'], midNotes: ['Orange Blossom', 'Nutmeg', 'Carrot Seeds'], baseNotes: ['Suede', 'Tonka Bean', 'Vanilla'], scentData: { sweet: 85, spicy: 70, woody: 60, warm: 80, aromatic: 50 }, redditQuote: '"Armani Code Absolu is the ultimate date night fragrance. Sweet, warm, inviting — it gets compliments like nothing else. The suede and tonka dry down is addictive."', moods: ['love', 'like'], seasons: ['fall', 'winter', 'night'] },
  // Guerlain
  { id: 'lhommeideal', brand: 'GUERLAIN', location: 'PARIS', name: "L'Homme Idéal EDP", price: 50, image: 'guerlain-lhomme-ideal.png', accent: '#6b4226', accent2: '#9c6b44', bgColor: '#140d06', rating: '4.28', votes: '6,400', description: "<strong>L'Homme Idéal</strong> Eau de Parfum by <strong>Guerlain</strong> is an Oriental Leather fragrance. It was launched in 2016.", topNotes: ['Cinnamon', 'Almond', 'Pepper'], midNotes: ['Bulgarian Rose', 'Leather', 'Incense'], baseNotes: ['Vanilla', 'Sandalwood', 'Tonka Bean'], scentData: { leather: 80, sweet: 75, spicy: 85, woody: 65, warm: 90 }, redditQuote: '"L\'Homme Idéal EDP is cherry almond pie in perfume form with a gorgeous leather backbone. Warm, gourmand, and incredibly seductive. A masterpiece from Guerlain."', moods: ['love'], seasons: ['fall', 'winter', 'night'] },
  // Hermès
  { id: 'terredhermes', brand: 'HERMÈS', location: 'PARIS', name: "Terre d'Hermès", price: 55, image: 'terre-dhermes.png', accent: '#b85c1e', accent2: '#d47a34', bgColor: '#1a0e04', rating: '4.32', votes: '11,200', description: "<strong>Terre d'Hermès</strong> by <strong>Hermès</strong> is a Woody Spicy fragrance. It was launched in 2006. The nose behind this fragrance is Jean-Claude Ellena.", topNotes: ['Orange', 'Grapefruit', 'Flint'], midNotes: ['Pelargonium', 'Pepper', 'Patchouli'], baseNotes: ['Cedar', 'Vetiver', 'Benzoin'], scentData: { earthy: 90, woody: 85, citrus: 70, spicy: 60, mineral: 75 }, redditQuote: '"Terre d\'Hermès is the definition of sophisticated elegance. Earthy, mineral, woody — it smells like the earth after rain mixed with expensive wood. A modern classic."', moods: ['like', 'love'], seasons: ['spring', 'fall', 'day'] },
  // Givenchy
  { id: 'gentleman', brand: 'GIVENCHY', location: 'PARIS', name: 'Gentleman EDP', price: 45, image: 'givenchy-gentleman.png', accent: '#3d3d5c', accent2: '#5c5c8a', bgColor: '#0a0a14', rating: '4.15', votes: '4,900', description: '<strong>Gentleman</strong> Eau de Parfum by <strong>Givenchy</strong> is an Oriental Floral fragrance. It was launched in 2018.', topNotes: ['Lavender', 'Pepper', 'Cardamom'], midNotes: ['Iris', 'Orange Blossom', 'Orris'], baseNotes: ['Patchouli', 'Leather', 'Black Vanilla'], scentData: { floral: 75, woody: 70, powdery: 80, warm: 65, spicy: 55 }, redditQuote: '"Givenchy Gentleman EDP is refined without being boring. The iris-patchouli combo gives it depth, while the lavender keeps it fresh. Perfect for the office or dinner."', moods: ['like'], seasons: ['spring', 'fall', 'night'] },
  // Azzaro  
  { id: 'wantedbynight', brand: 'AZZARO', location: 'PARIS', name: 'The Most Wanted', price: 40, image: 'azzaro-most-wanted.png', accent: '#c0392b', accent2: '#e74c3c', bgColor: '#1a0505', rating: '4.08', votes: '3,800', description: '<strong>The Most Wanted</strong> by <strong>Azzaro</strong> is an Amber Spicy fragrance. It was launched in 2021.', topNotes: ['Cardamom', 'Ginger', 'Lavender'], midNotes: ['Toffee', 'Vetiver', 'Juniper'], baseNotes: ['Amber', 'Patchouli', 'Vanilla'], scentData: { sweet: 80, spicy: 85, warm: 90, woody: 55, aromatic: 60 }, redditQuote: '"The Most Wanted is Azzaro\'s masterpiece. Cardamom and toffee create an irresistible sweetness that is not cloying. Incredible projection beast."', moods: ['love', 'like'], seasons: ['fall', 'winter', 'night'] },
  // Dolce & Gabbana
  { id: 'kbyDG', brand: 'DOLCE & GABBANA', location: 'MILANO', name: 'K by Dolce & Gabbana', price: 40, image: 'k-by-dg.png', accent: '#d4a017', accent2: '#e6b422', bgColor: '#14100a', rating: '4.05', votes: '3,600', description: '<strong>K by Dolce & Gabbana</strong> is a Woody Aromatic fragrance. It was launched in 2019.', topNotes: ['Blood Orange', 'Juniper', 'Sicilian Lemon'], midNotes: ['Clary Sage', 'Pimento', 'Geranium'], baseNotes: ['Cedarwood', 'Vetiver', 'Patchouli'], scentData: { citrus: 85, aromatic: 80, woody: 75, fresh: 70, spicy: 45 }, redditQuote: '"K by D&G is a great everyday scent. Fresh citrus opening that dries into a nice woody base. Very versatile and gets a surprising amount of compliments."', moods: ['like'], seasons: ['spring', 'summer', 'day'] },
  // Issey Miyake
  { id: 'leaudissey', brand: 'ISSEY MIYAKE', location: 'TOKYO', name: "L'Eau d'Issey Pour Homme", price: 35, image: 'issey-miyake-pour-homme.png', accent: '#2e86c1', accent2: '#5dade2', bgColor: '#04101a', rating: '4.20', votes: '10,500', description: "<strong>L'Eau d'Issey Pour Homme</strong> by <strong>Issey Miyake</strong> is an Aromatic Aquatic fragrance. It was launched in 1994.", topNotes: ['Yuzu', 'Cypress', 'Mandarin Orange'], midNotes: ['Water Lily', 'Cinnamon', 'Geranium'], baseNotes: ['Musk', 'Sandalwood', 'Tobacco'], scentData: { aquatic: 90, citrus: 85, fresh: 80, woody: 55, aromatic: 65 }, redditQuote: '"L\'Eau d\'Issey is a timeless classic. Aquatic freshness done perfectly — clean, sophisticated, and still relevant after 30 years. A must-have in any collection."', moods: ['like'], seasons: ['spring', 'summer', 'day'] },
  // Carolina Herrera
  { id: 'chbadboy', brand: 'CAROLINA HERRERA', location: 'NEW YORK', name: 'Bad Boy', price: 45, image: 'carolina-herrera-bad-boy.png', accent: '#1a5276', accent2: '#2e86c1', bgColor: '#04080e', rating: '4.00', votes: '4,200', description: '<strong>Bad Boy</strong> by <strong>Carolina Herrera</strong> is an Oriental Spicy fragrance. It was launched in 2019.', topNotes: ['Black Pepper', 'Bergamot', 'Green Accord'], midNotes: ['Sage', 'Cedar', 'Vetiver'], baseNotes: ['Tonka Bean', 'Cacao', 'Amber'], scentData: { spicy: 80, woody: 75, sweet: 70, aromatic: 65, dark: 60 }, redditQuote: '"Bad Boy smells expensive and modern. The black pepper-tonka combo is addictive. Great club fragrance that lasts all night."', moods: ['like'], seasons: ['fall', 'winter', 'night'] },
  // Yves Saint Laurent
  { id: 'ysllibre', brand: 'YVES SAINT LAURENT', location: 'PARIS', name: 'Libre EDP', price: 50, image: 'ysl-libre.png', accent: '#d4a574', accent2: '#e8c8a0', bgColor: '#140e08', rating: '4.30', votes: '7,800', description: '<strong>Libre</strong> EDP by <strong>Yves Saint Laurent</strong> is a Fougère Floral fragrance launched in 2019. The nose behind is Anne Flipo and Carlos Benaim.', topNotes: ['Lavender', 'Mandarin Orange', 'Black Currant'], midNotes: ['Orange Blossom', 'Jasmine', 'Orchid'], baseNotes: ['Madagascar Vanilla', 'Musk', 'Cedar'], scentData: { floral: 85, aromatic: 75, vanilla: 80, fresh: 65, warm: 70 }, redditQuote: '"Libre is the perfect fusion of masculine and feminine. The lavender-orange blossom-vanilla combo is stunning. Wear it with confidence — compliment magnet."', moods: ['love', 'like'], seasons: ['fall', 'spring', 'night'] },
  // Maison Margiela
  { id: 'fireplace', brand: 'MAISON MARGIELA', location: 'PARIS', name: 'By the Fireplace', price: 55, image: 'margiela-fireplace.png', accent: '#b5651d', accent2: '#d4883e', bgColor: '#1a0e04', rating: '4.38', votes: '8,900', description: '<strong>By the Fireplace</strong> by <strong>Maison Margiela</strong> is an Aromatic Spicy fragrance. It was launched in 2015.', topNotes: ['Cloves', 'Pink Pepper', 'Orange'], midNotes: ['Chestnut', 'Guaiac Wood', 'Juniper'], baseNotes: ['Vanilla', 'Peru Balsam', 'Cashmeran'], scentData: { smoky: 90, sweet: 80, spicy: 75, woody: 70, warm: 85 }, redditQuote: '"By the Fireplace literally smells like sitting by a crackling fire with a glass of bourbon. The smoky chestnut-vanilla combo is pure comfort in a bottle."', moods: ['love'], seasons: ['winter', 'fall', 'night'] },
  // Prada
  { id: 'pradacarbon', brand: 'PRADA', location: 'MILANO', name: 'Luna Rossa Carbon', price: 45, image: 'prada-luna-rossa-carbon.png', accent: '#555555', accent2: '#888888', bgColor: '#0a0a0a', rating: '4.10', votes: '6,300', description: '<strong>Luna Rossa Carbon</strong> by <strong>Prada</strong> is an Aromatic Fougère fragrance. It was launched in 2017.', topNotes: ['Bergamot', 'Pepper', 'Lavender'], midNotes: ['Metallic Notes', 'Patchouli'], baseNotes: ['Ambroxan', 'Dry Wood'], scentData: { aromatic: 85, metallic: 75, fresh: 70, woody: 65, clean: 80 }, redditQuote: '"Luna Rossa Carbon is essentially Sauvage\'s cooler brother. Metallic lavender with ambroxan gives it amazing projection. The ultimate safe blind buy."', moods: ['like'], seasons: ['spring', 'summer', 'day'] },
  // Burberry
  { id: 'burberryhero', brand: 'BURBERRY', location: 'LONDON', name: 'Hero EDP', price: 45, image: 'burberry-hero.png', accent: '#8b7355', accent2: '#a89070', bgColor: '#120e0a', rating: '4.08', votes: '3,500', description: '<strong>Hero</strong> EDP by <strong>Burberry</strong> is a Woody Spicy fragrance. It was launched in 2022.', topNotes: ['Black Pepper', 'Elemi', 'Bergamot'], midNotes: ['Olibanum', 'Cardamom', 'Cedar'], baseNotes: ['Benzoin', 'Horse Chestnut', 'Ebony Wood'], scentData: { woody: 85, spicy: 70, warm: 75, aromatic: 60, earthy: 65 }, redditQuote: '"Hero EDP takes the original Hero and adds warmth and depth. The horse-chestnut cedar combo is truly unique. Elevated everyday fragrance."', moods: ['like'], seasons: ['fall', 'spring', 'day'] },
  // Narciso Rodriguez
  { id: 'narcisoforhim', brand: 'NARCISO RODRIGUEZ', location: 'NEW YORK', name: 'For Him Bleu Noir', price: 45, image: 'narciso-bleu-noir.png', accent: '#3d5c8b', accent2: '#5a7aaa', bgColor: '#060a14', rating: '4.22', votes: '5,600', description: '<strong>For Him Bleu Noir</strong> by <strong>Narciso Rodriguez</strong> is an Aromatic Woody fragrance. It was launched in 2018.', topNotes: ['Cardamom', 'Nutmeg', 'Blue Ebony'], midNotes: ['Musk', 'Cedar', 'Amber'], baseNotes: ['Ebony Wood', 'Vanilla', 'Leather'], scentData: { musky: 90, woody: 80, spicy: 55, warm: 70, clean: 65 }, redditQuote: '"Bleu Noir is the king of musks. Clean, sophisticated, and magnetic. People will lean in closer when you wear this. Office-safe with nighttime appeal."', moods: ['like', 'love'], seasons: ['fall', 'spring', 'night'] },
  // CK
  { id: 'cketernity', brand: 'CALVIN KLEIN', location: 'NEW YORK', name: 'Eternity for Men', price: 30, image: 'ck-eternity.png', accent: '#6b8e72', accent2: '#8ab090', bgColor: '#0a120a', rating: '4.05', votes: '12,000', description: '<strong>Eternity for Men</strong> by <strong>Calvin Klein</strong> is a Aromatic Fougère fragrance. It was launched in 1989.', topNotes: ['Lavender', 'Lemon', 'Mandarin Orange'], midNotes: ['Jasmine', 'Basil', 'Sage'], baseNotes: ['Sandalwood', 'Amber', 'Rosewood'], scentData: { aromatic: 80, fresh: 85, green: 70, woody: 60, floral: 55 }, redditQuote: '"Eternity is the definition of a timeless classic. Clean, fresh, elegant. It smelled amazing in 1989 and it smells amazing now. The ultimate gentleman fragrance."', moods: ['like'], seasons: ['spring', 'summer', 'day'] },
  // Gucci
  { id: 'gucciguilty', brand: 'GUCCI', location: 'FIRENZE', name: 'Guilty Pour Homme', price: 45, image: 'gucci-guilty.png', accent: '#8b7d6b', accent2: '#a89880', bgColor: '#110e0a', rating: '4.10', votes: '6,900', description: '<strong>Guilty Pour Homme</strong> by <strong>Gucci</strong> is an Aromatic Fougère fragrance. It was launched in 2011.', topNotes: ['Lavender', 'Lemon', 'Pink Pepper'], midNotes: ['Orange Blossom', 'French Orris'], baseNotes: ['Cedar', 'Patchouli', 'Amber'], scentData: { aromatic: 80, woody: 70, fresh: 75, spicy: 55, warm: 65 }, redditQuote: '"Gucci Guilty is smooth and refined. The lavender-patchouli combo is done perfectly. Great for date nights and leaves a lasting impression."', moods: ['like'], seasons: ['spring', 'fall', 'night'] },
  // Valentino
  { id: 'valentinodonna', brand: 'VALENTINO', location: 'ROMA', name: 'Born in Roma Donna', price: 50, image: 'valentino-donna.png', accent: '#d4697a', accent2: '#e8899a', bgColor: '#1a0810', rating: '4.25', votes: '5,200', description: '<strong>Born in Roma Donna</strong> by <strong>Valentino</strong> is a Floral Amber fragrance. It was launched in 2019.', topNotes: ['Pink Pepper', 'Blackcurrant', 'Bergamot'], midNotes: ['Jasmine Grandiflorum', 'Turkish Rose'], baseNotes: ['Vanilla', 'Cashmeran', 'Benzoin'], scentData: { floral: 90, sweet: 80, warm: 75, spicy: 55, woody: 50 }, redditQuote: '"Born in Roma Donna is pure luxury. The jasmine-vanilla combination is intoxicating but never overwhelming. This is what elegance smells like."', moods: ['love', 'like'], seasons: ['spring', 'fall', 'night'] },
  // Creed
  { id: 'greenirish', brand: 'CREED', location: 'PARIS', name: 'Green Irish Tweed', price: 65, image: 'creed-green-irish-tweed.png', accent: '#2d5a27', accent2: '#4a8a42', bgColor: '#060e04', rating: '4.40', votes: '10,800', description: '<strong>Green Irish Tweed</strong> by <strong>Creed</strong> is a Aromatic Green fragrance. It was launched in 1985.', topNotes: ['Lemon Verbena', 'Iris', 'Peppermint'], midNotes: ['Violet Leaf', 'Iris', 'Clary Sage'], baseNotes: ['Mysore Sandalwood', 'Ambergris', 'Oakmoss'], scentData: { green: 90, fresh: 85, aromatic: 75, woody: 60, earthy: 65 }, redditQuote: '"Green Irish Tweed is the quintessential gentleman\'s fragrance. Lush green meadows on a crisp morning. If sophistication had a smell, this would be it."', moods: ['like', 'love'], seasons: ['spring', 'summer', 'day'] },
  // Chanel
  { id: 'egoiste', brand: 'CHANEL', location: 'PARIS', name: 'Égoïste Platinum', price: 50, image: 'chanel-egoiste.png', accent: '#a0a0a8', accent2: '#c0c0c8', bgColor: '#0e0e12', rating: '4.15', votes: '7,200', description: '<strong>Égoïste Platinum</strong> by <strong>Chanel</strong> is a Woody Floral Musk fragrance. It was launched in 1993.', topNotes: ['Lavender', 'Rosemary', 'Neroli'], midNotes: ['Rose', 'Jasmine', 'Clary Sage'], baseNotes: ['Musk', 'Vetiver', 'Amber'], scentData: { aromatic: 80, fresh: 75, woody: 70, musky: 65, clean: 85 }, redditQuote: '"Égoïste Platinum is the ultimate clean-man scent. Understated, classy, and effortlessly masculine. The definition of less is more in perfumery."', moods: ['like'], seasons: ['spring', 'summer', 'day'] },
  // Thierry Mugler
  { id: 'amenpure', brand: 'MUGLER', location: 'PARIS', name: "A*Men Pure Havane", price: 45, image: 'mugler-pure-havane.png', accent: '#8b6914', accent2: '#aa8428', bgColor: '#120a02', rating: '4.35', votes: '6,100', description: "<strong>A*Men Pure Havane</strong> by <strong>Mugler</strong> is a Oriental Gourmand fragrance. It was launched in 2011.", topNotes: ['Tobacco', 'Cacao', 'Mint'], midNotes: ['Honey', 'Cinnamon', 'Heliotrope'], baseNotes: ['Vanilla', 'Tonka Bean', 'Guaiac Wood'], scentData: { sweet: 90, tobacco: 85, warm: 80, gourmand: 90, woody: 55 }, redditQuote: '"Pure Havane is like smoking a cigar dipped in honey next to a vanilla factory. In the best way possible. This is comfort in a bottle, pure indulgence."', moods: ['love'], seasons: ['winter', 'fall', 'night'] },
  // Cartier
  { id: 'declarationcartier', brand: 'CARTIER', location: 'PARIS', name: "Déclaration d'un Soir", price: 45, image: 'cartier-declaration.png', accent: '#b84040', accent2: '#d45050', bgColor: '#14060a', rating: '4.18', votes: '4,500', description: "<strong>Déclaration d'un Soir</strong> by <strong>Cartier</strong> is a Oriental Woody fragrance. It was launched in 2012.", topNotes: ['Bitter Orange', 'Black Currant', 'Cumin'], midNotes: ['Rose', 'Cardamom', 'Cypriol'], baseNotes: ['Musk', 'Cedar', 'Sandalwood'], scentData: { oriental: 80, spicy: 75, woody: 70, warm: 85, aromatic: 60 }, redditQuote: '"Déclaration d\'un Soir is criminally underrated. Spicy, warm, mysterious — it smells way more expensive than it is. A hidden gem for evening wear."', moods: ['like'], seasons: ['fall', 'winter', 'night'] },
  // Rasasi
  { id: 'laween', brand: 'RASASI', location: 'DUBAI', name: 'La Yuqawam', price: 40, image: 'rasasi-la-yuqawam.png', accent: '#6b3a2e', accent2: '#8b5040', bgColor: '#140806', rating: '4.30', votes: '3,900', description: '<strong>La Yuqawam</strong> by <strong>Rasasi</strong> is a Leather Oriental fragrance. It was launched in 2014.', topNotes: ['Cinnamon', 'Ginger', 'Green Apple'], midNotes: ['Oud', 'Saffron', 'Turkish Rose'], baseNotes: ['Leather', 'Agarwood', 'Benzoin'], scentData: { leather: 90, oud: 85, spicy: 80, warm: 75, smoky: 70 }, redditQuote: '"La Yuqawam is the Tuscan Leather killer at a fraction of the price. Rich, deep leather with oud — if you love Tom Ford but not the price tag, this is it."', moods: ['love'], seasons: ['winter', 'fall', 'night'] },
  // Mancera
  { id: 'cedarsmancera', brand: 'MANCERA', location: 'PARIS', name: 'Cedrat Boisé', price: 45, image: 'mancera-cedrat-boise.png', accent: '#5a8a3a', accent2: '#7aaa5a', bgColor: '#0a1206', rating: '4.25', votes: '5,100', description: '<strong>Cedrat Boisé</strong> by <strong>Mancera</strong> is a Citrus Aromatic fragrance. It was launched in 2012.', topNotes: ['Lemon', 'Black Currant', 'Sicilian Citrus'], midNotes: ['Spice Blend', 'Patchouli Leaf'], baseNotes: ['White Musk', 'Leather', 'Vanilla'], scentData: { citrus: 90, fresh: 80, woody: 65, aromatic: 70, spicy: 55 }, redditQuote: '"Cedrat Boisé is citrus perfection. Sicilian lemon with leather and patchouli — it is incredibly versatile and lasts forever. Best value in niche perfumery."', moods: ['like', 'love'], seasons: ['spring', 'summer', 'day'] },
  // Amouage
  { id: 'reflectionman', brand: 'AMOUAGE', location: 'MUSCAT', name: 'Reflection Man', price: 60, image: 'amouage-reflection-man.png', accent: '#8a8ac0', accent2: '#a0a0d0', bgColor: '#0a0a18', rating: '4.38', votes: '6,800', description: '<strong>Reflection Man</strong> by <strong>Amouage</strong> is a Woody Floral fragrance. It was launched in 2007.', topNotes: ['Rosemary', 'Neroli', 'Pink Pepper'], midNotes: ['Jasmine', 'Iris', 'Ylang Ylang'], baseNotes: ['Sandalwood', 'Cedar', 'Vetiver'], scentData: { floral: 85, fresh: 80, woody: 75, clean: 90, aromatic: 60 }, redditQuote: '"Reflection Man smells like walking through a pristine garden in a perfectly tailored white linen suit. Pure class, pure refinement. Nothing comes close."', moods: ['like', 'love'], seasons: ['spring', 'summer', 'day'] },
  // Parfums de Marly
  { id: 'sedley', brand: 'PARFUMS DE MARLY', location: 'PARIS', name: 'Sedley', price: 60, image: 'pdm-sedley.png', accent: '#3a8a6a', accent2: '#58aa8a', bgColor: '#061208', rating: '4.20', votes: '3,200', description: '<strong>Sedley</strong> by <strong>Parfums de Marly</strong> is a Citrus Aromatic fragrance. It was launched in 2019.', topNotes: ['Spearmint', 'Bergamot', 'Lemon'], midNotes: ['Geranium', 'Lavender', 'Black Currant'], baseNotes: ['Sandalwood', 'Musk', 'Woody Notes'], scentData: { fresh: 90, citrus: 85, minty: 80, aromatic: 70, woody: 55 }, redditQuote: '"Sedley is like a mojito in a bottle but classier. The spearmint-bergamot combo is incredibly refreshing. Perfect summer gem from the Marly house."', moods: ['like'], seasons: ['spring', 'summer', 'day'] },
  // Initio
  { id: 'sideeffect', brand: 'INITIO', location: 'PARIS', name: 'Side Effect', price: 60, image: 'initio-side-effect.png', accent: '#8b3a3a', accent2: '#aa5555', bgColor: '#180606', rating: '4.42', votes: '4,600', description: '<strong>Side Effect</strong> by <strong>Initio</strong> is an Amber Vanilla fragrance. It was launched in 2018.', topNotes: ['Rum', 'Cinnamon', 'Saffron'], midNotes: ['Tobacco', 'Benzoin', 'Hedione'], baseNotes: ['Vanilla', 'Musk', 'Birch'], scentData: { boozy: 90, sweet: 85, warm: 90, tobacco: 80, spicy: 70 }, redditQuote: '"Side Effect is like being hugged by a warm blanket soaked in rum and vanilla next to a fire. Absolutely intoxicating. One spray and you are hooked for life."', moods: ['love'], seasons: ['winter', 'fall', 'night'] },
  // Xerjoff
  { id: 'naxos', brand: 'XERJOFF', location: 'TORINO', name: 'Naxos', price: 65, image: 'xerjoff-naxos.png', accent: '#c4944a', accent2: '#d4a85a', bgColor: '#140e04', rating: '4.45', votes: '5,500', description: '<strong>Naxos</strong> by <strong>Xerjoff</strong> is a Amber Aromatic fragrance. It was launched in 2015.', topNotes: ['Lavender', 'Bergamot', 'Lemon'], midNotes: ['Honey', 'Cinnamon', 'Jasmine'], baseNotes: ['Tobacco', 'Vanilla', 'Tonka Bean'], scentData: { tobacco: 85, honey: 90, aromatic: 80, sweet: 85, warm: 90 }, redditQuote: '"Naxos is honey-tobacco perfection. Like a decadent Italian pastry shop meets a fine cigar lounge. Once you smell this, every other tobacco fragrance feels incomplete."', moods: ['love'], seasons: ['fall', 'winter', 'night'] },
  // MFK
  { id: 'grandSoir', brand: 'MAISON FRANCIS KURKDJIAN', location: 'PARIS', name: 'Grand Soir', price: 65, image: 'mfk-grand-soir.png', accent: '#c0a050', accent2: '#d4b868', bgColor: '#120e04', rating: '4.40', votes: '7,200', description: '<strong>Grand Soir</strong> by <strong>Maison Francis Kurkdjian</strong> is an Amber Floral fragrance. It was launched in 2016.', topNotes: ['Amber', 'Benzoin', 'Storax'], midNotes: ['Incense', 'Labdanum'], baseNotes: ['Vanilla', 'Tonka Bean', 'Styrax'], scentData: { amber: 95, sweet: 85, warm: 90, woody: 60, resinous: 80 }, redditQuote: '"Grand Soir is the most luxurious amber fragrance ever created. Liquid gold that wraps around you like cashmere. The definition of refined opulence."', moods: ['love'], seasons: ['fall', 'winter', 'night'] },
];

// Generate a complete section HTML
function generateSectionHTML(p) {
  const scentKeys = Object.keys(p.scentData);
  const moodMap = { 'love': '😍', 'like': '😊', 'ok': '😐', 'dislike': '😞', 'hate': '😤' };
  const seasonMap = { 'winter': '❄️', 'spring': '🌸', 'summer': '☀️', 'fall': '🍂', 'day': '☀️', 'night': '🌙' };
  const allMoods = ['love', 'like', 'ok', 'dislike', 'hate'];
  const allSeasons = ['winter', 'spring', 'summer', 'fall', 'day', 'night'];

  const moodHTML = allMoods.map(m =>
    `<div class="${p.id}-indicator-item${p.moods.includes(m) ? ' active' : ''}"><div class="${p.id}-indicator-icon">${moodMap[m]}</div><span class="${p.id}-indicator-label">${m}</span><div class="${p.id}-indicator-bar"></div></div>`
  ).join('\n                            ');

  const seasonHTML = allSeasons.map(s =>
    `<div class="${p.id}-indicator-item${p.seasons.includes(s) ? ' active' : ''}"><div class="${p.id}-indicator-icon">${seasonMap[s]}</div><span class="${p.id}-indicator-label">${s}</span><div class="${p.id}-indicator-bar"></div></div>`
  ).join('\n                            ');

  // Radar chart SVG points
  const angleStep = (2 * Math.PI) / scentKeys.length;
  const cx = 160, cy = 160, maxR = 120;
  const gridPoints = [0.2, 0.4, 0.6, 0.8, 1.0].map(scale =>
    scentKeys.map((_, i) => {
      const angle = i * angleStep - Math.PI/2;
      return `${cx + maxR * scale * Math.cos(angle)},${cy + maxR * scale * Math.sin(angle)}`;
    }).join(' ')
  );
  const dataPoints = scentKeys.map((k, i) => {
    const angle = i * angleStep - Math.PI/2;
    const r = (p.scentData[k] / 100) * maxR;
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
  }).join(' ');

  // Label positions
  const labelPositions = scentKeys.map((k, i) => {
    const angle = i * angleStep - Math.PI/2;
    const x = (cx + (maxR + 20) * Math.cos(angle));
    const y = (cy + (maxR + 20) * Math.sin(angle));
    return { name: k.charAt(0).toUpperCase() + k.slice(1), value: p.scentData[k], x: Math.round(x/3.2), y: Math.round(y/3.2) };
  });

  const labelPosClasses = ['pos-0','pos-1','pos-2','pos-3','pos-4'];
  const labelHTML = labelPositions.map((l, i) =>
    `<div class="${p.id}-radar-label ${labelPosClasses[i] || 'pos-'+i}"><span class="label-name">${l.name}</span><span class="label-value">${l.value}%</span></div>`
  ).join('\n                                    ');

  // Note tiers
  const noteTiers = [
    { label: 'TOP NOTES', icon: '✨', time: '0-30 min', notes: p.topNotes },
    { label: 'MIDDLE NOTES', icon: '🌸', time: '30min-2h', notes: p.midNotes },
    { label: 'BASE NOTES', icon: '🪵', time: '2h+', notes: p.baseNotes },
  ];

  const noteTierHTML = noteTiers.map(t => `
                                <div class="${p.id}-note-tier">
                                    <div class="${p.id}-tier-label"><span class="${p.id}-tier-icon">${t.icon}</span> ${t.label} <span class="${p.id}-tier-time">${t.time}</span></div>
                                    <div class="${p.id}-crystal-grid">
                                        ${t.notes.map(n => `<div class="${p.id}-crystal-card"><span class="${p.id}-crystal-name">${n}</span></div>`).join('\n                                        ')}
                                    </div>
                                </div>`).join('');

  // Metrics for scent profile card
  const metricsHTML = scentKeys.slice(0, 4).map(k =>
    `<div class="${p.id}-metric-item"><span class="${p.id}-metric-label">${k.charAt(0).toUpperCase() + k.slice(1)}</span><div class="${p.id}-metric-bar"><div class="${p.id}-fill" style="width: ${p.scentData[k]}%"></div></div><span class="${p.id}-metric-value">${p.scentData[k]}%</span></div>`
  ).join('\n                                    ');

  return `
            <!-- Extra Transition Section -->
            <section class="content ${p.id}-transition-section" style="min-height: 200px; height: 200px">
            </section>

            <section class="content ${p.id}-section" id="${p.id}">
                <div class="${p.id}-main-container ${p.id}-theme">

                    <div class="perfume-top-row">

                    <!-- ${p.name} Image and Product Info -->
                    <div class="${p.id}-product-section">
                        <img
                            src="${p.image}"
                            alt="${p.name} Perfume"
                            class="${p.id}-image"
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
                                        <span class="price-currency">${p.price}</span>
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
                                    <button class="add-to-cart-btn" data-product="${p.id}" data-price="${p.price}" id="${p.id}CartBtn">
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
                                    <div class="quality-option" data-quality="edp" data-price="${p.price}">
                                        <input type="radio" id="${p.id}-edp-quality" name="${p.id}-quality" value="edp" checked />
                                        <label for="${p.id}-edp-quality" class="quality-label">
                                            <div class="quality-badge">
                                                <div class="quality-ornament top-left"></div>
                                                <div class="quality-ornament top-right"></div>
                                                <div class="quality-ornament bottom-left"></div>
                                                <div class="quality-ornament bottom-right"></div>
                                                <div class="quality-shimmer"></div>
                                                <div class="quality-content">
                                                    <div class="selection-indicator"><div class="indicator-ring"></div></div>
                                                    <div class="quality-details">
                                                        <span class="quality-name">Eau de Parfum</span>
                                                        <span class="quality-description">Premium concentration</span>
                                                    </div>
                                                </div>
                                                <div class="quality-glow"></div>
                                            </div>
                                        </label>
                                    </div>
                                    <div class="quality-option" data-quality="edt" data-price="${Math.round(p.price * 0.7)}">
                                        <input type="radio" id="${p.id}-edt-quality" name="${p.id}-quality" value="edt" />
                                        <label for="${p.id}-edt-quality" class="quality-label">
                                            <div class="quality-badge">
                                                <div class="quality-ornament top-left"></div>
                                                <div class="quality-ornament top-right"></div>
                                                <div class="quality-ornament bottom-left"></div>
                                                <div class="quality-ornament bottom-right"></div>
                                                <div class="quality-shimmer"></div>
                                                <div class="quality-content">
                                                    <div class="selection-indicator"><div class="indicator-ring"></div></div>
                                                    <div class="quality-details">
                                                        <span class="quality-name">Eau de Toilette</span>
                                                        <span class="quality-description">Light & fresh</span>
                                                    </div>
                                                </div>
                                                <div class="quality-glow"></div>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- ${p.name} Scent Profile and Ingredients -->
                    <div class="${p.id}-profiles-container">
                        <div class="${p.id}-profile-card">
                            <div class="${p.id}-scent-profile">
                                <h3 class="profile-title">Scent Profile</h3>
                                <p class="profile-subtitle">Fragrance DNA Analysis</p>
                                <div class="${p.id}-radar-section">
                                    <div class="${p.id}-radar-container">
                                        <svg class="${p.id}-radar-svg" viewBox="0 0 320 320">
                                            ${gridPoints.map(pts => `<polygon points="${pts}" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>`).join('\n                                            ')}
                                            <polygon class="${p.id}-radar-data" points="${dataPoints}" fill="rgba(${hexToRgb(p.accent)},0.3)" stroke="${p.accent}" stroke-width="2"/>
                                        </svg>
                                        <div class="${p.id}-radar-labels">
                                            ${labelHTML}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="${p.id}-profile-card">
                            <div class="${p.id}-ingredients">
                                <h3 class="profile-title">Ingredients</h3>
                                <p class="profile-subtitle">Note Pyramid</p>
                                <div class="${p.id}-crystal-notes">${noteTierHTML}
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>

                    <!-- ${p.name} Performance Metrics -->
                    <div class="${p.id}-fragrance-description">
                        <h3 class="profile-title">Performance</h3>
                        <div class="${p.id}-metrics">
                            ${metricsHTML}
                        </div>
                    </div>

                <!-- ${p.name} Reddit Review -->
                <div class="${p.id}-reddit-review-container">
                    <div class="${p.id}-reddit-card">
                        <div class="${p.id}-reddit-header">
                            <div class="${p.id}-reddit-votes"><button class="${p.id}-vote-btn">▲</button><span class="${p.id}-vote-count">847</span><button class="${p.id}-vote-btn">▼</button></div>
                            <div><span class="${p.id}-subreddit">r/fragrance</span><span class="${p.id}-post-dot">·</span><span class="${p.id}-post-info">Posted by u/scent_enthusiast</span><span class="${p.id}-post-dot">·</span><span class="${p.id}-post-time">2 months ago</span></div>
                        </div>
                        <div class="${p.id}-reddit-user">
                            <div class="${p.id}-user-details">
                                <span class="${p.id}-username">u/scent_enthusiast</span>
                                <span class="${p.id}-post-time">2 months ago</span>
                            </div>
                        </div>
                        <div class="${p.id}-reddit-text"><p>${p.redditQuote}</p></div>
                        <div class="${p.id}-reddit-engagement">
                            <div class="${p.id}-engagement-item"><span class="${p.id}-engagement-icon">💬</span><span class="${p.id}-engagement-count">289 comments</span></div>
                            <div class="${p.id}-engagement-item"><span class="${p.id}-engagement-icon">🔗</span><span class="${p.id}-engagement-text">Share</span></div>
                            <div class="${p.id}-engagement-item"><span class="${p.id}-engagement-icon">⭐</span><span class="${p.id}-engagement-text">Save</span></div>
                        </div>
                    </div>
                </div>

                <!-- ${p.name} Mood and Seasonal Indicators -->
                <div class="${p.id}-perfume-rating">
                    <div class="${p.id}-rating-indicators">
                        <div class="${p.id}-mood-indicators">
                            ${moodHTML}
                        </div>
                        <div class="${p.id}-seasonal-indicators">
                            ${seasonHTML}
                        </div>
                    </div>
                    <div class="${p.id}-rating-score">
                        <h3 class="${p.id}-rating-title">Perfume rating <span class="${p.id}-score">${p.rating}</span> out of 5 with <span class="${p.id}-votes">${p.votes}</span> votes</h3>
                    </div>

                    <div class="${p.id}-perfume-description">
                        <p>${p.description}</p>
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
                                <div class="review-rating-selector">
                                    <span class="rating-label">Your Rating:</span>
                                    <div class="star-rating-input" id="${p.id}-star-rating">
                                        <span class="star-input" data-rating="1">★</span>
                                        <span class="star-input" data-rating="2">★</span>
                                        <span class="star-input" data-rating="3">★</span>
                                        <span class="star-input" data-rating="4">★</span>
                                        <span class="star-input" data-rating="5">★</span>
                                    </div>
                                </div>
                                <textarea class="review-textarea" id="${p.id}-review-text" placeholder="Write your review..."></textarea>
                                <button class="submit-review-btn" id="${p.id}-submit-review">Submit Review</button>
                            </div>
                        </div>
                        <div class="reviews-list" id="${p.id}-reviews-list"></div>
                        <div class="reviews-loading">
                            <button class="load-more-btn" id="${p.id}-load-more-btn">Load More Reviews</button>
                        </div>
                    </div>
                </div>
            </section>`;
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3), 16);
  const g = parseInt(hex.slice(3,5), 16);
  const b = parseInt(hex.slice(5,7), 16);
  return `${r},${g},${b}`;
}

// Generate CSS theme file
function generateCSS(p) {
  const rgb = hexToRgb(p.accent);
  const rgb2 = hexToRgb(p.accent2);
  // Compute lightened versions for text on dark bg
  const lightAccent = lightenColor(p.accent, 0.6);
  const lightAccent2 = lightenColor(p.accent2, 0.5);

  return `/* ============================================================================
   ${p.brand} — ${p.name} Theme
   Unique: Radar Chart, Crystal Shard Cards, Glassmorphism
   ============================================================================ */

/* Main Container */
.${p.id}-main-container {
    max-width: 1600px !important;
    margin: 0 auto !important;
    padding: 60px 30px !important;
    display: flex !important;
    flex-direction: column !important;
    gap: 50px !important;
    position: relative !important;
}

.${p.id}-theme {
    color: rgba(255, 255, 255, 0.90) !important;
}

.${p.id}-theme .brand-name {
    color: rgba(255, 255, 255, 0.95) !important;
    font-family: 'Playfair Display', serif !important;
    letter-spacing: 3px !important;
    text-shadow: 0 2px 14px rgba(0, 0, 0, 0.45) !important;
}

.${p.id}-theme .brand-location {
    color: ${lightAccent} !important;
    letter-spacing: 5px !important;
    text-shadow: 0 2px 14px rgba(0, 0, 0, 0.45) !important;
}

.${p.id}-theme .product-name {
    color: rgba(255, 255, 255, 0.95) !important;
    font-family: 'Playfair Display', serif !important;
    font-style: italic !important;
    text-shadow: 0 2px 14px rgba(0, 0, 0, 0.45) !important;
}

.${p.id}-theme .price-badge {
    background: linear-gradient(135deg, ${p.accent}, ${p.accent2}) !important;
    border: 2px solid ${p.accent} !important;
}

.${p.id}-theme .price-glow {
    background: radial-gradient(circle, rgba(${rgb},0.3) 0%, transparent 70%) !important;
}

.${p.id}-theme .quality-badge {
    border: 1px solid rgba(${rgb},0.3) !important;
    background: rgba(${rgb},0.04) !important;
}

.${p.id}-theme .quality-name {
    color: rgba(255, 255, 255, 0.92) !important;
}

.${p.id}-theme .quality-description {
    color: rgba(255, 255, 255, 0.72) !important;
}

.${p.id}-theme .quality-option input:checked + .quality-label .quality-badge {
    border-color: ${p.accent} !important;
    background: rgba(${rgb},0.08) !important;
    box-shadow: none !important;
}

.${p.id}-theme .quality-option input:checked + .quality-label .quality-name {
    color: rgba(255, 255, 255, 0.96) !important;
    font-weight: 600 !important;
}

.${p.id}-theme .quality-option input:checked + .quality-label .quality-description {
    color: ${lightAccent} !important;
}

.${p.id}-theme .selection-indicator {
    border-color: rgba(${rgb},0.4) !important;
}

.${p.id}-theme .quality-option input:checked + .quality-label .selection-indicator {
    border-color: ${p.accent} !important;
    background: rgba(${rgb},0.1) !important;
    box-shadow: none !important;
}

.${p.id}-theme .quality-option input:checked + .quality-label .selection-indicator::after {
    background: ${p.accent} !important;
    box-shadow: none !important;
}

.${p.id}-theme .quality-shimmer {
    background: linear-gradient(90deg, transparent, rgba(${rgb},0.1), transparent) !important;
}

.${p.id}-theme .quality-glow {
    display: none !important;
}

.${p.id}-theme .quality-ornament {
    border-color: rgba(${rgb},0.3) !important;
}

.${p.id}-theme .quality-option input:checked + .quality-label .quality-ornament {
    border-color: ${p.accent} !important;
    box-shadow: none !important;
}

.${p.id}-theme .quality-title,
.${p.id}-theme .quality-subtitle {
    color: rgba(255, 255, 255, 0.80) !important;
}

/* Product Section */
.${p.id}-product-section {
    display: flex !important;
    align-items: center !important;
    gap: 50px !important;
    flex-wrap: wrap !important;
    justify-content: center !important;
}

.${p.id}-image {
    width: 320px !important;
    height: auto !important;
    max-height: 440px !important;
    object-fit: contain !important;
    filter: drop-shadow(0 20px 40px rgba(${rgb},0.25)) !important;
    transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), filter 0.6s ease !important;
}

.${p.id}-image:hover {
    transform: scale(1.05) translateY(-10px) !important;
    filter: drop-shadow(0 30px 60px rgba(${rgb},0.35)) !important;
}

/* Profiles Container */
.${p.id}-profiles-container {
    display: grid !important;
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    gap: 30px !important;
    align-items: stretch !important;
}

/* Profile Card - Glassmorphism */
.${p.id}-profile-card {
    background: rgba(255,255,255,0.06) !important;
    backdrop-filter: blur(20px) !important;
    -webkit-backdrop-filter: blur(20px) !important;
    border: 1px solid rgba(${rgb},0.2) !important;
    border-radius: 20px !important;
    padding: 30px !important;
    box-shadow: 0 8px 32px rgba(${rgb},0.1) !important;
}

.${p.id}-profile-card .profile-title {
    color: rgba(255, 255, 255, 0.95) !important;
    font-family: 'Playfair Display', serif !important;
}

.${p.id}-profile-card .profile-subtitle {
    color: ${lightAccent} !important;
}

/* Radar Chart */
.${p.id}-scent-profile { flex: 1 !important; min-width: 300px !important; }
.${p.id}-radar-section { display: flex !important; flex-direction: column !important; gap: 30px !important; }
.${p.id}-radar-container { position: relative !important; width: 100% !important; max-width: 320px !important; margin: 0 auto !important; aspect-ratio: 1 !important; }
.${p.id}-radar-svg { width: 100% !important; height: 100% !important; }
.${p.id}-radar-data { animation: ${p.id}RadarPulse 3s ease-in-out infinite !important; }

@keyframes ${p.id}RadarPulse {
    0%, 100% { opacity: 0.85; }
    50% { opacity: 1; }
}

.${p.id}-radar-labels { position: absolute !important; top: 0 !important; left: 0 !important; width: 100% !important; height: 100% !important; pointer-events: none !important; }
.${p.id}-radar-label { position: absolute !important; display: flex !important; flex-direction: column !important; align-items: center !important; transform: translate(-50%, -50%) !important; }
.${p.id}-radar-label .label-name { font-size: 0.75rem !important; font-weight: 600 !important; color: rgba(255, 255, 255, 0.90) !important; text-transform: uppercase !important; letter-spacing: 0.5px !important; }
.${p.id}-radar-label .label-value { font-size: 0.65rem !important; color: ${lightAccent} !important; font-weight: 500 !important; }
.${p.id}-radar-label.pos-0 { top: 2%; left: 50%; }
.${p.id}-radar-label.pos-1 { top: 28%; left: 96%; }
.${p.id}-radar-label.pos-2 { top: 88%; left: 82%; }
.${p.id}-radar-label.pos-3 { top: 88%; left: 18%; }
.${p.id}-radar-label.pos-4 { top: 28%; left: 4%; }

/* Crystal Shard Notes */
.${p.id}-ingredients { flex: 1 !important; min-width: 300px !important; }
.${p.id}-crystal-notes { display: flex !important; flex-direction: column !important; gap: 25px !important; }
.${p.id}-note-tier { margin-bottom: 10px !important; }
.${p.id}-tier-label { display: flex !important; align-items: center !important; gap: 8px !important; font-size: 0.85rem !important; font-weight: 600 !important; color: rgba(255, 255, 255, 0.90) !important; text-transform: uppercase !important; letter-spacing: 1px !important; margin-bottom: 12px !important; }
.${p.id}-tier-icon { font-size: 1rem !important; }
.${p.id}-tier-time { font-size: 0.7rem !important; color: ${lightAccent} !important; font-weight: 400 !important; margin-left: auto !important; }
.${p.id}-crystal-grid { display: flex !important; gap: 12px !important; flex-wrap: wrap !important; }
.${p.id}-crystal-card {
    background: linear-gradient(135deg, rgba(255,255,255,0.08), rgba(${rgb},0.06)) !important;
    backdrop-filter: blur(10px) !important;
    border: 1px solid rgba(${rgb},0.2) !important;
    border-radius: 16px !important;
    padding: 16px 20px !important;
    display: flex !important; flex-direction: column !important; align-items: center !important; gap: 6px !important;
    flex: 1 !important; min-width: 90px !important;
    transition: transform 0.3s ease, box-shadow 0.3s ease !important;
    position: relative !important; overflow: hidden !important;
}
.${p.id}-crystal-card::before {
    content: '' !important; position: absolute !important; top: -50% !important; left: -50% !important;
    width: 200% !important; height: 200% !important;
    background: linear-gradient(45deg, transparent 40%, rgba(${rgb},0.08) 50%, transparent 60%) !important;
    animation: ${p.id}CrystalShimmer 4s ease-in-out infinite !important;
}
@keyframes ${p.id}CrystalShimmer {
    0% { transform: translateX(-100%) rotate(45deg); }
    100% { transform: translateX(100%) rotate(45deg); }
}
.${p.id}-crystal-card:hover { transform: translateY(-5px) scale(1.05) !important; box-shadow: 0 12px 30px rgba(${rgb},0.2) !important; }
.${p.id}-crystal-name { font-size: 0.8rem !important; font-weight: 600 !important; color: rgba(255, 255, 255, 0.90) !important; position: relative !important; z-index: 1 !important; }

/* Metrics */
.${p.id}-metrics { display: flex !important; flex-direction: column !important; gap: 16px !important; }
.${p.id}-metric-item { display: flex !important; align-items: center !important; gap: 12px !important; }
.${p.id}-metric-label { min-width: 80px !important; font-size: 0.8rem !important; font-weight: 500 !important; color: rgba(255, 255, 255, 0.80) !important; text-transform: capitalize !important; }
.${p.id}-metric-bar { flex: 1 !important; height: 6px !important; background: rgba(255,255,255,0.08) !important; border-radius: 10px !important; overflow: hidden !important; }
.${p.id}-fill { background: linear-gradient(90deg, ${p.accent}, ${p.accent2}) !important; border-radius: 10px !important; height: 100% !important; transition: width 1s ease !important; }
.${p.id}-metric-value { font-size: 0.75rem !important; font-weight: 600 !important; color: ${lightAccent} !important; min-width: 35px !important; text-align: right !important; }

/* Description */
.${p.id}-fragrance-description { background: rgba(255,255,255,0.05) !important; backdrop-filter: blur(15px) !important; border: 1px solid rgba(${rgb},0.15) !important; border-radius: 20px !important; padding: 35px !important; }
.${p.id}-fragrance-description .profile-title { color: rgba(255, 255, 255, 0.95) !important; }

/* Reddit Review */
.${p.id}-reddit-review-container { margin-top: 10px !important; }
.${p.id}-reddit-card { background: rgba(255,255,255,0.06) !important; backdrop-filter: blur(15px) !important; border: 1px solid rgba(${rgb},0.2) !important; border-radius: 16px !important; padding: 25px !important; overflow: hidden !important; }
.${p.id}-reddit-header { display: flex !important; align-items: center !important; gap: 15px !important; margin-bottom: 15px !important; padding-bottom: 12px !important; border-bottom: 1px solid rgba(${rgb},0.1) !important; }
.${p.id}-reddit-votes { display: flex !important; flex-direction: column !important; align-items: center !important; gap: 3px !important; }
.${p.id}-vote-btn { background: none !important; border: none !important; color: ${lightAccent} !important; cursor: pointer !important; font-size: 0.8rem !important; padding: 2px !important; }
.${p.id}-vote-count { font-size: 0.85rem !important; font-weight: 700 !important; color: rgba(255, 255, 255, 0.90) !important; }
.${p.id}-subreddit { font-weight: 700 !important; color: rgba(255, 255, 255, 0.90) !important; font-size: 0.85rem !important; }
.${p.id}-post-dot { color: ${lightAccent} !important; margin: 0 5px !important; }
.${p.id}-post-info, .${p.id}-post-time { color: rgba(255, 255, 255, 0.55) !important; font-size: 0.75rem !important; }
.${p.id}-user-avatar img { width: 36px !important; height: 36px !important; border-radius: 50% !important; }
.${p.id}-reddit-user { display: flex !important; align-items: center !important; gap: 10px !important; margin-bottom: 12px !important; }
.${p.id}-user-details { display: flex !important; flex-direction: column !important; }
.${p.id}-username { font-weight: 600 !important; color: rgba(255, 255, 255, 0.90) !important; font-size: 0.85rem !important; }
.${p.id}-reddit-text p { color: rgba(255, 255, 255, 0.80) !important; line-height: 1.7 !important; font-style: italic !important; }
.${p.id}-reddit-engagement { display: flex !important; gap: 20px !important; margin-top: 15px !important; padding-top: 12px !important; border-top: 1px solid rgba(${rgb},0.1) !important; }
.${p.id}-engagement-item { display: flex !important; align-items: center !important; gap: 5px !important; font-size: 0.8rem !important; color: rgba(255, 255, 255, 0.55) !important; }

/* Mood/Season Indicators */
.${p.id}-perfume-rating { padding: 30px 0 !important; color: rgba(255, 255, 255, 0.88) !important; }
.${p.id}-rating-indicators { display: flex !important; gap: 30px !important; flex-wrap: wrap !important; margin-bottom: 25px !important; }
.${p.id}-mood-indicators, .${p.id}-seasonal-indicators { display: flex !important; gap: 12px !important; flex-wrap: wrap !important; }
.${p.id}-indicator-item { display: flex !important; flex-direction: column !important; align-items: center !important; gap: 5px !important; opacity: 0.4 !important; transition: opacity 0.3s ease !important; }
.${p.id}-indicator-item.active { opacity: 1 !important; }
.${p.id}-indicator-icon { font-size: 1.3rem !important; }
.${p.id}-indicator-label { font-size: 0.65rem !important; text-transform: uppercase !important; letter-spacing: 0.5px !important; color: rgba(255, 255, 255, 0.68) !important; }
.${p.id}-indicator-bar { width: 30px !important; height: 3px !important; background: rgba(${rgb},0.2) !important; border-radius: 2px !important; }
.${p.id}-indicator-item.active .${p.id}-indicator-bar { background: ${p.accent} !important; }
.${p.id}-rating-title { font-size: 1rem !important; color: rgba(255, 255, 255, 0.92) !important; font-weight: 400 !important; text-shadow: 0 2px 14px rgba(0, 0, 0, 0.45) !important; }
.${p.id}-score { font-weight: 700 !important; color: rgba(255, 255, 255, 0.98) !important; font-size: 1.3rem !important; }
.${p.id}-votes { font-weight: 600 !important; color: ${lightAccent} !important; }
.${p.id}-perfume-description p { color: rgba(255, 255, 255, 0.82) !important; line-height: 1.7 !important; margin-top: 15px !important; }
.${p.id}-perfume-description strong { color: rgba(255, 255, 255, 0.95) !important; }

/* Favourite & Cart Buttons */
.${p.id}-theme .favorite-btn { color: rgba(255, 255, 255, 0.90) !important; border: 1px solid rgba(${rgb}, 0.3) !important; background: transparent !important; }
.${p.id}-theme .favorite-btn:hover { background: rgba(${rgb}, 0.08) !important; border-color: ${p.accent} !important; color: rgba(255, 255, 255, 0.95) !important; box-shadow: 0 4px 20px rgba(${rgb}, 0.2) !important; }
.${p.id}-theme .favorite-btn .heart-outline, .${p.id}-theme .favorite-btn .heart-filled { color: ${lightAccent} !important; }
.${p.id}-theme .favorite-btn.favorited { background: rgba(${rgb}, 0.06) !important; border-color: ${p.accent} !important; color: rgba(255, 255, 255, 0.95) !important; }
.${p.id}-theme .add-to-cart-btn { color: rgba(255, 255, 255, 0.90) !important; border: 1px solid rgba(${rgb}, 0.3) !important; background: transparent !important; }
.${p.id}-theme .add-to-cart-btn:hover { background: rgba(${rgb}, 0.08) !important; border-color: ${p.accent} !important; box-shadow: 0 4px 20px rgba(${rgb}, 0.2) !important; }
.${p.id}-theme .add-to-cart-btn .cart-icon svg { color: rgba(255, 255, 255, 0.90) !important; stroke: rgba(255, 255, 255, 0.90) !important; }
.${p.id}-theme .add-to-cart-btn.added { border-color: rgba(229, 72, 77, 0.3) !important; color: #dc3545 !important; }

/* Price Section */
.${p.id}-theme .product-price { color: #fff !important; text-shadow: 0 1px 3px rgba(0,0,0,0.2) !important; }
.${p.id}-theme .price-currency, .${p.id}-theme .price-unit { color: rgba(255,255,255,0.85) !important; }
.${p.id}-theme .price-subtitle { color: rgba(${rgb}, 0.5) !important; letter-spacing: 3px !important; }
.${p.id}-theme .price-ornament { border-color: rgba(${rgb}, 0.35) !important; }
.${p.id}-theme .price-badge:hover .price-ornament { border-color: ${p.accent} !important; }

/* Card Enhancements */
.${p.id}-theme .product-actions-buttons { position: relative !important; }
.${p.id}-theme .product-actions-buttons::before { content: '' !important; position: absolute !important; top: -15px !important; left: 15% !important; right: 15% !important; height: 1px !important; background: linear-gradient(90deg, transparent, rgba(${rgb}, 0.25), transparent) !important; }

/* Responsive */
@media (max-width: 768px) {
    .${p.id}-product-section { flex-direction: column !important; text-align: center !important; }
    .${p.id}-image { width: 250px !important; }
    .${p.id}-profiles-container { flex-direction: row !important; flex-wrap: nowrap !important; overflow-x: auto !important; }
    .${p.id}-rating-row { flex-direction: column !important; }
}
`;
}

function lightenColor(hex, amount) {
  let r = parseInt(hex.slice(1,3), 16);
  let g = parseInt(hex.slice(3,5), 16);
  let b = parseInt(hex.slice(5,7), 16);
  r = Math.min(255, Math.round(r + (255 - r) * amount));
  g = Math.min(255, Math.round(g + (255 - g) * amount));
  b = Math.min(255, Math.round(b + (255 - b) * amount));
  return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
}

// ============================================================================
// GENERATE ALL FILES
// ============================================================================

console.log(`Generating ${newPerfumes.length} new perfumes...`);

// 1) Generate HTML 
let allHTML = '';
for (const p of newPerfumes) {
  allHTML += generateSectionHTML(p);
}
fs.writeFileSync('new-perfumes-batch2-html.txt', allHTML);
console.log('✓ Generated new-perfumes-batch2-html.txt');

// 2) Generate CSS files
for (const p of newPerfumes) {
  const cssPath = `css/${p.id}-profile.css`;
  fs.writeFileSync(cssPath, generateCSS(p));
  console.log(`✓ Generated ${cssPath}`);
}

// 3) Verify CSS brace balance
let allOk = true;
for (const p of newPerfumes) {
  const cssPath = `css/${p.id}-profile.css`;
  const content = fs.readFileSync(cssPath, 'utf8');
  const opens = (content.match(/{/g) || []).length;
  const closes = (content.match(/}/g) || []).length;
  if (opens !== closes) {
    console.log(`✗ BRACE MISMATCH in ${cssPath}: { = ${opens}, } = ${closes}`);
    allOk = false;
  }
}
console.log(allOk ? '✓ All CSS files have balanced braces' : '✗ Some CSS files have brace mismatches!');

// 4) Print the IDs for easy copy-paste
const newIds = newPerfumes.map(p => `"${p.id}"`).join(', ');
console.log(`\nNew IDs: ${newIds}`);
console.log(`\nTotal new perfumes: ${newPerfumes.length}`);
