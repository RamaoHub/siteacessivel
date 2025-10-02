/**
 * reprodução de áudio e visualização interativa
 */
const VisualizacaoAudio = {
  isPlaying: false,
  song: null,
  amplitude: null,
  fft: null,
  button: null,
  visualizationStyle: 0,
  maxStyles: 4,
  canvas: null,

  preload() {
    AERIALS.mp3
    
    this.song = null; // Será criado no setup se não houver arquivo
  },

  setup() {
    this.canvas = createCanvas(400, 400);
    this.canvas.parent('canvas-container');
    
    // Configuração de áudio
    this.amplitude = new p5.Amplitude();
    this.fft = new p5.FFT();
    
    // Se não há música carregada, cria um tom para demonstração
    if (!this.song) {
      this.createDemoTone();
    } else {
      this.amplitude.setInput(this.song);
      this.fft.setInput(this.song);
    }

    this.button = select('#play-pause');
    if (this.button) {
      this.button.mousePressed(() => this.toggleAudio());
      this.button.elt.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.toggleAudio();
        }
      });
    }

    // Botão para alternar visualização
    const changeVizButton = select('#change-visualization');
    if (changeVizButton) {
      changeVizButton.mousePressed(() => this.changeVisualization());
    }

    // Botão para tela cheia
    const fullscreenButton = select('#toggle-fullscreen');
    if (fullscreenButton) {
      fullscreenButton.mousePressed(() => this.toggleFullscreen());
    }

    // Inicializa estado do botão
    this.updateButton();
    
    // Configurações de canvas
    colorMode(HSB, 360, 100, 100, 100);
  },

  createDemoTone() {
    // Cria um tom demo usando p5.sound
    this.oscillator = new p5.Oscillator('sine');
    this.oscillator.amp(0);
    this.oscillator.freq(220);
    this.oscillator.start();
    
    this.amplitude.setInput(this.oscillator);
    this.fft.setInput(this.oscillator);
  },

  draw() {
    // Fundo escuro com gradiente
    this.drawBackground();
    
    // Obtém dados de áudio
    const level = this.amplitude ? this.amplitude.getLevel() : 0;
    const spectrum = this.fft ? this.fft.analyze() : [];
    
    // Desenha visualização baseada no estilo atual
    switch (this.visualizationStyle) {
      case 0:
        this.drawCircleVisualization(level, spectrum);
        break;
      case 1:
        this.drawSpectrumVisualization(spectrum);
        break;
      case 2:
        this.drawWaveVisualization(level, spectrum);
        break;
      case 3:
        this.drawMetalVisualization(level, spectrum);
        break;
    }
    
    // Efeitos adicionais
    this.drawParticles(level);
  },

  drawBackground() {
    // Gradiente radial escuro com toques de vermelho
    for (let r = 255; r > 0; r--) {
      fill(0, 0, map(r, 0, 255, 15, 5), 80);
      noStroke();
      ellipse(width / 2, height / 2, r * 2, r * 2);
    }
  },

  drawCircleVisualization(level, spectrum) {
    push();
    translate(width / 2, height / 2);
    
    // Círculo central pulsante
    const size = map(level, 0, 1, 50, 200);
    fill(0, 80, 100, 80);
    noStroke();
    ellipse(0, 0, size, size);
    
    // Anéis espectrais
    for (let i = 0; i < spectrum.length; i += 4) {
      const angle = map(i, 0, spectrum.length, 0, TWO_PI);
      const amp = spectrum[i];
      const radius = map(amp, 0, 255, 80, 150);
      
      const x = cos(angle) * radius;
      const y = sin(angle) * radius;
      
      fill(map(i, 0, spectrum.length, 0, 360), 70, 90, 70);
      noStroke();
      ellipse(x, y, 8, 8);
    }
    
    pop();
  },

  drawSpectrumVisualization(spectrum) {
    const barWidth = width / spectrum.length * 4;
    
    for (let i = 0; i < spectrum.length; i += 4) {
      const amp = spectrum[i];
      const barHeight = map(amp, 0, 255, 0, height - 50);
      
      const x = map(i, 0, spectrum.length, 0, width);
      const hue = map(i, 0, spectrum.length, 0, 360);
      
      fill(hue, 80, 90, 80);
      noStroke();
      rect(x, height - barHeight, barWidth, barHeight);
      
      // Reflexo
      fill(hue, 40, 60, 40);
      rect(x, height - barHeight + barHeight, barWidth, barHeight / 2);
    }
  },

  drawWaveVisualization(level, spectrum) {
    push();
    translate(width / 2, height / 2);
    
    // Ondas concêntricas
    for (let wave = 0; wave < 3; wave++) {
      beginShape();
      noFill();
      
      for (let angle = 0; angle < TWO_PI; angle += 0.1) {
        const index = Math.floor(map(angle, 0, TWO_PI, 0, spectrum.length));
        const amp = spectrum[index] || 0;
        const radius = 60 + wave * 40 + map(amp, 0, 255, 0, 30);
        
        const x = cos(angle) * radius;
        const y = sin(angle) * radius;
        
        stroke(wave * 60, 70, 80, 60);
        strokeWeight(2);
        vertex(x, y);
      }
      endShape(CLOSE);
    }
    
    pop();
  },

  drawMetalVisualization(level, spectrum) {
    push();
    translate(width / 2, height / 2);
    
    // Fundo pulsante vermelho baseado no level
    fill(0, 100, map(level, 0, 1, 20, 100), 30);
    noStroke();
    ellipse(0, 0, 300, 300);
    
    // Raios de energia do centro
    for (let i = 0; i < 12; i++) {
      const angle = (TWO_PI / 12) * i;
      const intensity = spectrum[i * 8] || 0;
      const length = map(intensity, 0, 255, 50, 150);
      
      strokeWeight(map(intensity, 0, 255, 2, 8));
      stroke(0, 80, 100, 80);
      
      line(0, 0, cos(angle) * length, sin(angle) * length);
      
      // Pontos nas extremidades
      fill(0, 100, 100, 90);
      noStroke();
      ellipse(cos(angle) * length, sin(angle) * length, 6, 6);
    }
    
    // Círculo central caótico
    beginShape();
    noFill();
    stroke(0, 100, 100, 100);
    strokeWeight(3);
    
    for (let angle = 0; angle < TWO_PI; angle += 0.2) {
      const index = Math.floor(map(angle, 0, TWO_PI, 0, spectrum.length));
      const noise = map(spectrum[index] || 0, 0, 255, -10, 10);
      const radius = 40 + noise + level * 20;
      
      const x = cos(angle) * radius;
      const y = sin(angle) * radius;
      vertex(x, y);
    }
    endShape(CLOSE);
    
    pop();
    
    // Efeito de distorção nos cantos
    this.drawCornerEffects(level);
  },

  drawCornerEffects(level) {
    const intensity = level * 255;
    
    // Cantos com efeito de raio
    fill(0, 80, 100, 30);
    noStroke();
    
    // Canto superior esquerdo
    triangle(0, 0, intensity, 0, 0, intensity);
    // Canto superior direito  
    triangle(width, 0, width - intensity, 0, width, intensity);
    // Canto inferior esquerdo
    triangle(0, height, intensity, height, 0, height - intensity);
    // Canto inferior direito
    triangle(width, height, width - intensity, height, width, height - intensity);
  },

  drawParticles(level) {
    // Partículas flutuantes baseadas no nível de áudio
    const numParticles = Math.floor(level * 30);
    
    for (let i = 0; i < numParticles; i++) {
      const x = random(width);
      const y = random(height);
      const size = random(2, 8);
      
      // Cores mais vibrantes para partículas
      fill(random(360), random(60, 100), random(80, 100), 60);
      noStroke();
      ellipse(x, y, size, size);
    }
  },

  toggleAudio() {
    if (this.song) {
      if (!this.isPlaying) {
        this.song.play();
        this.isPlaying = true;
      } else {
        this.song.pause();
        this.isPlaying = false;
      }
    } else if (this.oscillator) {
      // Demo com oscillator
      if (!this.isPlaying) {
        this.oscillator.amp(0.3, 0.1);
        this.isPlaying = true;
      } else {
        this.oscillator.amp(0, 0.1);
        this.isPlaying = false;
      }
    }
    
    this.updateButton();
  },

  updateButton() {
    if (this.button) {
      const icon = this.isPlaying ? 'fa-pause' : 'fa-play';
      const text = this.isPlaying ? 'Pausar Música' : 'Tocar Música';
      
      this.button.html(`<i class="fas ${icon}"></i> ${text}`);
      this.button.attribute('aria-label', this.isPlaying ? 'Pausar a música interativa' : 'Tocar a música interativa');
      this.button.attribute('aria-pressed', this.isPlaying);
    }
  },

  changeVisualization() {
    this.visualizationStyle = (this.visualizationStyle + 1) % this.maxStyles;
    
    // Feedback visual
    const styles = ['Circular', 'Espectro', 'Ondas', 'Metal Chaos'];
    this.showVisualizationFeedback(`Estilo: ${styles[this.visualizationStyle]}`);
  },

  toggleFullscreen() {
    const canvas = document.querySelector('#canvas-container canvas');
    if (canvas) {
      if (!document.fullscreenElement) {
        canvas.requestFullscreen().catch(err => {
          console.log('Erro ao entrar em tela cheia:', err);
        });
      } else {
        document.exitFullscreen();
      }
    }
  },

  showVisualizationFeedback(message) {
    // Remove feedback anterior
    const previousFeedback = document.querySelector('.viz-feedback');
    if (previousFeedback) {
      previousFeedback.remove();
    }

    // Cria novo feedback
    const feedback = document.createElement('div');
    feedback.className = 'viz-feedback';
    feedback.style.cssText = `
      position: absolute;
      top: 10px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(220, 38, 38, 0.9);
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 14px;
      z-index: 10;
      transition: opacity 0.3s ease;
    `;
    feedback.textContent = message;

    const container = document.getElementById('canvas-container');
    if (container) {
      container.style.position = 'relative';
      container.appendChild(feedback);

      // Remove após 2 segundos
      setTimeout(() => {
        feedback.style.opacity = '0';
        setTimeout(() => feedback.remove(), 300);
      }, 2000);
    }
  },

  // Cleanup ao sair da página
  cleanup() {
    if (this.song && this.song.isPlaying()) {
      this.song.stop();
    }
    if (this.oscillator) {
      this.oscillator.stop();
    }
  }
};

// Funções globais necessárias para p5.js
function preload() {
  VisualizacaoAudio.preload();
}

function setup() {
  VisualizacaoAudio.setup();
}

function draw() {
  VisualizacaoAudio.draw();
}

// Cleanup ao sair da página
window.addEventListener('beforeunload', () => {
  VisualizacaoAudio.cleanup();
});

// Exporta para uso global
window.VisualizacaoAudio = VisualizacaoAudio;