/* ================================================
   JYOTSHNA BIRTHDAY WEBSITE — script.js
   ================================================ */

'use strict';

/* ---- Cursor ---- */
const cursor = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursor-trail');
let mouseX = 0, mouseY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
  setTimeout(() => {
    cursorTrail.style.left = mouseX + 'px';
    cursorTrail.style.top  = mouseY + 'px';
  }, 80);
  spawnSparkle(e.clientX, e.clientY);
});

/* ---- Sparkle on mouse move ---- */
let sparkleTimer = 0;
function spawnSparkle(x, y) {
  if (Date.now() - sparkleTimer < 120) return;
  sparkleTimer = Date.now();
  const s = document.createElement('div');
  s.className = 'sparkle';
  s.textContent = ['✨','⭐','💫','🌟','✦'][Math.floor(Math.random()*5)];
  const tx = (Math.random() - 0.5) * 80;
  const ty = (Math.random() - 0.5) * 80 - 40;
  s.style.cssText = `left:${x}px;top:${y}px;--tx:${tx}px;--ty:${ty}px;`;
  document.body.appendChild(s);
  setTimeout(() => s.remove(), 800);
}

/* ================================================
   BACKGROUND CANVAS
   ================================================ */
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Particles
const particles = [];
const PARTICLE_COUNT = 80;

class Particle {
  constructor() { this.reset(true); }
  reset(init = false) {
    this.x = Math.random() * canvas.width;
    this.y = init ? Math.random() * canvas.height : canvas.height + 20;
    this.size = Math.random() * 3 + 1;
    this.speedY = -(Math.random() * 0.8 + 0.2);
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.7 + 0.3;
    this.color = ['#ffd700','#f72585','#7b2fbe','#ff85a1','#ffe566'][Math.floor(Math.random()*5)];
    this.type = Math.random() < 0.3 ? 'star' : Math.random() < 0.5 ? 'heart' : 'dot';
    this.angle = Math.random() * Math.PI * 2;
    this.angleSpeed = (Math.random() - 0.5) * 0.03;
    this.twinkle = Math.random() * Math.PI * 2;
  }
  update() {
    this.y += this.speedY; this.x += this.speedX;
    this.angle += this.angleSpeed;
    this.twinkle += 0.05;
    this.opacity = 0.4 + Math.sin(this.twinkle) * 0.3;
    if (this.y < -20) this.reset();
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    if (this.type === 'star') {
      drawStar(ctx, 0, 0, this.size * 2, this.size, 5);
    } else if (this.type === 'heart') {
      drawHeart(ctx, 0, 0, this.size * 1.5);
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

function drawStar(ctx, cx, cy, r, ir, pts) {
  ctx.beginPath();
  for (let i = 0; i < pts * 2; i++) {
    const rad = i % 2 === 0 ? r : ir;
    const angle = (Math.PI / pts) * i - Math.PI / 2;
    ctx[i === 0 ? 'moveTo' : 'lineTo'](cx + rad * Math.cos(angle), cy + rad * Math.sin(angle));
  }
  ctx.closePath(); ctx.fill();
}

function drawHeart(ctx, x, y, size) {
  ctx.beginPath();
  ctx.moveTo(x, y + size * 0.3);
  ctx.bezierCurveTo(x, y, x - size, y, x - size, y + size * 0.3);
  ctx.bezierCurveTo(x - size, y + size * 0.65, x, y + size, x, y + size * 1.35);
  ctx.bezierCurveTo(x, y + size, x + size, y + size * 0.65, x + size, y + size * 0.3);
  ctx.bezierCurveTo(x + size, y, x, y, x, y + size * 0.3);
  ctx.fill();
}

for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

// Balloons
const balloons = [];
const BALLOON_EMOJIS = ['🎈','🎀','🎊','🎉','💜','💛','💗'];

class Balloon {
  constructor() { this.reset(true); }
  reset(init = false) {
    this.x = Math.random() * canvas.width;
    this.y = init ? Math.random() * canvas.height : canvas.height + 60;
    this.size = Math.random() * 20 + 20;
    this.speedY = -(Math.random() * 0.4 + 0.15);
    this.wobble = Math.random() * Math.PI * 2;
    this.wobbleSpeed = Math.random() * 0.02 + 0.01;
    this.emoji = BALLOON_EMOJIS[Math.floor(Math.random() * BALLOON_EMOJIS.length)];
    this.opacity = Math.random() * 0.6 + 0.3;
  }
  update() {
    this.y += this.speedY;
    this.wobble += this.wobbleSpeed;
    this.x += Math.sin(this.wobble) * 0.6;
    if (this.y < -60) this.reset();
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.font = `${this.size}px serif`;
    ctx.textAlign = 'center';
    ctx.fillText(this.emoji, this.x, this.y);
    ctx.restore();
  }
}

for (let i = 0; i < 12; i++) balloons.push(new Balloon());

// Light rays
function drawLightRays() {
  const cx = canvas.width * 0.5, cy = canvas.height * 0.3;
  for (let i = 0; i < 8; i++) {
    const angle = (Math.PI * 2 / 8) * i + Date.now() * 0.0001;
    const grad = ctx.createLinearGradient(cx, cy, cx + Math.cos(angle) * canvas.width, cy + Math.sin(angle) * canvas.height);
    grad.addColorStop(0, 'rgba(255,215,0,0.06)');
    grad.addColorStop(1, 'rgba(255,215,0,0)');
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(angle - 0.05) * canvas.width, cy + Math.sin(angle - 0.05) * canvas.height);
    ctx.lineTo(cx + Math.cos(angle + 0.05) * canvas.width, cy + Math.sin(angle + 0.05) * canvas.height);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();
  }
}

function animateBG() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawLightRays();
  particles.forEach(p => { p.update(); p.draw(); });
  balloons.forEach(b => { b.update(); b.draw(); });
  requestAnimationFrame(animateBG);
}
animateBG();

/* ================================================
   LOADER
   ================================================ */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    const main = document.getElementById('mainContent');
    loader.style.transition = 'opacity 0.8s ease';
    loader.style.opacity = '0';
    setTimeout(() => {
      loader.style.display = 'none';
      main.classList.add('visible');
      initCountdown();
      initWishes();
      tryAutoplay();
    }, 800);
  }, 2800);
});

/* ================================================
   MUSIC
   ================================================ */
const audio = document.getElementById('bgAudio');
const musicPlayer = document.getElementById('musicPlayer');
const musicLabel = document.querySelector('.music-label');

function tryAutoplay() {
  if (!audio) return;
  audio.volume = 0.35;
  const p = audio.play();
  if (p !== undefined) {
    p.then(() => {
      musicPlayer.classList.add('music-playing');
      musicPlayer.classList.remove('music-paused');
      musicLabel.textContent = 'Now Playing ♪';
    }).catch(() => {
      musicLabel.textContent = 'Click to Play ♪';
      musicPlayer.classList.add('music-paused');
    });
  }
}

let isPlaying = false;
musicPlayer.addEventListener('click', () => {
  if (audio.paused) {
    audio.play();
    musicPlayer.classList.add('music-playing');
    musicPlayer.classList.remove('music-paused');
    musicLabel.textContent = 'Now Playing ♪';
    isPlaying = true;
  } else {
    audio.pause();
    musicPlayer.classList.remove('music-playing');
    musicPlayer.classList.add('music-paused');
    musicLabel.textContent = 'Click to Play ♪';
    isPlaying = false;
  }
});

/* ================================================
   SCROLL REVEAL
   ================================================ */
const reveals = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
}, { threshold: 0.15 });
reveals.forEach(el => revealObs.observe(el));

/* ================================================
   GALLERY LIGHTBOX
   ================================================ */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');

document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    lightboxImg.src = item.querySelector('img').src;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}
lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

/* ================================================
   BIRTHDAY CAKE
   ================================================ */
let cakeCut = false;
const cakeBtn = document.getElementById('cakeBtn');
const cakeMsg = document.getElementById('cakeMsg');
const cakeSvg = document.getElementById('cakeSvg');

cakeBtn.addEventListener('click', () => {
  if (cakeCut) return;
  cakeCut = true;
  cakeBtn.disabled = true;
  // Blow out candles
  blowCandles();
  // Show message
  setTimeout(() => {
    cakeMsg.textContent = '🎂 Happy Birthday Jyotshna! 🎂';
    cakeMsg.style.opacity = '1';
    launchBigConfetti(120);
    playApplause();
  }, 800);
});

function blowCandles() {
  const flames = cakeSvg.querySelectorAll('.candle-flame');
  flames.forEach((f, i) => {
    setTimeout(() => {
      f.style.transition = 'opacity 0.3s ease';
      f.style.opacity = '0';
    }, i * 200);
  });
}

function playApplause() {
  // Web Audio API simple clap sound
  try {
    const ac = new AudioContext();
    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        const noise = ac.createBuffer(1, ac.sampleRate * 0.15, ac.sampleRate);
        const data = noise.getChannelData(0);
        for (let j = 0; j < data.length; j++) data[j] = (Math.random() * 2 - 1) * (1 - j / data.length);
        const src = ac.createBufferSource();
        src.buffer = noise;
        const gain = ac.createGain();
        gain.gain.value = 0.3;
        src.connect(gain); gain.connect(ac.destination);
        src.start();
      }, i * 120);
    }
  } catch(e) {}
}

/* ================================================
   GIFTS
   ================================================ */
const giftData = [
  { emoji: '🌸', name: 'Flowers', msg: 'Beautiful flowers, just like you! 🌺', particles: ['🌸','🌷','🌹','💐'] },
  { emoji: '🧸', name: 'Teddy Bear', msg: 'A soft hug whenever you need one! 🤗', particles: ['🧸','💝','💖','🎀'] },
  { emoji: '🍫', name: 'Chocolate', msg: 'Sweet treats for the sweetest sister! 🍬', particles: ['🍫','🍬','🍭','💛'] },
];

document.querySelectorAll('.gift-box').forEach((box, i) => {
  box.addEventListener('click', () => {
    if (box.classList.contains('opened')) return;
    box.classList.add('opened');
    box.textContent = giftData[i].emoji;
    const reveal = box.parentElement.querySelector('.gift-reveal');
    reveal.textContent = giftData[i].msg;
    reveal.classList.add('show');
    // Burst particles
    const rect = box.getBoundingClientRect();
    for (let j = 0; j < 12; j++) {
      setTimeout(() => spawnEmojiParticle(
        rect.left + rect.width/2, rect.top + rect.height/2,
        giftData[i].particles[Math.floor(Math.random() * giftData[i].particles.length)]
      ), j * 60);
    }
    launchBigConfetti(40);
  });
});

function spawnEmojiParticle(x, y, emoji) {
  const el = document.createElement('div');
  el.style.cssText = `position:fixed;left:${x}px;top:${y}px;font-size:1.5rem;pointer-events:none;z-index:9999;`;
  el.textContent = emoji;
  const tx = (Math.random() - 0.5) * 200;
  const ty = -(Math.random() * 200 + 50);
  el.style.setProperty('--tx', tx + 'px');
  el.style.setProperty('--ty', ty + 'px');
  el.style.animation = `sparkleFly 1s ease forwards`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1000);
}

/* ================================================
   CONFETTI CANNON
   ================================================ */
const CONFETTI_COLORS = ['#ffd700','#f72585','#7b2fbe','#ff85a1','#00d4ff','#ff6b35','#4ecdc4'];

function launchBigConfetti(count = 80) {
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.cssText = `
        left:${Math.random() * 100}vw;
        top:-20px;
        background:${CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)]};
        transform:rotate(${Math.random()*360}deg);
        animation-duration:${Math.random()*2+2}s;
        animation-delay:${Math.random()*0.5}s;
        width:${Math.random()*8+4}px;
        height:${Math.random()*12+6}px;
        border-radius:${Math.random() > 0.5 ? '50%' : '2px'};
      `;
      document.body.appendChild(piece);
      setTimeout(() => piece.remove(), 3500);
    }, i * 20);
  }
}

/* ================================================
   FIREWORKS
   ================================================ */
function launchFirework(x, y) {
  const colors = ['#ffd700','#f72585','#7b2fbe','#ff85a1','#00d4ff','#ffffff'];
  for (let i = 0; i < 24; i++) {
    const angle = (Math.PI * 2 / 24) * i;
    const speed = Math.random() * 6 + 3;
    const el = document.createElement('div');
    el.style.cssText = `
      position:fixed;left:${x}px;top:${y}px;
      width:6px;height:6px;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      border-radius:50%;
      pointer-events:none;z-index:9999;
    `;
    document.body.appendChild(el);
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;
    let frame = 0;
    const anim = setInterval(() => {
      frame++;
      const cx = parseFloat(el.style.left);
      const cy = parseFloat(el.style.top);
      el.style.left = (cx + vx) + 'px';
      el.style.top  = (cy + vy + frame * 0.15) + 'px';
      el.style.opacity = 1 - frame / 40;
      if (frame >= 40) { clearInterval(anim); el.remove(); }
    }, 16);
  }
}

function multiFireworks(duration = 3000) {
  const end = Date.now() + duration;
  const fwInterval = setInterval(() => {
    if (Date.now() > end) { clearInterval(fwInterval); return; }
    launchFirework(
      Math.random() * window.innerWidth,
      Math.random() * window.innerHeight * 0.6
    );
  }, 180);
}

/* ================================================
   SURPRISE MODAL
   ================================================ */
const surpriseModal = document.getElementById('surpriseModal');
document.getElementById('surpriseBtn').addEventListener('click', () => {
  surpriseModal.classList.add('open');
  document.body.style.overflow = 'hidden';
  multiFireworks(4000);
  launchBigConfetti(100);
});

document.getElementById('modalCloseBtn').addEventListener('click', () => {
  surpriseModal.classList.remove('open');
  document.body.style.overflow = '';
});

surpriseModal.addEventListener('click', e => {
  if (e.target === surpriseModal) {
    surpriseModal.classList.remove('open');
    document.body.style.overflow = '';
  }
});

/* ================================================
   COUNTDOWN
   ================================================ */
function initCountdown() {
  const nextBirthday = getNextBirthday();
  function update() {
    const now = new Date();
    const diff = nextBirthday - now;
    if (diff <= 0) {
      document.getElementById('cdDays').textContent = '00';
      document.getElementById('cdHours').textContent = '00';
      document.getElementById('cdMins').textContent = '00';
      document.getElementById('cdSecs').textContent = '00';
      return;
    }
    const days  = Math.floor(diff / (1000*60*60*24));
    const hours = Math.floor((diff % (1000*60*60*24)) / (1000*60*60));
    const mins  = Math.floor((diff % (1000*60*60)) / (1000*60));
    const secs  = Math.floor((diff % (1000*60)) / 1000);
    document.getElementById('cdDays').textContent  = String(days).padStart(2,'0');
    document.getElementById('cdHours').textContent = String(hours).padStart(2,'0');
    document.getElementById('cdMins').textContent  = String(mins).padStart(2,'0');
    document.getElementById('cdSecs').textContent  = String(secs).padStart(2,'0');
  }
  update();
  setInterval(update, 1000);
}

function getNextBirthday() {
  const now = new Date();
  let year = now.getFullYear();
  let next = new Date(year, 6, 12); // July = 6 (0-indexed)
  if (next <= now) next = new Date(year + 1, 6, 12);
  return next;
}

/* ================================================
   FLOATING WISHES
   ================================================ */
const WISHES = [
  '🌟 Stay Happy Always!', '💜 Dream Big, Sister!', '🌸 Keep Smiling!',
  '✨ Always Shine Bright!', '❤️ Love You Forever!', '🎀 Best Wishes!',
  '💫 You Are Amazing!', '🌺 God Bless You!', '🎊 Live Your Dreams!',
  '🌙 Stay Blessed!', '💛 You Are the Best!', '🌈 Life is Beautiful!',
  '🦋 Fly High, Jyotshna!', '🎵 Be Always Joyful!', '💝 Infinite Love!',
];

function initWishes() {
  const container = document.querySelector('.wishes-container');
  if (!container) return;
  function addWish() {
    const wish = document.createElement('div');
    wish.className = 'wish-bubble';
    wish.textContent = WISHES[Math.floor(Math.random() * WISHES.length)];
    const duration = Math.random() * 6 + 7;
    wish.style.cssText = `
      left:${Math.random() * 80}%;
      animation-duration:${duration}s;
      font-size:${Math.random()*0.3+1}rem;
    `;
    container.appendChild(wish);
    setTimeout(() => wish.remove(), duration * 1000);
  }
  for (let i = 0; i < 6; i++) setTimeout(addWish, i * 1200);
  setInterval(addWish, 2000);
}

/* ================================================
   RIPPLE EFFECT on buttons
   ================================================ */
document.querySelectorAll('.cake-btn, .surprise-btn, .modal-close-btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position:absolute;
      width:10px;height:10px;
      background:rgba(255,255,255,0.4);
      border-radius:50%;
      left:${e.clientX-rect.left}px;top:${e.clientY-rect.top}px;
      transform:translate(-50%,-50%) scale(0);
      animation:rippleAnim 0.6s ease forwards;
      pointer-events:none;
    `;
    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

// Inject ripple keyframe
const rippleStyle = document.createElement('style');
rippleStyle.textContent = '@keyframes rippleAnim{to{transform:translate(-50%,-50%) scale(30);opacity:0;}}';
document.head.appendChild(rippleStyle);

/* ================================================
   TOUCH DEVICES: disable custom cursor
   ================================================ */
if ('ontouchstart' in window) {
  cursor.style.display = 'none';
  cursorTrail.style.display = 'none';
  document.body.style.cursor = 'auto';
}

console.log('🎂 Happy Birthday Jyotshnarani Mahakud! 🎉 Made with ❤️ by Ramesh');
