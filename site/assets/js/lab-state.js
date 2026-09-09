(function () {
  'use strict';
  const TOTAL_FLAGS = 18;
  const memory = { local: new Map(), session: new Map() };
  let storageUnavailable = false;
  function get(key, fallback = null, session = false) {
    const cache = memory[session ? 'session' : 'local'];
    if (cache.has(key)) return cache.get(key);
    try { return (session ? window.sessionStorage : window.localStorage).getItem(key) ?? fallback; }
    catch (_) { storageUnavailable = true; return fallback; }
  }
  function put(key, value, session = false) {
    const cache = memory[session ? 'session' : 'local'];
    try {
      (session ? window.sessionStorage : window.localStorage).setItem(key, String(value));
      cache.delete(key);
    } catch (_) { storageUnavailable = true; cache.set(key, String(value)); }
  }
  function normalizeFlags(value) {
    return Array.from({ length: TOTAL_FLAGS }, (_, i) => Array.isArray(value) && value[i] === true);
  }
  function readFlags() {
    let flags;
    try { flags = normalizeFlags(JSON.parse(get('collectedFlags', '[]'))); }
    catch (_) { flags = normalizeFlags([]); }
    // Preserve older Linux completions in either of the two legacy keys.
    flags[17] = flags[17] || get('linuxLabSolved') === 'true';
    return flags;
  }
  function writeFlags(value) {
    const flags = normalizeFlags(value);
    put('collectedFlags', JSON.stringify(flags));
    put('linuxLabSolved', String(flags[17]));
    window.dispatchEvent(new Event('cdl-state-change'));
    return flags;
  }
  function setFlag(task, value = true) {
    const flags = readFlags();
    if (Number.isInteger(task) && task >= 1 && task <= TOTAL_FLAGS) {
      flags[task - 1] = value === true;
      return writeFlags(flags);
    }
    return flags;
  }
  function isLinuxSolved() { return readFlags()[17]; }
  function syncExpertVisibility(root = document) {
    const solved = isLinuxSolved();
    root.querySelectorAll('.hidden-until-linux').forEach(el => {
      el.classList.toggle('is-visible', solved);
      el.setAttribute('aria-hidden', String(!solved));
      if (el.tagName === 'A') el.tabIndex = solved ? 0 : -1;
    });
    const badge = root.querySelector('#expert-badge');
    const note = root.querySelector('#expert-mode-note');
    if (badge) { badge.classList.toggle('locked', !solved); badge.textContent = solved ? '✅ Freigeschaltet' : '🔒 Gesperrt'; }
    if (note) note.textContent = solved ? 'Linux abgeschlossen – der Expert Mode ist freigeschaltet.' : 'Schließe den Linux-Grundkurs ab, um den Expert Mode freizuschalten.';
  }
  window.CDLabState = {
    TOTAL_FLAGS, get, put, readFlags, writeFlags, setFlag,
    hasFlag: n => Boolean(readFlags()[n - 1]), countFlags: () => readFlags().filter(Boolean).length,
    isLinuxSolved, setLinuxSolved: value => setFlag(18, value), syncExpertVisibility,
    storageUnavailable: () => storageUnavailable
  };
})();
