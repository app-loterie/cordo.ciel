
const playBtn = document.getElementById("play");
const wheelCanvas = document.getElementById("wheel");
const ctx = wheelCanvas.getContext("2d");
const resultDiv = document.getElementById("result");
const tickSound = document.getElementById("tick");

const segments = ["CADEAU", "PERDU", "CADEAU", "PERDU", "CADEAU", "PERDU"];
const colors = ["#4CAF50", "#333", "#4CAF50", "#333", "#4CAF50", "#333"];
let angle = 0;
let spinning = false;

function drawWheel() {
  const segmentAngle = 2 * Math.PI / segments.length;
  for (let i = 0; i < segments.length; i++) {
    ctx.beginPath();
    ctx.moveTo(150, 150);
    ctx.arc(150, 150, 150, i * segmentAngle, (i + 1) * segmentAngle);
    ctx.fillStyle = colors[i];
    ctx.fill();
    ctx.stroke();

    ctx.save();
    ctx.translate(150, 150);
    ctx.rotate(i * segmentAngle + segmentAngle / 2);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 14px Arial";
    ctx.textAlign = "center";
    ctx.fillText(segments[i], 100, 5);
    ctx.restore();
  }
}
drawWheel();

playBtn.onclick = () => {
  window.open("https://vqr.vc/ViUU8vlDR", "_blank");
  setTimeout(() => {
    document.querySelector(".wheel-container").style.display = "block";
    spinToPrize("CADEAU");
  }, 3000);
};

function spinToPrize(prize) {
  if (spinning) return;
  spinning = true;

  const index = segments.findIndex(s => s === prize);
  const segmentAngle = 2 * Math.PI / segments.length;
  const stopAngle = (segments.length - index) * segmentAngle;

  let currentAngle = 0;
  let totalRotation = 10 * 2 * Math.PI + stopAngle;
  let duration = 4000;
  let start = null;

  function animate(timestamp) {
    if (!start) start = timestamp;
    let elapsed = timestamp - start;
    let progress = Math.min(elapsed / duration, 1);
    angle = totalRotation * easeOutCubic(progress);
    ctx.clearRect(0, 0, 300, 300);
    ctx.save();
    ctx.translate(150, 150);
    ctx.rotate(angle);
    ctx.translate(-150, -150);
    drawWheel();
    ctx.restore();

    if (elapsed % 150 < 20) tickSound.play();

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      resultDiv.textContent = "Bravo ! Vous avez gagné un porte clé !";
      spinning = false;
    }
  }

  requestAnimationFrame(animate);
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}
