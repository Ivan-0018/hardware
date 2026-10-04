/* ============================================================
   FEATURES — editable information  (version 2, index2.html)
   numbered: false -> no 01/02/03 numbers on the cards
   blurb: ""       -> no text under the card heading
   (set "simple: true" to collapse the panels to a single
    value + line instead of the full panels below)
   The adaptive panel is the interactive embed (embeds/adaptive.html).
   Text starting with "To add" is shown greyed out.
   ============================================================ */
window.FEATURES = {

  numbered: false,

  lightweight: {
    name: "Lightweight",
    blurb: "",
    heading: "Every gram matters.",
    note: "Mass breakdown will be populated from the final assembly and measured component weights.",
    parts: [["Tanks", "XXX g"], ["Pumps", "XXX g"], ["Compressor", "XXX g"], ["Electronics", "XXX g"]],
    total: "To add",
    totalLabel: "Complete payload",
    target: "The whole sprayer payload is kept as light as possible so it can fly without eating into the drone's endurance. The measured weight goes here."
  },

  compact: {
    name: "Compact",
    blurb: "",
    heading: "A complete spraying system in a compact footprint.",
    note: "Final orthographic views will replace these placeholders once the assembly dimensions are locked.",
    views: [{ label: "XXX mm", side: "bottom", caption: "Top view" }, { label: "XXX mm", side: "side", caption: "Side view" }],
    stats: [["2 × 500 mL", "Reservoir capacity"], ["To add", "Footprint"], ["To add", "Overall height"], ["To add", "Payload weight"]]
  },

  modular: {
    name: "Modular",
    blurb: "",
    heading: "Designed around the payload, not one aircraft.",
    note: "Allows easy integration with multiple manned and unmanned vehicles.",
    drones: ["Drone A", "Drone B", "Drone C"],
    points: [
      ["Adjustable mounting", "Rail / clamp interface adapts to different frames. (Visual to add.)"],
      ["Stackable tanks", "The same tank design stacks on itself, so the number and order of tanks can change."],
      ["Replaceable wetted parts", "Tubing and nozzle can be swapped between runs."]
    ],
    closing: "One payload architecture. Multiple vehicles, manned and unmanned."
  },

  adaptive: {
    name: "Adaptive mix ratios",
    blurb: ""
  }
};
