/* ============================================================
   HOW IT WORKS — editable information
   Used by the three diagrams in the "How it works" section:
     fluid   -> spray system diagram      (embeds/fluid.html)
     control -> control signal diagram    (embeds/control.html)
     power   -> power distribution        (embeds/power.html)
   Each spec is a [label, value] pair. Edit freely.
   ============================================================ */
window.HOW_IT_WORKS = {

  /* ---------- SPRAY SYSTEM (fluid + airflow) ---------- */
  fluid: {
    // Shown under the board when a filter button is selected
    subsystems: {
      all: {
        title: "Complete Flow System",
        summary: "Two metered liquid streams are combined and atomized using compressed air.",
        items: [["Liquid Flow", "Up to ~480 mL/min"], ["Liquid Pressure", "0–10 bar monitored"], ["Air Supply", "Regulated compressed air"], ["Control", "Independent pump + air control"]]
      },
      pumps: {
        title: "Liquid Delivery",
        summary: "Two peristaltic pumps meter the treatment and diluent streams independently.",
        items: [["Pump Type", "Peristaltic"], ["Pump Model", "P240"], ["Nominal Flow", "Up to ~240 mL/min each"], ["Function", "Independent ratio control"]]
      },
      mixing: {
        title: "Mixing",
        summary: "Both streams converge at the Y-connector and are blended in a diaphragm pump immediately before spraying.",
        items: [["Inlets", "2 liquid streams"], ["Junction", "Y-connector"], ["Mixer", "Diaphragm pump"], ["Purpose", "Onboard formulation blending"]]
      },
      air: {
        title: "Air / Atomization",
        summary: "Compressed air provides the atomization energy at the dual-fluid nozzle.",
        items: [["Compressor", "12 V DC"], ["Pressure", "Regulated"], ["Nozzle", "Dual-fluid / air-assisted"], ["Purpose", "Controlled atomization"]]
      },
      monitoring: {
        title: "Pressure Monitoring",
        summary: "The sensor measures liquid-line pressure before the nozzle.",
        items: [["Sensor Range", "0–10 bar"], ["Location", "Post-mixer"], ["Signal", "Controller feedback"], ["Use", "Pressure / clog monitoring"]]
      },
      connections: {
        title: "Flow Connections",
        summary: "Colour-coded paths separate treatment, diluent, mixed liquid, and compressed air.",
        items: [["Green", "Treatment solution"], ["Blue", "Diluent"], ["Neutral", "Mixed liquid"], ["Teal", "Compressed air"]]
      }
    },
    // Shown in the pop-up when a component is clicked (key = the name on the board)
    components: {
      "Gel Tank":           { kicker: "Liquid Storage", role: "Stores the treatment or biosynthetic solution before metered delivery.", specs: [["Capacity", "Up to 500 mL"], ["Stream", "Treatment solution"], ["Feed", "Pump 1"], ["Function", "Primary formulation reservoir"]] },
      "Diluent Tank":       { kicker: "Liquid Storage", role: "Stores the diluent used to adjust the treatment concentration onboard.", specs: [["Capacity", "Up to 500 mL"], ["Stream", "Diluent"], ["Feed", "Pump 2"], ["Function", "Onboard dilution"]] },
      "Pump 1":             { kicker: "Liquid Metering", role: "Meters the treatment stream independently before it enters the Y-connector.", specs: [["Type", "Peristaltic"], ["Model", "P240"], ["Flow", "Up to ~240 mL/min"], ["Control", "Independent / PWM"]] },
      "Pump 2":             { kicker: "Liquid Metering", role: "Meters the diluent independently to control the final formulation ratio.", specs: [["Type", "Peristaltic"], ["Model", "P240"], ["Flow", "Up to ~240 mL/min"], ["Control", "Independent / PWM"]] },
      "Y-Connector":        { kicker: "Mixing", role: "Combines the independently metered treatment and diluent streams.", specs: [["Inputs", "2 liquid streams"], ["Output", "1 mixed stream"], ["Location", "Pre-mixer"], ["Purpose", "Stream convergence"]] },
      "Diaphragm Pump":     { kicker: "Mixing", role: "Blends the combined stream and pushes it on towards the nozzle. It replaced the static mixer used in the first sprayer iteration.", specs: [["Type", "Diaphragm pump"], ["Inputs", "Combined stream"], ["Model", "To add"], ["Replaced", "Static mixer"]] },
      "Pressure Sensor":    { kicker: "Monitoring", role: "Measures post-mixer liquid pressure for feedback and abnormal-condition detection.", specs: [["Range", "0–10 bar"], ["Location", "Post-mixer"], ["Output", "Controller feedback"], ["Use", "Pressure / clog monitoring"]] },
      "Air Compressor":     { kicker: "Air System", role: "Supplies compressed air used to atomize the mixed liquid at the nozzle.", specs: [["Supply", "12 V DC"], ["Medium", "Compressed air"], ["Control", "Independent"], ["Purpose", "Atomization energy"]] },
      "Pressure Regulator": { kicker: "Air System", role: "Adjusts and stabilizes compressed-air pressure before the nozzle.", specs: [["Input", "Compressor air"], ["Output", "Regulated air"], ["Adjustment", "Manual"], ["Purpose", "Atomization control"]] },
      "Air-Assisted Nozzle":{ kicker: "Atomization", role: "Receives mixed liquid and compressed air through separate ports to generate the spray.", specs: [["Type", "Dual-fluid"], ["Inputs", "Liquid + air"], ["Atomization", "Air-assisted"], ["Output", "Controlled spray"]] }
    }
  },

  /* ---------- ELECTRONICS: CONTROL SIGNAL ARCHITECTURE ---------- */
  control: {
    intro: "The ESP32 is the central signal hub: 5 V powers the controller, the pressure sensor sends feedback into it, and three PWM outputs drive the actuator channels.",
    filters: {
      all:      ["Complete Control Core", [["Input", "12 V DC"], ["Logic Power", "5 V"], ["Control", "GPIO 4 / 5 / 6"], ["Feedback", "Pressure sensor → ESP32"]]],
      power:    ["Power Path", [["Source", "12 V battery"], ["Protection", "Main switch + fuse"], ["Controller Input", "5 V"], ["Load", "ESP32"]]],
      control:  ["Control Outputs", [["PWM · GPIO 4", "Pump 1"], ["PWM · GPIO 5", "Pump 2"], ["PWM · GPIO 6", "Compressor"], ["Driver", "Logic-level MOSFET"]]],
      feedback: ["Pressure Feedback", [["Sensor", "0–10 bar"], ["Direction", "Sensor → ESP32"], ["Purpose", "Pressure monitoring"], ["Use", "Clog / system health"]]]
    },
    items: {
      "ESP32-S3 LoRa V3": { kicker: "Controller", role: "Central control hub receiving power and pressure feedback while generating the actuator PWM commands.", specs: [["Supply", "5 V DC"], ["Logic", "3.3 V"], ["Outputs", "GPIO 4 / 5 / 6"], ["Function", "Control + monitoring"]] },
      "Pressure Sensor":  { kicker: "Monitoring", role: "Measures liquid-line pressure and sends the measurement back to the ESP32.", specs: [["Range", "0–10 bar"], ["Direction", "Sensor → ESP32"], ["Signal", "Pressure feedback"], ["Use", "System health / clog detection"]] },
      "MOSFET 1":         { kicker: "Actuator Driver", role: "Switches and modulates Pump 1 from the ESP32 control signal.", specs: [["Input", "PWM · GPIO 4"], ["Load", "Pump 1"], ["Function", "Power switching"], ["Control", "PWM"]] },
      "MOSFET 2":         { kicker: "Actuator Driver", role: "Switches and modulates Pump 2 from the ESP32 control signal.", specs: [["Input", "PWM · GPIO 5"], ["Load", "Pump 2"], ["Function", "Power switching"], ["Control", "PWM"]] },
      "MOSFET 3":         { kicker: "Actuator Driver", role: "Switches the compressor channel from the ESP32.", specs: [["Input", "PWM · GPIO 6"], ["Load", "Compressor"], ["Function", "Power switching"], ["Control", "PWM / switching"]] },
      "signal-5v":        { kicker: "Power Signal", title: "5 V Power Input", role: "Supplies the ESP32 controller with its regulated logic power.", specs: [["Voltage", "5 V DC"], ["Direction", "Input → ESP32"], ["Destination", "Controller"], ["Purpose", "Controller power"]] },
      "signal-pressure":  { kicker: "Sensor Signal", title: "Pressure Feedback", role: "Carries the pressure measurement from the sensor into the ESP32 for monitoring and control decisions.", specs: [["Direction", "Sensor → ESP32"], ["Source", "Pressure sensor"], ["Destination", "ESP32"], ["Purpose", "Feedback"]] },
      "signal-pwm-1":     { kicker: "Control Signal", title: "PWM · GPIO 4", role: "Control command from the ESP32 to MOSFET 1 for Pump 1.", specs: [["Direction", "ESP32 → MOSFET"], ["GPIO", "4"], ["Load", "Pump 1"], ["Signal", "PWM"]] },
      "signal-pwm-2":     { kicker: "Control Signal", title: "PWM · GPIO 5", role: "Control command from the ESP32 to MOSFET 2 for Pump 2.", specs: [["Direction", "ESP32 → MOSFET"], ["GPIO", "5"], ["Load", "Pump 2"], ["Signal", "PWM"]] },
      "signal-pwm-3":     { kicker: "Control Signal", title: "PWM · GPIO 6", role: "Control command from the ESP32 to MOSFET 3 for the compressor.", specs: [["Direction", "ESP32 → MOSFET"], ["GPIO", "6"], ["Load", "Compressor"], ["Signal", "PWM / switching"]] }
    }
  },

  /* ---------- ELECTRONICS: POWER DISTRIBUTION ---------- */
  power: {
    intro: "Two voltage rails power the system: 12 V for the actuators and 5 V for control and sensing.",
    filters: {
      all: ["Complete Distribution", [["Main Rail", "12 V DC"], ["12 V Loads", "Pump 1 · Pump 2 · Compressor"], ["Conversion", "12 V → 5 V"], ["5 V Loads", "ESP32 · Pressure Sensor"]]],
      v12: ["12 V Main Rail", [["Source", "Main battery rail"], ["Loads", "Pump 1 · Pump 2 · Compressor"], ["Purpose", "High-power actuators"], ["Conversion", "Feeds 5 V rail through buck"]]],
      v5:  ["5 V Logic Rail", [["Source", "Buck converter"], ["Loads", "ESP32 · Pressure Sensor"], ["Purpose", "Control + sensing"], ["Voltage", "5 V DC"]]]
    },
    items: {
      pump1:      { kicker: "12 V Load", title: "Pump 1", role: "Powers treatment-solution metering.", specs: [["Supply", "12 V DC"], ["Function", "Treatment delivery"], ["Control", "Via MOSFET 1"], ["Type", "Peristaltic pump"]] },
      pump2:      { kicker: "12 V Load", title: "Pump 2", role: "Powers diluent metering independently from Pump 1.", specs: [["Supply", "12 V DC"], ["Function", "Diluent delivery"], ["Control", "Via MOSFET 2"], ["Type", "Peristaltic pump"]] },
      compressor: { kicker: "12 V Load", title: "Compressor", role: "Provides the compressed air used for nozzle atomization.", specs: [["Supply", "12 V DC"], ["Function", "Air atomization"], ["Control", "Via MOSFET 3"], ["Load Type", "Actuator"]] },
      buck:       { kicker: "Power Conversion", title: "Buck Converter", role: "Steps the 12 V main rail down to the 5 V logic and sensing rail.", specs: [["Input", "12 V"], ["Output", "5 V"], ["Feeds", "ESP32 + pressure sensor"], ["Purpose", "Voltage conversion"]] },
      esp32:      { kicker: "5 V Load", title: "ESP32", role: "Central controller for pump, compressor, and sensor logic.", specs: [["Supply", "5 V DC"], ["Role", "Controller"], ["Outputs", "PWM control"], ["Input", "Pressure feedback"]] },
      sensor:     { kicker: "5 V Load", title: "Pressure Sensor", role: "Monitors liquid-line pressure and sends feedback to the controller.", specs: [["Supply", "5 V DC"], ["Range", "0–10 bar"], ["Role", "Monitoring"], ["Signal", "Feedback → ESP32"]] }
    }
  }
};
