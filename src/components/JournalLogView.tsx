import React from 'react';
import { JournalEntry, EntityBalanceSheet } from '../types/monetary';
import { formatCurrency } from '../utils/monetaryEngine';
import { FileText, ArrowRight } from 'lucide-react';

interface JournalLogViewProps {
  journals: JournalEntry[];
  entities: Record<string, EntityBalanceSheet>;
}

export const JournalLogView: React.FC<JournalLogViewProps> = ({ journals, entities }) => {
  return (
    <div className="bg-white border border-[#E2DDD5] rounded-xl p-6 shadow-xs space-y-6 text-[#1A1A1A]">
      <div className="flex items-center justify-between border-b border-[#E2DDD5] pb-4">
        <div>
          <h2 className="text-xl font-serif font-normal tracking-tight text-[#1A1A1A] flex items-center space-x-2">
            <FileText className="w-5 h-5 text-[#1A1A1A]" />
            <span>Double-Entry General Audit Ledger Journal</span>
          </h2>
          <p className="text-xs font-sans text-zinc-500 mt-0.5">
            Immutable chronological accounting record of all Debit and Credit line items applied across balance sheets.
          </p>
        </div>

        <span className="text-xs font-sans font-medium px-3 py-1 bg-zinc-100 text-zinc-800 border border-zinc-200 rounded-full">
          {journals.length} Journal Batch{journals.length === 1 ? '' : 'es'}
        </span>
      </div>

      {journals.length === 0 ? (
        <div className="bg-[#FAF8F5] rounded-xl p-8 border border-[#E2DDD5] text-center space-y-2">
          <p className="text-sm font-serif text-[#1A1A1A]">No accounting journal entries generated yet.</p>
          <p className="text-xs font-sans text-zinc-500">
            Step through the scenarios or use the Sandbox Engine to create accounting transactions.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {journals.map((journal) => {
            const totalDebit = journal.entries
              .filter((e) => e.type === 'debit')
              .reduce((sum, e) => sum + e.amount, 0);
            const totalCredit = journal.entries
              .filter((e) => e.type === 'credit')
              .reduce((sum, e) => sum + e.amount, 0);

            return (
              <div
                key={journal.id}
                className="bg-[#FAF8F5] border border-[#E2DDD5] rounded-xl p-5 space-y-4 shadow-xs"
              >
                {/* Entry Batch Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2DDD5] pb-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-sans font-semibold uppercase px-2 py-0.5 bg-[#1A1A1A] text-white rounded-md">
                        Step {journal.stepNumber}
                      </span>
                      <h3 className="text-base font-serif font-medium text-[#1A1A1A]">
                        {journal.title}
                      </h3>
                    </div>
                    <p className="text-xs font-sans text-zinc-600 mt-0.5">{journal.description}</p>
                  </div>

                  <span className="text-[10px] font-mono text-zinc-400 shrink-0">
                    {journal.timestamp}
                  </span>
                </div>

                {/* Journal Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-sans text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[#E2DDD5] text-zinc-500 font-semibold uppercase text-[10px]">
                        <th className="py-2 px-3">Participant Entity</th>
                        <th className="py-2 px-3">Account Name</th>
                        <th className="py-2 px-3">Category</th>
                        <th className="py-2 px-3 text-right">Debit (+)</th>
                        <th className="py-2 px-3 text-right">Credit (-)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2DDD5]/60 bg-white">
                      {journal.entries.map((entry, idx) => {
                        const entityName = entities[entry.entityId]?.name || entry.entityId;
                        const isDebit = entry.type === 'debit';

                        return (
                          <tr key={idx} className="hover:bg-zinc-50/80 transition">
                            <td className="py-2 px-3 font-serif font-medium text-[#1A1A1A]">{entityName}</td>
                            <td className="py-2 px-3 font-sans text-zinc-800">
                              <span className={isDebit ? 'font-medium text-[#1A1A1A]' : 'pl-4 text-zinc-600'}>
                                {entry.accountName}
                              </span>
                            </td>
                            <td className="py-2 px-3 text-zinc-500 capitalize">{entry.category}</td>
                            <td className="py-2 px-3 text-right font-mono font-medium text-[#1A1A1A]">
                              {isDebit ? formatCurrency(entry.amount) : '—'}
                            </td>
                            <td className="py-2 px-3 text-right font-mono font-medium text-zinc-700">
                              {!isDebit ? formatCurrency(entry.amount) : '—'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="border-t border-[#E2DDD5] bg-[#FAF8F5] font-sans font-semibold text-xs text-[#1A1A1A]">
                        <td colSpan={3} className="py-2.5 px-3 uppercase tracking-wider text-[10px] text-zinc-500">
                          Total Ledger Verification:
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-800">
                          {formatCurrency(totalDebit)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-800">
                          {formatCurrency(totalCredit)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
