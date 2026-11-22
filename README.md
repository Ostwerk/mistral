# Mistral Chat

Minimale Web-App mit Chat-Oberfläche, die die Mistral-API über das offizielle TypeScript-SDK ([`@mistralai/mistralai`](https://github.com/mistralai/client-js)) aufruft. Das Modell ist `mistral-small-latest`.

- **Frontend:** statisches HTML/CSS/JS (`public/`) mit einfacher Chat-Schnittstelle
- **Backend:** Express-Server (`server.mjs`) mit dem Endpunkt `POST /api/chat`
- **API-Key:** bleibt ausschließlich auf dem Server (`MISTRAL_API_KEY`) und wird nie an den Browser übertragen

## Voraussetzungen

- Node.js ≥ 20
- Ein Mistral-API-Key ([hier](https://console.mistral.ai/) erstellen)

## Setup & Start

```bash
npm install

# API-Key als Umgebungsvariable setzen (nie in den Code oder Commit schreiben)
export MISTRAL_API_KEY="dein-api-key"

npm start
```

Danach im Browser öffnen: <http://localhost:3000>

Alternativ eine `.env`-Datei nach dem Vorbild von `.env.example` anlegen und z. B. mit `node --env-file=.env server.mjs` starten.

## Projektstruktur

```
├── public/
│   ├── index.html   # Chat-Oberfläche
│   ├── app.js       # Frontend-Logik (Fetch auf /api/chat)
│   └── style.css
├── server.mjs       # Express-Server + Mistral-API-Aufruf
└── package.json
```

## API-Endpunkt

`POST /api/chat` mit JSON-Body:

```json
{ "messages": [{ "role": "user", "content": "Hallo!" }] }
```

Antwort:

```json
{ "reply": "Hallo! Wie kann ich helfen?" }
```
