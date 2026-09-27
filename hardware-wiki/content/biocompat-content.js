/* ============================================================
   BIOCOMPATIBILITY — editable information
   The five components sit on the corners of the pentagon, in
   flow order (clockwise from the top). Clicking one shows its
   entry below the pentagon. "To add" marks text still to confirm.
   ============================================================ */
window.BIOCOMPAT = {

  center: { title: "Wetted path", hint: "Select a component" },

  components: [
    {
      key: "tank",
      name: "Tank",
      role: "Storage",
      title: "Coated, drainable reservoirs",
      text: "The tanks are printed in PLA and sealed with an internal resin coating that prevents microbial growth on the walls. The chevron V-base funnels the formulation to a single outlet, so little liquid is left behind, and each tank slides off its rail for cleaning.",
      specs: [["Material", "PLA"], ["Coating", "Internal resin, prevents microbe growth"], ["Drainage", "V-base funnel to one outlet"], ["Servicing", "Slides off the rail"]]
    },
    {
      key: "tubing",
      name: "Tubing",
      role: "Transport",
      title: "One continuous, replaceable tube",
      text: "The formulation travels through a single run of tubing from the tank through the pump. It is the only surface the fluid touches between the tank and the mixer, and it can be swapped out between runs.",
      specs: [["Material", "To add (e.g. silicone)"], ["Inner diameter", "To add"], ["Contact", "Only wetted surface to the mixer"], ["Servicing", "Replaceable"]]
    },
    {
      key: "pump",
      name: "Pump",
      role: "Metering",
      title: "Gentle peristaltic pumping",
      text: "Peristaltic pumps move the fluid by squeezing the outside of the tube with rollers. The formulation never passes through pump machinery, and peristaltic pumping is generally regarded as low-shear, which suits living cells.",
      specs: [["Type", "Peristaltic, P240"], ["Fluid contact", "Tubing only"], ["Shear", "Low (to confirm with viability test)"], ["Control", "PWM via MOSFET"]]
    },
    {
      key: "mixer",
      name: "Mixer",
      role: "Blending",
      title: "Mixing in the diaphragm pump",
      text: "The treatment and diluent streams meet at a Y-connector and are then blended inside a diaphragm pump, which replaced the earlier static mixer. Inside the pump the formulation touches the diaphragm and check valves, so their material and the shear they cause matter for the cells.",
      specs: [["Type", "Diaphragm pump after the Y-connector"], ["Replaced", "Static mixer (sprayer iteration 1)"], ["Wetted parts", "Diaphragm + valves, material to add"], ["Viability", "To add"]]
    },
    {
      key: "nozzle",
      name: "Nozzle",
      role: "Atomization",
      title: "Air does the atomizing",
      text: "In the air-assisted nozzle, compressed air supplies the energy that breaks the liquid into droplets, instead of forcing the formulation through a tiny orifice at high pressure. The aim is to limit the mechanical stress on the cells at the very last step.",
      specs: [["Type", "Air-assisted, dual-fluid"], ["Liquid pressure", "Monitored, 0–10 bar"], ["Material", "To add"], ["Validation", "See viability results"]]
    }
  ]
};
