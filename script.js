const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwcmipJhIHDg_NQDYzWLFE9LjyaVm2dD_kVNVK5ANP2nBho3r7n1sdDBvUOpyGcrWAIoQ/exec";

const usernameInput = document.getElementById('username');
const startBtn = document.getElementById('startBtn');
const spinBtn = document.getElementById('spinBtn');
const spinInfo = document.getElementById('spinInfo');
const wheel = document.getElementById('wheel');
const resultMessage = document.getElementById('resultMessage');

let currentSpins = 0;

const prizes = [
  { code: "Voucher 1.000.000đ", percent: 0.5 },
  { code: "Voucher 500.000đ", percent: 2 },
  { code: "Voucher 300.000đ", percent: 5 },
  { code: "Voucher 200.000đ", percent: 5 },
  { code: "Voucher 100.000đ", percent: 10 },
  { code: "Voucher 50.000đ", percent: 10 },
  { code: "Voucher 20.000đ", percent: 17.5 },
  { code: "Voucher 10.000đ", percent: 50 }
];

startBtn.addEventListener('click', async () => {
  const username = usernameInput.value.trim();
  if (!username) {
    alert("Vui lòng nhập mã nhân sự!");
    return;
  }

  spinInfo.textContent = "Đang kiểm tra...";
  try {
    const res = await fetch(`${SCRIPT_URL}?action=getSpins&username=${encodeURIComponent(username)}`);
    const data = await res.json();
    if (data.success && data.spins !== undefined) {
      currentSpins = data.spins;
      spinInfo.textContent = `Bạn còn ${currentSpins} lượt quay.`;
      spinBtn.disabled = currentSpins <= 0;
    } else {
      spinInfo.textContent = "Không tìm thấy mã nhân sự.";
      spinBtn.disabled = true;
    }
  } catch (err) {
    console.error(err);
    spinInfo.textContent = "Lỗi kết nối.";
  }
});

spinBtn.addEventListener('click', async () => {
  if (currentSpins <= 0) return;
  spinBtn.disabled = true;
  resultMessage.textContent = "";

  let r = Math.random() * 100;
  let selectedPrize = prizes.find(p => {
    r -= p.percent;
    return r < 0;
  }) || prizes[prizes.length - 1];

  const index = prizes.indexOf(selectedPrize);
  const baseDeg = 360 / prizes.length;
  const rotateDeg = 1800 + index * baseDeg + Math.random() * baseDeg;
  wheel.style.transform = `rotate(${rotateDeg}deg)`;

  try {
    const res = await fetch(`${SCRIPT_URL}?action=spin&username=${encodeURIComponent(usernameInput.value.trim())}`);
    const data = await res.json();
    if (data.success) {
      resultMessage.textContent = `Bạn trúng: ${selectedPrize.code}`;
      currentSpins = data.spins;
      spinInfo.textContent = currentSpins > 0 ? `Bạn còn ${currentSpins} lượt quay.` : "Bạn đã hết lượt quay.";
    } else {
      resultMessage.textContent = "Lỗi khi quay.";
    }
  } catch (err) {
    console.error(err);
    resultMessage.textContent = "Lỗi kết nối khi quay.";
  }

  setTimeout(() => {
    if (currentSpins > 0) {
      spinBtn.disabled = false;
    }
  }, 4500);
});
