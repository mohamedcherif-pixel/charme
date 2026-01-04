// Immediately hide modals on page load (before DOMContentLoaded)
(function() {
    const hideModalsImmediately = () => {
        const modals = [
            'verificationModal',
            'banModal',
            'authModal',
            'adminModal',
            'profileModal',
            'favoritesModal',
            'settingsModal',
            'cartModal'
        ];
        modals.forEach(modalId => {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.style.setProperty('display', 'none', 'important');
                modal.classList.remove('show');
            }
        });
        document.body.style.overflow = 'auto';
    };

    // Try to hide immediately
    hideModalsImmediately();

    // Also try after a short delay in case elements aren't ready
    setTimeout(hideModalsImmediately, 100);

    // Also try when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', hideModalsImmediately);
    } else {
        hideModalsImmediately();
    }
})();

// ðŸ†• Level System Functions - Define early so they're available throughout the script
// Normalize avatar source to avoid broken/placeholder images in UI
window.normalizeAvatarSrc = function(src) {
    if (!src) return 'default.jpg';
    if (src === 'custom_uploaded' || src === 'custom_avatar_uploaded') return 'default.jpg';
    if (typeof src === 'string' && src.startsWith('data:image/')) {
        const base64Part = src.split(',')[1] || '';
        if (base64Part.length < 500) return 'default.jpg';
    }
    return src;
};
window.createAvatarWithLevel = function(avatarSrc, level, progressPercent) {
    const container = document.createElement('div');
    container.className = 'avatar-level-container';

    // Create progress ring
    const progressRing = document.createElement('div');
    progressRing.className = 'level-progress-ring';
    progressRing.style.setProperty('--progress-angle', `${(progressPercent / 100) * 360}deg`);

    // Create avatar image
    const avatar = document.createElement('img');
    avatar.className = 'user-avatar';
    avatar.src = window.normalizeAvatarSrc(avatarSrc);
    avatar.alt = 'User Avatar';
    avatar.onerror = () => {
        if (avatar.src.indexOf('default.jpg') === -1) {
            avatar.src = 'default.jpg';
        }
    };

    // Create level badge
    const levelBadge = document.createElement('div');
    levelBadge.className = 'level-badge';
    levelBadge.textContent = level;

    // Assemble the components
    container.appendChild(progressRing);
    container.appendChild(avatar);
    container.appendChild(levelBadge);
    // XP tooltip for navbar avatar
    const tooltip = document.createElement('div');
    tooltip.className = 'level-tooltip';
    tooltip.textContent = `${Math.max(0, Math.min(100, Math.round(progressPercent)))}% to next level`;
    container.appendChild(tooltip);

    // Store refs for live updates
    container._levelBadge = levelBadge;
    container._progressRing = progressRing;

    return container;
};

window.createReviewAvatarWithLevel = function(avatarSrc, level, progressPercent) {
    const container = document.createElement('div');
    container.className = 'review-avatar-container';

    // Create progress ring
    const progressRing = document.createElement('div');
    progressRing.className = 'level-progress-ring';
    progressRing.style.setProperty('--progress-angle', `${(progressPercent / 100) * 360}deg`);

    // Create avatar div (for reviews)
    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'review-avatar';

    const avatar = document.createElement('img');
    avatar.src = window.normalizeAvatarSrc(avatarSrc);
    avatar.alt = 'User Avatar';
    // Ensure broken/missing avatars gracefully fall back
    avatar.onerror = () => {
        if (avatar.src.indexOf('default.jpg') === -1) {
            avatar.src = 'default.jpg';
        }
    };

    avatarDiv.appendChild(avatar);

    // Create level badge
    const levelBadge = document.createElement('div');
    levelBadge.className = 'level-badge';
    levelBadge.textContent = level;

    // XP tooltip
    const tooltip = document.createElement('div');
    tooltip.className = 'level-tooltip';
    tooltip.textContent = `${Math.max(0, Math.min(100, Math.round(progressPercent)))}% to next level`;

    // Assemble the components
    container.appendChild(progressRing);
    container.appendChild(avatarDiv);
    container.appendChild(levelBadge);
    container.appendChild(tooltip);

    return container;
};

window.updateAvatarLevel = function(container, level, progressPercent) {
    const progressRing = container.querySelector('.level-progress-ring');
    const levelBadge = container.querySelector('.level-badge');

    if (progressRing) {
        progressRing.style.setProperty('--progress-angle', `${(progressPercent / 100) * 360}deg`);
    }

    if (levelBadge) {
        levelBadge.textContent = level;
    }

    const tooltip = container.querySelector('.level-tooltip');
    if (tooltip) {
        const pct = Math.max(0, Math.min(100, Math.round(progressPercent)));
        tooltip.textContent = `${pct}% to next level`;
    }
};

// ðŸ†• Real-time Level Sync Bus
const LevelEvents = {
    _listeners: new Set(),
    subscribe(listener) { this._listeners.add(listener); return () => this._listeners.delete(listener); },
    emit(payload) { this._listeners.forEach(l => { try { l(payload); } catch (_) {} }); }
};

// Keep lightweight in-memory snapshot of XP/level
const LevelState = {
    userId: null,
    level: 1,
    currentXP: 0,
    requiredXP: 100,
    totalXP: 0
};

// Apply level changes to all on-page avatars/badges (navbar + reviews)
function applyLevelUiEverywhere(level, levelProgress) {
    // Navbar
    const navbarContainer = document.querySelector('.avatar-level-container');
    if (navbarContainer) {
        window.updateAvatarLevel(navbarContainer, level, levelProgress);
    }

    // Reviews
    document.querySelectorAll('.review-avatar-container').forEach(c => {
        window.updateAvatarLevel(c, level, levelProgress);
    });
    // Replies (compact avatar ring)
    document.querySelectorAll('.reply-avatar-container').forEach(c => {
        window.updateAvatarLevel(c, level, levelProgress);
    });
}

// Listen for level updates and reflect in UI + storage
LevelEvents.subscribe(({ level, levelData }) => {
    const progress = Math.round((levelData.currentXP / Math.max(1, levelData.requiredXP)) * 100);
    applyLevelUiEverywhere(level, progress);

    // Update stored user object so other components read fresh level
    const stores = [localStorage, sessionStorage];
    stores.forEach(store => {
        try {
            const u = JSON.parse(store.getItem('user') || 'null');
            if (u) {
                u.level = level;
                u.levelProgress = progress;
                u.experience = levelData.totalXP;
                store.setItem('user', JSON.stringify(u));
            }
        } catch {}
    });
});

window.showLevelUpNotification = function(oldLevel, newLevel) {
    // Create level up notification
    const notification = document.createElement('div');
    notification.className = 'level-up-notification';
    notification.innerHTML = `
        <div class="level-up-content">
            <div class="level-up-icon">ðŸŽ‰</div>
            <div class="level-up-text">
                <h3>Level Up!</h3>
                <p>You reached level ${newLevel}!</p>
            </div>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        padding: 15px 20px;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(16, 185, 129, 0.3);
        z-index: 10000;
        animation: levelUpSlide 0.5s ease-out;
        font-family: inherit;
    `;

    // Add animation styles if not already added
    if (!document.querySelector('#level-up-styles')) {
        const style = document.createElement('style');
        style.id = 'level-up-styles';
        style.textContent = `
            @keyframes levelUpSlide {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            .level-up-content {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            .level-up-icon {
                font-size: 24px;
            }
            .level-up-text h3 {
                margin: 0 0 4px 0;
                font-size: 16px;
                font-weight: bold;
            }
            .level-up-text p {
                margin: 0;
                font-size: 14px;
                opacity: 0.9;
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'levelUpSlide 0.5s ease-in reverse';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 500);
    }, 4000);
};

document.addEventListener('DOMContentLoaded', function() {
    console.log('ðŸŽ® Level System Functions loaded!');

    const body = document.body;
    // Marquee close handler
    const closeTopMarquee = document.getElementById('closeTopMarquee');
    const marqueeBar = document.getElementById('topMarquee');
    const navbarEl = document.querySelector('.navbar');
    if (marqueeBar && navbarEl) {
        document.body.classList.add('has-marquee');
        navbarEl.style.top = '34px';
    }
    if (closeTopMarquee) {
        closeTopMarquee.addEventListener('click', () => {
            const bar = document.getElementById('topMarquee');
            if (bar) {
                bar.style.display = 'none';
                document.body.classList.remove('has-marquee');
                const nav = document.querySelector('.navbar');
                if (nav) nav.style.top = '0px';
            }
        });
    }

    // Marquee height animation on scroll
    let lastScrollTop = 0;
    let marqueeHeightState = 'normal'; // normal, compact, minimal

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Determine marquee height state based on scroll position
        if (scrollTop > 100) {
            if (scrollTop > 300) {
                if (marqueeHeightState !== 'minimal') {
                    marqueeHeightState = 'minimal';
                    document.body.classList.remove('marquee-compact');
                    document.body.classList.add('marquee-minimal');
                }
            } else if (marqueeHeightState !== 'compact') {
                marqueeHeightState = 'compact';
                document.body.classList.remove('marquee-minimal');
                document.body.classList.add('marquee-compact');
            }
        } else if (marqueeHeightState !== 'normal') {
            marqueeHeightState = 'normal';
            document.body.classList.remove('marquee-compact', 'marquee-minimal');
        }
        
        lastScrollTop = scrollTop;
    });
    const video = document.getElementById('background-video');
    const navbar = document.querySelector('.navbar');
    let ticking = false;

    // Search Modal Functionality
    const quickSearchInput = document.getElementById('quickSearchInput');
    const clearQuickSearch = document.getElementById('clearQuickSearch');
    const floatingSearch = document.getElementById('floatingSearch');
    const floatingMenu = document.getElementById('floatingMenu');
    const searchModal = document.getElementById('searchModal');
    const searchClose = document.getElementById('searchClose');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');

    // Sample fragrance data for search
    const fragrances = [
        { name: 'Layton', brand: 'Parfums de Marly', notes: ['Apple', 'Lavender', 'Geranium', 'Vanilla', 'Cardamom'], type: 'Oriental Woody' },
        { name: 'Herod', brand: 'Parfums de Marly', notes: ['Cinnamon', 'Pepper', 'Osmanthus', 'Tobacco', 'Vanilla'], type: 'Oriental Spicy' },
        { name: 'Pegasus', brand: 'Parfums de Marly', notes: ['Bergamot', 'Heliotrope', 'Bitter Almond', 'Vanilla', 'Sandalwood'], type: 'Oriental Gourmand' },
        { name: 'Galloway', brand: 'Parfums de Marly', notes: ['Elemi', 'Lavender', 'Geranium', 'Cashmere Wood', 'Ambergris'], type: 'Woody Aromatic' },
        { name: 'Godolphin', brand: 'Parfums de Marly', notes: ['Thyme', 'Saffron', 'Cypress', 'Rose', 'Cedarwood'], type: 'Woody Spicy' }
    ];

    // Function to open search modal
    function openSearchModal() {
        searchModal.classList.add('active');
        // Ensure suggestions are shown when opening
        showSuggestions();
        // Reset animations by removing and re-adding content
        setTimeout(() => {
            searchInput.focus();
            // Trigger animation reset for suggestion tags
            const suggestionTags = document.querySelectorAll('.suggestion-tag');
            suggestionTags.forEach((tag, index) => {
                tag.style.animation = 'none';
                tag.offsetHeight; // Trigger reflow
                tag.style.animation = `tagStagger 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${0.8 + index * 0.1}s forwards`;
            });
        }, 100);
    }

    // Quick search bar functionality
    const quickSearchDropdown = document.getElementById('quickSearchDropdown');
    const quickSearchResults = document.getElementById('quickSearchResults');
    let selectedSuggestionIndex = -1;

    function showQuickSearchSuggestions(query) {
        if (!quickSearchResults || !quickSearchDropdown) return;

        const filteredFragrances = fragrances.filter(fragrance =>
            fragrance.name.toLowerCase().includes(query.toLowerCase()) ||
            fragrance.brand.toLowerCase().includes(query.toLowerCase()) ||
            fragrance.notes.some(note => note.toLowerCase().includes(query.toLowerCase())) ||
            fragrance.type.toLowerCase().includes(query.toLowerCase())
        );

        if (filteredFragrances.length === 0 && query.length > 0) {
            quickSearchResults.innerHTML = '<div class="no-results">No fragrances found</div>';
            showDropdown();
            return;
        }

        if (query.length === 0) {
            hideDropdown();
            return;
        }

        const suggestionsHTML = filteredFragrances.slice(0, 5).map(fragrance => `
            <div class="search-suggestion" data-fragrance="${fragrance.name}">
                <div class="suggestion-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                        <path d="M2 17l10 5 10-5"/>
                        <path d="M2 12l10 5 10-5"/>
                    </svg>
                </div>
                <div class="suggestion-content">
                    <div class="suggestion-title">${fragrance.name}</div>
                    <div class="suggestion-subtitle">${fragrance.brand} â€¢ ${fragrance.notes.slice(0, 3).join(', ')}</div>
                </div>
                <div class="suggestion-type">${fragrance.type}</div>
            </div>
        `).join('');

        quickSearchResults.innerHTML = suggestionsHTML;
        showDropdown();
        selectedSuggestionIndex = -1;

        // Add click handlers to suggestions
        const suggestions = quickSearchResults.querySelectorAll('.search-suggestion');
        suggestions.forEach(suggestion => {
            suggestion.addEventListener('click', function() {
                const fragranceName = this.dataset.fragrance;
                quickSearchInput.value = fragranceName;
                hideDropdown();
                // You can add navigation logic here
                console.log('Selected fragrance:', fragranceName);
            });
        });
    }

    function showDropdown() {
        if (quickSearchDropdown) {
            quickSearchDropdown.style.display = 'block';
            // Force reflow
            quickSearchDropdown.offsetHeight;
            quickSearchDropdown.classList.add('show');
        }
    }

    function hideDropdown() {
        if (quickSearchDropdown) {
            quickSearchDropdown.classList.remove('show');
            setTimeout(() => {
                quickSearchDropdown.style.display = 'none';
            }, 400);
        }
    }

    function hideQuickSearchSuggestions() {
        hideDropdown();
    }

    if (quickSearchInput) {
        // Handle input events
        quickSearchInput.addEventListener('input', function() {
            const value = this.value.trim();
            if (clearQuickSearch) {
                clearQuickSearch.style.display = value ? 'flex' : 'none';
            }
            showQuickSearchSuggestions(value);
        });

        // Handle focus
        quickSearchInput.addEventListener('focus', function() {
            const value = this.value.trim();
            if (value) {
                showQuickSearchSuggestions(value);
            }
        });

        // Handle blur
        quickSearchInput.addEventListener('blur', function() {
            hideQuickSearchSuggestions();
        });

        // Handle keyboard navigation
        quickSearchInput.addEventListener('keydown', function(e) {
            const suggestions = quickSearchResults?.querySelectorAll('.search-suggestion');
            if (!suggestions || suggestions.length === 0) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                selectedSuggestionIndex = Math.min(selectedSuggestionIndex + 1, suggestions.length - 1);
                updateSuggestionHighlight(suggestions);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                selectedSuggestionIndex = Math.max(selectedSuggestionIndex - 1, -1);
                updateSuggestionHighlight(suggestions);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (selectedSuggestionIndex >= 0 && suggestions[selectedSuggestionIndex]) {
                    suggestions[selectedSuggestionIndex].click();
                }
            } else if (e.key === 'Escape') {
                hideDropdown();
                this.blur();
            }
        });
    }

    function updateSuggestionHighlight(suggestions) {
        suggestions.forEach((suggestion, index) => {
            suggestion.classList.toggle('highlighted', index === selectedSuggestionIndex);
        });
    }

    // Clear search functionality
    if (clearQuickSearch) {
        clearQuickSearch.addEventListener('click', function() {
            if (quickSearchInput) {
                quickSearchInput.value = '';
                this.style.display = 'none';
                hideDropdown();
                quickSearchInput.focus();
            }
        });
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!quickSearchInput?.contains(e.target) && !quickSearchDropdown?.contains(e.target)) {
            hideDropdown();
        }
    });

    // Open search modal from floating search icon
    if (floatingSearch) {
        floatingSearch.addEventListener('click', function(e) {
            e.preventDefault();
            openSearchModal();
        });
    }

    // Smooth close search modal function
    function closeSearchModal() {
        if (searchModal && searchModal.classList.contains('active')) {
            // Capture current dimensions to prevent jumping
            const modalContent = searchModal.querySelector('.search-modal-content');
            const searchResults = modalContent.querySelector('.search-results');

            // Get exact current dimensions
            const contentRect = modalContent.getBoundingClientRect();
            const resultsRect = searchResults.getBoundingClientRect();

            // Lock ALL dimensions during closing animation - prevent any size changes
            modalContent.style.width = contentRect.width + 'px';
            modalContent.style.height = contentRect.height + 'px';
            modalContent.style.minWidth = contentRect.width + 'px';
            modalContent.style.maxWidth = contentRect.width + 'px';
            modalContent.style.minHeight = contentRect.height + 'px';
            modalContent.style.maxHeight = contentRect.height + 'px';
            modalContent.style.boxSizing = 'border-box';
            modalContent.style.flexShrink = '0';
            modalContent.style.flexGrow = '0';

            // Lock search results dimensions
            searchResults.style.width = resultsRect.width + 'px';
            searchResults.style.height = resultsRect.height + 'px';
            searchResults.style.minWidth = resultsRect.width + 'px';
            searchResults.style.maxWidth = resultsRect.width + 'px';
            searchResults.style.minHeight = resultsRect.height + 'px';
            searchResults.style.maxHeight = resultsRect.height + 'px';
            searchResults.style.overflow = 'hidden';
            searchResults.style.flexShrink = '0';
            searchResults.style.flexGrow = '0';

            // Prevent any content changes during closing
            modalContent.style.overflow = 'hidden';

            // Force no transforms to prevent any scaling/movement
            modalContent.style.transform = 'none';
            modalContent.style.setProperty('transform', 'none', 'important');

            // Add closing class for smooth animation
            searchModal.classList.add('closing');
            searchModal.classList.remove('active');

            // Clean up after animation completes
            setTimeout(() => {
                searchModal.classList.remove('closing');
                // Reset all locked styles
                modalContent.style.width = '';
                modalContent.style.height = '';
                modalContent.style.minWidth = '';
                modalContent.style.maxWidth = '';
                modalContent.style.minHeight = '';
                modalContent.style.maxHeight = '';
                modalContent.style.boxSizing = '';
                modalContent.style.flexShrink = '';
                modalContent.style.flexGrow = '';
                modalContent.style.transform = '';
                modalContent.style.overflow = '';
                searchResults.style.width = '';
                searchResults.style.height = '';
                searchResults.style.minWidth = '';
                searchResults.style.maxWidth = '';
                searchResults.style.minHeight = '';
                searchResults.style.maxHeight = '';
                searchResults.style.flexShrink = '';
                searchResults.style.flexGrow = '';
                searchResults.style.overflow = '';
                searchInput.value = '';
                // Reset to suggestions when reopened
                showSuggestions();
            }, 1200); // Match the CSS transition duration
        }
    }

    // Close search modal
    if (searchClose) {
        searchClose.addEventListener('click', closeSearchModal);
    }

    // Close modal when clicking outside
    if (searchModal) {
        searchModal.addEventListener('click', function(e) {
            if (e.target === searchModal) {
                closeSearchModal();
            }
        });
    }

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && searchModal && searchModal.classList.contains('active')) {
            closeSearchModal();
        }
    });

    // Search functionality with smooth transitions
    if (searchInput) {
        let searchTimeout;

        searchInput.addEventListener('input', function() {
            // Don't process input changes during closing animation
            if (searchModal && (searchModal.classList.contains('closing') || !searchModal.classList.contains('active'))) {
                return;
            }

            // Clear previous timeout
            clearTimeout(searchTimeout);

            const query = this.value.toLowerCase().trim();

            // Only process if modal is fully active
            if (!searchModal.classList.contains('active')) {
                return;
            }

            // Capture current height before transition
            const currentHeight = searchResults.offsetHeight;
            searchResults.style.minHeight = currentHeight + 'px';

            // Add transitioning class for smooth animation
            searchResults.classList.add('transitioning');

            searchTimeout = setTimeout(() => {
                // Triple-check we're not closing during the timeout
                if (searchModal && (searchModal.classList.contains('closing') || !searchModal.classList.contains('active'))) {
                    searchResults.classList.remove('transitioning');
                    searchResults.style.minHeight = '';
                    return;
                }

                if (query === '') {
                    showSuggestions();
                } else {
                    performSearch(query);
                }

                // Remove transitioning class and reset height after content is updated
                setTimeout(() => {
                    if (searchModal && searchModal.classList.contains('active')) {
                        searchResults.classList.remove('transitioning');
                        searchResults.style.minHeight = '';
                    }
                }, 50);
            }, 200);
        });
    }

    // Suggestion tag clicks
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('suggestion-tag')) {
            // Don't process clicks during closing animation or if modal not active
            if (searchModal && (searchModal.classList.contains('closing') || !searchModal.classList.contains('active'))) {
                return;
            }

            if (searchInput && searchModal.classList.contains('active')) {
                searchInput.value = e.target.textContent;
                performSearch(e.target.textContent.toLowerCase());
            }
        }
    });

    function showSuggestions() {
        // Don't update content during closing animation
        if (searchModal && (searchModal.classList.contains('closing') || !searchModal.classList.contains('active'))) {
            return;
        }

        if (searchResults) {
            searchResults.innerHTML = `
                <div class="search-suggestions">
                    <h3>Popular Searches</h3>
                    <div class="suggestion-tags">
                        <span class="suggestion-tag">Layton</span>
                        <span class="suggestion-tag">Parfums de Marly</span>
                        <span class="suggestion-tag">Woody</span>
                        <span class="suggestion-tag">Fresh</span>
                        <span class="suggestion-tag">Oriental</span>
                        <span class="suggestion-tag">Citrus</span>
                    </div>
                </div>
            `;

            // Trigger staggered animations for suggestion tags with delay for smooth transition
            setTimeout(() => {
                const suggestionTags = document.querySelectorAll('.suggestion-tag');
                suggestionTags.forEach((tag, index) => {
                    tag.style.animation = 'none';
                    tag.offsetHeight; // Trigger reflow
                    tag.style.animation = `tagStagger 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${0.2 + index * 0.1}s forwards`;
                });
            }, 100);
        }
    }

    function performSearch(query) {
        // Don't update content during closing animation
        if (searchModal && (searchModal.classList.contains('closing') || !searchModal.classList.contains('active'))) {
            return;
        }

        const results = fragrances.filter(fragrance =>
            fragrance.name.toLowerCase().includes(query) ||
            fragrance.brand.toLowerCase().includes(query) ||
            fragrance.type.toLowerCase().includes(query) ||
            fragrance.notes.some(note => note.toLowerCase().includes(query))
        );

        if (searchResults) {
            if (results.length > 0) {
                let resultsHTML = '<div class="search-results-list"><h3>Search Results</h3>';
                results.forEach(fragrance => {
                    resultsHTML += `
                        <div class="search-result-item">
                            <div class="result-main">
                                <h4>${fragrance.name}</h4>
                                <p class="result-brand">${fragrance.brand}</p>
                                <p class="result-type">${fragrance.type}</p>
                            </div>
                            <div class="result-notes">
                                <span class="notes-label">Notes:</span>
                                ${fragrance.notes.map(note => `<span class="note-tag">${note}</span>`).join('')}
                            </div>
                        </div>
                    `;
                });
                resultsHTML += '</div>';
                searchResults.innerHTML = resultsHTML;

                // Trigger staggered animations for search results with delay for smooth transition
                setTimeout(() => {
                    const resultItems = document.querySelectorAll('.search-result-item');
                    resultItems.forEach((item, index) => {
                        item.style.animation = 'none';
                        item.offsetHeight; // Trigger reflow
                        item.style.animation = `resultFadeIn 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${0.1 + index * 0.1}s forwards`;
                    });
                }, 100);
            } else {
                searchResults.innerHTML = `
                    <div class="no-results">
                        <h3>No results found</h3>
                        <p>Try searching for different keywords or browse our popular searches above.</p>
                    </div>
                `;
            }
        }
    }

    // Initialize with suggestions
    showSuggestions();

    // Function to interpolate between two colors
    function interpolateColor(color1, color2, factor) {
        const rgb1 = hexToRgb(color1);
        const rgb2 = hexToRgb(color2);

        const r = Math.round(rgb1.r + factor * (rgb2.r - rgb1.r));
        const g = Math.round(rgb1.g + factor * (rgb2.g - rgb1.g));
        const b = Math.round(rgb1.b + factor * (rgb2.b - rgb1.b));

        return `rgb(${r}, ${g}, ${b})`;
    }

    // Function to convert hex to RGB
    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    // Function to update colors and vignette based on scroll position
    function updateColors() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const windowHeight = window.innerHeight;

        // Calculate when user has scrolled past the video section (100vh)
        const videoSectionHeight = windowHeight; // 100vh
        const contentHeight = document.querySelector('.content')?.offsetHeight || windowHeight * 3;

        // Define transition zones - black stays much longer
        const blackDuration = contentHeight * 0.92; // Black stays for 92% of content height (was 85%)
        const transitionStart = videoSectionHeight + blackDuration; // Start transition much later
        const transitionRange = contentHeight * 0.08; // Use 8% of content height for transition (was 15%)
        const transitionEnd = transitionStart + transitionRange;

        // Start cream transition later into the Haltane section
        const haltaneSection = document.querySelector('.haltane-section-container');
        const creamTransitionStart = haltaneSection ? haltaneSection.offsetTop + 500 : transitionEnd;
        const creamTransitionRange = windowHeight * 0.3; // Transition over 30% of viewport height
        const creamTransitionEnd = creamTransitionStart + creamTransitionRange;

        // Start light grey transition at Pegasus section
        const pegasusSection = document.querySelector('.pegasus-image');
        const greyTransitionStart = pegasusSection ? pegasusSection.closest('.content').offsetTop - 200 : creamTransitionEnd + windowHeight;
        const greyTransitionRange = windowHeight * 0.4; // Transition over 40% of viewport height
        const greyTransitionEnd = greyTransitionStart + greyTransitionRange;

        // Calculate transition points relative to the white transition section
        const whiteTransitionSection = document.querySelector('.white-transition-section');
        const whiteTransitionRect = whiteTransitionSection.getBoundingClientRect();
        const whiteTransitionTop = window.scrollY + whiteTransitionRect.top;
        const whiteTransitionHeight = whiteTransitionRect.height;

        // Set the soft green transition to start at the bottom of the white transition section
        const softGreenTransitionStart = whiteTransitionTop + whiteTransitionHeight - window.innerHeight * 0.7; // Start much earlier (was 0.3)
        const softGreenTransitionRange = windowHeight * 0.5; // Transition over 50% of viewport height
        const softGreenTransitionEnd = softGreenTransitionStart + softGreenTransitionRange;

        // Background transitions: black -> cream -> light grey -> vibrant green
        let backgroundColor;
        if (scrollTop < creamTransitionStart) {
            // Before emoji rating section - stay black
            backgroundColor = '#000000';
        } else if (scrollTop < creamTransitionEnd) {
            // In cream transition zone - fade from black to cream
            const rawProgress = (scrollTop - creamTransitionStart) / creamTransitionRange;
            // Apply slower easing curve for smoother, more gradual fade
            const easedProgress = Math.pow(rawProgress, 0.7); // Slower than linear
            backgroundColor = interpolateColor('#000000', '#f5f0e6', easedProgress);
        } else if (scrollTop < greyTransitionStart) {
            // Between cream and grey transition - stay cream
            backgroundColor = '#f5f0e6';
        } else if (scrollTop < greyTransitionEnd) {
            // In grey transition zone - fade from cream to darker grey
            const rawProgress = (scrollTop - greyTransitionStart) / greyTransitionRange;
            const easedProgress = Math.pow(rawProgress, 0.6); // Smooth easing
            backgroundColor = interpolateColor('#f5f0e6', '#d0d0d0', easedProgress);
        } else if (scrollTop < softGreenTransitionStart) {
            // Between grey and soft green transition - stay darker grey
            backgroundColor = '#d0d0d0';
        } else if (scrollTop < softGreenTransitionEnd) {
            // In white transition zone - fade from light grey to white
            const rawProgress = (scrollTop - softGreenTransitionStart) / softGreenTransitionRange;
            const easedProgress = Math.pow(rawProgress, 0.5); // Gentle easing
            // Fade to white
        backgroundColor = interpolateColor('#e8e8e8', '#ffffff', easedProgress);
        } else {
            // Past transition zone - fully white
            backgroundColor = '#ffffff';
        }

        // Apply the color
        body.style.backgroundColor = backgroundColor;

        // Haltane section fade-in effect aligned with cream transition
        const haltaneImage = document.querySelector('.haltane-image');
        const haltaneProductTitle = document.querySelector('.haltane-section-container .product-title');
        const haltaneNotes = document.querySelector('.haltane-notes');
        const haltaneFragranceNotes = document.querySelector('.haltane-fragrance-notes');

        if (haltaneImage || haltaneProductTitle || haltaneNotes || haltaneFragranceNotes) {
            let haltaneOpacity = 0;

            // Start fade-in very late in the cream transition (at 95% progress)
            const fadeInStart = creamTransitionStart + (creamTransitionRange * 0.95);
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
            textColor = '#ffffff';
        } else if (scrollTop < creamTransitionEnd) {
            // In cream transition zone - fade text from white to black
            const rawProgress = (scrollTop - creamTransitionStart) / creamTransitionRange;
            const easedProgress = Math.pow(rawProgress, 0.7); // Same easing as background
            textColor = interpolateColor('#ffffff', '#000000', easedProgress);
        } else if (scrollTop < softGreenTransitionEnd) {
            // Background is cream, grey, or transitioning to soft green - text should be black
            textColor = '#000000';
        } else {
            // Background is soft green - text should be black for good contrast
            textColor = '#000000';
        }

        // Keep perfume rating section visible - remove problematic opacity manipulation
        const perfumeRatingSection = document.querySelector('.perfume-rating');
        if (perfumeRatingSection) {
            // Ensure rating section stays visible
            perfumeRatingSection.style.opacity = '1';
            perfumeRatingSection.style.transition = 'none';
        }

        // Apply text color to all relevant elements
        const textElements = [
            '.perfume-rating',
            '.rating-title',
            '.perfume-description',
            '.perfume-description p',
            '.additional-ratings',
            '.category-title',
            '.rating-label',
            '.rating-count',
            '.no-vote',
            '.gender-labels',
            '.price-labels',
            '.indicator-label',
            '.mood-indicators .indicator-label',
            '.season-indicators .indicator-label'
        ];

        textElements.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                // Skip elements that should maintain their special colors
                if (!element.classList.contains('score') &&
                    !element.classList.contains('votes') &&
                    !element.tagName.toLowerCase() === 'strong' ||
                    element.closest('.perfume-description strong')) {
                    element.style.color = textColor;
                    element.style.transition = 'color 0.3s ease';
                }
            });
        });

        // Handle special colored elements separately
        const specialElements = document.querySelectorAll('.perfume-description strong');
        specialElements.forEach(element => {
            if (scrollTop < transitionStart) {
                element.style.color = '#ffd43b'; // Original gold color
            } else if (scrollTop < transitionEnd) {
                const rawProgress = (scrollTop - transitionStart) / transitionRange;
                const easedProgress = Math.pow(rawProgress, 0.7);
                element.style.color = interpolateColor('#ffd43b', '#d4a017', easedProgress); // Gold to darker gold
            } else {
                element.style.color = '#b8860b'; // Dark gold for white background
            }
            element.style.transition = 'color 0.3s ease';
        });

        // Handle score and votes elements
        const scoreElements = document.querySelectorAll('.rating-title .score');
        scoreElements.forEach(element => {
            if (scrollTop < transitionStart) {
                element.style.color = '#ffd43b'; // Original gold
            } else if (scrollTop < transitionEnd) {
                const rawProgress = (scrollTop - transitionStart) / transitionRange;
                const easedProgress = Math.pow(rawProgress, 0.7);
                element.style.color = interpolateColor('#ffd43b', '#d4a017', easedProgress);
            } else {
                element.style.color = '#b8860b'; // Dark gold
            }
            element.style.transition = 'color 0.3s ease';
        });

        const votesElements = document.querySelectorAll('.rating-title .votes');
        votesElements.forEach(element => {
            if (scrollTop < transitionStart) {
                element.style.color = '#74c0fc'; // Original blue
            } else if (scrollTop < transitionEnd) {
                const rawProgress = (scrollTop - transitionStart) / transitionRange;
                const easedProgress = Math.pow(rawProgress, 0.7);
                element.style.color = interpolateColor('#74c0fc', '#1c7ed6', easedProgress); // Blue to darker blue
            } else {
                element.style.color = '#1864ab'; // Dark blue for white background
            }
            element.style.transition = 'color 0.3s ease';
        });

        // Enhanced navbar fade effect with dynamic visual effects
        // Start fading immediately, completely gone by 6% scroll (much faster)
        const navbarFadeEnd = 0.06;
        const scrollProgress = Math.min(scrollTop / (documentHeight * navbarFadeEnd), 1);

        // Apply gentle easing for smooth fade-out
        const navbarOpacity = 1 - (scrollProgress * scrollProgress * (3 - 2 * scrollProgress)); // Smoothstep

        // Calculate dynamic visual effects based on scroll progress
        const navbarBlur = scrollProgress * 8; // Blur increases as navbar fades
        const scaleAmount = 1 - (scrollProgress * 0.05); // Slight scale down (95% at full fade)
        const backdropBlur = scrollProgress * 15; // Backdrop blur increases

        // Apply enhanced navbar effects
        if (navbar) {
            navbar.style.opacity = navbarOpacity;
            navbar.style.transform = `scale(${scaleAmount})`;
            navbar.style.filter = `blur(${navbarBlur}px)`;
            navbar.style.backdropFilter = `blur(${backdropBlur}px) saturate(${1 + scrollProgress * 0.5})`;
            navbar.style.transition = 'opacity 0.1s ease, transform 0.1s ease, filter 0.1s ease, backdrop-filter 0.1s ease';

            // Add subtle glow effect as it fades
            const glowIntensity = scrollProgress * 0.3;
            navbar.style.boxShadow = `0 0 ${glowIntensity * 30}px rgba(255, 255, 255, ${glowIntensity})`;

            // Add CSS classes for state management
            if (scrollProgress > 0.1 && scrollProgress < 0.9) {
                navbar.classList.add('fading');
                navbar.classList.remove('fade-complete');
            } else if (scrollProgress >= 0.9) {
                navbar.classList.add('fade-complete');
                navbar.classList.remove('fading');
            } else {
                navbar.classList.remove('fading', 'fade-complete');
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
            vignetteProgress = Math.min((scrollProgress - vignetteStart) / (vignetteEnd - vignetteStart), 1);
        }

        // Apply advanced easing for more realistic vignette progression
        // Combine smoothstep with exponential easing for natural feel
        const smoothStep = vignetteProgress * vignetteProgress * (3 - 2 * vignetteProgress);
        const exponentialEase = 1 - Math.pow(1 - vignetteProgress, 2.5);
        const easedVignetteProgress = (smoothStep * 0.6) + (exponentialEase * 0.4);

        // Video blur effect (increases with scroll) - Applied to all videos
        // Start blurring immediately, reach maximum blur at 50% scroll for stronger effect
        const videoBlurEnd = 0.5;
        let videoBlurProgress = Math.min(scrollProgress / videoBlurEnd, 1);

        // Apply smooth easing for natural blur progression
        const videoBlurEased = videoBlurProgress * videoBlurProgress * (3 - 2 * videoBlurProgress); // Smoothstep

        // Calculate blur amount (0px to 25px for stronger effect)
        const videoBlurAmount = videoBlurEased * 25;

        // Apply blur to all videos
        const allVideos = [
            document.getElementById('background-video'),
            document.getElementById('background-video-2'),
            document.getElementById('background-video-3')
        ];

        allVideos.forEach(vid => {
            if (vid) {
                vid.style.filter = `blur(${videoBlurAmount}px)`;
                vid.style.transition = 'filter 0.1s ease, opacity 1s ease-in-out';
            }
        });

        // Dynamic bottom vignette effect (increases with scroll)
        // Start vignette immediately, reach full intensity at 40% scroll for faster effect
        const bottomVignetteEnd = 0.4;
        let bottomVignetteProgress = Math.min(scrollProgress / bottomVignetteEnd, 1);

        // Apply smooth easing for natural vignette progression
        const vignetteEase = bottomVignetteProgress * bottomVignetteProgress * (3 - 2 * bottomVignetteProgress); // Smoothstep
        const vignetteIntensity = vignetteEase * 1.2; // Max intensity of 1.2 (much stronger)

        // Bottom blur effect (increases with scroll for more pronounced bottom blur)
        const bottomBlurAmount = vignetteEase * 15; // Max 15px additional blur at bottom

        // Update vignette intensity and bottom blur
        document.documentElement.style.setProperty('--vignette-intensity', vignetteIntensity);
        document.documentElement.style.setProperty('--bottom-blur', bottomBlurAmount + 'px');

        // Update other vignette overlays with CSS custom properties
        document.documentElement.style.setProperty('--top-vignette-opacity', gentleEase);
        document.documentElement.style.setProperty('--top-vignette-blur', blurAmount + 'px');
        document.documentElement.style.setProperty('--vignette-opacity', easedVignetteProgress);

        ticking = false;
    }

    // Optimized scroll handler using requestAnimationFrame
    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(updateColors);
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    // Initial color update
    updateColors();

    // Language changer functionality
    const languageSelector = document.querySelector('.language-selector');
    const currentLang = document.getElementById('current-lang');
    const languageDropdown = document.getElementById('language-dropdown');
    const langOptions = document.querySelectorAll('.lang-option');

    // Toggle dropdown
    currentLang.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        languageSelector.classList.toggle('active');
        languageDropdown.classList.toggle('active');
    });

    // Language option selection
    langOptions.forEach(option => {
        option.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const selectedLang = this.getAttribute('data-lang');
            const selectedCode = this.getAttribute('data-code');

            // Update current language display
            const selectedFlagSvg = this.querySelector('.flag svg').cloneNode(true);
            selectedFlagSvg.setAttribute('width', '20');
            selectedFlagSvg.setAttribute('height', '14');

            currentLang.querySelector('.flag').innerHTML = '';
            currentLang.querySelector('.flag').appendChild(selectedFlagSvg);
            currentLang.querySelector('.lang-code').textContent = selectedCode;
            
            // Update HTML lang attribute
            document.documentElement.setAttribute('lang', selectedLang);
            
            // Close dropdown
            languageSelector.classList.remove('active');
            languageDropdown.classList.remove('active');
            
            // You can add language switching logic here
            console.log('Language changed to:', selectedLang);
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!languageSelector.contains(e.target)) {
            languageSelector.classList.remove('active');
            languageDropdown.classList.remove('active');
        }
    });

    // Close dropdown on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            languageSelector.classList.remove('active');
            languageDropdown.classList.remove('active');
        }
    });

    // Multiple background videos cycling
    const videos = [
        document.getElementById('background-video'),
        document.getElementById('background-video-2'),
        document.getElementById('background-video-3')
    ];

    let currentVideoIndex = 0;
    let videoTransitionInterval;
    let isPlaying = true;

    // Video control elements
    const playPauseBtn = document.getElementById('play-pause-btn');
    const nextVideoBtn = document.getElementById('next-video-btn');
    const playIcon = playPauseBtn.querySelector('.play-icon');
    const pauseIcon = playPauseBtn.querySelector('.pause-icon');

    function switchToNextVideo() {
        if (videos.length <= 1) return;

        const currentVideo = videos[currentVideoIndex];
        const nextVideoIndex = (currentVideoIndex + 1) % videos.length;
        const nextVideo = videos[nextVideoIndex];

        // Fade out current video
        currentVideo.style.opacity = '0';

        // After fade out, switch videos and fade in
        setTimeout(() => {
            currentVideo.style.display = 'none';
            nextVideo.style.display = 'block';
            nextVideo.style.opacity = '0';

            // Force reflow
            nextVideo.offsetHeight;

            // Fade in next video
            nextVideo.style.opacity = '1';

            currentVideoIndex = nextVideoIndex;
        }, 1000); // Match CSS transition duration
    }

    function startVideoRotation() {
        // Switch video every 15 seconds
        videoTransitionInterval = setInterval(switchToNextVideo, 15000);
    }

    function stopVideoRotation() {
        if (videoTransitionInterval) {
            clearInterval(videoTransitionInterval);
        }
    }

    // Initialize video rotation
    if (videos.length > 1) {
        // Ensure all videos are loaded before starting rotation
        let loadedVideos = 0;
        videos.forEach(video => {
            if (video) {
                video.addEventListener('loadeddata', () => {
                    loadedVideos++;
                    if (loadedVideos === videos.length) {
                        startVideoRotation();
                    }
                });
            }
        });
    }

    // Video control functionality
    function togglePlayPause() {
        const currentVideo = videos[currentVideoIndex];
        if (!currentVideo) return;

        if (isPlaying) {
            // Pause video
            currentVideo.pause();
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
            stopVideoRotation();
            isPlaying = false;
        } else {
            // Play video
            currentVideo.play();
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
            startVideoRotation();
            isPlaying = true;
        }
    }

    function manualNextVideo() {
        // Stop auto rotation temporarily
        stopVideoRotation();

        // Switch to next video
        switchToNextVideo();

        // Restart auto rotation after 3 seconds if playing
        if (isPlaying) {
            setTimeout(() => {
                startVideoRotation();
            }, 3000);
        }
    }

    // Event listeners for video controls
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', togglePlayPause);
    }

    if (nextVideoBtn) {
        nextVideoBtn.addEventListener('click', manualNextVideo);
    }

    // Initialize play/pause button state
    if (isPlaying) {
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
    }

    // Update play/pause state when videos change
    function updatePlayPauseState() {
        const currentVideo = videos[currentVideoIndex];
        if (currentVideo) {
            if (currentVideo.paused) {
                playIcon.style.display = 'block';
                pauseIcon.style.display = 'none';
                isPlaying = false;
            } else {
                playIcon.style.display = 'none';
                pauseIcon.style.display = 'block';
                isPlaying = true;
            }
        }
    }

    // Listen for video events to sync button state
    videos.forEach(video => {
        if (video) {
            video.addEventListener('play', updatePlayPauseState);
            video.addEventListener('pause', updatePlayPauseState);
        }
    });

    // Back to Top Button Functionality
    const backToTopBtn = document.getElementById('backToTop');
    const progressRing = document.querySelector('.progress-ring-progress');
    const circumference = 2 * Math.PI * 26; // radius = 26

    if (backToTopBtn && progressRing) {
        // Set up progress ring
        progressRing.style.strokeDasharray = circumference;
        progressRing.style.strokeDashoffset = circumference;

        function updateBackToTop() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = scrollTop / documentHeight;

            // Show/hide button based on scroll position
            if (scrollTop > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }

            // Update progress ring
            const offset = circumference - (scrollPercent * circumference);
            progressRing.style.strokeDashoffset = offset;

            // Add pulse effect when near bottom
            if (scrollPercent > 0.9) {
                backToTopBtn.classList.add('pulse');
            } else {
                backToTopBtn.classList.remove('pulse');
            }
        }

        // Social links visibility and styling function
        function updateSocialLinks() {
            const socialLinks = document.getElementById('socialLinks');
            if (!socialLinks) return;

            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const contentHeight = document.querySelector('.content')?.offsetHeight || window.innerHeight * 3;
            const windowHeight = window.innerHeight;

            // Calculate background transition points (same as in updateColors)
            const blackDuration = contentHeight * 0.6;
            const transitionStart = windowHeight + blackDuration;
            const transitionRange = contentHeight * 0.08;
            const transitionEnd = transitionStart + transitionRange;

            // Start cream transition later into the Haltane section
            const haltaneSection = document.querySelector('.haltane-section-container');
            const creamTransitionStart = haltaneSection ? haltaneSection.offsetTop + 500 : transitionEnd;
            const creamTransitionRange = windowHeight * 0.3;
            const creamTransitionEnd = creamTransitionStart + creamTransitionRange;

            const pegasusSection = document.querySelector('.pegasus-image');
            const greyTransitionStart = pegasusSection ? pegasusSection.closest('.content').offsetTop - 200 : creamTransitionEnd + windowHeight;
            const greyTransitionRange = windowHeight * 0.4;
            const greyTransitionEnd = greyTransitionStart + greyTransitionRange;

            // Show social links after scrolling past navbar fade (150px for smooth transition)
            if (scrollTop > 150) {
                socialLinks.classList.add('visible');

                // Update social links styling based on background color
                if (scrollTop < creamTransitionStart) {
                    // Black background - use light styling
                    socialLinks.classList.remove('white-bg', 'cream-bg');
                } else if (scrollTop < greyTransitionEnd) {
                    // Cream or transitioning to grey background - use dark styling
                    socialLinks.classList.add('cream-bg');
                    socialLinks.classList.remove('white-bg');
                } else {
                    // Light grey background - use dark styling
                    socialLinks.classList.add('cream-bg');
                    socialLinks.classList.remove('white-bg');
                }
            } else {
                socialLinks.classList.remove('visible');
            }
        }

        // Floating search icon and cart visibility function
        function updateFloatingElements() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const contentHeight = document.querySelector('.content')?.offsetHeight || window.innerHeight * 3;
            const windowHeight = window.innerHeight;

            // Calculate background transition points (same as in updateColors)
            const haltaneSection = document.querySelector('.haltane-section-container');
            const creamTransitionStart = haltaneSection ? haltaneSection.offsetTop + 500 : windowHeight * 2;
            const creamTransitionRange = windowHeight * 0.3;
            const creamTransitionEnd = creamTransitionStart + creamTransitionRange;

            const pegasusSection = document.querySelector('.pegasus-image');
            const greyTransitionStart = pegasusSection ? pegasusSection.closest('.content').offsetTop - 200 : creamTransitionEnd + windowHeight;
            const greyTransitionRange = windowHeight * 0.4;
            const greyTransitionEnd = greyTransitionStart + greyTransitionRange;

            // Show floating search and menu after scrolling past navbar fade (800px for much later appearance)
            if (scrollTop > 800) {
                floatingSearch.classList.add('visible');
                if (floatingMenu) {
                    floatingMenu.classList.add('visible');
                }

                // Update styling based on background color
                if (scrollTop < creamTransitionStart) {
                    // Black background - use light styling
                    floatingSearch.classList.add('dark-bg');
                    floatingSearch.classList.remove('white-bg', 'cream-bg');
                    if (floatingMenu) {
                        floatingMenu.classList.remove('white-bg', 'cream-bg');
                    }
                } else if (scrollTop < creamTransitionEnd) {
                    // Transitioning to cream - determine which style based on progress
                    const creamProgress = (scrollTop - creamTransitionStart) / creamTransitionRange;
                    if (creamProgress < 0.3) {
                        // Early in transition - still use dark styling
                        floatingSearch.classList.add('dark-bg');
                        floatingSearch.classList.remove('white-bg', 'cream-bg');
                        if (floatingMenu) {
                            floatingMenu.classList.remove('white-bg', 'cream-bg');
                        }
                    } else {
                        // Later in transition - switch to cream styling
                        floatingSearch.classList.add('cream-bg');
                        floatingSearch.classList.remove('dark-bg', 'white-bg');
                        if (floatingMenu) {
                            floatingMenu.classList.add('cream-bg');
                            floatingMenu.classList.remove('white-bg');
                        }
                    }
                } else if (scrollTop < greyTransitionEnd) {
                    // Cream or transitioning to grey background - use cream styling
                    floatingSearch.classList.add('cream-bg');
                    floatingSearch.classList.remove('dark-bg', 'white-bg');
                    if (floatingMenu) {
                        floatingMenu.classList.add('cream-bg');
                        floatingMenu.classList.remove('white-bg');
                    }
                } else {
                    // Light grey background - use cream styling (works well on grey)
                    floatingSearch.classList.add('cream-bg');
                    floatingSearch.classList.remove('dark-bg', 'white-bg');
                    if (floatingMenu) {
                        floatingMenu.classList.add('cream-bg');
                        floatingMenu.classList.remove('white-bg');
                    }
                }
            } else {
                floatingSearch.classList.remove('visible');
                if (floatingMenu) {
                    floatingMenu.classList.remove('visible');
                }
                // Default to dark-bg when hidden
                floatingSearch.classList.add('dark-bg');
                floatingSearch.classList.remove('white-bg', 'cream-bg');
                if (floatingMenu) {
                    floatingMenu.classList.remove('white-bg', 'cream-bg');
                }
            }
        }



        // Add back to top, floating search, and floating cart update to scroll handler
        const originalOnScroll = onScroll;
        onScroll = function() {
            if (!ticking) {
                requestAnimationFrame(() => {
                    updateColors();
                    updateBackToTop();
                    if (floatingSearch || floatingMenu) {
                        updateFloatingElements();
                    }

                    updateSocialLinks();
                });
                ticking = true;
            }
        };

        // Update scroll event listener
        window.removeEventListener('scroll', originalOnScroll);
        window.addEventListener('scroll', onScroll, { passive: true });

        // Enhanced smooth scroll to top with custom easing
        backToTopBtn.addEventListener('click', function() {
            const startPosition = window.pageYOffset;
            const startTime = performance.now();
            const duration = 2000; // 2 seconds for very smooth transition

            function easeInOutCubic(t) {
                return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
            }

            function animateScroll(currentTime) {
                const timeElapsed = currentTime - startTime;
                const progress = Math.min(timeElapsed / duration, 1);
                const easedProgress = easeInOutCubic(progress);

                const currentPosition = startPosition * (1 - easedProgress);
                window.scrollTo(0, currentPosition);

                if (progress < 1) {
                    requestAnimationFrame(animateScroll);
                }
            }

            requestAnimationFrame(animateScroll);
        });

        // Initial calls
        updateBackToTop();
        if (floatingSearch || floatingMenu) {
            updateFloatingElements();
        }

        updateSocialLinks();
        updateTopVignette();
    }

    // Top Vignette Theme Update
    function updateTopVignette() {
        const topVignette = document.getElementById('topVignette');
        if (!topVignette) return;

        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const haltaneSection = document.querySelector('.haltane-section-container');
        const creamTransitionStart = haltaneSection ? haltaneSection.offsetTop + 500 : window.innerHeight * 2;
        const creamTransitionRange = window.innerHeight * 0.3;
        const creamTransitionEnd = creamTransitionStart + creamTransitionRange;

        if (scrollTop >= creamTransitionEnd) {
            topVignette.classList.add('cream-theme');
        } else {
            topVignette.classList.remove('cream-theme');
        }
    }

    // Parallax Elements
    const brandImage = document.querySelector('.brand-image');
    const laytonImage = document.querySelector('.layton-image');
    const laytonNotes = document.querySelector('.layton-notes');
    const productTitle = document.querySelector('.product-title');
    const fragranceNotes = document.querySelector('.fragrance-notes');
    const perfumeRating = document.querySelector('.perfume-rating');

    // Pegasus Parallax Elements
    const pegasusImage = document.querySelector('.pegasus-image');
    const pegasusProductTitle = document.querySelector('.pegasus-image ~ .product-title'); // Get Pegasus product title
    const pegasusFragranceProfile = document.querySelector('.pegasus-notes.custom-fragrance-profile');
    const pegasusFragranceNotes = document.querySelector('.pegasus-image ~ .fragrance-notes'); // Get Pegasus fragrance notes
    const pegasusPerfumeRating = document.querySelector('.pegasus-perfume-rating');

    // Debug: Check if elements are found
    console.log('Pegasus Elements Found:');
    console.log('pegasusImage:', pegasusImage);
    console.log('pegasusProductTitle:', pegasusProductTitle);
    console.log('pegasusFragranceProfile:', pegasusFragranceProfile);
    console.log('pegasusFragranceNotes:', pegasusFragranceNotes);

    // Set initial hidden states for Pegasus elements
    if (pegasusImage) {
        pegasusImage.style.setProperty('opacity', '0', 'important');
        pegasusImage.style.setProperty('transform', 'translateX(-100px) scale(0.8)', 'important');
        pegasusImage.style.setProperty('transition', 'none', 'important');
    }
    if (pegasusProductTitle) {
        pegasusProductTitle.style.setProperty('opacity', '0', 'important');
        pegasusProductTitle.style.setProperty('transform', 'translateY(50px) scale(0.9)', 'important');
        pegasusProductTitle.style.setProperty('transition', 'none', 'important');
    }
    if (pegasusFragranceProfile) {
        pegasusFragranceProfile.style.setProperty('opacity', '0', 'important');
        pegasusFragranceProfile.style.setProperty('transform', 'translateX(100px) scale(0.8)', 'important');
        pegasusFragranceProfile.style.setProperty('transition', 'none', 'important');
    }
    if (pegasusFragranceNotes) {
        pegasusFragranceNotes.style.setProperty('opacity', '0', 'important');
        pegasusFragranceNotes.style.setProperty('transform', 'translateX(150px) scale(0.8)', 'important');
        pegasusFragranceNotes.style.setProperty('transition', 'none', 'important');
    }

    // Quality Selector Functionality
    function initializeQualitySelectors() {
        // Handle all quality selectors (Layton, Haltane, and Pegasus)
        const qualitySelectors = document.querySelectorAll('.quality-selector');

        qualitySelectors.forEach(selector => {
            const qualityOptions = selector.querySelectorAll('.quality-option');
            const priceContainer = selector.closest('.product-price-container');
            const priceBadge = priceContainer ? priceContainer.querySelector('.price-badge') : null;
            const priceAmount = priceBadge ? priceBadge.querySelector('.price-amount') : null;

            if (!priceAmount) return;

            qualityOptions.forEach(option => {
                option.addEventListener('click', function() {
                    // Remove active class from all options in this selector
                    qualityOptions.forEach(opt => opt.classList.remove('active'));

                    // Add active class to clicked option
                    this.classList.add('active');

                    // Get the new price from data attribute
                    const newPrice = this.getAttribute('data-price');

                    if (newPrice && priceAmount) {
                        // Animate price change
                        animatePriceChange(priceAmount, newPrice);
                    }
                });
            });
        });
    }

    // Animate price change with smooth transition
    function animatePriceChange(priceElement, newPrice) {
        const currentPrice = parseInt(priceElement.textContent) || 0;
        const targetPrice = parseInt(newPrice);
        const duration = 800; // Animation duration in milliseconds
        const startTime = performance.now();

        function updatePrice(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Use easing function for smooth animation
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.round(currentPrice + (targetPrice - currentPrice) * easeOutCubic);

            priceElement.textContent = currentValue;

            if (progress < 1) {
                requestAnimationFrame(updatePrice);
            } else {
                priceElement.textContent = targetPrice; // Ensure final value is exact
            }
        }

        requestAnimationFrame(updatePrice);
    }

    // Initialize quality selectors
    initializeQualitySelectors();

    // Brand Image Parallax Effect (First in sequence)
    if (brandImage) {
        function updateBrandImageParallax() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const heroSection = document.querySelector('.hero');
            const heroHeight = heroSection ? heroSection.offsetHeight : window.innerHeight;

            // Start parallax effect much later in scroll sequence (60% of hero height)
            const triggerPoint = heroHeight * 0.6; // Start at 60% of hero height (much later)
            const parallaxRange = heroHeight * 0.8; // Effect lasts for 80% of hero height
            const fadeOutStart = heroHeight * 1.4; // Start fading out at 140% (much later)
            const fadeOutEnd = heroHeight * 1.8; // Complete fade out at 180% (much later)

            if (scrollTop > triggerPoint && scrollTop < fadeOutEnd) {
                brandImage.classList.add('parallax-active');

                let opacity, translateY;

                if (scrollTop < fadeOutStart) {
                    // Fade in and parallax phase
                    const progress = Math.min((scrollTop - triggerPoint) / parallaxRange, 1);

                    // Smooth easing function for natural movement (same as other elements)
                    const easeOutCubic = 1 - Math.pow(1 - progress, 3);

                    // Vertical parallax movement (slower than scroll speed)
                    translateY = -30 + (easeOutCubic * 20); // Move from -30px to -10px (subtle upward drift)
                    opacity = Math.min(easeOutCubic * 1.2, 1); // Fade in slightly faster than movement
                } else {
                    // Fade out phase
                    const fadeProgress = (scrollTop - fadeOutStart) / (fadeOutEnd - fadeOutStart);
                    const easedFadeProgress = Math.pow(fadeProgress, 2); // Faster fade out

                    translateY = -10; // Keep final position
                    opacity = 0.9 * (1 - easedFadeProgress); // Fade from 0.9 to 0
                }

                brandImage.style.transform = `translateY(${translateY}px)`;
                brandImage.style.opacity = opacity;
                
                // Ensure consistent filter and appearance during scroll
                brandImage.style.filter = 'drop-shadow(0 10px 30px rgba(0, 0, 0, 0.5))';
                brandImage.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            } else if (scrollTop <= triggerPoint) {
                // Reset to hidden state when above trigger point
                brandImage.classList.remove('parallax-active');
                brandImage.style.transform = 'translateY(-30px)';
                brandImage.style.opacity = '0';
                brandImage.style.filter = 'drop-shadow(0 10px 30px rgba(0, 0, 0, 0.5))';
            } else {
                // Completely hidden when past fade out point
                brandImage.classList.remove('parallax-active');
                brandImage.style.transform = 'translateY(-10px)';
                brandImage.style.opacity = '0';
                brandImage.style.filter = 'drop-shadow(0 10px 30px rgba(0, 0, 0, 0.5))';
            }
        }
    }

    if (laytonImage) {
        function updateLaytonParallax() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const heroSection = document.querySelector('.hero');
            const heroHeight = heroSection ? heroSection.offsetHeight : window.innerHeight;

            // Start parallax effect after scrolling past the hero section
            const triggerPoint = heroHeight * 1.2; // Start at 120% of hero height (earlier)
            const parallaxRange = 400; // Distance over which the effect occurs

            if (scrollTop > triggerPoint) {
                laytonImage.classList.add('parallax-active');

                // Calculate progress (0 to 1) over the parallax range
                const progress = Math.min((scrollTop - triggerPoint) / parallaxRange, 1);

                // Smooth easing function for natural movement
                const easeOutCubic = 1 - Math.pow(1 - progress, 3);

                // Apply parallax transformations with synchronized zoom
                const translateX = -100 + (easeOutCubic * 100); // Slide in from left
                const scale = 0.8 + (easeOutCubic * 0.2); // Zoom from 0.8 to 1.0
                const opacity = easeOutCubic; // Fade in

                laytonImage.style.transform = `translateX(${translateX}px) scale(${scale})`;
                laytonImage.style.opacity = opacity;
            } else {
                // Reset to hidden state when above trigger point
                laytonImage.classList.remove('parallax-active');
                laytonImage.style.transform = 'translateX(-100px) scale(0.8)';
                laytonImage.style.opacity = '0';
            }
        }
    }

    // Layton Notes Parallax Effect
    if (laytonNotes) {
        function updateLaytonNotesParallax() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const heroSection = document.querySelector('.hero');
            const heroHeight = heroSection ? heroSection.offsetHeight : window.innerHeight;

            // Start parallax effect much later than other elements
            const triggerPoint = heroHeight * 1.2; // Start at 120% of hero height (earlier)
            const parallaxRange = 400; // Same distance as bottle image

            if (scrollTop > triggerPoint) {
                laytonNotes.classList.add('parallax-active');

                // Calculate progress (0 to 1) over the parallax range
                const progress = Math.min((scrollTop - triggerPoint) / parallaxRange, 1);

                // Smooth easing function for natural movement
                const easeOutCubic = 1 - Math.pow(1 - progress, 3);

                // Apply parallax transformations with synchronized zoom (slide from right)
                const translateX = 100 - (easeOutCubic * 100); // Slide in from right
                const scale = 0.8 + (easeOutCubic * 0.2); // Zoom from 0.8 to 1.0
                const opacity = easeOutCubic; // Fade in

                laytonNotes.style.transform = `translateX(${translateX}px) scale(${scale})`;
                laytonNotes.style.opacity = opacity;
            } else {
                // Reset to hidden state when above trigger point
                laytonNotes.classList.remove('parallax-active');
                laytonNotes.style.transform = 'translateX(100px) scale(0.8)';
                laytonNotes.style.opacity = '0';
            }
        }
    }

    // Product Title Parallax Effect
    if (productTitle) {
        function updateProductTitleParallax() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const heroSection = document.querySelector('.hero');
            const heroHeight = heroSection ? heroSection.offsetHeight : window.innerHeight;

            // Start parallax effect much later than other elements
            const triggerPoint = heroHeight * 1.2; // Start at 120% of hero height (earlier)
            const parallaxRange = 350; // Smooth transition range

            if (scrollTop > triggerPoint) {
                productTitle.classList.add('parallax-active');

                // Calculate progress (0 to 1) over the parallax range
                const progress = Math.min((scrollTop - triggerPoint) / parallaxRange, 1);

                // Smooth easing function for natural movement
                const easeOutCubic = 1 - Math.pow(1 - progress, 3);

                // Apply parallax transformations (fade up and scale in)
                const translateY = 30 - (easeOutCubic * 30); // Slide up from below
                const scale = 0.9 + (easeOutCubic * 0.1); // Scale from 0.9 to 1.0
                const opacity = easeOutCubic; // Fade in

                productTitle.style.transform = `translateY(${translateY}px) scale(${scale})`;
                productTitle.style.opacity = opacity;
            } else {
                // Reset to hidden state when above trigger point
                productTitle.classList.remove('parallax-active');
                productTitle.style.transform = 'translateY(30px) scale(0.9)';
                productTitle.style.opacity = '0';
            }
        }
    }

    // Fragrance Notes Parallax Effect
    if (fragranceNotes) {
        function updateFragranceNotesParallax() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const heroSection = document.querySelector('.hero');
            const heroHeight = heroSection ? heroSection.offsetHeight : window.innerHeight;

            // Start parallax effect much later than other elements
            const triggerPoint = heroHeight * 1.2; // Start at 120% of hero height (earlier)
            const parallaxRange = 400; // Same distance as other images

            if (scrollTop > triggerPoint) {
                fragranceNotes.classList.add('parallax-active');

                // Calculate progress (0 to 1) over the parallax range
                const progress = Math.min((scrollTop - triggerPoint) / parallaxRange, 1);

                // Smooth easing function for natural movement
                const easeOutCubic = 1 - Math.pow(1 - progress, 3);

                // Apply parallax transformations (slide from right, further than notes)
                const translateX = 150 - (easeOutCubic * 150); // Slide in from further right
                const scale = 0.8 + (easeOutCubic * 0.2); // Zoom from 0.8 to 1.0
                const opacity = easeOutCubic; // Fade in

                fragranceNotes.style.transform = `translateX(${translateX}px) scale(${scale})`;
                fragranceNotes.style.opacity = opacity;
            } else {
                // Reset to hidden state when above trigger point
                fragranceNotes.classList.remove('parallax-active');
                fragranceNotes.style.transform = 'translateX(150px) scale(0.8)';
                fragranceNotes.style.opacity = '0';
            }
        }
    }

    // Perfume Rating Parallax Effect
    if (perfumeRating) {
        function updatePerfumeRatingParallax() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const heroSection = document.querySelector('.hero');
            const heroHeight = heroSection ? heroSection.offsetHeight : window.innerHeight;

            // Start parallax effect much later than other elements
            const triggerPoint = heroHeight * 1.8; // Start at 180% of hero height (extremely delayed)
            const parallaxRange = 300; // Shorter range for final element

            if (scrollTop > triggerPoint) {
                perfumeRating.classList.add('parallax-active');

                // Calculate progress (0 to 1) over the parallax range
                const progress = Math.min((scrollTop - triggerPoint) / parallaxRange, 1);

                // Smooth easing function for natural movement
                const easeOutCubic = 1 - Math.pow(1 - progress, 3);

                // Apply parallax transformations (fade up from bottom)
                const translateY = 50 - (easeOutCubic * 50); // Slide up from bottom

                // Only set opacity if fade-out hasn't taken control
                const currentOpacity = parseFloat(perfumeRating.style.opacity) || 1;
                if (currentOpacity > 0) {
                    const parallaxOpacity = easeOutCubic;
                    // Use the minimum of parallax opacity and current opacity (for fade-out)
                    perfumeRating.style.opacity = Math.min(parallaxOpacity, currentOpacity);
                }

                perfumeRating.style.transform = `translateY(${translateY}px)`;
            } else {
                // Reset to hidden state when above trigger point
                perfumeRating.classList.remove('parallax-active');
                perfumeRating.style.transform = 'translateY(50px)';
                // Only reset opacity if fade-out isn't controlling it
                if (parseFloat(perfumeRating.style.opacity) !== 0) {
                    perfumeRating.style.opacity = '0';
                }
            }
        }

        // Add parallax update to scroll handler
        const originalOnScrollWithParallax = onScroll;
        onScroll = function() {
            if (!ticking) {
                requestAnimationFrame(() => {
                    updateColors();
                    if (backToTopBtn && progressRing) {
                        updateBackToTop();
                    }
                    if (floatingSearch) {
                        updateFloatingElements();
                    }
                    updateSocialLinks();
                    if (brandImage) {
                        updateBrandImageParallax();
                    }
                    updateLaytonParallax();
                    if (laytonNotes) {
                        updateLaytonNotesParallax();
                    }
                    if (productTitle) {
                        updateProductTitleParallax();
                    }
                    if (fragranceNotes) {
                        updateFragranceNotesParallax();
                    }
                    if (perfumeRating) {
                        updatePerfumeRatingParallax();
                    }
                });
                ticking = true;
            }
        };

        // Update scroll event listener
        window.removeEventListener('scroll', originalOnScrollWithParallax);
        window.addEventListener('scroll', onScroll, { passive: true });

        // Initial parallax calls
        if (brandImage) {
            updateBrandImageParallax();
        }
        updateLaytonParallax();
        if (laytonNotes) {
            updateLaytonNotesParallax();
        }
        if (productTitle) {
            updateProductTitleParallax();
        }
        if (fragranceNotes) {
            updateFragranceNotesParallax();
        }
        if (perfumeRating) {
            updatePerfumeRatingParallax();
        }
    }

    // Pegasus Image Parallax Effect (matching Layton style)
    if (pegasusImage) {
        let pegasusImageLastProgress = -1;

        function updatePegasusImageParallax() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const pegasusSection = pegasusImage.closest('.content');

            if (pegasusSection) {
                // Start parallax effect exactly when light grey background transition starts (ultra-smooth and gentle)
                const triggerPoint = pegasusSection.offsetTop - 600; // Start even earlier\n                const parallaxRange = 1000; // Shorter range for quicker completion
                const endPoint = triggerPoint + parallaxRange;

                if (scrollTop >= triggerPoint && scrollTop <= endPoint) {
                    // Calculate progress (0 to 1) over the parallax range
                    const rawProgress = (scrollTop - triggerPoint) / parallaxRange;
                    const progress = Math.max(0, Math.min(rawProgress, 1));

                    // Ultra-high frame rate - update on every tiny change for buttery smoothness
                    if (Math.abs(progress - pegasusImageLastProgress) > 0.0008) {
                        pegasusImageLastProgress = progress;

                        pegasusImage.classList.add('parallax-active');

                        // Ultra-gentle easing with multiple curves for silk-smooth motion
                        const easeOutQuint = 1 - Math.pow(1 - progress, 5); // Even gentler than quartic
                        const easeInOutSine = -(Math.cos(Math.PI * progress) - 1) / 2; // Sine wave smoothness
                        const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress); // Exponential ease
                        const combinedEase = (easeOutQuint * 0.5) + (easeInOutSine * 0.3) + (easeOutExpo * 0.2); // Triple blend for ultimate smoothness

                        // Apply ultra-gentle parallax transformations
                        const translateX = -35 + (combinedEase * 35); // Reduced movement for silk-smooth effect
                        const scale = 0.96 + (combinedEase * 0.04); // Minimal scale change for subtlety
                        const opacity = combinedEase;

                        // Use transform3d for hardware acceleration and smoother rendering
                        requestAnimationFrame(() => {
                            pegasusImage.style.setProperty('transform', `translate3d(${translateX}px, 0, 0) scale(${scale})`, 'important');
                            pegasusImage.style.setProperty('opacity', opacity, 'important');
                            pegasusImage.style.setProperty('transition', 'none', 'important');
                            pegasusImage.style.setProperty('will-change', 'transform, opacity', 'important');
                        });
                    }
                } else if (scrollTop > endPoint) {
                    // Fully visible state with smooth transition
                    if (pegasusImageLastProgress !== 1) {
                        pegasusImageLastProgress = 1;
                        pegasusImage.classList.add('parallax-active');
                        requestAnimationFrame(() => {
                            pegasusImage.style.setProperty('transform', 'translate3d(0px, 0, 0) scale(1)', 'important');
                            pegasusImage.style.setProperty('opacity', '1', 'important');
                            pegasusImage.style.setProperty('transition', 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.4s ease-out', 'important');
                        });
                    }
                } else {
                    // Hidden state with smooth transition
                    if (pegasusImageLastProgress !== 0) {
                        pegasusImageLastProgress = 0;
                        pegasusImage.classList.remove('parallax-active');
                        requestAnimationFrame(() => {
                            pegasusImage.style.setProperty('transform', 'translate3d(-35px, 0, 0) scale(0.96)', 'important');
                            pegasusImage.style.setProperty('opacity', '0', 'important');
                            pegasusImage.style.setProperty('transition', 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.4s ease-out', 'important');
                        });
                    }
                }
            }
        }
    }

    // Pegasus Product Title Parallax Effect
    if (pegasusProductTitle) {
        let pegasusProductTitleLastProgress = -1;

        function updatePegasusProductTitleParallax() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const pegasusSection = pegasusProductTitle.closest('.content');

            if (pegasusSection) {
                // Start parallax effect between image and profile (staggered timing, ultra-smooth)
                const triggerPoint = pegasusSection.offsetTop - 500; // Start even earlier\n                const parallaxRange = 800; // Shorter range for quicker completion
                const endPoint = triggerPoint + parallaxRange;

                if (scrollTop >= triggerPoint && scrollTop <= endPoint) {
                    // Calculate progress (0 to 1) over the parallax range
                    const rawProgress = (scrollTop - triggerPoint) / parallaxRange;
                    const progress = Math.max(0, Math.min(rawProgress, 1));

                    // Ultra-high frame rate - update on every tiny change for buttery smoothness
                    if (Math.abs(progress - pegasusProductTitleLastProgress) > 0.0008) {
                        pegasusProductTitleLastProgress = progress;

                        pegasusProductTitle.classList.add('parallax-active');

                        // Ultra-gentle easing with multiple curves for silk-smooth motion
                        const easeOutQuint = 1 - Math.pow(1 - progress, 5); // Even gentler than quartic
                        const easeInOutSine = -(Math.cos(Math.PI * progress) - 1) / 2; // Sine wave smoothness
                        const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress); // Exponential ease
                        const combinedEase = (easeOutQuint * 0.5) + (easeInOutSine * 0.3) + (easeOutExpo * 0.2); // Triple blend for ultimate smoothness

                        // Apply ultra-gentle parallax transformations
                        const translateY = 20 - (combinedEase * 20); // Reduced movement for silk-smooth effect
                        const scale = 0.97 + (combinedEase * 0.03); // Minimal scale change for subtlety
                        const opacity = combinedEase;

                        // Use transform3d for hardware acceleration and smoother rendering
                        requestAnimationFrame(() => {
                            pegasusProductTitle.style.setProperty('transform', `translate3d(0, ${translateY}px, 0) scale(${scale})`, 'important');
                            pegasusProductTitle.style.setProperty('opacity', opacity, 'important');
                            pegasusProductTitle.style.setProperty('transition', 'none', 'important');
                            pegasusProductTitle.style.setProperty('will-change', 'transform, opacity', 'important');
                        });
                    }
                } else if (scrollTop > endPoint) {
                    // Fully visible state with smooth transition
                    if (pegasusProductTitleLastProgress !== 1) {
                        pegasusProductTitleLastProgress = 1;
                        pegasusProductTitle.classList.add('parallax-active');
                        requestAnimationFrame(() => {
                            pegasusProductTitle.style.setProperty('transform', 'translate3d(0, 0px, 0) scale(1)', 'important');
                            pegasusProductTitle.style.setProperty('opacity', '1', 'important');
                            pegasusProductTitle.style.setProperty('transition', 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.4s ease-out', 'important');
                        });
                    }
                } else {
                    // Hidden state with smooth transition
                    if (pegasusProductTitleLastProgress !== 0) {
                        pegasusProductTitleLastProgress = 0;
                        pegasusProductTitle.classList.remove('parallax-active');
                        requestAnimationFrame(() => {
                            pegasusProductTitle.style.setProperty('transform', 'translate3d(0, 20px, 0) scale(0.97)', 'important');
                            pegasusProductTitle.style.setProperty('opacity', '0', 'important');
                            pegasusProductTitle.style.setProperty('transition', 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.4s ease-out', 'important');
                        });
                    }
                }
            }
        }

        updatePegasusProductTitleParallax();
    }

    // Pegasus Fragrance Profile Parallax Effect (matching Layton Notes style)
    if (pegasusFragranceProfile) {
        let pegasusFragranceProfileLastProgress = -1;

        function updatePegasusFragranceProfileParallax() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const pegasusSection = pegasusFragranceProfile.closest('.content');

            if (pegasusSection) {
                // Start parallax effect slightly after the image (staggered timing, ultra-smooth)
                const triggerPoint = pegasusSection.offsetTop - 300; // Start earlier\n                const parallaxRange = 700; // Shorter range for quicker completion
                const endPoint = triggerPoint + parallaxRange;

                if (scrollTop >= triggerPoint && scrollTop <= endPoint) {
                    // Calculate progress (0 to 1) over the parallax range
                    const rawProgress = (scrollTop - triggerPoint) / parallaxRange;
                    const progress = Math.max(0, Math.min(rawProgress, 1));

                    // Ultra-high frame rate - update on every tiny change for buttery smoothness
                    if (Math.abs(progress - pegasusFragranceProfileLastProgress) > 0.0008) {
                        pegasusFragranceProfileLastProgress = progress;

                        pegasusFragranceProfile.classList.add('parallax-active');

                        // Ultra-gentle easing with multiple curves for silk-smooth motion
                        const easeOutQuint = 1 - Math.pow(1 - progress, 5); // Even gentler than cubic
                        const easeInOutSine = -(Math.cos(Math.PI * progress) - 1) / 2; // Sine wave smoothness
                        const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress); // Exponential ease
                        const combinedEase = (easeOutQuint * 0.5) + (easeInOutSine * 0.3) + (easeOutExpo * 0.2); // Triple blend for ultimate smoothness

                        // Apply ultra-gentle parallax transformations
                        const translateX = 60 - (combinedEase * 60); // Reduced movement for silk-smooth effect
                        const scale = 0.9 + (combinedEase * 0.1); // Minimal scale change for subtlety
                        const opacity = combinedEase;

                        // Use transform3d for hardware acceleration and smoother rendering
                        requestAnimationFrame(() => {
                            pegasusFragranceProfile.style.setProperty('transform', `translate3d(${translateX}px, 0, 0) scale(${scale})`, 'important');
                            pegasusFragranceProfile.style.setProperty('opacity', opacity, 'important');
                            pegasusFragranceProfile.style.setProperty('transition', 'none', 'important');
                            pegasusFragranceProfile.style.setProperty('will-change', 'transform, opacity', 'important');
                        });
                    }
                } else if (scrollTop > endPoint) {
                    // Fully visible state with smooth transition
                    if (pegasusFragranceProfileLastProgress !== 1) {
                        pegasusFragranceProfileLastProgress = 1;
                        pegasusFragranceProfile.classList.add('parallax-active');
                        requestAnimationFrame(() => {
                            pegasusFragranceProfile.style.setProperty('transform', 'translate3d(0px, 0, 0) scale(1)', 'important');
                            pegasusFragranceProfile.style.setProperty('opacity', '1', 'important');
                            pegasusFragranceProfile.style.setProperty('transition', 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.4s ease-out', 'important');
                        });
                    }
                } else {
                    // Hidden state with smooth transition
                    if (pegasusFragranceProfileLastProgress !== 0) {
                        pegasusFragranceProfileLastProgress = 0;
                        pegasusFragranceProfile.classList.remove('parallax-active');
                        requestAnimationFrame(() => {
                            pegasusFragranceProfile.style.setProperty('transform', 'translate3d(60px, 0, 0) scale(0.9)', 'important');
                            pegasusFragranceProfile.style.setProperty('opacity', '0', 'important');
                            pegasusFragranceProfile.style.setProperty('transition', 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.4s ease-out', 'important');
                        });
                    }
                }
            }
        }
    }

    // Pegasus Fragrance Notes Parallax Effect (matching Layton Fragrance Notes style)
    if (pegasusFragranceNotes) {
        let pegasusFragranceNotesLastProgress = -1;

        function updatePegasusFragranceNotesParallax() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const pegasusSection = pegasusFragranceNotes.closest('.content');

            if (pegasusSection) {
                // Start parallax effect last in sequence (most delayed, ultra-smooth)
                const triggerPoint = pegasusSection.offsetTop - 250; // Start earlier\n                const parallaxRange = 600; // Shorter range for quicker completion
                const endPoint = triggerPoint + parallaxRange;

                if (scrollTop >= triggerPoint && scrollTop <= endPoint) {
                    // Calculate progress (0 to 1) over the parallax range
                    const rawProgress = (scrollTop - triggerPoint) / parallaxRange;
                    const progress = Math.max(0, Math.min(rawProgress, 1));

                    // Ultra-high frame rate - update on every tiny change for buttery smoothness
                    if (Math.abs(progress - pegasusFragranceNotesLastProgress) > 0.0008) {
                        pegasusFragranceNotesLastProgress = progress;

                        pegasusFragranceNotes.classList.add('parallax-active');

                        // Ultra-gentle easing with multiple curves for silk-smooth motion
                        const easeOutQuint = 1 - Math.pow(1 - progress, 5); // Even gentler than cubic
                        const easeInOutSine = -(Math.cos(Math.PI * progress) - 1) / 2; // Sine wave smoothness
                        const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress); // Exponential ease
                        const combinedEase = (easeOutQuint * 0.5) + (easeInOutSine * 0.3) + (easeOutExpo * 0.2); // Triple blend for ultimate smoothness

                        // Apply ultra-gentle parallax transformations
                        const translateX = 80 - (combinedEase * 80); // Reduced movement for silk-smooth effect
                        const scale = 0.92 + (combinedEase * 0.08); // Minimal scale change for subtlety
                        const opacity = combinedEase;

                        // Use transform3d for hardware acceleration and smoother rendering
                        requestAnimationFrame(() => {
                            pegasusFragranceNotes.style.setProperty('transform', `translate3d(${translateX}px, 0, 0) scale(${scale})`, 'important');
                            pegasusFragranceNotes.style.setProperty('opacity', opacity, 'important');
                            pegasusFragranceNotes.style.setProperty('transition', 'none', 'important');
                            pegasusFragranceNotes.style.setProperty('will-change', 'transform, opacity', 'important');
                        });
                    }
                } else if (scrollTop > endPoint) {
                    // Fully visible state with smooth transition
                    if (pegasusFragranceNotesLastProgress !== 1) {
                        pegasusFragranceNotesLastProgress = 1;
                        pegasusFragranceNotes.classList.add('parallax-active');
                        requestAnimationFrame(() => {
                            pegasusFragranceNotes.style.setProperty('transform', 'translate3d(0px, 0, 0) scale(1)', 'important');
                            pegasusFragranceNotes.style.setProperty('opacity', '1', 'important');
                            pegasusFragranceNotes.style.setProperty('transition', 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.4s ease-out', 'important');
                        });
                    }
                } else {
                    // Hidden state with smooth transition
                    if (pegasusFragranceNotesLastProgress !== 0) {
                        pegasusFragranceNotesLastProgress = 0;
                        pegasusFragranceNotes.classList.remove('parallax-active');
                        requestAnimationFrame(() => {
                            pegasusFragranceNotes.style.setProperty('transform', 'translate3d(80px, 0, 0) scale(0.92)', 'important');
                            pegasusFragranceNotes.style.setProperty('opacity', '0', 'important');
                            pegasusFragranceNotes.style.setProperty('transition', 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.4s ease-out', 'important');
                        });
                    }
                }
            }
        }
    }

    // Pegasus Rating Parallax Effect
    if (pegasusPerfumeRating) {
        function updatePegasusPerfumeRatingParallax() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const pegasusSection = pegasusPerfumeRating.closest('.content');

            if (pegasusSection) {
                const sectionTop = pegasusSection.offsetTop;
                const sectionHeight = pegasusSection.offsetHeight;
                const windowHeight = window.innerHeight;

                if (scrollTop + windowHeight > sectionTop && scrollTop < sectionTop + sectionHeight) {
                    pegasusPerfumeRating.classList.add('parallax-active');
                }
            }
        }
    }

    // Update the main scroll handler to include Pegasus parallax functions
    if (pegasusImage || pegasusFragranceProfile || pegasusFragranceNotes || pegasusPerfumeRating) {
        // Add Pegasus parallax update to scroll handler
        const originalOnScrollWithPegasus = onScroll;
        onScroll = function() {
            if (!ticking) {
                requestAnimationFrame(() => {
                    updateColors();
                    if (backToTopBtn && progressRing) {
                        updateBackToTop();
                    }
                    if (floatingSearch) {
                        updateFloatingElements();
                    }
                    updateSocialLinks();
                    if (brandImage) {
                        updateBrandImageParallax();
                    }
                    updateLaytonParallax();
                    if (laytonNotes) {
                        updateLaytonNotesParallax();
                    }
                    if (productTitle) {
                        updateProductTitleParallax();
                    }
                    if (fragranceNotes) {
                        updateFragranceNotesParallax();
                    }
                    if (perfumeRating) {
                        updatePerfumeRatingParallax();
                    }
                    // Pegasus parallax functions
                    if (pegasusImage) {
                        updatePegasusImageParallax();
                    }
                    if (pegasusProductTitle) {
                        updatePegasusProductTitleParallax();
                    }
                    if (pegasusFragranceProfile) {
                        updatePegasusFragranceProfileParallax();
                    }
                    if (pegasusFragranceNotes) {
                        updatePegasusFragranceNotesParallax();
                    }
                    if (pegasusPerfumeRating) {
                        updatePegasusPerfumeRatingParallax();
                    }
                });
                ticking = true;
            }
        };

        // Update scroll event listener
        window.removeEventListener('scroll', originalOnScrollWithPegasus);
        window.addEventListener('scroll', onScroll, { passive: true });

        // Initial Pegasus parallax calls
        if (pegasusImage) {
            updatePegasusImageParallax();
        }
        if (pegasusProductTitle) {
            updatePegasusProductTitleParallax();
        }
        if (pegasusFragranceProfile) {
            updatePegasusFragranceProfileParallax();
        }
        if (pegasusFragranceNotes) {
            updatePegasusFragranceNotesParallax();
        }
        if (pegasusPerfumeRating) {
            updatePegasusPerfumeRatingParallax();
        }
    }

    // Initialize Authentication System
    initializeAuth();

    // Initialize User Modals
    initializeUserModals();

    // Initialize Admin Dashboard
    initializeAdminDashboard();

    // Initialize Email Verification
    initializeEmailVerification();

    // Ensure modals are hidden on page load
    ensureModalsHidden();

    // Additional safety check after a short delay
    setTimeout(() => {
        ensureModalsHidden();
        console.log('ðŸ”’ Final modal safety check completed');
    }, 500);

    // Make refresh function globally available for debugging
    window.refreshUserSession = refreshUserSession;

    // Force show admin dashboard function
    window.forceShowAdminDashboard = function() {
        const adminDashboard = document.getElementById('adminDashboard');
        if (adminDashboard) {
            adminDashboard.style.display = 'block';
            console.log('Admin dashboard forced to show');
        } else {
            console.log('Admin dashboard element not found');
        }
    };

    // Global function to open admin dashboard
    window.openAdminDashboard = openAdminDashboard;

    // Email verification functions
    function initializeEmailVerification() {
        const verificationModal = document.getElementById('verificationModal');
        const verificationModalClose = document.getElementById('verificationModalClose');
        const verificationModalOverlay = document.getElementById('verificationModalOverlay');
        const verificationForm = document.getElementById('verificationForm');
        const verifyEmailBtn = document.getElementById('verifyEmailBtn');
        const resendCodeBtn = document.getElementById('resendCodeBtn');
        const verificationError = document.getElementById('verificationError');

        // Close verification modal function
        function closeVerificationModal() {
            // Use setProperty with important flag to override CSS
            verificationModal.style.setProperty('display', 'none', 'important');
            verificationModal.style.setProperty('position', 'static', 'important');
            verificationModal.style.setProperty('top', 'auto', 'important');
            verificationModal.style.setProperty('left', 'auto', 'important');
            verificationModal.style.setProperty('width', 'auto', 'important');
            verificationModal.style.setProperty('height', 'auto', 'important');
            verificationModal.style.setProperty('z-index', 'auto', 'important');
            verificationModal.style.setProperty('align-items', 'normal', 'important');
            verificationModal.style.setProperty('justify-content', 'normal', 'important');
            verificationModal.style.setProperty('background', 'transparent', 'important');
            verificationModal.style.setProperty('backdrop-filter', 'none', 'important');

            verificationModal.classList.remove('show');
            document.body.style.overflow = 'auto';

            // Clear pending verification
            delete window.pendingVerification;
            console.log('âœ… Verification modal closed');
        }

        // Make close function globally available for emergency use
        window.closeVerificationModal = closeVerificationModal;

        // Close verification modal
        [verificationModalClose, verificationModalOverlay].forEach(element => {
            element?.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                closeVerificationModal();
            });
        });

        // Add ESC key to close modal
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && (verificationModal.classList.contains('show') || verificationModal.style.display === 'flex')) {
                e.preventDefault();
                closeVerificationModal();
            }
        });

        // Add emergency close on any click outside modal content
        verificationModal?.addEventListener('click', function(e) {
            if (e.target === verificationModal || e.target === verificationModalOverlay) {
                closeVerificationModal();
            }
        });

        // Handle verification form submission
        verificationForm?.addEventListener('submit', async (e) => {
            e.preventDefault();
            await handleEmailVerification();
        });

        // Handle resend code
        resendCodeBtn?.addEventListener('click', async () => {
            await handleResendCode();
        });

        // Auto-format verification code input with proper cleanup
        const verificationCodeInput = document.getElementById('verificationCode');
        if (verificationCodeInput) {
            // ðŸ”§ FIX: Remove existing event listener to prevent memory leaks
            const existingHandler = verificationCodeInput._inputHandler;
            if (existingHandler) {
                verificationCodeInput.removeEventListener('input', existingHandler);
            }

            // Create new handler and store reference for cleanup
            const inputHandler = (e) => {
                // Only allow numbers
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
            };

            verificationCodeInput._inputHandler = inputHandler;
            verificationCodeInput.addEventListener('input', inputHandler);
        }
    }

    // Show verification modal
    function showVerificationModal(userId, email) {
        const verificationModal = document.getElementById('verificationModal');

        // Apply high-priority styling to ensure modal appears centered
        verificationModal.style.position = 'fixed';
        verificationModal.style.top = '0';
        verificationModal.style.left = '0';
        verificationModal.style.width = '100vw';
        verificationModal.style.height = '100vh';
        verificationModal.style.zIndex = '99999';
        verificationModal.style.display = 'flex';
        verificationModal.style.alignItems = 'center';
        verificationModal.style.justifyContent = 'center';
        verificationModal.style.background = 'rgba(0, 0, 0, 0.9)';
        verificationModal.style.backdropFilter = 'blur(15px)';

        verificationModal.classList.add('show');
        document.body.style.overflow = 'hidden';

        // Store user data for verification
        window.pendingVerification = { userId, email };

        // Clear previous errors and inputs
        document.getElementById('verificationError').style.display = 'none';
        document.getElementById('verificationCode').value = '';

        // Focus on verification code input after modal appears
        setTimeout(() => {
            const verificationCode = document.getElementById('verificationCode');
            if (verificationCode) {
                verificationCode.focus();
            }
        }, 300);
    }

    // Handle email verification
    async function handleEmailVerification() {
        const verificationCode = document.getElementById('verificationCode').value;
        const verifyEmailBtn = document.getElementById('verifyEmailBtn');
        const verificationError = document.getElementById('verificationError');

        if (!verificationCode || verificationCode.length !== 6) {
            showVerificationError('Please enter a valid 6-digit code');
            return;
        }

        if (!window.pendingVerification) {
            showVerificationError('Verification session expired. Please try again.');
            return;
        }

        // Show loading state
        verifyEmailBtn.classList.add('loading');
        verifyEmailBtn.disabled = true;

        try {
            const response = await fetch('/api/auth/verify-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: window.pendingVerification.userId,
                    verificationCode: verificationCode
                }),
            });

            const data = await response.json();

            if (data.success) {
                // Store auth data
                const storage = document.getElementById('rememberMe')?.checked ? localStorage : sessionStorage;
                storage.setItem('authToken', data.token);
                storage.setItem('user', JSON.stringify(data.user));

                // Update UI
                updateUIForLoggedInUser(data.user);

                // Close modals
                document.getElementById('verificationModal').style.display = 'none';
                closeAuthModal();
                document.body.style.overflow = 'auto';

                // Clear pending verification
                delete window.pendingVerification;

                // Show success message
                showNotification('Email verified successfully! Welcome to Parfumerie Charme.', 'success');
            } else {
                showVerificationError(data.error || 'Verification failed');
            }
        } catch (error) {
            console.error('Verification error:', error);
            showVerificationError('Network error. Please try again.');
        } finally {
            // Remove loading state
            verifyEmailBtn.classList.remove('loading');
            verifyEmailBtn.disabled = false;
        }
    }

    // Handle resend verification code
    async function handleResendCode() {
        const resendCodeBtn = document.getElementById('resendCodeBtn');

        if (!window.pendingVerification) {
            showVerificationError('Verification session expired. Please try again.');
            return;
        }

        // Show loading state
        resendCodeBtn.classList.add('loading');
        resendCodeBtn.disabled = true;

        try {
            const response = await fetch('/api/auth/resend-verification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: window.pendingVerification.userId
                }),
            });

            const data = await response.json();

            if (data.success) {
                showNotification('Verification code sent successfully!', 'success');
                document.getElementById('verificationError').style.display = 'none';
            } else {
                showVerificationError(data.error || 'Failed to resend code');
            }
        } catch (error) {
            console.error('Resend error:', error);
            showVerificationError('Network error. Please try again.');
        } finally {
            // Remove loading state
            resendCodeBtn.classList.remove('loading');
            resendCodeBtn.disabled = false;
        }
    }

    // Show verification error
    function showVerificationError(message) {
        const verificationError = document.getElementById('verificationError');
        verificationError.textContent = message;
        verificationError.style.display = 'block';
    }

    // Make verification functions globally available
    window.showVerificationModal = showVerificationModal;

    // Function to ensure all modals are hidden on page load
    function ensureModalsHidden() {
        const modals = [
            'verificationModal',
            'banModal',
            'authModal',
            'adminModal',
            'profileModal',
            'favoritesModal',
            'settingsModal',
            'cartModal'
        ];

        modals.forEach(modalId => {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.style.setProperty('display', 'none', 'important');
                modal.style.setProperty('position', 'static', 'important');
                modal.style.setProperty('z-index', 'auto', 'important');
                modal.classList.remove('show');
            }
        });

        // Restore body scrolling
        document.body.style.overflow = 'auto';

        console.log('âœ… All modals hidden on page load');
    }

    // Make function globally available
    window.ensureModalsHidden = ensureModalsHidden;
});

// Authentication System
function initializeAuth() {
    const loginBtn = document.getElementById('loginBtn');
    const authModal = document.getElementById('authModal');
    const authClose = document.getElementById('authClose');
    const showSignup = document.getElementById('showSignup');
    const showLogin = document.getElementById('showLogin');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const emailLoginForm = document.getElementById('emailLoginForm');
    const emailSignupForm = document.getElementById('emailSignupForm');
    const logoutBtn = document.getElementById('logoutBtn');
    const userLoggedOut = document.getElementById('userLoggedOut');
    const userLoggedIn = document.getElementById('userLoggedIn');

    // Modal controls
    loginBtn?.addEventListener('click', () => {
        // Apply high-priority styling for smooth modal appearance
        authModal.style.setProperty('position', 'fixed', 'important');
        authModal.style.setProperty('z-index', '999999', 'important');
        authModal.style.setProperty('display', 'flex', 'important');
        authModal.style.setProperty('align-items', 'center', 'important');
        authModal.style.setProperty('justify-content', 'center', 'important');
        authModal.style.setProperty('top', '0', 'important');
        authModal.style.setProperty('left', '0', 'important');
        authModal.style.setProperty('width', '100vw', 'important');
        authModal.style.setProperty('height', '100vh', 'important');

        // Add show class for smooth animation
        setTimeout(() => authModal.classList.add('show'), 10);

        // Prevent background scrolling
        document.body.style.overflow = 'hidden';

        console.log('âœ… Auth modal opened smoothly in viewport');
    });

    authClose?.addEventListener('click', closeAuthModal);

    // Close modal when clicking outside
    authModal?.addEventListener('click', (e) => {
        if (e.target === authModal) {
            closeAuthModal();
        }
    });

    // Switch between login and signup
    showSignup?.addEventListener('click', (e) => {
        e.preventDefault();
        clearAllAuthErrors();
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
        document.getElementById('authTitle').textContent = 'Join Parfumerie Charme';
    });

    showLogin?.addEventListener('click', (e) => {
        e.preventDefault();
        clearAllAuthErrors();
        signupForm.style.display = 'none';
        loginForm.style.display = 'block';
        document.getElementById('authTitle').textContent = 'Welcome to Parfumerie Charme';
    });

    // Email form submissions
    emailLoginForm?.addEventListener('submit', handleEmailLogin);
    emailSignupForm?.addEventListener('submit', handleEmailSignup);

    // Logout
    logoutBtn?.addEventListener('click', handleLogout);

    // Clean up any stale user data first
    const wasCleanedUp = cleanupStaleUserData();

    // Check if user is already logged in (only if data wasn't cleaned up)
    if (!wasCleanedUp) {
        checkAuthState();
    } else {
        console.log('â­ï¸ Skipping auth state check due to data cleanup');
    }

    // Update notification manager auth status after checking auth state
    setTimeout(() => {
        if (window.notificationManager) {
            window.notificationManager.checkUserAuthStatus();
        }
    }, 100);

    // Periodically sync user data to ensure consistency
    setInterval(async () => {
        const authToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        if (authToken) {
            await syncUserData();
        }
    }, 300000); // Sync every 5 minutes

    function closeAuthModal() {
        // Remove show class first for smooth animation
        authModal.classList.remove('show');

        // Reset modal styling with high priority
        authModal.style.setProperty('display', 'none', 'important');
        authModal.style.setProperty('position', 'static', 'important');
        authModal.style.setProperty('z-index', 'auto', 'important');

        // Restore body scrolling
        document.body.style.overflow = 'auto';

        // Clear all errors
        clearAllAuthErrors();
        // Reset to login form
        signupForm.style.display = 'none';
        loginForm.style.display = 'block';
        document.getElementById('authTitle').textContent = 'Welcome to Parfumerie Charme';

        console.log('âœ… Auth modal closed smoothly');
    }

    async function handleEmailLogin(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        // Clear previous errors
        hideAuthError('loginError');

        // Validation
        if (!email || !password) {
            showAuthError('loginError', 'Please fill in all fields', 'error');
            return;
        }

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (data.success) {
                // Check for existing user profile data to preserve custom changes
                const existingUserData = localStorage.getItem(`userProfile_${data.user.email}`) ||
                                        sessionStorage.getItem(`userProfile_${data.user.email}`);

                let finalUserData = data.user;

                if (existingUserData) {
                    try {
                        const savedProfile = JSON.parse(existingUserData);
                        // Merge server data with saved profile data, prioritizing saved profile
                        finalUserData = {
                            ...data.user,           // Server data (email, isAdmin, etc.)
                            ...savedProfile,        // Saved profile data (name, phone, birthday)
                            email: data.user.email, // Always keep server email
                            isAdmin: data.user.isAdmin // Always keep server admin status
                        };
                        console.log('âœ… Merged existing profile data:', finalUserData);
                    } catch (error) {
                        console.log('âš ï¸ Could not parse existing profile data, using server data');
                    }
                }

                // Store token and user data safely (avoid QuotaExceededError)
                const storage = rememberMe ? localStorage : sessionStorage;
                storage.setItem('authToken', data.token);

                // Create safe user data without large base64 images
                const safeUserData = {
                    ...finalUserData,
                    avatar: finalUserData.avatar && finalUserData.avatar.startsWith('data:') ? 'default.jpg' : finalUserData.avatar
                };

                try {
                    storage.setItem('user', JSON.stringify(safeUserData));
                    console.log('âœ… User data stored safely');
                } catch (error) {
                    console.error('âŒ Error storing user data:', error);
                    // Fallback: store minimal data
                    const minimalUserData = {
                        email: finalUserData.email,
                        name: finalUserData.name,
                        isAdmin: finalUserData.isAdmin,
                        avatar: 'default.jpg'
                    };
                    storage.setItem('user', JSON.stringify(minimalUserData));
                    console.log('âœ… Stored minimal user data as fallback');
                }

                // Also save profile data separately (without large images)
                try {
                    storage.setItem(`userProfile_${finalUserData.email}`, JSON.stringify({
                        name: finalUserData.name,
                        phone: finalUserData.phone,
                        birthday: finalUserData.birthday,
                        avatar: finalUserData.avatar && finalUserData.avatar.startsWith('data:') ? 'default.jpg' : finalUserData.avatar
                    }));
                } catch (error) {
                    console.error('âŒ Error storing profile data:', error);
                }

                // Update UI
                await updateUIForLoggedInUser(finalUserData);
                closeAuthModal();
                showNotification(data.message, 'success');
            } else {
                if (data.requiresVerification) {
                    // Show verification modal for unverified users
                    showVerificationModal(data.userId, data.email);
                    showNotification('Please verify your email address to continue.', 'info');
                } else {
                    showAuthError('loginError', data.error || 'Login failed', 'error');
                }
            }
        } catch (error) {
            console.error('Login error:', error);
            if (error.message && error.message.includes('Too many')) {
                showAuthError('loginError', 'Too many attempts. Resetting rate limit...', 'warning');
                await resetRateLimit();
                showAuthError('loginError', 'Rate limit reset. Please try again.', 'success');
            } else {
                showAuthError('loginError', 'Network error. Please try again.', 'error');
            }
        }
    }

    async function handleEmailSignup(e) {
        e.preventDefault();
        const firstName = document.getElementById('signupFirstName').value;
        const lastName = document.getElementById('signupLastName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Clear previous errors
        hideAuthError('signupError');

        // Validation
        if (!firstName || !lastName || !email || !password) {
            showAuthError('signupError', 'Please fill in all fields', 'error');
            return;
        }

        if (password !== confirmPassword) {
            showAuthError('signupError', 'Passwords do not match', 'error');
            return;
        }

        if (password.length < 8) {
            showAuthError('signupError', 'Password must be at least 8 characters long', 'error');
            return;
        }

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email,
                    password
                })
            });

            const data = await response.json();

            if (data.success) {
                if (data.requiresVerification) {
                    // Show verification modal
                    showVerificationModal(data.userId, data.email);
                    showNotification(data.message, 'info');
                } else {
                    // Store token and user data (for admin users who don't need verification)
                    localStorage.setItem('authToken', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));

                    // Add user to statistics
                    if (window.userStatsManager) {
                        await window.userStatsManager.addNewUser(data.user.email);
                    }

                    // Update UI
                    updateUIForLoggedInUser(data.user);
                    closeAuthModal();
                    showNotification(data.message, 'success');
                }
            } else {
                showAuthError('signupError', data.error || 'Registration failed', 'error');
            }
        } catch (error) {
            console.error('Registration error:', error);
            showAuthError('signupError', 'Network error. Please try again.', 'error');
        }
    }

    function simulateLogin(email, rememberMe) {
        console.log('ðŸ”„ Simulating login for:', email);

        // Check for existing user profile data to preserve custom changes
        const existingUserData = localStorage.getItem(`userProfile_${email}`) ||
                                sessionStorage.getItem(`userProfile_${email}`);

        // Create base user data
        const defaultName = email.split('@')[0];
        let userData = {
            name: defaultName,
            email: email,
            avatar: generateDefaultAvatar(defaultName, email)
        };

        // Merge with existing profile data if available
        if (existingUserData) {
            try {
                const savedProfile = JSON.parse(existingUserData);
                userData = {
                    ...userData,        // Base data
                    ...savedProfile,    // Saved profile data (name, phone, birthday, etc.)
                    email: email        // Always keep the login email
                };
                console.log('âœ… Restored saved profile data:', savedProfile);
            } catch (error) {
                console.log('âš ï¸ Could not parse existing profile data, using defaults');
            }
        }

        // Set admin flag for specific email
        if (email === 'cherifmed1200@gmail.com') {
            userData.isAdmin = true;
            // Only set default name if no custom name exists
            if (!existingUserData || userData.name === 'cherifmed1200') {
                userData.name = 'MOH CHERIF';
            }
        }

        // Store user data safely (avoid QuotaExceededError)
        const storage = rememberMe ? localStorage : sessionStorage;

        // Create safe user data without large base64 images
        const safeUserData = {
            ...userData,
            avatar: userData.avatar && userData.avatar.startsWith('data:') ? 'default.jpg' : userData.avatar
        };

        try {
            storage.setItem('user', JSON.stringify(safeUserData));
            console.log('âœ… User data stored safely');
        } catch (error) {
            console.error('âŒ Error storing user data:', error);
            // Fallback: store minimal data
            const minimalUserData = {
                email: userData.email,
                name: userData.name,
                isAdmin: userData.isAdmin,
                avatar: 'default.jpg'
            };
            storage.setItem('user', JSON.stringify(minimalUserData));
            console.log('âœ… Stored minimal user data as fallback');
        }

        // Also save profile data separately (without large images)
        try {
            storage.setItem(`userProfile_${email}`, JSON.stringify({
                name: userData.name,
                phone: userData.phone,
                birthday: userData.birthday,
                avatar: userData.avatar && userData.avatar.startsWith('data:') ? 'default.jpg' : userData.avatar
            }));
        } catch (error) {
            console.error('âŒ Error storing profile data:', error);
        }

        updateUIForLoggedInUser(userData);
        closeAuthModal();
        showNotification('Welcome back! You have been signed in successfully.', 'success');

        console.log('âœ… Login simulation complete with data:', userData);
    }

// Complete Photo Upload and Editor System
class PhotoEditor {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.image = null;
        this.scale = 1;
        this.rotation = 0;
        this.flipped = false;
        this.shape = 'circle';
        this.isDragging = false;
        this.dragStart = { x: 0, y: 0 };
        this.imagePosition = { x: 0, y: 0 };
    }

    init() {
        this.canvas = document.getElementById('photoCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Size slider
        const sizeSlider = document.getElementById('sizeSlider');
        const sizeValue = document.getElementById('sizeValue');
        sizeSlider.addEventListener('input', (e) => {
            this.scale = e.target.value / 100;
            sizeValue.textContent = e.target.value + '%';
            this.redraw();
        });

        // Shape selector
        const shapeSelect = document.getElementById('shapeSelect');
        shapeSelect.addEventListener('change', (e) => {
            this.shape = e.target.value;
            this.redraw();
        });

        // Control buttons
        document.getElementById('rotateBtn').addEventListener('click', () => {
            this.rotation += 90;
            if (this.rotation >= 360) this.rotation = 0;
            this.redraw();
        });

        document.getElementById('flipBtn').addEventListener('click', () => {
            this.flipped = !this.flipped;
            this.redraw();
        });

        // Canvas drag functionality
        this.canvas.addEventListener('mousedown', this.startDrag.bind(this));
        this.canvas.addEventListener('mousemove', this.drag.bind(this));
        this.canvas.addEventListener('mouseup', this.endDrag.bind(this));
        this.canvas.addEventListener('mouseleave', this.endDrag.bind(this));

        // Modal controls
        document.getElementById('photoEditorClose').addEventListener('click', this.closeEditor.bind(this));
        document.getElementById('cancelPhotoEdit').addEventListener('click', this.closeEditor.bind(this));
        document.getElementById('savePhotoEdit').addEventListener('click', this.savePhoto.bind(this));
    }

    startDrag(e) {
        this.isDragging = true;
        const rect = this.canvas.getBoundingClientRect();
        this.dragStart = {
            x: e.clientX - rect.left - this.imagePosition.x,
            y: e.clientY - rect.top - this.imagePosition.y
        };
    }

    drag(e) {
        if (!this.isDragging) return;
        const rect = this.canvas.getBoundingClientRect();
        this.imagePosition = {
            x: e.clientX - rect.left - this.dragStart.x,
            y: e.clientY - rect.top - this.dragStart.y
        };
        this.redraw();
    }

    endDrag() {
        this.isDragging = false;
    }

    loadImage(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    this.image = img;
                    this.resetTransforms();
                    this.redraw();
                    resolve();
                };
                img.onerror = reject;
                img.src = e.target.result;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    resetTransforms() {
        this.scale = 1;
        this.rotation = 0;
        this.flipped = false;
        this.shape = 'circle';
        this.imagePosition = { x: 0, y: 0 };

        // Reset UI controls
        document.getElementById('sizeSlider').value = 100;
        document.getElementById('sizeValue').textContent = '100%';
        document.getElementById('shapeSelect').value = 'circle';
    }

    redraw() {
        if (!this.image) return;

        const canvasSize = 400;
        this.canvas.width = canvasSize;
        this.canvas.height = canvasSize;

        // Clear canvas
        this.ctx.clearRect(0, 0, canvasSize, canvasSize);

        // Save context
        this.ctx.save();

        // Apply shape clipping
        this.applyShapeClip(canvasSize);

        // Calculate image dimensions
        const size = Math.min(this.image.width, this.image.height) * this.scale;
        const x = canvasSize / 2 + this.imagePosition.x;
        const y = canvasSize / 2 + this.imagePosition.y;

        // Apply transformations
        this.ctx.translate(x, y);
        this.ctx.rotate((this.rotation * Math.PI) / 180);
        if (this.flipped) this.ctx.scale(-1, 1);

        // Draw image
        this.ctx.drawImage(
            this.image,
            -size / 2,
            -size / 2,
            size,
            size
        );

        // Restore context
        this.ctx.restore();
    }

    applyShapeClip(size) {
        this.ctx.beginPath();
        switch (this.shape) {
            case 'circle':
                this.ctx.arc(size / 2, size / 2, size / 2 - 10, 0, 2 * Math.PI);
                break;
            case 'square':
                this.ctx.rect(10, 10, size - 20, size - 20);
                break;
            case 'rounded':
                this.roundedRect(10, 10, size - 20, size - 20, 20);
                break;
        }
        this.ctx.clip();
    }

    roundedRect(x, y, width, height, radius) {
        this.ctx.beginPath();
        this.ctx.moveTo(x + radius, y);
        this.ctx.lineTo(x + width - radius, y);
        this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        this.ctx.lineTo(x + width, y + height - radius);
        this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        this.ctx.lineTo(x + radius, y + height);
        this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        this.ctx.lineTo(x, y + radius);
        this.ctx.quadraticCurveTo(x, y, x + radius, y);
        this.ctx.closePath();
    }

    async savePhoto() {
        if (!this.image) return;

        try {
            // Get the edited image as base64
            const imageData = this.canvas.toDataURL('image/jpeg', 0.9);

            // Close the editor
            this.closeEditor();

            // Save to database
            await saveUploadedPhoto(imageData);

        } catch (error) {
            console.error('Error saving photo:', error);
            showNotification('Failed to save photo. Please try again.', 'error');
        }
    }

    closeEditor() {
        const modal = document.getElementById('photoEditorModal');
        modal.style.display = 'none';

        // Reset everything
        this.image = null;
        this.resetTransforms();
        if (this.ctx) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    openEditor() {
        const modal = document.getElementById('photoEditorModal');
        modal.style.display = 'flex';
    }
}

// Global photo editor instance
const photoEditor = new PhotoEditor();

// Initialize photo editor when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    photoEditor.init();
});

function openPhotoUpload() {
    console.log('ðŸ“¸ Opening photo upload...');

    // Try both possible file input IDs
    const avatarFileInput = document.getElementById('avatarFileInput');
    const photoUploadInput = document.getElementById('photoUploadInput');

    const fileInput = avatarFileInput || photoUploadInput;

    if (!fileInput) {
        console.error('âŒ Photo upload input not found! Checked avatarFileInput and photoUploadInput');
        return;
    }

    console.log('âœ… Found file input:', fileInput.id);
    // Trigger file selection dialog
    fileInput.click();
}

async function saveUploadedPhoto(imageUrl) {
    console.log('ðŸ’¾ Saving uploaded photo to database:', imageUrl.substring(0, 50) + '...');

    try {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        if (!token) {
            console.error('âŒ No authentication token found');
            hideUploadProgress();
            showNotification('Please log in to update your profile photo', 'error');
            return;
        }

        // ðŸ”’ COMPREHENSIVE AUTH PROTECTION: Multi-level authentication persistence
        const currentUser = getCurrentUser();
        if (currentUser) {
            console.log('ðŸ”’ Implementing comprehensive auth protection during upload...');
            try {
                // Create safe user data without large avatar
                const safeUserData = {
                    ...currentUser,
                    avatar: currentUser.avatar && currentUser.avatar.startsWith('data:') ? 'custom_avatar_uploaded' : currentUser.avatar,
                    uploadInProgress: true, // Flag to indicate upload is happening
                    lastActivity: Date.now() // Timestamp for session validation
                };

                // Save to BOTH localStorage AND sessionStorage for maximum persistence
                localStorage.setItem('user', JSON.stringify(safeUserData));
                localStorage.setItem('authToken', token);
                localStorage.setItem('uploadProtection', 'true');

                sessionStorage.setItem('user', JSON.stringify(safeUserData));
                sessionStorage.setItem('authToken', token);
                sessionStorage.setItem('uploadProtection', 'true');

                // Also update auth state manager if available
                if (window.authStateManager) {
                    window.authStateManager.updateUser(safeUserData);
                }

                console.log('âœ… Multi-level auth protection activated - refresh is now safe');
            } catch (error) {
                console.error('âŒ Failed to implement auth protection:', error);
                // Continue anyway - upload might still work
            }
        }

        // Show enhanced loading state with progress
        showUploadProgress('Uploading to server...', 70);

        // Send to server
        const response = await fetch('/api/user/upload-avatar', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                avatarData: imageUrl
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            hideUploadProgress();
            throw new Error(errorData.error || 'Failed to upload avatar');
        }

        const data = await response.json();
        console.log('âœ… Avatar uploaded to database successfully');

        // Update progress
        showUploadProgress('Updating profile...', 85);

        // DON'T store large base64 images in localStorage - causes QuotaExceededError
        // Instead, refresh user data from server to get the updated avatar
        console.log('ðŸ”„ Skipping localStorage update to avoid quota exceeded error');
        console.log('ðŸ”„ Refreshing user data from server...');

        // Actually refresh user data from server
        try {
            const userResponse = await fetch('/api/user/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (userResponse.ok) {
                const updatedUserData = await userResponse.json();
                console.log('âœ… Got updated user data from server:', updatedUserData);

                // SAFE STORAGE: Never store large base64 images to prevent logout on refresh
                const storage = localStorage.getItem('authToken') ? localStorage : sessionStorage;

                console.log('ðŸ”’ Using safe storage approach to prevent logout on refresh');
                console.log('ðŸ“Š Server user data structure:', updatedUserData.user);

                // Extract user data from server response
                const serverUser = updatedUserData.user || updatedUserData;

                // Create safe user data with CONSISTENT structure to prevent validation failures
                const safeUserData = {
                    id: serverUser.id,
                    first_name: serverUser.first_name || '',
                    last_name: serverUser.last_name || '',
                    name: serverUser.name || `${serverUser.first_name || ''} ${serverUser.last_name || ''}`.trim(),
                    email: serverUser.email,
                    phone: serverUser.phone || '',
                    birthday: serverUser.birthday || '',
                    // CRITICAL: Use consistent property names to prevent validation failures
                    isAdmin: serverUser.is_admin || serverUser.isAdmin || false,
                    email_verified: serverUser.email_verified || false,
                    is_banned: serverUser.is_banned || false,
                    // SAFE AVATAR: Never store large base64 to prevent quota exceeded
                    avatar: 'custom_avatar_uploaded', // Placeholder indicating custom avatar exists
                    hasCustomAvatar: true, // Flag for UI to fetch from server
                    created_at: serverUser.created_at,
                    updated_at: serverUser.updated_at
                };

                console.log('ðŸ’¾ Safe user data structure:', safeUserData);

                try {
                    storage.setItem('user', JSON.stringify(safeUserData));
                    console.log('âœ… Updated user data in storage safely (prevents logout on refresh)');
                    console.log('ðŸ”„ Custom avatar will be fetched fresh from server');
                } catch (error) {
                    console.error('âŒ Safe storage failed:', error);
                    // Continue without storage update to prevent logout
                }

                // Trigger real-time update for reviews and replies
                if (window.reviewsManager) {
                    console.log('ðŸ”„ Triggering real-time avatar update in reviews and replies...');
                    await window.reviewsManager.updateUserProfileInDatabase(updatedUserData.name, updatedUserData.avatar);
                    await window.reviewsManager.loadAllReviews();
                    console.log('âœ… Reviews and replies updated with new avatar');
                }

                // ðŸ”§ NEW: Trigger comment section refresh for immediate UI updates
                console.log('ðŸ”„ Refreshing comment sections for immediate updates...');
                await refreshAllCommentSections();
                console.log('âœ… Comment sections refreshed with new profile');
            } else {
                console.error('âŒ Failed to refresh user data from server');
            }
        } catch (error) {
            console.error('âŒ Error refreshing user data:', error);
        }

        // Update UI immediately - FORCE refresh both avatars
        const userAvatar = document.getElementById('userAvatar');
        const profileAvatarLarge = document.getElementById('profileAvatarLarge');

        if (userAvatar) {
            userAvatar.src = imageUrl + '?t=' + Date.now(); // Force refresh with timestamp
            console.log('âœ… Updated main navigation avatar in UI');
        } else {
            console.error('âŒ userAvatar element not found!');
        }

        if (profileAvatarLarge) {
            profileAvatarLarge.src = imageUrl + '?t=' + Date.now(); // Force refresh with timestamp
            console.log('âœ… Updated profile modal avatar in UI');
        } else {
            console.error('âŒ profileAvatarLarge element not found!');
        }

        // Also update any other avatar elements that might exist
        const allAvatars = document.querySelectorAll('img[src*="default.jpg"], img[src*="data:image"]');
        allAvatars.forEach((avatar, index) => {
            if (avatar.id === 'userAvatar' || avatar.id === 'profileAvatarLarge') {
                avatar.src = imageUrl + '?t=' + Date.now();
                console.log(`âœ… Updated additional avatar ${index + 1}`);
            }
        });

        // ðŸš€ REAL-TIME UPDATE: Update all existing reviews with new avatar
        console.log('ðŸš€ STARTING REAL-TIME AVATAR UPDATE...');
        const userForReviews = getCurrentUser();
        if (window.reviewsManager && userForReviews) {
            console.log('ðŸ”„ Updating avatar in all reviews...');
            const success = await window.reviewsManager.updateUserProfileInDatabase(userForReviews.name, imageUrl);
            if (success) {
                console.log('âœ… Avatar updated in database - refreshing UI...');
                // Force refresh all reviews from database to show changes immediately
                await window.reviewsManager.loadAllReviews();
                // Also refresh review forms to show updated avatar
                window.reviewsManager.refreshReviewForms();
                console.log('ðŸŽ‰ REAL-TIME AVATAR UPDATE COMPLETE! All reviews should now show new avatar.');
            }
        }

        // ðŸ”“ CLEANUP: Remove upload protection flags after successful completion
        try {
            localStorage.removeItem('uploadProtection');
            sessionStorage.removeItem('uploadProtection');

            // Update user data to remove upload flag
            const finalUser = getCurrentUser();
            if (finalUser) {
                delete finalUser.uploadInProgress;
                const storage = getStorageMethod();
                storage.setItem('user', JSON.stringify(finalUser));
                console.log('âœ… Upload protection flags cleaned up');
            }
        } catch (error) {
            console.error('âŒ Failed to cleanup upload protection:', error);
        }

        // ðŸš€ ENHANCED: Comprehensive comment section refresh after avatar upload
        console.log('ðŸ”„ Starting comprehensive comment section refresh after avatar upload...');
        try {
            await refreshAllCommentSections();
            console.log('âœ… Comment sections refreshed successfully after avatar upload');
        } catch (error) {
            console.error('âŒ Error refreshing comment sections after avatar upload:', error);
        }

        // Complete progress and show success
        showUploadProgress('Complete!', 100);
        setTimeout(() => {
            hideUploadProgress();
            showNotification('Profile photo updated successfully! All comments updated.', 'success');
        }, 500);

        console.log('âœ… Photo saved to database and UI updated with comprehensive refresh');

        // Don't refresh from server to preserve local profile changes (like custom name)
        console.log('â­ï¸ Skipping server refresh to preserve local profile data');

    } catch (error) {
        console.error('Error saving photo:', error);
        hideUploadProgress();
        showNotification(`Failed to update profile photo: ${error.message}`, 'error');
    }
}

function handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (!file) {
        console.log('âŒ No file selected');
        return;
    }

    console.log('ðŸ“¸ PHOTO UPLOAD TRIGGERED! File:', file.name, 'Size:', file.size);

    // Validate file type
    if (!file.type.startsWith('image/')) {
        console.error('âŒ Invalid file type:', file.type);
        showNotification('Please select a valid image file', 'error');
        return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
        console.error('âŒ File too large:', file.size);
        showNotification('Image size must be less than 10MB', 'error');
        return;
    }

    console.log('âœ… File validation passed, reading file...');

    // Show enhanced loading state with progress
    showUploadProgress('Reading image...', 10);

    // Read file as data URL
    const reader = new FileReader();

    // Add progress tracking for file reading
    reader.onprogress = function(e) {
        if (e.lengthComputable) {
            const percentLoaded = Math.round((e.loaded / e.total) * 40) + 10; // 10-50%
            showUploadProgress('Reading image...', percentLoaded);
        }
    };

    reader.onload = function(e) {
        const imageUrl = e.target.result;
        console.log('âœ… File read successfully, data length:', imageUrl.length);

        // Update progress
        showUploadProgress('Processing image...', 60);

        // Open photo editor instead of directly saving
        console.log('ðŸŽ¨ Opening photo editor...');

        // Small delay to show progress
        setTimeout(() => {
            hideUploadProgress();
            openPhotoEditor(imageUrl);
        }, 500);
    };

    reader.onerror = function(error) {
        console.error('âŒ Error reading image file:', error);
        hideUploadProgress();
        showNotification('Error reading image file', 'error');
    };

    reader.readAsDataURL(file);
}

// Function to generate a nice default avatar based on user's name
function generateDefaultAvatar(name, email) {
    // Always return default.jpg for all users
    return 'default.jpg';
}

// Upload progress functions
function showUploadProgress(message, percentage) {
    console.log(`ðŸ“Š Upload Progress: ${message} (${percentage}%)`);

    // Create or update progress notification
    let progressElement = document.getElementById('uploadProgress');
    if (!progressElement) {
        progressElement = document.createElement('div');
        progressElement.id = 'uploadProgress';
        progressElement.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            z-index: 10000;
            min-width: 250px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            transition: all 0.3s ease;
        `;
        document.body.appendChild(progressElement);
    }

    progressElement.innerHTML = `
        <div style="display: flex; align-items: center; margin-bottom: 8px;">
            <div style="margin-right: 10px;">ðŸ“¤</div>
            <div style="font-weight: 600;">${message}</div>
        </div>
        <div style="background: rgba(255,255,255,0.2); height: 6px; border-radius: 3px; overflow: hidden;">
            <div style="background: #4CAF50; height: 100%; width: ${percentage}%; transition: width 0.3s ease; border-radius: 3px;"></div>
        </div>
        <div style="text-align: right; font-size: 12px; margin-top: 5px; opacity: 0.9;">${percentage}%</div>
    `;
}

function hideUploadProgress() {
    const progressElement = document.getElementById('uploadProgress');
    if (progressElement) {
        progressElement.style.opacity = '0';
        progressElement.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (progressElement.parentNode) {
                progressElement.parentNode.removeChild(progressElement);
            }
        }, 300);
    }
}

// Make photo upload functions globally accessible
window.openPhotoUpload = openPhotoUpload;
window.handlePhotoUpload = handlePhotoUpload;
window.generateDefaultAvatar = generateDefaultAvatar;
window.showUploadProgress = showUploadProgress;
window.hideUploadProgress = hideUploadProgress;

// Add event listener for photo upload inputs
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for all elements to be ready
    setTimeout(() => {
        const photoUploadInput = document.getElementById('photoUploadInput');
        const avatarFileInput = document.getElementById('avatarFileInput');

        console.log('ðŸ” Setting up photo upload event listeners...');
        console.log('  photoUploadInput:', photoUploadInput);
        console.log('  avatarFileInput:', avatarFileInput);

        if (photoUploadInput) {
            photoUploadInput.addEventListener('change', handlePhotoUpload);
            console.log('âœ… Added event listener to photoUploadInput');
        }

        if (avatarFileInput) {
            avatarFileInput.addEventListener('change', handlePhotoUpload);
            console.log('âœ… Added event listener to avatarFileInput');
        }

        if (!photoUploadInput && !avatarFileInput) {
            console.error('âŒ No photo upload inputs found!');
        }
    }, 1000); // Wait 1 second for DOM to be fully ready
});

    async function simulateSignup(firstName, lastName, email) {
        // Simulate successful signup
        const fullName = `${firstName} ${lastName}`;
        const userData = {
            name: fullName,
            email: email,
            avatar: generateDefaultAvatar(fullName, email)
        };

        // Store user data
        sessionStorage.setItem('user', JSON.stringify(userData));

        // Add user to statistics
        if (window.userStatsManager) {
            await window.userStatsManager.addNewUser(email);
        }

        await updateUIForLoggedInUser(userData);
        closeAuthModal();
        showNotification('Account created successfully! Welcome to Parfumerie Charme.', 'success');
    }

    async function checkAuthState() {
        console.log('ðŸ” Checking authentication state...');

        // ðŸ”’ CHECK UPLOAD PROTECTION: Handle refresh during upload
        const uploadProtection = localStorage.getItem('uploadProtection') || sessionStorage.getItem('uploadProtection');
        if (uploadProtection === 'true') {
            console.log('ðŸ”’ Upload protection detected - ensuring authentication persistence...');

            // Ensure both localStorage and sessionStorage have auth data
            const localUser = localStorage.getItem('user');
            const sessionUser = sessionStorage.getItem('user');
            const localToken = localStorage.getItem('authToken');
            const sessionToken = sessionStorage.getItem('authToken');

            // If one storage method has data but the other doesn't, sync them
            if (localUser && !sessionUser) {
                sessionStorage.setItem('user', localUser);
                if (localToken) sessionStorage.setItem('authToken', localToken);
                console.log('âœ… Synced auth data to sessionStorage');
            } else if (sessionUser && !localUser) {
                localStorage.setItem('user', sessionUser);
                if (sessionToken) localStorage.setItem('authToken', sessionToken);
                console.log('âœ… Synced auth data to localStorage');
            }
        }

        // Initialize the auth state manager
        await window.authStateManager.initialize();

        // Check if user is logged in
        if (window.authStateManager.isLoggedIn()) {
            const user = window.authStateManager.getCurrentUser();
            console.log('âœ… User authenticated:', user.email);

            // Clean up upload protection if it exists and upload is complete
            if (uploadProtection === 'true' && user && !user.uploadInProgress) {
                console.log('ðŸ”“ Cleaning up completed upload protection...');
                localStorage.removeItem('uploadProtection');
                sessionStorage.removeItem('uploadProtection');
            }

            // Handle admin user special case
            if (user.email === 'cherifmed1200@gmail.com') {
                console.log('Admin email detected, ensuring admin privileges...');

                // Ensure admin flag is set
                if (!user.isAdmin) {
                    user.isAdmin = true;
                    await window.authStateManager.updateUser(user);
                    console.log('âœ… Admin privileges ensured');
                }
            }

            // Update UI now that DOM is ready and function is available
            if (typeof window.updateUIForLoggedInUser === 'function') {
                await window.updateUIForLoggedInUser(user);
                console.log('âœ… UI updated after DOM ready');
            }

            // Update existing reviews with current profile data
            if (window.reviewsManager) {
                setTimeout(() => {
                    window.reviewsManager.forceUpdateCurrentUserReviews();
                }, 1000); // Wait for UI to fully load
            }

            console.log('âœ… Authentication state verified and UI updated');
        } else {
            console.log('ðŸ‘¤ No valid authentication found');
        }
    }



    // Make updateUIForLoggedInUser globally accessible
    window.updateUIForLoggedInUser = async function(userData) {
        userLoggedOut.style.display = 'none';
        userLoggedIn.style.display = 'block';

        // Update avatar and name with proper fallbacks and error handling
        const userAvatar = document.getElementById('userAvatar');
        const userName = document.getElementById('userName');

        if (userAvatar) {
            // Get avatar from server data, not localStorage
            await setUserAvatarFromServer(userAvatar, 'navigation');

            // After we have the src, wrap it with level container (avoid duplicate wrap)
            try {
                const alreadyWrapped = userAvatar.parentElement && userAvatar.parentElement.classList.contains('avatar-level-container');
                if (!alreadyWrapped) {
                    // Fetch level data from server (ensures fresh values)
                    let level = 1;
                    let levelProgress = 0;
                    try {
                        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
                        if (token) {
                            const profRes = await fetch('/api/user/profile', { headers: { 'Authorization': `Bearer ${token}` } });
                            if (profRes.ok) {
                                const prof = await profRes.json();
                                level = prof?.user?.level ?? 1;
                                levelProgress = prof?.user?.levelProgress ?? 0;
                                // Initialize LevelState for real-time updates
                                LevelState.userId = prof?.user?.id ?? userData.id ?? userData.userId ?? null;
                                LevelState.level = level;
                                LevelState.currentXP = prof?.user?.currentXP ?? 0;
                                LevelState.requiredXP = prof?.user?.requiredXP ?? 100;
                                LevelState.totalXP = prof?.user?.experience ?? 0;
                            }
                        }
                    } catch (e) {
                        console.warn('âš ï¸ Unable to fetch level data for navbar, using defaults');
                    }

                    const src = userAvatar.getAttribute('src') || 'default.jpg';
                    const container = createAvatarWithLevel(src, level, levelProgress);
                    // Ensure the inner <img> keeps the same id for the rest of the code
                    const innerImg = container.querySelector('img.user-avatar');
                    if (innerImg) innerImg.id = 'userAvatar';
                    userAvatar.parentElement.replaceChild(container, userAvatar);
                }
            } catch (e) {
                console.error('âŒ Failed to apply level UI to navbar avatar:', e);
            }

            // ðŸ‘‘ ADMIN ENHANCEMENT: Add special styling to navigation avatar for admin users
            const isAdmin = userData.is_admin || userData.isAdmin;
            // After replacement, resolve the current avatar img
            const resolvedAvatarImg = document.getElementById('userAvatar');
            const avatarContainer = resolvedAvatarImg ? resolvedAvatarImg.parentElement : userAvatar.parentElement;

            if (isAdmin) {
                console.log('ðŸ‘‘ Adding admin styling to navigation avatar');

                if (avatarContainer) {
                    avatarContainer.classList.add('admin-avatar-container');
                }
                if (resolvedAvatarImg) resolvedAvatarImg.classList.add('admin-avatar');

                // Create admin crown indicator if it doesn't exist
                let crownIndicator = avatarContainer?.querySelector('.admin-crown-indicator');
                if (!crownIndicator && avatarContainer) {
                    crownIndicator = document.createElement('div');
                    crownIndicator.className = 'admin-crown-indicator';
                    crownIndicator.innerHTML = 'ðŸ‘‘';
                    crownIndicator.title = 'Administrator';
                    avatarContainer.appendChild(crownIndicator);
                }
            } else {
                if (avatarContainer) {
                    avatarContainer.classList.remove('admin-avatar-container');
                    const crownIndicator = avatarContainer.querySelector('.admin-crown-indicator');
                    if (crownIndicator) crownIndicator.remove();
                }
                if (resolvedAvatarImg) resolvedAvatarImg.classList.remove('admin-avatar');
            }
        }

        if (userName) {
            userName.textContent = userData.name || 'User';
        }

        // Update any profile forms with current data
        updateProfileFormData(userData);

        // Check if user is the specific admin and apply styling
        const isSpecificAdmin = userData.email === 'cherifmed1200@gmail.com';
        checkAndApplyAdminStyling(userData.email);

        // Show admin dashboard if user is admin
        const adminDashboard = document.getElementById('adminDashboard');
        console.log('User data:', userData); // Debug log
        console.log('Is admin:', userData.isAdmin); // Debug log
        console.log('Is specific admin (cherifmed1200@gmail.com):', isSpecificAdmin); // Debug log
        console.log('Admin dashboard element:', adminDashboard); // Debug log

        if ((userData.isAdmin || isSpecificAdmin) && adminDashboard) {
            adminDashboard.style.display = 'block';
            console.log('ðŸ”‘ Admin dashboard access granted for:', userData.email);
        } else {
            if (adminDashboard) {
                adminDashboard.style.display = 'none';
            }
            console.log('ðŸš« Admin dashboard access denied for:', userData.email);
        }

        // Log styling application
        if (isSpecificAdmin) {
            console.log('ðŸ‘‘ VIP admin styling applied for cherifmed1200@gmail.com');
        } else {
            console.log('ðŸ‘¤ Regular user styling applied for:', userData.email);
        }

        // Ensure navbar ring reflects latest progress at login
        if (typeof userData.level !== 'undefined' && typeof userData.levelProgress !== 'undefined') {
            applyLevelUiEverywhere(userData.level, userData.levelProgress);
        }

        // Handle favorites login and sync
        if (window.favoritesManager) {
            window.favoritesManager.onUserLogin(userData.email);
            // Update button states to show they're now unlocked
            window.favoritesManager.updateFavoriteButtonsLoginState();
        }

        // Handle cart login and switch to user's cart
        if (window.cartManager) {
            window.cartManager.switchUserCart(userData.email);
            console.log(`ðŸ›’ Switched to ${userData.name}'s cart`);
        }

        // Update user statistics (in case this is a returning user)
        if (window.userStatsManager) {
            await window.userStatsManager.updateNavbarDisplay();
        }

        // Refresh reviews UI for logged in state
        if (window.reviewsManager) {
            window.reviewsManager.refreshForUser();
        }

        // Enable notifications for signed-in user
        if (window.notificationManager) {
            window.notificationManager.onUserSignIn();
        }

        console.log('âœ… UI updated for logged-in user:', userData);
    };

    // Local alias for backward compatibility
    const updateUIForLoggedInUser = window.updateUIForLoggedInUser;

    // Helper function to update profile form data
    function updateProfileFormData(userData) {
        const profileFirstName = document.getElementById('profileFirstName');
        const profileLastName = document.getElementById('profileLastName');
        const profilePhone = document.getElementById('profilePhone');
        const profileBirthday = document.getElementById('profileBirthday');

        console.log('ðŸ“ Updating profile form with user data:', userData);

        // Use separate first_name and last_name if available, otherwise split name
        if (userData.first_name !== undefined && userData.last_name !== undefined) {
            // New format: separate first_name and last_name fields
            if (profileFirstName) profileFirstName.value = userData.first_name || '';
            if (profileLastName) profileLastName.value = userData.last_name || '';
            console.log('âœ… Used separate first_name and last_name fields');
        } else if (userData.name) {
            // Old format: split the full name
            const nameParts = userData.name.split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';

            if (profileFirstName) profileFirstName.value = firstName;
            if (profileLastName) profileLastName.value = lastName;
            console.log('âœ… Split full name into first and last');
        } else {
            // No name data available
            if (profileFirstName) profileFirstName.value = '';
            if (profileLastName) profileLastName.value = '';
            console.log('âš ï¸ No name data available');
        }

        // Update other fields
        if (profilePhone) profilePhone.value = userData.phone || '';
        if (profileBirthday) profileBirthday.value = userData.birthday || '';

        console.log('âœ… Profile form updated successfully');
    }

    // Make functions globally accessible
    window.updateUIForLoggedInUser = updateUIForLoggedInUser;
    window.updateProfileFormData = updateProfileFormData;
    window.checkAuthState = checkAuthState;

    function handleLogout() {
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('authToken');

        userLoggedIn.style.display = 'none';
        userLoggedOut.style.display = 'block';

        // Handle favorites logout
        if (window.favoritesManager) {
            window.favoritesManager.onUserLogout();
        }

        // Handle cart logout and switch to guest cart
        if (window.cartManager) {
            window.cartManager.switchUserCart(null); // null = guest cart
            console.log('ðŸ›’ Switched to guest cart after logout');
        }

        // Refresh reviews UI for logged out state
        if (window.reviewsManager) {
            window.reviewsManager.refreshForUser();
        }

        // Disable notifications for signed-out user
        if (window.notificationManager) {
            window.notificationManager.onUserSignOut();
        }

        showNotification('You have been signed out successfully.', 'info');
    }

}

// Global notification function
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    // Add to page
    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);

    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);

    // Manual close
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    });
}

// Global refresh user session function
async function refreshUserSession() {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (!token) return;

    try {
        const response = await fetch('/api/auth/verify', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            if (data.success && data.user) {
                // Update stored user data
                const storage = localStorage.getItem('authToken') ? localStorage : sessionStorage;
                storage.setItem('user', JSON.stringify(data.user));
                updateUIForLoggedInUser(data.user);
                console.log('User session refreshed with admin data');
            }
        }
    } catch (error) {
        console.error('Error refreshing user session:', error);
    }
}

// Expose user data management functions globally
window.refreshUserProfile = refreshUserProfile;
window.syncUserData = syncUserData;
window.validateUserData = validateUserData;
window.cleanupStaleUserData = cleanupStaleUserData;
// Note: checkAuthState will be exposed after DOMContentLoaded

// Debug function to check authentication state
window.debugAuthState = function() {
    console.log('ðŸ” DEBUG: Authentication State Check');
    console.log('localStorage user:', localStorage.getItem('user'));
    console.log('sessionStorage user:', sessionStorage.getItem('user'));
    console.log('localStorage authToken:', localStorage.getItem('authToken'));
    console.log('sessionStorage authToken:', sessionStorage.getItem('authToken'));

    const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
    const authToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

    if (userData && authToken) {
        try {
            const user = JSON.parse(userData);
            console.log('âœ… Valid authentication found:', user);
            console.log('ðŸ”‘ Token exists:', !!authToken);
        } catch (error) {
            console.log('âŒ Corrupted user data:', error);
        }
    } else {
        console.log('âŒ No valid authentication found');
    }
};

// Debug function to test profile updates
window.testProfileUpdate = function(newName) {
    console.log('ðŸ§ª Testing profile update with name:', newName);

    const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (!userData) {
        console.log('âŒ No user data found');
        return;
    }

    const user = JSON.parse(userData);
    user.name = newName || 'Test User';

    const storage = localStorage.getItem('authToken') ? localStorage : sessionStorage;
    storage.setItem('user', JSON.stringify(user));

    if (window.updateUIForLoggedInUser) {
        window.updateUIForLoggedInUser(user);
        console.log('âœ… Profile updated and UI refreshed');
    } else {
        console.log('âŒ updateUIForLoggedInUser function not available');
    }
};

// Debug function to track name changes
window.debugNameChanges = function() {
    console.log('ðŸ” DEBUG: Tracking name changes...');

    const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (userData) {
        const user = JSON.parse(userData);
        console.log('Current stored name:', user.name);
        console.log('Current displayed name:', document.getElementById('userName')?.textContent);
        console.log('Full user data:', user);

        // Check for saved profile data
        const profileData = localStorage.getItem(`userProfile_${user.email}`) ||
                           sessionStorage.getItem(`userProfile_${user.email}`);
        if (profileData) {
            console.log('Saved profile data:', JSON.parse(profileData));
        } else {
            console.log('No saved profile data found');
        }
    } else {
        console.log('No user data found');
    }
};

// Debug function to test profile persistence across login/logout
window.testProfilePersistence = function(newName) {
    console.log('ðŸ§ª Testing profile persistence...');

    // 1. Update profile
    window.testProfileUpdate(newName || 'TEST PERSISTENCE');

    // 2. Show current state
    setTimeout(() => {
        console.log('ðŸ“Š After profile update:');
        window.debugNameChanges();

        // 3. Simulate logout/login cycle
        console.log('ðŸ”„ Simulating logout...');
        if (window.handleLogout) {
            window.handleLogout();
        }

        setTimeout(() => {
            console.log('ðŸ”„ Simulating login...');
            const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
            if (userData) {
                const user = JSON.parse(userData);
                // Simulate login with same email
                if (window.simulateLogin) {
                    window.simulateLogin(user.email, true);
                }

                setTimeout(() => {
                    console.log('ðŸ“Š After login:');
                    window.debugNameChanges();
                }, 500);
            }
        }, 1000);
    }, 500);
};



// Google Sign-In callback
function handleCredentialResponse(response) {
    // Decode the JWT token (in production, verify this server-side)
    const payload = JSON.parse(atob(response.credential.split('.')[1]));

    const userData = {
        name: payload.name,
        email: payload.email,
        avatar: payload.picture
    };

    // Store user data
    sessionStorage.setItem('user', JSON.stringify(userData));

    // Update UI
    document.getElementById('userLoggedOut').style.display = 'none';
    document.getElementById('userLoggedIn').style.display = 'block';
    document.getElementById('userAvatar').src = userData.avatar;
    document.getElementById('userName').textContent = userData.name;

    // Close modal
    document.getElementById('authModal').style.display = 'none';
    document.body.style.overflow = 'auto';

    // Show success message
    const notification = document.createElement('div');
    notification.className = 'notification notification-success';
    notification.innerHTML = `
        <div class="notification-content">
            <span>Welcome ${userData.name}! You have been signed in with Google.</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Initialize user modals (Profile, Favorites, Settings)
function initializeUserModals() {
    console.log('ðŸ”§ Initializing user modals...');

    // Profile Modal
    const profileBtn = document.getElementById('userProfileLink');
    const profileModal = document.getElementById('profileModal');
    const profileModalClose = document.getElementById('profileModalClose');
    const profileModalOverlay = document.getElementById('profileModalOverlay');
    const profileCancelBtn = document.getElementById('profileCancelBtn');
    const profileSaveBtn = document.getElementById('profileSaveBtn');

    console.log('ðŸ‘¤ Profile elements:', {
        profileBtn: !!profileBtn,
        profileModal: !!profileModal,
        profileModalClose: !!profileModalClose
    });

    // Favorites Modal
    const favoritesBtn = document.getElementById('userFavorites');
    const favoritesModal = document.getElementById('favoritesModal');
    const favoritesModalClose = document.getElementById('favoritesModalClose');
    const favoritesModalOverlay = document.getElementById('favoritesModalOverlay');

    console.log('â­ Favorites elements:', {
        favoritesBtn: !!favoritesBtn,
        favoritesModal: !!favoritesModal,
        favoritesModalClose: !!favoritesModalClose
    });

    // Settings Modal
    const settingsBtn = document.getElementById('userSettings');
    const settingsModal = document.getElementById('settingsModal');
    const settingsModalClose = document.getElementById('settingsModalClose');
    const settingsModalOverlay = document.getElementById('settingsModalOverlay');
    const settingsCancelBtn = document.getElementById('settingsCancelBtn');
    const settingsSaveBtn = document.getElementById('settingsSaveBtn');

    console.log('âš™ï¸ Settings elements:', {
        settingsBtn: !!settingsBtn,
        settingsModal: !!settingsModal,
        settingsModalClose: !!settingsModalClose
    });

    // Profile Modal Events
    if (profileBtn) {
        profileBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('ðŸ‘¤ Profile button clicked');
            openProfileModal();
        });
    }

    // Enhanced close event handlers for profile modal
    if (profileModalClose) {
        profileModalClose.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('ðŸ‘¤ Profile close button clicked');
            closeProfileModal();
        });
    }

    if (profileModalOverlay) {
        profileModalOverlay.addEventListener('click', (e) => {
            if (e.target === profileModalOverlay) {
                e.preventDefault();
                e.stopPropagation();
                console.log('ðŸ‘¤ Profile overlay clicked');
                closeProfileModal();
            }
        });
    }

    if (profileCancelBtn) {
        profileCancelBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeProfileModal();
        });
    }

    if (profileSaveBtn) profileSaveBtn.addEventListener('click', saveProfile);

    // Favorites Modal Events
    if (favoritesBtn) {
        favoritesBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('â­ Favorites button clicked');
            openFavoritesModal();
        });
    }

    // Enhanced close event handlers for favorites modal
    if (favoritesModalClose) {
        favoritesModalClose.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('â­ Favorites close button clicked');
            closeFavoritesModal();
        });
    }

    if (favoritesModalOverlay) {
        favoritesModalOverlay.addEventListener('click', (e) => {
            if (e.target === favoritesModalOverlay) {
                e.preventDefault();
                e.stopPropagation();
                console.log('â­ Favorites overlay clicked');
                closeFavoritesModal();
            }
        });
    }

    // Settings Modal Events
    if (settingsBtn) {
        settingsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('âš™ï¸ Settings button clicked');
            openSettingsModal();
        });
    }

    // Enhanced close event handlers for settings modal
    if (settingsModalClose) {
        settingsModalClose.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('âš™ï¸ Settings close button clicked');
            closeSettingsModal();
        });
    }

    if (settingsModalOverlay) {
        settingsModalOverlay.addEventListener('click', (e) => {
            if (e.target === settingsModalOverlay) {
                e.preventDefault();
                e.stopPropagation();
                console.log('âš™ï¸ Settings overlay clicked');
                closeSettingsModal();
            }
        });
    }

    if (settingsCancelBtn) {
        settingsCancelBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeSettingsModal();
        });
    }

    if (settingsSaveBtn) settingsSaveBtn.addEventListener('click', saveSettings);

    // Additional Settings Events
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    const deleteAccountBtn = document.getElementById('deleteAccountBtn');
    const changeAvatarBtn = document.getElementById('changeAvatarBtn');

    if (changePasswordBtn) changePasswordBtn.addEventListener('click', changePassword);
    if (deleteAccountBtn) deleteAccountBtn.addEventListener('click', deleteAccount);
    if (changeAvatarBtn) {
        console.log('ðŸ”— Attaching click event to changeAvatarBtn');
        changeAvatarBtn.addEventListener('click', function(e) {
            console.log('ðŸŽ¯ Change Photo button clicked!');
            e.preventDefault();
            e.stopPropagation();

            // DIRECT APPROACH - Find and click file input immediately
            const avatarFileInput = document.getElementById('avatarFileInput');
            const photoUploadInput = document.getElementById('photoUploadInput');

            console.log('ðŸ” Looking for file inputs...');
            console.log('  avatarFileInput:', avatarFileInput);
            console.log('  photoUploadInput:', photoUploadInput);

            const fileInput = avatarFileInput || photoUploadInput;

            if (fileInput) {
                console.log('âœ… Found file input, clicking:', fileInput.id);

                // Ensure event listener is attached before clicking
                if (!fileInput.onchange) {
                    console.log('ðŸ”§ Adding missing event listener to file input...');
                    fileInput.addEventListener('change', handlePhotoUpload);
                }

                fileInput.click();
            } else {
                console.error('âŒ NO FILE INPUT FOUND AT ALL!');

                // Create a temporary file input as fallback
                const tempInput = document.createElement('input');
                tempInput.type = 'file';
                tempInput.accept = 'image/*';
                tempInput.style.display = 'none';
                tempInput.addEventListener('change', handlePhotoUpload);
                document.body.appendChild(tempInput);
                tempInput.click();
                console.log('ðŸ†˜ Created temporary file input');
            }
        });
    } else {
        console.error('âŒ changeAvatarBtn not found!');
    }

    // Photo upload is now handled directly by the file input

    // Universal ESC key support for all user modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Check which modal is open and close it
            const profileModal = document.getElementById('profileModal');
            const favoritesModal = document.getElementById('favoritesModal');
            const settingsModal = document.getElementById('settingsModal');

            if (profileModal && profileModal.classList.contains('show')) {
                console.log('ðŸ‘¤ ESC pressed - closing profile modal');
                closeProfileModal();
            } else if (favoritesModal && favoritesModal.classList.contains('show')) {
                console.log('â­ ESC pressed - closing favorites modal');
                closeFavoritesModal();
            } else if (settingsModal && settingsModal.classList.contains('show')) {
                console.log('âš™ï¸ ESC pressed - closing settings modal');
                closeSettingsModal();
            }
        }
    });

    console.log('âœ… User modals initialized successfully');
}



// Debug function to test photo upload
window.testPhotoUpload = function() {
    console.log('ðŸ§ª Testing photo upload...');

    // Check for file inputs
    const avatarFileInput = document.getElementById('avatarFileInput');
    const photoUploadInput = document.getElementById('photoUploadInput');
    const changeAvatarBtn = document.getElementById('changeAvatarBtn');

    console.log('ðŸ” File inputs found:');
    console.log('  - avatarFileInput:', avatarFileInput);
    console.log('  - photoUploadInput:', photoUploadInput);
    console.log('  - changeAvatarBtn:', changeAvatarBtn);

    if (changeAvatarBtn) {
        console.log('âœ… Button found, simulating click...');
        changeAvatarBtn.click();
    } else {
        console.error('âŒ Change photo button not found');

        // Try direct file input click
        const fileInput = avatarFileInput || photoUploadInput;
        if (fileInput) {
            console.log('ðŸ”„ Trying direct file input click...');
            fileInput.click();
        }
    }
};

// Debug function to check photo upload setup
window.debugPhotoUpload = function() {
    console.log('ðŸ” === PHOTO UPLOAD DEBUG ===');

    const avatarFileInput = document.getElementById('avatarFileInput');
    const photoUploadInput = document.getElementById('photoUploadInput');
    const changeAvatarBtn = document.getElementById('changeAvatarBtn');

    console.log('ðŸ“‹ Elements status:');
    console.log('  avatarFileInput:', avatarFileInput ? 'âœ… Found' : 'âŒ Missing');
    console.log('  photoUploadInput:', photoUploadInput ? 'âœ… Found' : 'âŒ Missing');
    console.log('  changeAvatarBtn:', changeAvatarBtn ? 'âœ… Found' : 'âŒ Missing');

    // Check event listeners
    if (avatarFileInput) {
        console.log('  avatarFileInput has change listener:', avatarFileInput.onchange ? 'âœ… Yes' : 'âŒ No');
    }
    if (photoUploadInput) {
        console.log('  photoUploadInput has change listener:', photoUploadInput.onchange ? 'âœ… Yes' : 'âŒ No');
    }

    console.log('ðŸ” === END DEBUG ===');
};

// Debug function to check user avatar data
window.debugUserAvatar = function() {
    console.log('ðŸ” === USER AVATAR DEBUG ===');

    // Check localStorage
    const userEmail = localStorage.getItem('userEmail');
    console.log('User email:', userEmail);

    if (userEmail) {
        const userProfile = localStorage.getItem(`userProfile_${userEmail}`);
        console.log('User profile data:', userProfile);

        if (userProfile) {
            try {
                const profile = JSON.parse(userProfile);
                console.log('Parsed profile:', profile);
                console.log('Avatar in profile:', profile.avatar ? profile.avatar.substring(0, 100) + '...' : 'None');
            } catch (e) {
                console.error('Error parsing profile:', e);
            }
        }
    }

    // Check sessionStorage
    const sessionData = sessionStorage.getItem('userData');
    console.log('Session data:', sessionData);

    if (sessionData) {
        try {
            const userData = JSON.parse(sessionData);
            console.log('Parsed session data:', userData);
            console.log('Avatar in session:', userData.avatar ? userData.avatar.substring(0, 100) + '...' : 'None');
        } catch (e) {
            console.error('Error parsing session data:', e);
        }
    }

    // Check current avatar elements
    const userAvatar = document.getElementById('userAvatar');
    const profileAvatarLarge = document.getElementById('profileAvatarLarge');

    console.log('Current avatar elements:');
    console.log('  userAvatar src:', userAvatar ? userAvatar.src.substring(0, 100) + '...' : 'Not found');
    console.log('  profileAvatarLarge src:', profileAvatarLarge ? profileAvatarLarge.src.substring(0, 100) + '...' : 'Not found');

    console.log('ðŸ” === END USER AVATAR DEBUG ===');
};

// Photo Editor Functions
let photoEditorState = {
    originalImage: null,
    canvas: null,
    previewCanvas: null,
    ctx: null,
    previewCtx: null,
    scale: 1,
    rotation: 0,
    offsetX: 0,
    offsetY: 0,
    isDragging: false,
    lastMouseX: 0,
    lastMouseY: 0
};

function openPhotoEditor(imageDataUrl) {
    console.log('ðŸŽ¨ Opening photo editor with image...');

    // Close profile modal first to avoid layering issues
    const profileModal = document.getElementById('profileModal');
    if (profileModal) {
        profileModal.style.setProperty('display', 'none', 'important');
        profileModal.style.setProperty('z-index', '1', 'important');
        console.log('ðŸ“± Closed profile modal to open photo editor');
    }

    const modal = document.getElementById('photoEditorModal');
    const canvas = document.getElementById('photoCanvas');
    const previewCanvas = document.getElementById('previewCanvas');

    if (!modal || !canvas || !previewCanvas) {
        console.error('âŒ Photo editor elements not found');
        return;
    }

    // Initialize canvases
    photoEditorState.canvas = canvas;
    photoEditorState.previewCanvas = previewCanvas;
    photoEditorState.ctx = canvas.getContext('2d');
    photoEditorState.previewCtx = previewCanvas.getContext('2d');

    // Load the image
    const img = new Image();
    img.onload = function() {
        photoEditorState.originalImage = img;

        // Reset state
        photoEditorState.scale = 1;
        photoEditorState.rotation = 0;
        photoEditorState.offsetX = 0;
        photoEditorState.offsetY = 0;

        // Set canvas size
        canvas.width = 400;
        canvas.height = 400;
        previewCanvas.width = 150;
        previewCanvas.height = 150;

        // Initial render
        renderPhotoEditor();
        updatePreview();

        // Show modal with high priority
        modal.style.setProperty('display', 'flex', 'important');
        modal.style.setProperty('z-index', '200000', 'important');

        // Prevent page scroll while modal is open
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';

        console.log('âœ… Photo editor opened successfully');
    };

    img.src = imageDataUrl;

    // Setup event listeners
    setupPhotoEditorEvents();
}

function renderPhotoEditor() {
    const { canvas, ctx, originalImage, scale, rotation, offsetX, offsetY } = photoEditorState;

    if (!canvas || !ctx || !originalImage) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Save context
    ctx.save();

    // Move to center
    ctx.translate(canvas.width / 2, canvas.height / 2);

    // Apply transformations
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(scale, scale);
    ctx.translate(offsetX, offsetY);

    // Calculate image dimensions to fit canvas while maintaining aspect ratio
    const imgAspect = originalImage.width / originalImage.height;
    const canvasAspect = canvas.width / canvas.height;

    let drawWidth, drawHeight;
    if (imgAspect > canvasAspect) {
        drawHeight = canvas.height;
        drawWidth = drawHeight * imgAspect;
    } else {
        drawWidth = canvas.width;
        drawHeight = drawWidth / imgAspect;
    }

    // Draw image centered
    ctx.drawImage(
        originalImage,
        -drawWidth / 2,
        -drawHeight / 2,
        drawWidth,
        drawHeight
    );

    // Restore context
    ctx.restore();
}

function updatePreview() {
    const { previewCanvas, previewCtx, originalImage, scale, rotation, offsetX, offsetY } = photoEditorState;

    if (!previewCanvas || !previewCtx || !originalImage) return;

    // Clear preview canvas
    previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);

    // Save context
    previewCtx.save();

    // Create circular clipping path
    previewCtx.beginPath();
    previewCtx.arc(75, 75, 75, 0, 2 * Math.PI);
    previewCtx.clip();

    // Move to center
    previewCtx.translate(75, 75);

    // Apply transformations (scaled down for preview)
    previewCtx.rotate((rotation * Math.PI) / 180);
    previewCtx.scale(scale, scale);
    previewCtx.translate(offsetX * 0.375, offsetY * 0.375); // Scale offset for preview

    // Calculate image dimensions
    const imgAspect = originalImage.width / originalImage.height;
    let drawWidth = 150;
    let drawHeight = 150;

    if (imgAspect > 1) {
        drawHeight = drawWidth / imgAspect;
    } else {
        drawWidth = drawHeight * imgAspect;
    }

    // Draw image centered
    previewCtx.drawImage(
        originalImage,
        -drawWidth / 2,
        -drawHeight / 2,
        drawWidth,
        drawHeight
    );

    // Restore context
    previewCtx.restore();
}

function setupPhotoEditorEvents() {
    // Scale slider
    const scaleSlider = document.getElementById('scaleSlider');
    const scaleValue = document.getElementById('scaleValue');

    if (scaleSlider && scaleValue) {
        scaleSlider.addEventListener('input', function() {
            photoEditorState.scale = parseFloat(this.value);
            scaleValue.textContent = Math.round(photoEditorState.scale * 100) + '%';
            renderPhotoEditor();
            updatePreview();
        });
    }

    // Rotation slider
    const rotateSlider = document.getElementById('rotateSlider');
    const rotateValue = document.getElementById('rotateValue');

    if (rotateSlider && rotateValue) {
        rotateSlider.addEventListener('input', function() {
            photoEditorState.rotation = parseInt(this.value);
            rotateValue.textContent = photoEditorState.rotation + 'Â°';
            renderPhotoEditor();
            updatePreview();
        });
    }

    // Position buttons
    const moveStep = 10;

    document.getElementById('moveUp')?.addEventListener('click', () => {
        photoEditorState.offsetY -= moveStep;
        renderPhotoEditor();
        updatePreview();
    });

    document.getElementById('moveDown')?.addEventListener('click', () => {
        photoEditorState.offsetY += moveStep;
        renderPhotoEditor();
        updatePreview();
    });

    document.getElementById('moveLeft')?.addEventListener('click', () => {
        photoEditorState.offsetX -= moveStep;
        renderPhotoEditor();
        updatePreview();
    });

    document.getElementById('moveRight')?.addEventListener('click', () => {
        photoEditorState.offsetX += moveStep;
        renderPhotoEditor();
        updatePreview();
    });

    // Canvas dragging
    const canvas = photoEditorState.canvas;
    if (canvas) {
        canvas.addEventListener('mousedown', startDrag);
        canvas.addEventListener('mousemove', drag);
        canvas.addEventListener('mouseup', endDrag);
        canvas.addEventListener('mouseleave', endDrag);
    }

    // Modal close events
    document.getElementById('photoEditorClose')?.addEventListener('click', closePhotoEditor);
    document.getElementById('photoEditorOverlay')?.addEventListener('click', closePhotoEditor);
    document.getElementById('photoEditorCancel')?.addEventListener('click', closePhotoEditor);

    // Save button
    document.getElementById('photoEditorSave')?.addEventListener('click', saveEditedPhoto);
}

function startDrag(e) {
    photoEditorState.isDragging = true;
    photoEditorState.lastMouseX = e.offsetX;
    photoEditorState.lastMouseY = e.offsetY;
    photoEditorState.canvas.style.cursor = 'grabbing';
}

function drag(e) {
    if (!photoEditorState.isDragging) return;

    const deltaX = e.offsetX - photoEditorState.lastMouseX;
    const deltaY = e.offsetY - photoEditorState.lastMouseY;

    photoEditorState.offsetX += deltaX / photoEditorState.scale;
    photoEditorState.offsetY += deltaY / photoEditorState.scale;

    photoEditorState.lastMouseX = e.offsetX;
    photoEditorState.lastMouseY = e.offsetY;

    renderPhotoEditor();
    updatePreview();
}

function endDrag() {
    photoEditorState.isDragging = false;
    photoEditorState.canvas.style.cursor = 'move';
}

function closePhotoEditor(reopenProfile = true) {
    const modal = document.getElementById('photoEditorModal');
    if (modal) {
        // Completely hide and reset the modal
        modal.style.setProperty('display', 'none', 'important');
        modal.style.removeProperty('z-index');
        modal.classList.remove('show');
    }

    // Restore page scroll behavior
    document.body.style.removeProperty('overflow');
    document.body.style.removeProperty('position');
    document.body.style.removeProperty('height');
    document.documentElement.style.removeProperty('overflow');

    // Remove any modal overlays that might be blocking scroll
    const overlays = document.querySelectorAll('.modal-overlay, .photo-editor-modal');
    overlays.forEach(overlay => {
        if (overlay !== modal) {
            overlay.style.setProperty('display', 'none', 'important');
            overlay.style.removeProperty('z-index');
        }
    });

    // Reopen profile modal if requested (when user cancels)
    if (reopenProfile) {
        const profileModal = document.getElementById('profileModal');
        if (profileModal) {
            profileModal.style.display = 'block';
            console.log('ðŸ“± Reopened profile modal');
        }
    }

    // Reset state
    photoEditorState = {
        originalImage: null,
        canvas: null,
        previewCanvas: null,
        ctx: null,
        previewCtx: null,
        scale: 1,
        rotation: 0,
        offsetX: 0,
        offsetY: 0,
        isDragging: false,
        lastMouseX: 0,
        lastMouseY: 0
    };

    // Force a scroll restoration
    setTimeout(() => {
        window.scrollTo(0, window.pageYOffset);
        document.body.style.pointerEvents = 'auto';
        console.log('ðŸ”„ Page scroll restored');
    }, 100);

    console.log('ðŸŽ¨ Photo editor closed and page scroll restored');
}

async function saveEditedPhoto() {
    console.log('ðŸ’¾ Saving edited photo...');

    // ðŸ”’ IMMEDIATE AUTH PROTECTION: Save current user state before starting edit save
    const currentUser = getCurrentUser();
    if (currentUser) {
        console.log('ðŸ”’ Protecting user state before photo edit save...');
        try {
            const storage = getStorageMethod();
            const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
            // Create safe user data without large avatar
            const safeUserData = {
                ...currentUser,
                avatar: currentUser.avatar && currentUser.avatar.startsWith('data:') ? 'custom_avatar_uploaded' : currentUser.avatar
            };
            storage.setItem('user', JSON.stringify(safeUserData));
            if (token) storage.setItem('authToken', token);
            console.log('âœ… User state protected during photo edit save');
        } catch (error) {
            console.error('âŒ Failed to protect user state during edit save:', error);
        }
    }

    // Create a temporary canvas for the final circular crop
    const finalCanvas = document.createElement('canvas');
    const finalCtx = finalCanvas.getContext('2d');

    // Set final canvas size (300x300 for high quality)
    finalCanvas.width = 300;
    finalCanvas.height = 300;

    // Create circular clipping path
    finalCtx.beginPath();
    finalCtx.arc(150, 150, 150, 0, 2 * Math.PI);
    finalCtx.clip();

    // Apply the same transformations as the preview
    finalCtx.save();
    finalCtx.translate(150, 150);
    finalCtx.rotate((photoEditorState.rotation * Math.PI) / 180);
    finalCtx.scale(photoEditorState.scale, photoEditorState.scale);
    finalCtx.translate(photoEditorState.offsetX * 0.75, photoEditorState.offsetY * 0.75);

    // Calculate image dimensions
    const { originalImage } = photoEditorState;
    const imgAspect = originalImage.width / originalImage.height;
    let drawWidth = 300;
    let drawHeight = 300;

    if (imgAspect > 1) {
        drawHeight = drawWidth / imgAspect;
    } else {
        drawWidth = drawHeight * imgAspect;
    }

    // Draw the final image
    finalCtx.drawImage(
        originalImage,
        -drawWidth / 2,
        -drawHeight / 2,
        drawWidth,
        drawHeight
    );

    finalCtx.restore();

    // Convert to data URL
    const editedImageUrl = finalCanvas.toDataURL('image/png', 0.9);

    console.log('âœ… Photo edited successfully, saving to database...');

    // Close editor without reopening profile modal
    closePhotoEditor(false);

    // Save the edited photo using the fallback function
    await saveUploadedPhotoFallback(editedImageUrl);
}

// Fallback function in case of scoping issues
async function saveUploadedPhotoFallback(imageUrl) {
    console.log('ðŸ’¾ Saving uploaded photo to database (fallback):', imageUrl.substring(0, 50) + '...');

    try {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        if (!token) {
            console.error('âŒ No authentication token found');
            hideUploadProgress();
            showNotification('Please log in to update your profile photo', 'error');
            return;
        }

        // ðŸ”’ COMPREHENSIVE AUTH PROTECTION: Multi-level authentication persistence (fallback)
        const currentUser = getCurrentUser();
        if (currentUser) {
            console.log('ðŸ”’ Implementing comprehensive auth protection during upload (fallback)...');
            try {
                // Create safe user data without large avatar
                const safeUserData = {
                    ...currentUser,
                    avatar: currentUser.avatar && currentUser.avatar.startsWith('data:') ? 'custom_avatar_uploaded' : currentUser.avatar,
                    uploadInProgress: true, // Flag to indicate upload is happening
                    lastActivity: Date.now() // Timestamp for session validation
                };

                // Save to BOTH localStorage AND sessionStorage for maximum persistence
                localStorage.setItem('user', JSON.stringify(safeUserData));
                localStorage.setItem('authToken', token);
                localStorage.setItem('uploadProtection', 'true');

                sessionStorage.setItem('user', JSON.stringify(safeUserData));
                sessionStorage.setItem('authToken', token);
                sessionStorage.setItem('uploadProtection', 'true');

                // Also update auth state manager if available
                if (window.authStateManager) {
                    window.authStateManager.updateUser(safeUserData);
                }

                console.log('âœ… Multi-level auth protection activated (fallback) - refresh is now safe');
            } catch (error) {
                console.error('âŒ Failed to implement auth protection (fallback):', error);
                // Continue anyway - upload might still work
            }
        }

        // Show enhanced loading state with progress
        showUploadProgress('Uploading to server...', 70);

        // Send to server
        const response = await fetch('/api/user/upload-avatar', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                avatarData: imageUrl
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            hideUploadProgress();
            throw new Error(errorData.error || 'Failed to upload avatar');
        }

        const data = await response.json();
        console.log('âœ… Avatar uploaded to database successfully');

        // Update progress
        showUploadProgress('Updating profile...', 85);

        // DON'T store large base64 images in localStorage - causes QuotaExceededError
        // Instead, refresh user data from server to get the updated avatar
        console.log('ðŸ”„ Skipping localStorage update to avoid quota exceeded error');
        console.log('ðŸ”„ Refreshing user data from server...');

        // Actually refresh user data from server
        try {
            const userResponse = await fetch('/api/user/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (userResponse.ok) {
                const updatedUserData = await userResponse.json();
                console.log('âœ… Got updated user data from server:', updatedUserData);

                // SAFE STORAGE: Never store large base64 images to prevent logout on refresh
                const storage = localStorage.getItem('authToken') ? localStorage : sessionStorage;

                console.log('ðŸ”’ Using safe storage approach to prevent logout on refresh');

                // Create safe user data without large avatar
                const safeUserData = {
                    id: updatedUserData.id,
                    name: updatedUserData.name,
                    email: updatedUserData.email,
                    phone: updatedUserData.phone,
                    birthday: updatedUserData.birthday,
                    isAdmin: updatedUserData.isAdmin,
                    avatar: 'custom_avatar_uploaded', // Placeholder indicating custom avatar exists
                    hasCustomAvatar: true // Flag for UI to fetch from server
                };

                try {
                    storage.setItem('user', JSON.stringify(safeUserData));
                    console.log('âœ… Updated user data in storage safely (prevents logout on refresh)');
                    console.log('ðŸ”„ Custom avatar will be fetched fresh from server');
                } catch (error) {
                    console.error('âŒ Safe storage failed:', error);
                    // Continue without storage update to prevent logout
                }

                // Trigger real-time update for reviews
                if (window.reviewsManager) {
                    console.log('ðŸ”„ Triggering real-time avatar update in reviews...');

                    // Get current user data to ensure we have valid name and avatar
                    const currentUser = getCurrentUser();
                    if (currentUser && currentUser.name) {
                        const userName = currentUser.name;
                        const userAvatar = imageUrl; // Use the image URL parameter passed to this function

                        console.log('ðŸ“ Updating reviews with:', { name: userName, avatarLength: userAvatar ? userAvatar.length : 0 });
                        await window.reviewsManager.updateUserProfileInDatabase(userName, userAvatar);
                        await window.reviewsManager.loadAllReviews();
                        console.log('âœ… Reviews updated with new avatar');
                    } else {
                        console.log('âš ï¸ Skipping reviews update - no valid user name available');
                    }
                }
            } else {
                console.error('âŒ Failed to refresh user data from server');
            }
        } catch (error) {
            console.error('âŒ Error refreshing user data:', error);
        }

        // Update UI immediately - FORCE refresh both avatars
        const userAvatar = document.getElementById('userAvatar');
        const profileAvatarLarge = document.getElementById('profileAvatarLarge');

        if (userAvatar) {
            userAvatar.src = imageUrl + '?t=' + Date.now(); // Force refresh with timestamp
            console.log('âœ… Updated main navigation avatar in UI');
        } else {
            console.error('âŒ userAvatar element not found!');
        }

        if (profileAvatarLarge) {
            profileAvatarLarge.src = imageUrl + '?t=' + Date.now(); // Force refresh with timestamp
            console.log('âœ… Updated profile modal avatar in UI');
        } else {
            console.error('âŒ profileAvatarLarge element not found!');
        }

        // Also update any other avatar elements that might exist
        const allAvatars = document.querySelectorAll('img[src*="default.jpg"], img[src*="data:image"]');
        allAvatars.forEach((avatar, index) => {
            if (avatar.id === 'userAvatar' || avatar.id === 'profileAvatarLarge') {
                avatar.src = imageUrl + '?t=' + Date.now();
                console.log(`âœ… Updated additional avatar ${index + 1}`);
            }
        });

        // ðŸš€ REAL-TIME UPDATE: Update all existing reviews with new avatar (fallback)
        console.log('ðŸš€ STARTING REAL-TIME AVATAR UPDATE (FALLBACK)...');
        const userForReviewsFallback = getCurrentUser();
        if (window.reviewsManager && userForReviewsFallback) {
            console.log('ðŸ”„ Updating avatar in all reviews (fallback method)...');
            const success = await window.reviewsManager.updateUserProfileInDatabase(userForReviewsFallback.name, imageUrl);
            if (success) {
                console.log('âœ… Avatar updated in database - refreshing UI...');
                // Force refresh all reviews from database to show changes immediately
                await window.reviewsManager.loadAllReviews();
                // Also refresh review forms to show updated avatar
                window.reviewsManager.refreshReviewForms();
                console.log('ðŸŽ‰ REAL-TIME AVATAR UPDATE COMPLETE (FALLBACK)! All reviews should now show new avatar.');
            }
        }

        // ðŸ”“ CLEANUP: Remove upload protection flags after successful completion (fallback)
        try {
            localStorage.removeItem('uploadProtection');
            sessionStorage.removeItem('uploadProtection');

            // Update user data to remove upload flag
            const finalUser = getCurrentUser();
            if (finalUser) {
                delete finalUser.uploadInProgress;
                const storage = getStorageMethod();
                storage.setItem('user', JSON.stringify(finalUser));
                console.log('âœ… Upload protection flags cleaned up (fallback)');
            }
        } catch (error) {
            console.error('âŒ Failed to cleanup upload protection (fallback):', error);
        }

        // ðŸš€ ENHANCED: Comprehensive comment section refresh after avatar upload (fallback)
        console.log('ðŸ”„ Starting comprehensive comment section refresh after avatar upload (fallback)...');
        try {
            await refreshAllCommentSections();
            console.log('âœ… Comment sections refreshed successfully after avatar upload (fallback)');
        } catch (error) {
            console.error('âŒ Error refreshing comment sections after avatar upload (fallback):', error);
        }

        // Complete progress and show success
        showUploadProgress('Complete!', 100);
        setTimeout(() => {
            hideUploadProgress();
            showNotification('Profile photo updated successfully! All comments updated.', 'success');
        }, 500);

        console.log('âœ… Photo saved to database and UI updated with comprehensive refresh (fallback)');

        // Don't refresh from server to preserve local profile changes (like custom name)
        console.log('â­ï¸ Skipping server refresh to preserve local profile data');

    } catch (error) {
        console.error('âŒ Error saving photo:', error);
        hideUploadProgress();
        showNotification('Failed to update profile photo. Please try again.', 'error');
    }
}

// Remove this line - will be added later

// Function to set user avatar from server data
async function setUserAvatarFromServer(avatarElement, location) {
    try {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        if (!token) {
            console.log(`âŒ No auth token for ${location} avatar`);
            avatarElement.src = 'default.jpg';
            return;
        }

        const response = await fetch('/api/user/profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }

        const response_data = await response.json();
        const userData = response_data.user; // Extract user data from nested response

        console.log(`ðŸ” ${location} avatar data:`, userData.avatar ? userData.avatar.substring(0, 50) + '...' : 'None');

        if (userData.avatar && userData.avatar !== 'default.jpg') {
            // Handle placeholder values for custom avatars
            if (userData.avatar === 'custom_uploaded' || userData.avatar === 'custom_avatar_uploaded') {
                // This means user has a custom avatar stored in database
                console.log(`ðŸ–¼ï¸ ${location} detected custom avatar placeholder`);

                // ðŸ”§ FIX: Check if we have avatar_url in the current response
                if (userData.avatar_url && userData.avatar_url.startsWith('data:')) {
                    // Use the avatar_url from current response
                    try {
                        // For very long base64 URLs, create a blob URL instead
                        const base64Part = userData.avatar_url.split(',')[1];
                        if (base64Part && base64Part.length > 100) {
                            const byteCharacters = atob(base64Part);
                            const byteNumbers = new Array(byteCharacters.length);
                            for (let i = 0; i < byteCharacters.length; i++) {
                                byteNumbers[i] = byteCharacters.charCodeAt(i);
                            }
                            const byteArray = new Uint8Array(byteNumbers);
                            const mimeType = userData.avatar_url.split(',')[0].split(':')[1].split(';')[0];
                            const blob = new Blob([byteArray], { type: mimeType });
                            const blobUrl = URL.createObjectURL(blob);

                            avatarElement.src = blobUrl;
                            console.log(`âœ… ${location} loaded custom avatar from current response`);

                            // Clean up blob URL when image loads
                            avatarElement.onload = () => {
                                setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
                            };
                        } else {
                            avatarElement.src = 'default.jpg';
                            console.log(`ðŸ–¼ï¸ ${location} using default.jpg (incomplete avatar data)`);
                        }
                    } catch (error) {
                        console.error(`âŒ ${location} avatar processing failed:`, error);
                        avatarElement.src = 'default.jpg';
                    }
                } else {
                    // No avatar_url available, use default
                    avatarElement.src = 'default.jpg';
                    console.log(`ðŸ–¼ï¸ ${location} using default.jpg (no avatar_url in response)`);
                }
                return; // Return early to prevent further processing
            }
            // Handle base64 data URL - but don't set directly due to URL length limits
            else if (userData.avatar.startsWith('data:image/')) {
                // Check if the base64 data is complete and valid
                const base64Part = userData.avatar.split(',')[1];
                if (base64Part && base64Part.length > 100) {
                    try {
                        // For very long base64 URLs, create a blob URL instead
                        const byteCharacters = atob(base64Part);
                        const byteNumbers = new Array(byteCharacters.length);
                        for (let i = 0; i < byteCharacters.length; i++) {
                            byteNumbers[i] = byteCharacters.charCodeAt(i);
                        }
                        const byteArray = new Uint8Array(byteNumbers);
                        const mimeType = userData.avatar.split(',')[0].split(':')[1].split(';')[0];
                        const blob = new Blob([byteArray], { type: mimeType });
                        const blobUrl = URL.createObjectURL(blob);

                        avatarElement.src = blobUrl;
                        console.log(`âœ… ${location} avatar loaded from blob URL (${userData.avatar.length} chars)`);

                        // Clean up blob URL when image loads to prevent memory leaks
                        avatarElement.onload = () => {
                            setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
                        };
                    } catch (error) {
                        console.error(`âŒ ${location} avatar blob creation failed:`, error);
                        avatarElement.src = 'default.jpg';
                    }
                } else {
                    console.error(`âŒ ${location} avatar base64 data is incomplete or corrupted`);
                    avatarElement.src = 'default.jpg';
                }
            } else {
                // Not a base64 image, might be a file path
                avatarElement.src = userData.avatar;
                console.log(`âœ… ${location} avatar loaded from server (file path)`);
            }
        } else {
            avatarElement.src = 'default.jpg';
            console.log(`ðŸ–¼ï¸ ${location} using default avatar`);
        }

        // Add comprehensive error handling
        avatarElement.onerror = () => {
            console.error(`âŒ ${location} avatar failed to load`);
            avatarElement.src = 'default.jpg';

            // Clean up corrupted data in localStorage
            const currentUser = getCurrentUser();
            if (currentUser && currentUser.avatar && currentUser.avatar.startsWith('data:')) {
                console.log(`ðŸ§¹ Cleaning corrupted ${location} avatar from localStorage`);
                currentUser.avatar = 'default.jpg';
                const storage = localStorage.getItem('authToken') ? localStorage : sessionStorage;
                try {
                    storage.setItem('user', JSON.stringify(currentUser));
                } catch (error) {
                    console.error('âŒ Error cleaning localStorage:', error);
                }
            }
        };

    } catch (error) {
        console.error(`âŒ Error loading ${location} avatar:`, error);
        avatarElement.src = 'default.jpg';
    }
}

// Function to refresh user data from server
async function refreshUserDataFromServer() {
    try {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        if (!token) {
            console.log('âŒ No auth token for refresh');
            return;
        }

        console.log('ðŸ”„ Refreshing user data from server...');

        const response = await fetch('/api/user/profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }

        const response_data = await response.json();
        const userData = response_data.user; // Extract user data from nested response
        console.log('âœ… Fresh user data from server:', userData);

        // DON'T store large base64 images in localStorage - causes QuotaExceededError
        // Only store essential user data without the avatar
        const userEmail = localStorage.getItem('userEmail');
        if (userEmail) {
            const profileData = {
                name: userData.name,
                phone: userData.phone,
                birthday: userData.birthday,
                avatar: userData.avatar && userData.avatar.startsWith('data:') ? 'default.jpg' : userData.avatar
            };
            localStorage.setItem(`userProfile_${userEmail}`, JSON.stringify(profileData));
        }

        // Store minimal session data
        const sessionData = {
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            birthday: userData.birthday,
            isAdmin: userData.isAdmin,
            avatar: userData.avatar && userData.avatar.startsWith('data:') ? 'default.jpg' : userData.avatar
        };
        sessionStorage.setItem('userData', JSON.stringify(sessionData));

        // Update UI with fresh data - directly update avatars with server data
        console.log('ðŸ–¼ï¸ Updating avatars with fresh server data...');

        const userAvatar = document.getElementById('userAvatar');
        const profileAvatarLarge = document.getElementById('profileAvatarLarge');

        if (userAvatar && userData.avatar) {
            userAvatar.src = userData.avatar;
            console.log('âœ… Updated navigation avatar from server');
        }

        if (profileAvatarLarge && userData.avatar) {
            profileAvatarLarge.src = userData.avatar;
            console.log('âœ… Updated profile modal avatar from server');
        }

        // Also update other UI elements
        await updateUIForLoggedInUser(userData);

        console.log('âœ… User data refreshed and UI updated');

    } catch (error) {
        console.error('âŒ Error refreshing user data:', error);
    }
}

// Force test photo upload by directly triggering file input
window.forcePhotoUpload = function() {
    console.log('ðŸ’¥ FORCE TESTING PHOTO UPLOAD');

    // Find any file input
    const avatarFileInput = document.getElementById('avatarFileInput');
    const photoUploadInput = document.getElementById('photoUploadInput');

    const fileInput = avatarFileInput || photoUploadInput;

    if (fileInput) {
        console.log('âœ… Found file input:', fileInput.id);
        console.log('ðŸŽ¯ Triggering click...');
        fileInput.click();

        // Also manually add event listener if missing
        if (!fileInput.onchange) {
            console.log('ðŸ”§ Adding missing event listener...');
            fileInput.addEventListener('change', handlePhotoUpload);
        }
    } else {
        console.error('âŒ No file input found at all!');
    }
};



// Profile Modal Functions
async function openProfileModal() {
    console.log('ðŸ‘¤ Opening profile modal...');

    const profileModal = document.getElementById('profileModal');
    if (!profileModal) {
        console.error('âŒ Profile modal not found!');
        return;
    }

    const userData = getCurrentUser();
    console.log('ðŸ“Š User data:', userData);

    if (userData) {
        // Populate profile form with current user data
        const profileFirstName = document.getElementById('profileFirstName');
        const profileLastName = document.getElementById('profileLastName');
        const profileEmail = document.getElementById('profileEmail');
        const profilePhone = document.getElementById('profilePhone');
        const profileBirthday = document.getElementById('profileBirthday');

        // Split the full name into first and last name
        if (userData.name) {
            const nameParts = userData.name.split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';

            if (profileFirstName) profileFirstName.value = firstName;
            if (profileLastName) profileLastName.value = lastName;
        } else {
            if (profileFirstName) profileFirstName.value = '';
            if (profileLastName) profileLastName.value = '';
        }

        if (profileEmail) profileEmail.value = userData.email || '';
        if (profilePhone) profilePhone.value = userData.phone || '';
        if (profileBirthday) profileBirthday.value = userData.birthday || '';

        // Update profile level/XP widgets
        const lvlLabel = document.getElementById('profileLevelLabel');
        const xpLabel = document.getElementById('profileXpLabel');
        const xpFill = document.getElementById('profileXpFill');
        if (lvlLabel && xpLabel && xpFill) {
            const level = userData.level ?? 1;
            const progress = userData.levelProgress ?? 0;
            const required = userData.requiredXP ?? 100;
            const currentXP = Math.round((progress / 100) * required);
            lvlLabel.textContent = `Level ${level}`;
            xpLabel.textContent = `${currentXP} / ${required} XP`;
            xpFill.style.width = `${Math.max(0, Math.min(100, progress))}%`;
        }

        // Set avatar - Get from server instead of localStorage
        const profileAvatarLarge = document.getElementById('profileAvatarLarge');
        if (profileAvatarLarge) {
            // ðŸ”§ FIX: Handle avatar placeholder before setting
            if (userData.avatar === 'custom_uploaded' || userData.avatar === 'custom_avatar_uploaded') {
                profileAvatarLarge.src = 'default.jpg';
                console.log('ðŸ–¼ï¸ Profile modal using default.jpg (placeholder detected)');
            } else if (userData.avatar_url && userData.avatar_url.startsWith('data:')) {
                profileAvatarLarge.src = userData.avatar_url;
                console.log('âœ… Profile modal loaded custom avatar from server');
            } else {
                await setUserAvatarFromServer(profileAvatarLarge, 'profile modal');
            }

            // Add error handling for profile modal avatar
            profileAvatarLarge.onerror = () => {
                console.error('âŒ profile modal avatar failed to load');
                profileAvatarLarge.src = 'default.jpg';
                console.log('ðŸ”„ Profile modal falling back to default.jpg');
            };

            // Wrap profile avatar with level ring (avoid duplicate wraps)
            try {
                const alreadyWrapped = profileAvatarLarge.parentElement && profileAvatarLarge.parentElement.classList && profileAvatarLarge.parentElement.classList.contains('avatar-level-container');
                if (!alreadyWrapped) {
                    const level = userData.level ?? 1;
                    const levelProgress = userData.levelProgress ?? 0;
                    const src = profileAvatarLarge.getAttribute('src') || 'default.jpg';
                    const ringContainer = createAvatarWithLevel(src, level, levelProgress);
                    // Bigger profile size and thicker ring
                    ringContainer.style.width = '120px';
                    ringContainer.style.height = '120px';
                    const ring = ringContainer.querySelector('.level-progress-ring');
                    if (ring) ring.style.padding = '10px';
                    const badge = ringContainer.querySelector('.level-badge');
                    if (badge) { badge.style.fontSize = '12px'; badge.style.minWidth = '20px'; }
                    // Preserve the id on the inner <img>
                    const innerImg = ringContainer.querySelector('img.user-avatar');
                    if (innerImg) innerImg.id = 'profileAvatarLarge';
                    profileAvatarLarge.parentElement.replaceChild(ringContainer, profileAvatarLarge);
                }
            } catch (wrapErr) {
                console.warn('âš ï¸ Failed to add level ring to profile avatar:', wrapErr);
            }
        }

        // ðŸ‘‘ ADMIN ENHANCEMENT: Show administrator badge and apply special styling
        const adminBadgeContainer = document.getElementById('adminBadgeContainer');
        const isAdmin = userData.is_admin || userData.isAdmin;

        if (isAdmin && adminBadgeContainer) {
            console.log('ðŸ‘‘ User is admin - showing administrator badge');
            adminBadgeContainer.style.display = 'block';
            profileModal.classList.add('admin-profile');

            // Add subtle animation to the badge
            setTimeout(() => {
                const adminBadge = adminBadgeContainer.querySelector('.admin-badge');
                if (adminBadge) {
                    adminBadge.style.animation = 'adminBadgeGlow 3s ease-in-out infinite';
                }
            }, 500);
        } else {
            if (adminBadgeContainer) {
                adminBadgeContainer.style.display = 'none';
            }
            profileModal.classList.remove('admin-profile');
        }
    }

    // Apply high-priority styling
    profileModal.style.setProperty('position', 'fixed', 'important');
    profileModal.style.setProperty('z-index', '99999', 'important');
    profileModal.style.setProperty('display', 'flex', 'important');
    profileModal.classList.add('show');
    document.body.style.overflow = 'hidden';

    console.log('âœ… Profile modal opened');
}

function closeProfileModal() {
    console.log('ðŸ‘¤ Closing profile modal...');

    const profileModal = document.getElementById('profileModal');
    if (!profileModal) {
        console.error('âŒ Profile modal not found!');
        return;
    }

    profileModal.style.setProperty('display', 'none', 'important');
    profileModal.style.setProperty('position', 'static', 'important');
    profileModal.style.setProperty('z-index', 'auto', 'important');
    profileModal.classList.remove('show');
    document.body.style.overflow = 'auto';

    console.log('âœ… Profile modal closed');
}

async function saveProfile() {
    console.log('ðŸš€ SAVE PROFILE FUNCTION CALLED!');

    // Get form values
    const profileFirstName = document.getElementById('profileFirstName').value.trim();
    const profileLastName = document.getElementById('profileLastName').value.trim();
    const profilePhone = document.getElementById('profilePhone').value.trim();
    const profileBirthday = document.getElementById('profileBirthday').value;

    console.log('ðŸ“ Profile form data:', {
        firstName: profileFirstName,
        lastName: profileLastName,
        phone: profilePhone,
        birthday: profileBirthday
    });

    // Validation
    if (!profileFirstName) {
        showNotification('First name is required', 'error');
        return;
    }

    // Validate first name format
    if (!/^[a-zA-Z\u00C0-\u017F\s'-]{1,50}$/.test(profileFirstName)) {
        showNotification('First name can only contain letters, spaces, hyphens, and apostrophes (max 50 characters)', 'error');
        return;
    }

    // Validate last name format if provided
    if (profileLastName && !/^[a-zA-Z\u00C0-\u017F\s'-]{0,50}$/.test(profileLastName)) {
        showNotification('Last name can only contain letters, spaces, hyphens, and apostrophes (max 50 characters)', 'error');
        return;
    }

    // Validate phone number format if provided
    if (profilePhone && !/^[\+]?[1-9][\d]{0,15}$/.test(profilePhone.replace(/[\s\-\(\)]/g, ''))) {
        showNotification('Please enter a valid phone number', 'error');
        return;
    }

    // Validate birthday if provided
    if (profileBirthday) {
        const birthday = new Date(profileBirthday);
        const today = new Date();
        const minDate = new Date('1900-01-01');

        if (birthday > today) {
            showNotification('Birthday cannot be in the future', 'error');
            return;
        }

        if (birthday < minDate) {
            showNotification('Please enter a valid birthday', 'error');
            return;
        }
    }

    // Get current user data
    const currentUserData = localStorage.getItem('user') || sessionStorage.getItem('user');
    const currentUser = currentUserData ? JSON.parse(currentUserData) : null;

    if (!currentUser) {
        showNotification('User data not found. Please log in again.', 'error');
        return;
    }

    // Prepare profile data with separate first/last names for server
    const fullName = `${profileFirstName} ${profileLastName || ''}`.trim();
    const profileData = {
        first_name: profileFirstName,
        last_name: profileLastName || '', // Empty string if no last name
        name: fullName, // Also include full name for compatibility
        phone: profilePhone || null,
        birthday: profileBirthday || null
    };

    // Include avatar only if it exists and is not a placeholder
    if (currentUser.avatar &&
        currentUser.avatar !== 'default.jpg' &&
        currentUser.avatar !== 'custom_avatar_uploaded' &&
        currentUser.avatar.startsWith('data:')) {
        profileData.avatar = currentUser.avatar;
    }

    console.log('ðŸ“¤ Sending profile data to server:', {
        name: profileData.name,
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        hasAvatar: !!profileData.avatar
    });

    try {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        if (!token) {
            showNotification('Please log in again', 'error');
            return;
        }

        console.log('ðŸ”„ Sending profile update to server:', profileData);

        // Show loading state
        const saveBtn = document.getElementById('profileSaveBtn');
        const originalText = saveBtn ? saveBtn.textContent : '';
        if (saveBtn) {
            saveBtn.textContent = 'Saving...';
            saveBtn.disabled = true;
        }

        try {
            // Try to update via API first
            const response = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(profileData)
            });

            const data = await response.json();

            if (data.success) {
                console.log('âœ… Profile updated via API successfully');
                const updatedUser = data.user;

                // Update local storage safely (avoid QuotaExceededError)
                const storage = localStorage.getItem('authToken') ? localStorage : sessionStorage;

                // Create safe user data without large base64 images
                const safeUserData = {
                    id: updatedUser.id,
                    first_name: updatedUser.first_name,
                    last_name: updatedUser.last_name,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    phone: updatedUser.phone,
                    birthday: updatedUser.birthday,
                    isAdmin: updatedUser.is_admin,
                    email_verified: updatedUser.email_verified,
                    is_banned: updatedUser.is_banned
                };

                // Handle avatar safely - avoid storing large base64 images
                if (updatedUser.avatar_url && updatedUser.avatar_url.startsWith('data:')) {
                    safeUserData.avatar = 'custom_avatar_uploaded';
                    safeUserData.hasCustomAvatar = true;
                } else {
                    safeUserData.avatar = updatedUser.avatar || 'default.jpg';
                    safeUserData.hasCustomAvatar = false;
                }

                try {
                    storage.setItem('user', JSON.stringify(safeUserData));
                    console.log('âœ… User data stored safely (prevents logout on refresh)');
                } catch (error) {
                    console.error('âŒ Error storing user data:', error);
                }

                // Update UI immediately with full user data (including avatar)
                await updateUIForLoggedInUser(updatedUser);

                // CRITICAL: Update AuthStateManager to prevent logout on refresh
                if (window.authStateManager) {
                    await window.authStateManager.updateUser(updatedUser);
                    console.log('âœ… AuthStateManager updated with new user data');
                } else {
                    console.log('âš ï¸ AuthStateManager not available, using fallback UI update');
                }

                // ðŸš€ REAL-TIME UPDATE: Update all existing reviews with new profile data (API SUCCESS PATH)
                console.log('ðŸš€ STARTING REAL-TIME PROFILE UPDATE (API SUCCESS)...');
                console.log('ðŸ“ Updated user data:', updatedUser);

                if (window.reviewsManager) {
                    console.log('ðŸ”„ About to update profile in database reviews...');
                    try {
                        // Get the updated user data from the server response
                        const serverUser = updatedUser;

                        // Construct the full name properly
                        let fullName = serverUser.name;
                        if (!fullName) {
                            fullName = `${serverUser.first_name || ''} ${serverUser.last_name || ''}`.trim();
                        }
                        if (!fullName) {
                            fullName = profileData.name; // Fallback to what we sent
                        }

                        // Get avatar - prefer avatar_url from server, fallback to what we sent
                        let avatarForReviews = serverUser.avatar_url || serverUser.avatar;
                        if (!avatarForReviews || avatarForReviews === 'custom_avatar_uploaded') {
                            avatarForReviews = profileData.avatar || 'default.jpg';
                        }

                        console.log('ðŸ“ Profile update data for reviews:', {
                            name: fullName,
                            avatar: avatarForReviews ? avatarForReviews.substring(0, 50) + '...' : 'default.jpg',
                            avatarLength: avatarForReviews ? avatarForReviews.length : 0
                        });

                        if (fullName && fullName !== 'undefined') {
                            const success = await window.reviewsManager.updateUserProfileInDatabase(fullName, avatarForReviews);
                            if (success) {
                                console.log('âœ… Database updated successfully - refreshing UI...');
                                // Force refresh all reviews from database to show changes immediately
                                await window.reviewsManager.loadAllReviews();
                                // Also refresh review forms to show updated avatar
                                window.reviewsManager.refreshReviewForms();
                                console.log('ðŸŽ‰ REAL-TIME UPDATE COMPLETE! All reviews should now show updated profile.');
                            } else {
                                console.error('âŒ Database update failed');
                            }
                        } else {
                            console.log('âš ï¸ Skipping reviews update - no valid name available');
                        }
                    } catch (error) {
                        console.error('âŒ Error updating profile in database reviews:', error);
                    }
                } else {
                    console.log('âš ï¸ Reviews manager not available');
                }

                showNotification('Profile updated successfully', 'success');
                closeProfileModal();
                return;
            }
        } catch (apiError) {
            console.log('âš ï¸ API not available, updating locally:', apiError.message);
        }

        // Fallback: Update local storage directly (API not available)
        console.log('ðŸ’¾ Updating profile locally (API not available)');
        const storage = localStorage.getItem('authToken') ? localStorage : sessionStorage;

        // Create updated user object for fallback
        const updatedUser = {
            ...currentUser,
            first_name: profileData.first_name,
            last_name: profileData.last_name,
            name: `${profileData.first_name} ${profileData.last_name}`.trim(),
            phone: profileData.phone,
            birthday: profileData.birthday
        };

        // Include avatar if provided
        if (profileData.avatar) {
            updatedUser.avatar = profileData.avatar;
            updatedUser.avatar_url = profileData.avatar;
        }

        // Create safe user data without large base64 images
        const safeUserData = {
            id: updatedUser.id,
            first_name: updatedUser.first_name,
            last_name: updatedUser.last_name,
            name: updatedUser.name,
            email: updatedUser.email,
            phone: updatedUser.phone,
            birthday: updatedUser.birthday,
            isAdmin: updatedUser.isAdmin,
            email_verified: updatedUser.email_verified,
            is_banned: updatedUser.is_banned
        };

        // Handle avatar safely
        if (updatedUser.avatar && updatedUser.avatar.startsWith('data:')) {
            safeUserData.avatar = 'custom_avatar_uploaded';
            safeUserData.hasCustomAvatar = true;
        } else {
            safeUserData.avatar = updatedUser.avatar || 'default.jpg';
            safeUserData.hasCustomAvatar = false;
        }

        try {
            storage.setItem('user', JSON.stringify(safeUserData));
            console.log('âœ… User data stored safely (fallback mode)');
        } catch (error) {
            console.error('âŒ Error storing user data:', error);
        }

        // CRITICAL: Update AuthStateManager to prevent logout on refresh (FALLBACK PATH)
        if (window.authStateManager) {
            await window.authStateManager.updateUser(updatedUser);
            console.log('âœ… AuthStateManager updated with new user data (fallback)');
        } else {
            // Fallback: Update UI directly
            await updateUIForLoggedInUser(updatedUser);
            console.log('âš ï¸ AuthStateManager not available, using direct UI update');
        }

        // ðŸš€ REAL-TIME UPDATE: Update all existing reviews with new profile data
        console.log('ðŸš€ STARTING REAL-TIME PROFILE UPDATE...');
        console.log('ðŸ“ Updated user data:', updatedUser);
        console.log('ðŸ” Checking if reviews manager exists...');

        if (window.reviewsManager) {
            console.log('ðŸ”„ About to update profile in database reviews (fallback)...');
            try {
                // In fallback mode, use the data we constructed locally
                const fullName = updatedUser.name;
                const avatarForReviews = updatedUser.avatar || updatedUser.avatar_url || 'default.jpg';

                console.log('ðŸ“ Profile update data for reviews (fallback):', {
                    name: fullName,
                    avatar: avatarForReviews ? avatarForReviews.substring(0, 50) + '...' : 'default.jpg',
                    avatarLength: avatarForReviews ? avatarForReviews.length : 0
                });

                if (fullName && fullName !== 'undefined') {
                    const success = await window.reviewsManager.updateUserProfileInDatabase(fullName, avatarForReviews);
                    if (success) {
                        console.log('âœ… Database updated successfully - refreshing UI...');
                        // Force refresh all reviews from database to show changes immediately
                        await window.reviewsManager.loadAllReviews();
                        // Also refresh review forms to show updated avatar
                        window.reviewsManager.refreshReviewForms();
                        console.log('ðŸŽ‰ REAL-TIME UPDATE COMPLETE! All reviews should now show updated profile.');
                    } else {
                        console.error('âŒ Database update failed');
                    }
                } else {
                    console.log('âš ï¸ Skipping reviews update - no valid name available (fallback)');
                }
            } catch (error) {
                console.error('âŒ Error updating profile in database reviews:', error);
            }
        } else {
            console.log('âš ï¸ Reviews manager not available');
        }

        showNotification('Profile updated successfully', 'success');

        // ðŸš€ ENHANCED: Automatically refresh comment sections and update all avatars
        console.log('ðŸ”„ Refreshing comment sections and updating avatars...');
        await refreshAllCommentSections();

        closeProfileModal();

    } catch (error) {
        console.error('âŒ Profile update error:', error);
        showNotification('Failed to update profile. Please try again.', 'error');
    } finally {
        // Reset button state
        const saveBtn = document.getElementById('profileSaveBtn');
        if (saveBtn) {
            saveBtn.textContent = 'Save Changes';
            saveBtn.disabled = false;
        }
    }
}

// ðŸš€ ENHANCED: Refresh all comment sections and update avatars after profile changes
async function refreshAllCommentSections() {
    console.log('ðŸ”„ Starting comprehensive comment section refresh...');

    try {
        // Get current user data
        const currentUser = getCurrentUser();
        if (!currentUser) {
            console.log('âš ï¸ No current user found, skipping refresh');
            return;
        }

        console.log('ðŸ‘¤ Current user for refresh:', currentUser);

        // Update all avatar images in the page
        updateAllAvatarImages(currentUser);

        // Update profile modal if open
        updateProfileModalData(currentUser);

        // Refresh all review sections and replies
        const fragrances = ['layton', 'haltane', 'pegasus'];

        for (const fragrance of fragrances) {
            console.log(`ðŸ”„ Refreshing ${fragrance} reviews and replies...`);

            // Update review form avatar and username
            updateReviewFormUserInfo(fragrance, currentUser);

            // Reload reviews to show updated user info
            if (window.reviewsManager) {
                try {
                    await window.reviewsManager.loadReviews(fragrance);
                    console.log(`âœ… ${fragrance} reviews refreshed`);
                } catch (error) {
                    console.error(`âŒ Error refreshing ${fragrance} reviews:`, error);
                }
            }
        }

        // ðŸ”§ NEW: Refresh all replies to show updated profile
        if (window.reviewsManager) {
            try {
                console.log('ðŸ”„ Refreshing all replies with updated profile...');
                await window.reviewsManager.refreshAllReplies();
                console.log('âœ… All replies refreshed with updated profile');
            } catch (error) {
                console.error('âŒ Error refreshing replies:', error);
            }
        }

        // Update navigation bar user info
        updateNavigationUserInfo(currentUser);

        console.log('âœ… Comment section refresh completed successfully');

    } catch (error) {
        console.error('âŒ Error during comment section refresh:', error);
    }
}

// Update all avatar images throughout the page
function updateAllAvatarImages(user) {
    console.log('ðŸ–¼ï¸ Updating all avatar images...');

    if (!user.avatar) {
        console.log('âš ï¸ No avatar URL found for user');
        return;
    }

    // Update all avatar images with the user's avatar
    const avatarSelectors = [
        '.user-avatar img',
        '.user-avatar-small img',
        '.review-avatar img',
        '.reply-avatar img',
        '#profileAvatar',
        '.navbar-avatar img',
        '.admin-avatar img'
    ];

    avatarSelectors.forEach(selector => {
        const avatars = document.querySelectorAll(selector);
        avatars.forEach(avatar => {
            if (avatar) {
                avatar.src = user.avatar;
                console.log(`âœ… Updated avatar: ${selector}`);
            }
        });
    });
}

// Update profile modal data
function updateProfileModalData(user) {
    console.log('ðŸ“‹ Updating profile modal data...');

    const profileAvatar = document.getElementById('profileAvatar');
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');

    if (profileAvatar && user.avatar) {
        profileAvatar.src = user.avatar;
        console.log('âœ… Updated profile modal avatar');
    }

    if (profileName && user.name) {
        profileName.textContent = user.name;
        console.log('âœ… Updated profile modal name');
    }

    if (profileEmail && user.email) {
        profileEmail.textContent = user.email;
        console.log('âœ… Updated profile modal email');
    }
}

// Update review form user info
function updateReviewFormUserInfo(fragrance, user) {
    console.log(`ðŸ“ Updating ${fragrance} review form user info...`);

    const reviewAvatar = document.getElementById(`${fragrance}-review-avatar`);
    const reviewUsername = document.getElementById(`${fragrance}-review-username`);

    if (reviewAvatar) {
        const avatarImg = reviewAvatar.querySelector('img');
        if (avatarImg && user.avatar) {
            avatarImg.src = user.avatar;
            console.log(`âœ… Updated ${fragrance} review form avatar`);
        }
    }

    if (reviewUsername && user.name) {
        reviewUsername.textContent = user.name;
        console.log(`âœ… Updated ${fragrance} review form username`);
    }

    // Also update reply form avatars if they exist
    const replyAvatars = document.querySelectorAll(`[id^="reply-avatar-"]`);
    const replyUsernames = document.querySelectorAll(`[id^="reply-username-"]`);

    replyAvatars.forEach(avatar => {
        if (avatar && user.avatar) {
            avatar.src = user.avatar;
        }
    });

    replyUsernames.forEach(username => {
        if (username && user.name) {
            username.textContent = user.name;
        }
    });
}

// Update navigation bar user info
function updateNavigationUserInfo(user) {
    console.log('ðŸ§­ Updating navigation user info...');

    const userName = document.getElementById('userName');
    const userAvatar = document.querySelector('.navbar-avatar img');

    if (userName && user.name) {
        userName.textContent = user.name;
        console.log('âœ… Updated navigation username');
    }

    if (userAvatar && user.avatar) {
        userAvatar.src = user.avatar;
        console.log('âœ… Updated navigation avatar');
    }
}

// New function to refresh user profile data from server
async function refreshUserProfile() {
    try {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

        if (!token) {
            console.log('No auth token found, skipping profile refresh');
            return false;
        }

        console.log('ðŸ”„ Refreshing user profile from server...');

        try {
            const response = await fetch('/api/user/profile', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.success && data.user) {
                // Update stored user data with fresh data from server
                const storage = localStorage.getItem('authToken') ? localStorage : sessionStorage;
                storage.setItem('user', JSON.stringify(data.user));

                // Update UI with fresh data
                await updateUIForLoggedInUser(data.user);

                console.log('âœ… User profile refreshed successfully:', data.user);
                return true;
            } else {
                console.error('âŒ Failed to refresh user profile:', data.error);
                throw new Error(data.error || 'Failed to refresh user profile');
            }
        } catch (apiError) {
            console.log('âš ï¸ API not available, using cached user data:', apiError.message);

            // Fallback: Use cached user data and update UI
            const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
            if (userData) {
                const user = JSON.parse(userData);
                await updateUIForLoggedInUser(user);
                console.log('âœ… UI updated with cached user data:', user);
                return true;
            } else {
                throw new Error('No cached user data available');
            }
        }
    } catch (error) {
        console.error('âŒ Error refreshing user profile:', error.message);
        throw error; // Re-throw so caller can handle appropriately
    }
}

// Comprehensive user data synchronization system
async function syncUserData() {
    try {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

        if (!token) {
            console.log('No auth token found, skipping user data sync');
            return;
        }

        // Fetch fresh user data and settings
        const [profileData, settingsData] = await Promise.all([
            fetch('/api/user/profile', {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            }).then(res => res.json()),

            fetch('/api/user/settings', {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            }).then(res => res.json())
        ]);

        // Update user profile data
        if (profileData.success && profileData.user) {
            const storage = localStorage.getItem('authToken') ? localStorage : sessionStorage;
            storage.setItem('user', JSON.stringify(profileData.user));
            await updateUIForLoggedInUser(profileData.user);
        }

        // Update user settings
        if (settingsData.success && settingsData.settings) {
            localStorage.setItem('userSettings', JSON.stringify(settingsData.settings));
        }

        console.log('âœ… User data synchronized successfully');
        return true;
    } catch (error) {
        console.error('Error synchronizing user data:', error);
        return false;
    }
}

// Validate user data integrity - ROBUST validation to prevent logout issues
function validateUserData(userData) {
    if (!userData) {
        console.error('Invalid user data: userData is null or undefined');
        return false;
    }

    // Parse userData if it's a string
    let user = userData;
    if (typeof userData === 'string') {
        try {
            user = JSON.parse(userData);
        } catch (error) {
            console.error('Invalid user data: failed to parse JSON', error);
            return false;
        }
    }

    // Check required fields - email is essential
    if (!user.email) {
        console.error('Invalid user data: missing email field');
        return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
        console.error('Invalid user data: invalid email format');
        return false;
    }

    // CRITICAL FIX: Normalize data structure to prevent validation failures
    // Handle both server format (is_admin) and client format (isAdmin)
    if (user.is_admin !== undefined && user.isAdmin === undefined) {
        user.isAdmin = user.is_admin;
    }
    if (user.isAdmin !== undefined && user.is_admin === undefined) {
        user.is_admin = user.isAdmin;
    }

    // Construct name if missing but first_name exists
    if (!user.name && user.first_name) {
        user.name = `${user.first_name} ${user.last_name || ''}`.trim();
        console.log('âœ… Constructed name from first_name and last_name:', user.name);
    }

    // Ensure name exists (fallback to email username)
    if (!user.name || user.name.trim() === '') {
        user.name = user.email.split('@')[0];
        console.log('âœ… Fallback name from email:', user.name);
    }

    // Log successful validation with detailed info
    console.log('âœ… User data validation passed:', {
        id: user.id,
        email: user.email,
        name: user.name,
        hasFirstName: !!user.first_name,
        hasLastName: !!user.last_name,
        isAdmin: user.isAdmin,
        is_admin: user.is_admin,
        hasAvatar: !!user.avatar,
        hasCustomAvatar: !!user.hasCustomAvatar
    });

    return true;
}

// Test function for user data validation
window.testUserDataValidation = function() {
    console.log('ðŸ§ª TESTING USER DATA VALIDATION...');

    // Test server format data
    const serverData = {
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        is_admin: true,
        avatar_url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
    };

    console.log('Testing server format:', validateUserData(serverData));

    // Test client format data
    const clientData = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        isAdmin: true,
        avatar: 'custom_avatar_uploaded'
    };

    console.log('Testing client format:', validateUserData(clientData));

    // Test mixed format data
    const mixedData = {
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        name: 'John Doe',
        email: 'john@example.com',
        is_admin: true,
        isAdmin: true,
        avatar: 'default.jpg'
    };

    console.log('Testing mixed format:', validateUserData(mixedData));
};

// Test function for AuthStateManager
window.testAuthStateManager = function() {
    console.log('ðŸ§ª TESTING AUTH STATE MANAGER...');

    if (!window.authStateManager) {
        console.error('âŒ AuthStateManager not found!');
        return;
    }

    console.log('âœ… AuthStateManager found');
    console.log('Current user:', window.authStateManager.getCurrentUser());
    console.log('Is logged in:', window.authStateManager.isLoggedIn());
    console.log('Auth token exists:', !!window.authStateManager.getAuthToken());
};

// Enhanced authentication state manager
class AuthStateManager {
    constructor() {
        this.isInitialized = false;
        this.currentUser = null;
        this.authToken = null;
    }

    // Initialize authentication state
    async initialize() {
        if (this.isInitialized) return;

        console.log('ðŸ” Initializing authentication state...');

        // Clean up any stale data first
        this.cleanupStaleData();

        // Load current authentication state
        await this.loadAuthState();

        this.isInitialized = true;
        console.log('âœ… Authentication state initialized');
    }

    // Clean up stale or invalid user data
    cleanupStaleData() {
        console.log('ðŸ§¹ Checking for stale user data...');

        const userDataStr = localStorage.getItem('user') || sessionStorage.getItem('user');
        const authToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

        let needsCleanup = false;

        // Check if we have user data but no auth token
        if (userDataStr && !authToken) {
            console.log('âš ï¸ Found user data without auth token');
            needsCleanup = true;
        }

        // Check if user data is invalid
        if (userDataStr) {
            try {
                const user = JSON.parse(userDataStr);
                if (!validateUserData(user)) {
                    console.log('âš ï¸ Found invalid user data');
                    needsCleanup = true;
                }
            } catch (error) {
                console.log('âš ï¸ Found corrupted user data');
                needsCleanup = true;
            }
        }

        if (needsCleanup) {
            console.log('ðŸ§¹ Cleaning up stale or invalid user data');
            this.clearAuthData();
            return true;
        }

        console.log('âœ… No stale user data found');
        return false;
    }

    // Clear all authentication data
    clearAuthData() {
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('authToken');
        localStorage.removeItem('userSettings');

        this.currentUser = null;
        this.authToken = null;

        // Ensure UI is in logged out state
        const userLoggedOut = document.getElementById('userLoggedOut');
        const userLoggedIn = document.getElementById('userLoggedIn');

        if (userLoggedOut) userLoggedOut.style.display = 'block';
        if (userLoggedIn) userLoggedIn.style.display = 'none';

        console.log('ðŸ§¹ Authentication data cleared');
    }

    // Load authentication state from storage
    async loadAuthState() {
        const authToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        const userDataStr = localStorage.getItem('user') || sessionStorage.getItem('user');

        if (!authToken || !userDataStr) {
            console.log('ðŸ‘¤ No authentication data found');
            return false;
        }

        try {
            const userData = JSON.parse(userDataStr);

            // Validate user data
            if (!validateUserData(userData)) {
                console.log('âŒ Invalid user data found, clearing...');
                this.clearAuthData();
                return false;
            }

            // Set current state
            this.authToken = authToken;
            this.currentUser = userData;

            // Update UI only if the function is available (DOM ready)
            if (typeof window.updateUIForLoggedInUser === 'function') {
                await window.updateUIForLoggedInUser(userData);
                console.log('âœ… UI updated during auth state loading');
            } else {
                console.log('â³ UI update deferred - DOM not ready yet');
            }

            console.log('âœ… Authentication state loaded successfully');
            return true;

        } catch (error) {
            console.error('âŒ Error loading authentication state:', error);
            this.clearAuthData();
            return false;
        }
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Get current auth token
    getAuthToken() {
        return this.authToken;
    }

    // Check if user is logged in
    isLoggedIn() {
        return !!(this.authToken && this.currentUser);
    }

    // Update user data
    async updateUser(userData) {
        if (!userData) return false;

        try {
            // Validate new user data
            if (!validateUserData(userData)) {
                console.error('âŒ Invalid user data provided for update');
                return false;
            }

            // Update current user
            this.currentUser = userData;

            // Update storage
            const storage = localStorage.getItem('authToken') ? localStorage : sessionStorage;

            // Create safe user data for storage
            const safeUserData = this.createSafeUserData(userData);
            storage.setItem('user', JSON.stringify(safeUserData));

            // Update UI
            await updateUIForLoggedInUser(userData);

            console.log('âœ… User data updated successfully');
            return true;

        } catch (error) {
            console.error('âŒ Error updating user data:', error);
            return false;
        }
    }

    // Create safe user data for storage (avoid large base64 images)
    createSafeUserData(userData) {
        console.log('ðŸ”’ Creating safe user data from:', userData);

        // CRITICAL: Ensure consistent data structure to prevent validation failures
        const safeData = {
            id: userData.id,
            first_name: userData.first_name || '',
            last_name: userData.last_name || '',
            name: userData.name || `${userData.first_name || ''} ${userData.last_name || ''}`.trim(),
            email: userData.email,
            phone: userData.phone || '',
            birthday: userData.birthday || '',
            // CRITICAL: Handle both server format (is_admin) and client format (isAdmin)
            isAdmin: userData.isAdmin || userData.is_admin || false,
            is_admin: userData.is_admin || userData.isAdmin || false,
            email_verified: userData.email_verified || false,
            is_banned: userData.is_banned || false,
            created_at: userData.created_at,
            updated_at: userData.updated_at
        };

        // Ensure name is never empty (fallback to email username)
        if (!safeData.name || safeData.name.trim() === '') {
            safeData.name = userData.email.split('@')[0];
            console.log('âœ… Used email username as fallback name:', safeData.name);
        }

        // Handle avatar safely - NEVER store large base64 images
        if (userData.avatar_url && userData.avatar_url.startsWith('data:')) {
            safeData.avatar = 'custom_avatar_uploaded';
            safeData.hasCustomAvatar = true;
            console.log('ðŸ–¼ï¸ Large avatar detected, using placeholder');
        } else {
            safeData.avatar = userData.avatar || userData.avatar_url || 'default.jpg';
            safeData.hasCustomAvatar = false;
            console.log('ðŸ–¼ï¸ Small/default avatar stored directly');
        }

        console.log('âœ… Safe user data created:', {
            id: safeData.id,
            name: safeData.name,
            email: safeData.email,
            isAdmin: safeData.isAdmin,
            hasCustomAvatar: safeData.hasCustomAvatar
        });

        return safeData;
    }

    // Refresh user session from server
    async refreshSession() {
        if (!this.authToken) {
            console.log('ðŸ‘¤ No auth token available for refresh');
            return false;
        }

        try {
            const response = await fetch('/api/user/profile', {
                headers: { 'Authorization': `Bearer ${this.authToken}` }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success && data.user) {
                    await this.updateUser(data.user);
                    console.log('âœ… User session refreshed from server');
                    return true;
                }
            }

            console.log('âš ï¸ Failed to refresh session from server');
            return false;

        } catch (error) {
            console.error('âŒ Error refreshing session:', error);
            return false;
        }
    }
}

// Create global auth state manager
window.authStateManager = new AuthStateManager();

// Legacy function for backward compatibility
function cleanupStaleUserData() {
    return window.authStateManager.cleanupStaleData();
}

// Favorites Modal Functions
function openFavoritesModal() {
    console.log('â­ Opening favorites modal...');

    const favoritesModal = document.getElementById('favoritesModal');
    if (!favoritesModal) {
        console.error('âŒ Favorites modal not found!');
        return;
    }

    // Apply high-priority styling
    favoritesModal.style.setProperty('position', 'fixed', 'important');
    favoritesModal.style.setProperty('z-index', '99999', 'important');
    favoritesModal.style.setProperty('display', 'flex', 'important');
    favoritesModal.classList.add('show');
    document.body.style.overflow = 'hidden';

    // Use the enhanced favorites manager to show beautiful product cards
    if (window.favoritesManager) {
        window.favoritesManager.updateFavoritesModal();
        console.log('âœ… Enhanced favorites modal opened with product cards!');
    } else {
        // Fallback to old method if favoritesManager not available
        loadFavorites();
        console.log('âš ï¸ Using fallback favorites loading');
    }

    console.log('âœ… Favorites modal opened');
}

function closeFavoritesModal() {
    console.log('â­ Closing favorites modal...');

    const favoritesModal = document.getElementById('favoritesModal');
    if (!favoritesModal) {
        console.error('âŒ Favorites modal not found!');
        return;
    }

    favoritesModal.style.setProperty('display', 'none', 'important');
    favoritesModal.style.setProperty('position', 'static', 'important');
    favoritesModal.style.setProperty('z-index', 'auto', 'important');
    favoritesModal.classList.remove('show');
    document.body.style.overflow = 'auto';

    console.log('âœ… Favorites modal closed');
}

async function loadFavorites() {
    const favoritesContent = document.getElementById('favoritesContent');

    try {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        if (!token) {
            favoritesContent.innerHTML = `
                <div class="empty-favorites">
                    <svg viewBox="0 0 24 24" width="48" height="48" style="color: rgba(255,255,255,0.3);">
                        <path fill="currentColor" d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5 2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"/>
                    </svg>
                    <h3>Please log in</h3>
                    <p>Sign in to view your favorite fragrances!</p>
                </div>
            `;
            return;
        }

        const response = await fetch('/api/user/favorites', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (data.success) {
            const favorites = data.favorites;

            if (favorites.length === 0) {
                favoritesContent.innerHTML = `
                    <div class="empty-favorites">
                        <svg viewBox="0 0 24 24" width="48" height="48" style="color: rgba(255,255,255,0.3);">
                            <path fill="currentColor" d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5 2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"/>
                        </svg>
                        <h3>No favorites yet</h3>
                        <p>Start exploring our fragrances and add your favorites here!</p>
                    </div>
                `;
            } else {
                favoritesContent.innerHTML = `
                    <div class="favorites-list">
                        <p style="color: rgba(255,255,255,0.8); text-align: center; padding: 40px;">
                            You have ${favorites.length} favorite${favorites.length !== 1 ? 's' : ''}
                        </p>
                        <p style="color: rgba(255,255,255,0.6); text-align: center; font-size: 14px;">
                            Favorites functionality will be fully implemented with product integration
                        </p>
                    </div>
                `;
            }
        } else {
            throw new Error(data.error || 'Failed to load favorites');
        }
    } catch (error) {
        console.error('Favorites load error:', error);
        favoritesContent.innerHTML = `
            <div class="empty-favorites">
                <svg viewBox="0 0 24 24" width="48" height="48" style="color: rgba(255,255,255,0.3);">
                    <path fill="currentColor" d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5 2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"/>
                </svg>
                <h3>Error loading favorites</h3>
                <p>Please try again later</p>
            </div>
        `;
    }
}

// Settings Modal Functions
function openSettingsModal() {
    console.log('âš™ï¸ Opening settings modal...');

    const settingsModal = document.getElementById('settingsModal');
    if (!settingsModal) {
        console.error('âŒ Settings modal not found!');
        return;
    }

    // Apply high-priority styling
    settingsModal.style.setProperty('position', 'fixed', 'important');
    settingsModal.style.setProperty('z-index', '99999', 'important');
    settingsModal.style.setProperty('display', 'flex', 'important');
    settingsModal.classList.add('show');
    document.body.style.overflow = 'hidden';

    loadUserSettings();
    console.log('âœ… Settings modal opened');
}

function closeSettingsModal() {
    console.log('âš™ï¸ Closing settings modal...');

    const settingsModal = document.getElementById('settingsModal');
    if (!settingsModal) {
        console.error('âŒ Settings modal not found!');
        return;
    }

    settingsModal.style.setProperty('display', 'none', 'important');
    settingsModal.style.setProperty('position', 'static', 'important');
    settingsModal.style.setProperty('z-index', 'auto', 'important');
    settingsModal.classList.remove('show');
    document.body.style.overflow = 'auto';

    console.log('âœ… Settings modal closed');
}

async function loadUserSettings() {
    try {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        if (!token) {
            // Use default settings if not logged in
            document.getElementById('emailNotifications').checked = true;
            document.getElementById('smsNotifications').checked = false;
            document.getElementById('profileVisibility').checked = true;
            document.getElementById('dataCollection').checked = true;
            return;
        }

        const response = await fetch('/api/user/settings', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (data.success) {
            const settings = data.settings;
            document.getElementById('emailNotifications').checked = settings.emailNotifications;
            document.getElementById('smsNotifications').checked = settings.smsNotifications;
            document.getElementById('profileVisibility').checked = settings.profileVisibility;
            document.getElementById('dataCollection').checked = settings.dataCollection;
        }
    } catch (error) {
        console.error('Settings load error:', error);
        // Use default settings on error
        document.getElementById('emailNotifications').checked = true;
        document.getElementById('smsNotifications').checked = false;
        document.getElementById('profileVisibility').checked = true;
        document.getElementById('dataCollection').checked = true;
    }
}

async function saveSettings() {
    const settings = {
        emailNotifications: document.getElementById('emailNotifications').checked,
        smsNotifications: document.getElementById('smsNotifications').checked,
        profileVisibility: document.getElementById('profileVisibility').checked,
        dataCollection: document.getElementById('dataCollection').checked
    };

    try {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        if (!token) {
            showNotification('Please log in again', 'error');
            return;
        }

        const response = await fetch('/api/user/settings', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(settings)
        });

        const data = await response.json();

        if (data.success) {
            showNotification(data.message, 'success');
            closeSettingsModal();
        } else {
            showNotification(data.error || 'Failed to save settings', 'error');
        }
    } catch (error) {
        console.error('Settings save error:', error);
        showNotification('Network error. Please try again.', 'error');
    }
}

// Helper Functions
function getStorageMethod() {
    // Prefer localStorage, fallback to sessionStorage
    try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        return localStorage;
    } catch (error) {
        console.warn('localStorage not available, using sessionStorage');
        return sessionStorage;
    }
}

function getCurrentUser() {
    // Use the auth state manager if available
    if (window.authStateManager && window.authStateManager.isLoggedIn()) {
        return window.authStateManager.getCurrentUser();
    }

    // Fallback to direct storage access
    const userDataStr = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (!userDataStr) return null;

    try {
        const userData = JSON.parse(userDataStr);

        // Ensure name field exists for backward compatibility
        if (!userData.name && userData.first_name) {
            userData.name = `${userData.first_name} ${userData.last_name || ''}`.trim();
        }

        return userData;
    } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
    }
}

function updateUserUI(userData) {
    const userAvatar = document.getElementById('userAvatar');
    const userName = document.getElementById('userName');

    if (userAvatar) {
        // Use custom avatar if available, otherwise default.jpg
        let avatarUrl = 'default.jpg';
        if (userData.avatar &&
            userData.avatar !== 'default.jpg' &&
            userData.avatar !== 'custom_uploaded' &&
            !userData.avatar.includes('ui-avatars.com')) {

            // Validate base64 images before using them
            if (userData.avatar.startsWith('data:image/')) {
                const base64Part = userData.avatar.split(',')[1];
                if (base64Part && base64Part.length > 100 && base64Part.length < 1000000) {
                    // Base64 looks valid (not too short, not too long)
                    avatarUrl = userData.avatar;
                    console.log('ðŸ–¼ï¸ updateUserUI - Using validated custom uploaded avatar');
                } else {
                    console.error('âŒ updateUserUI - Invalid base64 avatar data, using default');
                    avatarUrl = 'default.jpg';
                }
            } else {
                avatarUrl = userData.avatar;
                console.log('ðŸ–¼ï¸ updateUserUI - Using custom uploaded avatar (file path)');
            }
        } else if (userData.avatar === 'custom_uploaded' || userData.avatar === 'custom_avatar_uploaded') {
            // Handle the case where we stored placeholder to avoid localStorage quota
            avatarUrl = 'default.jpg';
            console.log('ðŸ–¼ï¸ updateUserUI - avatar placeholder detected, using default.jpg');
        } else {
            console.log('ðŸ–¼ï¸ updateUserUI - Using default avatar');
        }

        // ðŸ†• Level System: Replace simple avatar with level-enabled avatar
        const level = userData.level || 1;
        const levelProgress = userData.levelProgress || 0;

        console.log(`ðŸŽ® Level System Debug - User data:`, {
            level: level,
            levelProgress: levelProgress,
            avatarUrl: avatarUrl,
            hasUserAvatar: !!userAvatar,
            userAvatarParent: userAvatar ? userAvatar.parentElement : null
        });

        // Create avatar container with level system
        const avatarContainer = createAvatarWithLevel(avatarUrl, level, levelProgress);
        console.log(`ðŸŽ® Created avatar container:`, avatarContainer);

        // Replace the existing avatar with the new container
        const userProfile = userAvatar.parentElement;
        if (userProfile) {
            console.log(`ðŸŽ® Replacing avatar in parent:`, userProfile);
            userProfile.replaceChild(avatarContainer, userAvatar);

            // Add admin class if user is admin
            if (userData.is_admin) {
                userProfile.classList.add('admin-user');
                console.log(`ðŸŽ® Added admin-user class`);
            }

            console.log(`ðŸŽ® Navigation avatar updated with level ${level} (${levelProgress}% progress)`);
        } else {
            // Fallback: just update the src if no parent container
            userAvatar.src = avatarUrl;

            // Add comprehensive error handling
            userAvatar.onerror = () => {
                console.error('âŒ navigation avatar failed to load:', avatarUrl.substring(0, 50) + '...');
                if (avatarUrl !== 'default.jpg') {
                    console.log('ðŸ”„ updateUserUI falling back to default.jpg');
                    userAvatar.src = 'default.jpg';

                    // Also clean up the corrupted data in localStorage
                    const currentUser = getCurrentUser();
                    if (currentUser && currentUser.avatar && currentUser.avatar.startsWith('data:')) {
                        console.log('ðŸ§¹ Cleaning corrupted avatar from localStorage');
                        currentUser.avatar = 'default.jpg';
                        const storage = localStorage.getItem('authToken') ? localStorage : sessionStorage;
                        try {
                            storage.setItem('user', JSON.stringify(currentUser));
                        } catch (error) {
                            console.error('âŒ Error cleaning localStorage:', error);
                        }
                    }
                }
            };
        }
    }

    if (userName) {
        userName.textContent = userData.name || 'User';
    }

    // Update profile form data
    updateProfileFormData(userData);

    // Re-apply admin styling if needed
    checkAndApplyAdminStyling(userData.email);

    console.log('âœ… User UI updated:', userData);
}

// User Settings Persistence Functions
async function loadUserSettings() {
    try {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

        if (!token) {
            console.log('No auth token found, skipping settings load');
            return;
        }

        const response = await fetch('/api/user/settings', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (data.success && data.settings) {
            // Store settings locally for quick access
            localStorage.setItem('userSettings', JSON.stringify(data.settings));
            console.log('âœ… User settings loaded:', data.settings);
            return data.settings;
        }
    } catch (error) {
        console.error('Error loading user settings:', error);
    }
    return null;
}

async function saveUserSettings(settings) {
    try {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

        if (!token) {
            showNotification('Please sign in to save settings', 'error');
            return false;
        }

        const response = await fetch('/api/user/settings', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(settings)
        });

        const data = await response.json();

        if (data.success) {
            // Update local settings cache
            localStorage.setItem('userSettings', JSON.stringify(settings));
            console.log('âœ… User settings saved:', settings);
            return true;
        } else {
            console.error('Failed to save user settings:', data.error);
            return false;
        }
    } catch (error) {
        console.error('Error saving user settings:', error);
        return false;
    }
}

// Additional Functions
function changePassword() {
    showNotification('Password change functionality will be implemented with backend integration', 'info');
}

function deleteAccount() {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        // Clear all user data
        localStorage.removeItem('user');
        localStorage.removeItem('userSettings');
        localStorage.removeItem('userFavorites');
        sessionStorage.clear();

        // Reset UI to logged out state
        const userLoggedOut = document.getElementById('userLoggedOut');
        const userLoggedIn = document.getElementById('userLoggedIn');

        if (userLoggedOut) userLoggedOut.style.display = 'block';
        if (userLoggedIn) userLoggedIn.style.display = 'none';

        closeSettingsModal();

        showNotification('Account deleted successfully', 'success');
    }
}

function changeAvatar() {
    showNotification('Avatar change functionality will be implemented with image upload integration', 'info');
}

// Development helper function to reset rate limits
async function resetRateLimit() {
    try {
        const response = await fetch('/api/dev/reset-rate-limit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const data = await response.json();
        return data.success;
    } catch (error) {
        console.error('Rate limit reset error:', error);
        return false;
    }
}

// Auth error display functions
function showAuthError(errorId, message, type = 'error') {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.className = `auth-error ${type}`;
        errorElement.style.display = 'block';

        // Auto-hide success messages after 3 seconds
        if (type === 'success') {
            setTimeout(() => {
                hideAuthError(errorId);
            }, 3000);
        }
    }
}

function hideAuthError(errorId) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.style.display = 'none';
        errorElement.textContent = '';
        errorElement.className = 'auth-error';
    }
}

// Clear all auth errors when switching forms
function clearAllAuthErrors() {
    hideAuthError('loginError');
    hideAuthError('signupError');
}

// Admin Dashboard Functions
let currentUsers = [];
let currentBanUserId = null;

function initializeAdminDashboard() {
    const adminDashboard = document.getElementById('adminDashboard');
    const adminModal = document.getElementById('adminModal');
    const adminModalClose = document.getElementById('adminModalClose');
    const adminModalOverlay = document.getElementById('adminModalOverlay');

    const banModal = document.getElementById('banModal');
    const banModalClose = document.getElementById('banModalClose');
    const banModalOverlay = document.getElementById('banModalOverlay');
    const banCancelBtn = document.getElementById('banCancelBtn');
    const banConfirmBtn = document.getElementById('banConfirmBtn');

    // Open admin dashboard
    adminDashboard?.addEventListener('click', (e) => {
        e.preventDefault();
        openAdminDashboard();
    });

    // Close admin modal function
    function closeAdminModal() {
        adminModal.style.setProperty('display', 'none', 'important');
        adminModal.style.setProperty('position', 'static', 'important');
        adminModal.style.setProperty('z-index', 'auto', 'important');
        adminModal.classList.remove('show');
        document.body.style.overflow = 'auto';
        console.log('âœ… Admin modal closed');
    }

    // Close admin modal
    [adminModalClose, adminModalOverlay].forEach(element => {
        element?.addEventListener('click', closeAdminModal);
    });

    // ESC key to close admin modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && adminModal.style.display === 'flex') {
            closeAdminModal();
        }
    });

    // Make close function globally available
    window.closeAdminModal = closeAdminModal;

    // Close ban modal function
    function closeBanModal() {
        banModal.style.setProperty('display', 'none', 'important');
        banModal.style.setProperty('position', 'static', 'important');
        banModal.style.setProperty('z-index', 'auto', 'important');
        document.body.style.overflow = 'hidden'; // Keep admin modal scroll locked
        currentBanUserId = null;
        console.log('âœ… Ban modal closed');
    }

    // Close ban modal
    [banModalClose, banModalOverlay, banCancelBtn].forEach(element => {
        element?.addEventListener('click', closeBanModal);
    });

    // ESC key to close ban modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && banModal.style.display === 'flex') {
            closeBanModal();
        }
    });

    // Make close function globally available
    window.closeBanModal = closeBanModal;

    // Confirm ban
    banConfirmBtn?.addEventListener('click', () => {
        if (currentBanUserId) {
            const reason = document.getElementById('banReason').value;
            banUser(currentBanUserId, reason);
        }
    });
}

async function openAdminDashboard() {
    const adminModal = document.getElementById('adminModal');

    // Apply high-priority styling to ensure modal appears on top
    adminModal.style.position = 'fixed';
    adminModal.style.top = '0';
    adminModal.style.left = '0';
    adminModal.style.width = '100vw';
    adminModal.style.height = '100vh';
    adminModal.style.zIndex = '100002';
    adminModal.style.display = 'flex';
    adminModal.style.alignItems = 'center';
    adminModal.style.justifyContent = 'center';
    adminModal.style.background = 'rgba(0, 0, 0, 0.9)';
    adminModal.style.backdropFilter = 'blur(15px)';

    adminModal.classList.add('show');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling

    // Load users data
    await loadUsersData();
}

async function loadUsersData() {
    try {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        const response = await fetch('/api/admin/users', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (data.success) {
            currentUsers = data.users;
            updateAdminStats();
            renderUsersTable();
        } else {
            showNotification('Failed to load users data', 'error');
        }
    } catch (error) {
        console.error('Error loading users:', error);
        showNotification('Error loading users data', 'error');
    }
}

function updateAdminStats() {
    const totalUsers = currentUsers.length;
    const bannedUsers = currentUsers.filter(user => user.isBanned).length;
    const adminUsers = currentUsers.filter(user => user.isAdmin).length;

    document.getElementById('totalUsers').textContent = totalUsers;
    document.getElementById('bannedUsers').textContent = bannedUsers;
    document.getElementById('adminUsers').textContent = adminUsers;
}

function renderUsersTable() {
    console.log('ðŸ“Š Rendering users table with', currentUsers.length, 'users');

    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = '';

    currentUsers.forEach(user => {
        const row = document.createElement('tr');

        const statusClass = user.isBanned ? 'banned' : (user.isAdmin ? 'admin' : 'active');
        const statusText = user.isBanned ? 'Banned' : (user.isAdmin ? 'Admin' : 'Active');

        const joinedDate = new Date(user.createdAt).toLocaleDateString();
        const lastLogin = user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never';

        const actionButton = !user.isAdmin ? (user.isBanned ?
            `<button class="btn-small btn-unban" onclick="unbanUser(${user.id})">Unban</button>` :
            `<button class="btn-small btn-ban" onclick="showBanModal(${user.id}, '${user.name.replace(/'/g, "\\'")}')">Ban</button>`
        ) : '<span style="color: rgba(255,255,255,0.5);">Admin</span>';

        console.log(`ðŸ‘¤ User ${user.name}: Admin=${user.isAdmin}, Banned=${user.isBanned}, Action=${actionButton}`);

        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td><span class="user-status ${statusClass}">${statusText}</span></td>
            <td>${joinedDate}</td>
            <td>${lastLogin}</td>
            <td>
                <div class="user-actions">
                    ${actionButton}
                </div>
            </td>
        `;

        tbody.appendChild(row);
    });

    console.log('âœ… Users table rendered successfully');
}

function showBanModal(userId, userName) {
    console.log('ðŸš¨ showBanModal called with:', userId, userName);

    try {
        currentBanUserId = userId;
        document.getElementById('banUserName').textContent = userName;
        document.getElementById('banReason').value = '';

        const banModal = document.getElementById('banModal');

        if (!banModal) {
            console.error('âŒ Ban modal element not found!');
            return;
        }

        // Apply highest-priority styling to ensure modal appears on top of admin dashboard
        banModal.style.setProperty('position', 'fixed', 'important');
        banModal.style.setProperty('top', '0', 'important');
        banModal.style.setProperty('left', '0', 'important');
        banModal.style.setProperty('width', '100vw', 'important');
        banModal.style.setProperty('height', '100vh', 'important');
        banModal.style.setProperty('z-index', '100005', 'important');
        banModal.style.setProperty('display', 'flex', 'important');
        banModal.style.setProperty('align-items', 'center', 'important');
        banModal.style.setProperty('justify-content', 'center', 'important');
        banModal.style.setProperty('background', 'rgba(0, 0, 0, 0.95)', 'important');
        banModal.style.setProperty('backdrop-filter', 'blur(20px)', 'important');

        // Prevent body scrolling
        document.body.style.overflow = 'hidden';

        console.log('âœ… Ban modal should now be visible');
    } catch (error) {
        console.error('âŒ Error in showBanModal:', error);
    }
}

// Make showBanModal globally available
window.showBanModal = showBanModal;

async function banUser(userId, reason) {
    try {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        const response = await fetch('/api/admin/ban-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ userId, reason })
        });

        const data = await response.json();

        if (data.success) {
            showNotification('User banned successfully', 'success');
            closeBanModal();
            await loadUsersData(); // Refresh the data
        } else {
            showNotification(data.error || 'Failed to ban user', 'error');
        }
    } catch (error) {
        console.error('Error banning user:', error);
        showNotification('Error banning user', 'error');
    }
}

async function unbanUser(userId) {
    console.log('ðŸ”“ unbanUser called with:', userId);

    try {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        const response = await fetch('/api/admin/unban-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ userId })
        });

        const data = await response.json();

        if (data.success) {
            showNotification('User unbanned successfully', 'success');
            await loadUsersData(); // Refresh the data
        } else {
            showNotification(data.error || 'Failed to unban user', 'error');
        }
    } catch (error) {
        console.error('Error unbanning user:', error);
        showNotification('Error unbanning user', 'error');
    }
}

// Make unbanUser globally available
window.unbanUser = unbanUser;

// Test function for debugging ban modal
window.testBanModal = function() {
    console.log('ðŸ§ª Testing ban modal...');
    showBanModal(1, 'Test User');
};

// Make user modal functions globally available
window.openProfileModal = openProfileModal;
window.openFavoritesModal = openFavoritesModal;
window.openSettingsModal = openSettingsModal;
window.closeProfileModal = closeProfileModal;
window.closeFavoritesModal = closeFavoritesModal;
window.closeSettingsModal = closeSettingsModal;

// Make admin styling function globally available
window.checkAndApplyAdminStyling = checkAndApplyAdminStyling;

// Enhanced Favorites System with API Integration
class FavoritesManager {
    constructor() {
        this.favorites = [];
        this.isLoading = false;
        this.init();
    }

    init() {
        // Initialize favorite buttons when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.loadFavoritesFromServer();
                this.initializeFavoriteButtons();
                console.log('â¤ï¸ Enhanced Favorites system initialized!');
            });
        } else {
            this.loadFavoritesFromServer();
            this.initializeFavoriteButtons();
            console.log('â¤ï¸ Enhanced Favorites system initialized!');
        }
    }

    // Load favorites from server if user is logged in, otherwise from localStorage
    async loadFavoritesFromServer() {
        try {
            const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

            if (token) {
                // User is logged in - load from server
                console.log('ðŸ”„ User is logged in, loading from database server...');
                const response = await fetch('/api/user/favorites', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    const newFavorites = data.favorites.map(fav => fav.productId);
                    console.log('ðŸ”„ Loading favorites from database server...');
                    console.log('ðŸ“Š Previous favorites:', [...this.favorites]);
                    console.log('ðŸ“Š New favorites from server:', newFavorites);
                    this.favorites = newFavorites;
                    console.log('âœ… Favorites loaded from database server:', this.favorites);
                } else {
                    console.warn('Failed to load favorites from server, using localStorage');
                    this.loadFavoritesFromLocalStorage();
                }
            } else {
                // User not logged in - load from localStorage
                console.log('ðŸ‘¤ User not logged in, loading from localStorage');
                this.loadFavoritesFromLocalStorage();
            }

            // Update UI after loading
            this.updateAllFavoriteButtons();
            this.updateFavoritesModal();

        } catch (error) {
            console.error('Error loading favorites from server:', error);
            console.log('ðŸ“± Falling back to localStorage');
            this.loadFavoritesFromLocalStorage();
            this.updateAllFavoriteButtons();
            this.updateFavoritesModal();
        }
    }

    loadFavoritesFromLocalStorage() {
        try {
            const userKey = this.getUserFavoritesKey();
            const stored = localStorage.getItem(userKey);
            this.favorites = stored ? JSON.parse(stored) : [];
            console.log(`âœ… Favorites loaded from localStorage for ${userKey}:`, this.favorites);
        } catch (error) {
            console.error('Error loading favorites from localStorage:', error);
            this.favorites = [];
        }
    }

    saveFavoritesToLocalStorage() {
        try {
            const userKey = this.getUserFavoritesKey();
            const favoritesString = JSON.stringify(this.favorites);
            localStorage.setItem(userKey, favoritesString);
            console.log(`ðŸ’¾ Favorites saved to localStorage for ${userKey}:`, this.favorites);

            // Verify the save worked
            const verification = localStorage.getItem(userKey);
            console.log(`âœ… Verification - localStorage now contains:`, JSON.parse(verification || '[]'));
        } catch (error) {
            console.error('Error saving favorites to localStorage:', error);
        }
    }

    getUserFavoritesKey() {
        // Get current user's email or ID for user-specific storage
        const userEmail = this.getCurrentUserEmail();
        if (userEmail) {
            // Use user-specific key for logged-in users
            return `perfumeFavorites_${userEmail}`;
        } else {
            // Use guest key for non-logged-in users
            return 'perfumeFavorites_guest';
        }
    }

    getCurrentUserEmail() {
        // Try to get user email from various sources
        try {
            // Check if user is logged in and get their email
            const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
            if (token) {
                // Try to decode token to get user info (simplified approach)
                const userEmail = localStorage.getItem('userEmail') || sessionStorage.getItem('userEmail');
                if (userEmail) {
                    return userEmail;
                }

                // Fallback: try to get from DOM elements
                const userNameElement = document.getElementById('userName');
                if (userNameElement && userNameElement.textContent && userNameElement.textContent !== 'User') {
                    // If we have a display name, create a key from it
                    return userNameElement.textContent.toLowerCase().replace(/\s+/g, '_');
                }
            }
            return null;
        } catch (error) {
            console.warn('Error getting current user email:', error);
            return null;
        }
    }

    // Enhanced toggle function with API integration
    async toggleFavorite(productId) {
        if (this.isLoading) {
            console.log('â³ Toggle already in progress, ignoring...');
            return;
        }

        this.isLoading = true;
        const productName = this.getProductName(productId);
        const wasAlreadyFavorite = this.isFavorite(productId);

        try {
            const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

            if (token) {
                // User is logged in - use database API
                console.log('ðŸ”„ User logged in, using database API for favorites');
                const response = await fetch('/api/user/favorites/toggle', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        productId: productId,
                        productName: this.getProductName(productId)
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log(`ðŸ”„ Server response for ${productId}:`, data);

                    // Update local state based on server response
                    if (data.isFavorite) {
                        if (!this.favorites.includes(productId)) {
                            this.favorites.push(productId);
                            console.log(`âž• Added ${productId} to local favorites:`, [...this.favorites]);
                        }
                    } else {
                        const index = this.favorites.indexOf(productId);
                        if (index > -1) {
                            this.favorites.splice(index, 1);
                            console.log(`ðŸ—‘ï¸ Removed ${productId} from local favorites:`, [...this.favorites]);
                        }
                    }

                    // Save updated favorites to localStorage to keep it in sync
                    this.saveFavoritesToLocalStorage();

                    // Update UI
                    this.updateFavoriteButton(productId, data.isFavorite);
                    this.updateFavoritesModal();
                    this.showNotification(data.message, data.action === 'added' ? 'success' : 'info');

                    console.log(`âœ… ${data.action === 'added' ? 'Added to' : 'Removed from'} database favorites:`, productId);
                    console.log(`ðŸ“Š Current local favorites after operation:`, [...this.favorites]);
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to toggle favorite');
                }
            } else {
                // User not logged in - use localStorage
                console.log('ðŸ‘¤ User not logged in, using localStorage for favorites');
                if (wasAlreadyFavorite) {
                    this.removeFromFavoritesLocal(productId);
                } else {
                    this.addToFavoritesLocal(productId);
                }
            }

        } catch (error) {
            console.error('Error toggling favorite:', error);
            this.showNotification('Failed to update favorites. Please try again.', 'error');

            // Revert UI state on error
            this.updateFavoriteButton(productId, wasAlreadyFavorite);
        } finally {
            this.isLoading = false;
        }
    }

    // Local favorites management (for non-logged-in users)
    addToFavoritesLocal(productId) {
        if (!this.favorites.includes(productId)) {
            this.favorites.push(productId);
            this.saveFavoritesToLocalStorage();
            this.updateFavoriteButton(productId, true);
            this.updateFavoritesModal();
            this.showNotification(`${this.getProductName(productId)} added to favorites!`, 'success');
            return true;
        }
        return false;
    }

    removeFromFavoritesLocal(productId) {
        const index = this.favorites.indexOf(productId);
        if (index > -1) {
            console.log(`ðŸ—‘ï¸ Removing ${productId} from favorites. Before:`, [...this.favorites]);
            this.favorites.splice(index, 1);
            console.log(`ðŸ—‘ï¸ After removal:`, [...this.favorites]);
            this.saveFavoritesToLocalStorage();
            this.updateFavoriteButton(productId, false);
            this.updateFavoritesModal();
            this.showNotification(`${this.getProductName(productId)} removed from favorites!`, 'info');
            return true;
        }
        console.log(`âš ï¸ ${productId} not found in favorites:`, [...this.favorites]);
        return false;
    }

    isFavorite(productId) {
        return this.favorites.includes(productId);
    }

    getProductName(productId) {
        const names = {
            'layton': 'Layton',
            'haltane': 'Haltane',
            'pegasus': 'Pegasus'
        };
        return names[productId] || productId;
    }

    getProductDetails(productId) {
        const products = {
            'layton': {
                name: 'Layton',
                brand: 'Parfums de Marly',
                price: '35dt',
                description: 'Oriental Woody fragrance with apple, lavender, and vanilla notes',
                image: 'layton.png',
                topNotes: ['Apple', 'Lavender', 'Mandarin'],
                middleNotes: ['Geranium', 'Violet', 'Jasmine'],
                baseNotes: ['Vanilla', 'Sandalwood', 'Guaiac Wood'],
                sectionId: 'layton-section'
            },
            'haltane': {
                name: 'Haltane',
                brand: 'Parfums de Marly',
                price: '40dt',
                description: 'Modern oud fragrance with bergamot, saffron, and cedar notes',
                image: 'haltane.png',
                topNotes: ['Bergamot', 'Clary Sage', 'Cardamom'],
                middleNotes: ['Saffron', 'Lavender', 'Praline'],
                baseNotes: ['Oud', 'Cedar', 'Musk'],
                sectionId: 'haltane-section'
            },
            'pegasus': {
                name: 'Pegasus',
                brand: 'Parfums de Marly',
                price: '45dt',
                description: 'Oriental Gourmand with heliotrope, almond, and vanilla notes',
                image: 'pegasus.png',
                topNotes: ['Heliotrope', 'Cumin', 'Bergamot'],
                middleNotes: ['Almond', 'Jasmine', 'Bitter Almond'],
                baseNotes: ['Vanilla', 'Sandalwood', 'Amber'],
                sectionId: 'pegasus-section'
            }
        };

        const product = products[productId];
        if (!product) {
            // Return default product data if not found
            console.warn(`Product not found: ${productId}, using default data`);
            return {
                name: this.getProductName(productId),
                brand: 'Parfums de Marly',
                price: '35dt',
                description: 'Luxury fragrance',
                image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=300&h=300&fit=crop&crop=center',
                topNotes: ['Bergamot', 'Lavender', 'Vanilla'],
                middleNotes: ['Rose', 'Jasmine', 'Cedar'],
                baseNotes: ['Musk', 'Amber', 'Sandalwood'],
                sectionId: `${productId}-section`
            };
        }

        // Ensure all required properties exist with defaults
        return {
            name: product.name || this.getProductName(productId),
            brand: product.brand || 'Parfums de Marly',
            price: product.price || '35dt',
            description: product.description || 'Luxury fragrance',
            image: product.image || 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=300&h=300&fit=crop&crop=center',
            topNotes: product.topNotes || ['Bergamot', 'Lavender', 'Vanilla'],
            middleNotes: product.middleNotes || ['Rose', 'Jasmine', 'Cedar'],
            baseNotes: product.baseNotes || ['Musk', 'Amber', 'Sandalwood'],
            sectionId: product.sectionId || `${productId}-section`
        };
    }

    scrollToProductSection(productId, targetId = null) {
        const product = this.getProductDetails(productId);
        if (!product) {
            console.warn(`Product not found: ${productId}`);
            return;
        }

        // Close the favorites modal first
        const modal = document.getElementById('favoritesModal');
        if (modal) {
            modal.style.display = 'none';
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }

        // If a specific target ID is provided, use it first
        let targetElement = null;
        if (targetId) {
            targetElement = document.getElementById(targetId);
            if (targetElement) {
                console.log(`âœ… Found target using provided ID: ${targetId}`);
            }
        }

        // If no target found yet, try various selectors
        if (!targetElement) {
            const possibleSelectors = [
                // Try specific detail sections first
                `#${productId}-details`,
                // Try image-based selectors
                `.${productId}-image`,
                // Try section containers
                `.${productId}-section-container`,
                // Try product-specific containers
                `[data-product="${productId}"]`,
                // Try favorite button containers as reference points
                `#${productId}FavoriteBtn`,
                // Generic fallbacks
                `#${productId}-section`,
                `#${product.sectionId}`
            ];

            for (const selector of possibleSelectors) {
                try {
                    targetElement = document.querySelector(selector);
                    if (targetElement) {
                        console.log(`âœ… Found target using selector: ${selector}`);
                        break;
                    }
                } catch (e) {
                    console.warn(`Invalid selector: ${selector}`);
                }
            }
        }

        if (targetElement) {
            // For favorite buttons, scroll to their parent container instead
            if (targetElement.id && targetElement.id.includes('FavoriteBtn')) {
                const parentSection = targetElement.closest('section') || targetElement.closest('.content');
                if (parentSection) {
                    targetElement = parentSection;
                }
            }

            // Enhanced smooth scroll with custom animation
            this.smoothScrollToElement(targetElement, product.name);
        } else {
            console.warn(`Section not found for product: ${productId}`);
            this.showNotification(`Could not find ${product.name} section`, 'error');
        }
    }

    // Enhanced smooth scrolling function
    smoothScrollToElement(element, productName) {
        // Calculate the target position with offset for better visibility
        const elementRect = element.getBoundingClientRect();
        const absoluteElementTop = elementRect.top + window.pageYOffset;
        const middle = absoluteElementTop - (window.innerHeight / 2) + (elementRect.height / 2);

        // Custom smooth scroll animation
        const startPosition = window.pageYOffset;
        const targetPosition = Math.max(0, middle);
        const distance = targetPosition - startPosition;
        const duration = Math.min(2000, Math.max(800, Math.abs(distance) * 1.2)); // Slower, more elegant scroll
        let start = null;

        // Easing function for smooth animation
        const easeInOutCubic = (t) => {
            return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
        };

        const animation = (currentTime) => {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const progress = Math.min(timeElapsed / duration, 1);
            const easedProgress = easeInOutCubic(progress);

            window.scrollTo(0, startPosition + (distance * easedProgress));

            if (progress < 1) {
                requestAnimationFrame(animation);
            } else {
                // Animation complete, add highlight effect
                this.addHighlightEffect(element, productName);
            }
        };

        requestAnimationFrame(animation);
    }

    // Add highlight effect to the target element
    addHighlightEffect(element, productName) {
        // Add highlight effect with enhanced animation
        element.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        element.style.transform = 'scale(1.01)';
        element.style.boxShadow = '0 20px 60px rgba(255, 215, 0, 0.3), 0 0 0 2px rgba(255, 215, 0, 0.2)';
        element.style.borderRadius = '15px';
        element.style.filter = 'brightness(1.05)';

        // Pulse effect
        let pulseCount = 0;
        const pulseInterval = setInterval(() => {
            element.style.transform = pulseCount % 2 === 0 ? 'scale(1.02)' : 'scale(1.01)';
            pulseCount++;
            if (pulseCount >= 4) {
                clearInterval(pulseInterval);
            }
        }, 300);

        // Remove highlight after animation
        setTimeout(() => {
            element.style.transition = 'all 0.8s ease';
            element.style.transform = '';
            element.style.boxShadow = '';
            element.style.borderRadius = '';
            element.style.filter = '';
        }, 4000);

        this.showNotification(`Scrolled to ${productName}`, 'success');
        console.log(`âœ… Smoothly scrolled to ${productName} section`);
    }



    initializeFavoriteButtons() {
        const favoriteButtons = document.querySelectorAll('.favorite-btn');
        console.log(`ðŸ”„ Initializing ${favoriteButtons.length} favorite buttons...`);

        favoriteButtons.forEach((button, index) => {
            const productId = button.getAttribute('data-product');

            if (!productId) {
                console.warn('âš ï¸ Favorite button missing data-product attribute:', button);
                return;
            }

            console.log(`ðŸ”§ Initializing button ${index + 1}: ${productId} (ID: ${button.id})`);

            // Remove any existing event listeners to prevent duplicates
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);

            console.log(`ðŸ”„ Replaced button for ${productId} to remove old listeners`);

            // Set initial state
            this.updateFavoriteButton(productId, this.isFavorite(productId));

            // Add click event listener with loading state
            newButton.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();

                console.log(`ðŸ–±ï¸ Favorite button clicked for ${productId}`);

                // Check if user is logged in
                if (!this.isUserLoggedIn()) {
                    console.log(`ðŸ”’ User not logged in, showing login prompt for ${productId}`);
                    this.showLoginPrompt();
                    return;
                }

                // Prevent multiple clicks during loading
                if (this.isLoading || newButton.disabled) {
                    console.log(`â³ Button disabled or loading in progress for ${productId}`);
                    return;
                }

                // Disable button during operation
                newButton.disabled = true;
                newButton.style.opacity = '0.7';
                newButton.style.cursor = 'wait';

                // Add animation
                newButton.classList.add('animate');

                try {
                    await this.toggleFavorite(productId);
                } catch (error) {
                    console.error('Error in favorite button click:', error);
                } finally {
                    // Re-enable button
                    newButton.disabled = false;
                    newButton.style.opacity = '';
                    newButton.style.cursor = '';

                    // Remove animation
                    setTimeout(() => {
                        newButton.classList.remove('animate');
                    }, 400);
                }
            });
        });

        console.log('âœ… Favorite buttons initialized successfully');

        // Update button states based on login status
        this.updateFavoriteButtonsLoginState();
    }

    isUserLoggedIn() {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        return !!token;
    }

    showLoginPrompt() {
        // Create and show a stylish login prompt
        const prompt = document.createElement('div');
        prompt.className = 'login-prompt-overlay';
        prompt.innerHTML = `
            <div class="login-prompt-modal">
                <div class="login-prompt-content">
                    <div class="login-prompt-icon">ðŸ”’</div>
                    <h3>Sign In Required</h3>
                    <p>Please sign in to add fragrances to your favorites</p>
                    <div class="login-prompt-buttons">
                        <button class="btn-primary" id="promptLoginBtn">Sign In</button>
                        <button class="btn-secondary" id="promptCancelBtn">Cancel</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(prompt);

        // Show with animation
        setTimeout(() => prompt.classList.add('show'), 10);

        // Handle buttons
        const loginBtn = prompt.querySelector('#promptLoginBtn');
        const cancelBtn = prompt.querySelector('#promptCancelBtn');

        loginBtn.addEventListener('click', () => {
            console.log('ðŸ”‘ Sign In button clicked in login prompt');

            // Close the login prompt first
            this.closeLoginPrompt(prompt);

            // Open login modal with multiple fallback methods
            setTimeout(() => {
                const loginButton = document.getElementById('loginBtn');
                const authModal = document.getElementById('authModal');

                console.log('ðŸ”‘ Attempting to open login modal...');
                console.log('   â€¢ Login button found:', !!loginButton);
                console.log('   â€¢ Auth modal found:', !!authModal);

                if (authModal) {
                    console.log('   â€¢ Opening auth modal directly...');

                    // Apply high-priority styling for smooth modal appearance
                    authModal.style.setProperty('position', 'fixed', 'important');
                    authModal.style.setProperty('z-index', '999999', 'important');
                    authModal.style.setProperty('display', 'flex', 'important');
                    authModal.style.setProperty('align-items', 'center', 'important');
                    authModal.style.setProperty('justify-content', 'center', 'important');
                    authModal.style.setProperty('top', '0', 'important');
                    authModal.style.setProperty('left', '0', 'important');
                    authModal.style.setProperty('width', '100vw', 'important');
                    authModal.style.setProperty('height', '100vh', 'important');

                    // Add show class for smooth animation
                    setTimeout(() => authModal.classList.add('show'), 10);

                    // Prevent background scrolling
                    document.body.style.overflow = 'hidden';

                    console.log('âœ… Auth modal opened smoothly in viewport');
                } else if (loginButton) {
                    console.log('   â€¢ Clicking login button as fallback...');
                    loginButton.click();
                } else {
                    console.error('âŒ Neither login button nor auth modal found!');
                    this.showNotification('Login system not available. Please refresh the page.', 'error');
                }
            }, 150);
        });

        cancelBtn.addEventListener('click', () => {
            this.closeLoginPrompt(prompt);
        });

        // Close on overlay click
        prompt.addEventListener('click', (e) => {
            if (e.target === prompt) {
                this.closeLoginPrompt(prompt);
            }
        });

        // Auto close after 10 seconds
        setTimeout(() => {
            if (document.body.contains(prompt)) {
                this.closeLoginPrompt(prompt);
            }
        }, 10000);
    }

    closeLoginPrompt(prompt) {
        prompt.classList.remove('show');

        // Restore page scrolling immediately
        document.body.style.overflow = 'auto';

        setTimeout(() => {
            if (document.body.contains(prompt)) {
                document.body.removeChild(prompt);
            }
        }, 300);

        console.log('âœ… Login prompt closed and scrolling restored');
    }

    updateFavoriteButtonsLoginState() {
        const favoriteButtons = document.querySelectorAll('.favorite-btn');
        const isLoggedIn = this.isUserLoggedIn();

        favoriteButtons.forEach(button => {
            if (isLoggedIn) {
                button.classList.remove('locked');
                button.title = 'Add to Favorites';
            } else {
                button.classList.add('locked');
                button.title = 'Sign in to add to favorites';
            }
        });
    }

    // Update all favorite buttons (useful after loading from server)
    updateAllFavoriteButtons() {
        const favoriteButtons = document.querySelectorAll('.favorite-btn');
        favoriteButtons.forEach(button => {
            const productId = button.getAttribute('data-product');
            if (productId) {
                this.updateFavoriteButton(productId, this.isFavorite(productId));
            }
        });

        // Also update login state
        this.updateFavoriteButtonsLoginState();
    }

    updateFavoriteButton(productId, isFavorited) {
        const button = document.querySelector(`.favorite-btn[data-product="${productId}"]`);
        if (!button) {
            console.warn(`âš ï¸ Favorite button not found for product: ${productId}`);
            return;
        }

        const textElement = button.querySelector('.favorite-text');
        const heartOutline = button.querySelector('.heart-outline');
        const heartFilled = button.querySelector('.heart-filled');

        // Update button state with smooth transition
        if (isFavorited) {
            button.classList.add('favorited');
            if (textElement) {
                textElement.textContent = 'Remove from Favorites';
            }
        } else {
            button.classList.remove('favorited');
            if (textElement) {
                textElement.textContent = 'Add to Favorites';
            }
        }

        // Update heart icons with smooth transitions
        if (heartOutline && heartFilled) {
            if (isFavorited) {
                // Show filled heart, hide outline
                heartOutline.style.opacity = '0';
                heartOutline.style.transform = 'scale(1.2)';
                heartFilled.style.opacity = '1';
                heartFilled.style.transform = 'scale(1)';
                heartFilled.style.color = '#FFD700'; // Gold color for favorited
            } else {
                // Show outline heart, hide filled
                heartOutline.style.opacity = '1';
                heartOutline.style.transform = 'scale(1)';
                heartFilled.style.opacity = '0';
                heartFilled.style.transform = 'scale(0.8)';
            }
        }

        // Add subtle pulse effect when state changes
        button.style.transform = 'scale(1.05)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);

        console.log(`âœ… Updated favorite button for ${productId}: ${isFavorited ? 'favorited' : 'not favorited'}`);
    }

    updateFavoritesModal() {
        const favoritesContent = document.getElementById('favoritesContent');
        if (!favoritesContent) return;

        if (this.favorites.length === 0) {
            favoritesContent.innerHTML = `
                <div class="empty-favorites">
                    <div class="empty-icon">ðŸ’”</div>
                    <h3>No Favorites Yet</h3>
                    <p>Start adding your favorite perfumes to see them here!</p>
                </div>
            `;
            return;
        }

        const favoritesHTML = `
            <div class="favorites-grid">
                ${this.favorites.map(productId => {
                    const product = this.getProductDetails(productId);
                    if (!product) {
                        console.warn(`Product details not found for: ${productId}`);
                        return '';
                    }

                    return `
                        <div class="favorite-card" data-product="${productId}">
                            <div class="favorite-card-image">
                                <img src="${product.image}" alt="${product.name}" loading="lazy">
                                <div class="favorite-card-overlay">
                                    <button class="view-product-btn" data-product="${productId}">
                                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                            <circle cx="12" cy="12" r="3"/>
                                        </svg>
                                        View Product
                                    </button>
                                </div>
                            </div>
                            <div class="favorite-card-content">
                                <div class="favorite-card-header">
                                    <h4 class="favorite-card-title">${product.name}</h4>
                                    <button class="remove-favorite-btn" data-product="${productId}" title="Remove from favorites">
                                        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                                        </svg>
                                    </button>
                                </div>
                                <p class="favorite-card-brand">${product.brand}</p>
                                <div class="favorite-card-price">
                                    <span class="price-amount">${product.price}</span>
                                </div>
                                <p class="favorite-card-description">${product.description}</p>
                                <div class="favorite-card-notes">
                                    <div class="notes-preview">
                                        ${(product.topNotes || []).slice(0, 3).map(note => `<span class="note-tag">${note}</span>`).join('')}
                                    </div>
                                </div>
                                <div class="favorite-card-actions">
                                    <button class="goto-section-btn" data-product="${productId}">
                                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M7 17l9.2-9.2M17 17V7H7"/>
                                        </svg>
                                        Go to Section
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;

        favoritesContent.innerHTML = favoritesHTML;

        // Add event listeners
        this.addFavoritesModalEventListeners();
    }

    addFavoritesModalEventListeners() {
        const favoritesContent = document.getElementById('favoritesContent');
        if (!favoritesContent) return;

        // Remove buttons
        const removeButtons = favoritesContent.querySelectorAll('.remove-favorite-btn');
        removeButtons.forEach(button => {
            button.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();
                const productId = button.getAttribute('data-product');

                // Add loading state
                button.style.opacity = '0.5';
                button.disabled = true;

                try {
                    await this.toggleFavorite(productId);
                } finally {
                    button.style.opacity = '';
                    button.disabled = false;
                }
            });
        });

        // Go to section buttons
        const gotoButtons = favoritesContent.querySelectorAll('.goto-section-btn');
        gotoButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const productId = button.getAttribute('data-product');
                this.scrollToProductSection(productId);
            });
        });

        // View product buttons (same as go to section)
        const viewButtons = favoritesContent.querySelectorAll('.view-product-btn');
        viewButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const productId = button.getAttribute('data-product');
                this.scrollToProductSection(productId);
            });
        });

        // Card click to go to section
        const cards = favoritesContent.querySelectorAll('.favorite-card');
        cards.forEach(card => {
            card.addEventListener('click', (e) => {
                // Don't trigger if clicking on buttons
                if (e.target.closest('button')) return;

                const productId = card.getAttribute('data-product');
                this.scrollToProductSection(productId);
            });
        });
    }

    addFavoritesModalEventListeners() {
        const favoritesContent = document.getElementById('favoritesContent');
        if (!favoritesContent) return;

        // Remove buttons
        const removeButtons = favoritesContent.querySelectorAll('.remove-favorite-btn');
        removeButtons.forEach(button => {
            button.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();
                const productId = button.getAttribute('data-product');

                // Add loading state
                button.style.opacity = '0.5';
                button.disabled = true;

                try {
                    await this.toggleFavorite(productId);
                } finally {
                    button.style.opacity = '';
                    button.disabled = false;
                }
            });
        });

        // Go to section buttons
        const gotoButtons = favoritesContent.querySelectorAll('.goto-section-btn');
        gotoButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const productId = button.getAttribute('data-product');
                this.scrollToProductSection(productId);
            });
        });

        // View product buttons (same as go to section)
        const viewButtons = favoritesContent.querySelectorAll('.view-product-btn');
        viewButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const productId = button.getAttribute('data-product');
                this.scrollToProductSection(productId);
            });
        });

        // Card click to go to section
        const cards = favoritesContent.querySelectorAll('.favorite-card');
        cards.forEach(card => {
            card.addEventListener('click', (e) => {
                // Don't trigger if clicking on buttons
                if (e.target.closest('button')) return;

                const productId = card.getAttribute('data-product');
                this.scrollToProductSection(productId);
            });
        });
    }

    showNotification(message, type = 'info') {
        // Use existing notification system if available
        if (window.showNotification && typeof window.showNotification === 'function') {
            window.showNotification(message, type);
        } else {
            // Create a simple notification if no system exists
            this.createSimpleNotification(message, type);
        }
    }

    createSimpleNotification(message, type = 'info') {
        // Create notification container if it doesn't exist
        let container = document.getElementById('favorites-notifications');
        if (!container) {
            container = document.createElement('div');
            container.id = 'favorites-notifications';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                pointer-events: none;
            `;
            document.body.appendChild(container);
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            margin-bottom: 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            transform: translateX(100%);
            transition: all 0.3s ease;
            pointer-events: auto;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            font-weight: 500;
            max-width: 300px;
            word-wrap: break-word;
        `;
        notification.textContent = message;

        container.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    createSimpleNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `simple-notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 10000;
            font-size: 14px;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        // Type-specific styling
        if (type === 'success') {
            notification.style.background = 'rgba(46, 204, 113, 0.9)';
        } else if (type === 'error') {
            notification.style.background = 'rgba(231, 76, 60, 0.9)';
        }

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Public methods for testing
    getFavorites() {
        return [...this.favorites];
    }

    clearAllFavorites() {
        this.favorites = [];
        this.saveFavoritesToLocalStorage();
        this.updateAllFavoriteButtons();
        this.updateFavoritesModal();
        this.showNotification('All favorites cleared!', 'info');
    }

    // Handle user login - switch to user-specific favorites
    onUserLogin(userEmail) {
        console.log(`ðŸ‘¤ User logged in: ${userEmail}`);

        // Store user email for favorites key generation
        localStorage.setItem('userEmail', userEmail);

        // Save current guest favorites before switching
        const guestFavorites = [...this.favorites];

        // Load user-specific favorites
        this.loadFavoritesFromLocalStorage();

        // If user has no favorites but guest had some, offer to transfer
        if (this.favorites.length === 0 && guestFavorites.length > 0) {
            this.transferGuestFavorites(guestFavorites);
        }

        // Update UI
        this.updateAllFavoriteButtons();
        this.updateFavoritesModal();

        // Note: Sync is disabled to prevent localStorage from overriding database
        // this.syncFavoritesToServer();
    }

    // Handle user logout - switch to guest favorites
    onUserLogout() {
        console.log('ðŸ‘¤ User logged out - switching to guest favorites');

        // Clear user email
        localStorage.removeItem('userEmail');
        sessionStorage.removeItem('userEmail');

        // Load guest favorites
        this.loadFavoritesFromLocalStorage();

        // Update UI
        this.updateAllFavoriteButtons();
        this.updateFavoritesModal();
    }

    // Transfer guest favorites to logged-in user
    transferGuestFavorites(guestFavorites) {
        console.log('ðŸ”„ Transferring guest favorites to user account...');

        // Add guest favorites to user account
        guestFavorites.forEach(productId => {
            if (!this.favorites.includes(productId)) {
                this.favorites.push(productId);
            }
        });

        // Save to user-specific storage
        this.saveFavoritesToLocalStorage();

        // Clear guest favorites
        localStorage.removeItem('perfumeFavorites_guest');

        this.showNotification(`Transferred ${guestFavorites.length} favorites to your account!`, 'success');
        console.log(`âœ… Transferred ${guestFavorites.length} guest favorites to user account`);
    }

    // Sync local favorites to server when user logs in
    async syncFavoritesToServer() {
        console.log('ðŸš« Sync disabled to prevent localStorage override issues');
        return; // Completely disabled to prevent localStorage from overriding database

        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        if (!token || this.favorites.length === 0) {
            return;
        }

        console.log('ðŸ”„ Syncing local favorites to server...');

        try {
            // Get current server favorites
            const response = await fetch('/api/user/favorites', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                const serverFavorites = data.favorites.map(fav => fav.productId);

                // Add local favorites that aren't on server
                for (const productId of this.favorites) {
                    if (!serverFavorites.includes(productId)) {
                        try {
                            await fetch('/api/user/favorites', {
                                method: 'POST',
                                headers: {
                                    'Authorization': `Bearer ${token}`,
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    productId: productId,
                                    productName: this.getProductName(productId)
                                })
                            });
                            console.log(`âœ… Synced ${productId} to server`);
                        } catch (error) {
                            console.error(`âŒ Failed to sync ${productId}:`, error);
                        }
                    }
                }

                // Reload from server to get the complete list
                await this.loadFavoritesFromServer();
                console.log('âœ… Favorites sync completed');
            }
        } catch (error) {
            console.error('âŒ Error syncing favorites to server:', error);
        }
    }

    // Get favorites list (for external access)
    getFavorites() {
        return [...this.favorites];
    }
}

// Initialize favorites manager
const favoritesManager = new FavoritesManager();

// Make favorites manager globally available
window.favoritesManager = favoritesManager;

// Cart Manager Class - User-Specific Carts
class CartManager {
    constructor() {
        this.currentUser = null;
        this.cart = [];
        this.initializeEventListeners();
        this.loadUserCart();
        this.updateCartDisplay();
        this.initializeCartButtons();
    }

    getCurrentUser() {
        // Get current user from session storage or local storage (using correct key)
        const sessionUser = sessionStorage.getItem('user');
        const localUser = localStorage.getItem('user');
        return sessionUser || localUser;
    }

    getUserCartKey() {
        const user = this.getCurrentUser();
        if (user) {
            const userData = JSON.parse(user);
            return `parfumerie_cart_${userData.email}`;
        }
        return 'parfumerie_cart_guest';
    }

    loadUserCart() {
        const user = this.getCurrentUser();
        if (user) {
            const userData = JSON.parse(user);
            this.currentUser = userData.email;
            console.log(`ðŸ›’ Loading cart for user: ${this.currentUser}`);
        } else {
            this.currentUser = 'guest';
            console.log('ðŸ›’ Loading guest cart');
        }

        this.cart = this.loadCart();
    }

    loadCart() {
        const cartKey = this.getUserCartKey();
        const savedCart = localStorage.getItem(cartKey);
        const cart = savedCart ? JSON.parse(savedCart) : [];
        console.log(`ðŸ“¦ Loaded cart for ${this.currentUser}:`, cart);
        return cart;
    }

    saveCart() {
        const cartKey = this.getUserCartKey();
        localStorage.setItem(cartKey, JSON.stringify(this.cart));
        console.log(`ðŸ’¾ Saved cart for ${this.currentUser}:`, this.cart);
        this.updateCartDisplay();
    }

    // Method to switch user carts when user logs in/out
    switchUserCart(newUser = null) {
        console.log(`ðŸ”„ Switching cart from ${this.currentUser} to ${newUser || 'guest'}`);

        // Save current cart before switching
        this.saveCart();

        // Update current user
        this.currentUser = newUser || 'guest';

        // Load new user's cart
        this.cart = this.loadCart();

        // Update display and buttons
        this.updateCartDisplay();
        this.initializeCartButtons();

        console.log(`âœ… Cart switched successfully. New cart:`, this.cart);
    }

    addToCart(productId, _price, quality = 'top') {
        console.log('ðŸ›’ Adding to cart:', productId, quality);

        const product = this.getProductDetails(productId);
        if (!product) {
            console.error('âŒ Product not found:', productId);
            return;
        }

        // Get the actual price based on quality and product
        const actualPrice = this.getQualityPrice(productId, quality);

        // Check if item already exists in cart
        const existingItem = this.cart.find(item =>
            item.productId === productId && item.quality === quality
        );

        if (existingItem) {
            existingItem.quantity += 1;
            console.log('ðŸ“ˆ Updated quantity for existing item:', existingItem);
        } else {
            const newItem = {
                productId,
                name: product.name,
                brand: product.brand,
                price: actualPrice,
                quality,
                quantity: 1,
                image: product.image
            };
            this.cart.push(newItem);
            console.log('âœ… Added new item to cart:', newItem);
        }

        this.saveCart();
        console.log('ðŸ’¾ Cart saved. Total items:', this.cart.length);
        this.showNotification(`${product.name} (${quality} quality) added to cart!`, 'success');
        this.updateCartButton(productId, true);
    }

    getQualityPrice(productId, quality) {
        const basePrices = {
            'layton': { top: 35, identical: 50 },
            'haltane': { top: 40, identical: 55 },
            'pegasus': { top: 45, identical: 60 }
        };

        return basePrices[productId]?.[quality] || basePrices[productId]?.top || 35;
    }

    removeFromCart(productId, quality = 'top') {
        this.cart = this.cart.filter(item =>
            !(item.productId === productId && item.quality === quality)
        );
        this.saveCart();
        this.renderCartItems();
        this.updateCartButton(productId, false);
    }

    updateQuantity(productId, quality, newQuantity) {
        const item = this.cart.find(item =>
            item.productId === productId && item.quality === quality
        );

        if (item) {
            if (newQuantity <= 0) {
                this.removeFromCart(productId, quality);
            } else {
                item.quantity = newQuantity;
                this.saveCart();
                this.renderCartItems();
            }
        }
    }

    clearCart() {
        this.cart = [];
        this.saveCart();
        this.renderCartItems();
        // Reset all cart buttons
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            this.updateCartButton(btn.getAttribute('data-product'), false);
        });
        this.showNotification('Cart cleared!', 'info');
    }

    getCartTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getCartItemCount() {
        return this.cart.reduce((count, item) => count + item.quantity, 0);
    }

    updateCartDisplay() {
        const count = this.getCartItemCount();

        // Update dropdown cart count
        const cartCount = document.getElementById('cartItemCount');
        if (cartCount) {
            cartCount.textContent = count;
            cartCount.style.display = count > 0 ? 'inline-block' : 'none';
        }

        // Update navbar cart badge
        const navbarCartBadge = document.getElementById('navbarCartBadge');
        if (navbarCartBadge) {
            navbarCartBadge.textContent = count;
            if (count > 0) {
                navbarCartBadge.classList.add('show');
            } else {
                navbarCartBadge.classList.remove('show');
            }
        }



        // Update floating menu badge
        const floatingMenuBadge = document.getElementById('floatingMenuBadge');
        if (floatingMenuBadge) {
            floatingMenuBadge.textContent = count;
            if (count > 0) {
                floatingMenuBadge.classList.add('show');
            } else {
                floatingMenuBadge.classList.remove('show');
            }
        }
    }

    updateCartButton(productId, inCart) {
        const button = document.getElementById(`${productId}CartBtn`);
        if (button) {
            const cartIcon = button.querySelector('.cart-icon svg');
            const cartText = button.querySelector('.cart-text');

            if (inCart) {
                // Start the transition by fading out text
                cartText.style.opacity = '0';
                cartText.style.transform = 'translateX(-10px)';

                // After text fades out, change state and content
                setTimeout(() => {
                    button.classList.add('added');
                    cartText.textContent = 'Remove';

                    // Change icon to remove/trash icon
                    cartIcon.style.transform = 'scale(0.7) rotate(90deg)';
                    setTimeout(() => {
                        cartIcon.innerHTML = `
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        `;
                        cartIcon.style.transform = 'scale(1) rotate(0deg)';
                    }, 150);

                    // Fade text back in
                    setTimeout(() => {
                        cartText.style.opacity = '1';
                        cartText.style.transform = 'translateX(0)';
                    }, 100);
                }, 300);

            } else {
                // Start the transition by fading out text
                cartText.style.opacity = '0';
                cartText.style.transform = 'translateX(10px)';

                // After text fades out, change state and content
                setTimeout(() => {
                    button.classList.remove('added');
                    cartText.textContent = 'Add to Cart';

                    // Change back to cart icon
                    cartIcon.style.transform = 'scale(0.7) rotate(-90deg)';
                    setTimeout(() => {
                        cartIcon.innerHTML = `
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="m1 1 4 4 2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        `;
                        cartIcon.style.transform = 'scale(1) rotate(0deg)';
                    }, 150);

                    // Fade text back in
                    setTimeout(() => {
                        cartText.style.opacity = '1';
                        cartText.style.transform = 'translateX(0)';
                    }, 100);
                }, 300);
            }
        }
    }

    initializeCartButtons() {
        // Check which products are already in cart and update button states
        const productIds = ['layton', 'haltane', 'pegasus'];
        productIds.forEach(productId => {
            const inCart = this.cart.some(item => item.productId === productId);
            this.updateCartButton(productId, inCart);
        });
    }

    getProductDetails(productId) {
        const products = {
            'layton': {
                name: 'Layton',
                brand: 'Parfums de Marly',
                image: 'layton.png'
            },
            'haltane': {
                name: 'Haltane',
                brand: 'Parfums de Marly',
                image: 'haltane.png'
            },
            'pegasus': {
                name: 'Pegasus',
                brand: 'Parfums de Marly',
                image: 'pegasus.png'
            }
        };
        return products[productId];
    }

    initializeEventListeners() {
        // Add to cart buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.add-to-cart-btn')) {
                const button = e.target.closest('.add-to-cart-btn');
                const productId = button.getAttribute('data-product');
                const price = button.getAttribute('data-price');

                // Get selected quality
                const qualitySelector = document.querySelector(`input[name="${productId}-quality"]:checked`) ||
                                      document.querySelector(`input[name="quality"]:checked`);
                const quality = qualitySelector ? qualitySelector.value : 'top';

                // Check if item is already in cart
                const existingItem = this.cart.find(item =>
                    item.productId === productId && item.quality === quality
                );

                if (existingItem) {
                    // Remove from cart (toggle off)
                    this.removeFromCart(productId, quality);
                } else {
                    // Add to cart (toggle on)
                    this.addToCart(productId, price, quality);
                }
            }
        });

        // Cart modal events
        const cartModalClose = document.getElementById('cartModalClose');
        const cartModalOverlay = document.getElementById('cartModalOverlay');
        const userCart = document.getElementById('userCart');
        const navbarCartIcon = document.getElementById('navbarCartIcon');
        const clearCartBtn = document.getElementById('clearCartBtn');
        const checkoutBtn = document.getElementById('checkoutBtn');

        if (userCart) {
            userCart.addEventListener('click', () => this.openCartModal());
        }

        if (navbarCartIcon) {
            navbarCartIcon.addEventListener('click', () => this.openCartModal());
        }

        // Add event listener for floating menu (top left cart)
        const floatingMenu = document.getElementById('floatingMenu');
        if (floatingMenu) {
            floatingMenu.addEventListener('click', () => this.openCartModal());
        }

        if (cartModalClose) {
            cartModalClose.addEventListener('click', () => this.closeCartModal());
        }

        if (cartModalOverlay) {
            cartModalOverlay.addEventListener('click', () => this.closeCartModal());
        }

        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to clear your cart?')) {
                    this.clearCart();
                }
            });
        }

        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => this.proceedToCheckout());
        }
    }

    openCartModal() {
        console.log('ðŸ›’ Opening cart modal...');
        console.log('Cart contents:', this.cart);

        const modal = document.getElementById('cartModal');
        if (modal) {
            // Apply high-priority styling to ensure it appears on top and centered
            modal.style.setProperty('position', 'fixed', 'important');
            modal.style.setProperty('top', '0', 'important');
            modal.style.setProperty('left', '0', 'important');
            modal.style.setProperty('width', '100vw', 'important');
            modal.style.setProperty('height', '100vh', 'important');
            modal.style.setProperty('z-index', '999999', 'important');
            modal.style.setProperty('display', 'flex', 'important');
            modal.style.setProperty('align-items', 'center', 'important');
            modal.style.setProperty('justify-content', 'center', 'important');
            modal.style.setProperty('background', 'rgba(0, 0, 0, 0.9)', 'important');
            modal.style.setProperty('backdrop-filter', 'blur(20px)', 'important');

            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
            this.renderCartItems();
            console.log('âœ… Cart modal opened successfully with high priority');
        } else {
            console.error('âŒ Cart modal not found');
        }
    }

    closeCartModal() {
        const modal = document.getElementById('cartModal');
        if (modal) {
            modal.style.display = 'none';
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    }

    renderCartItems() {
        const cartContent = document.getElementById('cartContent');
        const cartSummary = document.getElementById('cartSummary');

        if (!cartContent) return;

        if (this.cart.length === 0) {
            cartContent.innerHTML = `
                <div class="empty-cart">
                    <svg viewBox="0 0 24 24" width="48" height="48" style="color: rgba(255,255,255,0.3);">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="m1 1 4 4 2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    <h3>Your cart is empty</h3>
                    <p>Start shopping and add your favorite fragrances to cart!</p>
                </div>
            `;
            if (cartSummary) cartSummary.style.display = 'none';
        } else {
            cartContent.innerHTML = this.cart.map(item => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-brand">${item.brand}</div>
                        <div class="cart-item-quality">${item.quality} Quality</div>
                    </div>
                    <div class="cart-item-price">${item.price} dt</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="window.cartManager.updateQuantity('${item.productId}', '${item.quality}', ${item.quantity - 1})">-</button>
                        <span class="quantity-display">${item.quantity}</span>
                        <button class="quantity-btn" onclick="window.cartManager.updateQuantity('${item.productId}', '${item.quality}', ${item.quantity + 1})">+</button>
                    </div>
                    <button class="remove-item-btn" onclick="window.cartManager.removeFromCart('${item.productId}', '${item.quality}')" title="Remove item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
            `).join('');

            // Update summary
            const total = this.getCartTotal();
            document.getElementById('cartSubtotal').textContent = `${total} dt`;
            document.getElementById('cartTotal').textContent = `${total} dt`;

            if (cartSummary) cartSummary.style.display = 'block';
        }
    }

    proceedToCheckout() {
        if (this.cart.length === 0) {
            this.showNotification('Your cart is empty!', 'error');
            return;
        }

        // For now, just show a notification
        this.showNotification('Checkout functionality coming soon!', 'info');
        console.log('Cart contents:', this.cart);
        console.log('Total:', this.getCartTotal(), 'dt');
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 20px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '600',
            zIndex: '10000',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            maxWidth: '300px'
        });

        // Set background color based on type
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            info: '#17a2b8',
            warning: '#ffc107'
        };
        notification.style.backgroundColor = colors[type] || colors.info;

        // Add to page
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize cart manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const cartManager = new CartManager();
    window.cartManager = cartManager;
    console.log('âœ… Cart manager initialized with user-specific carts');

    // Add debugging functions for cart management
    window.showUserCarts = function() {
        console.log('ðŸ›’ === USER CART DEBUG INFO ===');
        console.log(`Current user: ${cartManager.currentUser}`);
        console.log(`Current cart key: ${cartManager.getUserCartKey()}`);
        console.log(`Current cart contents:`, cartManager.cart);

        // Show all stored carts
        console.log('\nðŸ“¦ All stored carts:');
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('parfumerie_cart_')) {
                const cart = JSON.parse(localStorage.getItem(key));
                const userEmail = key.replace('parfumerie_cart_', '');
                console.log(`  â€¢ ${userEmail}: ${cart.length} items`, cart);
            }
        }
    };

    window.clearAllCarts = function() {
        console.log('ðŸ—‘ï¸ Clearing all user carts...');
        for (let i = localStorage.length - 1; i >= 0; i--) {
            const key = localStorage.key(i);
            if (key && key.startsWith('parfumerie_cart_')) {
                localStorage.removeItem(key);
                console.log(`  âœ… Cleared cart: ${key}`);
            }
        }
        cartManager.cart = [];
        cartManager.updateCartDisplay();
        console.log('ðŸ›’ All carts cleared and display updated');
    };

    // Initialize user statistics manager
    const userStatsManager = new UserStatsManager();
    window.userStatsManager = userStatsManager;
    console.log('ðŸ“Š User statistics manager initialized');

    // Add debugging functions for user stats
    window.addDemoUsers = function() {
        userStatsManager.addDemoUsers();
    };

    window.resetUserStats = function() {
        userStatsManager.resetStats();
    };

    window.showUserStats = function() {
        userStatsManager.showAllUsers();
    };

    window.refreshUserCounter = function() {
        userStatsManager.forceRefresh();
    };

    // Initialize news system
    const newsManager = new NewsManager();
    window.newsManager = newsManager;
    console.log('ðŸ“° News manager initialized');

    // Initialize reviews system
    const reviewsManager = new ReviewsManager();
    window.reviewsManager = reviewsManager;
    console.log('ðŸ’¬ Reviews system initialized');

    // Initialize notification system
    const notificationManager = new NotificationManager();
    window.notificationManager = notificationManager;
    console.log('ðŸ”” Notification manager initialized');

    // Quick debug function to check localStorage right now
    window.checkDatabase = function() {
        console.log('ðŸ” === QUICK DATABASE CHECK ===');
        console.log('Total localStorage items:', localStorage.length);

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = localStorage.getItem(key);
            console.log(`${i + 1}. "${key}": ${value.substring(0, 50)}...`);
        }

        console.log('\nSessionStorage:');
        const sessionUser = sessionStorage.getItem('user');
        console.log('user:', sessionUser ? sessionUser.substring(0, 50) + '...' : 'null');
    };

    // Test the public stats endpoint
    window.testPublicStats = async function() {
        console.log('ðŸ” === TESTING PUBLIC STATS ENDPOINT ===');
        try {
            const response = await fetch('/api/stats/users');
            const data = await response.json();
            console.log('Response:', data);

            if (data.success) {
                console.log(`ðŸ“Š Total Users: ${data.stats.totalUsers}`);
                console.log(`ðŸ“§ Gmail Users: ${data.stats.gmailUsers}`);
                console.log(`ðŸ‘‘ Admin Users: ${data.stats.adminUsers}`);
                console.log(`ðŸš« Banned Users: ${data.stats.bannedUsers}`);
            }
        } catch (error) {
            console.error('Error testing public stats:', error);
        }
    };
});

// Notification Manager
class NotificationManager {
    constructor() {
        this.notificationContainer = document.getElementById('navbarNotificationContainer');
        this.notificationDropdown = document.getElementById('notificationDropdown');
        this.notificationIcon = document.getElementById('navbarNotificationIcon');
        this.notificationBadge = document.getElementById('notificationBadge');
        this.notificationContent = document.getElementById('notificationContent');
        this.notificationList = document.getElementById('notificationList');
        this.notificationLoading = document.getElementById('notificationLoading');
        this.notificationEmpty = document.getElementById('notificationEmpty');
        this.notificationError = document.getElementById('notificationError');
        this.notificationRetryBtn = document.getElementById('notificationRetryBtn');
        this.markAllReadBtn = document.getElementById('markAllReadBtn');

        this.notifications = [];
        this.unreadCount = 0;
        this.isDropdownOpen = false;
        this.isUserSignedIn = false;

        this.initializeEventListeners();
        this.checkUserAuthStatus();
        this.startPeriodicCheck();
    }

    initializeEventListeners() {
        // Toggle notification dropdown or show sign-in prompt
        if (this.notificationIcon) {
            this.notificationIcon.addEventListener('click', (e) => {
                e.stopPropagation();

                if (!this.isUserSignedIn) {
                    this.showSignInPrompt();
                } else {
                    this.toggleDropdown();
                }
            });
        }

        // Mark all as read
        if (this.markAllReadBtn) {
            this.markAllReadBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.markAllAsRead();
            });
        }

        // Retry button
        if (this.notificationRetryBtn) {
            this.notificationRetryBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.loadNotifications();
            });
        }

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isDropdownOpen && this.notificationContainer && !this.notificationContainer.contains(e.target)) {
                this.closeDropdown();
            }
        });

        // Prevent dropdown from closing when clicking inside
        if (this.notificationDropdown) {
            this.notificationDropdown.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }

        // ESC key to close dropdown
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isDropdownOpen) {
                this.closeDropdown();
            }
        });
    }

    showSignInPrompt() {
        // Show a notification prompting user to sign in
        if (window.showNotification) {
            window.showNotification('Please sign in to view your notifications', 'info');
        }

        // Optionally open the auth modal
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            setTimeout(() => {
                loginBtn.click();
            }, 500);
        }

        console.log('ðŸ”” Sign-in prompt shown for locked notifications');
    }

    checkUserAuthStatus() {
        // Check if user is signed in
        const user = localStorage.getItem('user') || sessionStorage.getItem('user');
        const authToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

        this.isUserSignedIn = !!(user && authToken);
        this.updateNotificationVisibility();

        if (this.isUserSignedIn) {
            this.loadNotifications();
        }

        console.log(`ðŸ”” Notification system: ${this.isUserSignedIn ? 'Available for signed-in user' : 'Hidden for guest user'}`);
    }

    updateNotificationVisibility() {
        if (!this.notificationContainer) return;

        if (this.isUserSignedIn) {
            this.notificationContainer.classList.remove('locked');

            // Update tooltip for signed-in users
            if (this.notificationIcon) {
                this.notificationIcon.setAttribute('title', 'Notifications');
            }
        } else {
            this.notificationContainer.classList.add('locked');
            this.closeDropdown(); // Close if open

            // Update tooltip for locked state
            if (this.notificationIcon) {
                this.notificationIcon.setAttribute('title', 'Sign in to view notifications');
            }
        }
    }

    // Call this when user signs in
    onUserSignIn() {
        this.isUserSignedIn = true;
        this.updateNotificationVisibility();
        this.loadNotifications();
        console.log('ðŸ”” Notifications enabled for signed-in user');
    }

    // Call this when user signs out
    onUserSignOut() {
        this.isUserSignedIn = false;
        this.updateNotificationVisibility();
        this.notifications = [];
        this.unreadCount = 0;
        this.updateBadge();
        console.log('ðŸ”” Notifications disabled for signed-out user');
    }

    async toggleDropdown() {
        // Only allow if user is signed in
        if (!this.isUserSignedIn) {
            console.log('ðŸ”” Notifications are only available for signed-in users');
            return;
        }

        if (this.isDropdownOpen) {
            this.closeDropdown();
        } else {
            await this.openDropdown();
        }
    }

    async openDropdown() {
        if (!this.notificationDropdown || !this.isUserSignedIn) return;

        this.isDropdownOpen = true;
        this.notificationDropdown.classList.add('show');

        // Load notifications when opened
        await this.loadNotifications();
    }

    closeDropdown() {
        if (!this.notificationDropdown) return;

        this.isDropdownOpen = false;
        this.notificationDropdown.classList.remove('show');
    }

    async loadNotifications() {
        // Only load notifications for signed-in users
        if (!this.isUserSignedIn) {
            console.log('ðŸ”” Skipping notification load - user not signed in');
            return;
        }

        this.showLoadingState();

        try {
            const notifications = await this.fetchNotifications();
            this.notifications = notifications;
            this.displayNotifications(notifications);
        } catch (error) {
            console.error('Error loading notifications:', error);
            this.showErrorState();
        }
    }

    async fetchNotifications() {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // Mock notification data - replace with real API call
        const mockNotifications = [
            {
                id: 1,
                title: "Welcome to Parfumerie Charme!",
                content: "Thank you for joining us. Explore our exclusive collection of luxury fragrances.",
                time: new Date().toISOString(),
                type: "system",
                read: false
            },
            {
                id: 2,
                title: "New Fragrance Alert",
                content: "Check out our latest arrival: 'Midnight Elegance' - now available with 20% off.",
                time: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
                type: "promotion",
                read: false
            },
            {
                id: 3,
                title: "Order Confirmation",
                content: "Your order #12345 has been confirmed and will be shipped within 2-3 business days.",
                time: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
                type: "order",
                read: true
            }
        ];

        // Add random notifications for demo
        if (Math.random() > 0.5) {
            mockNotifications.unshift({
                id: Date.now(),
                title: "Flash Sale Alert!",
                content: "Limited time offer: 30% off on all premium fragrances. Don't miss out!",
                time: new Date().toISOString(),
                type: "promotion",
                read: false
            });
        }

        return mockNotifications;
    }

    displayNotifications(notifications) {
        if (!this.notificationList) return;

        this.notificationList.innerHTML = '';

        if (notifications.length === 0) {
            this.showEmptyState();
            return;
        }

        notifications.forEach(notification => {
            const notificationElement = this.createNotificationElement(notification);
            this.notificationList.appendChild(notificationElement);
        });

        this.updateUnreadCount();
        this.showContentState();
    }

    createNotificationElement(notification) {
        const notificationItem = document.createElement('div');
        notificationItem.className = `notification-item ${!notification.read ? 'unread' : ''}`;

        const timeAgo = this.getTimeAgo(new Date(notification.time));

        notificationItem.innerHTML = `
            <div class="notification-item-header">
                <h4 class="notification-item-title">${notification.title}</h4>
                <span class="notification-item-time">${timeAgo}</span>
            </div>
            <p class="notification-item-content">${notification.content}</p>
            <span class="notification-item-type ${notification.type}">${notification.type}</span>
        `;

        // Mark as read when clicked
        notificationItem.addEventListener('click', () => {
            if (!notification.read) {
                notification.read = true;
                notificationItem.classList.remove('unread');
                this.updateUnreadCount();
            }
        });

        return notificationItem;
    }

    getTimeAgo(date) {
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

        return date.toLocaleDateString();
    }

    updateUnreadCount() {
        this.unreadCount = this.notifications.filter(n => !n.read).length;
        this.updateBadge();
        this.updateIconState();
    }

    updateBadge() {
        if (!this.notificationBadge) return;

        if (this.unreadCount > 0) {
            this.notificationBadge.textContent = this.unreadCount > 99 ? '99+' : this.unreadCount.toString();
            this.notificationBadge.style.display = 'block';
        } else {
            this.notificationBadge.style.display = 'none';
        }
    }

    updateIconState() {
        if (!this.notificationIcon) return;

        if (this.unreadCount > 0) {
            this.notificationIcon.classList.add('has-notifications');
        } else {
            this.notificationIcon.classList.remove('has-notifications');
        }
    }

    markAllAsRead() {
        this.notifications.forEach(notification => {
            notification.read = true;
        });

        // Update UI
        const unreadItems = this.notificationList?.querySelectorAll('.notification-item.unread');
        unreadItems?.forEach(item => {
            item.classList.remove('unread');
        });

        this.updateUnreadCount();
    }

    showLoadingState() {
        if (this.notificationLoading) this.notificationLoading.style.display = 'flex';
        if (this.notificationContent) this.notificationContent.style.display = 'none';
        if (this.notificationEmpty) this.notificationEmpty.style.display = 'none';
        if (this.notificationError) this.notificationError.style.display = 'none';
    }

    showContentState() {
        if (this.notificationLoading) this.notificationLoading.style.display = 'none';
        if (this.notificationContent) this.notificationContent.style.display = 'block';
        if (this.notificationEmpty) this.notificationEmpty.style.display = 'none';
        if (this.notificationError) this.notificationError.style.display = 'none';
    }

    showEmptyState() {
        if (this.notificationLoading) this.notificationLoading.style.display = 'none';
        if (this.notificationContent) this.notificationContent.style.display = 'none';
        if (this.notificationEmpty) this.notificationEmpty.style.display = 'flex';
        if (this.notificationError) this.notificationError.style.display = 'none';
    }

    showErrorState() {
        if (this.notificationLoading) this.notificationLoading.style.display = 'none';
        if (this.notificationContent) this.notificationContent.style.display = 'none';
        if (this.notificationEmpty) this.notificationEmpty.style.display = 'none';
        if (this.notificationError) this.notificationError.style.display = 'flex';
    }

    // Add a new notification (for real-time updates)
    addNotification(notification) {
        notification.id = Date.now();
        notification.time = new Date().toISOString();
        notification.read = false;

        this.notifications.unshift(notification);
        this.updateUnreadCount();

        console.log('ðŸ”” New notification:', notification.title);
    }

    // Start periodic check for new notifications
    startPeriodicCheck() {
        // Check for new notifications every 30 seconds
        setInterval(() => {
            // Only check for signed-in users
            if (this.isUserSignedIn) {
                this.checkForNewNotifications();
            }
        }, 30000);
    }

    async checkForNewNotifications() {
        // Only check for signed-in users
        if (!this.isUserSignedIn) return;

        // Simulate random new notifications
        if (Math.random() > 0.9) { // 10% chance
            const randomNotifications = [
                {
                    title: "Special Offer Available",
                    content: "Limited time: Get 25% off on your next purchase!",
                    type: "promotion"
                },
                {
                    title: "New Product Launch",
                    content: "Discover our latest fragrance collection now available.",
                    type: "system"
                },
                {
                    title: "Account Security",
                    content: "Your account security settings have been updated.",
                    type: "system"
                }
            ];

            const randomNotification = randomNotifications[Math.floor(Math.random() * randomNotifications.length)];
            this.addNotification(randomNotification);
        }
    }
}

// News Manager
class NewsManager {
    constructor() {
        this.newsModal = document.getElementById('newsModal');
        this.newsIcon = document.getElementById('navbarNewsIcon');
        this.newsBadge = document.getElementById('newsNotificationBadge');
        this.newsContent = document.getElementById('newsContent');
        this.newsList = document.getElementById('newsList');
        this.newsLoading = document.getElementById('newsLoading');
        this.newsError = document.getElementById('newsError');
        this.newsModalClose = document.getElementById('newsModalClose');
        this.newsModalOverlay = document.getElementById('newsModalOverlay');
        this.newsRetryBtn = document.getElementById('newsRetryBtn');

        this.initializeEventListeners();
        this.checkForNewNews();
    }

    initializeEventListeners() {
        // Open news modal
        if (this.newsIcon) {
            this.newsIcon.addEventListener('click', () => {
                this.openNewsModal();
            });
        }

        // Close news modal
        if (this.newsModalClose) {
            this.newsModalClose.addEventListener('click', () => {
                this.closeNewsModal();
            });
        }

        if (this.newsModalOverlay) {
            this.newsModalOverlay.addEventListener('click', () => {
                this.closeNewsModal();
            });
        }

        // Retry button
        if (this.newsRetryBtn) {
            this.newsRetryBtn.addEventListener('click', () => {
                this.loadNews();
            });
        }

        // ESC key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.newsModal && this.newsModal.classList.contains('show')) {
                this.closeNewsModal();
            }
        });
    }

    async openNewsModal() {
        if (!this.newsModal) return;

        this.newsModal.classList.add('show');
        document.body.style.overflow = 'hidden';

        // Hide notification badge when opened
        this.hideNotificationBadge();

        // Load news
        await this.loadNews();
    }

    closeNewsModal() {
        if (!this.newsModal) return;

        this.newsModal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }

    async loadNews() {
        this.showLoadingState();

        try {
            // Simulate API call - replace with real endpoint
            const news = await this.fetchNews();
            this.displayNews(news);
        } catch (error) {
            console.error('Error loading news:', error);
            this.showErrorState();
        }
    }

    async fetchNews() {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock news data - replace with real API call
        return [
            {
                id: 1,
                title: "New Luxury Fragrance Collection Launch",
                content: "We're excited to announce the launch of our exclusive luxury fragrance collection featuring rare ingredients from around the world.",
                date: new Date().toISOString(),
                type: "feature",
                badge: "New"
            },
            {
                id: 2,
                title: "Website Performance Improvements",
                content: "We've upgraded our servers and optimized the website for faster loading times and better user experience.",
                date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
                type: "update",
                badge: "Update"
            },
            {
                id: 3,
                title: "Special Holiday Discounts Available",
                content: "Don't miss our limited-time holiday offers with up to 30% off on selected premium fragrances.",
                date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
                type: "urgent",
                badge: "Limited Time"
            }
        ];
    }

    displayNews(newsItems) {
        if (!this.newsList) return;

        this.newsList.innerHTML = '';

        newsItems.forEach(item => {
            const newsElement = this.createNewsElement(item);
            this.newsList.appendChild(newsElement);
        });

        this.showContentState();
    }

    createNewsElement(item) {
        const newsItem = document.createElement('div');
        newsItem.className = 'news-item';

        const formattedDate = new Date(item.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });

        newsItem.innerHTML = `
            <div class="news-item-header">
                <h3 class="news-item-title">${item.title}</h3>
                <span class="news-item-date">${formattedDate}</span>
            </div>
            <p class="news-item-content">${item.content}</p>
            ${item.badge ? `<span class="news-item-badge ${item.type}">${item.badge}</span>` : ''}
        `;

        return newsItem;
    }

    showLoadingState() {
        if (this.newsLoading) this.newsLoading.style.display = 'flex';
        if (this.newsContent) this.newsContent.style.display = 'none';
        if (this.newsError) this.newsError.style.display = 'none';
    }

    showContentState() {
        if (this.newsLoading) this.newsLoading.style.display = 'none';
        if (this.newsContent) this.newsContent.style.display = 'block';
        if (this.newsError) this.newsError.style.display = 'none';
    }

    showErrorState() {
        if (this.newsLoading) this.newsLoading.style.display = 'none';
        if (this.newsContent) this.newsContent.style.display = 'none';
        if (this.newsError) this.newsError.style.display = 'flex';
    }

    checkForNewNews() {
        // Check if there are new news items (simulate)
        const lastCheck = localStorage.getItem('lastNewsCheck');
        const now = Date.now();

        if (!lastCheck || (now - parseInt(lastCheck)) > 86400000) { // 24 hours
            this.showNotificationBadge();
        }
    }

    showNotificationBadge() {
        if (this.newsBadge) {
            this.newsBadge.style.display = 'block';
        }
        if (this.newsIcon) {
            this.newsIcon.classList.add('has-news');
        }
    }

    hideNotificationBadge() {
        if (this.newsBadge) {
            this.newsBadge.style.display = 'none';
        }
        if (this.newsIcon) {
            this.newsIcon.classList.remove('has-news');
        }
        // Update last check time
        localStorage.setItem('lastNewsCheck', Date.now().toString());
    }
}

// User Statistics Manager
class UserStatsManager {
    constructor() {
        console.log('ðŸ” UserStatsManager initializing...');

        // Immediate scan
        this.debugScan();

        // Force immediate scan and update
        setTimeout(async () => {
            await this.forceRefresh();
        }, 500);
    }

    // Debug scan to see what's in localStorage immediately
    debugScan() {
        console.log('ðŸ” === IMMEDIATE DEBUG SCAN ===');
        console.log('localStorage length:', localStorage.length);

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = localStorage.getItem(key);

            console.log(`Key: "${key}" | Value: ${value.substring(0, 100)}${value.length > 100 ? '...' : ''}`);

            // Try to parse as JSON
            try {
                const parsed = JSON.parse(value);
                if (parsed && typeof parsed === 'object' && parsed.email) {
                    console.log(`  â†³ Found email: ${parsed.email} | Name: ${parsed.name || 'No name'}`);
                }
            } catch (e) {
                // Not JSON, skip
            }
        }

        // Check sessionStorage too
        const sessionUser = sessionStorage.getItem('user');
        if (sessionUser) {
            console.log('SessionStorage user:', sessionUser.substring(0, 100));
        }
    }

    // Get actual user count from the server database
    async getUserCount() {
        try {
            // Try to fetch from server database first
            const serverCount = await this.fetchServerUserCount();
            if (serverCount !== null) {
                return serverCount;
            }
        } catch (error) {
            console.log('ðŸ“Š Server unavailable, falling back to localStorage');
        }

        // Fallback to localStorage scan
        const allUsers = this.scanAllStoredUsers();
        return allUsers.length;
    }

    // Fetch user count from server database (public endpoint)
    async fetchServerUserCount() {
        try {
            const response = await fetch('/api/stats/users');

            if (!response.ok) {
                console.log('ðŸ“Š Server request failed:', response.status);
                return null;
            }

            const data = await response.json();

            if (data.success && data.stats) {
                const totalUsers = data.stats.totalUsers;

                console.log(`ðŸ“Š Server database: ${totalUsers} total registered users`);
                return totalUsers;
            }

            return null;
        } catch (error) {
            console.log('ðŸ“Š Error fetching server user count:', error);
            return null;
        }
    }

    // Scan localStorage as fallback
    scanAllStoredUsers() {
        const foundUsers = new Set();

        // Check all localStorage keys for user data
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);

            try {
                const data = localStorage.getItem(key);
                const parsed = JSON.parse(data);

                // Look for objects with email property
                if (parsed && typeof parsed === 'object' && parsed.email) {
                    // Only count Gmail accounts
                    if (parsed.email.toLowerCase().includes('@gmail.com')) {
                        foundUsers.add(parsed.email.toLowerCase());
                    }
                }
            } catch (e) {
                // Skip non-JSON data
            }
        }

        return Array.from(foundUsers);
    }

    // Get all registered Gmail users
    getRegisteredGmailUsers() {
        const users = localStorage.getItem('parfumerie_registered_gmail_users');
        return users ? JSON.parse(users) : [];
    }

    // Save registered Gmail users
    saveRegisteredGmailUsers(users) {
        localStorage.setItem('parfumerie_registered_gmail_users', JSON.stringify(users));
    }

    async addNewUser(email) {
        // Track all registered users
        if (!email) {
            console.log(`ðŸ“Š No email provided`);
            return;
        }

        console.log(`ðŸ“Š New user registered: ${email}`);

        // Update display with real count from server
        await this.updateNavbarDisplay();
    }

    async updateNavbarDisplay() {
        const counterElement = document.getElementById('userCountSmall');
        const counterContainer = document.getElementById('userCounterCompact');

        if (!counterElement) return;

        // Show loading state
        this.showLoadingState(counterElement);

        try {
            const userCount = await this.getUserCount();

            // Hide loading and animate to final number
            setTimeout(() => {
                this.hideLoadingState(counterElement);
                this.animateCounter(counterElement, userCount);

                // Add success state
                if (counterContainer) {
                    counterContainer.classList.add('success');
                    setTimeout(() => {
                        counterContainer.classList.remove('success');
                    }, 500);
                }
            }, 600); // Shorter delay for compact counter

            console.log(`ðŸ“Š Updated compact counter - Total users: ${userCount}`);
        } catch (error) {
            console.error('ðŸ“Š Error updating compact counter:', error);
            this.hideLoadingState(counterElement);
            counterElement.textContent = '?';
        }
    }

    showLoadingState(element) {
        const loadingDots = element.querySelector('.loading-dots-small');
        if (loadingDots) {
            loadingDots.style.display = 'inline-block';
        }
        element.style.opacity = '0.7';
    }

    hideLoadingState(element) {
        const loadingDots = element.querySelector('.loading-dots-small');
        if (loadingDots) {
            loadingDots.style.display = 'none';
        }
        element.style.opacity = '1';
    }

    animateCounter(element, targetValue) {
        const currentValue = parseInt(element.textContent) || 0;

        // Clear any existing content first
        element.innerHTML = '';

        if (currentValue === targetValue && targetValue !== 0) {
            element.textContent = targetValue.toString();
            return;
        }

        // Add updating class for animation
        element.classList.add('updating');

        // Use easing function for smooth animation
        const startValue = currentValue;
        const difference = targetValue - startValue;
        const duration = Math.min(2500, Math.abs(difference) * 200 + 800); // Longer, more elegant animation
        const startTime = performance.now();

        // Enhanced easing function for more elegant motion
        const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutQuart(progress);

            const currentNumber = Math.round(startValue + (difference * easedProgress));

            // Add number formatting for larger numbers
            const formattedNumber = this.formatNumber(currentNumber);
            element.textContent = formattedNumber;

            // Add visual feedback during counting
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Final value and cleanup
                const finalFormatted = this.formatNumber(targetValue);
                element.textContent = finalFormatted;
                element.classList.remove('updating');

                // Add completion effect
                this.addCompletionEffect(element);
            }
        };

        requestAnimationFrame(animate);
    }

    // Format numbers for better readability
    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    // Add visual completion effect
    addCompletionEffect(element) {
        const counterContainer = element.closest('.navbar-user-counter');
        if (counterContainer) {
            // Brief highlight effect
            counterContainer.style.transform = 'translateY(-2px) scale(1.05)';
            counterContainer.style.boxShadow = '0 12px 30px rgba(16, 185, 129, 0.3)';

            setTimeout(() => {
                counterContainer.style.transform = '';
                counterContainer.style.boxShadow = '';
            }, 300);
        }
    }

    // Add demo Gmail users for testing
    addDemoUsers() {
        const demoGmailUsers = [
            { name: 'John Doe', email: 'john.doe@gmail.com' },
            { name: 'Jane Smith', email: 'jane.smith@gmail.com' },
            { name: 'Mike Johnson', email: 'mike.johnson@gmail.com' },
            { name: 'Sarah Wilson', email: 'sarah.wilson@gmail.com' },
            { name: 'David Brown', email: 'david.brown@gmail.com' }
        ];

        demoGmailUsers.forEach((user, index) => {
            setTimeout(() => {
                // Create actual user account in localStorage
                const userData = {
                    name: user.name,
                    email: user.email,
                    avatar: 'default.jpg',
                    registrationDate: new Date().toISOString()
                };

                localStorage.setItem(`user_${user.email}`, JSON.stringify(userData));
                this.addNewUser(user.email);
                console.log(`ðŸ‘¤ Demo Gmail user created: ${user.name} (${user.email})`);
            }, index * 500);
        });
    }

    resetStats() {
        // Remove Gmail user statistics
        localStorage.removeItem('parfumerie_registered_gmail_users');

        // Also remove demo user accounts
        for (let i = localStorage.length - 1; i >= 0; i--) {
            const key = localStorage.key(i);
            if (key && key.startsWith('user_') && key.includes('@gmail.com')) {
                localStorage.removeItem(key);
            }
        }

        this.updateNavbarDisplay();
        console.log('ðŸ“Š Gmail user statistics reset');
    }

    // Debug function to show all users in database
    showAllUsers() {
        const scannedUsers = this.scanAllStoredUsers();
        const userCount = this.getUserCount();

        console.log('ðŸ“Š === COMPLETE DATABASE SCAN ===');
        console.log(`Total Gmail users found: ${userCount}`);
        console.log('Gmail accounts detected:', scannedUsers);

        console.log('\nðŸ’¾ Full localStorage scan:');

        // Show ALL localStorage items
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            try {
                const data = localStorage.getItem(key);
                const parsed = JSON.parse(data);

                // Check if it contains user data
                if (parsed && typeof parsed === 'object') {
                    if (parsed.email) {
                        const isGmail = parsed.email.toLowerCase().includes('@gmail.com');
                        console.log(`  â€¢ ${key}: ${parsed.name || 'No name'} - ${parsed.email} ${isGmail ? 'âœ… Gmail' : 'âŒ Not Gmail'}`);
                    } else if (parsed.name || parsed.firstName) {
                        console.log(`  â€¢ ${key}: ${parsed.name || parsed.firstName} - No email`);
                    }
                }
            } catch (e) {
                // Show non-JSON data too
                if (key.includes('user') || key.includes('@')) {
                    console.log(`  â€¢ ${key}: ${localStorage.getItem(key)} (not JSON)`);
                }
            }
        }

        // Check sessionStorage
        console.log('\nðŸ’¾ SessionStorage:');
        try {
            const sessionUser = sessionStorage.getItem('user');
            if (sessionUser) {
                const parsed = JSON.parse(sessionUser);
                const isGmail = parsed.email && parsed.email.toLowerCase().includes('@gmail.com');
                console.log(`  â€¢ Current session user: ${parsed.name || 'No name'} - ${parsed.email || 'No email'} ${isGmail ? 'âœ… Gmail' : 'âŒ Not Gmail'}`);
            } else {
                console.log('  â€¢ No session user');
            }
        } catch (e) {
            console.log('  â€¢ Invalid session data');
        }

        console.log('\nðŸ” Search patterns used:');
        console.log('  â€¢ Looking for objects with email property');
        console.log('  â€¢ Filtering for @gmail.com addresses only');
        console.log('  â€¢ Scanning all localStorage and sessionStorage');
    }

    // Force refresh the counter
    async forceRefresh() {
        console.log('ðŸ”„ Force refreshing user counter...');
        await this.updateNavbarDisplay();

        const userCount = await this.getUserCount();

        console.log(`ðŸ“Š Force refresh complete - Found ${userCount} Gmail users`);

        // If still 0, show detailed debug info
        if (userCount === 0) {
            console.log('âš ï¸ No Gmail users found. Running detailed scan...');
            this.showAllUsers();
        }
    }
}

// Theme System Based on Background Sections
class ThemeManager {
    constructor() {
        this.currentTheme = 'dark'; // default theme
        this.themeElements = [];
        this.transitionPoints = null; // Cache transition points
        this.isInitialized = false;
        this.init();
    }

    init() {
        // Wait for DOM to be fully loaded before calculating transition points
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initializeAfterLoad();
            });
        } else {
            this.initializeAfterLoad();
        }
    }

    initializeAfterLoad() {
        // Register theme-aware elements
        this.registerThemeElements();

        // Calculate and cache transition points
        this.calculateTransitionPoints();

        // Update theme on scroll
        this.updateThemeOnScroll();

        // Initial theme update
        this.updateTheme();

        this.isInitialized = true;

        // Recalculate transition points on window resize
        window.addEventListener('resize', () => {
            this.calculateTransitionPoints();
            this.updateTheme();
        });

        console.log('ðŸŽ¨ Theme system initialized with stable transition points');
    }

    registerThemeElements() {
        // Register favorite buttons
        this.themeElements.push({
            selector: '.favorite-btn',
            themes: {
                dark: {
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '2px solid rgba(212, 175, 55, 0.3)',
                    color: 'rgba(255, 255, 255, 0.8)',
                    hoverBackground: 'rgba(212, 175, 55, 0.2)',
                    hoverBorder: 'rgba(212, 175, 55, 0.6)',
                    hoverColor: 'rgba(255, 255, 255, 1)'
                },
                cream: {
                    background: 'rgba(139, 115, 85, 0.1)',
                    border: '2px solid rgba(139, 115, 85, 0.4)',
                    color: 'rgba(93, 64, 55, 0.9)',
                    hoverBackground: 'rgba(139, 115, 85, 0.2)',
                    hoverBorder: 'rgba(139, 115, 85, 0.7)',
                    hoverColor: 'rgba(93, 64, 55, 1)'
                },
                light: {
                    background: 'rgba(139, 139, 139, 0.1)',
                    border: '2px solid rgba(139, 139, 139, 0.4)',
                    color: 'rgba(73, 80, 87, 0.9)',
                    hoverBackground: 'rgba(139, 139, 139, 0.2)',
                    hoverBorder: 'rgba(139, 139, 139, 0.7)',
                    hoverColor: 'rgba(73, 80, 87, 1)'
                }
            }
        });

        // Register other theme-aware elements
        this.themeElements.push({
            selector: '.product-header-row',
            themes: {
                dark: { color: 'rgba(255, 255, 255, 0.9)' },
                cream: { color: 'rgba(93, 64, 55, 0.9)' },
                light: { color: 'rgba(73, 80, 87, 0.9)' }
            }
        });
    }

    calculateTransitionPoints() {
        const windowHeight = window.innerHeight;

        // Calculate transition points once and cache them
        const haltaneSection = document.querySelector('.haltane-section-container');
        const creamTransitionStart = haltaneSection ? haltaneSection.offsetTop + 500 : windowHeight * 2;
        const creamTransitionRange = windowHeight * 0.3;
        const creamTransitionEnd = creamTransitionStart + creamTransitionRange;

        const pegasusSection = document.querySelector('.pegasus-image');
        const greyTransitionStart = pegasusSection ? pegasusSection.closest('.content').offsetTop - 200 : creamTransitionEnd + windowHeight;

        this.transitionPoints = {
            creamStart: creamTransitionStart,
            creamEnd: creamTransitionEnd,
            greyStart: greyTransitionStart
        };

        console.log('ðŸ“ Theme transition points calculated:', this.transitionPoints);
    }

    getCurrentBackgroundTheme() {
        if (!this.transitionPoints) {
            this.calculateTransitionPoints();
        }

        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const { creamStart, greyStart } = this.transitionPoints;

        if (scrollTop < creamStart) {
            return 'dark';
        } else if (scrollTop < greyStart) {
            return 'cream';
        } else {
            return 'light';
        }
    }

    updateTheme() {
        if (!this.isInitialized) {
            return; // Don't update theme until fully initialized
        }

        const newTheme = this.getCurrentBackgroundTheme();

        if (newTheme !== this.currentTheme) {
            const oldTheme = this.currentTheme;
            this.currentTheme = newTheme;
            this.applyTheme(newTheme);

            // Show theme change notification (only after initial load and for significant changes)
            if (this.isInitialized && oldTheme && oldTheme !== newTheme) {
                this.showThemeChangeNotification(oldTheme, newTheme);
            }

            // Dispatch theme change event
            window.dispatchEvent(new CustomEvent('themeChanged', {
                detail: { theme: newTheme, previousTheme: oldTheme }
            }));
        }
    }

    applyTheme(theme) {
        // Prevent rapid theme changes
        if (this.lastAppliedTheme === theme) {
            return;
        }

        this.lastAppliedTheme = theme;

        this.themeElements.forEach(elementConfig => {
            const elements = document.querySelectorAll(elementConfig.selector);
            const themeStyles = elementConfig.themes[theme];

            if (!themeStyles) return;

            elements.forEach(element => {
                // Apply base styles
                Object.keys(themeStyles).forEach(property => {
                    if (property.startsWith('hover')) return; // Skip hover styles for now

                    const cssProperty = this.camelToKebab(property);
                    element.style.setProperty(cssProperty, themeStyles[property]);
                });

                // Add theme class for CSS-based styling
                element.classList.remove('theme-dark', 'theme-cream', 'theme-light');
                element.classList.add(`theme-${theme}`);
            });
        });

        // Update body theme class
        document.body.classList.remove('theme-dark', 'theme-cream', 'theme-light');
        document.body.classList.add(`theme-${theme}`);

        // Force apply specific styles to favorite buttons for better visibility
        const favoriteButtons = document.querySelectorAll('.favorite-btn');
        favoriteButtons.forEach(button => {
            // Add theme class
            button.classList.remove('theme-dark', 'theme-cream', 'theme-light');
            button.classList.add(`theme-${theme}`);

            // Force apply inline styles for maximum visibility
            if (theme === 'cream') {
                button.style.setProperty('background', 'rgba(255, 255, 255, 0.95)', 'important');
                button.style.setProperty('color', 'rgba(0, 0, 0, 0.95)', 'important');
                button.style.setProperty('border', '1.5px solid rgba(93, 64, 55, 0.8)', 'important');
                button.style.setProperty('text-shadow', 'none', 'important');
            } else if (theme === 'light') {
                button.style.setProperty('background', 'rgba(255, 255, 255, 0.95)', 'important');
                button.style.setProperty('color', 'rgba(0, 0, 0, 0.95)', 'important');
                button.style.setProperty('border', '1.5px solid rgba(73, 80, 87, 0.8)', 'important');
                button.style.setProperty('text-shadow', 'none', 'important');
            } else if (theme === 'dark') {
                button.style.setProperty('background', 'linear-gradient(135deg, rgba(0, 0, 0, 0.4), rgba(20, 20, 20, 0.6))', 'important');
                button.style.setProperty('color', 'rgba(255, 255, 255, 0.9)', 'important');
                button.style.setProperty('border', '1.5px solid rgba(212, 175, 55, 0.5)', 'important');
                button.style.setProperty('text-shadow', '0 1px 2px rgba(0, 0, 0, 0.5)', 'important');
            }
        });

        console.log(`ðŸŽ¨ Theme applied: ${theme} - Favorite buttons updated with forced styles`);
    }

    camelToKebab(str) {
        return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
    }

    showThemeChangeNotification(oldTheme, newTheme) {
        const themeNames = {
            dark: 'ðŸ–¤ Dark',
            cream: 'ðŸ¤Ž Cream',
            light: 'ðŸ©¶ Light'
        };

        const message = `Theme changed to ${themeNames[newTheme]}`;

        // Create a subtle theme notification
        const notification = document.createElement('div');
        notification.className = 'theme-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            z-index: 9999;
            font-size: 12px;
            font-weight: 500;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            transform: translateY(100%);
            transition: transform 0.3s ease;
            pointer-events: none;
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateY(0)';
        }, 100);

        // Remove after 2 seconds
        setTimeout(() => {
            notification.style.transform = 'translateY(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 2000);
    }

    updateThemeOnScroll() {
        // Debounce theme updates to prevent rapid changes
        let themeUpdateTimeout;

        const debouncedThemeUpdate = () => {
            clearTimeout(themeUpdateTimeout);
            themeUpdateTimeout = setTimeout(() => {
                this.updateTheme();
            }, 100); // 100ms debounce
        };

        // Add theme update to the existing scroll handler
        const originalUpdateColors = window.updateColors;
        if (originalUpdateColors) {
            window.updateColors = () => {
                originalUpdateColors();
                debouncedThemeUpdate();
            };
        }
    }

    // Public methods
    getTheme() {
        return this.currentTheme;
    }

    forceTheme(theme) {
        if (['dark', 'cream', 'light'].includes(theme)) {
            this.currentTheme = theme;
            this.lastAppliedTheme = null; // Reset to force application
            this.applyTheme(theme);
            console.log(`ðŸŽ¯ Theme forced to: ${theme}`);
        }
    }

    // Fix theme inconsistencies
    fixThemeInconsistencies() {
        console.log('ðŸ”§ Fixing theme inconsistencies...');

        // Recalculate transition points
        this.calculateTransitionPoints();

        // Reset applied theme to force reapplication
        this.lastAppliedTheme = null;

        // Update theme based on current scroll position
        this.updateTheme();

        console.log('âœ… Theme inconsistencies fixed');
    }

    // Reset theme system
    resetThemeSystem() {
        console.log('ðŸ”„ Resetting theme system...');

        this.transitionPoints = null;
        this.lastAppliedTheme = null;
        this.currentTheme = 'dark';

        // Recalculate and reapply
        this.calculateTransitionPoints();
        this.updateTheme();

        console.log('âœ… Theme system reset complete');
    }
}

// Initialize theme manager
const themeManager = new ThemeManager();

// Make theme manager globally available
window.themeManager = themeManager;

// Add global theme fix functions
window.fixThemes = function() {
    if (window.themeManager) {
        themeManager.fixThemeInconsistencies();
    } else {
        console.error('âŒ Theme manager not available');
    }
};

window.resetThemes = function() {
    if (window.themeManager) {
        themeManager.resetThemeSystem();
    } else {
        console.error('âŒ Theme manager not available');
    }
};

// Force show admin styling for testing
window.forceShowAdminStyling = function() {
    console.log('ðŸ‘‘ Forcing admin styling to show...');

    // Apply admin styling
    const success = checkAndApplyAdminStyling('cherifmed1200@gmail.com');

    if (success) {
        console.log('âœ… Admin styling applied');
        console.log('ðŸŽ¯ Admin effects should now be visible');

        // Don't override the admin's custom name - let them keep their chosen name
    } else {
        console.error('âŒ Failed to apply admin styling');
    }
};

// Test functions for debugging user modals
window.testProfileModal = function() {
    console.log('ðŸ§ª Testing profile modal...');
    openProfileModal();
};

// Function to clear cached user data and refresh from server
window.clearUserCache = async function() {
    console.log('ðŸ§¹ Clearing user cache and refreshing from server...');

    // Debug: Show what's currently cached
    console.log('ðŸ“Š Current localStorage contents:');
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.includes('user') || key.includes('Profile') || key.includes('Email')) {
            console.log(`   ${key}: ${localStorage.getItem(key)}`);
        }
    }

    console.log('ðŸ“Š Current sessionStorage contents:');
    for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key.includes('user') || key.includes('User')) {
            console.log(`   ${key}: ${sessionStorage.getItem(key)}`);
        }
    }

    // Clear ALL user-related cached data
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
        localStorage.removeItem(`userProfile_${userEmail}`);
        console.log(`ðŸ—‘ï¸ Cleared cached profile for ${userEmail}`);
    }

    // Clear all possible user data keys
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('userProfile_') || key.includes('user_'))) {
            keysToRemove.push(key);
        }
    }
    keysToRemove.forEach(key => {
        localStorage.removeItem(key);
        console.log(`ðŸ—‘ï¸ Removed localStorage key: ${key}`);
    });

    // Clear session storage
    sessionStorage.removeItem('userData');
    console.log('ðŸ—‘ï¸ Cleared session storage');

    // Force refresh from database
    try {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        if (token) {
            const response = await fetch('/api/dev/refresh-user-data', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log('ðŸ”„ Fresh user data from database:', data.user);

                // Update session storage with fresh data
                sessionStorage.setItem('userData', JSON.stringify(data.user));

                // Update UI immediately
                if (typeof updateUserUI === 'function') {
                    updateUserUI(data.user);
                }

                console.log('âœ… User data refreshed from database! Avatar should now show:', data.user.avatar);
            } else {
                console.error('âŒ Failed to refresh user data from server');
            }
        }
    } catch (error) {
        console.error('âŒ Error refreshing user data:', error);
    }

    // Also try the old refresh method as fallback
    if (typeof refreshUserSession === 'function') {
        refreshUserSession();
        console.log('ðŸ”„ Also called legacy refresh method');
    }

    console.log('âœ… User cache cleared and refreshed!');
};

// Debug function to check avatar issues
window.debugAvatar = function() {
    console.log('ðŸ” === AVATAR DEBUG REPORT ===');

    // Check localStorage
    console.log('ðŸ“¦ localStorage contents:');
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('user') || key.includes('Profile') || key.includes('Email'))) {
            const value = localStorage.getItem(key);
            console.log(`   ${key}:`, value);
            if (value && value.includes('avatar')) {
                console.log('   âš ï¸ Found avatar in localStorage!');
            }
        }
    }

    // Check sessionStorage
    console.log('ðŸ“¦ sessionStorage contents:');
    for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && key.includes('user')) {
            const value = sessionStorage.getItem(key);
            console.log(`   ${key}:`, value);
            if (value && value.includes('avatar')) {
                console.log('   âš ï¸ Found avatar in sessionStorage!');
            }
        }
    }

    // Check current avatar elements
    const userAvatar = document.getElementById('userAvatar');
    const profileAvatarLarge = document.getElementById('profileAvatarLarge');

    console.log('ðŸ–¼ï¸ Current avatar elements:');
    if (userAvatar) {
        console.log(`   userAvatar.src: ${userAvatar.src}`);
    }
    if (profileAvatarLarge) {
        console.log(`   profileAvatarLarge.src: ${profileAvatarLarge.src}`);
    }

    // Test default.jpg accessibility
    console.log('ðŸŒ Testing default.jpg accessibility...');
    const testImg = new Image();
    testImg.onload = () => console.log('âœ… default.jpg loads successfully');
    testImg.onerror = () => console.error('âŒ default.jpg failed to load');
    testImg.src = 'default.jpg?' + Date.now(); // Add cache buster

    console.log('ðŸ” === END AVATAR DEBUG ===');
};

// Nuclear option: Force update all avatars to default.jpg immediately
window.forceDefaultAvatar = function() {
    console.log('ðŸ’¥ FORCING ALL AVATARS TO DEFAULT.JPG');

    // Update all avatar elements immediately
    const userAvatar = document.getElementById('userAvatar');
    const profileAvatarLarge = document.getElementById('profileAvatarLarge');

    if (userAvatar) {
        userAvatar.src = 'default.jpg?' + Date.now();
        console.log('âœ… Updated userAvatar to default.jpg');
    }

    if (profileAvatarLarge) {
        profileAvatarLarge.src = 'default.jpg?' + Date.now();
        console.log('âœ… Updated profileAvatarLarge to default.jpg');
    }

    // Update cached data
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
        const cachedProfile = localStorage.getItem(`userProfile_${userEmail}`);
        if (cachedProfile) {
            try {
                const profile = JSON.parse(cachedProfile);
                profile.avatar = 'default.jpg';
                localStorage.setItem(`userProfile_${userEmail}`, JSON.stringify(profile));
                console.log('âœ… Updated cached profile avatar');
            } catch (e) {
                console.error('âŒ Error updating cached profile:', e);
            }
        }
    }

    // Update session storage
    const sessionData = sessionStorage.getItem('userData');
    if (sessionData) {
        try {
            const userData = JSON.parse(sessionData);
            userData.avatar = 'default.jpg';
            sessionStorage.setItem('userData', JSON.stringify(userData));
            console.log('âœ… Updated session storage avatar');
        } catch (e) {
            console.error('âŒ Error updating session storage:', e);
        }
    }

    console.log('ðŸ’¥ FORCE UPDATE COMPLETE - All avatars should now show default.jpg');
};

// Auto-fix avatars on page load
function autoFixAvatars() {
    console.log('ðŸ”§ Auto-fixing avatars to use default.jpg...');

    // Wait a bit for the page to fully load
    setTimeout(() => {
        // Check if any avatars are using ui-avatars.com
        const userAvatar = document.getElementById('userAvatar');
        const profileAvatarLarge = document.getElementById('profileAvatarLarge');

        let needsFix = false;

        if (userAvatar && userAvatar.src.includes('ui-avatars.com')) {
            userAvatar.src = 'default.jpg?' + Date.now();
            console.log('âœ… Auto-fixed userAvatar');
            needsFix = true;
        }

        if (profileAvatarLarge && profileAvatarLarge.src.includes('ui-avatars.com')) {
            profileAvatarLarge.src = 'default.jpg?' + Date.now();
            console.log('âœ… Auto-fixed profileAvatarLarge');
            needsFix = true;
        }

        // Also fix cached data if needed
        const sessionData = sessionStorage.getItem('userData');
        if (sessionData) {
            try {
                const userData = JSON.parse(sessionData);
                if (userData.avatar && userData.avatar.includes('ui-avatars.com')) {
                    userData.avatar = 'default.jpg';
                    sessionStorage.setItem('userData', JSON.stringify(userData));
                    console.log('âœ… Auto-fixed session storage avatar');
                    needsFix = true;
                }
            } catch (e) {
                // Ignore parsing errors
            }
        }

        if (needsFix) {
            console.log('ðŸŽ‰ Auto-fix completed - avatars now use default.jpg');
        } else {
            console.log('âœ… No avatar fixes needed');
        }
    }, 2000); // Wait 2 seconds for everything to load
}

// Run auto-fix when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoFixAvatars);
} else {
    autoFixAvatars();
}

window.testFavoritesModal = function() {
    console.log('ðŸ§ª Testing favorites modal...');
    openFavoritesModal();
};

// Test function to manually update profile in reviews
window.testUpdateReviewProfile = async function() {
    console.log('ðŸ§ª Testing review profile update...');
    if (window.reviewsManager) {
        const currentUser = getCurrentUser();
        if (currentUser) {
            console.log('ðŸ‘¤ Current user data:', currentUser);
            await window.reviewsManager.updateUserProfileInDatabase(currentUser.name, currentUser.avatar);
            console.log('âœ… Test profile update completed');
        } else {
            console.error('âŒ No current user found');
        }
    } else {
        console.error('âŒ Reviews manager not found');
    }
};

// Test function to check current user data
window.testCurrentUser = function() {
    const currentUser = getCurrentUser();
    console.log('ðŸ‘¤ Current user data:', currentUser);
    return currentUser;
};

// ðŸš€ REAL-TIME TEST: Test the real-time profile update system
window.testRealTimeUpdate = async function() {
    console.log('ðŸš€ TESTING REAL-TIME PROFILE UPDATE SYSTEM...');

    const currentUser = getCurrentUser();
    if (!currentUser) {
        console.error('âŒ No user logged in');
        return;
    }

    console.log('ðŸ‘¤ Current user:', currentUser);

    if (!window.reviewsManager) {
        console.error('âŒ Reviews manager not found');
        return;
    }

    try {
        // Test updating profile with a timestamp to see real-time changes
        const testName = `RealTime Test ${new Date().getSeconds()}`;
        console.log(`ðŸ”„ Updating profile to: "${testName}"`);

        const success = await window.reviewsManager.updateUserProfileInDatabase(testName, 'default.jpg');

        if (success) {
            console.log('âœ… Database updated successfully');
            console.log('ðŸ”„ Refreshing all reviews...');
            await window.reviewsManager.loadAllReviews();
            console.log('ðŸŽ‰ REAL-TIME UPDATE TEST COMPLETE!');
            console.log('ðŸ‘€ Check your reviews - they should now show the new name!');
        } else {
            console.error('âŒ Database update failed');
        }
    } catch (error) {
        console.error('âŒ Test failed:', error);
    }
};

// ðŸŽ¯ MANUAL PROFILE UPDATE: Test updating profile with custom name
window.updateMyProfileName = async function(newName) {
    console.log(`ðŸŽ¯ MANUALLY UPDATING PROFILE NAME TO: "${newName}"`);

    if (!window.reviewsManager) {
        console.error('âŒ Reviews manager not found');
        return;
    }

    try {
        const success = await window.reviewsManager.updateUserProfileInDatabase(newName, 'default.jpg');

        if (success) {
            console.log('âœ… Profile name updated in database');
            console.log('ðŸ”„ Refreshing all reviews...');
            await window.reviewsManager.loadAllReviews();
            console.log(`ðŸŽ‰ SUCCESS! Your reviews should now show: "${newName}"`);
        } else {
            console.error('âŒ Database update failed');
        }
    } catch (error) {
        console.error('âŒ Update failed:', error);
    }
};

// ðŸ–¼ï¸ MANUAL AVATAR UPDATE: Test updating profile with custom avatar
window.updateMyProfileAvatar = async function(avatarUrl) {
    console.log(`ðŸ–¼ï¸ MANUALLY UPDATING PROFILE AVATAR TO: "${avatarUrl}"`);

    const currentUser = getCurrentUser();
    if (!currentUser) {
        console.error('âŒ No user logged in');
        return;
    }

    if (!window.reviewsManager) {
        console.error('âŒ Reviews manager not found');
        return;
    }

    try {
        const success = await window.reviewsManager.updateUserProfileInDatabase(currentUser.name, avatarUrl);

        if (success) {
            console.log('âœ… Profile avatar updated in database');
            console.log('ðŸ”„ Refreshing all reviews...');
            await window.reviewsManager.loadAllReviews();
            console.log(`ðŸŽ‰ SUCCESS! Your reviews should now show new avatar: "${avatarUrl}"`);
        } else {
            console.error('âŒ Database update failed');
        }
    } catch (error) {
        console.error('âŒ Update failed:', error);
    }
};

window.testSettingsModal = function() {
    console.log('ðŸ§ª Testing settings modal...');
    openSettingsModal();
};

// Test close functionality
window.testCloseAll = function() {
    console.log('ðŸ§ª Testing close functionality...');
    closeProfileModal();
    closeFavoritesModal();
    closeSettingsModal();
    console.log('âœ… All modals should be closed');
};

// ðŸ§ª TEST PROFILE SAVE: Test the complete profile save process with database persistence
window.testProfileSave = async function(newName) {
    console.log(`ðŸ§ª TESTING PROFILE SAVE WITH DATABASE PERSISTENCE`);
    console.log(`ðŸ“ New name: "${newName}"`);

    // Set the profile form field
    const profileNameField = document.getElementById('profileName');
    if (profileNameField) {
        profileNameField.value = newName;
        console.log(`ðŸ“ Set profile name field to: "${newName}"`);

        // Trigger the save function
        console.log('ðŸš€ Calling saveProfile function...');
        await saveProfile();
        console.log('âœ… Profile save completed!');

        // Test persistence by clearing cache and reloading
        console.log('ðŸ§ª Testing persistence...');
        setTimeout(() => {
            console.log('ðŸ”„ Refreshing user data from server...');
            if (window.refreshUserProfile) {
                window.refreshUserProfile();
            }
        }, 1000);
    } else {
        console.error('âŒ Profile name field not found');
    }
};

// ðŸ§ª TEST AVATAR SAVE: Test avatar save with database persistence
window.testAvatarSave = async function(avatarUrl) {
    console.log(`ðŸ§ª TESTING AVATAR SAVE WITH DATABASE PERSISTENCE`);
    console.log(`ðŸ–¼ï¸ New avatar: "${avatarUrl}"`);

    const currentUser = getCurrentUser();
    if (!currentUser) {
        console.error('âŒ No user logged in');
        return;
    }

    console.log('ðŸ‘¤ Current user before update:', currentUser);

    // Update user data with new avatar
    currentUser.avatar = avatarUrl;

    // Save to localStorage/sessionStorage
    const storage = localStorage.getItem('authToken') ? localStorage : sessionStorage;
    storage.setItem('user', JSON.stringify(currentUser));

    console.log('ðŸ‘¤ Current user after update:', getCurrentUser());

    // Now save the profile (which will include the avatar)
    const profileNameField = document.getElementById('profileName');
    if (profileNameField && profileNameField.value) {
        console.log('ðŸš€ Saving profile with new avatar...');
        await saveProfile();
        console.log('âœ… Avatar save completed!');
    } else {
        console.error('âŒ Profile name field not found or empty');
    }
};

// ðŸ§ª CHECK CURRENT USER: Debug current user data
window.checkCurrentUser = function() {
    console.log('ðŸ” CHECKING CURRENT USER DATA...');
    const currentUser = getCurrentUser();
    console.log('ðŸ‘¤ Current user:', currentUser);

    const localUser = localStorage.getItem('user');
    const sessionUser = sessionStorage.getItem('user');

    console.log('ðŸ’¾ localStorage user:', localUser ? JSON.parse(localUser) : null);
    console.log('ðŸ’¾ sessionStorage user:', sessionUser ? JSON.parse(sessionUser) : null);

    if (currentUser && currentUser.avatar) {
        console.log(`ðŸ–¼ï¸ Current avatar: "${currentUser.avatar}"`);
        console.log(`ðŸ–¼ï¸ Avatar type: ${typeof currentUser.avatar}`);
        console.log(`ðŸ–¼ï¸ Avatar length: ${currentUser.avatar.length} characters`);
    } else {
        console.log('âŒ No avatar found in current user data');
    }
};

// ðŸ§ª REFRESH USER FROM SERVER: Fetch fresh user data from database
window.refreshUserFromServer = async function() {
    console.log('ðŸ”„ REFRESHING USER DATA FROM SERVER...');

    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (!token) {
        console.error('âŒ No auth token found');
        return;
    }

    try {
        const response = await fetch('/api/user/profile', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const freshUserData = await response.json();
            console.log('âœ… Got fresh user data from server:', freshUserData);
            console.log(`ðŸ–¼ï¸ Fresh avatar length: ${freshUserData.avatar ? freshUserData.avatar.length : 0} characters`);

            // Update sessionStorage with fresh data
            const storage = localStorage.getItem('authToken') ? localStorage : sessionStorage;

            try {
                storage.setItem('user', JSON.stringify(freshUserData));
                console.log('âœ… Updated user data in storage');

                // Trigger real-time update for reviews
                if (window.reviewsManager) {
                    console.log('ðŸ”„ Triggering real-time update in reviews...');
                    await window.reviewsManager.updateUserProfileInDatabase(freshUserData.name, freshUserData.avatar);
                    await window.reviewsManager.loadAllReviews();
                    console.log('âœ… Reviews updated with fresh data');
                }

                // Update UI
                await updateUIForLoggedInUser(freshUserData);
                console.log('âœ… UI updated with fresh data');

            } catch (storageError) {
                console.error('âŒ Storage quota exceeded! Avatar too large for sessionStorage:', storageError);
                console.log('ðŸ”„ Storing user data without avatar to avoid quota error...');

                // Store user data without the large avatar
                const userDataWithoutAvatar = { ...freshUserData, avatar: 'custom_uploaded' };
                storage.setItem('user', JSON.stringify(userDataWithoutAvatar));
                console.log('âœ… Stored user data with avatar placeholder');
            }

        } else {
            console.error('âŒ Failed to fetch user data from server:', response.status);
        }
    } catch (error) {
        console.error('âŒ Error refreshing user data:', error);
    }
};

// ðŸ§ª TEST DATABASE PERSISTENCE: Clear cache and reload from database
window.testDatabasePersistence = async function() {
    console.log('ðŸ§ª TESTING DATABASE PERSISTENCE...');

    // Clear all local storage
    console.log('ðŸ—‘ï¸ Clearing localStorage and sessionStorage...');
    const authToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    localStorage.clear();
    sessionStorage.clear();

    // Restore auth token
    if (authToken) {
        localStorage.setItem('authToken', authToken);
        console.log('ðŸ”‘ Restored auth token');
    }

    // Force reload user data from database
    console.log('ðŸ”„ Reloading user data from database...');
    if (window.refreshUserProfile) {
        const success = await window.refreshUserProfile();
        if (success) {
            console.log('âœ… User data reloaded from database successfully!');
            console.log('ðŸ‘¤ Current user data:', getCurrentUser());
        } else {
            console.error('âŒ Failed to reload user data from database');
        }
    } else {
        console.error('âŒ refreshUserProfile function not available');
    }
};

// ðŸ§ª TEST PROFILE SAVE: Test the complete profile save process
window.testProfileSave = async function(newName) {
    console.log(`ðŸ§ª TESTING PROFILE SAVE WITH NAME: "${newName}"`);

    // Set the profile form field
    const profileNameField = document.getElementById('profileName');
    if (profileNameField) {
        profileNameField.value = newName;
        console.log(`ðŸ“ Set profile name field to: "${newName}"`);

        // Trigger the save function
        console.log('ðŸš€ Calling saveProfile function...');
        await saveProfile();
        console.log('âœ… Profile save test completed!');
    } else {
        console.error('âŒ Profile name field not found');
    }
};

// Removed VIP badge and crown creation functions

// Function to check if user is admin and apply admin styling
function checkAndApplyAdminStyling(userEmail) {
    const userProfile = document.getElementById('userProfile');

    if (userProfile) {
        // Remove any existing admin class
        userProfile.classList.remove('admin-user');

        // Only apply admin styling for cherifmed1200@gmail.com
        if (userEmail === 'cherifmed1200@gmail.com') {
            userProfile.classList.add('admin-user');
            console.log('ðŸ‘‘ Admin styling applied for:', userEmail);
            return true;
        } else {
            console.log('ðŸ‘¤ Regular user styling applied for:', userEmail);
            return false;
        }
    }
    return false;
}

// Test enhanced admin profile display
window.testAdminProfile = function() {
    console.log('ðŸ‘‘ Testing enhanced admin profile...');

    // Simulate admin login
    const userProfile = document.getElementById('userProfile');
    const userAvatar = document.getElementById('userAvatar');
    const userName = document.getElementById('userName');
    const userLoggedIn = document.getElementById('userLoggedIn');
    const loginSection = document.querySelector('.user-account-section');

    if (userProfile && userAvatar && userName && userLoggedIn && loginSection) {
        // Show logged in state
        loginSection.style.display = 'none';
        userLoggedIn.style.display = 'block';

        // Set admin avatar and name
        userAvatar.src = 'data:image/svg+xml,%3Csvg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg"%3E%3Ccircle cx="22.5" cy="22.5" r="22.5" fill="%23d4af37"/%3E%3Ctext x="22.5" y="28" text-anchor="middle" fill="white" font-family="Arial" font-size="16" font-weight="bold"%3EMC%3C/text%3E%3C/svg%3E';
        userName.textContent = 'MOH CHERIF';

        // Apply admin styling for cherifmed1200@gmail.com
        const isAdmin = checkAndApplyAdminStyling('cherifmed1200@gmail.com');

        if (isAdmin) {
            console.log('âœ… Enhanced ADMIN profile displayed with:');
            console.log('   âœ¨ Golden gradient avatar border');
            console.log('   ðŸ’Ž Golden gradient name');
            console.log('   ðŸŽ¯ ADMINISTRATOR title badge');
            console.log('   ðŸ’« Glowing animations');
            console.log('');
            console.log('ðŸ’¡ This styling ONLY appears for cherifmed1200@gmail.com');
        } else {
            console.log('âœ… Regular user profile displayed');
        }
    } else {
        console.error('âŒ Could not find user profile elements');
    }
};

// Test regular user profile
window.testRegularProfile = function() {
    console.log('ðŸ‘¤ Testing regular user profile...');

    const userProfile = document.getElementById('userProfile');
    const userAvatar = document.getElementById('userAvatar');
    const userName = document.getElementById('userName');
    const userLoggedIn = document.getElementById('userLoggedIn');
    const loginSection = document.querySelector('.user-account-section');

    if (userProfile && userAvatar && userName && userLoggedIn && loginSection) {
        // Show logged in state
        loginSection.style.display = 'none';
        userLoggedIn.style.display = 'block';

        // Set regular user avatar and name
        userAvatar.src = 'data:image/svg+xml,%3Csvg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"%3E%3Ccircle cx="16" cy="16" r="16" fill="%23666666"/%3E%3Ctext x="16" y="20" text-anchor="middle" fill="white" font-family="Arial" font-size="12" font-weight="bold"%3EJD%3C/text%3E%3C/svg%3E';
        userName.textContent = 'John Doe';

        // Apply regular user styling
        const isAdmin = checkAndApplyAdminStyling('john.doe@example.com');

        console.log('âœ… Regular user profile displayed - no special effects');
        console.log('   â€¢ Standard 32px avatar');
        console.log('   â€¢ Regular white text');
        console.log('   â€¢ No administrator badge');
    } else {
        console.error('âŒ Could not find user profile elements');
    }
};

// Enhanced test functions for favorites system
window.testFavorites = async function() {
    console.log('â¤ï¸ Testing enhanced favorites system...');

    if (!window.favoritesManager) {
        console.error('âŒ Favorites manager not found!');
        return;
    }

    try {
        // Test toggling favorites
        console.log('ðŸ“ Toggling Layton favorite...');
        await window.favoritesManager.toggleFavorite('layton');

        console.log('ðŸ“ Toggling Haltane favorite...');
        await window.favoritesManager.toggleFavorite('haltane');

        console.log('ðŸ“ Current favorites:', window.favoritesManager.getFavorites());

        // Test toggling again (should remove)
        console.log('ðŸ“ Toggling Layton again (should remove)...');
        await window.favoritesManager.toggleFavorite('layton');

        console.log('ðŸ“ Final favorites:', window.favoritesManager.getFavorites());

        console.log('âœ… Enhanced favorites system test completed!');
    } catch (error) {
        console.error('âŒ Error testing favorites:', error);
    }
};

// Test individual favorite buttons
window.testFavoriteButtons = function() {
    console.log('ðŸ”˜ Testing favorite buttons...');

    const buttons = document.querySelectorAll('.favorite-btn');
    console.log(`Found ${buttons.length} favorite buttons`);

    buttons.forEach((button, index) => {
        const productId = button.getAttribute('data-product');
        console.log(`Button ${index + 1}: ${productId}`, {
            element: button,
            isFavorited: button.classList.contains('favorited'),
            productId: productId
        });
    });
};

// Test favorites modal with enhanced features
window.testFavoritesModal = function() {
    console.log('ðŸ§ª Testing enhanced favorites modal...');

    // First add some test favorites
    if (window.favoritesManager) {
        console.log('ðŸ“ Adding test favorites...');
        window.favoritesManager.addToFavoritesLocal('layton');
        window.favoritesManager.addToFavoritesLocal('haltane');
        window.favoritesManager.addToFavoritesLocal('pegasus');

        // Wait a moment for the UI to update
        setTimeout(() => {
            console.log('ðŸŽ¯ Current favorites:', window.favoritesManager.favorites);
            console.log('ðŸ“Š Favorites count:', window.favoritesManager.favorites.length);
        }, 100);
    }

    // Then open the modal
    if (typeof openFavoritesModal === 'function') {
        setTimeout(() => {
            openFavoritesModal();
            console.log('âœ… Enhanced favorites modal opened with product cards!');
            console.log('ðŸŽ¨ Should now show beautiful fragrance preview cards');
        }, 600);
    } else {
        console.error('âŒ openFavoritesModal function not found');
    }
};

window.clearTestFavorites = function() {
    console.log('ðŸ§¹ Clearing all test favorites...');
    if (window.favoritesManager) {
        window.favoritesManager.clearAllFavorites();
        console.log('âœ… All favorites cleared!');
    } else {
        console.error('âŒ Favorites manager not found');
    }
};

// Test the "Go to Section" functionality
window.testGoToSection = function(productId = 'layton') {
    console.log(`ðŸŽ¯ Testing "Go to Section" for ${productId}...`);

    if (window.favoritesManager) {
        // Add the product to favorites first
        window.favoritesManager.addToFavoritesLocal(productId);

        // Test the scroll function directly
        setTimeout(() => {
            console.log(`ðŸ“ Attempting to scroll to ${productId} section...`);
            window.favoritesManager.scrollToProductSection(productId);
        }, 500);
    } else {
        console.error('âŒ favoritesManager not found');
    }
};

// Test all products
window.testAllGoToSections = function() {
    console.log('ðŸŽ¯ Testing "Go to Section" for all products...');

    const products = ['layton', 'haltane', 'pegasus'];
    let index = 0;

    function testNext() {
        if (index < products.length) {
            const productId = products[index];
            console.log(`ðŸ“ Testing ${productId}...`);
            testGoToSection(productId);
            index++;
            setTimeout(testNext, 3000); // Wait 3 seconds between tests
        } else {
            console.log('âœ… All "Go to Section" tests completed!');
        }
    }

    testNext();
};

// Test user-specific favorites
window.testUserSpecificFavorites = function() {
    console.log('ðŸ‘¥ Testing user-specific favorites...');

    if (!window.favoritesManager) {
        console.error('âŒ favoritesManager not found');
        return;
    }

    const fm = window.favoritesManager;

    console.log('ðŸ“Š Current state:');
    console.log('   â€¢ Current user key:', fm.getUserFavoritesKey());
    console.log('   â€¢ Current user email:', fm.getCurrentUserEmail());
    console.log('   â€¢ Current favorites:', fm.getFavorites());

    // Add some test favorites
    console.log('ðŸ“ Adding test favorites...');
    fm.addToFavoritesLocal('layton');
    fm.addToFavoritesLocal('haltane');

    console.log('âœ… Test completed! Check localStorage to see user-specific keys.');
    console.log('ðŸ’¡ Try logging in/out to see favorites switch between users.');
};

// Show all favorites storage keys
window.showFavoritesStorage = function() {
    console.log('ðŸ—„ï¸ All favorites storage keys:');

    const keys = Object.keys(localStorage).filter(key => key.startsWith('perfumeFavorites'));

    if (keys.length === 0) {
        console.log('   No favorites found in storage');
        return;
    }

    keys.forEach(key => {
        const favorites = JSON.parse(localStorage.getItem(key) || '[]');
        console.log(`   â€¢ ${key}: [${favorites.join(', ')}] (${favorites.length} items)`);
    });
};

// Test the login prompt functionality
window.testLoginPrompt = function() {
    console.log('ðŸ”‘ Testing login prompt...');

    if (window.favoritesManager) {
        window.favoritesManager.showLoginPrompt();
        console.log('âœ… Login prompt should now be visible');
    } else {
        console.error('âŒ favoritesManager not found');
    }
};

// Test locked favorites functionality
window.testLockedFavorites = function() {
    console.log('ðŸ”’ Testing locked favorites functionality...');

    if (!window.favoritesManager) {
        console.error('âŒ favoritesManager not found');
        return;
    }

    const fm = window.favoritesManager;

    console.log('ðŸ“Š Current state:');
    console.log('   â€¢ User logged in:', fm.isUserLoggedIn());
    console.log('   â€¢ Current favorites:', fm.getFavorites());

    // Update button states
    fm.updateFavoriteButtonsLoginState();

    console.log('âœ… Button states updated based on login status');
    console.log('ðŸ’¡ Try clicking a favorite button to see the login prompt!');
};

// Emergency function to fix stuck login prompts
window.fixStuckLoginPrompt = function() {
    console.log('ðŸš¨ Emergency: Fixing stuck login prompt...');

    // Remove all login prompts
    const prompts = document.querySelectorAll('.login-prompt-overlay');
    prompts.forEach(prompt => {
        console.log('   â€¢ Removing stuck prompt:', prompt);
        prompt.remove();
    });

    // Restore body scrolling
    document.body.style.overflow = 'auto';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';

    // Remove any modal backdrop classes
    document.body.classList.remove('modal-open');

    console.log('âœ… Page scrolling restored');
    console.log('âœ… All stuck prompts removed');

    return prompts.length;
};

// Theme system test functions
window.testThemes = function() {
    console.log('ðŸŽ¨ Testing theme system...');

    const themes = ['dark', 'cream', 'light'];
    let currentIndex = 0;

    function cycleTheme() {
        const theme = themes[currentIndex];
        themeManager.forceTheme(theme);
        console.log(`ðŸŽ¯ Applied ${theme} theme`);

        currentIndex = (currentIndex + 1) % themes.length;

        if (currentIndex === 0) {
            console.log('âœ… Theme cycling complete!');
            console.log('ðŸ”„ Returning to scroll-based theme detection...');
            themeManager.updateTheme();
        } else {
            setTimeout(cycleTheme, 2000);
        }
    }

    cycleTheme();
};

window.showCurrentTheme = function() {
    const theme = themeManager.getTheme();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    console.log('ðŸŽ¨ Current Theme Status:');
    console.log(`   ðŸŽ¯ Active theme: ${theme}`);
    console.log(`   ðŸ“ Scroll position: ${scrollTop}px`);
    console.log(`   ðŸ“± Window height: ${window.innerHeight}px`);

    // Show theme sections
    const windowHeight = window.innerHeight;
    const haltaneSection = document.querySelector('.haltane-section-container');
    const creamTransitionStart = haltaneSection ? haltaneSection.offsetTop + 500 : windowHeight * 2;
    const pegasusSection = document.querySelector('.pegasus-image');
    const greyTransitionStart = pegasusSection ? pegasusSection.closest('.content').offsetTop - 200 : creamTransitionStart + windowHeight;

    console.log('');
    console.log('ðŸ“ Theme Transition Points:');
    console.log(`   ðŸ–¤ Dark theme: 0px - ${creamTransitionStart}px`);
    console.log(`   ðŸ¤Ž Cream theme: ${creamTransitionStart}px - ${greyTransitionStart}px`);
    console.log(`   ðŸ©¶ Light theme: ${greyTransitionStart}px+`);

    console.log('');
    console.log('ðŸ§ª Test commands available:');
    console.log('   â€¢ testThemes() - Cycle through all themes');
    console.log('   â€¢ themeManager.forceTheme("dark") - Force dark theme');
    console.log('   â€¢ themeManager.forceTheme("cream") - Force cream theme');
    console.log('   â€¢ themeManager.forceTheme("light") - Force light theme');
    console.log('   â€¢ showCurrentTheme() - Show this status');
};

window.enableThemeDebug = function() {
    document.body.classList.add('debug-theme');
    console.log('ðŸ› Theme debug mode enabled - theme indicator visible in top-left corner');
};

window.disableThemeDebug = function() {
    document.body.classList.remove('debug-theme');
    console.log('ðŸ› Theme debug mode disabled');
};

// Test smaller favorites button
window.testSmallerFavorites = function() {
    console.log('ðŸ“ Testing repositioned favorites buttons...');

    const favoriteButtons = document.querySelectorAll('.favorite-btn');
    console.log(`Found ${favoriteButtons.length} favorite buttons`);

    favoriteButtons.forEach((button, index) => {
        const productId = button.getAttribute('data-product');
        console.log(`   ${index + 1}. ${productId} button - repositioned between price and quality selector`);

        // Add a temporary highlight to show the button
        button.style.boxShadow = '0 0 15px rgba(212, 175, 55, 0.8)';
        setTimeout(() => {
            button.style.boxShadow = '';
        }, 3000);
    });

    console.log('âœ… All favorites buttons repositioned successfully!');
    console.log('ðŸ“Š New positioning:');
    console.log('   â€¢ Location: Between price badge and quality selector');
    console.log('   â€¢ Alignment: Centered horizontally');
    console.log('   â€¢ Spacing: 25px margin top/bottom');
    console.log('   â€¢ Size: Compact 36px height');
    console.log('   â€¢ Mobile: Responsive with 15px margins');
};

// Debug theme stability
window.debugThemeStability = function() {
    console.log('ðŸ”§ Theme Stability Debug Report:');
    console.log('================================');

    if (window.themeManager) {
        const currentTheme = themeManager.getTheme();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        console.log(`ðŸ“ Current scroll position: ${scrollTop}px`);
        console.log(`ðŸŽ¨ Current theme: ${currentTheme}`);
        console.log(`ðŸ”§ Theme manager initialized: ${themeManager.isInitialized}`);

        if (themeManager.transitionPoints) {
            console.log('ðŸ“Š Cached transition points:');
            console.log(`   â€¢ Cream starts at: ${themeManager.transitionPoints.creamStart}px`);
            console.log(`   â€¢ Grey starts at: ${themeManager.transitionPoints.greyStart}px`);
        } else {
            console.log('âš ï¸ No cached transition points found');
        }

        // Check body theme class
        const bodyClasses = document.body.className;
        console.log(`ðŸ·ï¸ Body classes: ${bodyClasses}`);

        // Check favorite button themes
        const favoriteButtons = document.querySelectorAll('.favorite-btn');
        console.log(`ðŸ”˜ Found ${favoriteButtons.length} favorite buttons`);
        favoriteButtons.forEach((btn, index) => {
            const productId = btn.getAttribute('data-product');
            const themeClasses = Array.from(btn.classList).filter(c => c.startsWith('theme-'));
            console.log(`   ${index + 1}. ${productId}: ${themeClasses.join(', ') || 'no theme classes'}`);
        });

    } else {
        console.log('âŒ Theme manager not found');
    }

    console.log('');
    console.log('ðŸ› ï¸ Fixes available:');
    console.log('   â€¢ themeManager.calculateTransitionPoints() - Recalculate points');
    console.log('   â€¢ themeManager.forceTheme("dark") - Force specific theme');
    console.log('   â€¢ showCurrentTheme() - Show detailed theme status');
};

// Initialize theme system on page load
document.addEventListener('DOMContentLoaded', function() {
    // Show initial theme status
    setTimeout(() => {
        console.log('ðŸŽ¨ Theme System Initialized!');
        console.log('ðŸ“‹ Available commands:');
        console.log('   â€¢ showCurrentTheme() - Show current theme status');
        console.log('   â€¢ testThemes() - Test all themes');
        console.log('   â€¢ enableThemeDebug() - Show theme indicator');
        console.log('   â€¢ testFavorites() - Test favorites system');
        console.log('   â€¢ testFavoritesModal() - Test favorites modal');
        console.log('');
        console.log('â¤ï¸ Favorites added to all perfume sections with adaptive themes!');
    }, 1000);
});

// Show current favorites status
window.showFavoritesStatus = function() {
    const favorites = favoritesManager.getFavorites();
    console.log('â¤ï¸ Current Favorites Status:');
    console.log(`   ðŸ“Š Total favorites: ${favorites.length}`);

    if (favorites.length > 0) {
        console.log('   ðŸ“ Favorited perfumes:');
        favorites.forEach(productId => {
            const product = favoritesManager.getProductDetails(productId);
            console.log(`      â€¢ ${product.name} (${product.brand}) - ${product.price}`);
        });
    } else {
        console.log('   ðŸ’” No favorites yet - start adding some!');
    }

    console.log('');
    console.log('ðŸ§ª Test commands available:');
    console.log('   â€¢ testFavorites() - Test adding/removing favorites');
    console.log('   â€¢ testFavoritesModal() - Open favorites modal with test data');
    console.log('   â€¢ clearTestFavorites() - Clear all favorites');
    console.log('   â€¢ showFavoritesStatus() - Show this status');
};

// Debug function to check current profile state
window.debugProfileState = function() {
    console.log('ðŸ” Debugging current profile state...');

    const userProfile = document.getElementById('userProfile');
    const userAvatar = document.getElementById('userAvatar');
    const userName = document.getElementById('userName');

    if (userProfile && userAvatar && userName) {
        console.log('ðŸ“Š Profile Element Info:');
        console.log('   â€¢ Profile classes:', userProfile.className);
        console.log('   â€¢ Has admin-user class:', userProfile.classList.contains('admin-user'));
        console.log('   â€¢ Avatar src:', userAvatar.src);
        console.log('   â€¢ User name:', userName.textContent);
        console.log('   â€¢ Profile element:', userProfile);

        // Check computed styles
        const avatarStyles = window.getComputedStyle(userAvatar, '::after');
        console.log('   â€¢ Avatar ::after content:', avatarStyles.content);
        console.log('   â€¢ Avatar ::after display:', avatarStyles.display);

        // Force apply admin styling for testing
        console.log('ðŸ§ª Force applying admin styling...');
        userProfile.classList.add('admin-user');
        console.log('   â€¢ Admin class added, check if VIP badge appears now');
    } else {
        console.error('âŒ Could not find profile elements');
    }
};

// Test improved theme visibility for favorites buttons
window.testImprovedThemeVisibility = function() {
    console.log('ðŸŽ¨ Testing improved theme visibility for favorites buttons...');

    const favoriteButtons = document.querySelectorAll('.favorite-btn');
    console.log(`Found ${favoriteButtons.length} favorite buttons`);

    // Get current theme
    const currentTheme = document.body.classList.contains('theme-dark') ? 'dark' :
                        document.body.classList.contains('theme-cream') ? 'cream' :
                        document.body.classList.contains('theme-light') ? 'light' : 'default';

    console.log(`ðŸŽ¯ Current theme: ${currentTheme}`);

    favoriteButtons.forEach((button, index) => {
        const productId = button.getAttribute('data-product');

        // Add temporary highlight to show improved visibility
        button.style.outline = '3px solid rgba(255, 0, 0, 0.8)';
        button.style.outlineOffset = '3px';

        setTimeout(() => {
            button.style.outline = '';
            button.style.outlineOffset = '';
        }, 4000);

        console.log(`   ${index + 1}. ${productId} - Theme: ${currentTheme} (Enhanced visibility)`);
    });

    console.log('âœ¨ Enhanced Theme Visibility:');
    console.log('ðŸŒ‘ Dark Theme (Layton):');
    console.log('   â€¢ Background: Black gradient with gold accents');
    console.log('   â€¢ Text: White with shadow for contrast');
    console.log('   â€¢ Border: Gold with enhanced glow');

    console.log('ðŸ¥› Cream Theme (Haltane):');
    console.log('   â€¢ Background: White with subtle transparency');
    console.log('   â€¢ Text: BLACK for maximum visibility âœ…');
    console.log('   â€¢ Border: Dark brown for definition');
    console.log('   â€¢ Shadow: Subtle brown shadow for depth');

    console.log('ðŸŒ«ï¸ Light Theme (Pegasus):');
    console.log('   â€¢ Background: Pure white with high opacity');
    console.log('   â€¢ Text: BLACK for maximum visibility âœ…');
    console.log('   â€¢ Border: Dark grey for clear definition');
    console.log('   â€¢ Shadow: Light grey shadow for depth');

    console.log('ðŸ”§ Improvements Made:');
    console.log('   â€¢ Cream & Light themes now use BLACK text');
    console.log('   â€¢ White/light backgrounds for better contrast');
    console.log('   â€¢ Enhanced shadows and borders');
    console.log('   â€¢ Smooth hover transitions maintained');
};

// Force fix favorites button visibility immediately
window.forceFixFavoritesVisibility = function() {
    console.log('ðŸ”§ Force fixing favorites button visibility...');

    const favoriteButtons = document.querySelectorAll('.favorite-btn');
    console.log(`Found ${favoriteButtons.length} favorite buttons to fix`);

    favoriteButtons.forEach((button, index) => {
        const productId = button.getAttribute('data-product');

        // Determine theme based on scroll position or force cream/light themes
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        let theme = 'dark';

        // Simple theme detection based on scroll
        if (scrollTop > 2000 && scrollTop < 4000) {
            theme = 'cream'; // Haltane section
        } else if (scrollTop > 4000) {
            theme = 'light'; // Pegasus section
        }

        // Force apply styles based on product or theme
        if (productId === 'haltane' || theme === 'cream') {
            button.style.setProperty('background', 'rgba(255, 255, 255, 0.95)', 'important');
            button.style.setProperty('color', 'rgba(0, 0, 0, 0.95)', 'important');
            button.style.setProperty('border', '1.5px solid rgba(93, 64, 55, 0.8)', 'important');
            button.style.setProperty('text-shadow', 'none', 'important');
            button.classList.add('theme-cream');
            console.log(`   ${index + 1}. ${productId} - CREAM theme applied (BLACK text)`);
        } else if (productId === 'pegasus' || theme === 'light') {
            button.style.setProperty('background', 'rgba(255, 255, 255, 0.95)', 'important');
            button.style.setProperty('color', 'rgba(0, 0, 0, 0.95)', 'important');
            button.style.setProperty('border', '1.5px solid rgba(73, 80, 87, 0.8)', 'important');
            button.style.setProperty('text-shadow', 'none', 'important');
            button.classList.add('theme-light');
            console.log(`   ${index + 1}. ${productId} - LIGHT theme applied (BLACK text)`);
        } else {
            button.style.setProperty('background', 'linear-gradient(135deg, rgba(0, 0, 0, 0.4), rgba(20, 20, 20, 0.6))', 'important');
            button.style.setProperty('color', 'rgba(255, 255, 255, 0.9)', 'important');
            button.style.setProperty('border', '1.5px solid rgba(212, 175, 55, 0.5)', 'important');
            button.style.setProperty('text-shadow', '0 1px 2px rgba(0, 0, 0, 0.5)', 'important');
            button.classList.add('theme-dark');
            console.log(`   ${index + 1}. ${productId} - DARK theme applied (WHITE text)`);
        }
    });

    console.log('âœ… All favorites buttons have been force-fixed for visibility!');
    console.log('ðŸŽ¯ Haltane and Pegasus buttons now have BLACK text on WHITE backgrounds');
};

// Reviews Management System
class ReviewsManager {
    constructor() {
        this.reviews = {
            layton: [],
            haltane: [],
            pegasus: []
        };
        this.currentUser = null;
        this.init();
    }

    async init() {
        console.log('ðŸ’¬ Initializing Reviews Manager...');

        // Load existing reviews from database (fallback to localStorage)
        await this.loadAllReviews();

        // Set up event listeners for all fragrance sections
        this.setupEventListeners();

        // Update UI based on login status
        this.updateUIForLoginStatus();

        console.log('ðŸ’¬ Reviews Manager initialized successfully');
    }

    setupEventListeners() {
        const fragrances = ['layton', 'haltane', 'pegasus'];

        fragrances.forEach(fragrance => {
            // Star rating interactions
            this.setupStarRating(fragrance);

            // Character count for textarea
            this.setupCharacterCount(fragrance);

            // Submit review button
            const submitBtn = document.getElementById(`${fragrance}-submit-review`);
            if (submitBtn) {
                submitBtn.addEventListener('click', () => this.submitReview(fragrance));
            }

            // Cancel review button
            const cancelBtn = document.getElementById(`${fragrance}-cancel-review`);
            if (cancelBtn) {
                cancelBtn.addEventListener('click', () => this.cancelReview(fragrance));
            }

            // Load more reviews button
            const loadMoreBtn = document.getElementById(`${fragrance}-load-more-btn`);
            if (loadMoreBtn) {
                loadMoreBtn.addEventListener('click', () => this.loadMoreReviews(fragrance));
            }
        });
    }

    setupStarRating(fragrance) {
        const starRating = document.getElementById(`${fragrance}-star-rating`);
        if (!starRating) return;

        const stars = starRating.querySelectorAll('.star');
        let selectedRating = 0;

        stars.forEach((star, index) => {
            star.addEventListener('mouseenter', () => {
                this.highlightStars(stars, index + 1);
            });

            star.addEventListener('mouseleave', () => {
                this.highlightStars(stars, selectedRating);
            });

            star.addEventListener('click', () => {
                selectedRating = index + 1;
                this.highlightStars(stars, selectedRating);
                starRating.dataset.rating = selectedRating;
            });
        });
    }

    highlightStars(stars, rating) {
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    }

    setupCharacterCount(fragrance) {
        const textarea = document.getElementById(`${fragrance}-review-text`);
        const charCount = document.getElementById(`${fragrance}-char-count`);

        if (textarea && charCount) {
            // ðŸ”§ FIX: Remove existing event listener to prevent memory leaks
            const existingHandler = textarea._charCountHandler;
            if (existingHandler) {
                textarea.removeEventListener('input', existingHandler);
            }

            // Create new handler and store reference for cleanup
            const charCountHandler = () => {
                const count = textarea.value.length;
                charCount.textContent = count;

                // Change color when approaching limit
                if (count > 450) {
                    charCount.style.color = '#ff6b6b';
                } else if (count > 400) {
                    charCount.style.color = '#ffa726';
                } else {
                    charCount.style.color = 'rgba(255, 255, 255, 0.6)';
                }
            };

            textarea._charCountHandler = charCountHandler;
            textarea.addEventListener('input', charCountHandler);
        }
    }

    updateUIForLoginStatus() {
        const user = this.getCurrentUser();
        const fragrances = ['layton', 'haltane', 'pegasus'];

        fragrances.forEach(fragrance => {
            const addReviewContainer = document.getElementById(`${fragrance}-add-review`);
            const signinPrompt = document.getElementById(`${fragrance}-signin-prompt`);

            if (user) {
                // User is logged in - show review form
                if (addReviewContainer) addReviewContainer.style.display = 'block';
                if (signinPrompt) signinPrompt.style.display = 'none';

                // Update user info in form
                this.updateReviewFormUserInfo(fragrance, user);
            } else {
                // User not logged in - show signin prompt
                if (addReviewContainer) addReviewContainer.style.display = 'none';
                if (signinPrompt) signinPrompt.style.display = 'block';
            }

            // Load and display reviews
            this.displayReviews(fragrance);
        });
    }

    updateReviewFormUserInfo(fragrance, user) {
        const avatar = document.getElementById(`${fragrance}-review-avatar`);
        const username = document.getElementById(`${fragrance}-review-username`);

        if (avatar) {
            const img = avatar.querySelector('img');
            if (img) {
                // Get the current avatar from the navigation bar (most up-to-date)
                const userAvatar = document.getElementById('userAvatar');
                let avatarSrc = user.avatar || this.generateDefaultAvatar(user.name);

                // ðŸ”§ FIX: Handle avatar placeholder to prevent 404 errors
                if (user.avatar === 'custom_uploaded' || user.avatar === 'custom_avatar_uploaded') {
                    avatarSrc = 'default.jpg'; // Use default for placeholders
                    console.log(`ðŸ–¼ï¸ Review form for ${fragrance} using default.jpg (placeholder detected)`);
                } else if (userAvatar && userAvatar.src &&
                    !userAvatar.src.includes('default.jpg') &&
                    !userAvatar.src.includes('ui-avatars.com') &&
                    !userAvatar.src.includes('custom_avatar_uploaded')) {
                    avatarSrc = userAvatar.src;
                    console.log(`ðŸ–¼ï¸ Using current navigation avatar for ${fragrance} review form`);
                } else if (user.avatar && user.avatar.startsWith('data:image/')) {
                    // Use the base64 image directly if available
                    avatarSrc = user.avatar;
                    console.log(`ðŸ–¼ï¸ Using base64 avatar for ${fragrance} review form`);
                } else {
                    avatarSrc = 'default.jpg';
                    console.log(`ðŸ–¼ï¸ Using default avatar for ${fragrance} review form`);
                }

                img.src = avatarSrc;
                img.alt = `${user.name}'s Avatar`;

                // Add error handling
                img.onerror = () => {
                    console.error(`âŒ Review form avatar failed to load for ${fragrance}`);
                    img.src = 'default.jpg'; // Always fallback to default.jpg
                    console.log(`ðŸ”„ Review form for ${fragrance} falling back to default.jpg`);
                };
            }
        }

        if (username) {
            username.textContent = user.name || 'Anonymous User';
        }
    }

    getCurrentUser() {
        // Check if user is logged in
        const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
        if (userData) {
            try {
                return JSON.parse(userData);
            } catch (e) {
                console.error('Error parsing user data:', e);
            }
        }
        return null;
    }

    generateDefaultAvatar(name) {
        // Generate a simple SVG avatar based on user's name
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
        const colorIndex = (name || '').length % colors.length;
        const color = colors[colorIndex];
        const initial = (name || 'U').charAt(0).toUpperCase();

        return `data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='20' fill='${encodeURIComponent(color)}'/%3E%3Ctext x='20' y='26' font-family='Arial' font-size='16' font-weight='bold' text-anchor='middle' fill='white'%3E${initial}%3C/text%3E%3C/svg%3E`;
    }

    async submitReview(fragrance) {
        const user = this.getCurrentUser();
        if (!user) {
            alert('Please sign in to submit a review.');
            return;
        }

        const starRating = document.getElementById(`${fragrance}-star-rating`);
        const textarea = document.getElementById(`${fragrance}-review-text`);
        const submitBtn = document.getElementById(`${fragrance}-submit-review`);

        const rating = parseInt(starRating?.dataset.rating || '0');
        const text = textarea?.value.trim();

        // Validation
        if (rating === 0) {
            alert('Please select a rating.');
            return;
        }

        if (!text || text.length < 10) {
            alert('Please write at least 10 characters in your review.');
            return;
        }

        // Disable submit button
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Posting...';
        }

        try {
            // Save to database via API
            const success = await this.saveReviewToServer(fragrance, rating, text);

            if (success) {
                // Reset form
                this.resetReviewForm(fragrance);

                // Refresh display from database
                await this.loadReviewsFromServer(fragrance);

                // Show success message
                this.showNotification('Review posted successfully!', 'success');
            } else {
                throw new Error('Failed to save review to server');
            }

        } catch (error) {
            console.error('Error submitting review:', error);
            this.showNotification('Failed to post review. Please try again.', 'error');
        } finally {
            // Re-enable submit button
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Post Review';
            }
        }
    }

    async saveReviewToServer(fragrance, rating, reviewText) {
        try {
            const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
            if (!token) {
                console.error('âŒ No authentication token found');
                return false;
            }

            const response = await fetch('/api/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    fragrance: fragrance,
                    rating: rating,
                    review_text: reviewText
                })
            });

            if (response.ok) {
                const data = await response.json();
                console.log('âœ… Review saved to database:', data);

                // ðŸ”¥ Real-time level update if XP was awarded
                if (data.xp && data.xp.levelData) {
                    LevelEvents.emit({ level: data.xp.levelData.level, levelData: data.xp.levelData });
                    if (data.xp.leveledUp) {
                        window.showLevelUpNotification(data.xp.oldLevel, data.xp.newLevel);
                    }
                }

                return true;
            } else {
                const errorData = await response.json();
                console.error('âŒ Failed to save review to database:', errorData);
                return false;
            }
        } catch (error) {
            console.error('âŒ Error saving review to database:', error);
            return false;
        }
    }

    async loadReviewsFromServer(fragrance) {
        try {
            const response = await fetch(`/api/reviews/${fragrance}`);

            if (response.ok) {
                const data = await response.json();
                console.log(`âœ… Loaded ${data.reviews.length} reviews for ${fragrance} from database`);

                // Convert database format to frontend format
                this.reviews[fragrance] = data.reviews.map(review => ({
                    id: review.id.toString(),
                    userId: review.user_id,
                    userName: review.user_name,
                    userAvatar: review.user_avatar || this.generateDefaultAvatar(review.user_name),
                    userEmail: review.user_email, // ðŸ‘‘ ADMIN FIX: Include user email
                    is_admin: review.is_admin,    // ðŸ‘‘ ADMIN FIX: Include admin status
                    rating: review.rating,
                    text: review.review_text,
                    date: review.created_at,
                    likes: review.likes || 0,
                    dislikes: review.dislikes || 0,
                    likedBy: [],
                    dislikedBy: []
                }));

                // Load user's like status for these reviews
                await this.loadUserLikeStatus(fragrance);

                // Display the reviews
                this.displayReviews(fragrance);

                return true;
            } else {
                console.error(`âŒ Failed to load reviews for ${fragrance}`);
                return false;
            }
        } catch (error) {
            console.error(`âŒ Error loading reviews for ${fragrance}:`, error);
            return false;
        }
    }

    async loadUserLikeStatus(fragrance) {
        try {
            const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
            if (!token) {
                console.log(`ðŸ‘¤ Not logged in, skipping like status for ${fragrance}`);
                return; // Not logged in
            }

            const response = await fetch(`/api/reviews/likes/${encodeURIComponent(fragrance)}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    // Initialize userLikes object if it doesn't exist
                    if (!this.userLikes) {
                        this.userLikes = {};
                    }

                    // Store like status for this fragrance
                    Object.assign(this.userLikes, data.likes);
                    console.log(`âœ… Loaded user like status for ${fragrance}:`, data.likes);
                } else {
                    console.error(`âŒ Error loading like status for ${fragrance}:`, data.error);
                }
            } else {
                console.error(`âŒ HTTP error loading like status for ${fragrance}:`, response.status);
            }
        } catch (error) {
            console.error(`âŒ Network error loading like status for ${fragrance}:`, error);
            // Initialize empty userLikes to prevent errors
            if (!this.userLikes) {
                this.userLikes = {};
            }
        }
    }

    async loadAllReviews() {
        console.log('ðŸ”„ Loading all reviews from database...');

        // Try to load reviews for each fragrance from database
        const fragrances = ['layton', 'haltane', 'pegasus'];
        let totalLoaded = 0;

        for (const fragrance of fragrances) {
            const success = await this.loadReviewsFromServer(fragrance);
            if (success) {
                totalLoaded += this.reviews[fragrance].length;
            } else {
                // Fallback to localStorage for this fragrance
                console.log(`âš ï¸ Falling back to localStorage for ${fragrance}`);
                if (!this.reviews[fragrance]) {
                    this.reviews[fragrance] = [];
                }
            }
        }

        // If no reviews loaded from database, try localStorage as complete fallback
        if (totalLoaded === 0) {
            console.log('âš ï¸ No reviews loaded from database, trying localStorage...');
            this.loadReviews(); // Original localStorage method
        }

        console.log(`âœ… Loaded ${totalLoaded} total reviews from database`);
    }

    resetReviewForm(fragrance) {
        const starRating = document.getElementById(`${fragrance}-star-rating`);
        const textarea = document.getElementById(`${fragrance}-review-text`);
        const charCount = document.getElementById(`${fragrance}-char-count`);

        // Reset star rating
        if (starRating) {
            const stars = starRating.querySelectorAll('.star');
            stars.forEach(star => star.classList.remove('active'));
            starRating.dataset.rating = '0';
        }

        // Reset textarea
        if (textarea) {
            textarea.value = '';
        }

        // Reset character count
        if (charCount) {
            charCount.textContent = '0';
            charCount.style.color = 'rgba(255, 255, 255, 0.6)';
        }
    }

    cancelReview(fragrance) {
        this.resetReviewForm(fragrance);
    }

    displayReviews(fragrance) {
        const reviewsList = document.getElementById(`${fragrance}-reviews-list`);
        const reviewsCount = document.getElementById(`${fragrance}-reviews-count`);

        if (!reviewsList) return;

        const reviews = this.reviews[fragrance] || [];

        // Update count
        if (reviewsCount) {
            const count = reviews.length;
            reviewsCount.textContent = count === 0 ? 'No reviews yet' :
                count === 1 ? '1 review' : `${count} reviews`;
        }

        // Clear existing reviews
        reviewsList.innerHTML = '';

        if (reviews.length === 0) {
            reviewsList.innerHTML = `
                <div class="reviews-empty">
                    <div class="reviews-empty-icon">ðŸ’­</div>
                    <h4>No reviews yet</h4>
                    <p>Be the first to share your experience with ${fragrance.charAt(0).toUpperCase() + fragrance.slice(1)}!</p>
                </div>
            `;
            return;
        }

        // Display reviews (show first 5)
        const reviewsToShow = reviews.slice(0, 5);
        reviewsToShow.forEach(review => {
            const reviewElement = this.createReviewElement(review, fragrance);
            reviewsList.appendChild(reviewElement);
        });

        // Show/hide load more button
        const loadMoreContainer = document.getElementById(`${fragrance}-load-more`);
        if (loadMoreContainer) {
            loadMoreContainer.style.display = reviews.length > 5 ? 'block' : 'none';
        }
    }

    createReviewElement(review, fragrance) {
        const reviewDiv = document.createElement('div');
        reviewDiv.className = 'review-item';
        reviewDiv.dataset.reviewId = review.id;

        const formatDate = (dateString) => {
            const date = new Date(dateString);
            const now = new Date();
            const diffTime = Math.abs(now - date);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) return 'Yesterday';
            if (diffDays < 7) return `${diffDays} days ago`;
            if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
            return date.toLocaleDateString();
        };

        const generateStars = (rating) => {
            let starsHtml = '';
            for (let i = 1; i <= 5; i++) {
                starsHtml += `<span class="review-star ${i <= rating ? '' : 'empty'}">â˜…</span>`;
            }
            return starsHtml;
        };

        // ðŸ‘‘ ADMIN ENHANCEMENT: Check if this review is from an admin user
        const isAdminReview = this.isAdminUser(review.userEmail || review.userName, review);

        // Debug logging for admin detection (enhanced)
        console.log('ðŸ” Review debug for:', review.userName || review.user_name, {
            userName: review.userName,
            user_name: review.user_name,
            userEmail: review.userEmail,
            user_email: review.user_email,
            is_admin: review.is_admin,
            isAdminReview: isAdminReview,
            reviewId: review.id,
            fragrance: review.fragrance
        });

        const adminBadgeHtml = isAdminReview ? `
            <div class="review-admin-badge">
                <svg class="review-admin-icon" viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                    <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM12 7C13.1 7 14 7.9 14 9S13.1 11 12 11 10 10.1 10 9 10.9 7 12 7ZM18 15C18 16.1 17.1 17 16 17H8C6.9 17 6 16.1 6 15V14C6 12.9 6.9 12 8 12H16C17.1 12 18 12.9 18 14V15Z"/>
                </svg>
                <span class="review-admin-text">Admin</span>
            </div>
        ` : '';

        // ðŸ”§ FIX: Handle avatar placeholder to prevent 404 errors
        let avatarSrc = review.userAvatar;
        if (avatarSrc === 'custom_uploaded' || avatarSrc === 'custom_avatar_uploaded') {
            avatarSrc = 'default.jpg'; // Use default for placeholders
        }

        // ðŸ†• Level System: Create review with level-enabled avatar
        const reviewHeader = document.createElement('div');
        reviewHeader.className = 'review-header';

        const reviewUserInfo = document.createElement('div');
        reviewUserInfo.className = 'review-user-info';

        // Create avatar with level system
        const userLevel = review.level || 1;
        const userLevelProgress = review.levelProgress || 0;
        const avatarContainer = createReviewAvatarWithLevel(avatarSrc, userLevel, userLevelProgress);

        // Add admin styling if needed
        if (isAdminReview) {
            avatarContainer.classList.add('admin-review-avatar');
            // Add crown to admin avatars
            const crown = document.createElement('div');
            crown.className = 'review-avatar-crown';
            crown.textContent = 'ðŸ‘‘';
            avatarContainer.appendChild(crown);
        }

        const reviewUserDetails = document.createElement('div');
        reviewUserDetails.className = 'review-user-details';
        reviewUserDetails.innerHTML = `
            <div class="review-username-container">
                <div class="review-username ${isAdminReview ? 'admin-username' : ''}">${review.userName}</div>
                ${adminBadgeHtml}
            </div>
            <div class="review-date">${formatDate(review.date)}</div>
        `;

        reviewUserInfo.appendChild(avatarContainer);
        reviewUserInfo.appendChild(reviewUserDetails);
        reviewHeader.appendChild(reviewUserInfo);

        // Add rating display
        const reviewRatingDisplay = document.createElement('div');
        reviewRatingDisplay.className = 'review-rating-display';
        reviewRatingDisplay.innerHTML = `
            <div class="review-stars">
                ${generateStars(review.rating)}
            </div>
            <div class="review-rating-number">${review.rating}/5</div>
        `;

        reviewHeader.appendChild(reviewRatingDisplay);
        reviewDiv.appendChild(reviewHeader);

        // Add the rest of the review content
        reviewDiv.innerHTML += `
            <div class="review-content">
                <p class="review-text">${review.text}</p>
            </div>
            <div class="review-actions">
                <button class="review-action-btn like-btn ${this.userLikes && this.userLikes[review.id] === 'like' ? 'liked' : ''}"
                        onclick="window.reviewsManager.toggleLike('${fragrance}', '${review.id}')">
                    <span class="review-action-icon">ðŸ‘</span>
                    <span class="review-action-count">${review.likes || 0}</span>
                </button>
                <button class="review-action-btn dislike-btn ${this.userLikes && this.userLikes[review.id] === 'dislike' ? 'disliked' : ''}"
                        onclick="window.reviewsManager.toggleDislike('${fragrance}', '${review.id}')">
                    <span class="review-action-icon">ðŸ‘Ž</span>
                    <span class="review-action-count">${review.dislikes || 0}</span>
                </button>
                <button class="review-action-btn reply-btn"
                        onclick="window.reviewsManager.toggleReplyForm('${fragrance}', '${review.id}')">
                    <span class="review-action-icon">ðŸ’¬</span>
                    <span class="review-action-text">Reply</span>
                </button>
                ${this.canUserEditReview(review) ? `
                    <button class="review-action-btn edit-btn"
                            onclick="window.reviewsManager.editReview('${fragrance}', '${review.id}')">
                        <span class="review-action-icon">âœï¸</span>
                        <span class="review-action-text">Edit</span>
                    </button>
                    <button class="review-action-btn delete-btn"
                            onclick="window.reviewsManager.deleteReview('${fragrance}', '${review.id}')">
                        <span class="review-action-icon">ðŸ—‘ï¸</span>
                        <span class="review-action-text">Delete</span>
                    </button>
                ` : ''}
            </div>

            <!-- ðŸš€ ENHANCED: Reply Form -->
            <div class="reply-form-container" id="reply-form-${review.id}" style="display: none;">
                <div class="reply-form">
                    <div class="reply-form-header">
                        <div class="reply-avatar">
                            <img src="" alt="Your Avatar" id="reply-avatar-${review.id}">
                        </div>
                        <div class="reply-form-info">
                            <span class="reply-form-username" id="reply-username-${review.id}">Your Name</span>
                            <span class="reply-form-subtitle">Reply to ${review.userName}</span>
                        </div>
                    </div>
                    <textarea
                        class="reply-textarea"
                        id="reply-text-${review.id}"
                        placeholder="Write your reply..."
                        maxlength="1000"
                        rows="3"
                    ></textarea>
                    <div class="reply-form-actions">
                        <div class="reply-char-count">
                            <span id="reply-char-count-${review.id}">0</span>/1000
                        </div>
                        <div class="reply-buttons">
                            <button class="reply-cancel-btn" onclick="window.reviewsManager.toggleReplyForm('${fragrance}', '${review.id}')">
                                Cancel
                            </button>
                            <button class="reply-submit-btn" onclick="window.reviewsManager.submitReply('${fragrance}', '${review.id}')">
                                <span class="reply-submit-icon">ðŸ’¬</span>
                                Reply
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ðŸš€ ENHANCED: Replies Container -->
            <div class="replies-container" id="replies-${review.id}">
                <div class="replies-loading" id="replies-loading-${review.id}" style="display: none;">
                    <div class="loading-spinner"></div>
                    <span>Loading replies...</span>
                </div>
                <div class="replies-list" id="replies-list-${review.id}"></div>
            </div>
        `;

        // Load replies for this review
        setTimeout(() => this.loadReplies(review.id), 100);

        return reviewDiv;
    }

    // Check if current user can edit/delete this review
    canUserEditReview(review) {
        const currentUser = this.getCurrentUser();
        if (!currentUser) return false;

        // User can edit their own reviews or admin can edit any review
        // Use userId for comparison (more reliable than email)
        const reviewUserId = review.userId || review.user_id;
        const currentUserId = currentUser.id;

        console.log(`ðŸ”’ Permission check: Review user ${reviewUserId} vs Current user ${currentUserId}, Admin: ${currentUser.isAdmin}`);

        return reviewUserId === currentUserId || currentUser.isAdmin;
    }

    // Edit review functionality
    async editReview(fragrance, reviewId) {
        console.log(`âœï¸ Editing review ${reviewId} for ${fragrance}`);

        const reviews = this.reviews[fragrance] || [];
        const review = reviews.find(r => r.id === reviewId);

        if (!review) {
            this.showNotification('Review not found', 'error');
            return;
        }

        if (!this.canUserEditReview(review)) {
            this.showNotification('You can only edit your own reviews', 'error');
            return;
        }

        // Create edit modal
        const editModal = document.createElement('div');
        editModal.className = 'review-edit-modal';
        editModal.innerHTML = `
            <div class="review-edit-content">
                <div class="review-edit-header">
                    <h3>Edit Review</h3>
                    <button class="review-edit-close" onclick="this.closest('.review-edit-modal').remove()">Ã—</button>
                </div>
                <div class="review-edit-body">
                    <div class="review-edit-rating">
                        <label>Rating:</label>
                        <div class="review-edit-stars">
                            ${[1,2,3,4,5].map(i => `
                                <span class="review-edit-star ${i <= review.rating ? 'active' : ''}"
                                      data-rating="${i}" onclick="window.reviewsManager.setEditRating(${i})">â˜…</span>
                            `).join('')}
                        </div>
                    </div>
                    <div class="review-edit-text">
                        <label>Review:</label>
                        <textarea id="editReviewText" rows="4" maxlength="500">${review.text}</textarea>
                        <div class="review-edit-counter">
                            <span id="editCharCount">${review.text.length}</span>/500
                        </div>
                    </div>
                </div>
                <div class="review-edit-footer">
                    <button class="review-edit-cancel" onclick="this.closest('.review-edit-modal').remove()">Cancel</button>
                    <button class="review-edit-save" onclick="window.reviewsManager.saveEditedReview('${fragrance}', '${reviewId}')">Save Changes</button>
                </div>
            </div>
        `;

        document.body.appendChild(editModal);

        // Add character counter with proper cleanup
        const textArea = editModal.querySelector('#editReviewText');
        const charCount = editModal.querySelector('#editCharCount');

        // ðŸ”§ FIX: Remove existing event listener to prevent memory leaks
        const existingHandler = textArea._charCountHandler;
        if (existingHandler) {
            textArea.removeEventListener('input', existingHandler);
        }

        // Create new handler and store reference for cleanup
        const charCountHandler = () => {
            charCount.textContent = textArea.value.length;
        };

        textArea._charCountHandler = charCountHandler;
        textArea.addEventListener('input', charCountHandler);

        // Store current rating for editing
        this.editingRating = review.rating;
    }

    // Set rating during edit
    setEditRating(rating) {
        this.editingRating = rating;
        const stars = document.querySelectorAll('.review-edit-star');
        stars.forEach((star, index) => {
            star.classList.toggle('active', index < rating);
        });
    }

    // Save edited review
    async saveEditedReview(fragrance, reviewId) {
        const textArea = document.getElementById('editReviewText');
        const newText = textArea.value.trim();

        if (!newText) {
            this.showNotification('Review text cannot be empty', 'error');
            return;
        }

        if (!this.editingRating) {
            this.showNotification('Please select a rating', 'error');
            return;
        }

        try {
            const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
            const response = await fetch('/api/reviews/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    reviewId: reviewId,
                    fragrance: fragrance,
                    text: newText,
                    rating: this.editingRating
                })
            });

            if (response.ok) {
                this.showNotification('Review updated successfully', 'success');
                document.querySelector('.review-edit-modal').remove();
                await this.loadAllReviews(); // Refresh reviews
            } else {
                const errorData = await response.json();
                this.showNotification(errorData.error || 'Failed to update review', 'error');
            }
        } catch (error) {
            console.error('Error updating review:', error);
            this.showNotification('Failed to update review', 'error');
        }
    }

    // Delete review functionality
    async deleteReview(fragrance, reviewId) {
        const reviews = this.reviews[fragrance] || [];
        const review = reviews.find(r => r.id === reviewId);

        if (!review) {
            this.showNotification('Review not found', 'error');
            return;
        }

        if (!this.canUserEditReview(review)) {
            this.showNotification('You can only delete your own reviews', 'error');
            return;
        }

        // Confirm deletion
        if (!confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
            return;
        }

        try {
            const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
            const response = await fetch('/api/reviews/delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    reviewId: reviewId,
                    fragrance: fragrance
                })
            });

            if (response.ok) {
                this.showNotification('Review deleted successfully', 'success');
                await this.loadAllReviews(); // Refresh reviews
            } else {
                const errorData = await response.json();
                this.showNotification(errorData.error || 'Failed to delete review', 'error');
            }
        } catch (error) {
            console.error('Error deleting review:', error);
            this.showNotification('Failed to delete review', 'error');
        }
    }

    async toggleLike(fragrance, reviewId) {
        const user = this.getCurrentUser();
        if (!user) {
            this.showNotification('Please sign in to like reviews.', 'warning');
            return;
        }

        try {
            console.log(`ðŸ‘ Toggling like for review ${reviewId}`);

            const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
            const response = await fetch('/api/reviews/like', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    reviewId: parseInt(reviewId),
                    likeType: 'like'
                })
            });

            const data = await response.json();

            if (data.success) {
                console.log(`âœ… Like toggled successfully: ${data.message}`);

                // Update local review data
                const review = this.reviews[fragrance].find(r => r.id === reviewId);
                if (review) {
                    review.likes = data.likes;
                    review.dislikes = data.dislikes;
                }

                // Update user like status
                if (!this.userLikes) this.userLikes = {};

                // Toggle user's like status
                if (this.userLikes[reviewId] === 'like') {
                    delete this.userLikes[reviewId]; // Remove like
                } else {
                    this.userLikes[reviewId] = 'like'; // Add like
                }

                // Refresh display
                this.displayReviews(fragrance);

                this.showNotification(data.message, 'success');
            } else {
                console.error('âŒ Failed to toggle like:', data.error);
                this.showNotification(data.error || 'Failed to like review', 'error');
            }
        } catch (error) {
            console.error('âŒ Error toggling like:', error);
            this.showNotification('Network error. Please try again.', 'error');
        }
    }

    async toggleDislike(fragrance, reviewId) {
        const user = this.getCurrentUser();
        if (!user) {
            this.showNotification('Please sign in to dislike reviews.', 'warning');
            return;
        }

        try {
            console.log(`ðŸ‘Ž Toggling dislike for review ${reviewId}`);

            const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
            const response = await fetch('/api/reviews/like', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    reviewId: parseInt(reviewId),
                    likeType: 'dislike'
                })
            });

            const data = await response.json();

            if (data.success) {
                console.log(`âœ… Dislike toggled successfully: ${data.message}`);

                // Update local review data
                const review = this.reviews[fragrance].find(r => r.id === reviewId);
                if (review) {
                    review.likes = data.likes;
                    review.dislikes = data.dislikes;
                }

                // Update user like status
                if (!this.userLikes) this.userLikes = {};

                // Toggle user's dislike status
                if (this.userLikes[reviewId] === 'dislike') {
                    delete this.userLikes[reviewId]; // Remove dislike
                } else {
                    this.userLikes[reviewId] = 'dislike'; // Add dislike
                }

                // Refresh display
                this.displayReviews(fragrance);

                this.showNotification(data.message, 'success');
            } else {
                console.error('âŒ Failed to toggle dislike:', data.error);
                this.showNotification(data.error || 'Failed to dislike review', 'error');
            }
        } catch (error) {
            console.error('âŒ Error toggling dislike:', error);
            this.showNotification('Network error. Please try again.', 'error');
        }
    }

    loadMoreReviews(fragrance) {
        // This would load more reviews from server in a real implementation
        // For now, we'll just show all reviews
        const reviewsList = document.getElementById(`${fragrance}-reviews-list`);
        const loadMoreContainer = document.getElementById(`${fragrance}-load-more`);

        if (!reviewsList) return;

        const reviews = this.reviews[fragrance] || [];

        // Clear and show all reviews
        reviewsList.innerHTML = '';

        if (reviews.length === 0) {
            reviewsList.innerHTML = `
                <div class="reviews-empty">
                    <div class="reviews-empty-icon">ðŸ’­</div>
                    <h4>No reviews yet</h4>
                    <p>Be the first to share your experience with ${fragrance.charAt(0).toUpperCase() + fragrance.slice(1)}!</p>
                </div>
            `;
            return;
        }

        reviews.forEach(review => {
            const reviewElement = this.createReviewElement(review, fragrance);
            reviewsList.appendChild(reviewElement);
        });

        // Hide load more button
        if (loadMoreContainer) {
            loadMoreContainer.style.display = 'none';
        }
    }

    loadReviews() {
        try {
            const savedReviews = localStorage.getItem('fragranceReviews');
            if (savedReviews) {
                this.reviews = JSON.parse(savedReviews);
            }
        } catch (error) {
            console.error('Error loading reviews:', error);
            this.reviews = { layton: [], haltane: [], pegasus: [] };
        }
    }

    saveReviews() {
        try {
            localStorage.setItem('fragranceReviews', JSON.stringify(this.reviews));
        } catch (error) {
            console.error('Error saving reviews:', error);
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `review-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${type === 'success' ? 'âœ…' : type === 'error' ? 'âŒ' : 'â„¹ï¸'}</span>
                <span class="notification-message">${message}</span>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            max-width: 300px;
        `;

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Method to refresh reviews when user logs in/out
    refreshForUser() {
        this.updateUIForLoginStatus();
    }

    // Update user profile information in all existing reviews
    updateUserProfileInReviews(userEmail, profileData) {
        console.log(`ðŸ”„ Updating profile for ${userEmail} in all reviews...`);

        let updatedCount = 0;
        let refreshNeeded = false;

        // Update reviews in all fragrances
        Object.keys(this.reviews).forEach(fragrance => {
            this.reviews[fragrance].forEach(review => {
                if (review.userId === userEmail) {
                    // Update name if provided
                    if (profileData.name && review.userName !== profileData.name) {
                        console.log(`ðŸ“ Updating name from "${review.userName}" to "${profileData.name}" in ${fragrance} review`);
                        review.userName = profileData.name;
                        updatedCount++;
                        refreshNeeded = true;
                    }

                    // Update avatar if provided
                    if (profileData.avatar && review.userAvatar !== profileData.avatar) {
                        console.log(`ðŸ–¼ï¸ Updating avatar in ${fragrance} review`);
                        review.userAvatar = profileData.avatar;
                        updatedCount++;
                        refreshNeeded = true;
                    }
                }
            });
        });

        if (refreshNeeded) {
            // Save updated reviews to localStorage
            this.saveReviews();

            // Refresh all visible review displays
            Object.keys(this.reviews).forEach(fragrance => {
                const reviewsList = document.getElementById(`${fragrance}-reviews-list`);
                if (reviewsList && reviewsList.children.length > 0) {
                    console.log(`ðŸ”„ Refreshing ${fragrance} reviews display`);
                    this.displayReviews(fragrance);
                }
            });

            console.log(`âœ… Updated ${updatedCount} review entries and refreshed displays`);
        } else {
            console.log('â„¹ï¸ No reviews found for this user or no changes needed');
        }

        // Also refresh review forms with updated profile info
        this.refreshReviewForms();
    }

    // Refresh all review forms with current user info
    refreshReviewForms() {
        const currentUser = this.getCurrentUser();
        if (!currentUser) return;

        console.log('ðŸ”„ Refreshing review forms with current user info...');

        // Update all fragrance review forms
        Object.keys(this.reviews).forEach(fragrance => {
            this.updateReviewFormUserInfo(fragrance, currentUser);
        });

        console.log('âœ… Review forms refreshed');
    }

    // Update user profile in database reviews and replies
    async updateUserProfileInDatabase(name, avatar) {
        try {
            console.log(`ðŸ”„ Updating user profile in database: name="${name}", avatar="${avatar}"`);

            const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
            if (!token) {
                console.error('âŒ No authentication token found');
                return false;
            }

            const requestBody = {
                name: name,
                avatar: avatar
            };
            console.log('ðŸ“¤ Sending request body:', requestBody);

            const response = await fetch('/api/reviews/update-user-profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(requestBody)
            });

            if (response.ok) {
                const data = await response.json();
                console.log(`âœ… Updated profile in ${data.updatedReviews} reviews and ${data.updatedReplies} replies`);

                // Reload all reviews to show updated profile
                await this.loadAllReviews();

                // ðŸ”§ NEW: Refresh all replies to show updated profile
                await this.refreshAllReplies();

                return true;
            } else {
                const errorData = await response.json();
                console.error('âŒ Failed to update profile in database:', errorData);
                return false;
            }
        } catch (error) {
            console.error('âŒ Error updating profile in database:', error);
            return false;
        }
    }

    // ðŸ”§ NEW: Refresh all replies across all reviews
    async refreshAllReplies() {
        console.log('ðŸ”„ Refreshing all replies with updated profile...');

        try {
            // First, update existing reply elements in the DOM immediately
            this.updateExistingReplyElements();

            // Then, reload replies from server to ensure consistency
            const replyContainers = document.querySelectorAll('[id^="replies-list-"]');

            for (const container of replyContainers) {
                // Extract review ID from container ID
                const reviewId = container.id.replace('replies-list-', '');

                if (reviewId) {
                    console.log(`ðŸ”„ Refreshing replies for review ${reviewId}`);
                    await this.loadReplies(reviewId);
                }
            }

            console.log('âœ… All replies refreshed successfully');
        } catch (error) {
            console.error('âŒ Error refreshing replies:', error);
        }
    }

    // ðŸ”§ NEW: Update existing reply elements in DOM with current user profile
    updateExistingReplyElements() {
        const currentUser = this.getCurrentUser();
        if (!currentUser) {
            console.log('âš ï¸ No current user found for reply updates');
            return;
        }

        console.log('ðŸ”„ Updating existing reply elements in DOM...');

        // Find all reply items that belong to the current user
        const replyItems = document.querySelectorAll('.reply-item');
        let updatedCount = 0;

        replyItems.forEach(replyItem => {
            // Check if this reply belongs to the current user
            const replyUserInfo = replyItem.querySelector('.reply-user-info');
            const replyUserName = replyItem.querySelector('.reply-user-name');
            const replyAvatar = replyItem.querySelector('.reply-avatar img');

            if (replyUserName && replyAvatar) {
                // Check if this is the current user's reply by comparing email or name
                const replyEmail = replyItem.dataset.userEmail;
                const currentReplyName = replyUserName.textContent.trim();

                // Update if this is the current user's reply
                if (replyEmail === currentUser.email ||
                    (currentUser.name && currentReplyName.includes(currentUser.name.split(' ')[0]))) {

                    // Update name
                    if (currentUser.name && replyUserName.textContent !== currentUser.name) {
                        console.log(`ðŸ“ Updating reply name from "${replyUserName.textContent}" to "${currentUser.name}"`);
                        replyUserName.textContent = currentUser.name;
                        updatedCount++;
                    }

                    // Update avatar
                    if (currentUser.avatar && replyAvatar.src !== currentUser.avatar) {
                        console.log(`ðŸ–¼ï¸ Updating reply avatar`);
                        replyAvatar.src = currentUser.avatar;
                        updatedCount++;
                    }
                }
            }
        });

        console.log(`âœ… Updated ${updatedCount} existing reply elements`);
    }

    // Force update all existing reviews for current user with current profile data
    forceUpdateCurrentUserReviews() {
        const currentUser = this.getCurrentUser();
        if (!currentUser) {
            console.log('âŒ No current user found for review update');
            return;
        }

        console.log(`ðŸ”„ Force updating all reviews for current user: ${currentUser.email}`);

        let totalUpdated = 0;
        let reviewsFound = 0;

        // Update reviews in all fragrances
        Object.keys(this.reviews).forEach(fragrance => {
            this.reviews[fragrance].forEach(review => {
                if (review.userId === currentUser.email) {
                    reviewsFound++;
                    let updated = false;

                    // Always update name to current profile name
                    if (review.userName !== currentUser.name) {
                        console.log(`ðŸ“ Updating review name from "${review.userName}" to "${currentUser.name}" in ${fragrance}`);
                        review.userName = currentUser.name;
                        updated = true;
                    }

                    // Always update avatar to current profile avatar
                    if (review.userAvatar !== currentUser.avatar) {
                        console.log(`ðŸ–¼ï¸ Updating review avatar in ${fragrance}`);
                        review.userAvatar = currentUser.avatar;
                        updated = true;
                    }

                    if (updated) {
                        totalUpdated++;
                    }
                }
            });
        });

        if (totalUpdated > 0) {
            // Save updated reviews to localStorage
            this.saveReviews();

            // Refresh all visible review displays
            Object.keys(this.reviews).forEach(fragrance => {
                const reviewsList = document.getElementById(`${fragrance}-reviews-list`);
                if (reviewsList) {
                    console.log(`ðŸ”„ Force refreshing ${fragrance} reviews display`);
                    this.displayReviews(fragrance);
                }
            });

            console.log(`âœ… Force updated ${totalUpdated} out of ${reviewsFound} existing reviews`);
        } else {
            console.log(`â„¹ï¸ Found ${reviewsFound} reviews but no updates needed`);
        }
    }

    // ðŸ‘‘ ADMIN ENHANCEMENT: Check if a user is an administrator
    isAdminUser(userEmailOrName, reviewData = null) {
        if (!userEmailOrName) return false;

        // Method 1: Check review data directly (most reliable when available)
        if (reviewData) {
            // Check if review has admin status stored (handle both field variations)
            if (reviewData.is_admin === 1 || reviewData.is_admin === true ||
                reviewData.isAdmin === 1 || reviewData.isAdmin === true) {
                console.log('âœ… Admin detected via is_admin field:', reviewData.is_admin);
                return true;
            }
            // Check if review email matches admin email (handle both field variations)
            const email = reviewData.userEmail || reviewData.user_email;
            if (email && email.toLowerCase() === 'cherifmed1200@gmail.com') {
                console.log('âœ… Admin detected via email field:', email);
                return true;
            }
        }

        // Method 2: Check by known admin emails (works when not logged in)
        const adminEmails = ['cherifmed1200@gmail.com'];
        if (adminEmails.includes(userEmailOrName.toLowerCase())) {
            console.log('âœ… Admin detected via known email:', userEmailOrName);
            return true;
        }

        // Method 3: Check current user's admin status if this matches current user (fallback)
        const currentUser = getCurrentUser();
        if (currentUser &&
            (currentUser.email === userEmailOrName || currentUser.name === userEmailOrName) &&
            (currentUser.is_admin || currentUser.isAdmin)) {
            console.log('âœ… Admin detected via current user:', currentUser.email);
            return true;
        }

        return false;
    }

    // ðŸš€ ENHANCED REVIEW SYSTEM: Reply Management Methods

    // Toggle reply form visibility
    toggleReplyForm(fragrance, reviewId) {
        const replyForm = document.getElementById(`reply-form-${reviewId}`);
        if (!replyForm) return;

        const isVisible = replyForm.style.display !== 'none';

        if (isVisible) {
            // Hide form
            replyForm.style.display = 'none';
        } else {
            // Show form and setup user info
            const currentUser = this.getCurrentUser();
            if (!currentUser) {
                this.showLoginPrompt();
                return;
            }

            replyForm.style.display = 'block';

            // Setup user avatar and name
            const replyAvatar = document.getElementById(`reply-avatar-${reviewId}`);
            const replyUsername = document.getElementById(`reply-username-${reviewId}`);
            const replyTextarea = document.getElementById(`reply-text-${reviewId}`);
            const charCount = document.getElementById(`reply-char-count-${reviewId}`);

            if (replyAvatar && currentUser.avatar) {
                replyAvatar.src = currentUser.avatar;
            }
            if (replyUsername && currentUser.name) {
                replyUsername.textContent = currentUser.name;
            }

            // ðŸ”§ FIX: Setup character counter with cleanup to prevent memory leaks
            if (replyTextarea && charCount) {
                // Remove existing event listener if any
                const existingHandler = replyTextarea._charCountHandler;
                if (existingHandler) {
                    replyTextarea.removeEventListener('input', existingHandler);
                }

                // Create new handler and store reference for cleanup
                const charCountHandler = () => {
                    charCount.textContent = replyTextarea.value.length;
                };
                replyTextarea._charCountHandler = charCountHandler;
                replyTextarea.addEventListener('input', charCountHandler);
                replyTextarea.focus();
            }
        }
    }

    // Submit a reply
    async submitReply(fragrance, reviewId) {
        // ðŸ”§ FIX: Add debouncing to prevent spam submissions
        const now = Date.now();
        const lastSubmission = this._lastReplySubmission || 0;
        const debounceTime = 2000; // 2 seconds

        if (now - lastSubmission < debounceTime) {
            this.showNotification('Please wait before submitting another reply', 'warning');
            return;
        }
        this._lastReplySubmission = now;

        const replyText = document.getElementById(`reply-text-${reviewId}`);
        if (!replyText) return;

        const text = replyText.value.trim();

        // ðŸ”§ ENHANCED: Comprehensive reply validation
        if (!text) {
            this.showNotification('Please enter a reply', 'warning');
            replyText.focus();
            return;
        }

        if (text.length < 3) {
            this.showNotification('Reply must be at least 3 characters long', 'warning');
            replyText.focus();
            return;
        }

        if (text.length > 1000) {
            this.showNotification('Reply is too long (max 1000 characters)', 'warning');
            replyText.focus();
            return;
        }

        // Check for spam patterns
        if (this.isSpamContent(text)) {
            this.showNotification('Reply appears to be spam. Please write a meaningful comment.', 'warning');
            replyText.focus();
            return;
        }

        // Check for excessive repeated characters
        if (this.hasExcessiveRepeatedChars(text)) {
            this.showNotification('Please avoid excessive repeated characters', 'warning');
            replyText.focus();
            return;
        }

        const currentUser = this.getCurrentUser();
        if (!currentUser) {
            this.showLoginPrompt();
            return;
        }

        try {
            console.log(`ðŸ’¬ Submitting reply to review ${reviewId}`);

            // ðŸ”§ FIX: Use consistent token retrieval
            const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
            if (!token) {
                throw new Error('Authentication token not found. Please sign in again.');
            }

            const response = await fetch(`/api/reviews/${reviewId}/replies`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    reply_text: text
                })
            });

                const data = await response.json();

                if (data.success) {
                console.log('âœ… Reply submitted successfully');

                // Clear form and hide it
                replyText.value = '';
                this.toggleReplyForm(fragrance, reviewId);

                // Reload replies
                await this.loadReplies(reviewId);

                // Show success message
                this.showNotification('Reply added successfully!', 'success');

                    // ðŸ”¥ Real-time level update if XP was awarded
                    if (data.xp && data.xp.levelData) {
                        LevelEvents.emit({ level: data.xp.levelData.level, levelData: data.xp.levelData });
                        if (data.xp.leveledUp) {
                            window.showLevelUpNotification(data.xp.oldLevel, data.xp.newLevel);
                        }
                    }
            } else {
                throw new Error(data.error || 'Failed to submit reply');
            }
        } catch (error) {
            console.error('âŒ Error submitting reply:', error);

            // ðŸ”§ FIX: Better error handling with specific messages
            let errorMessage = 'Failed to submit reply. Please try again.';

            if (error.message.includes('Authentication token not found')) {
                errorMessage = 'Please sign in to submit a reply.';
            } else if (error.message.includes('Network')) {
                errorMessage = 'Network error. Please check your connection and try again.';
            } else if (error.message.includes('timeout')) {
                errorMessage = 'Request timed out. Please try again.';
            }

            this.showNotification(errorMessage, 'error');
        }
    }

    // Load replies for a review
    async loadReplies(reviewId) {
        // ðŸ”§ FIX: Prevent race conditions with loading state management
        if (this._loadingReplies && this._loadingReplies[reviewId]) {
            console.log(`â³ Already loading replies for review ${reviewId}, skipping...`);
            return;
        }

        if (!this._loadingReplies) this._loadingReplies = {};
        this._loadingReplies[reviewId] = true;

        const repliesContainer = document.getElementById(`replies-list-${reviewId}`);
        const loadingIndicator = document.getElementById(`replies-loading-${reviewId}`);

        if (!repliesContainer) {
            this._loadingReplies[reviewId] = false;
            return;
        }

        try {
            if (loadingIndicator) {
                loadingIndicator.style.display = 'flex';
            }

            const response = await fetch(`/api/reviews/${reviewId}/replies`);
            const data = await response.json();

            if (data.success && data.replies) {
                console.log(`ðŸ“¥ Loaded ${data.replies.length} replies for review ${reviewId}`);
                this.renderReplies(repliesContainer, data.replies, reviewId);
            } else {
                console.log(`â„¹ï¸ No replies found for review ${reviewId}`);
                repliesContainer.innerHTML = '';
            }
        } catch (error) {
            console.error('âŒ Error loading replies:', error);
            repliesContainer.innerHTML = '<div class="replies-error">Failed to load replies</div>';
        } finally {
            if (loadingIndicator) {
                loadingIndicator.style.display = 'none';
            }
            // ðŸ”§ FIX: Clean up loading state
            this._loadingReplies[reviewId] = false;
        }
    }

    // Render replies in the container
    renderReplies(container, replies, reviewId) {
        if (!replies || replies.length === 0) {
            container.innerHTML = '';
            return;
        }

        container.innerHTML = replies.map(reply => this.createReplyElement(reply, reviewId)).join('');
    }

    // Create a single reply element
    createReplyElement(reply, reviewId) {
        const isAdminReply = this.isAdminUser(reply.user_email || reply.userName, reply);
        const adminBadgeHtml = isAdminReply ? `
            <div class="reply-admin-badge">
                <svg class="reply-admin-icon" viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                    <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM12 7C13.1 7 14 7.9 14 9S13.1 11 12 11 10 10.1 10 9 10.9 7 12 7ZM18 15C18 16.1 17.1 17 16 17H8C6.9 17 6 16.1 6 15V14C6 12.9 6.9 12 8 12H16C17.1 12 18 12.9 18 14V15Z"/>
                </svg>
                <span class="reply-admin-text">Admin</span>
            </div>
        ` : '';

        // ðŸ”§ FIX: Handle avatar placeholder to prevent 404 errors
        let avatarSrc = reply.user_avatar;
        if (avatarSrc === 'custom_uploaded' || avatarSrc === 'custom_avatar_uploaded') {
            avatarSrc = 'default.jpg'; // Use default for placeholders
        }

        return `
            <div class="reply-item" data-reply-id="${reply.id}" data-user-email="${reply.user_email || ''}">
                <div class="reply-header">
                    <div class="reply-user-info">
                        <div class="reply-avatar-container">
                            <div class="level-progress-ring" style="--progress-angle: ${((reply.levelProgress||0)/100)*360}deg"></div>
                            <div class="reply-avatar ${isAdminReply ? 'admin-reply-avatar' : ''}">
                                <img src="${avatarSrc}" alt="${reply.user_name}'s Avatar">
                                ${isAdminReply ? '<div class="reply-avatar-crown">ðŸ‘‘</div>' : ''}
                            </div>
                            <div class="level-badge">${reply.level || 1}</div>
                            <div class="level-tooltip">${Math.max(0, Math.min(100, Math.round(reply.levelProgress || 0)))}% to next level</div>
                        </div>
                        <div class="reply-user-details">
                            <div class="reply-username-container">
                                <div class="reply-username ${isAdminReply ? 'admin-username' : ''}">${reply.user_name}</div>
                                ${adminBadgeHtml}
                            </div>
                            <div class="reply-date">${this.formatDate(reply.created_at)}</div>
                        </div>
                    </div>
                </div>
                <div class="reply-content">
                    <p class="reply-text">${this.sanitizeHTML(reply.reply_text)}</p>
                </div>
                <div class="reply-actions">
                    <button class="reply-action-btn like-btn" onclick="window.reviewsManager.likeReply('${reply.id}', 'like')">
                        <span class="reply-action-icon">ðŸ‘</span>
                        <span class="reply-action-count">${reply.likes || 0}</span>
                    </button>
                    <button class="reply-action-btn dislike-btn" onclick="window.reviewsManager.likeReply('${reply.id}', 'dislike')">
                        <span class="reply-action-icon">ðŸ‘Ž</span>
                        <span class="reply-action-count">${reply.dislikes || 0}</span>
                    </button>
                    ${this.canUserDeleteReply(reply) ? `
                        <button class="reply-action-btn delete-btn" onclick="window.reviewsManager.deleteReply('${reply.id}')">
                            <span class="reply-action-icon">ðŸ—‘ï¸</span>
                            <span class="reply-action-text">Delete</span>
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    }

    // Like/Dislike a reply
    async likeReply(replyId, likeType) {
        // ðŸ”§ FIX: Add debouncing to prevent like/dislike spam
        const now = Date.now();
        const lastLike = this._lastReplyLike || 0;
        const debounceTime = 1000; // 1 second

        if (now - lastLike < debounceTime) {
            this.showNotification('Please wait before voting again', 'warning');
            return;
        }
        this._lastReplyLike = now;

        const currentUser = this.getCurrentUser();
        if (!currentUser) {
            this.showLoginPrompt();
            return;
        }

        try {
            console.log(`ðŸ‘ ${likeType}ing reply ${replyId}`);

            // ðŸ”§ FIX: Use consistent token retrieval
            const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
            if (!token) {
                throw new Error('Authentication token not found. Please sign in again.');
            }

            const response = await fetch(`/api/replies/${replyId}/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ likeType })
            });

            const data = await response.json();

            if (data.success) {
                console.log(`âœ… Reply ${likeType} successful:`, data);

                // Update the UI with new counts
                const replyElement = document.querySelector(`[data-reply-id="${replyId}"]`);
                if (replyElement) {
                    const likeBtn = replyElement.querySelector('.like-btn .reply-action-count');
                    const dislikeBtn = replyElement.querySelector('.dislike-btn .reply-action-count');

                    if (likeBtn) likeBtn.textContent = data.likes || 0;
                    if (dislikeBtn) dislikeBtn.textContent = data.dislikes || 0;
                }

                this.showNotification(`Reply ${likeType}d!`, 'success');
            } else {
                throw new Error(data.error || `Failed to ${likeType} reply`);
            }
        } catch (error) {
            console.error(`âŒ Error ${likeType}ing reply:`, error);

            // ðŸ”§ FIX: Better error handling with specific messages
            let errorMessage = `Failed to ${likeType} reply. Please try again.`;

            if (error.message.includes('Authentication token not found')) {
                errorMessage = `Please sign in to ${likeType} replies.`;
            } else if (error.message.includes('Network')) {
                errorMessage = 'Network error. Please check your connection and try again.';
            } else if (error.message.includes('timeout')) {
                errorMessage = 'Request timed out. Please try again.';
            }

            this.showNotification(errorMessage, 'error');
        }
    }

    // Format date for replies
    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;

        return date.toLocaleDateString();
    }

    // Show notification
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        // Add to page
        document.body.appendChild(notification);

        // Auto remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }

    // Show login prompt
    showLoginPrompt() {
        this.showNotification('Please sign in to interact with reviews', 'warning');
    }

    // ðŸ”§ ENHANCED: Comprehensive HTML sanitization to prevent XSS attacks
    sanitizeHTML(str) {
        if (!str) return '';

        // Convert to string and trim
        str = String(str).trim();

        // First pass: Remove all script tags and dangerous content
        str = str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        str = str.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
        str = str.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '');
        str = str.replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '');
        str = str.replace(/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, '');
        str = str.replace(/javascript:/gi, '');
        str = str.replace(/on\w+\s*=/gi, '');
        str = str.replace(/data:(?!image\/[a-z]+;base64,)[^;]+/gi, '');

        // Create a temporary div element for safe HTML parsing
        const temp = document.createElement('div');
        temp.textContent = str;

        // Get the escaped content
        let sanitized = temp.innerHTML;

        // Allow only safe HTML tags with strict validation
        const allowedTags = {
            'br': true,
            'b': true,
            'strong': true,
            'i': true,
            'em': true,
            'u': true,
            'p': true
        };

        // Replace allowed tags back (with validation)
        Object.keys(allowedTags).forEach(tag => {
            const openTag = new RegExp(`&lt;${tag}&gt;`, 'gi');
            const closeTag = new RegExp(`&lt;\\/${tag}&gt;`, 'gi');
            sanitized = sanitized.replace(openTag, `<${tag}>`);
            sanitized = sanitized.replace(closeTag, `</${tag}>`);
        });

        // Final security check: remove any remaining dangerous patterns
        sanitized = sanitized.replace(/javascript:/gi, '');
        sanitized = sanitized.replace(/vbscript:/gi, '');
        sanitized = sanitized.replace(/data:/gi, '');
        sanitized = sanitized.replace(/on\w+=/gi, '');

        return sanitized;
    }

    // ðŸ”§ ENHANCED: Spam detection for replies
    isSpamContent(text) {
        if (!text) return false;

        const lowerText = text.toLowerCase();

        // Common spam patterns
        const spamPatterns = [
            /(.)\1{10,}/g, // 10+ repeated characters
            /^(.{1,3})\1{5,}$/g, // Short repeated patterns
            /(buy now|click here|free money|make money|earn \$|viagra|casino)/gi,
            /^[^a-zA-Z]*$/g, // Only symbols/numbers
            /(.{1,2})\1{20,}/g // Very short repeated patterns
        ];

        return spamPatterns.some(pattern => pattern.test(lowerText));
    }

    // ðŸ”§ ENHANCED: Check for excessive repeated characters
    hasExcessiveRepeatedChars(text) {
        if (!text) return false;

        // Check for more than 5 consecutive identical characters
        const repeatedCharsPattern = /(.)\1{5,}/g;
        return repeatedCharsPattern.test(text);
    }

    // ðŸ—‘ï¸ Check if current user can delete a reply
    canUserDeleteReply(reply) {
        const currentUser = this.getCurrentUser();
        if (!currentUser) return false;

        // User can delete their own reply
        const isOwner = reply.user_id === currentUser.userId ||
                       reply.user_email === currentUser.email;

        // Admin can delete any reply
        const isAdmin = this.isAdminUser(currentUser.email, currentUser);

        return isOwner || isAdmin;
    }

    // ðŸ—‘ï¸ Delete a reply
    async deleteReply(replyId) {
        const currentUser = this.getCurrentUser();
        if (!currentUser) {
            this.showLoginPrompt();
            return;
        }

        // ðŸŽ¨ Enhanced confirmation with custom modal
        const confirmDelete = await this.showDeleteConfirmation('Are you sure you want to delete this reply?', 'This action cannot be undone.');
        if (!confirmDelete) {
            return;
        }

        try {
            console.log(`ðŸ—‘ï¸ Deleting reply ${replyId}`);

            // Get authentication token
            const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
            if (!token) {
                throw new Error('Authentication token not found. Please sign in again.');
            }

            const response = await fetch(`/api/replies/${replyId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (data.success) {
                console.log('âœ… Reply deleted successfully');

                // Remove the reply element from the DOM
                const replyElement = document.querySelector(`[data-reply-id="${replyId}"]`);
                if (replyElement) {
                    // Add fade-out animation
                    replyElement.style.transition = 'all 0.3s ease';
                    replyElement.style.opacity = '0';
                    replyElement.style.transform = 'translateX(-20px)';

                    setTimeout(() => {
                        if (replyElement.parentNode) {
                            replyElement.parentNode.removeChild(replyElement);
                        }
                    }, 300);
                }

                this.showNotification('Reply deleted successfully!', 'success');
            } else {
                throw new Error(data.error || 'Failed to delete reply');
            }
        } catch (error) {
            console.error('âŒ Error deleting reply:', error);

            let errorMessage = 'Failed to delete reply. Please try again.';

            if (error.message.includes('Authentication token not found')) {
                errorMessage = 'Please sign in to delete replies.';
            } else if (error.message.includes('Not authorized')) {
                errorMessage = 'You can only delete your own replies.';
            } else if (error.message.includes('Network')) {
                errorMessage = 'Network error. Please check your connection and try again.';
            }

            this.showNotification(errorMessage, 'error');
        }
    }

    // ðŸŽ¨ Show custom delete confirmation modal
    showDeleteConfirmation(title, message) {
        return new Promise((resolve) => {
            // Create modal overlay
            const overlay = document.createElement('div');
            overlay.className = 'delete-confirmation-overlay';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                backdrop-filter: blur(5px);
                animation: fadeIn 0.3s ease;
            `;

            // Create modal
            const modal = document.createElement('div');
            modal.className = 'delete-confirmation-modal';
            modal.style.cssText = `
                background: linear-gradient(135deg, rgba(30, 30, 30, 0.95) 0%, rgba(40, 40, 40, 0.95) 100%);
                border-radius: 16px;
                padding: 30px;
                max-width: 400px;
                width: 90%;
                border: 1px solid rgba(255, 255, 255, 0.1);
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
                animation: slideInScale 0.3s ease;
                text-align: center;
            `;

            modal.innerHTML = `
                <div style="color: #ff6b6b; font-size: 48px; margin-bottom: 20px;">ðŸ—‘ï¸</div>
                <h3 style="color: #ffffff; margin: 0 0 15px 0; font-size: 20px; font-weight: 600;">${title}</h3>
                <p style="color: rgba(255, 255, 255, 0.8); margin: 0 0 30px 0; font-size: 14px; line-height: 1.5;">${message}</p>
                <div style="display: flex; gap: 15px; justify-content: center;">
                    <button class="delete-cancel-btn" style="
                        padding: 12px 24px;
                        background: rgba(255, 255, 255, 0.1);
                        border: 1px solid rgba(255, 255, 255, 0.2);
                        border-radius: 8px;
                        color: rgba(255, 255, 255, 0.8);
                        font-size: 14px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    ">Cancel</button>
                    <button class="delete-confirm-btn" style="
                        padding: 12px 24px;
                        background: linear-gradient(135deg, #ff6b6b 0%, #ff5252 100%);
                        border: 1px solid rgba(255, 107, 107, 0.5);
                        border-radius: 8px;
                        color: white;
                        font-size: 14px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    ">Delete</button>
                </div>
            `;

            // Add hover effects
            const cancelBtn = modal.querySelector('.delete-cancel-btn');
            const confirmBtn = modal.querySelector('.delete-confirm-btn');

            cancelBtn.addEventListener('mouseenter', () => {
                cancelBtn.style.background = 'rgba(255, 255, 255, 0.15)';
                cancelBtn.style.color = 'rgba(255, 255, 255, 1)';
            });
            cancelBtn.addEventListener('mouseleave', () => {
                cancelBtn.style.background = 'rgba(255, 255, 255, 0.1)';
                cancelBtn.style.color = 'rgba(255, 255, 255, 0.8)';
            });

            confirmBtn.addEventListener('mouseenter', () => {
                confirmBtn.style.background = 'linear-gradient(135deg, #ff5252 0%, #f44336 100%)';
                confirmBtn.style.transform = 'translateY(-1px)';
                confirmBtn.style.boxShadow = '0 6px 20px rgba(255, 107, 107, 0.4)';
            });
            confirmBtn.addEventListener('mouseleave', () => {
                confirmBtn.style.background = 'linear-gradient(135deg, #ff6b6b 0%, #ff5252 100%)';
                confirmBtn.style.transform = 'translateY(0)';
                confirmBtn.style.boxShadow = 'none';
            });

            // Event handlers
            const cleanup = () => {
                overlay.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => {
                    if (overlay.parentNode) {
                        overlay.parentNode.removeChild(overlay);
                    }
                }, 300);
            };

            cancelBtn.addEventListener('click', () => {
                cleanup();
                resolve(false);
            });

            confirmBtn.addEventListener('click', () => {
                cleanup();
                resolve(true);
            });

            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    cleanup();
                    resolve(false);
                }
            });

            // Add CSS animations
            const style = document.createElement('style');
            style.textContent = `
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
                @keyframes slideInScale {
                    from {
                        opacity: 0;
                        transform: scale(0.8) translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }
            `;
            document.head.appendChild(style);

            overlay.appendChild(modal);
            document.body.appendChild(overlay);
        });
    }
}

// Global function to manually update existing reviews
window.updateExistingReviews = function() {
    console.log('ðŸ”„ Manually updating existing reviews...');
    if (window.reviewsManager) {
        window.reviewsManager.forceUpdateCurrentUserReviews();
    } else {
        console.error('âŒ Reviews manager not available');
    }
};

// Function to clean up localStorage from large base64 images
window.cleanupLocalStorage = function() {
    console.log('ðŸ§¹ Cleaning up localStorage from large base64 images...');

    try {
        // Check user data
        const userData = localStorage.getItem('user');
        if (userData) {
            const user = JSON.parse(userData);
            if (user.avatar && user.avatar.startsWith('data:')) {
                console.log('ðŸ”§ Found large base64 avatar in user data, replacing...');
                user.avatar = 'default.jpg';
                localStorage.setItem('user', JSON.stringify(user));
                console.log('âœ… Cleaned user data');
            }
        }

        // Check profile data
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('userProfile_')) {
                try {
                    const profileData = JSON.parse(localStorage.getItem(key));
                    if (profileData.avatar && profileData.avatar.startsWith('data:')) {
                        console.log(`ðŸ”§ Found large base64 avatar in ${key}, replacing...`);
                        profileData.avatar = 'default.jpg';
                        localStorage.setItem(key, JSON.stringify(profileData));
                        console.log(`âœ… Cleaned ${key}`);
                    }
                } catch (error) {
                    console.error(`âŒ Error cleaning ${key}:`, error);
                }
            }
        });

        console.log('âœ… localStorage cleanup completed');
    } catch (error) {
        console.error('âŒ Error during localStorage cleanup:', error);
    }
};

// Function to immediately fix any 'custom_uploaded' entries
window.fixCustomUploadedEntries = function() {
    console.log('ðŸ”§ Fixing custom_uploaded entries...');

    try {
        // Fix user data
        const userData = localStorage.getItem('user');
        if (userData) {
            const user = JSON.parse(userData);
            if (user.avatar === 'custom_uploaded') {
                console.log('ðŸ”§ Found custom_uploaded in user data, fixing...');
                user.avatar = 'default.jpg';
                localStorage.setItem('user', JSON.stringify(user));
                console.log('âœ… Fixed user data');
            }
        }

        // Fix profile data
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('userProfile_')) {
                try {
                    const profileData = JSON.parse(localStorage.getItem(key));
                    if (profileData.avatar === 'custom_uploaded') {
                        console.log(`ðŸ”§ Found custom_uploaded in ${key}, fixing...`);
                        profileData.avatar = 'default.jpg';
                        localStorage.setItem(key, JSON.stringify(profileData));
                        console.log(`âœ… Fixed ${key}`);
                    }
                } catch (error) {
                    console.error(`âŒ Error fixing ${key}:`, error);
                }
            }
        });

        console.log('âœ… custom_uploaded entries fixed');

        // Refresh the page to apply changes
        setTimeout(() => {
            console.log('ðŸ”„ Refreshing page to apply fixes...');
            window.location.reload();
        }, 1000);

    } catch (error) {
        console.error('âŒ Error fixing custom_uploaded entries:', error);
    }
};

// Comprehensive function to fix all avatar issues immediately
window.fixAllAvatarIssues = function() {
    console.log('ðŸ”§ Comprehensive avatar fix starting...');

    try {
        // 1. Fix localStorage data
        const userData = localStorage.getItem('user');
        if (userData) {
            const user = JSON.parse(userData);
            if (user.avatar && (user.avatar.startsWith('data:') || user.avatar === 'custom_uploaded')) {
                console.log('ðŸ”§ Fixing user avatar in localStorage');
                user.avatar = 'default.jpg';
                localStorage.setItem('user', JSON.stringify(user));
            }
        }

        // 2. Fix sessionStorage data
        const sessionData = sessionStorage.getItem('user');
        if (sessionData) {
            const user = JSON.parse(sessionData);
            if (user.avatar && (user.avatar.startsWith('data:') || user.avatar === 'custom_uploaded')) {
                console.log('ðŸ”§ Fixing user avatar in sessionStorage');
                user.avatar = 'default.jpg';
                sessionStorage.setItem('user', JSON.stringify(user));
            }
        }

        // 3. Fix profile data entries
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('userProfile_')) {
                try {
                    const profileData = JSON.parse(localStorage.getItem(key));
                    if (profileData.avatar && (profileData.avatar.startsWith('data:') || profileData.avatar === 'custom_uploaded')) {
                        console.log(`ðŸ”§ Fixing avatar in ${key}`);
                        profileData.avatar = 'default.jpg';
                        localStorage.setItem(key, JSON.stringify(profileData));
                    }
                } catch (error) {
                    console.error(`âŒ Error fixing ${key}:`, error);
                }
            }
        });

        // 4. Fix current avatar elements immediately
        const userAvatar = document.getElementById('userAvatar');
        const profileAvatarLarge = document.getElementById('profileAvatarLarge');

        if (userAvatar && (userAvatar.src.includes('data:image') || userAvatar.src.includes('custom_uploaded'))) {
            console.log('ðŸ”§ Fixing navigation avatar element');
            userAvatar.src = 'default.jpg?' + Date.now();
        }

        if (profileAvatarLarge && (profileAvatarLarge.src.includes('data:image') || profileAvatarLarge.src.includes('custom_uploaded'))) {
            console.log('ðŸ”§ Fixing profile modal avatar element');
            profileAvatarLarge.src = 'default.jpg?' + Date.now();
        }

        console.log('âœ… Comprehensive avatar fix completed');
        console.log('ðŸ”„ Page will refresh in 2 seconds to apply all fixes...');

        // Refresh after a short delay
        setTimeout(() => {
            window.location.reload();
        }, 2000);

    } catch (error) {
        console.error('âŒ Error during comprehensive avatar fix:', error);
    }
};

// ðŸ§ª TEST MODERN COMMENT SYSTEM: Test the new edit/delete functionality
window.testModernCommentSystem = function() {
    console.log('ðŸ§ª TESTING MODERN COMMENT SYSTEM...');
    console.log('âœ… Features implemented:');
    console.log('  ðŸ“ Real-time name updates from database');
    console.log('  ðŸ–¼ï¸ Real-time avatar updates from database');
    console.log('  âœï¸ Edit your own comments');
    console.log('  ðŸ—‘ï¸ Delete your own comments');
    console.log('  ðŸ‘‘ Admin can edit/delete any comment');
    console.log('');
    console.log('ðŸŽ¯ To test:');
    console.log('  1. Go to any fragrance section (Layton, Haltane, Pegasus)');
    console.log('  2. Write a review');
    console.log('  3. Look for Edit âœï¸ and Delete ðŸ—‘ï¸ buttons on YOUR reviews');
    console.log('  4. Try editing your review');
    console.log('  5. Try deleting your review');
    console.log('  6. Change your profile name/avatar and see real-time updates');
    console.log('');
    console.log('ðŸ”§ The system now works like YouTube/Facebook comments!');
};







