// Slide navigation + simple count-up timer (starts at 00:00).
// Press T to start/pause.
(function () {
  var slides = Array.prototype.slice.call(document.querySelectorAll(".slide"));
  var counter = document.getElementById("counter");
  var bar = document.getElementById("progress");
  var current = 0;

  var elapsed = 0, running = false, last = 0, tick = null;
  var elTotal = document.getElementById("tTotal");
  var btnToggle = document.getElementById("tToggle");
  var btnReset = document.getElementById("tReset");

  function two(n) { return ("0" + n).slice(-2); }
  function fmt(s) {
    s = Math.floor(s);
    var h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    return (h ? h + ":" + two(m) : two(m)) + ":" + two(sec);
  }
  function render() { elTotal.textContent = fmt(elapsed); }
  function onTick() { var now = Date.now(); elapsed += (now - last) / 1000; last = now; render(); }
  function start() { running = true; last = Date.now(); tick = setInterval(onTick, 250); btnToggle.textContent = "❚❚ pause"; }
  function pause() { if (running) onTick(); running = false; clearInterval(tick); btnToggle.textContent = "▶ start"; }

  btnToggle.addEventListener("click", function () { running ? pause() : start(); });
  btnReset.addEventListener("click", function () { pause(); elapsed = 0; render(); });

  function update() {
    var mid = window.innerHeight / 2;
    for (var i = 0; i < slides.length; i++) {
      var r = slides[i].getBoundingClientRect();
      if (r.top <= mid && r.bottom > mid) { current = i; break; }
    }
    counter.textContent = (current + 1) + " / " + slides.length;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
  }

  function go(i) {
    i = Math.max(0, Math.min(slides.length - 1, i));
    slides[i].scrollIntoView({ behavior: "smooth", block: "start" });
  }

  document.getElementById("prev").addEventListener("click", function () { go(current - 1); });
  document.getElementById("next").addEventListener("click", function () { go(current + 1); });

  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowDown" || e.key === "ArrowRight" || e.key === "PageDown") { e.preventDefault(); go(current + 1); }
    if (e.key === "ArrowUp" || e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); go(current - 1); }
    if (e.key === "t" || e.key === "T") { running ? pause() : start(); }
  });

  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update(); render();
})();
