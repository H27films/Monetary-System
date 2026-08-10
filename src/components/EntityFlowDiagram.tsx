import React from 'react';
import { MoneyFlow, EntityId, EntityBalanceSheet } from '../types/monetary';
import { formatCurrency } from '../utils/monetaryEngine';
import { ArrowRight } from 'lucide-react';

interface EntityFlowDiagramProps {
  flows: MoneyFlow[];
  currentBalanceSheets: Record<EntityId, EntityBalanceSheet>;
}

export const EntityFlowDiagram: React.FC<EntityFlowDiagramProps> = ({
  flows,
  currentBalanceSheets,
}) => {
  const getEntityName = (id: EntityId) => {
    return currentBalanceSheets[id]?.name || id;
  };

  return (
    <div className="bg-white border border-[#E2DDD5] rounded-xl p-6 shadow-xs space-y-6 text-[#1A1A1A]">
      <div className="flex items-center justify-between border-b border-[#E2DDD5] pb-4">
        <div>
          <h2 className="text-xl font-serif font-normal tracking-tight text-[#1A1A1A] flex items-center space-x-2">
            <span>Inter-Entity Asset & Money Flow Vectors</span>
          </h2>
          <p className="text-xs font-sans text-zinc-500 mt-0.5">
            Real-time movement of Central Bank Reserves, Government Treasuries, and Commercial Bank Deposits in this step.
          </p>
        </div>
        <span className="text-xs font-sans font-medium px-3 py-1 bg-zinc-100 text-zinc-800 border border-zinc-200 rounded-full">
          {flows.length} Active Flow Vector{flows.length === 1 ? '' : 's'}
        </span>
      </div>

      {/* Active Step Money Flows */}
      {flows.length === 0 ? (
        <div className="bg-[#FAF8F5] rounded-xl p-8 border border-[#E2DDD5] text-center space-y-2">
          <p className="text-sm font-serif font-normal text-[#1A1A1A]">
            No money or reserves moved between participant entities in this step.
          </p>
          <p className="text-xs font-sans text-zinc-500">
            (This step represents an internal balance sheet reclassification or ledger analysis).
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {flows.map((flow, index) => (
            <div
              key={flow.id || index}
              className="bg-[#FAF8F5] border border-[#E2DDD5] rounded-xl p-4 transition duration-200 shadow-xs space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                
                {/* From Entity */}
                <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg border border-[#E2DDD5] font-serif text-xs text-[#1A1A1A] shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-[#D93829]"></span>
                  <span>{getEntityName(flow.fromEntity)}</span>
                </div>

                {/* Vector Visual Arrow */}
                <div className="flex items-center justify-center space-x-2 flex-1 px-2">
                  <div className="h-0.5 flex-1 bg-[#1A1A1A] relative"></div>

                  <div className="px-3.5 py-1.5 bg-white border border-[#E2DDD5] rounded-lg text-center shrink-0 shadow-xs">
                    <div className="text-[10px] text-zinc-500 font-sans font-semibold uppercase tracking-wider">
                      {flow.assetType}
                    </div>
                    <div className="text-sm font-mono font-bold text-[#1A1A1A]">
                      {formatCurrency(flow.amount)}
                    </div>
                  </div>

                  <div className="h-0.5 flex-1 bg-[#1A1A1A] relative flex items-center justify-end">
                    <ArrowRight className="w-4 h-4 text-[#1A1A1A] absolute right-0 -top-1.5" />
                  </div>
                </div>

                {/* To Entity */}
                <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg border border-[#E2DDD5] font-serif text-xs text-[#1A1A1A] shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  <span>{getEntityName(flow.toEntity)}</span>
                </div>

              </div>

              <p className="text-xs font-sans text-zinc-600 italic bg-white p-2.5 rounded-lg border border-[#E2DDD5]/80">
                "{flow.description}"
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
