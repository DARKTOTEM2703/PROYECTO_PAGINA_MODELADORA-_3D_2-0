document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('contactForm');
  const mailtoBtn = document.getElementById('mailtoBtn');

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    alert('¡Gracias por tu mensaje! (No se envía realmente, es solo frontend)');
    form.reset();
  });

  mailtoBtn.addEventListener('click', function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    const subject = encodeURIComponent('Contacto desde la página web');
    const body = encodeURIComponent(`Nombre: ${name}\nCorreo: ${email}\nMensaje:\n${message}`);
    window.location.href = `mailto:samanthabello@gmail.com?subject=${subject}&body=${body}`;
  });

  // --- START: compatibilidad etiquetas flotantes + autofill ---
  const floatingControls = document.querySelectorAll('.form-floating .form-control');

  function updateFilled(el) {
    if (!el) return;
    // si no tiene placeholder, ponemos uno vacío para que :placeholder-shown funcione consistente
    if (!el.hasAttribute('placeholder')) el.setAttribute('placeholder', ' ');
    if (el.value && el.value.trim() !== '') {
      el.classList.add('filled');
    } else {
      el.classList.remove('filled');
    }
  }

  floatingControls.forEach(el => {
    // comprobar al cargar (incluye posibles autofills)
    updateFilled(el);

    // eventos que actualizan el estado
    el.addEventListener('input', () => updateFilled(el));
    el.addEventListener('change', () => updateFilled(el));
    el.addEventListener('blur', () => updateFilled(el));

    // re-check tras un pequeño delay para capturar autofill del navegador
    setTimeout(() => updateFilled(el), 250);
  });
  // --- END ---
});