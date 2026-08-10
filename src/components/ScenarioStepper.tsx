import React, { useEffect, useState } from 'react';
import { Scenario, MonetaryStep } from '../types/monetary';
import { Play, Pause, ChevronLeft, ChevronRight, BookOpen, Lightbulb, TrendingUp, CheckCircle2 } from 'lucide-react';

interface ScenarioStepperProps {
  scenario: Scenario;
  activeStepIndex: number;
  onStepChange: (index: number) => void;
  onAskAiForStep: (step: MonetaryStep) => void;
}

export const ScenarioStepper: React.FC<ScenarioStepperProps> = ({
  scenario,
  activeStepIndex,
  onStepChange,
  onAskAiForStep,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const currentStep = scenario.steps[activeStepIndex] || scenario.steps[0];

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
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl text-slate-100 space-y-5">
      
      {/* Header & Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {scenario.category}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Difficulty: <strong className="text-slate-200">{scenario.difficulty}</strong>
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-white mt-1 tracking-tight">
            {scenario.title}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">{scenario.realWorldContext}</p>
        </div>

        {/* Step Controls */}
        <div className="flex items-center space-x-2 self-start md:self-auto">
          <button
            onClick={() => onStepChange(Math.max(0, activeStepIndex - 1))}
            disabled={activeStepIndex === 0}
            className="p-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-200 rounded-xl border border-slate-700 transition cursor-pointer"
            title="Previous Step"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition shadow-md cursor-pointer ${
              isPlaying
                ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
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
            className="p-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-200 rounded-xl border border-slate-700 transition cursor-pointer"
            title="Next Step"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Step Progress Timeline Bar */}
      <div>
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span className="font-semibold text-emerald-400">
            Step {activeStepIndex + 1} of {scenario.steps.length}
          </span>
          <span className="truncate max-w-[200px] text-right font-medium text-slate-300">
            {currentStep.title}
          </span>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-2">
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
                className={`flex flex-col p-2.5 rounded-xl text-left border transition duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500/15 border-emerald-500/60 ring-2 ring-emerald-500/30'
                    : isPassed
                    ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-600'
                    : 'bg-slate-900/60 border-slate-800/80 text-slate-500 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span>Step {step.stepNumber}</span>
                  {isPassed && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                </div>
                <span className="text-[11px] font-medium truncate mt-0.5 opacity-90">
                  {step.subtitle}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Step Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-2">
        
        {/* Main Step Narrative */}
        <div className="lg:col-span-2 bg-slate-950/80 rounded-xl p-4 border border-slate-800 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-base font-bold text-emerald-300 flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>{currentStep.title}</span>
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {currentStep.description}
              </p>
            </div>
          </div>

          {/* Double Entry Accounting Mechanics */}
          <div className="bg-slate-900/90 rounded-lg p-3 border border-slate-800/80 text-xs text-slate-300 space-y-1">
            <div className="font-semibold text-blue-400 flex items-center space-x-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-blue-400" />
              <span>Double-Entry T-Account Mechanics:</span>
            </div>
            <p className="leading-relaxed text-slate-300 font-mono text-[11px]">
              {currentStep.accountingExplanation}
            </p>
          </div>

          {/* Ask AI button for this step */}
          <div className="pt-1 flex justify-end">
            <button
              onClick={() => onAskAiForStep(currentStep)}
              className="text-xs font-medium text-emerald-400 hover:text-emerald-300 flex items-center space-x-1.5 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 hover:bg-emerald-500/20 transition cursor-pointer"
            >
              <span>Explain this step in detail with AI</span>
            </button>
          </div>
        </div>

        {/* Macro Economic Impact Panel */}
        <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 space-y-3 flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-amber-400 flex items-center space-x-1.5 uppercase tracking-wider mb-2">
              <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
              <span>Step Macro Impact</span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between items-center p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400">M0 Base Money:</span>
                <span className="font-bold text-slate-200">{currentStep.macroImpact.m0Change}</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400">M1 Broad Money:</span>
                <span className="font-bold text-amber-300">{currentStep.macroImpact.m1Change}</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Treasury TGA:</span>
                <span className="font-bold text-rose-300">{currentStep.macroImpact.tgaChange}</span>
              </div>
            </div>
          </div>

          {/* Key Takeaway */}
          <div className="p-2.5 bg-emerald-950/40 border border-emerald-800/50 rounded-lg text-xs text-emerald-200 space-y-1">
            <div className="font-bold text-emerald-400 text-[11px] uppercase tracking-wider">
              💡 Key Takeaway:
            </div>
            <p className="text-[11px] leading-relaxed text-emerald-200/90">
              {currentStep.macroImpact.keyTakeaway}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
