const messagesEl = document.getElementById('messages');
const form = document.getElementById('form');
const input = document.getElementById('input');
const button = form.querySelector('button');

const history = [];

function addMessage(role, text) {
  const div = document.createElement('div');
  div.className = `message ${role}`;
  div.textContent = text;
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
  return div;
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  input.value = '';
  button.disabled = true;
  addMessage('user', text);
  history.push({ role: 'user', content: text });
  const pending = addMessage('assistant', '…');

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: history }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);

    pending.textContent = data.reply;
    history.push({ role: 'assistant', content: data.reply });
  } catch (err) {
    pending.className = 'message error';
    pending.textContent = `Fehler: ${err.message}`;
    history.pop();
  } finally {
    button.disabled = false;
    input.focus();
  }
});
