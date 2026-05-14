/* ============================================================
   MyBalloons — Main JavaScript
   ============================================================ */

// ---- Form Validation + Submission ----
(() => {
  if (window.__myBalloonsFormsBound) return;
  window.__myBalloonsFormsBound = true;

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const publicSubmitError = 'Sorry, your enquiry could not be sent. Please try again or contact us directly.';

  const getErrorElement = (field) => {
    const group = field.closest('.form-group');
    if (!group) return null;

    let errEl = group.querySelector('.form-error');
    if (!errEl) {
      errEl = document.createElement('span');
      errEl.className = 'form-error';
      group.appendChild(errEl);
    }

    return errEl;
  };

  const setFieldError = (field, message) => {
    const hasError = Boolean(message);
    field.classList.toggle('error', hasError);
    if (hasError) field.setAttribute('aria-invalid', 'true');
    else field.removeAttribute('aria-invalid');

    const errEl = getErrorElement(field);
    if (errEl) errEl.textContent = message || '';
  };

  const clearFieldError = (form, field) => {
    if (field.type === 'radio' && field.name) {
      form.querySelectorAll('input[type="radio"]').forEach(input => {
        if (input.name === field.name) {
          input.classList.remove('error');
          input.removeAttribute('aria-invalid');
        }
      });
    } else {
      field.classList.remove('error');
      field.removeAttribute('aria-invalid');
    }

    const errEl = getErrorElement(field);
    if (errEl) errEl.textContent = '';
  };

  const validateForm = (form) => {
    let valid = true;
    const checkedRadioGroups = new Set();

    form.querySelectorAll('[required]').forEach(field => {
      if (field.type === 'radio' && field.name) {
        if (checkedRadioGroups.has(field.name)) return;
        checkedRadioGroups.add(field.name);

        const radioGroup = [...form.querySelectorAll('input[type="radio"]')].filter(input => input.name === field.name);
        const isInvalid = !radioGroup.some(input => input.checked);
        radioGroup.forEach(input => {
          input.classList.toggle('error', isInvalid);
          if (isInvalid) input.setAttribute('aria-invalid', 'true');
          else input.removeAttribute('aria-invalid');
        });
        const errEl = getErrorElement(field);
        if (errEl) errEl.textContent = isInvalid ? 'Please choose an option.' : '';
        if (isInvalid) valid = false;
        return;
      }

      const value = field.value.trim();
      const isMissing = !value;
      const isInvalidEmail = field.type === 'email' && value && !emailPattern.test(value);
      const message = isMissing ? 'This field is required.' : (isInvalidEmail ? 'Please enter a valid email address.' : '');

      setFieldError(field, message);
      if (message) valid = false;
    });

    return valid;
  };

  const setSubmitting = (form, isSubmitting) => {
    const button = form.querySelector('[type="submit"]');
    if (!button) return;

    if (!button.dataset.originalText) button.dataset.originalText = button.textContent;
    button.disabled = isSubmitting;
    button.textContent = isSubmitting ? 'Sending...' : button.dataset.originalText;
  };

  const showSubmitError = (form, message) => {
    let errorEl = form.querySelector('.form-submit-error');
    if (!errorEl) {
      errorEl = document.createElement('p');
      errorEl.className = 'form-submit-error';
      form.appendChild(errorEl);
    }

    errorEl.textContent = message;
    errorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const clearSubmitError = (form) => {
    const errorEl = form.querySelector('.form-submit-error');
    if (errorEl) errorEl.textContent = '';
  };

  const submitToEndpoint = async (form) => {
    const action = form.getAttribute('action');
    const method = (form.getAttribute('method') || '').toUpperCase();
    const thankYouUrl = form.dataset.thankyou || 'thank-you.html';

    if (!action) {
      throw new Error('This form is missing a submission endpoint.');
    }

    if (method !== 'POST') {
      throw new Error('This form is not configured to submit correctly.');
    }

    let response;
    try {
      response = await fetch(action, {
        method,
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });
    } catch (error) {
      throw new Error(publicSubmitError, { cause: error });
    }

    if (response.ok) {
      window.location.href = thankYouUrl;
      return;
    }

    const data = await response.json().catch(() => null);
    const formspreeErrors = Array.isArray(data?.errors)
      ? data.errors.map(error => error.message).filter(Boolean).join(' ')
      : '';
    const error = new Error(formspreeErrors || publicSubmitError);
    error.details = { action, method, status: response.status, response: data };
    throw error;
  };

  const handleDelegatedFieldChange = (e) => {
    const field = e.target;
    const form = field?.closest?.('form[data-validate]');
    if (!form || !field.matches?.('input, textarea, select')) return;

    clearFieldError(form, field);
  };

  document.addEventListener('submit', async e => {
    const form = e.target?.closest?.('form[data-validate]');
    if (!form) return;

    e.preventDefault();
    clearSubmitError(form);

    if (!validateForm(form)) {
      form.querySelector('.error')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    if (form.dataset.submitting === 'true') return;
    form.dataset.submitting = 'true';
    setSubmitting(form, true);

    try {
      await submitToEndpoint(form);
    } catch (error) {
      console.error('[MyBalloons] Form submission failed.', {
        action: form.getAttribute('action'),
        method: form.getAttribute('method'),
        error,
        cause: error.cause,
        details: error.details
      });
      showSubmitError(form, error.message);
      delete form.dataset.submitting;
      setSubmitting(form, false);
    }
  });

  document.addEventListener('input', handleDelegatedFieldChange);
  document.addEventListener('change', handleDelegatedFieldChange);

  window.addEventListener('pageshow', () => {
    document.querySelectorAll('form[data-validate]').forEach(form => {
      delete form.dataset.submitting;
      setSubmitting(form, false);
    });
  });
})();

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
