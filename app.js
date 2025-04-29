<!DOCTYPE html><html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>Corredor Escuro</title>
  <link rel="stylesheet" href="style.css" />
  <link rel="manifest" href="manifest.json" />
  <style>
    body {
      margin: 0;
      overflow: hidden;
      background: black;
    }
    #game {
      display: block;
      background: black;
    }
    #joystickContainer {
      position: absolute;
      bottom: 20px;
      left: 20px;
      width: 100px;
      height: 100px;
      background: rgba(255,255,255,0.1);
      border-radius: 50%;
    }
    #joystick {
      width: 40px;
      height: 40px;
      background: #ccc;
      border-radius: 50%;
      position: relative;
      left: 30px;
      top: 30px;
    }
    #actionButton {
      position: absolute;
      bottom: 20px;
      right: 20px;
      padding: 10px 20px;
      font-size: 16px;
      background: #333;
      color: #fff;
      border: none;
      border-radius: 10px;
      z-index: 10;
    }
  </style>
</head>
<body>
  <canvas id="game" width="400" height="600"></canvas>
  <div id="joystickContainer">
    <div id="joystick"></div>
  </div>
  <button id="actionButton">Ação</button>  <script>
    const canvas = document.getElementById("game");
    const ctx = canvas.getContext("2d");

    let joystickData = { dx: 0, dy: 0 };
    const joystick = document.getElementById("joystick");
    let dragging = false;

    joystick.addEventListener("touchstart", (e) => {
      dragging = true;
    });
    joystick.addEventListener("touchend", (e) => {
      dragging = false;
      joystickData.dx = 0;
      joystickData.dy = 0;
      joystick.style.left = "30px";
      joystick.style.top = "30px";
    });
    joystick.addEventListener("touchmove", (e) => {
      if (!dragging) return;
      let touch = e.touches[0];
      let container = document.getElementById("joystickContainer").getBoundingClientRect();
      let dx = touch.clientX - (container.left + 50);
      let dy = touch.clientY - (container.top + 50);
      let len = Math.min(40, Math.hypot(dx, dy));
      let angle = Math.atan2(dy, dx);
      joystick.style.left = `${50 + len * Math.cos(angle) - 20}px`;
      joystick.style.top = `${50 + len * Math.sin(angle) - 20}px`;
      joystickData.dx = Math.cos(angle);
      joystickData.dy = Math.sin(angle);
    });

    let player = {
      x: 180,
      y: 500,
      size: 15,
      speed: 2,
      angle: 0
    };

    const walls = [
      // corredor
      { x: 150, y: 0, w: 10, h: 600 },
      { x: 240, y: 0, w: 10, h: 600 },
      // sala esquerda
      { x: 60, y: 350, w: 90, h: 10 },
      { x: 60, y: 350, w: 10, h: 90 },
      { x: 60, y: 440, w: 90, h: 10 },
      // sala direita
      { x: 240, y: 250, w: 90, h: 10 },
      { x: 320, y: 250, w: 10, h: 90 },
      { x: 240, y: 340, w: 90, h: 10 }
    ];

    const doors = [
      { x: 150, y: 370, w: 10, h: 30 },
      { x: 240, y: 270, w: 10, h: 30 }
    ];

    function drawWalls() {
      ctx.fillStyle = "#444";
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
      gradient.addColorStop(0, "rgba(255,255,255,0.4)");
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
      if (!isColliding(nextX, player.y)) player.x = nextX;
      if (!isColliding(player.x, nextY)) player.y = nextY;
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
  </script></body>
</html>
