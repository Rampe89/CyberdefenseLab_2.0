'use strict';
    const ACHIEVEMENTS = {
  1: '🔓 Passwortknacker',
  2: '🎣 Phishing-Profi',
  3: '🧠 Social-Engineer-Scout',
  4: '🔑 Schlüsselmeister',
  5: '🛡️ Patch-Pilot',
  6: '🔍 Directory Detective',
  7: '🍲 Let Him Cook + Add A Pinch of Salt',
  8: '🍪 Cookie-Jäger',
  9: '👑 SysAdmin',
  10: '🤖 Mr. Robot',
  11: '🐭 Mäusejäger',
  12: '💬 Console Leak',
  13: '💉 SQL Injector',
  14: '🤖 robots.txt Scout',
  15: '📝 Kommentar-Leser',
  16: '🔗 Parameter-Tuner',
  17: '👻 Versteckter Button',
  18: '🐧 Linux-Navigator',
};
const state = window.CDLabState;
let celebrated = false;
function taskFeedback(input, message, ok) {
  const task = input.closest('.task') || input.parentElement;
  let feedback = task.querySelector('.task-feedback');
  if (!feedback) {
    feedback = document.createElement('p');
    feedback.className = 'task-feedback';
    feedback.setAttribute('role', 'status');
    task.appendChild(feedback);
  }
  feedback.textContent = message;
  feedback.classList.toggle('is-error', !ok);
}
function checkFlag(number, encodedFlag) {
  const input = document.getElementById('flag' + number);
  if (!input) return;
  if (input.value.trim() !== atob(encodedFlag).trim()) {
    taskFeedback(input, 'Noch nicht richtig. Prüfe die Flag einschließlich der geschweiften Klammern.', false);
    return;
  }
  state.setFlag(number);
  taskFeedback(input, number === 18 ? 'Richtig! Der Expert Mode ist jetzt freigeschaltet.' : 'Richtig! Deine Flag ist gespeichert.', true);
}
function checkHashFlags() {
  const a = document.getElementById('flag7a'), b = document.getElementById('flag7b');
  const valid = a.value.trim() === '{LET_HIM_COOK}' && b.value.trim() === '{ADD_A_PINCH_OF_SALT}';
  if (valid) state.setFlag(7);
  taskFeedback(a, valid ? 'Richtig! Beide Flags sind gespeichert.' : 'Prüfe beide Flags: die Grundaufgabe und den Salt-Bonus.', valid);
}
function checkCookie() {
  const input = document.getElementById('flag8');
  let cookie;
  try { cookie = document.cookie.split(';').map(c => c.trim()).find(c => c.startsWith('cyberFlag=')); } catch (_) {}
  if (!cookie) {
    taskFeedback(input, 'Lege zuerst das Übungscookie an und suche es in den Entwicklertools.', false);
    return;
  }
  const valid = input.value.trim() === cookie.slice('cyberFlag='.length);
  if (valid) state.setFlag(8);
  taskFeedback(input, valid ? 'Richtig! Die Cookie-Flag ist gespeichert.' : 'Prüfe den Wert des Übungscookies noch einmal.', valid);
}
const gates = {
  analysis: { encoded: 'dXNlcjEyMw==', content: 'analysis-tasks' },
  advanced: { encoded: 'QXJjaGl2ZURlbHRhMjc=', content: 'advanced-tasks' },
  teacher: { encoded: 'VGVhY2hlcnMxeDE=', content: 'teacher-content', session: true }
};
function showGate(name) {
  const gate = gates[name];
  const open = state.get('cdl-unlock-' + name, null, gate.session) === 'true';
  document.getElementById(name + '-password-container').classList.toggle('hidden', open);
  document.getElementById(gate.content).classList.toggle('hidden', !open);
}
function unlock(name) {
  const gate = gates[name];
  const input = document.getElementById(name + '-password');
  const valid = input.value.trim() === atob(gate.encoded);
  document.getElementById(name + '-error-message').classList.toggle('hidden', valid);
  if (!valid) return;
  state.put('cdl-unlock-' + name, 'true', gate.session);
  input.value = '';
  showGate(name);
  renderHome();
}
function unlockAnalysis() { unlock('analysis'); }
function unlockAdvanced() { unlock('advanced'); }
function unlockTeacher() { unlock('teacher'); }
function unlockTasks() { unlockAnalysis(); }
function celebrate() {
  if (celebrated) return;
  celebrated = true;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const container = document.createElement('div');
  container.className = 'local-confetti';
  container.setAttribute('aria-hidden', 'true');
  for (let i = 0; i < 36; i++) {
    const piece = document.createElement('i');
    piece.style.left = (Math.random() * 100) + '%';
    piece.style.backgroundColor = ['#3ba1ff', '#1faa63', '#ffce56'][i % 3];
    piece.style.animationDelay = (Math.random() * .6) + 's';
    container.appendChild(piece);
  }
  document.body.appendChild(container);
  setTimeout(() => container.remove(), 2400);
}
function renderHome() {
  const flags = state.readFlags();
  const count = flags.filter(Boolean).length;
  document.getElementById('progress').textContent = `Fortschritt: ${count}/18 Flag-Aufgaben abgeschlossen`;
  document.getElementById('progress-fill').style.width = (count / 18 * 100) + '%';
  document.getElementById('progress-bar').setAttribute('aria-valuenow', String(count));
  for (let n = 1; n <= 18; n++) {
    const inputs = n === 7 ? [document.getElementById('flag7a'), document.getElementById('flag7b')] : [document.getElementById('flag' + n)];
    inputs.filter(Boolean).forEach(input => {
      input.disabled = flags[n - 1];
      const task = input.closest('.task');
      const check = task.querySelector('button[onclick^="check"]');
      if (check) check.disabled = flags[n - 1];

    });
  }
  const achievements = document.getElementById('achievements');
  achievements.querySelectorAll('.achievement').forEach(el => el.remove());
  achievements.classList.toggle('hidden', count === 0);
  flags.forEach((done, i) => {
    if (!done) return;
    const item = document.createElement('div'); item.className = 'achievement'; item.textContent = ACHIEVEMENTS[i + 1]; achievements.appendChild(item);
  });
  state.syncExpertVisibility();
  Object.keys(gates).forEach(showGate);
  const completion = document.getElementById('completion');
  completion.classList.toggle('hidden', count !== 18);
  if (count === 18) {
    completion.textContent = 'Alle Aufgaben geschafft! Abschlussflag: {Mission_accomplished}';
    // Completion is visible before the optional decoration runs.
    try { celebrate(); } catch (_) {}
  }

}
document.addEventListener('DOMContentLoaded', () => {
  const secretButton = document.getElementById('secret-header');
  secretButton.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); secretButton.click(); } });
  secretButton.addEventListener('click', () => {
    const area = document.getElementById('secret-flags');
    area.hidden = !area.hidden;
    secretButton.setAttribute('aria-expanded', String(!area.hidden));
    document.getElementById('secret-toggle').textContent = area.hidden ? '[+]' : '[-]';
  });
  document.querySelectorAll('.task input[type="text"]').forEach(input => {
    input.addEventListener('keydown', e => {
      if (e.key !== 'Enter') return;
      e.preventDefault();
      const button = input.closest('.task').querySelector('button[onclick^="check"]');
      if (button && !button.disabled) button.click();
    });
  });
  Object.keys(gates).forEach(name => {
    document.getElementById(name + '-password').addEventListener('keydown', e => {
      if (e.key === 'Enter') { e.preventDefault(); unlock(name); }
    });
  });

  renderHome();
});
window.addEventListener('storage', renderHome);
window.addEventListener('pageshow', renderHome);
window.addEventListener('cdl-state-change', renderHome);
