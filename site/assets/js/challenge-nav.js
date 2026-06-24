(function () {
  const CHALLENGES = [
    { href: 'bruteforce.html', label: 'Brute-Force-Simulator' },
    { href: 'social-engineering.html', label: 'Social Engineering Lab' },
    { href: 'password-simulator.html', label: 'Passwortmanager-Lab' },
    { href: 'comments-lab.html', label: 'Quelltext & Kommentare' },
    { href: 'parameter-lab.html', label: 'URL-Parameter' },
    { href: 'robots-lab.html', label: 'robots.txt Recon' },
    { href: 'phishingquiz.html', label: 'Phishing-Quiz' },
    { href: 'updates.html', label: 'Updates und Patches' },
    { href: 'dirbuster.html', label: 'Gobuster-Simulation' },
    { href: 'hash.html', label: 'Hashing Lab' },
    { href: 'cookies.html', label: 'Cookies' },
    { href: 'sql-lab.html', label: 'SQL Injection' },
    { href: 'linux-lab.html', label: 'Linux Basics Lab' },
    { href: 'expert-mode.html', label: 'Expert Mode' },
    { href: 'hidden-button.html', label: 'Versteckte Elemente' }
  ];

  function currentFileName() {
    const file = window.location.pathname.split('/').pop();
    return file || 'index.html';
  }

  function removeOldStartButtons() {
    const selectors = [
      '.cdl-back-home',
      '.back-button',
      'a.btn',
      'a.btn-primary',
      'button.btn',
      'button'
    ];

    document.querySelectorAll(selectors.join(',')).forEach((el) => {
      if (el.closest('.cdl-challenge-nav')) return;
      const text = (el.textContent || '').replace(/\s+/g, ' ').trim().toLowerCase();
      const href = (el.getAttribute && (el.getAttribute('href') || '')).toLowerCase();
      const onclick = (el.getAttribute && (el.getAttribute('onclick') || '')).toLowerCase();
      const isStartBack =
        text.includes('zurück zur startseite') ||
        text.includes('zurück zum hauptmenü') ||
        (text === 'startseite' && href.includes('index.html')) ||
        (text.includes('startseite') && (href.includes('index.html') || onclick.includes('index.html')));

      if (!isStartBack && !el.classList.contains('cdl-back-home')) return;

      const parent = el.parentElement;
      if (parent && parent.classList && parent.classList.contains('cdl-back-home')) {
        parent.remove();
      } else if (parent && parent.children.length === 1 && parent.textContent.trim() === el.textContent.trim()) {
        parent.remove();
      } else {
        el.remove();
      }
    });
  }

  function makeButton(item, text, modifier) {
    if (!item) {
      const span = document.createElement('span');
      span.className = 'btn cdl-challenge-nav-disabled ' + (modifier || '');
      span.setAttribute('aria-disabled', 'true');
      span.textContent = text;
      return span;
    }
    const a = document.createElement('a');
    a.className = 'btn ' + (modifier || '');
    a.href = item.href;
    a.textContent = text;
    if (item.label) a.title = item.label;
    return a;
  }

  function insertChallengeNav() {
    const current = currentFileName();
    const index = CHALLENGES.findIndex((item) => item.href === current);
    if (index === -1 || document.querySelector('.cdl-challenge-nav')) return;

    removeOldStartButtons();

    const previous = index > 0 ? CHALLENGES[index - 1] : null;
    const next = index < CHALLENGES.length - 1 ? CHALLENGES[index + 1] : null;

    const nav = document.createElement('nav');
    nav.className = 'cdl-challenge-nav';
    nav.setAttribute('aria-label', 'Challenge-Navigation');

    nav.appendChild(makeButton(previous, '← Vorherige Challenge', 'cdl-challenge-nav-prev'));
    nav.appendChild(makeButton({ href: 'index.html', label: 'Übersicht' }, 'Übersicht', 'cdl-challenge-nav-home'));
    nav.appendChild(makeButton(next, 'Nächste Challenge →', 'cdl-challenge-nav-next'));

    const preferredTarget = document.querySelector('main') || document.querySelector('.container') || document.body;
    preferredTarget.appendChild(nav);
  }

  document.addEventListener('DOMContentLoaded', insertChallengeNav);
})();
