const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbysFt9dwjxmia_yZFvdIHPQod273ZEyxC5Rbc2F3h17jCDvw0Umr9EgBtblNRvfX5ueTA/exec";  // Thay bằng URL Apps Script

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
    alert("Vui lòng nhập mã nhân sự!");
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
      spinInfo.textContent = "Không tìm thấy mã nhân sự hoặc lỗi server.";
      spinBtn.disabled = true;
    }
  } catch (err) {
    console.error(err);
    spinInfo.textContent = "Lỗi kết nối server.";
  }
});

spinBtn.addEventListener('click', async () => {
  if (currentSpins <= 0) return;

  spinBtn.disabled = true;

  const rotateDeg = 1800 + Math.random() * 360;
  wheel.style.transform = `rotate(${rotateDeg}deg)`;

  try {
    const res = await fetch(`${SCRIPT_URL}?action=spin&username=${encodeURIComponent(usernameInput.value.trim())}`);
    const data = await res.json();

    setTimeout(() => {
      if (data.success) {
        currentSpins = data.spins;
        spinInfo.textContent = currentSpins > 0 ? `Bạn còn ${currentSpins} lượt quay.` : "Bạn đã hết lượt quay.";
        resultMessage.textContent = `Bạn trúng: ${data.prize}`;
      } else {
        resultMessage.textContent = "Lỗi khi quay.";
      }
    }, 4000);
  } catch (err) {
    console.error(err);
    resultMessage.textContent = "Lỗi kết nối.";
  } finally {
    setTimeout(() => {
      if (currentSpins > 0) {
        spinBtn.disabled = false;
      }
    }, 4500);
  }
});
