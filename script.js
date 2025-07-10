const botoes = document.querySelectorAll(".choices button");

const botoesAtaqueJ1 = document.querySelectorAll("#attack-buttons-j1 button");
const botoesAtaqueJ2 = document.querySelectorAll("#attack-buttons-j2 button");

const botaoDefesaJ1 = document.getElementById("defend-button-j1");
const botaoNaoDefenderJ1 = document.getElementById("no-defend-button-j1");

const botaoDefesaJ2 = document.getElementById("defend-button-j2");
const botaoNaoDefenderJ2 = document.getElementById("no-defend-button-j2");

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
let defensor = null;
let tipoDefesa = null;  // "total", "parcial" ou "nenhuma"

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

const vidaMaxJ1 = 160;
const vidaMaxJ2 = 170;

function atualizarBarraDeVida() {
  healthJ1.style.width = (vidaJ1 / vidaMaxJ1 * 100) + "%";
  healthJ2.style.width = (vidaJ2 / vidaMaxJ2 * 100) + "%";

  healthJ1.style.backgroundColor = vidaJ1 > vidaMaxJ1 * 0.5 ? "#0f0" : vidaJ1 > vidaMaxJ1 * 0.2 ? "#ff0" : "#f00";
  healthJ2.style.backgroundColor = vidaJ2 > vidaMaxJ2 * 0.5 ? "#0f0" : vidaJ2 > vidaMaxJ2 * 0.2 ? "#ff0" : "#f00";
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

function esconderBotoesDefesa() {
  botaoDefesaJ1.style.display = "none";
  botaoNaoDefenderJ1.style.display = "none";
  botaoDefesaJ2.style.display = "none";
  botaoNaoDefenderJ2.style.display = "none";
}

function novoJogo() {
  jogada1 = null;
  jogada2 = null;
  textoJ1.textContent = "Jogador 1: escolha";
  textoJ2.textContent = "Jogador 2: escolha";
  textoResultado.textContent = "";

  vidaJ1 = 160;
  vidaJ2 = 170;
  energiaJ1 = 0;
  energiaJ2 = 0;

  atacante = null;
  defensor = null;
  tipoDefesa = null;

  atualizarBarraDeVida();
  atualizarBarraEnergia();

  document.querySelector('#attack-buttons-j1 .special-attack').disabled = true;
  document.querySelector('#attack-buttons-j2 .special-attack').disabled = true;

  setBotoesAtivos(true);
  esconderBotoesAtaque();
  esconderBotoesDefesa();
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
        defensor = 2;
      } else if (resultado.includes("Jogador 2 venceu")) {
        atacante = 2;
        defensor = 1;
      } else {
        atacante = null;
        defensor = null;
        jogada1 = null;
        jogada2 = null;
        textoJ1.textContent = "Jogador 1: escolha";
        textoJ2.textContent = "Jogador 2: escolha";
        textoResultado.textContent += " - Próxima rodada!";
        return;
      }

      textoResultado.textContent += " - Oponente decide se vai defender!";
      setBotoesAtivos(false);
      esconderBotoesAtaque();
      esconderBotoesDefesa();

      // Mostrar botões de defesa para o defensor
      if (defensor === 1) {
        botaoDefesaJ1.style.display = "inline-block";
        botaoNaoDefenderJ1.style.display = "inline-block";
        botaoDefesaJ1.disabled = energiaJ1 < 35;
      } else if (defensor === 2) {
        botaoDefesaJ2.style.display = "inline-block";
        botaoNaoDefenderJ2.style.display = "inline-block";
        botaoDefesaJ2.disabled = energiaJ2 < 35;
      }
    }
  });
});

// Defesas Jogador 1
botaoDefesaJ1.addEventListener("click", () => {
  if (energiaJ1 < 35) {
    alert("Energia insuficiente para defender!");
    return;
  }
  if (energiaJ1 >= 100) {
    tipoDefesa = "total";
  } else {
    tipoDefesa = "parcial";
  }
  energiaJ1 -= 35;
  atualizarBarraEnergia();
  iniciarAtaque();
});

botaoNaoDefenderJ1.addEventListener("click", () => {
  tipoDefesa = "nenhuma";
  iniciarAtaque();
});

// Defesas Jogador 2
botaoDefesaJ2.addEventListener("click", () => {
  if (energiaJ2 < 35) {
    alert("Energia insuficiente para defender!");
    return;
  }
  if (energiaJ2 >= 100) {
    tipoDefesa = "total";
  } else {
    tipoDefesa = "parcial";
  }
  energiaJ2 -= 35;
  atualizarBarraEnergia();
  iniciarAtaque();
});

botaoNaoDefenderJ2.addEventListener("click", () => {
  tipoDefesa = "nenhuma";
  iniciarAtaque();
});

function iniciarAtaque() {
  esconderBotoesDefesa();
  if (atacante === 1) {
    document.getElementById("attack-buttons-j1").style.display = "flex";
  } else if (atacante === 2) {
    document.getElementById("attack-buttons-j2").style.display = "flex";
  }
}

// Ataques do Jogador 1
botoesAtaqueJ1.forEach(botao => {
  botao.addEventListener("click", () => {
    if (atacante !== 1) return;  // Só atacante pode atacar

    const danoBase = parseInt(botao.getAttribute("data-attack"));
    const energiaGanha = parseInt(botao.getAttribute("data-energy")) || 0;

    // Aplica defesa
    let danoFinal = danoBase;
    if (defensor === 2) {  // Jogador 2 está defendendo
      if (tipoDefesa === "total") {
        danoFinal = 0;
      } else if (tipoDefesa === "parcial") {
        danoFinal = Math.floor(danoBase / 2);
      }
    }

    vidaJ2 -= danoFinal;
    if (vidaJ2 < 0) vidaJ2 = 0;

    if (botao.classList.contains('special-attack')) {
      energiaJ1 = 0;
    } else {
      energiaJ1 = Math.min(energiaJ1 + energiaGanha, 100);
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
    if (atacante !== 2) return;

    const danoBase = parseInt(botao.getAttribute("data-attack"));
    const energiaGanha = parseInt(botao.getAttribute("data-energy")) || 0;

    let danoFinal = danoBase;
    if (defensor === 1) {  // Jogador 1 está defendendo
      if (tipoDefesa === "total") {
        danoFinal = 0;
      } else if (tipoDefesa === "parcial") {
        danoFinal = Math.floor(danoBase / 2);
      }
    }

    vidaJ1 -= danoFinal;
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
  tipoDefesa = null;
  atacante = null;
  defensor = null;

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
