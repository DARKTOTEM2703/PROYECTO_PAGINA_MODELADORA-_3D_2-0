document.addEventListener("DOMContentLoaded", function () {
  // Inicializar el carrusel de Bootstrap
  var carousel = new bootstrap.Carousel(
    document.getElementById("heroCarousel"),
    {
      interval: 5000,
      wrap: true,
      keyboard: true,
    }
  );

  // Navegación entre secciones
  const links = document.querySelectorAll(".main-nav a");

  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      // Quitar la clase active de todos los enlaces
      links.forEach((l) => l.classList.remove("active"));

      // Agregar la clase active al enlace actual
      this.classList.add("active");

      // Obtener el ID de la sección desde el href
      const sectionId = this.getAttribute("href");

      // Ocultar todas las secciones
      document.querySelectorAll(".section").forEach((section) => {
        section.classList.remove("active");
      });

      // Mostrar la sección correspondiente
      document.querySelector(sectionId).classList.add("active");
    });
  });
});
