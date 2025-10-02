/**
 * Script principal - 
 */

document.addEventListener('DOMContentLoaded', function() {
  // Remove loading screen
  setTimeout(() => {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
      loadingOverlay.classList.add('fade-out');
      setTimeout(() => {
        loadingOverlay.style.display = 'none';
      }, 500);
    }
  }, 1500);

  // Inicializa ScrollReveal
  initializeScrollReveal();
  
  // Inicializa interações dos álbuns
  initializeAlbumToggles();
  
  // Inicializa formulário de contato
  initializeContactForm();
  
  // Inicializa navegação suave
  initializeSmoothScrolling();
  
  // Inicializa animações de entrada
  initializePageAnimations();
  
  // Inicializa efeitos especiais
  initializeSpecialEffects();
  
  console.log('Sistema System of a Down inicializado com sucesso!');
});

/**
 * Configura ScrollReveal para animações de scroll
 */
function initializeScrollReveal() {
  if (typeof ScrollReveal !== 'undefined') {
    const sr = ScrollReveal({
      origin: 'bottom',
      distance: '60px',
      duration: 1000,
      delay: 200,
      easing: 'ease-out',
      reset: false
    });

    // Animações para seções
    sr.reveal('#banda .col-lg-6:first-child', { origin: 'left', delay: 300 });
    sr.reveal('#banda .col-lg-6:last-child', { origin: 'right', delay: 500 });
    sr.reveal('.album-card', { interval: 200 });
    sr.reveal('.stat-card', { interval: 150 });
    sr.reveal('.contact-form', { delay: 400 });
    sr.reveal('#canvas-container', { scale: 0.85, delay: 300 });
  }
}

/**
 * Inicializa toggles dos álbuns
 */
function initializeAlbumToggles() {
  const albumToggles = document.querySelectorAll('.album-toggle');
  
  albumToggles.forEach(toggle => {
    toggle.addEventListener('click', function() {
      const targetId = this.getAttribute('data-target');
      const trackList = document.getElementById(targetId);
      
      if (trackList) {
        trackList.classList.toggle('active');
        
        // Atualiza o texto do botão
        const isActive = trackList.classList.contains('active');
        const icon = this.querySelector('i');
        const text = isActive ? 'Ocultar Faixas' : 'Ver Faixas';
        
        if (icon) {
          icon.className = isActive ? 'fas fa-eye-slash' : 'fas fa-list';
        }
        
        this.innerHTML = `${icon ? icon.outerHTML : ''} ${text}`;
        
        // Adiciona animação suave
        if (isActive) {
          trackList.style.maxHeight = trackList.scrollHeight + 'px';
        } else {
          trackList.style.maxHeight = '0';
        }
      }
    });
  });
}

/**
 * Inicializa o formulário de contato
 */
function initializeContactForm() {
  const contactForm = document.querySelector('.contact-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Coleta dados do formulário
      const formData = new FormData(this);
      const data = {
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        assunto: document.getElementById('assunto').value,
        mensagem: document.getElementById('mensagem').value
      };
      
      // Validação básica
      if (!validateContactForm(data)) {
        return;
      }
      
      // Simula envio (substituir por implementação real)
      simulateFormSubmission(data);
    });
  }
}

/**
 * Valida o formulário de contato
 */
function validateContactForm(data) {
  const errors = [];
  
  if (!data.nome.trim()) {
    errors.push('Nome é obrigatório');
  }
  
  if (!data.email.trim()) {
    errors.push('Email é obrigatório');
  } else if (!isValidEmail(data.email)) {
    errors.push('Email inválido');
  }
  
  if (!data.assunto.trim()) {
    errors.push('Assunto é obrigatório');
  }
  
  if (!data.mensagem.trim()) {
    errors.push('Mensagem é obrigatória');
  }
  
  if (errors.length > 0) {
    showFormErrors(errors);
    return false;
  }
  
  return true;
}

/**
 * Verifica se o email é válido
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Mostra erros de validação do formulário
 */
function showFormErrors(errors) {
  const errorMessage = errors.join('\n');
  showNotification(errorMessage, 'error');
}

/**
 * Simula o envio do formulário
 */
function simulateFormSubmission(data) {
  // Mostra indicador de carregamento
  const submitButton = document.querySelector('.contact-form button[type="submit"]');
  const originalText = submitButton.innerHTML;
  
  submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
  submitButton.disabled = true;
  
  // Simula delay de envio
  setTimeout(() => {
    // Restaura botão
    submitButton.innerHTML = originalText;
    submitButton.disabled = false;
    
    // Limpa formulário
    document.querySelector('.contact-form').reset();
    
    // Mostra sucesso
    showNotification('Mensagem enviada com sucesso! Obrigado pelo contato.', 'success');
    
    console.log('Formulário enviado:', data);
  }, 2000);
}

/**
 * Exibe notificações na tela
 */
function showNotification(message, type = 'info') {
  // Remove notificação anterior
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  // Cria nova notificação
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.setAttribute('role', 'alert');
  
  const colors = {
    success: '#28a745',
    error: '#dc3545',
    info: '#17a2b8',
    warning: '#ffc107'
  };
  
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: ${colors[type] || colors.info};
    color: white;
    padding: 15px 25px;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    z-index: 9999;
    max-width: 400px;
    font-weight: 500;
    transform: translateX(100%);
    transition: transform 0.3s ease;
  `;
  
  notification.textContent = message;
  document.body.appendChild(notification);
  
  // Anima entrada
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  // Remove após 5 segundos
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}

/**
 * Inicializa navegação suave
 */
function initializeSmoothScrolling() {
  // Links da navegação
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href && href !== '#') {
        e.preventDefault();
        
        const target = document.querySelector(href);
        if (target) {
          const navbar = document.querySelector('.navbar');
          const navHeight = navbar ? navbar.offsetHeight : 0;
          const targetPosition = target.offsetTop - navHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });
  
  // Atualiza navegação ativa baseado no scroll
  updateActiveNavigation();
}

/**
 * Atualiza item ativo na navegação
 */
function updateActiveNavigation() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  
  function updateNav() {
    let current = '';
    const navHeight = document.querySelector('.navbar').offsetHeight;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - navHeight - 50;
      const sectionHeight = section.offsetHeight;
      
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }
  
  window.addEventListener('scroll', updateNav);
  updateNav(); // Inicializa
}

/**
 * Inicializa animações da página
 */
function initializePageAnimations() {
  // Animação de fade-in para elementos
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observa elementos para animação
  document.querySelectorAll('.album-card, .stat-card, .contact-form').forEach(el => {
    observer.observe(el);
  });
}

/**
 * Inicializa efeitos especiais
 */
function initializeSpecialEffects() {
  // Efeito de paralaxe no hero
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.hero-section');
    if (parallax) {
      const speed = scrolled * 0.5;
      parallax.style.transform = `translateY(${speed}px)`;
    }
  });

  // Adiciona efeito de hover nos cards de estatísticas
  const statCards = document.querySelectorAll('.stat-card');
  statCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-10px) scale(1.05)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });

  // Efeito de digitação no título principal
  typewriterEffect();
}

/**
 * Efeito de digitação no título
 */
function typewriterEffect() {
  const title = document.querySelector('.hero-section h1');
  if (title) {
    const text = title.textContent;
    title.textContent = '';
    title.style.borderRight = '3px solid var(--primary-red)';
    
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        title.textContent += text.charAt(i);
        i++;
      } else {
        clearInterval(timer);
        // Remove cursor after typing
        setTimeout(() => {
          title.style.borderRight = 'none';
        }, 1000);
      }
    }, 100);
  }
}

/**
 * Utilitários gerais
 */
const Utils = {
  // Debounce function
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
  },
  
  // Throttle function
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
  },
  
  // Detecta se é dispositivo móvel
  isMobile() {
    return window.innerWidth <= 768;
  },
  
  // Formata número com separadores
  formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
};

// Exporta utilitários para uso global
window.Utils = Utils;

// Performance monitoring
if ('performance' in window) {
  window.addEventListener('load', () => {
    const perfData = performance.timing;
    const loadTime = perfData.loadEventEnd - perfData.navigationStart;
    console.log(`Página carregada em ${loadTime}ms`);
  });
}