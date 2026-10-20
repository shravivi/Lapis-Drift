// Lapis Drift: flow-field ribbons painted in mineral pigments.
(() => {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const PALETTES = [
    { bg: '#0b1230', ink: ['#2f5fd0', '#7fd6c2', '#d9a441', '#e8a0a8', '#f3ead2'] }, // lapis, jade, gold, rose
    { bg: '#1a0d12', ink: ['#c8402f', '#e08a3c', '#f1d08a', '#7a2a4a', '#f3ead2'] }, // cinnabar and ember
    { bg: '#07201f', ink: ['#2fa08a', '#9bd9a5', '#d8e6b0', '#3d6fa8', '#f3ead2'] }, // malachite
  ];
  let pi = 0, particles = [], seed = Math.random() * 1e4;
  let mouse = { x: -1e4, y: -1e4 }, w = 0, h = 0, dpr = 1;

  // Smooth value noise
  const hash = (x, y) => { const s = Math.sin(x * 127.1 + y * 311.7 + seed) * 43758.5453; return s - Math.floor(s); };
  const fade = t => t * t * (3 - 2 * t);
  function noise(x, y) {
    const xi = Math.floor(x), yi = Math.floor(y), xf = fade(x - xi), yf = fade(y - yi);
    const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
    return a + (b - a) * xf + (c - a) * yf + (a - b - c + d) * xf * yf;
  }
  const angle = (x, y) => (noise(x * 0.0018, y * 0.0018) + 0.5 * noise(x * 0.006, y * 0.006)) * Math.PI * 3;

  function resize() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    w = innerWidth; h = innerHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    paintBackground();
  }
  function paintBackground() { ctx.fillStyle = PALETTES[pi].bg; ctx.fillRect(0, 0, w, h); }

  function spawn(x = Math.random() * w, y = Math.random() * h) {
    const ink = PALETTES[pi].ink;
    return { x, y, px: x, py: y, life: 200 + Math.random() * 400, c: ink[(Math.random() * ink.length) | 0], r: 0.4 + Math.random() * 1.2 };
  }
  function populate() { particles = Array.from({ length: Math.min(900, (w * h) / 1800) }, () => spawn()); }

  function step() {
    ctx.globalAlpha = 0.55;
    for (const p of particles) {
      let a = angle(p.x, p.y);
      const dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx * dx + dy * dy;
      if (d2 < 22500) a += (1 - d2 / 22500) * 2.2; // the cursor bends nearby currents
      p.px = p.x; p.py = p.y;
      p.x += Math.cos(a) * 1.4; p.y += Math.sin(a) * 1.4;
      ctx.strokeStyle = p.c; ctx.lineWidth = p.r;
      ctx.beginPath(); ctx.moveTo(p.px, p.py); ctx.lineTo(p.x, p.y); ctx.stroke();
      if (--p.life < 0 || p.x < 0 || p.x > w || p.y < 0 || p.y > h) Object.assign(p, spawn());
    }
    ctx.globalAlpha = 1;
  }

  // Slowly veil old strokes so the painting keeps breathing.
  function veil() { ctx.globalAlpha = 0.012; ctx.fillStyle = PALETTES[pi].bg; ctx.fillRect(0, 0, w, h); ctx.globalAlpha = 1; }

  function repaint() { seed = Math.random() * 1e4; paintBackground(); populate(); if (reduceMotion) for (let i = 0; i < 600; i++) step(); }

  let frame = 0;
  function loop() { step(); if (++frame % 4 === 0) veil(); requestAnimationFrame(loop); }

  addEventListener('resize', () => { resize(); populate(); });
  canvas.addEventListener('pointermove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  canvas.addEventListener('pointerleave', () => { mouse.x = mouse.y = -1e4; });
  canvas.addEventListener('pointerdown', e => { for (let i = 0; i < 120; i++) particles.push(spawn(e.clientX + (Math.random() - .5) * 40, e.clientY + (Math.random() - .5) * 40)); });

  const save = () => { const a = document.createElement('a'); a.download = 'lapis-drift.png'; a.href = canvas.toDataURL('image/png'); a.click(); };
  const nextPalette = () => { pi = (pi + 1) % PALETTES.length; repaint(); };
  document.getElementById('reseed').onclick = repaint;
  document.getElementById('palette').onclick = nextPalette;
  document.getElementById('save').onclick = save;
  addEventListener('keydown', e => { if (e.key === 's') save(); if (e.key === 'n') repaint(); if (e.key === 'p') nextPalette(); });

  resize(); populate();
  if (reduceMotion) for (let i = 0; i < 600; i++) step(); else loop();
})();
