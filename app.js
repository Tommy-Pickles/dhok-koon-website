(function () {
  function init() {
    const cfg = window.SITE_CONFIG || {};
    if (!cfg.businessName) {
      console.error('SITE_CONFIG not loaded');
      return;
    }

    function setText(id, value) {
      const el = document.getElementById(id);
      if (el) el.textContent = value || '';
    }

    const logoImg = document.getElementById('logo-image');
    if (logoImg && cfg.logoUrl) {
      logoImg.src = cfg.logoUrl;
      logoImg.onerror = function() {
        console.error('Logo image not found:', cfg.logoUrl);
      };
    }
    setText('business-name', cfg.businessName);

    const floatingCall = document.getElementById('floating-call');
    if (cfg.phoneNumber && floatingCall) {
      floatingCall.href = `tel:${cfg.phoneNumber.replace(/\s|\(|\)|-/g, '')}`;
    } else if (floatingCall) {
      floatingCall.setAttribute('hidden', '');
    }

    // Hero: business name as title, blurb below
    setText('headline', cfg.businessName);
    setText('tagline', cfg.tagline);
    setText('hours-summary', cfg.hoursSummary);
    const cover = document.getElementById('cover-image');
    if (cover && cfg.coverImageUrl) {
      cover.src = cfg.coverImageUrl;
      cover.onerror = function() {
        console.error('Cover image not found:', cfg.coverImageUrl);
      };
    }

    const ctaDirections = document.getElementById('cta-directions');
    if (ctaDirections && cfg.addressLines && cfg.addressLines.length) {
      const addressQuery = encodeURIComponent(cfg.addressLines.join(', '));
      const isApple = /iPhone|iPad|Macintosh/.test(navigator.userAgent);
      ctaDirections.href = isApple ? `https://maps.apple.com/?q=${addressQuery}` : `https://www.google.com/maps/search/?api=1&query=${addressQuery}`;
    } else if (ctaDirections) {
      ctaDirections.setAttribute('hidden', '');
    }

    function renderMenuSection(targetId, items) {
      const container = document.getElementById(targetId);
      if (!container || !Array.isArray(items)) return;
      container.innerHTML = items.map(item => {
        const price = item.price ? `<div class="price">${item.price}</div>` : '';
        const desc = item.description ? `<div class="desc">${item.description}</div>` : '';
        return `<div class="card"><div class="card-body"><div class="title">${item.title || ''}</div>${desc}${price}</div></div>`;
      }).join('');
    }
    if (cfg.menu) {
      renderMenuSection('menu-entrees', cfg.menu.entrees);
      renderMenuSection('menu-mains', cfg.menu.mains);
      renderMenuSection('menu-desserts', cfg.menu.desserts);
    }

    // Contact buttons
    const btnAddress = document.getElementById('btn-address');
    const btnEmail = document.getElementById('btn-email');
    const btnPhone = document.getElementById('btn-phone');
    const btnAddressText = document.getElementById('btn-address-text');
    const btnEmailText = document.getElementById('btn-email-text');
    const btnPhoneText = document.getElementById('btn-phone-text');
    
    if (btnAddress && cfg.addressLines && cfg.addressLines.length) {
      const addressQuery = encodeURIComponent(cfg.addressLines.join(', '));
      const isApple = /iPhone|iPad|Macintosh/.test(navigator.userAgent);
      btnAddress.href = isApple ? `https://maps.apple.com/?q=${addressQuery}` : `https://www.google.com/maps/search/?api=1&query=${addressQuery}`;
      if (btnAddressText) btnAddressText.textContent = cfg.addressLines[0];
    } else if (btnAddress) {
      btnAddress.setAttribute('hidden', '');
    }
    
    if (btnEmail && cfg.email) {
      btnEmail.href = `mailto:${cfg.email}`;
      if (btnEmailText) btnEmailText.textContent = cfg.email;
    } else if (btnEmail) {
      btnEmail.setAttribute('hidden', '');
    }
    
    if (btnPhone && cfg.phoneNumber) {
      btnPhone.href = `tel:${cfg.phoneNumber.replace(/\s|\(|\)|-/g, '')}`;
      if (btnPhoneText) btnPhoneText.textContent = cfg.phoneNumber;
    } else if (btnPhone) {
      btnPhone.setAttribute('hidden', '');
    }

    const hoursEl = document.getElementById('contact-hours');
    if (hoursEl && Array.isArray(cfg.openingHours)) {
      hoursEl.innerHTML = cfg.openingHours.map(h => {
        return `<div class="hours-row"><span class="hours-day">${h.day}</span><span class="hours-time">${h.hours}</span></div>`;
      }).join('');
    }

    // Reviews (static + optional Google Places)
    const reviewsSummary = document.getElementById('reviews-summary');
    const reviewsList = document.getElementById('reviews-list');
    if (cfg.reviews && reviewsSummary) {
      const rating = cfg.reviews.overallRating || 0;
      const total = cfg.reviews.totalReviews || 0;
      reviewsSummary.textContent = `Rating ${rating.toFixed(1)} / 5 (${total} reviews)`;
    }
    if (cfg.reviews && reviewsList && Array.isArray(cfg.reviews.items)) {
      reviewsList.innerHTML = cfg.reviews.items.map(r => {
        const stars = '★'.repeat(Math.max(0, Math.min(5, r.stars || 0)));
        return `<div class="review-card"><div class="review-stars">${stars}</div><div class="review-text">${r.text || ''}</div><div class="review-author">${r.author || ''}</div></div>`;
      }).join('');
    }
    
    async function loadPlacesReviews() {
      const g = window.GOOGLE_PLACES || {};
      if (!g.apiKey || !g.placeId) return;
      try {
        const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(g.placeId)}`;
        const fieldMask = 'rating,userRatingsTotal,reviews';
        const res = await fetch(`${url}?fields=${encodeURIComponent(fieldMask)}`, {
          headers: { 'X-Goog-Api-Key': g.apiKey, 'X-Goog-FieldMask': fieldMask }
        });
        if (!res.ok) throw new Error('Failed to fetch Google Places');
        const data = await res.json();
        if (reviewsSummary && typeof data.rating === 'number') {
          const rating = data.rating;
          const total = data.userRatingsTotal || 0;
          reviewsSummary.textContent = `Google rating ${rating.toFixed(1)} / 5 (${total} reviews)`;
        }
        if (reviewsList && Array.isArray(data.reviews)) {
          reviewsList.innerHTML = data.reviews.slice(0, 6).map(r => {
            const stars = '★'.repeat(Math.round(r.rating || 0));
            const text = (r.text && (r.text.text || r.text)) || '';
            const author = (r.authorAttribution && r.authorAttribution.displayName) || '';
            return `<div class="review-card"><div class="review-stars">${stars}</div><div class="review-text">${text}</div><div class="review-author">${author}</div></div>`;
          }).join('');
        }
      } catch (e) {
        console.error('Error loading Google Places reviews:', e);
      }
    }
    loadPlacesReviews();

    // Smooth scroll and logo to top
    document.documentElement.style.scrollBehavior = 'smooth';
    const logoLink = document.getElementById('logo-link');
    if (logoLink) {
      logoLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        history.replaceState(null, '', '#home');
      });
    }

    // Footer year
    const yearEl = document.getElementById('year');
    const footerName = document.getElementById('footer-business-name');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
    if (footerName) footerName.textContent = cfg.businessName || '';
  }

  // Wait for DOM and config to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // If config isn't loaded yet, wait a bit
    if (!window.SITE_CONFIG) {
      setTimeout(init, 100);
    } else {
      init();
    }
  }
})();

