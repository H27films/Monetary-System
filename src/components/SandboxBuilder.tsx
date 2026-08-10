import React, { useState } from 'react';
import { EntityId, EntityBalanceSheet, JournalEntry } from '../types/monetary';
import { formatCurrency } from '../utils/monetaryEngine';
import { Wrench, PlusCircle, RotateCcw, ArrowRight } from 'lucide-react';

interface SandboxBuilderProps {
  initialState: Record<EntityId, EntityBalanceSheet>;
  onApplyCustomTransaction: (
    updatedSheets: Record<EntityId, EntityBalanceSheet>,
    journal: JournalEntry,
    txDescription: string
  ) => void;
  onResetSandbox: () => void;
}

export const SandboxBuilder: React.FC<SandboxBuilderProps> = ({
  initialState,
  onApplyCustomTransaction,
  onResetSandbox,
}) => {
  const [txType, setTxType] = useState<
    | 'bank_loan'
    | 'bank_transfer'
    | 'fed_qe_bank'
    | 'fed_qe_nonbank'
    | 'treasury_auction'
    | 'tga_spending'
    | 'cash_withdrawal'
    | 'loan_repayment'
  >('bank_loan');

  const [amount, setAmount] = useState<number>(20);
  const [logMessages, setLogMessages] = useState<string[]>([]);

  const handleExecute = () => {
    // Deep clone current initial state
    const sheets: Record<EntityId, EntityBalanceSheet> = JSON.parse(JSON.stringify(initialState));

    // Clear previous step deltas
    Object.values(sheets).forEach((s) => {
      s.assets.forEach((i) => (i.delta = 0));
      s.liabilities.forEach((i) => (i.delta = 0));
      s.equity.forEach((i) => (i.delta = 0));
    });

    let description = '';
    const journalEntries: JournalEntry['entries'] = [];

    if (txType === 'bank_loan') {
      description = `Bank A extends a $${amount}B commercial loan to Private Individual.`;
      // Bank A Assets: Loans +amount. Liabilities: Individual Deposits +amount.
      const loanAcc = sheets.bank_a.assets.find((i) => i.id === 'ba_loans');
      if (loanAcc) { loanAcc.amount += amount; loanAcc.delta = amount; }
      const depAcc = sheets.bank_a.liabilities.find((i) => i.id === 'ba_dep_ind');
      if (depAcc) { depAcc.amount += amount; depAcc.delta = amount; }

      // Individual Assets: Bank A Deposits +amount. Liabilities: Loans +amount.
      const indDep = sheets.individual.assets.find((i) => i.id === 'ind_dep_bank_a');
      if (indDep) { indDep.amount += amount; indDep.delta = amount; }
      const indLoan = sheets.individual.liabilities.find((i) => i.id === 'ind_bank_loans');
      if (indLoan) { indLoan.amount += amount; indLoan.delta = amount; }

      journalEntries.push(
        { entityId: 'bank_a', accountName: 'Commercial Loans', type: 'debit', amount, category: 'asset' },
        { entityId: 'bank_a', accountName: 'Individual Deposits', type: 'credit', amount, category: 'liability' },
        { entityId: 'individual', accountName: 'Bank A Deposits', type: 'debit', amount, category: 'asset' },
        { entityId: 'individual', accountName: 'Bank Loans & Mortgages', type: 'credit', amount, category: 'liability' }
      );
    } else if (txType === 'bank_transfer') {
      description = `Individual transfers $${amount}B from Bank A to Bank B.`;
      // Individual Assets: Bank A Deposits -amount, Bank B Deposits +amount
      const depA = sheets.individual.assets.find((i) => i.id === 'ind_dep_bank_a');
      if (depA) { depA.amount -= amount; depA.delta = -amount; }
      const depB = sheets.individual.assets.find((i) => i.id === 'ind_dep_bank_b');
      if (depB) { depB.amount += amount; depB.delta = amount; }

      // Bank A Liabilities: Deposits -amount. Assets: Reserves -amount
      const baDep = sheets.bank_a.liabilities.find((i) => i.id === 'ba_dep_ind');
      if (baDep) { baDep.amount -= amount; baDep.delta = -amount; }
      const baRes = sheets.bank_a.assets.find((i) => i.id === 'ba_reserves');
      if (baRes) { baRes.amount -= amount; baRes.delta = -amount; }

      // Bank B Liabilities: Deposits +amount. Assets: Reserves +amount
      const bbDep = sheets.bank_b.liabilities.find((i) => i.id === 'bb_dep_ind');
      if (bbDep) { bbDep.amount += amount; bbDep.delta = amount; }
      const bbRes = sheets.bank_b.assets.find((i) => i.id === 'bb_reserves');
      if (bbRes) { bbRes.amount += amount; bbRes.delta = amount; }

      // Fed Liabilities: Bank A Reserves -amount, Bank B Reserves +amount
      const cbResA = sheets.central_bank.liabilities.find((i) => i.id === 'cb_reserves_bank_a');
      if (cbResA) { cbResA.amount -= amount; cbResA.delta = -amount; }
      const cbResB = sheets.central_bank.liabilities.find((i) => i.id === 'cb_reserves_bank_b');
      if (cbResB) { cbResB.amount += amount; cbResB.delta = amount; }

      journalEntries.push(
        { entityId: 'bank_a', accountName: 'Individual Deposits', type: 'debit', amount, category: 'liability' },
        { entityId: 'bank_a', accountName: 'Reserves at Central Bank', type: 'credit', amount, category: 'asset' },
        { entityId: 'central_bank', accountName: 'Bank A Reserves', type: 'debit', amount, category: 'liability' },
        { entityId: 'central_bank', accountName: 'Bank B Reserves', type: 'credit', amount, category: 'liability' },
        { entityId: 'bank_b', accountName: 'Reserves at Central Bank', type: 'debit', amount, category: 'asset' },
        { entityId: 'bank_b', accountName: 'Individual Customer Deposits', type: 'credit', amount, category: 'liability' }
      );
    } else if (txType === 'fed_qe_bank') {
      description = `Fed purchases $${amount}B Treasuries directly from Primary Dealer Bank A.`;
      // Fed Assets: Treasuries +amount. Liabilities: Bank A Reserves +amount
      const cbTreas = sheets.central_bank.assets.find((i) => i.id === 'cb_us_treasuries');
      if (cbTreas) { cbTreas.amount += amount; cbTreas.delta = amount; }
      const cbResA = sheets.central_bank.liabilities.find((i) => i.id === 'cb_reserves_bank_a');
      if (cbResA) { cbResA.amount += amount; cbResA.delta = amount; }

      // Bank A Assets: Treasuries -amount, Reserves +amount
      const baTreas = sheets.bank_a.assets.find((i) => i.id === 'ba_treasuries');
      if (baTreas) { baTreas.amount -= amount; baTreas.delta = -amount; }
      const baRes = sheets.bank_a.assets.find((i) => i.id === 'ba_reserves');
      if (baRes) { baRes.amount += amount; baRes.delta = amount; }

      journalEntries.push(
        { entityId: 'central_bank', accountName: 'US Treasuries (SOMA)', type: 'debit', amount, category: 'asset' },
        { entityId: 'central_bank', accountName: 'Bank A Reserves', type: 'credit', amount, category: 'liability' },
        { entityId: 'bank_a', accountName: 'Reserves at Central Bank', type: 'debit', amount, category: 'asset' },
        { entityId: 'bank_a', accountName: 'US Treasuries', type: 'credit', amount, category: 'asset' }
      );
    } else if (txType === 'tga_spending') {
      description = `Treasury spends $${amount}B from TGA into Individual Bank A checking account.`;
      // Treasury Assets: TGA -amount.
      const trTga = sheets.treasury.assets.find((i) => i.id === 'tr_tga');
      if (trTga) { trTga.amount -= amount; trTga.delta = -amount; }

      // Fed Liabilities: TGA -amount, Bank A Reserves +amount
      const cbTga = sheets.central_bank.liabilities.find((i) => i.id === 'cb_tga');
      if (cbTga) { cbTga.amount -= amount; cbTga.delta = -amount; }
      const cbResA = sheets.central_bank.liabilities.find((i) => i.id === 'cb_reserves_bank_a');
      if (cbResA) { cbResA.amount += amount; cbResA.delta = amount; }

      // Bank A Assets: Reserves +amount. Liabilities: Individual Deposits +amount
      const baRes = sheets.bank_a.assets.find((i) => i.id === 'ba_reserves');
      if (baRes) { baRes.amount += amount; baRes.delta = amount; }
      const baDep = sheets.bank_a.liabilities.find((i) => i.id === 'ba_dep_ind');
      if (baDep) { baDep.amount += amount; baDep.delta = amount; }

      // Individual Assets: Bank A Deposits +amount
      const indDep = sheets.individual.assets.find((i) => i.id === 'ind_dep_bank_a');
      if (indDep) { indDep.amount += amount; indDep.delta = amount; }

      journalEntries.push(
        { entityId: 'treasury', accountName: 'TGA Cash (at Central Bank)', type: 'credit', amount, category: 'asset' },
        { entityId: 'central_bank', accountName: 'Treasury General Account (TGA)', type: 'debit', amount, category: 'liability' },
        { entityId: 'central_bank', accountName: 'Bank A Reserves', type: 'credit', amount, category: 'liability' },
        { entityId: 'bank_a', accountName: 'Reserves at Central Bank', type: 'debit', amount, category: 'asset' },
        { entityId: 'bank_a', accountName: 'Individual Deposits', type: 'credit', amount, category: 'liability' },
        { entityId: 'individual', accountName: 'Bank A Deposits', type: 'debit', amount, category: 'asset' }
      );
    } else if (txType === 'loan_repayment') {
      description = `Individual repays $${amount}B of mortgage debt at Bank B.`;
      // Individual Assets: Bank B Deposits -amount. Liabilities: Loans -amount
      const indDep = sheets.individual.assets.find((i) => i.id === 'ind_dep_bank_b');
      if (indDep) { indDep.amount -= amount; indDep.delta = -amount; }
      const indLoan = sheets.individual.liabilities.find((i) => i.id === 'ind_bank_loans');
      if (indLoan) { indLoan.amount -= amount; indLoan.delta = -amount; }

      // Bank B Liabilities: Deposits -amount. Assets: Loans -amount
      const bbDep = sheets.bank_b.liabilities.find((i) => i.id === 'bb_dep_ind');
      if (bbDep) { bbDep.amount -= amount; bbDep.delta = -amount; }
      const bbLoan = sheets.bank_b.assets.find((i) => i.id === 'bb_loans');
      if (bbLoan) { bbLoan.amount -= amount; bbLoan.delta = -amount; }

      journalEntries.push(
        { entityId: 'individual', accountName: 'Bank Loans & Mortgages', type: 'debit', amount, category: 'liability' },
        { entityId: 'individual', accountName: 'Bank B Deposits', type: 'credit', amount, category: 'asset' },
        { entityId: 'bank_b', accountName: 'Individual Customer Deposits', type: 'debit', amount, category: 'liability' },
        { entityId: 'bank_b', accountName: 'Commercial & Retail Loans', type: 'credit', amount, category: 'asset' }
      );
    }

    const journal: JournalEntry = {
      id: `custom_j_${Date.now()}`,
      stepNumber: 99,
      timestamp: new Date().toLocaleTimeString(),
      title: 'Custom Sandbox Transaction',
      description,
      entries: journalEntries,
    };

    setLogMessages((prev) => [`[${new Date().toLocaleTimeString()}] ${description}`, ...prev]);
    onApplyCustomTransaction(sheets, journal, description);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6 text-slate-100">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-extrabold tracking-tight text-white flex items-center space-x-2">
            <Wrench className="w-5 h-5 text-emerald-400" />
            <span>Monetary Sandbox & Custom Transaction Engine</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Test custom double-entry flows, credit creation, QE purchases, or fiscal spending on real live balance sheets.
          </p>
        </div>

        <button
          onClick={onResetSandbox}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold border border-slate-700 transition cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Sandbox</span>
        </button>
      </div>

      {/* Transaction Setup Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950/80 p-4 rounded-xl border border-slate-800">
        
        {/* Transaction Type Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Transaction Mechanics Type:</label>
          <select
            value={txType}
            onChange={(e: any) => setTxType(e.target.value)}
            className="w-full bg-slate-900 text-slate-100 text-xs rounded-lg p-2.5 border border-slate-700 focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="bank_loan">1. Commercial Bank Loan Origination (Creates Money)</option>
            <option value="bank_transfer">2. Interbank Deposit Transfer (Reserves Settlement)</option>
            <option value="fed_qe_bank">3. Fed QE Bond Purchase from Bank A</option>
            <option value="tga_spending">4. Fiscal Spending from TGA into Individual Account</option>
            <option value="loan_repayment">5. Loan Principal Repayment (Destroys Money)</option>
          </select>
        </div>

        {/* Amount Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <label className="font-semibold text-slate-300">Amount ($ Billions):</label>
            <span className="font-mono font-bold text-emerald-400 text-sm">
              {formatCurrency(amount)}
            </span>
          </div>
          <input
            type="range"
            min={5}
            max={100}
            step={5}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
        </div>

        {/* Execute Button */}
        <div className="flex items-end">
          <button
            onClick={handleExecute}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Apply Double-Entry Transaction</span>
          </button>
        </div>

      </div>

      {/* Sandbox Log */}
      {logMessages.length > 0 && (
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Custom Transaction Execution History
          </div>
          <div className="space-y-1 font-mono text-xs max-h-32 overflow-y-auto">
            {logMessages.map((msg, idx) => (
              <div key={idx} className="text-emerald-300/90 flex items-center space-x-2">
                <ArrowRight className="w-3 h-3 text-emerald-500 shrink-0" />
                <span>{msg}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
