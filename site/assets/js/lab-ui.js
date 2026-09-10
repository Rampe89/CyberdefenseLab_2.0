(function () {
  'use strict';
  const cookieValue = atob('e0NPT0tJRVNfUkVWRUFMX1NFQ1JFVFN9');
  function cookieStatus(text) {
    document.querySelectorAll('.cookie-status').forEach(el => { el.textContent = text; });
  }
  window.createExerciseCookie = function () {
    try {
      document.cookie = 'cyberFlag=' + cookieValue + '; Path=/; Max-Age=3600; SameSite=Lax' + (location.protocol === 'https:' ? '; Secure' : '');
      const exists = document.cookie.split(';').some(c => c.trim().startsWith('cyberFlag='));
      cookieStatus(exists ? 'Übungscookie angelegt. Suche cyberFlag in den Entwicklertools.' : 'Dein Browser blockiert das Cookie. Öffne das Lab über einen lokalen Webserver oder die Website und erlaube Website-Cookies für diese Übung.');
    } catch (_) { cookieStatus('Das Übungscookie konnte in diesem Browser nicht angelegt werden.'); }
  };
  window.deleteExerciseCookie = function () {
    try { document.cookie = 'cyberFlag=; Path=/; Max-Age=0; SameSite=Lax'; } catch (_) {}
    cookieStatus('Übungscookie entfernt. Du kannst es jederzeit neu anlegen.');
  };
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('input[placeholder], textarea[placeholder]').forEach(el => {
      if (!el.getAttribute('aria-label') && (!el.id || !document.querySelector('label[for="' + el.id + '"]'))) {
        const task = el.closest('.task');
        const heading = task && task.querySelector('h3');
        el.setAttribute('aria-label', (heading ? heading.textContent + ': ' : '') + el.getAttribute('placeholder'));
      }
    });
    if (window.CDLabState) {
      CDLabState.syncExpertVisibility();
      // Probe once so an unavailable store is explained before leaving the page.
      CDLabState.get('collectedFlags');
      if (CDLabState.storageUnavailable()) {
        const note = document.createElement('p');
        note.className = 'storage-notice';
        note.textContent = 'Der Browserspeicher ist nicht verfügbar. Fortschritt bleibt nur auf dieser geöffneten Seite erhalten.';
        document.body.prepend(note);
      }
    }
  });
})();
