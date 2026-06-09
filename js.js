const grid = document.getElementById("grid");
const timerEl = document.getElementById("timer");
const movesEl = document.getElementById("moves");
const restartBtn = document.getElementById("restartBtn");
const winMessage = document.getElementById("winMessage");
const bgMusic = document.getElementById("bgMusic");

// CAMINHOS CORRIGIDOS PARA APONTAR PARA A PASTA "Imagens/" E SUB-EXTENSÃO ".png.jpeg"
const pokemons = [
  { name: "charizard", img: "Imagens/charizard.png.jpeg" },
  { name: "charmander", img: "Imagens/charmander.png.jpeg" }, // Verifique se este arquivo também termina assim
  { name: "froakie", img: "Imagens/froakie.png.jpeg" },       // Verifique se este arquivo também termina assim
  { name: "gecqua", img: "Imagens/gecqua.png.jpeg" },         // Verifique se este arquivo também termina assim
  { name: "gengar", img: "Imagens/gengar.png.jpeg" },         // Verifique se este arquivo também termina assim
  { name: "greninja", img: "Imagens/greninja.png.jpeg" },
  { name: "piplup", img: "Imagens/piplup.png.jpeg" },
  { name: "sceptile", img: "Imagens/sceptile.png.jpeg" },
  { name: "treecko", img: "Imagens/treecko.png.jpeg" },
  { name: "zeraora", img: "Imagens/zeraora.png.jpeg" }        // Verifique se este arquivo também termina assim
];

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let matches = 0;
let timer = 0;
let timerInterval = null;

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function startTimer() {
  clearInterval(timerInterval);
  timer = 0;
  timerEl.textContent = timer;

  timerInterval = setInterval(() => {
    timer++;
    timerEl.textContent = timer;
  }, 1000);
}

function playMusic(src) {
  if (bgMusic.src.includes(src) && !bgMusic.paused) return;

  bgMusic.pause();
  bgMusic.src = src;
  bgMusic.volume = 0.4;
  bgMusic.currentTime = 0;
  bgMusic.play().catch(() => {});
}

function createCard(pokemon) {
  const card = document.createElement("div");
  card.className = "card";
  card.dataset.name = pokemon.name;

  card.innerHTML = `
    <div class="face front">
      <img src="${pokemon.img}" alt="${pokemon.name}">
    </div>
    <div class="face back"></div>
  `;

  card.addEventListener("click", revealCard);
  return card;
}

function loadGame() {
  grid.innerHTML = "";
  winMessage.textContent = "";
  firstCard = null;
  secondCard = null;
  lockBoard = false;
  moves = 0;
  matches = 0;
  movesEl.textContent = moves;

  const duplicatedPokemons = [...pokemons, ...pokemons];
  const shuffledPokemons = shuffle(duplicatedPokemons);

  shuffledPokemons.forEach((pokemon) => {
    const card = createCard(pokemon);
    grid.appendChild(card);
  });

  startTimer();
  // CAMINHO DA MÚSICA REVISADO PARA "Musicas/" SEM ACENTO DE ACORDO COM SEU DIRETÓRIO LOCAL
  playMusic("Musicas/pokemon-theme-song-original2.mp3");
}

function revealCard() {
  if (lockBoard) return;
  if (this === firstCard) return;
  if (this.classList.contains("matched")) return;

  this.classList.add("revealed");

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  moves++;
  movesEl.textContent = moves;

  checkMatch();
}

function checkMatch() {
  const isMatch = firstCard.dataset.name === secondCard.dataset.name;

  if (isMatch) {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");

    matches++;
    resetTurn();

    if (matches === pokemons.length) {
      clearInterval(timerInterval);
      playMusic("Musicas/pokemon-battle.mp3");
      winMessage.textContent = `Parabéns! Você venceu em ${moves} jogadas e ${timer} segundos!`;
    }
  } else {
    lockBoard = true;

    setTimeout(() => {
      firstCard.classList.remove("revealed");
      secondCard.classList.remove("revealed");
      resetTurn();
    }, 800);
  }
}

function resetTurn() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

restartBtn.addEventListener("click", loadGame);

document.body.addEventListener("click", () => {
  if (bgMusic.paused) {
    bgMusic.play().catch(() => {});
  }
}, { once: true });

loadGame();
