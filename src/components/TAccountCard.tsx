import React from 'react';
import { EntityBalanceSheet, AccountItem } from '../types/monetary';
import { formatCurrency } from '../utils/monetaryEngine';
import { Info, ArrowUpRight, ArrowDownRight, Scale } from 'lucide-react';

interface TAccountCardProps {
  entity: EntityBalanceSheet;
  isFocused?: boolean;
}

export const TAccountCard: React.FC<TAccountCardProps> = ({ entity, isFocused }) => {
  const totalAssets = entity.assets.reduce((sum, item) => sum + item.amount, 0);
  const totalLiabilities = entity.liabilities.reduce((sum, item) => sum + item.amount, 0);
  const totalEquity = entity.equity.reduce((sum, item) => sum + item.amount, 0);
  const totalLiabEquity = totalLiabilities + totalEquity;

  const isBalanced = Math.abs(totalAssets - totalLiabEquity) < 0.001;

  // Theme color maps
  const colorStyles: Record<string, { badgeBg: string; text: string; border: string; glow: string }> = {
    emerald: {
      badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      text: 'text-emerald-400',
      border: 'border-emerald-500/30',
      glow: 'shadow-emerald-500/10',
    },
    blue: {
      badgeBg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      text: 'text-blue-400',
      border: 'border-blue-500/30',
      glow: 'shadow-blue-500/10',
    },
    indigo: {
      badgeBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
      text: 'text-indigo-400',
      border: 'border-indigo-500/30',
      glow: 'shadow-indigo-500/10',
    },
    amber: {
      badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      text: 'text-amber-400',
      border: 'border-amber-500/30',
      glow: 'shadow-amber-500/10',
    },
    violet: {
      badgeBg: 'bg-violet-500/10 text-violet-400 border-violet-500/30',
      text: 'text-violet-400',
      border: 'border-violet-500/30',
      glow: 'shadow-violet-500/10',
    },
    rose: {
      badgeBg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      text: 'text-rose-400',
      border: 'border-rose-500/30',
      glow: 'shadow-rose-500/10',
    },
  };

  const currentTheme = colorStyles[entity.color] || colorStyles.emerald;

  const renderItemRow = (item: AccountItem) => {
    const hasDelta = item.delta !== undefined && item.delta !== 0;
    const isPositiveDelta = (item.delta || 0) > 0;

    return (
      <div
        key={item.id}
        className={`group flex items-center justify-between p-2 rounded-lg text-xs transition duration-200 border ${
          hasDelta
            ? isPositiveDelta
              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200 font-semibold shadow-sm animate-pulse'
              : 'bg-rose-500/15 border-rose-500/40 text-rose-200 font-semibold shadow-sm animate-pulse'
            : 'bg-slate-800/40 border-slate-700/40 text-slate-300 hover:bg-slate-800/80 hover:border-slate-600'
        }`}
      >
        <div className="flex items-center space-x-1.5 min-w-0 pr-2">
          <span className="truncate">{item.name}</span>
          {item.detail && (
            <div className="relative group/tooltip">
              <Info className="w-3.5 h-3.5 text-slate-500 hover:text-slate-300 cursor-pointer flex-shrink-0" />
              <div className="absolute left-0 bottom-full mb-2 hidden group-hover/tooltip:block w-48 p-2 bg-slate-900 text-[11px] font-normal text-slate-200 rounded-lg border border-slate-700 shadow-xl z-50 pointer-events-none">
                {item.detail}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2 flex-shrink-0 font-mono">
          {hasDelta && (
            <span
              className={`flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded ${
                isPositiveDelta
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : 'bg-rose-500/20 text-rose-300'
              }`}
            >
              {isPositiveDelta ? (
                <ArrowUpRight className="w-3 h-3 mr-0.5" />
              ) : (
                <ArrowDownRight className="w-3 h-3 mr-0.5" />
              )}
              {isPositiveDelta ? '+' : ''}
              {item.delta}B
            </span>
          )}
          <span className="font-bold">{formatCurrency(item.amount)}</span>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`bg-slate-900 border rounded-2xl overflow-hidden shadow-xl transition-all duration-300 ${
        isFocused
          ? `border-2 ${currentTheme.border} ${currentTheme.glow} ring-2 ring-emerald-500/30 scale-[1.01]`
          : 'border-slate-800 hover:border-slate-700'
      }`}
    >
      {/* Entity Header */}
      <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-sm font-bold text-slate-100 tracking-tight">
              {entity.name}
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{entity.description}</p>
        </div>

        <span className={`text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full border ${currentTheme.badgeBg} shrink-0`}>
          {entity.badgeText}
        </span>
      </div>

      {/* T-Account Header Bar */}
      <div className="grid grid-cols-2 bg-slate-950 border-b border-slate-800 text-[11px] font-bold tracking-wider uppercase">
        <div className="py-2 px-3 text-emerald-400 border-r border-slate-800 flex items-center justify-between">
          <span>ASSETS (DEBIT)</span>
          <span className="font-mono text-slate-300">{formatCurrency(totalAssets)}</span>
        </div>
        <div className="py-2 px-3 text-blue-400 flex items-center justify-between">
          <span>LIABILITIES & EQUITY (CREDIT)</span>
          <span className="font-mono text-slate-300">{formatCurrency(totalLiabEquity)}</span>
        </div>
      </div>

      {/* T-Account Body: Left vs Right columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800/80 min-h-[160px]">
        {/* Left Side: Assets */}
        <div className="p-3 space-y-2 bg-slate-900/50">
          <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Owned Assets (+)
          </div>
          {entity.assets.length === 0 ? (
            <div className="text-xs text-slate-600 italic p-2 text-center">No assets listed</div>
          ) : (
            entity.assets.map(renderItemRow)
          )}
        </div>

        {/* Right Side: Liabilities & Equity */}
        <div className="p-3 space-y-3 bg-slate-900/50">
          {/* Liabilities */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Owed Liabilities (-)
            </div>
            {entity.liabilities.length === 0 ? (
              <div className="text-xs text-slate-600 italic p-2 text-center">No liabilities</div>
            ) : (
              entity.liabilities.map(renderItemRow)
            )}
          </div>

          {/* Equity */}
          {entity.equity.length > 0 && (
            <div className="space-y-1.5 pt-2 border-t border-slate-800/60">
              <div className="text-[10px] font-semibold text-amber-500/80 uppercase tracking-wider mb-1">
                Net Worth & Equity Capital
              </div>
              {entity.equity.map(renderItemRow)}
            </div>
          )}
        </div>
      </div>

      {/* Footer: Balance Verification */}
      <div className="p-2.5 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center space-x-1.5 text-slate-400">
          <Scale className="w-3.5 h-3.5" />
          <span className="text-[11px]">Ledger Check:</span>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-[11px] text-slate-400">
            {formatCurrency(totalAssets)} = {formatCurrency(totalLiabilities)} + {formatCurrency(totalEquity)}
          </span>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
              isBalanced
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
            }`}
          >
            {isBalanced ? 'BALANCED' : 'IMBALANCE'}
          </span>
        </div>
      </div>
    </div>
  );
};
