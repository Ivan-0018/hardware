/* ============================================================
   EMBED BRIDGE — shared by every embedded diagram.
   - receives the theme from the parent page (and ?theme= on load)
   - reports its content height so the parent iframe fits exactly
   - forwards the pointer so the parent's circle cursor keeps
     tracking while the mouse is over the diagram
   - provides one shared information modal (window.EmbedUI.open)
   Uses postMessage, so it also works when opened from file://
   ============================================================ */
(function () {
  const root = document.documentElement;
  const parentWin = window.parent !== window ? window.parent : null;

  /* ---------- theme ---------- */
  function setTheme(t) { root.setAttribute("data-theme", t === "dark" ? "dark" : "light"); }
  const q = new URLSearchParams(location.search);
  setTheme(q.get("theme") || "light");

  /* ---------- messages from the parent ---------- */
  window.addEventListener("message", (e) => {
    const d = e.data || {};
    if (d.type === "theme") setTheme(d.theme);
    if (d.type === "cursor") root.classList.toggle("has-cursor", !!d.on);
  });

  /* ---------- height reporting ---------- */
  let lastH = 0;
  function reportHeight() {
    if (!parentWin) return;
    const h = Math.ceil(Math.max(document.body.scrollHeight, document.body.offsetHeight));
    if (Math.abs(h - lastH) < 2) return;
    lastH = h;
    parentWin.postMessage({ type: "embed-height", h }, "*");
  }
  window.EmbedUI = { reportHeight };
  if ("ResizeObserver" in window) new ResizeObserver(reportHeight).observe(document.body);
  window.addEventListener("load", () => { reportHeight(); setTimeout(reportHeight, 300); });
  window.addEventListener("resize", reportHeight);
  if (parentWin) parentWin.postMessage({ type: "embed-ready" }, "*");

  /* ---------- pointer forwarding ---------- */
  if (parentWin) {
    const HOT = "button,a,input,select,[role=button],.clickable";
    let raf = 0, last = null;
    document.addEventListener("mousemove", (e) => {
      last = { x: e.clientX, y: e.clientY, hot: !!(e.target.closest && e.target.closest(HOT)) };
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        parentWin.postMessage({ type: "embed-pointer", x: last.x, y: last.y, hot: last.hot }, "*");
      });
    });
    document.addEventListener("mousedown", () => parentWin.postMessage({ type: "embed-pointer-down", down: true }, "*"));
    document.addEventListener("mouseup", () => parentWin.postMessage({ type: "embed-pointer-down", down: false }, "*"));
    document.documentElement.addEventListener("mouseleave", () => parentWin.postMessage({ type: "embed-pointer-leave" }, "*"));
  }

  /* ---------- shared info modal ---------- */
  function buildModal() {
    const bd = document.createElement("div");
    bd.className = "info-backdrop";
    bd.setAttribute("aria-hidden", "true");
    bd.innerHTML =
      '<div class="info-modal" role="dialog" aria-modal="true" aria-labelledby="infoTitle">' +
      '<button class="info-close" type="button" aria-label="Close">&times;</button>' +
      '<div class="info-layout"><img class="info-image" alt="">' +
      '<div><div class="info-kicker"></div><h3 id="infoTitle"></h3><p class="info-role"></p>' +
      '<div class="info-specs"></div></div></div></div>';
    document.body.appendChild(bd);
    const close = () => { bd.classList.remove("open"); bd.setAttribute("aria-hidden", "true"); };
    bd.querySelector(".info-close").addEventListener("click", close);
    bd.addEventListener("click", (e) => { if (e.target === bd) close(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
    return bd;
  }
  let modal = null;
  window.EmbedUI.open = function (d, anchorEl) {
    modal = modal || buildModal();
    const img = modal.querySelector(".info-image");
    const layout = modal.querySelector(".info-layout");
    modal.querySelector(".info-kicker").textContent = d.kicker || "";
    modal.querySelector("h3").textContent = d.title || "";
    modal.querySelector(".info-role").textContent = d.role || "";
    modal.querySelector(".info-specs").innerHTML = (d.specs || [])
      .map((x) => '<div class="info-spec"><span>' + x[0] + "</span><strong>" + x[1] + "</strong></div>")
      .join("");
    if (d.image) { img.src = d.image; img.alt = d.title || ""; img.style.display = ""; layout.classList.remove("no-image"); }
    else { img.removeAttribute("src"); img.style.display = "none"; layout.classList.add("no-image"); }
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    // The iframe is as tall as its content, so centre the dialog near what was clicked.
    const box = modal.querySelector(".info-modal");
    const docH = document.body.scrollHeight;
    const y = anchorEl ? anchorEl.getBoundingClientRect().top : 80;
    box.style.marginTop = Math.max(10, Math.min(y - 60, docH - box.offsetHeight - 40)) + "px";
    modal.querySelector(".info-close").focus({ preventScroll: true });
  };

  /* make an element keyboard + click accessible */
  window.EmbedUI.clickable = function (el, label, fn) {
    el.classList.add("clickable");
    el.setAttribute("tabindex", "0");
    el.setAttribute("role", "button");
    if (label) el.setAttribute("aria-label", label);
    el.addEventListener("click", (e) => { e.stopPropagation(); fn(e); });
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fn(e); }
    });
  };
})();
