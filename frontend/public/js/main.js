// ── Enquiry Form Controller ──────────────────
const form = document.getElementById('enquiryForm');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = form.querySelector('.send-btn');
    const msgBox = document.getElementById('formMessage');

    if (btn.disabled) return;

    const data = {
      name: form.querySelector('[name="name"]').value.trim(),
      phone: form.querySelector('[name="phone"]').value.trim(),
      service: form.querySelector('[name="service"]').value,
      message: form.querySelector('[name="message"]').value.trim()
    };

    if (!data.name || !data.phone) {
      showMsg(msgBox, 'Please enter your Name and Phone Number.', 'error');
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Sending...';

    // Create WhatsApp message first
    const whatsappText = encodeURIComponent(
      `Hi Gopal Building Material!

Name: ${data.name}
Phone: ${data.phone}
Service: ${data.service}
Message: ${data.message}`
    );

    try {
      // Send enquiry in background
      fetch('/api/enquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }).catch(console.error);

      // Instant success UI
      showMsg(msgBox, '✅ Enquiry submitted successfully!', 'success');

      btn.disabled = false;
      btn.textContent = 'Send via WhatsApp ↗';

      form.reset();

      // Open WhatsApp immediately
      setTimeout(() => {
        window.location.href =
          `https://wa.me/917415345817?text=${whatsappText}`;
      }, 500);

    } catch (error) {
      console.error(error);

      showMsg(
        msgBox,
        '❌ Something went wrong. Please try again.',
        'error'
      );

      btn.disabled = false;
      btn.textContent = 'Send via WhatsApp ↗';
    }
  });
}

function showMsg(box, text, type) {
  if (!box) return;

  box.textContent = text;
  box.className = `form-msg ${type}`;
  box.style.display = 'block';

  setTimeout(() => {
    box.style.display = 'none';
  }, 5000);
}