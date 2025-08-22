'use client';
import { useState } from 'react';

type Role = 'user' | 'pro';

export default function ChatPage() {
  const [role, setRole] = useState<Role>('user');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);

  async function onSend() {
    if (!input.trim()) return;
    const text = input;
    setInput('');
    setMessages((m) => [...m, { role: 'me', text }]);
    const res = await fetch('/api/chat', { method: 'POST', body: JSON.stringify({ messageText: text, role }) });
    const data = await res.json();
    setMessages((m) => [...m, { role: 'ai', text: data.answer ?? 'ok' }]);
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button onClick={() => setRole('user')} className={`px-3 py-1 rounded-lg border ${role==='user'?'bg-white/10':''}`}>User</button>
          <button onClick={() => setRole('pro')} className={`px-3 py-1 rounded-lg border ${role==='pro'?'bg-white/10':''}`}>Professional</button>
        </div>
        <span className="opacity-70 text-sm">This is not clinical advice.</span>
      </div>
      <div className="h-[60vh] overflow-y-auto rounded-2xl border p-4 backdrop-blur bg-white/5">
        {messages.map((m, i) => (
          <div key={i} className="py-1">
            <span className="opacity-70 mr-2">{m.role}:</span>
            <span>{m.text}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={input} onChange={(e)=>setInput(e.target.value)} placeholder="Type a message" className="flex-1 px-3 py-2 rounded-xl border bg-black/20"/>
        <button onClick={onSend} className="px-4 py-2 rounded-xl border">Send</button>
      </div>
    </div>
  );
}
