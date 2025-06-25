document.addEventListener("DOMContentLoaded", function () {
  const sidebar = document.querySelector(".sidebar");
  const sidebarToggle = document.querySelector(".sidebar-toggle");
  const sidebarOverlay = document.querySelector(".sidebar-overlay");

  // Crear overlay si no existe
  if (!sidebarOverlay) {
    const overlay = document.createElement("div");
    overlay.className = "sidebar-overlay";
    document.body.appendChild(overlay);
  }

  // Variables para gestos de deslizamiento
  let startX = 0;
  let currentX = 0;
  let isDragging = false;

  // Función para mostrar sidebar
  function showSidebar() {
    sidebar.classList.remove("mobile-hidden");
    sidebar.classList.add("mobile-visible");
    sidebarToggle.classList.add("active"); // Animar botón hamburguesa
    document.querySelector(".sidebar-overlay").classList.add("active");
    document.body.style.overflow = "hidden";
  }

  // Función para ocultar sidebar
  function hideSidebar() {
    sidebar.classList.remove("mobile-visible");
    sidebar.classList.add("mobile-hidden");
    sidebarToggle.classList.remove("active"); // Restaurar botón hamburguesa
    document.querySelector(".sidebar-overlay").classList.remove("active");
    document.body.style.overflow = "";
  }

  // Event listeners para botón toggle
  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", function() {
      if (sidebar.classList.contains("mobile-visible")) {
        hideSidebar();
      } else {
        showSidebar();
      }
    });
  }

  // Event listener para overlay
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("sidebar-overlay")) {
      hideSidebar();
    }
  });

  // Gestos de deslizamiento
  document.addEventListener("touchstart", function (e) {
    startX = e.touches[0].clientX;

    // Solo iniciar gesto desde el borde izquierdo
    if (startX < 50) {
      isDragging = true;
    }
  });

  document.addEventListener("touchmove", function (e) {
    if (!isDragging) return;

    currentX = e.touches[0].clientX;
    const diffX = currentX - startX;

    // Si el deslizamiento es hacia la derecha y suficiente
    if (diffX > 50) {
      showSidebar();
      isDragging = false;
    }
  });

  document.addEventListener("touchend", function () {
    isDragging = false;
  });

  // Cerrar sidebar deslizando hacia la izquierda
  sidebar.addEventListener("touchstart", function (e) {
    startX = e.touches[0].clientX;
  });

  sidebar.addEventListener("touchmove", function (e) {
    currentX = e.touches[0].clientX;
    const diffX = currentX - startX;

    // Si el deslizamiento es hacia la izquierda y suficiente
    if (diffX < -50) {
      hideSidebar();
    }
  });

  // Cerrar con tecla ESC
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && sidebar.classList.contains("mobile-visible")) {
      hideSidebar();
    }
  });

  // Inicializar estado en móviles
  function initMobileState() {
    if (window.innerWidth <= 768) {
      sidebar.classList.add("mobile-hidden");
      sidebarToggle.classList.remove("active");
    } else {
      sidebar.classList.remove("mobile-hidden", "mobile-visible");
      sidebarToggle.classList.remove("active");
    }
  }

  // Ejecutar al cargar y redimensionar
  initMobileState();
  window.addEventListener("resize", initMobileState);
});
