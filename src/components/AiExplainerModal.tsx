import React, { useState } from 'react';
import { Sparkles, Send, User, Bot, Loader2 } from 'lucide-react';
import { MonetaryStep, EntityBalanceSheet } from '../types/monetary';

interface AiExplainerModalProps {
  currentStep?: MonetaryStep;
  currentBalanceSheets?: Record<string, EntityBalanceSheet>;
  initialQuery?: string;
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  time: string;
}

export const AiExplainerModal: React.FC<AiExplainerModalProps> = ({
  currentStep,
  currentBalanceSheets,
  initialQuery,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Hello! I am your AI Monetary System Economist. I specialize in central bank reserves, commercial bank money creation, TGA fiscal flows, and double-entry balance sheet mechanics.\n\nAsk me any question about the current scenario step or general monetary accounting!`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [question, setQuestion] = useState<string>(initialQuery || '');
  const [loading, setLoading] = useState<boolean>(false);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || loading) return;

    const userText = question.trim();
    const userMsg: Message = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setQuestion('');
    setLoading(true);

    try {
      const res = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-[#1A1A1A]': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: userText,
          stepContext: currentStep,
          balanceSheets: currentBalanceSheets,
        }),
      });

      const data = await res.json();

      let aiText = data.explanation;
      if (!aiText) {
        aiText = `**Monetary System Accounting Insight:**\n\nWhen analyzing "${userText}", remember the core double-entry accounting identity:\n\n1. **Central Bank Reserves (M0)** exist solely as digital settlement liabilities on the Central Bank ledger for commercial banks and the Treasury (TGA).\n2. **Broad Money (M1)** consists of commercial bank deposit liabilities owed to households, businesses, and pension funds.\n3. **Money Creation:** Commercial banks create brand new deposit liabilities whenever they extend loans. Fiscal spending out of the TGA transfers reserves back into bank accounts and creates private broad money.`;
      }

      const aiMsg: Message = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: aiText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const fallbackMsg: Message = {
        id: `err_${Date.now()}`,
        sender: 'ai',
        text: `**Double-Entry Accounting Principle:**\n\nCentral Bank reserves settle interbank payments and Treasury operations. Commercial banks create deposit liabilities (broad money M1) through lending. When analyzing any flow, always check both sides of the T-account ledger!`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-[#E2DDD5] rounded-xl p-6 shadow-xs space-y-4 text-[#1A1A1A] flex flex-col h-[600px]">
      
      {/* Header */}
      <div className="border-b border-[#E2DDD5] pb-3 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-[#D93829] text-white rounded-lg shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-serif font-medium text-[#1A1A1A]">
              AI Monetary System Economist
            </h2>
            <p className="text-xs font-sans text-zinc-500">
              Powered by Gemini & Double-Entry Accounting Rules
            </p>
          </div>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs font-sans">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start space-x-2.5 ${
              m.sender === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'
            }`}
          >
            <div
              className={`p-2 rounded-lg border shrink-0 ${
                m.sender === 'user'
                  ? 'bg-[#FAF8F5] text-[#1A1A1A] border-[#E2DDD5]'
                  : 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
              }`}
            >
              {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[85%] p-3.5 rounded-xl border space-y-1 ${
                m.sender === 'user'
                  ? 'bg-zinc-100 text-[#1A1A1A] border-zinc-200'
                  : 'bg-white text-[#1A1A1A] border-[#E2DDD5] shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-sans font-semibold text-zinc-500 mb-1">
                <span>{m.sender === 'user' ? 'YOU' : 'AI CENTRAL BANKER'}</span>
                <span>{m.time}</span>
              </div>
              <div className="whitespace-pre-line leading-relaxed text-xs font-sans">{m.text}</div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center space-x-2 text-zinc-500 font-sans text-xs p-2">
            <Loader2 className="w-4 h-4 animate-spin text-[#D93829]" />
            <span>Analyzing T-accounts and computing reserve mechanics...</span>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleAsk} className="pt-2 border-t border-[#E2DDD5] flex items-center space-x-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask e.g. Why does fiscal spending increase bank reserves?"
          className="flex-1 bg-[#FAF8F5] text-[#1A1A1A] font-sans text-xs p-3 rounded-lg border border-[#E2DDD5] focus:outline-none focus:border-[#1A1A1A]"
        />
        <button
          type="submit"
          disabled={loading || !question.trim()}
          className="p-3 bg-[#1A1A1A] hover:bg-zinc-800 disabled:opacity-40 text-white font-medium rounded-lg shadow-xs transition cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
