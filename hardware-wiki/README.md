# Hardware wiki page

`index.html` is the page. It opens with the scroll-through prologue — five
screens that scroll-snap one to the next — then the hero and the sections; the light/dark button floats in the top right corner.
The Design Explorer lets you pick sprayer system / tank / nozzle and see the
preview (Evolution or 3D), the iterations and the engineering design cycle.

`prototype-version2.html` is the previous single-file version, left untouched.

## Editing text and numbers

Everything that changes lives in `content/` — edit these, not the HTML:

| File | What it holds |
|---|---|
| `content/prologue-content.js` | The scroll-through intro at the top: one beat per screen (text, figures, lists) |
| `content/tank-content.js` | Tank iterations, their design-cycle stages, final tank specs |
| `content/design-cycle-content.js` | Cycle stage names, explorer list, sprayer system iterations (parts drawn in the Evolution view) + nozzle, 3D model paths |
| `content/biocompat-content.js` | The five pentagon components and their biocompatibility text |
| `content/results-content.js` | Viability and test results |
| `content/features-content.js` | Lightweight / compact / modular / adaptive cards |
| `content/how-it-works-content.js` | Spray system, control signal and power diagram specs + pop-ups |
| `content/page-content.js` | Engineering challenges, Open Hardware cards, BOM rows, what's next |

`content/results-content.js` is no longer loaded by the page (the Experimental
Results section was removed), but is kept in case that section comes back.


Text starting with "To add" is shown greyed out as a placeholder.

## Structure

- `css/tokens.css` — Dunelock day/night colours and fonts (Super Dream + Lexend, loaded from static.igem.wiki)
- `css/main.css`, `css/edc.css`, `css/explorer.css` — page styles
- `js/site.js` — theme toggle, side list, circle cursor, floating sand, iframe bridge
- `js/edc.js` — engineering design cycle diagram. Switch between infinity and circle with `shape` at the top of `content/design-cycle-content.js`
- `js/prologue.js` + `css/prologue.css` — the pinned scroll-through intro: it lays the beats out one screen apart and eases the page onto the nearest beat when scrolling stops. `js/prologue-tech.js` draws the schematic scene (dune, fly-past, the nozzle ruled out, the parts assembling, the payload) and registers itself on `window.PROLOGUE_SCENES`; `index.html` selects it with `PROLOGUE.scene = "tech"`. The section's height and the sand/sprayer animation follow the number of beats in `content/prologue-content.js`; with "reduced motion" turned on it degrades to a plain stacked intro
- `js/tank.js` (tank morph player), `js/sections.js`, `js/explorer.js`
- `embeds/` — the four interactive diagrams, each as its own html/css/js
- `assets/img/` — component images. `diaphragm-pump.svg` and `generic-nozzle.svg` are drawn stand-ins: swap in photos when you have them
- `models/sprayer-system.glb` — sprayer system 3D model, converted from the SolidWorks part Part5.SLDPRT (`models/sprayer-system-model.js` is an inline copy so it also opens from disk)
- `tank/frames-light/` (day) and `tank/frames-dark/` (night) — iteration morph frames. `tank/frames/` is the older brown set, no longer used

## Viewing locally

Everything works from `file://` except the 3D viewer's CDN script needs internet.
For the most reliable preview, run a local server in this folder, e.g. `python3 -m http.server`.
