import { EntityId, EntityBalanceSheet } from '../types/monetary';

export const createDefaultInitialState = (): Record<EntityId, EntityBalanceSheet> => ({
  central_bank: {
    id: 'central_bank',
    name: 'Central Bank (Federal Reserve)',
    shortName: 'Central Bank',
    type: 'Monetary Authority',
    badgeText: 'Issuer of Reserves & TGA',
    color: 'emerald',
    description: 'Issues bank reserves and currency notes, manages monetary policy, and holds the Treasury General Account (TGA).',
    assets: [
      { id: 'cb_us_treasuries', name: 'US Treasuries (SOMA)', amount: 450, category: 'asset', detail: 'Government debt purchased via open market operations' },
      { id: 'cb_discount_loans', name: 'Discount Loans / DW', amount: 100, category: 'asset', detail: 'Direct liquidity provided to commercial banks' },
    ],
    liabilities: [
      { id: 'cb_reserves_bank_a', name: 'Bank A Reserves', amount: 200, category: 'liability', detail: 'Digital settlement funds owned by Bank A' },
      { id: 'cb_reserves_bank_b', name: 'Bank B Reserves', amount: 100, category: 'liability', detail: 'Digital settlement funds owned by Bank B' },
      { id: 'cb_tga', name: 'Treasury General Account (TGA)', amount: 200, category: 'liability', detail: 'Government operating cash checking account' },
      { id: 'cb_currency_notes', name: 'Currency Notes in Circulation', amount: 50, category: 'liability', detail: 'Physical cash held by households and businesses' },
      { id: 'cb_rrp_facility', name: 'Overnight Reverse Repo Facility (ON RRP)', amount: 0, category: 'liability', detail: 'Overnight cash deposited by non-bank counterparties (Pension/MMFs)' },
    ],
    equity: [],
  },

  bank_a: {
    id: 'bank_a',
    name: 'Commercial Bank A (Primary Dealer)',
    shortName: 'Bank A (Primary Dealer)',
    type: 'Primary Dealer Bank',
    badgeText: 'Direct Fed Counterparty',
    color: 'blue',
    description: 'Large Wall Street dealer bank authorized to transact directly with the Fed and bid at Treasury auctions.',
    assets: [
      { id: 'ba_reserves', name: 'Reserves at Central Bank', amount: 200, category: 'asset', detail: 'Interest-bearing reserve balance at Fed' },
      { id: 'ba_treasuries', name: 'US Treasuries', amount: 120, category: 'asset', detail: 'Government securities held for trading/investment' },
      { id: 'ba_loans', name: 'Commercial Loans', amount: 130, category: 'asset', detail: 'Loans extended to corporate & individual borrowers' },
    ],
    liabilities: [
      { id: 'ba_dep_pension', name: 'Pension Fund Deposits', amount: 150, category: 'liability', detail: 'Commercial bank deposit liability to Pension Fund' },
      { id: 'ba_dep_ind', name: 'Individual Deposits', amount: 100, category: 'liability', detail: 'Retail demand deposits owed to Individuals' },
      { id: 'ba_dep_corp', name: 'Corporate Deposits', amount: 100, category: 'liability', detail: 'Business checking accounts' },
    ],
    equity: [
      { id: 'ba_equity', name: 'Bank Equity Capital', amount: 100, category: 'equity', detail: 'Retained earnings and owner shareholder equity' },
    ],
  },

  bank_b: {
    id: 'bank_b',
    name: 'Commercial Bank B (Commercial Bank)',
    shortName: 'Bank B (Commercial)',
    type: 'Retail / Regional Bank',
    badgeText: 'Commercial Deposit Bank',
    color: 'indigo',
    description: 'Commercial bank serving households and mid-sized businesses, clearing payments through Bank A or directly at the Fed.',
    assets: [
      { id: 'bb_reserves', name: 'Reserves at Central Bank', amount: 100, category: 'asset', detail: 'Reserve account balance at Fed' },
      { id: 'bb_treasuries', name: 'US Treasuries', amount: 50, category: 'asset', detail: 'Government bonds held as liquid assets' },
      { id: 'bb_loans', name: 'Commercial & Retail Loans', amount: 100, category: 'asset', detail: 'Mortgages, consumer loans, business loans' },
    ],
    liabilities: [
      { id: 'bb_dep_ind', name: 'Individual Customer Deposits', amount: 100, category: 'liability', detail: 'Retail deposits (part of M1 broad money)' },
      { id: 'bb_dep_corp', name: 'Corporate Deposits', amount: 50, category: 'liability', detail: 'Commercial checking account liabilities' },
      { id: 'bb_dep_vostro_fb', name: 'Foreign Bank Vostro Deposit', amount: 50, category: 'liability', detail: 'Correspondent US dollar deposit account held by Foreign Bank' },
    ],
    equity: [
      { id: 'bb_equity', name: 'Bank Equity Capital', amount: 50, category: 'equity', detail: 'Shareholder capital buffer' },
    ],
  },

  pension_fund: {
    id: 'pension_fund',
    name: 'Pension Fund / Non-Bank Financial',
    shortName: 'Pension Fund (Non-Bank)',
    type: 'Non-Bank Financial Inst.',
    badgeText: 'Institutional Investor',
    color: 'amber',
    description: 'Asset manager holding commercial bank deposits and Treasuries, but lacking a direct Fed reserve account.',
    assets: [
      { id: 'pf_bank_dep', name: 'Bank Deposits (at Bank A)', amount: 150, category: 'asset', detail: 'Commercial bank deposits used for asset allocation' },
      { id: 'pf_rrp_asset', name: 'ON RRP Deposits at Central Bank', amount: 0, category: 'asset', detail: 'Overnight cash parked directly at Central Bank ON RRP Facility' },
      { id: 'pf_treasuries', name: 'US Treasuries', amount: 100, category: 'asset', detail: 'Long-term government bond investments' },
      { id: 'pf_corp_bonds', name: 'Corporate Bonds / Equities', amount: 50, category: 'asset', detail: 'Private sector investment portfolio' },
    ],
    liabilities: [
      { id: 'pf_obligations', name: 'Future Pension Obligations', amount: 200, category: 'liability', detail: 'Liabilities to future retirees' },
    ],
    equity: [
      { id: 'pf_net_assets', name: 'Fund Net Capital', amount: 100, category: 'equity', detail: 'Surplus net asset value' },
    ],
  },

  individual: {
    id: 'individual',
    name: 'Private Household & Individual',
    shortName: 'Private Individual',
    type: 'Private Real Economy',
    badgeText: 'Consumer & Labor',
    color: 'violet',
    description: 'Retail consumers and workers who hold bank deposits, cash notes, and loans with commercial banks.',
    assets: [
      { id: 'ind_dep_bank_a', name: 'Bank A Deposits', amount: 100, category: 'asset', detail: 'Checking & savings account at Bank A' },
      { id: 'ind_dep_bank_b', name: 'Bank B Deposits', amount: 100, category: 'asset', detail: 'Checking & savings account at Bank B' },
      { id: 'ind_physical_cash', name: 'Physical Currency Notes', amount: 20, category: 'asset', detail: 'Federal Reserve cash notes in wallet' },
      { id: 'ind_treasuries', name: 'Direct US Treasuries', amount: 20, category: 'asset', detail: 'TreasuryDirect or brokerage holdings' },
    ],
    liabilities: [
      { id: 'ind_bank_loans', name: 'Bank Loans & Mortgages', amount: 40, category: 'liability', detail: 'Mortgages and consumer loan obligations owed to banks' },
    ],
    equity: [
      { id: 'ind_net_worth', name: 'Household Net Worth', amount: 200, category: 'equity', detail: 'Net household financial wealth' },
    ],
  },

  treasury: {
    id: 'treasury',
    name: 'US Treasury (Fiscal Government)',
    shortName: 'US Treasury',
    type: 'Sovereign Fiscal Authority',
    badgeText: 'Issuer of Debt & TGA Spender',
    color: 'rose',
    description: 'Collects taxes, issues government bonds, and spends money into the economy through its TGA account at the Fed.',
    assets: [
      { id: 'tr_tga', name: 'TGA Cash (at Central Bank)', amount: 200, category: 'asset', detail: 'Operating cash balance held at the Fed' },
      { id: 'tr_tax_receivables', name: 'Tax Receivables & Revenue Claims', amount: 600, category: 'asset', detail: 'Accrued taxes due and projected sovereign revenue claims' },
    ],
    liabilities: [
      { id: 'tr_debt_issued', name: 'Total US Debt Issued', amount: 800, category: 'liability', detail: 'Total outstanding Treasury bonds ($450B Fed + $120B BankA + $50B BankB + $100B Pension + $40B Hedge Fund + $20B Corp + $20B Ind)' },
    ],
    equity: [
      { id: 'tr_net_fiscal', name: 'Sovereign Fiscal Balance', amount: 0, category: 'equity', detail: 'Net sovereign fiscal equity balance' },
    ],
  },

  corporation: {
    id: 'corporation',
    name: 'Private Corporation (Real Economy Business)',
    shortName: 'Private Corporation',
    type: 'Corporate Entity',
    badgeText: 'Issuer of Corporate Debt',
    color: 'teal',
    description: 'Non-financial enterprise issuing corporate bonds, holding commercial bank deposits, and investing in capital operations.',
    assets: [
      { id: 'corp_bank_dep', name: 'Bank Deposits (at Bank A & B)', amount: 150, category: 'asset', detail: 'Commercial bank checking accounts used for payroll & capex' },
      { id: 'corp_treasuries', name: 'US Treasuries', amount: 20, category: 'asset', detail: 'Corporate treasury liquidity reserve' },
      { id: 'corp_fixed_assets', name: 'Property, Plant & Equipment', amount: 100, category: 'asset', detail: 'Physical capital assets and machinery' },
    ],
    liabilities: [
      { id: 'corp_bonds_issued', name: 'Corporate Bonds Issued', amount: 100, category: 'liability', detail: 'Bonds issued to investors and financial institutions' },
      { id: 'corp_bank_loans', name: 'Bank Credit & Loans', amount: 70, category: 'liability', detail: 'Commercial bank revolving credit loans' },
    ],
    equity: [
      { id: 'corp_equity', name: 'Shareholder Equity & Retained Earnings', amount: 100, category: 'equity', detail: 'Corporate net asset equity value' },
    ],
  },

  hedge_fund: {
    id: 'hedge_fund',
    name: 'Global Macro Hedge Fund',
    shortName: 'Hedge Fund',
    type: 'Leveraged Institutional Investor',
    badgeText: 'Repo Leveraged Investor',
    color: 'orange',
    description: 'Active financial fund taking leveraged positions in US Treasuries and corporate debt using repo borrowing with dealer banks.',
    assets: [
      { id: 'hf_bank_dep', name: 'Bank Deposits (at Bank A)', amount: 50, category: 'asset', detail: 'Cash deposits at dealer bank' },
      { id: 'hf_treasuries', name: 'US Treasuries', amount: 40, category: 'asset', detail: 'Treasury securities held for repo arbitrage / yield' },
      { id: 'hf_corp_bonds', name: 'Corporate Bonds', amount: 50, category: 'asset', detail: 'Private corporate bond holdings' },
    ],
    liabilities: [
      { id: 'hf_repo_liab', name: 'Bank Repo Loan Liabilities', amount: 40, category: 'liability', detail: 'Short-term repurchase agreement borrowing from Bank A' },
    ],
    equity: [
      { id: 'hf_equity', name: 'Fund Equity / Capital (NAV)', amount: 100, category: 'equity', detail: 'Net Asset Value belonging to fund investors' },
    ],
  },

  foreign_bank: {
    id: 'foreign_bank',
    name: 'Foreign Correspondent Bank (UK / Offshore)',
    shortName: 'Foreign Bank',
    type: 'Offshore Commercial Bank',
    badgeText: 'Eurodollar Issuer',
    color: 'indigo',
    description: 'Offshore non-US commercial bank holding a Nostro deposit account at US Bank B and issuing Eurodollar liabilities.',
    assets: [
      { id: 'fb_nostro_dep', name: 'Nostro Deposit (at US Bank B)', amount: 50, category: 'asset', detail: 'US dollar correspondent reserve account at Bank B' },
      { id: 'fb_eurodollar_loans', name: 'Eurodollar Loans & Assets', amount: 50, category: 'asset', detail: 'Dollar loans issued to UK and international borrowers' },
    ],
    liabilities: [
      { id: 'fb_eurodollar_dep', name: 'Eurodollar Deposits (Offshore)', amount: 50, category: 'liability', detail: 'Dollar-denominated deposit liabilities owed to UK/offshore clients' },
    ],
    equity: [
      { id: 'fb_equity', name: 'Bank Equity & Capital', amount: 50, category: 'equity', detail: 'Offshore bank capital and reserves' },
    ],
  },
});

