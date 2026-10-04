/* ============================================================
   ENGINEERING CHALLENGES · OPEN HARDWARE · BILL OF MATERIALS ·
   WHAT'S NEXT — editable information
   ============================================================ */
window.PAGE = {

  // "tags" left out on purpose in this version: only the challenge and our answer
  challenges: [
    { title: "Biosynthetic solutions are difficult to spray", answer: "Peristaltic pumps + air-assisted atomization" },
    { title: "Existing high-viscosity systems are too large", answer: "Compact, low-pressure drone payload" },
    { title: "Current drone sprayers use fixed formulations", answer: "Two metered streams mixed onboard" }
  ],

  // one card per document to upload; set "href" when the file is online
  openHardware: {
    cards: [
      { title: "Assembly guide", href: "#" },
      { title: "CAD files", href: "#" },
      { title: "Control code", href: "#" },
      { title: "Operating guide", href: "#" }
    ],
    guides: []
  },

  bom: {
    headline: "Built for under $100.",   // every listed part now has a price: $94.30 in total
    // categories used by the filter buttons (key: label)
    categories: { liquid: "Liquid Delivery", air: "Air System", control: "Control", monitoring: "Monitoring" },
    // unitCost: number, or null for "TBD"; leave url empty if there is no link yet
    items: [
      { name: "ESP32 LoRa Unit", role: "Microcontroller", cat: "control", qty: 1, unitCost: 26.73, supplier: "Amazon", url: "https://amzn.eu/d/05vpXLce" },
      { name: "Pressure Sensor, 0–10 bar", role: "Liquid pressure feedback", cat: "monitoring", qty: 1, unitCost: 8.71, supplier: "Amazon", url: "https://www.amazon.ae/SGerste-Sensor-Control-Flowmeter-Arduino/dp/B07DL4KY94/" },   // AED 32 at 3.6725 AED per USD
      { name: "Pump MOSFETs", role: "Pump switching / PWM", cat: "control", qty: 2, unitCost: 3.51, supplier: "Amazon", url: "https://www.amazon.ae/Voltage-Control-Isolation-Microcontroller-Brightness/dp/B0GCLR5PHS/" },
      { name: "Peristaltic Pumps", role: "Independent fluid metering", cat: "liquid", qty: 2, unitCost: 9.45, supplier: "AliExpress", url: "https://ar.aliexpress.com/item/1005008568962671.html" },
      { name: "Compressor", role: "Air-assisted atomization", cat: "air", qty: 1, unitCost: 13.23, supplier: "AliExpress", url: "https://ar.aliexpress.com/item/1005007557906159.html" },
      { name: "Pressure Regulator", role: "Atomizing-air regulation", cat: "air", qty: 1, unitCost: 17.55, supplier: "Noon", url: "https://www.noon.com/uae-en/1-4-inch-air-pressure-regulator-for-airbrush-spray-machine-pneumatic-tool-accessory/Z68FAD2A572FC4D790483Z/p/" },
      { name: "Compressor MOSFET", role: "Compressor switching", cat: "control", qty: 1, unitCost: 2.16, supplier: "Amazon", url: "https://www.amazon.ae/Voltage-Control-Isolation-Terminal-Brightness/dp/B0GX2J8PBN/" }
    ]
  },

  future: [
    { title: "Closed-loop ratio control", text: "Automatically correct formulation delivery." },
    { title: "Predictive clog detection", text: "Use pressure behavior to detect blockage early." },
    { title: "Drone-speed integration", text: "Link application rate to flight behavior." },
    { title: "Automated flushing", text: "Clean the wetted path after delivery." },
    { title: "Field-scale biological validation", text: "Validate viability and deposition outside the bench." }
  ]
};
