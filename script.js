/* =============================================
   STRATIO WEBSITE — script.js
   ============================================= */

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ===== HERO CANVAS — PARTICLE NETWORK =====
(function initCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles;
  const COUNT = 80;
  const MAX_DIST = 140;
  const ACCENT = '1, 195, 141';

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.r = Math.random() * 1.5 + 0.8;
      this.opacity = Math.random() * 0.5 + 0.15;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${ACCENT}, ${this.opacity})`;
      ctx.fill();
    }
  }

  function init() { particles = Array.from({ length: COUNT }, () => new Particle()); }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${ACCENT}, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animate);
  }

  resize();
  init();
  animate();
  window.addEventListener('resize', () => { resize(); });
})();

// ===== ANIMATE ON SCROLL =====
(function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
})();

// ===== ANIMATED COUNTERS =====
(function initCounters() {
  const targets = document.querySelectorAll('.stat-num');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        const duration = 1800;
        const step = 16;
        const increment = target / (duration / step);
        let current = 0;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            el.textContent = target;
            clearInterval(timer);
          } else {
            el.textContent = Math.floor(current);
          }
        }, step);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  targets.forEach(t => observer.observe(t));
})();

// ===== ANIMATED METRIC BARS =====
(function initMetricBars() {
  const fills = document.querySelectorAll('.metric-fill');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const rawWidth = el.style.getPropertyValue('--width');
        const pct = parseFloat(rawWidth);
        const capped = Math.min(pct, 100);
        setTimeout(() => {
          el.style.width = capped + '%';
        }, 400);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  fills.forEach(f => observer.observe(f));
})();

// ===== FAQ ACCORDION =====
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');

    // Close all
    document.querySelectorAll('.faq-item.open').forEach(openItem => {
      openItem.classList.remove('open');
      openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
    });

    // Open clicked if it was closed
    if (!isOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

// ===== ACTIVE NAV LINK ON SCROLL =====
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navAnchors.forEach(a => {
          a.style.color = a.getAttribute('href') === `#${id}` ? 'var(--accent)' : '';
        });
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });

  sections.forEach(s => observer.observe(s));
})();

// ===== CONTACT FORM =====
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = document.getElementById('form-submit-btn');
    const name = document.getElementById('name').value.trim();
    const emailVal = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !emailVal || !message) {
      showNotification('Por favor completa todos los campos requeridos.', 'error');
      return;
    }

    btn.disabled = true;
    btn.innerHTML = `<span>Enviando...</span>`;

    // Build mailto link as fallback
    const subject = encodeURIComponent('Consulta desde Stratio Web');
    const service = document.getElementById('service').value;
    const company = document.getElementById('company').value;
    const body = encodeURIComponent(
      `Nombre: ${name}\nEmpresa: ${company}\nEmail: ${emailVal}\nServicio: ${service}\n\nMensaje:\n${message}`
    );
    const mailtoUrl = `mailto:stratio.ai@gmail.com?subject=${subject}&body=${body}`;

    setTimeout(() => {
      window.location.href = mailtoUrl;
      btn.disabled = false;
      btn.innerHTML = `Enviar mensaje <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`;
      showNotification('¡Tu mensaje está listo! Se abrirá tu cliente de correo. 📩', 'success');
      form.reset();
    }, 800);
  });
}

// ===== NOTIFICATION TOAST =====
function showNotification(message, type = 'success') {
  const existing = document.querySelector('.toast-notification');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    z-index: 9999;
    padding: 16px 24px;
    border-radius: 12px;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.92rem;
    font-weight: 500;
    color: #fff;
    max-width: 360px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.5);
    transform: translateY(20px);
    opacity: 0;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    ${type === 'success'
      ? 'background: rgba(1,195,141,0.15); border: 1px solid rgba(1,195,141,0.4);'
      : 'background: rgba(255,60,60,0.15); border: 1px solid rgba(255,60,60,0.4);'}
  `;
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';
    setTimeout(() => {
      toast.style.transform = 'translateY(20px)';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 400);
    }, 4500);
  });
}

// ===== SMOOTH HOVER GLOW on service cards =====
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  });
});
