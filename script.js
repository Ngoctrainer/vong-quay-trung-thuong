const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzhCDR-xz0xc64Xcr1CgeOGdZ4g3bztzd83tnqnE-kaZcdyseT_GNARTyI5bbpeloOrmA/exec"; // Thay bằng link Apps Script của bạn

// Gọi khi vòng quay được tạo ra, hoặc ngay sau khi DOM load
const prizes = [
  { label: 'Voucher 1.000.000đ' },
  { label: 'Voucher 500.000đ' },
  { label: 'Voucher 300.000đ' },
  { label: 'Voucher 200.000đ' },
  { label: 'Voucher 100.000đ' },
  { label: 'Voucher 50.000đ' },
  { label: 'Voucher 20.000đ' },
  { label: 'Voucher 10.000đ' }
];

const baseDeg = 360 / prizes.length;
const wheel = document.getElementById('wheel');

prizes.forEach((p, i) => {
  const label = document.createElement('div');
  label.className = 'label';
  label.innerText = p.label;
  label.style.transform = `rotate(${i * baseDeg + baseDeg / 2}deg) translate(100px) rotate(-${i * baseDeg + baseDeg / 2}deg)`;
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
