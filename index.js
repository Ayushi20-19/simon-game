const colors = ["green", "red", "yellow", "blue"];
let gamePattern = [];
let userPattern = [];
let level = 0;
let started = false;
let nextSequenceTimeout;
const sound = new Audio("./assets/sound.mp3");

// Highlight button with animation
function animatePress(color) {
  const btn = document.querySelector(`.${color}`);
  btn.classList.add("active");
  sound.currentTime = 0; // Reset sound to start
  sound.play(); // Reuse the Audio object
  setTimeout(() => btn.classList.remove("active"), 300);
}

// Start the game on key press
document.addEventListener("keydown", startGame);

function startGame() {
  if (!started) {
    started = true;
    level = 0;
    gamePattern = [];
    toggleButtonState(false); // Enable buttons
    nextSequence();
  } else {
    console.log("Game already started");
  }
}

// Add a new random color to the sequence
function nextSequence() {
  if (!started) return; // Don't proceed if the game is over

  userPattern = [];
  level++;
  document.getElementById("level-title").textContent = `Level ${level}`;

  const randomColor = colors[Math.floor(Math.random() * 4)];
  gamePattern.push(randomColor);

  // Highlight the new color in the sequence
  const newColor = gamePattern[gamePattern.length - 1];
  clearTimeout(nextSequenceTimeout); // Clear the previous timeout
  nextSequenceTimeout = setTimeout(() => {
    animatePress(newColor);
  }, 500);
}

// Handle user clicks
document.querySelectorAll(".btn").forEach((button) => {
  button.addEventListener("click", function () {
    if (!started || document.body.classList.contains("game-over")) {
      return;
    }

    const userChosenColor = this.getAttribute("data-color");
    userPattern.push(userChosenColor);

    animatePress(userChosenColor);

    checkAnswer(userPattern.length - 1);
  });
});

// Check user's answer
function checkAnswer(currentLevel) {
  if (userPattern[currentLevel] === gamePattern[currentLevel]) {
    // If user has entered the full sequence correctly, move to the next level
    if (userPattern.length === gamePattern.length) {
      clearTimeout(nextSequenceTimeout); // Clear the previous timeout
      nextSequenceTimeout = setTimeout(nextSequence, 1000);
    }
  } else {
    // Game over
    document.body.classList.add("game-over");
    toggleButtonState(true); // Disable buttons
    setTimeout(() => document.body.classList.remove("game-over"), 500);

    document.getElementById("level-title").textContent =
      "Game Over, Press Any Key to Restart";

    // Detach the `keydown` listener temporarily to avoid double start
    document.removeEventListener("keydown", startGame);
    setTimeout(() => {
      document.addEventListener("keydown", startGame); // Reattach the listener after a short delay
    }, 500);

    startOver();
  }
}

// Reset the game
function startOver() {
  gamePattern = [];
  userPattern = [];
  level = 0;
  started = false;
  toggleButtonState(true); // Disable buttons immediately after game over
  clearTimeout(nextSequenceTimeout); // Clear any remaining timeouts
}

// Enable or disable button clicks
function toggleButtonState(disable) {
  const buttons = document.querySelectorAll(".btn");
  buttons.forEach((button) => {
    if (disable) {
      button.classList.add("disabled");
    } else {
      button.classList.remove("disabled");
    }
  });
}

// Disable buttons initially
toggleButtonState(true);
