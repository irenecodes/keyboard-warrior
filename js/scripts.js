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
const overallTimer = document.getElementById("overall-timer");

// Global Variables
//use Date.now() because setInt and setTimeout are arbitrary
let startTime = Date.now();
let newTime;
let time = 21;
let score = 0;
let countdownTimer = 4;
let isPlaying = false;

// returns overall time value
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
  } else {
    document.getElementById("quoteInput").disabled = false;
  }
};

init = () => {
  setInterval(countdown, 1000);
  newQuote();
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
      isPlaying = true;
      watchTime();
    } else if (time === 0) {
      currentGame.style.display = "none";
      finishedModal.style.display = "block";
    }
    timer.innerHTML = time;
  }
  countdownTimerDOM.innerHTML = countdownTimer;
};

checkMatch = () => {
  let quoteArray = quoteDisplay.querySelectorAll("span");
  const userInput = quoteInput.value.split("");
  console.log(quoteArray, userInput);
  // let correct = true;
  quoteArray.forEach((el, i) => {
    const character = userInput[i];
    console.log("user typing", character);
    if (character == el.innerText) {
      console.log("check: correct");
      el.classList.add("correct");
      el.classList.remove("incorrect");
    } else {
      console.log("check: wrong!");
      el.classList.add("incorrect");
      el.classList.remove("correct");
    }
  });

  if (matchWords()) {
    score++;
    newQuote();
    time = 21;
  }
  scoreDisplay.innerHTML = score;
};

// returns boolean
matchWords = () => {
  if (quoteInput.value === quoteDisplay.innerText) {
    console.log("correct");
    return true;
  } else {
    console.log("wrong");
    return false;
  }
};

// Start Game
startBtn.addEventListener("click", init);
