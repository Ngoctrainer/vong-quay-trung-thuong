const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz4YvU2ZeOkbjTu4Olad4frRPgg7wBHAGQ0ql6QafxC9Xq0lWNVzBnAsZraDHbXJTH0og/exec";

const usernameInput = document.getElementById('username');
const startBtn = document.getElementById('startBtn');
const spinBtn = document.getElementById('spinBtn');
const spinInfo = document.getElementById('spinInfo');
const wheel = document.getElementById('wheel');
const resultMessage = document.getElementById('resultMessage');

let currentSpins = 0;
let spinning = false;

const prizes = [
  { code: "MISS", label: "🍀" },
  { code: "G", label: "10K" },
  { code: "F", label: "20K" },
  { code: "E", label: "50K" },
  { code: "D", label: "100K" },
  { code: "C", label: "200K" },
  { code: "B", label: "300K" },
  { code: "A", label: "500K" },
  { code: "A+", label: "1M" }
];

startBtn.addEventListener('click', async () => {
  const username = usernameInput.value.trim();
  if (!username) {
    alert("Vui lòng nhập mã nhân sự!");
    return;
  }

  spinInfo.textContent = "Đang kiểm tra lượt quay...";
  try {
    const res = await fetch(`${SCRIPT_URL}?action=getSpins&username=${encodeURIComponent(username)}`);
    const data = await res.json();
    if (data.success) {
      currentSpins = data.spins;
      spinInfo.textContent = currentSpins > 0
        ? `Bạn còn ${currentSpins} lượt quay.`
        : "Bạn đã hết lượt quay.";
      spinBtn.disabled = currentSpins <= 0;
    } else {
      spinInfo.textContent = "Không tìm thấy mã nhân sự.";
      spinBtn.disabled = true;
    }
  } catch (err) {
    console.error(err);
    spinInfo.textContent = "Lỗi kết nối server.";
    spinBtn.disabled = true;
  }
});

spinBtn.addEventListener('click', async () => {
  if (currentSpins <= 0 || spinning) return;

  spinning = true;
  spinBtn.disabled = true;
  resultMessage.textContent = "Đang quay...";

  // Cho vòng quay tự do trước
  let angle = 0;
  let interval = setInterval(() => {
    angle += 10;
    wheel.style.transform = `rotate(${angle}deg)`;
  }, 20);

  try {
    const username = usernameInput.value.trim();
    const res = await fetch(`${SCRIPT_URL}?action=spin&username=${encodeURIComponent(username)}`);
    const data = await res.json();

    if (data.success) {
      clearInterval(interval);
      currentSpins = data.spins;
      const prizeCode = data.prizeCode;
      const prizeName = data.prizeName;

      spinInfo.textContent = currentSpins > 0
        ? `Bạn còn ${currentSpins} lượt quay.`
        : "Bạn đã hết lượt quay.";
      resultMessage.textContent = `Bạn trúng: ${prizeName}`;

      const index = prizes.findIndex(p => p.code === prizeCode);
      const slice = 360 / prizes.length;
      const prizeAngle = index * slice + slice / 2;
      const extraSpin = 360 * (Math.floor(Math.random() * 3) + 5);
      const finalAngle = extraSpin + (360 - prizeAngle);

      wheel.style.transition = "transform 4s ease-out";
      wheel.style.transform = `rotate(${finalAngle}deg)`;

      setTimeout(() => {
        wheel.style.transition = "none";
        spinning = false;
        if (currentSpins > 0) spinBtn.disabled = false;
      }, 4000);
    } else {
      clearInterval(interval);
      resultMessage.textContent = "Có lỗi khi quay.";
      spinning = false;
    }
  } catch (err) {
    clearInterval(interval);
    console.error(err);
    resultMessage.textContent = "Lỗi kết nối khi quay.";
    spinning = false;
  }
});
