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
import { QuizView } from './components/QuizView';
import { AiExplainerModal } from './components/AiExplainerModal';

import { scenarios } from './data/scenarios';
import { calculateCurrentState } from './utils/monetaryEngine';
import { EntityId, EntityBalanceSheet, MonetaryStep, JournalEntry } from './types/monetary';

export default function App() {
  const [activeScenarioId, setActiveScenarioId] = useState<string>(scenarios[0].id);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'t_accounts' | 'flow' | 'sandbox' | 'journal' | 'quiz' | 'ai'>('t_accounts');

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

  // Compute calculated balance sheet & macro indicators for active scenario & step
  const calculatedState = useMemo(() => {
    return calculateCurrentState(
      activeScenario.initialState,
      activeScenario.steps,
      activeStepIndex
    );
  }, [activeScenario, activeStepIndex]);

  // Determine active display balance sheets
  const displayBalanceSheets = sandboxState.balanceSheets || calculatedState.currentBalanceSheets;
  const displayMacroStats = calculatedState.macroStats;

  const currentStep = activeScenario.steps[activeStepIndex] || activeScenario.steps[0];

  // Map of entity IDs to short human names
  const entityNamesMap: Record<EntityId, string> = {
    central_bank: 'Central Bank (Fed)',
    bank_a: 'Bank A (Primary Dealer)',
    bank_b: 'Bank B (Commercial)',
    pension_fund: 'Pension Fund',
    individual: 'Private Individual',
    treasury: 'US Treasury (TGA)',
  };

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
    journal: JournalEntry,
    txDesc: string
  ) => {
    setSandboxState((prev) => ({
      balanceSheets: updatedSheets,
      customJournals: [journal, ...prev.customJournals],
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
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950 flex flex-col">
      {/* Top Navbar */}
      <Header
        scenarios={scenarios}
        activeScenarioId={activeScenarioId}
        onSelectScenario={handleSelectScenario}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onReset={handleReset}
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
            />

            {/* Grid of 6 T-Account Balance Sheets */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
                  Live Balance Sheet Ledger Cards (Double-Entry T-Accounts)
                </h3>
                <span className="text-xs text-slate-500 italic">
                  * Green/Red badges highlight deltas for Step {activeStepIndex + 1}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <TAccountCard
                  entity={displayBalanceSheets.central_bank}
                  isFocused={Object.keys(currentStep.entityDeltas.central_bank || {}).length > 0}
                />
                <TAccountCard
                  entity={displayBalanceSheets.treasury}
                  isFocused={Object.keys(currentStep.entityDeltas.treasury || {}).length > 0}
                />
                <TAccountCard
                  entity={displayBalanceSheets.bank_a}
                  isFocused={Object.keys(currentStep.entityDeltas.bank_a || {}).length > 0}
                />
                <TAccountCard
                  entity={displayBalanceSheets.bank_b}
                  isFocused={Object.keys(currentStep.entityDeltas.bank_b || {}).length > 0}
                />
                <TAccountCard
                  entity={displayBalanceSheets.pension_fund}
                  isFocused={Object.keys(currentStep.entityDeltas.pension_fund || {}).length > 0}
                />
                <TAccountCard
                  entity={displayBalanceSheets.individual}
                  isFocused={Object.keys(currentStep.entityDeltas.individual || {}).length > 0}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: INTER-ENTITY FLOW MAP */}
        {activeTab === 'flow' && (
          <div className="space-y-6">
            <ScenarioStepper
              scenario={activeScenario}
              activeStepIndex={activeStepIndex}
              onStepChange={setActiveStepIndex}
              onAskAiForStep={handleAskAiForStep}
            />

            <EntityFlowDiagram
              flows={currentStep.flowingMoney || []}
              currentBalanceSheets={displayBalanceSheets}
            />
          </div>
        )}

        {/* TAB 3: SANDBOX MODE */}
        {activeTab === 'sandbox' && (
          <div className="space-y-6">
            <SandboxBuilder
              initialState={activeScenario.initialState}
              onApplyCustomTransaction={handleApplyCustomSandboxTx}
              onResetSandbox={() => setSandboxState({ balanceSheets: null, customJournals: [] })}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {(Object.values(displayBalanceSheets) as EntityBalanceSheet[]).map((sheet) => (
                <TAccountCard key={sheet.id} entity={sheet} />
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: AUDIT JOURNAL LOG */}
        {activeTab === 'journal' && (
          <JournalLogView entries={allJournals} entityNames={entityNamesMap} />
        )}

        {/* TAB 5: MECHANICS QUIZ */}
        {activeTab === 'quiz' && <QuizView />}

        {/* TAB 6: ASK AI ECONOMIST */}
        {activeTab === 'ai' && (
          <AiExplainerModal
            initialQuestion={aiQuestion}
            contextData={{
              activeScenarioTitle: activeScenario.title,
              activeStepTitle: currentStep.title,
              macroStats: displayMacroStats,
            }}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-4 text-center text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4">
          Monetary System Mechanics Simulator • Double-Entry T-Accounts, Central Bank Reserves & TGA Fiscal Engine
        </div>
      </footer>
    </div>
  );
}
