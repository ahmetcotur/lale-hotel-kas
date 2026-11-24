import { useEffect } from 'react';

export function useHotelMotion(root, page) {
  useEffect(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let canceled = false;
    let media;

    async function enhance() {
      if (motionPreference.matches || media) return;
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')]);
      if (canceled || motionPreference.matches || media) return;
      gsap.registerPlugin(ScrollTrigger);
      media = gsap.matchMedia();
      media.add('(prefers-reduced-motion: no-preference)', () => {
        const element = root.current;
        if (!element) return;
        if (page === 'home') {
          const hero = element.querySelector('.hero');
          const image = hero?.querySelector('.hero-image img');
          const content = hero?.querySelector('.hero-content');
          if (image && content) {
            gsap.timeline({ scrollTrigger: {
              trigger: hero,
              start: 'top top',
              end: 'bottom 25%',
              scrub: .4,
            }, defaults: { ease: 'none' } })
              .fromTo(image, { scale: 1, yPercent: 0 }, { scale: 1.26, yPercent: 12 }, 0)
              .fromTo(content, { y: 0 }, { y: -64 }, 0);
          }

          element.querySelectorAll('.home-story h2, .home-rooms h2, .home-breakfast h2, .home-spaces > h2, .hotel-evening h2, .home-guide .section-heading h2, .location-strip h2').forEach(heading => {
            gsap.fromTo(heading, { y: 20 }, {
              y: 0,
              duration: .75,
              ease: 'power2.out',
              clearProps: 'transform',
              scrollTrigger: { trigger: heading, start: 'top 90%', once: true },
            });
          });

          element.querySelectorAll('.breakfast-photos, .guide-preview').forEach(group => {
            gsap.fromTo(group.querySelectorAll('img'), { clipPath: 'inset(0% 0% 32% 0%)' }, {
              clipPath: 'inset(0% 0% 0% 0%)',
              stagger: .12,
              ease: 'none',
              scrollTrigger: { trigger: group, start: 'top 96%', end: 'top 49%', scrub: .35 },
            });
          });
        }
        const tulip = element.querySelector('.evening-tulip');
        if (tulip) {
          gsap.fromTo(tulip, { y: 48, rotation: -22, opacity: .07 }, {
            y: -54,
            rotation: 3,
            opacity: .18,
            ease: 'none',
            scrollTrigger: {
              trigger: tulip.parentElement,
              start: 'top 94%',
              end: 'bottom 24%',
              scrub: .65,
            },
          });
        }
        element.querySelectorAll('.editorial-photo, .gallery-section h2').forEach(photo => {
          ScrollTrigger.create({
            trigger: photo,
            start: 'top 92%',
            once: true,
            onEnter: () => gsap.fromTo(photo, { y: 12 }, { y: 0, duration: .72, ease: 'power2.out', clearProps: 'transform' }),
          });
        });
        element.querySelectorAll('[data-room-grid]').forEach(grid => {
          ScrollTrigger.create({
            trigger: grid,
            start: 'top 93%',
            once: true,
            onEnter: () => gsap.fromTo(grid.querySelectorAll('[data-room-card]'), { y: 18 }, { y: 0, stagger: 0.075, duration: 0.6, ease: 'power2.out', clearProps: 'transform', overwrite: 'auto' }),
          });
        });
      }, root);
    }

    const initialize = () => { enhance().catch(() => {}); };
    initialize();
    motionPreference.addEventListener('change', initialize);
    return () => {
      canceled = true;
      media?.revert();
      motionPreference.removeEventListener('change', initialize);
    };
  }, [root, page]);
}
