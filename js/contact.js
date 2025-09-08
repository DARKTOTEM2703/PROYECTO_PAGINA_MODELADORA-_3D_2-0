document.addEventListener("DOMContentLoaded", function () {
  const contactForm = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");
  const submitBtn = document.getElementById("submit-btn");

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

  if (contactForm) {
    contactForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const message = document.getElementById("message").value.trim();
      const captchaResponse = window.grecaptcha ? grecaptcha.getResponse() : "";

      if (!name || !email || !message) {
        showFormStatus("error", "Por favor completa todos los campos");
        return;
      }
      if (!captchaResponse) {
        showFormStatus("error", "Por favor completa el captcha");
        return;
      }

      const originalBtnContent = submitBtn.innerHTML;
      submitBtn.innerHTML = `<svg class="spinner" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="2" x2="12" y2="6"></line>
            <line x1="12" y1="18" x2="12" y2="22"></line>
            <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
            <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
            <line x1="2" y1="12" x2="6" y2="12"></line>
            <line x1="18" y1="12" x2="22" y2="12"></line>
            <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
            <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
        </svg>
        <span>Enviando...</span>`;
      submitBtn.disabled = true;

      try {
        const formData = new FormData(contactForm);
        formData.append("g-recaptcha-response", captchaResponse);

        const response = await fetch(contactForm.action, {
          method: "POST",
          body: formData,
          headers: { Accept: "application/json" }
        });

        const responseData = await response.json();

        if (response.ok) {
          showFormStatus("success", "¡Mensaje enviado con éxito! Te contactaré pronto.");
          contactForm.reset();
          if (window.grecaptcha) grecaptcha.reset();
        } else {
          if (responseData.error) {
            if (responseData.error.includes("captcha")) {
              showFormStatus("error", "Por favor intenta de nuevo y completa el captcha que aparecerá");
            } else {
              showFormStatus("error", responseData.error);
            }
          } else {
            showFormStatus("error", "Hubo un error al enviar el mensaje. Intenta de nuevo.");
          }
        }
      } catch (error) {
        console.error("Error al enviar el formulario:", error);
        showFormStatus("error", "Hubo un error en el envío. Por favor, contacta directamente por email.");
      } finally {
        submitBtn.innerHTML = originalBtnContent;
        submitBtn.disabled = false;
      }
    });
  }

  function showFormStatus(type, message) {
    formStatus.className = "form-status " + type;
    formStatus.innerHTML =
      type === "success"
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg><p>${message}</p>`
        : `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 0 1 0 8"></path><path d="M6 8a6 6 0 0 0 0 8"></path><line x1="12" y1="8" x2="12" y2="16"></line></svg><p>${message}</p>`;
  }
});