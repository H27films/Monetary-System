import React, { useState } from 'react';
import { BookOpen, CheckCircle, XCircle, HelpCircle, ArrowRight } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const QuizView: React.FC = () => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState<Record<number, boolean>>({});

  const questions: Question[] = [
    {
      id: 1,
      question: 'When a commercial bank approves a brand new $1,000,000 mortgage loan to a homebuyer, what happens to the money supply?',
      options: [
        'No new money is created; the bank transfers existing reserves from another customer.',
        'M1 Broad Money expands by $1,000,000 because the bank creates a new deposit liability alongside the new loan asset.',
        'Central bank reserves increase by $1,000,000.',
        'M0 base money increases immediately.',
      ],
      correctIndex: 1,
      explanation:
        'Correct! Banks do not lend out pre-existing reserves or deposits. When a bank grants a loan, it creates a new deposit liability (money in the borrower checking account) out of thin air, expanding M1 broad money.',
    },
    {
      id: 2,
      question: 'Why does Central Bank Quantitative Easing (QE) with a Pension Fund expand M1 Broad Money, while QE with a Commercial Bank does NOT?',
      options: [
        'Pension funds have accounts directly at the Central Bank, while commercial banks do not.',
        'Commercial banks refuse to spend QE proceeds on deposits.',
        'When the Fed buys bonds from a pension fund, the payment lands in the pension fund commercial bank deposit (creating new M1). When buying from a bank, the Fed merely swaps bank bonds for bank reserves.',
        'QE with a pension fund reduces government debt, while QE with a bank increases it.',
      ],
      correctIndex: 2,
      explanation:
        'Precisely! Non-banks cannot hold reserves at the Fed. Thus, selling bonds to the Fed forces settlement through a commercial bank, crediting the non-bank deposit account (creating new M1 broad money).',
    },
    {
      id: 3,
      question: 'What happens to commercial bank reserves when the US Treasury collects income taxes or issues new bonds to primary dealers?',
      options: [
        'Bank reserves increase as tax dollars enter the Treasury General Account (TGA).',
        'Bank reserves decrease because money moves out of bank reserve accounts at the Fed and into the Treasury General Account (TGA).',
        'Bank reserves remain completely unchanged.',
        'Physical cash notes in circulation increase.',
      ],
      correctIndex: 1,
      explanation:
        'Correct! Tax payments and Treasury debt purchases drain funds from private bank accounts and bank reserves at the Fed into the TGA account, temporarily draining interbank liquidity until spent back out.',
    },
    {
      id: 4,
      question: 'When the Treasury spends cash out of its TGA account (e.g. paying government employees or military contractors), what happens to the private sector?',
      options: [
        'M1 Broad Money and Bank Reserves both INCREASE.',
        'M1 Broad Money decreases while TGA increases.',
        'Total government debt decreases immediately.',
        'Central Bank assets shrink.',
      ],
      correctIndex: 0,
      explanation:
        'Spot on! TGA cash flows out of the Fed liability column back into commercial bank reserves and private customer checking accounts, expanding M1 broad money.',
    },
    {
      id: 5,
      question: 'What happens when a customer withdraws $5,000 in physical cash paper notes from their commercial bank account?',
      options: [
        'The bank reserve balance at the Fed increases by $5,000.',
        'Broad bank deposit liabilities decrease, and the Fed shifts its liability from bank reserves to paper currency notes in circulation.',
        'Central bank total assets double.',
        'The bank creates $5,000 in new commercial loans.',
      ],
      correctIndex: 1,
      explanation:
        'Exactly right! Cash withdrawals convert digital commercial bank deposits into physical central bank liabilities (currency notes), reducing bank reserves at the Fed.',
    },
  ];

  const handleSelect = (questionId: number, optionIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
    setShowResults((prev) => ({ ...prev, [questionId]: true }));
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6 text-slate-100">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-lg font-extrabold tracking-tight text-white flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-amber-400" />
          <span>Monetary Mechanics Knowledge Challenge</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Test your understanding of double-entry T-accounts, central bank reserves, TGA flows, and money creation.
        </p>
      </div>

      <div className="space-y-6">
        {questions.map((q, idx) => {
          const selected = selectedAnswers[q.id];
          const isAnswered = showResults[q.id];
          const isCorrect = selected === q.correctIndex;

          return (
            <div
              key={q.id}
              className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 space-y-3 shadow-md"
            >
              <div className="flex items-start space-x-3">
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Q{idx + 1}
                </span>
                <h3 className="text-sm font-semibold text-slate-200 leading-snug">
                  {q.question}
                </h3>
              </div>

              {/* Option List */}
              <div className="space-y-2 pt-1">
                {q.options.map((opt, oIdx) => {
                  let optStyle = 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700';

                  if (isAnswered) {
                    if (oIdx === q.correctIndex) {
                      optStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-200 font-semibold';
                    } else if (selected === oIdx) {
                      optStyle = 'bg-rose-500/20 border-rose-500 text-rose-200';
                    } else {
                      optStyle = 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={oIdx}
                      disabled={isAnswered}
                      onClick={() => handleSelect(q.id, oIdx)}
                      className={`w-full text-left p-3 rounded-xl text-xs border transition duration-200 flex items-start space-x-2 cursor-pointer ${optStyle}`}
                    >
                      <span className="font-bold opacity-70 shrink-0">
                        {String.fromCharCode(65 + oIdx)}.
                      </span>
                      <span className="leading-relaxed">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation Box */}
              {isAnswered && (
                <div
                  className={`p-3 rounded-xl border text-xs space-y-1 ${
                    isCorrect
                      ? 'bg-emerald-950/50 border-emerald-800 text-emerald-300'
                      : 'bg-rose-950/50 border-rose-800 text-rose-300'
                  }`}
                >
                  <div className="flex items-center space-x-1.5 font-bold">
                    {isCorrect ? (
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400" />
                    )}
                    <span>{isCorrect ? 'Correct!' : 'Incorrect'}</span>
                  </div>
                  <p className="leading-relaxed text-[11px] opacity-90">{q.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
