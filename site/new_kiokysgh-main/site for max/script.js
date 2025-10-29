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

    const carousels = document.querySelectorAll('[data-carousel]');

    const initCarousel = carousel => {
        const track = carousel.querySelector('[data-carousel-track]');
        const prevButton = carousel.querySelector('[data-carousel-prev]');
        const nextButton = carousel.querySelector('[data-carousel-next]');
        const dotsContainer = carousel.querySelector('[data-carousel-dots]');

        if (!track) return;

        const slides = Array.from(track.children);
        if (!slides.length) return;

        let slidePositions = [];
        let currentIndex = 0;
        const dots = [];
        let scrollAnimationFrame = null;

        const clampIndex = index => Math.max(0, Math.min(index, slides.length - 1));

        const updatePositions = () => {
            slidePositions = slides.map(slide => Math.round(slide.offsetLeft));
            updateActiveSlide();
        };

        const setActiveSlide = index => {
            currentIndex = clampIndex(index);
            if (prevButton) prevButton.disabled = currentIndex === 0;
            if (nextButton) nextButton.disabled = currentIndex === slides.length - 1;
            dots.forEach((dot, dotIndex) => {
                dot.setAttribute('aria-current', dotIndex === currentIndex ? 'true' : 'false');
            });
        };

        const moveToSlide = index => {
            const targetIndex = clampIndex(index);
            const target = slidePositions[targetIndex] ?? 0;
            track.scrollTo({ left: target, behavior: 'smooth' });
            setActiveSlide(targetIndex);
        };

        if (dotsContainer) {
            dotsContainer.innerHTML = '';
            slides.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.type = 'button';
                dot.className = 'carousel__dot';
                dot.setAttribute('aria-label', `Показать слайд ${index + 1}`);
                dot.addEventListener('click', () => moveToSlide(index));
                dotsContainer.appendChild(dot);
                dots.push(dot);
            });
        }

        const updateActiveSlide = () => {
            const scrollLeft = track.scrollLeft;
            let nearestIndex = 0;
            let smallestDistance = Math.abs(scrollLeft - (slidePositions[0] ?? 0));

            slidePositions.forEach((position, index) => {
                const distance = Math.abs(scrollLeft - position);
                if (distance < smallestDistance - 1) {
                    smallestDistance = distance;
                    nearestIndex = index;
                }
            });

            setActiveSlide(nearestIndex);
        };

        track.addEventListener('scroll', () => {
            if (scrollAnimationFrame) cancelAnimationFrame(scrollAnimationFrame);
            scrollAnimationFrame = requestAnimationFrame(updateActiveSlide);
        }, { passive: true });

        if (prevButton) {
            prevButton.addEventListener('click', () => moveToSlide(currentIndex - 1));
        }

        if (nextButton) {
            nextButton.addEventListener('click', () => moveToSlide(currentIndex + 1));
        }

        const handleResize = () => {
            requestAnimationFrame(updatePositions);
        };

        if (typeof ResizeObserver !== 'undefined') {
            const observer = new ResizeObserver(handleResize);
            observer.observe(track);
        } else {
            window.addEventListener('resize', handleResize, { passive: true });
        }

        updatePositions();
        setActiveSlide(0);
    };

    carousels.forEach(initCarousel);

    const socialFab = document.querySelector('[data-social-fab]');
    if (socialFab) {
        const fabToggle = socialFab.querySelector('.social-fab__toggle');
        const fabList = socialFab.querySelector('.social-fab__list');

        const closeFab = () => {
            socialFab.classList.remove('social-fab--open');
            if (fabToggle) {
                fabToggle.setAttribute('aria-expanded', 'false');
            }
        };

        if (fabToggle && fabList) {
            fabToggle.addEventListener('click', event => {
                event.stopPropagation();
                const isOpen = socialFab.classList.toggle('social-fab--open');
                fabToggle.setAttribute('aria-expanded', String(isOpen));
            });

            fabList.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', closeFab);
            });

            document.addEventListener('click', event => {
                if (!socialFab.classList.contains('social-fab--open')) return;
                if (!socialFab.contains(event.target)) {
                    closeFab();
                }
            });

            document.addEventListener('keydown', event => {
                if (event.key === 'Escape') {
                    closeFab();
                }
            });
        }
    }

    const accordionLists = document.querySelectorAll('[data-accordion]');
    accordionLists.forEach(list => {
        const items = list.querySelectorAll('.faq-item');
        items.forEach(item => {
            const trigger = item.querySelector('.faq-item__question');
            const answer = item.querySelector('.faq-item__answer');
            if (!trigger || !answer) return;

            trigger.addEventListener('click', () => {
                const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
                trigger.setAttribute('aria-expanded', String(!isExpanded));
                answer.hidden = isExpanded;
            });

            trigger.addEventListener('keydown', event => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    trigger.click();
                }
            });
        });
    });

    const modalElements = document.querySelectorAll('[data-modal]');
    if (modalElements.length) {
        const modalRegistry = new Map();
        modalElements.forEach(modal => {
            modalRegistry.set(modal.dataset.modal, modal);
            modal.setAttribute('aria-hidden', 'true');
        });

        const openButtons = document.querySelectorAll('[data-modal-open]');
        let activeModal = null;
        let lastFocusedElement = null;

        const focusableSelectors = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

        const trapFocus = event => {
            if (event.key !== 'Tab' || !activeModal) return;
            const focusable = Array.from(activeModal.querySelectorAll(focusableSelectors)).filter(element => !element.hasAttribute('hidden'));
            if (!focusable.length) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };

        const closeModal = () => {
            if (!activeModal) return;
            activeModal.classList.remove('modal--open');
            activeModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            const targetToFocus = lastFocusedElement;
            activeModal = null;
            lastFocusedElement = null;
            if (targetToFocus instanceof HTMLElement) {
                targetToFocus.focus();
            }
            document.removeEventListener('keydown', trapFocus, true);
        };

        const openModal = modalId => {
            const modal = modalRegistry.get(modalId);
            if (!modal || activeModal === modal) return;
            lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
            modal.classList.add('modal--open');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            activeModal = modal;
            const focusTarget = modal.querySelector('[data-modal-initial-focus]') || modal.querySelector(focusableSelectors);
            if (focusTarget instanceof HTMLElement) {
                focusTarget.focus();
            }
            document.addEventListener('keydown', trapFocus, true);
        };

        openButtons.forEach(button => {
            const modalId = button.getAttribute('data-modal-open');
            button.addEventListener('click', () => openModal(modalId));
        });

        modalRegistry.forEach(modal => {
            modal.querySelectorAll('[data-modal-close]').forEach(control => {
                control.addEventListener('click', closeModal);
            });

            const overlay = modal.querySelector('.modal__overlay');
            if (overlay) {
                overlay.addEventListener('click', closeModal);
            }
        });

        document.addEventListener('keydown', event => {
            if (event.key === 'Escape') {
                closeModal();
            }
        });
    }
});
