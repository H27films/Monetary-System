import React, { useState, useEffect } from 'react';
import { Scenario, MonetaryStep, EntityBalanceSheet, EntityId } from '../types/monetary';
import { Play, Pause, ChevronLeft, ChevronRight, CheckCircle2, BookOpen, Lightbulb, TrendingUp, Eye, EyeOff, Layers, Sparkles } from 'lucide-react';
import { ParticipantAdjustmentsSummary } from './ParticipantAdjustmentsSummary';

interface ScenarioStepperProps {
  scenario: Scenario;
  activeStepIndex: number;
  onStepChange: (stepIndex: number) => void;
  onAskAiForStep: (step: MonetaryStep) => void;
  showExplanation?: boolean;
  onToggleExplanation?: (show: boolean) => void;
  showStepVectorSummary?: boolean;
  onToggleStepVectorSummary?: (show: boolean) => void;
  currentBalanceSheets?: Record<EntityId, EntityBalanceSheet>;
}

export const ScenarioStepper: React.FC<ScenarioStepperProps> = ({
  scenario,
  activeStepIndex,
  onStepChange,
  onAskAiForStep,
  showExplanation: externalShowExplanation,
  onToggleExplanation,
  showStepVectorSummary: externalShowStepVectorSummary,
  onToggleStepVectorSummary,
  currentBalanceSheets,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [localShowExplanation, setLocalShowExplanation] = useState<boolean>(false);
  const [localShowStepVectorSummary, setLocalShowStepVectorSummary] = useState<boolean>(false);

  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const [showFloatingBar, setShowFloatingBar] = useState<boolean>(false);

  const isExpShown = externalShowExplanation !== undefined ? externalShowExplanation : localShowExplanation;
  const toggleExp = (val: boolean) => {
    if (onToggleExplanation) onToggleExplanation(val);
    else setLocalShowExplanation(val);
  };

  const isVectorShown = externalShowStepVectorSummary !== undefined ? externalShowStepVectorSummary : localShowStepVectorSummary;
  const toggleVector = (val: boolean) => {
    if (onToggleStepVectorSummary) onToggleStepVectorSummary(val);
    else setLocalShowStepVectorSummary(val);
  };

  const [headerOffset, setHeaderOffset] = useState<number>(41);

  const currentStep = scenario.steps[activeStepIndex] || scenario.steps[0];

  // Detect when main big box has scrolled past off screen and calculate exact header bottom edge
  useEffect(() => {
    const handleScroll = () => {
      const headerElem = document.getElementById('sticky-header-tabs');
      // getBoundingClientRect().bottom gives the exact viewport Y bottom edge of the sticky header tabs
      const headerBottom = headerElem ? Math.max(0, headerElem.getBoundingClientRect().bottom) : 41;
      setHeaderOffset(headerBottom);

      if (!wrapperRef.current) return;
      const rect = wrapperRef.current.getBoundingClientRect();
      // Floating bar appears slightly earlier, when the main big box is within 15px of scrolling past top tabs
      setShowFloatingBar(rect.bottom <= headerBottom + 15);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // Auto-play timer
  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        if (activeStepIndex < scenario.steps.length - 1) {
          onStepChange(activeStepIndex + 1);
        } else {
          setIsPlaying(false);
        }
      }, 5000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, activeStepIndex, scenario.steps.length, onStepChange]);

  return (
    <div ref={wrapperRef} className="relative">
      {/* FLOATING COMPACT STICKY BAR - ONLY APPEARS WHEN MAIN BIG BOX HAS SCROLLED COMPLETELY OFF-SCREEN */}
      {showFloatingBar && (
        <div
          className="fixed left-0 right-0 z-40 bg-[#FAF8F5] border-b border-[#E2DDD5] shadow-md transition-all duration-150 animate-in fade-in slide-in-from-top-1"
          style={{ top: `${headerOffset}px` }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-sans">
              {/* Step Indicator & Single-Line Summary */}
              <div className="flex items-center space-x-3 min-w-0">
                <span className="shrink-0 font-sans font-bold px-2.5 py-1 rounded-md bg-[#1A1A1A] text-white text-xs tracking-wider uppercase">
                  STEP {activeStepIndex + 1}
                </span>
                <div className="min-w-0">
                  <div className="font-serif font-medium text-base sm:text-lg text-[#1A1A1A] truncate">
                    {currentStep.title.replace(/^Step\s*\d+\s*[:\—\-]\s*/i, '')}
                  </div>
                </div>
              </div>

              {/* Quick Step Navigation & Controls */}
              <div className="flex items-center space-x-1.5 shrink-0 self-end sm:self-center">
                <button
                  onClick={() => onStepChange(Math.max(0, activeStepIndex - 1))}
                  disabled={activeStepIndex === 0}
                  className="p-1.5 bg-zinc-100 hover:bg-zinc-200 disabled:opacity-30 text-[#1A1A1A] rounded-lg border border-[#E2DDD5] transition cursor-pointer"
                  title="Previous Step"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Quick Step Pills */}
                <div className="hidden lg:flex items-center space-x-1">
                  {scenario.steps.map((st, idx) => (
                    <button
                      key={st.stepNumber}
                      onClick={() => {
                        setIsPlaying(false);
                        onStepChange(idx);
                      }}
                      className={`px-2 py-1 rounded text-[11px] font-sans font-medium transition cursor-pointer border ${
                        idx === activeStepIndex
                          ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                          : idx < activeStepIndex
                          ? 'bg-zinc-100 text-zinc-700 border-zinc-200 hover:bg-zinc-200'
                          : 'bg-white text-zinc-400 border-zinc-200 hover:bg-zinc-50'
                      }`}
                    >
                      S{st.stepNumber}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-sans font-medium transition cursor-pointer ${
                    isPlaying
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-[#1A1A1A] text-white hover:bg-zinc-800'
                  }`}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                  <span className="hidden sm:inline">{isPlaying ? 'Pause' : 'Auto'}</span>
                </button>

                <button
                  onClick={() => onStepChange(Math.min(scenario.steps.length - 1, activeStepIndex + 1))}
                  disabled={activeStepIndex === scenario.steps.length - 1}
                  className="p-1.5 bg-zinc-100 hover:bg-zinc-200 disabled:opacity-30 text-[#1A1A1A] rounded-lg border border-[#E2DDD5] transition cursor-pointer"
                  title="Next Step"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onAskAiForStep(currentStep)}
                  className="p-1.5 text-[#D93829] bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition cursor-pointer"
                  title="Ask AI about this step"
                >
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MAIN BIG BOX - ALWAYS RENDERED FULLY IN DOCUMENT FLOW */}
      <div className="bg-white border border-[#E2DDD5] rounded-xl shadow-md text-[#1A1A1A] p-5 space-y-5">
        {/* Header & Controls Bar */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-[#E2DDD5]">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-sans font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#1A1A1A] text-white">
                  {scenario.category}
                </span>
              </div>
              <h2 className="text-xl font-serif font-normal text-[#1A1A1A] mt-1 tracking-tight">
                {scenario.title}
              </h2>
              <p className="text-xs font-sans text-zinc-600 mt-0.5">{scenario.realWorldContext}</p>
            </div>

            {/* Step Controls */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                onClick={() => onStepChange(Math.max(0, activeStepIndex - 1))}
                disabled={activeStepIndex === 0}
                className="p-2 bg-zinc-100 hover:bg-zinc-200 disabled:opacity-30 text-[#1A1A1A] rounded-lg border border-[#E2DDD5] transition cursor-pointer"
                title="Previous Step"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-sans font-medium transition cursor-pointer ${
                  isPlaying
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-[#1A1A1A] text-white hover:bg-zinc-800'
                }`}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Auto Play</span>
                  </>
                )}
              </button>

              <button
                onClick={() => onStepChange(Math.min(scenario.steps.length - 1, activeStepIndex + 1))}
                disabled={activeStepIndex === scenario.steps.length - 1}
                className="p-2 bg-zinc-100 hover:bg-zinc-200 disabled:opacity-30 text-[#1A1A1A] rounded-lg border border-[#E2DDD5] transition cursor-pointer"
                title="Next Step"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Toggle Explanation Panel */}
              <button
                onClick={() => toggleExp(!isExpShown)}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-sans font-medium transition cursor-pointer border ${
                  isExpShown
                    ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border-[#E2DDD5]'
                    : 'bg-[#F4F0EA] hover:bg-[#EAE4DC] text-[#1A1A1A] border-[#D8D1C5] shadow-xs'
                }`}
                title={isExpShown ? 'Hide Explanation Area' : 'Show Explanation Area'}
              >
                {isExpShown ? <EyeOff className="w-3.5 h-3.5 text-zinc-600" /> : <Eye className="w-3.5 h-3.5 text-zinc-700" />}
                <span>{isExpShown ? 'Hide Details' : 'Show Details'}</span>
              </button>

              {/* Toggle Step Vector Summary */}
              <button
                onClick={() => toggleVector(!isVectorShown)}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-sans font-medium transition cursor-pointer border ${
                  isVectorShown
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-white hover:bg-zinc-100 text-zinc-700 border-[#E2DDD5]'
                }`}
                title={isVectorShown ? 'Hide Step Vector Summary' : 'Show Step Vector Summary'}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{isVectorShown ? 'Hide Vector Summary' : '+ Vector Summary'}</span>
              </button>
            </div>
          </div>

          {/* Step Progress Timeline Bar */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs font-sans text-zinc-600 mb-2.5">
              <span className="font-semibold text-[#1A1A1A] shrink-0">
                Step {activeStepIndex + 1} of {scenario.steps.length}
              </span>
              <span className="text-left sm:text-right font-serif text-[#1A1A1A] text-xs sm:text-sm font-medium leading-snug">
                {currentStep.title}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {scenario.steps.map((step, idx) => {
                const isActive = idx === activeStepIndex;
                const isPassed = idx < activeStepIndex;

                return (
                  <button
                    key={step.stepNumber}
                    onClick={() => {
                      setIsPlaying(false);
                      onStepChange(idx);
                    }}
                    className={`flex flex-col justify-between p-3.5 min-h-[80px] rounded-xl text-left border transition duration-150 cursor-pointer ${
                      isActive
                        ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-xs'
                        : isPassed
                        ? 'bg-zinc-100 text-zinc-800 border-zinc-200 hover:border-zinc-400'
                        : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-sans font-semibold mb-1">
                      <span>Step {step.stepNumber}</span>
                      {isPassed && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-1" />}
                    </div>
                    <span className="text-xs font-sans font-medium leading-snug break-words opacity-90">
                      {step.subtitle}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step Explanation & Macro Impact Split Panel */}
          {isExpShown ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-1">
              
              {/* Main Step Narrative */}
              <div className="lg:col-span-2 bg-[#FAF8F5] rounded-xl p-4.5 border border-[#E2DDD5] space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-serif font-medium text-[#1A1A1A] flex items-center space-x-2">
                      <BookOpen className="w-4 h-4 text-[#1A1A1A]" />
                      <span>{currentStep.title}</span>
                    </h3>
                    <p className="text-xs text-zinc-700 mt-1.5 leading-relaxed font-sans font-normal">
                      {currentStep.description}
                    </p>
                  </div>
                </div>

                {/* Double Entry Accounting Mechanics */}
                <div className="bg-white rounded-lg p-3.5 border border-[#E2DDD5] text-xs text-zinc-800 space-y-1">
                  <div className="font-sans font-semibold text-xs text-[#1A1A1A] flex items-center space-x-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-[#D93829]" />
                    <span>Double-Entry T-Account Mechanics:</span>
                  </div>
                  <p className="leading-relaxed text-zinc-700 font-sans text-xs">
                    {currentStep.accountingExplanation}
                  </p>
                </div>

                <div className="pt-1 flex justify-end">
                  <button
                    onClick={() => onAskAiForStep(currentStep)}
                    className="text-xs font-sans font-medium text-[#1A1A1A] flex items-center space-x-1.5 bg-white hover:bg-zinc-100 px-3 py-1.5 rounded-lg border border-[#E2DDD5] shadow-xs transition cursor-pointer"
                  >
                    <span className="text-[#D93829] font-bold">✦</span>
                    <span>Explain this step in detail with AI</span>
                  </button>
                </div>
              </div>

              {/* Macro Economic Impact Panel */}
              <div className="bg-[#FAF8F5] rounded-xl p-4.5 border border-[#E2DDD5] space-y-3 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-sans font-semibold text-zinc-600 flex items-center space-x-1.5 uppercase tracking-wider mb-2.5">
                    <TrendingUp className="w-3.5 h-3.5 text-[#1A1A1A]" />
                    <span>Step Macro Impact</span>
                  </div>

                  <div className="space-y-2 text-xs font-sans">
                    <div className="flex justify-between items-center p-2 rounded-lg bg-white border border-[#E2DDD5]">
                      <span className="text-zinc-600 font-medium">M0 Base Money:</span>
                      <span className="font-mono font-semibold text-[#1A1A1A]">{currentStep.macroImpact.m0Change}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-lg bg-white border border-[#E2DDD5]">
                      <span className="text-zinc-600 font-medium">M1 Broad Money:</span>
                      <span className="font-mono font-semibold text-[#1A1A1A]">{currentStep.macroImpact.m1Change}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-lg bg-white border border-[#E2DDD5]">
                      <span className="text-zinc-600 font-medium">Treasury TGA:</span>
                      <span className="font-mono font-semibold text-[#D93829]">{currentStep.macroImpact.tgaChange}</span>
                    </div>
                  </div>
                </div>

                {/* Key Takeaway */}
                <div className="p-3 bg-[#1A1A1A] text-white rounded-lg text-xs space-y-1">
                  <div className="font-sans font-semibold text-[10px] uppercase text-amber-300 tracking-wider">
                    Key Takeaway:
                  </div>
                  <p className="text-[11px] font-sans leading-relaxed text-zinc-200">
                    {currentStep.macroImpact.keyTakeaway}
                  </p>
                </div>
              </div>

            </div>
          ) : null}

          {/* Embedded Vector Summary when active */}
          {isVectorShown && currentBalanceSheets && (
            <div className="pt-2 border-t border-[#E2DDD5]">
              <ParticipantAdjustmentsSummary
                currentBalanceSheets={currentBalanceSheets}
                onClose={() => toggleVector(false)}
              />
            </div>
          )}
      </div>
    </div>
  );
};
