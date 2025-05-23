const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreboard = document.getElementById('scoreboard');
const gameOverOverlay = document.getElementById('gameOverOverlay');
const restartBtn = document.getElementById('restartBtn');
const startBtn = document.getElementById('startBtn');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [];
let velocity = { x: 0, y: 0 };
let food = { x: 0, y: 0 };
let score = 0;
let gameInterval = null;
const gameSpeed = 120;

function placeFood() {
  while (true) {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);
    if (!snake.some(segment => segment.x === food.x && segment.y === food.y)) {
      break;
    }
  }
}

function resetGame() {
  snake = [{ x: 10, y: 10 }];
  velocity = { x: 1, y: 0 };
  score = 0;
  scoreboard.textContent = 'Score: 0';
  gameOverOverlay.style.visibility = 'hidden';
  placeFood();
  if (gameInterval) clearInterval(gameInterval);
  gameInterval = setInterval(gameLoop, gameSpeed);
}

function gameLoop() {
  const head = { x: snake[0].x + velocity.x, y: snake[0].y + velocity.y };

  if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
    endGame();
    return;
  }

  if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
    endGame();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreboard.textContent = `Score: ${score}`;
    placeFood();
  } else {
    snake.pop();
  }

  drawGame();
}

function drawGame() {
  ctx.fillStyle = '#282a36';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#ff5555';
  ctx.beginPath();
  ctx.arc((food.x + 0.5) * gridSize, (food.y + 0.5) * gridSize, gridSize / 2.5, 0, 2 * Math.PI);
  ctx.fill();

  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? '#50fa7b' : '#8be9fd';
    ctx.strokeStyle = '#121212';
    ctx.lineWidth = 2;
    ctx.fillRect(snake[i].x * gridSize, snake[i].y * gridSize, gridSize, gridSize);
    ctx.strokeRect(snake[i].x * gridSize, snake[i].y * gridSize, gridSize, gridSize);
  }
}

function endGame() {
  clearInterval(gameInterval);
  gameOverOverlay.style.visibility = 'visible';
}

// Control snake direction with arrow keys
window.addEventListener('keydown', e => {
  switch (e.key) {
    case 'ArrowUp':
      if (velocity.y === 1) break;
      velocity = { x: 0, y: -1 };
      break;
    case 'ArrowDown':
      if (velocity.y === -1) break;
      velocity = { x: 0, y: 1 };
      break;
    case 'ArrowLeft':
      if (velocity.x === 1) break;
      velocity = { x: -1, y: 0 };
      break;
    case 'ArrowRight':
      if (velocity.x === -1) break;
      velocity = { x: 1, y: 0 };
      break;
  }
});

restartBtn.addEventListener('click', () => {
  gameOverOverlay.style.visibility = 'hidden';
  resetGame();
});

startBtn.addEventListener('click', () => {
  startBtn.style.display = 'none';
  scoreboard.style.display = 'block';
  canvas.style.display = 'block';
  resetGame();
});
