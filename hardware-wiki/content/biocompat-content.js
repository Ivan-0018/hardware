/* ============================================================
   BIOCOMPATIBILITY — editable information  (version 2, index2.html)
   The five components sit on the corners of the pentagon, in
   flow order (clockwise from the top). Clicking one shows its
   entry on the right. "To add" marks text still to confirm.
   The Material / Barrier rows are switched off in this version: each
   component's "specs" list is empty. Put the pairs back in a "specs"
   list (e.g. specs: [["Material", "PLA"], ["Barrier", "Resin coating"]])
   to show the rows again.
   ============================================================ */
window.BIOCOMPAT = {

  center: { title: "Fluid path", hint: "Select a component" },

  components: [
    {
      key: "tank",
      name: "Tanks",
      role: "Storage",
      title: "Coated, drainable reservoirs",
      text: "The tanks are 3D-printed in PLA and internally coated with five layers of resin that prevent microbial growth on the walls. The chevron V-shaped base funnels the contents to a single outlet, minimising leftover wastage and preventing leftover bacteria from pooling together. The tank internals also feature rounded corners, so bacteria have nowhere to grow.",
      specs: []
    },
    {
      key: "tubing",
      name: "Tubing",
      role: "Transport",
      title: "Easily replaceable tubes",
      text: "The sprayer system uses silicone tubing to prevent microbial growth on the internals. The tubes are also very easily replaceable in case of any damage.",
      specs: []
    },
    {
      key: "pump",
      name: "Pumps",
      role: "Metering",
      title: "Gentle peristaltic pumping",
      text: "Peristaltic pumps move the fluid by squeezing the outside of the tube with rollers. The formulation never passes through pump machinery, and peristaltic pumping is generally regarded as low-shear, which suits living cells.",
      specs: []
    },
    {
      key: "mixer",
      name: "Y-connector",
      role: "Blending",
      title: "Mixing at the Y-connector",
      text: "The treatment and diluent streams meet at a Y-connector on their way to the nozzle. Check valves prevent the backflow of mixed liquid, and so halt cross-contamination between the two tanks.",
      specs: []
    },
    {
      key: "nozzle",
      name: "External-mix nozzle",
      role: "Atomization",
      title: "Air does the atomizing",
      text: "In the external-mix, air-assisted nozzle, compressed air supplies the energy that breaks the liquid into droplets, instead of forcing the formulation through a tiny orifice at high pressure. The aim is to limit the mechanical stress on the cells at the very last step.",
      specs: []
    }
  ]
};
