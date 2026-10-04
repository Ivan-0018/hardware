/* ============================================================
   DESIGN EXPLORER (index-explorer.html)
   Pick a component -> rotatable preview + iteration breakdown
   + its engineering design cycle.
   Content: design-cycle-content.js (sprayer, nozzle, explorer list)
            tank-content.js (tank)
   ============================================================ */
(function () {
  const D = window.DESIGN_CYCLE, T = window.TANK_CONTENT;
  const root = document.getElementById("explorer");
  if (!D || !root || !window.EDC) return;
  const $ = (sel) => root.querySelector(sel);
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const pad2 = (n) => String(n).padStart(2, "0");

  const ICONS = {
    sprayer: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="10" r="5"/><circle cx="38" cy="10" r="5"/><path d="M14 13l6 5M34 13l-6 5"/><rect x="18" y="17" width="12" height="9" rx="2"/><path d="M24 26v7"/><path d="M24 33l-6 8M24 33l6 8M24 33v9"/></svg>',
    tank: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M12 10h24v14l-12 4-12-4z"/><path d="M8 22l16 5 16-5v14l-16 5-16-5z"/><circle cx="24" cy="40" r="1.6"/></svg>',
    nozzle: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 20h16l8 4-8 4H6z"/><path d="M12 20v-7M12 28v7"/><circle cx="36" cy="24" r="1.4"/><circle cx="40" cy="19" r="1.2"/><circle cx="41" cy="28" r="1.2"/><circle cx="44" cy="23" r="1"/></svg>'
  };

  /* normalise every component into one shape */
  function studyFor(key) {
    if (key === "tank" && T) {
      return {
        model: window.TANK_MODEL || (T.current && T.current.model),
        frames: true,
        specs: T.current && T.current.specs,
        iterations: T.iterations.map((it) => ({ label: it.label, short: it.short || it.title, title: it.title, summary: it.body, cycle: it.cycle, note: it.note }))
      };
    }
    const S = D[key] || { iterations: [] };
    // the evolution view is drawn from the part lists; an inline copy of the 3D model
    // (models/*-model.js) is preferred so the viewer also works from file://
    const inline = window.MODEL_DATA && window.MODEL_DATA[key];
    return Object.assign({ flow: !!S.parts }, S, inline ? { model: inline } : {});
  }

  /* ---------- component box ---------- */
  const list = D.explorer || [];
  $(".xp-select").innerHTML = list.map((c) => {
    const n = (studyFor(c.key).iterations || []).length;
    // blurb: "" (empty string) hides the line under the component name altogether
    const sub = c.blurb === "" ? "" : "<span>" + esc(c.blurb) + " · " + n + (n === 1 ? " cycle" : " cycles") + "</span>";
    return '<button type="button" class="xp-comp" data-key="' + c.key + '" role="tab"><span class="xp-icon" aria-hidden="true">' + (ICONS[c.key] || ICONS.tank) +
      "</span><span class=\"xp-text\"><strong>" + esc(c.name) + "</strong>" + sub + "</span></button>";
  }).join("");
  const compBtns = [...root.querySelectorAll(".xp-comp")];
  compBtns.forEach((b) => b.addEventListener("click", () => select(b.dataset.key)));

  /* ---------- viewer ---------- */
  const viewer = $(".xp-viewer");
  const frameImg = document.createElement("img");
  frameImg.className = "xp-frame"; frameImg.alt = "Tank iteration drawing";
  let framePlayer = null;
  const mv = document.createElement("model-viewer");
  ["camera-controls", "auto-rotate"].forEach((a) => mv.setAttribute(a, ""));
  mv.setAttribute("touch-action", "pan-y");
  mv.setAttribute("camera-orbit", "18deg 52deg auto");
  mv.setAttribute("shadow-intensity", "1");
  mv.setAttribute("interaction-prompt", "none");
  const empty = document.createElement("div"); empty.className = "xp-empty";
  const modes = $(".xp-modes"), count = $(".xp-count"), hint = $(".xp-hint");

  let S = null, key = null, mode = "3d", iter = 0, edc = null;
  // footnotes under the viewer: overridable with DESIGN_CYCLE.hints ("" hides one)
  const hintText = (k, dflt) => (D.hints && k in D.hints ? D.hints[k] : dflt);
  // an iteration can carry its own note (e.g. "Drawing to add")
  const iterNote = () => { const it = S && S.iterations && S.iterations[iter]; return it && it.note ? it.note : ""; };
  function renderViewer() {
    [frameImg, mv, empty, flowEl].forEach((n) => n.remove());
    const hasModel = !!S.model;
    modes.innerHTML =
      (S.frames || S.flow ? '<button type="button" class="pill' + (mode === "evo" ? " on" : "") + '" data-m="evo">Evolution</button>' : "") +
      '<button type="button" class="pill' + (mode === "3d" ? " on" : "") + '" data-m="3d">3D model</button>';
    modes.querySelectorAll(".pill").forEach((p) => p.addEventListener("click", () => { mode = p.dataset.m; renderViewer(); }));
    if (mode === "evo" && S.frames) {
      viewer.appendChild(frameImg);
      if (!framePlayer) framePlayer = TankEvolution.player(frameImg);
      framePlayer.goTo(iter, true);
      hint.textContent = iterNote() || hintText("drawing", "Iteration drawing · inlet in teal, outlets in orange");
    } else if (mode === "evo" && S.flow) {
      viewer.appendChild(flowEl);
      renderFlow(iter, true);
      hint.textContent = hintText("flow", "Highlighted parts are new in this iteration");
    } else if (hasModel) {
      if (mv.getAttribute("src") !== S.model) {
        mv.setAttribute("camera-orbit", S.orbit || "18deg 52deg auto");
        mv.setAttribute("src", S.model);
      }
      mv.setAttribute("alt", "3D model");
      viewer.appendChild(mv);
      hint.textContent = hintText("model", "Drag to rotate · scroll to zoom");
    } else {
      empty.innerHTML = "3D model to add<code>set \"model\" for " + esc(key) + " in content/design-cycle-content.js</code>";
      viewer.appendChild(empty);
      hint.textContent = "";
    }
  }


  /* ---------- sprayer evolution: flow diagram per iteration ---------- */
  const flowEl = document.createElement("div");
  flowEl.className = "xp-flow";
  function partCell(key, isNew, extra) {
    const p = (S.parts && S.parts[key]) || { label: key, img: "" };
    const imgs = [].concat(p.img || []);
    return '<div class="xp-part' + (isNew ? " new" : "") + (extra || "") + '">' +
      '<div class="xp-part-img' + (imgs.length > 1 ? " pair" : "") + '">' +
      imgs.map((src) => '<img src="' + esc(src) + '" alt="">').join("") + "</div>" +
      (isNew ? '<span class="xp-new">New</span>' : "") +
      "<span>" + esc(p.label) + "</span></div>";
  }
  function renderFlow(k, instant) {
    const its = S.iterations, it = its[k], prev = k > 0 ? its[k - 1] : null;
    const before = prev ? [].concat(prev.liquid || [], prev.air || []) : null;
    const isNew = (key) => !!before && before.indexOf(key) < 0;
    const liquid = it.liquid || [], air = it.air || [];
    const removed = before ? before.filter((key) => liquid.indexOf(key) < 0 && air.indexOf(key) < 0) : [];
    const cols = liquid.length;
    let html = '<div class="xp-flow-grid" style="--cols:' + cols + '">';
    html += '<div class="xp-row-label" style="grid-column:1/-1">Liquid path</div>';
    liquid.forEach((key, i) => { html += partCell(key, isNew(key), i < cols - 1 ? " arrow" : ""); });
    if (air.length) {
      html += '<div class="xp-row-label" style="grid-column:1/-1">Air path</div>';
      const start = Math.max(1, cols - air.length);
      air.forEach((key, i) => {
        html += partCell(key, isNew(key), " arrow").replace('class="xp-part', 'style="grid-column:' + (start + i) + '" class="xp-part');
      });
      html += '<div class="xp-air-up" style="grid-column:' + cols + '" aria-hidden="true"><i></i><span>to nozzle</span></div>';
    }
    html += "</div>";
    if (removed.length) {
      html += '<div class="xp-removed">Removed: ' + removed.map((key) => esc(((S.parts || {})[key] || { label: key }).label)).join(", ") + "</div>";
    }
    flowEl.innerHTML = html;
    if (!instant) { flowEl.classList.remove("swap"); void flowEl.offsetWidth; flowEl.classList.add("swap"); }
  }

  /* ---------- breakdown ---------- */
  const dotsEl = $(".xp-dots"), fill = $(".iter-fill");
  function renderDots() {
    const its = S.iterations;
    dotsEl.innerHTML = "";
    its.forEach((it, k) => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "iter-dot"; b.title = it.title;
      b.setAttribute("aria-label", (it.label || "Iteration " + (k + 1)) + ": " + it.title);
      b.innerHTML = "<span>" + pad2(k + 1) + "</span>";
      b.addEventListener("click", () => showIter(k));
      dotsEl.appendChild(b);
    });
  }
  function showIter(k, first) {
    const its = S.iterations;
    iter = k;
    const it = its[k];
    $(".xp-label").textContent = it.label || "Iteration " + pad2(k + 1);
    $(".xp-title").textContent = it.title;
    $(".xp-body").textContent = it.summary || "";
    count.textContent = pad2(k + 1) + " / " + pad2(its.length);
    [...dotsEl.children].forEach((d, i) => { d.classList.toggle("on", i === k); d.classList.toggle("passed", i <= k); });
    fill.style.width = (its.length > 1 ? (k / (its.length - 1)) * 100 : 100) + "%";
    if (mode === "evo" && S.flow) renderFlow(k);
    const titles = its.map((x) => x.short || x.title);
    // the cycle diagram and the tank morph start together and finish together
    const ms = edc.setCycle(k, its.length, it.short || it.title, it.cycle, first ? { instant: true, titles } : { titles });
    if (mode === "evo" && S.frames && framePlayer) {
      framePlayer.goTo(k, false, { dur: ms });
      hint.textContent = iterNote() || hintText("drawing", "Iteration drawing · inlet in teal, outlets in orange");
    }
  }

  function select(k) {
    if (k === key) return;
    key = k; S = studyFor(k);
    compBtns.forEach((b) => { const on = b.dataset.key === k; b.classList.toggle("on", on); b.setAttribute("aria-selected", on); });
    mode = S.frames || S.flow ? "evo" : "3d";
    iter = 0;
    edc = EDC.mount($(".xp-cycle"), { shape: D.shape, stages: D.stages, title: D.title, onCycle: (k) => showIter(k) });
    renderDots();
    renderViewer();
    const specs = $(".xp-specs");
    specs.innerHTML = (S.specs || []).map((s) => '<div class="row"><dt>' + esc(s.label) + "</dt><dd>" + esc(s.value) + "</dd></div>").join("");
    specs.hidden = !S.specs;
    if (S.iterations.length) showIter(0, true);
  }

  select((list.find((c) => c.key === "tank") || list[0]).key);
})();
