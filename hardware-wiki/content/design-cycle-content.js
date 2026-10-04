/* ============================================================
   ENGINEERING DESIGN CYCLE — editable information  (version 2, index2.html)
   From the hardware write-up for the wiki team.
   shape  : "infinity" or "circle" (the diagram in the explorer)
   stages : the steps of the cycle (rename freely, but keep each "key"
            matching the keys used in the "cycle" blocks below and in
            tank-content.js)
   hints  : the small footnote under the viewer ("" hides it)
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

  hints: {
    drawing: "Inlets in teal · outlets in orange",   // tank drawings
    flow: "",                                        // sprayer / nozzle part diagrams
    model: "Drag to rotate · scroll to zoom"         // 3D view
  },

  // the component box in the design explorer, in order
  // ("tank" reads from tank-content.js, the others from below)
  // blurb: "" hides the line under the name; write one to show it again
  explorer: [
    { key: "sprayer", name: "Sprayer system", blurb: "" },
    { key: "tank",    name: "Tank",           blurb: "" },
    { key: "nozzle",  name: "Nozzle",         blurb: "" }
  ],

  /* ---------- whole sprayer system ----------
     The "Evolution" view draws each iteration from its "liquid" list,
     using the parts below. Parts that are new compared with the
     previous iteration are highlighted automatically.               */
  sprayer: {
    model: "models/sprayer-system.glb",   // converted from the SolidWorks part (Part5.SLDPRT)
    orbit: "155deg 62deg auto",           // starting view of the 3D model (turn, tilt, distance)
    parts: {
      tanks:       { label: "Tanks",             img: ["assets/img/gel-tank.png", "assets/img/diluent-tank.png"] },
      pumps:       { label: "Peristaltic pumps", img: ["assets/img/peristaltic-pump.png", "assets/img/peristaltic-pump.png"] },
      y:           { label: "Y-connector",       img: "assets/img/y-connector.png" },
      staticMixer: { label: "Static mixer",      img: "assets/img/static-mixer.png" },
      diaphragm:   { label: "Diaphragm pump",    img: "assets/img/diaphragm-pump.svg" },
      sensor:      { label: "Pressure sensor",   img: "assets/img/pressure-sensor.png" },
      nozzle:      { label: "Nozzle",            img: "assets/img/nozzle.png" }
    },
    iterations: [
      {
        short: "Initial design",
        label: "Iteration 1",
        title: "Initial design",
        summary: "Treatment and diluent are metered by two peristaltic pumps, meet at a Y-connector and are blended by a static mixer before the pressure sensor and the nozzle.",
        liquid: ["tanks", "pumps", "y", "staticMixer", "sensor", "nozzle"],
        cycle: {
          design: "Two independently metered lines meet at a Y-connector, and a static mixer blends them.",
          build: "We put together the components and ran into issues. To add: the challenges from building.",
          test: "We tested removing certain components to see whether they were actually necessary, and realised that by removing the static mixer we could lower the cost of the spray system without substantial performance loss.",
          learn: "For slow mixing, the Y-connector and initial pumps were enough."
        }
      },
      {
        short: "Diaphragm pump",
        label: "Iteration 2",
        title: "Static mixer replaced with a diaphragm pump",
        summary: "We rebuilt the sprayer system with a diaphragm pump in place of the static mixer, to help provide the pressure needed for spraying at the nozzle.",
        liquid: ["tanks", "pumps", "y", "diaphragm", "sensor", "nozzle"],
        cycle: {
          design: "We reconstructed the sprayer system with a diaphragm pump in place of the static mixer, to help provide the pressure needed for spraying at the nozzle.",
          build: "To add: challenges from building.",
          test: "We tested it, and it mixed.",
          learn: "The diaphragm pump was a suitable replacement for the static mixer."
        }
      },
      {
        short: "No diaphragm pump",
        label: "Iteration 3 · current",
        title: "Diaphragm pump removed",
        summary: "Advances in the nozzle design meant the diaphragm pump was no longer needed, so the streams now mix at the Y-connector on their way to the nozzle.",
        liquid: ["tanks", "pumps", "y", "sensor", "nozzle"],
        cycle: {
          design: "Due to advances in the nozzle design, we no longer needed the diaphragm pump.",
          build: "We removed the diaphragm pump and reconstructed the sprayer system.",
          test: "We tested whether mixing happened sufficiently by pumping two differently coloured liquids through and checking how they came out.",
          learn: "Spraying did not require the diaphragm pump, and the system mixed well without it."
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
      airNozzle:     { label: "External-mix nozzle", img: "assets/img/nozzle.png" },
      compressor:    { label: "Compressor",          img: "assets/img/air-compressor.png" },
      regulator:     { label: "Pressure regulator",  img: "assets/img/pressure-regulator.png" }
    },
    iterations: [
      {
        short: "Generic nozzle",
        label: "Iteration 1",
        title: "Generic nozzle",
        summary: "A standard spray nozzle, attached to the diaphragm pump and pressure sensor.",
        liquid: ["pump", "sensor", "genericNozzle"],
        cycle: {
          design: "We used a standard spray nozzle.",
          build: "Constructed and attached to the diaphragm pump and pressure sensor.",
          test: "To add: the viability test (e.g. growth curve) and its result.",
          learn: "Too many cells died, so we needed an alternative spray method."
        }
      },
      {
        short: "Air-assisted",
        label: "Iteration 2 · current",
        title: "Air-assisted external-mix nozzle",
        summary: "Because too many cells died with the generic nozzle, we moved to an external-mix nozzle with air-assisted spraying.",
        liquid: ["pump", "sensor", "airNozzle"],
        air: ["compressor", "regulator"],
        cycle: {
          design: "An external-mix nozzle with air-assisted spraying.",
          build: "We built it.",
          test: "The same test as before: more cells survived, and spores are expected to survive.",
          learn: "It works."
        }
      }
    ]
  }
};
