(() => {
  const logoAssetOverrides = {
    PSA: '/media/project-logos/psa.svg?v=20260629',
    Skyscanner: '/media/project-logos/skyscanner.svg?v=20260629',
    'Xe Auto': '/media/project-logos/xe-auto.svg?v=20260629'
  };

  const movedKnowledgePostSlugs = [
    'viet-bai-chuan-seo-tu-co-ban',
    'lam-nghe-content-tu-con-so-0'
  ];

  const isMovedKnowledgeUrl = (value = '') => {
    return movedKnowledgePostSlugs.some((slug) => value.includes(`/posts/${slug}`) || value.includes(slug));
  };

  const setupProjectLogoControls = () => {
    const section = document.querySelector('.project-logos');
    const marquee = section?.querySelector('.logo-marquee');
    const track = section?.querySelector('.logo-marquee-track');
    if (!section || !marquee || !track || section.dataset.logoControlsReady === 'true') return;

    section.dataset.logoControlsReady = 'true';

    if (!track.querySelector('img[alt="Xe Auto"]')) {
      const card = document.createElement('div');
      card.className = 'project-logo-card';
      card.innerHTML = `<img src="${logoAssetOverrides['Xe Auto']}" alt="Xe Auto" loading="lazy" decoding="async" />`;
      track.appendChild(card);
    }

    track.querySelectorAll('img').forEach((image) => {
      image.decoding = 'async';
      image.loading = 'lazy';
      if (logoAssetOverrides[image.alt]) image.src = logoAssetOverrides[image.alt];
    });

    const firstSet = Array.from(track.children).slice(0, 12).map((card) => card.cloneNode(true));
    if (firstSet.length) track.replaceChildren(...firstSet);

    track.style.animation = 'none';
    track.style.animationPlayState = 'paused';
    track.style.transform = 'none';
    track.style.width = 'auto';

    const frame = document.createElement('div');
    frame.className = 'project-logo-slider';
    marquee.parentNode.insertBefore(frame, marquee);
    frame.appendChild(marquee);

    const previousButton = document.createElement('button');
    previousButton.className = 'project-logo-arrow project-logo-arrow--previous';
    previousButton.type = 'button';
    previousButton.setAttribute('aria-label', 'Xem logo trước');
    previousButton.textContent = '‹';

    const nextButton = document.createElement('button');
    nextButton.className = 'project-logo-arrow project-logo-arrow--next';
    nextButton.type = 'button';
    nextButton.setAttribute('aria-label', 'Xem logo tiếp theo');
    nextButton.textContent = '›';

    frame.append(previousButton, nextButton);

    const syncCardSize = () => {
      const isMobile = window.matchMedia('(max-width: 640px)').matches;
      const visibleCards = isMobile ? 3 : 8;
      const gap = isMobile ? 8 : 12;
      const calculatedSize = (marquee.clientWidth - gap * (visibleCards - 1)) / visibleCards;
      const size = Math.min(92, Math.max(72, calculatedSize));
      frame.style.setProperty('--project-logo-gap', `${gap}px`);
      frame.style.setProperty('--project-logo-size', `${size}px`);
    };

    syncCardSize();
    window.addEventListener('resize', syncCardSize);

    const scrollLogos = (direction) => {
      const firstCard = track.querySelector('.project-logo-card');
      const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : 92;
      const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 12;
      const visibleCards = window.matchMedia('(max-width: 640px)').matches ? 3 : 8;
      marquee.scrollBy({ left: direction * (cardWidth + gap) * visibleCards, behavior: 'smooth' });
    };

    previousButton.addEventListener('click', () => scrollLogos(-1));
    nextButton.addEventListener('click', () => scrollLogos(1));
  };

  const normalizeBlogCategories = () => {
    const markKnowledge = (item) => {
      item.textContent = 'Kiến thức - Kỹ năng';
      if (item instanceof HTMLAnchorElement) item.setAttribute('href', '/tag/kien-thuc-ky-nang');
    };

    const normalizeLink = (link) => {
      const href = link.getAttribute('href') || '';
      const label = link.textContent?.trim();

      if (href.endsWith('/tag/blog') || href === '/tag/blog' || label === 'Blog') {
        markKnowledge(link);
        return;
      }

      if (href.includes('/tag/tai-lieu') || label === 'Tài liệu' || label === 'TÃ i liá»‡u') {
        link.textContent = 'Kho tài liệu';
        link.setAttribute('href', '/tag/kho-tai-lieu');
      }
    };

    document.querySelectorAll('a[href*="/tag/"], .pillar-list a, .filter-tabs a, .widget-tags a').forEach((item) => {
      if (item instanceof HTMLAnchorElement) normalizeLink(item);
    });

    document.querySelectorAll('.home-post-tag, .post-tag, .more-tag').forEach((item) => {
      const label = item.textContent?.trim();
      if (label === 'Blog') item.textContent = 'Kiến thức - Kỹ năng';
      if (label === 'Tài liệu' || label === 'TÃ i liá»‡u') item.textContent = 'Kho tài liệu';
    });

    document.querySelectorAll('a[href*="/posts/"]').forEach((link) => {
      if (!(link instanceof HTMLAnchorElement) || !isMovedKnowledgeUrl(link.getAttribute('href') || '')) return;
      link.querySelectorAll('.home-post-tag, .post-tag, .more-tag').forEach(markKnowledge);
    });

    if (isMovedKnowledgeUrl(window.location.pathname)) {
      document.querySelectorAll('a[href*="/tag/tai-lieu"], .home-post-tag, .post-tag, .more-tag, .post-meta a[href*="/tag/"], .article-meta a[href*="/tag/"]').forEach(markKnowledge);
    }

    if (window.location.pathname === '/tag/kho-tai-lieu') {
      document.querySelectorAll('a[href*="/posts/"]').forEach((link) => {
        if (!(link instanceof HTMLAnchorElement) || !isMovedKnowledgeUrl(link.getAttribute('href') || '')) return;
        const card = link.closest('article, .post-row, .post-card, .home-post-card, .more-card');
        if (card) card.remove();
      });
    }
  };

  const style = document.createElement('style');
  style.textContent = `
    .project-logos { width: 100% !important; }
    .project-logos-inner { width: 100% !important; max-width: none !important; gap: 0.75rem !important; padding: 0 !important; border: 0 !important; background: transparent !important; }
    .project-logos-header { padding: 0 0.15rem !important; }
    .project-logos-header .eyebrow { color: var(--color-accent) !important; font-family: "Roboto Condensed", sans-serif !important; font-size: clamp(1rem, 1.45vw, 1.15rem) !important; font-weight: 700 !important; letter-spacing: 0.08em !important; text-transform: uppercase !important; }
    .project-logo-slider { --project-logo-gap: 12px; --project-logo-size: 92px; position: relative; display: grid; align-items: center; width: 100% !important; max-width: none !important; padding: 0.65rem 2.65rem; border: 1px solid var(--color-border); border-radius: var(--radius-lg); background: var(--color-bg); }
    .project-logo-slider .logo-marquee { width: 100% !important; overflow-x: auto !important; overflow-y: hidden !important; padding: 0 !important; mask-image: none !important; -webkit-mask-image: none !important; scroll-behavior: smooth; scroll-snap-type: x mandatory; scrollbar-width: none; }
    .project-logo-slider .logo-marquee::-webkit-scrollbar { display: none; }
    .project-logo-slider .logo-marquee-track { display: flex !important; width: max-content !important; gap: var(--project-logo-gap) !important; animation: none !important; transform: none !important; }
    .project-logo-slider .project-logo-card { flex: 0 0 var(--project-logo-size) !important; width: var(--project-logo-size) !important; height: var(--project-logo-size) !important; min-height: 0 !important; padding: 0 !important; overflow: hidden !important; scroll-snap-align: start; border-radius: 0.5rem !important; border: 1px solid var(--color-border) !important; background: var(--color-surface) !important; }
    .project-logo-slider .project-logo-card img { display: block; width: 100% !important; height: 100% !important; max-width: none !important; max-height: none !important; object-fit: cover !important; object-position: center !important; image-rendering: auto; transform: none !important; }
    .project-logo-arrow { position: absolute; top: 50%; z-index: 2; display: grid; place-items: center; width: 2rem; height: 2rem; border: 1px solid var(--color-border); border-radius: 999px; background: var(--color-bg); color: var(--color-accent); font-size: 1.45rem; line-height: 1; cursor: pointer; transform: translateY(-50%); transition: border-color 160ms ease, background-color 160ms ease, color 160ms ease; }
    .project-logo-arrow:hover, .project-logo-arrow:focus-visible { border-color: var(--color-accent); background: var(--color-accent); color: #fff; outline: none; }
    .project-logo-arrow--previous { left: 0.45rem; }
    .project-logo-arrow--next { right: 0.45rem; }
    @media (max-width: 640px) { .project-logo-slider { padding: 0.55rem 2.2rem; } .project-logo-arrow { width: 1.85rem; height: 1.85rem; font-size: 1.3rem; } .project-logo-arrow--previous { left: 0.3rem; } .project-logo-arrow--next { right: 0.3rem; } }
  `;
  document.head.appendChild(style);

  const runEnhancements = () => {
    setupProjectLogoControls();
    normalizeBlogCategories();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runEnhancements, { once: true });
  } else {
    runEnhancements();
  }
})();