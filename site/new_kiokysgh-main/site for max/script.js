document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.site-header');
    const toggle = document.querySelector('.site-nav__toggle');
    const menu = document.querySelector('.site-nav__list');
    const ctaButtons = document.querySelectorAll('a[href^="#"]');

    const closeMenu = () => {
        if (!toggle || !menu) return;
        toggle.setAttribute('aria-expanded', 'false');
        menu.classList.remove('is-open');
        document.body.style.overflow = '';
    };

    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
            toggle.setAttribute('aria-expanded', String(!isExpanded));
            menu.classList.toggle('is-open');
            document.body.style.overflow = !isExpanded ? 'hidden' : '';
        });

        menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }

    ctaButtons.forEach(link => {
        link.addEventListener('click', event => {
            const targetId = link.getAttribute('href');
            if (!targetId || targetId === '#') return;
            const target = document.querySelector(targetId);
            if (!target) return;

            event.preventDefault();
            closeMenu();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    const updateHeaderState = () => {
        if (!header) return;
        if (window.scrollY > 32) {
            header.style.background = 'rgba(8, 12, 19, 0.92)';
            header.style.padding = '0';
        } else {
            header.style.background = 'rgba(8, 12, 19, 0.78)';
            header.style.padding = '';
        }
    };

    window.addEventListener('scroll', updateHeaderState, { passive: true });
    updateHeaderState();
});
