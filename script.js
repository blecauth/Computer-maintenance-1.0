// ===== CONFIGURAÇÕES GLOBAIS =====
console.log('📱 TechFix - Menu Mobile Fixo Inferior: Inicializando...');

// ===== VARIÁVEIS GLOBAIS =====
let currentSection = 'home';
let isScrolling = false;
let scrollTimeout;

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('📱 Menu Mobile Fixo: DOM carregado');
    
    // Inicializar funcionalidades
    initMobileBottomNav();
    initSmoothScrolling();
    initSectionObserver();
    initScrollEffects();
    
    console.log('📱 Menu Mobile Fixo: Sistema inicializado com sucesso! ✅');
});

// ===== MENU MOBILE FIXO INFERIOR =====
function initMobileBottomNav() {
    console.log('📱 Menu Mobile Fixo: Inicializando navegação inferior...');
    
    const mobileNav = document.getElementById('mobileBottomNav');
    const navLinks = document.querySelectorAll('.mobile-nav-link');
    
    if (!mobileNav) {
        console.warn('📱 Menu Mobile Fixo: Elemento mobileBottomNav não encontrado');
        return;
    }
    
    // Adicionar event listeners para os links do menu mobile
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetSection = this.getAttribute('data-section');
            console.log(`📱 Menu Mobile Fixo: Navegando para seção: ${targetSection}`);
            
            // Remover classe active de todos os links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Adicionar classe active ao link clicado
            this.classList.add('active');
            
            // Navegar para a seção
            navigateToSection(targetSection);
            
            // Feedback tátil (vibração) se disponível
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
        });
        
        // Adicionar efeito de ripple ao tocar
        link.addEventListener('touchstart', function(e) {
            createRippleEffect(this, e);
        });
    });
    
    console.log('📱 Menu Mobile Fixo: Navegação inferior configurada ✅');
}

// ===== NAVEGAÇÃO SUAVE ENTRE SEÇÕES =====
function initSmoothScrolling() {
    console.log('📱 Menu Mobile Fixo: Configurando scroll suave...');
    
    // Configurar scroll suave para todos os links de navegação
    const allNavLinks = document.querySelectorAll('a[href^="#"], .nav-link-desktop, .mobile-nav-link');
    
    allNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            const targetSection = this.getAttribute('data-section');
            
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const sectionId = href.substring(1) || targetSection;
                navigateToSection(sectionId);
            }
        });
    });
    
    console.log('📱 Menu Mobile Fixo: Scroll suave configurado ✅');
}

// ===== FUNÇÃO DE NAVEGAÇÃO =====
function navigateToSection(sectionId) {
    console.log(`📱 Menu Mobile Fixo: Navegando para: ${sectionId}`);
    
    const targetElement = document.getElementById(sectionId);
    
    if (!targetElement) {
        console.warn(`📱 Menu Mobile Fixo: Seção '${sectionId}' não encontrada`);
        return;
    }
    
    // Calcular offset para compensar header fixo e menu mobile
    const headerHeight = document.querySelector('.header')?.offsetHeight || 70;
    const mobileNavHeight = window.innerWidth <= 768 ? 80 : 0;
    const offset = headerHeight + 20; // 20px de margem adicional
    
    const targetPosition = targetElement.offsetTop - offset;
    
    // Scroll suave
    window.scrollTo({
        top: Math.max(0, targetPosition),
        behavior: 'smooth'
    });
    
    // Atualizar seção atual
    currentSection = sectionId;
    
    // Atualizar estado ativo do menu
    updateActiveNavItem(sectionId);
    
    console.log(`📱 Menu Mobile Fixo: Navegação para '${sectionId}' concluída`);
}

// ===== ATUALIZAR ITEM ATIVO DO MENU =====
function updateActiveNavItem(sectionId) {
    // Atualizar menu desktop
    const desktopLinks = document.querySelectorAll('.nav-link-desktop');
    desktopLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === sectionId) {
            link.classList.add('active');
        }
    });
    
    // Atualizar menu mobile
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    mobileLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === sectionId) {
            link.classList.add('active');
        }
    });
}

// ===== OBSERVADOR DE SEÇÕES =====
function initSectionObserver() {
    console.log('📱 Menu Mobile Fixo: Configurando observador de seções...');
    
    const sections = document.querySelectorAll('section[id]');
    
    if (sections.length === 0) {
        console.warn('📱 Menu Mobile Fixo: Nenhuma seção encontrada');
        return;
    }
    
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px', // Detectar quando a seção está 20% visível
        threshold: 0.1
    };
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !isScrolling) {
                const sectionId = entry.target.id;
                
                if (sectionId !== currentSection) {
                    console.log(`📱 Menu Mobile Fixo: Seção visível: ${sectionId}`);
                    currentSection = sectionId;
                    updateActiveNavItem(sectionId);
                }
            }
        });
    }, observerOptions);
    
    // Observar todas as seções
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
    
    console.log('📱 Menu Mobile Fixo: Observador de seções configurado ✅');
}

// ===== EFEITOS DE SCROLL =====
function initScrollEffects() {
    console.log('📱 Menu Mobile Fixo: Configurando efeitos de scroll...');
    
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    function updateScrollEffects() {
        const currentScrollY = window.scrollY;
        const header = document.querySelector('.header');
        const mobileNav = document.querySelector('.mobile-bottom-nav');
        
        // Efeito de transparência no header
        if (header) {
            if (currentScrollY > 50) {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
                header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = 'none';
            }
        }
        
        // Efeito de hide/show no menu mobile (opcional)
        if (mobileNav && window.innerWidth <= 768) {
            const scrollDifference = currentScrollY - lastScrollY;
            
            if (scrollDifference > 5 && currentScrollY > 100) {
                // Scrolling down - esconder menu
                mobileNav.style.transform = 'translateY(100%)';
            } else if (scrollDifference < -5 || currentScrollY <= 100) {
                // Scrolling up ou no topo - mostrar menu
                mobileNav.style.transform = 'translateY(0)';
            }
        }
        
        lastScrollY = currentScrollY;
        ticking = false;
    }
    
    function requestScrollUpdate() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    }
    
    // Event listener para scroll
    window.addEventListener('scroll', requestScrollUpdate, { passive: true });
    
    // Detectar início e fim do scroll
    window.addEventListener('scroll', function() {
        isScrolling = true;
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(function() {
            isScrolling = false;
        }, 150);
    }, { passive: true });
    
    console.log('📱 Menu Mobile Fixo: Efeitos de scroll configurados ✅');
}

// ===== EFEITO RIPPLE =====
function createRippleEffect(element, event) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.touches ? event.touches[0].clientX - rect.left : event.clientX - rect.left;
    const y = event.touches ? event.touches[0].clientY - rect.top : event.clientY - rect.top;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (x - size / 2) + 'px';
    ripple.style.top = (y - size / 2) + 'px';
    ripple.classList.add('ripple-effect');
    
    // CSS para o efeito ripple
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(255, 255, 255, 0.6)';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple 0.6s linear';
    ripple.style.pointerEvents = 'none';
    
    element.appendChild(ripple);
    
    // Remover o elemento após a animação
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// ===== UTILITÁRIOS =====

// Função para detectar dispositivo móvel
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
}

// Função para detectar orientação
function getOrientation() {
    return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
}

// Função para log de debug
function debugLog(message, data = null) {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log(`📱 DEBUG: ${message}`, data || '');
    }
}

// ===== EVENT LISTENERS GLOBAIS =====

// Listener para mudanças de orientação
window.addEventListener('orientationchange', function() {
    setTimeout(() => {
        console.log(`📱 Menu Mobile Fixo: Orientação alterada para: ${getOrientation()}`);
        
        // Reajustar layout se necessário
        const mobileNav = document.querySelector('.mobile-bottom-nav');
        if (mobileNav && isMobileDevice()) {
            mobileNav.style.display = 'block';
        }
    }, 100);
});

// Listener para redimensionamento da janela
window.addEventListener('resize', function() {
    const mobileNav = document.querySelector('.mobile-bottom-nav');
    const desktopNav = document.querySelector('.nav-menu-desktop');
    
    if (window.innerWidth <= 768) {
        // Modo mobile
        if (mobileNav) mobileNav.style.display = 'block';
        if (desktopNav) desktopNav.style.display = 'none';
        document.body.style.paddingBottom = '80px';
    } else {
        // Modo desktop
        if (mobileNav) mobileNav.style.display = 'none';
        if (desktopNav) desktopNav.style.display = 'flex';
        document.body.style.paddingBottom = '0';
    }
});

// ===== CSS DINÂMICO PARA ANIMAÇÕES =====
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .mobile-bottom-nav {
        transition: transform 0.3s ease-out !important;
    }
    
    .mobile-nav-link {
        position: relative;
        overflow: hidden;
    }
    
    .mobile-nav-link.active::before {
        animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
        0%, 100% {
            opacity: 1;
            transform: translateX(-50%) scale(1);
        }
        50% {
            opacity: 0.7;
            transform: translateX(-50%) scale(1.2);
        }
    }
`;
document.head.appendChild(style);

// ===== INICIALIZAÇÃO FINAL =====
console.log('📱 Menu Mobile Fixo: Script carregado com sucesso! 🚀');

// Exportar funções para uso global (se necessário)
window.TechFixMobileNav = {
    navigateToSection,
    updateActiveNavItem,
    isMobileDevice,
    getOrientation,
    debugLog
};

