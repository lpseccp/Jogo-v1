const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let player = {
  x: 180,
  y: 500,
  size: 20,
  speed: 2,
  angle: 0
};

let openedDoors = [false, false]; // estado de cada porta
let collectedItems = [false];     // estado de cada item coletável

const walls = [
  // corredor
  { x: 150, y: 0, w: 10, h: 600 },
  { x: 240, y: 0, w: 10, h: 600 },

  // sala esquerda (maior)
  { x: 60, y: 300, w: 90, h: 10 },
  { x: 60, y: 300, w: 10, h: 120 },
  { x: 60, y: 420, w: 90, h: 10 },

  // sala direita (maior)
  { x: 240, y: 200, w: 90, h: 10 },
  { x: 320, y: 200, w: 10, h: 120 },
  { x: 240, y: 320, w: 90, h: 10 }
];

const doors = [
  { x: 150, y: 370, w: 10, h: 30 }, // esquerda
  { x: 240, y: 270, w: 10, h: 30 }  // direita
];

const items = [
  { x: 90, y: 340, r: 10 } // item na sala esquerda
];

const doorSound = new Audio("door.mp3"); // certifique-se de ter esse arquivo

function drawWalls() {
  ctx.fillStyle = "#555";
  for (let wall of walls) {
    ctx.fillRect(wall.x, wall.y, wall.w, wall.h);
  }
}

function drawDoors() {
  ctx.fillStyle = "#aaa";
  doors.forEach((door, i) => {
    if (!openedDoors[i]) {
      ctx.fillRect(door.x, door.y, door.w, door.h);
    }
  });
}

function drawItems() {
  ctx.fillStyle = "gold";
  items.forEach((item, i) => {
    if (!collectedItems[i]) {
      ctx.beginPath();
      ctx.arc(item.x, item.y, item.r, 0, Math.PI * 2);
      ctx.fill();
    }
  });
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

  for (let i = 0; i < doors.length; i++) {
    if (!openedDoors[i]) {
      const door = doors[i];
      if (
        x + player.size > door.x &&
        x - player.size < door.x + door.w &&
        y + player.size > door.y &&
        y - player.size < door.y + door.h
      ) {
        return true;
      }
    }
  }

  return false;
}

function update() {
  let nextX = player.x + joystickData.dx * player.speed;
  let nextY = player.y + joystickData.dy * player.speed;

  if (!isColliding(nextX, player.y)) player.x = nextX;
  if (!isColliding(player.x, nextY)) player.y = nextY;
}

function tryInteract() {
  // Verifica se está perto de alguma porta
  doors.forEach((door, i) => {
    if (!openedDoors[i]) {
      const dx = player.x - (door.x + door.w / 2);
      const dy = player.y - (door.y + door.h / 2);
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 30) {
        openedDoors[i] = true;
        doorSound.play();
      }
    }
  });

  // Verifica se está perto de algum item
  items.forEach((item, i) => {
    if (!collectedItems[i]) {
      const dx = player.x - item.x;
      const dy = player.y - item.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < player.size + item.r) {
        collectedItems[i] = true;
        alert("Item coletado!");
      }
    }
  });
}

// Botão "A"
document.getElementById("btnA").addEventListener("click", tryInteract);

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawWalls();
  drawDoors();
  drawItems();
  drawLanterna();
  drawPlayer();
  update();

  requestAnimationFrame(gameLoop);
}

gameLoop();
