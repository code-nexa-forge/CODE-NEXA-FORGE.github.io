
// CODE NEXA FORGE - INTERACTIONS

document.addEventListener("DOMContentLoaded", () => {

    // Scroll reveal animation
    const revealElements = document.querySelectorAll(
        ".hero-content, .hero-card, .learning-section, .course-card, .cta-section"
    );

    revealElements.forEach(element => {
        element.classList.add("reveal");
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15
    });

    revealElements.forEach(element => {
        observer.observe(element);
    });

    // Interactive course cards
    const cards = document.querySelectorAll(".course-card");

    cards.forEach(card => {
        card.addEventListener("mousemove", (event) => {
            const rect = card.getBoundingClientRect();

            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`);
        });
    });

    console.log("CODE NEXA FORGE interactions loaded!");
});
