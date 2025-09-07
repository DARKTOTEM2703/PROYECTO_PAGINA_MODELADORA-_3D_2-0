document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault();
  alert("¡Gracias por tu mensaje! (No se envía realmente, es solo frontend)");
});

document.getElementById("mailtoBtn").addEventListener("click", function (e) {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;
  const subject = encodeURIComponent("Contacto desde la página web");
  const body = encodeURIComponent(
    `Nombre: ${name}\nCorreo: ${email}\nMensaje:\n${message}`
  );
  window.location.href = `mailto:samy.bello2809@gmail.com?subject=${subject}&body=${body}`;
});
