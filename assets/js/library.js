/* ============================================================
   Health Library
   Reads assets/data/library.json and renders it in the
   currently selected language. To publish a new article,
   edit that JSON file only — nothing here needs changing.
   ============================================================ */
(function () {
  'use strict';

  var list = document.getElementById('lib-list');
  var chipRow = document.getElementById('lib-chips');
  var search = document.getElementById('lib-search');
  if (!list) return;

  var DATA = null;
  var filter = 'all';
  var query = '';

  function L(obj, key) {
    var lang = (window.siteLang && window.siteLang()) || 'en';
    return obj[key + '_' + lang] || obj[key + '_en'] || '';
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function catLabel(id) {
    var lang = (window.siteLang && window.siteLang()) || 'en';
    var c = DATA.categories.filter(function (x) { return x.id === id; })[0];
    return c ? (c[lang] || c.en) : id;
  }

  function render() {
    if (!DATA) return;
    var lang = (window.siteLang && window.siteLang()) || 'en';
    var q = query.trim().toLowerCase();

    var items = DATA.articles.filter(function (a) {
      if (filter !== 'all' && a.category !== filter) return false;
      if (!q) return true;
      var hay = (L(a, 'title') + ' ' + L(a, 'summary') + ' ' + (a['body_' + lang] || a.body_en || []).join(' ')).toLowerCase();
      return hay.indexOf(q) !== -1;
    });

    if (!items.length) {
      list.innerHTML = '<div class="lib-empty">' +
        (lang === 'gu'
          ? 'આ વિષય પર હજી કોઈ લેખ નથી. બીજો વિષય પસંદ કરો અથવા શોધ બદલો.'
          : 'No articles here yet. Try another topic or clear the search.') +
        '</div>';
      return;
    }

    list.innerHTML = '<div class="lib-grid">' + items.map(function (a) {
      var paras = (a['body_' + lang] || a.body_en || [])
        .map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('');
      return '<details class="lib-card" id="' + esc(a.id) + '">' +
        '<summary>' +
          '<span class="lib-cat">' + esc(catLabel(a.category)) + '</span>' +
          '<span class="lib-title">' + esc(L(a, 'title')) + '</span>' +
          '<span class="lib-sum">' + esc(L(a, 'summary')) + '</span>' +
          '<span class="lib-more">' + (lang === 'gu' ? 'વાંચો' : 'Read') + '</span>' +
        '</summary>' +
        '<div class="lib-body">' + paras + '</div></details>';
    }).join('') + '</div>';
  }

  function renderChips() {
    var lang = (window.siteLang && window.siteLang()) || 'en';
    chipRow.innerHTML = DATA.categories.map(function (c) {
      return '<button type="button" class="chip" data-cat="' + c.id + '" aria-pressed="' +
        (c.id === filter) + '">' + esc(c[lang] || c.en) + '</button>';
    }).join('');
  }

  function bindChips() {
    chipRow.addEventListener('click', function (e) {
      var btn = e.target.closest('.chip');
      if (!btn) return;
      filter = btn.dataset.cat;
      renderChips();
      render();
    });
  }

  function init() {
    if (!window.LIBRARY) {
      list.innerHTML = '<div class="lib-empty">Could not load the health library. Check that assets/data/library.js is present and valid.</div>';
      return;
    }
    DATA = window.LIBRARY;
    renderChips();
    bindChips();
    render();
  }
  init();

  if (search) {
    search.addEventListener('input', function () { query = this.value; render(); });
  }

  document.addEventListener('langchange', function () {
    if (!DATA) return;
    renderChips();
    render();
  });
})();
