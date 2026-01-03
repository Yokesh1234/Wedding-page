import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, push, set } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// Your Firebase config here
const firebaseConfig = {
  // apiKey: "...",
  // databaseURL: "...",
};
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// --- Form Submit ---
const form = document.getElementById('rsvpForm');
form.addEventListener('submit', e => {
  e.preventDefault(); // stop page refresh

  const formData = {
    name: form.name.value,
    wish: form.wish.value
  };

  const newRef = push(ref(db, 'weddingRSVP'));
  set(newRef, formData)
    .then(() => {
      form.reset();
      document.getElementById('successPopup').style.display = 'block';
      startConfetti();
    })
    .catch(err => alert('Error: ' + err.message));
});

function closePopup() {
  document.getElementById('successPopup').style.display = 'none';
  stopConfetti();
}

// ---------- Confetti ----------
const canvas = document.getElementById('confettiCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let confetti = [];
function randomColor() {
  const colors = ['#FF6EC4', '#7873F5', '#FFD700', '#FF69B4', '#00CED1', '#ADFF2F'];
  return colors[Math.floor(Math.random() * colors.length)];
}

function startConfetti() {
  confetti = Array.from({length:200}, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height - canvas.height,
    w: 8,
    h: 8,
    color: randomColor(),
    speed: Math.random() * 3 + 2,
    tilt: Math.random() * 10 - 5
  }));
  animateConfetti();
}

function animateConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  confetti.forEach(c => {
    ctx.fillStyle = c.color;
    ctx.fillRect(c.x, c.y, c.w, c.h);
    c.y += c.speed;
    c.x += Math.sin(c.tilt);
    if (c.y > canvas.height) {
      c.y = -10;
      c.x = Math.random() * canvas.width;
    }
  });
  if (document.getElementById('successPopup').style.display === 'block') {
    requestAnimationFrame(animateConfetti);
  }
}

function stopConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
