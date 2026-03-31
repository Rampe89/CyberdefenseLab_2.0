# CyberDefense Lab 2.0 

Diese Version wurde als statische Netlify-Variante aufgeräumt.

## Was geändert wurde

- Node-/Render-Setup entfernt
- Inhalte in den Ordner `site/` verschoben
- Bilddateien in `site/assets/images/` gebündelt
- alte Render-Links auf relative Links umgestellt
- fehlende Zielseiten als Platzhalter ergänzt (`unterrichtsbeispiele.html`, `lehrplan.html`, `lernbuddy.html`, `new.html`)
- fehlende Asset-Datei `hackerman.jpg` als Platzhalter ergänzt
- `netlify.toml` für direktes Deployment hinzugefügt

## Deployment mit Netlify

1. Repository zu GitHub pushen
2. In Netlify **New site from Git** wählen
3. Repository verbinden
4. Netlify erkennt `netlify.toml` automatisch
5. Deploy starten

Netlify veröffentlicht den Inhalt aus dem Ordner `site/`.

## Lokale Vorschau

Du kannst den Inhalt aus `site/` auch direkt mit einem einfachen Static Server testen, z. B. mit VS Code Live Server.
