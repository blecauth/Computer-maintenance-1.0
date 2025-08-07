// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const navLinks = document.querySelectorAll('.nav-link');
    const navList = document.querySelector('.nav-list');
    const toast = document.getElementById('toast');
    
    // Estado do menu mobile
    let isMobileMenuOpen = false;
    
    // Função para mostrar toast notification
    function showToast(message, type = 'success', duration = 3000) {
        if (!toast) return;
        
        const toastIcon = toast.querySelector('.toast-icon');
        const toastMessage = toast.querySelector('.toast-message');
        
        // Remove classes anteriores
        toast.classList.remove('success', 'error', 'show');
        
        // Define o ícone baseado no tipo
        if (type === 'success') {
            toastIcon.className = 'toast-icon fas fa-check-circle';
            toast.classList.add('success');
        } else if (type === 'error') {
            toastIcon.className = 'toast-icon fas fa-exclamation-circle';
            toast.classList.add('error');
        } else {
            toastIcon.className = 'toast-icon fas fa-info-circle';
        }
        
        // Define a mensagem
        toastMessage.textContent = message;
        
        // Mostra o toast
        toast.classList.add('show');
        
        // Remove o toast após o tempo especificado
        setTimeout(() => {
            toast.classList.remove('show');
        }, duration);
    }
    
    // Função para detectar se está em mobile
    function isMobile() {
        return window.innerWidth <= 768;
    }
    
    // Função para abrir o menu mobile
    function openMobileMenu() {
        if (!isMobile()) return;
        
        isMobileMenuOpen = true;
        navList.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Adiciona animação aos links do menu
        navLinks.forEach((link, index) => {
            link.style.animationDelay = `${index * 0.1}s`;
            link.style.animation = 'fadeInLeft 0.3s ease-out forwards';
        });
    }
    
    // Função para fechar o menu mobile
    function closeMobileMenu() {
        isMobileMenuOpen = false;
        navList.classList.remove('active');
        document.body.style.overflow = '';
        
        // Remove animações dos links
        navLinks.forEach(link => {
            link.style.animation = '';
            link.style.animationDelay = '';
        });
    }
    
    // Função para alternar o menu mobile
    function toggleMobileMenu() {
        if (isMobileMenuOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }
    
    // Event listeners para os links de navegação
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Se for um link interno (âncora)
            if (href && href.startsWith('#')) {
                e.preventDefault();
                
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    // Fecha o menu mobile se estiver aberto
                    if (isMobileMenuOpen) {
                        closeMobileMenu();
                    }
                    
                    // Remove classe ativa de todos os links
                    navLinks.forEach(navLink => navLink.classList.remove('active'));
                    
                    // Adiciona classe ativa ao link clicado
                    link.classList.add('active');
                    
                    // Scroll suave para o elemento
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Remove classe ativa após um tempo
                    setTimeout(() => {
                        link.classList.remove('active');
                    }, 1000);
                }
            } else {
                // Para links externos, apenas fecha o menu
                if (isMobileMenuOpen) {
                    closeMobileMenu();
                }
            }
        });
        
        // Efeitos de hover aprimorados
        link.addEventListener('mouseenter', function() {
            if (!isMobile()) {
                this.style.transform = 'translateY(-2px) scale(1.05)';
            }
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
    
    // Função para adicionar efeitos de scroll
    function handleScroll() {
        const header = document.querySelector('.header');
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Efeito no header baseado no scroll
        if (header) {
            if (scrollTop > 50) {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
                header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = '';
            }
        }
        
        // Animação de elementos ao entrar na viewport
        const animatedElements = document.querySelectorAll('.service-card, .advantage-card, .contact-card');
        
        animatedElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
        
        // Atualizar link ativo baseado na seção visível
        updateActiveNavLink();
    }
    
    // Função para atualizar o link ativo baseado na seção visível
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                // Remove classe ativa de todos os links
                navLinks.forEach(link => link.classList.remove('active'));
                
                // Adiciona classe ativa ao link correspondente
                const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }
    
    // Event listener para scroll
    window.addEventListener('scroll', handleScroll);
    
    // Inicializa elementos animados
    function initAnimatedElements() {
        const animatedElements = document.querySelectorAll('.service-card, .advantage-card, .contact-card');
        
        animatedElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        });
    }
    
    // Função para fechar menu ao redimensionar a janela
    function handleResize() {
        if (window.innerWidth > 768 && isMobileMenuOpen) {
            closeMobileMenu();
        }
    }
    
    // Event listener para redimensionamento
    window.addEventListener('resize', handleResize);
    
    // Função para adicionar efeitos de parallax suave
    function handleParallax() {
        const heroParticles = document.querySelector('.hero-particles');
        const scrollTop = window.pageYOffset;
        
        if (heroParticles) {
            heroParticles.style.transform = `translateY(${scrollTop * 0.5}px)`;
        }
    }
    
    // Event listener para parallax (com throttle para performance)
    let ticking = false;
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(() => {
                handleParallax();
                ticking = false;
            });
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
    
    // Função para smooth scroll nos botões da hero section
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
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });
    }
    
    // Função para adicionar efeitos de hover nos cards
    function initCardEffects() {
        const cards = document.querySelectorAll('.service-card, .advantage-card, .contact-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                if (!isMobile()) {
                    this.style.transform = 'translateY(-10px) scale(1.02)';
                    this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
                }
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = '';
                this.style.boxShadow = '';
            });
        });
    }
    
    // Função para adicionar efeito de ripple nos botões
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
    
    // Função para lazy loading de imagens (se houver)
    function initLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window && images.length > 0) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        }
    }
    
    // Função para adicionar funcionalidade de clique fora do menu para fechar
    function initClickOutside() {
        document.addEventListener('click', function(e) {
            if (isMobileMenuOpen && !navList.contains(e.target) && !e.target.closest('.nav-brand')) {
                closeMobileMenu();
            }
        });
    }
    
    // Função para adicionar suporte a teclas de atalho
    function initKeyboardShortcuts() {
        document.addEventListener('keydown', function(e) {
            // ESC para fechar menu mobile
            if (e.key === 'Escape' && isMobileMenuOpen) {
                closeMobileMenu();
            }
            
            // Teclas numéricas para navegação rápida
            if (e.altKey) {
                switch(e.key) {
                    case '1':
                        e.preventDefault();
                        document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' });
                        break;
                    case '2':
                        e.preventDefault();
                        document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
                        break;
                    case '3':
                        e.preventDefault();
                        document.getElementById('advantages')?.scrollIntoView({ behavior: 'smooth' });
                        break;
                    case '4':
                        e.preventDefault();
                        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                        break;
                }
            }
        });
    }
    
    // Função para adicionar indicador de carregamento
    function initLoadingIndicator() {
        // Remove indicador de carregamento quando a página estiver pronta
        window.addEventListener('load', function() {
            document.body.classList.add('loaded');
        });
    }
    
    // Função para otimizar performance em dispositivos móveis
    function initMobileOptimizations() {
        if (isMobile()) {
            // Reduz a frequência de eventos de scroll em dispositivos móveis
            let scrollTimeout;
            const originalScrollHandler = handleScroll;
            
            function throttledScrollHandler() {
                if (scrollTimeout) return;
                
                scrollTimeout = setTimeout(() => {
                    originalScrollHandler();
                    scrollTimeout = null;
                }, 16); // ~60fps
            }
            
            window.removeEventListener('scroll', handleScroll);
            window.addEventListener('scroll', throttledScrollHandler, { passive: true });
        }
    }
    
    // Função para adicionar suporte a gestos touch
    function initTouchGestures() {
        let touchStartX = 0;
        let touchStartY = 0;
        
        document.addEventListener('touchstart', function(e) {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }, { passive: true });
        
        document.addEventListener('touchend', function(e) {
            if (!touchStartX || !touchStartY) return;
            
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            
            const diffX = touchStartX - touchEndX;
            const diffY = touchStartY - touchEndY;
            
            // Swipe horizontal para abrir/fechar menu
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0 && isMobileMenuOpen) {
                    // Swipe left - fechar menu
                    closeMobileMenu();
                } else if (diffX < 0 && !isMobileMenuOpen && touchStartX < 50) {
                    // Swipe right da borda esquerda - abrir menu
                    openMobileMenu();
                }
            }
            
            touchStartX = 0;
            touchStartY = 0;
        }, { passive: true });
    }
    
    // Inicializa todas as funcionalidades
    initAnimatedElements();
    initSmoothScroll();
    initCardEffects();
    initRippleEffect();
    initClickOutside();
    initKeyboardShortcuts();
    initLoadingIndicator();
    initMobileOptimizations();
    initTouchGestures();
    
    // Inicializa lazy loading se suportado
    if ('IntersectionObserver' in window) {
        initLazyLoading();
    }
    
    // Chama handleScroll uma vez para configurar estado inicial
    handleScroll();
    
    // Adiciona classe para indicar que o JavaScript foi carregado
    document.body.classList.add('js-loaded');
    
    // Log de inicialização (pode ser removido em produção)
    console.log('TechFix website initialized successfully!');
    
    // Função para detectar se o usuário prefere movimento reduzido
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        // Desabilita animações para usuários que preferem movimento reduzido
        document.documentElement.style.setProperty('--transition-fast', '0.01ms');
        document.documentElement.style.setProperty('--transition-normal', '0.01ms');
        document.documentElement.style.setProperty('--transition-slow', '0.01ms');
    }
});

// Função para detectar se o usuário está em um dispositivo móvel
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Função para detectar se o usuário prefere movimento reduzido
function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Função para otimizar performance
function optimizePerformance() {
    // Preload de recursos críticos
    const criticalResources = [
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Poppins:wght@300;400;500;600;700;800&display=swap',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
    ];
    
    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = resource;
        document.head.appendChild(link);
    });
}

// Executa otimizações quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', optimizePerformance);
} else {
    optimizePerformance();
}

