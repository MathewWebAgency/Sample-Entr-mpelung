/* ============================================================
   REVIERKLAR — Interaktion und Bewegung
   ============================================================ */

(function () {
  "use strict";

  var root = document.documentElement;
  root.classList.add("js");

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var forced = /(\?|&)static\b/.test(window.location.search);
  var STATIC = reduced || forced;
  var hasGsap = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";

  var stage = document.querySelector(".hero-stage");
  var imgB = document.querySelector(".hero-img--b");
  var seam = document.querySelector(".hero-seam");
  var stageW = 0;

  function measureStage() { stageW = stage ? stage.getBoundingClientRect().width : 0; }

  /* Die Kante wandert per transform statt per left, das kostet kein Layout.
     Das Custom Property sitzt am Bild selbst, damit nicht der ganze
     Hero-Teilbaum bei jedem Frame neu berechnet wird. */
  function setWipe(v) {
    if (imgB) imgB.style.setProperty("--wipe", v);
    if (seam) seam.style.transform = "translate3d(" + (v * stageW).toFixed(2) + "px,0,0)";
  }

  measureStage();
  window.addEventListener("resize", measureStage, { passive: true });

  /* ---------- Header ab dem ersten Scrollen ----------
     Der erste Bildschirm gehoert dem Hero allein. Sobald jemand scrollt und
     die Kante anlaeuft, faehrt der Header ein. Beobachtet wird ein kleiner
     Marker am Dokumentanfang, nicht der Hero: Der ist waehrend der Animation
     gepinnt und bliebe fuer einen Observer die ganze Zeit sichtbar. */
  var head = document.querySelector(".head[data-over-hero]");
  if (head && "IntersectionObserver" in window) {
    var mark = document.createElement("div");
    mark.className = "head-mark";
    mark.setAttribute("aria-hidden", "true");
    document.body.prepend(mark);
    new IntersectionObserver(function (entries) {
      head.classList.toggle("is-shown", !entries[entries.length - 1].isIntersecting);
    }).observe(mark);
  } else if (head) {
    head.classList.add("is-shown");
  }

  /* ---------- Vorher/Nachher-Regler ---------- */

  document.querySelectorAll("[data-ba]").forEach(function (fig) {
    var frame = fig.querySelector(".ba-frame");
    var range = fig.querySelector(".ba-range");
    if (!frame || !range) return;
    function apply() { frame.style.setProperty("--pos", (parseFloat(range.value) / 100).toFixed(4)); }
    range.addEventListener("input", apply);
    apply();
  });

  /* ---------- Fragen ---------- */

  document.querySelectorAll(".faq-q").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.closest(".faq-item");
      var open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", open ? "false" : "true");
      item.classList.toggle("is-open", !open);
      if (hasGsap && !STATIC) window.ScrollTrigger.refresh();
    });
  });

  /* ---------- Formular ---------- */

  var form = document.querySelector(".kon-form");
  if (form) {
    var status = form.querySelector(".f-status");

    form.addEventListener("input", function (e) {
      var holder = e.target.closest(".f-row") || e.target.closest(".f-check");
      if (!holder || !holder.classList.contains("is-bad")) return;
      holder.classList.remove("is-bad");
      var next = holder.classList.contains("f-check") ? holder.nextElementSibling : holder.querySelector(".f-err");
      if (next && next.classList.contains("f-err")) next.remove();
      status.textContent = "";
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var bad = null;

      form.querySelectorAll(".is-bad").forEach(function (n) { n.classList.remove("is-bad"); });
      form.querySelectorAll(".f-err").forEach(function (n) { n.remove(); });

      form.querySelectorAll("[required]").forEach(function (field) {
        var ok = field.type === "checkbox" ? field.checked : field.value.trim() !== "";
        if (ok) return;
        var row = field.closest(".f-row");
        var box = field.closest(".f-check");
        var msg = document.createElement("p");
        msg.className = "f-err";
        if (row) {
          row.classList.add("is-bad");
          msg.textContent = "Das brauchen wir, um Ihnen antworten zu können.";
          row.appendChild(msg);
        } else if (box) {
          box.classList.add("is-bad");
          msg.textContent = "Bitte kurz zustimmen, sonst dürfen wir Ihre Anfrage nicht bearbeiten.";
          box.parentNode.insertBefore(msg, box.nextSibling);
        }
        if (!bad) bad = field;
      });

      if (bad) { status.textContent = "Da fehlt noch eine Angabe."; bad.focus(); return; }

      /* Echter Versand an anfrage.php. Ohne JavaScript schickt der Browser
         dasselbe Formular klassisch ab und landet auf danke.html. */
      var send = form.querySelector(".f-send");
      var sendLabel = send.textContent;
      send.disabled = true;
      send.textContent = "Wird gesendet …";
      status.textContent = "";

      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { "Accept": "application/json" }
      })
        .then(function (res) { return res.json().catch(function () { return { ok: false }; }); })
        .then(function (data) {
          if (data && data.ok) {
            var done = document.createElement("div");
            done.className = "f-done";
            done.setAttribute("tabindex", "-1");
            done.innerHTML = "<h3>Danke, das ist angekommen.</h3><p></p>";
            done.querySelector("p").textContent = "Wir melden uns am selben Werktag. Wenn es eilt, rufen Sie uns gern direkt an.";
            form.replaceWith(done);
            done.focus();
            return;
          }
          if (data && data.fehler) {
            Object.keys(data.fehler).forEach(function (name) {
              var field = form.elements[name];
              var row = field && field.closest(".f-row");
              if (!row) return;
              row.classList.add("is-bad");
              var msg = document.createElement("p");
              msg.className = "f-err";
              msg.textContent = data.fehler[name];
              row.appendChild(msg);
            });
          }
          throw new Error((data && data.nachricht) || "");
        })
        .catch(function (err) {
          send.disabled = false;
          send.textContent = sendLabel;
          status.textContent = (err && err.message) || "Das hat leider nicht geklappt. Bitte rufen Sie uns an oder versuchen Sie es gleich noch einmal.";
        });
    });
  }

  /* ---------- Statischer Zustand ----------
     Ohne Scroll-Animation steht der Hero fest auf halbem Weg: links der
     geraeumte Keller, rechts der volle, dazwischen die gruene Kante.
     Das erklaert sich von selbst und braucht keinen Schalter. Die Werte
     stehen im CSS, damit hier keine Inline-Styles dagegenhalten. */

  function goStatic() {
    root.classList.add("static-mode");
    measureStage();
  }

  if (STATIC || !hasGsap) {
    goStatic();
    return;
  }

  /* ---------- Smooth Scroll ---------- */

  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;
  gsap.registerPlugin(ScrollTrigger);

  var lenis = null;
  if (typeof window.Lenis !== "undefined") {
    lenis = new window.Lenis({ duration: 1.05, wheelMultiplier: 0.95, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var offset = -(parseInt(getComputedStyle(root).getPropertyValue("--head-h"), 10) || 76) - 16;
      if (lenis) lenis.scrollTo(target, { offset: offset, duration: 1.1 });
      else target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  /* ---------- Hero: Auftritt ---------- */

  var imgA = document.querySelector(".hero-img--a");
  gsap.set(".hero-title", { opacity: 0, y: 26 });
  gsap.set(".hero-sub, .hero-foot", { opacity: 0, y: 18 });
  gsap.set(imgA, { scale: 1.06 });
  setWipe(0);

  gsap.timeline({ delay: 0.1 })
    .to(imgA, { scale: 1, duration: 1.9, ease: "power2.out" }, 0)
    .to(".hero-title", { opacity: 1, y: 0, duration: 0.85, ease: "power3.out" }, 0.18)
    .to(".hero-sub", { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, 0.48)
    .to(".hero-foot", { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, 0.6);

  /* ---------- Hero: die Kante, an den Scroll gekoppelt ---------- */

  var state = { wipe: 0 };
  var heroTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: function () { return "+=" + (window.innerWidth < 768 ? 150 : 220) + "%"; },
      scrub: 0.55, pin: true, anticipatePin: 1,
      invalidateOnRefresh: true, onRefresh: measureStage
    }
  });
  heroTl.to(state, {
    wipe: 1, ease: "none", duration: 1,
    onUpdate: function () { setWipe(state.wipe); }
  }, 0);
  heroTl.to(seam, { opacity: 1, duration: 0.05, ease: "power1.out" }, 0.02);
  heroTl.to(seam, { opacity: 0, duration: 0.08, ease: "power1.in" }, 0.9);

  /* ---------- Sektionen ---------- */

  gsap.utils.toArray("[data-reveal]").forEach(function (el, i) {
    gsap.fromTo(el, { opacity: 0, y: 28 },
      { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", delay: (i % 4) * 0.06,
        scrollTrigger: { trigger: el, start: "top 86%", once: true } });
  });

  gsap.utils.toArray("[data-step]").forEach(function (el) {
    gsap.fromTo(el, { opacity: 0, y: 32 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 84%", once: true } });
  });

  gsap.utils.toArray("[data-line]").forEach(function (li) {
    gsap.fromTo(li.children, { opacity: 0, yPercent: 70 },
      { opacity: 1, yPercent: 0, duration: 0.6, ease: "power3.out", stagger: 0.05,
        scrollTrigger: { trigger: li, start: "top 90%", once: true } });
  });

  /* Der Balken faehrt die Schiene hinunter und schaltet die Marken um,
     an denen er vorbeikommt. Er startet ueber der Schiene und endet an
     ihrem Fuss. Bei 22 Prozent Balkenhoehe ist der Weg 1 / 0.22 = 454,5
     Prozent der eigenen Hoehe, und seine Unterkante entspricht dann
     genau dem Fortschritt. */
  var rail = document.querySelector(".abl-rail");
  var bar = document.querySelector(".abl-bar");
  var ablSteps = gsap.utils.toArray(".abl-step");
  var stepMarks = [];
  var stepOn = ablSteps.map(function () { return false; });

  function measureAbl() {
    if (!rail) return;
    var r = rail.getBoundingClientRect();
    if (!r.height) return;
    stepMarks = ablSteps.map(function (el) {
      var s = el.getBoundingClientRect();
      return (s.top + 18 - r.top) / r.height;
    });
  }

  function setAbl(p) {
    if (bar) bar.style.transform = "translate3d(0," + (p * 454.5 - 100).toFixed(2) + "%,0)";
    var kante = p;
    for (var i = 0; i < ablSteps.length; i++) {
      var on = kante >= stepMarks[i];
      if (on !== stepOn[i]) { stepOn[i] = on; ablSteps[i].classList.toggle("is-on", on); }
    }
  }

  if (rail && bar) {
    measureAbl();
    setAbl(0);
    var ablState = { p: 0 };
    gsap.to(ablState, {
      p: 1, ease: "none",
      scrollTrigger: {
        trigger: ".abl", start: "top 78%", end: "bottom 78%",
        scrub: 0.45, invalidateOnRefresh: true, onRefresh: measureAbl
      },
      onUpdate: function () { setAbl(ablState.p); }
    });
    window.addEventListener("resize", measureAbl, { passive: true });
  }

  window.addEventListener("load", function () { ScrollTrigger.refresh(); });
})();
