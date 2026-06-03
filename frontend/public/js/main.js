// Gopal Building Material – Frontend JS
// Handles enquiry form submission via API & animations

document.addEventListener('DOMContentLoaded', () => {
  
  // ── Intersection Observer for Scroll Animations ──────────────────
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-on-scroll');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all sections and cards
  document.querySelectorAll('.sec, .srv-card, .prd-card, .why-item, .sec-center').forEach(el => {
    observer.observe(el);
  });

  // ── Smooth scroll for nav links ──────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── Enquiry Form Submission Handler ──────────────────────────
  const form = document.getElementById('enquiryForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('.send-btn');
      const msgBox = document.getElementById('formMessage');

      const data = {
        name:    form.name.value.trim(),
        phone:   form.phone.value.trim(),
        service: form.service.value,
        message: form.message.value.trim()
      };

      if (!data.name) return showMsg(msgBox, 'Please enter your name.', 'error');
      if (!data.phone) return showMsg(msgBox, 'Please enter your phone number.', 'error');

      btn.disabled = true;
      btn.textContent = 'Sending…';

      try {
        const res = await fetch('/api/enquiry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        const result = await res.json();

        if (result.success) {
          showMsg(msgBox, '✅ ' + result.message, 'success');
          form.reset();
          
          // ✅ FIXED: Direct link syntax ensures smooth redirection without freezing the layout
          const text = encodeURIComponent(
            `Hi Gopal Building Material! I'm interested in ${data.service}. Name: ${data.name}, Phone: ${data.phone}. Message: ${data.message}`
          );
          
          setTimeout(() => {
            window.location.href = `https://wa.me{text}`;
          }, 800);
        } else {
          showMsg(msgBox, '❌ ' + (result.message || 'Error sending enquiry.'), 'error');
          btn.disabled = false;
          btn.textContent = 'Send via WhatsApp ↗';
        }
      } catch (err) {
        showMsg(msgBox, '❌ Network error. Please try again.', 'error');
        btn.disabled = false;
        btn.textContent = 'Send via WhatsApp ↗';
      }
    });
  }

  function showMsg(box, text, type) {
    box.textContent = text;
    box.className = `form-msg ${type}`;
    box.style.display = 'block';
    setTimeout(() => {
      box.style.display = 'none';
    }, 5000);
  }

  // ── Parallax effect on hero ──────────────────────────────────
  window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    if (hero) {
      const scrollTop = window.pageYOffset;
      const heroHeight = hero.offsetHeight;
      if (scrollTop < heroHeight) {
        hero.style.backgroundPosition = `0% ${scrollTop * 0.5}px`;
      }
    }
  });

  // ── Counter animation for stats ──────────────────────────────
  const countElements = document.querySelectorAll('.stat .num');
  let hasAnimated = false;

  const animateCounters = () => {
    if (hasAnimated) return;
    hasAnimated = true;

    countElements.forEach(el => {
      const target = parseInt(el.textContent);
      if (isNaN(target)) return;

      let current = 0;
      const increment = Math.ceil(target / 30);
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          el.textContent = target;
          clearInterval(timer);
        } else {
          el.textContent = current;
        }
      }, 30);
    });
  };

  // Trigger counter animation when stats section is in view
  const statsSection = document.querySelector('.stats');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    statsObserver.observe(statsSection);
  }
});
