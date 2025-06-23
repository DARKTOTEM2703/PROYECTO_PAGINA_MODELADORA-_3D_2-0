document.addEventListener("DOMContentLoaded", function () {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const portfolioItems = document.querySelectorAll(".portfolio-item");
  const portfolioCards = document.querySelectorAll(".portfolio-card");

  // Función para filtrar elementos
  function filterPortfolio(category) {
    portfolioItems.forEach((item) => {
      const itemCategories = item.dataset.category.split(" ");

      if (category === "all" || itemCategories.includes(category)) {
        item.style.display = "block";
        item.style.opacity = "0";
        setTimeout(() => {
          item.style.opacity = "1";
        }, 100);
      } else {
        item.style.opacity = "0";
        setTimeout(() => {
          item.style.display = "none";
        }, 300);
      }
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
  portfolioCards.forEach((card) => {
    card.addEventListener("click", function () {
      const img = this.querySelector("img");
      const title = this.querySelector("h3").textContent;
      const description = this.querySelector("p").textContent;

      // Actualizar modal
      const modal = document.getElementById("portfolioModal");
      const modalTitle = modal.querySelector(".modal-title");
      const modalImg = modal.querySelector(".modal-body img");
      const modalDescription = modal.querySelector(".modal-description p");

      modalTitle.textContent = title;
      modalImg.src = img.src;
      modalImg.alt = img.alt;
      modalDescription.textContent = description;

      // Mostrar modal
      const bootstrapModal = new bootstrap.Modal(modal);
      bootstrapModal.show();
    });
  });
});
