const board = document.getElementById('flipboard');
const message = "WELCOME TO GREENPORT STATION!";

function createFlap(char) {
  const container = document.createElement('div');
  container.className = 'char';

  const top = document.createElement('div');
  top.className = 'top';
  top.textContent = char;

  const bottom = document.createElement('div');
  bottom.className = 'bottom';
  bottom.textContent = char;

  container.appendChild(top);
  container.appendChild(bottom);
  return container;
}

function showMessage(msg) {
  board.innerHTML = '';
  [...msg].forEach((c, i) => {
    const flap = createFlap(c);
    board.appendChild(flap);

    setTimeout(() => {
      flap.classList.add('flip');
      setTimeout(() => {
        flap.querySelector('.top').textContent = c;
        flap.querySelector('.bottom').textContent = c;
        flap.classList.remove('flip');
      }, 300);
    }, i * 100); // stagger flips
  });
}

showMessage(message);
