import React, { useState, useRef, useEffect } from 'react';
import { EntityBalanceSheet, JournalEntry } from '../types/monetary';
import { formatCurrency } from '../utils/monetaryEngine';
import { ParticipantAdjustmentsSummary } from './ParticipantAdjustmentsSummary';
import {
  Wrench,
  RotateCcw,
  PlusCircle,
  ArrowRight,
  ChevronDown,
  Check,
  Coins,
  ArrowLeftRight,
  Landmark,
  Landmark as GovIcon,
  DollarSign,
  Repeat,
  Sparkles,
  Loader2,
  HelpCircle,
  Briefcase,
  TrendingUp,
  Layers,
} from 'lucide-react';

interface SandboxBuilderProps {
  currentSheets: Record<string, EntityBalanceSheet>;
  onApplyCustomTx: (updatedSheets: Record<string, EntityBalanceSheet>, journal: JournalEntry) => void;
  onResetSandbox: () => void;
}

type TxType = 'bank_loan' | 'bank_transfer' | 'fed_qe_bank' | 'tga_spending' | 'loan_repayment' | 'bank_pension_repo' | 'corp_bond_issuance' | 'hf_repo_treasury';

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
  {
    id: 'corp_bond_issuance',
    title: '7. Corporate Bond Sale to Pension Fund',
    subtitle: 'Private Corporation issues $50B corporate bonds purchased by Pension Fund',
    icon: <Briefcase className="w-4 h-4 text-teal-700" />,
  },
  {
    id: 'hf_repo_treasury',
    title: '8. Hedge Fund Repo & Treasury Arbitrage',
    subtitle: 'Hedge Fund borrows via Repo at Bank A to buy Treasuries from Pension Fund',
    icon: <TrendingUp className="w-4 h-4 text-orange-700" />,
  },
];

const aiPromptPresets = [
  'Private Corporation issues $50B in corporate bonds to Pension Fund paid with Bank A deposits.',
  'Hedge Fund enters into a $40B repo agreement with Bank A to buy $40B Treasuries from Pension Fund.',
  'Private Corporation spends $30B bank deposits on new equipment and pays worker wages at Bank B.',
  'Central Bank purchases $30B Treasuries directly from Hedge Fund using newly created reserves.',
];

export const SandboxBuilder: React.FC<SandboxBuilderProps> = ({
  currentSheets,
  onApplyCustomTx,
  onResetSandbox,
}) => {
  const [sandboxMode, setSandboxMode] = useState<'manual' | 'ai'>('manual');
  const [showVectorSummary, setShowVectorSummary] = useState<boolean>(false);
  const [txType, setTxType] = useState<TxType>('bank_loan');
  const [amount, setAmount] = useState<number>(50);
  const [logMessages, setLogMessages] = useState<Array<{ title: string; desc: string; explanation?: string }>>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  // AI mode state
  const [aiPromptInput, setAiPromptInput] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);

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

  const handleExecuteManual = () => {
    const sheets: Record<string, EntityBalanceSheet> = JSON.parse(JSON.stringify(currentSheets));
    let description = '';
    const journalList: JournalEntry['entries'] = [];

    if (txType === 'bank_loan') {
      description = `Bank A extends a $${amount}B commercial loan to Private Individual.`;
      const loanAcc = sheets.bank_a?.assets.find((i) => i.id === 'ba_loans');
      if (loanAcc) { loanAcc.amount += amount; loanAcc.delta = amount; }
      const depAcc = sheets.bank_a?.liabilities.find((i) => i.id === 'ba_dep_ind');
      if (depAcc) { depAcc.amount += amount; depAcc.delta = amount; }

      const indDep = sheets.individual?.assets.find((i) => i.id === 'ind_dep_bank_a');
      if (indDep) { indDep.amount += amount; indDep.delta = amount; }
      const indLoan = sheets.individual?.liabilities.find((i) => i.id === 'ind_bank_loans');
      if (indLoan) { indLoan.amount += amount; indLoan.delta = amount; }

      journalList.push(
        { entityId: 'bank_a', accountName: 'Commercial Loans', type: 'debit', amount, category: 'asset' },
        { entityId: 'bank_a', accountName: 'Individual Deposits', type: 'credit', amount, category: 'liability' },
        { entityId: 'individual', accountName: 'Bank A Deposits', type: 'debit', amount, category: 'asset' },
        { entityId: 'individual', accountName: 'Bank Loans Owed', type: 'credit', amount, category: 'liability' }
      );
    } else if (txType === 'bank_transfer') {
      description = `Individual transfers $${amount}B from Bank A to Bank B.`;
      const depA = sheets.individual?.assets.find((i) => i.id === 'ind_dep_bank_a');
      if (depA) { depA.amount -= amount; depA.delta = -amount; }
      const depB = sheets.individual?.assets.find((i) => i.id === 'ind_dep_bank_b');
      if (depB) { depB.amount += amount; depB.delta = amount; }

      const baDep = sheets.bank_a?.liabilities.find((i) => i.id === 'ba_dep_ind');
      if (baDep) { baDep.amount -= amount; baDep.delta = -amount; }
      const baRes = sheets.bank_a?.assets.find((i) => i.id === 'ba_reserves');
      if (baRes) { baRes.amount -= amount; baRes.delta = -amount; }

      const bbDep = sheets.bank_b?.liabilities.find((i) => i.id === 'bb_dep_ind');
      if (bbDep) { bbDep.amount += amount; bbDep.delta = amount; }
      const bbRes = sheets.bank_b?.assets.find((i) => i.id === 'bb_reserves');
      if (bbRes) { bbRes.amount += amount; bbRes.delta = amount; }

      const cbResA = sheets.central_bank?.liabilities.find((i) => i.id === 'cb_reserves_bank_a');
      if (cbResA) { cbResA.amount -= amount; cbResA.delta = -amount; }
      const cbResB = sheets.central_bank?.liabilities.find((i) => i.id === 'cb_reserves_bank_b');
      if (cbResB) { cbResB.amount += amount; cbResB.delta = amount; }

      journalList.push(
        { entityId: 'bank_a', accountName: 'Individual Deposits', type: 'debit', amount, category: 'liability' },
        { entityId: 'bank_a', accountName: 'Central Bank Reserves', type: 'credit', amount, category: 'asset' },
        { entityId: 'bank_b', accountName: 'Central Bank Reserves', type: 'debit', amount, category: 'asset' },
        { entityId: 'bank_b', accountName: 'Individual Deposits', type: 'credit', amount, category: 'liability' }
      );
    } else if (txType === 'fed_qe_bank') {
      description = `Fed purchases $${amount}B Treasuries directly from Primary Dealer Bank A.`;
      const cbTreas = sheets.central_bank?.assets.find((i) => i.id === 'cb_us_treasuries');
      if (cbTreas) { cbTreas.amount += amount; cbTreas.delta = amount; }
      const cbResA = sheets.central_bank?.liabilities.find((i) => i.id === 'cb_reserves_bank_a');
      if (cbResA) { cbResA.amount += amount; cbResA.delta = amount; }

      const baTreas = sheets.bank_a?.assets.find((i) => i.id === 'ba_treasuries');
      if (baTreas) { baTreas.amount -= amount; baTreas.delta = -amount; }
      const baRes = sheets.bank_a?.assets.find((i) => i.id === 'ba_reserves');
      if (baRes) { baRes.amount += amount; baRes.delta = amount; }

      journalList.push(
        { entityId: 'central_bank', accountName: 'US Treasuries', type: 'debit', amount, category: 'asset' },
        { entityId: 'central_bank', accountName: 'Bank A Reserves', type: 'credit', amount, category: 'liability' },
        { entityId: 'bank_a', accountName: 'Central Bank Reserves', type: 'debit', amount, category: 'asset' },
        { entityId: 'bank_a', accountName: 'US Treasuries', type: 'credit', amount, category: 'asset' }
      );
    } else if (txType === 'tga_spending') {
      description = `Treasury spends $${amount}B from TGA into Individual Bank A checking account.`;
      const trTga = sheets.treasury?.assets.find((i) => i.id === 'tr_tga');
      if (trTga) { trTga.amount -= amount; trTga.delta = -amount; }

      const cbTga = sheets.central_bank?.liabilities.find((i) => i.id === 'cb_tga');
      if (cbTga) { cbTga.amount -= amount; cbTga.delta = -amount; }
      const cbResA = sheets.central_bank?.liabilities.find((i) => i.id === 'cb_reserves_bank_a');
      if (cbResA) { cbResA.amount += amount; cbResA.delta = amount; }

      const baRes = sheets.bank_a?.assets.find((i) => i.id === 'ba_reserves');
      if (baRes) { baRes.amount += amount; baRes.delta = amount; }
      const baDep = sheets.bank_a?.liabilities.find((i) => i.id === 'ba_dep_ind');
      if (baDep) { baDep.amount += amount; baDep.delta = amount; }

      const indDep = sheets.individual?.assets.find((i) => i.id === 'ind_dep_bank_a');
      if (indDep) { indDep.amount += amount; indDep.delta = amount; }

      journalList.push(
        { entityId: 'central_bank', accountName: 'Treasury TGA', type: 'debit', amount, category: 'liability' },
        { entityId: 'central_bank', accountName: 'Bank A Reserves', type: 'credit', amount, category: 'liability' },
        { entityId: 'bank_a', accountName: 'Central Bank Reserves', type: 'debit', amount, category: 'asset' },
        { entityId: 'bank_a', accountName: 'Individual Deposits', type: 'credit', amount, category: 'liability' }
      );
    } else if (txType === 'loan_repayment') {
      description = `Individual repays $${amount}B of mortgage debt at Bank B.`;
      const indDep = sheets.individual?.assets.find((i) => i.id === 'ind_dep_bank_b');
      if (indDep) { indDep.amount -= amount; indDep.delta = -amount; }
      const indLoan = sheets.individual?.liabilities.find((i) => i.id === 'ind_bank_loans');
      if (indLoan) { indLoan.amount -= amount; indLoan.delta = -amount; }

      const bbDep = sheets.bank_b?.liabilities.find((i) => i.id === 'bb_dep_ind');
      if (bbDep) { bbDep.amount -= amount; bbDep.delta = -amount; }
      const bbLoan = sheets.bank_b?.assets.find((i) => i.id === 'bb_loans');
      if (bbLoan) { bbLoan.amount -= amount; bbLoan.delta = -amount; }

      journalList.push(
        { entityId: 'bank_b', accountName: 'Individual Deposits', type: 'debit', amount, category: 'liability' },
        { entityId: 'bank_b', accountName: 'Commercial Loans', type: 'credit', amount, category: 'asset' },
        { entityId: 'individual', accountName: 'Bank Loans Owed', type: 'debit', amount, category: 'liability' },
        { entityId: 'individual', accountName: 'Bank B Deposits', type: 'credit', amount, category: 'asset' }
      );
    } else if (txType === 'bank_pension_repo') {
      description = `Bank A enters a $${amount}B Repo agreement with Pension Fund.`;
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
    } else if (txType === 'corp_bond_issuance') {
      description = `Private Corporation issues $${amount}B corporate bonds to Pension Fund paid with Bank A deposits.`;
      const corpDep = sheets.corporation?.assets.find((i) => i.id === 'corp_bank_dep');
      if (corpDep) { corpDep.amount += amount; corpDep.delta = amount; }
      const corpBond = sheets.corporation?.liabilities.find((i) => i.id === 'corp_bonds_issued');
      if (corpBond) { corpBond.amount += amount; corpBond.delta = amount; }

      const pfDep = sheets.pension_fund?.assets.find((i) => i.id === 'pf_bank_dep');
      if (pfDep) { pfDep.amount -= amount; pfDep.delta = -amount; }
      const pfCorpBond = sheets.pension_fund?.assets.find((i) => i.id === 'pf_corp_bonds');
      if (pfCorpBond) { pfCorpBond.amount += amount; pfCorpBond.delta = amount; }

      const baDepPF = sheets.bank_a?.liabilities.find((i) => i.id === 'ba_dep_pension');
      if (baDepPF) { baDepPF.amount -= amount; baDepPF.delta = -amount; }
      const baDepCorp = sheets.bank_a?.liabilities.find((i) => i.id === 'ba_dep_corp');
      if (baDepCorp) { baDepCorp.amount += amount; baDepCorp.delta = amount; }

      journalList.push(
        { entityId: 'corporation', accountName: 'Bank Deposits', type: 'debit', amount, category: 'asset' },
        { entityId: 'corporation', accountName: 'Corporate Bonds Issued', type: 'credit', amount, category: 'liability' },
        { entityId: 'pension_fund', accountName: 'Corporate Bonds', type: 'debit', amount, category: 'asset' },
        { entityId: 'pension_fund', accountName: 'Bank Deposits', type: 'credit', amount, category: 'asset' }
      );
    } else if (txType === 'hf_repo_treasury') {
      description = `Hedge Fund borrows $${amount}B via Repo at Bank A and buys $${amount}B Treasuries from Pension Fund.`;
      const hfTreas = sheets.hedge_fund?.assets.find((i) => i.id === 'hf_treasuries');
      if (hfTreas) { hfTreas.amount += amount; hfTreas.delta = amount; }
      const hfRepo = sheets.hedge_fund?.liabilities.find((i) => i.id === 'hf_repo_liab');
      if (hfRepo) { hfRepo.amount += amount; hfRepo.delta = amount; }

      const pfTreas = sheets.pension_fund?.assets.find((i) => i.id === 'pf_treasuries');
      if (pfTreas) { pfTreas.amount -= amount; pfTreas.delta = -amount; }
      const pfDep = sheets.pension_fund?.assets.find((i) => i.id === 'pf_bank_dep');
      if (pfDep) { pfDep.amount += amount; pfDep.delta = amount; }

      const baLoan = sheets.bank_a?.assets.find((i) => i.id === 'ba_loans');
      if (baLoan) { baLoan.amount += amount; baLoan.delta = amount; }
      const baDepPF = sheets.bank_a?.liabilities.find((i) => i.id === 'ba_dep_pension');
      if (baDepPF) { baDepPF.amount += amount; baDepPF.delta = amount; }

      journalList.push(
        { entityId: 'hedge_fund', accountName: 'US Treasuries', type: 'debit', amount, category: 'asset' },
        { entityId: 'hedge_fund', accountName: 'Bank Repo Loan Liabilities', type: 'credit', amount, category: 'liability' },
        { entityId: 'pension_fund', accountName: 'Bank Deposits', type: 'debit', amount, category: 'asset' },
        { entityId: 'pension_fund', accountName: 'US Treasuries', type: 'credit', amount, category: 'asset' }
      );
    }

    const journal: JournalEntry = {
      id: `sandbox_${Date.now()}`,
      stepNumber: 99,
      timestamp: new Date().toLocaleTimeString(),
      title: activeOption.title,
      description,
      entries: journalList,
    };

    setLogMessages((prev) => [{ title: activeOption.title, desc: description }, ...prev]);
    onApplyCustomTx(sheets, journal);
  };

  // AI-Powered Natural Language Simulation Execution
  const handleExecuteAiSimulation = async () => {
    if (!aiPromptInput.trim()) return;
    setIsAiLoading(true);
    setAiError(null);

    try {
      const res = await fetch('/api/sandbox-ai-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: aiPromptInput,
          currentSheets,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'AI transaction execution failed.');
      }

      // Clone sheets
      const sheets: Record<string, EntityBalanceSheet> = JSON.parse(JSON.stringify(currentSheets));
      const journalEntries: JournalEntry['entries'] = [];

      if (Array.isArray(data.entries)) {
        data.entries.forEach((entry: any) => {
          const entity = sheets[entry.entityId];
          if (!entity) return;

          const category = entry.category || 'asset';
          const list = entity[category as 'assets' | 'liabilities' | 'equity'];
          if (!list) return;

          // Find or create account
          let account = list.find(
            (item) => item.name.toLowerCase() === entry.accountName.toLowerCase() || item.id === entry.accountName
          );

          if (!account) {
            account = {
              id: `${entry.entityId}_ai_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
              name: entry.accountName,
              amount: 0,
              category: category as 'asset' | 'liability' | 'equity',
            };
            list.push(account);
          }

          // Calculate signed delta
          let delta = 0;
          if (category === 'asset') {
            delta = entry.type === 'debit' ? entry.amount : -entry.amount;
          } else {
            // Liability or Equity
            delta = entry.type === 'credit' ? entry.amount : -entry.amount;
          }

          account.amount = Math.max(0, account.amount + delta);
          account.delta = (account.delta || 0) + delta;

          journalEntries.push({
            entityId: entry.entityId,
            accountName: entry.accountName,
            type: entry.type,
            amount: entry.amount,
            category: category as 'asset' | 'liability' | 'equity',
          });
        });
      }

      const journal: JournalEntry = {
        id: `ai_sandbox_${Date.now()}`,
        stepNumber: 99,
        timestamp: new Date().toLocaleTimeString(),
        title: data.title || 'AI Simulated Transaction',
        description: data.description || aiPromptInput,
        entries: journalEntries,
      };

      setLogMessages((prev) => [
        {
          title: `AI: ${data.title || 'Simulated Transaction'}`,
          desc: data.description || aiPromptInput,
          explanation: data.accountingExplanation,
        },
        ...prev,
      ]);

      onApplyCustomTx(sheets, journal);
      setAiPromptInput('');
    } catch (err: any) {
      console.error('AI Simulation Error:', err);
      setAiError(err.message || 'Failed to simulate transaction via AI.');
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="bg-white border border-[#E2DDD5] rounded-xl p-6 shadow-xs space-y-6 text-[#1A1A1A]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2DDD5] pb-4">
        <div>
          <h2 className="text-xl font-serif font-normal tracking-tight text-[#1A1A1A] flex items-center space-x-2">
            <Wrench className="w-5 h-5 text-[#1A1A1A]" />
            <span>Monetary Sandbox & Custom Transaction Engine</span>
          </h2>
          <p className="text-xs font-sans text-zinc-500 mt-0.5">
            Test custom double-entry flows across Central Bank, Treasury, Banks, Pension Funds, Corporations, and Hedge Funds.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          {/* Mode Switcher */}
          <div className="bg-zinc-100 p-1 rounded-lg border border-zinc-200 flex items-center space-x-1 text-xs font-sans">
            <button
              onClick={() => setSandboxMode('manual')}
              className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer flex items-center space-x-1.5 ${
                sandboxMode === 'manual'
                  ? 'bg-white text-[#1A1A1A] shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Standard Options</span>
            </button>
            <button
              onClick={() => setSandboxMode('ai')}
              className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer flex items-center space-x-1.5 ${
                sandboxMode === 'ai'
                  ? 'bg-[#1A1A1A] text-white shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>AI Prompt Simulator</span>
            </button>
          </div>

          <button
            onClick={() => setShowVectorSummary(!showVectorSummary)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-sans font-medium rounded-lg border shadow-xs transition cursor-pointer ${
              showVectorSummary
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-[#FAF8F5] hover:bg-zinc-100 text-zinc-700 border-[#E2DDD5]'
            }`}
            title={showVectorSummary ? 'Hide Step Vector Summary' : 'Show Step Vector Summary'}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{showVectorSummary ? 'Hide Vector Summary' : '+ Vector Summary'}</span>
          </button>

          <button
            onClick={onResetSandbox}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#FAF8F5] hover:bg-zinc-100 text-zinc-700 text-xs font-sans font-medium rounded-lg border border-[#E2DDD5] shadow-xs transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Sandbox</span>
          </button>
        </div>
      </div>

      {/* MODE 1: MANUAL TRANSACTION SETUP PANEL */}
      {sandboxMode === 'manual' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#FAF8F5] p-4.5 rounded-xl border border-[#E2DDD5]">
          {/* Dropdown Selector */}
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

          {/* Execute Button */}
          <div className="flex items-end">
            <button
              onClick={handleExecuteManual}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-[#1A1A1A] hover:bg-zinc-800 text-white font-sans font-medium text-xs rounded-lg shadow-xs transition cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Apply Double-Entry Transaction</span>
            </button>
          </div>
        </div>
      )}

      {/* MODE 2: AI NATURAL LANGUAGE PROMPT SIMULATOR */}
      {sandboxMode === 'ai' && (
        <div className="bg-[#FAF8F5] p-5 rounded-xl border border-[#E2DDD5] space-y-4">
          <div className="flex items-center space-x-2 text-xs font-sans text-zinc-700">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="font-semibold">AI Natural Language Transaction Engine:</span>
            <span className="text-zinc-500">
              Describe any financial transaction in natural language (e.g. involving Central Bank, Treasury, Banks, Pension Funds, Corporation, or Hedge Fund).
            </span>
          </div>

          <div className="space-y-2">
            <textarea
              rows={3}
              value={aiPromptInput}
              onChange={(e) => setAiPromptInput(e.target.value)}
              placeholder="e.g. Private Corporation issues $60B corporate bonds to Hedge Fund. Hedge Fund pays using Bank A deposits. Central Bank then buys $20B Treasuries from Hedge Fund..."
              className="w-full bg-white text-xs font-sans p-3 rounded-lg border border-[#E2DDD5] focus:outline-none focus:border-[#1A1A1A] shadow-xs text-[#1A1A1A] placeholder:text-zinc-400"
            />

            {/* Quick Suggestion Presets */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-sans font-semibold text-zinc-500 uppercase tracking-wider block">
                Quick Example Transactions:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {aiPromptPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => setAiPromptInput(preset)}
                    className="text-[11px] font-sans bg-white hover:bg-zinc-100 text-zinc-700 border border-[#E2DDD5] px-2.5 py-1 rounded-md transition cursor-pointer text-left"
                  >
                    "{preset}"
                  </button>
                ))}
              </div>
            </div>
          </div>

          {aiError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg font-sans">
              {aiError}
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={handleExecuteAiSimulation}
              disabled={isAiLoading || !aiPromptInput.trim()}
              className="flex items-center space-x-2 px-5 py-2.5 bg-[#1A1A1A] hover:bg-zinc-800 disabled:bg-zinc-300 text-white font-sans font-medium text-xs rounded-lg shadow-xs transition cursor-pointer"
            >
              {isAiLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                  <span>AI Simulating Mechanics...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>AI Process & Apply Double-Entry Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Execution Log */}
      {logMessages.length > 0 && (
        <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#E2DDD5] space-y-3">
          <div className="text-xs font-sans font-semibold uppercase tracking-wider text-zinc-500">
            Sandbox Transaction Execution History
          </div>
          <div className="space-y-2 font-mono text-xs max-h-48 overflow-y-auto">
            {logMessages.map((msg, idx) => (
              <div key={idx} className="bg-white p-3 rounded-lg border border-zinc-200 space-y-1">
                <div className="text-[#1A1A1A] font-bold flex items-center space-x-2">
                  <ArrowRight className="w-3.5 h-3.5 text-[#D93829] shrink-0" />
                  <span>{msg.title}</span>
                </div>
                <div className="text-zinc-600 font-sans text-xs pl-5.5">{msg.desc}</div>
                {msg.explanation && (
                  <div className="mt-2 pt-2 border-t border-zinc-100 text-zinc-700 font-sans text-xs bg-amber-50/50 p-2.5 rounded border border-amber-200/60 leading-relaxed">
                    <span className="font-semibold text-amber-900 block mb-0.5">AI Accounting Analysis:</span>
                    {msg.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Embedded Vector Summary when active */}
      {showVectorSummary && currentSheets && (
        <div className="pt-2 border-t border-[#E2DDD5]">
          <ParticipantAdjustmentsSummary
            currentBalanceSheets={currentSheets}
            title="Sandbox Balance Adjustments Vector Summary"
            onClose={() => setShowVectorSummary(false)}
          />
        </div>
      )}
    </div>
  );
};
