import React from 'react';
import { EntityBalanceSheet, EntityId } from '../types/monetary';
import { formatCurrency } from '../utils/monetaryEngine';
import { Landmark, Vault, Building2, Wallet, User } from 'lucide-react';

interface ParticipantAdjustmentsSummaryProps {
  currentBalanceSheets: Record<EntityId, EntityBalanceSheet>;
  title?: string;
  onClose?: () => void;
}

const entitiesList = [
  { id: 'central_bank' as EntityId, name: 'Central Bank (Fed)', shortName: 'Fed', icon: <Landmark className="w-4 h-4" /> },
  { id: 'treasury' as EntityId, name: 'US Treasury', shortName: 'Treasury', icon: <Vault className="w-4 h-4" /> },
  { id: 'bank_a' as EntityId, name: 'Commercial Bank A', shortName: 'Bank A', icon: <Building2 className="w-4 h-4" /> },
  { id: 'bank_b' as EntityId, name: 'Commercial Bank B', shortName: 'Bank B', icon: <Building2 className="w-4 h-4" /> },
  { id: 'pension_fund' as EntityId, name: 'Pension Fund / NDFI', shortName: 'Pension', icon: <Wallet className="w-4 h-4" /> },
  { id: 'individual' as EntityId, name: 'Individual / Household', shortName: 'Household', icon: <User className="w-4 h-4" /> },
];

export const ParticipantAdjustmentsSummary: React.FC<ParticipantAdjustmentsSummaryProps> = ({
  currentBalanceSheets,
  title = 'Participant Entities Step Balance Adjustments',
  onClose,
}) => {
  const changedEntities = entitiesList
    .map((ent) => {
      const sheet = currentBalanceSheets[ent.id];
      if (!sheet) return null;

      const changedAssets = sheet.assets.filter((i) => i.delta !== undefined && i.delta !== 0);
      const changedLiabilities = sheet.liabilities.filter((i) => i.delta !== undefined && i.delta !== 0);
      const changedEquity = sheet.equity.filter((i) => i.delta !== undefined && i.delta !== 0);

      const hasChanges = changedAssets.length > 0 || changedLiabilities.length > 0 || changedEquity.length > 0;

      if (!hasChanges) return null;

      return {
        ent,
        changedAssets,
        changedLiabilities,
        changedEquity,
      };
    })
    .filter(Boolean);

  return (
    <div className="bg-white border border-[#E2DDD5] rounded-xl p-4 space-y-3 shadow-xs">
      <div className="flex items-center justify-between pb-2 border-b border-[#E2DDD5]">
        <div className="flex items-center space-x-2">
          <h3 className="text-xs font-sans font-semibold text-zinc-600 uppercase tracking-wider">
            {title}
          </h3>
          <span className="text-[10px] font-sans font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
            {changedEntities.length} Affected
          </span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-xs text-zinc-500 hover:text-zinc-800 font-sans cursor-pointer underline"
          >
            Hide Summary
          </button>
        )}
      </div>

      {changedEntities.length === 0 ? (
        <div className="bg-[#FAF8F5] border border-[#E2DDD5] rounded-xl p-3.5 text-center text-xs font-sans text-zinc-500 italic">
          No balance sheet ledger account changes recorded for this step.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {changedEntities.map((item) => {
            if (!item) return null;
            const { ent, changedAssets, changedLiabilities, changedEquity } = item;

            return (
              <div
                key={ent.id}
                className="bg-[#FAF8F5] border border-[#1A1A1A] ring-1 ring-zinc-300 rounded-xl p-3 space-y-2 shadow-xs"
              >
                {/* Header */}
                <div className="flex items-center space-x-2 pb-1.5 border-b border-[#E2DDD5] text-[#1A1A1A]">
                  <div className="p-1 bg-white rounded border border-[#E2DDD5] text-[#1A1A1A] shrink-0">
                    {ent.icon}
                  </div>
                  <span className="text-xs font-serif font-medium truncate">{ent.name}</span>
                </div>

                {/* Segmented Changes */}
                <div className="space-y-1.5 text-xs font-sans">
                  {/* Assets Segment */}
                  {changedAssets.length > 0 && (
                    <div className="space-y-1 bg-white p-2 rounded-lg border border-emerald-200/80">
                      <span className="text-[10px] font-sans font-semibold uppercase text-emerald-800 tracking-wider block">
                        Assets
                      </span>
                      {changedAssets.map((a) => {
                        const isPos = (a.delta || 0) > 0;
                        return (
                          <div key={a.id} className="flex items-center justify-between text-xs py-0.5 font-medium">
                            <span className="text-zinc-800 truncate pr-1">{a.name}</span>
                            <span
                              className={`font-mono text-[11px] font-semibold shrink-0 px-1.5 py-0.5 rounded border ${
                                isPos
                                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                  : 'bg-rose-100 text-rose-900 border-rose-300'
                              }`}
                            >
                              {isPos ? '+' : ''}{formatCurrency(a.delta || 0)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Liabilities Segment */}
                  {changedLiabilities.length > 0 && (
                    <div className="space-y-1 bg-white p-2 rounded-lg border border-rose-200/80">
                      <span className="text-[10px] font-sans font-semibold uppercase text-rose-800 tracking-wider block">
                        Liabilities
                      </span>
                      {changedLiabilities.map((l) => {
                        const isPos = (l.delta || 0) > 0;
                        return (
                          <div key={l.id} className="flex items-center justify-between text-xs py-0.5 font-medium">
                            <span className="text-zinc-800 truncate pr-1">{l.name}</span>
                            <span
                              className={`font-mono text-[11px] font-semibold shrink-0 px-1.5 py-0.5 rounded border ${
                                isPos
                                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                  : 'bg-rose-100 text-rose-900 border-rose-300'
                              }`}
                            >
                              {isPos ? '+' : ''}{formatCurrency(l.delta || 0)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Equity Segment */}
                  {changedEquity.length > 0 && (
                    <div className="space-y-1 bg-white p-2 rounded-lg border border-amber-200/80">
                      <span className="text-[10px] font-sans font-semibold uppercase text-amber-800 tracking-wider block">
                        Equity
                      </span>
                      {changedEquity.map((eq) => {
                        const isPos = (eq.delta || 0) > 0;
                        return (
                          <div key={eq.id} className="flex items-center justify-between text-xs py-0.5 font-medium">
                            <span className="text-zinc-800 truncate pr-1">{eq.name}</span>
                            <span
                              className={`font-mono text-[11px] font-semibold shrink-0 px-1.5 py-0.5 rounded border ${
                                isPos
                                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                  : 'bg-rose-100 text-rose-900 border-rose-300'
                              }`}
                            >
                              {isPos ? '+' : ''}{formatCurrency(eq.delta || 0)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
