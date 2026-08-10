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

  const renderItemRow = (item: AccountItem, categoryColorClass: string) => {
    const hasDelta = item.delta !== undefined && item.delta !== 0;
    const isPositiveDelta = (item.delta || 0) > 0;

    return (
      <div
        key={item.id}
        className={`p-2 rounded-lg text-[11px] transition duration-150 border space-y-1.5 ${
          hasDelta
            ? isPositiveDelta
              ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950 font-medium shadow-xs'
              : 'bg-rose-50/90 border-rose-300 text-rose-950 font-medium shadow-xs'
            : 'bg-zinc-50/80 border-zinc-200/80 text-zinc-800 hover:bg-zinc-100/80'
        }`}
      >
        {/* Main Line: Item Name & Amount */}
        <div className="flex items-start justify-between gap-1">
          <div className="flex items-center space-x-1 min-w-0 flex-1">
            <span className="font-sans font-medium text-[11px] leading-tight text-zinc-900 break-words">
              {item.name}
            </span>
            {item.detail && (
              <div className="relative group/tooltip shrink-0">
                <Info className="w-3 h-3 text-zinc-400 hover:text-zinc-700 cursor-pointer" />
                <div className="absolute left-0 bottom-full mb-1.5 hidden group-hover/tooltip:block w-44 p-2 bg-[#1A1A1A] text-[10px] font-sans text-zinc-200 rounded-md shadow-xl z-50 pointer-events-none">
                  {item.detail}
                </div>
              </div>
            )}
          </div>

          <span className="font-mono font-semibold text-[11px] text-[#1A1A1A] shrink-0">
            {formatCurrency(item.amount)}
          </span>
        </div>

        {/* Change Box: Placed JUST BELOW the line item */}
        {hasDelta && (
          <div className="flex items-center justify-start pt-0.5">
            <span
              className={`inline-flex items-center text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded border ${
                isPositiveDelta
                  ? 'bg-emerald-100/90 text-emerald-900 border-emerald-300'
                  : 'bg-rose-100/90 text-rose-900 border-rose-300'
              }`}
            >
              {isPositiveDelta ? (
                <ArrowUpRight className="w-3 h-3 mr-0.5 text-emerald-700 shrink-0" />
              ) : (
                <ArrowDownRight className="w-3 h-3 mr-0.5 text-rose-700 shrink-0" />
              )}
              {isPositiveDelta ? '+' : ''}
              {formatCurrency(item.delta || 0)}
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={`bg-white border rounded-xl shadow-xs transition-all duration-200 overflow-hidden flex flex-col h-full ${
        isFocused
          ? 'border-[#1A1A1A] ring-2 ring-zinc-300 shadow-md'
          : 'border-[#E2DDD5] hover:border-zinc-400'
      }`}
    >
      {/* Entity Card Header */}
      <div className="p-3.5 bg-[#FAF8F5] border-b border-[#E2DDD5] flex items-start justify-between gap-2 shrink-0">
        <div>
          <h3 className="text-base font-serif font-medium text-[#1A1A1A] tracking-tight">
            {entity.name}
          </h3>
          <p className="text-xs font-sans text-zinc-500 mt-0.5 line-clamp-1">{entity.description}</p>
        </div>

        <span className="text-[10px] font-sans font-medium tracking-wide uppercase px-2.5 py-1 bg-zinc-900 text-white rounded-md shrink-0">
          {entity.badgeText}
        </span>
      </div>

      {/* 3-Column T-Account Header: Assets | Liabilities | Equity */}
      <div className="grid grid-cols-3 bg-[#1A1A1A] text-white text-[10px] font-sans font-medium tracking-wider uppercase border-b border-[#1A1A1A] shrink-0">
        <div className="py-2 px-2.5 border-r border-zinc-700 flex flex-col sm:flex-row sm:items-center justify-between text-zinc-200">
          <span className="text-zinc-300">1. ASSETS</span>
          <span className="font-mono text-white font-semibold">{formatCurrency(totalAssets)}</span>
        </div>
        <div className="py-2 px-2.5 border-r border-zinc-700 flex flex-col sm:flex-row sm:items-center justify-between text-rose-300">
          <span className="text-rose-300">2. LIABILITIES</span>
          <span className="font-mono text-white font-semibold">{formatCurrency(totalLiabilities)}</span>
        </div>
        <div className="py-2 px-2.5 flex flex-col sm:flex-row sm:items-center justify-between text-amber-200">
          <span className="text-amber-200">3. EQUITY</span>
          <span className="font-mono text-white font-semibold">{formatCurrency(totalEquity)}</span>
        </div>
      </div>

      {/* 3-Column T-Account Body: Assets (Col 1) | Liabilities (Col 2) | Equity (Col 3) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#E2DDD5] min-h-[160px] bg-white text-xs flex-1">
        
        {/* Column 1: Assets */}
        <div className="p-3 space-y-2 bg-[#FAF8F5]/30">
          <div className="text-[10px] font-sans font-semibold text-zinc-500 uppercase tracking-wider pb-1 border-b border-zinc-200/80 flex justify-between items-center">
            <span>OWNED ASSETS</span>
            <span className="text-[9px] font-mono font-medium text-zinc-400">Debit (+)</span>
          </div>
          {entity.assets.length === 0 ? (
            <div className="text-xs font-sans text-zinc-400 italic p-2 text-center">No assets</div>
          ) : (
            entity.assets.map((item) => renderItemRow(item, 'emerald'))
          )}
        </div>

        {/* Column 2: Liabilities */}
        <div className="p-3 space-y-2 bg-white">
          <div className="text-[10px] font-sans font-semibold text-rose-800 uppercase tracking-wider pb-1 border-b border-zinc-200/80 flex justify-between items-center">
            <span>OWED LIABILITIES</span>
            <span className="text-[9px] font-mono font-medium text-zinc-400">Credit (-)</span>
          </div>
          {entity.liabilities.length === 0 ? (
            <div className="text-xs font-sans text-zinc-400 italic p-2 text-center">No liabilities</div>
          ) : (
            entity.liabilities.map((item) => renderItemRow(item, 'rose'))
          )}
        </div>

        {/* Column 3: Equity */}
        <div className="p-3 space-y-2 bg-[#FAF8F5]/30">
          <div className="text-[10px] font-sans font-semibold text-amber-800 uppercase tracking-wider pb-1 border-b border-zinc-200/80 flex justify-between items-center">
            <span>NET CAPITAL</span>
          </div>
          {entity.equity.length === 0 ? (
            <div className="text-xs font-sans text-zinc-400 italic p-2 text-center">Zero equity</div>
          ) : (
            entity.equity.map((item) => renderItemRow(item, 'amber'))
          )}
        </div>

      </div>

      {/* Card Footer: Ledger Identity Verification */}
      <div className="p-2.5 bg-[#FAF8F5] border-t border-[#E2DDD5] flex items-center justify-between text-xs font-sans text-[#1A1A1A] mt-auto shrink-0">
        <div className="flex items-center space-x-1.5 text-zinc-600">
          <Scale className="w-3.5 h-3.5" />
          <span className="text-[10px] font-medium uppercase tracking-wider">BALANCE IDENTITY:</span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-mono font-medium text-zinc-700">
            {formatCurrency(totalAssets)} = {formatCurrency(totalLiabilities)} + {formatCurrency(totalEquity)}
          </span>
          <span
            className={`text-[10px] font-sans font-semibold px-2 py-0.5 rounded-full border ${
              isBalanced
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}
          >
            {isBalanced ? 'Balanced' : 'Imbalance'}
          </span>
        </div>
      </div>
    </div>
  );
};
