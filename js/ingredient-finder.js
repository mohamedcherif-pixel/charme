/**
 * Ingredient-Based AI Fragrance Finder
 * Advanced ingredient search system for fragrance recommendations
 */

class IngredientFragranceFinder {
  constructor() {
    this.selectedIngredients = [];

    // Initialize the comprehensive fragrance API service
    this.fragranceService = new FragranceAPIService();

    // Ingredient Icons Mapping
    this.ingredientIcons = {
      // Top notes - Citrus & Fresh
      bergamot: "🍊",
      lemon: "🍋",
      lime: "🟢",
      orange: "🧡",
      grapefruit: "🥭",
      mandarin: "🍊",
      tangerine: "🍊",
      yuzu: "🍋",
      "blood orange": "🔴",
      "sweet orange": "🧡",
      "bitter orange": "🧡",
      petitgrain: "🌿",
      neroli: "🌸",
      "lemon verbena": "🌿",
      citron: "🍋",
      pomelo: "🥭",

      // Top notes - Green & Herbal
      basil: "🌿",
      mint: "🌱",
      spearmint: "🌱",
      peppermint: "🌱",
      eucalyptus: "🌿",
      rosemary: "🌿",
      thyme: "🌿",
      sage: "🌿",
      tarragon: "🌿",
      artemisia: "🌿",
      grass: "🌱",
      "green leaves": "🍃",
      "tea leaves": "🍃",
      "green tea": "🍃",
      "violet leaves": "🍃",

      // Top notes - Aquatic & Ozonic
      marine: "🌊",
      "sea breeze": "🌊",
      water: "💧",
      aquatic: "🌊",
      rain: "🌧️",
      ozonic: "💨",
      aldehydes: "✨",
      metallic: "⚡",

      // Top notes - Fruity
      apple: "🍎",
      pear: "🍐",
      peach: "🍑",
      apricot: "🍑",
      plum: "🟣",
      blackcurrant: "⚫",
      redcurrant: "🔴",
      pineapple: "🍍",
      coconut: "🥥",
      melon: "🍈",
      watermelon: "🍉",
      strawberry: "🍓",
      raspberry: "🫐",
      blackberry: "🫐",
      fig: "🫒",
      grape: "🍇",
      kiwi: "🥝",
      mango: "🥭",
      "passion fruit": "🟡",
      litchi: "🔴",
      rhubarb: "🟢",

      // Top notes - Spicy
      "pink pepper": "🌶️",
      "black pepper": "⚫",
      "white pepper": "⚪",
      coriander: "🌿",
      cardamom: "🟤",
      nutmeg: "🟤",
      ginger: "🧄",
      allspice: "🟤",
      juniper: "🫐",

      // Heart notes - Floral
      rose: "🌹",
      jasmine: "🌼",
      lily: "🌺",
      "lily of the valley": "🌺",
      tuberose: "🌸",
      gardenia: "🌸",
      "ylang ylang": "🌼",
      magnolia: "🌸",
      peony: "🌸",
      iris: "🌷",
      violet: "💜",
      freesia: "🌼",
      narcissus: "🌼",
      daffodil: "🌼",
      hyacinth: "🌸",
      mimosa: "🌼",
      carnation: "🌸",
      geranium: "🌸",
      lavender: "💜",
      heliotrope: "🌺",
      "orange blossom": "🌸",
      honeysuckle: "🌼",
      chamomile: "🌼",
      orris: "🌷",
      cyclamen: "🌸",
      lotus: "🪷",
      "water lily": "🪷",
      frangipani: "🌺",
      plumeria: "🌺",
      hibiscus: "🌺",
      "cherry blossom": "🌸",
      "apple blossom": "🌸",
      "linden blossom": "🌸",
      hawthorn: "🌸",

      // Heart notes - Spicy
      cinnamon: "🟤",
      cloves: "🟤",
      "star anise": "⭐",
      fennel: "🌿",
      "bay leaves": "🍃",
      cumin: "🟤",
      caraway: "🟤",
      anise: "⭐",
      saffron: "🟡",
      paprika: "🌶️",
      chili: "🌶️",
      cayenne: "🌶️",

      // Heart notes - Herbal & Aromatic
      oregano: "🌿",
      marjoram: "🌿",
      dill: "🌿",
      parsley: "🌿",
      cilantro: "🌿",
      chives: "🌿",
      lemongrass: "🌿",
      palmarosa: "🌿",
      citronella: "🌿",
      pine: "🌲",
      fir: "🌲",
      cypress: "🌲",
      "juniper berries": "🫐",

      // Heart notes - Fruity & Sweet
      "coconut milk": "🥥",
      banana: "🍌",
      cherry: "🍒",
      dates: "🟤",
      prunes: "🟣",
      raisins: "🟣",
      honey: "🍯",
      caramel: "🟤",
      toffee: "🟤",
      butterscotch: "🟡",
      maple: "🍁",
      "brown sugar": "🟤",

      // Base notes - Woody
      sandalwood: "🌳",
      cedar: "🌲",
      cedarwood: "🌲",
      rosewood: "🌳",
      ebony: "⚫",
      mahogany: "🟤",
      birch: "🌳",
      oak: "🌳",
      "pine wood": "🌲",
      bamboo: "🎋",
      driftwood: "🪵",
      teak: "🟤",
      "maple wood": "🟤",
      hickory: "🟤",
      applewood: "🟤",
      "guaiac wood": "🌳",
      agarwood: "🌳",
      "cashmere wood": "🌳",
      "blonde woods": "🌳",
      "white woods": "⚪",

      // Base notes - Oriental & Resinous
      oud: "🪨",
      amber: "🟡",
      benzoin: "🟤",
      frankincense: "💎",
      myrrh: "🟤",
      labdanum: "🟤",
      styrax: "🟤",
      elemi: "🟤",
      copal: "🟤",
      olibanum: "💎",
      galbanum: "🟢",
      opoponax: "🟤",
      "peru balsam": "🟤",
      "tolu balsam": "🟤",

      // Base notes - Animalic & Musk
      musk: "🦌",
      "white musk": "⚪",
      "red musk": "🔴",
      "black musk": "⚫",
      "synthetic musk": "🧪",
      ambrette: "🌺",
      civet: "🐱",
      castoreum: "🦫",
      ambergris: "🐋",
      leather: "🧥",
      suede: "🧥",
      fur: "🦔",

      // Base notes - Earthy & Mossy
      patchouli: "🌿",
      vetiver: "🌾",
      oakmoss: "🌿",
      "tree moss": "🌿",
      earth: "🌍",
      soil: "🟤",
      mushroom: "🍄",
      truffle: "🍄",
      moss: "🌿",
      lichen: "🌿",
      fern: "🌿",
      "wet earth": "🟤",
      "forest floor": "🍂",

      // Base notes - Gourmand & Sweet
      vanilla: "🍦",
      chocolate: "🍫",
      cocoa: "🍫",
      coffee: "☕",
      espresso: "☕",
      mocha: "☕",
      praline: "🍯",
      nougat: "🟤",
      marzipan: "🟤",
      almond: "🌰",
      hazelnut: "🌰",
      walnut: "🌰",
      pistachio: "🌰",
      cashew: "🌰",
      macadamia: "🌰",
      "coconut cream": "🥥",
      milk: "🥛",
      cream: "🥛",
      butter: "🧈",
      custard: "🍮",
      "crème brûlée": "🍮",
      tiramisu: "🍰",
      cake: "🍰",
      cookies: "🍪",
      biscuits: "🍪",
      bread: "🍞",
      toast: "🍞",
      cereals: "🥣",
      oats: "🌾",
      wheat: "🌾",
      rice: "🍚",
      corn: "🌽",

      // Base notes - Tobacco & Smoky
      tobacco: "🍃",
      "pipe tobacco": "🍃",
      cigar: "🍃",
      cigarette: "🍃",
      smoke: "💨",
      ash: "⚫",
      coal: "⚫",
      tar: "⚫",
      "birch tar": "⚫",
      "burnt wood": "🔥",
      charcoal: "⚫",
      incense: "🕯️",
      "smoked wood": "💨",

      // Base notes - Mineral & Metallic
      ambroxan: "✨",
      "iso e super": "✨",
      hedione: "✨",
      cashmeran: "✨",
      molecule: "🧪",
      synthetic: "🧪",
      mineral: "💎",
      stone: "🪨",
      concrete: "🪨",
      metal: "⚙️",
      steel: "⚙️",
      iron: "⚙️",
      salt: "🧂",
      iodine: "💧",

      // Special & Unique
      "black orchid": "🖤",
      "white tea": "🍃",
      "black tea": "🍃",
      "iced tea": "🧊",
      wine: "🍷",
      champagne: "🥂",
      rum: "🥃",
      whiskey: "🥃",
      brandy: "🥃",
      vodka: "🥃",
      gin: "🥃",
      absinthe: "🟢",
      beer: "🍺",
      sake: "🍶",
    };

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.updateFragranceCountBadge();
    console.log("🧪 Ingredient Fragrance Finder initialized");
  }

  setupEventListeners() {
    console.log("🔧 Setting up Enhanced Ingredient Finder event listeners");

    // Modal open/close
    const ingredientFinderIcon = document.getElementById(
      "ingredientFinderIcon",
    );
    const modal = document.getElementById("ingredientModal");
    const modalOverlay = document.getElementById("ingredientModalOverlay");
    const modalClose = document.getElementById("ingredientModalClose");

    if (ingredientFinderIcon) {
      ingredientFinderIcon.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.openModal();
      });
    }

    if (modalOverlay) {
      modalOverlay.addEventListener("click", () => {
        this.closeModal();
      });
    }

    if (modalClose) {
      modalClose.addEventListener("click", () => {
        this.closeModal();
      });
    }

    // Enhanced search input
    const enhancedSearchInput = document.getElementById(
      "enhancedIngredientSearch",
    );
    if (enhancedSearchInput) {
      enhancedSearchInput.addEventListener("input", (e) => {
        this.handleSearchInput(e.target.value);
      });

      enhancedSearchInput.addEventListener("keyup", (e) => {
        if (e.key === "Enter") {
          this.searchIngredient(enhancedSearchInput.value);
        }
      });

      // Prevent search input from interfering with scroll
      enhancedSearchInput.addEventListener("wheel", (e) => {
        e.stopPropagation();
      });
    }

    // Enhanced ingredient tags
    const enhancedTags = document.querySelectorAll(".enhanced-ingredient-tag");
    enhancedTags.forEach((tag) => {
      tag.addEventListener("click", () => {
        const ingredient = tag.dataset.ingredient;
        this.toggleEnhancedIngredient(ingredient, tag);
      });
    });

    // Enhanced search button
    const enhancedSearchBtn = document.getElementById("enhancedSearchBtn");
    if (enhancedSearchBtn) {
      enhancedSearchBtn.addEventListener("click", () => {
        this.findMatchingFragrances();
      });
    }

    // Show All Fragrances button
    const showAllFragrancesBtn = document.getElementById(
      "showAllFragrancesBtn",
    );
    if (showAllFragrancesBtn) {
      showAllFragrancesBtn.addEventListener("click", () => {
        this.showAllFragrances();
      });
    }

    // Clear all button
    const clearAllBtn = document.getElementById("clearAllBtn");
    if (clearAllBtn) {
      clearAllBtn.addEventListener("click", () => {
        this.clearAllIngredients();
      });
    }

    // Back to search button
    const backToSearchBtn = document.getElementById("backToSearchBtn");
    if (backToSearchBtn) {
      backToSearchBtn.addEventListener("click", () => {
        this.showSearchSection();
      });
    }

    // Escape key to close modal
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal && modal.style.display === "flex") {
        this.closeModal();
      }
    });
  }

  searchIngredient(query) {
    if (!query.trim()) return;

    query = query.toLowerCase().trim();

    // Find matching ingredients using the fragrance service
    const matchingIngredients = this.fragranceService.getIngredientSuggestions(
      query,
      5,
    );

    if (matchingIngredients.length > 0) {
      // Add the first matching ingredient
      this.addIngredient(matchingIngredients[0]);

      // Clear the search input
      const searchInput = document.getElementById("enhancedIngredientSearch");
      if (searchInput) {
        searchInput.value = "";
      }
    } else {
      this.showNotification(
        `🔍 No ingredients found matching "${query}"`,
        "info",
      );
    }

    this.closeDropdown();
  }

  toggleEnhancedIngredient(ingredient, tagElement) {
    if (this.selectedIngredients.includes(ingredient)) {
      this.removeIngredient(ingredient);
      tagElement.classList.remove("selected");
    } else {
      this.addIngredient(ingredient);
      tagElement.classList.add("selected");
    }
  }

  updateFragranceCountBadge() {
    try {
      // Check if fragrance service and database exist
      if (!this.fragranceService) {
        console.warn("🚫 FragranceService not initialized yet");
        return;
      }

      if (!this.fragranceService.comprehensiveDatabase) {
        console.warn("🚫 Comprehensive database not available yet");
        return;
      }

      const database = this.fragranceService.comprehensiveDatabase;
      if (typeof database !== "object" || database === null) {
        console.warn("🚫 Database is not a valid object");
        return;
      }

      const totalFragrances = Object.keys(database).length;
      const countBadge = document.getElementById("allFragrancesCount");

      if (countBadge) {
        countBadge.textContent = `${totalFragrances}+`;
        console.log(
          `🏷️ Updated fragrance count badge: ${totalFragrances} fragrances`,
        );
      } else {
        console.warn("🚫 allFragrancesCount element not found in DOM");
      }
    } catch (error) {
      console.error("Error updating fragrance count badge:", error);
    }
  }

  addIngredient(ingredient) {
    if (!this.selectedIngredients.includes(ingredient)) {
      this.selectedIngredients.push(ingredient);
      this.updateSelectedIngredients();
    }
  }

  removeIngredient(ingredient) {
    const index = this.selectedIngredients.indexOf(ingredient);
    if (index > -1) {
      this.selectedIngredients.splice(index, 1);
      this.updateSelectedIngredients();

      // Update the tag in suggestions if it exists
      const suggestionTag = document.querySelector(
        `.ingredient-tag[data-ingredient="${ingredient}"]`,
      );
      if (suggestionTag) {
        suggestionTag.classList.remove("selected");
      }
    }
  }

  updateSelectedIngredients() {
    const selectedBar = document.getElementById("selectedIngredientsBar");
    const selectedDisplay = document.getElementById(
      "selectedIngredientsDisplay",
    );
    const btnCount = document.getElementById("btnCount");

    if (this.selectedIngredients.length > 0) {
      selectedBar.style.display = "block";

      selectedDisplay.innerHTML = this.selectedIngredients
        .map((ingredient) => {
          const icon = this.ingredientIcons[ingredient] || "🌿";
          return `
                    <div class="selected-ingredient-pill" data-ingredient="${ingredient}">
                        <span class="ingredient-icon">${icon}</span>
                        <span class="ingredient-name">${ingredient}</span>
                        <svg class="remove-ingredient-btn" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </div>
                `;
        })
        .join("");

      // Update button count
      if (btnCount) {
        btnCount.textContent = `(${this.selectedIngredients.length})`;
      }

      // Add remove listeners
      selectedDisplay
        .querySelectorAll(".remove-ingredient-btn")
        .forEach((btn) => {
          btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const pill = btn.closest(".selected-ingredient-pill");
            const ingredient = pill.dataset.ingredient;
            this.removeIngredient(ingredient);
          });
        });

      // Animate in
      setTimeout(() => {
        selectedBar.classList.add("show");
      }, 10);
    } else {
      selectedBar.style.display = "none";
      selectedBar.classList.remove("show");
    }
  }

  /**
   * Handle search input for ingredient suggestions
   * @param {string} query - Search query
   */
  handleSearchInput(query) {
    this.showIngredientSuggestions(query);
  }

  /**
   * Show ingredient suggestions based on user input
   * @param {string} query - Search query
   */
  showIngredientSuggestions(query) {
    const dropdown = document.getElementById("searchSuggestionsDropdown");
    if (!dropdown) return;

    if (!query || query.length < 2) {
      dropdown.style.display = "none";
      return;
    }

    const suggestions = this.fragranceService.getIngredientSuggestions(
      query,
      8,
    );

    if (suggestions.length === 0) {
      dropdown.style.display = "none";
      return;
    }

    dropdown.innerHTML = suggestions
      .map((ingredient) => {
        const icon = this.ingredientIcons[ingredient] || "🌿";
        const isSelected = this.selectedIngredients.includes(ingredient);

        return `
                <div class="suggestion-item ${isSelected ? "selected" : ""}" data-ingredient="${ingredient}">
                    <span class="ingredient-icon">${icon}</span>
                    <span class="ingredient-name">${ingredient}</span>
                    ${isSelected ? '<span class="selected-indicator">✓</span>' : ""}
                </div>
            `;
      })
      .join("");

    // Add click listeners
    dropdown.querySelectorAll(".suggestion-item").forEach((item) => {
      item.addEventListener("click", () => {
        const ingredient = item.dataset.ingredient;
        if (!this.selectedIngredients.includes(ingredient)) {
          this.addIngredient(ingredient);
          this.showIngredientSuggestions(""); // Clear suggestions
          document.getElementById("enhancedIngredientSearch").value = "";
        }
        this.closeDropdown();
      });
    });

    dropdown.style.display = "block";
  }

  openModal() {
    const modal = document.getElementById("ingredientModal");
    if (modal) {
      // Ensure proper initial state by showing search section
      this.showSearchSection();

      modal.style.display = "flex";
      setTimeout(() => {
        modal.classList.add("show");

        // Auto-focus the search input after animation
        setTimeout(() => {
          const searchInput = document.getElementById(
            "enhancedIngredientSearch",
          );
          if (searchInput) {
            searchInput.focus();
          }
        }, 600);
      }, 10);

      // Prevent body scroll but allow modal content scroll
      document.body.style.overflow = "hidden";

      // Ensure scroll wheel works within modal
      this.setupModalScrollHandling(modal);
    }
  }

  closeModal() {
    const modal = document.getElementById("ingredientModal");
    if (modal) {
      modal.classList.remove("show");
      setTimeout(() => {
        modal.style.display = "none";
        document.body.style.overflow = "";

        // Remove scroll event listeners
        this.removeModalScrollHandling(modal);

        // Reset modal state to search section for next opening
        this.showSearchSection();
      }, 300);
    }
  }

  setupModalScrollHandling(modal) {
    const modalBody = modal.querySelector(".ingredient-modal-body");
    const modalContent = modal.querySelector(".ingredient-modal-content");

    if (modalBody) {
      // Ensure modal body can scroll
      modalBody.style.overflowY = "auto";
      modalBody.style.overflowX = "hidden";

      // Handle wheel events specifically for the modal content
      const handleWheel = (e) => {
        // Allow wheel scrolling within modal body
        if (modalBody.contains(e.target)) {
          e.stopPropagation();
          return true;
        }
        // Prevent wheel scrolling outside modal content
        if (!modalContent.contains(e.target)) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      };

      // Store the handler for later removal
      modal._wheelHandler = handleWheel;

      // Add wheel event listener
      document.addEventListener("wheel", handleWheel, { passive: false });

      // Also handle touch events for mobile scrolling
      const handleTouchMove = (e) => {
        if (modalBody.contains(e.target)) {
          e.stopPropagation();
          return true;
        }
        if (!modalContent.contains(e.target)) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      };

      modal._touchHandler = handleTouchMove;
      document.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
    }
  }

  removeModalScrollHandling(modal) {
    // Remove event listeners to prevent memory leaks
    if (modal._wheelHandler) {
      document.removeEventListener("wheel", modal._wheelHandler);
      delete modal._wheelHandler;
    }
    if (modal._touchHandler) {
      document.removeEventListener("touchmove", modal._touchHandler);
      delete modal._touchHandler;
    }
  }

  async findMatchingFragrances() {
    if (this.selectedIngredients.length === 0) {
      return;
    }

    console.log(
      "🔍 Finding fragrances with ingredients:",
      this.selectedIngredients,
    );

    try {
      // Use the comprehensive fragrance service
      const matches = await this.fragranceService.searchByIngredients(
        this.selectedIngredients,
      );

      console.log("🎯 Fragrance matches found:", matches.length);

      this.displayResults(matches);
    } catch (error) {
      console.error("Error finding matching fragrances:", error);
      this.displayResults([]);
    }
  }

  async showAllFragrances() {
    console.log("🌟 Showing all fragrances in database...");

    try {
      // Get all fragrances from the database
      const allFragrances = Object.entries(
        this.fragranceService.comprehensiveDatabase,
      ).map(([name, profile]) => ({
        fragrance: name,
        matchCount: 0,
        matchedIngredients: [],
        percentage: 100,
        profile: profile,
      }));

      console.log(`📚 Displaying ${allFragrances.length} total fragrances`);

      // Update the subtitle to indicate we're showing all fragrances
      const resultsSubtitle = document.getElementById("resultsSubtitle");
      if (resultsSubtitle) {
        resultsSubtitle.textContent = `Showing all ${allFragrances.length} fragrances in our collection`;
      }

      // Display all fragrances using the existing display method
      this.displayResults(allFragrances);
    } catch (error) {
      console.error("Error loading all fragrances:", error);
      this.displayResults([]);
    }
  }

  displayResults(matches) {
    this.showResultsSection();

    const resultsGrid = document.getElementById("resultsGrid");
    const resultsSubtitle = document.getElementById("resultsSubtitle");

    if (resultsSubtitle) {
      resultsSubtitle.textContent = `Found ${matches.length} fragrances containing your selected ingredients`;
    }

    if (matches.length === 0) {
      resultsGrid.innerHTML = `
                <div class="no-results">
                    <div class="no-results-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M16 16s-1.5-2-4-2-4 2-4 2"/>
                            <line x1="9" y1="9" x2="9.01" y2="9"/>
                            <line x1="15" y1="9" x2="15.01" y2="9"/>
                        </svg>
                    </div>
                    <h4>No matches found</h4>
                    <p>Try selecting different ingredients or fewer ingredients for better results.</p>
                </div>
            `;
      return;
    }

    resultsGrid.innerHTML = matches
      .map(
        (match, index) => `
            <div class="result-card" data-fragrance="${match.fragrance}" style="animation-delay: ${index * 100}ms">
                <div class="result-card-header">
                    <div class="result-card-image">
                        <div class="fragrance-image-placeholder">
                            <svg class="fragrance-bottle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M8 2h8l-1 4h-6z"/>
                                <rect x="6" y="6" width="12" height="14" rx="2"/>
                                <path d="M10 6v-2"/>
                                <path d="14 6v-2"/>
                                <circle cx="12" cy="13" r="2"/>
                            </svg>
                        </div>
                    </div>
                    <div class="result-info">
                        <div class="result-header-top">
                            <h4 class="result-name">${match.fragrance}</h4>
                            <div class="result-badges">
                                <div class="result-match-badge">
                                    <svg class="match-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                    ${match.percentage}% Match
                                </div>
                                <div class="availability-badge ${match.profile.available ? "available" : "not-available"}">
                                    ${match.profile.available ? "✓ Available" : "✗ Not Available"}
                                </div>
                            </div>
                        </div>
                        <p class="result-brand">by ${match.profile.brand}</p>
                        <div class="match-quality">
                            <div class="quality-bar">
                                <div class="quality-fill" style="width: ${match.percentage}%"></div>
                            </div>
                            <span class="quality-text">${match.percentage >= 90 ? "Perfect Match" : match.percentage >= 75 ? "Excellent Match" : match.percentage >= 60 ? "Good Match" : "Fair Match"}</span>
                        </div>
                    </div>
                </div>

                <div class="result-description">
                    <p>${match.profile.description}</p>
                </div>

                <div class="result-ingredients">
                    <h5>
                        <svg class="ingredients-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="3"/>
                            <circle cx="6" cy="6" r="2"/>
                            <circle cx="18" cy="6" r="2"/>
                            <circle cx="6" cy="18" r="2"/>
                            <circle cx="18" cy="18" r="2"/>
                        </svg>
                        Ingredients Breakdown
                    </h5>
                    <div class="ingredient-pills">
                        ${match.profile.ingredients
                          .map((ingredient) => {
                            const icon =
                              this.ingredientIcons[ingredient] || "🌿";
                            const isMatched =
                              match.matchedIngredients.includes(ingredient);
                            return `
                                <span class="ingredient-pill ${isMatched ? "matched" : ""}">
                                    <span class="ingredient-icon">${icon}</span>
                                    <span class="ingredient-name">${ingredient}</span>
                                    ${isMatched ? '<span class="match-indicator">✓</span>' : ""}
                                </span>
                            `;
                          })
                          .join("")}
                    </div>
                    <div class="ingredient-stats">
                        <div class="stat-item">
                            <span class="stat-number">${match.matchedIngredients.length}</span>
                            <span class="stat-label">Matched</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">${match.profile.ingredients.length}</span>
                            <span class="stat-label">Total</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">${Math.round((match.matchedIngredients.length / match.profile.ingredients.length) * 100)}%</span>
                            <span class="stat-label">Coverage</span>
                        </div>
                    </div>
                </div>

                <div class="result-actions">
                    <button class="view-fragrance-btn primary" data-fragrance="${match.fragrance}">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                        </svg>
                        View Details
                    </button>
                    <button class="favorite-btn" data-fragrance="${match.fragrance}">
                        <svg class="heart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                    </button>
                    <button class="share-btn" data-fragrance="${match.fragrance}">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="18" cy="5" r="3"/>
                            <circle cx="6" cy="12" r="3"/>
                            <circle cx="18" cy="19" r="3"/>
                            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                        </svg>
                    </button>
                </div>
            </div>
        `,
      )
      .join("");

    // Add click listeners to view buttons
    resultsGrid.querySelectorAll(".view-fragrance-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const fragrance = btn.dataset.fragrance;
        this.viewFragrance(fragrance);
      });
    });

    // Add click listeners to result cards
    resultsGrid.querySelectorAll(".result-card").forEach((card) => {
      card.addEventListener("click", (e) => {
        // Don't trigger if clicking on buttons
        if (e.target.closest(".result-actions")) return;

        const fragrance = card.dataset.fragrance;
        this.viewFragrance(fragrance);
      });
    });

    // Add favorite button functionality
    resultsGrid.querySelectorAll(".favorite-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        btn.classList.toggle("active");
        const fragrance = btn.dataset.fragrance;

        if (btn.classList.contains("active")) {
          this.addToFavorites(fragrance);
          this.showNotification(
            `❤️ ${fragrance} added to favorites!`,
            "success",
          );
        } else {
          this.removeFromFavorites(fragrance);
          this.showNotification(
            `💔 ${fragrance} removed from favorites`,
            "info",
          );
        }
      });
    });

    // Add share button functionality
    resultsGrid.querySelectorAll(".share-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const fragrance = btn.dataset.fragrance;
        this.shareFragrance(fragrance);
      });
    });
  }

  viewFragrance(fragranceName) {
    console.log(`🔍 Viewing fragrance: ${fragranceName}`);

    // Find the fragrance section on the page and scroll to it
    const fragranceSection =
      document.querySelector(
        `[data-fragrance="${fragranceName.toLowerCase()}"]`,
      ) ||
      document.querySelector(
        `.${fragranceName.toLowerCase().replace(/\s+/g, "-")}-section`,
      ) ||
      document.querySelector(".content");

    if (fragranceSection) {
      fragranceSection.scrollIntoView({ behavior: "smooth", block: "center" });

      // Add highlight effect
      fragranceSection.style.transition = "all 0.5s ease";
      fragranceSection.style.boxShadow = "0 0 30px rgba(212, 175, 55, 0.3)";
      fragranceSection.style.transform = "scale(1.02)";

      setTimeout(() => {
        fragranceSection.style.boxShadow = "";
        fragranceSection.style.transform = "";
      }, 2000);
    }

    // Hide the dropdown
    this.closeDropdown();
  }

  showResultsSection() {
    console.log("🔄 Switching to results section...");
    const searchSection = document.getElementById("ingredientSearchSection");
    const resultsSection = document.getElementById("ingredientResultsSection");

    console.log("Search section found:", !!searchSection);
    console.log("Results section found:", !!resultsSection);

    if (searchSection && resultsSection) {
      // Force hide search section with important styles
      searchSection.style.setProperty("display", "none", "important");
      searchSection.style.setProperty("visibility", "hidden", "important");
      searchSection.style.setProperty("opacity", "0", "important");

      // Force show results section
      resultsSection.style.setProperty("display", "block", "important");
      resultsSection.style.setProperty("visibility", "visible", "important");
      resultsSection.style.setProperty("opacity", "1", "important");
      resultsSection.style.transform = "none";

      console.log("✅ Section switch completed");
      console.log(
        "Search section display:",
        window.getComputedStyle(searchSection).display,
      );
      console.log(
        "Results section display:",
        window.getComputedStyle(resultsSection).display,
      );
    } else {
      console.error("❌ Could not find sections for switching");
    }
  }

  showSearchSection() {
    console.log("🔄 Switching to search section...");
    const searchSection = document.getElementById("ingredientSearchSection");
    const resultsSection = document.getElementById("ingredientResultsSection");

    if (searchSection && resultsSection) {
      // Force hide results section
      resultsSection.style.setProperty("display", "none", "important");
      resultsSection.style.setProperty("visibility", "hidden", "important");
      resultsSection.style.setProperty("opacity", "0", "important");

      // Force show search section
      searchSection.style.setProperty("display", "block", "important");
      searchSection.style.setProperty("visibility", "visible", "important");
      searchSection.style.setProperty("opacity", "1", "important");
      searchSection.style.transform = "none";

      console.log("✅ Section switch to search completed");
    }
  }

  closeDropdown() {
    const dropdown = document.getElementById("ingredientFinderDropdown");
    if (dropdown) {
      dropdown.style.opacity = "0";
      dropdown.style.visibility = "hidden";
      dropdown.style.transform = "translateY(-10px) scale(0.95)";
    }
  }

  reset() {
    this.selectedIngredients = [];
    this.updateSelectedIngredients();
    this.showSearchSection();

    // Clear selected tags
    document.querySelectorAll(".ingredient-tag.selected").forEach((tag) => {
      tag.classList.remove("selected");
    });
  }

  // Favorites Management
  addToFavorites(fragrance) {
    let favorites = this.getFavorites();
    if (!favorites.includes(fragrance)) {
      favorites.push(fragrance);
      localStorage.setItem("fragranceFavorites", JSON.stringify(favorites));
    }
  }

  removeFromFavorites(fragrance) {
    let favorites = this.getFavorites();
    const index = favorites.indexOf(fragrance);
    if (index > -1) {
      favorites.splice(index, 1);
      localStorage.setItem("fragranceFavorites", JSON.stringify(favorites));
    }
  }

  getFavorites() {
    return JSON.parse(localStorage.getItem("fragranceFavorites") || "[]");
  }

  // Share Functionality
  async shareFragrance(fragrance) {
    const profile = this.fragranceProfiles[fragrance];
    const shareData = {
      title: `${fragrance} by ${profile.brand}`,
      text: `Check out this amazing fragrance: ${profile.description}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        this.showNotification("🚀 Fragrance shared successfully!", "success");
      } else {
        // Fallback: copy to clipboard
        const text = `${shareData.title}\\n${shareData.text}\\n${shareData.url}`;
        await navigator.clipboard.writeText(text);
        this.showNotification(
          "📋 Fragrance details copied to clipboard!",
          "success",
        );
      }
    } catch (error) {
      console.error("Error sharing:", error);
      this.showNotification("⚠️ Unable to share fragrance", "error");
    }
  }

  // Notification System
  showNotification(message, type = "info") {
    // Remove existing notifications
    const existing = document.querySelector(".fragrance-notification");
    if (existing) {
      existing.remove();
    }

    // Create notification element
    const notification = document.createElement("div");
    notification.className = `fragrance-notification ${type}`;
    notification.innerHTML = `
            <div class=\"notification-content\">
                <span class=\"notification-message\">${message}</span>
                <button class=\"notification-close\">×</button>
            </div>
        `;

    // Add to page
    document.body.appendChild(notification);

    // Add close functionality
    notification
      .querySelector(".notification-close")
      .addEventListener("click", () => {
        notification.remove();
      });

    // Auto remove after 4 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.classList.add("fade-out");
        setTimeout(() => notification.remove(), 300);
      }
    }, 4000);

    // Trigger entrance animation
    setTimeout(() => {
      notification.classList.add("show");
    }, 10);
  }
}

// Initialize Ingredient Fragrance Finder when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  if (typeof window.ingredientFragranceFinder === "undefined") {
    window.ingredientFragranceFinder = new IngredientFragranceFinder();
  }
});

// Export for use in other scripts
window.IngredientFragranceFinder = IngredientFragranceFinder;
