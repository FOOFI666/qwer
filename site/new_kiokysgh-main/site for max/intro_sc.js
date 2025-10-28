gsap.registerPlugin(ScrollTrigger);

gsap.to('.intro', {
    backgroundPosition: '50% 100%',  // Сдвиг вниз на 100% (регулируй для эффекта)
    ease: 'none',
    scrollTrigger: {
        trigger: '.intro',
        start: 'top top',
        end: 'bottom top',
        scrub: true  // Плавный скролл
    }
});