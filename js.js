const grid = document.getElementById("grid");
const timerEl = document.getElementById("timer");
const movesEl = document.getElementById("moves");
const restartBtn = document.getElementById("restartBtn");
const winMessage = document.getElementById("winMessage");
const bgMusic = document.getElementById("bgMusic");

// Lista ajustada com as imagens reais que estão na sua pasta "Imagens/" no GitHub
const pokemons = [
  { name: "treecko", img: "Imagens/treecko.png.jpeg" },
  { name: "sceptile", img: "Imagens/sceptile.png.jpeg" },
  { name: "piplup", img: "Imagens/piplup.png.jpeg" },
  { name: "greninja", img: "Imagens/greninja.png.jpeg" },
  { name: "charizard", img: "Imagens/charizard.png.jpeg" }
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
  bgMusic.play().catch((err) => console.log("Erro ao tocar música: ", err));
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
  
  // Caminho exato da pasta e do arquivo de áudio do WhatsApp que está no seu GitHub
  playMusic("Músicos/Áudio do WhatsApp 2026-06-09 às 00:24:36.mpeg");
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
      // Áudio secundário do WhatsApp para quando ganhar o jogo
      playMusic("Músicos/Áudio do WhatsApp 2026-06-09 às 00:24:36 (1).mpeg");
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
