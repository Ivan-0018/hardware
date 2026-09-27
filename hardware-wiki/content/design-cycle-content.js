/* ============================================================
   ENGINEERING DESIGN CYCLE — editable information
   stages : the steps of the cycle (any number works; the circle
            re-spaces itself). Rename freely, but keep each "key"
            matching the keys used in the "cycle" blocks below
            and in tank-content.js.
   Text starting with "To add" is shown greyed out.
   ============================================================ */
window.DESIGN_CYCLE = {

  title: "Engineering design cycle",

  stages: [
    { key: "design", name: "Design" },
    { key: "build",  name: "Build" },
    { key: "test",   name: "Test" },
    { key: "learn",  name: "Learn" }
  ],

  // the component box in the design explorer, in order
  // ("tank" reads from tank-content.js, the others from below)
  explorer: [
    { key: "sprayer", name: "Sprayer system", blurb: "The whole liquid + air path" },
    { key: "tank",    name: "Tank",           blurb: "Six iterations to one stackable tank" },
    { key: "nozzle",  name: "Nozzle",         blurb: "Atomizing without harming the cells" }
  ],

  /* ---------- whole sprayer system ----------
     The "Evolution" view draws each iteration from its "liquid" and
     "air" lists, using the parts below. Parts that are new compared
     with the previous iteration are highlighted automatically.      */
  sprayer: {
    model: "",   // e.g. "models/sprayer.glb" once a 3D model exists
    parts: {
      tanks:       { label: "Gel + diluent tanks",  img: ["assets/img/gel-tank.png", "assets/img/diluent-tank.png"] },
      pumps:       { label: "Peristaltic pumps",    img: ["assets/img/peristaltic-pump.png", "assets/img/peristaltic-pump.png"] },
      y:           { label: "Y-connector",          img: "assets/img/y-connector.png" },
      staticMixer: { label: "Static mixer",         img: "assets/img/static-mixer.png" },
      diaphragm:   { label: "Diaphragm pump",       img: "assets/img/diaphragm-pump.svg" },
      sensor:      { label: "Pressure sensor",      img: "assets/img/pressure-sensor.png" },
      nozzle:      { label: "Air-assisted nozzle",  img: "assets/img/nozzle.png" },
      compressor:  { label: "Compressor",           img: "assets/img/air-compressor.png" },
      regulator:   { label: "Pressure regulator",   img: "assets/img/pressure-regulator.png" }
    },
    iterations: [
      {
        short: "Static mixer",
        label: "Iteration 1",
        title: "Passive mixing with a static mixer",
        summary: "Treatment and diluent are metered by two peristaltic pumps, meet at a Y-connector and are blended by a static mixer before the pressure sensor and the air-assisted nozzle.",
        liquid: ["tanks", "pumps", "y", "staticMixer", "sensor", "nozzle"],
        air: ["compressor", "regulator"],
        cycle: {
          design: "Two independently metered lines meet at a Y-connector, and a static mixer blends them with no moving parts.",
          build: "Two tanks, two P240 peristaltic pumps, Y-connector, static mixer, pressure sensor and air-assisted nozzle; compressor and regulator on the air side.",
          test: "To add: what you saw with the static mixer (mixing quality, pressure drop, clogging).",
          learn: "To add: why the static mixer was replaced by a diaphragm pump."
        }
      },
      {
        short: "Diaphragm pump",
        label: "Iteration 2 · current",
        title: "A diaphragm pump replaces the static mixer",
        summary: "The static mixer was removed and a diaphragm pump now sits after the Y-connector. The rest of the liquid path and the air path stayed the same.",
        liquid: ["tanks", "pumps", "y", "diaphragm", "sensor", "nozzle"],
        air: ["compressor", "regulator"],
        cycle: {
          design: "Blend the two streams in a diaphragm pump after the Y-connector instead of a static mixer.",
          build: "Diaphragm pump fitted in the mixing position; tanks, peristaltic pumps, sensor, nozzle and air path unchanged.",
          test: "To add: results with the diaphragm pump.",
          learn: "To add: what the tests showed and what could change next."
        }
      }
    ]
  },

  /* ---------- nozzle (used in the explorer version) ---------- */
  nozzle: {
    model: "",   // e.g. "models/nozzle.glb"
    iterations: [
      {
        short: "First nozzle",
        label: "Iteration 1",
        title: "To add: first nozzle tried",
        summary: "To add: what the first nozzle was and why it was chosen.",
        cycle: {
          design: "To add.",
          build: "To add.",
          test: "To add.",
          learn: "To add."
        }
      },
      {
        short: "Air-assisted",
        label: "Iteration 2",
        title: "Air-assisted dual-fluid nozzle",
        summary: "Mixed liquid and compressed air enter through separate ports and meet at the nozzle to form the spray.",
        cycle: {
          design: "Separate liquid and air inlets; air provides the atomization energy.",
          build: "To add: nozzle part, orifice size and how it is mounted.",
          test: "To add: spray pattern and viability after spraying.",
          learn: "To add."
        }
      }
    ]
  }
};
