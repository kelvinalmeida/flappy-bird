// Feito com JavaScript, HTML e CSS

// Aluno: Antonio Eduardo Souza De Oliveira
// Aluno: Kelvin Santos de Almeida Lima
// Aluno: Tércio Calazans


console.log('[Antônio Eduardo, Kelvin Almeida, Tércio Calazans], Apresenta: Flappy Bird');

let jogador1 = 0;
let frames = 0;

// SOM
const som_Pulo = new Audio();
som_Pulo.src = './efeitos/efeitos_pulo.wav';

const som_Score = new Audio();
som_Score.src = './efeitos/uepa-mp3cut.wav';

const som_Hit = new Audio();
som_Hit.src = './efeitos/vinheta-xaropinho-rapaz-cut-mp3.wav';

// IMAGENS
const sprite_Sol = new Image();
sprite_Sol.src = './vaporwave.png';

const spritezinho = new Image();
spritezinho.src = './solvaporwave.png';

const sprites = new Image();
sprites.src = './sprites.png';

//*

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

// Sol

function criaSol () {
    const sol = {

        aux: 0,
    
        // Propoções: 
      
        spriteX: 0, spriteY: 0, // Onde eu irei pegar o sprite na imagem Sprites.png
        largura: 226, altura: 200, // Tamanho do Sprite
        x: canvas.width, y: 90,  // Localização de onde eu irei colocar esse sprite
        //*
    

        desenha() {
          contexto.drawImage(
            sprite_Sol,
            sol.spriteX, sol.spriteY,
            sol.largura, sol.altura,
            sol.x, sol.y,
            sol.largura, sol.altura,
          )
      
        },
    
        atualiza() {
            this.aux++;
            this.frame = 0.5;

            if(sol.x + sol.largura <= 0){
                this.aux = 0;
                this.x = canvas.width;
            }

            console.log(this.aux);

            if(this.aux >= 1){
                this.x -= this.frame;
                this.aux = 0;
            }
        },
    
      }

    return sol;
}

// Game over!

const mensagemGameOver = {

    // Propoções: 
  
    spriteX: 134, spriteY: 153, // Onde eu irei pegar o sprite na imagem Sprites.png
    largura: 226, altura: 200, // Tamanho do Sprite
    x: (canvas.width / 2) - 226/2 , y: 50,  // Localização de onde eu irei colocar esse sprite
    //*
  
    desenha() {
      contexto.drawImage(
        sprites,
        mensagemGameOver.spriteX, mensagemGameOver.spriteY,
        mensagemGameOver.largura, mensagemGameOver.altura,
        mensagemGameOver.x, mensagemGameOver.y,
        mensagemGameOver.largura, mensagemGameOver.altura,
      );
  
    },
  };

function criaPlacar() {

    const placar = {
        pontuacao: 0, 
        desenha() {
            contexto.font = '27px "Didact Gothic"';
            contexto.textAlign = 'right';
            contexto.fillStyle = '#FFFB96';
            contexto.fillText (`${placar.pontuacao} パ萎央`, canvas.width - 10, 40);
            placar.pontuacao

        },

        atualiza() {
            const intervaloDeFrames = 50;
            const passouOIntervalo = frames % intervaloDeFrames === 0;
            if(passouOIntervalo){
                if(placar.pontuacao % 10 === 0) {
                    som_Score.play();

                }
                placar.pontuacao = placar.pontuacao + 1;
            }
            
        }

    }
    return placar;

}

// [Canos]

function criaCanos() {
    const canos = {
      largura: 52, altura: 400, // tamanho dos canos


      chao: {
        spriteX: 0,
        spriteY: 169,
      },


      ceu: {
        spriteX: 52,
        spriteY: 169,
      },


      espaco: 80,

      // randomizando cada cano e desenhando

      desenha() {
        canos.pares.forEach(function(par) {

          // Espaço entre cada cano, e o ponto y do cano para saber onder ele vai começar  
          const yRandom = par.y;
          const espacamentoEntreCanos = 90; 
          
          const canoCeuX = par.x;
          const canoCeuY = yRandom; 

          //*
  
          // [Cano do Céu]
          contexto.drawImage(
            sprites, 
            canos.ceu.spriteX, canos.ceu.spriteY,
            canos.largura, canos.altura,
            canoCeuX, canoCeuY,
            canos.largura, canos.altura,
          )
  
          // [Cano do Chão]
          const canoChaoX = par.x;
          const canoChaoY = canos.altura + espacamentoEntreCanos + yRandom; 
          contexto.drawImage(
            sprites, 
            canos.chao.spriteX, canos.chao.spriteY,
            canos.largura, canos.altura,
            canoChaoX, canoChaoY,
            canos.largura, canos.altura,
          )
        
          par.canoCeu = {
            x: canoCeuX,
            y: canos.altura + canoCeuY
          }
          par.canoChao = {
            x: canoChaoX,
            y: canoChaoY
          }
        })
      },

      // Colisão com o FlappyBird

      temColisaoComOFlappyBird(par) {
        const cabecaDoFlappy = globais.flappyBird.y;
        const peDoFlappy = globais.flappyBird.y + globais.flappyBird.altura;
  
        if(globais.flappyBird.x + globais.flappyBird.largura >= par.x) {
          if(cabecaDoFlappy <= par.canoCeu.y) {
            return true;
          }
  
          if(peDoFlappy >= par.canoChao.y) {
            return true;
          }
        }
        return false;
      },

      //*

      // A cada 100 frames, vamos criar outro cano com o escopo max sendo 2, e o minimo 1, para que não tenha grandes variações para fugir do tamanho da tela.
      pares: [],
      atualiza() {
        const passou100Frames = frames % 100 === 0;
        if(passou100Frames) {
          canos.pares.push({
            x: canvas.width,
            y: -150 * (Math.random() + 1), // Pontos Y onde o cano irá vem.
          });
        }

        //*
  
  
        // Movimentação dos canos
        canos.pares.forEach(function(par) {
          par.x = par.x - 2; // os canos andaram dois pixeis para frente
  
          if(canos.temColisaoComOFlappyBird(par)) { // Se tiver colisão vai voltar para tela inicial.
            som_Hit.play();
            console.log(jogador1)
            mudaParaTela(Telas.GAME_OVER);
          }
          
          // Retirar pares de canos, e colocando outros, para não sobrecarregar a memória
          if(par.x + canos.largura <= 0) { // Irá sumir com os canos mais bonitamente
            canos.pares.shift(); // Irá retirar o primeiro item do vetor
          }
        });
  
      }
    }
  
    return canos;
  }
  


function fazColisao(flappyBird,chao) {
    const flappyBirdY = flappyBird.y  + flappyBird.altura;
    const chaoY = chao.y;

    if(flappyBirdY >= chaoY) {
        return true;
    }

    return false;
}


// [Tela de inicio]
const mensagemGetReady = {

    // Propoções: 
  
    spriteX: 134, spriteY: 0, // Onde eu irei pegar o sprite na imagem Sprites.png
    largura: 174, altura: 152, // Tamanho do Sprite
    x: (canvas.width / 2) - 174/2 , y: 160,  // Localização de onde eu irei colocar esse sprite
    //*
  
    desenha() {
      contexto.drawImage(
        sprites,
        mensagemGetReady.spriteX, mensagemGetReady.spriteY,
        mensagemGetReady.largura, mensagemGetReady.altura,
        mensagemGetReady.x, mensagemGetReady.y,
        mensagemGetReady.largura, mensagemGetReady.altura,
      );
  
    },
  };

// [Plano de Fundo]
const planoDeFundo = {
  // Proporções: 
  spriteX: 0, spriteY: 0, // Onde eu irei pegar o sprite na imagem Sprites.png
  largura: 350, altura: 204,  // Tamanho do Sprite
  x: 0, y: 290, // Localização de onde eu irei colocar esse sprite
  //*


  desenha() {
      contexto.clearRect(0,0,canvas.width, canvas.height);
    // contexto.fillStyle = '#FF71CE';
    // contexto.fillRect(0,0, canvas.width, canvas.height);

    contexto.drawImage(
      spritezinho,
      planoDeFundo.spriteX, planoDeFundo.spriteY,
      planoDeFundo.largura, planoDeFundo.altura,
      planoDeFundo.x, planoDeFundo.y,
      planoDeFundo.largura, planoDeFundo.altura,
    );

    contexto.drawImage(
      spritezinho,
      planoDeFundo.spriteX, planoDeFundo.spriteY,
      planoDeFundo.largura, planoDeFundo.altura,
      (planoDeFundo.x + planoDeFundo.largura), planoDeFundo.y,
      planoDeFundo.largura, planoDeFundo.altura,
    );
  },
};

// [Chao]
function criaChao () {
    const chao = {

        // Propoções: 
      
        spriteX: 0, spriteY: 610, // Onde eu irei pegar o sprite na imagem Sprites.png
        largura: 224, altura: 112, // Tamanho do Sprite
        x: 0, y: canvas.height - 112, // Localização de onde eu irei colocar esse sprite
        //*
        
        atualiza() {

            // Basicamente a movimentação do chão em conjunto de quando repeti-lo, basicamente vamos pegar o resto da divisão do movimento para saber em que ponto X ele parou e resetar ele(se tiver duvidas veja o video 4 6:00)
            const movimentoDoChao = 1;
            const repeteEm = chao.largura /  2;
            const movimentação = chao.x - movimentoDoChao;

            chao.x = movimentação % repeteEm;
        },
      
      
        desenha() {
          contexto.drawImage(
            sprites,
            chao.spriteX, chao.spriteY,
            chao.largura, chao.altura,
            chao.x, chao.y,
            chao.largura, chao.altura,
          );
      
          contexto.drawImage(
            sprites,
            chao.spriteX, chao.spriteY,
            chao.largura, chao.altura,
            (chao.x + chao.largura), chao.y,
            chao.largura, chao.altura,
          );
        },
      };

    return chao;
}


function fazColisao(flappyBird,chao) {
    const flappyBirdY = flappyBird.y  + flappyBird.altura;
    const chaoY = chao.y;

    if(flappyBirdY >= chaoY) {
        return true;
    }

    return false;
}


function criaFlappyBird () {
    const flappyBird = {

        // Propoções: 
      
        spriteX: 0, spriteY: 0, // Onde eu irei pegar o sprite na imagem Sprites.png
        largura: 33, altura: 24, // Tamanho do Sprite
        x: 10, y: 50, // Localização de onde eu irei colocar esse sprite
        //*
      
        // Movimentação: 
      
        gravidade : 0.25,
        velocidade : 0,
        pulo : 4.6,
        //*
      
        // Pulinhos o que acontece!
      
        pula() {
          flappyBird.velocidade = - flappyBird.pulo;
        },
        //*
      
      
        // Loops do flappy 
        atualiza() {
      
          if(fazColisao(flappyBird, globais.chao) ) {
            
            som_Hit.play();

            intervalo = 50;
            mudanca = (frames % 50) === 0;
            // if(mudanca) {
            mudaParaTela(Telas.GAME_OVER);
              // mudaParaTela(Telas.GAME_OVER);
            // }

            return;
      
          }
          flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
          flappyBird.y = flappyBird.y  + flappyBird.velocidade;
      
        },
        //*
      
        // Animação do flappy bird
        movimentos: [
           { spriteX: 0, spriteY: 0, }, // Asa para cima
           { spriteX: 0, spriteY: 26, }, // Asa no meio
           { spriteX: 0, spriteY: 52, }, // Asa para baixo
           { spriteX: 0, spriteY: 26, }, // Asa no meio
        ],

        frameAtual : 0,
        atualizaOFrameAtual() {
            // Basicamente limitando os numeros de frames, e colocando em booleano, para que ele tenha fluidez na troca dos frames

            const intervaloDeFrames = 10;
            const passouOIntervalo = frames % intervaloDeFrames === 0;

            if(passouOIntervalo) {
            const baseDoIncremento = 1; // Vamos pegar como base 1 para sabermos o limite do vetor de movimentos do flappy bird
            const incremento = baseDoIncremento + flappyBird.frameAtual; // Aqui saberemos o proximo movimento do flappy e saber se ele ja passou do limite ou não baseado nessa constante
            const baseRepeticao = flappyBird.movimentos.length; // Estabelecer que a const baseRepeticao é o tamanho do vetor
            flappyBird.frameAtual = incremento % baseRepeticao // Saber quando resetar esse frame sem esta desgovernado, numero (4)

            // Se tiver em dúvida de como funciona, coloca uns logs no incremento, frame, e baserepeticao, vao dar um help nisso.
            }
        },
      
        desenha() {
          flappyBird.atualizaOFrameAtual();
          const {spriteX, spriteY } = flappyBird.movimentos[flappyBird.frameAtual];
          contexto.drawImage(
            sprites,
            spriteX, spriteY, // Sprite X, Sprite Y
            flappyBird.largura, flappyBird.altura, // Tamanho do recorte na sprite
            flappyBird.x, flappyBird.y,
            flappyBird.largura, flappyBird.altura,
          );
        }

      }

    return  flappyBird;
}

const globais = {};
let telaAtiva = {};
function mudaParaTela(novaTela) {
    telaAtiva = novaTela;

    if(telaAtiva.inicializa) {
        telaAtiva.inicializa();
    }
}

const Telas = {
    INICIO: {


        inicializa() {
            globais.flappyBird = criaFlappyBird();
            globais.chao = criaChao();
            globais.canos = criaCanos();
            globais.sol = criaSol();
        },


        desenha() {
            planoDeFundo.desenha(); // Função que colocara as proporções certas no canvas (Background).
            globais.sol.desenha();
            globais.chao.desenha(); // Função que colocara as proporções certas no canvas (Chao).
            globais.flappyBird.desenha(); // Função que colocara as proporções certas no canvas (FlappyBird).
            mensagemGetReady.desenha(); // Função que colocara as proporções certas no canvas (Tela de Inicio).
            
        },

        click() {
            mudaParaTela(Telas.JOGO);
        },

        atualiza() {
            globais.chao.atualiza();
            globais.sol.atualiza();
        }
    }

};

Telas.JOGO = {

    inicializa() {
        globais.placar = criaPlacar();
        globais.sol = criaSol();
    },

    desenha() {
        planoDeFundo.desenha(); // Função que colocara as proporções certas no canvas (Background).
        globais.sol.desenha();
        globais.canos.desenha();
        globais.chao.desenha(); // Função que colocara as proporções certas no canvas (Chao).
        globais.flappyBird.desenha(); // Função que colocara as proporções certas no canvas (FlappyBird).
        globais.placar.desenha();
    },

    click() {
        som_Pulo.play();
        globais.flappyBird.pula();
    },

    atualiza() {
        globais.canos.atualiza(); 
        globais.sol.atualiza();
        globais.chao.atualiza();
        globais.flappyBird.atualiza(); // Loops do Flappybird
        globais.placar.atualiza();
    }

};

Telas.JOGO2 = {

  inicializa() {
      globais.placar = criaPlacar();
      globais.sol = criaSol();
  },

  desenha() {
      planoDeFundo.desenha(); // Função que colocara as proporções certas no canvas (Background).
      globais.sol.desenha();
      globais.canos.desenha();
      globais.chao.desenha(); // Função que colocara as proporções certas no canvas (Chao).
      globais.flappyBird.desenha(); // Função que colocara as proporções certas no canvas (FlappyBird).
      globais.placar.desenha();
  },

  click() {
      som_Pulo.play();
      globais.flappyBird.pula();
  },

  atualiza() {
      console.log("Jogador2")
      globais.canos.atualiza(); 
      globais.sol.atualiza();
      globais.chao.atualiza();
      globais.flappyBird.atualiza(); // Loops do Flappybird
      globais.placar.atualiza();
  }

};

Telas.GAME_OVER = {
    desenha () {
        mensagemGameOver.desenha();

    },

    atualiza () {

    },

    click () {
        mudaParaTela(Telas.INICIO);
    }
}

function loop() {
  
  telaAtiva.desenha();
  telaAtiva.atualiza();

  // Função para agir em Frames Per Second:
 

  frames = frames + 1;
  requestAnimationFrame(loop);
}

window.addEventListener('click', function () {
    if(telaAtiva.click) {
        telaAtiva.click();
    }
});

mudaParaTela(Telas.INICIO);

loop();