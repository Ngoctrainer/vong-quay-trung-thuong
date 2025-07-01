const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbysFt9dwjxmia_yZFvdIHPQod273ZEyxC5Rbc2F3h17jCDvw0Umr9EgBtblNRvfX5ueTA/exec";

const usernameInput = document.getElementById('username');
const startBtn = document.getElementById('startBtn');
const spinBtn = document.getElementById('spinBtn');
const spinInfo = document.getElementById('spinInfo');
const wheel = document.getElementById('wheel');
const resultMessage = document.getElementById('resultMessage');

let currentSpins = 0;

startBtn.addEventListener('click', async () => {
  const username = usernameInput.value.trim();
  if (!username) {
    alert("Vui lòng nhập MNS!");
    return;
  }
  spinInfo.textContent = "Đang kiểm tra...";
  try {
    const res = await fetch(`${SCRIPT_URL}?action=getSpins&username=${encodeURIComponent(username)}`);
    const data = await res.json();
    if (data.success) {
      currentSpins = data.spins;
      spinInfo.textContent = `Bạn còn ${currentSpins} lượt quay.`;
      spinBtn.disabled = currentSpins <= 0;
    } else {
      spinInfo.textContent = "Không tìm thấy MNS.";
      spinBtn.disabled = true;
    }
  } catch (e) {
    spinInfo.textContent = "Lỗi kết nối.";
    spinBtn.disabled = true;
  }
});

spinBtn.addEventListener('click', async () => {
  if (currentSpins <= 0) return;

  spinBtn.disabled = true;
  resultMessage.textContent = "";

  const prizes = [
    { code: "A+", percent: 0.5 },
    { code: "A", percent: 2 },
    { code: "B", percent: 5 },
    { code: "C", percent: 5 },
    { code: "D", percent: 10 },
    { code: "E", percent: 10 },
    { code: "F", percent: 17.5 },
    { code: "G", percent: 50 }
  ];

  let r = Math.random() * 100;
  let selectedPrize = prizes.find(p => {
    r -= p.percent;
    return r < 0;
  }) || prizes[prizes.length - 1];

  const index = prizes.indexOf(selectedPrize);
  const baseDeg = 360 / prizes.length;
  const rotateDeg = 1800 + (index * baseDeg) + Math.random() * baseDeg;
  wheel.style.transform = `rotate(${rotateDeg}deg)`;

  setTimeout(async () => {
    try {
      const res = await fetch(`${SCRIPT_URL}?action=spin&username=${encodeURIComponent(usernameInput.value.trim())}&prize=${selectedPrize.code}`);
      const data = await res.json();
      if (data.success) {
        currentSpins = data.spins;
        resultMessage.textContent = `Bạn trúng: ${data.prize}`;
        spinInfo.textContent = currentSpins > 0 ? `Bạn còn ${currentSpins} lượt quay.` : "Bạn đã hết lượt quay.";
      } else {
        resultMessage.textContent = "Lỗi khi quay.";
      }
    } catch (e) {
      resultMessage.textContent = "Lỗi kết nối.";
    }
    spinBtn.disabled = currentSpins <= 0;
  }, 4000);
});
