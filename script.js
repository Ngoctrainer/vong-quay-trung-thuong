
let canvas = document.getElementById("wheelcanvas");
let ctx = canvas.getContext("2d");
let segments = ["🎁 Quà 1", "🎉 Quà 2", "😮 Quà 3", "🍀 May mắn lần sau"];
let deg = 360 / segments.length;

function drawWheel() {
  for (let i = 0; i < segments.length; i++) {
    ctx.beginPath();
    ctx.moveTo(250, 250);
    ctx.arc(250, 250, 250, i * deg * Math.PI / 180, (i + 1) * deg * Math.PI / 180);
    ctx.fillStyle = i % 2 === 0 ? "#FFCC00" : "#FF6666";
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#000";
    ctx.translate(250, 250);
    ctx.rotate((i + 0.5) * deg * Math.PI / 180);
    ctx.fillText(segments[i], 100, 0);
    ctx.rotate(-(i + 0.5) * deg * Math.PI / 180);
    ctx.translate(-250, -250);
  }
}
drawWheel();

function spin() {
  let randomIndex = Math.floor(Math.random() * segments.length);
  document.getElementById("result").innerText = "Bạn trúng: " + segments[randomIndex];
}
