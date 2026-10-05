/* ============================================================
   PROLOGUE SCENE — "tech"
   The same choreography as the pencil version, drawn as a clean
   technical schematic instead: crisp lines, filled component
   chips, dashed guides and a dotted baseline grid.
     dune -> drone fly-past -> off-the-shelf nozzle ruled out ->
     the parts slide in and get wired together -> everything
     folds into the payload under the sprayer.

   Used by index3.html (content sets PROLOGUE.scene = "tech").
   ============================================================ */
(function () {
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const ramp = (v, a, b) => clamp((v - a) / (b - a), 0, 1);
  const ease = (t) => t * t * (3 - 2 * t);
  const lerp = (a, b, t) => a + (b - a) * t;
  const rand = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return (x - Math.floor(x)) * 2 - 1; };

  let W = 0, H = 0, C = {};
  const px = (f) => f * W, py = (f) => f * H;

  /* ---------- crisp drawing helpers ---------- */
  /* a polyline that can draw itself in: "amt" is how much of its length is shown */
  function line(ctx, pts, o) {
    o = o || {};
    const amt = clamp(o.amt == null ? 1 : o.amt, 0, 1);
    if (amt <= 0.002 || pts.length < 2) return;
    let total = 0;
    for (let i = 1; i < pts.length; i++) total += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    let want = total * amt;
    ctx.save();
    ctx.lineCap = o.cap || "round"; ctx.lineJoin = "round";
    ctx.strokeStyle = o.col || C.ink;
    ctx.globalAlpha = o.alpha == null ? 0.9 : o.alpha;
    ctx.lineWidth = o.w || 1.5;
    if (o.dash) ctx.setLineDash(o.dash);
    ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length && want > 0; i++) {
      const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
      const d = Math.hypot(x1 - x0, y1 - y0);
      if (d <= want) { ctx.lineTo(x1, y1); want -= d; }
      else { ctx.lineTo(lerp(x0, x1, want / d), lerp(y0, y1, want / d)); want = 0; }
    }
    ctx.stroke(); ctx.restore();
  }
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x, y, w, h, r); else ctx.rect(x, y, w, h);
  }
  function chipBox(ctx, x, y, w, h, a, accent) {
    ctx.save(); ctx.globalAlpha = a;
    roundRect(ctx, x, y, w, h, 9);
    ctx.fillStyle = C.card || C.bg2; ctx.fill();
    ctx.strokeStyle = accent ? C.burg : C.line; ctx.lineWidth = 1.4; ctx.globalAlpha = a * 0.9; ctx.stroke();
    ctx.restore();
  }
  function arc(ctx, cx, cy, r, a, o) {
    o = o || {};
    if (a <= 0.02) return;
    ctx.save(); ctx.strokeStyle = o.col || C.ink; ctx.lineWidth = o.w || 1.4;
    ctx.globalAlpha = (o.alpha == null ? 0.9 : o.alpha);
    ctx.beginPath(); ctx.arc(cx, cy, r, -1.3, -1.3 + 6.283 * a); ctx.stroke(); ctx.restore();
  }
  function dot(ctx, x, y, r, a, col) {
    ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = col || C.teal;
    ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill(); ctx.restore();
  }
  function label(ctx, x, y, text, a, size, col, weight) {
    if (a <= 0.02) return;
    ctx.save();
    ctx.globalAlpha = clamp(a, 0, 1); ctx.fillStyle = col || C.muted;
    ctx.font = (weight || 900) + " " + (size || 10) + 'px "Lexend", ui-sans-serif, system-ui, sans-serif';
    ctx.textAlign = "center";
    const s = text.toUpperCase();
    if ("letterSpacing" in ctx) ctx.letterSpacing = "1.4px";
    ctx.fillText(s, x, y);
    ctx.restore();
  }
  function arrow(ctx, x0, y0, x1, y1, a, col) {
    if (a <= 0.02) return;
    line(ctx, [[x0, y0], [x1, y1]], { amt: a, col: col || C.burg, w: 1.3, alpha: 0.6 });
    if (a > 0.9) {
      const ang = Math.atan2(y1 - y0, x1 - x0), h = 6.5;
      line(ctx, [[x1 - Math.cos(ang - 0.45) * h, y1 - Math.sin(ang - 0.45) * h], [x1, y1],
                 [x1 - Math.cos(ang + 0.45) * h, y1 - Math.sin(ang + 0.45) * h]], { amt: 1, col: col || C.burg, w: 1.3, alpha: 0.6 });
    }
  }

  /* ---------- components ---------- */
  function tank(ctx, x, y, s, a) {
    chipBox(ctx, x - 20 * s, y - 20 * s, 40 * s, 40 * s, a);
    line(ctx, [[x - 12 * s, y - 11 * s], [x + 12 * s, y - 11 * s], [x + 12 * s, y + 4 * s], [x, y + 13 * s], [x - 12 * s, y + 4 * s], [x - 12 * s, y - 11 * s]],
      { amt: a, col: C.burg, w: 1.6, alpha: 0.85 * a });
    line(ctx, [[x - 4 * s, y - 11 * s], [x - 4 * s, y - 16 * s]], { amt: a, col: C.burg, w: 1.6, alpha: 0.6 * a });
  }
  function pump(ctx, x, y, s, a) {
    chipBox(ctx, x - 20 * s, y - 20 * s, 40 * s, 40 * s, a);
    arc(ctx, x, y, 12 * s, a, { col: C.burg, w: 1.6, alpha: 0.85 * a });
    arc(ctx, x, y, 4.5 * s, a, { col: C.burg, w: 1.4, alpha: 0.5 * a });
    for (let k = 0; k < 3; k++) {
      const ang = k * 2.09 + 0.4 + a * 1.2;
      line(ctx, [[x + Math.cos(ang) * 4.5 * s, y + Math.sin(ang) * 4.5 * s], [x + Math.cos(ang) * 11 * s, y + Math.sin(ang) * 11 * s]],
        { amt: a, col: C.burg, w: 1.3, alpha: 0.55 * a });
    }
  }
  function wye(ctx, x, y, s, a) {
    chipBox(ctx, x - 20 * s, y - 20 * s, 40 * s, 40 * s, a);
    line(ctx, [[x - 12 * s, y - 9 * s], [x - 1 * s, y]], { amt: a, col: C.green, w: 2, alpha: 0.9 * a });
    line(ctx, [[x - 12 * s, y + 9 * s], [x - 1 * s, y]], { amt: a, col: C.blue, w: 2, alpha: 0.9 * a });
    line(ctx, [[x - 1 * s, y], [x + 13 * s, y]], { amt: a, col: C.burg, w: 2, alpha: 0.9 * a });
  }
  function sensor(ctx, x, y, s, a) {
    chipBox(ctx, x - 20 * s, y - 20 * s, 40 * s, 40 * s, a);
    arc(ctx, x, y - 2 * s, 10 * s, a, { col: C.burg, w: 1.6, alpha: 0.85 * a });
    line(ctx, [[x, y - 2 * s], [x + 6 * s, y - 7 * s]], { amt: a, col: C.burg, w: 1.5, alpha: 0.8 * a });
    line(ctx, [[x - 5 * s, y + 11 * s], [x + 5 * s, y + 11 * s]], { amt: a, col: C.burg, w: 1.5, alpha: 0.5 * a });
  }
  function nozzle(ctx, x, y, s, a, spray, t) {
    chipBox(ctx, x - 20 * s, y - 20 * s, 40 * s, 40 * s, a);
    line(ctx, [[x - 11 * s, y - 10 * s], [x + 11 * s, y - 10 * s], [x + 5 * s, y + 5 * s], [x - 5 * s, y + 5 * s], [x - 11 * s, y - 10 * s]],
      { amt: a, col: C.burg, w: 1.6, alpha: 0.85 * a });
    if (spray > 0.02) {
      for (let k = 0; k < 10; k++) {
        const f = ((k * 0.21 + t * 0.5) % 1);
        dot(ctx, x + rand(k * 2.7) * 11 * s * f, y + 6 * s + f * 14 * s, 1.5 * s, 0.6 * spray * (1 - f * 0.6), C.teal);
      }
    }
  }
  function drone(ctx, x, y, s, a, bob, t) {
    const yy = y + bob;
    line(ctx, [[x - 52 * s, yy - 8 * s], [x - 18 * s, yy + 2 * s], [x + 18 * s, yy + 2 * s], [x + 52 * s, yy - 8 * s]], { amt: a, w: 2.2, col: C.ink, alpha: 0.92 });
    ctx.save(); ctx.globalAlpha = clamp(a * 1.4 - 0.4, 0, 1);
    roundRect(ctx, x - 22 * s, yy, 44 * s, 17 * s, 5 * s);
    ctx.fillStyle = C.card || C.bg2; ctx.fill(); ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.stroke();
    ctx.restore();
    [-52, 52].forEach((o) => {
      arc(ctx, x + o * s, yy - 11 * s, 15 * s, clamp(a * 1.5 - 0.45, 0, 1), { col: C.ink, w: 1.4, alpha: 0.45 });
      line(ctx, [[x + o * s, yy - 11 * s], [x + o * s, yy - 6 * s]], { amt: clamp(a * 1.6 - 0.6, 0, 1), w: 1.6, alpha: 0.7 });
      const bl = 16 * s * (0.6 + 0.4 * Math.sin(t * 9 + o));
      line(ctx, [[x + o * s - bl, yy - 11 * s], [x + o * s + bl, yy - 11 * s]], { amt: clamp(a * 1.7 - 0.7, 0, 1), w: 1.2, alpha: 0.3 });
    });
    return yy;
  }

  const SLOTS = ["tank", "tank", "pump", "pump", "wye", "sensor", "nozzle"];
  const NAMES = ["Treatment", "Diluent", "Pump 1", "Pump 2", "Y-connector", "Sensor", "Nozzle"];
  const DRAW = { tank: tank, pump: pump, wye: wye, sensor: sensor, nozzle: nozzle };

  const scene = {
    resize: function (w, h) { W = w; H = h; },
    draw: function (ctx, s) {
      W = s.W; H = s.H; C = s.col;
      const p = s.p, t = s.t;
      ctx.clearRect(0, 0, W, H);
      const sc = clamp(W / 1400, 0.65, 1.15);
      const ridge = (x) => py(0.845) + Math.sin(x * 4.1 + 0.9) * py(0.03) + Math.sin(x * 9.7 + 2.3) * py(0.014);

      /* dotted baseline grid */
      const sheet = ease(ramp(p, 0, 0.06));
      ctx.save(); ctx.globalAlpha = 0.5 * sheet; ctx.fillStyle = C.line || C.muted;
      for (let gx = 30; gx < W; gx += 40) for (let gy = py(0.5); gy < H; gy += 40) {
        ctx.beginPath(); ctx.arc(gx, gy, 1, 0, 6.283); ctx.fill();
      }
      ctx.restore();

      /* 1 — the ground */
      const dune = 0.12 + 0.88 * ease(ramp(p, 0, 0.15));   // a little ground is there from the start
      const pts = [];
      for (let i = 0; i <= 60; i++) { const f = i / 60; pts.push([px(f), ridge(f)]); }
      if (dune > 0.02) {                       // filled body under the profile line
        ctx.save(); ctx.globalAlpha = 0.5 * dune; ctx.fillStyle = C.bg2;
        ctx.beginPath(); ctx.moveTo(0, H);
        pts.slice(0, Math.max(2, Math.round(pts.length * dune))).forEach((q) => ctx.lineTo(q[0], q[1]));
        ctx.lineTo(px(dune), H); ctx.closePath(); ctx.fill(); ctx.restore();
      }
      line(ctx, pts, { amt: dune, w: 2, col: C.burg, alpha: 0.55 });
      const ticks = ease(ramp(p, 0.05, 0.19));
      for (let i = 0; i < 48; i++) {
        const f = (i + 0.5) / 48, x = px(f), y0 = ridge(f);
        line(ctx, [[x, y0 + 4], [x - 8, y0 + 18]], { amt: clamp(ticks * 1.5 - f * 0.5, 0, 1), w: 1, col: C.burg, alpha: 0.2 });
      }

      /* 2 — the fly-past */
      const gone = 1 - ease(ramp(p, 0.44, 0.54));
      const dr = ease(ramp(p, 0.17, 0.3)) * gone;
      const pass = ease(ramp(p, 0.2, 0.42));
      if (dr > 0.02) {
        const dx = lerp(px(0.18), px(0.82), pass);
        line(ctx, [[px(0.08), py(0.6)], [px(0.94), py(0.6)]], { amt: ease(ramp(p, 0.2, 0.4)), w: 1, col: C.muted, alpha: 0.3 * gone, dash: [5, 7] });
        const dy = drone(ctx, dx, py(0.6), sc, dr, Math.sin(t * 1.3) * 3, t);
        for (let k = 0; k < 18; k++) {
          const f = ((k * 0.17 + t * 0.3) % 1);
          const yy = dy + 20 * sc + f * (ridge(dx / W) - dy - 20 * sc);
          dot(ctx, dx + rand(k) * 26 * sc * f, yy, 1.8 * sc, 0.5 * pass * gone * (1 - f * 0.4), C.teal);
        }
        label(ctx, dx, dy - 32 * sc, "spores + carrier", ease(ramp(p, 0.24, 0.32)) * gone, 10, C.soft || C.muted);
      }

      /* 3 — the off-the-shelf nozzle, ruled out */
      const bad = ease(ramp(p, 0.42, 0.52)) * (1 - ease(ramp(p, 0.62, 0.68)));
      if (bad > 0.02) {
        const bx = px(0.5), by = py(0.63), bs = sc * 1.9;
        nozzle(ctx, bx, by, bs, bad, ease(ramp(p, 0.46, 0.54)) * bad, t);
        label(ctx, bx, by - 30 * bs, "off-the-shelf nozzle", bad, 10, C.soft || C.muted);
        const no = ease(ramp(p, 0.55, 0.64));
        arc(ctx, bx, by, 30 * bs, no, { col: C.red, w: 2.4, alpha: 0.75 * bad });
        line(ctx, [[bx - 21 * bs, by + 21 * bs], [bx + 21 * bs, by - 21 * bs]], { amt: clamp(no * 1.6 - 0.6, 0, 1), col: C.red, w: 2.4, alpha: 0.75 * bad });
        label(ctx, bx, by + 46 * bs, "shear kills the cells", clamp(no * 1.4 - 0.4, 0, 1) * bad, 10, C.red);
      }

      /* 4 — the parts slide in and are wired together */
      const rowY = py(0.68), gap = W * 0.84 / (SLOTS.length - 1), x0 = W * 0.08;
      const fold = ease(ramp(p, 0.88, 0.99));
      const cx = W / 2, cyFold = py(0.56) + 33 * sc;
      const placed = [];
      SLOTS.forEach((kind, i) => {
        const t0 = 0.62 + i * 0.022, a = ease(ramp(p, t0, t0 + 0.055));
        if (a <= 0.02) { placed.push(null); return; }
        const home = [x0 + gap * i, rowY + Math.sin(t * 1.1 + i) * 2];
        const settle = ease(ramp(p, t0, t0 + 0.07));
        let x = lerp(home[0] + rand(i * 2.3) * W * 0.16, home[0], settle);
        let y = lerp(home[1] + (rand(i * 5.1) > 0 ? -1 : 1) * H * 0.16, home[1], settle);
        let scale = sc * lerp(0.85, 1, settle);
        if (fold > 0.01) {
          x = lerp(x, cx + (i - 3) * 8.5 * sc, fold); y = lerp(y, cyFold, fold); scale *= lerp(1, 0.28, fold);
        }
        placed.push([x, y, scale, a * (1 - fold * 0.6)]);
        DRAW[kind](ctx, x, y, scale, a * (1 - fold * 0.5), kind === "nozzle" ? ease(ramp(p, 0.8, 0.86)) * (1 - fold) : 0, t);
        label(ctx, x, y + 34 * scale, NAMES[i], clamp(a * 1.4 - 0.4, 0, 1) * (1 - fold), 10, C.soft || C.muted);
      });
      for (let i = 1; i < placed.length; i++) {
        const a = placed[i - 1], b = placed[i];
        if (!a || !b) continue;
        arrow(ctx, a[0] + 21 * a[2], a[1], b[0] - 21 * b[2], b[1], clamp(Math.min(a[3], b[3]) * 1.5 - 0.5, 0, 1) * (1 - fold));
      }

      /* 5 — the payload */
      const built = ease(ramp(p, 0.86, 0.97));
      if (built > 0.02) {
        const dy = drone(ctx, cx, py(0.56), sc * 1.25, built, Math.sin(t * 1.1) * 4, t);
        // translucent, so the packed components stay visible inside the payload
        ctx.save();
        const ba = clamp(built * 1.4 - 0.4, 0, 1);
        roundRect(ctx, cx - 36 * sc, dy + 18 * sc, 72 * sc, 32 * sc, 8);
        ctx.globalAlpha = ba * 0.35; ctx.fillStyle = C.card || C.bg2; ctx.fill();
        ctx.globalAlpha = ba; ctx.strokeStyle = C.burg; ctx.lineWidth = 1.8; ctx.stroke(); ctx.restore();
        line(ctx, [[cx, dy + 50 * sc], [cx, dy + 60 * sc]], { amt: clamp(built * 1.6 - 0.6, 0, 1), w: 2, col: C.burg, alpha: 0.8 });
        const sp = ease(ramp(p, 0.94, 1));
        if (sp > 0.02) {
          line(ctx, [[cx - 4 * sc, dy + 60 * sc], [cx - 36 * sc, ridge(0.5) - 6]], { amt: sp, col: C.teal, w: 1.4, alpha: 0.5 });
          line(ctx, [[cx + 4 * sc, dy + 60 * sc], [cx + 36 * sc, ridge(0.5) - 6]], { amt: sp, col: C.teal, w: 1.4, alpha: 0.5 });
          for (let k = 0; k < 16; k++) {
            const f = ((k * 0.19 + t * 0.6) % 1);
            dot(ctx, cx + rand(k * 1.7) * 34 * sc * f, dy + 60 * sc + f * (ridge(0.5) - dy - 66 * sc), 1.7 * sc, 0.55 * sp * (1 - f * 0.5), C.teal);
          }
        }
        label(ctx, cx, dy - 38 * sc, "dunelock sprayer", clamp(built * 1.5 - 0.5, 0, 1), 11, C.burg);
      }
    }
  };

  (window.PROLOGUE_SCENES = window.PROLOGUE_SCENES || {}).tech = scene;
})();
