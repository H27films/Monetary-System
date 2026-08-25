import React, { useState, useRef, useEffect } from 'react';
import { SimpleScenario, simpleScenarios, SimpleStep, SimpleTAccount } from '../data/simpleMechanicsScenarios';
import { ChevronDown, Check, ArrowDown, BookOpen, Landmark, ExternalLink, Sparkles, Layers, SlidersHorizontal, ArrowLeft, Lightbulb } from 'lucide-react';

interface SimpleMechanicsViewProps {
  onSwitchToSimulator: () => void;
  onOpenBrandMenu: () => void;
}

export const SimpleMechanicsView: React.FC<SimpleMechanicsViewProps> = ({
  onSwitchToSimulator,
  onOpenBrandMenu,
}) => {
  const [activeScenarioId, setActiveScenarioId] = useState<string>(simpleScenarios[0].id);
  const [isScenarioDropdownOpen, setIsScenarioDropdownOpen] = useState<boolean>(false);
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

  const activeScenario = simpleScenarios.find((s) => s.id === activeScenarioId) || simpleScenarios[0];

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1A1A1A] font-serif">
      {/* Top Simple Mechanics Navigation Header */}
      <header className="bg-[#FAF8F5] border-b border-[#E2DDD5] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3.5 gap-3">
            
            {/* Left: Brand Popover Trigger / Clickable Landmark Icon */}
            <div className="flex items-center space-x-3">
              <button
                onClick={onOpenBrandMenu}
                className="p-2.5 bg-[#1A1A1A] hover:bg-zinc-800 text-[#FAF8F5] rounded-xl shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer group flex items-center justify-center relative ring-2 ring-transparent hover:ring-amber-500/50"
                title="Click icon to switch between Simple Mechanics and Monetary System Simulator"
                aria-label="Switch between Simple Mechanics and Monetary System Simulator"
              >
                <Landmark className="w-5 h-5 text-[#FAF8F5]" />
                {/* Subtle badge indicator on icon */}
                <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500 border-2 border-white"></span>
                </span>
              </button>

              <div
                onClick={onOpenBrandMenu}
                className="cursor-pointer group"
                title="Click to switch between Simple Mechanics and Monetary System Simulator"
              >
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl font-serif font-semibold tracking-tight text-[#1A1A1A] leading-none group-hover:text-amber-900 transition">
                    Simple Mechanics
                  </h1>
                </div>
                <p className="text-xs font-serif italic text-zinc-500 mt-0.5">
                  Classical T-Accounts & Sequential Balance Sheet Transformations
                </p>
              </div>
            </div>

            {/* Right: Scenario Dropdown & Switch to Full Simulator */}
            <div className="flex items-center space-x-2.5 flex-wrap">
              
              {/* Scenario Selector Dropdown */}
              <div className="relative z-50" ref={dropdownRef}>
                <button
                  onClick={() => setIsScenarioDropdownOpen(!isScenarioDropdownOpen)}
                  className="flex items-center space-x-2 bg-white hover:bg-zinc-50 text-[#1A1A1A] px-3.5 py-2 rounded-lg border border-[#D5CFBF] shadow-xs transition cursor-pointer text-xs font-serif font-medium"
                >
                  <span className="text-[10px] font-sans font-semibold uppercase text-zinc-500 hidden md:inline">
                    SELECT SCENARIO:
                  </span>
                  <span className="truncate max-w-[220px] sm:max-w-[280px] font-semibold">
                    {activeScenario.shortTitle || activeScenario.title}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-zinc-500 transition-transform duration-150 ${
                      isScenarioDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isScenarioDropdownOpen && (
                  <div className="absolute right-0 mt-1.5 w-80 sm:w-96 bg-white border border-[#D5CFBF] rounded-xl shadow-xl z-50 overflow-hidden py-1">
                    <div className="px-3.5 py-2 bg-[#FAF8F5] border-b border-[#E2DDD5] text-[10px] font-sans font-semibold uppercase text-zinc-500 tracking-wider flex justify-between items-center">
                      <span>Simple Mechanics Scenarios</span>
                      <span>{simpleScenarios.length} Available</span>
                    </div>
                    <div className="max-h-80 overflow-y-auto divide-y divide-zinc-100">
                      {simpleScenarios.map((sc) => {
                        const isSelected = sc.id === activeScenarioId;
                        return (
                          <button
                            key={sc.id}
                            onClick={() => {
                              setActiveScenarioId(sc.id);
                              setIsScenarioDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3.5 py-2.5 flex items-start justify-between space-x-2 transition cursor-pointer ${
                              isSelected ? 'bg-amber-50/80 text-[#1A1A1A]' : 'hover:bg-zinc-50 text-zinc-800'
                            }`}
                          >
                            <div className="space-y-0.5 min-w-0 flex-1">
                              <div className="text-xs font-serif font-medium leading-snug">
                                <span className={isSelected ? 'font-bold text-[#1A1A1A]' : ''}>
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

              {/* Button to Switch Back to Full Simulator */}
              <button
                onClick={onSwitchToSimulator}
                className="flex items-center space-x-1.5 px-3 py-2 bg-[#1A1A1A] hover:bg-zinc-800 text-[#FAF8F5] text-xs font-sans font-medium rounded-lg shadow-xs transition cursor-pointer"
                title="Switch to full interactive simulator with charts, audit logs, and sandbox"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Back to Full Simulator</span>
                <span className="sm:hidden">Simulator</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content: Sequential Down-the-Page Layout */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        
        {/* Scenario Header Overview */}
        <section className="bg-white border border-[#E2DDD5] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center space-x-2 px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200/80 rounded-md text-[11px] font-sans font-medium tracking-wide uppercase">
                <span>Scenario {activeScenario.scenarioNumber}</span>
                <span>•</span>
                <span>{activeScenario.steps.length} Sequential Steps</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A] tracking-tight">
                {activeScenario.title}
              </h2>
              <p className="text-sm sm:text-base font-serif text-zinc-700 leading-relaxed pt-1">
                {activeScenario.description}
              </p>
            </div>

            {/* Entity Participants Badges */}
            <div className="bg-[#FAF8F5] border border-[#E2DDD5] rounded-xl p-4 shrink-0 lg:w-80">
              <h4 className="text-xs font-sans font-semibold uppercase tracking-wider text-zinc-500 mb-2.5">
                Participating Entities ({activeScenario.entities.length})
              </h4>
              <div className="space-y-2">
                {activeScenario.entities.map((ent, idx) => (
                  <div key={ent.id} className="flex items-center justify-between text-xs font-sans">
                    <span className="font-semibold text-zinc-800">
                      {idx + 1}. {ent.name}
                    </span>
                    <span className="text-[10px] text-zinc-500 bg-white px-2 py-0.5 rounded border border-zinc-200">
                      {ent.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Key Takeaway & Thesis Banner */}
          {activeScenario.keyTakeaway && (
            <div className="border-t border-[#EAE5DC] pt-5">
              <div className="bg-amber-50/70 border border-amber-200/90 rounded-xl p-4 sm:p-5 space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="p-1.5 bg-amber-100/90 text-amber-900 rounded-lg shrink-0 mt-0.5">
                    <Lightbulb className="w-4 h-4" />
                  </div>
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <h4 className="text-sm font-sans font-bold text-amber-950 uppercase tracking-wide">
                      {activeScenario.keyTakeaway.headline}
                    </h4>
                    <p className="text-sm font-serif text-amber-950/90 leading-relaxed">
                      {activeScenario.keyTakeaway.body}
                    </p>
                    {activeScenario.keyTakeaway.mythBuster && (
                      <div className="mt-2 pt-2 border-t border-amber-200/60 text-xs font-serif italic text-amber-900 bg-amber-100/40 px-3 py-2 rounded-md">
                        {activeScenario.keyTakeaway.mythBuster}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Sequential Steps Rendered Down the Page */}
        <div className="space-y-12">
          {activeScenario.steps.map((step, stepIdx) => (
            <section
              key={step.stepNumber}
              className="bg-white border border-[#D5CFBF] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6 relative"
            >
              {/* Step Header */}
              <div className="border-b border-[#E2DDD5] pb-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-3">
                    <span
                      className={`px-3 py-1 font-sans text-xs font-bold rounded-md tracking-wider ${
                        step.isStartingPosition
                          ? 'bg-amber-900 text-amber-50'
                          : 'bg-[#1A1A1A] text-white'
                      }`}
                    >
                      {step.badgeText || (step.isStartingPosition ? 'STARTING POSITION' : `STEP ${step.stepNumber}`)}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#1A1A1A]">
                      {step.title.replace(/^(Step\s*\d+|Starting Position)\s*[:\—\-]\s*/i, '')}
                    </h3>
                  </div>
                  {step.subtitle && (
                    <span className="text-xs font-sans font-medium text-zinc-500 italic">
                      {step.subtitle}
                    </span>
                  )}
                </div>
                {step.description && (
                  <p className="text-sm font-serif text-zinc-600 mt-2 leading-relaxed">
                    {step.description}
                  </p>
                )}
              </div>

              {/* T-Accounts Side-by-Side in a Responsive Grid */}
              <div
                className={`grid ${
                  step.accounts.length === 5
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4'
                    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'
                }`}
              >
                {step.accounts.map((acc) => (
                  <div
                    key={acc.entityId}
                    className="flex flex-col items-center bg-[#FAF8F5]/60 border border-[#E2DDD5] rounded-xl p-4 pt-3.5 shadow-2xs hover:border-[#C5BEB0] transition"
                  >
                    {/* Entity Name */}
                    <div className="text-center mb-1">
                      <h4 className="text-base font-serif font-bold text-[#1A1A1A] leading-tight">
                        {acc.entityName}
                      </h4>
                      {acc.subtitle && (
                        <p className="text-[11px] font-serif italic text-zinc-600 leading-snug mt-0.5 min-h-[32px] flex items-center justify-center">
                          {acc.subtitle}
                        </p>
                      )}
                    </div>

                    {/* Classic Textbook T-Account Table */}
                    <div className="w-full mt-2 font-serif text-xs">
                      {/* Assets / Liabilities Headers */}
                      <div className="grid grid-cols-2 text-center pb-1 font-semibold text-zinc-800 tracking-tight">
                        <div>Assets</div>
                        <div>Liabilities</div>
                      </div>

                      {/* Main Horizontal Top Divider Bar (Classic T-Account) */}
                      <div className="w-full h-[1.5px] bg-[#1A1A1A]" />

                      {/* Entries with Center Vertical Divider Bar */}
                      <div className="grid grid-cols-2 min-h-[90px] text-xs pt-1.5 relative">
                        {/* Center Vertical Divider Bar */}
                        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1.5px] bg-[#1A1A1A]" />

                        {/* Left Side: Assets */}
                        <div className="pr-2 space-y-1.5">
                          {acc.assets.length > 0 ? (
                            acc.assets.map((ast, i) => {
                              const isPositive = ast.trim().startsWith('+');
                              const isNegative = ast.trim().startsWith('-');
                              return (
                                <div
                                  key={i}
                                  className={`leading-tight font-medium ${
                                    isPositive
                                      ? 'text-emerald-800'
                                      : isNegative
                                      ? 'text-rose-800'
                                      : 'text-zinc-800'
                                  }`}
                                >
                                  {ast}
                                </div>
                              );
                            })
                          ) : (
                            <div className="text-[11px] text-zinc-400 italic pt-1">—</div>
                          )}
                        </div>

                        {/* Right Side: Liabilities */}
                        <div className="pl-2 space-y-1.5">
                          {acc.liabilities.length > 0 ? (
                            acc.liabilities.map((liab, i) => {
                              const isPositive = liab.trim().startsWith('+');
                              const isNegative = liab.trim().startsWith('-');
                              return (
                                <div
                                  key={i}
                                  className={`leading-tight font-medium ${
                                    isPositive
                                      ? 'text-emerald-800'
                                      : isNegative
                                      ? 'text-rose-800'
                                      : 'text-zinc-800'
                                  }`}
                                >
                                  {liab}
                                </div>
                              );
                            })
                          ) : (
                            <div className="text-[11px] text-zinc-400 italic pt-1">—</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Step Footnote / Educational Takeaway (Textbook Style) */}
              {step.footnote && (
                <div className="pt-2 text-center">
                  <p className="text-xs font-serif italic text-zinc-600 bg-[#FAF8F5] inline-block px-4 py-2 rounded-lg border border-[#E2DDD5]">
                    {step.footnote}
                  </p>
                </div>
              )}

              {/* Visual Down-Arrow Connector to Next Step */}
              {stepIdx < activeScenario.steps.length - 1 && (
                <div className="flex justify-center -mb-10 pt-2 relative z-10">
                  <div className="bg-[#FAF8F5] text-zinc-600 p-2 rounded-full border border-[#D5CFBF] shadow-xs">
                    <ArrowDown className="w-4 h-4" />
                  </div>
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Bottom Back to Simulator Callout */}
        <section className="text-center py-6 border-t border-[#E2DDD5]">
          <p className="text-xs font-sans text-zinc-500 mb-3">
            Want to test custom transactions, explore live flow vectors, or adjust balance sheet quantities?
          </p>
          <button
            onClick={onSwitchToSimulator}
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-[#1A1A1A] hover:bg-zinc-800 text-white font-sans text-xs font-medium rounded-xl shadow-xs transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Launch Full Interactive Simulator</span>
          </button>
        </section>
      </main>
    </div>
  );
};
