import React, { useState, useRef, useEffect } from 'react';
import { Landmark, ArrowLeftRight, Wrench, BarChart3, RotateCcw, Sparkles, FileText, Settings, ChevronDown, Check } from 'lucide-react';
import { Scenario } from '../types/monetary';

interface HeaderProps {
  scenarios: Scenario[];
  activeScenarioId: string;
  onSelectScenario: (id: string) => void;
  activeTab: 't_accounts' | 'flow' | 'sandbox' | 'journal' | 'chart' | 'ai';
  onTabChange: (tab: 't_accounts' | 'flow' | 'sandbox' | 'journal' | 'chart' | 'ai') => void;
  onReset: () => void;
  onOpenSettings?: () => void;
  isCustomInitial?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  scenarios,
  activeScenarioId,
  onSelectScenario,
  activeTab,
  onTabChange,
  onReset,
  onOpenSettings,
  isCustomInitial,
}) => {
  const [isScenarioDropdownOpen, setIsScenarioDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsScenarioDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeScenario = scenarios.find((s) => s.id === activeScenarioId) || scenarios[0];

  return (
    <header className="bg-[#FAF8F5] text-[#1A1A1A] border-b border-[#E2DDD5] sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3.5 gap-3 border-b border-[#E8E4DC]">
          
          {/* Brand Identity */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#1A1A1A] text-[#FAF8F5] rounded-lg shadow-xs">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-serif font-normal tracking-tight text-[#1A1A1A] leading-none">
                  Monetary System Mechanics
                </h1>
                <span className="text-[10px] font-sans font-medium uppercase tracking-wider px-2 py-0.5 bg-zinc-200/80 text-zinc-700 rounded-md">
                  Double-Entry Simulator
                </span>
              </div>
              <p className="text-xs font-serif italic text-zinc-500 mt-0.5">
                Central Bank • Sovereign Treasury • Commercial Banking • Institutional Capital
              </p>
            </div>
          </div>

          {/* Scenario Selector & Reset Button */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Website Custom Scenario Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsScenarioDropdownOpen(!isScenarioDropdownOpen)}
                className="flex items-center space-x-2 bg-white hover:bg-zinc-50 text-[#1A1A1A] px-3 py-2 rounded-lg border border-[#E2DDD5] shadow-xs transition cursor-pointer text-xs font-serif font-medium"
              >
                <span className="text-[10px] font-sans font-semibold uppercase text-zinc-500 hidden sm:inline">
                  SCENARIO:
                </span>
                <span className="truncate max-w-[200px] sm:max-w-[300px]">
                  {activeScenario.title}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-zinc-500 transition-transform duration-150 ${isScenarioDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isScenarioDropdownOpen && (
                <div className="absolute right-0 sm:left-0 mt-1.5 w-80 sm:w-96 bg-white border border-[#E2DDD5] rounded-xl shadow-xl z-50 overflow-hidden py-1">
                  <div className="px-3 py-1.5 bg-[#FAF8F5] border-b border-[#E2DDD5] text-[10px] font-sans font-semibold uppercase text-zinc-500 tracking-wider flex justify-between items-center">
                    <span>Select Simulator Scenario</span>
                    <span>{scenarios.length} Available</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-zinc-100">
                    {scenarios.map((sc) => {
                      const isSelected = sc.id === activeScenarioId;
                      return (
                        <button
                          key={sc.id}
                          onClick={() => {
                            onSelectScenario(sc.id);
                            setIsScenarioDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3.5 py-2.5 flex items-start justify-between space-x-2 transition cursor-pointer ${
                            isSelected ? 'bg-amber-50/70 text-[#1A1A1A]' : 'hover:bg-zinc-50 text-zinc-800'
                          }`}
                        >
                          <div className="space-y-0.5 min-w-0 flex-1">
                            <div className="flex items-center space-x-2">
                              <span className={`text-xs font-serif font-medium ${isSelected ? 'font-semibold text-[#1A1A1A]' : ''}`}>
                                {sc.title}
                              </span>
                            </div>
                            <p className="text-[10px] font-sans text-zinc-500 line-clamp-2 leading-tight">
                              {sc.description}
                            </p>
                          </div>
                          <div className="flex items-center shrink-0 pt-0.5">
                            {isSelected && <Check className="w-4 h-4 text-amber-700 shrink-0" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={onReset}
              className="flex items-center space-x-1.5 px-3 py-2 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-sans font-medium rounded-lg border border-[#E2DDD5] shadow-xs transition cursor-pointer"
              title="Reset current scenario to step 1"
            >
              <RotateCcw className="w-3.5 h-3.5 text-zinc-500" />
              <span>Reset</span>
            </button>

            {onOpenSettings && (
              <button
                onClick={onOpenSettings}
                className={`flex items-center space-x-1.5 px-3 py-2 text-xs font-sans font-medium rounded-lg border shadow-xs transition cursor-pointer ${
                  isCustomInitial
                    ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-white hover:bg-zinc-50 text-zinc-700 border-[#E2DDD5]'
                }`}
                title="Alter starting balances of assets and liabilities for each actor"
              >
                <Settings className="w-3.5 h-3.5 text-zinc-600" />
                <span>Starting Balances</span>
                {isCustomInitial && (
                  <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" title="Custom starting balances active" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* View Navigation Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto py-2 no-scrollbar text-xs">
          <button
            onClick={() => onTabChange('t_accounts')}
            className={`flex items-center space-x-2 px-3 py-1.5 font-sans text-xs font-medium rounded-lg transition cursor-pointer whitespace-nowrap border ${
              activeTab === 't_accounts'
                ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-xs'
                : 'bg-white text-zinc-600 border-[#E2DDD5] hover:text-[#1A1A1A] hover:bg-zinc-50'
            }`}
          >
            <Landmark className="w-3.5 h-3.5" />
            <span>T-Accounts Ledger</span>
          </button>

          <button
            onClick={() => onTabChange('chart')}
            className={`flex items-center space-x-2 px-3 py-1.5 font-sans text-xs font-medium rounded-lg transition cursor-pointer whitespace-nowrap border ${
              activeTab === 'chart'
                ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-xs'
                : 'bg-white text-zinc-600 border-[#E2DDD5] hover:text-[#1A1A1A] hover:bg-zinc-50'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Visual Balance Chart</span>
          </button>

          <button
            onClick={() => onTabChange('flow')}
            className={`flex items-center space-x-2 px-3 py-1.5 font-sans text-xs font-medium rounded-lg transition cursor-pointer whitespace-nowrap border ${
              activeTab === 'flow'
                ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-xs'
                : 'bg-white text-zinc-600 border-[#E2DDD5] hover:text-[#1A1A1A] hover:bg-zinc-50'
            }`}
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Flow Vectors Map</span>
          </button>

          <button
            onClick={() => onTabChange('sandbox')}
            className={`flex items-center space-x-2 px-3 py-1.5 font-sans text-xs font-medium rounded-lg transition cursor-pointer whitespace-nowrap border ${
              activeTab === 'sandbox'
                ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-xs'
                : 'bg-white text-zinc-600 border-[#E2DDD5] hover:text-[#1A1A1A] hover:bg-zinc-50'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Sandbox Engine</span>
          </button>

          <button
            onClick={() => onTabChange('journal')}
            className={`flex items-center space-x-2 px-3 py-1.5 font-sans text-xs font-medium rounded-lg transition cursor-pointer whitespace-nowrap border ${
              activeTab === 'journal'
                ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-xs'
                : 'bg-white text-zinc-600 border-[#E2DDD5] hover:text-[#1A1A1A] hover:bg-zinc-50'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Audit Journal</span>
          </button>

          <button
            onClick={() => onTabChange('ai')}
            className={`flex items-center space-x-2 px-3 py-1.5 font-sans text-xs font-medium rounded-lg transition cursor-pointer whitespace-nowrap border ${
              activeTab === 'ai'
                ? 'bg-[#D93829] text-white border-[#D93829] shadow-xs'
                : 'bg-white text-[#D93829] border-[#E2DDD5] hover:bg-rose-50/50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask AI Economist</span>
          </button>
        </div>
      </div>
    </header>
  );
};
