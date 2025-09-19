const flipboard = document.getElementById("flipboard");
const tickerText = document.getElementById("tickerText");
const tickAudio = document.getElementById("tickAudio");
const muteButton = document.getElementById("muteButton");

let isMuted = false;
let tickerMessages = ["Departures", "Welcome to Greenport Express Station!"];
let tickerIndex = 0;

muteButton.addEventListener("click", () => {
  isMuted = !isMuted;
  muteButton.textContent = isMuted ? "🔇" : "🔈";
});

function playTick() {
  if (!isMuted) {
    tickAudio.currentTime = 0;
    tickAudio.play();
  }
}

function updateFlipboard(events) {
  flipboard.innerHTML = "";
  events.forEach(event => {
    const div = document.createElement("div");
    div.className = "flip-entry";
    const time = new Date(event.startTime).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    div.textContent = `${time} – ${event.title}`;
    flipboard.appendChild(div);
    playTick();
  });
}

window.addEventListener("message", (event) => {
  if (Array.isArray(event.data)) {
    updateFlipboard(event.data);
  }
});

setInterval(() => {
  tickerIndex = (tickerIndex + 1) % tickerMessages.length;
  tickerText.textContent = tickerMessages[tickerIndex];
}, 5000);
