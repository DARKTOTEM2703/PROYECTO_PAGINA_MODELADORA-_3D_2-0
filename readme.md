
Objetivo
--------------
Sitio web estático que expone un portafolio 3D (personajes, escenarios, proyectos de gamejams) construido con HTML, CSS y JavaScript. El contenido del portafolio se carga desde un JSON local y el frontend incluye: carga perezosa de imágenes, optimizaciones para video/turntables, modal ampliable con controles, y menú lateral responsive.

Estructura del proyecto (principales archivos)
----------------------------------------------
- Páginas HTML:
  - [index.html](index.html)
  - [portfolio.html](portfolio.html)
  - [about.html](about.html)
  - [experience.html](experience.html)
  - [contact.html](contact.html)

- CSS:
  - [css/portfolio.css](css/portfolio.css) (estilos principales del portfolio)
  - [css/index.css](css/index.css)
  - [css/about.css](css/about.css)
  - [css/experience.css](css/experience.css)
  - [css/contact.css](css/contact.css)
  - [css/page-animations.css](css/page-animations.css)
  - [css/page-transitions.css](css/page-transitions.css)

- JavaScript:
  - [js/portfolio.js](js/portfolio.js) — lógica del portfolio: carga de datos, render, modal, videos.
    - Funciones clave: [`loadPortfolioData`](js/portfolio.js), [`renderPortfolio`](js/portfolio.js), [`createProjectElement`](js/portfolio.js), [`initLazyLoading`](js/portfolio.js), [`openProjectModal`](js/portfolio.js), [`optimizeVideoScroll`](js/portfolio.js), [`setupVideoControls`](js/portfolio.js).
  - [js/sidebar.js](js/sidebar.js) — comportamiento del sidebar mobile: [`showSidebar`](js/sidebar.js), [`hideSidebar`](js/sidebar.js), [`initMobileState`](js/sidebar.js).
  - [js/page-animations.js](js/page-animations.js) — añade clases de página, scroll reveal y animaciones: [`initScrollReveal`](js/page-animations.js), [`animateSidebarElements`](js/page-animations.js).
  - [js/page-transitions.js](js/page-transitions.js) — transiciones entre páginas.
  - [js/translater.js](js/translater.js) — integración / controles para Google Translate.
  - [js/contact.js](js/contact.js) — formulario de contacto, envío con Formspree y fallback mailto.
  - [js/mailto.js](js/mailto.js) — (fallback/ayudas mailto si aplica).
  - [js/main.js](js/main.js) — utilidades generales (ej. carrusel).

- Datos y assets:
  - [data/portfolio.json](data/portfolio.json) — fuente canonical de proyectos (títulos, categorías, rutas de imágenes, videos, iconos).
  - Carpeta de imágenes: `img/` (thumbnails, renders, posters, videos).
  - Carpeta `portfolio/` (PDFs u otros recursos exportables).

Cómo funciona (flujo principal)
------------------------------
1. Al cargar la página del portfolio ([portfolio.html](portfolio.html)) el script principal [js/portfolio.js](js/portfolio.js) ejecuta [`loadPortfolioData`](js/portfolio.js) que lee `data/portfolio.json` y almacena los objetos en memoria.
2. [`renderPortfolio`](js/portfolio.js) genera la grilla (DOM) usando [`createProjectElement`](js/portfolio.js). Cada tarjeta contiene:
   - placeholder visual mientras se carga la imagen.
   - imagen con atributo `data-src` para lazy loading.
   - metadata (categorías, título, descripción breve).
3. Después de renderizar, [`initLazyLoading`](js/portfolio.js) usa IntersectionObserver para cargar imágenes cuando se acercan a la vista.
4. Click en una tarjeta abre el modal y ejecuta [`openProjectModal`](js/portfolio.js): carga renders, descripción, iconos de software y —si existe— sección de turntable/video con controles.
5. Los videos en el modal usan controles personalizados y optimizaciones:
   - [`setupVideoControls`](js/portfolio.js) configura play/pause, fullscreen y autoplay (muted para permitir autoplay).
   - [`optimizeVideoScroll`](js/portfolio.js) usa Observer para precargar metadata y pausar cuando no son visibles.
6. Sidebar y UX móvil:
   - [js/sidebar.js](js/sidebar.js) maneja overlay, gestos táctiles y estados móviles (`showSidebar` / `hideSidebar`).
   - [js/page-animations.js](js/page-animations.js) aplica clases de página y animaciones de entrada/reveal.

Datos del portafolio
--------------------
- El catálogo de proyectos se mantiene en [data/portfolio.json](data/portfolio.json). Cada proyecto contiene campos como `id`, `title`, `category`, `thumbnail`, `renders`, `video(s)`, `softwares` (ruta a iconos), `detailedDescription` y metadatos (`creationDate`, `displayDate`).
- Para añadir un proyecto: seguir la estructura JSON en [data/portfolio.json](data/portfolio.json) y subir las imágenes/videos a `img/...`. No se requiere paso de build.

Cómo ejecutar en local
----------------------
El sitio es estático. Opciones recomendadas:

- Servidor rápido con Python (desde la raíz del proyecto):
  - Python 3:  
    python -m http.server 8000
  - Abrir luego http://localhost:8000/ y navegar a [portfolio.html](portfolio.html)

- Usar extensiones como Live Server (VSCode) o cualquier servidor estático.

Notas técnicas y consideraciones
--------------------------------
- Responsive: estilos adaptativos en [css/portfolio.css](css/portfolio.css) + reglas comunes en otros CSS. Sidebar mobile controlado por [`sidebar-toggle`](css/portfolio.css) y [js/sidebar.js](js/sidebar.js).
- Lazy loading: imágenes usan `loading="lazy"` y una estrategia con IntersectionObserver ([`initLazyLoading`](js/portfolio.js)).
- Videos: preload="metadata" y uso de `muted` para autoplay fiable; cuando hay múltiples videos, [`optimizeVideoScroll`](js/portfolio.js) reduce la carga y pausa cuando no están visibles.
- Modal: usa Bootstrap 5 (bundle) y estilos personalizados en [css/portfolio.css](css/portfolio.css). Descarga y expand (fullscreen) gestionados por handlers en [js/portfolio.js](js/portfolio.js).
- Formulario de contacto: [contact.html](contact.html) + [js/contact.js](js/contact.js). Usa Formspree por atributo `data-formspree` en el form. Revisar `data-formspree` en el HTML para configurar su ID.
- Traducción: se usa Google Translate widget (oculto por CSS) con controles en [js/translater.js](js/translater.js) y reglas CSS en [css/about.css](css/about.css) / [css/portfolio.css](css/portfolio.css) para ocultar banners no deseados.

Buenas prácticas sugeridas para contribuir
-----------------------------------------
- Mantener rutas relativas en JSON coherentes con `img/`.
- Al añadir iconos en `softwares`, preferir SVGs (mejor escalado).
- Evitar nombres con espacios en rutas si se sirve desde servidores que puedan URL-encode.
- Test visual en móvil para turntables/videos (limits de memoria y autoplay).
- Conservar accesibilidad mínima: atributos alt en imágenes, etiquetas aria en botones importantes.

Tareas futuras / mejoras sugeridas
----------------------------------
- Añadir build pipeline (por ejemplo Vite/Parcel) para optimizar assets en producción.
- Generar thumbnails webp y srcset para mejorar rendimiento.
- Implementar paginación o carga incremental si crece la cantidad de proyectos.
- Extraer lógica JS modular (ES modules) para tests unitarios y mejor mantenibilidad.
- Añadir JSON schema y validación al cargar `data/portfolio.json`.

Referencias de código clave
---------------------------
- Datos: [data/portfolio.json](data/portfolio.json)  
- Render / lógica portfolio: [js/portfolio.js](js/portfolio.js) — [`loadPortfolioData`](js/portfolio.js), [`renderPortfolio`](js/portfolio.js), [`createProjectElement`](js/portfolio.js), [`initLazyLoading`](js/portfolio.js), [`openProjectModal`](js/portfolio.js), [`optimizeVideoScroll`](js/portfolio.js), [`setupVideoControls`](js/portfolio.js)  
- Sidebar: [js/sidebar.js](js/sidebar.js) — [`showSidebar`](js/sidebar.js), [`hideSidebar`](js/sidebar.js), [`initMobileState`](js/sidebar.js)  
- Animaciones/Reveal: [js/page-animations.js](js/page-animations.js) — [`initScrollReveal`](js/page-animations.js), [`animateSidebarElements`](js/page-animations.js)  
- Estilos principales: [css/portfolio.css](css/portfolio.css) (importa [css/page-transitions.css](css/page-transitions.css) y [css/page-animations.css](css/page-animations.css))  
- Formulario contacto: [contact.html](contact.html) + [js/contact.js](js/contact.js)

Licencia y créditos
-------------------
- Archivo actual no contiene licencia. Recomendar añadir una licencia (MIT/Apache2) si se permite uso público.
- Incluir créditos para iconos de terceros (devicon, Marmoset icons, etc.) según corresponda.

Contacto del autor en el proyecto
---------------------------------
- Links en el sidebar del sitio (LinkedIn, ArtStation, Instagram, Twitter) referenciados desde [portfolio.html](portfolio.html) y otros HTML.