// DOM Elements
const quoteDisplay = document.getElementById("quote");
const quoteInput = document.getElementById("quoteInput");
const timer = document.getElementById("timer");
const startBtn = document.getElementById("start-btn");
const newGameBtn = document.getElementById("new-game-btn");
const scoreDisplay = document.getElementById("score");
let startModal = document.querySelector(".start-modal");
let currentGame = document.querySelector(".current-game");

let startTime;

getQuote = () => {
  return fetch(`https://api.quotable.io/random`)
    .then((response) => response.json())
    .then((data) => data.content);
};

// returns time value
getTimerTime = () => {
  return Math.floor((new Date() - startTime) / 1000);
};

startTimer = () => {
  timer.innerText = 0;
  startTime = new Date();
  setInterval(() => {
    timer.innerText = "Seconds: " + getTimerTime();
  }, 1000);
};

async function newQuote() {
  const quote = await getQuote();
  quoteDisplay.innerText = "";
  //   splits the quote per letter
  quote.split("").forEach((character) => {
    //   has to be span since p and div are block element
    const quoteParagraph = document.createElement("span");
    quoteParagraph.innerText = character;
    quoteDisplay.appendChild(quoteParagraph);
  });
  quoteInput.value = null;

  startModal.style.display = "none";
  currentGame.style.display = "block";

  startTimer();
}

// initialize Game
startBtn.addEventListener("click", newQuote);

newGameBtn.addEventListener("click", newQuote);
