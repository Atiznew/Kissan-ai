import React, { useState, useRef, useEffect } from 'react';
import { chatWithKisanSahayak } from '../services/geminiService';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import { ChatMessage } from '../types';

const SmartChat: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: 'नमस्ते किसान भाई! मैं आपका AI कृषि सहायक हूँ। आप मुझसे खेती, मौसम या सरकारी योजनाओं के बारे में कुछ भी पूछ सकते हैं।',
      timestamp: new Date()
    }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Format history for Gemini
    const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
    }));

    const response = await chatWithKisanSahayak(userMsg.text, history);

    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: response,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botMsg]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-4 bg-kisan-600 text-white font-bold flex items-center gap-2">
        <Bot className="w-6 h-6" />
        किसान सहायक (AI Assistant)
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] rounded-2xl p-4 ${
                msg.role === 'user' 
                  ? 'bg-kisan-600 text-white rounded-br-none' 
                  : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm'
              }`}
            >
              <div className="flex items-center gap-2 mb-1 opacity-80 text-xs">
                {msg.role === 'user' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                <span>{msg.role === 'user' ? 'आप' : 'सहायक'}</span>
              </div>
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl rounded-bl-none p-4 shadow-sm border border-gray-200 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-kisan-600" />
              <span className="text-gray-500 text-sm">लिख रहा है...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 flex gap-2">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="अपना सवाल पूछें..."
          className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-kisan-500 outline-none text-sm"
        />
        <button 
          type="submit" 
          disabled={loading || !input.trim()}
          className="bg-kisan-600 hover:bg-kisan-700 disabled:bg-gray-300 text-white p-3 rounded-xl transition-colors"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default SmartChat;
