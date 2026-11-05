// ============================================
// Main Portfolio — Enhanced Features
// Scroll-to-top, typing animation, smooth interactions
// ============================================

(function() {
  'use strict';

  // ===== Scroll-to-Top Button =====
  function createScrollToTop() {
    const btn = document.createElement('button');
    btn.className = 'scroll-top-btn';
    btn.setAttribute('aria-label', 'Scroll to top');
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>';
    document.body.appendChild(btn);

    window.addEventListener('scroll', function() {
      if (window.scrollY > 400) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    });

    btn.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ===== Typing Animation for Hero =====
  function initTypingAnimation() {
    const roleEl = document.querySelector('.hero-role');
    if (!roleEl) return;

    const roles = ['Developer & Creator', 'BIT Student', 'Problem Solver', 'Web Enthusiast'];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
      const currentRole = roles[roleIndex];
      
      if (isDeleting) {
        roleEl.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
      } else {
        roleEl.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
      }

      if (!isDeleting && charIndex === currentRole.length) {
        typingSpeed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 500;
      }

      setTimeout(type, typingSpeed);
    }

    // Start after a delay
    setTimeout(type, 1000);
  }

  // ===== Smooth Reveal on Scroll =====
  function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.project-card, .skill-card, .timeline-item, .feature-card, .about-card, .info-card').forEach(el => {
      el.classList.add('reveal');
      observer.observe(el);
    });
  }

  // ===== Initialize =====
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      createScrollToTop();
      initTypingAnimation();
      initScrollReveal();
    });
  } else {
    createScrollToTop();
    initTypingAnimation();
    initScrollReveal();
  }
})();
