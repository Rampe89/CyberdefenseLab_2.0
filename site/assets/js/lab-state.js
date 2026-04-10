(function () {
  const KEY_FLAGS = 'collectedFlags';
  const KEY_LINUX = 'linuxLabSolved';
  const TOTAL_FLAGS = 18;

  function normalizeFlags(flags) {
    const out = Array.isArray(flags) ? flags.slice(0, TOTAL_FLAGS) : [];
    while (out.length < TOTAL_FLAGS) out.push(false);
    return out.map(Boolean);
  }

  function readFlags() {
    try {
      return normalizeFlags(JSON.parse(localStorage.getItem(KEY_FLAGS) || '[]'));
    } catch (e) {
      return normalizeFlags([]);
    }
  }

  function writeFlags(flags) {
    const normalized = normalizeFlags(flags);
    localStorage.setItem(KEY_FLAGS, JSON.stringify(normalized));
    return normalized;
  }

  function setFlag(taskNumber, value) {
    const flags = readFlags();
    if (taskNumber >= 1 && taskNumber <= TOTAL_FLAGS) {
      flags[taskNumber - 1] = value !== false;
      writeFlags(flags);
    }
    return flags;
  }

  function hasFlag(taskNumber) {
    const flags = readFlags();
    return Boolean(flags[taskNumber - 1]);
  }

  function countFlags() {
    return readFlags().filter(Boolean).length;
  }

  function isLinuxSolved() {
    return localStorage.getItem(KEY_LINUX) === 'true';
  }

  function setLinuxSolved(value) {
    localStorage.setItem(KEY_LINUX, value ? 'true' : 'false');
  }

  function syncExpertVisibility(root) {
    const scope = root || document;
    const solved = isLinuxSolved();
    scope.querySelectorAll('.hidden-until-linux').forEach((el) => {
      el.classList.toggle('is-visible', solved);
      if (el.tagName === 'A') {
        el.setAttribute('aria-hidden', solved ? 'false' : 'true');
        el.tabIndex = solved ? 0 : -1;
      }
    });

    const badge = scope.querySelector('#expert-badge');
    const note = scope.querySelector('#expert-mode-note');
    if (badge) {
      badge.classList.toggle('locked', !solved);
      badge.textContent = solved ? '✅ Freigeschaltet' : '🔒 Gesperrt';
    }
    if (note) {
      note.textContent = solved
        ? 'Status: freigeschaltet. Der Expert Mode kann jetzt geöffnet werden.'
        : 'Status: aktuell noch gesperrt. Abschluss des Linux-Kurses erforderlich.';
    }
  }

  window.CDLabState = {
    TOTAL_FLAGS,
    readFlags,
    writeFlags,
    setFlag,
    hasFlag,
    countFlags,
    isLinuxSolved,
    setLinuxSolved,
    syncExpertVisibility,
  };
})();
