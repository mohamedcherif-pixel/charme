// Marquee functionality for top announcement bar
document.addEventListener('DOMContentLoaded', function() {
    const topMarquee = document.getElementById('topMarquee');
    const closeBtn = document.getElementById('closeTopMarquee');
    const marqueeTracks = document.querySelectorAll('.marquee-track');
    
    // Check if user previously closed the marquee
    if (localStorage.getItem('marqueeClosed') === 'true') {
        topMarquee.style.display = 'none';
    }
    
    // Close button functionality
    closeBtn.addEventListener('click', function() {
        topMarquee.style.display = 'none';
        localStorage.setItem('marqueeClosed', 'true');
    });
    
    // Set animation speed for each track
    marqueeTracks.forEach(track => {
        const speed = track.getAttribute('data-speed');
        const baseDuration = 45; // base duration in seconds
        track.style.animationDuration = `${baseDuration / speed}s`;
        
        // Pause on hover
        track.addEventListener('mouseenter', () => {
            track.style.animationPlayState = 'paused';
        });
        
        track.addEventListener('mouseleave', () => {
            track.style.animationPlayState = 'running';
        });
    });
    
    // Responsive behavior - stack tracks on mobile
    function handleResponsive() {
        if (window.innerWidth < 768) {
            marqueeTracks.forEach(track => {
                track.style.whiteSpace = 'normal';
                track.style.flexDirection = 'column';
            });
        } else {
            marqueeTracks.forEach(track => {
                track.style.whiteSpace = 'nowrap';
                track.style.flexDirection = 'row';
            });
        }
    }
    
    // Initial call and window resize listener
    handleResponsive();
    window.addEventListener('resize', handleResponsive);
});