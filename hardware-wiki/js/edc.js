/* ============================================================
   ENGINEERING DESIGN CYCLE (EDC) widget
   EDC.mount(el, { shape, stages, title, onCycle })
     shape   : "circle" or "infinity"  (set in content/design-cycle-content.js)
     onCycle : called with an iteration index when one of the inner
               loops (previous iterations) is clicked
     -> { setCycle(i, total, title, texts, opts), setStage(i) }
   Text lives in content/design-cycle-content.js
   ============================================================ */
(function () {
  const NS = "http://www.w3.org/2000/svg";
  const TAU = Math.PI * 2;
  const reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pad2 = (n) => String(n).padStart(2, "0");
  const el = (tag, attrs, parent) => {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  };
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const MAX_LAPS = 8;

  /* ---------- the two shapes ----------
     pos(f, k): point at fraction f (0..1) along the loop, scaled by k
     offset   : where stage 1 sits (stage i is at f = (i + offset) / N)
     lapScale : size of the inner loop for the i-th previous iteration
                (i = 0 is the most recent one, drawn closest to the track) */
  const SHAPES = {
    circle: {
      viewBox: "-40 -26 380 352",
      offset: 0,
      pos(f, k) { const R = 112 * (k || 1); const a = TAU * f - Math.PI / 2; return [150 + R * Math.cos(a), 150 + R * Math.sin(a)]; },
      lapScale(i) { return (90 - i * 8) / 112; },
      label(x, y) { const dx = x - 150, dy = y - 150, d = Math.hypot(dx, dy) || 1; return [150 + dx / d * 148, 150 + dy / d * 146 + 3]; }
    },
    infinity: {
      viewBox: "0 -6 440 262",
      offset: 0.5, // the crossing point is f = 0
      pos(f, k) {
        const a = 188 * (k || 1), t = Math.PI / 2 + TAU * f, s = Math.sin(t), c = Math.cos(t), den = 1 + s * s;
        return [220 + a * c / den, 118 + a * s * c / den];
      },
      lapScale(i) { return 0.87 - i * 0.075; },
      label(x, y) { return [x, y < 118 ? y - 30 : y + 34]; }
    }
  };

  function pathD(shape, k) {
    let d = "";
    for (let i = 0; i <= 240; i++) {
      const p = shape.pos(i / 240, k);
      d += (i ? "L" : "M") + p[0].toFixed(2) + " " + p[1].toFixed(2);
    }
    return d + "Z";
  }

  function mount(host, opts) {
    const stages = opts.stages;
    const N = stages.length;
    const kind = opts.shape === "infinity" ? "infinity" : "circle";
    const shape = SHAPES[kind];
    const stageF = (i) => (i + shape.offset) / N;

    host.innerHTML =
      '<div class="edc edc-' + kind + '">' +
      '<div class="edc-graphic"></div>' +
      '<div class="edc-text"><div class="edc-head"><span class="kicker">' + esc(opts.title || "Engineering design cycle") +
      '</span><b class="edc-cycle-title"></b></div><div class="edc-cards"></div>' +
      (opts.foot ? '<div class="edc-foot">' + esc(opts.foot) + "</div>" : "") + "</div></div>";
    const g = host.querySelector(".edc-graphic");
    const titleEl = host.querySelector(".edc-cycle-title");
    const cardsEl = host.querySelector(".edc-cards");

    const svg = el("svg", { viewBox: shape.viewBox, role: "img", "aria-label": "Engineering design cycle diagram" }, g);
    const laps = el("g", {}, svg);
    const track = el("path", { class: "edc-track", d: pathD(shape) }, svg);
    const prog = el("path", { class: "edc-progress", d: pathD(shape) }, svg);
    const LEN = track.getTotalLength();
    prog.style.strokeDasharray = "0 " + LEN;

    // direction chevrons between stages
    for (let i = 0; i < N; i++) {
      const f = stageF(i) + 0.5 / N;
      const a = shape.pos(f - 0.004), b = shape.pos(f + 0.004), p = shape.pos(f);
      const ang = Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI;
      el("path", { class: "edc-chevron", d: "M-4 -5 L3 0 L-4 5", transform: "translate(" + p[0] + " " + p[1] + ") rotate(" + ang + ")" }, svg);
    }

    // cycle counter: in the middle of the circle, under the infinity
    let showCount;
    if (kind === "circle") {
      const k = el("text", { class: "edc-center-kicker", x: 150, y: 124 }, svg); k.textContent = "Cycle";
      const num = el("text", { class: "edc-center-num", x: 150, y: 168 }, svg);
      const of = el("text", { class: "edc-center-of", x: 150, y: 190 }, svg);
      showCount = (i, tot) => { num.textContent = pad2(i + 1); of.textContent = "of " + pad2(tot); };
    } else {
      const t = el("text", { class: "edc-center-of", x: 220, y: 250 }, svg);
      showCount = (i, tot) => { t.textContent = "Cycle " + pad2(i + 1) + " of " + pad2(tot); };
    }

    // traveller
    const halo = el("circle", { class: "edc-traveller-halo", r: 11 }, svg);
    const dot = el("circle", { class: "edc-traveller", r: 5 }, svg);

    // stage nodes
    const nodes = stages.map((s, i) => {
      const p = shape.pos(stageF(i));
      const n = el("g", { class: "edc-node", tabindex: 0, role: "button", "aria-label": s.name }, svg);
      el("circle", { cx: p[0], cy: p[1], r: 17 }, n);
      const num = el("text", { class: "edc-num", x: p[0], y: p[1] + 1 }, n); num.textContent = pad2(i + 1);
      const lp = shape.label(p[0], p[1]);
      const lab = el("text", { class: "edc-label", x: lp[0], y: lp[1] }, n); lab.textContent = s.name;
      const go = () => { userTook(); setStage(i); };
      n.addEventListener("click", go);
      n.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
      return n;
    });

    // cards
    const cards = stages.map((s, i) => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "edc-card";
      b.innerHTML = "<small><i>" + pad2(i + 1) + "</i>" + esc(s.name) + "</small><p></p>";
      b.addEventListener("click", () => { userTook(); setStage(i); });
      cardsEl.appendChild(b);
      return b;
    });

    /* ---------- state + animation ---------- */
    let fCur = stageF(0), stage = 0, raf = 0, cycle = 0, titles = [];
    function place(f) {
      const fr = ((f % 1) + 1) % 1;
      const p = shape.pos(fr);
      dot.setAttribute("cx", p[0]); dot.setAttribute("cy", p[1]);
      halo.setAttribute("cx", p[0]); halo.setAttribute("cy", p[1]);
      prog.style.strokeDasharray = fr * LEN + " " + LEN;
    }
    function animateTo(fTarget, dur, done) {
      cancelAnimationFrame(raf);
      if (reduce || dur <= 0) { fCur = fTarget % 1; place(fCur); if (done) done(); return; }
      const from = fCur, dist = fTarget - from, t0 = performance.now();
      const ease = (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
      (function step(ts) {
        const p = Math.min(1, (ts - t0) / dur);
        fCur = from + dist * ease(p);
        place(fCur);
        if (p < 1) raf = requestAnimationFrame(step); else { fCur = fTarget % 1; if (done) done(); }
      })(t0);
    }
    function paintStage() {
      nodes.forEach((n, i) => { n.classList.toggle("on", i === stage); n.classList.toggle("done", i < stage); });
      cards.forEach((c, i) => c.classList.toggle("on", i === stage));
    }
    function setStage(i, dur) {
      stage = Math.max(0, Math.min(N - 1, i));
      paintStage();
      const target = stageF(stage);
      animateTo(target, dur == null ? 260 + Math.abs(target - fCur) * 1400 : dur);
      if (opts.onStage) opts.onStage(stage);
    }

    /* inner loops = previous iterations; click one to jump back to it */
    function drawLaps() {
      laps.innerHTML = "";
      const n = Math.min(cycle, MAX_LAPS);
      for (let i = n - 1; i >= 0; i--) {
        const iter = cycle - 1 - i; // i = 0 is the most recent previous iteration
        const d = pathD(shape, shape.lapScale(i));
        const lap = el("g", { class: "edc-lap-group", tabindex: 0, role: "button",
          "aria-label": "Go to iteration " + (iter + 1) + (titles[iter] ? ": " + titles[iter] : "") }, laps);
        const tip = el("title", {}, lap); tip.textContent = "Iteration " + (iter + 1) + (titles[iter] ? " · " + titles[iter] : "");
        el("path", { class: "edc-lap", d, style: "opacity:" + Math.max(0.12, 0.34 - i * 0.03).toFixed(2) }, lap);
        el("path", { class: "edc-lap-hit", d }, lap);
        const go = () => { if (opts.onCycle) opts.onCycle(iter); };
        lap.addEventListener("click", go);
        lap.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
      }
      laps.classList.toggle("clickable", !!opts.onCycle);
    }

    /* autoplay: after a new cycle is chosen, walk through the stages once */
    let playTimer = 0, userStopped = false, visible = true;
    function userTook() { userStopped = true; clearTimeout(playTimer); }
    function autoplay() {
      clearTimeout(playTimer);
      if (reduce || userStopped || opts.autoplay === false) return;
      playTimer = setTimeout(function tick() {
        if (userStopped) return;
        if (!visible) { playTimer = setTimeout(tick, 600); return; }
        if (stage < N - 1) { setStage(stage + 1, 900); playTimer = setTimeout(tick, 2600); }
      }, 2600);
    }
    if ("IntersectionObserver" in window) {
      new IntersectionObserver((es) => { visible = es.some((e) => e.isIntersecting); }, { threshold: 0.35 }).observe(host);
    }

    function setCycle(i, tot, title, texts, o) {
      const forward = i > cycle;
      cycle = i;
      if (o && o.titles) titles = o.titles;
      titleEl.textContent = "Cycle " + pad2(i + 1) + (title ? " · " + title : "");
      showCount(i, tot);
      cards.forEach((c, k) => {
        const t = (texts && texts[stages[k].key]) || "To add.";
        const p = c.querySelector("p");
        p.textContent = t;
        p.classList.toggle("todo", /^to add/i.test(t));
      });
      drawLaps();
      userStopped = !!(o && o.noAutoplay);
      stage = 0; paintStage();
      if (forward && !(o && o.instant)) {
        // finish the current lap, then start the new cycle at stage 1
        const target = Math.ceil(fCur - stageF(0) + 1e-6) + stageF(0);
        animateTo(target, 1100, autoplay);
      } else {
        animateTo(stageF(0), o && o.instant ? 0 : 450, autoplay);
      }
      if (opts.onStage) opts.onStage(0);
    }

    place(fCur); paintStage();
    return { setCycle, setStage, stop: userTook };
  }

  window.EDC = { mount };
})();
