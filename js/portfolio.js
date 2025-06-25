document.addEventListener("DOMContentLoaded", function () {
  let portfolioData = [];
  const portfolioGrid = document.getElementById("portfolioGrid");
  const filterButtons = document.querySelectorAll(".filter-btn");

  // Cargar datos del portfolio con manejo de errores
  async function loadPortfolioData() {
    try {
      const response = await fetch("data/portfolio.json");
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      portfolioData = data.projects;
      renderPortfolio("all");
    } catch (error) {
      console.error("Error loading portfolio data:", error);
      loadFallbackData();
    }
  }

  // Datos de respaldo si no se puede cargar el JSON
  function loadFallbackData() {
    portfolioData = [
      {
        id: "hollow-knight",
        title: "HOLLOW KNIGHT",
        category: ["characters", "videogames"],
        thumbnail: "img/portfolio/hollow-knight.jpg",
        description: "Modelado 3D del personaje principal de Hollow Knight",
      },
      // Agregar más proyectos de respaldo...
    ];
    renderPortfolio("all");
  }

  // Crear elemento de proyecto con lazy loading optimizado
  function createProjectElement(project, index) {
    const portfolioItem = document.createElement("div");
    portfolioItem.className = "portfolio-item";
    portfolioItem.dataset.category = project.category.join(" ");
    portfolioItem.style.animationDelay = `${0.8 + index * 0.1}s`;

    portfolioItem.innerHTML = `
      <div class="portfolio-card" data-project-id="${project.id}">
        <div class="image-container">
          <div class="image-placeholder">
            <div class="loading-text">${project.title}</div>
          </div>
          <img 
            data-src="${project.thumbnail}" 
            alt="${project.title}" 
            class="lazy-image"
            loading="lazy"
            decoding="async"
          >
        </div>
        <div class="image-title">${project.title}</div>
        <div class="portfolio-overlay">
          <div class="portfolio-overlay-content">
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <div class="portfolio-categories">
              ${project.category
                .map((cat) => `<span class="category-tag">${cat}</span>`)
                .join("")}
            </div>
          </div>
        </div>
      </div>
    `;

    return portfolioItem;
  }

  // Implementar Intersection Observer para lazy loading
  function initLazyLoading() {
    const lazyImages = document.querySelectorAll(".lazy-image");

    const imageObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            const placeholder =
              img.parentElement.querySelector(".image-placeholder");

            // Mostrar indicador de carga
            placeholder.style.background =
              "linear-gradient(45deg, #2a2a3e, #3a3a4e)";

            // Precargar imagen
            const tempImage = new Image();
            tempImage.onload = () => {
              img.src = img.dataset.src;
              img.style.opacity = "1";
              placeholder.style.opacity = "0";

              setTimeout(() => {
                placeholder.style.display = "none";
              }, 300);
            };

            tempImage.onerror = () => {
              placeholder.innerHTML =
                '<div class="error-message">⚠️<br>Error al cargar</div>';
              placeholder.style.background = "#ff4444";
              placeholder.style.color = "white";
            };

            // Iniciar carga con la ruta corregida
            tempImage.src = img.dataset.src;
            observer.unobserve(img);
          }
        });
      },
      {
        rootMargin: "100px 0px", // Cargar cuando esté a 100px de ser visible
        threshold: 0.1,
      }
    );

    lazyImages.forEach((img) => imageObserver.observe(img));
  }

  // Renderizar portfolio con carga optimizada
  function renderPortfolio(filterCategory) {
    portfolioGrid.innerHTML = "";

    const filteredProjects = portfolioData.filter((project) => {
      if (filterCategory === "all") return true;
      return project.category.includes(filterCategory);
    });

    filteredProjects.forEach((project, index) => {
      const projectElement = createProjectElement(project, index);
      portfolioGrid.appendChild(projectElement);
    });

    // Inicializar lazy loading y animaciones
    setTimeout(() => {
      initLazyLoading();
      animatePortfolioItems();
    }, 100);
  }

  // Función para filtrar elementos
  function filterPortfolio(category) {
    renderPortfolio(category);
  }

  // Animar items del portfolio
  function animatePortfolioItems() {
    const items = document.querySelectorAll(".portfolio-item");
    items.forEach((item, index) => {
      item.style.opacity = "0";
      item.style.transform = "translateY(30px) scale(0.95)";

      setTimeout(() => {
        item.style.transition = "all 0.6s ease-out";
        item.style.opacity = "1";
        item.style.transform = "translateY(0) scale(1)";
      }, index * 75);
    });
  }

  // Event listeners para botones de filtro
  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Remover clase active de todos los botones
      filterButtons.forEach((btn) => btn.classList.remove("active"));

      // Agregar clase active al botón clickeado
      this.classList.add("active");

      // Filtrar portfolio
      const category = this.dataset.filter;
      filterPortfolio(category);
    });
  });

  // Modal functionality
  portfolioGrid.addEventListener("click", function (e) {
    const card = e.target.closest(".portfolio-card");
    if (card) {
      const projectId = card.dataset.projectId;
      const project = portfolioData.find((p) => p.id === projectId);
      if (project) {
        openProjectModal(project);
      }
    }
  }); // Abrir modal del proyecto
  function openProjectModal(project) {
    const modal = document.getElementById("portfolioModal");
    const modalTitle = modal.querySelector(".modal-title");
    const modalImg = modal.querySelector(".modal-image");
    const modalDescription = modal.querySelector(".modal-description");

    modalTitle.textContent = project.title;
    modalImg.src = project.thumbnail;
    modalImg.alt = project.title;
    optimizeImageForDevice(modalImg);

    // Crear contenido completo del modal
    modalDescription.innerHTML = `
    <div class="description-section">
      <h4>DESCRIPTION</h4>
      <p>${project.detailedDescription || project.description}</p>
    </div>
    
    ${
      project.softwares
        ? `
      <div class="softwares-section">
        <h4>SOFTWARES</h4>
        <div class="software-icons">
          ${project.softwares
            .map(
              (software) => `
            <div class="software-icon">
              <img src="${software}" alt="Software icon" />
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    `
        : ""
    }
    
    ${
      project.renders && project.renders.length > 0
        ? `
      <div class="renders-section">
        <h4>RENDERS</h4>
        <div class="renders-grid">
          ${project.renders
            .map(
              (render, index) => `
            <div class="render-item">
              <div class="render-image-container">
                <img src="${render.image || render}" alt="${
                render.view || `Render ${index + 1}`
              }" class="render-image" loading="lazy" />
              </div>
              <div class="render-caption">${
                render.view ||
                (index === 0
                  ? "Front View"
                  : index === 1
                  ? "Back View"
                  : index === 2
                  ? "Side View"
                  : index === 3
                  ? "Top View"
                  : `View ${index + 1}`)
              }</div>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    `
        : ""
    }
  `;

    // Mostrar modal
    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();
  }

  // Función para optimizar imagenes en dispositivos móviles
  function optimizeImageForDevice(imgElement) {
    // Comprobar si es un dispositivo móvil
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
      // En móvil, asegurarse que se use la versión más nítida posible
      imgElement.style.imageRendering = "auto";
      imgElement.style.maxHeight = "50vh";

      // Remover cualquier transformación que pueda causar blur
      imgElement.style.transform = "none";
    }
  }

  // Inicializar
  loadPortfolioData();

  // Funcionalidad para los botones de control del modal
  document.addEventListener("click", function (e) {
    // Botón de expandir
    if (e.target.closest(".expand-btn")) {
      const modalImg = document.querySelector(".modal-image");
      if (modalImg.requestFullscreen) {
        modalImg.requestFullscreen();
      } else if (modalImg.webkitRequestFullscreen) {
        modalImg.webkitRequestFullscreen();
      } else if (modalImg.mozRequestFullScreen) {
        modalImg.mozRequestFullScreen();
      }
    }

    // Botón de descargar
    if (e.target.closest(".download-btn")) {
      const modalImg = document.querySelector(".modal-image");
      const modalTitle = document.querySelector(".modal-title").textContent;

      // Crear enlace temporal para descarga
      const link = document.createElement("a");
      link.href = modalImg.src;
      link.download = `${modalTitle.toLowerCase().replace(/\s+/g, "_")}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  });
});
