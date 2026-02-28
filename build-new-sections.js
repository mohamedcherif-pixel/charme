/**
 * MEGA BUILD: Generate 6 new unique perfume sections
 * Each with completely unique layout, theme, and visualization
 * 
 * Sections to add after Aventus:
 * 1. Dior Sauvage      — "Untamed Wild"        — Circular dial meter
 * 2. Bleu de Chanel     — "Refined Midnight"     — Vertical timeline notes  
 * 3. Tobacco Vanille    — "Smoke & Warmth"       — Heat gauge visualization
 * 4. Oud Wood           — "Sacred Wood"          — Ring visualization
 * 5. La Nuit de L'Homme — "Midnight Seduction"   — Constellation map
 * 6. Lost Cherry        — "Forbidden Fruit"      — Split comparison layout
 */

const fs = require('fs');
const path = require('path');

// ============================================================================
// FRAGRANCE DATA
// ============================================================================
const fragrances = [
  {
    id: 'sauvage',
    name: 'Sauvage',
    brand: 'Dior',
    subtitle: 'Wild • Magnetic • Untamed',
    family: 'Aromatic Fougère',
    year: 2015,
    perfumer: 'François Demachy',
    concentration: 'EDT',
    price: '$105',
    description: `<strong>Dior Sauvage</strong> channels the raw beauty of desert landscapes at twilight. 
      A blazing trail of Calabrian bergamot meets the magnetic pull of Ambroxan, creating an 
      iconic scent that\'s become synonymous with modern masculinity. The Sichuan pepper adds 
      an electrifying freshness, while cedar and labdanum ground the composition in warmth.`,
    topNotes: [
      { name: 'Bergamot', emoji: '🍊', intensity: 'Bold' },
      { name: 'Pepper', emoji: '🌶️', intensity: 'Vibrant' }
    ],
    heartNotes: [
      { name: 'Lavender', emoji: '💜', intensity: 'Smooth' },
      { name: 'Sichuan Pepper', emoji: '⚡', intensity: 'Electric' },
      { name: 'Geranium', emoji: '🌸', intensity: 'Subtle' }
    ],
    baseNotes: [
      { name: 'Ambroxan', emoji: '💎', intensity: 'Dominant' },
      { name: 'Cedar', emoji: '🌲', intensity: 'Warm' },
      { name: 'Labdanum', emoji: '🍯', intensity: 'Deep' }
    ],
    scentProfile: { fresh: 85, woody: 70, spicy: 75, sweet: 30, aromatic: 80 },
    ratings: { longevity: 8.5, sillage: 8.0, versatility: 9.5, value: 9.0 },
    seasons: ['spring', 'summer', 'fall'],
    moods: ['confident', 'energetic', 'casual'],
    gender: { masculine: 85, feminine: 15 },
    reddit: {
      user: 'FragranceConnoisseur',
      sub: 'r/fragrance',
      text: '"Sauvage is the definition of a crowd-pleaser. I\'ve never received more compliments from any other fragrance. It projects like a beast and lasts all day. The reformulations are slightly weaker but still incredible."',
      votes: 847,
      time: '8 months ago'
    },
    bgColor: '#f5e6d3',
    accentColor: '#C4A265',
    textColor: '#3d2b1f'
  },
  {
    id: 'bleudechanel',
    name: 'Bleu de Chanel',
    brand: 'Chanel',
    subtitle: 'Refined • Intellectual • Timeless',
    family: 'Woody Aromatic',
    year: 2010,
    perfumer: 'Jacques Polge',
    concentration: 'EDP',
    price: '$135',
    description: `<strong>Bleu de Chanel</strong> is the epitome of understated elegance. A harmonious 
      blend of citrus and mint opens into a sophisticated heart of ginger and nutmeg, 
      while sandalwood and cedar provide a lasting, refined dry down. This is the 
      fragrance for the man who lets his actions speak louder than words.`,
    topNotes: [
      { name: 'Bergamot', emoji: '🍊', intensity: 'Crisp' },
      { name: 'Lemon', emoji: '🍋', intensity: 'Bright' },
      { name: 'Mint', emoji: '🌿', intensity: 'Cool' }
    ],
    heartNotes: [
      { name: 'Ginger', emoji: '🫚', intensity: 'Warm' },
      { name: 'Nutmeg', emoji: '🥜', intensity: 'Spicy' },
      { name: 'Jasmine', emoji: '🌼', intensity: 'Delicate' }
    ],
    baseNotes: [
      { name: 'Sandalwood', emoji: '🪵', intensity: 'Creamy' },
      { name: 'Cedar', emoji: '🌲', intensity: 'Dry' },
      { name: 'Incense', emoji: '🕯️', intensity: 'Smoky' }
    ],
    scentProfile: { fresh: 70, woody: 85, spicy: 50, sweet: 35, aromatic: 75 },
    ratings: { longevity: 8.0, sillage: 7.0, versatility: 9.0, value: 7.5 },
    seasons: ['spring', 'fall', 'winter'],
    moods: ['professional', 'refined', 'confident'],
    gender: { masculine: 80, feminine: 20 },
    reddit: {
      user: 'ScentEnthusiast',
      sub: 'r/fragrance',
      text: '"Bleu de Chanel EDP is the ultimate office fragrance. It\'s sophisticated without being loud, distinctive without being divisive. The sandalwood dry down is absolutely gorgeous."',
      votes: 623,
      time: '5 months ago'
    },
    bgColor: '#0d1b2a',
    accentColor: '#4A90D9',
    textColor: '#e0e8f0'
  },
  {
    id: 'tobaccovanille',
    name: 'Tobacco Vanille',
    brand: 'Tom Ford',
    subtitle: 'Opulent • Addictive • Warm',
    family: 'Oriental Spicy',
    year: 2007,
    perfumer: 'Olivier Gillotin',
    concentration: 'EDP',
    price: '$275',
    description: `<strong>Tom Ford Tobacco Vanille</strong> is liquid indulgence. Imagine a luxurious gentleman\'s 
      club where aged tobacco leaves mingle with sweet vanilla, dark chocolate, and aromatic 
      spices. The tonka bean and dried fruits add layers of gourmand complexity, while a hint 
      of smoke gives it an edge. This is opulence bottled.`,
    topNotes: [
      { name: 'Tobacco Leaf', emoji: '🍂', intensity: 'Rich' },
      { name: 'Spicy Notes', emoji: '🌶️', intensity: 'Warm' }
    ],
    heartNotes: [
      { name: 'Vanilla', emoji: '🍦', intensity: 'Lush' },
      { name: 'Tonka Bean', emoji: '🫘', intensity: 'Sweet' },
      { name: 'Cacao', emoji: '🍫', intensity: 'Dark' }
    ],
    baseNotes: [
      { name: 'Dried Fruits', emoji: '🍇', intensity: 'Complex' },
      { name: 'Benzoin', emoji: '✨', intensity: 'Resinous' },
      { name: 'Smoke', emoji: '💨', intensity: 'Subtle' }
    ],
    scentProfile: { fresh: 10, woody: 40, spicy: 80, sweet: 95, aromatic: 60 },
    ratings: { longevity: 9.5, sillage: 8.5, versatility: 5.0, value: 6.0 },
    seasons: ['fall', 'winter'],
    moods: ['luxurious', 'evening', 'intimate'],
    gender: { masculine: 65, feminine: 35 },
    reddit: {
      user: 'GourmandAddict',
      sub: 'r/fragrance',
      text: '"This is the king of fall/winter fragrances. Two sprays will last 12+ hours and get you compliments all night. It\'s expensive but nothing else smells quite like it. Pure class in a bottle."',
      votes: 1124,
      time: '3 months ago'
    },
    bgColor: '#2c1810',
    accentColor: '#D4A574',
    textColor: '#f0e6dc'
  },
  {
    id: 'oudwood',
    name: 'Oud Wood',
    brand: 'Tom Ford',
    subtitle: 'Exotic • Refined • Meditative',
    family: 'Woody Oriental',
    year: 2007,
    perfumer: 'Richard Herpin',
    concentration: 'EDP',
    price: '$260',
    description: `<strong>Tom Ford Oud Wood</strong> redefined oud for Western perfumery. Instead of the 
      traditional Middle Eastern animalic oud, this is smooth, creamy, and remarkably 
      approachable. Rosewood and cardamom open with sophistication, while the oud and 
      sandalwood create a meditative, almost spiritual warmth. A masterpiece of restraint.`,
    topNotes: [
      { name: 'Rosewood', emoji: '🌹', intensity: 'Elegant' },
      { name: 'Cardamom', emoji: '🫛', intensity: 'Aromatic' },
      { name: 'Pink Pepper', emoji: '🌸', intensity: 'Spicy' }
    ],
    heartNotes: [
      { name: 'Oud', emoji: '🕌', intensity: 'Smooth' },
      { name: 'Sandalwood', emoji: '🪵', intensity: 'Creamy' }
    ],
    baseNotes: [
      { name: 'Amber', emoji: '🟤', intensity: 'Warm' },
      { name: 'Vanilla', emoji: '🍦', intensity: 'Soft' },
      { name: 'Vetiver', emoji: '🌾', intensity: 'Earthy' }
    ],
    scentProfile: { fresh: 20, woody: 95, spicy: 55, sweet: 45, aromatic: 65 },
    ratings: { longevity: 7.5, sillage: 6.5, versatility: 7.5, value: 5.5 },
    seasons: ['fall', 'winter', 'spring'],
    moods: ['meditative', 'refined', 'mysterious'],
    gender: { masculine: 60, feminine: 40 },
    reddit: {
      user: 'OudEnthusiast',
      sub: 'r/fragrance',
      text: '"Oud Wood is oud for beginners but in the best way. It made oud accessible and beautiful. The rosewood-cardamom opening is perfect, and it dries down to pure smooth luxury. A modern classic."',
      votes: 734,
      time: '6 months ago'
    },
    bgColor: '#1a1f16',
    accentColor: '#7D8B6A',
    textColor: '#e8ede0'
  },
  {
    id: 'lanuit',
    name: 'La Nuit de L\'Homme',
    brand: 'Yves Saint Laurent',
    subtitle: 'Seductive • Mysterious • Intimate',
    family: 'Oriental Spicy',
    year: 2009,
    perfumer: 'Anne Flipo, Pierre Wargnye & Dominique Ropion',
    concentration: 'EDT',
    price: '$95',
    description: `<strong>YSL La Nuit de L'Homme</strong> is the ultimate seduction fragrance. The interplay 
      of fresh cardamom and deep cedar creates an irresistible magnetic pull. Lavender adds 
      an unexpected softness, while vetiver and caraway give it an edge. This fragrance doesn\'t 
      shout — it whispers, and that\'s what makes it devastating.`,
    topNotes: [
      { name: 'Cardamom', emoji: '🫛', intensity: 'Magnetic' },
      { name: 'Bergamot', emoji: '🍊', intensity: 'Fresh' }
    ],
    heartNotes: [
      { name: 'Lavender', emoji: '💜', intensity: 'Soft' },
      { name: 'Cedar', emoji: '🌲', intensity: 'Warm' },
      { name: 'Caraway', emoji: '🌿', intensity: 'Spicy' }
    ],
    baseNotes: [
      { name: 'Vetiver', emoji: '🌾', intensity: 'Earthy' },
      { name: 'Musk', emoji: '🤍', intensity: 'Sensual' },
      { name: 'Amber', emoji: '🟤', intensity: 'Deep' }
    ],
    scentProfile: { fresh: 50, woody: 65, spicy: 85, sweet: 55, aromatic: 70 },
    ratings: { longevity: 6.0, sillage: 6.5, versatility: 7.0, value: 8.0 },
    seasons: ['fall', 'winter', 'spring'],
    moods: ['romantic', 'evening', 'mysterious'],
    gender: { masculine: 75, feminine: 25 },
    reddit: {
      user: 'NightOwlFrags',
      sub: 'r/fragrance',
      text: '"La Nuit is the ultimate date night fragrance. The cardamom opening is intoxicating. Yes, longevity isn\'t the best, but the compliments you get in those 4-5 hours are worth it. Nothing else smells like this."',
      votes: 912,
      time: '4 months ago'
    },
    bgColor: '#0f0a1a',
    accentColor: '#9B7FD4',
    textColor: '#e0d8f0'
  },
  {
    id: 'lostcherry',
    name: 'Lost Cherry',
    brand: 'Tom Ford',
    subtitle: 'Tempting • Bold • Irresistible',
    family: 'Oriental Gourmand',
    year: 2018,
    perfumer: 'Louise Turner',
    concentration: 'EDP',
    price: '$390',
    description: `<strong>Tom Ford Lost Cherry</strong> is pure temptation in a bottle. An intoxicating burst 
      of ripe cherry and cherry liqueur opens with irresistible sweetness, while Turkish rose 
      and jasmine sambac add seductive floral depth. The Base of sandalwood, Peru balsam, 
      and tonka bean creates a lingering, addictive warmth that\'s impossible to resist.`,
    topNotes: [
      { name: 'Black Cherry', emoji: '🍒', intensity: 'Juicy' },
      { name: 'Cherry Liqueur', emoji: '🥃', intensity: 'Boozy' },
      { name: 'Bitter Almond', emoji: '🌰', intensity: 'Sharp' }
    ],
    heartNotes: [
      { name: 'Turkish Rose', emoji: '🌹', intensity: 'Rich' },
      { name: 'Jasmine Sambac', emoji: '🌺', intensity: 'Sensual' }
    ],
    baseNotes: [
      { name: 'Sandalwood', emoji: '🪵', intensity: 'Creamy' },
      { name: 'Peru Balsam', emoji: '🍯', intensity: 'Sweet' },
      { name: 'Tonka Bean', emoji: '🫘', intensity: 'Warm' }
    ],
    scentProfile: { fresh: 15, woody: 35, spicy: 25, sweet: 95, aromatic: 40 },
    ratings: { longevity: 8.0, sillage: 7.5, versatility: 5.5, value: 4.0 },
    seasons: ['fall', 'winter'],
    moods: ['bold', 'romantic', 'luxurious'],
    gender: { masculine: 40, feminine: 60 },
    reddit: {
      user: 'CherryBombScents',
      sub: 'r/fragrance',
      text: '"Lost Cherry is polarizing but if you love it, you LOVE it. The cherry note is realistic and boozy, not synthetic. It gets attention everywhere I go. Expensive? Yes. Worth it? Absolutely."',
      votes: 567,
      time: '7 months ago'
    },
    bgColor: '#2d0a0a',
    accentColor: '#C94C5D',
    textColor: '#f5e0e4'
  }
];

// ============================================================================
// UNIQUE LAYOUT GENERATORS
// ============================================================================

// 1. SAUVAGE — Circular Dial Meter Visualization
function generateSauvageScentProfile(f) {
  const attrs = Object.entries(f.scentProfile);
  return `
    <div class="sauvage-scent-profile">
      <div class="sauvage-dial-container">
        <svg viewBox="0 0 300 300" class="sauvage-dial-svg">
          <circle cx="150" cy="150" r="120" fill="none" stroke="rgba(196,162,101,0.15)" stroke-width="20"/>
          ${attrs.map(([key, val], i) => {
            const angle = (i / attrs.length) * 360 - 90;
            const rad = (angle * Math.PI) / 180;
            const endAngle = angle + (val / 100) * (360 / attrs.length);
            const endRad = (endAngle * Math.PI) / 180;
            const x1 = 150 + 120 * Math.cos(rad);
            const y1 = 150 + 120 * Math.sin(rad);
            const x2 = 150 + 120 * Math.cos(endRad);
            const y2 = 150 + 120 * Math.sin(endRad);
            const large = (endAngle - angle) > 180 ? 1 : 0;
            return `<path d="M ${x1} ${y1} A 120 120 0 ${large} 1 ${x2} ${y2}" fill="none" stroke="#C4A265" stroke-width="18" stroke-linecap="round" opacity="${0.5 + val/200}"/>`;
          }).join('\n          ')}
          <circle cx="150" cy="150" r="85" fill="rgba(196,162,101,0.05)" stroke="rgba(196,162,101,0.1)" stroke-width="1"/>
          <text x="150" y="135" text-anchor="middle" fill="#C4A265" font-size="28" font-weight="700" font-family="'Space Grotesk', sans-serif">${f.ratings.versatility}</text>
          <text x="150" y="160" text-anchor="middle" fill="#8B7355" font-size="11" letter-spacing="3" font-family="'Space Grotesk', sans-serif">VERSATILITY</text>
        </svg>
      </div>
      <div class="sauvage-attributes">
        ${attrs.map(([key, val]) => `
          <div class="sauvage-attr-item">
            <span class="sauvage-attr-label">${key.charAt(0).toUpperCase() + key.slice(1)}</span>
            <div class="sauvage-attr-arc">
              <div class="sauvage-arc-bg"></div>
              <div class="sauvage-arc-fill" style="width: ${val}%"></div>
            </div>
            <span class="sauvage-attr-val">${val}%</span>
          </div>
        `).join('')}
      </div>
    </div>`;
}

function generateSauvageIngredients(f) {
  return `
    <div class="sauvage-ingredients">
      ${['topNotes', 'heartNotes', 'baseNotes'].map((type, idx) => {
        const label = ['TOP NOTES', 'HEART NOTES', 'BASE NOTES'][idx];
        const time = ['0-30 min', '30min-2hr', '2hr+'][idx];
        return `
        <div class="sauvage-note-tier">
          <div class="sauvage-tier-label">
            <span class="sauvage-tier-name">${label}</span>
            <span class="sauvage-tier-time">${time}</span>
          </div>
          <div class="sauvage-note-chips">
            ${f[type].map(n => `
              <div class="sauvage-chip">
                <span class="sauvage-chip-emoji">${n.emoji}</span>
                <span class="sauvage-chip-name">${n.name}</span>
                <span class="sauvage-chip-bar"><span class="sauvage-chip-fill" data-intensity="${n.intensity}"></span></span>
              </div>
            `).join('')}
          </div>
        </div>`;
      }).join('')}
    </div>`;
}

// 2. BLEU DE CHANEL — Vertical Timeline Notes
function generateBleuScentProfile(f) {
  const attrs = Object.entries(f.scentProfile);
  return `
    <div class="bleudechanel-scent-profile">
      <div class="bleudechanel-wave-grid">
        ${attrs.map(([key, val]) => `
          <div class="bleudechanel-wave-item">
            <div class="bleudechanel-wave-label">${key.toUpperCase()}</div>
            <div class="bleudechanel-wave-track">
              <div class="bleudechanel-wave-bar" style="height: ${val}%">
                <span class="bleudechanel-wave-value">${val}</span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>`;
}

function generateBleuIngredients(f) {
  return `
    <div class="bleudechanel-ingredients">
      <div class="bleudechanel-timeline">
        ${['topNotes', 'heartNotes', 'baseNotes'].map((type, idx) => {
          const label = ['OPENING', 'HEART', 'DRY DOWN'][idx];
          const time = ['First impression', 'Development', 'Lasting trail'][idx];
          return `
          <div class="bleudechanel-timeline-phase">
            <div class="bleudechanel-phase-marker">
              <div class="bleudechanel-marker-dot"></div>
              <div class="bleudechanel-marker-line"></div>
            </div>
            <div class="bleudechanel-phase-content">
              <div class="bleudechanel-phase-header">
                <span class="bleudechanel-phase-name">${label}</span>
                <span class="bleudechanel-phase-time">${time}</span>
              </div>
              <div class="bleudechanel-phase-notes">
                ${f[type].map(n => `
                  <div class="bleudechanel-note-pill">
                    <span class="bleudechanel-pill-emoji">${n.emoji}</span>
                    <span class="bleudechanel-pill-name">${n.name}</span>
                    <span class="bleudechanel-pill-intensity">${n.intensity}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>`;
        }).join('')}
      </div>
    </div>`;
}

// 3. TOBACCO VANILLE — Heat/Warmth Gauge 
function generateTVScentProfile(f) {
  const attrs = Object.entries(f.scentProfile);
  return `
    <div class="tobaccovanille-scent-profile">
      <div class="tv-warmth-gauges">
        ${attrs.map(([key, val]) => `
          <div class="tv-gauge">
            <div class="tv-gauge-label">${key.toUpperCase()}</div>
            <div class="tv-gauge-track">
              <div class="tv-gauge-fill" style="width: ${val}%"></div>
              <div class="tv-gauge-glow" style="left: ${val}%"></div>
            </div>
            <div class="tv-gauge-value">${val}%</div>
          </div>
        `).join('')}
      </div>
      <div class="tv-warmth-indicator">
        <div class="tv-warmth-label">WARMTH INDEX</div>
        <div class="tv-warmth-meter">
          <div class="tv-warmth-fill" style="width: ${(f.scentProfile.sweet + f.scentProfile.spicy) / 2}%"></div>
        </div>
        <div class="tv-warmth-scale">
          <span>Cool</span><span>Warm</span><span>Hot</span>
        </div>
      </div>
    </div>`;
}

function generateTVIngredients(f) {
  return `
    <div class="tobaccovanille-ingredients">
      ${['topNotes', 'heartNotes', 'baseNotes'].map((type, idx) => {
        const label = ['OPENING SPARK', 'GOLDEN HEART', 'SMOKY BASE'][idx];
        return `
        <div class="tv-note-layer">
          <div class="tv-layer-header">${label}</div>
          <div class="tv-layer-cards">
            ${f[type].map(n => `
              <div class="tv-note-card">
                <div class="tv-card-glow"></div>
                <span class="tv-card-emoji">${n.emoji}</span>
                <span class="tv-card-name">${n.name}</span>
                <span class="tv-card-intensity">${n.intensity}</span>
              </div>
            `).join('')}
          </div>
        </div>`;
      }).join('')}
    </div>`;
}

// 4. OUD WOOD — Ring/Concentric Visualization
function generateOWScentProfile(f) {
  const attrs = Object.entries(f.scentProfile);
  return `
    <div class="oudwood-scent-profile">
      <div class="ow-rings-container">
        <svg viewBox="0 0 300 300" class="ow-rings-svg">
          ${attrs.map(([key, val], i) => {
            const r = 30 + i * 25;
            const circumference = 2 * Math.PI * r;
            const dashLen = (val / 100) * circumference;
            return `
            <circle cx="150" cy="150" r="${r}" fill="none" stroke="rgba(125,139,106,${0.15 + i*0.05})" stroke-width="15"/>
            <circle cx="150" cy="150" r="${r}" fill="none" stroke="#7D8B6A" stroke-width="15" stroke-dasharray="${dashLen} ${circumference - dashLen}" stroke-linecap="round" transform="rotate(-90 150 150)" opacity="${0.5 + val/200}"/>`;
          }).join('')}
          <text x="150" y="140" text-anchor="middle" fill="#7D8B6A" font-size="24" font-weight="700" font-family="'Libre Baskerville', serif">OUD</text>
          <text x="150" y="162" text-anchor="middle" fill="#9BA88D" font-size="10" letter-spacing="4" font-family="'Libre Baskerville', serif">PROFILE</text>
        </svg>
        <div class="ow-ring-labels">
          ${attrs.map(([key, val]) => `
            <div class="ow-ring-label">${key.charAt(0).toUpperCase() + key.slice(1)}: <strong>${val}%</strong></div>
          `).join('')}
        </div>
      </div>
    </div>`;
}

function generateOWIngredients(f) {
  return `
    <div class="oudwood-ingredients">
      ${['topNotes', 'heartNotes', 'baseNotes'].map((type, idx) => {
        const label = ['OPENING WOOD', 'SACRED HEART', 'RESINOUS BASE'][idx];
        return `
        <div class="ow-note-section">
          <div class="ow-section-header">
            <span class="ow-section-line"></span>
            <span class="ow-section-title">${label}</span>
            <span class="ow-section-line"></span>
          </div>
          <div class="ow-note-leaves">
            ${f[type].map(n => `
              <div class="ow-leaf">
                <span class="ow-leaf-emoji">${n.emoji}</span>
                <div class="ow-leaf-info">
                  <span class="ow-leaf-name">${n.name}</span>
                  <span class="ow-leaf-intensity">${n.intensity}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>`;
      }).join('')}
    </div>`;
}

// 5. LA NUIT — Constellation Map
function generateLNScentProfile(f) {
  const attrs = Object.entries(f.scentProfile);
  return `
    <div class="lanuit-scent-profile">
      <div class="lanuit-constellation">
        <svg viewBox="0 0 300 250" class="lanuit-constellation-svg">
          ${attrs.map(([key, val], i) => {
            const angle = (i / attrs.length) * 360 - 90;
            const rad = (angle * Math.PI) / 180;
            const dist = 40 + (val / 100) * 80;
            const x = 150 + dist * Math.cos(rad);
            const y = 125 + dist * Math.sin(rad);
            const r = 3 + (val / 100) * 6;
            const nextI = (i + 1) % attrs.length;
            const nextAngle = (nextI / attrs.length) * 360 - 90;
            const nextRad = (nextAngle * Math.PI) / 180;
            const nextVal = attrs[nextI][1];
            const nextDist = 40 + (nextVal / 100) * 80;
            const nx = 150 + nextDist * Math.cos(nextRad);
            const ny = 125 + nextDist * Math.sin(nextRad);
            return `
            <line x1="${x}" y1="${y}" x2="${nx}" y2="${ny}" stroke="rgba(155,127,212,0.3)" stroke-width="1"/>
            <circle cx="${x}" cy="${y}" r="${r}" fill="#9B7FD4" opacity="${0.5 + val/200}"/>
            <circle cx="${x}" cy="${y}" r="${r + 4}" fill="none" stroke="rgba(155,127,212,0.2)" stroke-width="1"/>
            <text x="${150 + (dist + 20) * Math.cos(rad)}" y="${125 + (dist + 20) * Math.sin(rad)}" text-anchor="middle" fill="#9B7FD4" font-size="8" letter-spacing="1" font-family="'Space Grotesk', sans-serif">${key.toUpperCase()}</text>`;
          }).join('')}
          <circle cx="150" cy="125" r="3" fill="#9B7FD4" opacity="0.8"/>
        </svg>
      </div>
      <div class="lanuit-stat-cards">
        ${attrs.map(([key, val]) => `
          <div class="lanuit-stat">
            <div class="lanuit-stat-name">${key.charAt(0).toUpperCase() + key.slice(1)}</div>
            <div class="lanuit-stat-bar"><div class="lanuit-stat-fill" style="width: ${val}%"></div></div>
            <div class="lanuit-stat-val">${val}%</div>
          </div>
        `).join('')}
      </div>
    </div>`;
}

function generateLNIngredients(f) {
  return `
    <div class="lanuit-ingredients">
      ${['topNotes', 'heartNotes', 'baseNotes'].map((type, idx) => {
        const label = ['TWILIGHT OPENING', 'MIDNIGHT HEART', 'DAWN BASE'][idx];
        return `
        <div class="lanuit-note-phase">
          <div class="lanuit-phase-label">${label}</div>
          <div class="lanuit-phase-stars">
            ${f[type].map(n => `
              <div class="lanuit-star-note">
                <span class="lanuit-star-glow"></span>
                <span class="lanuit-star-emoji">${n.emoji}</span>
                <span class="lanuit-star-name">${n.name}</span>
                <span class="lanuit-star-intensity">${n.intensity}</span>
              </div>
            `).join('')}
          </div>
        </div>`;
      }).join('')}
    </div>`;
}

// 6. LOST CHERRY — Split/Card Comparison
function generateLCScentProfile(f) {
  const attrs = Object.entries(f.scentProfile);
  return `
    <div class="lostcherry-scent-profile">
      <div class="lc-split-bars">
        ${attrs.map(([key, val]) => `
          <div class="lc-split-row">
            <div class="lc-split-label">${key.charAt(0).toUpperCase() + key.slice(1)}</div>
            <div class="lc-split-track">
              <div class="lc-split-fill" style="width: ${val}%">
                <span class="lc-split-glow"></span>
              </div>
            </div>
            <div class="lc-split-value">${val}%</div>
          </div>
        `).join('')}
      </div>
    </div>`;
}

function generateLCIngredients(f) {
  return `
    <div class="lostcherry-ingredients">
      ${['topNotes', 'heartNotes', 'baseNotes'].map((type, idx) => {
        const label = ['FIRST BITE', 'SWEET HEART', 'LASTING WARMTH'][idx];
        return `
        <div class="lc-note-section">
          <div class="lc-section-label">${label}</div>
          <div class="lc-note-petals">
            ${f[type].map(n => `
              <div class="lc-petal">
                <div class="lc-petal-inner">
                  <span class="lc-petal-emoji">${n.emoji}</span>
                  <span class="lc-petal-name">${n.name}</span>
                  <span class="lc-petal-intensity">${n.intensity}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>`;
      }).join('')}
    </div>`;
}

// ============================================================================
// SECTION GENERATORS MAP
// ============================================================================
const generators = {
  sauvage: { scentProfile: generateSauvageScentProfile, ingredients: generateSauvageIngredients },
  bleudechanel: { scentProfile: generateBleuScentProfile, ingredients: generateBleuIngredients },
  tobaccovanille: { scentProfile: generateTVScentProfile, ingredients: generateTVIngredients },
  oudwood: { scentProfile: generateOWScentProfile, ingredients: generateOWIngredients },
  lanuit: { scentProfile: generateLNScentProfile, ingredients: generateLNIngredients },
  lostcherry: { scentProfile: generateLCScentProfile, ingredients: generateLCIngredients }
};

// ============================================================================
// FULL SECTION HTML GENERATOR
// ============================================================================
function generateFullSection(f) {
  const gen = generators[f.id];
  const allSeasons = ['spring', 'summer', 'fall', 'winter'];
  const allMoods = [
    { key: 'confident', icon: '💪', label: 'Confident' },
    { key: 'energetic', icon: '⚡', label: 'Energetic' },
    { key: 'casual', icon: '😎', label: 'Casual' },
    { key: 'professional', icon: '💼', label: 'Professional' },
    { key: 'refined', icon: '🎩', label: 'Refined' },
    { key: 'romantic', icon: '❤️', label: 'Romantic' },
    { key: 'evening', icon: '🌙', label: 'Evening' },
    { key: 'luxurious', icon: '👑', label: 'Luxurious' },
    { key: 'intimate', icon: '🕯️', label: 'Intimate' },
    { key: 'meditative', icon: '🧘', label: 'Meditative' },
    { key: 'mysterious', icon: '🔮', label: 'Mysterious' },
    { key: 'bold', icon: '🔥', label: 'Bold' }
  ];
  const seasonIcons = { spring: '🌸', summer: '☀️', fall: '🍂', winter: '❄️' };

  return `
            <!-- ${f.name} Transition Spacer -->
            <section class="content ${f.id}-transition-section" style="min-height: 200px; height: 200px"></section>

            <!-- ====== ${f.brand} ${f.name} Section ====== -->
            <section class="content ${f.id}-section" id="${f.id}">
                <div class="${f.id}-main-container ${f.id}-theme">
                    <!-- Brand Header -->
                    <div class="brand-header" style="text-align: center; margin-bottom: 40px;">
                        <p class="brand-name" style="letter-spacing: 6px; text-transform: uppercase; font-size: 0.9rem;">${f.brand.toUpperCase()}</p>
                        <p class="brand-location" style="letter-spacing: 4px; font-size: 0.7rem; text-transform: uppercase; opacity: 0.7;">PARIS • EST. ${f.year}</p>
                    </div>

                    <!-- Product Section -->
                    <div class="${f.id}-product-section">
                        <img src="${f.id}.png" alt="${f.name}" class="${f.id}-image" />
                        <div class="product-info-section">
                            <h1 class="product-name" style="font-size: 2.5rem; margin-bottom: 8px;">${f.name}</h1>
                            <p style="letter-spacing: 3px; font-size: 0.8rem; opacity: 0.7; margin-bottom: 20px;">${f.subtitle}</p>
                            <p style="font-size: 0.85rem; opacity: 0.6; margin-bottom: 15px;">${f.family} • ${f.concentration}</p>
                            
                            <div class="price-section" style="margin-bottom: 25px;">
                                <div class="price-glow"></div>
                                <span class="price-badge" style="padding: 8px 20px; font-size: 1.1rem; border-radius: 4px;">${f.price}</span>
                            </div>
                            
                            <div class="quality-options" style="display: flex; gap: 12px; flex-wrap: wrap;">
                                ${f.concentration === 'EDP' ? `
                                <label class="quality-option"><input type="radio" name="${f.id}-quality" value="edp" checked /><span class="quality-label"><span class="quality-badge">EDP<span class="quality-shimmer"></span></span><span class="selection-indicator"></span></span></label>
                                <label class="quality-option"><input type="radio" name="${f.id}-quality" value="parfum" /><span class="quality-label"><span class="quality-badge">PARFUM<span class="quality-shimmer"></span></span><span class="selection-indicator"></span></span></label>
                                ` : `
                                <label class="quality-option"><input type="radio" name="${f.id}-quality" value="edt" checked /><span class="quality-label"><span class="quality-badge">EDT<span class="quality-shimmer"></span></span><span class="selection-indicator"></span></label>
                                <label class="quality-option"><input type="radio" name="${f.id}-quality" value="edp" /><span class="quality-label"><span class="quality-badge">EDP<span class="quality-shimmer"></span></span><span class="selection-indicator"></span></span></label>
                                `}
                            </div>
                        </div>
                    </div>

                    <!-- Profiles Container (unique per section) -->
                    <div class="${f.id}-profiles-container">
                        <!-- Scent Profile Card -->
                        <div class="profile-container ${f.id}-profile-card ${f.id}-scent-profile">
                            <div class="profile-header">
                                <h2 class="profile-title" style="font-size: 1.3rem;">Scent DNA</h2>
                                <p class="profile-subtitle" style="font-size: 0.75rem; letter-spacing: 2px;">OLFACTORY PROFILE</p>
                            </div>
                            ${gen.scentProfile(f)}
                        </div>
                        
                        <!-- Ingredients Card -->
                        <div class="profile-container ${f.id}-profile-card ${f.id}-ingredients">
                            <div class="profile-header">
                                <h2 class="profile-title" style="font-size: 1.3rem;">Notes Pyramid</h2>
                                <p class="profile-subtitle" style="font-size: 0.75rem; letter-spacing: 2px;">COMPOSITION BREAKDOWN</p>
                            </div>
                            ${gen.ingredients(f)}
                        </div>
                    </div>

                    <!-- Description -->
                    <div class="${f.id}-fragrance-description">
                        <h3 class="${f.id}-description-title">The Story</h3>
                        <p class="${f.id}-description-subtitle" style="letter-spacing: 2px; text-transform: uppercase;">FRAGRANCE NARRATIVE</p>
                        <p class="${f.id}-description-text">${f.description}</p>
                        <p class="${f.id}-description-text">Crafted by <strong>${f.perfumer}</strong> in ${f.year}, this ${f.family.toLowerCase()} masterpiece 
                        continues to captivate fragrance enthusiasts worldwide.</p>
                    </div>

                    <!-- Mood & Season Indicators -->
                    <div class="${f.id}-perfume-rating">
                        <div class="${f.id}-rating-indicators" style="display: flex; gap: 30px; flex-wrap: wrap; margin-bottom: 25px;">
                            <div>
                                <p style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 10px; opacity: 0.7;">Best Seasons</p>
                                <div class="${f.id}-seasonal-indicators" style="display: flex; gap: 12px;">
                                    ${allSeasons.map(s => `
                                        <div class="${f.id}-indicator-item ${f.seasons.includes(s) ? 'active' : ''}">
                                            <span class="${f.id}-indicator-icon">${seasonIcons[s]}</span>
                                            <span class="${f.id}-indicator-label">${s.charAt(0).toUpperCase() + s.slice(1)}</span>
                                            <div class="${f.id}-indicator-bar"></div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                            <div>
                                <p style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 10px; opacity: 0.7;">Mood</p>
                                <div class="${f.id}-mood-indicators" style="display: flex; gap: 12px; flex-wrap: wrap;">
                                    ${allMoods.filter(m => f.moods.includes(m.key)).map(m => `
                                        <div class="${f.id}-indicator-item active">
                                            <span class="${f.id}-indicator-icon">${m.icon}</span>
                                            <span class="${f.id}-indicator-label">${m.label}</span>
                                            <div class="${f.id}-indicator-bar"></div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                        <p class="${f.id}-rating-title">${f.name} — <span class="${f.id}-score">${((f.ratings.longevity + f.ratings.sillage + f.ratings.versatility + f.ratings.value) / 4).toFixed(1)}/10</span> overall from <span class="${f.id}-votes">${f.reddit.votes}</span> votes</p>
                    </div>

                    <!-- Reddit Review -->
                    <div class="${f.id}-reddit-review-container">
                        <div class="${f.id}-reddit-card">
                            <div class="${f.id}-reddit-header">
                                <div class="${f.id}-reddit-votes">
                                    <button class="${f.id}-vote-btn">▲</button>
                                    <span class="${f.id}-vote-count">${f.reddit.votes}</span>
                                    <button class="${f.id}-vote-btn">▼</button>
                                </div>
                                <div>
                                    <span class="${f.id}-subreddit">${f.reddit.sub}</span>
                                    <span class="${f.id}-post-dot">·</span>
                                    <span class="${f.id}-post-info">Posted by u/${f.reddit.user}</span>
                                    <span class="${f.id}-post-dot">·</span>
                                    <span class="${f.id}-post-time">${f.reddit.time}</span>
                                </div>
                            </div>
                            <div class="${f.id}-reddit-text">
                                <p>${f.reddit.text}</p>
                            </div>
                            <div class="${f.id}-reddit-engagement">
                                <span class="${f.id}-engagement-item">💬 ${Math.floor(f.reddit.votes * 0.15)} comments</span>
                                <span class="${f.id}-engagement-item">🔄 Share</span>
                                <span class="${f.id}-engagement-item">⭐ Save</span>
                            </div>
                        </div>
                    </div>

                    <!-- Additional Ratings -->
                    <div class="${f.id}-additional-ratings">
                        <div class="${f.id}-rating-row" style="display: flex; gap: 25px; flex-wrap: wrap;">
                            <div class="${f.id}-rating-category" style="flex: 1; min-width: 280px;">
                                <div class="${f.id}-category-header">
                                    <span class="${f.id}-category-icon">⏱️</span>
                                    <span class="${f.id}-category-title">PERFORMANCE</span>
                                </div>
                                <div class="${f.id}-rating-bars">
                                    <div class="${f.id}-rating-item"><span class="${f.id}-rating-label">Longevity</span><div class="${f.id}-rating-bar"><div class="${f.id}-bar-fill" style="width: ${f.ratings.longevity * 10}%; background: linear-gradient(90deg, ${f.accentColor}, ${f.accentColor}88)"></div></div><span class="${f.id}-rating-count">${f.ratings.longevity}</span></div>
                                    <div class="${f.id}-rating-item"><span class="${f.id}-rating-label">Sillage</span><div class="${f.id}-rating-bar"><div class="${f.id}-bar-fill" style="width: ${f.ratings.sillage * 10}%; background: linear-gradient(90deg, ${f.accentColor}, ${f.accentColor}88)"></div></div><span class="${f.id}-rating-count">${f.ratings.sillage}</span></div>
                                </div>
                            </div>
                            <div class="${f.id}-rating-category" style="flex: 1; min-width: 280px;">
                                <div class="${f.id}-category-header">
                                    <span class="${f.id}-category-icon">💎</span>
                                    <span class="${f.id}-category-title">VALUE</span>
                                </div>
                                <div class="${f.id}-rating-bars">
                                    <div class="${f.id}-rating-item"><span class="${f.id}-rating-label">Versatility</span><div class="${f.id}-rating-bar"><div class="${f.id}-bar-fill" style="width: ${f.ratings.versatility * 10}%; background: linear-gradient(90deg, ${f.accentColor}, ${f.accentColor}88)"></div></div><span class="${f.id}-rating-count">${f.ratings.versatility}</span></div>
                                    <div class="${f.id}-rating-item"><span class="${f.id}-rating-label">Value</span><div class="${f.id}-rating-bar"><div class="${f.id}-bar-fill" style="width: ${f.ratings.value * 10}%; background: linear-gradient(90deg, ${f.accentColor}, ${f.accentColor}88)"></div></div><span class="${f.id}-rating-count">${f.ratings.value}</span></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Reviews Section -->
                    <div class="reviews-section" id="${f.id}-reviews">
                        <div class="reviews-header">
                            <h3 class="reviews-title"><span class="reviews-icon">💬</span> User Reviews & Comments</h3>
                            <div class="reviews-stats"><span class="reviews-count" id="${f.id}-reviews-count">0 reviews</span></div>
                        </div>
                        <div class="add-review-container" id="${f.id}-add-review" style="display: none">
                            <div class="add-review-form">
                                <div class="review-form-header">
                                    <div class="user-avatar-small" id="${f.id}-review-avatar"><img src="" alt="Your Avatar" /></div>
                                    <div class="review-form-info">
                                        <span class="review-form-username" id="${f.id}-review-username">Your Name</span>
                                        <span class="review-form-subtitle">Share your experience with ${f.name}</span>
                                    </div>
                                </div>
                                <div class="review-rating-container">
                                    <span class="rating-label">Your Rating:</span>
                                    <div class="star-rating" id="${f.id}-star-rating">
                                        <span class="star" data-rating="1">★</span>
                                        <span class="star" data-rating="2">★</span>
                                        <span class="star" data-rating="3">★</span>
                                        <span class="star" data-rating="4">★</span>
                                        <span class="star" data-rating="5">★</span>
                                    </div>
                                </div>
                                <textarea class="review-textarea" id="${f.id}-review-text" placeholder="Share your thoughts about ${f.name}..." maxlength="500"></textarea>
                                <div class="review-form-actions">
                                    <div class="character-count"><span id="${f.id}-char-count">0</span>/500</div>
                                    <div class="review-buttons">
                                        <button class="review-btn cancel-btn" id="${f.id}-cancel-review">Cancel</button>
                                        <button class="review-btn submit-btn" id="${f.id}-submit-review">Post Review</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="review-signin-prompt" id="${f.id}-signin-prompt">
                            <div class="signin-prompt-content">
                                <div class="signin-prompt-icon">🔒</div>
                                <h4>Share Your Experience</h4>
                                <p>Sign in to write a review for ${f.name}.</p>
                                <button class="signin-prompt-btn">Sign In to Review</button>
                            </div>
                        </div>
                        <div class="reviews-list" id="${f.id}-reviews-list"></div>
                        <div class="load-more-container" id="${f.id}-load-more" style="display: none">
                            <button class="load-more-btn" id="${f.id}-load-more-btn">Load More Reviews</button>
                        </div>
                    </div>
                </div>
            </section>`;
}

// ============================================================================
// INSERT INTO INDEX.HTML
// ============================================================================
const indexPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// Generate all 6 sections
const allSectionsHTML = fragrances.map(f => generateFullSection(f)).join('\n');

// Find insertion point: after Aventus section ends, before the empty sections
const insertMarker = `            </section>

            <section class="content"></section>
            <section class="content"></section>
            <section class="content final"></section>`;

if (html.includes(insertMarker)) {
  html = html.replace(insertMarker, `            </section>

${allSectionsHTML}

            <section class="content"></section>
            <section class="content"></section>
            <section class="content final"></section>`);
  console.log('✅ Inserted 6 new sections into index.html');
} else {
  console.log('❌ Could not find insertion marker in index.html');
  process.exit(1);
}

// Add CSS link tags for new sections
const cssInsertAfter = '<link rel="stylesheet" href="css/aventus-profile.css" />';
const newCSSLinks = fragrances.map(f => 
  `        <link rel="stylesheet" href="css/${f.id}-profile.css" />`
).join('\n');

html = html.replace(cssInsertAfter, cssInsertAfter + '\n' + newCSSLinks);
console.log('✅ Added CSS link tags');

fs.writeFileSync(indexPath, html, 'utf8');
console.log('✅ index.html fully updated!');
console.log(`   Total new sections: ${fragrances.length}`);
