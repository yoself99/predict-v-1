let model;
let imageElement = document.getElementById('imagePreview');
let resultElement = document.getElementById('result');
let predictionsElement = document.getElementById('predictions');

// Mapping คำทำนายจากภาษาอังกฤษเป็นภาษาไทย
const translationMap = {
  "tiger": "เสือ",
  "lion": "สิงโต",
  "elephant": "ช้าง",
  "dog": "สุนัข",
  "cat": "แมว",
  "bird": "นก",
  "horse": "ม้า",
  "fish": "ปลา",
  "bear": "หมี",
  "monkey": "ลิง",
  // เพิ่มคำแปลเพิ่มเติมตามต้องการ
};

// แปลงคำทำนายเป็นภาษาไทย
function translateToThai(className) {
  for (const [key, value] of Object.entries(translationMap)) {
    if (className.toLowerCase().includes(key)) {
      return value;
    }
  }
  return className; // หากไม่พบคำแปล ให้คืนค่าภาษาอังกฤษ
}

// Load the MobileNet model
async function loadModel() {
  try {
    model = await mobilenet.load();
    console.log('MobileNet model loaded');
  } catch (error) {
    console.error('Error loading model:', error);
    alert('เกิดข้อผิดพลาดในการโหลดโมเดล กรุณาลองใหม่อีกครั้ง');
  }
}

// Preview the selected image
document.getElementById('imageInput').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // ตรวจสอบว่าไฟล์เป็นรูปภาพหรือไม่
  if (!file.type.startsWith('image/')) {
    alert('กรุณาอัปโหลดไฟล์รูปภาพ');
    return;
  }

  const reader = new FileReader();
  reader.onload = (event) => {
    imageElement.src = event.target.result;
    resultElement.innerText = 'พร้อมทำนาย!';
    predictionsElement.innerHTML = '';
  };
  reader.readAsDataURL(file);
});

// ทำนาย
async function predict() {
  if (!model) {
    alert('โมเดลยังไม่พร้อม กรุณารอสักครู่');
    return;
  }

  if (!imageElement.src || imageElement.src === '') {
    alert('กรุณาอัปโหลดรูปภาพก่อน');
    return;
  }

  const predictions = await model.classify(imageElement);
  displayPredictions(predictions);
}

// แสดงผลลัพธ์
function displayPredictions(predictions) {
  const topPrediction = predictions[0];
  const translatedClass = translateToThai(topPrediction.className);

  resultElement.innerText = `ผลลัพธ์: ${translatedClass} (ความมั่นใจ ${Math.round(topPrediction.probability * 100)}%)`;

  predictionsElement.innerHTML = `
    <h3>3 อันดับแรก:</h3>
    <ul>
      ${predictions.slice(0, 3).map(pred => `
        <li>${translateToThai(pred.className)} - ${Math.round(pred.probability * 100)}%</li>
      `).join('')}
    </ul>
  `;
}

// รีเซ็ต
function reset() {
  imageElement.src = '';
  document.getElementById('imageInput').value = '';
  resultElement.innerText = 'ผลลัพธ์จะแสดงที่นี่';
  predictionsElement.innerHTML = '';
}

// โหลดโมเดลเมื่อหน้าเว็บโหลดเสร็จ
loadModel();