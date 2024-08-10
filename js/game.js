
const grid = document.querySelector('.grid');
const spanPlayer = document.querySelector('.player');
const timer = document.querySelector('.timer');

const maxTime = 60; // Tempo máximo em segundos
let timeRemaining = maxTime; // Tempo restante para completar o jogo
let countdown; // Variável para armazenar o setInterval do tempo máximo
let loop; // Variável para armazenar o setInterval do cronômetro

const characters = [
  'affs',
  'assustado',
  'cansado',
  'cheirando',
  'comeno',
  'coracao',
  'dancando',
  'exercicio',
  'feliz',
];

const createElement = (tag, className) => {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}

let firstCard = null;
let secondCard = null;

const resetCards = () => {
  firstCard.classList.remove('reveal-card');
  secondCard.classList.remove('reveal-card');
  firstCard = null;
  secondCard = null;
};

const checkEndGame = () => {
  const disabledCards = document.querySelectorAll('.disabled-card');
  
  if (disabledCards.length === characters.length * 2) {
    clearInterval(loop);
    clearInterval(countdown);
    setTimeout(() => {
      alert(`Parabéns, ${spanPlayer.textContent}! Seu tempo foi de: ${timer.textContent}`);
    }, 500);
  }
}

const checkCards = () => {
  const firstCharacter = firstCard.getAttribute('data-character');
  const secondCharacter = secondCard.getAttribute('data-character');

  if (firstCharacter === secondCharacter) {
    firstCard.firstChild.classList.add('disabled-card');
    secondCard.firstChild.classList.add('disabled-card');
    firstCard = null;
    secondCard = null;
    checkEndGame();
  } else {
    setTimeout(resetCards, 500);
  }
}

const revealCard = ({ target }) => {
  if (!target.parentNode.classList.contains('card') || target.parentNode.classList.contains('reveal-card') || firstCard && secondCard) {
    return;
  }

  target.parentNode.classList.add('reveal-card');

  if (!firstCard) {
    firstCard = target.parentNode;
  } else {
    secondCard = target.parentNode;
    checkCards();
  }
}

const createCard = (character) => {
  const card = createElement('div', 'card');
  const front = createElement('div', 'face front');
  const back = createElement('div', 'face back');

  front.style.backgroundImage = `url('../images/cards/${character}.png')`;

  card.appendChild(front);
  card.appendChild(back);

  card.addEventListener('click', revealCard);
  card.setAttribute('data-character', character);

  return card;
}

const loadGame = () => {
  const duplicateCharacters = [...characters, ...characters];
  const shuffledArray = duplicateCharacters.sort(() => Math.random() - 0.5);

  shuffledArray.forEach(character => {
    const card = createCard(character);
    grid.appendChild(card);
  });
}

const startTimer = () => {
  let currentTime = 0;
  timer.textContent = currentTime;
  loop = setInterval(() => {
    currentTime += 1;
    timer.textContent = currentTime;
  }, 1000);
}

const startCountdown = () => {
  countdown = setInterval(() => {
    timeRemaining -= 1;
    if (timeRemaining <= 0) {
      clearInterval(loop);
      clearInterval(countdown);
      alert(`Tempo esgotado! Você não completou o jogo a tempo.`);
      // Desabilita todas as cartas
      document.querySelectorAll('.card').forEach(card => card.removeEventListener('click', revealCard));
    }
  }, 1000);
}

// Função para iniciar o jogo
const startGame = () => {
  const playerName = localStorage.getItem('player');
  if (playerName) {
    spanPlayer.textContent = playerName;
  } else {
    spanPlayer.textContent = 'Jogador';
  }
  grid.innerHTML = ''; // Limpa o grid para o novo jogo
  timeRemaining = maxTime; // Reinicia o tempo restante
  startTimer();
  startCountdown();
  loadGame();
}

// Inicia o jogo
startGame();

