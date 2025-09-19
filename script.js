const flipboard = document.getElementById("flipboard");
const sound = document.getElementById("tickSound");

const words = ["WELCOME TO GREENPORT", "DEPARTURES 10:30AM", "NEXT RIDE 11:00AM"];
let currentIndex = 0;

function playSound() {
  if (sound) {
    sound.currentTime = 0;
    sound.play();
  }
}

function updateBoard(text) {
  flipboard.innerHTML = '';
  text.split('').forEach(char => {
    const charElem = document.createElement('div');
    charElem.className = 'char';
    charElem.innerHTML = `<div>${char}</div>`;
    flipboard.appendChild(charElem);
  });
  setTimeout(() => {
    [...flipboard.children].forEach((charElem, i) => {
      setTimeout(() => {
        charElem.classList.add('flip');
        playSound();
      }, i * 100);
    });
  }, 100);
}

function cycleWords() {
  updateBoard(words[currentIndex]);
  currentIndex = (currentIndex + 1) % words.length;
}

cycleWords();
setInterval(cycleWords, 4000);
