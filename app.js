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
  // Corredor
  { x: 130, y: 0, w: 10, h: 600 },
  { x: 260, y: 0, w: 10, h: 600 },

  // Sala esquerda maior
  { x: 20, y: 300, w: 110, h: 10 },  // topo
  { x: 20, y: 300, w: 10, h: 120 },  // lateral esquerda
  { x: 20, y: 420, w: 110, h: 10 },  // base

  // Sala direita maior
  { x: 270, y: 200, w: 110, h: 10 },  // topo
  { x: 380, y: 200, w: 10, h: 120 },  // lateral direita
  { x: 270, y: 320, w: 110, h: 10 }   // base
];

// Portas maiores
let doors = [
  { x: 130, y: 340, w: 10, h: 40, opened: false }, // porta esquerda
  { x: 260, y: 240, w: 10, h: 40, opened: false }  // porta direita
];

let showHint = false;

function drawWalls() {
  ctx.fillStyle = "#555";
  for (let wall of walls) {
    ctx.fillRect(wall.x, wall.y, wall.w, wall.h);
  }
}

function drawDoors() {
  for (let door of doors) {
    if (!door.opened) {
      ctx.fillStyle = "#aaa";
      ctx.fillRect(door.x, door.y, door.w, door.h);
    }
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

function drawHint() {
  if (showHint) {
    ctx.fillStyle = "white";
    ctx.font = "18px Arial";
    ctx.fillText("Aperte Ação para abrir a porta", 80, 50);
  }
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
  for (let door of doors) {
    if (!door.opened &&
      x + player.size > door.x &&
      x - player.size < door.x + door.w &&
      y + player.size > door.y &&
      y - player.size < door.y + door.h
    ) {
      return true;
    }
  }
  return false;
}

function update() {
  let nextX = player.x + joystickData.dx * player.speed;
  let nextY = player.y + joystickData.dy * player.speed;

  if (!isColliding(nextX, player.y)) player.x = nextX;
  if (!isColliding(player.x, nextY)) player.y = nextY;

  // Verifica se está próximo de uma porta
  showHint = false;
  for (let door of doors) {
    let dx = door.x + door.w / 2 - player.x;
    let dy = door.y + door.h / 2 - player.y;
    let dist = Math.sqrt(dx * dx + dy * dy);
    if (!door.opened && dist < 50) {
      showHint = true;
      break;
    }
  }
}

function openNearbyDoor() {
  for (let door of doors) {
    let dx = door.x + door.w / 2 - player.x;
    let dy = door.y + door.h / 2 - player.y;
    let dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 50) {
      door.opened = true;
    }
  }
}

document.getElementById("actionButton").addEventListener("click", openNearbyDoor);

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawWalls();
  drawDoors();
  drawLanterna();
  drawPlayer();
  drawHint();
  update();
  requestAnimationFrame(gameLoop);
}

gameLoop();
