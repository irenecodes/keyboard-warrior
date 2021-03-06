// DOM Elements
const countSound = document.getElementById("count-audio");

const muteBtn = document.querySelector(".volume button");
const volumeStatus = document.querySelector(".volume span");

const startModal = document.querySelector(".start-modal");
const startBtn = document.getElementById("start-btn");
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
const endMessage = document.getElementById("end-message");

// Global Variables
//use Date.now() because setInt and setTimeout are arbitrary
let startTime = Date.now();
let newTime;
let finalScore;
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
  // rid of countdown timer
  overallTimer.innerText = newTime - 3;
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
    checkFinalScoreIsHigh();
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
};

countdown = () => {
  if (countdownTimer > 0) {
    countdownTimerDOM.innerHTML = countdownTimer;
    countdownTimerDOM.style.display = "block";
    countdownTimer--;
    countSound.play();
    // after countdown, start actual game countdown
  } else if (countdownTimer === 0) {
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
      isPlaying = false;
      finishedModal.style.display = "block";
    }
    checkStatus();
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
};

checkFinalScoreIsHigh = () => {
  finalScore = score;
  finalScoreDisplay.innerHTML = finalScore;
  if (finalScore >= 3) {
    endMessage.innerHTML = "Wow! That was super fast. Have a break.";
  } else {
    endMessage.innerHTML = "Good Effort. Better luck next time!";
  }
};

// returns boolean
matchWords = () => {
  if (quoteInput.value === quoteDisplay.innerText) {
    return true;
  } else {
    return false;
  }
};

toggleVolume = () => {
  if (!countSound.muted) {
    countSound.muted = true;
    muteBtn.classList.remove("btn-light");
    muteBtn.classList.add("btn-danger");
    muteBtn.setAttribute("aria-pressed", true);
    volumeStatus.innerHTML = "Sound: Off";
  } else {
    countSound.muted = false;
    muteBtn.classList.remove("btn-danger");
    muteBtn.classList.add("btn-light");
    muteBtn.removeAttribute("aria-pressed");
    volumeStatus.innerHTML = "Sound: On";
  }
};

// Start Game
startBtn.addEventListener("click", init);

muteBtn.addEventListener("click", toggleVolume);

// Loading
document.addEventListener("DOMContentLoaded", function () {
  setTimeout(function () {
    document.querySelector("body").classList.add("loaded");
  }, 2500);
});

// to do
// - fix overall timer. inaccurate time at end of game
