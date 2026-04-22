import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/api';
import { getSocket } from '../lib/socket';
import MessageInput from './MessageInput';

export default function ChatWindow({ user }) {
  const { id } = useParams();
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const currentUserId = user?.id || user?._id;
  const otherUser = useMemo(() => chat?.members?.find((member) => member._id !== currentUserId), [chat, currentUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!user || !id) return;

    let activeChatId = null;
    let socket;

    const init = async () => {
      setLoading(true);
      try {
        const res = await API.post('/chats/chat', { memberIds: [currentUserId, id] });
        setChat(res.data);
        activeChatId = res.data._id;

        const msgs = await API.get(`/chats/${activeChatId}/messages`);
        setMessages(msgs.data);

        socket = getSocket();
        socket?.emit('join-chat', activeChatId);

        const onMessage = (incoming) => {
          if (incoming.chat === activeChatId || incoming.chat?._id === activeChatId) {
            setMessages((prev) => {
              if (prev.some((msg) => msg._id === incoming._id)) return prev;
              return [...prev, incoming];
            });
          }
        };

        socket?.off('message');
        socket?.on('message', onMessage);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    init();

    return () => {
      if (socket && activeChatId) {
        socket.emit('leave-chat', activeChatId);
        socket.off('message');
      }
    };
  }, [user, id, currentUserId]);

  const handleLocalSend = (text) => {
    setMessages((prev) => [
      ...prev,
      {
        _id: `temp-${Date.now()}`,
        text,
        sender: { _id: currentUserId, name: user.name },
        createdAt: new Date().toISOString()
      }
    ]);
  };

  if (!user) return <main className="chat-panel center-panel">Please login first.</main>;
  if (loading) return <main className="chat-panel center-panel">Loading chat...</main>;
  if (!chat) return <main className="chat-panel center-panel">Unable to load chat.</main>;

  return (
    <main className="chat-panel">
      <div className="chat-header">
        <div className="avatar large">{otherUser?.name?.[0]?.toUpperCase() || 'C'}</div>
        <div>
          <h3>{otherUser?.name || chat.name || 'Chat'}</h3>
          <p>{otherUser?.online ? 'Online' : 'Start chatting now'}</p>
        </div>
      </div>

      <div className="messages-area">
        {messages.length === 0 ? (
          <div className="center-panel muted">No messages yet. Say hello 👋</div>
        ) : (
          messages.map((m) => {
            const isMe = (m.sender?._id || m.sender) === currentUserId;
            return (
              <div key={m._id} className={`message-row ${isMe ? 'me' : ''}`}>
                <div className={`message-bubble ${isMe ? 'me' : ''}`}>
                  <small>{isMe ? 'You' : m.sender?.name || otherUser?.name || 'User'}</small>
                  <div>{m.text}</div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <MessageInput chatId={chat._id} onLocalSend={handleLocalSend} />
    </main>
  );
}
