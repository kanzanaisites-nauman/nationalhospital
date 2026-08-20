/* ==========================================================================
   NATIONAL HOSPITAL BAHAWALNAGAR — SITE INTERACTIONS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------------------------------------------------------------------
     0. RENDER DYNAMIC CONTENT FROM content.js (window.SITE_CONTENT)
     Everything here reads from content.js so the site can be updated via
     admin.html without touching this file or index.html.
  --------------------------------------------------------------------- */
  var DATA = window.SITE_CONTENT || {};

  function escapeHtml(str) {
    if (typeof str !== 'string') return '';
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // --- Google Analytics (only loads if a real Measurement ID is configured) ---
  if (DATA.analytics && DATA.analytics.gaMeasurementId) {
    var gaId = DATA.analytics.gaMeasurementId;
    var gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=' + gaId;
    document.head.appendChild(gaScript);
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', gaId);
  }

  // --- Keep Schema.org structured data in sync with admin-managed contact info ---
  var schemaScript = document.getElementById('schemaJsonLd');
  if (schemaScript && DATA.contact) {
    try {
      var schemaData = JSON.parse(schemaScript.textContent);
      if (DATA.contact.phoneHref) schemaData.telephone = '+' + DATA.contact.phoneHref.replace(/^\+/, '');
      if (DATA.contact.address) schemaData.address.streetAddress = DATA.contact.address.split(',').slice(0, -3).join(',').trim() || schemaData.address.streetAddress;
      schemaScript.textContent = JSON.stringify(schemaData);
    } catch (e) {
      console.warn('Could not sync Schema.org data:', e);
    }
  }

  // --- Branding: logo image + favicon (falls back to built-in SVG mark if empty) ---
  if (DATA.branding) {
    if (DATA.branding.logoImageUrl) {
      ['headerLogoMark', 'footerLogoMark'].forEach(function (id) {
        var mark = document.getElementById(id);
        if (mark) mark.innerHTML = '<img class="brand__logo" src="' + escapeHtml(DATA.branding.logoImageUrl) + '" alt="National Hospital Bahawalnagar logo">';
      });
    }
    if (DATA.branding.faviconImageUrl) {
      var faviconLink = document.getElementById('faviconLink');
      if (faviconLink) faviconLink.setAttribute('href', DATA.branding.faviconImageUrl);
    }
  }

  // --- Hero building image + avatar strip (any number of avatars) ---
  if (DATA.hero) {
    var heroBuildingImage = document.getElementById('heroBuildingImage');
    if (heroBuildingImage && DATA.hero.buildingImage) heroBuildingImage.setAttribute('src', DATA.hero.buildingImage);

    var heroAvatars = document.getElementById('heroAvatars');
    if (heroAvatars && Array.isArray(DATA.hero.avatarImages)) {
      heroAvatars.innerHTML = DATA.hero.avatarImages.map(function (src) {
        return '<img src="' + escapeHtml(src) + '" alt="">';
      }).join('');
    }
  }

  // --- Our Story image ---
  var ourStoryImageEl = document.getElementById('ourStoryImage');
  if (ourStoryImageEl && DATA.ourStoryImage) ourStoryImageEl.setAttribute('src', DATA.ourStoryImage);

  // --- Hospital's own Facebook/YouTube (footer icons) ---
  if (DATA.contact) {
    if (DATA.contact.facebookUrl) {
      document.querySelectorAll('[data-replace="facebook-url"]').forEach(function (el) {
        el.setAttribute('href', DATA.contact.facebookUrl);
        el.hidden = false;
      });
    }
    if (DATA.contact.youtubeUrl) {
      document.querySelectorAll('[data-replace="youtube-url"]').forEach(function (el) {
        el.setAttribute('href', DATA.contact.youtubeUrl);
        el.hidden = false;
      });
    }
  }

  var waBase = (DATA.contact && DATA.contact.whatsapp) || '923008588095';
  var waHomeMsg = encodeURIComponent('Hello, I want to book an appointment at National Hospital Bahawalnagar');

  // --- Doctors ---
  var doctorGrid = document.getElementById('doctorGrid');
  if (doctorGrid && Array.isArray(DATA.doctors)) {
    doctorGrid.innerHTML = DATA.doctors.map(function (doc) {
      var pageUrl = doc.pageUrl || '#';
      var altText = doc.name + ' at National Hospital Bahawalnagar';
      var waDocMsg = encodeURIComponent('Hello, I want to book an appointment with ' + doc.name);
      var socialBits = '';
      if (doc.facebookUrl && doc.facebookUrl !== '#') {
        socialBits += '<a href="' + escapeHtml(doc.facebookUrl) + '" class="social-icon social-icon--fb" aria-label="' + escapeHtml(doc.name) + ' on Facebook" target="_blank" rel="noopener"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 21v-8h2.7l.4-3.2h-3V7.9c0-.9.3-1.6 1.6-1.6h1.7V3.4C15.9 3.3 14.9 3.2 13.7 3.2c-2.6 0-4.4 1.6-4.4 4.5v2.1H6.6v3.2h2.7V21h4.2z"/></svg></a>';
      }
      if (doc.youtubeUrl && doc.youtubeUrl !== '#') {
        socialBits += '<a href="' + escapeHtml(doc.youtubeUrl) + '" class="social-icon social-icon--yt" aria-label="' + escapeHtml(doc.name) + ' on YouTube" target="_blank" rel="noopener"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M21.6 7.2c-.2-1-1-1.7-1.9-1.9C18 5 12 5 12 5s-6 0-7.7.3c-1 .2-1.7 1-1.9 1.9C2 9 2 12 2 12s0 3 .4 4.8c.2 1 1 1.7 1.9 1.9C6 19 12 19 12 19s6 0 7.7-.3c1-.2 1.7-1 1.9-1.9.4-1.8.4-4.8.4-4.8s0-3-.4-4.8zM10 15.5v-7l6 3.5-6 3.5z"/></svg></a>';
      }
      socialBits += '<a href="https://wa.me/' + escapeHtml(waBase) + '?text=' + waDocMsg + '" class="social-icon social-icon--wa" aria-label="Message on WhatsApp" target="_blank" rel="noopener"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2zm5.8 14.3c-.2.7-1.4 1.3-2 1.4-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5-4.5-.1-.2-1.2-1.6-1.2-3.1s.8-2.2 1.1-2.5c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .6l-.4.6c-.1.2-.3.4-.1.7.2.4.9 1.5 1.9 2.4 1.3 1.2 2.4 1.5 2.8 1.7.3.1.5.1.7-.1l.9-1c.2-.3.5-.2.8-.1l1.9.9c.2.1.4.2.5.3.1.2.1.9-.1 1.5z"/></svg></a>';
      return (
        '<article class="doctor-card">' +
          '<div class="doctor-card__photo">' +
            '<img src="' + escapeHtml(doc.photo) + '" alt="' + escapeHtml(altText) + '" loading="lazy">' +
            '<div class="doctor-card__overlay">' +
              '<a href="#booking" class="btn btn--outline-light btn--sm">Book Consultation</a>' +
            '</div>' +
          '</div>' +
          '<div class="doctor-card__body">' +
            '<h3>' + escapeHtml(doc.name) + '</h3>' +
            '<span class="doctor-card__role">' + escapeHtml(doc.role) + '</span>' +
            '<p>' + escapeHtml(doc.bio) + '</p>' +
            '<div class="doctor-card__actions">' +
              '<a href="' + escapeHtml(pageUrl) + '" class="btn btn--primary btn--sm">View Full Profile</a>' +
            '</div>' +
            '<div class="doctor-card__social">' + socialBits + '</div>' +
          '</div>' +
        '</article>'
      );
    }).join('');
  }

  // --- Videos (supports any platform: YouTube, Facebook, TikTok, Vimeo, Instagram, etc.) ---
  var videoGrid = document.getElementById('videoGrid');
  if (videoGrid && Array.isArray(DATA.videos)) {
    videoGrid.innerHTML = DATA.videos.map(function (video) {
      var platformLower = (video.platform || '').toLowerCase();
      var badgeClass = 'video-card__badge';
      if (platformLower === 'facebook') badgeClass += ' video-card__badge--fb';
      else if (platformLower && platformLower !== 'youtube') badgeClass += ' video-card__badge--other';
      var wideClass = video.wide ? ' video-card--wide' : '';
      return (
        '<button type="button" class="video-card' + wideClass + '" data-video-embed="' + escapeHtml(video.embedUrl) + '" data-video-title="' + escapeHtml(video.title) + '">' +
          '<img src="' + escapeHtml(video.thumbnail) + '" alt="" class="video-card__thumb">' +
          '<span class="video-card__play" aria-hidden="true"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></span>' +
          '<span class="' + badgeClass + '">' + escapeHtml(video.platform || 'Video') + '</span>' +
          '<span class="video-card__label">' + escapeHtml(video.title) + '</span>' +
        '</button>'
      );
    }).join('');
  }

  // --- Our Story points ---
  var storyPoints = document.getElementById('storyPoints');
  if (storyPoints && DATA.ourStory && Array.isArray(DATA.ourStory.points)) {
    storyPoints.innerHTML = DATA.ourStory.points.map(function (point) {
      return '<li>' + escapeHtml(point) + '</li>';
    }).join('');
    var storyEyebrow = document.getElementById('storyEyebrow');
    var storyTitle = document.getElementById('storyTitle');
    var storyParagraph = document.getElementById('storyParagraph');
    if (storyEyebrow && DATA.ourStory.eyebrow) storyEyebrow.textContent = DATA.ourStory.eyebrow;
    if (storyTitle && DATA.ourStory.title) storyTitle.textContent = DATA.ourStory.title;
    if (storyParagraph && DATA.ourStory.paragraph) storyParagraph.textContent = DATA.ourStory.paragraph;
  }

  // --- Visiting Hours table ---
  var hoursTable = document.getElementById('hoursTable');
  if (hoursTable && Array.isArray(DATA.hours)) {
    hoursTable.innerHTML = DATA.hours.map(function (row) {
      return '<tr><td>' + escapeHtml(row.day) + '</td><td>' + escapeHtml(row.time) + '</td></tr>';
    }).join('');
  }

  // --- FAQ accordion ---
  var faqList = document.getElementById('faqList');
  if (faqList && Array.isArray(DATA.faq)) {
    faqList.innerHTML = DATA.faq.map(function (item, index) {
      return (
        '<div class="faq-item">' +
          '<button type="button" class="faq-item__question" data-faq-toggle="' + index + '">' + escapeHtml(item.question) + '</button>' +
          '<div class="faq-item__answer" id="faqAnswer' + index + '"><p>' + escapeHtml(item.answer) + '</p></div>' +
        '</div>'
      );
    }).join('');

    faqList.querySelectorAll('[data-faq-toggle]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item = btn.closest('.faq-item');
        var answer = item.querySelector('.faq-item__answer');
        var isOpen = item.classList.contains('is-open');

        faqList.querySelectorAll('.faq-item.is-open').forEach(function (openItem) {
          if (openItem !== item) {
            openItem.classList.remove('is-open');
            openItem.querySelector('.faq-item__answer').style.maxHeight = null;
          }
        });

        if (isOpen) {
          item.classList.remove('is-open');
          answer.style.maxHeight = null;
        } else {
          item.classList.add('is-open');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    });
  }

  // --- Rating badge (hidden until a real rating value is configured) ---
  var ratingBadge = document.getElementById('ratingBadge');
  if (ratingBadge && DATA.rating && DATA.rating.value !== '' && DATA.rating.value != null) {
    ratingBadge.hidden = false;
    var ratingValueEl = document.getElementById('ratingBadgeValue');
    var ratingCountEl = document.getElementById('ratingBadgeCount');
    if (ratingValueEl) ratingValueEl.textContent = DATA.rating.value;
    if (ratingCountEl) {
      ratingCountEl.textContent = DATA.rating.count > 0
        ? '— ' + DATA.rating.count + ' reviews'
        : '— see reviews';
    }
    if (DATA.rating.googleReviewUrl && DATA.rating.googleReviewUrl !== '#') {
      ratingBadge.setAttribute('href', DATA.rating.googleReviewUrl);
    }
  }

  // --- Google Map embed ---
  var mapEmbed = document.getElementById('mapEmbed');
  var mapDirectionsBtn = document.getElementById('mapDirectionsBtn');
  if (mapEmbed && DATA.map && DATA.map.embedHtml) {
    mapEmbed.innerHTML = DATA.map.embedHtml;
  }
  if (mapDirectionsBtn && DATA.contact && DATA.contact.address) {
    mapDirectionsBtn.setAttribute(
      'href',
      'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(DATA.contact.address)
    );
  }

  // --- Review funnel (stars -> Google review or private feedback) ---
  var reviewStars = document.querySelectorAll('.review-star');
  var reviewFeedback = document.getElementById('reviewFeedback');
  var reviewFeedbackText = document.getElementById('reviewFeedbackText');
  var reviewFeedbackAction = document.getElementById('reviewFeedbackAction');

  reviewStars.forEach(function (star) {
    star.addEventListener('mouseenter', function () {
      var value = parseInt(star.getAttribute('data-star'), 10);
      reviewStars.forEach(function (s) {
        s.classList.toggle('is-hovered', parseInt(s.getAttribute('data-star'), 10) <= value);
      });
    });
    star.addEventListener('mouseleave', function () {
      reviewStars.forEach(function (s) { s.classList.remove('is-hovered'); });
    });

    star.addEventListener('click', function () {
      var value = parseInt(star.getAttribute('data-star'), 10);
      reviewStars.forEach(function (s) {
        s.classList.toggle('is-selected', parseInt(s.getAttribute('data-star'), 10) <= value);
      });

      if (!reviewFeedback) return;
      reviewFeedback.hidden = false;

      if (value >= 4) {
        if (reviewFeedbackText) reviewFeedbackText.textContent = 'Thank you! Please take a moment to share your experience publicly on Google — it really helps other patients find us.';
        if (reviewFeedbackAction) {
          reviewFeedbackAction.textContent = 'Leave a Google Review';
          reviewFeedbackAction.setAttribute('href', (DATA.rating && DATA.rating.googleReviewUrl) || '#');
        }
      } else {
        if (reviewFeedbackText) reviewFeedbackText.textContent = "We're sorry your experience wasn't great. Please message our care team directly so we can make it right.";
        if (reviewFeedbackAction) {
          reviewFeedbackAction.textContent = 'Message Us on WhatsApp';
          var waNumber = (DATA.contact && DATA.contact.whatsapp) || '';
          reviewFeedbackAction.setAttribute('href', 'https://wa.me/' + waNumber + '?text=' + encodeURIComponent('I would like to share feedback about my recent visit to National Hospital Bahawalnagar.'));
        }
      }
    });
  });

  // --- Contact details (phone, whatsapp, address) wired from content.js ---
  if (DATA.contact) {
    document.querySelectorAll('a[href^="tel:"]').forEach(function (link) {
      if (DATA.contact.phoneHref) link.setAttribute('href', 'tel:' + DATA.contact.phoneHref);
    });
    document.querySelectorAll('.utility-bar__phone, .booking__helpline a').forEach(function (el) {
      if (el.tagName === 'A' && el.getAttribute('href') && el.getAttribute('href').indexOf('tel:') === 0 && DATA.contact.phone) {
        el.childNodes.forEach(function (node) {
          if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) {
            node.textContent = ' ' + DATA.contact.phone;
          }
        });
      }
    });
    var whatsappFloat = document.getElementById('whatsappFloat');
    if (whatsappFloat && DATA.contact.whatsapp) {
      var floatMsg = whatsappFloat.getAttribute('data-wa-message') || 'Hello, I want to book an appointment at National Hospital Bahawalnagar';
      whatsappFloat.setAttribute('href', 'https://wa.me/' + DATA.contact.whatsapp + '?text=' + encodeURIComponent(floatMsg));
    }
  }


  /* ---------------------------------------------------------------------
     1. STICKY HEADER SCROLL TRACKING
  --------------------------------------------------------------------- */
  var siteHeader = document.getElementById('siteHeader');
  var scrollThreshold = 12;

  function updateHeaderState() {
    if (!siteHeader) return;
    if (window.scrollY > scrollThreshold) {
      siteHeader.classList.add('is-scrolled');
    } else {
      siteHeader.classList.remove('is-scrolled');
    }
  }
  updateHeaderState();
  window.addEventListener('scroll', updateHeaderState, { passive: true });


  /* ---------------------------------------------------------------------
     2. MOBILE MENU OVERLAY MECHANICS
  --------------------------------------------------------------------- */
  var hamburgerBtn = document.getElementById('hamburgerBtn');
  var mobileMenu = document.getElementById('mobileMenu');
  var mobileMenuClose = document.getElementById('mobileMenuClose');
  var mobileMenuLinks = mobileMenu ? mobileMenu.querySelectorAll('.mobile-menu__link, .btn') : [];
  var lastFocusedElement = null;

  function openMobileMenu() {
    if (!mobileMenu || !hamburgerBtn) return;
    lastFocusedElement = document.activeElement;
    mobileMenu.classList.add('is-open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    if (mobileMenuClose) mobileMenuClose.focus();
  }

  function closeMobileMenu() {
    if (!mobileMenu || !hamburgerBtn) return;
    mobileMenu.classList.remove('is-open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (lastFocusedElement) lastFocusedElement.focus();
  }

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', function () {
      var isOpen = mobileMenu.classList.contains('is-open');
      if (isOpen) { closeMobileMenu(); } else { openMobileMenu(); }
    });
  }

  if (mobileMenuClose) {
    mobileMenuClose.addEventListener('click', closeMobileMenu);
  }

  mobileMenuLinks.forEach(function (link) {
    link.addEventListener('click', closeMobileMenu);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('is-open')) {
      closeMobileMenu();
    }
  });


  /* ---------------------------------------------------------------------
     3. DYNAMIC COPYRIGHT YEAR
  --------------------------------------------------------------------- */
  var yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }


  /* ---------------------------------------------------------------------
     4. APPOINTMENT DATE — ANTI-HISTORICAL CONSTRAINT
     Prevents selecting a past date, and caps booking horizon at 90 days.
  --------------------------------------------------------------------- */
  var appointmentDateInput = document.getElementById('appointmentDate');

  function formatDateForInput(date) {
    var year = date.getFullYear();
    var month = String(date.getMonth() + 1).padStart(2, '0');
    var day = String(date.getDate()).padStart(2, '0');
    return year + '-' + month + '-' + day;
  }

  if (appointmentDateInput) {
    var today = new Date();
    var maxDate = new Date();
    maxDate.setDate(today.getDate() + 90);

    appointmentDateInput.setAttribute('min', formatDateForInput(today));
    appointmentDateInput.setAttribute('max', formatDateForInput(maxDate));
  }


  /* ---------------------------------------------------------------------
     5. BOOKING ENGINE — CLIENT-SIDE VALIDATION & SUBMISSION STATE
  --------------------------------------------------------------------- */
  var appointmentForm = document.getElementById('appointmentForm');
  var bookingSuccess = document.getElementById('bookingSuccess');
  var bookingSuccessText = document.getElementById('bookingSuccessText');
  var bookAnotherBtn = document.getElementById('bookAnotherBtn');

  var validators = {
    fullName: function (value) {
      return value.trim().length >= 3;
    },
    patientPhone: function (value) {
      return /^0?3[0-9]{2}[- ]?[0-9]{7}$/.test(value.trim());
    },
    department: function (value) {
      return value.trim().length > 0;
    },
    appointmentDate: function (value) {
      if (!value) return false;
      var selected = new Date(value + 'T00:00:00');
      var floor = new Date();
      floor.setHours(0, 0, 0, 0);
      return selected >= floor;
    }
  };

  function setFieldState(fieldName, isValid) {
    var input = appointmentForm.elements[fieldName];
    if (!input) return;
    var fieldWrapper = input.closest('.field');
    if (!fieldWrapper) return;

    if (isValid) {
      fieldWrapper.classList.remove('has-error');
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
    } else {
      fieldWrapper.classList.add('has-error');
      input.classList.add('is-invalid');
      input.classList.remove('is-valid');
    }
  }

  function validateField(fieldName) {
    var input = appointmentForm.elements[fieldName];
    if (!input || !validators[fieldName]) return true;
    var isValid = validators[fieldName](input.value);
    setFieldState(fieldName, isValid);
    return isValid;
  }

  if (appointmentForm) {
    Object.keys(validators).forEach(function (fieldName) {
      var input = appointmentForm.elements[fieldName];
      if (!input) return;
      input.addEventListener('blur', function () { validateField(fieldName); });
      input.addEventListener('input', function () {
        var fieldWrapper = input.closest('.field');
        if (fieldWrapper && fieldWrapper.classList.contains('has-error')) {
          validateField(fieldName);
        }
      });
    });

    appointmentForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var fieldNames = Object.keys(validators);
      var allValid = fieldNames.reduce(function (acc, fieldName) {
        var isValid = validateField(fieldName);
        return acc && isValid;
      }, true);

      if (!allValid) {
        var firstInvalid = appointmentForm.querySelector('.field.has-error input, .field.has-error select');
        if (firstInvalid) {
          firstInvalid.focus();
          firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      var submitBtn = appointmentForm.querySelector('button[type="submit"]');
      var originalLabel = submitBtn ? submitBtn.querySelector('.btn__label').textContent : '';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.querySelector('.btn__label').textContent = 'Submitting…';
      }

      var patientName = appointmentForm.elements['fullName'].value.trim();
      var patientPhone = appointmentForm.elements['patientPhone'].value.trim();
      var department = appointmentForm.elements['department'].value;
      var appointmentDate = appointmentForm.elements['appointmentDate'].value;
      var notes = appointmentForm.elements['notes'].value.trim();

      var formattedDate = new Date(appointmentDate + 'T00:00:00').toLocaleDateString('en-GB', {
        day: 'numeric', month: 'long', year: 'numeric'
      });

      function showBookingSuccess() {
        if (bookingSuccessText) {
          bookingSuccessText.textContent = 'Thank you, ' + patientName + '. Your request for ' + department +
            ' on ' + formattedDate + ' has been received. Our patient care desk will call you shortly to confirm.';
        }
        appointmentForm.hidden = true;
        if (bookingSuccess) bookingSuccess.hidden = false;

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.querySelector('.btn__label').textContent = originalLabel;
        }
      }

      var web3formsKey = (DATA.booking && DATA.booking.web3formsAccessKey) || '';

      if (web3formsKey) {
        fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            access_key: web3formsKey,
            subject: 'New Appointment Request — National Hospital Bahawalnagar',
            from_name: 'National Hospital Website',
            'Patient Name': patientName,
            'Mobile Number': patientPhone,
            'Department': department,
            'Preferred Date': formattedDate,
            'Notes': notes || '(none)'
          })
        })
          .then(function (res) { return res.json(); })
          .then(function (result) {
            showBookingSuccess();
            if (!result.success) {
              console.warn('Web3Forms reported an issue delivering this booking:', result.message);
            }
          })
          .catch(function (err) {
            console.warn('Booking form could not reach Web3Forms, showing confirmation anyway:', err);
            showBookingSuccess();
          });
      } else {
        console.warn('National Hospital site: booking form has no web3formsAccessKey configured in content.js — submissions are not being delivered anywhere yet.');
        window.setTimeout(showBookingSuccess, 700);
      }
    });
  }

  if (bookAnotherBtn) {
    bookAnotherBtn.addEventListener('click', function () {
      appointmentForm.reset();
      Object.keys(validators).forEach(function (fieldName) {
        var input = appointmentForm.elements[fieldName];
        if (!input) return;
        var fieldWrapper = input.closest('.field');
        if (fieldWrapper) fieldWrapper.classList.remove('has-error');
        input.classList.remove('is-invalid', 'is-valid');
      });
      if (appointmentDateInput) {
        appointmentDateInput.setAttribute('min', formatDateForInput(new Date()));
      }
      appointmentForm.hidden = false;
      bookingSuccess.hidden = true;
      appointmentForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }


  /* ---------------------------------------------------------------------
     6. VIDEO LIGHTBOX (YouTube / Facebook embeds)
  --------------------------------------------------------------------- */
  var videoModal = document.getElementById('videoModal');
  var videoModalFrame = document.getElementById('videoModalFrame');
  var videoModalClose = document.getElementById('videoModalClose');
  var videoCards = document.querySelectorAll('.video-card');
  var videoModalCloseTriggers = videoModal ? videoModal.querySelectorAll('[data-modal-close]') : [];
  var lastVideoTrigger = null;

  function openVideoModal(embedUrl, title) {
    if (!videoModal || !videoModalFrame) return;
    var iframe = document.createElement('iframe');
    iframe.src = embedUrl;
    iframe.title = title || 'Hospital video';
    iframe.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture; fullscreen');
    iframe.setAttribute('allowfullscreen', 'true');
    videoModalFrame.innerHTML = '';
    videoModalFrame.appendChild(iframe);
    videoModal.classList.add('is-open');
    videoModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (videoModalClose) videoModalClose.focus();
  }

  function closeVideoModal() {
    if (!videoModal || !videoModalFrame) return;
    videoModal.classList.remove('is-open');
    videoModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    videoModalFrame.innerHTML = '';
    if (lastVideoTrigger) lastVideoTrigger.focus();
  }

  // Re-query after dynamic render from content.js
  videoCards = document.querySelectorAll('.video-card');
  videoCards.forEach(function (card) {
    card.addEventListener('click', function () {
      lastVideoTrigger = card;
      var embedUrl = card.getAttribute('data-video-embed');
      var title = card.getAttribute('data-video-title');
      if (!embedUrl || embedUrl.indexOf('VIDEO_ID_HERE') !== -1 || embedUrl.indexOf('YOUR_FACEBOOK_VIDEO_URL_HERE') !== -1 || embedUrl.indexOf('TODO') !== -1) {
        return;
      }
      openVideoModal(embedUrl, title);
    });
  });

  if (videoModalClose) videoModalClose.addEventListener('click', closeVideoModal);
  videoModalCloseTriggers.forEach(function (el) { el.addEventListener('click', closeVideoModal); });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && videoModal && videoModal.classList.contains('is-open')) {
      closeVideoModal();
    }
  });


  /* ---------------------------------------------------------------------
     7. SMOOTH ANCHOR SCROLL OFFSET (accounts for sticky header height)
  --------------------------------------------------------------------- */
  var anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
  anchorLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      var targetId = link.getAttribute('href').slice(1);
      var targetEl = document.getElementById(targetId);
      if (!targetEl) return;
      e.preventDefault();
      var headerOffset = (siteHeader ? siteHeader.offsetHeight : 0) + 16;
      var targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - headerOffset;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    });
  });

});
