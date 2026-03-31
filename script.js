/* ═══════════════════════════════════════
   PORTFOLIO SCRIPT — M. UI/UX Designer
═══════════════════════════════════════ */

/* ── 1. NAVBAR: SHRINK ON SCROLL + ACTIVE LINK ── */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.style.padding = '10px 52px';
    navbar.style.boxShadow = '0 4px 24px rgba(13,27,62,0.08)';
  } else {
    navbar.style.padding = '';
    navbar.style.boxShadow = '';
  }

  const navLinks = document.querySelectorAll('.nav-links a');
  let current = '';

  document.querySelectorAll('section[id]').forEach(section => {
    if (window.scrollY >= section.offsetTop - 120) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

const navStyle = document.createElement('style');
navStyle.textContent = `.nav-links a.active { color: var(--blue); }`;
document.head.appendChild(navStyle);


/* ── 2. HAMBURGER MENU ── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

function closeMenu() {
  hamburger.classList.remove('open');
  navLinks.classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('click', (e) => {
  if (
    navLinks.classList.contains('open') &&
    !navLinks.contains(e.target) &&
    !hamburger.contains(e.target)
  ) {
    closeMenu();
  }
});


/* ── 3. REVEAL ON SCROLL ── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


/* ── 4. SKILL BAR ANIMATION ── */
const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.sk-fill').forEach(bar => {
          const target = bar.getAttribute('data-w');
          setTimeout(() => {
            bar.style.width = target + '%';
          }, 200);
        });
        skillObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

const skillsWrap = document.getElementById('sk-wrap');
if (skillsWrap) skillObserver.observe(skillsWrap);


/* ── 5. STAT COUNTER ANIMATION ── */
function animateCounter(el, target, duration = 1600) {
  let start = 0;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.stat-num').forEach(stat => {
          const text = stat.textContent.trim();
          const num  = parseInt(text);
          if (!isNaN(num)) {
            const em = stat.querySelector('em');
            stat.textContent = '0';
            if (em) stat.appendChild(em);
            animateCounter(stat, num);
          }
        });
        statsObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);


/* ── 6. CONTACT FORM ── */
const fbtn         = document.querySelector('.fbtn');
const nameInput    = document.querySelector('.fi[type="text"]');
const emailInput   = document.querySelector('.fi[type="email"]');
const messageInput = document.querySelector('.fta');

// if (fbtn) {
//   fbtn.addEventListener('click', () => {
//     const name    = nameInput?.value.trim();
//     const email   = emailInput?.value.trim();
//     const message = messageInput?.value.trim();

//     if (!name || !email || !message) {
//       showToast('Please fill in all fields.', 'error');
//       return;
//     }
//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//       showToast('Please enter a valid email address.', 'error');
//       return;
//     }

//     fbtn.textContent = 'Sending…';
//     fbtn.disabled = true;

//     setTimeout(() => {
//       fbtn.textContent = 'Message Sent ✓';
//       fbtn.style.background = '#16a34a';
//       showToast("Message sent! I'll get back to you soon.", 'success');

//       setTimeout(() => {
//         nameInput.value    = '';
//         emailInput.value   = '';
//         messageInput.value = '';
//         fbtn.textContent   = 'Send Message →';
//         fbtn.style.background = '';
//         fbtn.disabled = false;
//       }, 2500);
//     }, 1400);
//   });
// }

fbtn.addEventListener('click', async () => {
    const name    = nameInput?.value.trim();
    const email   = emailInput?.value.trim();
    const message = messageInput?.value.trim();

    if (!name || !email || !message) {
      showToast('Please fill in all fields.', 'error');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    fbtn.textContent = 'Sending…';
    fbtn.disabled = true;

    try {
      const res = await fetch('https://formspree.io/f/xreoqpaw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
      });

      if (res.ok) {
        fbtn.textContent = 'Message Sent ✓';
        fbtn.style.background = '#16a34a';
        showToast("Message sent! I'll get back to you soon.", 'success');
        setTimeout(() => {
          nameInput.value = '';
          emailInput.value = '';
          messageInput.value = '';
          fbtn.textContent = 'Send Message →';
          fbtn.style.background = '';
          fbtn.disabled = false;
        }, 2500);
      } else {
        throw new Error('Failed');
      }
    } catch {
      showToast('Something went wrong. Try emailing me directly.', 'error');
      fbtn.textContent = 'Send Message →';
      fbtn.disabled = false;
    }
  });

function showToast(msg, type = 'success') {
  document.querySelectorAll('.toast').forEach(t => t.remove());
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  toast.style.cssText = `
    position: fixed; bottom: 32px; left: 50%;
    transform: translateX(-50%) translateY(20px);
    background: ${type === 'success' ? '#0D1B3E' : '#dc2626'};
    color: #fff; padding: 13px 26px; border-radius: 50px;
    font-size: 13px; font-weight: 600; font-family: 'DM Sans', sans-serif;
    z-index: 9999; opacity: 0;
    transition: opacity 0.3s, transform 0.3s;
    box-shadow: 0 8px 30px rgba(0,0,0,0.18); white-space: nowrap;
  `;
  document.body.appendChild(toast);
  requestAnimationFrame(() => requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  }));
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(10px)';
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}


/* ── 7. CURSOR GLOW (desktop only) ── */
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed; width: 320px; height: 320px; border-radius: 50%;
    pointer-events: none; z-index: 0;
    background: radial-gradient(circle, rgba(37,99,235,0.07) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: left 0.12s ease, top 0.12s ease; will-change: left, top;
  `;
  document.body.appendChild(glow);
  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });
}


/* ── 8. SMOOTH SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});


/* ── 9. PROJECT CARD TILT (desktop only) ── */
if (window.matchMedia('(hover: hover)').matches) {
  document.querySelectorAll('.pcard').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x    = (e.clientX - rect.left) / rect.width  - 0.5;
      const y    = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `translateY(-5px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}


/* ── 10. PAGE LOAD FADE-IN ── */
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  requestAnimationFrame(() => requestAnimationFrame(() => {
    document.body.style.opacity = '1';
  }));
});