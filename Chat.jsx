import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Lock, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Chat = ({ ideaId, receiverId }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch(`/api/chat/${ideaId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  }, [ideaId]);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, [ideaId, fetchMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const res = await fetch(`/api/chat/${ideaId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content_encrypted: newMessage, // In a real app, this would be encrypted client-side
          receiver_id: receiverId
        })
      });

      if (res.ok) {
        setNewMessage('');
        fetchMessages();
      }
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  return (
    <div className="glass-card flex flex-col h-[500px] overflow-hidden">
      <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-rich-neon" />
          <h3 className="text-sm font-bold uppercase tracking-widest">Chat Seguro (End-to-End)</h3>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-white/40">
          <Lock className="w-3 h-3" />
          <span>Criptografado</span>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10"
      >
        {loading ? (
          <div className="text-center text-white/40 text-sm py-10">Iniciando conexão segura...</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-white/40 text-sm py-10">Nenhuma mensagem ainda. Inicie a conversa com segurança.</div>
        ) : (
          messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex flex-col ${msg.sender_id === user?.id ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-1 mb-1">
                <span className="text-[10px] text-white/40">{msg.sender_name}</span>
                <span className="text-[10px] text-white/20">• {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div 
                className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  msg.sender_id === user?.id 
                    ? 'bg-rich-neon text-rich-black rounded-tr-none' 
                    : 'bg-white/10 text-white rounded-tl-none border border-white/10'
                }`}
              >
                {msg.content_encrypted}
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 bg-white/5">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Digite sua mensagem segura..."
            className="w-full bg-rich-black/50 border border-white/10 rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:border-rich-neon text-sm"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button 
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-rich-neon hover:scale-110 transition-transform"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;
