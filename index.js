/* ============================================================
   PORTFOLIO JS — Federico Lopez
   - Navbar: scroll effect + active section highlight
   - Mobile menu toggle
   - 3D Tilt effect on portfolio cards (vanilla, no deps)
   - ScrollReveal animations
   ============================================================ */

// ========================
// NAVBAR
// ========================
const navbar  = document.getElementById('navbar');
const menuBtn = document.getElementById('menu-toggle');
const navLinks = document.getElementById('navbar-links');
const sections = document.querySelectorAll('section');

// Scroll: add .scrolled class + update background
window.addEventListener('scroll', () => {
  if (window.scrollY > 80) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Mobile menu toggle
if (menuBtn && navLinks) {
  menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('visible');
    const icon = menuBtn.querySelector('i');
    if (icon) {
      icon.classList.toggle('fa-bars');
      icon.classList.toggle('fa-times');
    }
  });

  // Close menu when a link is clicked
  navLinks.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      navLinks.classList.remove('visible');
      const icon = menuBtn.querySelector('i');
      if (icon) {
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-times');
      }
    }
  });
}

// ========================
// ACTIVE NAV LINK (Intersection Observer)
// ========================
const observerConfig = {
  rootMargin: '-30% 0px -60% 0px',
  threshold: 0,
};

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      const currentActive = document.querySelector('.navbar__link.active');
      const shouldBeActive = document.querySelector(`.navbar__link[data-ref="${id}"]`);
      if (currentActive) currentActive.classList.remove('active');
      if (shouldBeActive) shouldBeActive.classList.add('active');
    }
  });
}, observerConfig);

sections.forEach((section) => sectionObserver.observe(section));

// ========================
// 3D CARD TILT EFFECT
// ========================
function initCardTilt() {
  const cards = document.querySelectorAll('.card-3d');

  cards.forEach((card) => {
    const inner = card.querySelector('.card-3d__inner');
    const shine = card.querySelector('.card-3d__shine');

    if (!inner) return;

    let rafId = null;
    let isHovered = false;

    card.addEventListener('mouseenter', () => {
      isHovered = true;
      // Fast response on enter
      inner.style.transition = 'transform 0.1s ease, border-color 0.3s ease, box-shadow 0.3s ease';
    });

    card.addEventListener('mousemove', (e) => {
      if (!isHovered) return;

      if (rafId) cancelAnimationFrame(rafId);

      rafId = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const halfW = rect.width  / 2;
        const halfH = rect.height / 2;

        // Tilt angles (max ±14 degrees)
        const tiltY =  ((x - halfW) / halfW) * 14;
        const tiltX = -((y - halfH) / halfH) * 14;

        inner.style.transform = `
          perspective(1200px)
          rotateX(${tiltX}deg)
          rotateY(${tiltY}deg)
          scale3d(1.025, 1.025, 1.025)
        `;

        // Shine position (CSS custom properties)
        if (shine) {
          const mx = ((x / rect.width)  * 100).toFixed(1);
          const my = ((y / rect.height) * 100).toFixed(1);
          shine.style.setProperty('--mx', `${mx}%`);
          shine.style.setProperty('--my', `${my}%`);
        }
      });
    });

    card.addEventListener('mouseleave', () => {
      isHovered = false;
      if (rafId) cancelAnimationFrame(rafId);

      // Smooth return to flat
      inner.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1), border-color 0.3s ease, box-shadow 0.3s ease';
      inner.style.transform  = 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

// ========================
// SCROLL REVEAL
// ========================
function initScrollReveal() {
  if (typeof ScrollReveal === 'undefined') return;

  const sr = ScrollReveal({
    origin: 'bottom',
    distance: '30px',
    duration: 700,
    delay: 0,
    easing: 'cubic-bezier(0.5, 0, 0, 1)',
    reset: false,
  });

  sr.reveal('.home__description', { delay: 200, origin: 'bottom' });
  sr.reveal('.section__title',    { delay: 100 });
  sr.reveal('.section__subtitle', { delay: 180 });
  sr.reveal('.about__description',{ delay: 150 });
  sr.reveal('.button--cta',       { delay: 250 });
  sr.reveal('.skill__title',      { delay: 100 });
  sr.reveal('.skill__item',       { delay: 100, interval: 60 });
  sr.reveal('.services__item',    { delay: 80,  interval: 80 });
  sr.reveal('.card-3d',           { delay: 80,  interval: 80 });
  sr.reveal('.contact__item',     { delay: 80,  interval: 80 });
}

// ========================
// INIT
// ========================
document.addEventListener('DOMContentLoaded', () => {
  initCardTilt();
  initScrollReveal();
});
