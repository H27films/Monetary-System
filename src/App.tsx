/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { MacroIndicatorsBar } from './components/MacroIndicatorsBar';
import { TAccountCard } from './components/TAccountCard';
import { ScenarioStepper } from './components/ScenarioStepper';
import { EntityFlowDiagram } from './components/EntityFlowDiagram';
import { SandboxBuilder } from './components/SandboxBuilder';
import { JournalLogView } from './components/JournalLogView';
import { BalanceChartView } from './components/BalanceChartView';
import { AiExplainerModal } from './components/AiExplainerModal';
import { SettingsModal } from './components/SettingsModal';
import { Users } from 'lucide-react';

import { scenarios } from './data/scenarios';
import { createDefaultInitialState } from './data/initialStates';
import { calculateCurrentState, getCleanInitialState } from './utils/monetaryEngine';
import { EntityId, EntityBalanceSheet, MonetaryStep, JournalEntry } from './types/monetary';

export default function App() {
  const [activeScenarioId, setActiveScenarioId] = useState<string>(scenarios[0].id);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'t_accounts' | 'flow' | 'sandbox' | 'journal' | 'chart' | 'ai'>('t_accounts');

  // Optional actors enable state
  const [enabledOptionalActors, setEnabledOptionalActors] = useState<{
    corporation: boolean;
    hedge_fund: boolean;
    foreign_bank: boolean;
  }>({
    corporation: false,
    hedge_fund: false,
    foreign_bank: false,
  });

  // Custom initial balances state override
  const [customInitialSheets, setCustomInitialSheets] = useState<Record<EntityId, EntityBalanceSheet> | null>(null);

  // Settings modal open state
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Global persistent view toggles
  const [showExplanation, setShowExplanation] = useState<boolean>(true);
  const [showStepVectorSummary, setShowStepVectorSummary] = useState<boolean>(false);

  // Custom sandbox overrides
  const [sandboxState, setSandboxState] = useState<{
    balanceSheets: Record<EntityId, EntityBalanceSheet> | null;
    customJournals: JournalEntry[];
  }>({
    balanceSheets: null,
    customJournals: [],
  });

  const [aiQuestion, setAiQuestion] = useState<string>('');

  const activeScenario = useMemo(() => {
    return scenarios.find((s) => s.id === activeScenarioId) || scenarios[0];
  }, [activeScenarioId]);

  // Active entity list including optional actors
  const activeEntityIds = useMemo<EntityId[]>(() => {
    const list: EntityId[] = ['central_bank', 'treasury', 'bank_a', 'bank_b', 'pension_fund', 'individual'];
    if (enabledOptionalActors.corporation || activeScenarioId === 'corporate-bond-issuance') {
      list.push('corporation');
    }
    if (enabledOptionalActors.hedge_fund || activeScenarioId === 'hedge-fund-repo-treasury') {
      list.push('hedge_fund');
    }
    if (enabledOptionalActors.foreign_bank || activeScenarioId === 'eurodollar-correspondent-banking') {
      list.push('foreign_bank');
    }
    return list;
  }, [enabledOptionalActors, activeScenarioId]);

  // Determine effective initial state (custom vs default)
  const effectiveInitialState = useMemo(() => {
    return customInitialSheets || activeScenario.initialState;
  }, [customInitialSheets, activeScenario]);

  // Compute calculated balance sheet & macro indicators for active scenario & step
  const calculatedState = useMemo(() => {
    return calculateCurrentState(
      effectiveInitialState,
      activeScenario.steps,
      activeStepIndex
    );
  }, [effectiveInitialState, activeScenario, activeStepIndex]);

  // Clean starting state for fresh Sandbox mode
  const cleanInitialSheets = useMemo(() => {
    return getCleanInitialState(effectiveInitialState);
  }, [effectiveInitialState]);

  // Determine active display balance sheets
  const displayBalanceSheets = sandboxState.balanceSheets || calculatedState.currentBalanceSheets;
  const sandboxDisplayBalanceSheets = sandboxState.balanceSheets || cleanInitialSheets;
  const displayMacroStats = calculatedState.macroStats;

  const currentStep = activeScenario.steps[activeStepIndex] || activeScenario.steps[0];

  const handleSelectScenario = (id: string) => {
    setActiveScenarioId(id);
    setActiveStepIndex(0);
    setSandboxState({ balanceSheets: null, customJournals: [] });
  };

  const handleReset = () => {
    setActiveStepIndex(0);
    setSandboxState({ balanceSheets: null, customJournals: [] });
  };

  const handleAskAiForStep = (step: MonetaryStep) => {
    setAiQuestion(`Explain step "${step.title}": ${step.description}. What happens to reserves and M1 broad money?`);
    setActiveTab('ai');
  };

  const handleApplyCustomSandboxTx = (
    updatedSheets: Record<EntityId, EntityBalanceSheet>,
    journal: JournalEntry
  ) => {
    setSandboxState((prev) => ({
      balanceSheets: updatedSheets,
      customJournals: [journal, ...prev.customJournals],
    }));
  };

  const handleToggleOptionalActor = (actor: 'corporation' | 'hedge_fund' | 'foreign_bank') => {
    setEnabledOptionalActors((prev) => ({
      ...prev,
      [actor]: !prev[actor],
    }));
  };

  // List of all journals for journal tab
  const allJournals = useMemo(() => {
    const stepJournals = activeScenario.steps
      .slice(0, activeStepIndex + 1)
      .flatMap((s) => s.journalEntries || []);

    return [...sandboxState.customJournals, ...stepJournals];
  }, [activeScenario, activeStepIndex, sandboxState.customJournals]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1A1A1A] font-sans flex flex-col selection:bg-[#1A1A1A] selection:text-white">
      {/* Top Navbar */}
      <Header
        scenarios={scenarios}
        activeScenarioId={activeScenarioId}
        onSelectScenario={handleSelectScenario}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onReset={handleReset}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isCustomInitial={customInitialSheets !== null}
      />

      {/* Top Macro indicators aggregate bar */}
      <MacroIndicatorsBar stats={displayMacroStats} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* TAB 1: T-ACCOUNTS & STEPPER */}
        {activeTab === 't_accounts' && (
          <div className="space-y-6">
            {/* Scenario Narrative & Control Stepper */}
            <ScenarioStepper
              scenario={activeScenario}
              activeStepIndex={activeStepIndex}
              onStepChange={setActiveStepIndex}
              onAskAiForStep={handleAskAiForStep}
              showExplanation={showExplanation}
              onToggleExplanation={setShowExplanation}
              showStepVectorSummary={showStepVectorSummary}
              onToggleStepVectorSummary={setShowStepVectorSummary}
              currentBalanceSheets={displayBalanceSheets}
            />

            {/* Grid of T-Account Balance Sheets */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <h3 className="text-xs font-sans font-semibold text-zinc-600 uppercase tracking-wider">
                  Live Balance Sheet Ledger Cards ({activeEntityIds.length} Active System Actors)
                </h3>
                <span className="text-xs font-serif text-zinc-500 italic">
                  * Highlighting deltas for Step {activeStepIndex + 1}: Assets | Liabilities | Equity
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeEntityIds.map((id) => (
                  <TAccountCard
                    key={id}
                    entity={displayBalanceSheets[id]}
                    isFocused={Object.keys(currentStep.entityDeltas[id] || {}).length > 0}
                  />
                ))}
              </div>

              {/* Optional Participant Actors Control Bar */}
              <div className="bg-[#FAF8F5] border border-[#E2DDD5] rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-sans mt-6 shadow-xs">
                <div className="flex items-center space-x-2 text-zinc-700 font-medium">
                  <Users className="w-4 h-4 text-zinc-600" />
                  <span>Optional System Participant Actors:</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleToggleOptionalActor('corporation')}
                    className={`px-3 py-1.5 rounded-lg border font-medium transition cursor-pointer flex items-center space-x-1.5 ${
                      enabledOptionalActors.corporation || activeScenarioId === 'corporate-bond-issuance'
                        ? 'bg-teal-50 text-teal-900 border-teal-300 font-semibold'
                        : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-100'
                    }`}
                  >
                    <span>{enabledOptionalActors.corporation || activeScenarioId === 'corporate-bond-issuance' ? '✓ Active' : '+ Add'} Private Corporation</span>
                  </button>

                  <button
                    onClick={() => handleToggleOptionalActor('hedge_fund')}
                    className={`px-3 py-1.5 rounded-lg border font-medium transition cursor-pointer flex items-center space-x-1.5 ${
                      enabledOptionalActors.hedge_fund || activeScenarioId === 'hedge-fund-repo-treasury'
                        ? 'bg-orange-50 text-orange-900 border-orange-300 font-semibold'
                        : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-100'
                    }`}
                  >
                    <span>{enabledOptionalActors.hedge_fund || activeScenarioId === 'hedge-fund-repo-treasury' ? '✓ Active' : '+ Add'} Global Macro Hedge Fund</span>
                  </button>

                  <button
                    onClick={() => handleToggleOptionalActor('foreign_bank')}
                    className={`px-3 py-1.5 rounded-lg border font-medium transition cursor-pointer flex items-center space-x-1.5 ${
                      enabledOptionalActors.foreign_bank || activeScenarioId === 'eurodollar-correspondent-banking'
                        ? 'bg-indigo-50 text-indigo-900 border-indigo-300 font-semibold'
                        : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-100'
                    }`}
                  >
                    <span>{enabledOptionalActors.foreign_bank || activeScenarioId === 'eurodollar-correspondent-banking' ? '✓ Active' : '+ Add'} Foreign Correspondent Bank</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: VISUAL BALANCE SHEET CHARTS */}
        {activeTab === 'chart' && (
          <div className="space-y-6">
            <ScenarioStepper
              scenario={activeScenario}
              activeStepIndex={activeStepIndex}
              onStepChange={setActiveStepIndex}
              onAskAiForStep={handleAskAiForStep}
              showExplanation={showExplanation}
              onToggleExplanation={setShowExplanation}
              showStepVectorSummary={showStepVectorSummary}
              onToggleStepVectorSummary={setShowStepVectorSummary}
              currentBalanceSheets={displayBalanceSheets}
            />

            <BalanceChartView balanceSheets={displayBalanceSheets} />
          </div>
        )}

        {/* TAB 3: INTER-ENTITY FLOW MAP */}
        {activeTab === 'flow' && (
          <div className="space-y-6">
            <ScenarioStepper
              scenario={activeScenario}
              activeStepIndex={activeStepIndex}
              onStepChange={setActiveStepIndex}
              onAskAiForStep={handleAskAiForStep}
              showExplanation={showExplanation}
              onToggleExplanation={setShowExplanation}
              showStepVectorSummary={showStepVectorSummary}
              onToggleStepVectorSummary={setShowStepVectorSummary}
              currentBalanceSheets={displayBalanceSheets}
            />

            <EntityFlowDiagram
              flows={currentStep.flowingMoney || []}
              currentBalanceSheets={displayBalanceSheets}
            />
          </div>
        )}

        {/* TAB 4: SANDBOX MODE */}
        {activeTab === 'sandbox' && (
          <div className="space-y-6">
            <SandboxBuilder
              currentSheets={sandboxDisplayBalanceSheets}
              onApplyCustomTx={handleApplyCustomSandboxTx}
              onResetSandbox={() => setSandboxState({ balanceSheets: null, customJournals: [] })}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(Object.values(sandboxDisplayBalanceSheets) as EntityBalanceSheet[]).map((sheet) => (
                <TAccountCard key={sheet.id} entity={sheet} />
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: AUDIT JOURNAL LOG */}
        {activeTab === 'journal' && (
          <JournalLogView journals={allJournals} entities={displayBalanceSheets} />
        )}

        {/* TAB 6: ASK AI ECONOMIST */}
        {activeTab === 'ai' && (
          <AiExplainerModal
            initialQuery={aiQuestion}
            currentStep={currentStep}
            currentBalanceSheets={displayBalanceSheets}
          />
        )}

      </main>

      {/* Settings Modal for Starting Balances */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        initialSheets={effectiveInitialState}
        onSaveInitialSheets={(updated) => {
          setCustomInitialSheets(updated);
          setActiveStepIndex(0);
          setSandboxState({ balanceSheets: null, customJournals: [] });
        }}
        onResetToDefault={() => {
          setCustomInitialSheets(null);
          setActiveStepIndex(0);
          setSandboxState({ balanceSheets: null, customJournals: [] });
        }}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-[#E2DDD5] py-4 text-center text-xs font-sans text-zinc-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 font-serif">
          Monetary System Mechanics Simulator • Double-Entry T-Accounts, Central Bank Reserves & TGA Fiscal Engine
        </div>
      </footer>
    </div>
  );
}
