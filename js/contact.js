document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('contactForm');
  const mailtoBtn = document.getElementById('mailtoBtn');
  const statusEl = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');

  // Placeholder UX: limpiar placeholder al focus y restaurar si vacío en blur
  const controls = document.querySelectorAll('.field .form-control');
  controls.forEach(input => {
    // guardar placeholder original
    input.dataset.ph = input.getAttribute('placeholder') || '';

    input.addEventListener('focus', () => {
      // quitar placeholder para que no tape el texto en algunos navegadores
      input.setAttribute('placeholder', '');
    });

    input.addEventListener('blur', () => {
      // si el campo está vacío restablecer placeholder
      if (!input.value || input.value.trim() === '') {
        input.setAttribute('placeholder', input.dataset.ph);
      }
    });

    // si el usuario pega o hay autofill, ocultar placeholder cuando hay contenido
    input.addEventListener('input', () => {
      if (input.value && input.value.trim() !== '') {
        // mantener placeholder vacío para no superponer
        input.setAttribute('placeholder', '');
      } else {
        input.setAttribute('placeholder', input.dataset.ph);
      }
    });

    // re-check por autofill al cargar
    setTimeout(() => {
      if (input.value && input.value.trim() !== '') input.setAttribute('placeholder', '');
    }, 200);
  });

  // Envío a Formspree (fetch)
  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      const endpoint = form.dataset.formspree;
      if (!endpoint) {
        statusEl.className = 'form-status error';
        statusEl.textContent = 'No se encontró endpoint de Formspree.';
        return;
      }

      submitBtn.setAttribute('aria-busy', 'true');
      statusEl.className = 'form-status';
      statusEl.textContent = 'Enviando…';

      const formData = new FormData(form);
      formData.append('_subject', `Contacto desde web — ${formData.get('name') || 'sin nombre'}`);

      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: formData
        });

        if (res.ok) {
          form.reset();
          // restaurar placeholders visibles
          controls.forEach(i => i.setAttribute('placeholder', i.dataset.ph));
          statusEl.className = 'form-status success';
          statusEl.textContent = '¡Mensaje enviado! Gracias — te responderé pronto.';
        } else {
          const data = await res.json().catch(()=>null);
          throw new Error((data && data.error) ? data.error : 'Error al enviar');
        }
      } catch (err) {
        console.error(err);
        statusEl.className = 'form-status error';
        statusEl.textContent = 'No se pudo enviar. Intenta otra vez o usa CORREO.';
      } finally {
        submitBtn.removeAttribute('aria-busy');
      }
    });
  }

  // Mailto fallback
  if (mailtoBtn) {
    mailtoBtn.addEventListener('click', function (e) {
      e.preventDefault();
      const name = document.getElementById('name') ? document.getElementById('name').value : '';
      const email = document.getElementById('email') ? document.getElementById('email').value : '';
      const message = document.getElementById('message') ? document.getElementById('message').value : '';
      const subject = encodeURIComponent('Contacto desde la página web');
      const body = encodeURIComponent(`Nombre: ${name}\nCorreo: ${email}\nMensaje:\n${message}`);
      window.location.href = `mailto:samy.bello2809@gmail.com?subject=${subject}&body=${body}`;
    });
  }
});