import React from 'react';
import { SystemMacroStats } from '../types/monetary';
import { formatCurrency } from '../utils/monetaryEngine';
import { ShieldCheck, Landmark, Vault, Wallet, Building2 } from 'lucide-react';

interface MacroIndicatorsBarProps {
  stats: SystemMacroStats;
}

export const MacroIndicatorsBar: React.FC<MacroIndicatorsBarProps> = ({ stats }) => {
  return (
    <div className="bg-slate-900/90 border-b border-slate-800 backdrop-blur text-slate-100 py-3 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        
        {/* M0 Base Money */}
        <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60 flex items-start space-x-3 shadow-sm">
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20">
            <Landmark className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Base Money (M0)
            </div>
            <div className="text-base font-bold text-slate-100 tracking-tight">
              {formatCurrency(stats.m0BaseMoney)}
            </div>
            <div className="text-[10px] text-slate-400">Fed Balance Sheet Size</div>
          </div>
        </div>

        {/* Central Bank Reserves */}
        <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60 flex items-start space-x-3 shadow-sm">
          <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20">
            <Vault className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Total Reserves
            </div>
            <div className="text-base font-bold text-slate-100 tracking-tight">
              {formatCurrency(stats.totalReserves)}
            </div>
            <div className="text-[10px] text-slate-400">Interbank Settlement Funds</div>
          </div>
        </div>

        {/* Broad Money M1 */}
        <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60 flex items-start space-x-3 shadow-sm">
          <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20">
            <Wallet className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Broad Money (M1)
            </div>
            <div className="text-base font-bold text-slate-100 tracking-tight">
              {formatCurrency(stats.m1BroadMoney)}
            </div>
            <div className="text-[10px] text-slate-400">Bank Customer Deposits</div>
          </div>
        </div>

        {/* TGA Balance */}
        <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60 flex items-start space-x-3 shadow-sm">
          <div className="p-2 bg-rose-500/10 text-rose-400 rounded-lg border border-rose-500/20">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              TGA Account
            </div>
            <div className="text-base font-bold text-slate-100 tracking-tight">
              {formatCurrency(stats.tgaBalance)}
            </div>
            <div className="text-[10px] text-slate-400">Treasury Fed Cash Account</div>
          </div>
        </div>

        {/* Double-Entry Verification Status */}
        <div className="col-span-2 sm:col-span-1 bg-slate-800/80 rounded-xl p-3 border border-slate-700/60 flex items-start space-x-3 shadow-sm">
          <div className={`p-2 rounded-lg border ${
            stats.systemBalanceCheck 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
          }`}>
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Double-Entry Check
            </div>
            <div className={`text-base font-bold tracking-tight ${
              stats.systemBalanceCheck ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              {stats.systemBalanceCheck ? '100% Balanced' : 'Unbalanced!'}
            </div>
            <div className="text-[10px] text-slate-400">
              Assets = Liabilities + Equity
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
