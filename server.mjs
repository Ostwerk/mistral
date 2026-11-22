import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { Mistral } from '@mistralai/mistralai';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const apiKey = process.env.MISTRAL_API_KEY;
if (!apiKey) {
  console.error('Fehlende Umgebungsvariable MISTRAL_API_KEY.');
  process.exit(1);
}

const MODEL = 'mistral-small-latest';
const client = new Mistral({ apiKey });

const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/chat', async (req, res) => {
  const messages = Array.isArray(req.body?.messages) ? req.body.messages : null;
  if (!messages) {
    return res.status(400).json({ error: 'Body muss {"messages": [...]} enthalten.' });
  }

  const allowed = messages.every(
    (m) =>
      m &&
      typeof m.content === 'string' &&
      ['user', 'assistant'].includes(m.role) &&
      m.content.length <= 8000
  );
  if (!allowed || messages.length === 0 || messages.length > 40) {
    return res.status(400).json({ error: 'Ungültige Nachrichtenliste.' });
  }

  try {
    const result = await client.chat.complete({ model: MODEL, messages });
    const reply = result?.choices?.[0]?.message?.content;
    if (typeof reply !== 'string' || reply.length === 0) {
      return res.status(502).json({ error: 'Leere Antwort vom Modell.' });
    }
    res.json({ reply });
  } catch (err) {
    console.error('Mistral-API-Fehler:', err.message);
    res.status(502).json({ error: 'Aufruf der Mistral-API fehlgeschlagen.' });
  }
});

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});
