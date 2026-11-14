
/* CODE NEXA FORGE — PREMIUM LESSON MOTION SYSTEM */

(() => {
    const start = () => {
        document.documentElement.classList.add('cnf-page-ready');

        const candidates = document.querySelectorAll(
            'main > *, .hero > *, .content > *, .lesson-content > *, section, article, .lesson-section, .content-card'
        );

        const targets = [...candidates].filter((el) =>
            !el.closest('nav, header nav, footer') &&
            !el.matches('script, style') &&
            el.getBoundingClientRect().height > 0
        );

        if (
            !('IntersectionObserver' in window) ||
            window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ) return;

        targets.forEach((el, index) => {
            el.classList.add('motion-reveal');

            // Alternate entrance directions
            if (index % 3 === 1) {
                el.dataset.motion = 'left';
            } else if (index % 3 === 2) {
                el.dataset.motion = 'right';
            }

            // Slight stagger between sections
            el.style.transitionDelay = `${(index % 4) * 90}ms`;
        });

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('motion-visible');
                    obs.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.08,
            rootMargin: '0px 0px -35px 0px'
        });

        targets.forEach((el) => observer.observe(el));
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start, { once: true });
    } else {
        start();
    }
})();
