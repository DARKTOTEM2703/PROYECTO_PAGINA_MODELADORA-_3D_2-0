document.addEventListener('DOMContentLoaded', function() {
    // Detectar si es móvil
    const isMobile = window.innerWidth <= 768;
    
    // Detectar qué página estamos viendo
    const currentPage = getCurrentPage();
    
    // Aplicar clase específica al body
    document.body.classList.add(currentPage + '-page');
    
    // Si es móvil, agregar clase específica
    if (isMobile) {
        document.body.classList.add('mobile-view');
    }
    
    // Inicializar animaciones de scroll reveal
    initScrollReveal();
    
    // Detectar página actual
    function getCurrentPage() {
        const path = window.location.pathname;
        const filename = path.split('/').pop() || 'index.html';
        
        switch(filename) {
            case 'index.html':
            case '':
                return 'home';
            case 'portfolio.html':
                return 'portfolio';
            case 'about.html':
                return 'about';
            case 'experience.html':
                return 'experience';
            case 'contact.html':
                return 'contact';
            default:
                return 'home';
        }
    }
    
    // Manejar el toggle del sidebar en móvil
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (sidebarToggle && sidebar && isMobile) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('mobile-visible');
            
            // Animar elementos del sidebar cuando se abre
            if (sidebar.classList.contains('mobile-visible')) {
                animateSidebarElements();
            }
        });
    }
    
    // Animar elementos del sidebar cuando se abre en móvil
    function animateSidebarElements() {
        const profileSection = sidebar.querySelector('.profile-section');
        const navItems = sidebar.querySelectorAll('.navigation ul li');
        const socialMedia = sidebar.querySelector('.social-media');
        
        // Reset y animar profile
        if (profileSection) {
            profileSection.style.transform = 'translateY(20px)';
            profileSection.style.opacity = '0';
            setTimeout(() => {
                profileSection.style.transition = 'all 0.3s ease';
                profileSection.style.transform = 'translateY(0)';
                profileSection.style.opacity = '1';
            }, 100);
        }
        
        // Animar items de navegación
        navItems.forEach((item, index) => {
            item.style.transform = 'translateX(-20px)';
            item.style.opacity = '0';
            setTimeout(() => {
                item.style.transition = 'all 0.3s ease';
                item.style.transform = 'translateX(0)';
                item.style.opacity = '1';
            }, 200 + (index * 50));
        });
        
        // Animar social media
        if (socialMedia) {
            socialMedia.style.transform = 'translateY(20px)';
            socialMedia.style.opacity = '0';
            setTimeout(() => {
                socialMedia.style.transition = 'all 0.3s ease';
                socialMedia.style.transform = 'translateY(0)';
                socialMedia.style.opacity = '1';
            }, 400);
        }
    }
    
    // Cerrar sidebar al hacer click fuera (solo móvil)
    if (isMobile) {
        document.addEventListener('click', function(e) {
            if (sidebar && sidebar.classList.contains('mobile-visible')) {
                if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
                    sidebar.classList.remove('mobile-visible');
                }
            }
        });
    }
    
    // Animaciones de scroll reveal
    function initScrollReveal() {
        const revealElements = document.querySelectorAll('.scroll-reveal');
        
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        revealElements.forEach(element => {
            observer.observe(element);
        });
    }
    
    // Manejar cambios de tamaño de ventana
    window.addEventListener('resize', function() {
        const newIsMobile = window.innerWidth <= 768;
        
        if (newIsMobile !== isMobile) {
            location.reload(); // Recargar si cambia entre móvil y desktop
        }
    });
    
    // Animación especial para filtros del portfolio
    if (currentPage === 'portfolio') {
        const filterButtons = document.querySelectorAll('.filter-btn');
        
        filterButtons.forEach((btn, index) => {
            btn.addEventListener('click', function() {
                // Animación de ripple en el botón
                createRipple(this, event);
                
                // Animar items del portfolio
                animatePortfolioFilter();
            });
        });
    }
    
    // Efecto ripple para botones
    function createRipple(button, event) {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    // Animar portfolio al filtrar
    function animatePortfolioFilter() {
        const items = document.querySelectorAll('.portfolio-item');
        
        items.forEach((item, index) => {
            item.style.animation = 'none';
            item.style.transform = 'translateY(20px) scale(0.95)';
            item.style.opacity = '0';
            
            setTimeout(() => {
                item.style.animation = `portfolioItemEnter 0.4s ease-out forwards`;
            }, index * 50);
        });
    }
    
    // Agregar estilos CSS dinámicamente para el ripple
    const style = document.createElement('style');
    style.textContent = `
        .filter-btn {
            position: relative;
            overflow: hidden;
        }
        
        .ripple {
            position: absolute;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: rippleAnimation 0.6s ease-out;
            pointer-events: none;
        }
        
        @keyframes rippleAnimation {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Smooth scroll para enlaces internos
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});