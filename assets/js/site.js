/* ============================================================
   Dr. Hiral Halani Sheth — site behaviour
   1. English / Gujarati toggle (persisted)
   2. Mobile navigation
   3. The nerve-conduction trace (drawn, not an image file)
   4. Scroll reveals
   ============================================================ */
(function () {
  'use strict';

  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------
     1. LANGUAGE
     Every translatable node carries data-en and data-gu.
     --------------------------------------------------------- */
  var STORE = 'dhhs-lang';
  var lang = 'en';
  try { lang = localStorage.getItem(STORE) || 'en'; } catch (e) {}

  function applyLang(next) {
    lang = next === 'gu' ? 'gu' : 'en';
    try { localStorage.setItem(STORE, lang); } catch (e) {}

    document.documentElement.lang = lang === 'gu' ? 'gu' : 'en';
    document.body.classList.toggle('lang-gu', lang === 'gu');

    var nodes = document.querySelectorAll('[data-en]');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var val = lang === 'gu' ? (el.getAttribute('data-gu') || el.getAttribute('data-en'))
                              : el.getAttribute('data-en');
      if (val !== null) el.textContent = val;
    }

    // attributes: placeholder / aria-label / alt
    var attrNodes = document.querySelectorAll('[data-en-attr]');
    for (var j = 0; j < attrNodes.length; j++) {
      var n = attrNodes[j];
      var attr = n.getAttribute('data-en-attr');
      var v = lang === 'gu' ? (n.getAttribute('data-gu-val') || n.getAttribute('data-en-val'))
                            : n.getAttribute('data-en-val');
      if (v) n.setAttribute(attr, v);
    }

    var btns = document.querySelectorAll('.lang-switch button');
    for (var k = 0; k < btns.length; k++) {
      btns[k].setAttribute('aria-pressed', btns[k].dataset.lang === lang ? 'true' : 'false');
    }

    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang: lang } }));
  }

  window.siteLang = function () { return lang; };

  /* ---------------------------------------------------------
     2. THE TRACE
     A nerve-conduction study is the most characteristic
     artifact of this practice, so the site draws a real one
     rather than borrowing a decorative squiggle.
     Each burst is a biphasic compound muscle action potential
     sitting on a slightly noisy baseline.
     --------------------------------------------------------- */
  function cmap(x0, amp, w, base) {
    var pts = [], n = 44, i, t, y;
    for (i = 0; i <= n; i++) {
      t = i / n;
      y = base
        - amp * Math.exp(-Math.pow(t - 0.30, 2) / 0.006)
        + amp * 0.34 * Math.exp(-Math.pow(t - 0.56, 2) / 0.02)
        + amp * 0.06 * Math.exp(-Math.pow(t - 0.80, 2) / 0.05);
      pts.push([x0 + t * w, y]);
    }
    return pts;
  }

  function buildTrace(width, base, amps, noise) {
    var pts = [[0, base]], step = width / amps.length, i, k, xx;
    for (i = 0; i < amps.length; i++) {
      var x0 = i * step;
      for (k = 0; k < 8; k++) {
        xx = x0 + k * (step * 0.30) / 8;
        pts.push([xx, base + (Math.sin(xx * 0.7 + i) * noise)]);
      }
      pts = pts.concat(cmap(x0 + step * 0.30, amps[i], step * 0.52, base));
      for (k = 0; k < 5; k++) {
        xx = x0 + step * 0.82 + k * (step * 0.18) / 5;
        pts.push([xx, base + (Math.cos(xx * 0.9 + i) * noise)]);
      }
    }
    pts.push([width, base]);
    return 'M' + pts.map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' L');
  }

  var TRACES = {
    hero: { w: 1200, base: 130, amps: [46, 62, 38, 70, 52, 44, 66, 40], noise: 0.9 },
    rule: { w: 1200, base: 17,  amps: [7, 10, 6, 11, 8, 7, 10, 6, 9, 7, 11, 6], noise: 0.3 }
  };

  function paintTraces() {
    var svgs = document.querySelectorAll('[data-trace]');
    for (var i = 0; i < svgs.length; i++) {
      var svg = svgs[i];
      var cfg = TRACES[svg.getAttribute('data-trace')];
      if (!cfg) continue;
      var path = svg.querySelector('path');
      if (!path) continue;
      path.setAttribute('d', buildTrace(cfg.w, cfg.base, cfg.amps, cfg.noise));

      if (!REDUCED && svg.getAttribute('data-trace') === 'hero') {
        var len = path.getTotalLength();
        path.style.strokeDasharray = len;
        path.style.strokeDashoffset = len;
        path.style.transition = 'stroke-dashoffset 2.6s cubic-bezier(.4,0,.2,1)';
        requestAnimationFrame(function () {
          requestAnimationFrame(function () { path.style.strokeDashoffset = 0; });
        });
      }
    }
  }

  /* ---------------------------------------------------------
     3. NAV + REVEALS
     --------------------------------------------------------- */
  function initNav() {
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.querySelector('.nav');
    if (!toggle || !nav) return;
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') nav.classList.remove('open');
    });
  }

  function initReveal() {
    var els = document.querySelectorAll('.reveal');
    if (REDUCED || !('IntersectionObserver' in window)) {
      for (var i = 0; i < els.length; i++) els[i].classList.add('in');
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    for (var j = 0; j < els.length; j++) io.observe(els[j]);
  }

  function initAnimPause() {
    var btn = document.getElementById('anim-pause');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var paused = document.body.classList.toggle('anims-paused');
      btn.setAttribute('aria-pressed', paused ? 'true' : 'false');
      btn.setAttribute('data-en', paused ? 'Play animations' : 'Pause animations');
      btn.setAttribute('data-gu', paused ? 'એનિમેશન ચલાવો' : 'એનિમેશન થોભાવો');
      applyLang(lang);
    });
  }

  function boot() {
    var switches = document.querySelectorAll('.lang-switch button');
    for (var i = 0; i < switches.length; i++) {
      switches[i].addEventListener('click', function () { applyLang(this.dataset.lang); });
    }
    applyLang(lang);
    paintTraces();
    initNav();
    initReveal();
    initAnimPause();
    document.documentElement.classList.add('js-ready');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else { boot(); }
})();
