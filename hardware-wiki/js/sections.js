/* ============================================================
   SECTIONS — renders the content files into the page.
   Each block checks its container exists, so both page
   versions (index.html / index-explorer.html) can share it.
   ============================================================ */
(function () {
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const pad2 = (n) => String(n).padStart(2, "0");

  /* ---------- BIOCOMPATIBILITY PENTAGON ---------- */
  (function () {
    const B = window.BIOCOMPAT, host = $("penta");
    if (!B || !host) return;
    const W = 520, H = 470, cx = 260, cy = 250, R = 185;
    const comps = B.components, N = comps.length;
    const pts = comps.map((c, i) => {
      const a = -Math.PI / 2 + (i * 2 * Math.PI) / N;
      return [cx + R * Math.cos(a), cy + R * Math.sin(a)];
    });
    const NS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 " + W + " " + H);
    svg.setAttribute("aria-hidden", "true");
    const edges = [];
    pts.forEach((p, i) => {
      const q = pts[(i + 1) % N], last = i === N - 1;
      const line = document.createElementNS(NS, "line");
      line.setAttribute("x1", p[0]); line.setAttribute("y1", p[1]); line.setAttribute("x2", q[0]); line.setAttribute("y2", q[1]);
      line.setAttribute("class", "edge " + (last ? "close" : "flow"));
      svg.appendChild(line);
      if (!last) {
        const f = line.cloneNode(); f.setAttribute("class", "edge-flow");
        svg.appendChild(f); edges.push(f);
      }
    });
    host.appendChild(svg);
    const center = document.createElement("div");
    center.className = "penta-center";
    center.innerHTML = "<strong>" + esc(B.center.title) + "</strong><span>" + esc(B.center.hint) + "</span>";
    host.appendChild(center);

    const detail = $("bioDetail");
    const nodes = comps.map((c, i) => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "penta-node";
      b.style.left = (pts[i][0] / W) * 100 + "%";
      b.style.top = (pts[i][1] / H) * 100 + "%";
      b.innerHTML = "<small>" + pad2(i + 1) + "</small>" + esc(c.name);
      b.setAttribute("aria-label", c.name + ": how it is biocompatible");
      b.addEventListener("click", () => select(i));
      host.appendChild(b);
      return b;
    });
    function select(i) {
      const c = comps[i];
      nodes.forEach((n, k) => { n.classList.toggle("on", k === i); n.setAttribute("aria-pressed", k === i); });
      edges.forEach((e, k) => e.classList.toggle("active", k === i || k === i - 1));
      detail.innerHTML =
        '<div class="fade-in"><div class="kicker">' + pad2(i + 1) + " · " + esc(c.role) + "</div>" +
        "<h3>" + esc(c.title) + "</h3><p>" + esc(c.text) + "</p>" +
        // the spec rows are optional: leave "specs" out (or empty) to show only the text
        ((c.specs && c.specs.length)
          ? '<dl class="bio-specs">' + c.specs.map((s) => "<div><dt>" + esc(s[0]) + "</dt><dd>" + esc(s[1]) + "</dd></div>").join("") + "</dl>"
          : "") + "</div>";
    }
    select(0);

  })();

  /* ---------- EXPERIMENTAL RESULTS ---------- */
  (function () {
    const R = window.RESULTS;
    if (!R) return;
    const v = R.viability;
    if ($("viability")) {
      $("viability").innerHTML =
        '<div class="sub-head"><h3>' + esc(v.title) + "</h3><span>" + esc(v.note) + "</span></div>" +
        '<div class="viability-visual">' +
        '<div class="micro-box placeholder"><div class="micro-label">Before spraying</div><div class="micro-placeholder"></div><div class="viability-number">' + esc(v.before) + "</div></div>" +
        '<div class="viability-arrow" aria-hidden="true">&rarr;</div>' +
        '<div class="micro-box placeholder"><div class="micro-label">After spraying</div><div class="micro-placeholder"></div><div class="viability-number">' + esc(v.after) + "</div></div></div>" +
        '<div class="retained"><div><span>Viability retained</span><strong>' + esc(v.retained) + "</strong></div></div>" +
        '<div class="stage-line">' + v.stages.map((s) => "<div>" + esc(s) + "</div>").join("") + "</div>";
    }
    if ($("metrics")) {
      $("metrics").innerHTML = R.metrics.map((m) =>
        '<div class="metric-card card"><small>' + esc(m.group) + "</small><h3>" + esc(m.title) + "</h3><strong>" + esc(m.value) +
        '</strong><div class="status">' + esc(m.status) + "</div></div>").join("");
    }
  })();

  /* ---------- generic picker: cards that switch panels ---------- */
  function picker(cardsEl, panels, onShow) {
    const cards = [...cardsEl.querySelectorAll(".pick")];
    function show(key) {
      cards.forEach((c) => { const on = c.dataset.key === key; c.classList.toggle("on", on); c.setAttribute("aria-selected", on); });
      panels.forEach((p) => p.classList.toggle("on", p.dataset.key === key));
      if (onShow) onShow(key);
    }
    cards.forEach((c) => c.addEventListener("click", () => show(c.dataset.key)));
    return show;
  }
  function lazyEmbeds(panel) {
    if (!window.Site) return;
    panel.querySelectorAll("iframe.embed[data-lazy]").forEach((f) => { if (f.offsetParent !== null) Site.loadEmbed(f); });
  }

  /* ---------- FEATURES ---------- */
  (function () {
    const F = window.FEATURES, cardsEl = $("featurePicker");
    if (!F || !cardsEl) return;
    const keys = ["lightweight", "compact", "modular", "adaptive"];
    const numbered = F.numbered !== false;
    cardsEl.innerHTML = keys.map((k, i) =>
      '<button type="button" role="tab" class="pick" data-key="' + k + '">' +
      (numbered ? '<span class="kicker"><span>' + pad2(i + 1) + "</span></span>" : "") +
      "<strong>" + esc(F[k].name) + "</strong>" + (F[k].blurb ? "<p>" + esc(F[k].blurb) + "</p>" : "") +
      (F[k].stat ? '<span class="stat">' + esc(F[k].stat) + "</span>" : "") + "</button>").join("");

    if (F.simple) {
      // plain panels: heading, one key value and a short description (no placeholder graphics)
      ["lightweight", "compact", "modular"].forEach((k) => {
        const f = F[k], el = $("feat-" + k);
        if (!el) return;
        const todo = /^to add/i.test(f.value || "");
        el.innerHTML = '<div class="feat-simple">' +
          (f.value ? '<div class="big-stat"><strong' + (todo ? ' class="todo"' : "") + ">" + esc(f.value) + "</strong>" +
            (f.valueLabel ? "<span>" + esc(f.valueLabel) + "</span>" : "") + "</div>" : "") +
          '<div><h3>' + esc(f.heading || f.name) + "</h3><p>" + esc(f.text || f.blurb) + "</p></div></div>";
      });
    } else {
    const L = F.lightweight, C = F.compact, M = F.modular;
    $("feat-lightweight").innerHTML =
      '<div class="sub-head"><h3>' + esc(L.heading) + "</h3><span>" + esc(L.note) + "</span></div>" +
      '<div class="weight-layout"><div class="exploded placeholder">' +
      L.parts.map((p) => '<div class="mass-node"><strong>' + esc(p[0]) + "</strong><span>" + esc(p[1]) + "</span></div>").join("") +
      '</div><div class="big-stat"><strong' + (/^to add/i.test(L.total) ? ' class="todo"' : "") + ">" + esc(L.total) +
      "</strong><span>" + esc(L.totalLabel) + "</span><p>" + esc(L.target) + "</p></div></div>";
    $("feat-compact").innerHTML =
      '<div class="sub-head"><h3>' + esc(C.heading) + "</h3><span>" + esc(C.note) + "</span></div>" +
      '<div class="dimension-grid">' + C.views.map((v) =>
        '<div class="ortho placeholder">' + esc(v.caption) + ' (CAD to add)<span class="dimension-label ' + v.side + '">' + esc(v.label) + "</span></div>").join("") + "</div>" +
      '<div class="stat-row">' + C.stats.map((s) => "<div><strong" + (/^to add/i.test(s[0]) ? ' class="todo"' : "") + ">" +
        esc(s[0]) + "</strong><span>" + esc(s[1]) + "</span></div>").join("") + "</div>";
    $("feat-modular").innerHTML =
      '<div class="sub-head"><h3>' + esc(M.heading) + "</h3><span>" + esc(M.note) + "</span></div>" +
      '<div class="modular-layout"><div class="modular-visual placeholder">' +
      '<svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><line x1="50" y1="20" x2="50" y2="38"/><line x1="22" y1="80" x2="40" y2="60"/><line x1="78" y1="80" x2="60" y2="60"/></svg>' +
      M.drones.map((d) => '<div class="drone">' + esc(d) + "</div>").join("") +
      '<div class="payload">SPRAYER<br>PAYLOAD</div></div>' +
      '<div><div class="point-list">' + M.points.map((p) => "<div><strong>" + esc(p[0]) + "</strong><span>" + esc(p[1]) + "</span></div>").join("") +
      '</div><p class="hint" style="font-size:18px;color:var(--burg);font-weight:800;letter-spacing:-.02em">' + esc(M.closing) + "</p></div></div>";
    }

    const panels = [...document.querySelectorAll("#features .panel")];
    const show = picker(cardsEl, panels, (k) => lazyEmbeds($("feat-" + k)));
    show("lightweight");
  })();

  /* ---------- HOW IT WORKS ---------- */
  (function () {
    const cardsEl = $("hiwPicker");
    if (!cardsEl) return;
    const panels = [...document.querySelectorAll("#how-it-works .panel")];
    const show = picker(cardsEl, panels, (k) => lazyEmbeds($("hiw-" + k)));
    // electronics sub-toggle
    const pills = [...document.querySelectorAll("#hiw-electronics .pill")];
    const subs = [...document.querySelectorAll("#hiw-electronics .sub-panel")];
    pills.forEach((p) => p.addEventListener("click", () => {
      pills.forEach((x) => x.classList.toggle("on", x === p));
      subs.forEach((s) => { s.hidden = s.dataset.key !== p.dataset.key; });
      lazyEmbeds($("hiw-electronics"));
    }));
    show("spray");
  })();

  /* ---------- ENGINEERING CHALLENGES ---------- */
  (function () {
    const P = window.PAGE;
    if (!P) return;
    if ($("challengeGrid")) $("challengeGrid").innerHTML = P.challenges.map((c, i) =>
      '<div class="challenge"><div class="n">' + pad2(i + 1) + "</div><h3>" + esc(c.title) + "</h3>" + (c.tags ? "<p>" + esc(c.tags) + "</p>" : "") +
      (c.answer ? '<p class="answer"><b>Our answer:</b> ' + esc(c.answer) + "</p>" : "") + "</div>").join("");

    /* open hardware */
    if ($("buildGrid")) {
      $("buildGrid").innerHTML = P.openHardware.cards.map((c) =>
        '<a class="build-card card' + (c.small || c.text ? "" : " plain") + '" href="' + esc(c.href) + '">' +
        (c.small ? "<small>" + esc(c.small) + "</small>" : "") + "<strong>" + esc(c.title) + " &rarr;</strong>" +
        (c.text ? "<span>" + esc(c.text) + "</span>" : "") + "</a>").join("");
      if ($("guideRow")) $("guideRow").innerHTML = (P.openHardware.guides || []).map((g) => '<span class="guide-pill">' + esc(g) + "</span>").join("");
    }

    /* bill of materials */
    const bom = P.bom;
    if ($("bomBody")) {
      const money = (n) => "$" + n.toFixed(2);
      let total = 0, tbd = false, count = 0;
      $("bomBody").innerHTML = bom.items.map((it) => {
        const sub = it.unitCost == null ? null : it.unitCost * it.qty;
        if (sub == null) tbd = true; else total += sub;
        count += it.qty;
        return '<tr data-cat="' + it.cat + '"><td><strong>' + esc(it.name) + "</strong><br><small>" + esc(it.role) + "</small></td>" +
          '<td><span class="cat">' + esc(bom.categories[it.cat] || it.cat) + '</span></td><td class="num">' + it.qty + "</td>" +
          '<td class="num">' + (it.unitCost == null ? "TBD" : money(it.unitCost)) + '</td><td class="num">' + (sub == null ? "TBD" : money(sub)) + "</td>" +
          "<td>" + (it.url ? '<a target="_blank" rel="noopener" href="' + esc(it.url) + '">' + esc(it.supplier) + " &nearr;</a>" : esc(it.supplier)) + "</td></tr>";
      }).join("");
      if ($("bomSummary")) $("bomSummary").innerHTML =
        "<div><strong>" + bom.items.length + "</strong><span>Component types</span></div>" +
        "<div><strong>" + count + "</strong><span>Total components</span></div>" +
        "<div><strong>" + money(total) + (tbd ? "+" : "") + "</strong><span>Current listed hardware cost</span></div>";
      if ($("bomHeadline")) $("bomHeadline").textContent = bom.headline;
      const filters = $("bomFilters");
      filters.innerHTML = '<button class="pill on" data-cat="all">All</button>' +
        Object.keys(bom.categories).map((k) => '<button class="pill" data-cat="' + k + '">' + esc(bom.categories[k]) + "</button>").join("");
      const fs = [...filters.querySelectorAll(".pill")], rows = [...$("bomBody").querySelectorAll("tr")];
      fs.forEach((b) => b.addEventListener("click", () => {
        fs.forEach((x) => x.classList.toggle("on", x === b));
        rows.forEach((r) => r.classList.toggle("hidden", b.dataset.cat !== "all" && r.dataset.cat !== b.dataset.cat));
      }));
    }

    if ($("futureGrid")) $("futureGrid").innerHTML = P.future.map((f) =>
      '<div class="future-item"><strong>' + esc(f.title) + "</strong><span>" + esc(f.text) + "</span></div>").join("");
  })();
})();
