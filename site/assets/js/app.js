
(function{
  const path = window.location.pathname.split('/').pop | 'index.html';
  const navItems = [
    ['index.html', 'Start'],
    ['about.html', 'Über'],
    ['geheim.html', 'Flags'],
    ['unterrichtsbeispiele.html', 'Unterricht'],
    ['contact.html', 'Kontakt']
  ];
  document.addEventListener('DOMContentLoaded',  => {
    document.body.classList.add('has-global-topbar');
    if (!document.querySelector('.cdl-topbar')) {
      const topbar = document.createElement('div');
      topbar.className = 'cdl-topbar';
      topbar.innerHTML = `
        <div class="cdl-topbar-inner">
          <a class="cdl-brand" href="index.html" aria-label="Zur Startseite">
            <span class="cdl-brand-badge">🧪</span>
            <span>CyberDefense Lab</span>
          </a>
          <nav class="cdl-nav" aria-label="Globale Navigation">
            ${navItems.map(([href,label]) => `<a href="${href}" class="${path===href ? 'is-active' : ''}">${label}</a>`).join('')}
          </nav>
        </div>
      `;
      document.body.prepend(topbar);
    }
    if (!document.querySelector('footer')) {
      const footer = document.createElement('div');
      footer.className = 'cdl-shared-footer';
      footer.innerHTML = `
        <div class="cdl-shared-footer-card">
          <div><strong>CyberDefense Lab</strong><br><small>Interaktive Lernumgebung für Unterricht, Übung und Reflexion.</small></div>
          <div class="cdl-footer-links">
            <a href="impressum.html">Impressum</a>
            <a href="datenschutz.html">Datenschutz</a>
            <a href="sources.html">Quellen</a>
          </div>
        </div>
      `;
      document.body.appendChild(footer);
    }
  });
});
