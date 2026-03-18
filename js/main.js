/* ============================================================
   MyBalloons — Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Sticky Nav ----
  const nav = document.querySelector('.site-nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ---- Mobile Menu ----
  const toggle = document.querySelector('.nav-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
      const open = toggle.classList.toggle('open');
      mobileMenu.classList.toggle('open', open);
      mobileMenu.setAttribute('aria-hidden', !open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        toggle.classList.remove('open');
        mobileMenu.classList.remove('open');
        mobileMenu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      });
    });
  }

  // ---- Scroll Reveal ----
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
    revealEls.forEach(el => observer.observe(el));
  }

  // ---- FAQ Accordion ----
  // Supports both .faq-question/.faq-answer (faq.html) and .faq-trigger/.faq-body (collection/seasonal pages)
  const initAccordion = (triggerSel, bodySel, openClass) => {
    document.querySelectorAll(triggerSel).forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const wasOpen = item.classList.contains(openClass);
        // Close all
        document.querySelectorAll('.faq-item.' + openClass).forEach(i => {
          i.classList.remove(openClass);
          i.querySelector(triggerSel)?.setAttribute('aria-expanded', 'false');
          const body = i.querySelector(bodySel);
          if (body) body.style.maxHeight = null;
        });
        // Open clicked if it was closed
        if (!wasOpen) {
          item.classList.add(openClass);
          btn.setAttribute('aria-expanded', 'true');
          const body = item.querySelector(bodySel);
          if (body) body.style.maxHeight = body.scrollHeight + 'px';
        }
      });
    });
  };

  initAccordion('.faq-question', '.faq-answer', 'open');
  initAccordion('.faq-trigger', '.faq-body', 'open');

  // ---- Gallery Filter ----
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.filter;
        galleryItems.forEach(item => {
          const match = cat === 'all' || item.dataset.category === cat;
          item.style.opacity = match ? '1' : '0.2';
          item.style.pointerEvents = match ? 'auto' : 'none';
          item.style.transform = match ? 'scale(1)' : 'scale(0.97)';
        });
      });
    });
  }

  // ---- Lightbox ----
  const lightbox = document.querySelector('.lightbox');
  if (lightbox) {
    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const items = [...document.querySelectorAll('.gallery-item[data-src]')];
    let current = 0;

    const openLB = (idx) => {
      current = idx;
      lightboxImg.src = items[idx].dataset.src;
      lightboxImg.alt = items[idx].dataset.alt || '';
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    };
    const closeLB = () => {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    };

    items.forEach((item, idx) => item.addEventListener('click', () => openLB(idx)));
    lightbox.querySelector('.lightbox-close')?.addEventListener('click', closeLB);
    lightbox.querySelector('.lightbox-prev')?.addEventListener('click', () => openLB((current - 1 + items.length) % items.length));
    lightbox.querySelector('.lightbox-next')?.addEventListener('click', () => openLB((current + 1) % items.length));
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLB(); });
    document.addEventListener('keydown', e => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLB();
      if (e.key === 'ArrowLeft') openLB((current - 1 + items.length) % items.length);
      if (e.key === 'ArrowRight') openLB((current + 1) % items.length);
    });
  }

  // ---- Form Validation ----
  document.querySelectorAll('[data-validate]').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;

      form.querySelectorAll('[required]').forEach(field => {
        const val = field.value.trim();
        const group = field.closest('.form-group');
        const errEl = group?.querySelector('.form-error');
        const isInvalid = !val || (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val));
        field.classList.toggle('error', isInvalid);
        if (errEl) errEl.textContent = !val ? 'This field is required.' : (field.type === 'email' && isInvalid ? 'Please enter a valid email address.' : '');
        if (isInvalid) valid = false;
      });

      if (valid) {
        const thankYouUrl = form.dataset.thankyou || 'thank-you.html';
        window.location.href = thankYouUrl;
      } else {
        form.querySelector('.error')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });

    form.querySelectorAll('input, textarea, select').forEach(field => {
      field.addEventListener('input', () => {
        field.classList.remove('error');
        const errEl = field.closest('.form-group')?.querySelector('.form-error');
        if (errEl) errEl.textContent = '';
      });
    });
  });

  // ---- Contact form (no data-validate, simpler) ----
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const name = contactForm.querySelector('#c-name');
      const email = contactForm.querySelector('#c-email');
      const msg = contactForm.querySelector('#c-message');
      let ok = true;
      [name, email, msg].forEach(f => {
        if (f && !f.value.trim()) { f.style.borderColor = 'var(--rose)'; ok = false; }
        else if (f) f.style.borderColor = '';
      });
      if (ok) window.location.href = 'thank-you.html';
    });
  }

  // ---- Character count ----
  document.querySelectorAll('[data-maxchars]').forEach(el => {
    const max = parseInt(el.dataset.maxchars);
    const counter = document.createElement('span');
    counter.className = 'form-hint';
    counter.style.cssText = 'display:block;margin-top:0.25rem;text-align:right;font-size:0.78rem;color:var(--charcoal-light)';
    const update = () => counter.textContent = `${el.value.length} / ${max} characters`;
    el.parentNode.appendChild(counter);
    el.addEventListener('input', update);
    update();
  });

  // ---- Mobile bottom bar active state ----
  const path = window.location.pathname;
  document.querySelectorAll('.mob-bar a').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href && (path.endsWith(href) || (href === 'index.html' && (path === '/' || path.endsWith('/'))))) {
      a.classList.add('active');
    }
  });

});
