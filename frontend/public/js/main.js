// Gopal Building Material – Frontend JS
// Optimized for instant button feedback and redirection

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

  // ── Smooth scroll for nav links ──────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) { target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

  // ── Enquiry Form Submission Handler ──────────────────────────
  const form = document.getElementById('enquiryForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('.send-btn') || form.querySelector('button[type="submit"]');
      const msgBox = document.getElementById('formMessage');

      const data = {
        name:    form.querySelector('[name="name"]').value.trim(),
        phone:   form.querySelector('[name="phone"]').value.trim(),
        service: form.querySelector('[name="service"]').value,
        message: form.querySelector('[name="message"]').value.trim()
      };

      if (!data.name || !data.phone) { alert('Please fill required fields.'); return; }

      // 1. Lock button and start sending state
      btn.disabled = true;
      btn.textContent = 'SENDING...';

      try {
        const res = await fetch('/api/enquiry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        const result = await res.json();

        if (result.success) {
          // ✅ 2. INSTANTLY flip button to SUCCESSFUL
          btn.textContent = 'SUCCESSFUL!';
          btn.style.backgroundColor = '#2d6a4f'; // Green feedback
          btn.style.color = '#ffffff';

          if (msgBox) {
            msgBox.textContent = '✅ Enquiry sent successfully!';
            msgBox.className = 'form-msg success';
            msgBox.style.display = 'block';
          }

          form.reset();
          
          const text = encodeURIComponent(
            `Hi Gopal Building Material! I'm interested in ${data.service}.\nName: ${data.name}\nPhone: ${data.phone}\nMessage: ${data.message}`
          );
          
          // ✅ 3. Instantly forward to the precise WhatsApp link
          window.location.href = "https://whatsapp.com" + text;

        } else {
          alert('❌ Error: ' + result.message);
          resetButton(btn);
        }
      } catch (err) {
        alert('❌ Network error. Please try again.');
        resetButton(btn);
      }
    });
  }

  function resetButton(button) {
    if (button) {
      button.disabled = false;
      button.textContent = 'Send via WhatsApp ↗';
      button.style.backgroundColor = ''; // Restore original CSS styles
    }
  }
});
