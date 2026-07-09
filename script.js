// ==========================================================
// WONDERLY — Premium Toy Store interactions
// ==========================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Sticky navbar shrink ---------- */
  const navbar = document.getElementById('navbar');
  const toTopBtn = document.getElementById('toTop');

  const onScroll = () => {
    if (navbar) {
      if (window.scrollY > 40) navbar.classList.add('scrolled');
      else navbar.classList.remove('scrolled');
    }
    if (toTopBtn) {
      if (window.scrollY > 600) toTopBtn.classList.add('show');
      else toTopBtn.classList.remove('show');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (toTopBtn) {
    toTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Hamburger / mobile menu ---------- */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  const closeMenu = () => {
    if (!hamburger || !mobileMenu) return;
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isActive = hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', String(isActive));
      document.body.style.overflow = isActive ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }

  /* ---------- Scroll reveal (bouncy pop-in) ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        // small stagger for elements revealing together
        setTimeout(() => entry.target.classList.add('in-view'), (idx % 6) * 70);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- Animated stat counters ---------- */
  const statNums = document.querySelectorAll('.stat-num');
  const animateCount = (el) => {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      // ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(eased * target);
      el.textContent = value.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString() + suffix;
    };
    requestAnimationFrame(step);
  };

  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  statNums.forEach(el => statObserver.observe(el));

  /* ---------- Cursor glow (desktop only) ---------- */
  const cursorGlow = document.getElementById('cursorGlow');
  if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('mousemove', (e) => {
      cursorGlow.style.left = e.clientX + 'px';
      cursorGlow.style.top = e.clientY + 'px';
    });
  } else if (cursorGlow) {
    cursorGlow.style.display = 'none';
  }

  /* ---------- Testimonial slider ---------- */
  const track = document.getElementById('testiTrack');
  const cards = track ? Array.from(track.querySelectorAll('.testi-card')) : [];
  const dots = Array.from(document.querySelectorAll('#testiDots .dot'));
  const prevBtn = document.getElementById('testiPrev');
  const nextBtn = document.getElementById('testiNext');
  let current = 0;
  let autoTimer;

  const showSlide = (i) => {
    cards.forEach(c => c.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    current = (i + cards.length) % cards.length;
    cards[current].classList.add('active');
    dots[current].classList.add('active');
  };

  const startAuto = () => {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => showSlide(current + 1), 6000);
  };

  if (cards.length) {
    nextBtn.addEventListener('click', () => { showSlide(current + 1); startAuto(); });
    prevBtn.addEventListener('click', () => { showSlide(current - 1); startAuto(); });
    dots.forEach(dot => {
      dot.addEventListener('click', () => { showSlide(parseInt(dot.dataset.i, 10)); startAuto(); });
    });
    startAuto();
  }

  /* ---------- Add-to-cart micro interaction ---------- */
  const cartCount = document.querySelector('.cart-count');
  let count = 3;
  document.querySelectorAll('.btn-add').forEach(btn => {
    btn.addEventListener('click', () => {
      count++;
      if (cartCount) cartCount.textContent = count;
      btn.innerHTML = '<i class="fa-solid fa-check"></i> Added';
      btn.style.background = 'var(--gold)';
      btn.style.color = '#231A08';
      btn.style.borderColor = 'var(--gold)';
      setTimeout(() => {
        btn.innerHTML = '<i class="fa-solid fa-bag-shopping"></i> Add to Cart';
        btn.style.background = '';
        btn.style.color = '';
        btn.style.borderColor = '';
      }, 1600);
    });
  });

  /* ---------- Wishlist toggle ---------- */
  document.querySelectorAll('.wish-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const icon = btn.querySelector('i');
      icon.classList.toggle('fa-regular');
      icon.classList.toggle('fa-solid');
      btn.classList.toggle('active-wish');
    });
  });

  /* ---------- Category / bestseller / diaries filter bars ---------- */
  const filterBtns = document.querySelectorAll('.filter-btn');

  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const group = btn.closest('.filter-bar');
        group.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        let visibleCount = 0;

        const section = group.closest('section, .dash-view');
        const cards = section ? section.querySelectorAll('[data-tags]') : [];

        cards.forEach((card, i) => {
          const tags = card.dataset.tags || '';
          const matches = filter === 'all' || tags.includes(filter);
          if (matches) {
            card.classList.remove('filtered-out');
            card.classList.remove('in-view');
            visibleCount++;
            setTimeout(() => card.classList.add('in-view'), i * 60);
          } else {
            card.classList.add('filtered-out');
          }
        });

        const nr = section ? section.querySelector('.no-results') : null;
        if (nr) nr.classList.toggle('show', visibleCount === 0);
      });
    });
  }

  /* ---------- Rating breakdown bars (best.html spotlight) ---------- */
  const rbFills = document.querySelectorAll('.rb-fill');
  const rbObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        setTimeout(() => {
          target.style.width = (target.dataset.width || 0) + '%';
        }, 200);
        rbObserver.unobserve(target);
      }
    });
  }, { threshold: 0.3 });
  rbFills.forEach(el => rbObserver.observe(el));

  /* ---------- Craft.html: process timeline scroll-fill ---------- */
  const processFill = document.getElementById('processFill');
  const processTimeline = document.getElementById('processTimeline');

  if (processFill && processTimeline) {
    const updateProcessFill = () => {
      const rect = processTimeline.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.85;
      const end = vh * 0.4;
      const progress = Math.min(Math.max((start - rect.top) / (rect.height + start - end), 0), 1);
      processFill.style.height = (progress * 100) + '%';
    };
    window.addEventListener('scroll', updateProcessFill, { passive: true });
    window.addEventListener('resize', updateProcessFill);
    updateProcessFill();
  }

  /* ---------- Craft.html: safety testing rings ---------- */
  const ringFills = document.querySelectorAll('.ring-fill');
  const ringObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const circle = entry.target;
        const pct = parseFloat(circle.dataset.pct || 0);
        const circumference = 327;
        const offset = circumference - (pct / 100) * circumference;
        setTimeout(() => { circle.style.strokeDashoffset = offset; }, 150);

        const card = circle.closest('.test-card');
        const numEl = card ? card.querySelector('.ring-num') : null;
        if (numEl) {
          const target = parseFloat(numEl.dataset.count || 0);
          const duration = 1500;
          const start = performance.now();
          const step = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            numEl.textContent = Math.floor(eased * target);
            if (progress < 1) requestAnimationFrame(step);
            else numEl.textContent = target;
          };
          requestAnimationFrame(step);
        }
        ringObserver.unobserve(circle);
      }
    });
  }, { threshold: 0.4 });
  ringFills.forEach(el => ringObserver.observe(el));

  /* ---------- Smooth close mobile menu on nav link (desktop nav too) ---------- */
  document.querySelectorAll('.nav-links a, .nav-cta').forEach(a => {
    a.addEventListener('click', closeMenu);
  });

  /* ==========================================================
     AUTH PAGES — login.html / signup.html
  ========================================================== */

  /* ---------- Role toggle (segmented control) ---------- */
  document.querySelectorAll('.role-toggle').forEach(toggle => {
    const opts = toggle.querySelectorAll('.role-opt');
    const pill = toggle.querySelector('.role-pill');
    opts.forEach(opt => {
      opt.addEventListener('click', () => {
        opts.forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
        if (pill) pill.style.transform = opt.dataset.role === 'admin' ? 'translateX(100%)' : 'translateX(0)';
        toggle.dataset.selected = opt.dataset.role;
      });
    });
  });

  /* ---------- Password show/hide toggle ---------- */
  document.querySelectorAll('.toggle-pass').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.previousElementSibling;
      const icon = btn.querySelector('i');
      if (!input) return;
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      icon.classList.toggle('fa-eye', !isPassword);
      icon.classList.toggle('fa-eye-slash', isPassword);
    });
  });

  /* ---------- Password strength meter (signup.html) ---------- */
  const signupPassword = document.getElementById('signupPassword');
  const pwStrength = document.getElementById('pwStrength');
  if (signupPassword && pwStrength) {
    signupPassword.addEventListener('input', () => {
      const val = signupPassword.value;
      let score = 0;
      if (val.length >= 6) score++;
      if (val.length >= 10) score++;
      if (/[A-Z]/.test(val) && /[0-9]/.test(val)) score++;
      if (/[^A-Za-z0-9]/.test(val)) score++;
      score = Math.min(score, 3);
      pwStrength.classList.remove('weak', 'medium', 'strong');
      if (val.length === 0) return;
      if (score <= 1) pwStrength.classList.add('weak');
      else if (score === 2) pwStrength.classList.add('medium');
      else pwStrength.classList.add('strong');
    });
  }

  /* ---------- Helper: field-level validation error ---------- */
  const setFieldError = (inputEl, errorEl, message) => {
    if (!inputEl) return;
    const wrap = inputEl.closest('.input-wrap');
    if (message) {
      if (wrap) wrap.classList.add('error');
      if (errorEl) { errorEl.textContent = message; errorEl.classList.add('show'); }
    } else {
      if (wrap) wrap.classList.remove('error');
      if (errorEl) { errorEl.textContent = ''; errorEl.classList.remove('show'); }
    }
  };

  const isValidEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  /* ---------- Helper: fake submit with spinner, then callback ---------- */
  const runFakeSubmit = (btn, onDone) => {
    if (!btn) { onDone(); return; }
    btn.classList.add('loading');
    btn.disabled = true;
    setTimeout(() => {
      btn.classList.remove('loading');
      btn.disabled = false;
      onDone();
    }, 1100);
  };

  const showToast = (el, message, isError) => {
    if (!el) return;
    el.textContent = message;
    el.classList.add('show');
    el.classList.toggle('error', !!isError);
  };

  /* ---------- Login form ---------- */
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    const emailInput = document.getElementById('loginEmail');
    const passInput = document.getElementById('loginPassword');
    const emailError = document.getElementById('loginEmailError');
    const passError = document.getElementById('loginPasswordError');
    const submitBtn = document.getElementById('loginSubmit');
    const toast = document.getElementById('loginToast');
    const roleToggle = document.getElementById('loginRoleToggle');

    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      if (!isValidEmail(emailInput.value)) {
        setFieldError(emailInput, emailError, 'Enter a valid email address.');
        valid = false;
      } else {
        setFieldError(emailInput, emailError, '');
      }

      if (passInput.value.length < 6) {
        setFieldError(passInput, passError, 'Password must be at least 6 characters.');
        valid = false;
      } else {
        setFieldError(passInput, passError, '');
      }

      if (!valid) {
        showToast(toast, 'Please fix the highlighted fields.', true);
        return;
      }

      const role = roleToggle ? (roleToggle.dataset.selected || 'user') : 'user';
      const namePart = emailInput.value.split('@')[0].replace(/[^a-zA-Z]/g, '') || 'Friend';
      const name = namePart.charAt(0).toUpperCase() + namePart.slice(1);

      showToast(toast, 'Welcome back! Redirecting…', false);
      runFakeSubmit(submitBtn, () => {
        try {
          localStorage.setItem('wonderlyRole', role);
          localStorage.setItem('wonderlyName', name);
        } catch (err) { /* storage unavailable, continue anyway */ }
        window.location.href = role === 'admin' ? 'dashboard-admin.html' : 'dashboard-user.html';
      });
    });
  }

  /* ---------- Signup form ---------- */
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    const nameInput = document.getElementById('signupName');
    const emailInput = document.getElementById('signupEmail');
    const passInput = document.getElementById('signupPassword');
    const confirmInput = document.getElementById('signupConfirm');
    const termsInput = document.getElementById('agreeTerms');
    const nameError = document.getElementById('signupNameError');
    const emailError = document.getElementById('signupEmailError');
    const passError = document.getElementById('signupPasswordError');
    const confirmError = document.getElementById('signupConfirmError');
    const submitBtn = document.getElementById('signupSubmit');
    const toast = document.getElementById('signupToast');
    const roleToggle = document.getElementById('signupRoleToggle');

    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      if (nameInput.value.trim().length < 2) {
        setFieldError(nameInput, nameError, 'Enter your full name.');
        valid = false;
      } else {
        setFieldError(nameInput, nameError, '');
      }

      if (!isValidEmail(emailInput.value)) {
        setFieldError(emailInput, emailError, 'Enter a valid email address.');
        valid = false;
      } else {
        setFieldError(emailInput, emailError, '');
      }

      if (passInput.value.length < 6) {
        setFieldError(passInput, passError, 'Password must be at least 6 characters.');
        valid = false;
      } else {
        setFieldError(passInput, passError, '');
      }

      if (confirmInput.value !== passInput.value || !confirmInput.value) {
        setFieldError(confirmInput, confirmError, 'Passwords do not match.');
        valid = false;
      } else {
        setFieldError(confirmInput, confirmError, '');
      }

      if (!valid) {
        showToast(toast, 'Please fix the highlighted fields.', true);
        return;
      }

      if (termsInput && !termsInput.checked) {
        showToast(toast, 'Please agree to the Terms & Privacy Policy.', true);
        return;
      }

      const role = roleToggle ? (roleToggle.dataset.selected || 'user') : 'user';

      showToast(toast, 'Account created! Redirecting to log in…', false);
      runFakeSubmit(submitBtn, () => {
        try {
          localStorage.setItem('wonderlyRole', role);
          localStorage.setItem('wonderlyName', nameInput.value.trim().split(' ')[0]);
        } catch (err) { /* storage unavailable, continue anyway */ }
        window.location.href = 'login.html';
      });
    });
  }

  /* ==========================================================
     DASHBOARD PAGES — dashboard-admin.html / dashboard-user.html
  ========================================================== */

  /* ---------- Sidebar hamburger (mobile) ---------- */
  const dashHamburger = document.getElementById('dashHamburger');
  const dashSidebar = document.getElementById('dashSidebar');
  const dashOverlay = document.getElementById('dashOverlay');

  if (dashHamburger && dashSidebar && dashOverlay) {
    const closeDash = () => {
      dashHamburger.classList.remove('active');
      dashSidebar.classList.remove('open');
      dashOverlay.classList.remove('show');
      document.body.style.overflow = '';
    };
    dashHamburger.addEventListener('click', () => {
      const isOpen = dashSidebar.classList.toggle('open');
      dashHamburger.classList.toggle('active', isOpen);
      dashOverlay.classList.toggle('show', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    dashOverlay.addEventListener('click', closeDash);
    dashSidebar.querySelectorAll('.dash-link').forEach(link => {
      link.addEventListener('click', closeDash);
    });
  }

  /* ---------- Populate name/role from localStorage ---------- */
  try {
    const savedName = localStorage.getItem('wonderlyName');
    if (savedName) {
      document.querySelectorAll('#adminGreetName, #userGreetName').forEach(el => { el.textContent = savedName; });
      document.querySelectorAll('#adminName, #userName').forEach(el => { el.textContent = savedName; });
    }
  } catch (err) { /* storage unavailable, keep placeholder names */ }

  /* ---------- Dashboard logout ---------- */
  document.querySelectorAll('#logoutBtn').forEach(btn => {
    btn.addEventListener('click', () => {
      try {
        localStorage.removeItem('wonderlyRole');
        localStorage.removeItem('wonderlyName');
      } catch (err) { /* storage unavailable */ }
    });
  });

  /* ---------- Dashboard stat counters (.dsc-num) ---------- */
  const dscNums = document.querySelectorAll('.dsc-num');
  const animateDscCount = (el) => {
    const target = parseInt(el.dataset.target, 10) || 0;
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const duration = 1600;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(eased * target);
      el.textContent = prefix + value.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = prefix + target.toLocaleString() + suffix;
    };
    requestAnimationFrame(step);
  };
  const dscObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateDscCount(entry.target);
        dscObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  dscNums.forEach(el => dscObserver.observe(el));

  /* ---------- Top product bars (.tp-fill) ---------- */
  const tpFills = document.querySelectorAll('.tp-fill');
  const tpObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        setTimeout(() => { target.style.width = (target.dataset.width || 0) + '%'; }, 200);
        tpObserver.unobserve(target);
      }
    });
  }, { threshold: 0.3 });
  tpFills.forEach(el => tpObserver.observe(el));

  /* ---------- Analytics chart bars (.chart-bar) ---------- */
  const chartBars = document.querySelectorAll('.chart-bar');
  const chartObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        setTimeout(() => { target.style.height = (target.dataset.height || 0) + '%'; }, 150);
        chartObserver.unobserve(target);
      }
    });
  }, { threshold: 0.3 });
  chartBars.forEach(el => chartObserver.observe(el));

  /* ==========================================================
     DASHBOARD TAB VIEWS — sidebar links switch visible panels
  ========================================================== */
  const dashViews = document.querySelectorAll('.dash-view');
  const dashTabLinks = document.querySelectorAll('[data-view]');

  /* re-run any animation that couldn't fire while its view was display:none */
  const wakeUpView = (view) => {
    view.querySelectorAll('.reveal:not(.in-view)').forEach((el, i) => {
      setTimeout(() => el.classList.add('in-view'), i * 60);
    });
    view.querySelectorAll('.dsc-num').forEach(el => {
      if (el.textContent === '0') animateDscCount(el);
    });
    view.querySelectorAll('.tp-fill').forEach(el => {
      if (!el.style.width || el.style.width === '0px') {
        setTimeout(() => { el.style.width = (el.dataset.width || 0) + '%'; }, 150);
      }
    });
    view.querySelectorAll('.chart-bar').forEach(el => {
      if (!el.style.height || el.style.height === '0px') {
        setTimeout(() => { el.style.height = (el.dataset.height || 0) + '%'; }, 150);
      }
    });
    view.querySelectorAll('.ring-fill').forEach(circle => {
      if (circle.style.strokeDashoffset === '' || circle.style.strokeDashoffset === '327') {
        const pct = parseFloat(circle.dataset.pct || 0);
        const offset = 327 - (pct / 100) * 327;
        setTimeout(() => { circle.style.strokeDashoffset = offset; }, 150);
        const card = circle.closest('.test-card, .ring-col');
        const numEl = card ? card.querySelector('.ring-num') : null;
        if (numEl && numEl.textContent === '0') {
          const target = parseFloat(numEl.dataset.count || 0);
          numEl.textContent = target;
        }
      }
    });
  };

  if (dashViews.length && dashTabLinks.length) {
    dashTabLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const viewName = link.dataset.view;
        const targetView = document.getElementById('view-' + viewName);
        if (!targetView) return; // let normal links (no matching view) behave as-is
        e.preventDefault();

        // update active state only on real sidebar links
        if (link.classList.contains('dash-link')) {
          document.querySelectorAll('.dash-link').forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        } else {
          const matchingSidebarLink = document.querySelector('.dash-link[data-view="' + viewName + '"]');
          if (matchingSidebarLink) {
            document.querySelectorAll('.dash-link').forEach(l => l.classList.remove('active'));
            matchingSidebarLink.classList.add('active');
          }
        }

        dashViews.forEach(v => v.classList.remove('active'));
        targetView.classList.add('active');
        wakeUpView(targetView);

        const contentEl = document.querySelector('.dash-content');
        if (contentEl) contentEl.scrollTo({ top: 0, behavior: 'smooth' });
        else window.scrollTo({ top: 0, behavior: 'smooth' });

        // close mobile sidebar drawer if open
        if (dashSidebar && dashSidebar.classList.contains('open')) {
          dashSidebar.classList.remove('open');
          if (dashOverlay) dashOverlay.classList.remove('show');
          if (dashHamburger) dashHamburger.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    });
  }

});