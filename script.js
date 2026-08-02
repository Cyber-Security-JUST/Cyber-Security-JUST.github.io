/* =============================================
   SCRIPT.JS — CyberSecurity Lab JUST
   ============================================= */

// ── PRELOADER ────────────────────────────────
(function () {
  const preloader = document.getElementById('preloader');
  const pbar = document.getElementById('pbar');
  const ppct = document.getElementById('ppct');
  if (!preloader) return;

  let p = 0;
  const iv = setInterval(() => {
    p = Math.min(p + (Math.random() * 6 + 2), 90);
    if (pbar) pbar.style.width = p + '%';
    if (ppct) ppct.textContent = Math.round(p) + '%';
    if (p >= 90) clearInterval(iv);
  }, 80);

  function finish() {
    clearInterval(iv);
    let cp = p;
    const iv2 = setInterval(() => {
      cp = Math.min(cp + 4, 100);
      if (pbar) pbar.style.width = cp + '%';
      if (ppct) ppct.textContent = cp + '%';
      if (cp >= 100) {
        clearInterval(iv2);
        setTimeout(() => {
          preloader.classList.add('hidden');
          setTimeout(() => { preloader.style.display = 'none'; }, 900);
        }, 300);
      }
    }, 12);
  }

  if (document.readyState === 'complete') {
    finish();
  } else {
    window.addEventListener('load', finish);
    setTimeout(() => { if (!preloader.classList.contains('hidden')) finish(); }, 6000);
  }
})();

// ── SCROLL PROGRESS ───────────────────────────
const scrollBar = document.getElementById('scrollBar');
const bttBtn    = document.getElementById('backToTop');
const bttCircle = document.getElementById('bttCircle');
const navbar    = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  const st = window.scrollY;
  const dh = document.documentElement.scrollHeight - window.innerHeight;
  const pct = dh > 0 ? (st / dh) * 100 : 0;

  if (scrollBar) scrollBar.style.width = pct + '%';

  // Navbar scroll class
  if (navbar) {
    navbar.classList.toggle('scrolled', st > 60);
  }

  // Back-to-top
  if (bttBtn) {
    bttBtn.classList.toggle('visible', st > 500);
    if (bttCircle) {
      const circ = 125.66;
      bttCircle.style.strokeDashoffset = circ - (pct / 100) * circ;
    }
  }
}, { passive: true });

if (bttBtn) {
  bttBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ── NAVBAR HAMBURGER ──────────────────────────
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open', open);
    mobileMenu.setAttribute('aria-hidden', open ? 'false' : 'true');
    hamburger.setAttribute('aria-expanded', open);
    document.body.classList.toggle('no-scroll', open);
  });

  // Close on mobile link click
  mobileMenu.querySelectorAll('.mobile-link, .mobile-cta').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      mobileMenu.setAttribute('aria-hidden', 'true');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('no-scroll');
    });
  });

  // Close on ESC
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      hamburger.click();
    }
  });
}

// ── ACTIVE NAV LINK (INTERSECTION OBSERVER) ───
const navLinks   = document.querySelectorAll('.nav-link');
const sections   = document.querySelectorAll('section[id]');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.35 });

sections.forEach(s => navObserver.observe(s));

// ── SMOOTH SCROLL FOR ALL ANCHOR LINKS ────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ── AOS (ANIMATE ON SCROLL) ───────────────────
function initAOS() {
  const aosEls = document.querySelectorAll('[data-aos]');
  const delays = {};
  aosEls.forEach(el => {
    const delay = parseInt(el.getAttribute('data-aos-delay') || '0', 10);
    delays.set ? null : (delays[el] = delay);
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseInt(el.getAttribute('data-aos-delay') || '0', 10);
        setTimeout(() => {
          el.classList.add('aos-animate');
        }, delay);
        observer.unobserve(el);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  aosEls.forEach(el => observer.observe(el));
}
document.addEventListener('DOMContentLoaded', initAOS);

// ── COUNTER ANIMATION ─────────────────────────
function animateCounters() {
  document.querySelectorAll('.stat-num[data-target]').forEach(el => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1800;
    const step = Math.ceil(duration / target);
    let current = 0;
    const timer = setInterval(() => {
      current += 1;
      el.textContent = current;
      if (current >= target) { el.textContent = target; clearInterval(timer); }
    }, step);
  });
}

// Trigger counters when stats-bar enters view
const statsBar = document.querySelector('.stats-bar');
if (statsBar) {
  const cObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      animateCounters();
      cObserver.disconnect();
    }
  }, { threshold: 0.5 });
  cObserver.observe(statsBar);
}

// ── TYPEWRITER ────────────────────────────────
const words = [
  'Software-Defined Networking',
  'Attack Detection',
  'Blockchain Security',
  'Artificial Intelligence',
  'Cyber-Physical Systems',
  'Digital Security',
];
const twEl = document.getElementById('typeword');
if (twEl) {
  let wi = 0, ci = 0, deleting = false;
  function type() {
    const word = words[wi];
    if (!deleting) {
      twEl.textContent = word.substring(0, ci + 1);
      ci++;
      if (ci === word.length) {
        deleting = true;
        setTimeout(type, 2000);
        return;
      }
      setTimeout(type, 55);
    } else {
      twEl.textContent = word.substring(0, ci - 1);
      ci--;
      if (ci === 0) {
        deleting = false;
        wi = (wi + 1) % words.length;
        setTimeout(type, 400);
        return;
      }
      setTimeout(type, 30);
    }
  }
  setTimeout(type, 1200);
}

// ── HERO PARTICLES ────────────────────────────
function createParticles() {
  const wrap = document.getElementById('heroParticles');
  if (!wrap) return;
  const colors = ['#00d4ff', '#8b5cf6', '#3b82f6', '#10b981'];
  for (let i = 0; i < 30; i++) {
    const dot = document.createElement('div');
    dot.className = 'particle-dot';
    const size = Math.random() * 4 + 1;
    dot.style.cssText = `
      width: ${size}px; height: ${size}px;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      animation-duration: ${Math.random() * 10 + 8}s;
      animation-delay: ${Math.random() * 6}s;
      box-shadow: 0 0 ${size * 3}px currentColor;
    `;
    wrap.appendChild(dot);
  }
}
createParticles();

// ── CONTACT FORM ──────────────────────────────
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const btn = document.getElementById('formSubmit');
    if (!btn) return;
    
    const originalContent = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Sending...</span>';
    btn.style.opacity = '0.8';
    btn.disabled = true;

    fetch(contactForm.action, {
      method: 'POST',
      body: new FormData(contactForm),
      headers: { 'Accept': 'application/json' }
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        btn.innerHTML = '<i class="fas fa-check"></i><span>Message Sent!</span>';
        btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        contactForm.reset();
      } else {
        throw new Error('Form submission failed');
      }
    })
    .catch(error => {
      btn.innerHTML = '<i class="fas fa-exclamation-triangle"></i><span>Failed to send</span>';
      btn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
    })
    .finally(() => {
      btn.style.opacity = '1';
      setTimeout(() => {
        btn.innerHTML = originalContent;
        btn.style.background = '';
        btn.disabled = false;
      }, 3500);
    });
  });
}

// ── CONSOLE BRANDING ──────────────────────────
console.log('%c🔐 CyberSecurity Lab, JUST', 'font-size:20px;font-weight:bold;color:#00d4ff;');
console.log('%c⚡ Led by Dr. Mohammad Nowsin Amin Sheikh', 'font-size:13px;color:#8b5cf6;');
console.log('%c🌐 https://nowsin.me', 'font-size:11px;color:#64748b;');
