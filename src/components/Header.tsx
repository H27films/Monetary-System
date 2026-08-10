import React from 'react';
import { Landmark, ArrowLeftRight, Wrench, BookOpen, HelpCircle, RotateCcw, Sparkles, FileText } from 'lucide-react';
import { Scenario } from '../types/monetary';

interface HeaderProps {
  scenarios: Scenario[];
  activeScenarioId: string;
  onSelectScenario: (id: string) => void;
  activeTab: 't_accounts' | 'flow' | 'sandbox' | 'journal' | 'quiz' | 'ai';
  onTabChange: (tab: 't_accounts' | 'flow' | 'sandbox' | 'journal' | 'quiz' | 'ai') => void;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  scenarios,
  activeScenarioId,
  onSelectScenario,
  activeTab,
  onTabChange,
  onReset,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 gap-4">
          
          {/* Brand Identity */}
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl shadow-lg shadow-emerald-500/20 text-white">
              <Landmark className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-bold tracking-tight text-white">
                  Monetary System Simulator
                </h1>
                <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Double-Entry Mechanics
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Central Bank • Primary Dealers • Commercial Banks • Pension Funds • Individuals
              </p>
            </div>
          </div>

          {/* Scenario Picker & Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center space-x-2 bg-slate-800/80 p-1.5 rounded-lg border border-slate-700/60">
              <span className="text-xs text-slate-400 pl-2 font-medium hidden sm:inline">Scenario:</span>
              <select
                value={activeScenarioId}
                onChange={(e) => onSelectScenario(e.target.value)}
                className="bg-slate-900 text-slate-100 text-xs font-medium rounded-md px-3 py-1.5 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                {scenarios.map((sc) => (
                  <option key={sc.id} value={sc.id}>
                    {sc.title} ({sc.difficulty})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={onReset}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium border border-slate-700 transition cursor-pointer"
              title="Reset current scenario to step 1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex items-center space-x-1 overflow-x-auto py-2 border-t border-slate-800/80 no-scrollbar text-xs">
          <button
            onClick={() => onTabChange('t_accounts')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg font-medium transition cursor-pointer whitespace-nowrap ${
              activeTab === 't_accounts'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Landmark className="w-4 h-4" />
            <span>T-Accounts Ledger (5 Entities)</span>
          </button>

          <button
            onClick={() => onTabChange('flow')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg font-medium transition cursor-pointer whitespace-nowrap ${
              activeTab === 'flow'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <ArrowLeftRight className="w-4 h-4" />
            <span>Flow Vectors Map</span>
          </button>

          <button
            onClick={() => onTabChange('sandbox')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg font-medium transition cursor-pointer whitespace-nowrap ${
              activeTab === 'sandbox'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Sandbox Mode</span>
          </button>

          <button
            onClick={() => onTabChange('journal')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg font-medium transition cursor-pointer whitespace-nowrap ${
              activeTab === 'journal'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Audit Journal</span>
          </button>

          <button
            onClick={() => onTabChange('quiz')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg font-medium transition cursor-pointer whitespace-nowrap ${
              activeTab === 'quiz'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Mechanics Quiz</span>
          </button>

          <button
            onClick={() => onTabChange('ai')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg font-medium transition cursor-pointer whitespace-nowrap ${
              activeTab === 'ai'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Ask AI Economist</span>
          </button>
        </div>
      </div>
    </header>
  );
};
