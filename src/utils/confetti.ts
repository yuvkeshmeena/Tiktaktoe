/**
 * High-performance lightweight canvas particle confetti generator
 */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  shape: 'rect' | 'circle';
}

export function fireConfetti(durationMs: number = 2200) {
  if (typeof window === 'undefined') return;

  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    canvas.remove();
    return;
  }

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resize();

  const colors = [
    '#38BDF8', // Cyan
    '#F43F5E', // Rose
    '#FBBF24', // Amber
    '#A855F7', // Purple
    '#34D399', // Emerald
    '#EC4899', // Pink
    '#6366F1', // Indigo
  ];

  const particles: Particle[] = [];
  const count = 90;

  for (let i = 0; i < count; i++) {
    // Launch mostly from center bottom or mid-screen
    const fromX = window.innerWidth * (0.2 + Math.random() * 0.6);
    const fromY = window.innerHeight * 0.45;
    const angle = Math.random() * Math.PI * 2;
    const speed = 4 + Math.random() * 8;

    particles.push({
      x: fromX,
      y: fromY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 4, // upward boost
      size: 6 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 12,
      opacity: 1,
      shape: Math.random() > 0.4 ? 'rect' : 'circle',
    });
  }

  let animationFrameId: number;
  const startTime = performance.now();

  function animate(now: number) {
    const elapsed = now - startTime;
    if (elapsed > durationMs) {
      canvas.remove();
      return;
    }

    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.22; // gravity
      p.vx *= 0.98; // air resistance
      p.rotation += p.rotationSpeed;

      if (elapsed > durationMs * 0.6) {
        p.opacity = Math.max(0, 1 - (elapsed - durationMs * 0.6) / (durationMs * 0.4));
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;

      if (p.shape === 'rect') {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    animationFrameId = requestAnimationFrame(animate);
  }

  animationFrameId = requestAnimationFrame(animate);
}
