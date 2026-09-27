/* ============================================================
   TANK DESIGN EVOLUTION — editable information
   Everything shown in the tank block of the hardware page lives
   here. Edit text freely; the page picks it up on reload.
   "hold" is the animation frame where that iteration sits —
   leave those numbers alone unless the frames are re-rendered.
   ============================================================ */
window.TANK_CONTENT = {

  intro: {
    label: "Tank design evolution",
    hint: "Select a dot to morph between iterations."
  },

  iterations: [
    {
      label: "Iteration 1",
      hold: 8,
      title: "Side by side bottles",
      body: "Our initial design was very simple, two bottles side by side. They were two rounded cuboids measuring 500ml each, based on a simple bottle model that was easily available."
    },
    {
      label: "Iteration 2",
      hold: 78,
      title: "Stacked tanks",
      body: "We wanted to be able to mount our sprayer system to a drone, and for that we needed symmetry. In order to achieve this, we switched to a custom tank design where we have the two tanks stacked on top of each other. This would prevent imbalance due to the differing weight of the two tanks."
    },
    {
      label: "Iteration 3",
      hold: 148,
      title: "Sloped bases",
      body: "With the stacked tanks, we had solved the symmetry problem but we ran into a different issue. When the tanks were empty, there still remained liquid on the bottom of the base. In order to solve this, we sloped the bases so that the liquid would pool at the lower corner, where the outlet was. We chose opposing equal slopes to preserve symmetry."
    },
    {
      label: "Iteration 4",
      hold: 218,
      title: "Chevron shape",
      body: "The sloped bases reduced the water wastage, but introduced a new issue. The system was symmetric when both tanks were either full or empty, but not when one tank was partially full. We solved this by switching to a chevron design, so that each tank's center of gravity remained in the middle throughout. We then included the inlet (in teal) and the outlets (in orange), the one at the top for air to move as the tank was being emptied or filled."
    },
    {
      label: "Iteration 5",
      hold: 288,
      title: "Slide-rails",
      body: "To lock the two tanks together we added a custom T-shaped protrusion on the top tank sliding into a T-shape slot on the rail block on the bottom tank. The inlet and outlet become vertical channels beside the slot in the rail block, and the top tank also gains air-out ports."
    },
    {
      label: "Iteration 6",
      hold: 388,
      title: "Combined design",
      body: "We took a step back and realised that our design was needlessly complex. We simplified it by moving the rail slot to the top of the bottom tank, and introducing matching railing under it. Now, we discarded the top tank altogether, and instead arrived at an infinitely scalable system, where the same tank design easily stacked on top of itself, freely allowing us to swap the order or number of tanks if needed. The railing made it secure when attached, but easy to remove when needed."
    }
  ],

  current: {
    label: "The current design",
    title: "Meet the final tank",
    body: "The manufacturable Dunelock reaction tank: a single wide-chevron body that funnels to one base outlet, with dovetail slide-rails for stacking. Drag to rotate, scroll to zoom.",
    specs: [
      { label: "Material",   value: "PLA" },
      { label: "Dimensions", value: "200 × 80 × 50 mm (length × base × height)" },
      { label: "Body",       value: "Wide chevron cross-section, V-base funnel, rounded internal corners" },
      { label: "Ports",      value: "One outlet at the base · liquid inlet + air outlet on top (might be changed to a slideable top)" },
      { label: "Mounting",   value: "Square-T slots on top, angled T-tail feet below" },
      { label: "Finish",     value: "Internal resin coating to prevent microbe growth" }
    ]
  }
};
