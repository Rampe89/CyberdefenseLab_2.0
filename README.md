# CyberDefense Lab 2.0 – Reparaturstand September 2026

Alle 31 vorhandenen HTML-Seiten, Labs, Bilder, PDFs und Easter Eggs sind enthalten.
Der veröffentlichte Inhalt liegt unverändert unter `site/`.

## Starten und veröffentlichen

- Lokal: `python -m http.server 8000 --directory site`, dann `http://localhost:8000` öffnen.
- Netlify über Git: den Projektinhalt einschließlich `netlify.toml` übernehmen. Publish-Verzeichnis: `site`.
- Für einen manuellen Upload den Inhalt von `site/` als Website verwenden.
- Das Cookie-Lab braucht einen Webserver. Das direkte Öffnen mit `file://` ist dafür ungeeignet.

## Reparaturen

- Eine gemeinsame Fortschrittslogik für alle 18 Flag-Aufgaben. Bestehende gespeicherte Flags bleiben lesbar.
- Linux-Flag schaltet den Expert Mode sowohl im Linux-Lab als auch auf der Übersicht frei.
- Analyse und erweiterte Labs bleiben lokal freigeschaltet; Lehrkräfte-Freischaltung bleibt im Tab erhalten.
- Fortschritt toleriert defekte oder blockierte Browserspeicher. Bei blockiertem Speicher funktioniert die Seite mit vorübergehendem Zustand; nach Seitenwechsel kann dieser nicht erhalten bleiben.
- Abschlussflag erscheint dauerhaft auf der Übersicht, unabhängig von der lokalen optionalen Animation.
- Eingabe per Enter und zugänglicher Geheim-Bereich; ursprüngliche Darstellung der Karten und geöffneten Kategorien wiederhergestellt.
- SQL-Flag nach drei Vergleichsschritten; Maskierung der Demo-Daten und Lehrkräfte-Steuerung berichtigt.
- Hash-Lab akzeptiert beide laut Aufgabe gültigen Passwörter; Salt-Prüfsumme unabhängig nachgerechnet.
- Passwort-Lab: Erkennung einfacher Muster, keine pauschale Sicherheitsgarantie oder scheinpräzise Knackdauer; Zufallsgenerator verwendet Web Crypto. Leerer Demo-Tresor bleibt geschlossen.
- Phishing: kein Zeitdruck, kein Überspringen, gezielte Wiederholung; Beispiel-Linkziele sind Text und lösen keine Navigation aus.
- Social Engineering: selbst gesteuertes Tempo, Auswertung und Wiederholung unsicherer Entscheidungen.
- Brute-Force, Gobuster und Updates gegen überlappende Starts abgesichert; Scanbeispiele und Zielpfade vereinheitlicht.
- URL-Rolle wird als Text ausgegeben statt als HTML interpretiert.
- Cookie-Übung unabhängig von einem Einwilligungsbanner startbar und beendbar.
- Echte 404-Seite, korrigierte Verlinkungen, Systemschriften, lokale Skripte und Animation; keine automatisch eingebundenen externen Ressourcen.
- Mobile Tabellen behalten ihre Überschriften; Quiz-Fortschrittsbalken ist separat; Mobil-/Desktop-Pills vollständig entfernt; Tastaturfokus und reduzierte Bewegung berücksichtigt.
- Datenschutzhinweise beschreiben Cookies, localStorage, sessionStorage und Hosting getrennt. Hostingkonfiguration, Aufbewahrung und Betreiberangaben sind anhand des ZIP nicht verifizierbar und müssen zum tatsächlich eingesetzten Betrieb passen.

## Prüfung

`node tests/regression.cjs`

Isolierte Regressionstests mit simuliertem DOM prüfen die Geschäftslogik: Fortschritt/Migration, Freischaltungen, Abschluss, Passwortprüfung, Hashes, SQL-Mission, Quizwiederholung, Social Engineering und Mehrfachstarts. Zusätzlich wurden JavaScript-Syntax, lokale Dateiziele, eindeutige HTML-IDs und externe Ressourcen geprüft. Bilder und PDFs bleiben bytegleich.

Eine visuelle Prüfung in einem echten Browser war in der Bearbeitungsumgebung blockiert. Die Tests ersetzen keine Prüfung des gerenderten Layouts auf Desktop, Tablet und Smartphone.

## Technische Quellen der Korrekturen

- https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
- https://nmap.org/nsedoc/scripts/smb-vuln-ms17-010.html
- https://www.netlify.com/privacy/
- https://www.gesetze-im-internet.de/ddg/__5.html
- https://eur-lex.europa.eu/legal-content/DE/ALL/?uri=celex%3A32016R0679

## Gestaltungskorrektur

Nicht abgesprochene visuelle Ergänzungen wurden entfernt: Mobil-/Desktop-Pills, zusätzliche Abschluss-Badges und Kartenränder, Nächster-Schritt-Leiste mit Reset-Button sowie automatisch ergänzte Fußzeilen. Kategorien starten wieder wie im Original aufgeklappt. Funktionale Rückmeldungen und Fehlerkorrekturen bleiben enthalten.
