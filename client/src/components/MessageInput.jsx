import React, { useState } from 'react';
import { getSocket } from '../lib/socket';

export default function MessageInput({ chatId, onLocalSend }) {
  const [text, setText] = useState('');

  const send = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const payload = { chatId, text: text.trim() };
    onLocalSend?.(payload.text);

    const socket = getSocket();
    socket?.emit('send-message', payload);
    setText('');
  };

  return (
    <form onSubmit={send} className="message-input">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message"
      />
      <button type="submit">Send</button>
    </form>
  );
}
