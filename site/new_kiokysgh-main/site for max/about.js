document.addEventListener('DOMContentLoaded', () => {
    const aboutElement = document.getElementById('about');
    if (!aboutElement) {
        console.error('Element #about not found!');
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    gsap.to("#about", {  /* Изменено на to: анимация "к" видимому состоянию, чтобы не откатывалось */
        x: 0,
        opacity: 1,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
            trigger: "#about",
            start: "top 80%",
            end: "bottom bottom",  /* Добавлено: триггер заканчивается позже, без отката при скролле вниз */
            toggleActions: "play none none none",  /* Без reverse */
            once: true  /* Только раз, остаётся видимым навсегда */
        }
    });

    ScrollTrigger.refresh();
    console.log('GSAP animation set for #about (fixed for no disappear)');

    // Fallback with IntersectionObserver if GSAP doesn't trigger
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                gsap.to("#about", { x: 0, opacity: 1, duration: 1, ease: "power2.out" });
                observer.disconnect();
                console.log('Fallback triggered');
            }
        });
    }, { threshold: 0.1 });

    observer.observe(aboutElement);
});