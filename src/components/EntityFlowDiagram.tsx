import React from 'react';
import { EntityId, MoneyFlow, EntityBalanceSheet } from '../types/monetary';
import { formatCurrency } from '../utils/monetaryEngine';
import { ArrowRight, Landmark, Building2, Vault, User, Wallet } from 'lucide-react';

interface EntityFlowDiagramProps {
  flows: MoneyFlow[];
  currentBalanceSheets: Record<EntityId, EntityBalanceSheet>;
}

export const EntityFlowDiagram: React.FC<EntityFlowDiagramProps> = ({
  flows,
  currentBalanceSheets,
}) => {
  // Entity node definitions with visual positions
  const entitiesList: { id: EntityId; name: string; icon: React.ReactNode; color: string }[] = [
    { id: 'central_bank', name: 'Central Bank (Fed)', icon: <Landmark className="w-5 h-5" />, color: 'emerald' },
    { id: 'treasury', name: 'US Treasury (TGA)', icon: <Building2 className="w-5 h-5" />, color: 'rose' },
    { id: 'bank_a', name: 'Bank A (Primary Dealer)', icon: <Vault className="w-5 h-5" />, color: 'blue' },
    { id: 'bank_b', name: 'Bank B (Commercial)', icon: <Vault className="w-5 h-5" />, color: 'indigo' },
    { id: 'pension_fund', name: 'Pension Fund (Non-Bank)', icon: <Wallet className="w-5 h-5" />, color: 'amber' },
    { id: 'individual', name: 'Private Individual', icon: <User className="w-5 h-5" />, color: 'violet' },
  ];

  const getEntityName = (id: EntityId) => {
    return currentBalanceSheets[id]?.shortName || id;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6 text-slate-100">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-extrabold tracking-tight text-white flex items-center space-x-2">
            <span>Inter-Entity Asset & Money Flow Vectors</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time movement of Central Bank Reserves, Government Treasuries, and Commercial Bank Deposits in this step.
          </p>
        </div>
        <span className="text-xs font-mono font-semibold px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
          {flows.length} Active Flow Vector{flows.length === 1 ? '' : 's'}
        </span>
      </div>

      {/* Active Flow List Cards */}
      {flows.length === 0 ? (
        <div className="bg-slate-950/80 rounded-xl p-8 border border-slate-800 text-center space-y-2">
          <p className="text-sm text-slate-400 font-medium">
            No money or assets moved between entity accounts in this specific step.
          </p>
          <p className="text-xs text-slate-500">
            (This step represents an internal balance sheet reclassification or step analysis).
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {flows.map((flow, index) => (
            <div
              key={flow.id || index}
              className="bg-slate-950/90 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition duration-200 shadow-md space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                
                {/* From Entity */}
                <div className="flex items-center space-x-2.5 bg-slate-900 px-3 py-2 rounded-lg border border-slate-800 font-semibold text-xs text-slate-200">
                  <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse"></span>
                  <span>{getEntityName(flow.fromEntity)}</span>
                </div>

                {/* Vector Amount & Label */}
                <div className="flex items-center justify-center space-x-2 flex-1 px-2">
                  <div className="h-0.5 flex-1 bg-gradient-to-r from-rose-500/60 via-emerald-400 to-emerald-500/60 relative">
                    <div className="absolute inset-0 bg-emerald-400/80 blur-sm animate-pulse"></div>
                  </div>

                  <div className="px-3 py-1 bg-emerald-950 border border-emerald-700/60 rounded-full text-center shrink-0 shadow-lg">
                    <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                      {flow.assetType}
                    </div>
                    <div className="text-sm font-extrabold font-mono text-emerald-200">
                      {formatCurrency(flow.amount)}
                    </div>
                  </div>

                  <div className="h-0.5 flex-1 bg-gradient-to-r from-emerald-500/60 via-emerald-400 to-blue-500/60 relative">
                    <ArrowRight className="w-4 h-4 text-emerald-400 absolute right-0 -top-1.5" />
                  </div>
                </div>

                {/* To Entity */}
                <div className="flex items-center space-x-2.5 bg-slate-900 px-3 py-2 rounded-lg border border-slate-800 font-semibold text-xs text-slate-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>{getEntityName(flow.toEntity)}</span>
                </div>

              </div>

              <p className="text-xs text-slate-400 italic bg-slate-900/60 p-2 rounded-lg border border-slate-800/60">
                "{flow.description}"
              </p>
            </div>
          ))}
        </div>
      )}

      {/* System Entity Topology Grid */}
      <div className="pt-4 border-t border-slate-800">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          System Participant Entities (Ledgers)
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {entitiesList.map((ent) => {
            const sheet = currentBalanceSheets[ent.id];
            const totalAssets = sheet?.assets.reduce((sum, item) => sum + item.amount, 0) || 0;

            return (
              <div
                key={ent.id}
                className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 flex flex-col justify-between"
              >
                <div className="flex items-center space-x-2 mb-2 text-slate-300">
                  <div className="p-1.5 bg-slate-800 rounded-lg text-emerald-400">
                    {ent.icon}
                  </div>
                  <span className="text-xs font-bold truncate">{ent.name}</span>
                </div>

                <div className="text-[11px] font-mono text-slate-400 flex justify-between items-center pt-2 border-t border-slate-800/60">
                  <span>Assets:</span>
                  <span className="font-bold text-slate-200">{formatCurrency(totalAssets)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
