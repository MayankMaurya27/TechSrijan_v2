/* ===================================================
   Original blueprint + vapor text effects
   + cinematic hero-bg reveal that plays FIRST
   =================================================== */

const canvas = document.querySelector('#blueprint');
const context = canvas.getContext('2d');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const pointer = { x: innerWidth / 2, y: innerHeight / 2, targetX: innerWidth / 2, targetY: innerHeight / 2, active: false };
let frame;

function resize() {
  const pixelRatio = Math.min(devicePixelRatio || 1, 2);
  canvas.width = innerWidth * pixelRatio;
  canvas.height = innerHeight * pixelRatio;
  canvas.style.width = `${innerWidth}px`;
  canvas.style.height = `${innerHeight}px`;
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
}

function warp(x, y, time) {
  const horizontalWave = Math.sin(y / 105 + time / 1100) * 4;
  const verticalWave = Math.cos(x / 120 + time / 1450) * 4;
  const dx = x - pointer.x;
  const dy = y - pointer.y;
  const distance = Math.hypot(dx, dy) || 1;
  const strength = pointer.active && !reducedMotion ? Math.max(0, 1 - distance / 270) ** 2 : 0;
  return {
    x: x + horizontalWave + (dx / distance) * strength * 72,
    y: y + verticalWave + (dy / distance) * strength * 72,
    strength,
  };
}

function drawGrid(time) {
  const gap = innerWidth < 640 ? 38 : 54;
  const step = gap / 2;
  context.lineWidth = 1;

  for (let x = -gap; x <= innerWidth + gap; x += gap) {
    context.beginPath();
    for (let y = -gap; y <= innerHeight + gap; y += step) {
      const point = warp(x, y, time);
      if (y === -gap) context.moveTo(point.x, point.y); else context.lineTo(point.x, point.y);
    }
    context.strokeStyle = 'rgba(117, 196, 255, .14)';
    context.stroke();
  }

  for (let y = -gap; y <= innerHeight + gap; y += gap) {
    context.beginPath();
    for (let x = -gap; x <= innerWidth + gap; x += step) {
      const point = warp(x, y, time);
      if (x === -gap) context.moveTo(point.x, point.y); else context.lineTo(point.x, point.y);
    }
    context.strokeStyle = 'rgba(117, 196, 255, .11)';
    context.stroke();
  }

  for (let x = 0; x <= innerWidth; x += gap * 2) {
    for (let y = 0; y <= innerHeight; y += gap * 2) {
      const point = warp(x, y, time);
      context.beginPath();
      context.arc(point.x, point.y, 1.7 + point.strength * 3, 0, Math.PI * 2);
      context.fillStyle = point.strength ? 'rgba(116, 248, 207, .95)' : 'rgba(169, 212, 255, .45)';
      context.fill();
    }
  }
}

function draw(time = 0) {
  context.clearRect(0, 0, innerWidth, innerHeight);
  if (!reducedMotion) {
    pointer.x += (pointer.targetX - pointer.x) * .1;
    pointer.y += (pointer.targetY - pointer.y) * .1;
  }
  if (pointer.active) {
    const bloom = context.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 310);
    bloom.addColorStop(0, 'rgba(116, 248, 207, .15)');
    bloom.addColorStop(.42, 'rgba(73, 152, 255, .06)');
    bloom.addColorStop(1, 'rgba(0, 0, 0, 0)');
    context.fillStyle = bloom;
    context.fillRect(pointer.x - 310, pointer.y - 310, 620, 620);
  }
  drawGrid(time);
  if (!reducedMotion) frame = requestAnimationFrame(draw);
}

addEventListener('resize', () => { cancelAnimationFrame(frame); resize(); draw(); });
addEventListener('pointermove', (event) => { pointer.active = true; pointer.targetX = event.clientX; pointer.targetY = event.clientY; }, { passive: true });
addEventListener('pointerleave', () => { pointer.active = false; });
resize();
draw();

// ====== Text vaporization (original) — but DELAYED until image reveals ======
const vaporCanvas = document.querySelector('#text-vapor');
const vaporContext = vaporCanvas.getContext('2d');
const title = document.querySelector('#construction-title');
const titleWords = [...title.querySelectorAll('span')];

function revealWithTypewriter() {
  let sequence = 0;
  titleWords.forEach((word) => {
    const text = word.textContent.trim();
    const characters = [...text].map((character) => {
      const letter = document.createElement('span');
      letter.className = 'char';
      letter.setAttribute('aria-hidden', 'true');
      letter.textContent = character;
      letter.style.setProperty('--char-delay', `${sequence * 38}ms`);
      sequence += 1;
      return letter;
    });
    word.replaceChildren(...characters);
    if (word.classList.contains('under')) {
      const marker = document.createElement('b');
      marker.setAttribute('aria-hidden', 'true');
      word.append(marker);
    }
  });
  document.documentElement.classList.remove('vapor-active');
  document.documentElement.classList.add('title-revealed');
  setTimeout(() => title.classList.add('settled'), 1100);
}

function buildVaporParticles() {
  const source = document.createElement('canvas');
  source.width = innerWidth;
  source.height = innerHeight;
  const sourceContext = source.getContext('2d', { willReadFrequently: true });
  const colors = ['#eef4ff', '#74f8cf', '#eef4ff'];

  titleWords.forEach((word, index) => {
    const bounds = word.getBoundingClientRect();
    const style = getComputedStyle(word);
    sourceContext.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    sourceContext.textBaseline = 'top';
    sourceContext.fillStyle = colors[index];
    sourceContext.fillText(word.textContent.trim(), bounds.left, bounds.top);
  });

  const image = sourceContext.getImageData(0, 0, source.width, source.height).data;
  const step = innerWidth < 640 ? 4 : 3;
  const particles = [];
  for (let y = 0; y < source.height; y += step) {
    for (let x = 0; x < source.width; x += step) {
      const pixel = (y * source.width + x) * 4;
      if (image[pixel + 3] < 120) continue;
      const distance = 70 + Math.random() * 260;
      const angle = Math.random() * Math.PI * 2;
      particles.push({
        x,
        y,
        startX: x + Math.cos(angle) * distance,
        startY: y + Math.sin(angle) * distance,
        color: `rgb(${image[pixel]}, ${image[pixel + 1]}, ${image[pixel + 2]})`,
        size: Math.random() > .88 ? 2.2 : 1.25,
        delay: Math.random() * .12,
      });
    }
  }
  return particles;
}

function playVaporTitle() {
  if (reducedMotion) return;
  document.documentElement.classList.add('vapor-active');
  const pixelRatio = Math.min(devicePixelRatio || 1, 2);
  vaporCanvas.width = innerWidth * pixelRatio;
  vaporCanvas.height = innerHeight * pixelRatio;
  vaporCanvas.style.width = `${innerWidth}px`;
  vaporCanvas.style.height = `${innerHeight}px`;
  vaporContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  const particles = buildVaporParticles();
  const startedAt = performance.now();
  const duration = 620;

  function animateVapor(now) {
    const progress = Math.min(1, (now - startedAt) / duration);
    const eased = 1 - (1 - progress) ** 4;
    vaporContext.clearRect(0, 0, innerWidth, innerHeight);
    particles.forEach((particle) => {
      const localProgress = Math.min(1, Math.max(0, (eased - particle.delay) / (1 - particle.delay)));
      const x = particle.startX + (particle.x - particle.startX) * localProgress;
      const y = particle.startY + (particle.y - particle.startY) * localProgress;
      const alpha = Math.min(1, localProgress * 2.4) * (1 - Math.max(0, progress - .79) * 4.8);
      if (alpha <= 0) return;
      vaporContext.fillStyle = particle.color;
      vaporContext.globalAlpha = alpha;
      vaporContext.fillRect(x, y, particle.size, particle.size);
    });
    vaporContext.globalAlpha = 1;
    if (progress < 1) {
      requestAnimationFrame(animateVapor);
    } else {
      vaporContext.clearRect(0, 0, innerWidth, innerHeight);
      revealWithTypewriter();
    }
  }
  requestAnimationFrame(animateVapor);
}


/* ====================================================================
   CINEMATIC IMAGE REVEAL  —  plays FIRST, then triggers text effects
   ==================================================================== */

const heroBg = document.getElementById('hero-bg');
const heroImg = document.getElementById('hero-img');

function cinematicReveal() {
  const duration = 1400;   // 1.4s — snappier reveal
  const startedAt = performance.now();

  function tick(now) {
    const raw = Math.min(1, (now - startedAt) / duration);
    // Smooth ease-out quart
    const t = 1 - (1 - raw) ** 4;

    // Animate clip-path from center outward
    const inset = 50 - t * 50;   // 50% → 0%
    heroBg.style.clipPath = `inset(${inset}% ${inset}% ${inset}% ${inset}%)`;

    // Fade in quickly
    heroBg.style.opacity = Math.min(1, raw * 3);

    // Zoom from 1.15 → 1.0
    const scale = 1.15 - t * 0.15;
    heroBg.style.transform = `scale(${scale})`;

    if (raw < 1) {
      requestAnimationFrame(tick);
    } else {
      // Reveal complete — start scan line + Ken Burns
      heroBg.classList.add('revealed');
      heroBg.classList.add('scan');

      // Trigger text vapor effect almost immediately
      setTimeout(() => {
        requestAnimationFrame(playVaporTitle);
      }, 300);
    }
  }

  requestAnimationFrame(tick);
}

// Wait for the image to load before starting the cinematic reveal
if (heroImg.complete) {
  requestAnimationFrame(cinematicReveal);
} else {
  heroImg.addEventListener('load', () => requestAnimationFrame(cinematicReveal));
  heroImg.addEventListener('error', () => {
    // Fallback: just play text effects if image fails
    heroBg.style.display = 'none';
    requestAnimationFrame(playVaporTitle);
  });
}
