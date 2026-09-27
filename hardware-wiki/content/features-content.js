/* ============================================================
   FEATURES — editable information
   One entry per feature card. "stat" is the short line on the card.
   The adaptive-formulation panel is the interactive embed
   (embeds/adaptive.html); its card text is edited here.
   ============================================================ */
window.FEATURES = {

  lightweight: {
    name: "Lightweight",
    stat: "Target < 2.6 kg",
    blurb: "Every gram matters on a drone.",
    heading: "Every gram matters.",
    note: "Mass breakdown will be populated from the final assembly and measured component weights.",
    parts: [["Tanks", "XXX g"], ["Pumps", "XXX g"], ["Compressor", "XXX g"], ["Electronics", "XXX g"]],
    total: "X.XX kg",
    totalLabel: "Complete payload",
    target: "Design target: < 2.6 kg. Final percentage below target will appear here after weighing."
  },

  compact: {
    name: "Compact",
    stat: "180 × 210 mm footprint",
    blurb: "A complete spraying system in a small footprint.",
    heading: "A complete spraying system in a compact footprint.",
    note: "Final orthographic views will replace these placeholders once the assembly dimensions are locked.",
    views: [{ label: "210 mm", side: "bottom", caption: "Top view" }, { label: "XXX mm", side: "side", caption: "Side view" }],
    stats: [["2 × 500 mL", "Reservoir capacity"], ["180 × 210 mm", "Target footprint"], ["XXX mm", "Overall height"], ["< 2.6 kg", "Target payload"]]
  },

  modular: {
    name: "Modular",
    stat: "Multiple drone platforms",
    blurb: "Designed around the payload, not one aircraft.",
    heading: "Designed around the payload, not one aircraft.",
    note: "Adjustable mounting features allow the sprayer architecture to be adapted to different drone platforms.",
    drones: ["Drone A", "Drone B", "Drone C"],
    points: [
      ["Adjustable mounting", "Rail / clamp interface adapts to different frames. (Visual to add.)"],
      ["Stackable tanks", "The same tank design stacks on itself, so the number and order of tanks can change."],
      ["Replaceable wetted parts", "Tubing, mixer and nozzle can be swapped between runs."]
    ],
    closing: "One payload architecture. Multiple drone platforms."
  },

  adaptive: {
    name: "Adaptive formulation",
    stat: "Ratio set onboard",
    blurb: "Choose the treatment : diluent ratio in flight."
  }
};
