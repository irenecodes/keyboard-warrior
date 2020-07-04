// DOM Elements
const instructionsDOM = document.querySelector(".instructions");
const infoBtn = document.querySelector(".info svg");
const countSound = document.getElementById("count-audio");

const startModal = document.querySelector(".start-modal");
const startBtn = document.getElementById("start-btn");
//show countdown on page before game starts when countdown hits 0
// add sound effect for countdown?
const countdownTimerDOM = document.querySelector(".countdown");

// current game
const currentGame = document.querySelector(".current-game");
const quoteDisplay = document.getElementById("quote");
const quoteInput = document.getElementById("quoteInput");
const timer = document.getElementById("timer");
const scoreDisplay = document.getElementById("score");

// finished modal
const finishedModal = document.querySelector(".finished-modal");
const newGameBtn = document.getElementById("new-game-btn");
const finalScoreDisplay = document.getElementById("final-score");
const overallTimer = document.getElementById("overall-timer");

// Global Variables
//use Date.now() because setInt and setTimeout are arbitrary
let startTime = Date.now();
let newTime;
let time = 21;
let score = 0;
let countdownTimer = 3;
let isPlaying = false;

// newTime returns overall time value in DOM
watchTime = () => {
  if (isPlaying) {
    setInterval(() => {
      newTime = Math.floor((Date.now() - startTime) / 1000);
    }, 1000);
  }
  newTime = newTime - 3;
  // rid of countdown timer
  overallTimer.innerText = newTime;
};

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

checkStatus = () => {
  if (!isPlaying) {
    document.getElementById("quoteInput").disabled = true;
  } else {
    document.getElementById("quoteInput").disabled = false;
  }
};

init = () => {
  startBtn.disabled = true;
  startBtn.style.cursor = "wait";
  setInterval(countdown, 1000);
  newQuote();
  quoteInput.addEventListener("input", checkMatch);
  // check game status
  setInterval(checkStatus, 50);
};

countdown = () => {
  if (countdownTimer > 0) {
    countdownTimerDOM.innerHTML = countdownTimer;
    countdownTimerDOM.style.display = "block";
    countdownTimer--;
    countSound.play();
    // after countdown, start actual game countdown
  } else if (countdownTimer === 0) {
    // fade out?
    countdownTimerDOM.style.display = "none";
    if (time > 0) {
      startModal.style.display = "none";
      currentGame.style.display = "block";
      time--;
      isPlaying = true;
      watchTime();
      if (time <= 5) {
        timer.classList.add("warning-red");
        countSound.play();
      } else {
        timer.classList.remove("warning-red");
      }
    } else if (time === 0) {
      currentGame.style.display = "none";
      finishedModal.style.display = "block";
    }
    timer.innerHTML = time;
  }
};

checkMatch = () => {
  let quoteArray = quoteDisplay.querySelectorAll("span");
  const userInput = quoteInput.value.split("");
  quoteArray.forEach((el, i) => {
    const character = userInput[i];
    if (character == el.innerText) {
      el.classList.remove("incorrect");
    } else {
      el.classList.add("incorrect");
    }
  });

  if (matchWords()) {
    score++;
    newQuote();
    time = 21;
  }
  scoreDisplay.innerHTML = score;
  finalScoreDisplay.innerHTML = score;
};

// returns boolean
matchWords = () => {
  if (quoteInput.value === quoteDisplay.innerText) {
    return true;
  } else {
    return false;
  }
};

infoToggle = () => {
  instructionsDOM.classList.toggle("toggle");
};

// Start Game
startBtn.addEventListener("click", init);

infoBtn.addEventListener("click", infoToggle);
