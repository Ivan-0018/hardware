/* ============================================================
   SITE — theme toggle, nav, embeds, circle cursor, sand
   (cursor + sand follow the Tank-design website)
   ============================================================ */
(function () {
  const root = document.documentElement;
  const listeners = [];
  const Site = (window.Site = {
    theme: () => root.getAttribute("data-theme") || "light",
    onTheme: (fn) => listeners.push(fn)
  });

  /* ---------- theme ---------- */
  function setTheme(t) {
    root.setAttribute("data-theme", t);
    try { localStorage.setItem("hw-theme", t); } catch (e) {}
    listeners.forEach((fn) => fn(t));
  }
  const toggle = document.getElementById("theme-toggle");
  if (toggle) toggle.addEventListener("click", () => setTheme(Site.theme() === "dark" ? "light" : "dark"));

  /* ---------- side list: active section + progress ---------- */
  const links = [...document.querySelectorAll(".toc-list a")];
  const progress = document.querySelector(".toc-progress");
  const targets = links.map((a) => document.querySelector(a.getAttribute("href")));
  function onScroll() {
    const y = window.scrollY + innerHeight * 0.35;
    let cur = 0;
    targets.forEach((t, i) => { if (t && t.getBoundingClientRect().top + window.scrollY <= y) cur = i; });
    links.forEach((a, i) => { a.classList.toggle("on", i === cur); a.classList.toggle("passed", i < cur); });
    if (progress) {
      const h = document.documentElement.scrollHeight - innerHeight;
      progress.style.height = (h > 0 ? Math.min(1, window.scrollY / h) * 100 : 0) + "%";
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  window.addEventListener("load", onScroll);
  onScroll();

  /* ---------- embeds (iframes talk to us with postMessage) ---------- */
  const frames = new Map(); // contentWindow -> iframe
  const cursorOn = window.matchMedia && matchMedia("(pointer:fine)").matches;
  Site.loadEmbed = function (frame) {
    if (frame.dataset.loaded) return;
    frame.dataset.loaded = "1";
    frame.src = frame.dataset.src + "?theme=" + Site.theme();
    frame.addEventListener("load", () => {
      frames.set(frame.contentWindow, frame);
      frame.contentWindow.postMessage({ type: "theme", theme: Site.theme() }, "*");
      frame.contentWindow.postMessage({ type: "cursor", on: cursorOn }, "*");
    });
  };
  document.querySelectorAll("iframe.embed[data-src]:not([data-lazy])").forEach(Site.loadEmbed);
  Site.onTheme((t) => frames.forEach((f, w) => w.postMessage({ type: "theme", theme: t }, "*")));

  const cursorAPI = {};
  window.addEventListener("message", (e) => {
    const d = e.data || {};
    let frame = frames.get(e.source);
    if (!frame) {
      // message may arrive before our load handler ran
      frame = [...document.querySelectorAll("iframe.embed")].find((f) => f.contentWindow === e.source);
      if (frame) frames.set(e.source, frame);
    }
    if (!frame) return;
    if (d.type === "embed-height" && d.h > 50) frame.style.height = d.h + "px";
    if (d.type === "embed-ready") {
      e.source.postMessage({ type: "theme", theme: Site.theme() }, "*");
      e.source.postMessage({ type: "cursor", on: cursorOn }, "*");
    }
    if (d.type === "embed-pointer" && cursorAPI.move) {
      const r = frame.getBoundingClientRect();
      cursorAPI.move(r.left + d.x, r.top + d.y, d.hot);
    }
    if (d.type === "embed-pointer-down" && cursorAPI.press) cursorAPI.press(d.down);
    if (d.type === "embed-pointer-leave" && cursorAPI.hide) cursorAPI.hide();
  });

  /* ---------- circle cursor ---------- */
  if (cursorOn) {
    root.classList.add("has-cursor");
    const ring = document.createElement("div"); ring.id = "cursor";
    const dot = document.createElement("div"); dot.id = "cursor-dot";
    document.body.append(ring, dot);
    let rx = innerWidth / 2, ry = innerHeight / 2, tx = rx, ty = ry;
    const HOT = "button,a,input,select,label,[role=button],[role=tab],model-viewer,.pick,.penta-node,.iter-dot,.edc-node,.edc-card,.edc-lap-hit,.xp-comp";
    cursorAPI.move = (x, y, hot) => {
      tx = x; ty = y;
      dot.style.transform = "translate(" + x + "px," + y + "px) translate(-50%,-50%)";
      ring.style.opacity = "1"; dot.style.opacity = "1";
      ring.classList.toggle("big", !!hot);
    };
    cursorAPI.press = (down) => ring.classList.toggle("down", !!down);
    cursorAPI.hide = () => { ring.style.opacity = "0"; dot.style.opacity = "0"; };
    addEventListener("mousemove", (e) => cursorAPI.move(e.clientX, e.clientY, !!(e.target.closest && e.target.closest(HOT))));
    // leaving the window, or entering an iframe (it takes over via postMessage)
    document.addEventListener("mouseout", (e) => { if (!e.relatedTarget) cursorAPI.hide(); });
    addEventListener("mousedown", () => cursorAPI.press(true));
    addEventListener("mouseup", () => cursorAPI.press(false));
    (function loop() {
      rx += (tx - rx) * 0.18; ry += (ty - ry) * 0.18;
      ring.style.transform = "translate(" + rx + "px," + ry + "px) translate(-50%,-50%)";
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- floating sand (mouse + scroll reactive) ---------- */
  const cv = document.getElementById("sand");
  if (cv && !(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches)) {
    const ctx = cv.getContext("2d");
    let W, H, DPR, parts = [], c1 = "#9a5f33", c2 = "#a5737d";
    let mx = -999, my = -999, boost = 0, lastY = window.scrollY;
    const R = 130;
    const mk = () => ({
      x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.9 + 0.5,
      vx: Math.random() * 0.22 + 0.04, vy: (Math.random() - 0.5) * 0.1,
      a: Math.random() * 0.4 + 0.16, rose: Math.random() < 0.34
    });
    function resize() {
      DPR = Math.min(2, window.devicePixelRatio || 1);
      W = innerWidth; H = innerHeight;
      cv.width = W * DPR; cv.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      parts = Array.from({ length: Math.round((W * H) / 11000) }, mk);
    }
    function recolor() {
      const cs = getComputedStyle(root);
      c1 = cs.getPropertyValue("--sand").trim() || c1;
      c2 = cs.getPropertyValue("--sand2").trim() || c2;
    }
    Site.onTheme(() => requestAnimationFrame(recolor));
    Site.sandPointer = (x, y) => { mx = x; my = y; };
    addEventListener("mousemove", (e) => { mx = e.clientX; my = e.clientY; });
    document.addEventListener("mouseout", (e) => { if (!e.relatedTarget) { mx = -999; my = -999; } });
    addEventListener("scroll", () => {
      boost = Math.min(7, boost + Math.abs(window.scrollY - lastY) * 0.05);
      lastY = window.scrollY;
    }, { passive: true });
    const oldMove = cursorAPI.move;
    if (oldMove) cursorAPI.move = (x, y, hot) => { oldMove(x, y, hot); mx = x; my = y; };
    (function loop() {
      ctx.clearRect(0, 0, W, H);
      boost *= 0.92;
      const speed = 1 + boost;
      for (const p of parts) {
        p.x += p.vx * speed;
        p.y += p.vy * speed * 0.7;
        const dx = p.x - mx, dy = p.y - my, d2 = dx * dx + dy * dy;
        let near = 0;
        if (d2 < R * R) {
          const d = Math.sqrt(d2) || 1; near = 1 - d / R;
          const f = near * near * 6;
          p.x += (dx / d) * f; p.y += (dy / d) * f;
        }
        if (p.x > W + 4) p.x = -4; else if (p.x < -4) p.x = W + 4;
        if (p.y > H + 4) p.y = -4; else if (p.y < -4) p.y = H + 4;
        ctx.globalAlpha = Math.min(1, p.a * (1 + near * 1.1));
        ctx.fillStyle = p.rose ? c2 : c1;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * (1 + near * 0.9), 0, 6.283); ctx.fill();
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(loop);
    })();
    resize(); recolor();
    addEventListener("resize", resize);
  }
})();
