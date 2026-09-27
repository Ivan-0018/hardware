/* ============================================================
   EXPERIMENTAL RESULTS / TESTS — editable information
   Replace the XX placeholders with measured values.
   "status" is the small line under each number.
   ============================================================ */
window.RESULTS = {

  viability: {
    title: "Bacterial viability",
    note: "Placeholder · replace with measured result",
    before: "XX%",
    after: "XX%",
    retained: "XX.X%",
    stages: ["Tank", "Pump", "Mixer", "Nozzle", "Collected spray"]
  },

  metrics: [
    { group: "Hydraulic",   title: "Flow-rate accuracy", value: "±X%",       status: "Test pending" },
    { group: "Mixing",      title: "Ratio error",        value: "X%",        status: "Test pending" },
    { group: "Atomization", title: "Spray coverage",     value: "X cm / X°", status: "Test pending" },
    { group: "Payload",     title: "Total mass",         value: "X.XX kg",   status: "Test pending" },
    { group: "Pressure",    title: "Operating pressure", value: "X bar",     status: "Test pending" },
    { group: "Tank",        title: "Residual volume",    value: "X mL",      status: "Test pending" }
  ]
};
