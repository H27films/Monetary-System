import React, { useState, useEffect } from 'react';
import { Settings, X, RotateCcw, Link2, CheckCircle2, AlertCircle } from 'lucide-react';
import { EntityId, EntityBalanceSheet, AccountItem } from '../types/monetary';
import { formatCurrency } from '../utils/monetaryEngine';
import { createDefaultInitialState } from '../data/initialStates';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSheets: Record<EntityId, EntityBalanceSheet>;
  onSaveInitialSheets: (updated: Record<EntityId, EntityBalanceSheet>) => void;
  onResetToDefault: () => void;
  enabledOptionalActors?: { corporation: boolean; hedge_fund: boolean; foreign_bank: boolean };
  onToggleOptionalActor?: (actor: 'corporation' | 'hedge_fund' | 'foreign_bank') => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  initialSheets,
  onSaveInitialSheets,
  onResetToDefault,
  enabledOptionalActors,
  onToggleOptionalActor,
}) => {
  const [draftSheets, setDraftSheets] = useState<Record<EntityId, EntityBalanceSheet>>(() =>
    JSON.parse(JSON.stringify(initialSheets || {}))
  );

  const [activeEntityId, setActiveEntityId] = useState<EntityId>('central_bank');

  useEffect(() => {
    if (isOpen && initialSheets) {
      setDraftSheets(JSON.parse(JSON.stringify(initialSheets)));
    }
  }, [isOpen, initialSheets]);

  if (!isOpen) return null;

  // Sync double-entry linkages across entities
  const syncLinkedAccountsAndRecalculateEquity = (
    sheets: Record<EntityId, EntityBalanceSheet>,
    changedEntity: EntityId,
    changedCategory: 'assets' | 'liabilities' | 'equity',
    itemId: string,
    newValue: number
  ) => {
    const next: Record<EntityId, EntityBalanceSheet> = JSON.parse(JSON.stringify(sheets));

    // Update target item
    const targetEntity = next[changedEntity];
    if (targetEntity) {
      const list = targetEntity[changedCategory];
      const item = list.find((i) => i.id === itemId);
      if (item) item.amount = newValue;
    }

    // Helper to set item amount safely
    const setAmount = (eId: EntityId, cat: 'assets' | 'liabilities' | 'equity', aId: string, val: number) => {
      const e = next[eId];
      if (!e) return;
      const match = e[cat].find((i) => i.id === aId);
      if (match) match.amount = val;
    };

    // Helper to get item amount
    const getAmount = (eId: EntityId, cat: 'assets' | 'liabilities' | 'equity', aId: string): number => {
      return next[eId]?.[cat].find((i) => i.id === aId)?.amount || 0;
    };

    // Linking rules
    if (itemId === 'ba_dep_ind' || itemId === 'ind_dep_bank_a') {
      setAmount('bank_a', 'liabilities', 'ba_dep_ind', newValue);
      setAmount('individual', 'assets', 'ind_dep_bank_a', newValue);
    } else if (itemId === 'bb_dep_ind' || itemId === 'ind_dep_bank_b') {
      setAmount('bank_b', 'liabilities', 'bb_dep_ind', newValue);
      setAmount('individual', 'assets', 'ind_dep_bank_b', newValue);
    } else if (itemId === 'ba_dep_pension' || itemId === 'pf_bank_dep') {
      setAmount('bank_a', 'liabilities', 'ba_dep_pension', newValue);
      setAmount('pension_fund', 'assets', 'pf_bank_dep', newValue);
    } else if (itemId === 'ba_reserves' || itemId === 'cb_reserves_bank_a') {
      setAmount('bank_a', 'assets', 'ba_reserves', newValue);
      setAmount('central_bank', 'liabilities', 'cb_reserves_bank_a', newValue);
    } else if (itemId === 'bb_reserves' || itemId === 'cb_reserves_bank_b') {
      setAmount('bank_b', 'assets', 'bb_reserves', newValue);
      setAmount('central_bank', 'liabilities', 'cb_reserves_bank_b', newValue);
    } else if (itemId === 'tr_tga' || itemId === 'cb_tga') {
      setAmount('treasury', 'assets', 'tr_tga', newValue);
      setAmount('central_bank', 'liabilities', 'cb_tga', newValue);
    } else if (itemId === 'ind_physical_cash' || itemId === 'cb_currency_notes') {
      setAmount('individual', 'assets', 'ind_physical_cash', newValue);
      setAmount('central_bank', 'liabilities', 'cb_currency_notes', newValue);
    } else if (itemId === 'ba_loans' || itemId === 'bb_loans' || itemId === 'ind_bank_loans') {
      if (itemId === 'ind_bank_loans') {
        // Individual loan liability updated
        const currentA = getAmount('bank_a', 'assets', 'ba_loans');
        const currentB = getAmount('bank_b', 'assets', 'bb_loans');
        const total = currentA + currentB;
        if (total > 0) {
          const ratioA = currentA / total;
          setAmount('bank_a', 'assets', 'ba_loans', Math.round(newValue * ratioA));
          setAmount('bank_b', 'assets', 'bb_loans', Math.round(newValue * (1 - ratioA)));
        } else {
          setAmount('bank_a', 'assets', 'ba_loans', newValue);
        }
      } else {
        // Bank A or Bank B loans updated -> sync total to individual loan liability
        const sumLoans = getAmount('bank_a', 'assets', 'ba_loans') + getAmount('bank_b', 'assets', 'bb_loans');
        setAmount('individual', 'liabilities', 'ind_bank_loans', sumLoans);
      }
    }

    // Auto-update Total Treasury Debt Issued = sum of all Treasury holdings
    const totalTreasuryHoldings =
      getAmount('central_bank', 'assets', 'cb_us_treasuries') +
      getAmount('bank_a', 'assets', 'ba_treasuries') +
      getAmount('bank_b', 'assets', 'bb_treasuries') +
      getAmount('pension_fund', 'assets', 'pf_treasuries') +
      getAmount('individual', 'assets', 'ind_treasuries');

    setAmount('treasury', 'liabilities', 'tr_debt_issued', totalTreasuryHoldings);

    // Auto-balance Equity for each actor so Assets == Liabilities + Equity
    Object.values(next).forEach((sheet) => {
      const sumAssets = sheet.assets.reduce((s, i) => s + i.amount, 0);
      const sumLiab = sheet.liabilities.reduce((s, i) => s + i.amount, 0);
      const netWorth = sumAssets - sumLiab;

      if (sheet.id === 'central_bank') {
        // Fed assets usually equal liabilities
        return;
      }

      if (sheet.equity.length > 0) {
        sheet.equity[0].amount = netWorth;
      } else if (netWorth !== 0) {
        sheet.equity.push({
          id: `${sheet.id}_equity_auto`,
          name: 'Net Equity Capital',
          amount: netWorth,
          category: 'equity',
        });
      }
    });

    return next;
  };

  const handleChangeAmount = (
    entityId: EntityId,
    category: 'assets' | 'liabilities' | 'equity',
    itemId: string,
    rawVal: string
  ) => {
    const val = Math.max(0, parseInt(rawVal, 10) || 0);
    const updated = syncLinkedAccountsAndRecalculateEquity(draftSheets, entityId, category, itemId, val);
    setDraftSheets(updated);
  };

  const handleSave = () => {
    onSaveInitialSheets(draftSheets);
    onClose();
  };

  const handleReset = () => {
    const defaults = createDefaultInitialState();
    setDraftSheets(defaults);
    onResetToDefault();
  };

  const activeSheet = draftSheets[activeEntityId] || draftSheets['central_bank'] || (Object.values(draftSheets)[0] as EntityBalanceSheet | undefined);

  if (!activeSheet) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white border border-[#E2DDD5] rounded-xl shadow-2xl w-full max-w-4xl my-8 overflow-hidden flex flex-col max-h-[90vh] text-[#1A1A1A]">
        
        {/* Modal Header */}
        <div className="p-4 bg-[#FAF8F5] border-b border-[#E2DDD5] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-[#1A1A1A] text-white rounded-lg shadow-xs">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-medium text-[#1A1A1A]">
                Starting Balances & Interlinked Accounts
              </h2>
              <p className="text-xs font-sans text-zinc-500">
                Modify starting balances. Changes automatically link corresponding assets and liabilities across balance sheets.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-800 rounded-lg hover:bg-zinc-200/60 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Entity Selector Tabs */}
        <div className="flex overflow-x-auto border-b border-[#E2DDD5] bg-zinc-50 px-4 pt-2 gap-1 text-xs font-sans">
          {(Object.values(draftSheets) as EntityBalanceSheet[]).map((sheet) => {
            const isActive = sheet.id === activeEntityId;
            return (
              <button
                key={sheet.id}
                onClick={() => setActiveEntityId(sheet.id as EntityId)}
                className={`px-3 py-2 font-medium rounded-t-lg transition border-t border-x cursor-pointer whitespace-nowrap flex items-center space-x-1.5 ${
                  isActive
                    ? 'bg-white text-[#1A1A1A] border-[#E2DDD5] border-b-white -mb-px font-semibold shadow-xs'
                    : 'bg-transparent text-zinc-600 border-transparent hover:text-zinc-900 hover:bg-zinc-100'
                }`}
              >
                <span>{sheet.shortName}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body: Active Entity Form */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          <div className="flex items-center justify-between bg-[#FAF8F5] p-3 rounded-lg border border-[#E2DDD5]">
            <div>
              <h3 className="font-serif text-base font-medium text-[#1A1A1A]">{activeSheet.name}</h3>
              <p className="text-xs font-sans text-zinc-500">{activeSheet.description}</p>
            </div>
            <div className="flex items-center space-x-1.5 text-xs font-sans text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              <Link2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Auto-linked & Double-Entry Balanced</span>
            </div>
          </div>

          {/* Grid of Assets, Liabilities, Equity for Active Entity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* ASSETS COLUMN */}
            <div className="space-y-3 bg-[#FAF8F5]/50 p-4 rounded-xl border border-[#E2DDD5]">
              <div className="flex items-center justify-between pb-2 border-b border-[#E2DDD5]">
                <span className="text-xs font-sans font-semibold uppercase text-emerald-900 tracking-wider">
                  Assets (Owned)
                </span>
                <span className="text-xs font-mono font-bold text-emerald-900">
                  {formatCurrency(activeSheet.assets.reduce((s, i) => s + i.amount, 0))}
                </span>
              </div>

              <div className="space-y-2.5">
                {activeSheet.assets.map((item) => (
                  <div key={item.id} className="space-y-1 bg-white p-2.5 rounded-lg border border-zinc-200/80 shadow-xs">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-sans font-medium text-zinc-900">{item.name}</span>
                      {['ba_reserves', 'bb_reserves', 'tr_tga', 'ind_dep_bank_a', 'ind_dep_bank_b', 'pf_bank_dep', 'ind_physical_cash'].includes(item.id) && (
                        <span className="text-[10px] text-emerald-700 font-sans flex items-center space-x-0.5">
                          <Link2 className="w-3 h-3" />
                          <span>Linked Account</span>
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono text-zinc-400">$</span>
                      <input
                        type="number"
                        min="0"
                        value={item.amount}
                        onChange={(e) => handleChangeAmount(activeSheet.id as EntityId, 'assets', item.id, e.target.value)}
                        className="flex-1 bg-[#FAF8F5] text-xs font-mono p-1.5 rounded border border-[#E2DDD5] focus:outline-none focus:border-[#1A1A1A]"
                      />
                    </div>
                    {item.detail && <p className="text-[10px] text-zinc-400 font-sans">{item.detail}</p>}
                  </div>
                ))}
              </div>
            </div>

            {/* LIABILITIES & EQUITY COLUMN */}
            <div className="space-y-6">
              
              {/* LIABILITIES */}
              <div className="space-y-3 bg-white p-4 rounded-xl border border-[#E2DDD5]">
                <div className="flex items-center justify-between pb-2 border-b border-[#E2DDD5]">
                  <span className="text-xs font-sans font-semibold uppercase text-rose-900 tracking-wider">
                    Liabilities (Owed)
                  </span>
                  <span className="text-xs font-mono font-bold text-rose-900">
                    {formatCurrency(activeSheet.liabilities.reduce((s, i) => s + i.amount, 0))}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {activeSheet.liabilities.map((item) => (
                    <div key={item.id} className="space-y-1 bg-[#FAF8F5]/80 p-2.5 rounded-lg border border-zinc-200/80 shadow-xs">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-sans font-medium text-zinc-900">{item.name}</span>
                        {['cb_reserves_bank_a', 'cb_reserves_bank_b', 'cb_tga', 'ba_dep_ind', 'bb_dep_ind', 'ba_dep_pension', 'cb_currency_notes', 'tr_debt_issued'].includes(item.id) && (
                          <span className="text-[10px] text-rose-700 font-sans flex items-center space-x-0.5">
                            <Link2 className="w-3 h-3" />
                            <span>Linked Account</span>
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono text-zinc-400">$</span>
                        <input
                          type="number"
                          min="0"
                          value={item.amount}
                          onChange={(e) => handleChangeAmount(activeSheet.id as EntityId, 'liabilities', item.id, e.target.value)}
                          className="flex-1 bg-white text-xs font-mono p-1.5 rounded border border-[#E2DDD5] focus:outline-none focus:border-[#1A1A1A]"
                        />
                      </div>
                      {item.detail && <p className="text-[10px] text-zinc-400 font-sans">{item.detail}</p>}
                    </div>
                  ))}
                </div>
              </div>

              {/* EQUITY */}
              <div className="space-y-3 bg-[#FAF8F5]/50 p-4 rounded-xl border border-[#E2DDD5]">
                <div className="flex items-center justify-between pb-2 border-b border-[#E2DDD5]">
                  <span className="text-xs font-sans font-semibold uppercase text-amber-900 tracking-wider">
                    Equity (Net Worth = Assets - Liabilities)
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-900">
                    {formatCurrency(activeSheet.equity.reduce((s, i) => s + i.amount, 0))}
                  </span>
                </div>

                <div className="space-y-2">
                  {activeSheet.equity.length === 0 ? (
                    <p className="text-xs text-zinc-400 italic">No explicit equity accounts required for this entity.</p>
                  ) : (
                    activeSheet.equity.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-2 bg-white rounded-lg border border-zinc-200/80 text-xs font-sans">
                        <span className="font-medium text-zinc-800">{item.name}</span>
                        <span className="font-mono font-semibold text-amber-950">{formatCurrency(item.amount)}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

          </div>

          {/* Optional Actors Controls */}
          {enabledOptionalActors && onToggleOptionalActor && (
            <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#E2DDD5] space-y-2">
              <div className="text-xs font-sans font-semibold text-[#1A1A1A] uppercase tracking-wider">
                Optional System Participant Actors
              </div>
              <p className="text-xs font-sans text-zinc-500">
                Enable or disable specialized market actors across T-accounts, flow vectors, and comparative balance sheet charts:
              </p>
              <div className="flex flex-wrap gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => onToggleOptionalActor('corporation')}
                  className={`px-3.5 py-2 rounded-lg text-xs font-sans font-medium border transition cursor-pointer flex items-center space-x-2 ${
                    enabledOptionalActors.corporation
                      ? 'bg-teal-50 text-teal-900 border-teal-300 font-semibold'
                      : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                  <span>{enabledOptionalActors.corporation ? '✓ Enabled' : '+ Enable'} Private Corporation</span>
                </button>

                <button
                  type="button"
                  onClick={() => onToggleOptionalActor('hedge_fund')}
                  className={`px-3.5 py-2 rounded-lg text-xs font-sans font-medium border transition cursor-pointer flex items-center space-x-2 ${
                    enabledOptionalActors.hedge_fund
                      ? 'bg-orange-50 text-orange-900 border-orange-300 font-semibold'
                      : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-orange-600"></span>
                  <span>{enabledOptionalActors.hedge_fund ? '✓ Enabled' : '+ Enable'} Global Macro Hedge Fund</span>
                </button>

                <button
                  type="button"
                  onClick={() => onToggleOptionalActor('foreign_bank')}
                  className={`px-3.5 py-2 rounded-lg text-xs font-sans font-medium border transition cursor-pointer flex items-center space-x-2 ${
                    enabledOptionalActors.foreign_bank
                      ? 'bg-indigo-50 text-indigo-900 border-indigo-300 font-semibold'
                      : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                  <span>{enabledOptionalActors.foreign_bank ? '✓ Enabled' : '+ Enable'} Foreign Correspondent Bank</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#FAF8F5] border-t border-[#E2DDD5] flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleReset}
            className="flex items-center space-x-1.5 px-3 py-2 bg-white hover:bg-zinc-100 text-zinc-700 text-xs font-sans font-medium rounded-lg border border-[#E2DDD5] transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-zinc-500" />
            <span>Reset Defaults</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-zinc-100 text-zinc-700 text-xs font-sans font-medium rounded-lg border border-[#E2DDD5] transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-[#1A1A1A] hover:bg-zinc-800 text-white text-xs font-sans font-medium rounded-lg shadow-xs transition cursor-pointer"
            >
              Apply Initial Balances
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
