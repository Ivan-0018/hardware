/* ============================================================
   ENGINEERING DESIGN CYCLE — editable information
   shape  : "infinity" or "circle" (the diagram in the explorer)
   stages : the steps of the cycle (any number works; the circle
            re-spaces itself). Rename freely, but keep each "key"
            matching the keys used in the "cycle" blocks below
            and in tank-content.js.
   Text starting with "To add" is shown greyed out.
   ============================================================ */
window.DESIGN_CYCLE = {

  title: "Engineering design cycle",

  // SHAPE OF THE CYCLE DIAGRAM: "infinity" or "circle"
  shape: "infinity",

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
     The "Evolution" view draws each iteration from its "liquid" list,
     using the parts below. Parts that are new compared with the
     previous iteration are highlighted automatically. (An optional
     "air" list would add a second row; it is left out on purpose.)   */
  sprayer: {
    model: "",   // e.g. "models/sprayer.glb" once a 3D model exists
    parts: {
      tanks:       { label: "Tanks",  img: ["assets/img/gel-tank.png", "assets/img/diluent-tank.png"] },
      pumps:       { label: "Peristaltic pumps",    img: ["assets/img/peristaltic-pump.png", "assets/img/peristaltic-pump.png"] },
      y:           { label: "Y-connector",          img: "assets/img/y-connector.png" },
      staticMixer: { label: "Static mixer",         img: "assets/img/static-mixer.png" },
      diaphragm:   { label: "Diaphragm pump",       img: "assets/img/diaphragm-pump.svg" },
      sensor:      { label: "Pressure sensor",      img: "assets/img/pressure-sensor.png" },
      nozzle:      { label: "Nozzle",  img: "assets/img/nozzle.png" },
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
        cycle: {
          design: "Blend the two streams in a diaphragm pump after the Y-connector instead of a static mixer.",
          build: "Diaphragm pump fitted in the mixing position; tanks, peristaltic pumps, sensor, nozzle and air path unchanged.",
          test: "To add: results with the diaphragm pump.",
          learn: "To add: what the tests showed and what could change next."
        }
      }
    ]
  },

  /* ---------- nozzle ----------
     Same "Evolution" view as the sprayer: "liquid" is the main row,
     "air" (optional) is a second row that feeds up into the nozzle. */
  nozzle: {
    model: "",   // e.g. "models/nozzle.glb"
    parts: {
      pump:          { label: "Diaphragm pump",      img: "assets/img/diaphragm-pump.svg" },
      sensor:        { label: "Pressure sensor",     img: "assets/img/pressure-sensor.png" },
      genericNozzle: { label: "Generic nozzle",      img: "assets/img/generic-nozzle.svg" },
      airNozzle:     { label: "Air-assisted nozzle", img: "assets/img/nozzle.png" },
      compressor:    { label: "Compressor",          img: "assets/img/air-compressor.png" },
      regulator:     { label: "Pressure regulator",  img: "assets/img/pressure-regulator.png" }
    },
    iterations: [
      {
        short: "Generic nozzle",
        label: "Iteration 1",
        title: "A generic spray nozzle",
        summary: "A standard single-fluid nozzle on the end of the liquid line, with the liquid pushed through it by pump pressure alone.",
        liquid: ["pump", "sensor", "genericNozzle"],
        cycle: {
          design: "A generic single-fluid nozzle at the end of the liquid line.",
          build: "To add: which nozzle was used and how it was mounted.",
          test: "To add: what the spray looked like with the viscous formulation.",
          learn: "To add: why it was replaced by an air-assisted nozzle."
        }
      },
      {
        short: "Air-assisted",
        label: "Iteration 2 · current",
        title: "Air-assisted dual-fluid nozzle",
        summary: "Mixed liquid and compressed air enter through separate ports and meet at the nozzle to form the spray. A compressor and pressure regulator were added to supply the air.",
        liquid: ["pump", "sensor", "airNozzle"],
        air: ["compressor", "regulator"],
        cycle: {
          design: "Separate liquid and air inlets; air provides the atomization energy.",
          build: "Air-assisted nozzle fed by a 12 V compressor through a pressure regulator.",
          test: "To add: spray pattern and viability after spraying.",
          learn: "To add."
        }
      }
    ]
  }
};
