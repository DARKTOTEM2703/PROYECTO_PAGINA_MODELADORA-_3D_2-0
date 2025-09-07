(function() {
  // Idioma por defecto
  let currentLang = localStorage.getItem('preferredLang') || 'es';

  // Cargar Google Translate
  function loadGoogleTranslate() {
    if (!window.googleTranslateElementInit) {
      window.googleTranslateElementInit = function() {
        new google.translate.TranslateElement({
          pageLanguage: 'es',
          includedLanguages: 'es,en',
          autoDisplay: false
        }, 'google_translate_element');
        setTimeout(() => {
          setLanguage(currentLang);
        }, 1200);
      };
      var script = document.createElement('script');
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      document.head.appendChild(script);
    }
  }

  // Cambia el idioma usando el select oculto
  function setLanguage(lang) {
    var select = document.querySelector('.goog-te-combo');
    if (select) {
      select.value = lang;
      select.dispatchEvent(new Event('change'));
      updateLangBtn(lang);
    }
  }

  // Alterna entre ES/EN
  function toggleGoogleTranslate() {
    currentLang = currentLang === 'es' ? 'en' : 'es';
    localStorage.setItem('preferredLang', currentLang);
    setLanguage(currentLang);
  }

  // Actualiza el texto del botón
  function updateLangBtn(lang) {
    var langBtn = document.getElementById('langBtn');
    if (langBtn) {
      langBtn.innerHTML = lang === 'es'
        ? '<i class="fas fa-globe"></i> EN'
        : '<i class="fas fa-globe"></i> ES';
    }
  }

  // Oculta la barra y menú de Google Translate
  function hideGoogleTranslateBar() {
    setInterval(function() {
      var gtFrame = document.querySelector('iframe.goog-te-banner-frame');
      if (gtFrame) {
        gtFrame.style.display = 'none';
        gtFrame.style.visibility = 'hidden';
        gtFrame.style.height = '0';
      }
      document.body.style.top = '0px';
    }, 500);
  }

  function forceRemoveGoogleBanner() {
    setInterval(function() {
      var gtFrame = document.querySelector('iframe.goog-te-banner-frame');
      if (gtFrame && gtFrame.parentNode) {
        gtFrame.parentNode.removeChild(gtFrame);
      }
      var gtDiv = document.querySelector('div#goog-gt-tt');
      if (gtDiv && gtDiv.parentNode) {
        gtDiv.parentNode.removeChild(gtDiv);
      }
      var gtMenuFrame = document.querySelector('iframe.goog-te-menu-frame');
      if (gtMenuFrame && gtMenuFrame.parentNode) {
        gtMenuFrame.parentNode.removeChild(gtMenuFrame);
      }
      document.body.style.top = '0px';
    }, 500);
  }

  document.addEventListener('DOMContentLoaded', function() {
    loadGoogleTranslate();
    var langBtn = document.getElementById('langBtn');
    if (langBtn) {
      langBtn.addEventListener('click', toggleGoogleTranslate);
      updateLangBtn(currentLang);
    }
    hideGoogleTranslateBar();
    forceRemoveGoogleBanner();
  });
})();