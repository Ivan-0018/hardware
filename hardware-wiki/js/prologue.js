/* ============================================================
   PROLOGUE — the pinned, scroll-scrubbed intro
   Text comes from content/prologue-content.js (one beat = one screen).
   The canvas scene is a function of scroll position, so it scrubs
   both ways: sand lifts, settles, binds into a crust, and the
   sprayer passes over it.
   With "reduced motion" the whole thing degrades to a plain
   stacked intro section (no pinning, no canvas).
   ============================================================ */
(function () {
  const C = window.PROLOGUE, sec = document.getElementById("prologue");
  if (!C || !sec || !C.beats || !C.beats.length) return;
  const root = document.documentElement;
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const ramp = (v, a, b) => clamp((v - a) / (b - a), 0, 1);
  const ease = (t) => t * t * (3 - 2 * t);
  const lerp = (a, b, t) => a + (b - a) * t;

  const N = C.beats.length, SEG = Math.max(1, N - 1);
  const stage = sec.querySelector(".pro-stage");
  const textHost = sec.querySelector(".pro-text");
  const railHost = sec.querySelector(".pro-rail");
  const cue = sec.querySelector(".pro-cue");
  const skip = sec.querySelector(".pro-skip");
  const cv = sec.querySelector(".pro-canvas");

  /* ---------- beats ---------- */
  textHost.innerHTML = C.beats.map((b) => {
    const right =
      (b.stats ? '<div class="pro-stats">' + b.stats.map((s) => "<div><strong>" + esc(s[0]) + "</strong><span>" + esc(s[1]) + "</span></div>").join("") + "</div>" : "") +
      (b.list ? '<div class="pro-list' + (b.ordered ? " num" : "") + '">' + b.list.map((l) => "<div><strong>" + esc(l[0]) + "</strong><span>" + esc(l[1]) + "</span></div>").join("") + "</div>" : "");
    return '<article class="pro-beat' + (right ? "" : " single") + '">' +
      '<div><div class="eyebrow">' + esc(b.eyebrow) + "</div><h2>" + esc(b.title) + "</h2></div>" +
      '<div class="pro-col">' + (b.body ? "<p>" + esc(b.body) + "</p>" : "") + right + "</div></article>";
  }).join("");
  const beats = [...textHost.children];
  railHost.innerHTML = C.beats.map(() => "<i></i>").join("");
  const dots = [...railHost.children];
  if (cue) cue.innerHTML = "<i></i>" + esc(C.cue || "Scroll");
  if (skip) {
    skip.textContent = C.skip || "Skip intro";
    skip.addEventListener("click", () => {
      const hero = document.getElementById("hero");
      if (hero) hero.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  /* ---------- reduced motion: plain stacked intro ---------- */
  if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) {
    sec.classList.add("pro-static");
    root.classList.remove("in-prologue");
    return;
  }

  /* one full-screen block per beat: these give the section its height and
     act as the scroll-snap points, so a scroll settles on a beat instead of
     halfway through a cross-fade */
  const snaps = document.createElement("div");
  snaps.setAttribute("aria-hidden", "true");
  snaps.innerHTML = new Array(N - 1).fill('<div class="pro-snap"></div>').join("");
  sec.appendChild(snaps);

  /* ---------- scene ----------
     "sand" lives below; other scenes register themselves on
     window.PROLOGUE_SCENES (see js/prologue-sketch.js).          */
  const ctx = cv.getContext("2d");
  const custom = (window.PROLOGUE_SCENES || {})[C.scene];
  let W = 0, H = 0, DPR = 1, grains = [], col = {};
  let seed = 7;
  const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);

  function recolor() {
    const cs = getComputedStyle(root);
    const g = (k, d) => (cs.getPropertyValue(k).trim() || d);
    col = {
      sand: g("--sand", "#99451a"), sand2: g("--sand2", "#ae7b81"), burg: g("--burg", "#600000"),
      line: g("--ghost", "#f0dcc0"), bg2: g("--bg2", "#fbe7bd"), teal: g("--teal", "#3e8c82"),
      red: g("--red", "#b8432f"), ink: g("--heading", "#3c1b10"), muted: g("--muted", "#795447"),
      soft: g("--soft", "#99451a"), card: g("--card-solid", "#fffaf0"),
      green: g("--green", "#4f7f35"), blue: g("--blue", "#2f69b3")
    };
  }
  function resize() {
    DPR = Math.min(2, window.devicePixelRatio || 1);
    W = sec.clientWidth; H = stage.clientHeight || innerHeight;
    cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    if (custom && custom.resize) custom.resize(W, H);
    seed = 7;
    const n = Math.round(clamp(W * 0.42, 180, 420));
    grains = Array.from({ length: n }, () => ({
      x: rnd(), d: rnd(), r: rnd(), s: rnd() * 1.7 + 0.6, rose: rnd() < 0.3, ph: rnd() * 6.283
    }));
  }
  const ridge = (x) => H * (0.845 + 0.034 * Math.sin(x * 4.1 + 0.9) + 0.018 * Math.sin(x * 9.7 + 2.3));
  const STRIPS = [0.14, 0.33, 0.52, 0.71, 0.9];

  function drone(cx, cy, scale, alpha, t) {
    ctx.save();
    ctx.globalAlpha = alpha; ctx.translate(cx, cy); ctx.scale(scale, scale);
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2.2; ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.beginPath();                      // arms
    ctx.moveTo(-46, -6); ctx.lineTo(-16, 4); ctx.lineTo(16, 4); ctx.lineTo(46, -6);
    ctx.stroke();
    ctx.beginPath();                      // body
    ctx.roundRect ? ctx.roundRect(-20, -2, 40, 15, 5) : ctx.rect(-20, -2, 40, 15);
    ctx.stroke();
    ctx.beginPath();                      // payload
    ctx.roundRect ? ctx.roundRect(-13, 13, 26, 13, 3) : ctx.rect(-13, 13, 26, 13);
    ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, 26); ctx.lineTo(0, 32); ctx.stroke();   // nozzle
    const blur = 14 + Math.sin(t * 22) * 3;                                 // rotors
    [-46, 46].forEach((x) => {
      ctx.globalAlpha = alpha * 0.5;
      ctx.beginPath(); ctx.ellipse(x, -8, blur, 2.4, 0, 0, 6.283); ctx.stroke();
      ctx.globalAlpha = alpha;
      ctx.beginPath(); ctx.moveTo(x, -8); ctx.lineTo(x, -2); ctx.stroke();
    });
    ctx.restore();
  }

  function draw(b, t) {
    const p = b / SEG;                       // 0..1 over the whole prologue
    if (custom) { custom.draw(ctx, { W: W, H: H, p: p, t: t, col: col }); return; }
    ctx.clearRect(0, 0, W, H);
    const wind = ease(ramp(p, 0.10, 0.23)) * (1 - ease(ramp(p, 0.33, 0.45)));
    const crust = ease(ramp(p, 0.36, 0.51));
    const flyIn = ease(ramp(p, 0.50, 0.55)) * (1 - ease(ramp(p, 0.82, 0.88)));
    const flyX = ease(ramp(p, 0.52, 0.82));
    const spray = ease(ramp(p, 0.57, 0.63)) * (1 - ease(ramp(p, 0.79, 0.83)));
    const shatter = ease(ramp(p, 0.66, 0.78));
    const hover = ease(ramp(p, 0.90, 1.0));
    const droneX = W * lerp(-0.18, 1.2, flyX);

    /* far dune */
    ctx.globalAlpha = 0.5; ctx.fillStyle = col.bg2;
    ctx.beginPath(); ctx.moveTo(0, H);
    for (let x = 0; x <= 1.001; x += 0.02) ctx.lineTo(x * W, ridge(x) - H * 0.07 + Math.sin(x * 6.6) * H * 0.016);
    ctx.lineTo(W, H); ctx.closePath(); ctx.fill();

    /* near dune */
    const gr = ctx.createLinearGradient(0, H * 0.74, 0, H);
    gr.addColorStop(0, col.bg2); gr.addColorStop(1, col.line);
    ctx.globalAlpha = 0.85; ctx.fillStyle = gr;
    ctx.beginPath(); ctx.moveTo(0, H);
    for (let x = 0; x <= 1.001; x += 0.02) ctx.lineTo(x * W, ridge(x));
    ctx.lineTo(W, H); ctx.closePath(); ctx.fill();

    /* treated strips (laid down as the sprayer passes) */
    ctx.globalAlpha = 1;
    STRIPS.forEach((sx) => {
      const laid = clamp((lerp(-0.18, 1.2, flyX) - sx) * 6, 0, 1);
      const done = Math.max(laid, crust * 0.35);
      if (done <= 0.02) return;
      const half = W * 0.045 * done;
      ctx.strokeStyle = col.burg; ctx.globalAlpha = 0.25 + 0.45 * done; ctx.lineWidth = 3 + 4 * done;
      ctx.beginPath();
      for (let x = sx - 0.05; x <= sx + 0.05; x += 0.005) {
        const px = x * W; if (px < sx * W - half || px > sx * W + half) continue;
        x === sx - 0.05 ? ctx.moveTo(px, ridge(x)) : ctx.lineTo(px, ridge(x));
      }
      ctx.stroke();
    });

    /* the crust line along the ridge */
    if (crust > 0.02) {
      ctx.globalAlpha = 0.2 + 0.55 * crust; ctx.strokeStyle = col.burg; ctx.lineWidth = 1.4 + 3.4 * crust;
      ctx.beginPath();
      for (let x = 0; x <= 1.001; x += 0.01) (x === 0 ? ctx.moveTo : ctx.lineTo).call(ctx, x * W, ridge(x));
      ctx.stroke();
    }

    /* grains */
    grains.forEach((g) => {
      const lift = wind * (0.2 + g.r * 1.0);
      const drift = wind * (0.03 + g.r * 0.16) + Math.sin(t * 0.7 + g.ph) * 0.004 * wind;
      let x = (g.x + drift) % 1; if (x < 0) x += 1;
      const rest = ridge(g.x) + g.d * 16;
      const y = rest - lift * H * (0.05 + g.r * 0.13) - Math.sin(t * 1.3 + g.ph) * 5 * wind;
      const air = clamp(lift * 1.7, 0, 1);
      ctx.globalAlpha = (0.3 + g.r * 0.35) * (1 - 0.25 * air) * (1 - 0.45 * crust * (1 - air));
      ctx.fillStyle = g.rose ? col.sand2 : col.sand;
      const w = g.s * (1 + air * 4.5), h = g.s * (1 - air * 0.3);
      ctx.beginPath(); ctx.ellipse(x * W, y, w, Math.max(0.4, h), 0, 0, 6.283); ctx.fill();
      /* once bound, neighbouring grains bridge to the crust */
      if (crust > 0.05 && g.d < 0.5 && air < 0.1) {
        ctx.globalAlpha = 0.22 * crust; ctx.strokeStyle = col.burg; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(x * W, y); ctx.lineTo(x * W + (g.r - 0.5) * 14, ridge(g.x)); ctx.stroke();
      }
    });

    /* the sprayer */
    if (flyIn > 0.02) {
      const cy = H * 0.62, sc = clamp(W / 1400, 0.72, 1.2);
      if (spray > 0.02) {
        const nz = cy + 32 * sc, reach = ridge(droneX / W) - nz;
        ctx.globalAlpha = 0.16 * spray; ctx.fillStyle = col.teal;
        ctx.beginPath(); ctx.moveTo(droneX, nz);
        ctx.lineTo(droneX - 44 * sc, nz + reach); ctx.lineTo(droneX + 44 * sc, nz + reach);
        ctx.closePath(); ctx.fill();
        for (let k = 0; k < 46; k++) {
          const ph = ((k * 0.137 + t * 0.55) % 1);
          const dx = ((k * 37) % 89) / 89 - 0.5;
          const px = droneX + dx * 88 * sc * ph, py = nz + reach * ph;
          const a = spray * (1 - ph * 0.65);
          if (shatter < 0.05) {
            ctx.globalAlpha = a * 0.85; ctx.fillStyle = col.teal;
            ctx.beginPath(); ctx.arc(px, py, 2.1 * sc, 0, 6.283); ctx.fill();
          } else {
            const brk = shatter * clamp((ph - 0.3) * 2.2, 0, 1);
            ctx.globalAlpha = a * 0.9; ctx.fillStyle = brk > 0.25 ? col.red : col.teal;
            for (let f = 0; f < (brk > 0.25 ? 3 : 1); f++) {
              const o = (f - 1) * 5 * brk * sc;
              ctx.beginPath(); ctx.arc(px + o, py + o * 0.6, (2.1 - brk * 0.9) * sc, 0, 6.283); ctx.fill();
            }
          }
        }
      }
      drone(droneX, cy, sc, flyIn, t);
    }
    if (hover > 0.02) drone(W / 2, H * 0.6 + Math.sin(t * 1.1) * 5, clamp(W / 1400, 0.72, 1.2) * 1.35, hover, t);
    ctx.globalAlpha = 1;
  }

  /* ---------- scroll ---------- */
  let b = 0, raf = 0, visible = false, t0 = performance.now();
  function progress() {
    const r = sec.getBoundingClientRect();
    const span = sec.offsetHeight - stage.offsetHeight;
    return clamp(span > 0 ? -r.top / span : 0, 0, 1) * SEG;
  }
  function paintText() {
    beats.forEach((el, i) => {
      const d = Math.abs(b - i);
      const op = clamp(1.3 - d * 1.9, 0, 1);
      el.style.opacity = op;
      // the shift is applied by the stylesheet (centred on desktop, top-anchored on phones)
      el.style.setProperty("--shift", ((i - b) * 46).toFixed(1) + "px");
      el.style.pointerEvents = op > 0.6 ? "auto" : "none";
      el.setAttribute("aria-hidden", op > 0.3 ? "false" : "true");
    });
    const cur = Math.round(b);
    dots.forEach((d, i) => d.classList.toggle("on", i === cur));
    if (cue) cue.style.opacity = b > 0.35 ? 0 : 1;
    root.classList.toggle("in-prologue", b < SEG - 0.12);
  }
  function frame() {
    const t = (performance.now() - t0) / 1000;
    b = progress();
    paintText();
    draw(b, t);
    raf = visible ? requestAnimationFrame(frame) : 0;
  }
  /* ---------- settle on the nearest beat ----------
     When scrolling stops mid-way through a transition, ease the page onto
     the nearest beat. Any new input from the reader cancels it.          */
  let tween = 0, idle = 0, settling = false, anchor = 0;
  const SETTLE_MS = 420;
  function cancelTween() { if (tween) { cancelAnimationFrame(tween); tween = 0; } settling = false; }
  function scrollTo(y, ms) {
    const y0 = window.scrollY, dy = y - y0, t0 = performance.now();
    settling = true;
    (function step() {
      const k = clamp((performance.now() - t0) / ms, 0, 1);
      window.scrollTo(0, y0 + dy * (k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2));
      tween = k < 1 ? requestAnimationFrame(step) : 0;
      if (!tween) settling = false;
    })();
  }
  function settle() {
    if (!visible || settling) return;
    const span = sec.offsetHeight - stage.offsetHeight;
    if (span <= 0) return;
    const top = sec.getBoundingClientRect().top + window.scrollY;
    const here = window.scrollY - top;
    if (here < -40 || here > span + 40) return;            // outside the prologue
    const step = span / SEG, at = here / step, drift = at - anchor;
    /* a nudge moves on by one beat, a long scroll goes wherever it landed —
       so a small scroll never yanks the reader back to where they started */
    let k = Math.abs(drift) > 0.5 ? Math.round(at)
          : drift > 0.1 ? anchor + 1
          : drift < -0.1 ? anchor - 1 : anchor;
    k = clamp(k, 0, SEG);
    anchor = k;
    const target = Math.round(top + k * step);
    if (Math.abs(target - window.scrollY) < 6) return;     // already on a beat
    scrollTo(target, SETTLE_MS);
  }
  function syncAnchor() {                                  // keep the anchor honest after a jump
    const span = sec.offsetHeight - stage.offsetHeight;
    if (span > 0) anchor = clamp(Math.round((window.scrollY - (sec.getBoundingClientRect().top + window.scrollY)) / (span / SEG)), 0, SEG);
  }
  ["wheel", "touchstart", "pointerdown", "keydown"].forEach((ev) =>
    addEventListener(ev, cancelTween, { passive: true }));
  addEventListener("scroll", () => {
    clearTimeout(idle);
    if (!settling) idle = setTimeout(settle, 160);
  }, { passive: true });

  const io = new IntersectionObserver((e) => {
    visible = e[0].isIntersecting;
    if (visible) syncAnchor();
    if (visible && !raf) raf = requestAnimationFrame(frame);
  }, { rootMargin: "100px" });
  io.observe(sec);

  if (window.Site) Site.onTheme(() => requestAnimationFrame(recolor));
  addEventListener("resize", () => { resize(); b = progress(); paintText(); });
  recolor(); resize(); b = progress(); paintText(); draw(b, 0);
})();
