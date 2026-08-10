import React from 'react';
import { SystemMacroStats } from '../types/monetary';
import { formatCurrency } from '../utils/monetaryEngine';
import { ShieldCheck, Landmark, Vault, Wallet, Building2 } from 'lucide-react';

interface MacroIndicatorsBarProps {
  stats: SystemMacroStats;
}

export const MacroIndicatorsBar: React.FC<MacroIndicatorsBarProps> = ({ stats }) => {
  return (
    <div className="bg-[#FAF8F5] border-b border-[#E2DDD5] py-3.5 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        
        {/* M0 Base Money */}
        <div className="bg-white p-3.5 rounded-xl border border-[#E2DDD5] shadow-xs flex items-center space-x-3">
          <div className="p-2 bg-[#FAF8F5] text-[#1A1A1A] rounded-lg border border-[#E2DDD5] shrink-0">
            <Landmark className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-sans font-semibold uppercase tracking-wider text-zinc-500">
              Base Money (M0)
            </div>
            <div className="text-base font-serif font-medium text-[#1A1A1A]">
              {formatCurrency(stats.m0BaseMoney)}
            </div>
            <div className="text-[10px] font-sans text-zinc-400">Central Bank Balance Sheet</div>
          </div>
        </div>

        {/* Central Bank Reserves */}
        <div className="bg-white p-3.5 rounded-xl border border-[#E2DDD5] shadow-xs flex items-center space-x-3">
          <div className="p-2 bg-[#FAF8F5] text-[#1A1A1A] rounded-lg border border-[#E2DDD5] shrink-0">
            <Vault className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-sans font-semibold uppercase tracking-wider text-zinc-500">
              Total Reserves
            </div>
            <div className="text-base font-serif font-medium text-[#1A1A1A]">
              {formatCurrency(stats.totalReserves)}
            </div>
            <div className="text-[10px] font-sans text-zinc-400">Interbank Settlement Funds</div>
          </div>
        </div>

        {/* Broad Money M1 */}
        <div className="bg-white p-3.5 rounded-xl border border-[#E2DDD5] shadow-xs flex items-center space-x-3">
          <div className="p-2 bg-[#FAF8F5] text-[#1A1A1A] rounded-lg border border-[#E2DDD5] shrink-0">
            <Wallet className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-sans font-semibold uppercase tracking-wider text-zinc-500">
              Broad Money (M1)
            </div>
            <div className="text-base font-serif font-medium text-[#1A1A1A]">
              {formatCurrency(stats.m1BroadMoney)}
            </div>
            <div className="text-[10px] font-sans text-zinc-400">Customer Bank Deposits</div>
          </div>
        </div>

        {/* TGA Balance */}
        <div className="bg-white p-3.5 rounded-xl border border-[#E2DDD5] shadow-xs flex items-center space-x-3">
          <div className="p-2 bg-[#FAF8F5] text-[#D93829] rounded-lg border border-[#E2DDD5] shrink-0">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-sans font-semibold uppercase tracking-wider text-zinc-500">
              TGA Account
            </div>
            <div className="text-base font-serif font-medium text-[#1A1A1A]">
              {formatCurrency(stats.tgaBalance)}
            </div>
            <div className="text-[10px] font-sans text-zinc-400">Treasury General Account</div>
          </div>
        </div>

        {/* Double-Entry Verification Status */}
        <div className="col-span-2 sm:col-span-1 bg-white p-3.5 rounded-xl border border-[#E2DDD5] shadow-xs flex items-center space-x-3">
          <div className={`p-2 rounded-lg border shrink-0 ${
            stats.systemBalanceCheck 
              ? 'bg-emerald-50/80 text-emerald-800 border-emerald-200' 
              : 'bg-rose-50/80 text-rose-800 border-rose-200'
          }`}>
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-sans font-semibold uppercase tracking-wider text-zinc-500">
              Double-Entry Check
            </div>
            <div className={`text-sm font-sans font-semibold ${
              stats.systemBalanceCheck ? 'text-emerald-800' : 'text-rose-800'
            }`}>
              {stats.systemBalanceCheck ? '100% Balanced' : 'Unbalanced'}
            </div>
            <div className="text-[10px] font-sans text-zinc-400">
              Assets = Liab + Equity
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
