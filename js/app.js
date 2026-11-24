/* Startseite (Full-Stack): Angebote aus shop/catalog.json, Finder. Preise nur aus dem Katalog, nichts wird hier berechnet. */
(function () {
  'use strict';
  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  var COLORS = ['var(--c-a)', 'var(--c-b)', 'var(--c-c)', 'var(--c-d)'];
  var sc = $('service-cards'), gc = $('guide-cards');

  function card(i, n, forGuide) {
    var price = Shop.money(i.price);
    var from = (i.options && i.options.length) || i.perPerson;
    return '<li class="h-card" data-reveal style="--c:' + COLORS[n % COLORS.length] + '">' +
      (i.badge ? '<span class="h-kind">' + esc(i.badge) + '</span>' : '') +
      '<h3>' + esc(i.name) + '</h3><p>' + esc(String(i.desc || '').split('. ').slice(0, 1).join('. ').replace(/\.?$/, '.')) + '</p>' +
      '<div class="h-price">' + (from ? '<small>ab </small>' : '') + esc(price) + (i.perPerson ? ' <small>pro Person</small>' : '') + '</div>' +
      '<a class="more" href="pages/services.html#' + encodeURIComponent(i.id) + '">Details ansehen<span class="visually-hidden">: ' + esc(i.name) + '</span></a></li>';
  }
  function reveal(box) { box.querySelectorAll('[data-reveal]').forEach(function (e) { e.classList.add('is-in'); }); }

  var items = [];
  function load() {
    if (!window.Shop || !Shop.catalog) return;
    Shop.catalog().then(function (c) {
      items = (c.items || []).filter(function (i) { return !i.soldOut || true; });
      var offers = items.filter(function (i) { return i.category !== 'guides'; });
      var guides = items.filter(function (i) { return i.category === 'guides'; });
      fillEst();
      if (sc && offers.length) { sc.innerHTML = offers.map(function (i, n) { return card(i, n); }).join(''); reveal(sc); }
      if (gc && guides.length) { gc.innerHTML = guides.map(function (i, n) { return card(i, n + 1); }).join(''); reveal(gc); }
    }).catch(function () {
      if (sc) sc.innerHTML = '<li class="h-card"><h3>Unsere Angebote</h3><p>Alle Pakete, Services und Ratgeber findest du auf der Angebotsseite.</p><a class="more" href="pages/services.html">Zu den Angeboten</a></li>';
    });
  }

  // Paketvorschlag: Fragen -> Katalog-Paket (Namen und Preise aus dem Katalog)
  function byId(id) { return items.filter(function (i) { return i.id === id; })[0]; }
  var pf = $('pkg');
  if (pf) pf.addEventListener('submit', function (e) {
    e.preventDefault();
    var id = pf.pace.value === 'slow' ? 'entspannt-reisen' : pf.who.value === 'group' ? 'freunde-familie' : 'erste-reise';
    var it = byId(id), o = $('pkg-out');
    if (!it) { o.innerHTML = 'Alle Pakete findest du <a href="pages/services.html#packages">hier</a>.'; return; }
    o.innerHTML = 'Das passt zu dir: <a href="pages/services.html#' + encodeURIComponent(it.id) + '">' + esc(it.name) + '</a>, ' + esc(Shop.money(it.price)) + ' pro Person. ' + esc(String(it.desc).split('. ')[0]) + '.';
  });

  // Richtwert: Summe aus Katalogpreisen (Paket mal Personen plus Services); verbindlich ist der Warenkorb
  var ef = $('est');
  function estimate() {
    if (!ef || !items.length) return;
    var sel = $('est-pkg'), n = Math.floor(+ef.n.value), tot = $('est-total'), ul = $('est-lines');
    if (!(n >= 1) || n > 12) { tot.textContent = '–'; ul.innerHTML = '<li>Bitte 1 bis 12 Personen eingeben.</li>'; return; }
    var p = byId(sel.value), rows = [], sum = 0;
    if (p) { rows.push([p.name + ' (' + n + ' x ' + Shop.money(p.price) + ')', p.price * n]); }
    [].slice.call(ef.querySelectorAll('input[name=x]:checked')).forEach(function (c) { var s = byId(c.value); if (s) rows.push([s.name, s.price]); });
    rows.forEach(function (r) { sum += r[1]; });
    tot.textContent = Shop.money(sum);
    ul.innerHTML = rows.map(function (r) { return '<li><span>' + esc(r[0]) + '</span><span>' + esc(Shop.money(r[1])) + '</span></li>'; }).join('');
  }
  function fillEst() {
    var sel = $('est-pkg'); if (!sel) return;
    sel.innerHTML = items.filter(function (i) { return i.category === 'packages'; }).map(function (i) { return '<option value="' + esc(i.id) + '">' + esc(i.name) + '</option>'; }).join('');
    ef.addEventListener('input', estimate); ef.addEventListener('change', estimate); ef.addEventListener('submit', function (e) { e.preventDefault(); });
    estimate();
  }

  if (window.Shop) load(); else window.addEventListener('load', load);
})();
