import React, { useState } from 'react';
import { EntityBalanceSheet, EntityId } from '../types/monetary';
import { formatCurrency } from '../utils/monetaryEngine';
import { BarChart3, Scale, Layers, Filter, TrendingUp, Landmark, Vault, Building2, Wallet, User, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface BalanceChartViewProps {
  balanceSheets: Record<string, EntityBalanceSheet>;
}

export const BalanceChartView: React.FC<BalanceChartViewProps> = ({ balanceSheets }) => {
  const [hoveredEntityName, setHoveredEntityName] = useState<string>('');

  const entityOrder: EntityId[] = ['central_bank', 'treasury', 'bank_a', 'bank_b', 'pension_fund', 'individual'];
  const entities = entityOrder.map((id) => balanceSheets[id]).filter(Boolean) as EntityBalanceSheet[];

  // Prepare data for the overall summary Bar Chart
  const summaryData = entities.map((e) => {
    const assets = e.assets.reduce((sum, a) => sum + a.amount, 0);
    const liabilities = e.liabilities.reduce((sum, l) => sum + l.amount, 0);
    const equity = e.equity.reduce((sum, eq) => sum + eq.amount, 0);

    const assetsDelta = e.assets.reduce((sum, a) => sum + (a.delta || 0), 0);
    const liabilitiesDelta = e.liabilities.reduce((sum, l) => sum + (l.delta || 0), 0);
    const equityDelta = e.equity.reduce((sum, eq) => sum + (eq.delta || 0), 0);

    const assetItemDeltas = e.assets.filter((a) => a.delta !== undefined && a.delta !== 0);
    const liabilityItemDeltas = e.liabilities.filter((l) => l.delta !== undefined && l.delta !== 0);
    const equityItemDeltas = e.equity.filter((eq) => eq.delta !== undefined && eq.delta !== 0);

    const hasItemChanges = assetItemDeltas.length > 0 || liabilityItemDeltas.length > 0 || equityItemDeltas.length > 0;

    // Stacking logic: if delta > 0, base is total - delta, add is delta
    const assetsBase = assetsDelta > 0 ? assets - assetsDelta : assets;
    const assetsAdd = assetsDelta > 0 ? assetsDelta : 0;

    const liabilitiesBase = liabilitiesDelta > 0 ? liabilities - liabilitiesDelta : liabilities;
    const liabilitiesAdd = liabilitiesDelta > 0 ? liabilitiesDelta : 0;

    const equityBase = equityDelta > 0 ? equity - equityDelta : equity;
    const equityAdd = equityDelta > 0 ? equityDelta : 0;

    return {
      id: e.id,
      name: e.shortName,
      fullName: e.name,
      entityObj: e,
      Assets: Number(assets.toFixed(1)),
      AssetsBase: Number(assetsBase.toFixed(1)),
      AssetsAdd: Number(assetsAdd.toFixed(1)),
      assetsDelta,
      assetItemDeltas,

      Liabilities: Number(liabilities.toFixed(1)),
      LiabilitiesBase: Number(liabilitiesBase.toFixed(1)),
      LiabilitiesAdd: Number(liabilitiesAdd.toFixed(1)),
      liabilitiesDelta,
      liabilityItemDeltas,

      Equity: Number(equity.toFixed(1)),
      EquityBase: Number(equityBase.toFixed(1)),
      EquityAdd: Number(equityAdd.toFixed(1)),
      equityDelta,
      equityItemDeltas,

      isBalanced: Math.abs(assets - (liabilities + equity)) < 0.1,
      hasChanges: hasItemChanges,
    };
  });

  const activeHoveredItem =
    summaryData.find((d) => d.name === hoveredEntityName || d.fullName === hoveredEntityName) ||
    summaryData.find((d) => d.hasChanges) ||
    summaryData[0];

  // Color palette inspired by warm editorial graphic design (matching user sample)
  const COLORS = {
    assets: '#1A1A1A',       // Rich charcoal black
    assetsAdd: '#10B981',    // Emerald stacked addition
    liabilities: '#D93829',  // Editorial Vermilion / Coral Red
    liabilitiesAdd: '#F59E0B', // Amber stacked addition
    equity: '#8C7C6D',       // Soft warm taupe / slate
    equityAdd: '#3B82F6',    // Vibrant blue stacked addition
    grid: '#E8E4DC',         // Warm sand grid lines
    cardBg: '#FAF8F5',       // Cream paper surface
  };

  const getEntityIcon = (id: string) => {
    switch (id) {
      case 'central_bank': return <Landmark className="w-4 h-4 text-[#1A1A1A]" />;
      case 'treasury': return <Building2 className="w-4 h-4 text-[#D93829]" />;
      case 'bank_a':
      case 'bank_b': return <Vault className="w-4 h-4 text-[#1A1A1A]" />;
      case 'pension_fund': return <Wallet className="w-4 h-4 text-[#8C7C6D]" />;
      default: return <User className="w-4 h-4 text-[#1A1A1A]" />;
    }
  };

  return (
    <div className="bg-[#FAF8F5] border border-[#E2DDD5] rounded-xl p-6 shadow-sm space-y-8 text-[#1A1A1A]">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-5 border-b border-[#E2DDD5]">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-sans font-semibold uppercase tracking-wider px-2.5 py-0.5 bg-[#1A1A1A] text-[#FAF8F5] rounded-full">
              VISUAL DATA ANALYTICS
            </span>
            <span className="text-xs font-serif italic text-zinc-600">
              Double-Entry T-Account Graphic Representation
            </span>
          </div>
          <h2 className="text-2xl font-serif font-normal text-[#1A1A1A] mt-1 tracking-tight">
            Balance Sheet Comparative Charting
          </h2>
          <p className="text-xs font-sans text-zinc-600 mt-1 max-w-2xl leading-relaxed">
            Graphic breakdown of Assets, Liabilities, and Equity across all key monetary system participants.
          </p>
        </div>
      </div>

      {/* Main Bar Chart Section */}
      <div className="bg-white p-6 rounded-xl border border-[#E2DDD5] space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-serif font-medium text-[#1A1A1A]">
              System-Wide Asset vs Liability vs Equity Totals
            </h3>
            <p className="text-xs font-sans text-zinc-500">
              Each entity balance sheet must satisfy: <span className="font-serif italic text-[#1A1A1A]">Assets = Liabilities + Equity</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs font-sans">
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-xs" style={{ backgroundColor: COLORS.assets }}></span>
              <span className="text-zinc-700 font-medium">Assets</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-xs" style={{ backgroundColor: COLORS.assetsAdd }}></span>
              <span className="text-emerald-800 font-medium">+Asset Stack</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-xs" style={{ backgroundColor: COLORS.liabilities }}></span>
              <span className="text-zinc-700 font-medium">Liabilities</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-xs" style={{ backgroundColor: COLORS.liabilitiesAdd }}></span>
              <span className="text-amber-800 font-medium">+Liab Stack</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-xs" style={{ backgroundColor: COLORS.equity }}></span>
              <span className="text-zinc-700 font-medium">Net Capital</span>
            </div>
          </div>
        </div>

        {/* Recharts Bar Chart Container */}
        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={summaryData}
              margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
              barGap={4}
              barCategoryGap="20%"
              onMouseMove={(state) => {
                if (state && state.activeLabel) {
                  setHoveredEntityName(state.activeLabel);
                }
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: '#4A4D52', fontSize: 12, fontFamily: 'Georgia, serif' }}
                axisLine={{ stroke: '#D8D2C8' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#6B7280', fontSize: 11, fontFamily: 'sans-serif' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => `$${val.toLocaleString()}`}
              />
              {/* Tooltip content disabled in favor of static panel below x-axis */}
              <Tooltip content={() => null} cursor={{ fill: '#FAF8F5' }} />

              {/* Stacked Assets */}
              <Bar dataKey="AssetsBase" stackId="assets" fill={COLORS.assets} radius={[2, 2, 0, 0]} />
              <Bar dataKey="AssetsAdd" stackId="assets" fill={COLORS.assetsAdd} radius={[4, 4, 0, 0]} />

              {/* Stacked Liabilities */}
              <Bar dataKey="LiabilitiesBase" stackId="liabilities" fill={COLORS.liabilities} radius={[2, 2, 0, 0]} />
              <Bar dataKey="LiabilitiesAdd" stackId="liabilities" fill={COLORS.liabilitiesAdd} radius={[4, 4, 0, 0]} />

              {/* Stacked Equity */}
              <Bar dataKey="EquityBase" stackId="equity" fill={COLORS.equity} radius={[2, 2, 0, 0]} />
              <Bar dataKey="EquityAdd" stackId="equity" fill={COLORS.equityAdd} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Static Inspection Area Directly Below Chart X-Axis */}
        <div className="bg-[#FAF8F5] border border-[#E2DDD5] rounded-xl p-4 text-xs font-sans space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-[#E2DDD5]">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 bg-white rounded-lg border border-[#E2DDD5] shrink-0">
                {getEntityIcon(activeHoveredItem.id)}
              </span>
              <div>
                <div className="font-serif font-medium text-sm text-[#1A1A1A] flex items-center space-x-2">
                  <span>{activeHoveredItem.fullName}</span>
                  {activeHoveredItem.hasChanges && (
                    <span className="text-[9px] font-sans font-semibold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                      Step Adjusted
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-zinc-500 font-sans">
                  Hover over chart bars above to inspect participant totals
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-sans font-semibold uppercase text-zinc-500 tracking-wider block">
                Balance Verification
              </span>
              <span className="font-mono text-xs font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                ${activeHoveredItem.Assets} = ${activeHoveredItem.Liabilities} + ${activeHoveredItem.Equity}
              </span>
            </div>
          </div>

          {/* Breakdown cards for the inspected entity */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Assets Box */}
            <div className="bg-white p-3 rounded-lg border border-[#E2DDD5] space-y-2">
              <div className="flex justify-between items-center text-zinc-600">
                <span className="font-semibold text-[#1A1A1A] uppercase text-[10px] tracking-wider">Total Assets</span>
                <span className="font-mono font-bold text-[#1A1A1A] text-sm">{formatCurrency(activeHoveredItem.Assets)}</span>
              </div>
              {activeHoveredItem.assetItemDeltas.length > 0 ? (
                <div className="pt-1.5 border-t border-zinc-100 space-y-1">
                  <div className="text-[9px] font-sans font-semibold text-zinc-500 uppercase">Itemized Asset Deltas:</div>
                  {activeHoveredItem.assetItemDeltas.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-[10px] font-mono">
                      <span className="text-zinc-700 truncate pr-1 font-sans">{item.name}:</span>
                      <span className={item.delta! > 0 ? 'text-emerald-800 font-bold' : 'text-rose-800 font-bold'}>
                        {item.delta! > 0 ? '+' : ''}{formatCurrency(item.delta!)}
                      </span>
                    </div>
                  ))}
                  <div className="pt-1">
                    {activeHoveredItem.assetsDelta === 0 ? (
                      <span className="text-[9px] font-sans font-semibold text-amber-900 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 block text-center">
                        Net Assets Total: $0 (Composition Shift)
                      </span>
                    ) : (
                      <span className={`inline-flex items-center text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded border ${
                        activeHoveredItem.assetsDelta > 0
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                          : 'bg-rose-100 text-rose-900 border-rose-300'
                      }`}>
                        {activeHoveredItem.assetsDelta > 0 ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                        Net Change: {activeHoveredItem.assetsDelta > 0 ? '+' : ''}{formatCurrency(activeHoveredItem.assetsDelta)}
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <span className="text-[10px] text-zinc-400 italic block pt-0.5 border-t border-zinc-100">No change in this step</span>
              )}
            </div>

            {/* Liabilities Box */}
            <div className="bg-white p-3 rounded-lg border border-[#E2DDD5] space-y-2">
              <div className="flex justify-between items-center text-zinc-600">
                <span className="font-semibold text-rose-800 uppercase text-[10px] tracking-wider">Total Liabilities</span>
                <span className="font-mono font-bold text-rose-800 text-sm">{formatCurrency(activeHoveredItem.Liabilities)}</span>
              </div>
              {activeHoveredItem.liabilityItemDeltas.length > 0 ? (
                <div className="pt-1.5 border-t border-zinc-100 space-y-1">
                  <div className="text-[9px] font-sans font-semibold text-zinc-500 uppercase">Itemized Liability Deltas:</div>
                  {activeHoveredItem.liabilityItemDeltas.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-[10px] font-mono">
                      <span className="text-zinc-700 truncate pr-1 font-sans">{item.name}:</span>
                      <span className={item.delta! > 0 ? 'text-amber-800 font-bold' : 'text-rose-800 font-bold'}>
                        {item.delta! > 0 ? '+' : ''}{formatCurrency(item.delta!)}
                      </span>
                    </div>
                  ))}
                  <div className="pt-1">
                    {activeHoveredItem.liabilitiesDelta === 0 ? (
                      <span className="text-[9px] font-sans font-semibold text-amber-900 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 block text-center">
                        Net Liabilities Total: $0 (Composition Shift)
                      </span>
                    ) : (
                      <span className={`inline-flex items-center text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded border ${
                        activeHoveredItem.liabilitiesDelta > 0
                          ? 'bg-amber-100 text-amber-900 border-amber-300'
                          : 'bg-rose-100 text-rose-900 border-rose-300'
                      }`}>
                        {activeHoveredItem.liabilitiesDelta > 0 ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                        Net Change: {activeHoveredItem.liabilitiesDelta > 0 ? '+' : ''}{formatCurrency(activeHoveredItem.liabilitiesDelta)}
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <span className="text-[10px] text-zinc-400 italic block pt-0.5 border-t border-zinc-100">No change in this step</span>
              )}
            </div>

            {/* Equity Box */}
            <div className="bg-white p-3 rounded-lg border border-[#E2DDD5] space-y-2">
              <div className="flex justify-between items-center text-zinc-600">
                <span className="font-semibold text-amber-900 uppercase text-[10px] tracking-wider">Net Capital</span>
                <span className="font-mono font-bold text-amber-900 text-sm">{formatCurrency(activeHoveredItem.Equity)}</span>
              </div>
              {activeHoveredItem.equityItemDeltas.length > 0 ? (
                <div className="pt-1.5 border-t border-zinc-100 space-y-1">
                  <div className="text-[9px] font-sans font-semibold text-zinc-500 uppercase">Itemized Capital Deltas:</div>
                  {activeHoveredItem.equityItemDeltas.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-[10px] font-mono">
                      <span className="text-zinc-700 truncate pr-1 font-sans">{item.name}:</span>
                      <span className={item.delta! > 0 ? 'text-blue-800 font-bold' : 'text-rose-800 font-bold'}>
                        {item.delta! > 0 ? '+' : ''}{formatCurrency(item.delta!)}
                      </span>
                    </div>
                  ))}
                  <div className="pt-1">
                    {activeHoveredItem.equityDelta === 0 ? (
                      <span className="text-[9px] font-sans font-semibold text-amber-900 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 block text-center">
                        Net Capital Total: $0 (Composition Shift)
                      </span>
                    ) : (
                      <span className={`inline-flex items-center text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded border ${
                        activeHoveredItem.equityDelta > 0
                          ? 'bg-blue-100 text-blue-900 border-blue-300'
                          : 'bg-rose-100 text-rose-900 border-rose-300'
                      }`}>
                        {activeHoveredItem.equityDelta > 0 ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                        Net Change: {activeHoveredItem.equityDelta > 0 ? '+' : ''}{formatCurrency(activeHoveredItem.equityDelta)}
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <span className="text-[10px] text-zinc-400 italic block pt-0.5 border-t border-zinc-100">No change in this step</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Grid of 6 Entities with Detailed Visual Bars (2 per row x 3 rows) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-serif font-normal text-[#1A1A1A]">
            Entity Balance Sheet Account Breakdown Charts
          </h3>
          <span className="text-xs font-sans text-zinc-500">
            6 System Participants • 2 Cards per Row
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {entities.map((e) => {
            const totA = e.assets.reduce((sum, item) => sum + item.amount, 0);
            const totL = e.liabilities.reduce((sum, item) => sum + item.amount, 0);
            const totEq = e.equity.reduce((sum, item) => sum + item.amount, 0);
            const maxVal = Math.max(totA, totL + totEq, 1);

            const isFocused =
              e.assets.some((i) => i.delta !== undefined && i.delta !== 0) ||
              e.liabilities.some((i) => i.delta !== undefined && i.delta !== 0) ||
              e.equity.some((i) => i.delta !== undefined && i.delta !== 0);

            return (
              <div
                key={e.id}
                className={`bg-white rounded-xl border p-5 space-y-4 transition duration-200 ${
                  isFocused
                    ? 'border-[#1A1A1A] ring-2 ring-zinc-300 shadow-md'
                    : 'border-[#E2DDD5] shadow-xs hover:border-[#1A1A1A]'
                }`}
              >
                {/* Entity Header */}
                <div className="flex items-start justify-between pb-3 border-b border-[#E2DDD5]">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 bg-[#FAF8F5] rounded-lg border border-[#E2DDD5]">
                      {getEntityIcon(e.id)}
                    </div>
                    <div>
                      <h4 className="text-base font-serif font-medium text-[#1A1A1A]">
                        {e.name}
                      </h4>
                      <p className="text-xs font-sans text-zinc-500 line-clamp-1">{e.description}</p>
                    </div>
                  </div>

                  <span className="text-[10px] font-sans font-semibold uppercase px-2.5 py-1 bg-zinc-100 text-zinc-700 rounded-md border border-zinc-200 shrink-0">
                    {e.badgeText}
                  </span>
                </div>

                {/* Macro Bar Overview */}
                <div className="space-y-2 bg-[#FAF8F5] p-3 rounded-lg border border-[#E8E4DC]">
                  <div className="text-[11px] font-sans font-semibold text-zinc-700 flex justify-between">
                    <span>BALANCE SHEET SUMMARY</span>
                    <span className="font-mono text-zinc-900">
                      Net Equity: {formatCurrency(totEq)}
                    </span>
                  </div>

                  {/* Assets Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-sans text-zinc-600">
                      <span>Assets</span>
                      <span className="font-mono font-medium text-[#1A1A1A]">{formatCurrency(totA)}</span>
                    </div>
                    <div className="w-full h-2.5 bg-zinc-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#1A1A1A] rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, (totA / maxVal) * 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Liabilities & Equity Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-sans text-zinc-600">
                      <span>Liabilities ({formatCurrency(totL)}) + Equity ({formatCurrency(totEq)})</span>
                      <span className="font-mono font-medium text-[#1A1A1A]">{formatCurrency(totL + totEq)}</span>
                    </div>
                    <div className="w-full h-2.5 bg-zinc-200 rounded-full overflow-hidden flex">
                      <div
                        className="h-full bg-[#D93829] transition-all duration-300"
                        style={{ width: `${Math.min(100, (totL / maxVal) * 100)}%` }}
                        title={`Liabilities: ${formatCurrency(totL)}`}
                      ></div>
                      <div
                        className="h-full bg-[#8C7C6D] transition-all duration-300"
                        style={{ width: `${Math.min(100, (totEq / maxVal) * 100)}%` }}
                        title={`Equity: ${formatCurrency(totEq)}`}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Detailed Account Composition List */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-sans">
                  
                  {/* Assets Column */}
                  <div className="space-y-1.5 p-2.5 bg-zinc-50/80 rounded-lg border border-zinc-200">
                    <div className="text-[10px] font-sans font-bold text-[#1A1A1A] uppercase tracking-wider pb-1 border-b border-zinc-200 flex justify-between">
                      <span>Assets</span>
                      <span>{formatCurrency(totA)}</span>
                    </div>
                    {e.assets.map((item) => {
                      const hasDelta = item.delta !== undefined && item.delta !== 0;
                      const isPos = (item.delta || 0) > 0;
                      return (
                        <div
                          key={item.id}
                          className={`space-y-1 p-1.5 rounded-md border transition ${
                            hasDelta
                              ? isPos
                                ? 'bg-emerald-50/90 border-emerald-300'
                                : 'bg-rose-50/90 border-rose-300'
                              : 'bg-white border-transparent'
                          }`}
                        >
                          <div className="flex justify-between items-start text-[11px] text-zinc-700">
                            <span className="truncate pr-1 font-medium">{item.name}</span>
                            <span className="font-mono font-medium text-zinc-900 shrink-0">{formatCurrency(item.amount)}</span>
                          </div>
                          {hasDelta && (
                            <div className="flex items-center">
                              <span
                                className={`inline-flex items-center text-[9px] font-mono font-semibold px-1 py-0.5 rounded border ${
                                  isPos
                                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                    : 'bg-rose-100 text-rose-900 border-rose-300'
                                }`}
                              >
                                {isPos ? <ArrowUpRight className="w-2.5 h-2.5 mr-0.5" /> : <ArrowDownRight className="w-2.5 h-2.5 mr-0.5" />}
                                {isPos ? '+' : ''}{formatCurrency(item.delta || 0)}
                              </span>
                            </div>
                          )}
                          <div className="w-full h-1 bg-zinc-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#1A1A1A]"
                              style={{ width: `${totA > 0 ? (item.amount / totA) * 100 : 0}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Liabilities Column */}
                  <div className="space-y-1.5 p-2.5 bg-zinc-50/80 rounded-lg border border-zinc-200">
                    <div className="text-[10px] font-sans font-bold text-[#D93829] uppercase tracking-wider pb-1 border-b border-zinc-200 flex justify-between">
                      <span>Liabilities</span>
                      <span>{formatCurrency(totL)}</span>
                    </div>
                    {e.liabilities.length === 0 ? (
                      <span className="text-[11px] text-zinc-400 italic">None</span>
                    ) : (
                      e.liabilities.map((item) => {
                        const hasDelta = item.delta !== undefined && item.delta !== 0;
                        const isPos = (item.delta || 0) > 0;
                        return (
                          <div
                            key={item.id}
                            className={`space-y-1 p-1.5 rounded-md border transition ${
                              hasDelta
                                ? isPos
                                  ? 'bg-emerald-50/90 border-emerald-300'
                                  : 'bg-rose-50/90 border-rose-300'
                                : 'bg-white border-transparent'
                            }`}
                          >
                            <div className="flex justify-between items-start text-[11px] text-zinc-700">
                              <span className="truncate pr-1 font-medium">{item.name}</span>
                              <span className="font-mono font-medium text-zinc-900 shrink-0">{formatCurrency(item.amount)}</span>
                            </div>
                            {hasDelta && (
                              <div className="flex items-center">
                                <span
                                  className={`inline-flex items-center text-[9px] font-mono font-semibold px-1 py-0.5 rounded border ${
                                    isPos
                                      ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                      : 'bg-rose-100 text-rose-900 border-rose-300'
                                  }`}
                                >
                                  {isPos ? <ArrowUpRight className="w-2.5 h-2.5 mr-0.5" /> : <ArrowDownRight className="w-2.5 h-2.5 mr-0.5" />}
                                  {isPos ? '+' : ''}{formatCurrency(item.delta || 0)}
                                </span>
                              </div>
                            )}
                            <div className="w-full h-1 bg-zinc-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#D93829]"
                                style={{ width: `${totL > 0 ? (item.amount / totL) * 100 : 0}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Equity Column */}
                  <div className="space-y-1.5 p-2.5 bg-zinc-50/80 rounded-lg border border-zinc-200">
                    <div className="text-[10px] font-sans font-bold text-[#8C7C6D] uppercase tracking-wider pb-1 border-b border-zinc-200 flex justify-between">
                      <span>Equity</span>
                      <span>{formatCurrency(totEq)}</span>
                    </div>
                    {e.equity.length === 0 ? (
                      <span className="text-[11px] text-zinc-400 italic">None</span>
                    ) : (
                      e.equity.map((item) => {
                        const hasDelta = item.delta !== undefined && item.delta !== 0;
                        const isPos = (item.delta || 0) > 0;
                        return (
                          <div
                            key={item.id}
                            className={`space-y-1 p-1.5 rounded-md border transition ${
                              hasDelta
                                ? isPos
                                  ? 'bg-emerald-50/90 border-emerald-300'
                                  : 'bg-rose-50/90 border-rose-300'
                                : 'bg-white border-transparent'
                            }`}
                          >
                            <div className="flex justify-between items-start text-[11px] text-zinc-700">
                              <span className="truncate pr-1 font-medium">{item.name}</span>
                              <span className="font-mono font-medium text-zinc-900 shrink-0">{formatCurrency(item.amount)}</span>
                            </div>
                            {hasDelta && (
                              <div className="flex items-center">
                                <span
                                  className={`inline-flex items-center text-[9px] font-mono font-semibold px-1 py-0.5 rounded border ${
                                    isPos
                                      ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                      : 'bg-rose-100 text-rose-900 border-rose-300'
                                  }`}
                                >
                                  {isPos ? <ArrowUpRight className="w-2.5 h-2.5 mr-0.5" /> : <ArrowDownRight className="w-2.5 h-2.5 mr-0.5" />}
                                  {isPos ? '+' : ''}{formatCurrency(item.delta || 0)}
                                </span>
                              </div>
                            )}
                            <div className="w-full h-1 bg-zinc-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#8C7C6D]"
                                style={{ width: `${totEq > 0 ? (item.amount / Math.abs(totEq)) * 100 : 0}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
