// ===== MENU MOBILE UNIVERSALMENTE RESPONSIVO =====
// Sistema robusto e compatível com todos os dispositivos

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 TechFix - Sistema de Menu Mobile Iniciado');
    
    // ===== ELEMENTOS DO DOM =====
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');
    const navOverlay = document.getElementById('navOverlay');
    const navClose = document.getElementById('navClose');
    const navLinks = document.querySelectorAll('.nav-link');
    const body = document.body;
    
    // ===== ESTADO DO MENU =====
    let isMenuOpen = false;
    let isAnimating = false;
    
    // ===== FUNÇÕES DE UTILIDADE =====
    
    // Detecta se é dispositivo móvel
    function isMobileDevice() {
        return window.innerWidth <= 768 || 
               /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    // Detecta se é touch device
    function isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }
    
    // Previne scroll do body
    function preventBodyScroll() {
        const scrollY = window.scrollY;
        body.style.position = 'fixed';
        body.style.top = `-${scrollY}px`;
        body.style.width = '100%';
        body.classList.add('nav-open');
    }
    
    // Restaura scroll do body
    function restoreBodyScroll() {
        const scrollY = body.style.top;
        body.style.position = '';
        body.style.top = '';
        body.style.width = '';
        body.classList.remove('nav-open');
        if (scrollY) {
            window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }
    }
    
    // Feedback tátil (vibração)
    function hapticFeedback(duration = 50) {
        if ('vibrate' in navigator && isTouchDevice()) {
            navigator.vibrate(duration);
        }
    }
    
    // Log de debug
    function debugLog(message, data = null) {
        console.log(`📱 Menu Mobile: ${message}`, data || '');
    }
    
    // ===== FUNÇÕES DO MENU =====
    
    // Abre o menu mobile
    function openMenu() {
        if (isAnimating || isMenuOpen) return;
        
        debugLog('Abrindo menu mobile...');
        isAnimating = true;
        isMenuOpen = true;
        
        // Atualiza atributos de acessibilidade
        mobileMenuToggle.setAttribute('aria-expanded', 'true');
        mobileMenuToggle.classList.add('active');
        
        // Ativa o menu
        navMenu.classList.add('active');
        
        // Previne scroll do body
        preventBodyScroll();
        
        // Feedback tátil
        hapticFeedback();
        
        // Foca no primeiro link após a animação
        setTimeout(() => {
            const firstLink = navMenu.querySelector('.nav-link');
            if (firstLink) {
                firstLink.focus();
            }
            isAnimating = false;
            debugLog('Menu aberto com sucesso');
        }, 300);
    }
    
    // Fecha o menu mobile
    function closeMenu() {
        if (isAnimating || !isMenuOpen) return;
        
        debugLog('Fechando menu mobile...');
        isAnimating = true;
        isMenuOpen = false;
        
        // Atualiza atributos de acessibilidade
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        mobileMenuToggle.classList.remove('active');
        
        // Desativa o menu
        navMenu.classList.remove('active');
        
        // Restaura scroll do body
        restoreBodyScroll();
        
        // Feedback tátil
        hapticFeedback(30);
        
        // Retorna foco para o botão toggle
        setTimeout(() => {
            mobileMenuToggle.focus();
            isAnimating = false;
            debugLog('Menu fechado com sucesso');
        }, 300);
    }
    
    // Alterna o estado do menu
    function toggleMenu() {
        if (isMenuOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }
    
    // ===== EVENT LISTENERS =====
    
    // Botão de toggle do menu
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            debugLog('Clique no botão toggle');
            toggleMenu();
        });
        
        // Suporte a teclado
        mobileMenuToggle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMenu();
            }
        });
    }
    
    // Botão de fechar
    if (navClose) {
        navClose.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            debugLog('Clique no botão fechar');
            closeMenu();
        });
        
        // Suporte a teclado
        navClose.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                closeMenu();
            }
        });
    }
    
    // Overlay
    if (navOverlay) {
        navOverlay.addEventListener('click', function(e) {
            e.preventDefault();
            debugLog('Clique no overlay');
            closeMenu();
        });
    }
    
    // Links de navegação
    navLinks.forEach((link, index) => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Se for link interno (âncora)
            if (href && href.startsWith('#')) {
                e.preventDefault();
                
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    debugLog(`Navegando para seção: ${targetId}`);
                    
                    // Fecha o menu se estiver aberto
                    if (isMenuOpen) {
                        closeMenu();
                        
                        // Aguarda o menu fechar antes de fazer scroll
                        setTimeout(() => {
                            scrollToSection(targetElement);
                        }, 350);
                    } else {
                        scrollToSection(targetElement);
                    }
                    
                    // Atualiza link ativo
                    updateActiveLink(this);
                }
            } else {
                // Para links externos, apenas fecha o menu
                if (isMenuOpen) {
                    closeMenu();
                }
            }
        });
        
        // Suporte a teclado para navegação
        link.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                this.click();
            }
            
            // Navegação com setas
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                const nextLink = navLinks[index + 1];
                if (nextLink) {
                    nextLink.focus();
                }
            }
            
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                const prevLink = navLinks[index - 1];
                if (prevLink) {
                    prevLink.focus();
                }
            }
        });
    });
    
    // ===== NAVEGAÇÃO E SCROLL =====
    
    // Scroll suave para seção
    function scrollToSection(element) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const elementPosition = element.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    }
    
    // Atualiza link ativo
    function updateActiveLink(activeLink) {
        navLinks.forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');
        
        setTimeout(() => {
            activeLink.classList.remove('active');
        }, 1000);
    }
    
    // ===== EVENTOS GLOBAIS =====
    
    // Tecla ESC para fechar menu
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isMenuOpen) {
            debugLog('ESC pressionado - fechando menu');
            closeMenu();
        }
    });
    
    // Clique fora do menu para fechar
    document.addEventListener('click', function(e) {
        if (isMenuOpen && 
            !navMenu.contains(e.target) && 
            !mobileMenuToggle.contains(e.target)) {
            debugLog('Clique fora do menu - fechando');
            closeMenu();
        }
    });
    
    // Redimensionamento da janela
    window.addEventListener('resize', function() {
        // Fecha menu se mudou para desktop
        if (window.innerWidth > 768 && isMenuOpen) {
            debugLog('Mudança para desktop - fechando menu');
            closeMenu();
        }
    });
    
    // ===== GESTOS TOUCH =====
    
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;
    
    // Início do toque
    document.addEventListener('touchstart', function(e) {
        if (!isMobileDevice()) return;
        
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchStartTime = Date.now();
    }, { passive: true });
    
    // Fim do toque
    document.addEventListener('touchend', function(e) {
        if (!isMobileDevice()) return;
        
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const touchEndTime = Date.now();
        
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        const deltaTime = touchEndTime - touchStartTime;
        
        // Swipe para a direita para abrir menu (apenas na borda esquerda)
        if (deltaX > 50 && 
            Math.abs(deltaY) < 100 && 
            deltaTime < 300 && 
            touchStartX < 50 && 
            !isMenuOpen) {
            debugLog('Swipe para direita detectado - abrindo menu');
            openMenu();
        }
        
        // Swipe para a esquerda para fechar menu
        if (deltaX < -50 && 
            Math.abs(deltaY) < 100 && 
            deltaTime < 300 && 
            isMenuOpen) {
            debugLog('Swipe para esquerda detectado - fechando menu');
            closeMenu();
        }
    }, { passive: true });
    
    // ===== EFEITOS VISUAIS =====
    
    // Efeito de scroll no header
    function handleScroll() {
        const header = document.querySelector('.header');
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (header) {
            if (scrollTop > 50) {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
                header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = '';
            }
        }
        
        // Atualiza link ativo baseado na seção visível
        updateActiveNavLink();
    }
    
    // Atualiza link ativo baseado na seção visível
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                
                const activeLink = document.querySelector(`.nav-link[data-section="${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }
    
    // Event listener para scroll
    window.addEventListener('scroll', handleScroll);
    
    // ===== ANIMAÇÕES DE ENTRADA =====
    
    // Inicializa elementos animados
    function initAnimatedElements() {
        const animatedElements = document.querySelectorAll('.service-card, .advantage-card, .contact-card');
        
        animatedElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        });
    }
    
    // Anima elementos ao entrar na viewport
    function animateOnScroll() {
        const animatedElements = document.querySelectorAll('.service-card, .advantage-card, .contact-card');
        
        animatedElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }
    
    // ===== EFEITOS PARALLAX =====
    
    function handleParallax() {
        const heroParticles = document.querySelector('.hero-particles');
        const scrollTop = window.pageYOffset;
        
        if (heroParticles) {
            heroParticles.style.transform = `translateY(${scrollTop * 0.5}px)`;
        }
    }
    
    // Throttle para performance
    let ticking = false;
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(() => {
                handleParallax();
                animateOnScroll();
                ticking = false;
            });
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
    
    // ===== SMOOTH SCROLL PARA BOTÕES =====
    
    function initSmoothScroll() {
        const heroButtons = document.querySelectorAll('.hero-buttons .btn');
        
        heroButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        scrollToSection(targetElement);
                    }
                }
            });
        });
    }
    
    // ===== EFEITOS DE HOVER (APENAS DESKTOP) =====
    
    function initCardEffects() {
        if (isTouchDevice()) return;
        
        const cards = document.querySelectorAll('.service-card, .advantage-card, .contact-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px) scale(1.02)';
                this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = '';
                this.style.boxShadow = '';
            });
        });
    }
    
    // ===== EFEITO RIPPLE NOS BOTÕES =====
    
    function initRippleEffect() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('ripple');
                
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }
    
    // ===== INICIALIZAÇÃO =====
    
    function init() {
        debugLog('Inicializando sistema de menu mobile...');
        debugLog('Dispositivo móvel:', isMobileDevice());
        debugLog('Touch device:', isTouchDevice());
        debugLog('User Agent:', navigator.userAgent);
        
        // Inicializa componentes
        initAnimatedElements();
        initSmoothScroll();
        initCardEffects();
        initRippleEffect();
        
        // Executa scroll inicial
        handleScroll();
        
        debugLog('Sistema inicializado com sucesso! ✅');
    }
    
    // ===== TRATAMENTO DE ERROS =====
    
    window.addEventListener('error', function(e) {
        console.error('❌ Erro no sistema de menu:', e.error);
    });
    
    // ===== PERFORMANCE MONITORING =====
    
    if ('performance' in window) {
        window.addEventListener('load', function() {
            const loadTime = performance.now();
            debugLog(`Tempo de carregamento: ${loadTime.toFixed(2)}ms`);
        });
    }
    
    // ===== INICIALIZAÇÃO FINAL =====
    
    // Aguarda um frame para garantir que tudo foi renderizado
    requestAnimationFrame(() => {
        init();
    });
    
    // ===== EXPOSIÇÃO GLOBAL PARA DEBUG =====
    
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.TechFixMenu = {
            openMenu,
            closeMenu,
            toggleMenu,
            isMenuOpen: () => isMenuOpen,
            isAnimating: () => isAnimating,
            debugLog
        };
        
        debugLog('Funções de debug expostas em window.TechFixMenu');
    }
    
    console.log('🎉 TechFix - Sistema de Menu Mobile Carregado com Sucesso!');
});

