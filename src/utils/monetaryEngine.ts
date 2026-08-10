import { EntityId, EntityBalanceSheet, MonetaryStep, SystemMacroStats, AccountItem } from '../types/monetary';

/**
 * Calculates current balance sheets by applying deltas up to the selected step.
 */
export const calculateCurrentState = (
  initialState: Record<EntityId, EntityBalanceSheet>,
  steps: MonetaryStep[],
  activeStepIndex: number
): {
  currentBalanceSheets: Record<EntityId, EntityBalanceSheet>;
  macroStats: SystemMacroStats;
} => {
  // Deep clone initial state
  const currentSheets: Record<EntityId, EntityBalanceSheet> = JSON.parse(JSON.stringify(initialState));

  // Clear deltas on all accounts first
  Object.values(currentSheets).forEach((sheet) => {
    sheet.assets.forEach((item) => (item.delta = 0));
    sheet.liabilities.forEach((item) => (item.delta = 0));
    sheet.equity.forEach((item) => (item.delta = 0));
  });

  // Apply deltas up to activeStepIndex
  for (let sIndex = 0; sIndex <= activeStepIndex && sIndex < steps.length; sIndex++) {
    const step = steps[sIndex];
    const isCurrentActiveStep = sIndex === activeStepIndex;

    Object.entries(step.entityDeltas).forEach(([entityKey, deltaGroup]) => {
      const entityId = entityKey as EntityId;
      const sheet = currentSheets[entityId];
      if (!sheet) return;

      // Apply Asset Deltas
      if (deltaGroup.assets) {
        Object.entries(deltaGroup.assets).forEach(([accId, deltaVal]) => {
          let item = sheet.assets.find((a) => a.id === accId);
          if (!item) {
            // Create asset line item if not exists
            const humanName = accId.replace(/^[a-z]+_/, '').replace(/_/g, ' ').toUpperCase();
            item = { id: accId, name: humanName, amount: 0, category: 'asset' };
            sheet.assets.push(item);
          }
          item.amount += deltaVal;
          if (isCurrentActiveStep) {
            item.delta = (item.delta || 0) + deltaVal;
          }
        });
      }

      // Apply Liability Deltas
      if (deltaGroup.liabilities) {
        Object.entries(deltaGroup.liabilities).forEach(([accId, deltaVal]) => {
          let item = sheet.liabilities.find((l) => l.id === accId);
          if (!item) {
            const humanName = accId.replace(/^[a-z]+_/, '').replace(/_/g, ' ').toUpperCase();
            item = { id: accId, name: humanName, amount: 0, category: 'liability' };
            sheet.liabilities.push(item);
          }
          item.amount += deltaVal;
          if (isCurrentActiveStep) {
            item.delta = (item.delta || 0) + deltaVal;
          }
        });
      }

      // Apply Equity Deltas
      if (deltaGroup.equity) {
        Object.entries(deltaGroup.equity).forEach(([accId, deltaVal]) => {
          let item = sheet.equity.find((e) => e.id === accId);
          if (!item) {
            const humanName = accId.replace(/^[a-z]+_/, '').replace(/_/g, ' ').toUpperCase();
            item = { id: accId, name: humanName, amount: 0, category: 'equity' };
            sheet.equity.push(item);
          }
          item.amount += deltaVal;
          if (isCurrentActiveStep) {
            item.delta = (item.delta || 0) + deltaVal;
          }
        });
      }
    });
  }

  // Calculate Macro Indicators
  const cb = currentSheets.central_bank;
  const bankA = currentSheets.bank_a;
  const bankB = currentSheets.bank_b;
  const pf = currentSheets.pension_fund;
  const ind = currentSheets.individual;
  const treasury = currentSheets.treasury;

  // Total Central Bank Assets (Base Money / Balance sheet size)
  const m0BaseMoney = cb.assets.reduce((sum, item) => sum + item.amount, 0);

  // Total Commercial Bank Reserves at Fed
  const cbResA = cb.liabilities.find((i) => i.id === 'cb_reserves_bank_a')?.amount || 0;
  const cbResB = cb.liabilities.find((i) => i.id === 'cb_reserves_bank_b')?.amount || 0;
  const totalReserves = cbResA + cbResB;

  // TGA Balance at Fed
  const tgaBalance = cb.liabilities.find((i) => i.id === 'cb_tga')?.amount || 0;

  // Broad Money M1 (Commercial Bank Customer Deposits)
  const bankADeposits = bankA.liabilities.reduce((sum, i) => sum + i.amount, 0);
  const bankBDeposits = bankB.liabilities.reduce((sum, i) => sum + i.amount, 0);
  const m1BroadMoney = bankADeposits + bankBDeposits;

  // Total Treasury Bonds Issued
  const treasuryBondsIssued = treasury.liabilities.find((i) => i.id === 'tr_debt_issued')?.amount || 0;

  // Verify double-entry balance for ALL entities: Assets == Liabilities + Equity
  let systemBalanceCheck = true;
  Object.values(currentSheets).forEach((sheet) => {
    const totalAssets = sheet.assets.reduce((s, i) => s + i.amount, 0);
    const totalLiab = sheet.liabilities.reduce((s, i) => s + i.amount, 0);
    const totalEq = sheet.equity.reduce((s, i) => s + i.amount, 0);
    if (Math.abs(totalAssets - (totalLiab + totalEq)) > 0.001) {
      systemBalanceCheck = false;
    }
  });

  return {
    currentBalanceSheets: currentSheets,
    macroStats: {
      m0BaseMoney,
      totalReserves,
      m1BroadMoney,
      tgaBalance,
      treasuryBondsIssued,
      systemBalanceCheck,
    },
  };
};

export const formatCurrency = (amount: number): string => {
  return `$${amount.toLocaleString()}B`;
};
