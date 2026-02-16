let cart = JSON.parse(localStorage.getItem("cart")) || [];
let lang = "th";
let selectedTable = localStorage.getItem("selectedTable") || "1";
const PROMPTPAY_ID = "0958268649";

// --- Lightweight UI messages (don't change main dictionary) ---
const smallMessages = {
  th: { selectSauceWarn: "กรุณาเลือกซอส", added: "เพิ่มลงตะกร้าแล้ว" },
  en: { selectSauceWarn: "Please select a sauce", added: "Added to cart" },
  zh: { selectSauceWarn: "请选择酱汁", added: "已加入购物车" },
};

// --- Toast notifications ---
function ensureToastContainer() {
  if (!document.getElementById("toastContainer")) {
    const c = document.createElement("div");
    c.id = "toastContainer";
    c.style.position = "fixed";
    c.style.left = "50%";
    c.style.bottom = "18px";
    c.style.transform = "translateX(-50%)";
    c.style.zIndex = 2000;
    document.body.appendChild(c);
  }
}

function showToast(text, timeout = 2200) {
  ensureToastContainer();
  const container = document.getElementById("toastContainer");
  const t = document.createElement("div");
  t.className = "toast";
  t.innerText = text;
  container.appendChild(t);
  setTimeout(() => {
    t.style.opacity = "0";
    setTimeout(() => container.removeChild(t), 400);
  }, timeout);
}

// --- ข้อมูลตัวเลือกซอส ---
const sauceMapping = {
  "Barbecue Sauce": { th: "บาร์บีคิว", en: "Barbecue Sauce", zh: "烧烤酱" },
  "Spicy Sauce": { th: "สไปซี่", en: "Spicy Sauce", zh: "辣酱" },
  "Seafood Dipping Sauce": {
    th: "ซีฟู้ด",
    en: "Seafood Dipping Sauce",
    zh: "海鲜蘸酱",
  },
  "Tonkatsu Sauce": { th: "ทงคัตซึ", en: "Tonkatsu Sauce", zh: "猪排酱" },
  blackpepper: { th: "พริกไทยดำ", en: "Black Pepper", zh: "黑胡椒" },
  teriyaki: { th: "เทอริยากิ", en: "Teriyaki", zh: "照烧酱" },
  jaew: { th: "แจ่ว", en: "Jaew Sauce", zh: "泰式辣酱" },
  none: { th: "ไม่เอาซอส", en: "No Sauce", zh: "不要酱汁" },
};

const sauceLabelText = {
  th: "เลือกซอส:",
  en: "Select Sauce:",
  zh: "选择酱汁:",
};

// รายชื่อเมนูที่ต้องมีตัวเลือกซอส (อิงตามชื่อภาษาอังกฤษ)
const sauceMenuKeys = [
  "Grilled Chicken Steak Rice Bowl",
  "Rice with Grilled Pork Steak",
  "Thai Premium Beef Steak",
  "Grilled Ribeye Beef Steak",
  "T-Bone Beef Steak",
  "Japanese Saba Steak",
  "Crispy Fried Fish Steak",
  "Salmon Steak",
  "Pork chop",
  "Chicken Steak",
  "Pork Steak",
  "Pork Blade Steak",
  "Pork Chop + Premium Beef",
  "Pork Chop + T-Bone Steak",
  "Salmon + T-Bone Steak",
];

// --- ข้อความระบบต่าง ๆ ---
const receiptText = {
  th: {
    receiptTitle: "ใบเสร็จ",
    tableNumber: "เลขโต๊ะ",
    total: "รวมสุทธิ",
    back: "กลับเมนู",
    orderSuccess: "สั่งอาหารเรียบร้อยแล้ว!",
  },
  en: {
    receiptTitle: "Receipt",
    tableNumber: "Table",
    total: "Total",
    back: "Back to Menu",
    orderSuccess: "Order placed successfully!",
  },
  zh: {
    receiptTitle: "收据",
    tableNumber: "桌号",
    total: "总计",
    back: "返回菜单",
    orderSuccess: "订餐成功！",
  },
};

const noteText = {
  th: {
    label: "หมายเหตุถึงครัว",
    placeholder: "เช่น ไม่ใส่ผัก, ไม่เอาน้ำจิ้ม, สุกมาก ฯลฯ",
  },
  en: {
    label: "Note to Kitchen",
    placeholder: "e.g. No vegetables, no sauce, well done, etc.",
  },
  zh: {
    label: "给厨房备注",
    placeholder: "例如：不要蔬菜，不要酱，熟一点 等等",
  },
};

const cartText = {
  th: {
    cartTitle: "ตะกร้าสินค้า",
    emptyCart: "ตะกร้าว่าง",
    total: "รวมทั้งหมด",
  },
  en: {
    cartTitle: "Shopping Cart",
    emptyCart: "Cart is empty",
    total: "Total",
  },
  zh: { cartTitle: "购物车", emptyCart: "购物车为空", total: "总计" },
};

// --- ข้อมูลเมนูอาหาร ---
const dictionary = {
  th: {
    header: "สเต็กเด็กแนว สาขาสนามฟุตบอลไพรมารี่ ปลวกแดง",
    cartTitle: "ตะกร้าสินค้า",
    orderBtn: "สั่งอาหาร",
    emptyCart: "ตะกร้าว่าง",
    checkoutBtn: "ไปหน้า Checkout",
    addBtn: "เพิ่ม",
    total: "รวมทั้งหมด",
    totalReceipt: "รวมสุทธิ",
    currency: "บาท",
    receipt: "ใบเสร็จ",
    table: "เลขโต๊ะ",
    back: "กลับเมนู",
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
    header: "Dek Naew Steak Primary Football Field Branch",
    cartTitle: "Shopping Cart",
    orderBtn: "Order",
    emptyCart: "Cart is empty",
    checkoutBtn: "Go to Checkout",
    addBtn: "Add",
    total: "Total",
    totalReceipt: "Net Total",
    currency: "Baht",
    receipt: "Receipt",
    table: "Table",
    back: "Back",
    menu: [
      { name: "Spaghetti Carbonara", price: 79, img: "images/1.jpg" },
      {
        name: "Spaghetti with Spicy Thai Basil Sauce Pork",
        price: 69,
        img: "images/2.jpg",
      },
      {
        name: "Spaghetti with Tomato Sauce and Minced Pork",
        price: 69,
        img: "images/3.jpg",
      },
      {
        name: "Spaghetti with Tomato Sauce and Minced Chicken",
        price: 69,
        img: "images/3.jpg",
      },
      { name: "Baked Spinach with Cheese", price: 59, img: "images/4.jpg" },
      { name: "Thai-Style Sun-Dried Pork", price: 50, img: "images/5.jpg" },
      { name: "Creamy Mushroom Soup", price: 49, img: "images/6.jpg" },
      { name: "Creamy Spinach Soup", price: 49, img: "images/7.jpg" },
      { name: "Chicken Nuggets", price: 45, img: "images/8.jpg" },
      { name: "French Fries", price: 39, img: "images/9.jpg" },
      { name: "Popcorn Chicken", price: 45, img: "images/10.jpg" },
      { name: "Spicy Popcorn Chicken", price: 45, img: "images/10.jpg" },
      { name: "Fish & Chips", price: 69, img: "images/11.jpg" },
      {
        name: "Grilled Chicken Steak Rice Bowl",
        price: 59,
        img: "images/13.jpg",
      },
      { name: "Rice with Grilled Pork Steak", price: 99, img: "images/14.jpg" },
      {
        name: "Rice with Crispy Fried Chicken Steak",
        price: 59,
        img: "images/15.jpg",
      },
      {
        name: "Rice with Grilled Pork Neck Steak",
        price: 169,
        img: "images/16.jpg",
      },
      {
        name: "Thai Premium Beef Steak Rice",
        price: 119,
        img: "images/17.jpg",
      },
      {
        name: "Rice with Grilled Salmon Steak",
        price: 189,
        img: "images/18.jpg",
      },
      {
        name: "Rice with Crispy Fried Fish Steak",
        price: 59,
        img: "images/19.jpg",
      },
      { name: "Japanese Grilled Saba Rice", price: 89, img: "images/20.jpg" },
      { name: "Rice with Pork Patty Steak", price: 79, img: "images/21.jpg" },
      {
        name: "Rice with Beef Hamburger Steak",
        price: 99,
        img: "images/22.jpg",
      },
      {
        name: "Southern Thai Spicy Pork Stir-Fry on Rice",
        price: 49,
        img: "images/23.jpg",
      },
      {
        name: "Salad with Crispy Fried Fish Steak",
        price: 69,
        img: "images/24.jpg",
      },
      {
        name: "Salad with Grilled Chicken Breast Steak",
        price: 69,
        img: "images/25.jpg",
      },
      {
        name: "Salad with Grilled Pork Steak",
        price: 99,
        img: "images/26.jpg",
      },
      { name: "Fresh Garden Salad", price: 49, img: "images/27.jpg" },
      { name: "Thai Premium Beef Steak", price: 109, img: "images/28.jpg" },
      { name: "Grilled Ribeye Beef Steak", price: 119, img: "images/29.jpg" },
      { name: "T-Bone Beef Steak", price: 199, img: "images/30.jpg" },
      { name: "Japanese Saba Steak", price: 79, img: "images/31.jpg" },
      { name: "Crispy Fried Fish Steak", price: 109, img: "images/32.jpg" },
      {
        name: "Grilled Fish Steak & Thai Spicy Dipping Sauce",
        price: 99,
        img: "images/33.jpg",
      },
      { name: "Salmon Steak", price: 179, img: "images/34.jpg" },
      { name: "Pork chop", price: 109, img: "images/35.jpg" },
      { name: "Spicy Pork Chop", price: 109, img: "images/36.jpg" },
      { name: "BBQ Pork Chop", price: 109, img: "images/36.jpg" },
      { name: "BBQ Ribs", price: 169, img: "images/37.jpg" },
      { name: "Minced Pork Steak", price: 69, img: "images/38.jpg" },
      { name: "Minced Beef Steak", price: 89, img: "images/39.jpg" },
      { name: "Pork Burger", price: 69, img: "images/40.jpg" },
      { name: "Beef Burger", price: 89, img: "images/41.jpg" },
      { name: "Chicken Steak", price: 49, img: "images/42.jpg" },
      { name: "Spicy Chicken Thigh", price: 89, img: "images/43.jpg" },
      { name: "BBQ Chicken Steak", price: 59, img: "images/44.jpg" },
      { name: "Spicy Chicken Steak", price: 59, img: "images/44.jpg" },
      { name: "Pork Steak", price: 89, img: "images/45.jpg" },
      { name: "Pork Steak BBQ Sauce", price: 89, img: "images/46.jpg" },
      { name: "Pork Steak Spicy Sauce", price: 89, img: "images/46.jpg" },
      { name: "Spicy Pork Steak", price: 109, img: "images/47.jpg" },
      { name: "Pork Blade Steak", price: 169, img: "images/48.jpg" },
      { name: "Pork Blade Steak BBQ Sauce", price: 169, img: "images/49.jpg" },
      {
        name: "Pork Blade Steak Spicy Sauce",
        price: 169,
        img: "images/49.jpg",
      },
      { name: "Chicken+Fish+Pork", price: 219, img: "images/50.jpg" },
      { name: "Chicken+Fish+Premium Beef", price: 229, img: "images/51.jpg" },
      {
        name: "Chicken + Premium Beef + Pork Chop + Fish",
        price: 299,
        img: "images/52.jpg",
      },
      { name: "Pork Blade + Fish", price: 249, img: "images/53.jpg" },
      { name: "Pork Chop + Premium Beef", price: 189, img: "images/54.jpg" },
      { name: "Pork Chop + T-Bone Steak", price: 289, img: "images/55.jpg" },
      {
        name: "Pork + Pork Chop + Pork Blade",
        price: 339,
        img: "images/56.jpg",
      },
      { name: "Salmon + T-Bone Steak", price: 339, img: "images/57.jpg" },
      {
        name: "Pork Chop + T-Bone Steak + Salmon",
        price: 419,
        img: "images/58.jpg",
      },
      {
        name: "Premium Beef + Ribeye + T-Bone Steak",
        price: 389,
        img: "images/59.jpg",
      },
      {
        name: "Chicken + Pork + Premium Beef + Fish + Salmon",
        price: 459,
        img: "images/60.jpg",
      },
      {
        name: "Salmon + Pork Chop + Ribeye Steak",
        price: 349,
        img: "images/61.jpg",
      },
      {
        name: "Fish + Chicken + Pork Chop + Pork Blade + Ribeye + T-Bone Steak",
        price: 599,
        img: "images/62.jpg",
      },
    ],
  },
  zh: {
    header: "德克耐潮牛排",
    cartTitle: "购物车",
    orderBtn: "点餐",
    emptyCart: "购物车为空",
    checkoutBtn: "去结账",
    addBtn: "加入",
    total: "总计",
    totalReceipt: "总计",
    currency: "泰铢",
    receipt: "收据",
    table: "桌号",
    back: "返回",
    menu: [
      { name: "卡邦尼意大利面", price: 79, img: "images/1.jpg" },
      { name: "泰式罗勒辣酱猪肉意大利面", price: 69, img: "images/2.jpg" },
      { name: "番茄酱猪肉末意大利面", price: 69, img: "images/3.jpg" },
      { name: "番茄酱鸡肉末意大利面", price: 69, img: "images/3.jpg" },
      { name: "芝士焗菠菜", price: 59, img: "images/4.jpg" },
      { name: "泰式风干猪肉", price: 50, img: "images/5.jpg" },
      { name: "奶油蘑菇汤", price: 49, img: "images/6.jpg" },
      { name: "奶油菠菜汤", price: 49, img: "images/7.jpg" },
      { name: "炸鸡块", price: 45, img: "images/8.jpg" },
      { name: "炸薯条", price: 39, img: "images/9.jpg" },
      { name: "爆米花鸡", price: 45, img: "images/10.jpg" },
      { name: "香辣爆米花鸡", price: 45, img: "images/10.jpg" },
      { name: "炸鱼薯条", price: 69, img: "images/11.jpg" },
      { name: "烤鸡排盖饭", price: 59, img: "images/13.jpg" },
      { name: "烤猪排盖饭", price: 99, img: "images/14.jpg" },
      { name: "炸鸡排盖饭", price: 59, img: "images/15.jpg" },
      { name: "猪颈肉盖饭", price: 169, img: "images/16.jpg" },
      { name: "优质牛排盖饭", price: 119, img: "images/17.jpg" },
      { name: "三文鱼排盖饭", price: 189, img: "images/18.jpg" },
      { name: "炸鱼排盖饭", price: 59, img: "images/19.jpg" },
      { name: "日式烤鲭鱼盖饭", price: 89, img: "images/20.jpg" },
      { name: "猪肉饼盖饭", price: 79, img: "images/21.jpg" },
      { name: "牛肉饼盖饭", price: 99, img: "images/22.jpg" },
      { name: "泰南香辣猪肉炒饭", price: 49, img: "images/23.jpg" },
      { name: "炸鱼排沙拉", price: 69, img: "images/24.jpg" },
      { name: "烤鸡胸肉排沙拉", price: 69, img: "images/25.jpg" },
      { name: "烤猪排沙拉", price: 99, img: "images/26.jpg" },
      { name: "蔬菜沙拉", price: 49, img: "images/27.jpg" },
      { name: "优质牛排", price: 109, img: "images/28.jpg" },
      { name: "肉眼牛排", price: 119, img: "images/29.jpg" },
      { name: "T骨牛排", price: 199, img: "images/30.jpg" },
      { name: "鲭鱼排", price: 79, img: "images/31.jpg" },
      { name: "香脆炸鱼排", price: 109, img: "images/32.jpg" },
      { name: "烤鱼排配泰式海鲜蘸酱", price: 99, img: "images/33.jpg" },
      { name: "三文鱼排", price: 179, img: "images/34.jpg" },
      { name: "猪排", price: 109, img: "images/35.jpg" },
      { name: "香辣猪排", price: 109, img: "images/36.jpg" },
      { name: "烧烤猪排", price: 109, img: "images/36.jpg" },
      { name: "烧烤排骨", price: 169, img: "images/37.jpg" },
      { name: "猪肉汉堡排", price: 69, img: "images/38.jpg" },
      { name: "牛肉汉堡排", price: 89, img: "images/39.jpg" },
      { name: "猪肉汉堡", price: 69, img: "images/40.jpg" },
      { name: "牛肉汉堡", price: 89, img: "images/41.jpg" },
      { name: "鸡排", price: 49, img: "images/42.jpg" },
      { name: "香辣鸡腿", price: 89, img: "images/43.jpg" },
      { name: "烧烤酱鸡排", price: 59, img: "images/44.jpg" },
      { name: "香辣鸡排", price: 59, img: "images/44.jpg" },
      { name: "猪排", price: 89, img: "images/45.jpg" },
      { name: "烧烤酱猪排", price: 89, img: "images/46.jpg" },
      { name: "香辣猪排", price: 89, img: "images/46.jpg" },
      { name: "香辣酱猪排", price: 109, img: "images/47.jpg" },
      { name: "猪颈肉排", price: 169, img: "images/48.jpg" },
      { name: "烧烤酱猪颈肉排", price: 169, img: "images/49.jpg" },
      { name: "香辣猪颈肉排", price: 169, img: "images/49.jpg" },
      { name: "鸡 + 鱼 + 猪肉", price: 219, img: "images/50.jpg" },
      { name: "鸡 + 鱼 + 优质牛肉", price: 229, img: "images/51.jpg" },
      { name: "鸡 + 优质牛肉 + 猪排 + 鱼", price: 299, img: "images/52.jpg" },
      { name: "猪颈肉 + 鱼", price: 249, img: "images/53.jpg" },
      { name: "猪排 + 优质牛肉", price: 189, img: "images/54.jpg" },
      { name: "猪排 + T骨牛排", price: 289, img: "images/55.jpg" },
      { name: "猪肉 + 猪排 + 猪颈肉", price: 339, img: "images/56.jpg" },
      { name: "三文鱼 + T骨牛排", price: 339, img: "images/57.jpg" },
      { name: "猪排 + T骨牛排 + 三文鱼", price: 419, img: "images/58.jpg" },
      {
        name: "优质牛肉 + 肋眼牛排 + T骨牛排",
        price: 389,
        img: "images/59.jpg",
      },
      {
        name: "鸡 + 猪肉 + 优质牛肉 + 鱼 + 三文鱼",
        price: 459,
        img: "images/60.jpg",
      },
      { name: "三文鱼 + 猪排 + 肋眼牛排", price: 349, img: "images/61.jpg" },
      {
        name: "鱼 + 鸡肉 + 猪排 + 猪颈肉 + 肋眼牛排 + T骨牛排",
        price: 599,
        img: "images/62.jpg",
      },
    ],
  },
};

// --- ฟังก์ชันจัดการภาษา ---
function setLanguage(newLang) {
  lang = newLang;
  const dict = dictionary[lang];

  document.querySelector("header h1").innerText =
    dict.header + " - " + dict.table + " " + selectedTable;
  document.querySelector("#cartDiv h2").innerText = dict.cartTitle;
  document.getElementById("orderBtn").innerText = dict.orderBtn;
  document.getElementById("totalCartLabel").innerText = dict.total;
  document.getElementById("currencyCartLabel").innerText = dict.currency;
  document.getElementById("orderNoteLabel").innerText = noteText[lang].label;
  document.getElementById("orderNoteInput").placeholder =
    noteText[lang].placeholder;

  document.getElementById("receiptTitleText").innerText = dict.receipt;
  document.getElementById("tableLabelText").innerText = dict.table;
  document.getElementById("totalReceiptLabel").innerText = dict.totalReceipt;
  document.getElementById("currencyReceiptLabel").innerText = dict.currency;
  document.getElementById("backBtn").innerText = dict.back;

  renderMenu();
  renderCart();
}

function renderMenu() {
  const menuDiv = document.querySelector(".menu");
  menuDiv.innerHTML = "";
  const menuList =
    dictionary[lang].menu.length > 0
      ? dictionary[lang].menu
      : dictionary["th"].menu;

  // ใช้รายชื่อเมนูภาษาอังกฤษเพื่อเช็คว่าต้องมีซอสไหม
  const enMenuList = dictionary["en"].menu;

  menuList.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "card";

    // เช็คว่าเมนูนี้ (อิงชื่ออังกฤษ) ต้องมีตัวเลือกซอสหรือไม่
    const enName = enMenuList[index].name;
    let sauceHTML = "";

    if (sauceMenuKeys.includes(enName)) {
      sauceHTML = `<div class="sauce-options"><small>${sauceLabelText[lang]}</small><br>`;
      Object.keys(sauceMapping).forEach((key) => {
        sauceHTML += `
                <label>
                    <input type="radio" name="sauce-${index}" value="${key}"> 
                    ${sauceMapping[key][lang]}
                </label>
            `;
      });
      sauceHTML += `</div>`;
    }

    card.innerHTML = `
        <img src="${item.img}" onerror="this.src='https://via.placeholder.com/150?text=No+Image'">
        <div class="card-body">
            <div>
                <h3>${item.name}</h3>
                <p>${item.price} ฿</p>
                ${sauceHTML}
            </div>
            <button class="add-btn" onclick="addToCart(${index}, this)">${dictionary[lang].addBtn}</button>
        </div>
    `;
    menuDiv.appendChild(card);
  });
}

function addToCart(index, btnElement) {
  const enMenuList = dictionary["en"].menu;
  const enName = enMenuList[index].name;
  let selectedSauce = null;

  // ถ้าเป็นเมนูที่ต้องเลือกซอส
  if (sauceMenuKeys.includes(enName)) {
    // หา Radio ที่ถูกติ๊กใน Card นั้น
    const card = btnElement.closest(".card");
    const checkedRadio = card.querySelector(
      `input[name="sauce-${index}"]:checked`,
    );
    if (!checkedRadio) {
      showToast(smallMessages[lang].selectSauceWarn);
      return;
    }
    selectedSauce = checkedRadio.value;
  }

  // หาว่ามีสินค้านี้ + ซอสนี้ ในตะกร้าแล้วหรือยัง
  const existing = cart.find(
    (i) => i.itemIndex === index && i.sauce === selectedSauce,
  );

  if (existing) {
    existing.qty++;
    showToast(smallMessages[lang].added);
  } else {
    // เพิ่มสินค้าใหม่พร้อมซอส (ถ้ามี)
    cart.push({ itemIndex: index, qty: 1, sauce: selectedSauce });
    showToast(smallMessages[lang].added);
  }
  renderCart();
}

function changeQty(cartIdx, delta) {
  cart[cartIdx].qty += delta;
  if (cart[cartIdx].qty <= 0) cart.splice(cartIdx, 1);
  renderCart();
}

function renderCart() {
  const cartItems = document.getElementById("cartItems");
  cartItems.innerHTML = "";
  let total = 0;
  const currentMenu =
    dictionary[lang].menu.length > 0
      ? dictionary[lang].menu
      : dictionary["th"].menu;

  if (cart.length === 0) {
    cartItems.innerHTML = `<div style="text-align:center; color:#999; margin-top:20px;">${dictionary[lang].emptyCart}</div>`;
    menuList.forEach((item, index) => {
      const card = document.createElement("div");
      card.className = "card";

      // เช็คว่าเมนูนี้ (อิงชื่ออังกฤษ) ต้องมีตัวเลือกซอสหรือไม่
      const enName = enMenuList[index].name;
      let sauceHTML = "";

      if (sauceMenuKeys.includes(enName)) {
        sauceHTML = `<div class="sauce-options"><small>${sauceLabelText[lang]}</small><div class="sauce-list">`;
        Object.keys(sauceMapping).forEach((key) => {
          const safeKey = key.replace(/[^a-z0-9_-]/gi, "_");
          const id = `sauce-${index}-${safeKey}`;
          sauceHTML += `
            <input type="radio" id="${id}" name="sauce-${index}" value="${key}">
            <label for="${id}">${sauceMapping[key][lang]}</label>
        `;
        });
        sauceHTML += `</div></div>`;
      }

      card.innerHTML = `
        <img src="${item.img}" onerror="this.src='https://via.placeholder.com/150?text=No+Image'">
        <div class="card-body">
            <div>
                <h3>${item.name}</h3>
                <p>${item.price} ฿</p>
                ${sauceHTML}
            </div>
            <button class="add-btn" onclick="addToCart(${index}, this)">${dictionary[lang].addBtn}</button>
        </div>
    `;
      menuDiv.appendChild(card);
    });
    cart.forEach((item, cartIdx) => {
      const itemData = currentMenu[item.itemIndex];
      const itemTotal = itemData.price * item.qty;
      total += itemTotal;

      // แสดงชื่อซอสต่อท้าย (ถ้ามี)
      let sauceDisplay = "";
      if (item.sauce) {
        sauceDisplay = ` <br><small style="color: #ff5722;">(${sauceMapping[item.sauce][lang]})</small>`;
      }

      const div = document.createElement("div");
      div.className = "cart-item";
      div.innerHTML = `
            <div class="item-info">
                <span class="item-name">${itemData.name} ${sauceDisplay}</span>
                <div class="qty-controls">
                    <button class="qty-btn" onclick="changeQty(${cartIdx}, -1)">-</button>
                    <span>${item.qty}</span>
                    <button class="qty-btn" onclick="changeQty(${cartIdx}, 1)">+</button>
                </div>
            </div>
            <div class="item-price-group">
                <span>${itemTotal.toLocaleString()}</span>
                <button class="remove-btn" onclick="removeItem(${cartIdx})">&times;</button>
            </div>`;
      cartItems.appendChild(div);
    });
  }
  document.getElementById("total").innerText = total.toLocaleString();
  localStorage.setItem("cart", JSON.stringify(cart));
}

function removeItem(index) {
  cart.splice(index, 1);
  renderCart();
}

// --- PromptPay (Mobile Only) ---
function createPromptPayPayload(id, amount) {
  let target = id.replace(/[^0-9]/g, "");
  if (target.startsWith("0")) target = target.substring(1);
  target = "0066" + target;

  const targetTag = "01" + String(target.length).padStart(2, "0") + target;
  const merchantInfoVal = "0016A000000677010111" + targetTag;
  const merchantInfo =
    "29" + String(merchantInfoVal.length).padStart(2, "0") + merchantInfoVal;
  const country = "5802TH";
  const currency = "5303764";

  let amountTag = "";
  if (amount) {
    const amtStr = parseFloat(amount).toFixed(2);
    amountTag = "54" + String(amtStr.length).padStart(2, "0") + amtStr;
  }

  const poi = amount ? "010212" : "010211";
  const data =
    "000201" + poi + merchantInfo + country + currency + amountTag + "6304";
  const crc = crc16(data);
  return data + crc;
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

// --- Order & Receipt ---
function orderFood() {
  if (cart.length === 0) return;
  document.getElementById("posContainer").style.display = "none";
  document.getElementById("receiptDiv").style.display = "block";

  const receiptItemsDiv = document.getElementById("receiptItems");
  receiptItemsDiv.innerHTML = "";
  let subtotal = 0;
  const currentMenu =
    dictionary[lang].menu.length > 0
      ? dictionary[lang].menu
      : dictionary["th"].menu;

  cart.forEach((item) => {
    const itemData = currentMenu[item.itemIndex];
    const itemTotal = itemData.price * item.qty;
    subtotal += itemTotal;

    // แสดงชื่อซอสในใบเสร็จ
    let sauceDisplay = "";
    if (item.sauce) {
      sauceDisplay = ` <br><small>(${sauceMapping[item.sauce][lang]})</small>`;
    }

    const div = document.createElement("div");
    div.className = "receipt-item";
    div.innerHTML = `
        <span style="text-align:left;">${itemData.name} ${sauceDisplay} <br><small style="color:#888;">x${item.qty}</small></span> 
        <span>${itemTotal.toLocaleString()}</span>`;
    receiptItemsDiv.appendChild(div);
  });

  const noteText = document.getElementById("orderNoteInput").value;
  const noteDiv = document.getElementById("receiptNoteDisplay");
  if (noteText.trim() !== "") {
    noteDiv.style.display = "block";
    noteDiv.innerHTML = `<strong>Note:</strong> ${noteText}`;
  } else {
    noteDiv.style.display = "none";
  }

  document.getElementById("tableNumber").innerText = selectedTable;
  document.getElementById("grandTotal").innerText = subtotal.toLocaleString();
  generateQRCode(subtotal);
}

function generateQRCode(total) {
  const qrcodeDiv = document.getElementById("qrcode");
  qrcodeDiv.innerHTML = "";
  const qrPayload = createPromptPayPayload(PROMPTPAY_ID, total);

  if (typeof QRCode !== "undefined") {
    QRCode.toCanvas(
      document.createElement("canvas"),
      qrPayload,
      { width: 180, margin: 2 },
      function (error, canvas) {
        if (!error) qrcodeDiv.appendChild(canvas);
      },
    );
  }
}

function backToPOS() {
  cart = [];
  document.getElementById("orderNoteInput").value = "";
  renderCart();
  document.getElementById("receiptDiv").style.display = "none";
  document.getElementById("posContainer").style.display = "flex";
}

window.onload = function () {
  setLanguage("th");
};

// Global error handlers to help debug runtime issues on mobile devices
window.addEventListener("error", function (e) {
  try {
    const msg = e && e.message ? e.message : String(e);
    showToast("Error: " + msg, 4000);
  } catch (err) {
    console.error(err);
  }
});

window.addEventListener("unhandledrejection", function (e) {
  try {
    const reason = e.reason && e.reason.message ? e.reason.message : e.reason;
    showToast("Promise: " + reason, 4000);
  } catch (err) {
    console.error(err);
  }
});
