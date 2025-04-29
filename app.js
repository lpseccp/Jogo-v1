<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Jogo Escuro</title>
  <style>
    body {
      margin: 0;
      overflow: hidden;
      background: black;
    }
    canvas {
      display: block;
    }
    #controls {
      position: absolute;
      bottom: 20px;
      left: 20px;
      display: flex;
      gap: 20px;
      z-index: 10;
    }
    .btn {
      width: 60px;
      height: 60px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 30px;
      color: white;
      user-select: none;
    }
  </style>
</head>
<body>
  <canvas id="game" width="400" height="600"></canvas>
  <div id="controls">
    <div id="joystick" class="btn">+</div>
    <div id="action" class="btn">A</div>
  </div>
  <audio id="doorSound" src="https://cdn.pixabay.com/audio/2021/08/04/audio_eb79803cb6.mp3"></audio>
  <script src="app.js"></script>
</body>
</html>
