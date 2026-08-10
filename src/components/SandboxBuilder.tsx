import React, { useState, useRef, useEffect } from 'react';
import { EntityBalanceSheet, JournalEntry } from '../types/monetary';
import { formatCurrency } from '../utils/monetaryEngine';
import { Wrench, RotateCcw, PlusCircle, ArrowRight, ChevronDown, Check, Coins, ArrowLeftRight, Landmark, Landmark as GovIcon, DollarSign, Repeat } from 'lucide-react';

interface SandboxBuilderProps {
  currentSheets: Record<string, EntityBalanceSheet>;
  onApplyCustomTx: (updatedSheets: Record<string, EntityBalanceSheet>, journal: JournalEntry) => void;
  onResetSandbox: () => void;
}

type TxType = 'bank_loan' | 'bank_transfer' | 'fed_qe_bank' | 'tga_spending' | 'loan_repayment' | 'bank_pension_repo';

interface TxOption {
  id: TxType;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

const txOptions: TxOption[] = [
  {
    id: 'bank_loan',
    title: '1. Commercial Bank Loan Origination',
    subtitle: 'Bank creates new deposit money & loan asset simultaneously',
    icon: <Coins className="w-4 h-4 text-emerald-700" />,
  },
  {
    id: 'bank_transfer',
    title: '2. Interbank Deposit Transfer',
    subtitle: 'Transfer funds between banks settled via Central Bank reserves',
    icon: <ArrowLeftRight className="w-4 h-4 text-blue-700" />,
  },
  {
    id: 'fed_qe_bank',
    title: '3. Central Bank QE Purchase',
    subtitle: 'Fed buys Treasuries from Bank A, creating new reserves',
    icon: <Landmark className="w-4 h-4 text-purple-700" />,
  },
  {
    id: 'tga_spending',
    title: '4. Sovereign Fiscal Spending',
    subtitle: 'Treasury spends TGA funds into private bank deposit accounts',
    icon: <GovIcon className="w-4 h-4 text-rose-700" />,
  },
  {
    id: 'loan_repayment',
    title: '5. Private Loan Repayment',
    subtitle: 'Individual repays bank loan, destroying bank deposit money',
    icon: <DollarSign className="w-4 h-4 text-amber-700" />,
  },
  {
    id: 'bank_pension_repo',
    title: '6. Bank & Pension Repo Agreement',
    subtitle: 'Bank A borrows cash deposit from Pension Fund in exchange for Reverse Repo',
    icon: <Repeat className="w-4 h-4 text-indigo-700" />,
  },
];

export const SandboxBuilder: React.FC<SandboxBuilderProps> = ({
  currentSheets,
  onApplyCustomTx,
  onResetSandbox,
}) => {
  const [txType, setTxType] = useState<TxType>('bank_loan');
  const [amount, setAmount] = useState<number>(50);
  const [logMessages, setLogMessages] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeOption = txOptions.find((opt) => opt.id === txType) || txOptions[0];

  const handleExecute = () => {
    // Deep clone state
    const sheets: Record<string, EntityBalanceSheet> = JSON.parse(JSON.stringify(currentSheets));
    let description = '';
    const journalList: JournalEntry['entries'] = [];

    if (txType === 'bank_loan') {
      description = `Bank A extends a $${amount}B commercial loan to Private Individual.`;
      const loanAcc = sheets.bank_a.assets.find((i) => i.id === 'ba_loans');
      if (loanAcc) { loanAcc.amount += amount; loanAcc.delta = amount; }
      const depAcc = sheets.bank_a.liabilities.find((i) => i.id === 'ba_dep_ind');
      if (depAcc) { depAcc.amount += amount; depAcc.delta = amount; }

      const indDep = sheets.individual.assets.find((i) => i.id === 'ind_dep_bank_a');
      if (indDep) { indDep.amount += amount; indDep.delta = amount; }
      const indLoan = sheets.individual.liabilities.find((i) => i.id === 'ind_bank_loans');
      if (indLoan) { indLoan.amount += amount; indLoan.delta = amount; }

      journalList.push(
        { entityId: 'bank_a', accountName: 'Commercial Loans', type: 'debit', amount, category: 'asset' },
        { entityId: 'bank_a', accountName: 'Individual Deposits', type: 'credit', amount, category: 'liability' },
        { entityId: 'individual', accountName: 'Bank A Deposits', type: 'debit', amount, category: 'asset' },
        { entityId: 'individual', accountName: 'Bank Loans Owed', type: 'credit', amount, category: 'liability' }
      );
    } else if (txType === 'bank_transfer') {
      description = `Individual transfers $${amount}B from Bank A to Bank B.`;
      const depA = sheets.individual.assets.find((i) => i.id === 'ind_dep_bank_a');
      if (depA) { depA.amount -= amount; depA.delta = -amount; }
      const depB = sheets.individual.assets.find((i) => i.id === 'ind_dep_bank_b');
      if (depB) { depB.amount += amount; depB.delta = amount; }

      const baDep = sheets.bank_a.liabilities.find((i) => i.id === 'ba_dep_ind');
      if (baDep) { baDep.amount -= amount; baDep.delta = -amount; }
      const baRes = sheets.bank_a.assets.find((i) => i.id === 'ba_reserves');
      if (baRes) { baRes.amount -= amount; baRes.delta = -amount; }

      const bbDep = sheets.bank_b.liabilities.find((i) => i.id === 'bb_dep_ind');
      if (bbDep) { bbDep.amount += amount; bbDep.delta = amount; }
      const bbRes = sheets.bank_b.assets.find((i) => i.id === 'bb_reserves');
      if (bbRes) { bbRes.amount += amount; bbRes.delta = amount; }

      const cbResA = sheets.central_bank.liabilities.find((i) => i.id === 'cb_reserves_bank_a');
      if (cbResA) { cbResA.amount -= amount; cbResA.delta = -amount; }
      const cbResB = sheets.central_bank.liabilities.find((i) => i.id === 'cb_reserves_bank_b');
      if (cbResB) { cbResB.amount += amount; cbResB.delta = amount; }

      journalList.push(
        { entityId: 'bank_a', accountName: 'Individual Deposits', type: 'debit', amount, category: 'liability' },
        { entityId: 'bank_a', accountName: 'Central Bank Reserves', type: 'credit', amount, category: 'asset' },
        { entityId: 'bank_b', accountName: 'Central Bank Reserves', type: 'debit', amount, category: 'asset' },
        { entityId: 'bank_b', accountName: 'Individual Deposits', type: 'credit', amount, category: 'liability' }
      );
    } else if (txType === 'fed_qe_bank') {
      description = `Fed purchases $${amount}B Treasuries directly from Primary Dealer Bank A.`;
      const cbTreas = sheets.central_bank.assets.find((i) => i.id === 'cb_us_treasuries');
      if (cbTreas) { cbTreas.amount += amount; cbTreas.delta = amount; }
      const cbResA = sheets.central_bank.liabilities.find((i) => i.id === 'cb_reserves_bank_a');
      if (cbResA) { cbResA.amount += amount; cbResA.delta = amount; }

      const baTreas = sheets.bank_a.assets.find((i) => i.id === 'ba_treasuries');
      if (baTreas) { baTreas.amount -= amount; baTreas.delta = -amount; }
      const baRes = sheets.bank_a.assets.find((i) => i.id === 'ba_reserves');
      if (baRes) { baRes.amount += amount; baRes.delta = amount; }

      journalList.push(
        { entityId: 'central_bank', accountName: 'US Treasuries', type: 'debit', amount, category: 'asset' },
        { entityId: 'central_bank', accountName: 'Bank A Reserves', type: 'credit', amount, category: 'liability' },
        { entityId: 'bank_a', accountName: 'Central Bank Reserves', type: 'debit', amount, category: 'asset' },
        { entityId: 'bank_a', accountName: 'US Treasuries', type: 'credit', amount, category: 'asset' }
      );
    } else if (txType === 'tga_spending') {
      description = `Treasury spends $${amount}B from TGA into Individual Bank A checking account.`;
      const trTga = sheets.treasury.assets.find((i) => i.id === 'tr_tga');
      if (trTga) { trTga.amount -= amount; trTga.delta = -amount; }

      const cbTga = sheets.central_bank.liabilities.find((i) => i.id === 'cb_tga');
      if (cbTga) { cbTga.amount -= amount; cbTga.delta = -amount; }
      const cbResA = sheets.central_bank.liabilities.find((i) => i.id === 'cb_reserves_bank_a');
      if (cbResA) { cbResA.amount += amount; cbResA.delta = amount; }

      const baRes = sheets.bank_a.assets.find((i) => i.id === 'ba_reserves');
      if (baRes) { baRes.amount += amount; baRes.delta = amount; }
      const baDep = sheets.bank_a.liabilities.find((i) => i.id === 'ba_dep_ind');
      if (baDep) { baDep.amount += amount; baDep.delta = amount; }

      const indDep = sheets.individual.assets.find((i) => i.id === 'ind_dep_bank_a');
      if (indDep) { indDep.amount += amount; indDep.delta = amount; }

      journalList.push(
        { entityId: 'central_bank', accountName: 'Treasury TGA', type: 'debit', amount, category: 'liability' },
        { entityId: 'central_bank', accountName: 'Bank A Reserves', type: 'credit', amount, category: 'liability' },
        { entityId: 'bank_a', accountName: 'Central Bank Reserves', type: 'debit', amount, category: 'asset' },
        { entityId: 'bank_a', accountName: 'Individual Deposits', type: 'credit', amount, category: 'liability' }
      );
    } else if (txType === 'loan_repayment') {
      description = `Individual repays $${amount}B of mortgage debt at Bank B.`;
      const indDep = sheets.individual.assets.find((i) => i.id === 'ind_dep_bank_b');
      if (indDep) { indDep.amount -= amount; indDep.delta = -amount; }
      const indLoan = sheets.individual.liabilities.find((i) => i.id === 'ind_bank_loans');
      if (indLoan) { indLoan.amount -= amount; indLoan.delta = -amount; }

      const bbDep = sheets.bank_b.liabilities.find((i) => i.id === 'bb_dep_ind');
      if (bbDep) { bbDep.amount -= amount; bbDep.delta = -amount; }
      const bbLoan = sheets.bank_b.assets.find((i) => i.id === 'bb_loans');
      if (bbLoan) { bbLoan.amount -= amount; bbLoan.delta = -amount; }

      journalList.push(
        { entityId: 'bank_b', accountName: 'Individual Deposits', type: 'debit', amount, category: 'liability' },
        { entityId: 'bank_b', accountName: 'Commercial Loans', type: 'credit', amount, category: 'asset' },
        { entityId: 'individual', accountName: 'Bank Loans Owed', type: 'debit', amount, category: 'liability' },
        { entityId: 'individual', accountName: 'Bank B Deposits', type: 'credit', amount, category: 'asset' }
      );
    } else if (txType === 'bank_pension_repo') {
      description = `Bank A enters a $${amount}B Repo agreement with Pension Fund (Pension Fund converts deposit into Reverse Repo claim).`;
      
      const pfDep = sheets.pension_fund?.assets.find((i) => i.id === 'pf_bank_dep');
      if (pfDep) { pfDep.amount -= amount; pfDep.delta = -amount; }

      let pfRepo = sheets.pension_fund?.assets.find((i) => i.id === 'pf_reverse_repo');
      if (pfRepo) {
        pfRepo.amount += amount;
        pfRepo.delta = amount;
      } else if (sheets.pension_fund) {
        sheets.pension_fund.assets.push({
          id: 'pf_reverse_repo',
          name: 'Reverse Repo (Loan to Bank A)',
          amount: amount,
          category: 'asset',
          delta: amount,
          detail: 'Collateralized short-term cash loan to Bank A'
        });
      }

      const baDepPF = sheets.bank_a?.liabilities.find((i) => i.id === 'ba_dep_pension');
      if (baDepPF) { baDepPF.amount -= amount; baDepPF.delta = -amount; }

      let baRepo = sheets.bank_a?.liabilities.find((i) => i.id === 'ba_repo_borrowing');
      if (baRepo) {
        baRepo.amount += amount;
        baRepo.delta = amount;
      } else if (sheets.bank_a) {
        sheets.bank_a.liabilities.push({
          id: 'ba_repo_borrowing',
          name: 'Repo Borrowing (from Pension)',
          amount: amount,
          category: 'liability',
          delta: amount,
          detail: 'Collateralized repo liability to Pension Fund'
        });
      }

      journalList.push(
        { entityId: 'pension_fund', accountName: 'Reverse Repo Asset', type: 'debit', amount, category: 'asset' },
        { entityId: 'pension_fund', accountName: 'Bank A Deposits', type: 'credit', amount, category: 'asset' },
        { entityId: 'bank_a', accountName: 'Pension Fund Deposits', type: 'debit', amount, category: 'liability' },
        { entityId: 'bank_a', accountName: 'Repo Borrowing Liability', type: 'credit', amount, category: 'liability' }
      );
    }

    const journal: JournalEntry = {
      id: `sandbox_${Date.now()}`,
      stepNumber: 99,
      timestamp: new Date().toLocaleTimeString(),
      title: 'Custom Sandbox Transaction',
      description,
      entries: journalList,
    };

    setLogMessages((prev) => [description, ...prev]);
    onApplyCustomTx(sheets, journal);
  };

  return (
    <div className="bg-white border border-[#E2DDD5] rounded-xl p-6 shadow-xs space-y-6 text-[#1A1A1A]">
      <div className="flex items-center justify-between border-b border-[#E2DDD5] pb-4">
        <div>
          <h2 className="text-xl font-serif font-normal tracking-tight text-[#1A1A1A] flex items-center space-x-2">
            <Wrench className="w-5 h-5 text-[#1A1A1A]" />
            <span>Monetary Sandbox & Custom Transaction Engine</span>
          </h2>
          <p className="text-xs font-sans text-zinc-500 mt-0.5">
            Test custom double-entry flows, credit creation, Repo transactions, QE purchases, or fiscal spending on clean starting balance sheets.
          </p>
        </div>

        <button
          onClick={onResetSandbox}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#FAF8F5] hover:bg-zinc-100 text-zinc-700 text-xs font-sans font-medium rounded-lg border border-[#E2DDD5] shadow-xs transition cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Sandbox</span>
        </button>
      </div>

      {/* Transaction Setup Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#FAF8F5] p-4.5 rounded-xl border border-[#E2DDD5]">
        
        {/* Custom Transaction Type Selector Dropdown */}
        <div className="space-y-1.5 relative" ref={dropdownRef}>
          <label className="text-xs font-sans font-semibold text-zinc-700 block">Transaction Mechanics Type:</label>
          
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full bg-white text-[#1A1A1A] text-xs font-sans rounded-lg p-2.5 border border-[#E2DDD5] focus:outline-none cursor-pointer shadow-xs flex items-center justify-between transition hover:border-zinc-400"
          >
            <div className="flex items-center space-x-2 truncate pr-1">
              <span className="p-1 bg-zinc-50 rounded border border-zinc-200 shrink-0">
                {activeOption.icon}
              </span>
              <div className="text-left truncate">
                <span className="font-medium text-[#1A1A1A] block truncate">{activeOption.title}</span>
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 text-zinc-500 shrink-0 transition-transform duration-150 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Custom Dropdown Popover */}
          {isDropdownOpen && (
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-[#E2DDD5] rounded-xl shadow-xl z-50 p-1.5 space-y-1 max-h-80 overflow-y-auto">
              {txOptions.map((opt) => {
                const isSelected = opt.id === txType;
                return (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setTxType(opt.id);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-lg text-xs font-sans transition flex items-start justify-between space-x-2 cursor-pointer ${
                      isSelected
                        ? 'bg-amber-50/80 border border-amber-300/70 text-amber-950 font-medium'
                        : 'hover:bg-zinc-50 text-zinc-800 border border-transparent'
                    }`}
                  >
                    <div className="flex items-start space-x-2.5">
                      <div className="p-1.5 bg-white rounded-md border border-zinc-200 shrink-0 mt-0.5">
                        {opt.icon}
                      </div>
                      <div>
                        <div className="font-medium text-xs text-[#1A1A1A]">{opt.title}</div>
                        <div className="text-[10px] text-zinc-500 mt-0.5 leading-tight">{opt.subtitle}</div>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-amber-800 shrink-0 mt-1" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Amount Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs font-sans">
            <label className="font-semibold text-zinc-700">Amount ($):</label>
            <span className="font-mono font-bold text-[#1A1A1A] text-sm">
              {formatCurrency(amount)}
            </span>
          </div>
          <input
            type="range"
            min={10}
            max={200}
            step={5}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-[#1A1A1A]"
          />
        </div>

        {/* Execute Action */}
        <div className="flex items-end">
          <button
            onClick={handleExecute}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-[#1A1A1A] hover:bg-zinc-800 text-white font-sans font-medium text-xs rounded-lg shadow-xs transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Apply Double-Entry Transaction</span>
          </button>
        </div>

      </div>

      {/* Sandbox Log */}
      {logMessages.length > 0 && (
        <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#E2DDD5] space-y-2">
          <div className="text-xs font-sans font-semibold uppercase tracking-wider text-zinc-500">
            Custom Transaction Execution History
          </div>
          <div className="space-y-1 font-mono text-xs max-h-32 overflow-y-auto">
            {logMessages.map((msg, idx) => (
              <div key={idx} className="text-[#1A1A1A] flex items-center space-x-2">
                <ArrowRight className="w-3 h-3 text-[#D93829] shrink-0" />
                <span>{msg}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
