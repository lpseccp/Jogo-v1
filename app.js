const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let player = {
  x: 180,
  y: 500,
  size: 20,
  speed: 2,
  angle: 0
};

const walls = [
  // paredes do corredor
  { x: 150, y: 0, w: 10, h: 600 }, // parede esquerda
  { x: 240, y: 0, w: 10, h: 600 }, // parede direita

  // sala esquerda
  { x: 60, y: 350, w: 90, h: 10 }, // topo
  { x: 60, y: 350, w: 10, h: 90 }, // esquerda
  { x: 60, y: 440, w: 90, h: 10 }, // base

  // sala direita
  { x: 240, y: 250, w: 90, h: 10 }, // topo
  { x: 320, y: 250, w: 10, h: 90 }, // direita
  { x: 240, y: 340, w: 90, h: 10 }  // base
];

// portas (somente visuais por enquanto, já que entrada é por espaço livre)
const doors = [
  { x: 150, y: 370, w: 10, h: 30 }, // porta esquerda
  { x: 240, y: 270, w: 10, h: 30 }  // porta direita
];

function drawWalls() {
  ctx.fillStyle = "#555";
  for (let wall of walls) {
    ctx.fillRect(wall.x, wall.y, wall.w, wall.h);
  }
}

function drawDoors() {
  ctx.fillStyle = "#aaa";
  for (let door of doors) {
    ctx.fillRect(door.x, door.y, door.w, door.h);
  }
}

function drawPlayer() {
  ctx.fillStyle = "blue";
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.size, 0, Math.PI * 2);
  ctx.fill();
}

function drawLanterna() {
  let angle = Math.atan2(joystickData.dy, joystickData.dx);
  if (joystickData.dx !== 0 || joystickData.dy !== 0) {
    player.angle = angle;
  }

  ctx.save();
  ctx.translate(player.x, player.y);
  ctx.rotate(player.angle);

  let gradient = ctx.createRadialGradient(0, 0, 10, 0, 0, 150);
  gradient.addColorStop(0, "rgba(255,255,255,0.3)");
  gradient.addColorStop(1, "rgba(0,0,0,0)");

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(100, -50);
  ctx.lineTo(100, 50);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function isColliding(x, y) {
  for (let wall of walls) {
    if (
      x + player.size > wall.x &&
      x - player.size < wall.x + wall.w &&
      y + player.size > wall.y &&
      y - player.size < wall.y + wall.h
    ) {
      return true;
    }
  }
  return false;
}

function update() {
  let nextX = player.x + joystickData.dx * player.speed;
  let nextY = player.y + joystickData.dy * player.speed;

  if (!isColliding(nextX, player.y)) {
    player.x = nextX;
  }
  if (!isColliding(player.x, nextY)) {
    player.y = nextY;
  }
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawWalls();
  drawDoors();
  drawLanterna();
  drawPlayer();
  update();

  requestAnimationFrame(gameLoop);
}

gameLoop();
