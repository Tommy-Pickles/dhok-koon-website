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
      logoImg.src = 'dok-koon-widelogo-noBG.png';
      logoImg.onerror = function() { console.error('Wide logo not found'); };
    }
    if (footerLogoImg && cfg.logoUrl) {
      footerLogoImg.src = cfg.logoUrl;
    }

    function cleanPhone(p) { return (p || '').replace(/\s|\(|\)|–|-/g, ''); }

    // Floating call button
    var floatingCall = document.getElementById('floating-call');
    if (cfg.phoneNumber && floatingCall) {
      floatingCall.href = 'tel:' + cleanPhone(cfg.phoneNumber);
    } else if (floatingCall) {
      floatingCall.setAttribute('hidden', '');
    }

    // Nav phone button
    var navPhone = document.getElementById('nav-phone');
    var navPhoneText = navPhone && navPhone.querySelector('.nav-phone-text');
    if (navPhone && cfg.phoneNumber) {
      navPhone.href = 'tel:' + cleanPhone(cfg.phoneNumber);
      if (navPhoneText) navPhoneText.textContent = cfg.phoneNumber;
    } else if (navPhone) {
      navPhone.setAttribute('hidden', '');
    }

    // Mobile phone link
    var mobilePhone = document.getElementById('mobile-phone');
    if (mobilePhone && cfg.phoneNumber) {
      mobilePhone.href = 'tel:' + cleanPhone(cfg.phoneNumber);
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
      cover.onload = function() { cover.classList.add('loaded'); };
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

    // Menu rendering — name + price shown; click to reveal description
    function renderMenuSection(sectionId, data) {
      var section = document.getElementById(sectionId);
      if (!section) return;
      var container = section.querySelector('.menu-items');
      // Support both array format and {priceGuide, items} format
      var items = Array.isArray(data) ? data : (data && data.items) || [];
      var priceGuide = (!Array.isArray(data) && data && data.priceGuide) || null;
      if (!container || items.length === 0) {
        section.style.display = 'none';
        var categoryEl = section.querySelector('.menu-category');
        if (categoryEl) {
          var tabHref = '#' + categoryEl.id;
          var tab = document.querySelector('.menu-tab[href="' + tabHref + '"]');
          if (tab) tab.style.display = 'none';
        }
        return;
      }
      var guideHtml = priceGuide
        ? '<div class="menu-price-guide">' + priceGuide + '</div>'
        : '';
      container.innerHTML = guideHtml + items.map(function(item, index) {
        var hasDesc = item.description && item.description.trim().length > 0;
        var price = item.price
          ? '<span class="menu-item-price">' + item.price + '</span>'
          : '';
        var delay = index * 40;
        if (hasDesc) {
          return '<div class="menu-item has-desc" data-reveal="fade-up" data-reveal-delay="' + delay + '">' +
                 '<div class="menu-item-row">' +
                 '<div class="menu-item-info"><div class="menu-item-name">' + (item.title || '') + '</div></div>' +
                 price +
                 '<span class="menu-item-chevron" aria-hidden="true">›</span>' +
                 '</div>' +
                 '<div class="menu-item-body" hidden>' +
                 '<div class="menu-item-desc">' + item.description + '</div>' +
                 '</div>' +
                 '</div>';
        }
        return '<div class="menu-item" data-reveal="fade-up" data-reveal-delay="' + delay + '">' +
               '<div class="menu-item-row">' +
               '<div class="menu-item-info"><div class="menu-item-name">' + (item.title || '') + '</div></div>' +
               price +
               '</div>' +
               '</div>';
      }).join('');

      // Accordion click handler
      container.addEventListener('click', function(e) {
        var row = e.target.closest('.menu-item-row');
        if (!row) return;
        var item = row.closest('.menu-item.has-desc');
        if (!item) return;
        var body = item.querySelector('.menu-item-body');
        var expanded = item.classList.toggle('expanded');
        if (body) {
          if (expanded) body.removeAttribute('hidden');
          else body.setAttribute('hidden', '');
        }
      });
    }

    if (cfg.menu) {
      renderMenuSection('menu-section-entrees', cfg.menu.entrees);
      renderMenuSection('menu-section-soups', cfg.menu.soups);
      renderMenuSection('menu-section-salads', cfg.menu.salads);
      renderMenuSection('menu-section-curries', cfg.menu.curries);
      renderMenuSection('menu-section-noodles', cfg.menu.noodles);
      renderMenuSection('menu-section-stirfried', cfg.menu.stirFried);
      renderMenuSection('menu-section-specials', cfg.menu.specials);
      renderMenuSection('menu-section-desserts', cfg.menu.desserts);
    }

    // Contact buttons
    var btnAddress = document.getElementById('btn-address');
    var btnPhone = document.getElementById('btn-phone');
    var btnPhone2 = document.getElementById('btn-phone2');
    var btnAddressText = document.getElementById('btn-address-text');
    var btnPhoneText = document.getElementById('btn-phone-text');
    var btnPhone2Text = document.getElementById('btn-phone2-text');

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

    if (btnPhone && cfg.phoneNumber) {
      btnPhone.href = 'tel:' + cleanPhone(cfg.phoneNumber);
      if (btnPhoneText) btnPhoneText.textContent = cfg.phoneNumber;
    } else if (btnPhone) {
      btnPhone.setAttribute('hidden', '');
    }

    if (btnPhone2 && cfg.phoneNumber2) {
      btnPhone2.href = 'tel:' + cleanPhone(cfg.phoneNumber2);
      if (btnPhone2Text) btnPhone2Text.textContent = cfg.phoneNumber2;
      btnPhone2.removeAttribute('hidden');
    }

    // Service info badges (B.Y.O, Dine In, Takeaway, Delivery)
    var servicesEl = document.getElementById('contact-services');
    if (servicesEl && Array.isArray(cfg.serviceInfo) && cfg.serviceInfo.length) {
      servicesEl.innerHTML = cfg.serviceInfo.map(function(s) {
        return '<span class="contact-service">' + s + '</span>';
      }).join('');
    }

    // Opening hours
    var hoursEl = document.getElementById('contact-hours');
    if (hoursEl && Array.isArray(cfg.openingHours)) {
      hoursEl.innerHTML = cfg.openingHours.map(function(h) {
        return '<div class="hours-row"><span class="hours-day">' + h.day + '</span><span class="hours-time">' + h.hours + '</span></div>';
      }).join('');
    }

    // Reviews — overall rating display
    var reviewsSummary = document.getElementById('reviews-summary');

    if (cfg.reviews && reviewsSummary) {
      var rating = cfg.reviews.overallRating || 0;
      var total = cfg.reviews.totalReviews || 0;
      var fullStars = Math.floor(rating);
      var emptyStars = 5 - fullStars;
      var starsHtml = '<span class="reviews-stars-filled">' + '\u2605'.repeat(fullStars) + '</span>' +
                      '<span class="reviews-stars-empty">' + '\u2605'.repeat(emptyStars) + '</span>';
      reviewsSummary.innerHTML =
        '<div class="reviews-rating-number">' + rating.toFixed(1) + '</div>' +
        '<div class="reviews-stars-row">' + starsHtml + '</div>' +
        '<div class="reviews-count">Based on ' + total + ' Google reviews</div>';
    }

    // Google Reviews link
    var reviewsGoogleLink = document.getElementById('reviews-google-link');
    if (reviewsGoogleLink && cfg.googleMapsUrl) {
      reviewsGoogleLink.href = cfg.googleMapsUrl;
    } else if (reviewsGoogleLink) {
      reviewsGoogleLink.closest('.reviews-google-cta').setAttribute('hidden', '');
    }


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
