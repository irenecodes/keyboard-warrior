// DOM Elements
const quoteDisplay = document.getElementById("quote");
const quoteInput = document.getElementById("quoteInput");
const timer = document.getElementById("timer");
const startBtn = document.getElementById("start-btn");
const newGameBtn = document.getElementById("new-game-btn");
const scoreDisplay = document.getElementById("score");
const startModal = document.querySelector(".start-modal");
const currentGame = document.querySelector(".current-game");
const countdownTimerDOM = document.querySelector(".countdown");
const finishedModal = document.querySelector(".finished-modal");

// Global Variables
// let startTime;
let time = 21;
let score = 0;
let countdownTimer = 4;
let isPlaying = false;

getQuote = () => {
  return fetch(`https://api.quotable.io/random`)
    .then((response) => response.json())
    .then((data) => data.content);
};

async function newQuote() {
  const quote = await getQuote();
  quoteDisplay.innerText = "";
  //   splits the quote per letter
  quote.split("").forEach((character) => {
    const quoteParagraph = document.createElement("span");
    quoteParagraph.innerText = character;
    quoteDisplay.appendChild(quoteParagraph);
  });
  quoteInput.value = null;
}

init = () => {
  isPlaying = true;
  setInterval(countdown, 1000);
  newQuote();
  console.log("check", quoteDisplay.innerText);

  quoteInput.addEventListener("input", checkMatch);
  // check game status
  setInterval(checkStatus, 50);
};

countdown = () => {
  if (countdownTimer > 0) {
    countdownTimer--;
    // after countdown, start actual game countdown
  } else if (countdownTimer === 0) {
    if (time > 0) {
      startModal.style.display = "none";
      currentGame.style.display = "block";
      time--;
    } else if (time === 0) {
      isPlaying = false;
      currentGame.style.display = "none";
      finishedModal.style.display = "block";
    }
    timer.innerHTML = time;
  }
  countdownTimerDOM.innerHTML = countdownTimer;
};

checkStatus = () => {
  if (!isPlaying && time === 0) {
  }
};

checkMatch = () => {
  if (matchWords()) {
  }
};

matchWords = () => {
  if (quoteInput.value === quoteDisplay.innerText) {
    console.log("correct");
    score++;
    newQuote();
    return true;
  } else {
    console.log("wrong");
    return false;
  }
};

// Start/Restart Game
startBtn.addEventListener("click", init);
// newGameBtn.addEventListener("click", location.reload());
