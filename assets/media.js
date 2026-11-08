(() => {
  const carousel = document.querySelector('[data-carousel]');
  const dialog = document.getElementById('media-lightbox');
  const lightboxImage = dialog?.querySelector('.lightbox-image');
  const lightboxCaption = dialog?.querySelector('.lightbox-caption p');
  const lightboxTitle = dialog?.querySelector('#lightbox-title');
  const closeButton = dialog?.querySelector('.lightbox-close');
  let returnFocusTo = null;

  const updateLightbox = (button) => {
    if (!lightboxImage || !button) return;
    lightboxImage.src = button.dataset.src;
    lightboxImage.alt = button.dataset.alt || '';
    if (lightboxTitle) lightboxTitle.textContent = button.dataset.title || button.closest('figure')?.querySelector('figcaption strong')?.textContent || 'Image preview';
    if (lightboxCaption) lightboxCaption.textContent = button.dataset.caption || '';
  };

  const openLightbox = (button) => {
    if (!dialog || !lightboxImage || !button) return;
    returnFocusTo = button;
    updateLightbox(button);
    if (!dialog.open) dialog.showModal();
    closeButton?.focus();
  };

  document.querySelectorAll('.media-open').forEach((button) => {
    button.addEventListener('click', () => openLightbox(button));
  });

  if (dialog) {
    closeButton?.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });
    dialog.addEventListener('close', () => {
      returnFocusTo?.focus();
      returnFocusTo = null;
    });
  }

  if (!carousel) return;
  const track = carousel.querySelector('.carousel-track');
  const slides = [...carousel.querySelectorAll('.carousel-slide')];
  const prev = carousel.querySelector('[data-carousel-prev]');
  const next = carousel.querySelector('[data-carousel-next]');
  const dotsWrap = carousel.querySelector('.carousel-dots');
  const status = carousel.querySelector('.carousel-status');
  let current = 0;
  let pointerStartX = null;
  let suppressClick = false;

  if (!track || !slides.length || !dotsWrap) return;

  const dots = slides.map((slide, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'carousel-dot';
    dot.setAttribute('aria-label', `Show image ${index + 1} of ${slides.length}`);
    dot.addEventListener('click', () => showSlide(index));
    dotsWrap.append(dot);
    return dot;
  });

  const showSlide = (index) => {
    current = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    slides.forEach((slide, slideIndex) => {
      const active = slideIndex === current;
      slide.setAttribute('aria-hidden', String(!active));
      slide.inert = !active;
    });
    dots.forEach((dot, dotIndex) => {
      if (dotIndex === current) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
    const title = slides[current].querySelector('figcaption strong')?.textContent || `Image ${current + 1}`;
    if (status) status.textContent = `Image ${current + 1} of ${slides.length}: ${title}`;
  };

  prev?.addEventListener('click', () => showSlide(current - 1));
  next?.addEventListener('click', () => showSlide(current + 1));
  carousel.addEventListener('keydown', (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'ArrowLeft') { event.preventDefault(); showSlide(current - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); showSlide(current + 1); }
  });
  carousel.addEventListener('pointerdown', (event) => {
    if (event.target.closest('.carousel-arrow, .carousel-dot')) return;
    pointerStartX = event.clientX;
  }, { passive:true });
  carousel.addEventListener('pointerup', (event) => {
    if (pointerStartX === null) return;
    const delta = event.clientX - pointerStartX;
    pointerStartX = null;
    if (delta > 48 || delta < -48) {
      suppressClick = true;
      showSlide(current + (delta < 0 ? 1 : -1));
    }
  }, { passive:true });
  carousel.addEventListener('pointercancel', () => { pointerStartX = null; });
  carousel.addEventListener('click', (event) => {
    if (!suppressClick) return;
    event.preventDefault();
    event.stopPropagation();
    suppressClick = false;
  }, true);

  if (dialog) {
    dialog.addEventListener('keydown', (event) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      const change = event.key === 'ArrowRight' ? 1 : -1;
      const images = [...slides].map((slide) => slide.querySelector('.media-open'));
      const activeIndex = images.findIndex((button) => button?.dataset.src === lightboxImage?.getAttribute('src'));
      if (activeIndex < 0) return;
      event.preventDefault();
      updateLightbox(images[(activeIndex + change + images.length) % images.length]);
    });
  }

  showSlide(0);
})();
