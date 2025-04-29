let joystick = document.getElementById("joystick");
let container = document.getElementById("joystickContainer");
let joystickData = { dx: 0, dy: 0 };

container.addEventListener("touchmove", function (e) {
  e.preventDefault();
  let rect = container.getBoundingClientRect();
  let touch = e.touches[0];
  let x = touch.clientX - rect.left - 60;
  let y = touch.clientY - rect.top - 60;
  let dist = Math.sqrt(x * x + y * y);
  let maxDist = 60;

  if (dist > maxDist) {
    x *= maxDist / dist;
    y *= maxDist / dist;
  }

  joystick.style.left = `${x + 60}px`;
  joystick.style.top = `${y + 60}px`;

  joystickData.dx = x / maxDist;
  joystickData.dy = y / maxDist;
});

container.addEventListener("touchend", function () {
  joystick.style.left = `30px`;
  joystick.style.top = `30px`;
  joystickData.dx = 0;
  joystickData.dy = 0;
});