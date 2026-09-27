# Hardware wiki page

`index.html` is the page. Sections are listed in the side list on the left
(on narrow screens only the light/dark button is shown, bottom right).
The Design Explorer lets you pick sprayer system / tank / nozzle and see the
preview (Evolution or 3D), the iterations and the engineering design cycle.

`prototype-version2.html` is the previous single-file version, left untouched.

## Editing text and numbers

Everything that changes lives in `content/` — edit these, not the HTML:

| File | What it holds |
|---|---|
| `content/tank-content.js` | Tank iterations, their design-cycle stages, final tank specs |
| `content/design-cycle-content.js` | Cycle stage names, explorer list, sprayer system iterations (parts drawn in the Evolution view) + nozzle, 3D model paths |
| `content/biocompat-content.js` | The five pentagon components and their biocompatibility text |
| `content/results-content.js` | Viability and test results |
| `content/features-content.js` | Lightweight / compact / modular / adaptive cards |
| `content/how-it-works-content.js` | Spray system, control signal and power diagram specs + pop-ups |
| `content/page-content.js` | Engineering challenges, open hardware links, BOM rows, what's next |

Text starting with "To add" is shown greyed out as a placeholder.

## Structure

- `css/tokens.css` — light and dark colours (dark follows the Tank-design website)
- `css/main.css`, `css/edc.css`, `css/explorer.css` — page styles
- `js/site.js` — theme toggle, side list, circle cursor, floating sand, iframe bridge
- `js/edc.js` — engineering design cycle diagram. Switch between infinity and circle with `shape` at the top of `content/design-cycle-content.js`
- `js/tank.js` (tank morph player), `js/sections.js`, `js/explorer.js`
- `embeds/` — the four interactive diagrams, each as its own html/css/js
- `assets/img/` — component images. `diaphragm-pump.svg` is a drawn stand-in: swap in a photo when you have one
- `tank/frames/` (light) and `tank/frames-dark/` — iteration morph frames

## Viewing locally

Everything works from `file://` except the 3D viewer's CDN script needs internet.
For the most reliable preview, run a local server in this folder, e.g. `python3 -m http.server`.
