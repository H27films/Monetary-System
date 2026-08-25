export interface SimpleTAccount {
  entityId: string;
  entityName: string;
  subtitle: string;
  assets: string[];
  liabilities: string[];
}

export interface SimpleStep {
  stepNumber: number;
  isStartingPosition?: boolean;
  badgeText?: string;
  title: string;
  subtitle?: string;
  description: string;
  footnote?: string;
  accounts: SimpleTAccount[];
}

export interface SimpleScenario {
  id: string;
  scenarioNumber: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  description: string;
  keyTakeaway?: {
    headline: string;
    body: string;
    mythBuster?: string;
  };
  entities: Array<{
    id: string;
    name: string;
    role: string;
  }>;
  steps: SimpleStep[];
}

export const simpleScenarios: SimpleScenario[] = [
  {
    id: 'brazilian-debt-swap-usd-to-yuan-private-investor',
    scenarioNumber: '1a',
    title: 'Scenario 1a: Debt Swap (USD to Yuan via Private Investor)',
    shortTitle: 'Scenario 1a: Debt Swap (via Private Investor)',
    subtitle: 'Cross-Currency Corporate Debt Refinancing & FX Swap with Private Market Liquidity',
    description:
      'A Brazilian corporation with an existing US dollar private bank loan exchanges its liability for Yuan-denominated debt. Starting with an initial USD bank loan at a US commercial bank, the company borrows in Yuan from a Chinese bank, exchanges the Yuan for USD deposits with a Private Investor, and uses the USD proceeds to extinguish its USD debt.',
    keyTakeaway: {
      headline: 'Key Takeaway: How Outstanding Global USD Debt is Systematically Reduced via Debt Swaps',
      body: 'A common macroeconomic misconception assumes that just because there is a vast amount of USD-denominated debt outstanding globally, that will always remain the case or generate permanent dollar shortages. In reality, cross-currency balance sheet refinancing and swap mechanisms allow corporate and sovereign borrowers to systematically extinguish and de-dollarize their USD debt into alternative currencies (such as Yuan) without currency mismatches.',
      mythBuster: 'Myth: "Huge outstanding USD debt means countries are permanently trapped in the dollar." — Reality: Borrowers refinance into Yuan/local credit and execute FX swaps with willing counterparties to extinguish dollar debt and shrink US banking sector claims.',
    },
    entities: [
      { id: 'brazilian_company', name: 'Brazilian Company', role: 'Corporate Borrower' },
      { id: 'private_investor', name: 'Private Investor', role: 'FX Counterparty' },
      { id: 'us_bank', name: 'US Bank', role: 'USD Creditor Bank' },
      { id: 'chinese_bank', name: 'Chinese Bank', role: 'Yuan Creditor Bank' },
    ],
    steps: [
      {
        stepNumber: 0,
        isStartingPosition: true,
        badgeText: 'STARTING POSITION',
        title: 'Starting Position: Existing USD Bank Loan & Investor USD Liquidity',
        subtitle: 'Initial Balance Sheet Holdings Prior to Refinancing',
        description:
          'Before the refinancing begins, the Brazilian Company has an outstanding USD 100 bank loan owed to the US Bank. The Private Investor holds USD 100 in deposits at the US Bank. The Chinese Bank holds no prior claims.',
        footnote:
          'Starting Point: The Brazilian Company has an existing USD loan liability to the US Bank, financed via Private Investor USD deposits in the US banking system.',
        accounts: [
          {
            entityId: 'brazilian_company',
            entityName: 'Brazilian Company',
            subtitle: '(Has existing USD bank loan liability)',
            assets: [],
            liabilities: ['+100 USD Debt (US Bank Loan)'],
          },
          {
            entityId: 'private_investor',
            entityName: 'Private Investor',
            subtitle: '(Holds USD deposit liquidity in US banking system)',
            assets: ['+100 USD Deposits (US Bank)'],
            liabilities: [],
          },
          {
            entityId: 'us_bank',
            entityName: 'US Bank',
            subtitle: '(Holds USD loan asset funded by deposits)',
            assets: ['+100 USD Loan (to Brazilian Co)'],
            liabilities: ['+100 USD Deposits (Private Investor)'],
          },
          {
            entityId: 'chinese_bank',
            entityName: 'Chinese Bank',
            subtitle: '(Baseline position prior to loan origination)',
            assets: [],
            liabilities: [],
          },
        ],
      },
      {
        stepNumber: 1,
        title: 'Step 1: Brazilian Company Issues Yuan Debt to Chinese Bank',
        subtitle: 'Yuan Credit Creation & Initial Deposit Inflow',
        description:
          'The Brazilian Company borrows in Yuan from the Chinese Bank. The Chinese Bank originates the loan and credits the Brazilian Company with newly created CNY deposits.',
        footnote:
          'Yuan Loan Origination: Chinese Bank expands both sides of its balance sheet (+100 CNY Loan asset and +100 CNY Deposit liability for the Brazilian borrower).',
        accounts: [
          {
            entityId: 'brazilian_company',
            entityName: 'Brazilian Company',
            subtitle: '(Issues Yuan debt, receives CNY deposits)',
            assets: ['+100 CNY Deposits (Chinese Bank)'],
            liabilities: ['+100 CNY Debt (Chinese Bank)'],
          },
          {
            entityId: 'private_investor',
            entityName: 'Private Investor',
            subtitle: '(Holds USD deposits prior to FX transaction)',
            assets: [],
            liabilities: [],
          },
          {
            entityId: 'us_bank',
            entityName: 'US Bank',
            subtitle: '(Holds existing USD loan to Brazilian Company)',
            assets: [],
            liabilities: [],
          },
          {
            entityId: 'chinese_bank',
            entityName: 'Chinese Bank',
            subtitle: '(Originates CNY loan, creates CNY deposit)',
            assets: ['+100 CNY Loan to Brazilian Co'],
            liabilities: ['+100 CNY Deposits to Brazilian Co'],
          },
        ],
      },
      {
        stepNumber: 2,
        title: 'Step 2: Foreign Exchange Swap with Private Investor (CNY for USD)',
        subtitle: 'Private FX Deposit Exchange Across Banking Systems',
        description:
          'The Brazilian Company exchanges its 100 CNY deposits for 100 USD deposits with a Private Investor seeking Yuan liquidity. Deposit ownership transfers across both banking systems.',
        footnote:
          'FX Swap Settlement: The Brazilian Company acquires USD bank claims, while the Private Investor acquires CNY bank claims. Total bank deposits simply change hands.',
        accounts: [
          {
            entityId: 'brazilian_company',
            entityName: 'Brazilian Company',
            subtitle: '(Exchanges CNY deposits for USD deposits)',
            assets: ['-100 CNY Deposits (Chinese Bank)', '+100 USD Deposits (US Bank)'],
            liabilities: [],
          },
          {
            entityId: 'private_investor',
            entityName: 'Private Investor',
            subtitle: '(Exchanges USD deposits for CNY deposits)',
            assets: ['-100 USD Deposits (US Bank)', '+100 CNY Deposits (Chinese Bank)'],
            liabilities: [],
          },
          {
            entityId: 'us_bank',
            entityName: 'US Bank',
            subtitle: '(Transfers USD deposit from Investor to Brazilian Co)',
            assets: [],
            liabilities: ['-100 USD Deposits (Private Investor)', '+100 USD Deposits (Brazilian Co)'],
          },
          {
            entityId: 'chinese_bank',
            entityName: 'Chinese Bank',
            subtitle: '(Transfers CNY deposit from Brazilian Co to Investor)',
            assets: [],
            liabilities: ['-100 CNY Deposits (Brazilian Co)', '+100 CNY Deposits (Private Investor)'],
          },
        ],
      },
      {
        stepNumber: 3,
        title: 'Step 3: Brazilian Company Pays Off & Extinguishes USD Private Debt',
        subtitle: 'USD Debt Extinguishment & Deposit Destruction',
        description:
          'The Brazilian Company uses its acquired 100 USD deposits at the US Bank to pay off and cancel its outstanding USD private bank loan.',
        footnote:
          'Debt Destruction: The USD private loan and USD deposit liabilities are both extinguished from the US Bank balance sheet.',
        accounts: [
          {
            entityId: 'brazilian_company',
            entityName: 'Brazilian Company',
            subtitle: '(Pays off USD debt with USD deposits)',
            assets: ['-100 USD Deposits (US Bank)'],
            liabilities: ['-100 USD Debt (Extinguished)'],
          },
          {
            entityId: 'private_investor',
            entityName: 'Private Investor',
            subtitle: '(Maintains newly acquired Yuan deposits)',
            assets: [],
            liabilities: [],
          },
          {
            entityId: 'us_bank',
            entityName: 'US Bank',
            subtitle: '(Cancels USD loan asset & extinguishes deposit)',
            assets: ['-100 USD Loan to Brazilian Co'],
            liabilities: ['-100 USD Deposits (Brazilian Co)'],
          },
          {
            entityId: 'chinese_bank',
            entityName: 'Chinese Bank',
            subtitle: '(Maintains CNY loan and CNY investor deposit)',
            assets: [],
            liabilities: [],
          },
        ],
      },
      {
        stepNumber: 4,
        title: 'Step 4: Cumulative Net Balance Sheet Transformation',
        subtitle: 'Final State Across All 4 Entities (Starting Position + All Steps Combined)',
        description:
          'The net balance sheet outcome across all entities: Brazilian corporate debt is successfully swapped from USD to CNY. US banking sector contracts by 100 USD; Chinese banking sector expands by 100 CNY.',
        footnote:
          'Net Summary: The Brazilian firm de-dollarized its debt without currency mismatch. The Private Investor absorbed the CNY asset, and the US banking sector contracted while the Chinese banking sector expanded.',
        accounts: [
          {
            entityId: 'brazilian_company',
            entityName: 'Brazilian Company',
            subtitle: '(Swapped USD debt liability into CNY debt)',
            assets: [],
            liabilities: ['-100 USD Debt (Extinguished)', '+100 CNY Debt (Chinese Bank)'],
          },
          {
            entityId: 'private_investor',
            entityName: 'Private Investor',
            subtitle: '(Swapped USD cash into CNY cash holdings)',
            assets: ['-100 USD Deposits (US Bank)', '+100 CNY Deposits (Chinese Bank)'],
            liabilities: [],
          },
          {
            entityId: 'us_bank',
            entityName: 'US Bank',
            subtitle: '(Contracted balance sheet: USD credit extinguished)',
            assets: ['-100 USD Loan to Brazilian Co'],
            liabilities: ['-100 USD Deposits (Private Investor)'],
          },
          {
            entityId: 'chinese_bank',
            entityName: 'Chinese Bank',
            subtitle: '(Expanded balance sheet: CNY credit created)',
            assets: ['+100 CNY Loan to Brazilian Co'],
            liabilities: ['+100 CNY Deposits (Private Investor)'],
          },
        ],
      },
    ],
  },
  {
    id: 'brazilian-debt-swap-usd-to-yuan-pboc-treasury-runoff',
    scenarioNumber: '1b',
    title: 'Scenario 1b: Debt Swap (USD to Yuan via Bank of China & PBOC Treasury Expiry / FRBNY)',
    shortTitle: 'Scenario 1b: Debt Swap (via PBOC & Chinese Commercial Bank)',
    subtitle: 'Yuan Internationalization Playbook: Sovereign US Treasury Run-Off & Trade Debt De-Dollarization',
    description:
      'A Brazilian exporter with an existing USD bank loan replaces its dollar liability with a Yuan-denominated loan from Bank of China. The PBOC allows its maturing US Treasuries to run off, receiving USD cash at its Federal Reserve (FRBNY) account. The PBOC passes this USD liquidity to Bank of China via an FX swap/transfer, and Bank of China delivers the USD to extinguish the Brazilian firm’s USD debt while establishing a new CNY loan claim.',
    keyTakeaway: {
      headline: 'The Yuan Internationalization Playbook: Recycling US Sovereign Run-Offs into BRICS Trade Credit',
      body: 'When the PBOC lets US Treasuries expire, the US Treasury pays USD cash directly into the PBOC\'s account at the Federal Reserve Bank of New York (FRBNY). The PBOC executes an FX swap with a state commercial bank (e.g. Bank of China), passing USD offshore into Bank of China\'s nostro account while absorbing CNY. Bank of China then approaches the Brazilian exporter to replace its USD loan with a CNY-denominated loan and hands over the USD to extinguish the dollar debt. Brazil becomes plugged into the Yuan system with a CNY liability, while the PBOC offloads USD exposure without USD ever leaving the US reserve system.',
      mythBuster: 'Petrodollar Replacement Mechanism: USD never leaves the US banking/reserve system—it simply gets recycled out of US sovereign debt into trade finance outside the dollar sphere, systematically de-dollarizing trade partners.',
    },
    entities: [
      { id: 'brazilian_company', name: 'Brazilian Exporter', role: 'Commodity Exporter' },
      { id: 'bank_of_china', name: 'Bank of China', role: 'Chinese Commercial Bank' },
      { id: 'pboc', name: 'PBOC', role: 'People\'s Bank of China' },
      { id: 'fed', name: 'Federal Reserve (FRBNY)', role: 'US Central Bank' },
      { id: 'us_bank', name: 'US Correspondent Bank', role: 'USD Settlement Bank' },
    ],
    steps: [
      {
        stepNumber: 0,
        isStartingPosition: true,
        badgeText: 'STARTING POSITION',
        title: 'Starting Position: Existing USD Loan, PBOC US Treasury Holdings & FRBNY Reserves',
        subtitle: 'Initial Balance Sheet Positions Across US and Chinese Banking Systems',
        description:
          'The Brazilian Exporter has an outstanding $100 USD bank loan owed to the US Correspondent Bank. The PBOC holds $100 of US Treasury securities in its FX reserve portfolio. The Federal Reserve holds the US Treasury account (TGA) and bank reserve balances. Bank of China has a baseline commercial position.',
        footnote:
          'Starting Point: Brazilian exporter owes USD; PBOC holds US Treasury bonds; US bank holds the corporate loan.',
        accounts: [
          {
            entityId: 'brazilian_company',
            entityName: 'Brazilian Exporter',
            subtitle: '(Has existing USD bank loan liability)',
            assets: [],
            liabilities: ['+100 USD Debt (US Bank Loan)'],
          },
          {
            entityId: 'bank_of_china',
            entityName: 'Bank of China',
            subtitle: '(Commercial bank ready for trade finance)',
            assets: ['+100 CNY Reserves (at PBOC)'],
            liabilities: ['+100 CNY Domestic Deposits'],
          },
          {
            entityId: 'pboc',
            entityName: 'PBOC',
            subtitle: '(Holds US Treasury bonds in FX reserves)',
            assets: ['+100 US Treasuries'],
            liabilities: ['+100 CNY Reserve Balances (Bank of China)'],
          },
          {
            entityId: 'fed',
            entityName: 'Federal Reserve (FRBNY)',
            subtitle: '(Holds US Treasury TGA & foreign official deposit accounts)',
            assets: ['+100 Treasury General Account Backing / Assets'],
            liabilities: ['+100 US Treasury Account (TGA)'],
          },
          {
            entityId: 'us_bank',
            entityName: 'US Correspondent Bank',
            subtitle: '(Holds USD corporate loan asset)',
            assets: ['+100 USD Loan (to Brazilian Co)'],
            liabilities: ['+100 USD Deposits / Capital'],
          },
        ],
      },
      {
        stepNumber: 1,
        title: 'Step 1: US Treasury Matures — US Treasury Pays USD to PBOC at the Fed (FRBNY)',
        subtitle: 'US Treasury Expiry & Sovereign USD Cash Crediting at FRBNY',
        description:
          'The PBOC\'s $100 US Treasury security matures. The US Treasury pays $100 USD cash principal out of its Treasury General Account (TGA) at the Federal Reserve directly into the PBOC\'s foreign official reserve account at the Federal Reserve Bank of New York (FRBNY). PBOC now holds USD cash at FRBNY and no longer holds the bond.',
        footnote:
          'Sovereign Bond Run-Off: At the Fed, liabilities shift from the US Treasury (TGA) to PBOC foreign official reserve deposits. The PBOC converts UST paper into liquid USD cash.',
        accounts: [
          {
            entityId: 'brazilian_company',
            entityName: 'Brazilian Exporter',
            subtitle: '(Maintains existing USD debt)',
            assets: [],
            liabilities: [],
          },
          {
            entityId: 'bank_of_china',
            entityName: 'Bank of China',
            subtitle: '(Neutral in this sovereign step)',
            assets: [],
            liabilities: [],
          },
          {
            entityId: 'pboc',
            entityName: 'PBOC',
            subtitle: '(UST matures: replaces UST asset with USD cash at FRBNY)',
            assets: ['-100 US Treasuries (Matured)', '+100 USD Account (at FRBNY)'],
            liabilities: [],
          },
          {
            entityId: 'fed',
            entityName: 'Federal Reserve (FRBNY)',
            subtitle: '(Transfers funds from US Treasury TGA to PBOC account)',
            assets: [],
            liabilities: ['-100 US Treasury Account (TGA)', '+100 PBOC Foreign Official Account'],
          },
          {
            entityId: 'us_bank',
            entityName: 'US Correspondent Bank',
            subtitle: '(Neutral in this step)',
            assets: [],
            liabilities: [],
          },
        ],
      },
      {
        stepNumber: 2,
        title: 'Step 2: PBOC Passes USD to Bank of China via FX Swap / Interbank Transfer',
        subtitle: 'Recycling Sovereign USD Liquidity into Commercial Banking Nostro Accounts',
        description:
          'The PBOC and Bank of China execute an FX swap/transfer: PBOC transfers $100 USD from its FRBNY account to Bank of China\'s USD Nostro account at the US Correspondent Bank (settled via Fedwire/Fed reserves). In return, Bank of China surrenders 100 CNY reserves back to the PBOC. Net effect: Bank of China now holds $100 USD offshore in New York, and PBOC absorbs CNY reserves.',
        footnote:
          'USD Recycling: PBOC passes USD offshore to Bank of China\'s Nostro account at the US Correspondent Bank. Fed reserves move to US Bank; PBOC pulls back domestic CNY.',
        accounts: [
          {
            entityId: 'brazilian_company',
            entityName: 'Brazilian Exporter',
            subtitle: '(Maintains existing USD debt)',
            assets: [],
            liabilities: [],
          },
          {
            entityId: 'bank_of_china',
            entityName: 'Bank of China',
            subtitle: '(Gives up CNY reserves, gains USD Nostro deposit at US Bank)',
            assets: ['-100 CNY Reserves (at PBOC)', '+100 USD Nostro Account (at US Bank)'],
            liabilities: [],
          },
          {
            entityId: 'pboc',
            entityName: 'PBOC',
            subtitle: '(Transfers USD at FRBNY, absorbs Bank of China CNY reserves)',
            assets: ['-100 USD Account (at FRBNY)'],
            liabilities: ['-100 CNY Reserve Balances (Bank of China)'],
          },
          {
            entityId: 'fed',
            entityName: 'Federal Reserve (FRBNY)',
            subtitle: '(Settles interbank transfer: PBOC account to US Bank reserves)',
            assets: [],
            liabilities: ['-100 PBOC Foreign Official Account', '+100 Bank Reserves (US Correspondent Bank)'],
          },
          {
            entityId: 'us_bank',
            entityName: 'US Correspondent Bank',
            subtitle: '(Receives Fed reserves, credits Bank of China USD Nostro/Vostro)',
            assets: ['+100 Fed Reserves (at FRBNY)'],
            liabilities: ['+100 USD Vostro Account (Bank of China)'],
          },
        ],
      },
      {
        stepNumber: 3,
        title: 'Step 3: Bank of China Replaces Brazilian Exporter’s USD Loan with CNY Debt & Delivers USD',
        subtitle: 'Yuan Debt Refinancing & USD Settlement Transfer to Extinguish US Bank Debt',
        description:
          'Bank of China approaches the Brazilian Exporter and offers a trade finance refinancing deal: Bank of China originates a new 100 CNY loan for the Brazilian Exporter and delivers its $100 USD deposits (held at US Correspondent Bank) to settle and extinguish the Brazilian firm\'s USD debt. The Brazilian Exporter uses the USD to cancel its $100 USD loan at the US Bank.',
        footnote:
          'Debt De-Dollarization: Brazilian firm replaces USD loan with CNY loan. US Correspondent Bank cancels USD loan asset against Bank of China Vostro liability.',
        accounts: [
          {
            entityId: 'brazilian_company',
            entityName: 'Brazilian Exporter',
            subtitle: '(Extinguishes USD debt, assumes new CNY loan from Bank of China)',
            assets: [],
            liabilities: ['-100 USD Debt (Extinguished at US Bank)', '+100 CNY Debt (Bank of China)'],
          },
          {
            entityId: 'bank_of_china',
            entityName: 'Bank of China',
            subtitle: '(Exchanges USD Nostro asset for CNY loan claim on Brazilian firm)',
            assets: ['-100 USD Nostro Account (at US Bank)', '+100 CNY Loan (to Brazilian Exporter)'],
            liabilities: [],
          },
          {
            entityId: 'pboc',
            entityName: 'PBOC',
            subtitle: '(Neutral in this step)',
            assets: [],
            liabilities: [],
          },
          {
            entityId: 'fed',
            entityName: 'Federal Reserve (FRBNY)',
            subtitle: '(Neutral in this step)',
            assets: [],
            liabilities: [],
          },
          {
            entityId: 'us_bank',
            entityName: 'US Correspondent Bank',
            subtitle: '(USD debt repaid: cancels USD loan asset and Bank of China deposit)',
            assets: ['-100 USD Loan (to Brazilian Co)'],
            liabilities: ['-100 USD Vostro Account (Bank of China)'],
          },
        ],
      },
      {
        stepNumber: 4,
        title: 'Step 4: Cumulative Net Balance Sheet Transformation',
        subtitle: 'Final State Across All 5 Entities (Starting Position + All Steps Combined)',
        description:
          'The cumulative net balance sheet outcome across the entire chain: USD moved from US Treasury → PBOC → Bank of China → Brazil to extinguish US dollar claims. Brazil is now plugged into the Yuan system with a 100 CNY liability owed to Bank of China. PBOC offloaded $100 of US Treasury exposure and absorbed domestic CNY.',
        footnote:
          'Net Transformation Summary: Brazilian firm de-dollarized its debt into Yuan. PBOC successfully monetized and exited US sovereign debt. Bank of China created Yuan credit for South American trade.',
        accounts: [
          {
            entityId: 'brazilian_company',
            entityName: 'Brazilian Exporter',
            subtitle: '(Debt de-dollarized: swapped USD debt for CNY debt)',
            assets: [],
            liabilities: ['-100 USD Debt (Extinguished)', '+100 CNY Debt (Bank of China)'],
          },
          {
            entityId: 'bank_of_china',
            entityName: 'Bank of China',
            subtitle: '(Replaced central bank CNY reserves with CNY corporate loan asset)',
            assets: ['-100 CNY Reserves (at PBOC)', '+100 CNY Loan (to Brazilian Exporter)'],
            liabilities: [],
          },
          {
            entityId: 'pboc',
            entityName: 'PBOC',
            subtitle: '(Offloaded UST exposure, pulled domestic CNY back onto balance sheet)',
            assets: ['-100 US Treasuries (Matured/Exited)'],
            liabilities: ['-100 CNY Reserve Balances (Absorbed)'],
          },
          {
            entityId: 'fed',
            entityName: 'Federal Reserve (FRBNY)',
            subtitle: '(US Treasury debt paid out; reserves shifted to banking system)',
            assets: [],
            liabilities: ['-100 US Treasury Account (TGA)', '+100 Bank Reserves (US Correspondent Bank)'],
          },
          {
            entityId: 'us_bank',
            entityName: 'US Correspondent Bank',
            subtitle: '(Replaced private corporate loan asset with Fed cash reserves)',
            assets: ['-100 USD Loan (to Brazilian Co)', '+100 Fed Reserves (at FRBNY)'],
            liabilities: [],
          },
        ],
      },
    ],
  },
  {
    id: 'trade-surplus-deficit-net-financial-assets-correspondent-banking',
    scenarioNumber: '2',
    title: 'Scenario 2: Trade Surpluses, Deficits & Net Financial Asset (NFA) Accumulation',
    shortTitle: 'Scenario 2: Trade Surpluses, Deficits & NFA',
    subtitle: 'Cross-Border Real Goods Export & Correspondent Banking Settlement (Nostro / Vostro)',
    description:
      'A European manufacturing company sells car air conditioning (AC) units to an American automotive company. This scenario demonstrates the exact double-entry mechanics of international trade settlement via correspondent banking (Nostro/Vostro accounts) and proves how running a sustained trade surplus inexorably increases Net Financial Assets (NFA) in the surplus country while the deficit country incurs foreign financial liabilities.',
    keyTakeaway: {
      headline: 'The Fundamental Accounting Identity: Trade Surpluses = Net Financial Asset (NFA) Accumulation',
      body: 'When a nation runs a trade surplus (exports > imports), it gives up physical goods and real resources in exchange for financial claims on the rest of the world. Because domestic banks in surplus nations do not directly hold accounts at the Fed, cross-border payment settles across Correspondent Banking networks: the European Bank accumulates USD Nostro deposits in the US banking system. As a result, the surplus country experiences a net accumulation of Net Financial Assets (NFA), while the deficit country issues financial claims against its banking system.',
      mythBuster: 'Core Law: A trade surplus is not simply "cash coming in." It is an increase in the surplus nation\'s net foreign asset position (NFA), held either as correspondent bank deposits, foreign sovereign debt (e.g. US Treasuries), or direct foreign investments.',
    },
    entities: [
      { id: 'european_company', name: 'European Company', role: 'Exporter (Car AC Units)' },
      { id: 'american_company', name: 'American Company', role: 'Importer (Auto Maker)' },
      { id: 'european_bank', name: 'European Bank', role: 'Exporter Bank (Nostro Holder)' },
      { id: 'us_bank', name: 'US Bank', role: 'US Correspondent Bank' },
    ],
    steps: [
      {
        stepNumber: 0,
        isStartingPosition: true,
        badgeText: 'STARTING POSITION',
        title: 'Starting Position: Baseline Inventories, Customer Deposits & Correspondent Setup',
        subtitle: 'Initial Balance Sheets Prior to Cross-Border Trade & Settlement',
        description:
          'Before the trade occurs, the European Company holds 100 EUR worth of finished Car AC Units in physical inventory. The American Company holds 100 USD in bank deposits at its US Bank. The European Bank maintains an active correspondent banking relationship with the US Bank, holding a baseline USD Nostro account.',
        footnote:
          'Starting Point: Real goods in Europe; domestic USD purchasing power in the United States; existing correspondent banking pipe ready for international settlement.',
        accounts: [
          {
            entityId: 'european_company',
            entityName: 'European Company',
            subtitle: '(Holds physical AC unit inventory ready for export)',
            assets: ['+100 AC Units (Physical Inventory)'],
            liabilities: ['+100 Equity / Capital'],
          },
          {
            entityId: 'american_company',
            entityName: 'American Company',
            subtitle: '(Holds USD deposits for auto component purchases)',
            assets: ['+100 USD Deposits (US Bank)'],
            liabilities: ['+100 Equity / Capital'],
          },
          {
            entityId: 'european_bank',
            entityName: 'European Bank',
            subtitle: '(Holds baseline Nostro deposit at US Correspondent)',
            assets: ['+20 USD Nostro Account (at US Bank)'],
            liabilities: ['+20 EUR/USD Customer Deposits'],
          },
          {
            entityId: 'us_bank',
            entityName: 'US Bank',
            subtitle: '(Holds domestic customer & foreign bank Vostro deposits)',
            assets: ['+120 Reserves / Loans'],
            liabilities: ['+100 USD Deposits (American Co)', '+20 USD Vostro (European Bank)'],
          },
        ],
      },
      {
        stepNumber: 1,
        title: 'Step 1: Physical Shipment of Goods & Invoicing',
        subtitle: 'European Company Ships Car AC Units to American Importer',
        description:
          'The European Company exports and ships the $100 worth of Car AC Units to the American Company. The American Company receives the physical units into its factory and records a trade payable. The European Company records a cross-border trade receivable.',
        footnote:
          'Real Asset Transfer: Real goods move physically from Europe to the US. Financial claims (Receivable / Payable) are created between the non-bank corporations.',
        accounts: [
          {
            entityId: 'european_company',
            entityName: 'European Company',
            subtitle: '(Transfers inventory into trade receivable)',
            assets: ['-100 AC Units (Shipped)', '+100 Trade Receivable (from US Co)'],
            liabilities: [],
          },
          {
            entityId: 'american_company',
            entityName: 'American Company',
            subtitle: '(Receives AC units, incurs trade payable liability)',
            assets: ['+100 AC Units (Physical Inventory)'],
            liabilities: ['+100 Trade Payable (to European Co)'],
          },
          {
            entityId: 'european_bank',
            entityName: 'European Bank',
            subtitle: '(No balance sheet entry until payment is initiated)',
            assets: [],
            liabilities: [],
          },
          {
            entityId: 'us_bank',
            entityName: 'US Bank',
            subtitle: '(No balance sheet entry until payment is initiated)',
            assets: [],
            liabilities: [],
          },
        ],
      },
      {
        stepNumber: 2,
        title: 'Step 2: American Company Instructs US Bank to Settle Invoice via Correspondent Bank',
        subtitle: 'Domestic USD Deposit Transfer to European Bank\'s Vostro/Nostro Account',
        description:
          'The American Company instructs its US Bank to pay $100 to settle the invoice. Because the European Company uses European Bank, the US Bank executes the payment by debiting the American Company\'s deposit account and crediting the European Bank\'s USD Correspondent (Vostro) account in New York.',
        footnote:
          'Correspondent Banking Settlement: US dollars never leave the US banking system. Ownership of US bank liabilities simply shifts from a domestic US resident to a foreign European commercial bank.',
        accounts: [
          {
            entityId: 'european_company',
            entityName: 'European Company',
            subtitle: '(Awaiting bank notification of settlement)',
            assets: [],
            liabilities: [],
          },
          {
            entityId: 'american_company',
            entityName: 'American Company',
            subtitle: '(Pays with USD deposits, extinguishes trade payable)',
            assets: ['-100 USD Deposits (US Bank)'],
            liabilities: ['-100 Trade Payable (Extinguished)'],
          },
          {
            entityId: 'european_bank',
            entityName: 'European Bank',
            subtitle: '(Nostro account balance at US Bank increases by +$100)',
            assets: ['+100 USD Nostro Account (at US Bank)'],
            liabilities: ['+100 Due to Customer / Pending Credit'],
          },
          {
            entityId: 'us_bank',
            entityName: 'US Bank',
            subtitle: '(Debits US importer, credits European Bank Vostro)',
            assets: [],
            liabilities: ['-100 USD Deposits (American Co)', '+100 USD Vostro (European Bank)'],
          },
        ],
      },
      {
        stepNumber: 3,
        title: 'Step 3: European Bank Credits European Exporter with Domestic Deposits',
        subtitle: 'Extinguishing Trade Receivable & Domestic Broad Money Creation in Europe',
        description:
          'Upon receiving payment confirmation through the SWIFT correspondent network, the European Bank credits the European Company\'s domestic account (in EUR equivalent or USD customer deposits) and extinguishes the pending credit. The European Company writes off its Trade Receivable.',
        footnote:
          'Exporter Monetization: The European exporter now possesses usable domestic bank deposits. The European Bank retains the foreign USD claim on the US correspondent bank.',
        accounts: [
          {
            entityId: 'european_company',
            entityName: 'European Company',
            subtitle: '(Extinguishes receivable, gains bank deposits)',
            assets: ['-100 Trade Receivable (Settled)', '+100 EUR Deposits (European Bank)'],
            liabilities: [],
          },
          {
            entityId: 'american_company',
            entityName: 'American Company',
            subtitle: '(Settlement complete, holds AC units in production)',
            assets: [],
            liabilities: [],
          },
          {
            entityId: 'european_bank',
            entityName: 'European Bank',
            subtitle: '(Finalizes customer deposit credit against Nostro asset)',
            assets: [],
            liabilities: ['-100 Due to Customer / Pending', '+100 EUR Deposits (European Co)'],
          },
          {
            entityId: 'us_bank',
            entityName: 'US Bank',
            subtitle: '(Maintains European Bank Vostro deposit balance)',
            assets: [],
            liabilities: [],
          },
        ],
      },
      {
        stepNumber: 4,
        title: 'Step 4: Cumulative Net Balance Sheet Transformation & NFA Accumulation',
        subtitle: 'Final State Across All 4 Entities (Starting Position + All Steps Combined)',
        description:
          'The cumulative balance sheet transformation reveals the macroeconomic reality of international trade: Europe has accumulated +100 Net Financial Assets (NFA) in the form of US dollar claims. The United States has gained real physical goods (Car AC Units) in exchange for a net financial liability owed to the European banking system.',
        footnote:
          'Macroeconomic Identity: Trade Surplus = Net Foreign Financial Asset Accumulation (Europe NFA +100). Trade Deficit = Net Foreign Financial Liability Incurred (US NFA -100).',
        accounts: [
          {
            entityId: 'european_company',
            entityName: 'European Company',
            subtitle: '(Exchanged physical goods for financial deposits)',
            assets: ['-100 AC Units (Physical Inventory)', '+100 EUR Deposits (European Bank)'],
            liabilities: [],
          },
          {
            entityId: 'american_company',
            entityName: 'American Company',
            subtitle: '(Exchanged USD financial liquidity for physical goods)',
            assets: ['-100 USD Deposits (US Bank)', '+100 AC Units (Physical Inventory)'],
            liabilities: [],
          },
          {
            entityId: 'european_bank',
            entityName: 'European Bank',
            subtitle: '(Accumulated +100 USD foreign asset / expanded NFA)',
            assets: ['+100 USD Nostro Account (at US Bank)'],
            liabilities: ['+100 EUR Deposits (European Co)'],
          },
          {
            entityId: 'us_bank',
            entityName: 'US Bank',
            subtitle: '(Deposits rotated from US resident to foreign entity)',
            assets: [],
            liabilities: ['-100 USD Deposits (American Co)', '+100 USD Vostro (European Bank)'],
          },
        ],
      },
    ],
  },
];
