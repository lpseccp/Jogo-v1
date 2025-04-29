const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let player = {
  x: 180,
  y: 500,
  size: 20,
  speed: 2,
  angle: 0
};

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

function drawCorredor() {
  ctx.fillStyle = "#222";
  ctx.fillRect(150, 0, 100, canvas.height);
}

function update() {
  player.x += joystickData.dx * player.speed;
  player.y += joystickData.dy * player.speed;
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCorredor();
  drawLanterna();
  drawPlayer();
  update();
  requestAnimationFrame(gameLoop);
}

gameLoop();