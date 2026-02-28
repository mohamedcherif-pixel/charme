
// --- OPTIMIZED SCROLL CACHING ---
let _cachedOffsets = new Map();
let _cachedHeights = new Map();
let _cachedRects = new Map();
let _cachedElements = new Map();
let _lastCacheTime = 0;

function _getEl(id, classSelector) {
  const key = id + '|' + classSelector;
  if (!_cachedElements.has(key)) {
    _cachedElements.set(key, document.getElementById(id) || document.querySelector(classSelector));
  }
  return _cachedElements.get(key);
}

function _getAll(selector) {
  if (!_cachedElements.has(selector)) {
    _cachedElements.set(selector, Array.from(document.querySelectorAll(selector)));
  }
  return _cachedElements.get(selector);
}

function _getOffsetTop(el) {
  if (!el) return 0;
  if (!_cachedOffsets.has(el)) {
    _cachedOffsets.set(el, el.offsetTop);
  }
  return _cachedOffsets.get(el);
}

function _getOffsetHeight(el) {
  if (!el) return 0;
  if (!_cachedHeights.has(el)) {
    _cachedHeights.set(el, el.offsetHeight);
  }
  return _cachedHeights.get(el);
}

function _getBoundingClientRect(el) {
  if (!el) return { top: 0, height: 0, bottom: 0, left: 0, right: 0, width: 0 };
  if (!_cachedRects.has(el)) {
    _cachedRects.set(el, el.getBoundingClientRect());
  }
  return _cachedRects.get(el);
}

function invalidateScrollCache() {
  _cachedOffsets.clear();
  _cachedHeights.clear();
  _cachedRects.clear();
  _lastCacheTime = Date.now();
}

// Invalidate cache on resize
window.addEventListener('resize', invalidateScrollCache, { passive: true });

// Also invalidate periodically just in case layout changes (e.g. images load)
setInterval(() => {
  if (Date.now() - _lastCacheTime > 2000) {
    invalidateScrollCache();
  }
}, 2000);
// --------------------------------

function updateColors() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const documentHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const windowHeight = window.innerHeight;

    const getSectionEl = _getEl;

    // Calculate when user has scrolled past the video section (100vh)
    const videoSectionHeight = windowHeight; // 100vh
    const contentHeight =
      _getEl("", ".content")?.offsetHeight || windowHeight * 3;

    // Define transition zones - black stays much longer
    const blackDuration = contentHeight * 0.92; // Black stays for 92% of content height (was 85%)
    const transitionStart = videoSectionHeight + blackDuration; // Start transition much later
    const transitionRange = contentHeight * 0.08; // Use 8% of content height for transition (was 15%)
    const transitionEnd = transitionStart + transitionRange;

    // Start cream transition later into the Haltane section
    const haltaneSection = _getEl("", ".haltane-section-container");
    const creamTransitionStart = haltaneSection
      ? _getOffsetTop(haltaneSection) + 500
      : transitionEnd;
    const creamTransitionRange = windowHeight * 0.3; // Transition over 30% of viewport height
    const creamTransitionEnd = creamTransitionStart + creamTransitionRange;

    // Start light grey transition at Pegasus section
    const pegasusSection = _getEl("", ".pegasus-image");
    const greyTransitionStart = pegasusSection
      ? _getOffsetTop(pegasusSection.closest(".content")) - 800
      : creamTransitionEnd + windowHeight;
    const greyTransitionRange = windowHeight * 0.5; // Transition over 50% of viewport height
    const greyTransitionEnd = greyTransitionStart + greyTransitionRange;

    // Calculate transition points relative to the white transition section
    const whiteTransitionSection = _getEl("", ".white-transition-section",);
    const whiteTransitionRect = _getBoundingClientRect(whiteTransitionSection);
    const whiteTransitionTop = window.scrollY + whiteTransitionRect.top;
    const whiteTransitionHeight = whiteTransitionRect.height;

    // Set the soft green transition to start at the bottom of the white transition section
    const softGreenTransitionStart =
      whiteTransitionTop + whiteTransitionHeight - window.innerHeight * 0.7; // Start much earlier (was 0.3)
    const softGreenTransitionRange = windowHeight * 0.5; // Transition over 50% of viewport height
    const softGreenTransitionEnd =
      softGreenTransitionStart + softGreenTransitionRange;

    // Background transitions: black -> cream -> pegasus (red/black) -> vibrant green
    let backgroundColor;
    const pegasusTransitionColor =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--pegasus-transition-color")
        ?.trim() || "#171719";
    if (scrollTop < creamTransitionStart) {
      // Before emoji rating section - stay black
      backgroundColor = "#000000";
    } else if (scrollTop < creamTransitionEnd) {
      // In cream transition zone - fade from black to cream
      const rawProgress =
        (scrollTop - creamTransitionStart) / creamTransitionRange;
      // Apply slower easing curve for smoother, more gradual fade
      const easedProgress = Math.pow(rawProgress, 0.7); // Slower than linear
      backgroundColor = interpolateColor("#000000", "#f5f0e6", easedProgress);
    } else if (scrollTop < greyTransitionStart) {
      // Between cream and pegasus transition - stay cream
      backgroundColor = "#f5f0e6";
    } else if (scrollTop < greyTransitionEnd) {
      // In pegasus transition zone - fade from cream to configured red/black
      const rawProgress =
        (scrollTop - greyTransitionStart) / greyTransitionRange;
      const easedProgress = Math.pow(rawProgress, 0.6); // Smooth easing
      backgroundColor = interpolateColor(
        "#f5f0e6",
        pegasusTransitionColor,
        easedProgress,
      );
    } else if (scrollTop < softGreenTransitionStart) {
      // Between pegasus and soft green transition - stay on pegasus color
      backgroundColor = pegasusTransitionColor;
    } else if (scrollTop < softGreenTransitionEnd) {
      // In transition zone - fade from pegasus color to light grey
      const rawProgress =
        (scrollTop - softGreenTransitionStart) / softGreenTransitionRange;
      const easedProgress = Math.pow(rawProgress, 0.5); // Gentle easing
      // Fade to light green instead of pure white
      backgroundColor = interpolateColor(
        pegasusTransitionColor,
        "#f0f8f0",
        easedProgress,
      );
        } else {
      // Past Greenly - now transition through new sections
      // Baccarat Rouge 540: light green → rose blush
      const br540Section = getSectionEl("baccaratrouge", ".baccaratrouge-section");
      const blackOrchidSection = getSectionEl("blackorchid", ".blackorchid-section");
      const aventusSection = getSectionEl("aventus", ".aventus-section");
      
      if (br540Section && blackOrchidSection && aventusSection) {
        const br540Top = _getOffsetTop(br540Section);
        const br540TransStart = br540Top - windowHeight * 0.7;
        const br540TransEnd = br540TransStart + windowHeight * 0.5;
        
        const boTop = _getOffsetTop(blackOrchidSection);
        const boTransStart = boTop - windowHeight * 0.7;
        const boTransEnd = boTransStart + windowHeight * 0.5;
        
        const avTop = _getOffsetTop(aventusSection);
        const avTransStart = avTop - windowHeight * 0.7;
        const avTransEnd = avTransStart + windowHeight * 0.5;
        
        if (scrollTop < br540TransStart) {
          // Stay light green
          backgroundColor = "#f0f8f0";
        } else if (scrollTop < br540TransEnd) {
          // Light green → rose blush
          const progress = Math.pow((scrollTop - br540TransStart) / (br540TransEnd - br540TransStart), 0.6);
          backgroundColor = interpolateColor("#f0f8f0", "#fdf2f2", progress);
        } else if (scrollTop < boTransStart) {
          // Stay rose blush
          backgroundColor = "#fdf2f2";
        } else if (scrollTop < boTransEnd) {
          // Rose blush → deep noir
          const progress = Math.pow((scrollTop - boTransStart) / (boTransEnd - boTransStart), 0.6);
          backgroundColor = interpolateColor("#fdf2f2", "#0a0a0f", progress);
        } else if (scrollTop < avTransStart) {
          // Stay deep noir
          backgroundColor = "#0a0a0f";
        } else if (scrollTop < avTransEnd) {
          // Deep noir → cool silver/platinum
          const progress = Math.pow((scrollTop - avTransStart) / (avTransEnd - avTransStart), 0.6);
          backgroundColor = interpolateColor("#0a0a0f", "#e8e8ec", progress);
        } else {
          // Past Aventus - transition through 6 new sections
          const sauvageSection = getSectionEl("sauvage", ".sauvage-section");
          const bleuSection = getSectionEl("bleudechanel", ".bleudechanel-section");
          const tvSection = getSectionEl("tobaccovanille", ".tobaccovanille-section");
          const owSection = getSectionEl("oudwood", ".oudwood-section");
          const lnSection = getSectionEl("lanuit", ".lanuit-section");
          const lcSection = getSectionEl("lostcherry", ".lostcherry-section");

          if (sauvageSection && bleuSection && tvSection && owSection && lnSection && lcSection) {
            const svTop = _getOffsetTop(sauvageSection);
            const svTransStart = svTop - windowHeight * 0.7;
            const svTransEnd = svTransStart + windowHeight * 0.5;

            const blTop = _getOffsetTop(bleuSection);
            const blTransStart = blTop - windowHeight * 0.7;
            const blTransEnd = blTransStart + windowHeight * 0.5;

            const tvTop = _getOffsetTop(tvSection);
            const tvTransStart = tvTop - windowHeight * 0.7;
            const tvTransEnd = tvTransStart + windowHeight * 0.5;

            const owTop = _getOffsetTop(owSection);
            const owTransStart = owTop - windowHeight * 0.7;
            const owTransEnd = owTransStart + windowHeight * 0.5;

            const lnTop = _getOffsetTop(lnSection);
            const lnTransStart = lnTop - windowHeight * 0.7;
            const lnTransEnd = lnTransStart + windowHeight * 0.5;

            const lcTop = _getOffsetTop(lcSection);
            const lcTransStart = lcTop - windowHeight * 0.7;
            const lcTransEnd = lcTransStart + windowHeight * 0.5;

            if (scrollTop < svTransStart) {
              // Stay platinum
              backgroundColor = "#e8e8ec";
            } else if (scrollTop < svTransEnd) {
              // Platinum → cool slate (Sauvage)
              const progress = Math.pow((scrollTop - svTransStart) / (svTransEnd - svTransStart), 0.6);
              backgroundColor = interpolateColor("#e8e8ec", "#d6dde6", progress);
            } else if (scrollTop < blTransStart) {
              // Stay cool slate
              backgroundColor = "#d6dde6";
            } else if (scrollTop < blTransEnd) {
              // Cool slate → deep navy (Bleu de Chanel)
              const progress = Math.pow((scrollTop - blTransStart) / (blTransEnd - blTransStart), 0.6);
              backgroundColor = interpolateColor("#d6dde6", "#0d1b2a", progress);
            } else if (scrollTop < tvTransStart) {
              // Stay deep navy
              backgroundColor = "#0d1b2a";
            } else if (scrollTop < tvTransEnd) {
              // Deep navy → warm brown (Tobacco Vanille)
              const progress = Math.pow((scrollTop - tvTransStart) / (tvTransEnd - tvTransStart), 0.6);
              backgroundColor = interpolateColor("#0d1b2a", "#2c1810", progress);
            } else if (scrollTop < owTransStart) {
              // Stay warm brown
              backgroundColor = "#2c1810";
            } else if (scrollTop < owTransEnd) {
              // Warm brown → dark olive (Oud Wood)
              const progress = Math.pow((scrollTop - owTransStart) / (owTransEnd - owTransStart), 0.6);
              backgroundColor = interpolateColor("#2c1810", "#1a1f16", progress);
            } else if (scrollTop < lnTransStart) {
              // Stay dark olive
              backgroundColor = "#1a1f16";
            } else if (scrollTop < lnTransEnd) {
              // Dark olive → deep purple (La Nuit)
              const progress = Math.pow((scrollTop - lnTransStart) / (lnTransEnd - lnTransStart), 0.6);
              backgroundColor = interpolateColor("#1a1f16", "#0f0a1a", progress);
            } else if (scrollTop < lcTransStart) {
              // Stay deep purple
              backgroundColor = "#0f0a1a";
            } else if (scrollTop < lcTransEnd) {
              // Deep purple → cherry dark (Lost Cherry)
              const progress = Math.pow((scrollTop - lcTransStart) / (lcTransEnd - lcTransStart), 0.6);
              backgroundColor = interpolateColor("#0f0a1a", "#2d0a0a", progress);
            } else {
              // Past Lost Cherry - transition through 10 new sections
              const yvslSection = getSectionEl("yvsl", ".yvsl-section");
              const adgSection = getSectionEl("aquadigio", ".aquadigio-section");
              const dySection = getSectionEl("dy", ".dy-section");
              const veSection = getSectionEl("versaceeros", ".versaceeros-section");
              const jpgSection = getSectionEl("jpgultramale", ".jpgultramale-section");
              const invSection = getSectionEl("invictus", ".invictus-section");
              const valSection = getSectionEl("valentinouomo", ".valentinouomo-section");
              const sbSection = getSectionEl("spicebomb", ".spicebomb-section");
              const expSection = getSectionEl("explorer", ".explorer-section");
              const blvSection = getSectionEl("blv", ".blv-section");
              const dhSection = getSectionEl("diorhomme", ".diorhomme-section");
              const alSection = getSectionEl("allure", ".allure-section");
              const tlSection = getSectionEl("tuscanleather", ".tuscanleather-section");
              const acSection = getSectionEl("armanicode", ".armanicode-section");
              const lhiSection = getSectionEl("lhommeideal", ".lhommeideal-section");
              const tdhSection = getSectionEl("terredhermes", ".terredhermes-section");
              const gentSection = getSectionEl("gentleman", ".gentleman-section");
              const wbnSection = getSectionEl("wantedbynight", ".wantedbynight-section");
              const kdgSection = getSectionEl("kbyDG", ".kbyDG-section");
              const ldiSection = getSectionEl("leaudissey", ".leaudissey-section");
              const cbbSection = getSectionEl("chbadboy", ".chbadboy-section");
              const yslbSection = getSectionEl("ysllibre", ".ysllibre-section");
              const fpSection = getSectionEl("fireplace", ".fireplace-section");
              const pcSection = getSectionEl("pradacarbon", ".pradacarbon-section");
              const bhSection = getSectionEl("burberryhero", ".burberryhero-section");
              const nfhSection = getSectionEl("narcisoforhim", ".narcisoforhim-section");
              const ckeSection = getSectionEl("cketernity", ".cketernity-section");
              const ggSection = getSectionEl("gucciguilty", ".gucciguilty-section");
              const vdSection = getSectionEl("valentinodonna", ".valentinodonna-section");
              const giSection = getSectionEl("greenirish", ".greenirish-section");
              const egoSection = getSectionEl("egoiste", ".egoiste-section");
              const ampSection = getSectionEl("amenpure", ".amenpure-section");
              const dcSection = getSectionEl("declarationcartier", ".declarationcartier-section");
              const lwSection = getSectionEl("laween", ".laween-section");
              const cmSection = getSectionEl("cedarsmancera", ".cedarsmancera-section");
              const rmSection = getSectionEl("reflectionman", ".reflectionman-section");
              const sedSection = getSectionEl("sedley", ".sedley-section");
              const seSection = getSectionEl("sideeffect", ".sideeffect-section");
              const naxSection = getSectionEl("naxos", ".naxos-section");
              const gsSection = getSectionEl("grandSoir", ".grandSoir-section");


              if (yvslSection) {
                const yvslTop = _getOffsetTop(yvslSection);
                const yvslTransStart = yvslTop - windowHeight * 0.7;
                const yvslTransEnd = yvslTransStart + windowHeight * 0.5;

                const adgTop = adgSection ? _getOffsetTop(adgSection) : yvslTop + 2000;
                const adgTransStart = adgTop - windowHeight * 0.7;
                const adgTransEnd = adgTransStart + windowHeight * 0.5;

                const dyTop = dySection ? _getOffsetTop(dySection) : adgTop + 2000;
                const dyTransStart = dyTop - windowHeight * 0.7;
                const dyTransEnd = dyTransStart + windowHeight * 0.5;

                const veTop = veSection ? _getOffsetTop(veSection) : dyTop + 2000;
                const veTransStart = veTop - windowHeight * 0.7;
                const veTransEnd = veTransStart + windowHeight * 0.5;

                const jpgTop = jpgSection ? _getOffsetTop(jpgSection) : veTop + 2000;
                const jpgTransStart = jpgTop - windowHeight * 0.7;
                const jpgTransEnd = jpgTransStart + windowHeight * 0.5;

                const invTop = invSection ? _getOffsetTop(invSection) : jpgTop + 2000;
                const invTransStart = invTop - windowHeight * 0.7;
                const invTransEnd = invTransStart + windowHeight * 0.5;

                const valTop = valSection ? _getOffsetTop(valSection) : invTop + 2000;
                const valTransStart = valTop - windowHeight * 0.7;
                const valTransEnd = valTransStart + windowHeight * 0.5;

                const sbTop = sbSection ? _getOffsetTop(sbSection) : valTop + 2000;
                const sbTransStart = sbTop - windowHeight * 0.7;
                const sbTransEnd = sbTransStart + windowHeight * 0.5;

                const expTop = expSection ? _getOffsetTop(expSection) : sbTop + 2000;
                const expTransStart = expTop - windowHeight * 0.7;
                const expTransEnd = expTransStart + windowHeight * 0.5;

                const blvTop = blvSection ? _getOffsetTop(blvSection) : expTop + 2000;
                const blvTransStart = blvTop - windowHeight * 0.7;
                const blvTransEnd = blvTransStart + windowHeight * 0.5;
                const dhTop = dhSection ? _getOffsetTop(dhSection) : blvTop + 2000;
                const dhTransStart = dhTop - windowHeight * 0.7;
                const dhTransEnd = dhTransStart + windowHeight * 0.5;
                const alTop = alSection ? _getOffsetTop(alSection) : dhTop + 2000;
                const alTransStart = alTop - windowHeight * 0.7;
                const alTransEnd = alTransStart + windowHeight * 0.5;
                const tlTop = tlSection ? _getOffsetTop(tlSection) : alTop + 2000;
                const tlTransStart = tlTop - windowHeight * 0.7;
                const tlTransEnd = tlTransStart + windowHeight * 0.5;
                const acTop = acSection ? _getOffsetTop(acSection) : tlTop + 2000;
                const acTransStart = acTop - windowHeight * 0.7;
                const acTransEnd = acTransStart + windowHeight * 0.5;
                const lhiTop = lhiSection ? _getOffsetTop(lhiSection) : acTop + 2000;
                const lhiTransStart = lhiTop - windowHeight * 0.7;
                const lhiTransEnd = lhiTransStart + windowHeight * 0.5;
                const tdhTop = tdhSection ? _getOffsetTop(tdhSection) : lhiTop + 2000;
                const tdhTransStart = tdhTop - windowHeight * 0.7;
                const tdhTransEnd = tdhTransStart + windowHeight * 0.5;
                const gentTop = gentSection ? _getOffsetTop(gentSection) : tdhTop + 2000;
                const gentTransStart = gentTop - windowHeight * 0.7;
                const gentTransEnd = gentTransStart + windowHeight * 0.5;
                const wbnTop = wbnSection ? _getOffsetTop(wbnSection) : gentTop + 2000;
                const wbnTransStart = wbnTop - windowHeight * 0.7;
                const wbnTransEnd = wbnTransStart + windowHeight * 0.5;
                const kdgTop = kdgSection ? _getOffsetTop(kdgSection) : wbnTop + 2000;
                const kdgTransStart = kdgTop - windowHeight * 0.7;
                const kdgTransEnd = kdgTransStart + windowHeight * 0.5;
                const ldiTop = ldiSection ? _getOffsetTop(ldiSection) : kdgTop + 2000;
                const ldiTransStart = ldiTop - windowHeight * 0.7;
                const ldiTransEnd = ldiTransStart + windowHeight * 0.5;
                const cbbTop = cbbSection ? _getOffsetTop(cbbSection) : ldiTop + 2000;
                const cbbTransStart = cbbTop - windowHeight * 0.7;
                const cbbTransEnd = cbbTransStart + windowHeight * 0.5;
                const yslbTop = yslbSection ? _getOffsetTop(yslbSection) : cbbTop + 2000;
                const yslbTransStart = yslbTop - windowHeight * 0.7;
                const yslbTransEnd = yslbTransStart + windowHeight * 0.5;
                const fpTop = fpSection ? _getOffsetTop(fpSection) : yslbTop + 2000;
                const fpTransStart = fpTop - windowHeight * 0.7;
                const fpTransEnd = fpTransStart + windowHeight * 0.5;
                const pcTop = pcSection ? _getOffsetTop(pcSection) : fpTop + 2000;
                const pcTransStart = pcTop - windowHeight * 0.7;
                const pcTransEnd = pcTransStart + windowHeight * 0.5;
                const bhTop = bhSection ? _getOffsetTop(bhSection) : pcTop + 2000;
                const bhTransStart = bhTop - windowHeight * 0.7;
                const bhTransEnd = bhTransStart + windowHeight * 0.5;
                const nfhTop = nfhSection ? _getOffsetTop(nfhSection) : bhTop + 2000;
                const nfhTransStart = nfhTop - windowHeight * 0.7;
                const nfhTransEnd = nfhTransStart + windowHeight * 0.5;
                const ckeTop = ckeSection ? _getOffsetTop(ckeSection) : nfhTop + 2000;
                const ckeTransStart = ckeTop - windowHeight * 0.7;
                const ckeTransEnd = ckeTransStart + windowHeight * 0.5;
                const ggTop = ggSection ? _getOffsetTop(ggSection) : ckeTop + 2000;
                const ggTransStart = ggTop - windowHeight * 0.7;
                const ggTransEnd = ggTransStart + windowHeight * 0.5;
                const vdTop = vdSection ? _getOffsetTop(vdSection) : ggTop + 2000;
                const vdTransStart = vdTop - windowHeight * 0.7;
                const vdTransEnd = vdTransStart + windowHeight * 0.5;
                const giTop = giSection ? _getOffsetTop(giSection) : vdTop + 2000;
                const giTransStart = giTop - windowHeight * 0.7;
                const giTransEnd = giTransStart + windowHeight * 0.5;
                const egoTop = egoSection ? _getOffsetTop(egoSection) : giTop + 2000;
                const egoTransStart = egoTop - windowHeight * 0.7;
                const egoTransEnd = egoTransStart + windowHeight * 0.5;
                const ampTop = ampSection ? _getOffsetTop(ampSection) : egoTop + 2000;
                const ampTransStart = ampTop - windowHeight * 0.7;
                const ampTransEnd = ampTransStart + windowHeight * 0.5;
                const dcTop = dcSection ? _getOffsetTop(dcSection) : ampTop + 2000;
                const dcTransStart = dcTop - windowHeight * 0.7;
                const dcTransEnd = dcTransStart + windowHeight * 0.5;
                const lwTop = lwSection ? _getOffsetTop(lwSection) : dcTop + 2000;
                const lwTransStart = lwTop - windowHeight * 0.7;
                const lwTransEnd = lwTransStart + windowHeight * 0.5;
                const cmTop = cmSection ? _getOffsetTop(cmSection) : lwTop + 2000;
                const cmTransStart = cmTop - windowHeight * 0.7;
                const cmTransEnd = cmTransStart + windowHeight * 0.5;
                const rmTop = rmSection ? _getOffsetTop(rmSection) : cmTop + 2000;
                const rmTransStart = rmTop - windowHeight * 0.7;
                const rmTransEnd = rmTransStart + windowHeight * 0.5;
                const sedTop = sedSection ? _getOffsetTop(sedSection) : rmTop + 2000;
                const sedTransStart = sedTop - windowHeight * 0.7;
                const sedTransEnd = sedTransStart + windowHeight * 0.5;
                const seTop = seSection ? _getOffsetTop(seSection) : sedTop + 2000;
                const seTransStart = seTop - windowHeight * 0.7;
                const seTransEnd = seTransStart + windowHeight * 0.5;
                const naxTop = naxSection ? _getOffsetTop(naxSection) : seTop + 2000;
                const naxTransStart = naxTop - windowHeight * 0.7;
                const naxTransEnd = naxTransStart + windowHeight * 0.5;
                const gsTop = gsSection ? _getOffsetTop(gsSection) : naxTop + 2000;
                const gsTransStart = gsTop - windowHeight * 0.7;
                const gsTransEnd = gsTransStart + windowHeight * 0.5;

                if (scrollTop < yvslTransStart) {
                  backgroundColor = "#2d0a0a";
                } else if (scrollTop < yvslTransEnd) {
                  const progress = Math.pow((scrollTop - yvslTransStart) / (yvslTransEnd - yvslTransStart), 0.6);
                  backgroundColor = interpolateColor("#2d0a0a", "#0a0a1e", progress);
                } else if (scrollTop < adgTransStart) {
                  backgroundColor = "#0a0a1e";
                } else if (scrollTop < adgTransEnd) {
                  const progress = Math.pow((scrollTop - adgTransStart) / (adgTransEnd - adgTransStart), 0.6);
                  backgroundColor = interpolateColor("#0a0a1e", "#0a1a2a", progress);
                } else if (scrollTop < dyTransStart) {
                  backgroundColor = "#0a1a2a";
                } else if (scrollTop < dyTransEnd) {
                  const progress = Math.pow((scrollTop - dyTransStart) / (dyTransEnd - dyTransStart), 0.6);
                  backgroundColor = interpolateColor("#0a1a2a", "#1e150d", progress);
                } else if (scrollTop < veTransStart) {
                  backgroundColor = "#1e150d";
                } else if (scrollTop < veTransEnd) {
                  const progress = Math.pow((scrollTop - veTransStart) / (veTransEnd - veTransStart), 0.6);
                  backgroundColor = interpolateColor("#1e150d", "#051a1a", progress);
                } else if (scrollTop < jpgTransStart) {
                  backgroundColor = "#051a1a";
                } else if (scrollTop < jpgTransEnd) {
                  const progress = Math.pow((scrollTop - jpgTransStart) / (jpgTransEnd - jpgTransStart), 0.6);
                  backgroundColor = interpolateColor("#051a1a", "#120a24", progress);
                } else if (scrollTop < invTransStart) {
                  backgroundColor = "#120a24";
                } else if (scrollTop < invTransEnd) {
                  const progress = Math.pow((scrollTop - invTransStart) / (invTransEnd - invTransStart), 0.6);
                  backgroundColor = interpolateColor("#120a24", "#1a1e22", progress);
                } else if (scrollTop < valTransStart) {
                  backgroundColor = "#1a1e22";
                } else if (scrollTop < valTransEnd) {
                  const progress = Math.pow((scrollTop - valTransStart) / (valTransEnd - valTransStart), 0.6);
                  backgroundColor = interpolateColor("#1a1e22", "#1e0f0f", progress);
                } else if (scrollTop < sbTransStart) {
                  backgroundColor = "#1e0f0f";
                } else if (scrollTop < sbTransEnd) {
                  const progress = Math.pow((scrollTop - sbTransStart) / (sbTransEnd - sbTransStart), 0.6);
                  backgroundColor = interpolateColor("#1e0f0f", "#0d0505", progress);
                } else if (scrollTop < expTransStart) {
                  backgroundColor = "#0d0505";
                } else if (scrollTop < expTransEnd) {
                  const progress = Math.pow((scrollTop - expTransStart) / (expTransEnd - expTransStart), 0.6);
                  backgroundColor = interpolateColor("#0d0505", "#0d1318", progress);
                } else if (scrollTop < blvTransStart) {
                  backgroundColor = "#0d1318";
                } else if (scrollTop < blvTransEnd) {
                  const progress = Math.pow((scrollTop - blvTransStart) / (blvTransEnd - blvTransStart), 0.6);
                  backgroundColor = interpolateColor("#0d1318", "#0a0804", progress);
                } else if (scrollTop < dhTransStart) {
                  backgroundColor = "#0a0804";
                } else if (scrollTop < dhTransEnd) {
                  const progress = Math.pow((scrollTop - dhTransStart) / (dhTransEnd - dhTransStart), 0.6);
                  backgroundColor = interpolateColor("#0a0804", "#0a0a14", progress);
                } else if (scrollTop < alTransStart) {
                  backgroundColor = "#0a0a14";
                } else if (scrollTop < alTransEnd) {
                  const progress = Math.pow((scrollTop - alTransStart) / (alTransEnd - alTransStart), 0.6);
                  backgroundColor = interpolateColor("#0a0a14", "#0f0f0f", progress);
                } else if (scrollTop < tlTransStart) {
                  backgroundColor = "#0f0f0f";
                } else if (scrollTop < tlTransEnd) {
                  const progress = Math.pow((scrollTop - tlTransStart) / (tlTransEnd - tlTransStart), 0.6);
                  backgroundColor = interpolateColor("#0f0f0f", "#1a0e08", progress);
                } else if (scrollTop < acTransStart) {
                  backgroundColor = "#1a0e08";
                } else if (scrollTop < acTransEnd) {
                  const progress = Math.pow((scrollTop - acTransStart) / (acTransEnd - acTransStart), 0.6);
                  backgroundColor = interpolateColor("#1a0e08", "#12060e", progress);
                } else if (scrollTop < lhiTransStart) {
                  backgroundColor = "#12060e";
                } else if (scrollTop < lhiTransEnd) {
                  const progress = Math.pow((scrollTop - lhiTransStart) / (lhiTransEnd - lhiTransStart), 0.6);
                  backgroundColor = interpolateColor("#12060e", "#140d06", progress);
                } else if (scrollTop < tdhTransStart) {
                  backgroundColor = "#140d06";
                } else if (scrollTop < tdhTransEnd) {
                  const progress = Math.pow((scrollTop - tdhTransStart) / (tdhTransEnd - tdhTransStart), 0.6);
                  backgroundColor = interpolateColor("#140d06", "#1a0e04", progress);
                } else if (scrollTop < gentTransStart) {
                  backgroundColor = "#1a0e04";
                } else if (scrollTop < gentTransEnd) {
                  const progress = Math.pow((scrollTop - gentTransStart) / (gentTransEnd - gentTransStart), 0.6);
                  backgroundColor = interpolateColor("#1a0e04", "#0a0a14", progress);
                } else if (scrollTop < wbnTransStart) {
                  backgroundColor = "#0a0a14";
                } else if (scrollTop < wbnTransEnd) {
                  const progress = Math.pow((scrollTop - wbnTransStart) / (wbnTransEnd - wbnTransStart), 0.6);
                  backgroundColor = interpolateColor("#0a0a14", "#1a0505", progress);
                } else if (scrollTop < kdgTransStart) {
                  backgroundColor = "#1a0505";
                } else if (scrollTop < kdgTransEnd) {
                  const progress = Math.pow((scrollTop - kdgTransStart) / (kdgTransEnd - kdgTransStart), 0.6);
                  backgroundColor = interpolateColor("#1a0505", "#14100a", progress);
                } else if (scrollTop < ldiTransStart) {
                  backgroundColor = "#14100a";
                } else if (scrollTop < ldiTransEnd) {
                  const progress = Math.pow((scrollTop - ldiTransStart) / (ldiTransEnd - ldiTransStart), 0.6);
                  backgroundColor = interpolateColor("#14100a", "#04101a", progress);
                } else if (scrollTop < cbbTransStart) {
                  backgroundColor = "#04101a";
                } else if (scrollTop < cbbTransEnd) {
                  const progress = Math.pow((scrollTop - cbbTransStart) / (cbbTransEnd - cbbTransStart), 0.6);
                  backgroundColor = interpolateColor("#04101a", "#04080e", progress);
                } else if (scrollTop < yslbTransStart) {
                  backgroundColor = "#04080e";
                } else if (scrollTop < yslbTransEnd) {
                  const progress = Math.pow((scrollTop - yslbTransStart) / (yslbTransEnd - yslbTransStart), 0.6);
                  backgroundColor = interpolateColor("#04080e", "#140e08", progress);
                } else if (scrollTop < fpTransStart) {
                  backgroundColor = "#140e08";
                } else if (scrollTop < fpTransEnd) {
                  const progress = Math.pow((scrollTop - fpTransStart) / (fpTransEnd - fpTransStart), 0.6);
                  backgroundColor = interpolateColor("#140e08", "#1a0e04", progress);
                } else if (scrollTop < pcTransStart) {
                  backgroundColor = "#1a0e04";
                } else if (scrollTop < pcTransEnd) {
                  const progress = Math.pow((scrollTop - pcTransStart) / (pcTransEnd - pcTransStart), 0.6);
                  backgroundColor = interpolateColor("#1a0e04", "#0a0a0a", progress);
                } else if (scrollTop < bhTransStart) {
                  backgroundColor = "#0a0a0a";
                } else if (scrollTop < bhTransEnd) {
                  const progress = Math.pow((scrollTop - bhTransStart) / (bhTransEnd - bhTransStart), 0.6);
                  backgroundColor = interpolateColor("#0a0a0a", "#120e0a", progress);
                } else if (scrollTop < nfhTransStart) {
                  backgroundColor = "#120e0a";
                } else if (scrollTop < nfhTransEnd) {
                  const progress = Math.pow((scrollTop - nfhTransStart) / (nfhTransEnd - nfhTransStart), 0.6);
                  backgroundColor = interpolateColor("#120e0a", "#060a14", progress);
                } else if (scrollTop < ckeTransStart) {
                  backgroundColor = "#060a14";
                } else if (scrollTop < ckeTransEnd) {
                  const progress = Math.pow((scrollTop - ckeTransStart) / (ckeTransEnd - ckeTransStart), 0.6);
                  backgroundColor = interpolateColor("#060a14", "#0a120a", progress);
                } else if (scrollTop < ggTransStart) {
                  backgroundColor = "#0a120a";
                } else if (scrollTop < ggTransEnd) {
                  const progress = Math.pow((scrollTop - ggTransStart) / (ggTransEnd - ggTransStart), 0.6);
                  backgroundColor = interpolateColor("#0a120a", "#110e0a", progress);
                } else if (scrollTop < vdTransStart) {
                  backgroundColor = "#110e0a";
                } else if (scrollTop < vdTransEnd) {
                  const progress = Math.pow((scrollTop - vdTransStart) / (vdTransEnd - vdTransStart), 0.6);
                  backgroundColor = interpolateColor("#110e0a", "#1a0810", progress);
                } else if (scrollTop < giTransStart) {
                  backgroundColor = "#1a0810";
                } else if (scrollTop < giTransEnd) {
                  const progress = Math.pow((scrollTop - giTransStart) / (giTransEnd - giTransStart), 0.6);
                  backgroundColor = interpolateColor("#1a0810", "#060e04", progress);
                } else if (scrollTop < egoTransStart) {
                  backgroundColor = "#060e04";
                } else if (scrollTop < egoTransEnd) {
                  const progress = Math.pow((scrollTop - egoTransStart) / (egoTransEnd - egoTransStart), 0.6);
                  backgroundColor = interpolateColor("#060e04", "#0e0e12", progress);
                } else if (scrollTop < ampTransStart) {
                  backgroundColor = "#0e0e12";
                } else if (scrollTop < ampTransEnd) {
                  const progress = Math.pow((scrollTop - ampTransStart) / (ampTransEnd - ampTransStart), 0.6);
                  backgroundColor = interpolateColor("#0e0e12", "#120a02", progress);
                } else if (scrollTop < dcTransStart) {
                  backgroundColor = "#120a02";
                } else if (scrollTop < dcTransEnd) {
                  const progress = Math.pow((scrollTop - dcTransStart) / (dcTransEnd - dcTransStart), 0.6);
                  backgroundColor = interpolateColor("#120a02", "#14060a", progress);
                } else if (scrollTop < lwTransStart) {
                  backgroundColor = "#14060a";
                } else if (scrollTop < lwTransEnd) {
                  const progress = Math.pow((scrollTop - lwTransStart) / (lwTransEnd - lwTransStart), 0.6);
                  backgroundColor = interpolateColor("#14060a", "#140806", progress);
                } else if (scrollTop < cmTransStart) {
                  backgroundColor = "#140806";
                } else if (scrollTop < cmTransEnd) {
                  const progress = Math.pow((scrollTop - cmTransStart) / (cmTransEnd - cmTransStart), 0.6);
                  backgroundColor = interpolateColor("#140806", "#0a1206", progress);
                } else if (scrollTop < rmTransStart) {
                  backgroundColor = "#0a1206";
                } else if (scrollTop < rmTransEnd) {
                  const progress = Math.pow((scrollTop - rmTransStart) / (rmTransEnd - rmTransStart), 0.6);
                  backgroundColor = interpolateColor("#0a1206", "#0a0a18", progress);
                } else if (scrollTop < sedTransStart) {
                  backgroundColor = "#0a0a18";
                } else if (scrollTop < sedTransEnd) {
                  const progress = Math.pow((scrollTop - sedTransStart) / (sedTransEnd - sedTransStart), 0.6);
                  backgroundColor = interpolateColor("#0a0a18", "#061208", progress);
                } else if (scrollTop < seTransStart) {
                  backgroundColor = "#061208";
                } else if (scrollTop < seTransEnd) {
                  const progress = Math.pow((scrollTop - seTransStart) / (seTransEnd - seTransStart), 0.6);
                  backgroundColor = interpolateColor("#061208", "#180606", progress);
                } else if (scrollTop < naxTransStart) {
                  backgroundColor = "#180606";
                } else if (scrollTop < naxTransEnd) {
                  const progress = Math.pow((scrollTop - naxTransStart) / (naxTransEnd - naxTransStart), 0.6);
                  backgroundColor = interpolateColor("#180606", "#140e04", progress);
                } else if (scrollTop < gsTransStart) {
                  backgroundColor = "#140e04";
                } else if (scrollTop < gsTransEnd) {
                  const progress = Math.pow((scrollTop - gsTransStart) / (gsTransEnd - gsTransStart), 0.6);
                  backgroundColor = interpolateColor("#140e04", "#120e04", progress);
                } else {
                  backgroundColor = "#120e04";
                }
              } else {
                backgroundColor = "#2d0a0a";
              }
            }
          } else {
            // Fallback: stay platinum
            backgroundColor = "#e8e8ec";
          }
        }
      } else {
        backgroundColor = "#f0f8f0";
      }
    }

    // Apply the color
    body.style.backgroundColor = backgroundColor;

    // Haltane section fade-in effect aligned with cream transition
    const haltaneImage = _getEl("", ".haltane-image");
    const haltaneProductTitle = _getEl("", ".haltane-section-container .product-title",);
    const haltaneNotes = _getEl("", ".haltane-notes");
    const haltaneFragranceNotes = _getEl("", ".haltane-fragrance-notes",);

    if (
      haltaneImage ||
      haltaneProductTitle ||
      haltaneNotes ||
      haltaneFragranceNotes
    ) {
      let haltaneOpacity = 0;

      // Start fade-in very late in the cream transition (at 95% progress)
      const fadeInStart = creamTransitionStart + creamTransitionRange * 0.95;
      const fadeInRange = creamTransitionRange * 0.05; // Use only last 5% for fade-in

      if (scrollTop < fadeInStart) {
        // Before fade-in starts - elements hidden
        haltaneOpacity = 0;
      } else if (scrollTop < creamTransitionEnd) {
        // During fade-in - fade in elements
        const progress = (scrollTop - fadeInStart) / fadeInRange;
        const easedProgress = Math.pow(progress, 0.15); // Very slow, smooth fade
        haltaneOpacity = easedProgress;
      } else {
        // After cream transition - elements fully visible
        haltaneOpacity = 1;
      }

      // Apply fade-in effect to Haltane elements
      if (haltaneImage) {
        haltaneImage.style.opacity = haltaneOpacity;
        haltaneImage.style.transform = `translateY(${20 * (1 - haltaneOpacity)}px)`;
      }
      if (haltaneProductTitle) {
        haltaneProductTitle.style.opacity = haltaneOpacity;
        haltaneProductTitle.style.transform = `translateY(${15 * (1 - haltaneOpacity)}px)`;
      }
      if (haltaneNotes) {
        haltaneNotes.style.opacity = haltaneOpacity;
        haltaneNotes.style.transform = `translateY(${25 * (1 - haltaneOpacity)}px)`;
      }
      if (haltaneFragranceNotes) {
        haltaneFragranceNotes.style.opacity = haltaneOpacity;
        haltaneFragranceNotes.style.transform = `translateY(${30 * (1 - haltaneOpacity)}px)`;
      }
    }

    // Progressive text color transition based on background
    let textColor;
    if (scrollTop < creamTransitionStart) {
      // Background is black - keep text white
      textColor = "#ffffff";
    } else if (scrollTop < creamTransitionEnd) {
      // In cream transition zone - fade text from white to black
      const rawProgress =
        (scrollTop - creamTransitionStart) / creamTransitionRange;
      const easedProgress = Math.pow(rawProgress, 0.7); // Same easing as background
      textColor = interpolateColor("#ffffff", "#000000", easedProgress);
    } else if (scrollTop < softGreenTransitionEnd) {
      // Background is cream, grey, or transitioning to soft green - text should be black
      textColor = "#000000";
    } else {
      // Background is soft green - text should be black for good contrast
      textColor = "#000000";
    }

    // Keep perfume rating section visible - remove problematic opacity manipulation
    const perfumeRatingSection = _getEl("", ".perfume-rating");
    if (perfumeRatingSection) {
      // Ensure rating section stays visible
      perfumeRatingSection.style.opacity = "1";
      perfumeRatingSection.style.transition = "none";
    }

    // Apply text color to all relevant elements
    const textElements = [
      ".perfume-rating",
      ".rating-title",
      ".perfume-description",
      ".perfume-description p",
      ".additional-ratings",
      ".category-title",
      ".rating-label",
      ".rating-count",
      ".no-vote",
      ".gender-labels",
      ".price-labels",
      ".indicator-label",
      ".mood-indicators .indicator-label",
      ".season-indicators .indicator-label",
    ];

    textElements.forEach((selector) => {
      const elements = _getAll(selector);
      elements.forEach((element) => {
        // Skip elements that should maintain their special colors
        if (
          (!element.classList.contains("score") &&
            !element.classList.contains("votes") &&
            !element.tagName.toLowerCase() === "strong") ||
          element.closest(".perfume-description strong")
        ) {
          element.style.color = textColor;
          element.style.transition = "color 0.3s ease";
        }
      });
    });

    // Handle special colored elements separately
    const specialElements = _getAll(".perfume-description strong",);
    specialElements.forEach((element) => {
      if (scrollTop < transitionStart) {
        element.style.color = "#ffd43b"; // Original gold color
      } else if (scrollTop < transitionEnd) {
        const rawProgress = (scrollTop - transitionStart) / transitionRange;
        const easedProgress = Math.pow(rawProgress, 0.7);
        element.style.color = interpolateColor(
          "#ffd43b",
          "#d4a017",
          easedProgress,
        ); // Gold to darker gold
      } else {
        element.style.color = "#b8860b"; // Dark gold for white background
      }
      element.style.transition = "color 0.3s ease";
    });

    // Handle score and votes elements
    const scoreElements = _getAll(".rating-title .score");
    scoreElements.forEach((element) => {
      if (scrollTop < transitionStart) {
        element.style.color = "#ffd43b"; // Original gold
      } else if (scrollTop < transitionEnd) {
        const rawProgress = (scrollTop - transitionStart) / transitionRange;
        const easedProgress = Math.pow(rawProgress, 0.7);
        element.style.color = interpolateColor(
          "#ffd43b",
          "#d4a017",
          easedProgress,
        );
      } else {
        element.style.color = "#b8860b"; // Dark gold
      }
      element.style.transition = "color 0.3s ease";
    });

    const votesElements = _getAll(".rating-title .votes");
    votesElements.forEach((element) => {
      if (scrollTop < transitionStart) {
        element.style.color = "#74c0fc"; // Original blue
      } else if (scrollTop < transitionEnd) {
        const rawProgress = (scrollTop - transitionStart) / transitionRange;
        const easedProgress = Math.pow(rawProgress, 0.7);
        element.style.color = interpolateColor(
          "#74c0fc",
          "#1c7ed6",
          easedProgress,
        ); // Blue to darker blue
      } else {
        element.style.color = "#1864ab"; // Dark blue for white background
      }
      element.style.transition = "color 0.3s ease";
    });

    // Enhanced navbar fade effect with dynamic visual effects
    // Start fading immediately, completely gone by 6% scroll (much faster)
    const navbarFadeEnd = 0.06;
    const scrollProgress = Math.min(
      scrollTop / (documentHeight * navbarFadeEnd),
      1,
    );

    // Apply gentle easing for smooth fade-out
    const navbarOpacity =
      1 - scrollProgress * scrollProgress * (3 - 2 * scrollProgress); // Smoothstep

    // Calculate dynamic visual effects based on scroll progress
    const navbarBlur = scrollProgress * 8; // Blur increases as navbar fades
    const scaleAmount = 1 - scrollProgress * 0.05; // Slight scale down (95% at full fade)
    const backdropBlur = scrollProgress * 15; // Backdrop blur increases

    // Apply enhanced navbar effects
    if (navbar) {
      navbar.style.opacity = navbarOpacity;
      navbar.style.transform = `scale(${scaleAmount})`;
      navbar.style.filter = `blur(${navbarBlur}px)`;
      navbar.style.backdropFilter = `blur(${backdropBlur}px) saturate(${1 + scrollProgress * 0.5})`;
      navbar.style.transition =
        "opacity 0.1s ease, transform 0.1s ease, filter 0.1s ease, backdrop-filter 0.1s ease";

      // Add subtle glow effect as it fades
      const glowIntensity = scrollProgress * 0.3;
      navbar.style.boxShadow = `0 0 ${glowIntensity * 30}px rgba(255, 255, 255, ${glowIntensity})`;

      // Add CSS classes for state management
      if (scrollProgress > 0.1 && scrollProgress < 0.9) {
        navbar.classList.add("fading");
        navbar.classList.remove("fade-complete");
      } else if (scrollProgress >= 0.9) {
        navbar.classList.add("fade-complete");
        navbar.classList.remove("fading");
      } else {
        navbar.classList.remove("fading", "fade-complete");
      }
    }

    // Top vignette effect with blur (disappears faster and more gently)
    // Start fading immediately, completely gone by 25% scroll (faster)
    const topVignetteEnd = 0.25;
    let topVignetteProgress = Math.min(scrollProgress / topVignetteEnd, 1);

    // Apply gentle cubic easing for ultra-smooth fade-out
    const gentleEase = 1 - Math.pow(topVignetteProgress, 3); // Cubic ease-out for gentler transition

    // Calculate blur reduction (starts at 8px, reduces to 0px)
    const blurAmount = gentleEase * 8;

    // Bottom/edge vignette effect (appears on scroll)
    // Start vignette after 5% scroll, reach full intensity at 80% scroll
    const vignetteStart = 0.05;
    const vignetteEnd = 0.8;
    let vignetteProgress = 0;

    if (scrollProgress > vignetteStart) {
      vignetteProgress = Math.min(
        (scrollProgress - vignetteStart) / (vignetteEnd - vignetteStart),
        1,
      );
    }

    // Apply advanced easing for more realistic vignette progression
    // Combine smoothstep with exponential easing for natural feel
    const smoothStep =
      vignetteProgress * vignetteProgress * (3 - 2 * vignetteProgress);
    const exponentialEase = 1 - Math.pow(1 - vignetteProgress, 2.5);
    const easedVignetteProgress = smoothStep * 0.6 + exponentialEase * 0.4;

    // Video blur effect (increases with scroll) - Applied to all videos
    // Start blurring immediately, reach maximum blur at 50% scroll for stronger effect
    const videoBlurEnd = 0.5;
    let videoBlurProgress = Math.min(scrollProgress / videoBlurEnd, 1);

    // Apply smooth easing for natural blur progression
    const videoBlurEased =
      videoBlurProgress * videoBlurProgress * (3 - 2 * videoBlurProgress); // Smoothstep

    // Calculate blur amount (0px to 25px for stronger effect)
    const videoBlurAmount = videoBlurEased * 25;

    // Apply blur to all videos
    const allVideos = [
      document.getElementById("background-video"),
      document.getElementById("background-video-2"),
      document.getElementById("background-video-3"),
    ];

    allVideos.forEach((vid) => {
      if (vid) {
        vid.style.filter = `blur(${videoBlurAmount}px)`;
        vid.style.transition = "filter 0.1s ease, opacity 1s ease-in-out";
      }
    });

    // Dynamic bottom vignette effect (increases with scroll)
    // Start vignette immediately, reach full intensity at 40% scroll for faster effect
    const bottomVignetteEnd = 0.4;
    let bottomVignetteProgress = Math.min(
      scrollProgress / bottomVignetteEnd,
      1,
    );

    // Apply smooth easing for natural vignette progression
    const vignetteEase =
      bottomVignetteProgress *
      bottomVignetteProgress *
      (3 - 2 * bottomVignetteProgress); // Smoothstep
    const vignetteIntensity = vignetteEase * 1.2; // Max intensity of 1.2 (much stronger)

    // Bottom blur effect (increases with scroll for more pronounced bottom blur)
    const bottomBlurAmount = vignetteEase * 15; // Max 15px additional blur at bottom

    // Update vignette intensity and bottom blur
    document.documentElement.style.setProperty(
      "--vignette-intensity",
      vignetteIntensity,
    );
    document.documentElement.style.setProperty(
      "--bottom-blur",
      bottomBlurAmount + "px",
    );

    // Update other vignette overlays with CSS custom properties
    document.documentElement.style.setProperty(
      "--top-vignette-opacity",
      gentleEase,
    );
    document.documentElement.style.setProperty(
      "--top-vignette-blur",
      blurAmount + "px",
    );
    document.documentElement.style.setProperty(
      "--vignette-opacity",
      easedVignetteProgress,
    );

    ticking = false;
  }