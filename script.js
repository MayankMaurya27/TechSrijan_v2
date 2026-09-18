const canvas = document.querySelector('#starfield');
const context = canvas.getContext('2d');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let stars = [];
let frame;
const cursor = {
  active: false,
  targetX: innerWidth / 2,
  targetY: innerHeight / 2,
  x: innerWidth / 2,
  y: innerHeight / 2,
};

function createStars() {
  const density = Math.min(225, Math.max(95, Math.round((innerWidth * innerHeight) / 7200)));
  stars = Array.from({ length: density }, () => ({
    x: Math.random() * innerWidth,
    y: Math.random() * innerHeight,
    size: Math.random() < .1 ? Math.random() * 2.5 + 1.5 : Math.random() * 1.35 + .35,
    opacity: Math.random() * .76 + .2,
    drift: (Math.random() - .5) * .22,
    phase: Math.random() * Math.PI * 2,
  }));
}

function resize() {
  const ratio = Math.min(devicePixelRatio || 1, 2);
  canvas.width = innerWidth * ratio;
  canvas.height = innerHeight * ratio;
  canvas.style.width = `${innerWidth}px`;
  canvas.style.height = `${innerHeight}px`;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  createStars();
}

function draw(time = 0) {
  context.clearRect(0, 0, innerWidth, innerHeight);
  if (!reducedMotion && cursor.active) {
    cursor.x += (cursor.targetX - cursor.x) * .09;
    cursor.y += (cursor.targetY - cursor.y) * .09;
    const glow = context.createRadialGradient(cursor.x, cursor.y, 0, cursor.x, cursor.y, 250);
    glow.addColorStop(0, 'rgba(188,218,255,.14)');
    glow.addColorStop(.35, 'rgba(160,196,255,.045)');
    glow.addColorStop(1, 'rgba(255,255,255,0)');
    context.fillStyle = glow;
    context.fillRect(cursor.x - 250, cursor.y - 250, 500, 500);
  }
  stars.forEach((star) => {
    if (!reducedMotion) {
      star.y += star.drift;
      if (star.y < -4) star.y = innerHeight + 4;
      if (star.y > innerHeight + 4) star.y = -4;
    }
    const deltaX = star.x - cursor.x;
    const deltaY = star.y - cursor.y;
    const distance = Math.hypot(deltaX, deltaY) || 1;
    const force = cursor.active && !reducedMotion ? Math.max(0, 1 - distance / 245) : 0;
    const displacement = force * force * 48;
    const x = star.x + (deltaX / distance) * displacement;
    const y = star.y + (deltaY / distance) * displacement;
    const flicker = reducedMotion ? 1 : .72 + Math.sin(time / 1200 + star.phase) * .28;
    context.beginPath();
    context.arc(x, y, star.size + force * 2.2, 0, Math.PI * 2);
    context.fillStyle = `rgba(255,255,255,${Math.min(1, star.opacity * flicker + force * .65)})`;
    context.fill();
  });
  if (!reducedMotion) frame = requestAnimationFrame(draw);
}

addEventListener('resize', () => { cancelAnimationFrame(frame); resize(); draw(); });
addEventListener('pointermove', (event) => {
  cursor.active = true;
  cursor.targetX = event.clientX;
  cursor.targetY = event.clientY;
}, { passive: true });
addEventListener('pointerleave', () => { cursor.active = false; });
resize();
draw();
