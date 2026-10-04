/* Fluid & airflow architecture: filters, animated flow, component pop-ups, fit-to-width. */
(function () {
  const C = (window.HOW_IT_WORKS && window.HOW_IT_WORKS.fluid) || { subsystems: {}, components: {} };
  const buttons = [...document.querySelectorAll(".filter")];
  const comps = [...document.querySelectorAll(".component")];
  const wires = [...document.querySelectorAll(".wire")];
  const svg = document.getElementById("flowSvg");
  const spray = document.getElementById("spray");

  /* animated flow overlay: a dashed clone of every wire */
  const overlays = wires.map((w) => {
    const c = w.cloneNode(false);
    c.setAttribute("class", "flow-particles " + [...w.classList].filter((x) => x !== "wire").join(" "));
    svg.appendChild(c);
    return { el: c, src: w };
  });

  function renderSpecs(key) {
    const d = C.subsystems[key] || C.subsystems.all;
    if (!d) return;
    // the whole spec block is optional (fluid2.html leaves it out)
    const title = document.getElementById("specTitle"), sum = document.getElementById("specSummary");
    if (title) title.textContent = d.title;
    if (sum) sum.textContent = d.summary;
    const grid = document.getElementById("specGrid");
    if (grid) {
      grid.innerHTML = (d.items || [])
        .map((x) => '<div class="spec"><span>' + x[0] + "</span><strong>" + x[1] + "</strong></div>")
        .join("");
    }
  }

  function applyFilter(f) {
    comps.forEach((c) => c.classList.toggle("dim", f !== "all" && !c.classList.contains(f)));
    wires.forEach((w) => {
      const on = f === "all" || w.classList.contains(f);
      w.classList.toggle("dim", !on);
      w.classList.toggle("hot", f !== "all" && on);
    });
    overlays.forEach((o) => {
      const on = f === "all" || o.src.classList.contains(f);
      o.el.classList.toggle("flow-dim", !on);
      o.el.classList.toggle("flow-hot", f !== "all" && on);
    });
    spray.classList.toggle("off", !(f === "all" || f === "air"));
    renderSpecs(f);
  }
  buttons.forEach((b) => b.addEventListener("click", () => {
    buttons.forEach((x) => x.classList.toggle("active", x === b));
    applyFilter(b.dataset.f);
  }));
  applyFilter("all");

  /* component pop-ups */
  comps.forEach((c) => {
    const name = c.querySelector(".name").textContent.trim();
    const d = C.components[name];
    if (!d) return;
    EmbedUI.clickable(c, "Open " + name + " specifications", () => {
      const img = c.querySelector(".photo img");
      EmbedUI.open({ kicker: d.kicker, title: name, role: d.role, specs: d.specs, image: img && img.src }, c);
    });
  });

  /* scale the 1600 px board to the available width */
  const wrap = document.getElementById("archWrap");
  const inner = document.getElementById("archInner");
  // a sizer holds the scaled size, so the wrapper only scrolls when really needed
  const sizer = document.createElement("div");
  sizer.style.overflow = "hidden";
  wrap.insertBefore(sizer, inner); sizer.appendChild(inner);
  function fit() {
    // never shrink below 50%: on phones the board scrolls sideways instead
    const s = Math.max(0.5, Math.min(wrap.clientWidth / 1600, 1));
    inner.style.transform = "scale(" + s + ")";
    sizer.style.width = 1600 * s + "px";
    sizer.style.height = inner.scrollHeight * s + "px";
    wrap.style.height = inner.scrollHeight * s + "px";
    EmbedUI.reportHeight();
  }
  new ResizeObserver(fit).observe(wrap);
  window.addEventListener("load", fit);
  fit();
})();
