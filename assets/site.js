(() => {
  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
  const c = window.WONDERLAB || {};
  const pages = [
    ['Our Approach', 'our-approach.html', 'approach'],
    ['Science Programmes', 'programmes.html', 'programmes'],
    ['Class Schedules', 'class-schedules.html', 'schedules'],
    ['Our Teacher', 'our-teacher.html', 'teacher']
  ];
  const active = document.body.dataset.page;
  const nav = pages.map(([label, href, key]) => `<a href="${href}"${active === key ? ' aria-current="page"' : ''}>${label}</a>`).join('');
  const header = document.getElementById('site-header');
  if (header) header.innerHTML = `<div class="nav-wrap"><a class="brand" href="index.html" aria-label="Wonderlab home"><img class="brand-logo" src="assets/brand/original/wonderlabLogo.jpeg" alt="Wonderlab — Where Curiosity Meets Clarity" width="1774" height="887"></a><button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-nav"><span></span><span></span><span class="sr-only">Open menu</span></button><nav id="primary-nav" aria-label="Main navigation">${nav}<a class="nav-contact" href="contact.html">Enquire Now <svg class="icon-arrow" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M3 13 13 3M5 3h8v8"/></svg></a></nav></div>`;
  const footer = document.getElementById('site-footer');
  const email = escapeHtml(c.email || '');
  const tagline = escapeHtml(c.tagline || '');
  const brand = escapeHtml(c.brand || 'Wonderlab');
  const address = Array.isArray(c.address) ? c.address.map(escapeHtml).join('<br>') : '';
  const mapUrl = escapeHtml(c.mapUrl || '');
  if (footer) footer.innerHTML = `<div class="footer-main"><div class="footer-brand"><a class="brand brand-light" href="index.html" aria-label="Wonderlab home"><img class="brand-logo" src="assets/brand/original/wonderlabLogo.jpeg" alt="Wonderlab — Where Curiosity Meets Clarity" width="1774" height="887"></a><p>${tagline}</p></div><div class="footer-col"><p class="footer-heading">Explore</p><a href="our-approach.html">Our Approach</a><a href="programmes.html">Science Programmes</a><a href="class-schedules.html">Class Schedules</a><a href="our-teacher.html">Our Teacher</a></div><div class="footer-col"><p class="footer-heading">Get in touch</p><a href="trial-classes.html">Trial Classes</a><a href="contact.html">Contact</a><a href="mailto:${email}">${email}</a></div><div class="footer-address"><p class="footer-heading">Find us</p><address>${address}</address><a href="${mapUrl}" target="_blank" rel="noopener noreferrer">Get directions to Wonderlab</a></div></div><div class="footer-bottom"><span>© 2026 ${brand}. All rights reserved.</span><span>Made for curious minds <b>✳</b></span></div>`;
  const toggle = document.querySelector('.menu-toggle'); const primaryNav = document.getElementById('primary-nav');
  if (toggle && primaryNav) {
    const mobileMenu = window.matchMedia('(max-width: 1000px)');
    const syncMenu = () => { primaryNav.inert = mobileMenu.matches && toggle.getAttribute('aria-expanded') !== 'true'; };
    const setMenuOpen = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      primaryNav.classList.toggle('is-open', open);
      syncMenu();
      const label = toggle.querySelector('.sr-only');
      if (label) label.textContent = open ? 'Close menu' : 'Open menu';
    };
    syncMenu();
    mobileMenu.addEventListener('change', () => { setMenuOpen(false); });
    toggle.addEventListener('click', () => setMenuOpen(toggle.getAttribute('aria-expanded') !== 'true'));
    primaryNav.addEventListener('click', (event) => {
      if (event.target.closest('a')) setMenuOpen(false);
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setMenuOpen(false);
        toggle.focus();
      }
    });
    header.addEventListener('focusout', () => {
      requestAnimationFrame(() => { if (!header.contains(document.activeElement)) setMenuOpen(false); });
    });
    document.addEventListener('click', (event) => {
      if (toggle.getAttribute('aria-expanded') === 'true' && !header.contains(event.target)) setMenuOpen(false);
    });
    window.addEventListener('resize', () => {
      if (!mobileMenu.matches && toggle.getAttribute('aria-expanded') === 'true') setMenuOpen(false);
    });
  }
  const form = document.getElementById('enquiry-form');
  if (form) {
    const status = document.getElementById('form-status');
    const submitButton = form.querySelector('button[type="submit"]');
    const buttonContents = [...submitButton.childNodes].map((node) => node.cloneNode(true));
    let isSubmitting = false;

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (isSubmitting) return;

      const accessKey = form.elements.access_key.value.trim();
      if (!accessKey) {
        status.textContent = 'This enquiry form is not connected yet. Please email admin@wonderlab.sg directly.';
        status.dataset.state = 'error';
        return;
      }

      isSubmitting = true;
      submitButton.disabled = true;
      submitButton.setAttribute('aria-busy', 'true');
      submitButton.textContent = 'Sending…';
      status.textContent = 'Sending your enquiry…';
      status.dataset.state = 'sending';

      try {
        const payload = Object.fromEntries(new FormData(form).entries());
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(payload)
        });
        const result = await response.json();
        if (!response.ok || result.success !== true) {
          throw new Error(result.message || result.body?.message || 'Submission was not accepted.');
        }
        form.reset();
        status.textContent = 'Thank you. Your enquiry has been submitted to Wonderlab.';
        status.dataset.state = 'success';
      } catch (error) {
        status.textContent = 'We couldn’t submit your enquiry. Please try again or email admin@wonderlab.sg.';
        status.dataset.state = 'error';
      } finally {
        isSubmitting = false;
        submitButton.disabled = false;
        submitButton.removeAttribute('aria-busy');
        submitButton.replaceChildren(...buttonContents.map((node) => node.cloneNode(true)));
      }
    });
  }
  const observer = 'IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches ? new IntersectionObserver((entries, obs) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); obs.unobserve(entry.target); } }), { threshold: 0.12 }) : null;
  const revealTargets = document.querySelectorAll('.section, .page-hero, .trial-band, .center-cta, .outcomes-section, .grade-card, .step-card');
  document.querySelectorAll('.grade-card, .step-card').forEach((el, index) => el.style.setProperty('--reveal-index', index % 4));
  revealTargets.forEach((el) => { el.classList.add('reveal'); if (observer) observer.observe(el); else el.classList.add('is-visible'); });
})();
