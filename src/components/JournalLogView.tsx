import React from 'react';
import { JournalEntry, EntityId } from '../types/monetary';
import { formatCurrency } from '../utils/monetaryEngine';
import { FileText, ArrowRightLeft } from 'lucide-react';

interface JournalLogViewProps {
  entries: JournalEntry[];
  entityNames: Record<EntityId, string>;
}

export const JournalLogView: React.FC<JournalLogViewProps> = ({ entries, entityNames }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6 text-slate-100">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-extrabold tracking-tight text-white flex items-center space-x-2">
            <FileText className="w-5 h-5 text-blue-400" />
            <span>Double-Entry General Ledger Journal</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit log of all Debit and Credit accounting postings across entity ledgers for each step.
          </p>
        </div>
        <span className="text-xs font-mono font-semibold px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full">
          {entries.length} Transaction Records
        </span>
      </div>

      {entries.length === 0 ? (
        <div className="bg-slate-950 p-8 rounded-xl border border-slate-800 text-center text-slate-500 text-xs">
          No double-entry journal entries recorded yet.
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((j) => (
            <div
              key={j.id}
              className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3 shadow-md"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-slate-800/80">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                    Step {j.stepNumber}
                  </span>
                  <h3 className="text-sm font-bold text-slate-200">{j.title}</h3>
                </div>
                <span className="text-[11px] font-mono text-slate-500">{j.timestamp}</span>
              </div>

              <p className="text-xs text-slate-400 italic">{j.description}</p>

              {/* Journal Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="text-slate-500 border-b border-slate-800 text-[10px] uppercase tracking-wider">
                      <th className="py-2 px-2">Entity Ledger</th>
                      <th className="py-2 px-2">Account Name</th>
                      <th className="py-2 px-2">Posting Type</th>
                      <th className="py-2 px-2 text-right">Debit ($B)</th>
                      <th className="py-2 px-2 text-right">Credit ($B)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {j.entries.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/60">
                        <td className="py-2 px-2 font-semibold text-slate-200">
                          {entityNames[row.entityId] || row.entityId}
                        </td>
                        <td className="py-2 px-2">{row.accountName}</td>
                        <td className="py-2 px-2 uppercase text-[10px]">
                          <span
                            className={`px-1.5 py-0.5 rounded font-bold ${
                              row.type === 'debit'
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : 'bg-blue-500/10 text-blue-400'
                            }`}
                          >
                            {row.type}
                          </span>
                        </td>
                        <td className="py-2 px-2 text-right font-bold text-emerald-400">
                          {row.type === 'debit' ? formatCurrency(row.amount) : '-'}
                        </td>
                        <td className="py-2 px-2 text-right font-bold text-blue-400">
                          {row.type === 'credit' ? formatCurrency(row.amount) : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
