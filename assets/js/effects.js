/* ==========================================================
   effects.js
   Shared visual effects for landing + dashboard
   - Matrix rain background
   - Floating particles
   ========================================================== */

/* ---------- MATRIX RAIN ---------- */
(function initMatrix() {
  const canvas = document.getElementById('matrix-bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height, columns, drops;
  // characters: mix of katakana + binary + symbols for a true matrix vibe
  const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ01010101</>$#@*'.split('');
  const fontSize = 14;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    columns = Math.floor(width / fontSize);
    drops = Array(columns).fill(1);
  }
  resize();
  window.addEventListener('resize', resize);

  function draw() {
    // fading trail
    ctx.fillStyle = 'rgba(5, 7, 13, 0.08)';
    ctx.fillRect(0, 0, width, height);

    // read accent color from CSS variable
    const accent = getComputedStyle(document.body)
      .getPropertyValue('--accent').trim() || '#00ffd0';
    ctx.fillStyle = accent;
    ctx.font = fontSize + 'px JetBrains Mono, monospace';

    for (let i = 0; i < drops.length; i++) {
      const text = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);

      // randomly reset drop
      if (drops[i] * fontSize > height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  // store interval so we can pause it from settings
  window.__matrixInterval = setInterval(draw, 50);
})();

/* ---------- FLOATING PARTICLES ---------- */
(function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const count = 18;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDuration = (8 + Math.random() * 12) + 's';
    p.style.animationDelay = (Math.random() * 8) + 's';
    p.style.opacity = 0.3 + Math.random() * 0.4;
    container.appendChild(p);
  }
})();
