(function () {
  function init() {
    var cfg = window.SITE_CONFIG || {};
    if (!cfg.businessName) {
      console.error('SITE_CONFIG not loaded');
      return;
    }

    function setText(id, value) {
      var el = document.getElementById(id);
      if (el) el.textContent = value || '';
    }

    // Logo — nav (wide) and footer (original)
    var logoImg = document.getElementById('logo-image');
    var footerLogoImg = document.getElementById('footer-logo-image');
    if (logoImg) {
      logoImg.src = 'dok-koon-widelogo.png';
      logoImg.onerror = function() { console.error('Wide logo not found'); };
    }
    if (footerLogoImg && cfg.logoUrl) {
      footerLogoImg.src = cfg.logoUrl;
    }

    // Floating call button
    var floatingCall = document.getElementById('floating-call');
    if (cfg.phoneNumber && floatingCall) {
      floatingCall.href = 'tel:' + cfg.phoneNumber.replace(/\s|\(|\)|-/g, '');
    } else if (floatingCall) {
      floatingCall.setAttribute('hidden', '');
    }

    // Nav phone button
    var navPhone = document.getElementById('nav-phone');
    var navPhoneText = navPhone && navPhone.querySelector('.nav-phone-text');
    if (navPhone && cfg.phoneNumber) {
      navPhone.href = 'tel:' + cfg.phoneNumber.replace(/\s|\(|\)|-/g, '');
      if (navPhoneText) navPhoneText.textContent = cfg.phoneNumber;
    } else if (navPhone) {
      navPhone.setAttribute('hidden', '');
    }

    // Mobile phone link
    var mobilePhone = document.getElementById('mobile-phone');
    if (mobilePhone && cfg.phoneNumber) {
      mobilePhone.href = 'tel:' + cfg.phoneNumber.replace(/\s|\(|\)|-/g, '');
    } else if (mobilePhone) {
      mobilePhone.setAttribute('hidden', '');
    }

    // Hero
    setText('headline', cfg.businessName);
    setText('tagline', cfg.tagline);
    setText('hours-summary', cfg.hoursSummary);

    var cover = document.getElementById('cover-image');
    if (cover && cfg.coverImageUrl) {
      cover.src = cfg.coverImageUrl;
      cover.onerror = function() { console.error('Cover image not found:', cfg.coverImageUrl); };
    }

    // Directions CTA
    var ctaDirections = document.getElementById('cta-directions');
    if (ctaDirections && cfg.addressLines && cfg.addressLines.length) {
      var addressQuery = encodeURIComponent(cfg.addressLines.join(', '));
      var isApple = /iPhone|iPad|Macintosh/.test(navigator.userAgent);
      ctaDirections.href = isApple
        ? 'https://maps.apple.com/?q=' + addressQuery
        : 'https://www.google.com/maps/search/?api=1&query=' + addressQuery;
    } else if (ctaDirections) {
      ctaDirections.setAttribute('hidden', '');
    }

    // Menu rendering — elegant list format
    function renderMenuSection(sectionId, items) {
      var section = document.getElementById(sectionId);
      if (!section) return;
      var container = section.querySelector('.menu-items');
      if (!container || !Array.isArray(items) || items.length === 0) {
        section.style.display = 'none';
        // Also hide corresponding menu tab
        var categoryEl = section.querySelector('.menu-category');
        if (categoryEl) {
          var tabHref = '#' + categoryEl.id;
          var tab = document.querySelector('.menu-tab[href="' + tabHref + '"]');
          if (tab) tab.style.display = 'none';
        }
        return;
      }
      container.innerHTML = items.map(function(item, index) {
        var desc = item.description
          ? '<div class="menu-item-desc">' + item.description + '</div>'
          : '';
        var price = item.price
          ? '<span class="menu-item-price">' + item.price + '</span>'
          : '';
        var delay = index * 60;
        return '<div class="menu-item" data-reveal="fade-up" data-reveal-delay="' + delay + '">' +
               '<div class="menu-item-info">' +
               '<div class="menu-item-name">' + (item.title || '') + '</div>' +
               desc +
               '</div>' +
               price +
               '</div>';
      }).join('');
    }

    if (cfg.menu) {
      renderMenuSection('menu-section-entrees', cfg.menu.entrees);
      renderMenuSection('menu-section-mains', cfg.menu.mains);
      renderMenuSection('menu-section-desserts', cfg.menu.desserts);
    }

    // Contact buttons
    var btnAddress = document.getElementById('btn-address');
    var btnEmail = document.getElementById('btn-email');
    var btnPhone = document.getElementById('btn-phone');
    var btnAddressText = document.getElementById('btn-address-text');
    var btnEmailText = document.getElementById('btn-email-text');
    var btnPhoneText = document.getElementById('btn-phone-text');

    if (btnAddress && cfg.addressLines && cfg.addressLines.length) {
      var addrQuery = encodeURIComponent(cfg.addressLines.join(', '));
      var isAppleDevice = /iPhone|iPad|Macintosh/.test(navigator.userAgent);
      btnAddress.href = isAppleDevice
        ? 'https://maps.apple.com/?q=' + addrQuery
        : 'https://www.google.com/maps/search/?api=1&query=' + addrQuery;
      if (btnAddressText) btnAddressText.textContent = cfg.addressLines.slice(0, 2).join(', ');
    } else if (btnAddress) {
      btnAddress.setAttribute('hidden', '');
    }

    if (btnEmail && cfg.email) {
      btnEmail.href = 'mailto:' + cfg.email;
      if (btnEmailText) btnEmailText.textContent = cfg.email;
    } else if (btnEmail) {
      btnEmail.setAttribute('hidden', '');
    }

    if (btnPhone && cfg.phoneNumber) {
      btnPhone.href = 'tel:' + cfg.phoneNumber.replace(/\s|\(|\)|-/g, '');
      if (btnPhoneText) btnPhoneText.textContent = cfg.phoneNumber;
    } else if (btnPhone) {
      btnPhone.setAttribute('hidden', '');
    }

    // Opening hours
    var hoursEl = document.getElementById('contact-hours');
    if (hoursEl && Array.isArray(cfg.openingHours)) {
      hoursEl.innerHTML = cfg.openingHours.map(function(h) {
        return '<div class="hours-row"><span class="hours-day">' + h.day + '</span><span class="hours-time">' + h.hours + '</span></div>';
      }).join('');
    }

    // Reviews
    var reviewsSummary = document.getElementById('reviews-summary');
    var reviewsList = document.getElementById('reviews-list');

    if (cfg.reviews && reviewsSummary) {
      var rating = cfg.reviews.overallRating || 0;
      var total = cfg.reviews.totalReviews || 0;
      var stars = '\u2605'.repeat(Math.round(rating));
      reviewsSummary.innerHTML = '<span class="reviews-stars-inline">' + stars + '</span> ' +
        rating.toFixed(1) + ' out of 5 based on ' + total + ' reviews';
    }

    if (cfg.reviews && reviewsList && Array.isArray(cfg.reviews.items)) {
      reviewsList.innerHTML = cfg.reviews.items.map(function(r, index) {
        var stars = '\u2605'.repeat(Math.max(0, Math.min(5, r.stars || 0)));
        var delay = index * 100;
        return '<div class="review-card" data-reveal="fade-up" data-reveal-delay="' + delay + '">' +
               '<div class="review-stars">' + stars + '</div>' +
               '<div class="review-text">' + (r.text || '') + '</div>' +
               '<div class="review-author">' + (r.author || '') + '</div></div>';
      }).join('');
    }

    // Google Places reviews (optional)
    async function loadPlacesReviews() {
      var g = window.GOOGLE_PLACES || {};
      if (!g.apiKey || !g.placeId) return;
      try {
        var url = 'https://places.googleapis.com/v1/places/' + encodeURIComponent(g.placeId);
        var fieldMask = 'rating,userRatingsTotal,reviews';
        var res = await fetch(url + '?fields=' + encodeURIComponent(fieldMask), {
          headers: { 'X-Goog-Api-Key': g.apiKey, 'X-Goog-FieldMask': fieldMask }
        });
        if (!res.ok) throw new Error('Failed to fetch Google Places');
        var data = await res.json();
        if (reviewsSummary && typeof data.rating === 'number') {
          var gRating = data.rating;
          var gTotal = data.userRatingsTotal || 0;
          var gStars = '\u2605'.repeat(Math.round(gRating));
          reviewsSummary.innerHTML = '<span class="reviews-stars-inline">' + gStars + '</span> ' +
            gRating.toFixed(1) + ' out of 5 on Google (' + gTotal + ' reviews)';
        }
        if (reviewsList && Array.isArray(data.reviews)) {
          reviewsList.innerHTML = data.reviews.slice(0, 6).map(function(r, index) {
            var stars = '\u2605'.repeat(Math.round(r.rating || 0));
            var text = (r.text && (r.text.text || r.text)) || '';
            var author = (r.authorAttribution && r.authorAttribution.displayName) || '';
            var delay = index * 100;
            return '<div class="review-card" data-reveal="fade-up" data-reveal-delay="' + delay + '">' +
                   '<div class="review-stars">' + stars + '</div>' +
                   '<div class="review-text">' + text + '</div>' +
                   '<div class="review-author">' + author + '</div></div>';
          }).join('');
          initScrollReveal();
        }
      } catch (e) {
        console.error('Error loading Google Places reviews:', e);
      }
    }
    loadPlacesReviews();

    // Logo link — scroll to top
    var logoLink = document.getElementById('logo-link');
    if (logoLink) {
      logoLink.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        history.replaceState(null, '', '#home');
      });
    }

    // Footer year
    var yearEl = document.getElementById('year');
    var footerName = document.getElementById('footer-business-name');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
    if (footerName) footerName.textContent = cfg.businessName || '';

    // ---- Navigation scroll behaviour ----
    var siteNav = document.getElementById('site-nav');
    if (siteNav) {
      var onScroll = function() {
        if (window.scrollY > 60) {
          siteNav.classList.add('scrolled');
        } else {
          siteNav.classList.remove('scrolled');
        }
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll(); // check initial state
    }

    // ---- Hamburger menu toggle ----
    var menuToggle = document.getElementById('menu-toggle');
    var mobileNav = document.getElementById('mobile-nav');

    if (menuToggle && mobileNav) {
      menuToggle.addEventListener('click', function() {
        var isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', String(!isOpen));
        if (isOpen) {
          mobileNav.setAttribute('hidden', '');
        } else {
          mobileNav.removeAttribute('hidden');
          // Ensure nav has solid background when menu is open
          if (siteNav) siteNav.classList.add('scrolled');
        }
      });

      // Close mobile nav on link click
      mobileNav.querySelectorAll('.mobile-link').forEach(function(link) {
        link.addEventListener('click', function() {
          menuToggle.setAttribute('aria-expanded', 'false');
          mobileNav.setAttribute('hidden', '');
        });
      });

      // Close on Escape
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
          menuToggle.setAttribute('aria-expanded', 'false');
          mobileNav.setAttribute('hidden', '');
          menuToggle.focus();
        }
      });

      // Close on scroll
      var scrollTimeout;
      window.addEventListener('scroll', function() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(function() {
          if (menuToggle.getAttribute('aria-expanded') === 'true') {
            menuToggle.setAttribute('aria-expanded', 'false');
            mobileNav.setAttribute('hidden', '');
          }
        }, 150);
      }, { passive: true });
    }

    // ---- Scroll-reveal animations ----
    initScrollReveal();
  }

  function initScrollReveal() {
    var revealElements = document.querySelectorAll('[data-reveal]:not(.revealed)');

    revealElements.forEach(function(el) {
      var delay = el.getAttribute('data-reveal-delay');
      if (delay) {
        el.style.transitionDelay = delay + 'ms';
      }
    });

    if (!('IntersectionObserver' in window)) {
      revealElements.forEach(function(el) {
        el.classList.add('revealed');
      });
      return;
    }

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -30px 0px'
    });

    revealElements.forEach(function(el) {
      observer.observe(el);
    });
  }

  // Wait for DOM and config
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    if (!window.SITE_CONFIG) {
      setTimeout(init, 100);
    } else {
      init();
    }
  }
})();
