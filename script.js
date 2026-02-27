/* ============================================================
   MEHR MANDI & GRILLS — SCRIPT.JS
   Handles: Sticky header, Mobile menu, Smooth scroll,
            Intersection Observer animations, Menu tabs,
            Scroll-to-top, Active nav highlighting,
            Reservation form, Scroll-linked parallax
   ============================================================ */

(function () {
  'use strict';

  // ─── ELEMENT REFERENCES ─────────────────────────────────────
  const header = document.getElementById('site-header');
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileOverlay = document.getElementById('mobile-nav-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  const navLinks = document.querySelectorAll('.nav-link');
  const menuTabs = document.querySelectorAll('.menu-tab');
  const menuPanels = document.querySelectorAll('.menu-panel');
  const scrollTopBtn = document.getElementById('scroll-top-btn');
  const animEls = document.querySelectorAll('[data-animate]');
  const sections = document.querySelectorAll('section[id], #home');
  const resForm = document.getElementById('reservation-form');

  // ─── STICKY HEADER — SCROLL CLASS ───────────────────────────
  function onScroll() {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll-to-top visibility
    if (window.scrollY > 500) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }

    // Active nav link highlight
    updateActiveNav();
  }

  // ─── ACTIVE NAV BASED ON SCROLL POSITION ─────────────────────
  function updateActiveNav() {
    let current = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 100;
      const sectionBottom = sectionTop + section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href && href === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // ─── HAMBURGER MENU ────────────────────────────────────────
  function openMobileMenu() {
    hamburgerBtn.classList.add('open');
    mobileOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    hamburgerBtn.setAttribute('aria-expanded', 'true');
  }

  function closeMobileMenu() {
    hamburgerBtn.classList.remove('open');
    mobileOverlay.classList.remove('open');
    document.body.style.overflow = '';
    hamburgerBtn.setAttribute('aria-expanded', 'false');
  }

  hamburgerBtn.addEventListener('click', () => {
    const isOpen = hamburgerBtn.classList.contains('open');
    isOpen ? closeMobileMenu() : openMobileMenu();
  });

  // Close button inside overlay
  const mobileCloseBtn = document.getElementById('mobile-nav-close');
  if (mobileCloseBtn) {
    mobileCloseBtn.addEventListener('click', closeMobileMenu);
  }

  mobileLinks.forEach((link) => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close on overlay click outside nav
  mobileOverlay.addEventListener('click', (e) => {
    if (e.target === mobileOverlay) closeMobileMenu();
  });

  // ESC key closes mobile menu
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileOverlay.classList.contains('open')) {
      closeMobileMenu();
    }
  });

  // ─── SMOOTH SCROLL for anchor links ────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const headerH = header.offsetHeight;
        const targetY = target.getBoundingClientRect().top + window.scrollY - headerH - 10;
        window.scrollTo({ top: targetY, behavior: 'smooth' });
      }
    });
  });

  // ─── SCROLL TO TOP BUTTON ───────────────────────────────────
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ─── INTERSECTION OBSERVER — REVEAL ANIMATIONS ─────────────
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Stagger children if in a grid
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );

  animEls.forEach((el, idx) => {
    // Stagger siblings in the same parent
    const siblings = el.parentElement
      ? Array.from(el.parentElement.querySelectorAll('[data-animate]'))
      : [];
    const siblingIdx = siblings.indexOf(el);
    el.dataset.delay = siblingIdx * 80;
    revealObserver.observe(el);
  });

  // ─── MENU TABS ──────────────────────────────────────────────
  menuTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.target;

      // Update tab states
      menuTabs.forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      // Show/hide panels
      menuPanels.forEach((panel) => {
        panel.classList.remove('active');
      });
      const activePanel = document.getElementById('panel-' + target);
      if (activePanel) {
        activePanel.classList.add('active');

        // Re-trigger animations for newly shown cards
        activePanel.querySelectorAll('[data-animate]').forEach((el, idx) => {
          el.classList.remove('visible');
          setTimeout(() => el.classList.add('visible'), idx * 80 + 50);
        });
      }
    });
  });

  // ─── GALLERY — LIGHTBOX (Simple) ────────────────────────────
  const galleryItems = document.querySelectorAll('.gallery-item');
  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (!img) return;

      // Create overlay
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position:fixed;inset:0;z-index:9999;
        background:rgba(0,0,0,0.88);
        display:flex;align-items:center;justify-content:center;
        cursor:zoom-out;
        padding:20px;
      `;

      const fullImg = document.createElement('img');
      fullImg.src = img.src;
      fullImg.alt = img.alt;
      fullImg.style.cssText = `
        max-width:90vw;max-height:90vh;
        object-fit:contain;
        border-radius:16px;
        box-shadow:0 20px 80px rgba(0,0,0,0.5);
        animation: lightbox-in 0.3s ease;
      `;

      // Inject keyframe
      if (!document.getElementById('lbStyle')) {
        const style = document.createElement('style');
        style.id = 'lbStyle';
        style.textContent = `
          @keyframes lightbox-in {
            from { opacity:0; transform:scale(0.88); }
            to   { opacity:1; transform:scale(1); }
          }
        `;
        document.head.appendChild(style);
      }

      const closeBtn = document.createElement('button');
      closeBtn.innerHTML = '&times;';
      closeBtn.style.cssText = `
        position:absolute;top:24px;right:32px;
        background:rgba(255,255,255,0.15);color:#fff;
        border:none;font-size:2rem;cursor:pointer;
        border-radius:50%;width:48px;height:48px;
        display:flex;align-items:center;justify-content:center;
        transition:background 0.2s;
      `;
      closeBtn.addEventListener('mouseover', () => {
        closeBtn.style.background = 'rgba(211,26,42,0.8)';
      });
      closeBtn.addEventListener('mouseout', () => {
        closeBtn.style.background = 'rgba(255,255,255,0.15)';
      });

      overlay.appendChild(fullImg);
      overlay.appendChild(closeBtn);
      document.body.appendChild(overlay);
      document.body.style.overflow = 'hidden';

      const closeOverlay = () => {
        document.body.removeChild(overlay);
        document.body.style.overflow = '';
      };

      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeOverlay();
      });
      closeBtn.addEventListener('click', closeOverlay);
      document.addEventListener('keydown', function onKey(e) {
        if (e.key === 'Escape') {
          closeOverlay();
          document.removeEventListener('keydown', onKey);
        }
      });
    });
  });

  // ─── RESERVATION FORM ────────────────────────────────────────
  if (resForm) {
    // Set min date for date input to today
    const dateInput = document.getElementById('res-date');
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.setAttribute('min', today);
    }

    resForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('res-name').value.trim();
      const phone = document.getElementById('res-phone').value.trim();
      const date = document.getElementById('res-date').value;
      const time = document.getElementById('res-time').value;
      const guests = document.getElementById('res-guests').value;

      if (!name || !phone || !date || !time || !guests) {
        showToast('Please fill in all fields.', 'error');
        return;
      }

      // Build WhatsApp message
      const message = encodeURIComponent(
        `Hello! I'd like to make a reservation at Mehr Mandi & Grills.\n\n` +
        `Name: ${name}\n` +
        `Phone: ${phone}\n` +
        `Date: ${date}\n` +
        `Time: ${time}\n` +
        `Guests: ${guests}\n\n` +
        `Please confirm my booking. Thank you!`
      );

      window.open(`https://wa.me/919876543210?text=${message}`, '_blank');
      resForm.reset();
      showToast('Opening WhatsApp to confirm your reservation! 🎉');
    });
  }

  // ─── TOAST NOTIFICATION ──────────────────────────────────────
  function showToast(message, type = 'success') {
    const existing = document.querySelector('.mehr-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'mehr-toast';
    toast.textContent = message;

    const bg = type === 'error' ? '#D31A2A' : '#25D366';
    toast.style.cssText = `
      position:fixed;bottom:110px;left:50%;transform:translateX(-50%);
      background:${bg};color:#fff;
      padding:14px 28px;border-radius:50px;
      font-family:'Montserrat',sans-serif;font-size:0.88rem;font-weight:600;
      box-shadow:0 8px 28px rgba(0,0,0,0.2);
      z-index:10000;
      animation:toast-in 0.3s ease;
    `;

    if (!document.getElementById('toastStyle')) {
      const style = document.createElement('style');
      style.id = 'toastStyle';
      style.textContent = `
        @keyframes toast-in {
          from { opacity:0; transform:translateX(-50%) translateY(20px); }
          to   { opacity:1; transform:translateX(-50%) translateY(0); }
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.transition = 'opacity 0.4s';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 400);
    }, 3200);
  }

  // ─── HERO THUMBNAIL — SCROLL TO MENU ──────────────────────────
  document.querySelectorAll('.thumb-item').forEach((thumb) => {
    thumb.addEventListener('click', () => {
      const menuEl = document.getElementById('menu');
      if (menuEl) {
        const headerH = header.offsetHeight;
        const targetY = menuEl.getBoundingClientRect().top + window.scrollY - headerH - 10;
        window.scrollTo({ top: targetY, behavior: 'smooth' });
      }
    });
  });

  // ─── INIT ────────────────────────────────────────────────────
  onScroll();

  // Trigger initial animations for above-fold elements
  setTimeout(() => {
    document.querySelectorAll('.hero [data-animate]').forEach((el) => {
      el.classList.add('visible');
    });
  }, 200);

})();
