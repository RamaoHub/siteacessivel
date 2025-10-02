/**
 * Módulo de Acessibilidade
 * tamanho da fonte e alto contraste
 */
const Acessibilidade = {
  tamanhoFonte: 1, // em rem
  MIN_FONTE: 0.8, // Limite mínimo
  MAX_FONTE: 2, // Limite máximo

  init() {
    // Aguarda o DOM estar carregado
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupElements());
    } else {
      this.setupElements();
    }
  },

  setupElements() {
    this.botaoAcessibilidade = document.getElementById('botao-acessibilidade');
    this.opcoesAcessibilidade = document.getElementById('opcoes-acessibilidade');
    this.aumentaFonteBotao = document.getElementById('aumentar-fonte');
    this.diminuiFonteBotao = document.getElementById('diminuir-fonte');
    this.alternaContraste = document.getElementById('alterna-contraste');

    if (!this.botaoAcessibilidade) {
      console.error('Elementos de acessibilidade não encontrados');
      return;
    }

    // Carrega configurações salvas
    this.carregarConfiguracoes();
    this.adicionarEventos();
  },

  adicionarEventos() {
    // Evento de clique e teclado para o botão de acessibilidade
    this.botaoAcessibilidade.addEventListener('click', () => this.toggleMenu());
    this.botaoAcessibilidade.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.toggleMenu();
      }
    });

    // Eventos para botões de fonte
    if (this.aumentaFonteBotao) {
      this.aumentaFonteBotao.addEventListener('click', () => this.ajustarFonte(0.1));
    }
    if (this.diminuiFonteBotao) {
      this.diminuiFonteBotao.addEventListener('click', () => this.ajustarFonte(-0.1));
    }
    if (this.alternaContraste) {
      this.alternaContraste.addEventListener('click', () => this.toggleContraste());
    }

    // Fechar menu ao clicar fora
    document.addEventListener('click', (e) => {
      if (!this.botaoAcessibilidade.contains(e.target) && 
          !this.opcoesAcessibilidade.contains(e.target)) {
        this.fecharMenu();
      }
    });

    // Tecla Escape para fechar menu
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.fecharMenu();
      }
    });
  },

  toggleMenu() {
    this.botaoAcessibilidade.classList.toggle('rotacao-botao');
    this.opcoesAcessibilidade.classList.toggle('apresenta-lista');
    const isExpanded = this.botaoAcessibilidade.getAttribute('aria-expanded') === 'true';
    this.botaoAcessibilidade.setAttribute('aria-expanded', !isExpanded);
    
    // Foco no primeiro item quando abre
    if (!isExpanded && this.aumentaFonteBotao) {
      setTimeout(() => this.aumentaFonteBotao.focus(), 100);
    }
  },

  fecharMenu() {
    if (this.opcoesAcessibilidade.classList.contains('apresenta-lista')) {
      this.botaoAcessibilidade.classList.remove('rotacao-botao');
      this.opcoesAcessibilidade.classList.remove('apresenta-lista');
      this.botaoAcessibilidade.setAttribute('aria-expanded', 'false');
    }
  },

  ajustarFonte(delta) {
    this.tamanhoFonte = Math.max(this.MIN_FONTE, Math.min(this.MAX_FONTE, this.tamanhoFonte + delta));
    document.body.style.fontSize = `${this.tamanhoFonte}rem`;
    localStorage.setItem('tamanhoFonte', this.tamanhoFonte);
    
    // Feedback visual
    this.mostrarFeedback(`Fonte ajustada para ${(this.tamanhoFonte * 100).toFixed(0)}%`);
  },

  toggleContraste() {
    document.body.classList.toggle('alto-contraste');
    const isHighContrast = document.body.classList.contains('alto-contraste');
    localStorage.setItem('altoContraste', isHighContrast);
    
    // Feedback visual
    this.mostrarFeedback(isHighContrast ? 'Alto contraste ativado' : 'Alto contraste desativado');
  },

  carregarConfiguracoes() {
    // Carrega tamanho da fonte salvo
    const tamanhoSalvo = localStorage.getItem('tamanhoFonte');
    if (tamanhoSalvo) {
      this.tamanhoFonte = parseFloat(tamanhoSalvo);
      document.body.style.fontSize = `${this.tamanhoFonte}rem`;
    }

    // Carrega configuração de alto contraste
    if (localStorage.getItem('altoContraste') === 'true') {
      document.body.classList.add('alto-contraste');
    }
  },

  mostrarFeedback(mensagem) {
    // Remove feedback anterior
    const feedbackAnterior = document.querySelector('.accessibility-feedback');
    if (feedbackAnterior) {
      feedbackAnterior.remove();
    }

    // Cria novo feedback
    const feedback = document.createElement('div');
    feedback.className = 'accessibility-feedback';
    feedback.setAttribute('role', 'status');
    feedback.setAttribute('aria-live', 'polite');
    feedback.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: #333;
      color: white;
      padding: 10px 20px;
      border-radius: 5px;
      z-index: 9999;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      transition: opacity 0.3s ease;
    `;
    feedback.textContent = mensagem;

    document.body.appendChild(feedback);

    // Remove após 3 segundos
    setTimeout(() => {
      feedback.style.opacity = '0';
      setTimeout(() => feedback.remove(), 300);
    }, 3000);
  }
};

// Inicializa o módulo
Acessibilidade.init();

// Exporta para uso global
window.Acessibilidade = Acessibilidade;