// Split-flap board using image halves generated in /assets/top and /assets/bottom
const board = document.getElementById('board');
const tick = document.getElementById('tick');
const muteBtn = document.getElementById('mute');

let muted = false;
muteBtn.addEventListener('click', () => {
  muted = !muted;
  muteBtn.textContent = muted ? '🔇' : '🔈';
});

const CHARSET = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789:-";
const nameMap = new Map([[" ", "space"], [":", "colon"], ["-", "dash"]]);
for (const c of "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789") nameMap.set(c, c);

function assetPathTop(ch){ return `assets/top/${nameMap.get(ch) || "space"}.png`; }
function assetPathBottom(ch){ return `assets/bottom/${nameMap.get(ch) || "space"}.png`; }

function createCell(ch = " ") {
  const cell = document.createElement('div');
  cell.className = 'cell';
  cell.dataset.char = ch;

  const top = document.createElement('div');
  top.className = 'panel top';
  top.style.backgroundImage = `url(${assetPathTop(ch)})`;

  const bottom = document.createElement('div');
  bottom.className = 'panel bottom';
  bottom.style.backgroundImage = `url(${assetPathBottom(ch)})`;

  const flipTop = document.createElement('div');
  flipTop.className = 'flip-top';
  flipTop.style.backgroundImage = `url(${assetPathTop(ch)})`;

  const flipBottom = document.createElement('div');
  flipBottom.className = 'flip-bottom';
  flipBottom.style.backgroundImage = `url(${assetPathBottom(ch)})`;

  cell.appendChild(top);
  cell.appendChild(bottom);
  cell.appendChild(flipTop);
  cell.appendChild(flipBottom);

  return cell;
}

function setMessage(text) {
  const chars = Array.from(text.toUpperCase());
  // Resize board
  while (board.children.length < chars.length) board.appendChild(createCell(" "));
  while (board.children.length > chars.length) board.removeChild(board.lastChild);

  // Flip all cells simultaneously
  chars.forEach((target, i) => flipCellTo(board.children[i], target));
}

function flipCellTo(cell, target) {
  const current = cell.dataset.char || " ";
  if (current === target) return;

  // Decide intermediate steps to mimic cycling through characters
  const steps = computeSteps(current, target);
  runSteps(cell, steps, 0);
}

function computeSteps(from, to) {
  const steps = [];
  const start = CHARSET.indexOf(from);
  const end = CHARSET.indexOf(to);
  if (start < 0 || end < 0) {
    steps.push(to);
    return steps;
  }
  let idx = start;
  // Allow up to 6 flips including target for speed/realism
  while (idx !== end && steps.length < 5) {
    idx = (idx + 1) % CHARSET.length;
    steps.push(CHARSET[idx]);
  }
  if (steps[steps.length - 1] !== to) steps.push(to);
  return steps;
}

function runSteps(cell, steps, k) {
  if (k >= steps.length) return;
  const nextChar = steps[k];
  const top = cell.querySelector('.top');
  const bottom = cell.querySelector('.bottom');
  const flipTop = cell.querySelector('.flip-top');
  const flipBottom = cell.querySelector('.flip-bottom');

  // Prepare flip images: top uses CURRENT, bottom uses NEXT
  const curr = cell.dataset.char || " ";
  flipTop.style.backgroundImage = `url(${assetPathTop(curr)})`;
  flipBottom.style.backgroundImage = `url(${assetPathBottom(nextChar)})`;

  // Start top animation
  cell.classList.add('animating', 'anim-top');
  if (!muted) { try { tick.currentTime = 0; tick.play(); } catch(e){} }

  flipTop.addEventListener('animationend', function onTopEnd() {
    flipTop.removeEventListener('animationend', onTopEnd);
    // After top closes, swap static TOP to NEXT
    top.style.backgroundImage = `url(${assetPathTop(nextChar)})`;
    // Start bottom animation opening to NEXT
    cell.classList.remove('anim-top');
    cell.classList.add('anim-bottom');
    if (!muted) { try { tick.currentTime = 0; tick.play(); } catch(e){} }

    flipBottom.addEventListener('animationend', function onBotEnd() {
      flipBottom.removeEventListener('animationend', onBotEnd);
      // Finish: set static bottom to NEXT, clear anim flags, update char
      bottom.style.backgroundImage = `url(${assetPathBottom(nextChar)})`;
      cell.classList.remove('anim-bottom', 'animating');
      cell.dataset.char = nextChar;
      // Next step in sequence
      setTimeout(() => runSteps(cell, steps, k+1), 20);
    }, { once: true });
  }, { once: true });
}

// Demo rotation
const messages = [
  "WELCOME TO GREENPORT EXPRESS STATION!",
  "NEXT DEPARTURE: 01:00 PM",
  "THANK YOU TO OUR SPONSORS",
  "ALL ABOARD THE GREENPORT EXPRESS"
];
let idx = 0;
function cycle() {
  setMessage(messages[idx % messages.length]);
  idx++;
}
cycle();
setInterval(cycle, 5000);
