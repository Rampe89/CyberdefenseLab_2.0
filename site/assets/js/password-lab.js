'use strict';
let masterPassword = '';
function randomIndex(max) {
  const buffer = new Uint32Array(1);
  const limit = 0x100000000 - (0x100000000 % max);
  do { crypto.getRandomValues(buffer); } while (buffer[0] >= limit);
  return buffer[0] % max;
}
function generateSecurePassword() {
  const groups = ['ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz', '0123456789', '!@#$%^&*()'];
  const all = groups.join('');
  const chars = groups.map(group => group[randomIndex(group.length)]);
  while (chars.length < 20) chars.push(all[randomIndex(all.length)]);
  for (let i = chars.length - 1; i > 0; i--) {
    const j = randomIndex(i + 1); [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join('');
}
function generateMasterPassword() {
  document.getElementById('stored-passwords').classList.add('hidden');
  document.getElementById('master-password-input').value = '';
  masterPassword = generateSecurePassword();
  const display = document.getElementById('generated-master-password');
  display.textContent = 'Dein Demo-Master-Passwort: ' + masterPassword;
  display.classList.remove('hidden');
  ['email', 'bank', 'social', 'stream'].forEach(name => {
    document.getElementById(name + '-password').textContent = generateSecurePassword();
  });
}
function showStoredPasswords() {
  const input = document.getElementById('master-password-input').value;
  const valid = masterPassword.length > 0 && input === masterPassword;
  document.getElementById('stored-passwords').classList.toggle('hidden', !valid);
  document.getElementById('master-feedback').textContent = valid ? 'Demo-Tresor geöffnet.' : masterPassword ? 'Das Master-Passwort stimmt noch nicht.' : 'Generiere zuerst ein Demo-Master-Passwort.';
}
function assessPassword(password) {
  const chars = [...password];
  if (!chars.length) return { eligible: false, message: 'Bitte ein erfundenes Testpasswort eingeben.' };
  if (chars.length > 256) return { eligible: false, message: 'Bitte höchstens 256 Zeichen für diese Demo verwenden.' };
  const simplified = password.toLowerCase().replace(/[@4]/g, 'a').replace(/[0]/g, 'o').replace(/[1!]/g, 'i').replace(/[3]/g, 'e').replace(/[5$]/g, 's');
  const common = /password|passwort|qwert[yz]|123456|abcdef|letmein|iloveyou|admin|welcome/;
  const repetitions = /^(.{1,12})\1+$/u.test(password);
  const counts = new Map(); chars.forEach(c => counts.set(c, (counts.get(c) || 0) + 1));
  const dominant = Math.max(...counts.values()) / chars.length > .6;
  if (common.test(simplified) || common.test(password.toLowerCase()) || repetitions || dominant) {
    return { eligible: false, message: 'Leicht vorhersehbares Muster erkannt. Mehr Länge allein hilft hier nicht: Vermeide Wiederholungen, Tastaturfolgen und verbreitete Passwörter.' };
  }
  if (chars.length < 16) return { eligible: false, message: 'Für diese Übung: Verwende mindestens 16 Zeichen. Probiere eine längere, zufällig erzeugte Zeichenfolge oder mehrere unabhängig gewählte Wörter.' };
  const categories = [/[A-ZÄÖÜ]/, /[a-zäöüß]/, /\d/, /[^\p{L}\p{N}\s]/u].filter(re => re.test(password)).length;
  const words = password.trim().split(/\s+/);
  const passphrase = words.length >= 4 && new Set(words.map(w => w.toLowerCase())).size === words.length && chars.length >= 20;
  const eligible = categories >= 3 || passphrase || chars.length >= 25;
  return { eligible, message: eligible ? 'Übungsziel erreicht: ausreichend lang und keines der einfachen Muster erkannt. Das ist keine Sicherheitsgarantie – bekannte Sätze, Namen und wiederverwendete Passwörter können trotzdem erraten werden.' : 'Wähle mehr unabhängig zufällige Zeichen oder eine längere Passphrase. Eine Zeichenarten-Regel allein beweist keine Sicherheit.' };
}
function checkPassword() {
  const password = document.getElementById('password-test').value;
  const result = assessPassword(password);
  document.getElementById('password-feedback').textContent = result.message;
  document.getElementById('flag-container').classList.toggle('hidden', !result.eligible);
  const model = document.getElementById('time-to-crack');
  model.classList.toggle('hidden', !password);
  model.textContent = 'Eine verlässliche Knackdauer lässt sich aus Länge und Zeichenarten nicht bestimmen. Sie hängt unter anderem vom Erzeugungsverfahren, bekannten Mustern, dem Passwort-Hashverfahren und einer Begrenzung der Anmeldeversuche ab.';
}
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('master-password-input').addEventListener('keydown', e => { if (e.key === 'Enter') showStoredPasswords(); });
  document.getElementById('password-test').addEventListener('keydown', e => { if (e.key === 'Enter') checkPassword(); });
});
