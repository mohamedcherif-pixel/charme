/**
 * Advanced Luxury Marquee System
 * A sophisticated marquee solution with multiple display modes, dynamic content, and luxury effects
 */

class AdvancedMarquee {
    constructor(options = {}) {
        this.options = {
            // Container settings
            container: options.container || '.top-marquee',

            // Content settings
            content: options.content || [],
            contentUrl: options.contentUrl || null,
            refreshInterval: options.refreshInterval || 300000, // 5 minutes

            // Animation settings
            animationType: options.animationType || 'smooth-scroll',
            speed: options.speed || 50, // pixels per second
            direction: options.direction || 'left',
            pauseOnHover: options.pauseOnHover !== false,

            // Visual settings
            theme: options.theme || 'luxury',
            height: options.height || 'auto',
            gradient: options.gradient || true,
            blur: options.blur || false,
            glow: options.glow || false,

            // Interaction settings
            clickable: options.clickable !== false,
            closeable: options.closeable !== false,
            minimizable: options.minimizable || false,

            // Behavior settings
            autoStart: options.autoStart !== false,
            persistent: options.persistent || false,
            respectReducedMotion: options.respectReducedMotion !== false,

            // Advanced features
            dynamicSizing: options.dynamicSizing || false,
            typewriter: options.typewriter || false,
            particleEffects: options.particleEffects || false,
            soundEffects: options.soundEffects || false,

            ...options
        };

        this.marquees = new Map();
        this.currentContent = [];
        this.isAnimating = false;
        this.observers = new Map();
        this.contentIndex = 0;
        this.refreshTimer = null;
        this.animationFrame = null;

        this.themes = {
            luxury: {
                background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(255, 215, 0, 0.05) 50%, rgba(212, 175, 55, 0.1) 100%)',
                color: '#d4af37',
                borderColor: 'rgba(212, 175, 55, 0.2)',
                glowColor: 'rgba(212, 175, 55, 0.3)',
                fontSize: '14px',
                fontWeight: '600',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(20px)',
                animation: 'luxuryShimmer 3s ease-in-out infinite'
            },
            elegant: {
                background: 'linear-gradient(135deg, rgba(40, 167, 69, 0.08) 0%, rgba(32, 201, 151, 0.08) 100%)',
                color: '#28a745',
                borderColor: 'rgba(40, 167, 69, 0.15)',
                glowColor: 'rgba(40, 167, 69, 0.2)',
                fontSize: '13px',
                fontWeight: '500',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
                backdropFilter: 'blur(15px)'
            },
            modern: {
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                color: '#667eea',
                borderColor: 'rgba(102, 126, 234, 0.2)',
                glowColor: 'rgba(102, 126, 234, 0.3)',
                fontSize: '13px',
                fontWeight: '500',
                textShadow: 'none',
                backdropFilter: 'blur(10px)'
            },
            minimal: {
                background: 'rgba(255, 255, 255, 0.03)',
                color: 'rgba(255, 255, 255, 0.7)',
                borderColor: 'rgba(255, 255, 255, 0.05)',
                glowColor: 'transparent',
                fontSize: '12px',
                fontWeight: '400',
                textShadow: 'none',
                backdropFilter: 'blur(5px)'
            }
        };

        this.animationTypes = {
            'smooth-scroll': this.smoothScrollAnimation.bind(this),
            'typewriter': this.typewriterAnimation.bind(this),
            'fade-transition': this.fadeTransitionAnimation.bind(this),
            'slide-reveal': this.slideRevealAnimation.bind(this),
            'elastic-bounce': this.elasticBounceAnimation.bind(this),
            'wave-motion': this.waveMotionAnimation.bind(this),
            'particle-trail': this.particleTrailAnimation.bind(this)
        };

        this.init();
    }

    async init() {
        await this.loadContent();
        this.createMarqueeStructure();
        this.applyTheme();
        this.setupInteractions();
        this.setupResponsiveHandling();
        this.setupAccessibility();

        if (this.options.autoStart) {
            this.start();
        }

        this.setupContentRefresh();
        console.log('🎪 Advanced Marquee System initialized');
    }

    async loadContent() {
        if (this.options.contentUrl) {
            try {
                const response = await fetch(this.options.contentUrl);
                const data = await response.json();
                this.currentContent = data.content || data;
            } catch (error) {
                console.warn('Failed to load marquee content from URL:', error);
                this.currentContent = this.options.content;
            }
        } else {
            this.currentContent = this.options.content.length > 0 ? this.options.content : [
                {
                    type: 'announcement',
                    text: '✨ Free shipping on orders over $150',
                    icon: '🚚',
                    priority: 'high',
                    action: { text: 'Shop Now', url: '#products' }
                },
                {
                    type: 'promotion',
                    text: 'New arrivals from Parfums de Marly',
                    icon: '🌸',
                    priority: 'medium',
                    action: { text: 'Explore', url: '#new-arrivals' }
                },
                {
                    type: 'engagement',
                    text: 'Join and earn XP with reviews & replies',
                    icon: '⭐',
                    priority: 'low',
                    action: { text: 'Sign Up', url: '#signup' }
                },
                {
                    type: 'feature',
                    text: 'Try our new Scent Personality Quiz',
                    icon: '🧠',
                    priority: 'high',
                    action: { text: 'Take Quiz', url: '#quiz' }
                }
            ];
        }
    }

    createMarqueeStructure() {
        const container = document.querySelector(this.options.container);
        if (!container) {
            console.error('Marquee container not found:', this.options.container);
            return;
        }

        container.innerHTML = `
            <div class="advanced-marquee-wrapper">
                ${this.createControlsHTML()}
                <div class="advanced-marquee-container">
                    <div class="advanced-marquee-track" id="marquee-track">
                        ${this.createContentHTML()}
                    </div>
                    ${this.options.particleEffects ? '<div class="marquee-particles"></div>' : ''}
                </div>
                ${this.createProgressBar()}
            </div>
        `;

        this.injectStyles();
        this.track = container.querySelector('.advanced-marquee-track');
        this.wrapper = container.querySelector('.advanced-marquee-wrapper');
    }

    createControlsHTML() {
        if (!this.options.closeable && !this.options.minimizable) return '';

        return `
            <div class="marquee-controls">
                ${this.options.minimizable ? '<button class="marquee-control minimize-btn" title="Minimize"><span>—</span></button>' : ''}
                <button class="marquee-control play-pause-btn" title="Play/Pause">
                    <span class="play-icon">▶</span>
                    <span class="pause-icon">⏸</span>
                </button>
                <button class="marquee-control speed-btn" title="Speed Control">
                    <span>⚡</span>
                    <div class="speed-menu">
                        <button data-speed="0.5">0.5x</button>
                        <button data-speed="1" class="active">1x</button>
                        <button data-speed="1.5">1.5x</button>
                        <button data-speed="2">2x</button>
                    </div>
                </button>
                ${this.options.closeable ? '<button class="marquee-control close-btn" title="Close">×</button>' : ''}
            </div>
        `;
    }

    createContentHTML() {
        if (!this.currentContent.length) return '';

        const contentHTML = this.currentContent.map(item => {
            const iconHTML = item.icon ? `<span class="marquee-icon">${item.icon}</span>` : '';
            const textHTML = `<span class="marquee-text">${item.text}</span>`;
            const actionHTML = item.action ?
                `<a href="${item.action.url}" class="marquee-action" data-priority="${item.priority}">${item.action.text}</a>` : '';

            return `
                <div class="marquee-item" data-type="${item.type}" data-priority="${item.priority}">
                    ${iconHTML}
                    ${textHTML}
                    ${actionHTML}
                    <span class="marquee-separator">•</span>
                </div>
            `;
        }).join('');

        // Duplicate content for seamless loop
        return contentHTML.repeat(3);
    }

    createProgressBar() {
        return `
            <div class="marquee-progress">
                <div class="marquee-progress-bar"></div>
            </div>
        `;
    }

    injectStyles() {
        const theme = this.themes[this.options.theme] || this.themes.luxury;

        const css = `
            /* Advanced Marquee Styles */
            .advanced-marquee-wrapper {
                position: relative;
                width: 100%;
                height: ${this.options.height === 'auto' ? '40px' : this.options.height};
                background: ${theme.background};
                border-bottom: 1px solid ${theme.borderColor};
                color: ${theme.color};
                font-size: ${theme.fontSize};
                font-weight: ${theme.fontWeight};
                text-shadow: ${theme.textShadow || 'none'};
                backdrop-filter: ${theme.backdropFilter || 'none'};
                overflow: hidden;
                user-select: none;
                transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                ${this.options.glow ? `box-shadow: 0 0 20px ${theme.glowColor};` : ''}
                z-index: 1004;
            }

            .advanced-marquee-wrapper.minimized {
                height: 6px;
            }

            .advanced-marquee-wrapper.minimized .marquee-controls,
            .advanced-marquee-wrapper.minimized .advanced-marquee-container {
                opacity: 0;
                pointer-events: none;
            }

            .advanced-marquee-container {
                position: relative;
                height: 100%;
                display: flex;
                align-items: center;
                overflow: hidden;
            }

            .advanced-marquee-track {
                display: flex;
                align-items: center;
                height: 100%;
                white-space: nowrap;
                will-change: transform;
                transition: opacity 0.3s ease;
            }

            .marquee-item {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                padding: 0 20px;
                height: 100%;
                transition: all 0.3s ease;
                cursor: ${this.options.clickable ? 'pointer' : 'default'};
            }

            .marquee-item:hover {
                ${this.options.clickable ? `
                    background: rgba(255, 255, 255, 0.05);
                    transform: scale(1.02);
                ` : ''}
            }

            .marquee-item[data-priority="high"] {
                font-weight: 700;
                color: ${this.options.theme === 'luxury' ? '#ffd700' : theme.color};
            }

            .marquee-icon {
                font-size: 1.2em;
                animation: iconPulse 2s ease-in-out infinite;
            }

            .marquee-text {
                letter-spacing: 0.3px;
            }

            .marquee-action {
                background: rgba(255, 255, 255, 0.1);
                color: inherit;
                text-decoration: none;
                padding: 4px 12px;
                border-radius: 12px;
                font-size: 0.9em;
                font-weight: 600;
                transition: all 0.3s ease;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .marquee-action:hover {
                background: rgba(255, 255, 255, 0.2);
                transform: translateY(-1px);
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }

            .marquee-separator {
                opacity: 0.3;
                margin: 0 5px;
            }

            .marquee-controls {
                position: absolute;
                top: 2px;
                right: 8px;
                display: flex;
                gap: 4px;
                z-index: 10;
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .advanced-marquee-wrapper:hover .marquee-controls {
                opacity: 1;
            }

            .marquee-control {
                width: 18px;
                height: 18px;
                border: none;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.1);
                color: inherit;
                font-size: 10px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
                backdrop-filter: blur(10px);
                position: relative;
            }

            .marquee-control:hover {
                background: rgba(255, 255, 255, 0.2);
                transform: scale(1.1);
            }

            .play-pause-btn .pause-icon {
                display: none;
            }

            .play-pause-btn.playing .play-icon {
                display: none;
            }

            .play-pause-btn.playing .pause-icon {
                display: block;
            }

            .speed-menu {
                position: absolute;
                top: 100%;
                right: 0;
                background: rgba(0, 0, 0, 0.8);
                border-radius: 8px;
                padding: 8px;
                display: none;
                flex-direction: column;
                gap: 4px;
                min-width: 60px;
                backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .speed-menu button {
                background: none;
                border: none;
                color: white;
                padding: 4px 8px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 11px;
                transition: all 0.2s ease;
            }

            .speed-menu button:hover,
            .speed-menu button.active {
                background: rgba(255, 255, 255, 0.1);
            }

            .speed-btn:hover .speed-menu {
                display: flex;
            }

            .marquee-progress {
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 2px;
                background: rgba(255, 255, 255, 0.1);
                overflow: hidden;
            }

            .marquee-progress-bar {
                height: 100%;
                background: linear-gradient(90deg, transparent, ${theme.color}, transparent);
                width: 20%;
                animation: progressFlow 3s ease-in-out infinite;
            }

            .marquee-particles {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                overflow: hidden;
            }

            .particle {
                position: absolute;
                width: 2px;
                height: 2px;
                background: ${theme.color};
                border-radius: 50%;
                opacity: 0.6;
                animation: particleFloat 4s ease-in-out infinite;
            }

            /* Animations */
            @keyframes iconPulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }

            @keyframes progressFlow {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(500%); }
            }

            @keyframes particleFloat {
                0% {
                    transform: translateY(40px) translateX(0) scale(0);
                    opacity: 0;
                }
                20% {
                    opacity: 0.6;
                    transform: scale(1);
                }
                80% {
                    opacity: 0.6;
                }
                100% {
                    transform: translateY(-10px) translateX(50px) scale(0);
                    opacity: 0;
                }
            }

            @keyframes luxuryShimmer {
                0%, 100% {
                    background-position: -200% 0;
                }
                50% {
                    background-position: 200% 0;
                }
            }

            @keyframes smoothScroll {
                from { transform: translateX(100%); }
                to { transform: translateX(-100%); }
            }

            @keyframes typewriterCursor {
                0%, 50% { opacity: 1; }
                51%, 100% { opacity: 0; }
            }

            /* Reduced Motion */
            @media (prefers-reduced-motion: reduce) {
                .advanced-marquee-track,
                .marquee-icon,
                .marquee-progress-bar,
                .particle {
                    animation: none !important;
                }
            }

            /* Responsive Design */
            @media (max-width: 768px) {
                .advanced-marquee-wrapper {
                    height: 35px;
                    font-size: 12px;
                }

                .marquee-item {
                    padding: 0 15px;
                }

                .marquee-action {
                    padding: 3px 8px;
                    font-size: 0.8em;
                }

                .marquee-controls {
                    opacity: 1;
                }
            }

            @media (max-width: 480px) {
                .advanced-marquee-wrapper {
                    height: 30px;
                    font-size: 11px;
                }

                .marquee-action {
                    display: none;
                }
            }
        `;

        const existingStyle = document.getElementById('advanced-marquee-styles');
        if (existingStyle) {
            existingStyle.textContent = css;
        } else {
            const style = document.createElement('style');
            style.id = 'advanced-marquee-styles';
            style.textContent = css;
            document.head.appendChild(style);
        }
    }

    setupInteractions() {
        if (!this.wrapper) return;

        // Play/Pause control
        const playPauseBtn = this.wrapper.querySelector('.play-pause-btn');
        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', () => {
                this.isAnimating ? this.pause() : this.start();
                playPauseBtn.classList.toggle('playing', this.isAnimating);
            });
        }

        // Speed control
        const speedMenu = this.wrapper.querySelector('.speed-menu');
        if (speedMenu) {
            speedMenu.addEventListener('click', (e) => {
                if (e.target.dataset.speed) {
                    this.setSpeed(parseFloat(e.target.dataset.speed));
                    speedMenu.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
                    e.target.classList.add('active');
                }
            });
        }

        // Close control
        const closeBtn = this.wrapper.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }

        // Minimize control
        const minimizeBtn = this.wrapper.querySelector('.minimize-btn');
        if (minimizeBtn) {
            minimizeBtn.addEventListener('click', () => this.toggleMinimize());
        }

        // Pause on hover
        if (this.options.pauseOnHover) {
            this.wrapper.addEventListener('mouseenter', () => this.pause());
            this.wrapper.addEventListener('mouseleave', () => this.start());
        }

        // Item click handling
        if (this.options.clickable) {
            this.wrapper.addEventListener('click', (e) => {
                const item = e.target.closest('.marquee-item');
                const action = e.target.closest('.marquee-action');

                if (action) {
                    this.trackInteraction('action_click', action.textContent, action.href);
                } else if (item) {
                    this.trackInteraction('item_click', item.dataset.type);
                }
            });
        }
    }

    setupResponsiveHandling() {
        const mediaQuery = window.matchMedia('(max-width: 768px)');

        const handleResponsive = (e) => {
            if (e.matches) {
                this.setSpeed(0.7); // Slower on mobile
                this.options.particleEffects = false;
            } else {
                this.setSpeed(1);
                this.options.particleEffects = true;
            }

            if (this.options.particleEffects) {
                this.createParticles();
            }
        };

        mediaQuery.addListener(handleResponsive);
        handleResponsive(mediaQuery);
    }

    setupAccessibility() {
        if (!this.wrapper) return;

        // Add ARIA attributes
        this.wrapper.setAttribute('role', 'banner');
        this.wrapper.setAttribute('aria-label', 'Announcements and promotions');

        if (this.track) {
            this.track.setAttribute('aria-live', 'polite');
            this.track.setAttribute('aria-atomic', 'false');
        }

        // Respect reduced motion preference
        if (this.options.respectReducedMotion &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.options.speed = 0;
            this.options.particleEffects = false;
            this.options.typewriter = false;
        }
    }

    setupContentRefresh() {
        if (this.options.refreshInterval > 0) {
            this.refreshTimer = setInterval(() => {
                this.refreshContent();
            }, this.options.refreshInterval);
        }
    }

    async refreshContent() {
        await this.loadContent();
        if (this.track) {
            this.track.innerHTML = this.createContentHTML();
        }
        this.trackInteraction('content_refresh');
    }

    // Animation Methods
    smoothScrollAnimation() {
        if (!this.track || !this.isAnimating) return;

        const containerWidth = this.wrapper.offsetWidth;
        const contentWidth = this.track.scrollWidth / 3; // Account for duplicated content
        const duration = (contentWidth / this.options.speed) * 1000;

        this.track.style.animation = `smoothScroll ${duration}ms linear infinite`;
    }

    typewriterAnimation() {
        if (!this.track || !this.isAnimating) return;

        const items = this.track.querySelectorAll('.marquee-item');
        let currentItem = 0;

        const typeItem = () => {
            if (currentItem >= items.length) {
                currentItem = 0;
            }

            const item = items[currentItem];
            const text = item.querySelector('.marquee-text').textContent;
            const textElement = item.querySelector('.marquee-text');

            let charIndex = 0;
            textElement.textContent = '';
            item.style.opacity = '1';

            const typeChar = () => {
                if (charIndex < text.length) {
                    textElement.textContent += text[charIndex];
                    charIndex++;
                    setTimeout(typeChar, 50);
                } else {
                    setTimeout(() => {
                        item.style.opacity = '0';
                        currentItem++;
                        setTimeout(typeItem, 500);
                    }, 2000);
                }
            };

            // Hide other items
            items.forEach((otherItem, index) => {
                if (index !== currentItem) {
                    otherItem.style.opacity = '0';
                }
            });

            typeChar();
        };

        typeItem();
    }

    fadeTransitionAnimation() {
        if (!this.track || !this.isAnimating) return;

        const items = this.track.querySelectorAll('.marquee-item');
        let currentItem = 0;

        const fadeItem = () => {
            if (currentItem >= items.length) {
                currentItem = 0;
            }

            items.forEach((item, index) => {
                item.style.opacity = index === currentItem ? '1' : '0';
                item.style.transform = index === currentItem ? 'translateY(0)' : 'translateY(20px)';
            });

            currentItem++;
            setTimeout(fadeItem, 3000);
        };

        fadeItem();
    }

    slideRevealAnimation() {
        if (!this.track || !this.isAnimating) return;

        this.track.style.animation = 'none';
        this.track.style.transform = `translateX(-${this.options.speed}px)`;

        const slide = () => {
            if (!this.isAnimating) return;

            const currentX = parseFloat(this.track.style.transform.replace('translateX(', '').replace('px)', '')) || 0;
            const newX = currentX - this.options.speed / 10;

            if (Math.abs(newX) >= this.track.scrollWidth / 3) {
                this.track.style.transform = 'translateX(0)';
            } else {
                this.track.style.transform = `translateX(${newX}px)`;
            }

            this.animationFrame = requestAnimationFrame(slide);
        };

        slide();
    }

    elasticBounceAnimation() {
        if (!this.track || !this.isAnimating) return;

        this.track.style.animation = 'elasticBounce 4s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite';
    }

    waveMotionAnimation() {
        if (!this.track || !this.isAnimating) return;

        const items = this.track.querySelectorAll('.marquee-item');

        items.forEach((item, index) => {
            item.style.animation = `waveFloat 2s ease-in-out infinite`;
            item.style.animationDelay = `${index * 0.1}s`;
        });
    }

    particleTrailAnimation() {
        this.smoothScrollAnimation();
        if (this.options.particleEffects) {
            this.createParticles();
        }
    }

    createParticles() {
        const particleContainer = this.wrapper?.querySelector('.marquee-particles');
        if (!particleContainer) return;

        const createParticle = () => {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 2 + 's';
            particleContainer.appendChild(particle);

            setTimeout(() => {
                particle.remove();
            }, 4000);
        };

        const particleInterval = setInterval(() => {
            if (!this.isAnimating) {
                clearInterval(particleInterval);
                return;
            }
            createParticle();
        }, 300);
    }

    // Control Methods
    start() {
        if (this.isAnimating) return;

        this.isAnimating = true;
        const animationMethod = this.animationTypes[this.options.animationType];
        if (animationMethod) {
            animationMethod();
        }

        const playPauseBtn = this.wrapper?.querySelector('.play-pause-btn');
        if (playPauseBtn) {
            playPauseBtn.classList.add('playing');
        }

        this.trackInteraction('marquee_start');
    }

    pause() {
        if (!this.isAnimating) return;

        this.isAnimating = false;

        if (this.track) {
            this.track.style.animationPlayState = 'paused';
        }

        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }

        const playPauseBtn = this.wrapper?.querySelector('.play-pause-btn');
        if (playPauseBtn) {
            playPauseBtn.classList.remove('playing');
        }

        this.trackInteraction('marquee_pause');
    }

    setSpeed(multiplier) {
        this.options.speed *= multiplier;

        if (this.isAnimating) {
            this.pause();
            this.start();
        }

        this.trackInteraction('speed_change', multiplier);
    }

    setTheme(theme) {
        if (this.themes[theme]) {
            this.options.theme = theme;
            this.applyTheme();
            this.trackInteraction('theme_change', theme);
        }
    }

    applyTheme() {
        this.injectStyles();
    }

    toggleMinimize() {
        if (!this.wrapper) return;

        const isMinimized = this.wrapper.classList.contains('minimized');
        
        if (isMinimized) {
            this.wrapper.classList.remove('minimized');
            this.trackInteraction('marquee_expand');
        } else {
            this.wrapper.classList.add('minimized');
            this.trackInteraction('marquee_minimize');
        }
    }

    close() {
        if (!this.wrapper) return;

        this.pause();
        this.wrapper.style.display = 'none';
        this.trackInteraction('marquee_close');

        // Clean up timers
        if (this.refreshTimer) {
            clearInterval(this.refreshTimer);
        }
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
    }

    trackInteraction(action, value = null) {
        // Track user interactions for analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: 'marquee',
                event_label: value,
                value: 1
            });
        }

        // Console log for debugging
        console.log(`Marquee interaction: ${action}`, value);
    }

    destroy() {
        this.pause();
        
        // Clean up timers
        if (this.refreshTimer) {
            clearInterval(this.refreshTimer);
        }
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }

        // Remove DOM elements
        if (this.wrapper) {
            this.wrapper.remove();
        }

        // Remove styles
        const existingStyle = document.getElementById('advanced-marquee-styles');
        if (existingStyle) {
            existingStyle.remove();
        }

        // Clear references
        this.marquees.clear();
        this.observers.clear();
        this.currentContent = [];
        this.track = null;
        this.wrapper = null;
    }
}
