const botoes = document.querySelectorAll(".choices button");

const botoesAtaqueJ1 = document.querySelectorAll("#attack-buttons-j1 button");
const botoesAtaqueJ2 = document.querySelectorAll("#attack-buttons-j2 button");

const textoJ1 = document.getElementById("player1-choice");
const textoJ2 = document.getElementById("player2-choice");
const textoResultado = document.getElementById("winner");

const healthJ1 = document.getElementById("health-j1");
const healthJ2 = document.getElementById("health-j2");

const barraEnergiaJ1 = document.getElementById("energy-j1");
const barraEnergiaJ2 = document.getElementById("energy-j2");

let jogada1 = null;
let jogada2 = null;

let vidaJ1 = 100;
let vidaJ2 = 100;

let energiaJ1 = 0;
let energiaJ2 = 0;

let atacante = null;

function verificarVencedor(j1, j2) {
  if (j1 === j2) {
    return "Empate!";
  }
  if (
    (j1 === "pedra" && j2 === "tesoura") ||
    (j1 === "papel" && j2 === "pedra") ||
    (j1 === "tesoura" && j2 === "papel")
  ) {
    return "Jogador 1 venceu ! 🐈";
  } else {
    return "Jogador 2 venceu ! 🐕";
  }
}

function atualizarBarraDeVida() {
  healthJ1.style.width = vidaJ1 + "%";
  healthJ2.style.width = vidaJ2 + "%";

  healthJ1.style.backgroundColor = vidaJ1 > 50 ? "#0f0" : vidaJ1 > 20 ? "#ff0" : "#f00";
  healthJ2.style.backgroundColor = vidaJ2 > 50 ? "#0f0" : vidaJ2 > 20 ? "#ff0" : "#f00";
}

function atualizarBarraEnergia() {
  barraEnergiaJ1.style.width = energiaJ1 + "%";
  barraEnergiaJ2.style.width = energiaJ2 + "%";
}

function verificarEspecial(jogador) {
  if (jogador === 1 && energiaJ1 >= 100) {
    document.querySelector('#attack-buttons-j1 .special-attack').disabled = false;
  } else if (jogador === 2 && energiaJ2 >= 100) {
    document.querySelector('#attack-buttons-j2 .special-attack').disabled = false;
  }
}

function setBotoesAtivos(ativo) {
  botoes.forEach(botao => {
    botao.disabled = !ativo;
    botao.style.cursor = ativo ? "pointer" : "not-allowed";
    botao.style.opacity = ativo ? "1" : "0.5";
  });
}

function esconderBotoesAtaque() {
  document.getElementById("attack-buttons-j1").style.display = "none";
  document.getElementById("attack-buttons-j2").style.display = "none";
}

function novoJogo() {
  jogada1 = null;
  jogada2 = null;
  textoJ1.textContent = "Jogador 1: escolha";
  textoJ2.textContent = "Jogador 2: escolha";
  textoResultado.textContent = "";

  vidaJ1 = 100;
  vidaJ2 = 100;
  energiaJ1 = 0;
  energiaJ2 = 0;

  atualizarBarraDeVida();
  atualizarBarraEnergia();

  document.querySelector('#attack-buttons-j1 .special-attack').disabled = true;
  document.querySelector('#attack-buttons-j2 .special-attack').disabled = true;

  setBotoesAtivos(true);
  esconderBotoesAtaque();
}

botoes.forEach(botao => {
  botao.addEventListener("click", () => {
    const escolha = botao.getAttribute("data-choice");

    if (jogada1 === null) {
      jogada1 = escolha;
      textoJ1.textContent = "Jogador 1 já escolheu";
      textoResultado.textContent = "Vez do Jogador 2!";
    } else if (jogada2 === null) {
      jogada2 = escolha;
      textoJ2.textContent = "Jogador 2 já escolheu";

      const resultado = verificarVencedor(jogada1, jogada2);
      textoResultado.textContent = `${resultado} (J1: ${jogada1} | J2: ${jogada2})`;

      if (resultado.includes("Jogador 1 venceu")) {
        atacante = 1;
        document.getElementById("attack-buttons-j1").style.display = "flex";
      } else if (resultado.includes("Jogador 2 venceu")) {
        atacante = 2;
        document.getElementById("attack-buttons-j2").style.display = "flex";
      } else {
        atacante = null;
        jogada1 = null;
        jogada2 = null;
        textoJ1.textContent = "Jogador 1: escolha";
        textoJ2.textContent = "Jogador 2: escolha";
        textoResultado.textContent += " - Próxima rodada!";
      }

      if (atacante !== null) {
        textoResultado.textContent += " - Escolha seu ataque!";
        setBotoesAtivos(false);
      }
    }
  });
});

// Ataques do Jogador 1
botoesAtaqueJ1.forEach(botao => {
  botao.addEventListener("click", () => {
    if (atacante !== 1) return;  // Garante que só o jogador certo ataque

    const dano = parseInt(botao.getAttribute("data-attack"));
    const energiaGanha = parseInt(botao.getAttribute("data-energy")) || 0;

    vidaJ2 -= dano;
    if (vidaJ2 < 0) vidaJ2 = 0;

    if (botao.classList.contains('special-attack')) {
      energiaJ1 = 0;  // Zera ao usar especial
    } else {
      energiaJ1 = Math.min(energiaJ1 + energiaGanha, 100);  // Ganha energia
    }

    atualizarBarraDeVida();
    atualizarBarraEnergia();
    verificarEspecial(1);
    finalizarAtaque();
  });
});

// Ataques do Jogador 2
botoesAtaqueJ2.forEach(botao => {
  botao.addEventListener("click", () => {
    if (atacante !== 2) return;  // Garante que só o jogador certo ataque

    const dano = parseInt(botao.getAttribute("data-attack"));
    const energiaGanha = parseInt(botao.getAttribute("data-energy")) || 0;

    vidaJ1 -= dano;
    if (vidaJ1 < 0) vidaJ1 = 0;

    if (botao.classList.contains('special-attack')) {
      energiaJ2 = 0;
    } else {
      energiaJ2 = Math.min(energiaJ2 + energiaGanha, 100);
    }

    atualizarBarraDeVida();
    atualizarBarraEnergia();
    verificarEspecial(2);
    finalizarAtaque();
  });
});

function finalizarAtaque() {
  esconderBotoesAtaque();
  setBotoesAtivos(true);

  if (vidaJ1 === 0 || vidaJ2 === 0) {
    textoResultado.textContent = vidaJ1 === 0 ? "Jogador 2 venceu o jogo! 🎉" : "Jogador 1 venceu o jogo! 🎉";
    setBotoesAtivos(false);
    setTimeout(() => {
      novoJogo();
    }, 3000);
  } else {
    textoResultado.textContent = "Ataque aplicado! Próxima rodada.";
    jogada1 = null;
    jogada2 = null;
    textoJ1.textContent = "Jogador 1: escolha";
    textoJ2.textContent = "Jogador 2: escolha";
  }
}

novoJogo();
