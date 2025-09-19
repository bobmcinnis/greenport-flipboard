const messages = [
  "NEXT DEPARTURE: 1:00 PM GREENPORT STATION!",
  "WELCOME TO GREENPORT EXPRESS STATION!"
];

let currentIndex = 0;
let container = document.getElementById("flipboard");
let sound = document.getElementById("tick-sound");
let soundToggle = document.getElementById("sound-toggle");
let ticker = document.getElementById("ticker");
let soundEnabled = true;

soundToggle.onclick = () => {
  soundEnabled = !soundEnabled;
  soundToggle.textContent = soundEnabled ? "🔊" : "🔇";
};

function setFlipText(text) {
  const chars = text.split("");
  container.innerHTML = "";
  chars.forEach((ch, i) => {
    const span = document.createElement("div");
    span.classList.add("char");
    span.textContent = ch === " " ? " " : ch;
    container.appendChild(span);
    setTimeout(() => {
      span.classList.add("flip");
      if (soundEnabled && ch !== " ") {
        sound.currentTime = 0;
        sound.play();
      }
    }, i * 70);
  });
}

function rotateMessages() {
  setFlipText(messages[currentIndex]);
  ticker.textContent = currentIndex === 0 ? "DEPARTURES" : "WELCOME";
  currentIndex = (currentIndex + 1) % messages.length;
}

rotateMessages();
setInterval(rotateMessages, 8000);
