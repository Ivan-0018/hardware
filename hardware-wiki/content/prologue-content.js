/* ============================================================
   PROLOGUE — the full-screen scroll-through at the top of the page
   One beat = one screen of scrolling. Add or remove beats freely:
   the section height, the rail and the animation all follow.

   Per beat:
     eyebrow  small label above the heading
     title    the heading
     body     one paragraph (optional)
     stats    [[figure, caption], ...]   (optional)
     list     [[label, line], ...]       (optional)
     ordered  true  -> the list is numbered

   scene: "sand" (default) or "sketch" (the pencil version, index2)
   ============================================================ */
window.PROLOGUE = {

  skip: "Skip intro",
  cue: "Scroll",

  beats: [
    {
      eyebrow: "Dunelock 2026",
      title: "The biology only works on sand it reaches.",
      body: "Dunelock stabilises desert sand with engineered Bacillus subtilis: γ-PGA binds the grains and holds water, carbonate precipitation locks the top layer into a crust. All of it depends on living cells arriving on the dune intact."
    },
    {
      eyebrow: "The hardware problem",
      title: "Getting the bacteria onto the sand.",
      body: "Spores in a carrier solution, laid in strips across the prevailing wind, over ground with no roads, no irrigation and no power. The payload has to fly there, meter the formulation itself, and spray something alive without killing it."
    },
    {
      eyebrow: "Why we had to build one",
      title: "Nothing off the shelf sprays something living.",
      list: [
        ["Pressure kills cells", "Agricultural nozzles atomize by forcing liquid through a small orifice. The shear that makes a fine droplet is the shear that kills what is in it."],
        ["One tank means one formulation", "The mix has to be fixed on the ground, hours before it reaches the sand — and a biological formulation does not wait in a tank unchanged."],
        ["Viscous-fluid systems do not fly", "Equipment built for thick fluids is heavy, high-pressure and stationary. The opposite of a payload."],
        ["The wetted path is a culture vessel", "Every surface between tank and nozzle is somewhere microbes can colonise, and whatever is left behind contaminates the next run."]
      ]
    },
    {
      eyebrow: "What the hardware has to do",
      title: "Five requirements. The rest of this page is the evidence.",
      ordered: true,
      list: [
        ["Meter two fluids independently", "so the ratio is set in flight, not before take-off"],
        ["Mix onboard, immediately before spraying", "so the formulation is made at the moment of delivery"],
        ["Atomize without killing the cells", "air supplies the break-up energy, not pressure"],
        ["Keep the wetted path inert and serviceable", "sealed tanks, replaceable tubing, no pump internals touching the fluid"],
        ["Fly", "light and compact enough to mount on more than one vehicle"]
      ]
    },
    {
      eyebrow: "The payload",
      title: "An autonomous dual-fluid drone sprayer.",
      body: "Seven tank designs, three sprayer architectures, two nozzles."
    }
  ]
};
