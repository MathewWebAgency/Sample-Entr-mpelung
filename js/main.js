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
  var wrapB = document.querySelector(".hero-b");
  var imgB = document.querySelector(".hero-img--b");
  var seam = document.querySelector(".hero-seam");
  var kiWrap = document.querySelector(".hero-ki");
  var kiIn = document.querySelector(".hero-ki-in");
  var stageW = 0;

  /* Auf dem Handy ist unter den Knoepfen kein Platz fuer den KI-Hinweis.
     Dort steht er oben links, knapp unter dem grossen Logo. Gemessen per
     offset*, das von den Animationen (transform) unberuehrt bleibt. */
  var kiTag = document.querySelector(".hero-ki .ki-tag");
  var kiLogo = document.querySelector(".hero-logo");
  function placeKi() {
    if (!kiTag || !kiLogo || !stage) return;
    if (window.innerWidth >= 768) { kiTag.style.top = ""; kiTag.style.bottom = ""; return; }
    var y = 0, el = kiLogo;
    while (el && el !== stage) { y += el.offsetTop; el = el.offsetParent; }
    kiTag.style.top = Math.round(y + kiLogo.offsetHeight + 12) + "px";
    kiTag.style.bottom = "auto";
  }

  function measureStage() { stageW = stage ? stage.getBoundingClientRect().width : 0; placeKi(); }

  /* Kante, Rahmen und Bild bewegen sich nur per transform. Kein clip-path,
     kein left: Pro Frame wird nichts neu gezeichnet, nur verschoben. */
  function setWipe(v) {
    var off = ((v - 1) * 100).toFixed(3);
    if (wrapB) wrapB.style.transform = "translate3d(" + off + "%,0,0)";
    if (imgB) imgB.style.transform = "translate3d(" + (-off) + "%,0,0)";
    if (kiWrap) kiWrap.style.transform = "translate3d(" + off + "%,0,0)";
    if (kiIn) kiIn.style.transform = "translate3d(" + (-off) + "%,0,0)";
    if (seam) seam.style.transform = "translate3d(" + (v * stageW).toFixed(2) + "px,0,0)";
  }

  measureStage();
  window.addEventListener("resize", measureStage, { passive: true });

  /* ---------- Nachher-Foto im Hero nachladen ----------
     Beim Start ist es unsichtbar. Es laedt, wenn die Seite fertig ist, oder
     spaetestens beim ersten Scrollen, bevor die Kante es freilegt. So
     konkurriert es nicht mit Schrift und Ueberschrift um die Leitung. */
  var nachherGeladen = false;
  function ladeNachher() {
    if (nachherGeladen) return;
    nachherGeladen = true;
    document.querySelectorAll(".hero-b [data-srcset]").forEach(function (el) {
      el.setAttribute("srcset", el.getAttribute("data-srcset"));
      el.removeAttribute("data-srcset");
    });
    var bImg = document.querySelector("[data-nachher][data-src]");
    if (bImg) { bImg.src = bImg.getAttribute("data-src"); bImg.removeAttribute("data-src"); }
  }
  if (STATIC) {
    ladeNachher();
  } else {
    ["scroll", "wheel", "touchstart", "keydown"].forEach(function (ev) {
      window.addEventListener(ev, ladeNachher, { passive: true, once: true });
    });
    window.addEventListener("load", function () {
      if ("requestIdleCallback" in window) requestIdleCallback(ladeNachher, { timeout: 1500 });
      else setTimeout(ladeNachher, 300);
    });
  }

  /* ---------- Header erst nach dem Hero ----------
     Im Hero steht das grosse Logo, der Header ist ganz weg. Er blendet ein,
     wenn die Hero-Animation durch ist (siehe heroTl) bzw. im statischen
     Modus, wenn der Hero aus dem Bild gescrollt ist. */
  var head = document.querySelector(".head[data-over-hero]");
  var headOn = false;
  function setHead(on) {
    if (!head || on === headOn) return;
    headOn = on;
    head.classList.toggle("is-shown", on);
  }
  function headWhenHeroGone() {
    var hero = document.querySelector(".hero");
    if (!head || !hero || !("IntersectionObserver" in window)) { setHead(true); return; }
    var headH = parseInt(getComputedStyle(root).getPropertyValue("--head-h"), 10) || 76;
    new IntersectionObserver(function (entries) {
      var e = entries[entries.length - 1];
      setHead(!e.isIntersecting && e.boundingClientRect.top < 0);
    }, { rootMargin: "-" + headH + "px 0px 0px 0px" }).observe(hero);
  }

  /* ---------- Vorher/Nachher-Regler ---------- */

  /* Ziehen mit Finger oder Maus ueber Pointer Events. Der unsichtbare native
     Regler bleibt fuer die Tastatur und wird mitgefuehrt. Auf dem Handy
     springt die Kante nicht schon beim Aufsetzen, sonst wuerde jeder, der
     nur an dem Bild vorbeiscrollt, sie verschieben. Sie folgt erst, wenn der
     Finger waagerecht zieht, oder beim kurzen Antippen. */
  document.querySelectorAll("[data-ba]").forEach(function (fig) {
    var frame = fig.querySelector(".ba-frame");
    var range = fig.querySelector(".ba-range");
    var top = fig.querySelector(".ba-top");
    var topImg = fig.querySelector(".ba-img--top");
    var line = fig.querySelector(".ba-seam");
    if (!frame || !range || !top || !topImg || !line) return;

    function setPos(p) {
      p = Math.min(1, Math.max(0, p));
      var off = ((p - 1) * 100).toFixed(3);
      top.style.transform = "translate3d(" + off + "%,0,0)";
      topImg.style.transform = "translate3d(" + (-off) + "%,0,0)";
      line.style.transform = "translate3d(" + off + "%,0,0)";
      range.value = (p * 100).toFixed(1);
    }

    /* Die Lage des Rahmens wird einmal pro Zug gemessen, nicht bei jeder
       Mausbewegung, und gezeichnet wird hoechstens einmal pro Frame. */
    var rect = null, lastX = 0, frameReq = 0;
    function measure() { rect = frame.getBoundingClientRect(); }
    function flush() {
      frameReq = 0;
      if (rect && rect.width) setPos((lastX - rect.left) / rect.width);
    }
    function fromEvent(e) {
      if (!rect) measure();
      lastX = e.clientX;
      if (!frameReq) frameReq = requestAnimationFrame(flush);
    }

    var active = null;   // Pointer-ID des laufenden Zugs, weitere Finger werden ignoriert
    var startX = 0, startY = 0, engaged = false;

    frame.addEventListener("pointerdown", function (e) {
      if (active !== null) return;
      if (e.pointerType === "mouse" && e.button !== 0) return;
      active = e.pointerId;
      startX = e.clientX; startY = e.clientY;
      engaged = e.pointerType === "mouse";
      measure();
      try { frame.setPointerCapture(e.pointerId); } catch (err) { /* synthetisches Event */ }
      frame.classList.add("is-dragging");
      if (e.pointerType === "mouse") { fromEvent(e); e.preventDefault(); }
    });
    frame.addEventListener("pointermove", function (e) {
      if (e.pointerId !== active) return;
      if (!engaged) {
        // Auf Touch erst folgen, wenn der Finger eindeutig waagerecht zieht
        var dx = Math.abs(e.clientX - startX), dy = Math.abs(e.clientY - startY);
        if (dx > 6 && dx > dy) engaged = true; else return;
      }
      fromEvent(e);
    });
    function end(e) {
      if (e.pointerId !== active) return;
      // Ohne waagerechten Zug war es ein Antippen: dorthin springen
      if (e.type === "pointerup" && !engaged) lastX = e.clientX;
      if (e.type === "pointerup") {
        // Letzte Position sofort zeichnen, bevor der Zug endet
        if (frameReq) cancelAnimationFrame(frameReq);
        if (!rect) measure();
        flush();
      } else if (frameReq) {
        cancelAnimationFrame(frameReq);
        frameReq = 0;
      }
      active = null;
      rect = null;
      frame.classList.remove("is-dragging");
    }
    frame.addEventListener("pointerup", end);
    frame.addEventListener("pointercancel", end);
    frame.addEventListener("dragstart", function (e) { e.preventDefault(); });

    range.addEventListener("input", function () { setPos(parseFloat(range.value) / 100); });
    setPos(parseFloat(range.value) / 100);
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

      /* Versand an Formspree. Ohne JavaScript schickt der Browser dasselbe
         Formular klassisch ab und landet auf der Dankeseite von Formspree. */
      var send = form.querySelector(".f-send");
      var sendLabel = send.textContent;
      send.disabled = true;
      send.textContent = "Wird gesendet …";
      status.textContent = "";

      var MELDUNG = {
        name: "Das brauchen wir, um Ihnen antworten zu können.",
        email: "Diese <span class=\"nw\">E-Mail-Adresse</span> sieht nicht vollständig aus."
      };

      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { "Accept": "application/json" }
      })
        .then(function (res) {
          return res.json().catch(function () { return {}; }).then(function (data) {
            return { ok: res.ok, data: data || {} };
          });
        })
        .then(function (r) {
          if (r.ok) {
            var done = document.createElement("div");
            done.className = "f-done";
            done.setAttribute("tabindex", "-1");
            done.innerHTML = "<h3>Danke, das ist angekommen.</h3><p></p>";
            done.querySelector("p").textContent = "Wir melden uns am selben Werktag. Wenn es eilt, rufen Sie uns gern direkt an.";
            form.replaceWith(done);
            done.focus();
            return;
          }
          (r.data.errors || []).forEach(function (fe) {
            var field = fe.field && form.elements[fe.field];
            var row = field && field.closest && field.closest(".f-row");
            if (!row || row.classList.contains("is-bad")) return;
            row.classList.add("is-bad");
            var msg = document.createElement("p");
            msg.className = "f-err";
            // Feste Texte aus MELDUNG, nichts vom Server
            msg.innerHTML = Object.prototype.hasOwnProperty.call(MELDUNG, fe.field) ? MELDUNG[fe.field] : "Bitte prüfen Sie diese Angabe.";
            row.appendChild(msg);
          });
          throw new Error(form.querySelector(".f-err") ? "Bitte prüfen Sie die markierte Angabe." : "");
        })
        .catch(function (err) {
          send.disabled = false;
          send.textContent = sendLabel;
          status.textContent = (err && err.message) || "Das hat leider nicht geklappt. Bitte rufen Sie uns an oder schreiben Sie direkt an info@revierklar.de.";
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
    headWhenHeroGone();
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

  /* ---------- Hero: Auftritt ----------
     Laeuft in CSS (@keyframes hero-auf, siehe style.css), nicht hier: CSS
     startet mit dem ersten Bild, GSAP erst nach dem Laden der Bibliotheken.
     Auf langsamen Verbindungen stand die Ueberschrift sonst Sekunden lang
     unsichtbar da (LCP 4,9 s statt ~2 s). */
  setWipe(0);

  /* ---------- Hero: die Kante, an den Scroll gekoppelt ---------- */

  var state = { wipe: 0 };
  var heroTl = gsap.timeline({
    /* Der Header haengt am Fortschritt der Animation selbst, nicht an der
       Scrollposition: scrub laeuft dem Scrollen hinterher, sonst kaeme der
       Header, waehrend das Logo noch fliegt. */
    onUpdate: function () { setHead(heroTl.progress() > 0.995); },
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

  /* Das grosse Logo dockt an: Im letzten Drittel schrumpft die Tafel und
     gleitet so, dass ihr Logo genau auf dem Header-Logo landet, gleiche
     Stelle, gleiche Groesse. Gemessen wird mit offset*-Werten, die von
     transform unberuehrt bleiben, und bei jedem Refresh neu. */
  var plate = document.querySelector(".hero-logo");
  var plateImg = plate && plate.querySelector(".hero-logo-img");
  var headImg = head && head.querySelector(".head-brand img");
  function offsetIn(el, stop) {
    var x = 0, y = 0;
    while (el && el !== stop) { x += el.offsetLeft; y += el.offsetTop; el = el.offsetParent; }
    return { x: x, y: y };
  }
  function dock(axis) {
    var p = offsetIn(plate, stage);
    var h = offsetIn(headImg, head);
    var s = headImg.offsetWidth / plateImg.offsetWidth;
    if (axis === "s") return s;
    if (axis === "x") return h.x - p.x - plateImg.offsetLeft * s;
    return h.y - p.y - plateImg.offsetTop * s;
  }
  if (plate && plateImg && headImg) {
    heroTl.fromTo(plate, { x: 0, y: 0, scale: 1 }, {
      x: function () { return dock("x"); },
      y: function () { return dock("y"); },
      scale: function () { return dock("s"); },
      ease: "power2.inOut", duration: 0.34
    }, 0.64);
    heroTl.to(".hero-logo-bg", { opacity: 1, duration: 0.2, ease: "power1.out" }, 0.7);
  }

  /* ---------- Sektionen ---------- */

  gsap.utils.toArray("[data-reveal]").forEach(function (el, i) {
    gsap.fromTo(el, { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", delay: (i % 4) * 0.04,
        scrollTrigger: { trigger: el, start: "top 94%", once: true } });
  });

  gsap.utils.toArray("[data-step]").forEach(function (el) {
    gsap.fromTo(el, { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.55, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 92%", once: true } });
  });

  gsap.utils.toArray("[data-line]").forEach(function (li) {
    gsap.fromTo(li.children, { opacity: 0, yPercent: 50 },
      { opacity: 1, yPercent: 0, duration: 0.45, ease: "power3.out", stagger: 0.04,
        scrollTrigger: { trigger: li, start: "top 96%", once: true } });
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
