import React, { useState } from 'react';
import { Sparkles, Send, Bot, User, Loader2 } from 'lucide-react';

interface AiExplainerModalProps {
  initialQuestion?: string;
  contextData?: any;
}

export const AiExplainerModal: React.FC<AiExplainerModalProps> = ({
  initialQuestion = '',
  contextData = {},
}) => {
  const [question, setQuestion] = useState(initialQuestion);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<
    { sender: 'user' | 'ai'; text: string; time: string }[]
  >([
    {
      sender: 'ai',
      text: 'Hello! I am your AI Monetary Systems Economist. Ask me anything about Federal Reserve operations, double-entry T-accounts, TGA fiscal mechanics, Quantitative Easing (QE/QT), or commercial bank money creation.',
      time: new Date().toLocaleTimeString(),
    },
  ]);

  const handleAsk = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!question.trim() || loading) return;

    const userText = question.trim();
    setQuestion('');

    const newMsg = { sender: 'user' as const, text: userText, time: new Date().toLocaleTimeString() };
    setMessages((prev) => [...prev, newMsg]);
    setLoading(true);

    try {
      const res = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: userText,
          context: contextData,
        }),
      });

      const data = await res.json();

      let aiText = data.explanation;
      if (!aiText) {
        // Fallback expert explanation if key is not configured or error occurs
        aiText = `**Monetary System Accounting Insight:**\n\nWhen analyzing "${userText}", remember the core double-entry accounting identity:\n\n1. **Central Bank Reserves (M0)** exist solely as digital settlement liabilities on the Central Bank ledger for commercial banks and the Treasury (TGA).\n2. **Broad Money (M1)** consists of commercial bank deposit liabilities owed to households, businesses, and pension funds.\n3. **Money Creation:** Commercial banks create brand new deposit liabilities whenever they extend loans. Fiscal spending out of the TGA transfers reserves back into bank accounts and creates private broad money.`;
      }

      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: aiText, time: new Date().toLocaleTimeString() },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `**Accounting Mechanics Explanation:**\n\nDouble-entry balance sheets must balance at all times ($Assets = Liabilities + Equity$). In modern fiat systems, bank reserves settle interbank obligations, while commercial bank deposits form the main broad medium of exchange (M1).`,
          time: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 text-slate-100 flex flex-col h-[600px]">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              AI Monetary System Economist
            </h2>
            <p className="text-xs text-slate-400">
              Powered by Gemini & Double-Entry Accounting Rules
            </p>
          </div>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 text-xs">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start space-x-3 ${
              m.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            <div
              className={`p-2 rounded-xl shrink-0 ${
                m.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}
            >
              {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[85%] p-3.5 rounded-2xl border space-y-1 ${
                m.sender === 'user'
                  ? 'bg-blue-600 text-white border-blue-500'
                  : 'bg-slate-950/80 text-slate-200 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] opacity-70 mb-1 font-mono">
                <span>{m.sender === 'user' ? 'You' : 'AI Central Banker'}</span>
                <span>{m.time}</span>
              </div>
              <div className="whitespace-pre-line leading-relaxed text-xs">{m.text}</div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center space-x-2 text-slate-400 text-xs p-2">
            <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
            <span>Analyzing T-accounts and computing reserve mechanics...</span>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleAsk} className="pt-2 border-t border-slate-800 flex items-center space-x-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask e.g. Why does fiscal spending increase bank reserves?"
          className="flex-1 bg-slate-950 text-slate-100 text-xs rounded-xl p-3 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <button
          type="submit"
          disabled={loading || !question.trim()}
          className="p-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-bold rounded-xl transition cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
