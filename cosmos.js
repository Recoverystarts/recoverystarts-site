/* Open Cosmos — floating particles only (bg is static full-bleed img)
 * The particles start once the page has drawn and the phone is idle, and fade in over a second, so the headline,
 * the buttons and the picture never wait behind them (wave 2026-10-26-ads S2: on a slow phone this loop was ~4 s of
 * main-thread work before the headline showed). Way back: call start() at once and drop the fade. */
(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canvas = document.getElementById("particles");
  if (!canvas || reduce) {
    if (canvas) canvas.style.display = "none";
    return;
  }
  canvas.style.opacity = "0";
  const idle = (f) => (window.requestIdleCallback ? requestIdleCallback(f, { timeout: 2000 }) : setTimeout(f, 300));
  const later = () => idle(start);
  if (document.readyState === "complete") later();
  else {
    window.addEventListener("load", later, { once: true });
    setTimeout(later, 6000); // a slow image can hold load back; the sky still starts
  }

  let started = false;
  function start() {
    if (started) return;
    started = true;

    const ctx = canvas.getContext("2d");
    let w = 0;
    let h = 0;
    let particles = [];
    let raf = 0;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(90, Math.floor((w * h) / 16000));
      particles = Array.from({ length: count }, () => spawn(true));
    }

    function spawn(randomY) {
      return {
        x: Math.random() * w,
        y: randomY ? Math.random() * h : h + 10,
        r: Math.random() * 1.7 + 0.4,
        a: Math.random() * 0.55 + 0.2,
        vy: -(Math.random() * 0.28 + 0.05),
        vx: (Math.random() - 0.5) * 0.16,
        tw: Math.random() * Math.PI * 2,
      };
    }

    function frame() {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.tw += 0.025;
        p.x += p.vx;
        p.y += p.vy;
        const alpha = p.a * (0.55 + 0.45 * Math.sin(p.tw));
        ctx.beginPath();
        ctx.fillStyle = "rgba(220, 235, 255, " + alpha + ")";
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        if (p.y < -12 || p.x < -20 || p.x > w + 20) {
          Object.assign(p, spawn(false), { y: h + 8, x: Math.random() * w });
        }
      }
      raf = requestAnimationFrame(frame);
    }

    window.addEventListener("resize", resize, { passive: true });
    resize();
    raf = requestAnimationFrame(frame);
    canvas.style.transition = "opacity 1.2s ease";
    requestAnimationFrame(() => { canvas.style.opacity = "1"; });
  }
})();
