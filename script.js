let cart = JSON.parse(localStorage.getItem("cart")) || [];
let lang = "th";
let selectedTable = localStorage.getItem("selectedTable") || "1";
const PROMPTPAY_ID = "0958268649";

// --- Dictionary (ใส่เมนูเหมือนเดิมได้เลย) ---
const dictionary = {
  th: {
    header: "สเต็กเด็กแนว",
    cartTitle: "ตะกร้าของฉัน",
    orderBtn: "ยืนยันออเดอร์",
    total: "รวมทั้งหมด",
    currency: "฿",
    menu: [
      { name: "สปาเก็ตตี้คาโบนาร่า", price: 79, img: "images/1.jpg" },
      { name: "สปาเก็ตตี้ซอสขี้เมาหมู", price: 69, img: "images/2.jpg" },
      { name: "สปาเก็ตตี้ซอสมะเขือเทศหมูสับ", price: 69, img: "images/3.jpg" },
      { name: "สปาเก็ตตี้ซอสมะเขือเทศไก่สับ", price: 69, img: "images/3.jpg" },
      { name: "ผักโขมอบชีส", price: 59, img: "images/4.jpg" },
      { name: "หมูแดดเดียว", price: 50, img: "images/5.jpg" },
      { name: "ซุปเห็ด", price: 49, img: "images/6.jpg" },
      { name: "ซุปผักโขม", price: 49, img: "images/7.jpg" },
      { name: "นักเก็ต", price: 45, img: "images/8.jpg" },
      { name: "เฟรนช์ฟรายส์", price: 39, img: "images/9.jpg" },
      { name: "ไก่ป๊อป", price: 45, img: "images/10.jpg" },
      { name: "ไก่ป๊อปสไปซี่", price: 45, img: "images/10.jpg" },
      { name: "ฟิชแอนด์ชิปส์", price: 69, img: "images/11.jpg" },
      { name: "ข้าวหน้าสเต็กไก่ย่าง", price: 59, img: "images/13.jpg" },
      { name: "ข้าวหน้าสเต็กหมูย่าง", price: 99, img: "images/14.jpg" },
      { name: "ข้าวหน้าสเต็กไก่ทอดกรอบ", price: 59, img: "images/15.jpg" },
      { name: "ข้าวหน้าสเต็กสันคอหมู", price: 169, img: "images/16.jpg" },
      { name: "ข้าวหน้าสเต็กโคขุน", price: 119, img: "images/17.jpg" },
      { name: "ข้าวหน้าสเต็กแซลมอน", price: 189, img: "images/18.jpg" },
      { name: "ข้าวหน้าปลาสเต็กทอดกรอบ", price: 59, img: "images/19.jpg" },
      { name: "ข้าวหน้าปลาซาบะญี่ปุ่นย่าง", price: 89, img: "images/20.jpg" },
      { name: "ข้าวหน้าสเต็กหมูบด", price: 79, img: "images/21.jpg" },
      { name: "ข้าวหน้าสเต็กเนื้อบด", price: 99, img: "images/22.jpg" },
      { name: "ข้าวหมูคั่วกลิ้ง", price: 49, img: "images/23.jpg" },
      { name: "สลัดสเต็กปลาทอด", price: 69, img: "images/24.jpg" },
      { name: "สลัดสเต็กอกไก่ย่าง", price: 69, img: "images/25.jpg" },
      { name: "สลัดสเต็กหมูย่าง", price: 99, img: "images/26.jpg" },
      { name: "สลัดผัก", price: 49, img: "images/27.jpg" },
      { name: "สเต็กเนื้อโคขุน", price: 109, img: "images/28.jpg" },
      { name: "ริปอายสเต็กเนื้อ", price: 119, img: "images/29.jpg" },
      { name: "ที-โบน สเต็กเนื้อ", price: 199, img: "images/30.jpg" },
      { name: "สเต็กปลาซาบะ", price: 79, img: "images/31.jpg" },
      { name: "สเต็กปลาทอด", price: 109, img: "images/32.jpg" },
      { name: "สเต็กปลาย่างน้ำจิ้มซีฟู้ด", price: 99, img: "images/33.jpg" },
      { name: "สเต็กปลาแซลมอน", price: 179, img: "images/34.jpg" },
      { name: "พอร์คชอพ", price: 109, img: "images/35.jpg" },
      { name: "พอร์คชอพซอสสไปซี่", price: 109, img: "images/36.jpg" },
      { name: "พอร์คชอพซอสบาร์บีคิว", price: 109, img: "images/36.jpg" },
      { name: "ซี่โคครงบาร์บีคิว", price: 169, img: "images/37.jpg" },
      { name: "สเต็กหมูบด", price: 69, img: "images/38.jpg" },
      { name: "สเต็กเนื้อบด", price: 89, img: "images/39.jpg" },
      { name: "เบอร์เกอร์หมู", price: 69, img: "images/40.jpg" },
      { name: "เบอร์เกอร์เนื้อ", price: 89, img: "images/41.jpg" },
      { name: "สเต็กไก่", price: 49, img: "images/42.jpg" },
      { name: "สะโพกไก่สไปซี่", price: 89, img: "images/43.jpg" },
      { name: "สเต็กไก่ซอสบาร์บีคิว", price: 59, img: "images/44.jpg" },
      { name: "สเต็กไก่ซอสสไปซี่", price: 59, img: "images/44.jpg" },
      { name: "สเต็กหมู", price: 89, img: "images/45.jpg" },
      { name: "สเต็กหมูซอสบาร์บีคิว", price: 89, img: "images/46.jpg" },
      { name: "สเต็กหมูซอสสไปซี่", price: 89, img: "images/46.jpg" },
      { name: "สเต็กหมูสไปซี่", price: 109, img: "images/47.jpg" },
      { name: "สเต็กสันคอหมู", price: 169, img: "images/48.jpg" },
      { name: "สเต็กสันคอหมูซอสบาร์บีคิว", price: 169, img: "images/49.jpg" },
      { name: "สเต็กสันคอหมูซอสสไปซี่", price: 169, img: "images/49.jpg" },
      { name: "ไก่ + ปลา + หมู", price: 219, img: "images/50.jpg" },
      { name: "ไก่ + ปลา + โคขุน", price: 229, img: "images/51.jpg" },
      {
        name: "ไก่ + โคขุน + พอร์คชอพ + ปลา",
        price: 299,
        img: "images/52.jpg",
      },
      { name: "สันคอ + ปลา", price: 249, img: "images/53.jpg" },
      { name: "พอร์คชอพ + โคขุน", price: 189, img: "images/54.jpg" },
      { name: "พอร์คชอพ + ทีโบน", price: 289, img: "images/55.jpg" },
      { name: "หมู + พอร์คชอพ + สันคอ", price: 339, img: "images/56.jpg" },
      { name: "แซลมอน + ทีโบน", price: 339, img: "images/57.jpg" },
      { name: "พอร์คชอพ + ทีโบน + แซลมอน", price: 419, img: "images/58.jpg" },
      { name: "โคขุน + ริบอาย + ทีโบน", price: 389, img: "images/59.jpg" },
      {
        name: "ไก่ + หมู + โคขุน + ปลา + แซลม่อน",
        price: 459,
        img: "images/60.jpg",
      },
      { name: "แซลมอน + พอร์คชอพ + ริบอาย", price: 349, img: "images/61.jpg" },
      {
        name: "ปลา + ไก่ + พอร์คชอพ + สันคอ + ริบอาย + ทีโบน",
        price: 599,
        img: "images/62.jpg",
      },
    ],
  },
  en: {
    header: "Dek Naew Steak",
    cartTitle: "My Cart",
    orderBtn: "Place Order",
    total: "Total",
    currency: "฿",
    menu: [],
  },
  zh: {
    header: "德克耐潮牛排",
    cartTitle: "购物车",
    orderBtn: "确认下单",
    total: "总计",
    currency: "฿",
    menu: [],
  },
};

// --- Init ---
function setLanguage(newLang) {
  lang = newLang;
  const dict = dictionary[lang];
  document.getElementById("tableNumberDisplay").innerText =
    "Table " + selectedTable;
  renderMenu();
  updateCartBar(); // อัปเดตแถบด้านล่าง
}

// --- Menu Rendering (Grid) ---
function renderMenu() {
  const menuGrid = document.getElementById("menuGrid");
  menuGrid.innerHTML = "";
  // Fallback to TH if menu is empty
  const menuList =
    dictionary[lang].menu.length > 0
      ? dictionary[lang].menu
      : dictionary["th"].menu;

  menuList.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "card";
    div.onclick = () => addToCart(index); // กดทั้งการ์ดเพื่อเพิ่ม
    div.innerHTML = `
        <img src="${item.img}" onerror="this.src='https://via.placeholder.com/150?text=No+Image'">
        <div class="card-body">
            <h3>${item.name}</h3>
            <div class="card-footer">
                <span class="price">${item.price} ฿</span>
                <button class="add-btn-icon">+</button>
            </div>
        </div>
    `;
    menuGrid.appendChild(div);
  });
}

// --- Cart Logic ---
function addToCart(index) {
  const existing = cart.find((i) => i.itemIndex === index);
  if (existing) existing.qty++;
  else cart.push({ itemIndex: index, qty: 1 });
  updateCartBar();

  // Animation เล็กน้อยให้รู้ว่ากดแล้ว (Optional)
  const floatBar = document.getElementById("floatingCartBar");
  floatBar.style.transform = "translateX(-50%) scale(1.05)";
  setTimeout(
    () => (floatBar.style.transform = "translateX(-50%) scale(1)"),
    150,
  );
}

function updateCartBar() {
  let count = 0;
  let total = 0;
  const menuList =
    dictionary[lang].menu.length > 0
      ? dictionary[lang].menu
      : dictionary["th"].menu;

  cart.forEach((item) => {
    const itemData = menuList[item.itemIndex];
    count += item.qty;
    total += itemData.price * item.qty;
  });

  document.getElementById("cartCountBadge").innerText = count;
  document.getElementById("floatingTotal").innerText = total.toLocaleString();

  // ถ้าไม่มีของ ซ่อนแถบ
  const bar = document.getElementById("floatingCartBar");
  bar.style.display = count > 0 ? "flex" : "none";

  localStorage.setItem("cart", JSON.stringify(cart));
}

// --- Modal Controls ---
function openCart() {
  renderCartModal();
  document.getElementById("cartModal").classList.add("open");
}

function closeCart() {
  document.getElementById("cartModal").classList.remove("open");
}

function renderCartModal() {
  const container = document.getElementById("cartItems");
  container.innerHTML = "";
  let total = 0;
  const menuList =
    dictionary[lang].menu.length > 0
      ? dictionary[lang].menu
      : dictionary["th"].menu;

  if (cart.length === 0) {
    container.innerHTML =
      "<p style='text-align:center;color:#999;margin-top:20px'>ไม่มีรายการสินค้า</p>";
    return;
  }

  cart.forEach((item, idx) => {
    const data = menuList[item.itemIndex];
    const itemTotal = data.price * item.qty;
    total += itemTotal;

    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
        <div>
            <div style="font-weight:500">${data.name}</div>
            <div style="color:var(--primary); font-size:0.9rem">${data.price} ฿</div>
        </div>
        <div class="qty-control">
            <button class="qty-btn" onclick="updateQty(${idx}, -1)">-</button>
            <span>${item.qty}</span>
            <button class="qty-btn" onclick="updateQty(${idx}, 1)">+</button>
        </div>
    `;
    container.appendChild(div);
  });

  document.getElementById("cartTotalModal").innerText = total.toLocaleString();
}

function updateQty(idx, delta) {
  cart[idx].qty += delta;
  if (cart[idx].qty <= 0) cart.splice(idx, 1);
  updateCartBar();
  renderCartModal(); // Re-render modal
  if (cart.length === 0) closeCart();
}

// --- Checkout & Receipt ---
function orderFood() {
  if (cart.length === 0) return;
  closeCart(); // ปิดตะกร้า

  // Show Receipt Modal
  const receiptModal = document.getElementById("receiptDiv");
  receiptModal.style.display = "flex";
  setTimeout(() => receiptModal.classList.add("open"), 10); // Trigger animation

  const container = document.getElementById("receiptItems");
  container.innerHTML = "";
  let total = 0;
  const menuList =
    dictionary[lang].menu.length > 0
      ? dictionary[lang].menu
      : dictionary["th"].menu;

  // Note
  const note = document.getElementById("orderNoteInput").value;
  const noteDisplay = document.getElementById("receiptNoteDisplay");
  if (note) {
    noteDisplay.style.display = "block";
    noteDisplay.innerText = "Note: " + note;
  } else {
    noteDisplay.style.display = "none";
  }

  cart.forEach((item) => {
    const data = menuList[item.itemIndex];
    const itemTotal = data.price * item.qty;
    total += itemTotal;

    const div = document.createElement("div");
    div.className = "receipt-summary-row";
    div.innerHTML = `
        <span style="text-align:left; flex:1">${data.name} x${item.qty}</span>
        <span>${itemTotal.toLocaleString()} ฿</span>
    `;
    container.appendChild(div);
  });

  document.getElementById("receiptTableNum").innerText = selectedTable;
  document.getElementById("grandTotal").innerText = total.toLocaleString();

  // QR Code
  const qrDiv = document.getElementById("qrcode");
  qrDiv.innerHTML = "";
  const payload = createPromptPayPayload(PROMPTPAY_ID, total);
  new QRCode(qrDiv, { text: payload, width: 160, height: 160 });
}

function backToPOS() {
  cart = [];
  document.getElementById("orderNoteInput").value = "";
  updateCartBar();
  document.getElementById("receiptDiv").classList.remove("open");
  setTimeout(
    () => (document.getElementById("receiptDiv").style.display = "none"),
    300,
  );
}

// --- PromptPay Helper (Same as before) ---
function createPromptPayPayload(id, amount) {
  let target = id.replace(/[^0-9]/g, "");
  if (target.startsWith("0")) target = target.substring(1);
  target = "0066" + target;

  const targetTag = "01" + String(target.length).padStart(2, "0") + target;
  const merchantInfo = "29370016A000000677010111" + targetTag;
  const amountTag = amount
    ? "54" +
      String(amount.toFixed(2).length).padStart(2, "0") +
      amount.toFixed(2)
    : "";
  const data =
    "0002010102" +
    (amount ? "12" : "11") +
    merchantInfo +
    "5802TH5303764" +
    amountTag +
    "6304";
  return data + crc16(data);
}
function crc16(data) {
  let crc = 0xffff;
  for (let i = 0; i < data.length; i++) {
    let x = (crc >> 8) ^ data.charCodeAt(i);
    x ^= x >> 4;
    crc = (crc << 8) ^ (x << 12) ^ (x << 5) ^ x;
    crc &= 0xffff;
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

// Start
window.onload = function () {
  setLanguage("th");
  updateCartBar();
};
