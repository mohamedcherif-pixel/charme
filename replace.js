const fs = require('fs');
let code = fs.readFileSync('script.js', 'utf8');

const oldRegex = /\/\/ Legacy hand-written parallax functions \(Layton.*?if \(typeof updateAventusFragranceDescriptionParallax === 'function'\) updateAventusFragranceDescriptionParallax\(\);/s;

const newString = // Legacy hand-written parallax functions (Layton, Pegasus, Greenly, Baccarat Rouge, Black Orchid, Aventus)
            // FIX: Parallax cull to prevent massive layout thrashing lag in hero section
            const _st = window.pageYOffset || document.documentElement.scrollTop;
            const _wh = window.innerHeight || 800;
            const _shouldRunLegacy = (_st > _wh * 0.4);
            
            if (_shouldRunLegacy || !window._legacyParallaxResetDone) {
              if (!_shouldRunLegacy) { window._legacyParallaxResetDone = true; }
              else { window._legacyParallaxResetDone = false; }
              
              if (typeof updateBrandImageParallax === 'function') updateBrandImageParallax();
              if (typeof updateLaytonParallax === 'function') updateLaytonParallax();
              if (typeof updateLaytonNotesParallax === 'function') updateLaytonNotesParallax();
              if (typeof updateProductTitleParallax === 'function') updateProductTitleParallax();
              if (typeof updateFragranceNotesParallax === 'function') updateFragranceNotesParallax();
              if (typeof updatePerfumeRatingParallax === 'function') updatePerfumeRatingParallax();
              if (typeof updatePegasusImageParallax === 'function') updatePegasusImageParallax();
              if (typeof updatePegasusProductTitleParallax === 'function') updatePegasusProductTitleParallax();
              if (typeof updatePegasusFragranceProfileParallax === 'function') updatePegasusFragranceProfileParallax();
              if (typeof updatePegasusFragranceNotesParallax === 'function') updatePegasusFragranceNotesParallax();
              if (typeof updatePegasusPerfumeRatingParallax === 'function') updatePegasusPerfumeRatingParallax();
              if (typeof updateGreenlyImageParallax === 'function') updateGreenlyImageParallax();
              if (typeof updateGreenlyProductInfoParallax === 'function') updateGreenlyProductInfoParallax();
              if (typeof updateGreenlyScentProfileParallax === 'function') updateGreenlyScentProfileParallax();
              if (typeof updateGreenlyIngredientsParallax === 'function') updateGreenlyIngredientsParallax();
              if (typeof updateGreenlyFragranceDescriptionParallax === 'function') updateGreenlyFragranceDescriptionParallax();
              if (typeof updateBaccaratrougeImageParallax === 'function') updateBaccaratrougeImageParallax();
              if (typeof updateBaccaratrougeProductInfoParallax === 'function') updateBaccaratrougeProductInfoParallax();
              if (typeof updateBaccaratrougeScentProfileParallax === 'function') updateBaccaratrougeScentProfileParallax();
              if (typeof updateBaccaratrougeIngredientsParallax === 'function') updateBaccaratrougeIngredientsParallax();
              if (typeof updateBaccaratrougeFragranceDescriptionParallax === 'function') updateBaccaratrougeFragranceDescriptionParallax();
              if (typeof updateBlackorchidImageParallax === 'function') updateBlackorchidImageParallax();
              if (typeof updateBlackorchidProductInfoParallax === 'function') updateBlackorchidProductInfoParallax();
              if (typeof updateBlackorchidScentProfileParallax === 'function') updateBlackorchidScentProfileParallax();
              if (typeof updateBlackorchidIngredientsParallax === 'function') updateBlackorchidIngredientsParallax();
              if (typeof updateBlackorchidFragranceDescriptionParallax === 'function') updateBlackorchidFragranceDescriptionParallax();
              if (typeof updateAventusImageParallax === 'function') updateAventusImageParallax();
              if (typeof updateAventusProductInfoParallax === 'function') updateAventusProductInfoParallax();
              if (typeof updateAventusScentProfileParallax === 'function') updateAventusScentProfileParallax();
              if (typeof updateAventusIngredientsParallax === 'function') updateAventusIngredientsParallax();
              if (typeof updateAventusFragranceDescriptionParallax === 'function') updateAventusFragranceDescriptionParallax();
            };

if (oldRegex.test(code)) {
    code = code.replace(oldRegex, newString);
    fs.writeFileSync('script.js', code);
    console.log('Success!');
} else {
    console.log('Did not match!');
}
