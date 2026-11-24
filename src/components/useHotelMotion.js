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
            gsap.timeline({
              scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom 25%', scrub: .4 },
              defaults: { ease: 'none' },
            })
              .fromTo(image, { scale: 1, yPercent: 0 }, { scale: 1.26, yPercent: 12 }, 0)
              .fromTo(content, { y: 0 }, { y: -64 }, 0);
          }

          // Hero'nun tam tersi: otel dış cephe görseli yakın kadrajdan geriye açılır ve yukarı akar
          const hotelSection = element.querySelector('.home-hotel');
          const hotelPhoto = hotelSection?.querySelector('.hotel-exterior img');
          const hotelStory = hotelSection?.querySelector('.home-story > div:first-child');
          if (hotelSection && hotelPhoto) {
            const tl = gsap.timeline({
              scrollTrigger: { trigger: hotelSection, start: 'top 92%', end: 'bottom 22%', scrub: .45 },
              defaults: { ease: 'none' },
            });
            tl.fromTo(hotelPhoto, { scale: 1.24, yPercent: 10 }, { scale: 1, yPercent: -10 }, 0);
            if (hotelStory) tl.fromTo(hotelStory, { y: 26 }, { y: -18 }, 0);
          }

          // Yakın mesafe listesi kademeli giriş
          const nearbyItems = element.querySelectorAll('.home-nearby li');
          if (nearbyItems.length) {
            gsap.fromTo(nearbyItems, { y: 20 }, {
              y: 0, stagger: .08, duration: .65, ease: 'power2.out', clearProps: 'transform',
              scrollTrigger: { trigger: '.home-nearby', start: 'top 90%', once: true },
            });
          }

          // Başlıklar
          element.querySelectorAll('.home-story h2, .home-rooms h2, .home-breakfast h2, .home-spaces > h2, .hotel-evening h2, .home-guide .section-heading h2, .location-strip h2').forEach(heading => {
            gsap.fromTo(heading, { y: 22 }, {
              y: 0, duration: .75, ease: 'power2.out', clearProps: 'transform',
              scrollTrigger: { trigger: heading, start: 'top 90%', once: true },
            });
          });

          // Odalar şeridi kartları stagger giriş
          const railCards = element.querySelectorAll('.room-rail .room-card');
          if (railCards.length) {
            gsap.fromTo(railCards, { y: 24 }, {
              y: 0, stagger: .09, duration: .7, ease: 'power2.out', clearProps: 'transform',
              scrollTrigger: { trigger: '.room-rail', start: 'top 90%', once: true },
            });
          }

          // Kahvaltı metni & görseller zıt yönlü akış + clip reveal
          const breakfastCopy = element.querySelector('.home-breakfast .breakfast-copy');
          if (breakfastCopy) {
            gsap.fromTo(breakfastCopy, { y: 28 }, {
              y: -16, ease: 'none',
              scrollTrigger: { trigger: '.home-breakfast', start: 'top 90%', end: 'bottom 25%', scrub: .45 },
            });
          }

          element.querySelectorAll('.breakfast-photos, .guide-preview').forEach(group => {
            gsap.fromTo(group.querySelectorAll('img'), { clipPath: 'inset(0% 0% 32% 0%)', scale: 1.08 }, {
              clipPath: 'inset(0% 0% 0% 0%)', scale: 1, stagger: .12, ease: 'none',
              scrollTrigger: { trigger: group, start: 'top 95%', end: 'top 46%', scrub: .35 },
            });
          });

          // Bahçe, teras ve manzara üçlü fotoğraflar kademeli yükseliş + iç parallax
          const spaceFigures = element.querySelectorAll('.home-hotel-photos .photo-figure');
          if (spaceFigures.length) {
            gsap.fromTo(spaceFigures, { y: 26 }, {
              y: 0, stagger: .12, duration: .75, ease: 'power2.out', clearProps: 'transform',
              scrollTrigger: { trigger: '.home-hotel-photos', start: 'top 90%', once: true },
            });
            spaceFigures.forEach((fig, idx) => {
              const img = fig.querySelector('img');
              if (img) {
                gsap.fromTo(img, { scale: 1.12, yPercent: idx % 2 === 0 ? 6 : -6 }, {
                  scale: 1, yPercent: idx % 2 === 0 ? -6 : 6, ease: 'none',
                  scrollTrigger: { trigger: fig, start: 'top 95%', end: 'bottom 20%', scrub: .5 },
                });
              }
            });
          }

          // Kaş akşamları: akşam cephe görseli ters zoom + metin akışı
          const eveningSection = element.querySelector('.hotel-evening');
          const eveningImg = eveningSection?.querySelector('.hotel-exterior img');
          const eveningText = eveningSection?.querySelector('div');
          if (eveningSection && eveningImg) {
            const evTl = gsap.timeline({
              scrollTrigger: { trigger: eveningSection, start: 'top 92%', end: 'bottom 25%', scrub: .45 },
              defaults: { ease: 'none' },
            });
            evTl.fromTo(eveningImg, { scale: 1.16, yPercent: 8 }, { scale: 1, yPercent: -8 }, 0);
            if (eveningText) evTl.fromTo(eveningText, { y: 20 }, { y: -14 }, 0);
          }

          // İletişim şeridi
          const locationStrip = element.querySelector('.location-strip');
          if (locationStrip) {
            gsap.fromTo(locationStrip, { y: 20 }, {
              y: 0, duration: .7, ease: 'power2.out', clearProps: 'transform',
              scrollTrigger: { trigger: locationStrip, start: 'top 92%', once: true },
            });
          }
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
