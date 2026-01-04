// Smooth Scrolling Implementation
document.addEventListener('DOMContentLoaded', function() {
    // Options for smooth scrolling
    const smoothScrollOptions = {
        multiplier: 0.2,      // Slightly reduced for more control
        acceleration: 0.97,   // Increased for more sliding momentum
        frameRate: 1000/60,   // 60 FPS for smooth animation
        touchMultiplier: 0.2, // Matched to mouse speed
        friction: 0.88,       // Added friction for smoother deceleration
        momentum: true        // Enable momentum scrolling
    };

    let scrolling = false;
    let lastScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    let scrollVelocity = 0;
    let lastTime = performance.now();

    // Handle mouse wheel events
    window.addEventListener('wheel', function(e) {
        e.preventDefault();

        const delta = e.deltaY;
        const currentTime = performance.now();
        const elapsed = currentTime - lastTime;

        // Calculate new velocity with smooth acceleration
        scrollVelocity = (scrollVelocity * smoothScrollOptions.acceleration) + 
                        (delta * smoothScrollOptions.multiplier);

        if (!scrolling) {
            scrolling = true;
            updateScroll();
        }

        lastTime = currentTime;
    }, { passive: false });

    // Handle touch events for mobile
    let touchStartY = 0;
    let lastTouchY = 0;
    
    window.addEventListener('touchstart', function(e) {
        touchStartY = e.touches[0].clientY;
        lastTouchY = touchStartY;
        scrollVelocity = 0;
    }, { passive: false });

    window.addEventListener('touchmove', function(e) {
        e.preventDefault();
        
        const currentY = e.touches[0].clientY;
        const deltaY = lastTouchY - currentY;
        
        scrollVelocity = (scrollVelocity * smoothScrollOptions.acceleration) + 
                        (deltaY * smoothScrollOptions.touchMultiplier);
        
        if (!scrolling) {
            scrolling = true;
            updateScroll();
        }
        
        lastTouchY = currentY;
    }, { passive: false });

    // Enhanced smooth scroll animation with momentum
    function updateScroll() {
        if (Math.abs(scrollVelocity) > 0.05) {  // Reduced threshold for longer slides
            // Calculate smooth easing
            const ease = smoothScrollOptions.momentum ? 
                        Math.pow(smoothScrollOptions.friction, 2) : 
                        smoothScrollOptions.acceleration;
            
            // Apply smooth interpolation
            const delta = scrollVelocity * (1 - Math.pow(ease, 2));
            
            // Update scroll position with interpolated velocity
            window.scrollTo({
                top: window.pageYOffset + delta,
                behavior: 'auto'  // We're handling the smoothing ourselves
            });
            
            // Apply graduated deceleration
            if (Math.abs(scrollVelocity) > 1) {
                scrollVelocity *= smoothScrollOptions.friction;
            } else {
                scrollVelocity *= smoothScrollOptions.acceleration;
            }
            
            // Request next frame
            requestAnimationFrame(updateScroll);
        } else {
            scrolling = false;
            scrollVelocity = 0;
        }
    }
});
