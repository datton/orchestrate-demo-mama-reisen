/* Packliste und Kaufen-Button (senior7). Häkchen bleiben in diesem Browser (Shop key 'packliste'). */
(function () {
  'use strict';
  var GROUPS = [
    ['Dokumente und Gesundheit', [
      'Reisepass (kein Personalausweis), ab Einreise mindestens sechs Monate gültig',
      'Visum über das offizielle Portal oder die Botschaft von Ghana in Berlin beantragt',
      'Gelbfieber-Impfnachweis (Pflicht, Impfung mindestens 10 Tage vor der Reise)',
      'Gesundheitserklärung online ausgefüllt, QR-Code gespeichert',
      'Kopie des Reisepasses, getrennt vom Original aufbewahrt',
      'Auslandskranken- und Rücktransportversicherung',
      'Malariavorsorge mit Reise- oder Tropenmedizin besprochen',
      'Eigene Medikamente: rechtlichen Status in Ghana vorher geprüft']],
    ['Technik und Strom', [
      'Adapter für Steckdosentyp G und D (der deutsche Stecker passt nicht)',
      'Powerbank für mögliche Stromausfälle',
      'Ladekabel und offline gespeicherte Karten']],
    ['Geld', [
      'Etwas Bargeld dabei',
      'Visa-Karte (verbreiteter als Mastercard)',
      'Bargeld über 10.000 US-Dollar nur mit Formular FX-5']],
    ['Kleidung', [
      'Leichte Kleidung für das feuchte Küstenklima',
      'Etwas Zurückhaltendes für Stadt und Dorf',
      'Badesachen und ein Tuch für den Strand',
      'Regenjacke, falls du in einer Regenzeit reist',
      'Für Dezember bis Februar etwas gegen den staubigen Wind, zum Beispiel ein Tuch']]
  ];
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function load() { try { return window.Shop ? Shop.get('packliste', []) : JSON.parse(localStorage.getItem('shop:mama-reisen:packliste') || '[]'); } catch (e) { return []; } }
  function save(v) { try { if (window.Shop) Shop.set('packliste', v); else localStorage.setItem('shop:mama-reisen:packliste', JSON.stringify(v)); } catch (e) {} }

  var host = document.getElementById('pk-list');
  if (host) {
    var i = 0, html = '';
    GROUPS.forEach(function (g) {
      html += '<fieldset class="pk-group"><legend>' + esc(g[0]) + '</legend><ul>';
      g[1].forEach(function (t) { html += '<li><label><input type="checkbox" data-i="' + (i++) + '"> <span>' + esc(t) + '</span></label></li>'; });
      html += '</ul></fieldset>';
    });
    host.innerHTML = html;
    var boxes = host.querySelectorAll('input'), out = document.getElementById('pk-progress'), fill = document.getElementById('pk-fill');
    var state = load();
    var show = function () {
      var n = 0; boxes.forEach(function (b) { if (b.checked) n++; });
      out.textContent = n + ' von ' + boxes.length + ' eingepackt';
      fill.style.width = Math.round(100 * n / boxes.length) + '%';
    };
    var write = function () { save([].map.call(boxes, function (b) { return b.checked; })); show(); };
    boxes.forEach(function (b, k) { b.checked = !!state[k]; b.addEventListener('change', write); });
    document.getElementById('pk-reset').addEventListener('click', function () { boxes.forEach(function (b) { b.checked = false; }); write(); });
    show();
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-buy]'); if (!b || !window.Shop) return;
    Shop.addToCart({ item: b.getAttribute('data-buy'), qty: 1, options: {} });
    Shop.toast('Der Ratgeber liegt im Warenkorb.');
  });
})();
