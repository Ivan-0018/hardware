/* Runs in <head> so the page never flashes the wrong theme.
   Order: saved choice -> system preference -> light. */
(function () {
  var t = null;
  try { t = localStorage.getItem("hw-theme"); } catch (e) {}
  if (t !== "dark" && t !== "light") {
    t = window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  document.documentElement.setAttribute("data-theme", t);
})();
