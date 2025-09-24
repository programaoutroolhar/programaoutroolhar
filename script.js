// ===== JAVASCRIPT PREMIUM GOVERNAMENTAL =====

// Configurações globais
const CONFIG = {
    animationDuration: 1000,
    scrollOffset: 100,
    counterSpeed: 2000,
    loadingDuration: 2000
};

// Classe principal para gerenciar todas as funcionalidades
class PsicologiaMaringaSite {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initLoading();
        this.initScrollAnimations();
        this.initCounterAnimations();
        this.initSmoothScrolling();
        this.initHeaderEffects();
        this.initServiceCardEffects();
        this.initFormValidation();
        this.initAccessibility();
    }

    // ===== LOADING SCREEN =====
    initLoading() {
        const loading = document.getElementById('loading');
        
        // Simula carregamento de recursos
        window.addEventListener('load', () => {
            setTimeout(() => {
                loading.classList.add('hidden');
                document.body.style.overflow = 'visible';
                this.triggerEntranceAnimations();
            }, CONFIG.loadingDuration);
        });
    }

    // ===== ANIMAÇÕES DE ENTRADA =====
    triggerEntranceAnimations() {
        const elements = document.querySelectorAll('.hero-content, .hero-image, .section-header, .stat-card, .service-card, .cert-card');
        
        elements.forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    // ===== SCROLL ANIMATIONS =====
    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Trigger counter animation for stats
                    if (entry.target.classList.contains('stat-card')) {
                        this.animateCounter(entry.target);
                    }
                }
            });
        }, observerOptions);

        // Observar elementos para animação
        const animatedElements = document.querySelectorAll('.stat-card, .service-card, .cert-card, .section-header');
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            observer.observe(el);
        });
    }

    // ===== ANIMAÇÃO DE CONTADORES =====
    initCounterAnimations() {
        this.countersAnimated = new Set();
    }

    animateCounter(statCard) {
        const numberElement = statCard.querySelector('.stat-number');
        const target = parseInt(numberElement.getAttribute('data-target'));
        
        if (this.countersAnimated.has(numberElement)) return;
        this.countersAnimated.add(numberElement);

        let current = 0;
        const increment = target / (CONFIG.counterSpeed / 16);
        
        const updateCounter = () => {
            current += increment;
            
            if (current < target) {
                numberElement.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                numberElement.textContent = target;
            }
        };

        updateCounter();
    }

    // ===== NAVEGAÇÃO SUAVE =====
    initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                
                if (target) {
                    const offsetTop = target.offsetTop - CONFIG.scrollOffset;
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ===== EFEITOS DO HEADER =====
    initHeaderEffects() {
        const header = document.querySelector('.header');
        let lastScrollY = window.scrollY;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            // Header background opacity
            if (currentScrollY > 100) {
                header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                header.style.backdropFilter = 'blur(20px)';
            } else {
                header.style.backgroundColor = 'rgba(255, 255, 255, 1)';
                header.style.backdropFilter = 'blur(10px)';
            }

            // Header hide/show on scroll
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }

            lastScrollY = currentScrollY;
        });
    }

    // ===== EFEITOS DOS CARDS DE SERVIÇO =====
    initServiceCardEffects() {
        const serviceCards = document.querySelectorAll('.service-card');
        
        serviceCards.forEach(card => {
            // Efeito de mouse tracking
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                
                card.style.setProperty('--x', `${x}%`);
                card.style.setProperty('--y', `${y}%`);
            });

            // Efeito de tilt 3D
            card.addEventListener('mouseenter', (e) => {
                card.style.transition = 'transform 0.3s ease';
            });

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                const rotateX = (e.clientY - centerY) / 10;
                const rotateY = (centerX - e.clientX) / 10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            });
        });
    }

    // ===== VALIDAÇÃO DE FORMULÁRIOS =====
    initFormValidation() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.validateForm(form);
            });
        });
    }

    validateForm(form) {
        const inputs = form.querySelectorAll('input, textarea, select');
        let isValid = true;

        inputs.forEach(input => {
            if (input.hasAttribute('required') && !input.value.trim()) {
                this.showFieldError(input, 'Este campo é obrigatório');
                isValid = false;
            } else if (input.type === 'email' && !this.isValidEmail(input.value)) {
                this.showFieldError(input, 'Email inválido');
                isValid = false;
            } else {
                this.clearFieldError(input);
            }
        });

        if (isValid) {
            this.submitForm(form);
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showFieldError(input, message) {
        input.classList.add('error');
        
        let errorElement = input.parentNode.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('span');
            errorElement.className = 'error-message';
            input.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
    }

    clearFieldError(input) {
        input.classList.remove('error');
        const errorElement = input.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }

    submitForm(form) {
        // Simula envio do formulário
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        submitButton.textContent = 'Enviando...';
        submitButton.disabled = true;
        
        setTimeout(() => {
            submitButton.textContent = 'Enviado com sucesso!';
            submitButton.style.backgroundColor = '#059669';
            
            setTimeout(() => {
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                submitButton.style.backgroundColor = '';
                form.reset();
            }, 2000);
        }, 1500);
    }

    // ===== ACESSIBILIDADE =====
    initAccessibility() {
        // Navegação por teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });

        // Skip to content link
        this.createSkipLink();
        
        // ARIA labels dinâmicos
        this.updateAriaLabels();
    }

    createSkipLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Pular para o conteúdo principal';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--azul-institucional);
            color: white;
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 10000;
            transition: top 0.3s;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    updateAriaLabels() {
        // Atualizar contadores com aria-live
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach(stat => {
            stat.setAttribute('aria-live', 'polite');
        });

        // Adicionar labels descritivos
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach((card, index) => {
            card.setAttribute('aria-label', `Serviço ${index + 1}: ${card.querySelector('h3').textContent}`);
        });
    }

    // ===== CONFIGURAÇÃO DE EVENTOS =====
    setupEventListeners() {
        // Redimensionamento da janela
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));

        // Scroll otimizado
        window.addEventListener('scroll', this.throttle(() => {
            this.handleScroll();
        }, 16));
    }

    handleResize() {
        // Recalcular animações se necessário
        console.log('Window resized');
    }

    handleScroll() {
        // Otimizações de scroll
        const scrollY = window.scrollY;
        
        // Parallax effect para hero background
        const heroBackground = document.querySelector('.hero-background');
        if (heroBackground) {
            heroBackground.style.transform = `translateY(${scrollY * 0.5}px)`;
        }
    }

    // ===== UTILITÁRIOS =====
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// ===== FUNCIONALIDADES ADICIONAIS =====

// Sistema de notificações
class NotificationSystem {
    constructor() {
        this.container = this.createContainer();
    }

    createContainer() {
        const container = document.createElement('div');
        container.className = 'notification-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            pointer-events: none;
        `;
        document.body.appendChild(container);
        return container;
    }

    show(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            background: var(--azul-institucional);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            margin-bottom: 10px;
            box-shadow: var(--sombra-media);
            transform: translateX(100%);
            transition: transform 0.3s ease;
            pointer-events: auto;
            cursor: pointer;
        `;

        if (type === 'success') {
            notification.style.background = 'var(--verde-institucional)';
        } else if (type === 'error') {
            notification.style.background = '#dc3545';
        }

        this.container.appendChild(notification);

        // Animar entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Auto remover
        setTimeout(() => {
            this.remove(notification);
        }, duration);

        // Remover ao clicar
        notification.addEventListener('click', () => {
            this.remove(notification);
        });
    }

    remove(notification) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
}

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar site principal
    window.psicologiaMaringa = new PsicologiaMaringaSite();
    
    // Inicializar sistema de notificações
    window.notifications = new NotificationSystem();
    
    // Adicionar estilos CSS dinâmicos
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
            transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .keyboard-navigation *:focus {
            outline: 3px solid var(--dourado-institucional) !important;
            outline-offset: 2px !important;
        }
        
        .error {
            border-color: #dc3545 !important;
            box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25) !important;
        }
        
        .error-message {
            color: #dc3545;
            font-size: 0.875rem;
            margin-top: 0.25rem;
            display: block;
        }
        
        @media (prefers-reduced-motion: reduce) {
            * {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        }
    `;
    document.head.appendChild(style);
    
    console.log('🧠 Psicologia Maringá - Site carregado com sucesso!');
});