/* Controller signal architecture: filters, pop-ups, fit-to-width. */
(function () {
  const C = (window.HOW_IT_WORKS && window.HOW_IT_WORKS.control) || { filters: {}, items: {} };
  document.getElementById("intro").textContent = C.intro || "";

  const bs = [...document.querySelectorAll(".filter")];
  const ns = [...document.querySelectorAll(".node,.simple-input")];
  const ps = [...document.querySelectorAll("svg .base")];
  const labs = [...document.querySelectorAll(".signal-label")];
  const dt = document.getElementById("dt"), ds = document.getElementById("ds");

  function apply(f) {
    ns.forEach((n) => n.classList.toggle("dim", f !== "all" && !n.classList.contains(f)));
    ps.forEach((p) => p.classList.toggle("dimpath", f !== "all" && !p.classList.contains(f)));
    labs.forEach((l) => (l.style.opacity = f === "all" || l.classList.contains(f) ? "1" : ".08"));
    const d = C.filters[f] || C.filters.all;
    if (!d) return;
    dt.textContent = d[0];
    ds.innerHTML = d[1].map((x) => '<div class="spec"><span>' + x[0] + "</span><strong>" + x[1] + "</strong></div>").join("");
  }
  bs.forEach((b) => b.addEventListener("click", () => {
    bs.forEach((x) => x.classList.toggle("active", x === b));
    apply(b.dataset.f);
  }));
  apply("all");

  function show(key, anchor, image) {
    const d = C.items[key];
    if (!d) return;
    EmbedUI.open({ kicker: d.kicker, title: d.title || key, role: d.role, specs: d.specs, image }, anchor);
  }
  document.querySelectorAll(".node").forEach((node) => {
    const name = node.querySelector(".name").textContent.trim();
    if (!C.items[name]) return;
    EmbedUI.clickable(node, "Open " + name + " information", () => {
      const img = node.querySelector("img");
      show(name, node, img && img.src);
    });
  });
  document.querySelectorAll(".signal-hit").forEach((p) => {
    p.setAttribute("tabindex", "0");
    p.setAttribute("role", "button");
    p.setAttribute("aria-label", "Open signal information");
    const go = () => show(p.dataset.info, p, null);
    p.addEventListener("click", go);
    p.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
  });

  /* fit board */
  const wrap = document.getElementById("scaleWrap"), board = document.getElementById("board");
  const sizer = document.createElement("div");
  sizer.style.overflow = "hidden";
  wrap.insertBefore(sizer, board); sizer.appendChild(board);
  function fit() {
    const s = Math.max(0.5, Math.min(wrap.clientWidth / 1450, 1));
    board.style.transform = "scale(" + s + ")";
    sizer.style.width = 1450 * s + "px"; sizer.style.height = 815 * s + "px";
    wrap.style.height = 815 * s + "px";
    EmbedUI.reportHeight();
  }
  new ResizeObserver(fit).observe(wrap);
  fit();
})();
