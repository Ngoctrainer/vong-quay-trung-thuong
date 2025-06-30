const SCRIPT_URL = "YOUR_SCRIPT_URL"; // Thay bằng link Apps Script của bạn

const prizes = [
  { code: "A+", label: "1M", percent: 0.5 },
  { code: "A", label: "500K", percent: 2 },
  { code: "B", label: "300K", percent: 5 },
  { code: "C", label: "200K", percent: 5 },
  { code: "D", label: "100K", percent: 10 },
  { code: "E", label: "50K", percent: 10 },
  { code: "F", label: "20K", percent: 17.5 },
  { code: "G", label: "10K", percent: 50 }
];

const usernameInput = document.getElementById('username');
const startBtn = document.getElementById('startBtn');
const spinBtn = document.getElementById('spinBtn');
const spinInfo = document.getElementById('spinInfo');
const wheel = document.getElementById('wheel');
const resultMessage = document.getElementById('resultMessage');

const baseDeg = 360 / prizes.length;

// Tạo label động
prizes.forEach((p, i) => {
  const label = document.createElement('div');
  label.className = 'label';
  label.innerText = p.label;
  label.style.transform = `rotate(${i * baseDeg + baseDeg / 2}deg) translate(120px) rotate(-${i * baseDeg + baseDeg / 2}deg)`;
  wheel.appendChild(label);
});

let currentSpins = 0;

startBtn.addEventListener('click', async () => {
  const username = usernameInput.value.trim();
  if (!username) {
    alert("Vui lòng nhập MNS!");
    return;
  }
  spinInfo.textContent = "Đang kiểm tra lượt...";
  try {
    const res = await fetch(`${SCRIPT_URL}?action=getSpins&username=${encodeURIComponent(username)}`);
    const data = await res.json();
    if (data.success) {
      currentSpins = data.spins;
      spinInfo.textContent = `Bạn còn ${currentSpins} lượt quay.`;
      spinBtn.disabled = currentSpins > 0 ? false : true;
    } else {
      spinInfo.textContent = "Không tìm thấy MNS.";
      spinBtn.disabled = true;
    }
  } catch {
    spinInfo.textContent = "Lỗi server.";
  }
});

spinBtn.addEventListener('click', async () => {
  if (currentSpins <= 0) return;
  spinBtn.disabled = true;

  let r = Math.random() * 100;
  let selectedPrize = prizes.find(p => {
    r -= p.percent;
    return r < 0;
  }) || prizes[prizes.length - 1];

  const index = prizes.indexOf(selectedPrize);
  const rotateDeg = 1800 + index * baseDeg + baseDeg / 2;
  wheel.style.transform = `rotate(${rotateDeg}deg)`;

  setTimeout(async () => {
    try {
      const res = await fetch(`${SCRIPT_URL}?action=spin&username=${encodeURIComponent(usernameInput.value.trim())}&prize=${encodeURIComponent(selectedPrize.code)}`);
      const data = await res.json();
      if (data.success) {
        resultMessage.textContent = `Bạn trúng: ${data.prize}`;
        currentSpins = data.spins;
        spinInfo.textContent = currentSpins > 0 ? `Bạn còn ${currentSpins} lượt quay.` : "Bạn đã hết lượt quay.";
      } else {
        resultMessage.textContent = "Lỗi quay số.";
      }
    } catch {
      resultMessage.textContent = "Lỗi kết nối.";
    }
    spinBtn.disabled = currentSpins > 0 ? false : true;
  }, 4000);
});
