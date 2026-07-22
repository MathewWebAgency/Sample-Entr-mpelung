/* Entrümpelung Beispiel — Interaktion & Scroll-Inszenierung
   Aufbau: Basis-Interaktion läuft immer (Header, Menü, FAQ, Formular).
   Animationen nur, wenn GSAP geladen ist UND keine reduzierte Bewegung
   gewünscht ist — sonst statischer Fallback (.static-mode).
   Test-Hilfe: ?static an die URL hängen erzwingt den statischen Modus. */

(function () {
  'use strict';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var forceStatic = new URLSearchParams(window.location.search).has('static');
  var hasLibs = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  var STATIC = prefersReduced || forceStatic || !hasLibs;

  var header = document.querySelector('.site-header');
  var nav = document.getElementById('main-nav');
  var burger = document.querySelector('.burger');
  var lenis = null;

  /* ---------- Basis: läuft in jedem Modus ---------- */

  function setHeaderState() {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', setHeaderState, { passive: true });
  setHeaderState();

  function closeNav() {
    nav.classList.remove('open');
    document.body.classList.remove('nav-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Menü öffnen');
  }
  burger.addEventListener('click', function () {
    var open = !nav.classList.contains('open');
    nav.classList.toggle('open', open);
    document.body.classList.toggle('nav-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
  });

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (event) {
      var target = document.querySelector(link.getAttribute('href'));
      closeNav();
      if (target && lenis) {
        event.preventDefault();
        lenis.scrollTo(target, { offset: -70 });
      }
    });
  });

  document.querySelectorAll('.faq-q').forEach(function (button) {
    button.addEventListener('click', function () {
      var item = button.closest('.faq-item');
      var open = !item.classList.contains('open');
      item.classList.toggle('open', open);
      button.setAttribute('aria-expanded', String(open));
    });
  });

  /* Vorher/Nachher-Regler: Range-Input steuert den clip-path über --pos.
     sync() beim Init gleicht --pos an den echten Input-Wert an (Formular-Restore). */
  document.querySelectorAll('.ba').forEach(function (ba) {
    var range = ba.querySelector('.ba-range');
    if (!range) return;
    var sync = function () {
      ba.style.setProperty('--pos', range.value + '%');
    };
    range.addEventListener('input', sync);
    sync();
  });

  var form = document.getElementById('kontakt-form');
  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (!form.reportValidity()) return;
      var name = form.elements.name.value.trim();
      var kontakt = form.elements.kontakt.value.trim();
      var nachricht = form.elements.nachricht.value.trim();
      var body = 'Name: ' + name + '\nErreichbar unter: ' + kontakt + '\n\n' + nachricht;
      /* mailto-Fallback ohne Backend — E-Mail-Adresse beim Livegang ersetzen */
      window.location.href = 'mailto:info@entruempelung-beispiel.de'
        + '?subject=' + encodeURIComponent('Anfrage Entrümpelung')
        + '&body=' + encodeURIComponent(body);
    });
  }

  var jahr = document.getElementById('jahr');
  if (jahr) jahr.textContent = String(new Date().getFullYear());

  /* ---------- Statischer Modus: hier ist Schluss ---------- */

  if (STATIC) {
    document.documentElement.classList.add('static-mode');
    return;
  }

  /* ---------- Animierter Modus ---------- */

  gsap.registerPlugin(ScrollTrigger);

  if (typeof window.Lenis !== 'undefined') {
    lenis = new Lenis({ lerp: 0.12 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  /* Hero: Headline-Wörter kippen gestaffelt aus der 3D-Rotation ein */
  var intro = gsap.timeline({ defaults: { ease: 'power4.out' } });
  intro.from('.hero-title .word', {
    yPercent: 115,
    rotateX: -75,
    transformOrigin: '50% 100%',
    transformPerspective: 600,
    duration: 1.1,
    stagger: 0.13
  }, 0.15);
  intro.from(['.hero .eyebrow', '.hero-sub', '.hero-ctas'], {
    y: 28, opacity: 0, duration: 0.9, stagger: 0.1
  }, 0.55);

  /* Hero-Bild weicht beim Scrollen mit Tilt und Scale zurück */
  gsap.to('.hero-media img', {
    scale: 1.14,
    yPercent: 9,
    rotateX: 3,
    transformPerspective: 900,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
  });

  /* Vertrauens-Zahlen: 3D-Flip + Einzählen */
  document.querySelectorAll('.zahl').forEach(function (zahl) {
    var countEl = zahl.querySelector('.count');
    var end = parseInt(countEl.dataset.count, 10);
    var counter = { v: 0 };
    countEl.textContent = '0';
    var tl = gsap.timeline({
      scrollTrigger: { trigger: zahl, start: 'top 85%', once: true }
    });
    tl.from(zahl.querySelector('.zahl-wert'), {
      rotateX: -70,
      transformOrigin: '50% 100%',
      transformPerspective: 600,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    }, 0);
    tl.to(counter, {
      v: end,
      duration: 1.6,
      ease: 'power2.out',
      onUpdate: function () { countEl.textContent = String(Math.round(counter.v)); }
    }, 0.1);
  });

  /* Sanfte Reveals für Headlines & Textblöcke */
  gsap.utils.toArray('.reveal').forEach(function (el) {
    if (el.classList.contains('zahl')) return;
    gsap.from(el, {
      y: 36, opacity: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    });
  });

  /* ---------- Wow-Moment: Der Raum leert sich ---------- */

  (function initRaum() {
    var stage = document.querySelector('.raum-stage');
    if (!stage) return;
    var cards = gsap.utils.toArray('.item-card').filter(function (card) {
      return window.getComputedStyle(card).display !== 'none';
    });
    var counterEl = stage.querySelector('.m3-wert');
    var result = stage.querySelector('.raum-result');
    var title = stage.querySelector('.raum-title');
    var total = cards.reduce(function (sum, card) {
      return sum + parseFloat(card.dataset.m3);
    }, 0);
    var volumen = { v: total };
    var format = function (value) {
      return value.toFixed(1).replace('.', ',');
    };
    counterEl.textContent = format(total);
    gsap.set(result, { visibility: 'visible', opacity: 0, scale: 0.92 });

    var step = 0.55;
    var flyTime = cards.length * step + 1;
    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.raum',
        start: 'top top',
        end: '+=300%',
        scrub: 0.6,
        pin: true,
        anticipatePin: 1
      }
    });

    cards.forEach(function (card, i) {
      var dir = i % 2 === 0 ? -1 : 1;
      tl.to(card, {
        x: function () { return dir * window.innerWidth * 0.75; },
        z: 600,
        rotation: dir * 28,
        rotateY: dir * 45,
        opacity: 0,
        duration: 1,
        ease: 'power2.in'
      }, i * step);
    });

    tl.to(volumen, {
      v: 0,
      duration: flyTime,
      ease: 'none',
      onUpdate: function () { counterEl.textContent = format(volumen.v); }
    }, 0);

    tl.to([title, stage.querySelector('.eyebrow')], { opacity: 0, y: -40, duration: 1.2, ease: 'power2.inOut' }, flyTime * 0.55);
    tl.to(result, { opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out' }, flyTime - 0.4);
    tl.to({}, { duration: 0.8 });
  })();

  /* Nur Desktop: horizontale Ablauf-Sequenz */
  var mm = gsap.matchMedia();
  mm.add('(min-width: 861px)', function () {

    var track = document.querySelector('.ablauf-track');
    var pinEl = document.querySelector('.ablauf-pin');
    var distance = function () {
      var pad = parseFloat(window.getComputedStyle(pinEl).paddingLeft) * 2;
      return Math.max(0, track.scrollWidth - window.innerWidth + pad);
    };
    gsap.to(track, {
      x: function () { return -distance(); },
      ease: 'none',
      scrollTrigger: {
        trigger: '.ablauf',
        start: 'top top',
        end: function () { return '+=' + Math.max(distance(), 400); },
        scrub: 0.6,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true
      }
    });

  });

  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
