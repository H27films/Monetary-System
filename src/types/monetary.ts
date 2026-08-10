export type EntityId = 
  | 'central_bank' 
  | 'bank_a' 
  | 'bank_b' 
  | 'pension_fund' 
  | 'individual' 
  | 'treasury'
  | 'corporation'
  | 'hedge_fund'
  | 'foreign_bank';

export interface AccountItem {
  id: string;
  name: string;
  amount: number;
  delta?: number; // Change in the current step (+/-)
  category: 'asset' | 'liability' | 'equity';
  detail?: string;
}

export interface EntityBalanceSheet {
  id: EntityId;
  name: string;
  shortName: string;
  type: string;
  description: string;
  color: string; // TailWind color theme identifier or hex
  badgeText: string;
  assets: AccountItem[];
  liabilities: AccountItem[];
  equity: AccountItem[];
}

export interface JournalEntry {
  id: string;
  stepNumber: number;
  timestamp: string;
  title: string;
  description: string;
  entries: {
    entityId: EntityId;
    accountName: string;
    type: 'debit' | 'credit';
    amount: number;
    category: 'asset' | 'liability' | 'equity';
  }[];
}

export interface MoneyFlow {
  id: string;
  fromEntity: EntityId;
  toEntity: EntityId;
  assetType: string;
  amount: number;
  description: string;
}

export interface MonetaryStep {
  stepNumber: number;
  title: string;
  subtitle: string;
  description: string;
  accountingExplanation: string;
  macroImpact: {
    m0Change: string;
    m1Change: string;
    tgaChange: string;
    keyTakeaway: string;
  };
  // Changes applied to balance sheet in this step
  // Structure: entityDeltas[entityId][category][accountId] = deltaValue
  entityDeltas: Partial<
    Record<
      EntityId,
      {
        assets?: Record<string, number>;
        liabilities?: Record<string, number>;
        equity?: Record<string, number>;
      }
    >
  >;
  flowingMoney?: MoneyFlow[];
  journalEntries?: JournalEntry[];
}

export interface Scenario {
  id: string;
  title: string;
  category: 'Fiscal & Debt' | 'QE & Central Banking' | 'Commercial Credit' | 'Liquidity & Cash' | 'Advanced Mechanics';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  realWorldContext: string;
  initialState: Record<EntityId, EntityBalanceSheet>;
  steps: MonetaryStep[];
}

export interface SystemMacroStats {
  m0BaseMoney: number;       // Central Bank Assets / Total Reserves + Currency
  totalReserves: number;     // Commercial Bank Reserves at Central Bank
  m1BroadMoney: number;      // Commercial Bank Deposits
  tgaBalance: number;        // Treasury General Account at Fed
  treasuryBondsIssued: number; // Total Government Bonds outstanding
  systemBalanceCheck: boolean; // Are all balance sheets Assets = Liabilities + Equity?
}
