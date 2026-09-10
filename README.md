# CyberDefense Lab 🧪

Das **CyberDefense Lab** ist eine interaktive Lernumgebung für IT-Sicherheit. In browserbasierten Simulationen untersuchen Lernende typische Angriffsmethoden, entdecken Schwachstellen und lernen passende Schutzmaßnahmen kennen.

Im Mittelpunkt steht das eigene Ausprobieren: Passwörter untersuchen, verdächtige Nachrichten erkennen, Quelltext analysieren und mit einem simulierten Terminal arbeiten. Erfolgreich bearbeitete Aufgaben liefern **Flags**, die auf der Startseite gesammelt werden und den Lernfortschritt sichtbar machen.

## Für wen ist das Lab gedacht?

Das CyberDefense Lab richtet sich insbesondere an Schülerinnen und Schüler der Sekundarstufe I sowie an Lehrkräfte und interessierte Einsteigerinnen und Einsteiger.

Die Module eignen sich für den Informatikunterricht, Projekttage, Workshops und selbstständige Lernphasen. Sie lassen sich einzeln einsetzen oder zu einer größeren Unterrichtseinheit verbinden.

## Themen und Module

### Passwörter und Authentifizierung

- **Brute-Force-Simulation:** Beobachten, wie ein automatisierter Wörterbuchangriff schwache Passwörter findet.
- **Passwortmanager-Lab:** Einen simulierten Passworttresor öffnen, Demo-Passwörter erzeugen und einfache Passwortschwächen untersuchen.
- **Hashing und Salt:** Passwörter zu vorgegebenen Hashwerten finden und die Wirkung eines Salts nachvollziehen.

### Täuschung und Manipulation

- **Phishing-Quiz:** Beispielnachrichten anhand von Absendern, Linkzielen und Inhalt beurteilen.
- **Social Engineering:** In simulierten Chats auf manipulative Anfragen reagieren und die eigenen Entscheidungen auswerten.
- **Verdächtige Dateien:** Dateinamen und Endungen aufmerksam prüfen.

### Web-Sicherheit

- **Quelltext und Kommentare:** Informationen entdecken, die im Browser zunächst unsichtbar bleiben.
- **URL-Parameter:** Untersuchen, wie Eingaben in der Adresszeile die Darstellung einer Seite beeinflussen.
- **robots.txt:** Verstehen, warum Hinweise für Suchmaschinen keinen Zugriffsschutz ersetzen.
- **Gobuster-Simulation:** Versteckte Seiten und Dateipfade aufspüren.
- **Cookies:** Einen Übungswert im Cookiespeicher des Browsers finden.
- **SQL Injection:** Normale, manipulierte und parametergebundene Datenbankabfragen miteinander vergleichen.
- **Versteckte Elemente:** Erkennen, dass per CSS ausgeblendete Inhalte weiterhin vorhanden sind.

### Systeme und Werkzeuge

- **Updates und Patches:** An einer simulierten EternalBlue-Schwachstelle die Bedeutung von Sicherheitsupdates nachvollziehen.
- **Linux-Grundkurs:** Mit grundlegenden Terminalbefehlen durch ein simuliertes Dateisystem navigieren.
- **Expert Mode:** Nach Abschluss des Linux-Grundkurses eine erweiterte Terminalumgebung erkunden.
- **Zusatzaufgaben und Easter Eggs:** Weitere Spuren in Metadaten, Dateien und der Browserkonsole entdecken.

## Lernen mit Flags

Die Übersicht umfasst **18 Flag-Aufgaben**. Gefundene Flags werden auf der Startseite eingetragen und geprüft. Der Fortschrittsbalken und freigeschaltete Titel zeigen den bisherigen Lernstand.

Einige Bereiche werden durch Hinweise und Passwörter aus anderen Übungen zugänglich. Dadurch entstehen Verbindungen zwischen den Modulen, die zum systematischen Erkunden anregen.

Der Lernstand wird lokal im verwendeten Browser gespeichert.

## Didaktischer Ansatz

Das Lab verbindet praktische Erkundung mit verständlichen Erklärungen und unmittelbarer Rückmeldung. Fehler werden als Lerngelegenheiten genutzt: Im Phishing-Quiz und in den Social-Engineering-Szenarien können unsichere Entscheidungen gezielt überarbeitet werden.

Dabei stehen drei Fragen im Mittelpunkt:

1. **Was passiert hier?**
2. **Warum funktioniert der Angriff oder die Manipulation?**
3. **Wie lässt sich die Schwachstelle vermeiden?**

Ein eigener Bereich für Lehrkräfte ergänzt die Übungen um Lernziele, didaktische Einordnungen und Hinweise zu den Lösungswegen.

## Technische Umsetzung

Das CyberDefense Lab besteht aus **HTML, CSS und JavaScript**. Die Übungen laufen als Simulationen im Browser. Eine Datenbank, Benutzerkonten oder ein Anwendungsserver sind nicht erforderlich.

Die Website verwendet lokale Skripte und vorhandene Systemschriften. Die Übungseingaben werden im Browser verarbeitet.

Für Aufgaben mit Quelltextansicht, Entwicklertools und Terminaleingaben empfiehlt sich ein Computer mit Tastatur.

## Lokal starten

Im Projektverzeichnis einen lokalen Webserver starten:

```bash
python -m http.server 8000 --directory site
```

Anschließend im Browser öffnen:

```text
http://localhost:8000
```

## Veröffentlichung

Die Website-Dateien liegen im Ordner `site/` und können auf einem statischen Webhost veröffentlicht werden.

Für die Veröffentlichung über Netlify ist eine `netlify.toml` enthalten. Das Veröffentlichungsverzeichnis ist `site`.

## Autor und Lizenz

**Ramon Berghorn**

Das CyberDefense Lab steht unter der **MIT-Lizenz** und kann entsprechend den Lizenzbedingungen genutzt, verändert und weitergegeben werden.

