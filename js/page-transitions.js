document.addEventListener("DOMContentLoaded", function () {
  // Elementos
  const pageLinks = document.querySelectorAll('a[href$=".html"]');
  const mainContent = document.querySelector(".main-content");
  const sidebar = document.querySelector(".sidebar");

  // Crear overlay de transición sutil
  createTransitionOverlay();

  // Función para crear el overlay
  function createTransitionOverlay() {
    const overlay = document.createElement("div");
    overlay.className = "page-transition-overlay";
    overlay.id = "pageTransition";

    overlay.innerHTML = `
          <div class="transition-content">
              <div class="transition-loader"></div>
              <div class="transition-text">Cargando...</div>
          </div>
      `;

    document.body.appendChild(overlay);
  }

  // Manejar clicks en enlaces
  pageLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const href = this.getAttribute("href");
      const pageName = getPageName(href);

      startTransition(href, pageName);
    });
  });

  // Función para iniciar transición suave
  function startTransition(href, pageName) {
    const overlay = document.getElementById("pageTransition");
    const transitionText = overlay.querySelector(".transition-text");

    // Actualizar texto de manera sutil
    transitionText.textContent = pageName;

    // Efectos suaves en elementos
    if (mainContent) {
      mainContent.classList.add("page-transitioning");
    }

    if (sidebar) {
      sidebar.classList.add("transitioning");
    }

    // Mostrar overlay suavemente
    overlay.classList.add("active");

    // Navegar con delay más corto
    setTimeout(() => {
      window.location.href = href;
    }, 600);
  }

  // Función para obtener nombre de página
  function getPageName(href) {
    const pageNames = {
      "index.html": "Home",
      "portfolio.html": "Portfolio",
      "about.html": "About",
      "experience.html": "Experience",
      "contact.html": "Contact",
    };

    const filename = href.split("/").pop();
    return pageNames[filename] || "Loading";
  }

  // Animación suave de entrada
  window.addEventListener("load", function () {
    setTimeout(() => {
      document.body.classList.add("page-loaded");
    }, 50);
  });

  // Precarga discreta de páginas
  pageLinks.forEach((link) => {
    link.addEventListener("mouseenter", function () {
      const href = this.getAttribute("href");

      // Precargar página sin efectos visuales
      if (!document.querySelector(`link[href="${href}"]`)) {
        const linkElement = document.createElement("link");
        linkElement.rel = "prefetch";
        linkElement.href = href;
        document.head.appendChild(linkElement);
      }
    });
  });

  // Limpiar clases de transición al salir
  window.addEventListener("beforeunload", function () {
    if (mainContent) {
      mainContent.classList.remove("page-transitioning");
    }
    if (sidebar) {
      sidebar.classList.remove("transitioning");
    }
  });
});
