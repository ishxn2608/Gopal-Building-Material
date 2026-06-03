// Gopal Building Material – Advanced Performance Frontend Engine
// Fully optimized for immediate UI response, double-submit locks, and background handshakes.

document.addEventListener('DOMContentLoaded', () => {
  
  // ── Intersection Observer for Scroll Animations ──────────────────
  const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-on-scroll');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.sec, .srv-card, .prd-card, .why-item, .sec-center').forEach(el => {
    observer.observe(el);
  });

  // ── Smooth Scroll Management ─────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) { target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

  // ── High-Performance Enquiry Form Controller ──────────────────
  const form = document.getElementById('enquiryForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const btn = form.querySelector('.send-btn') || form.querySelector('button[type="submit"]');
      const msgBox = document.getElementById('formMessage');

      // Double-Submission Guard Protection Lock
      if (btn.disabled || btn.textContent === 'SENDING...') return;

      const data = {
        name:    form.querySelector('[name="name"]').value.trim(),
        phone:   form.querySelector('[name="phone"]').value.trim(),
        service: form.querySelector('[name="service"]').value,
        message: form.querySelector('[name="message"]').value.trim()
      };

      // Client-Side Validation Protection Boundaries
      if (!data.name || !data.phone) {
        showMsg(msgBox, '⚠️ Please fill out your Name and Phone Number fields.', 'error');
        return;
      }

      // Engage Form Visual Interlock State Changes
      btn.disabled = true;
      btn.textContent = 'SENDING...';
      btn.style.opacity = '0.7';

      // Initialize Network AbortController Timeout Protection
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8-Second Safety Timeout

      try {
        const res = await fetch('/api/enquiry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId); // Clear timeout since request finished safely
        const result = await res.json();

        if (result.success) {
          // ✅ INSTANT VISUAL FEEDBACK SUCCESS OVERRIDES
          btn.textContent = 'SUCCESSFUL!';
          btn.style.backgroundColor = '#2d6a4f'; // Transition button to solid emerald green
          btn.style.color = '#ffffff';
          btn.style.opacity = '1';

          showMsg(msgBox, '✅ ' + result.message, 'success');
          form.reset();

          // Compile URL query strings parameters securely using standard operators
          const text = encodeURIComponent(
            `Hi Gopal Building Material! I'm interested in ${data.service}. Name: ${data.name}, Phone: ${data.phone}. Message: ${data.message}`
          );
          setTimeout(() => {
            window.location.href = `https://wa.me/917415345817?text=${text}`;
          }, 600);

        } else {
          showMsg(msgBox, '❌ Server rejected form: ' + result.message, 'error');
          resetButtonState(btn);
        }

      } catch (err) {
        clearTimeout(timeoutId);
        console.error('Frontend Fetch Boundary Caught Error:', err);
        
        if (err.name === 'AbortError') {
          showMsg(msgBox, '❌ The request timed out. Please check your network connection.', 'error');
        } else {
          showMsg(msgBox, '❌ A communication pipeline network error occurred. Please retry.', 'error');
        }
        resetButtonState(btn);
      }
    });
  }

  function resetButtonState(buttonElement) {
    if (!buttonElement) return;
    buttonElement.disabled = false;
    buttonElement.textContent = 'Send via WhatsApp ↗';
    buttonElement.style.backgroundColor = '';
    buttonElement.style.color = '';
    buttonElement.style.opacity = '1';
  }

  function showMsg(box, text, type) {
    if (!box) return;
    box.textContent = text;
    box.className = `form-msg ${type}`;
    box.style.display = 'block';
    setTimeout(() => { box.style.display = 'none'; }, 6000);
  }

  // ── Parallax and Graphic Statistics Animation Counters ──────────
  window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    if (hero) {
      const scrollTop = window.pageYOffset;
      if (scrollTop < hero.offsetHeight) {
        hero.style.backgroundPosition = `0% ${scrollTop * 0.5}px`;
      }
    }
  });

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
        if (current >= target) { el.textContent = target; clearInterval(timer); } 
        else { el.textContent = current; }
      }, 30);
    });
  };

  const statsSection = document.querySelector('.stats');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { animateCounters(); statsObserver.unobserve(entry.target); }
      });
    }, { threshold: 0.3 });
    statsObserver.observe(statsSection);
  }
});