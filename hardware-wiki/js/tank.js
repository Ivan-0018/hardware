/* ============================================================
   TANK — iteration morph player (frame sequence) used by the
   design explorer. Content: content/tank-content.js
   ============================================================ */
(function () {
  const FRAMES = 389; // f_0000 .. f_0388
  const DIRS = { light: "tank/frames-light/", dark: "tank/frames-dark/" };  // light = Dunelock red line colour
  const reduceMotion = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const theme = () => (window.Site ? Site.theme() : "light");
  const framePath = (t, i) => DIRS[t] + "f_" + String(i).padStart(4, "0") + ".webp";

  /* frame cache, per theme, shared by every player on the page */
  const cache = { light: [], dark: [] }, started = { light: false, dark: false };
  function preload(t) {
    if (started[t]) return; started[t] = true;
    for (let i = 0; i < FRAMES; i++) { const im = new Image(); im.src = framePath(t, i); cache[t][i] = im; }
  }

  /* bare frame player (used by the explorer version) */
  function player(frameEl, loadingEl) {
    const C = window.TANK_CONTENT, holds = C.iterations.map((it) => it.hold);
    let cur = holds[0], raf = 0;
    if (loadingEl) frameEl.addEventListener("load", () => { loadingEl.style.display = "none"; }, { once: true });
    function draw(f) {
      const t = theme(), i = Math.max(0, Math.min(FRAMES - 1, Math.round(f))), im = cache[t][i];
      frameEl.src = im && im.complete && im.naturalWidth ? im.src : framePath(t, i);
    }
    if (window.Site) Site.onTheme((t) => { preload(t); draw(cur); });
    // o.dur: run the morph in exactly this many ms (used to keep it in step with the
    // design-cycle wind / unwind); it then starts moving immediately and runs steadily
    function goTo(k, instant, o) {
      preload(theme());
      const target = holds[k];
      cancelAnimationFrame(raf);
      const synced = o && o.dur > 0;
      if (instant || (reduceMotion && !synced) || Math.abs(target - cur) < 1) { cur = target; draw(cur); return; }
      const from = cur, dist = target - from, t0 = performance.now();
      const dur = synced ? o.dur : Math.min(4200, Math.max(500, 1800 * Math.pow(Math.abs(dist) / 70, 0.6)));
      const ease = synced
        ? (p) => (p < 0.12 ? (p / 0.12) * (p / 0.12) * 0.06 : p > 0.88 ? 1 - Math.pow((1 - p) / 0.12, 2) * 0.06 : 0.06 + (p - 0.12) / 0.76 * 0.88)
        : (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
      (function step(ts) {
        const p = Math.min(1, (ts - t0) / dur);
        cur = from + dist * ease(p); draw(cur);
        if (p < 1) raf = requestAnimationFrame(step); else cur = target;
      })(t0);
    }
    draw(cur);
    return { goTo };
  }

  window.TankEvolution = { preload, player };
})();
