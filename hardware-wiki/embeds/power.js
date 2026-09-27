/* Power distribution: rail filters + load pop-ups. */
(function () {
  const C = (window.HOW_IT_WORKS && window.HOW_IT_WORKS.power) || { filters: {}, items: {} };
  document.getElementById("intro").textContent = C.intro || "";

  const IMAGES = { pump1: "peristaltic-pump", pump2: "peristaltic-pump", compressor: "air-compressor",
                   buck: "buck-converter", esp32: "esp32", sensor: "pressure-sensor" };

  const buttons = [...document.querySelectorAll(".filter")];
  const row12 = document.querySelector(".row12"), row5 = document.querySelector(".row5");
  const loads12 = [...document.querySelectorAll(".v12load")], loads5 = [...document.querySelectorAll(".v5load")];
  const title = document.getElementById("detailTitle"), specs = document.getElementById("detailSpecs");

  function apply(f) {
    row12.classList.toggle("dim", f === "v5");
    row5.classList.toggle("dim", f === "v12");
    loads12.forEach((x) => x.classList.toggle("dim", f === "v5"));
    loads5.forEach((x) => x.classList.toggle("dim", f === "v12"));
    const d = C.filters[f] || C.filters.all;
    if (!d) return;
    title.textContent = d[0];
    specs.innerHTML = d[1].map((x) => '<div class="spec"><span>' + x[0] + "</span><strong>" + x[1] + "</strong></div>").join("");
  }
  buttons.forEach((b) => b.addEventListener("click", () => {
    buttons.forEach((x) => x.classList.toggle("active", x === b));
    apply(b.dataset.f);
  }));
  apply("all");

  document.querySelectorAll("[data-info]").forEach((el) => {
    const key = el.dataset.info, d = C.items[key];
    if (!d) return;
    el.setAttribute("tabindex", "0");
    el.setAttribute("role", "button");
    el.setAttribute("aria-label", "Open " + d.title + " information");
    const go = () => EmbedUI.open({ kicker: d.kicker, title: d.title, role: d.role, specs: d.specs,
      image: IMAGES[key] ? "../assets/img/" + IMAGES[key] + ".png" : null }, el);
    el.addEventListener("click", go);
    el.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
  });
})();
