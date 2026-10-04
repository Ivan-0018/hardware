/* ============================================================
   TANK DESIGN — editable information  (version 2, used by index2.html)
   From the hardware write-up for the wiki team.
   - "hold" is the animation frame where that iteration sits:
     leave those numbers alone unless the frames are re-rendered.
     Iteration 7 has no drawing yet, so it reuses the last frame
     and shows its "note" under the viewer.
   - "cycle" is the engineering design cycle for that iteration
     (design / build / test / learn). Text starting with "To add"
     is shown greyed out as a placeholder.
   ============================================================ */
window.TANK_CONTENT = {

  intro: {
    label: "Tank design evolution",
    hint: "Select a dot to morph between iterations. Each iteration is one full lap of the design cycle."
  },

  iterations: [
    {
      label: "Iteration 1",
      hold: 8,
      title: "Side by side bottles",
      body: "Our initial design was very simple, two bottles side by side. They were two rounded cuboids measuring 500ml each, based on a simple bottle model that was easily available.",
      cycle: {
        design: "Two 500 mL rounded-cuboid bottles placed side by side.",
        build: "We took two ready-made PVC bottles.",
        test: "We checked it against drone mounting and realised that the different fluid weights made the payload off-balance.",
        learn: "We needed a design that remained symmetric around the centre line."
      }
    },
    {
      label: "Iteration 2",
      hold: 78,
      title: "Stacked tanks",
      body: "We wanted to be able to mount our sprayer system to a drone, and for that we needed symmetry. In order to achieve this, we switched to a custom tank design where we have the two tanks stacked on top of each other. This would prevent imbalance due to the differing weight of the two tanks.",
      cycle: {
        design: "We made flat, square-based tanks that would simply be stacked on top of each other.",
        build: "We replaced the ready-made bottles with these tanks.",
        test: "The tanks were symmetric.",
        learn: "Stacked tanks worked well, especially if we kept the heavier tank at the bottom of the stack."
      }
    },
    {
      label: "Iteration 3",
      hold: 148,
      title: "Sloped bases",
      body: "With the tanks stacked, the balance was now good. However, because of the wider base, more liquid was left behind when the tanks emptied. We sloped the bases so that the liquid would pool at the lower corner, where the outlet was.",
      cycle: {
        design: "We had multiple challenges that meant we would either need to sacrifice stability or symmetry. We settled on a compromise and sloped the base by a very small tilt angle, affecting symmetry a small amount but preserving stability.",
        build: "We made a new mounting plate shape for the tanks, and added outlets near the bottom.",
        test: "We filled the tanks and let them drain. Wastage reduced significantly, and stability wasn't affected much.",
        learn: "Sloping by a slight angle let us keep stability while keeping a reasonable amount of symmetry. Ideally, though, it would be perfectly symmetric."
      }
    },
    {
      label: "Iteration 4",
      hold: 218,
      title: "Chevron shape",
      body: "The sloped bases reduced the water wastage, but introduced a new issue. The system was symmetric when both tanks were either full or empty, but not when one tank was partially full. We solved this by switching to a chevron design, so that each tank's center of gravity remained in the middle throughout. We then included the inlet (in teal) and the outlets (in orange), the one at the top for air to move as the tank was being emptied or filled.",
      cycle: {
        design: "A chevron cross-section, so each tank's centre of gravity stays central throughout.",
        build: "Added the inlet (teal) and the outlets (orange), including a top port for air to move while filling or emptying.",
        test: "We filled the tanks with liquid and tested stability and waste; neither was lacking.",
        learn: "We could reasonably use a chevron. The new challenge was how to mount it."
      }
    },
    {
      label: "Iteration 5",
      hold: 288,
      title: "Slide-rails",
      body: "We wanted a way to lock the two tanks together, so we added a custom T-shaped protrusion on the top tank sliding into a T-shape slot on the rail block on the bottom tank. The inlet and outlet become vertical channels beside the slot in the rail block, and the top tank also gains air-out ports.",
      cycle: {
        design: "A T-shaped protrusion on the top tank slides into a T-slot on a rail block on the bottom tank.",
        build: "Inlet and outlet became vertical channels beside the slot; the top tank gained air-out ports.",
        test: "It worked well, but it was not scalable.",
        learn: "We could make a condensed design that keeps all the advantages so far."
      }
    },
    {
      label: "Iteration 6",
      hold: 388,
      title: "Combined design",
      body: "We took a step back and realised that our design was needlessly complex. We simplified it by moving the rail slot to the top of the bottom tank, and introducing matching railing under it. Now, we discarded the top tank altogether, and instead arrived at an infinitely scalable system, where the same tank design easily stacked on top of itself, freely allowing us to swap the order or number of tanks if needed. The railing made it secure when attached, but easy to remove when needed.",
      cycle: {
        design: "Rail slot moved to the top of the tank, with matching railing underneath.",
        build: "A single tank design that stacks on itself; the order or number of tanks can be swapped freely.",
        test: "It worked well, which raised a new question: how to coat the internals.",
        learn: "It worked well, but there was no way to spray resin inside."
      }
    },
    {
      label: "Iteration 7",
      hold: 388,               // no drawing yet: reuses the iteration 6 frame
      note: "Drawing for this iteration to add",
      title: "Adjusted rails",
      body: "We needed a way to add resin to the internals, so we added a slideable top that lets resin be sprayed inside the tank.",
      cycle: {
        design: "We added a slideable top so resin could be sprayed inside.",
        build: "Printed.",
        test: "To add: how it was tested and what happened.",
        learn: "To add."
      }
    }
  ],

  current: {
    label: "The current design",
    title: "Meet the final tank",
    body: "The manufacturable Dunelock reaction tank: a single wide-chevron body that funnels to one base outlet, with dovetail slide-rails for stacking. Drag to rotate, scroll to zoom.",
    model: "tank/tank_iter6.glb",
    specs: [
      { label: "Material",   value: "PLA" },
      { label: "Dimensions", value: "200 × 80 × 50 mm (length × base × height)" },
      { label: "Body",       value: "Wide chevron cross-section, V-base funnel, rounded internal corners" },
      { label: "Ports",      value: "One outlet at the base · liquid inlet + air outlet on top (might be changed to a slideable top)" },
      { label: "Mounting",   value: "Square-T slots on top, angled T-tail feet below" },
      { label: "Finish",     value: "Internal coating of 5 layers of resin to prevent microbe growth" }
    ]
  }
};
