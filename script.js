const board = document.getElementById('flipboard');
const audio = document.getElementById('tickAudio');
let isMuted = false;

const messages = [
  "WELCOME TO GREENPORT!",
  "NEXT DEPARTURE: 1:00 PM",
  "THANK YOU TO OUR SPONSORS",
  "ALL ABOARD THE GREENPORT EXPRESS"
];
let msgIndex = 0;

function createFlap(char) {
  const flap = document.createElement('div');
  flap.className = 'flap';

  const top = document.createElement('div');
  top.className = 'flap-top';
  top.textContent = char;

  const bottom = document.createElement('div');
  bottom.className = 'flap-bottom';
  bottom.textContent = char;

  flap.appendChild(top);
  flap.appendChild(bottom);
  return flap;
}

function showMessage(msg) {
  board.innerHTML = '';
  [...msg].forEach(c => {
    const flap = createFlap(c);
    board.appendChild(flap);
  });
}

function flipToMessage(msg) {
  const flaps = document.querySelectorAll('.flap');
  const chars = [...msg];

  chars.forEach((c, i) => {
    const flap = flaps[i];
    if (!flap) return;

    setTimeout(() => {
      flap.classList.add('flipping');
      playTick();

      setTimeout(() => {
        flap.querySelector('.flap-top').textContent = c;
        flap.querySelector('.flap-bottom').textContent = c;
        flap.classList.remove('flipping');
      }, 300);
    }, i * 100);
  });
}

function cycleMessages() {
  const msg = messages[msgIndex % messages.length];
  showMessage(msg);
  flipToMessage(msg);
  msgIndex++;
}

function playTick() {
  if (!isMuted) {
    audio.currentTime = 0;
    audio.play().catch(() => {});
  }
}

document.getElementById("muteButton").addEventListener("click", () => {
  isMuted = !isMuted;
  document.getElementById("muteButton").textContent = isMuted ? "🔇" : "🔈";
});

cycleMessages();
setInterval(cycleMessages, 5000);
