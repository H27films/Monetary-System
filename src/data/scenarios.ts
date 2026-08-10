import { Scenario } from '../types/monetary';
import { createDefaultInitialState } from './initialStates';

export const scenarios: Scenario[] = [
  {
    id: 'treasury-issuance-and-spending',
    title: '1. Treasury Issuance & TGA Fiscal Mechanics',
    category: 'Fiscal & Debt',
    difficulty: 'Intermediate',
    description: 'Trace what happens step-by-step when the US Treasury issues new bonds to Primary Dealers and then spends the TGA cash into the private economy.',
    realWorldContext: 'When the government spends money, where does it come from? This scenario breaks down the exact reserve movements between the Fed, Primary Dealer banks, and private checking accounts.',
    initialState: createDefaultInitialState(),
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Treasury Issues $100B New Debt',
        subtitle: 'Authorization of New Sovereign Bonds',
        description: 'The US Treasury announces and issues $100 Billion in new Treasury bonds to finance government operations.',
        accountingExplanation: 'Treasury increases its Liabilities (Debt Issued) by $100B. On its sovereign ledger, this is offset by net fiscal commitments.',
        macroImpact: {
          m0Change: 'Unchanged ($1,100B)',
          m1Change: 'Unchanged ($1,350B)',
          tgaChange: 'Unchanged ($200B)',
          keyTakeaway: 'Debt issuance alone does not create money or move reserves until sold and settled.',
        },
        entityDeltas: {
          treasury: {
            liabilities: { tr_debt_issued: 100 },
            equity: { tr_net_fiscal: -100 },
          },
          central_bank: {},
          bank_a: {},
          bank_b: {},
          pension_fund: {},
          individual: {},
        },
        flowingMoney: [],
        journalEntries: [
          {
            id: 'j1_1',
            stepNumber: 1,
            timestamp: '09:00:00',
            title: 'Treasury Debt Authorization',
            description: 'Treasury issues $100B in new Treasury securities.',
            entries: [
              { entityId: 'treasury', accountName: 'Sovereign Fiscal Deficit', type: 'debit', amount: 100, category: 'equity' },
              { entityId: 'treasury', accountName: 'Total US Debt Issued', type: 'credit', amount: 100, category: 'liability' },
            ],
          },
        ],
      },

      {
        stepNumber: 2,
        title: 'Step 2: Primary Dealer Purchases $100B Bonds with Fed Reserves',
        subtitle: 'Primary Market Auction Settlement',
        description: 'Primary Dealer Bank A buys the $100B Treasury bonds using its reserve balance at the Central Bank. The Fed transfers $100B from Bank A Reserves to the Treasury General Account (TGA).',
        accountingExplanation: 'Bank A swaps $100B of Reserves (Asset) for $100B of Treasuries (Asset). The Fed shifts $100B of Liabilities from Bank A Reserves to the TGA. Treasury gets $100B TGA cash (Asset).',
        macroImpact: {
          m0Change: 'Unchanged ($1,100B)',
          m1Change: 'Unchanged ($1,350B)',
          tgaChange: '+$100B ($300B)',
          keyTakeaway: 'Bond purchases by banks drain bank reserves into TGA, temporarily tightening interbank liquidity, but do NOT affect broad money (M1).',
        },
        entityDeltas: {
          bank_a: {
            assets: { ba_reserves: -100, ba_treasuries: 100 },
          },
          central_bank: {
            liabilities: { cb_reserves_bank_a: -100, cb_tga: 100 },
          },
          treasury: {
            assets: { tr_tga: 100 },
            equity: { tr_net_fiscal: 0 },
          },
          bank_b: {},
          pension_fund: {},
          individual: {},
        },
        flowingMoney: [
          {
            id: 'fm_1_2_1',
            fromEntity: 'bank_a',
            toEntity: 'central_bank',
            assetType: 'Central Bank Reserves',
            amount: 100,
            description: 'Bank A sends $100B Reserves to Fed to pay for Treasuries',
          },
          {
            id: 'fm_1_2_2',
            fromEntity: 'central_bank',
            toEntity: 'treasury',
            assetType: 'TGA Deposit Credit',
            amount: 100,
            description: 'Fed credits $100B to Treasury General Account (TGA)',
          },
        ],
        journalEntries: [
          {
            id: 'j1_2',
            stepNumber: 2,
            timestamp: '10:30:00',
            title: 'Treasury Bond Auction Settlement',
            description: 'Bank A pays $100B reserves for bonds; Fed transfers funds to TGA.',
            entries: [
              { entityId: 'bank_a', accountName: 'US Treasuries', type: 'debit', amount: 100, category: 'asset' },
              { entityId: 'bank_a', accountName: 'Reserves at Central Bank', type: 'credit', amount: 100, category: 'asset' },
              { entityId: 'central_bank', accountName: 'Bank A Reserves', type: 'debit', amount: 100, category: 'liability' },
              { entityId: 'central_bank', accountName: 'Treasury General Account (TGA)', type: 'credit', amount: 100, category: 'liability' },
              { entityId: 'treasury', accountName: 'TGA Cash (at Central Bank)', type: 'debit', amount: 100, category: 'asset' },
            ],
          },
        ],
      },

      {
        stepNumber: 3,
        title: 'Step 3: Treasury Spends $100B TGA Cash into Economy',
        subtitle: 'Fiscal Spending & Commercial Deposit Expansion',
        description: 'The Treasury spends $100B from TGA to pay government contractors, workers, and citizens (Private Individual account at Bank A).',
        accountingExplanation: 'Treasury TGA cash (Asset) decreases by $100B. On Fed liabilities, $100B shifts from TGA back to Bank A Reserves. Bank A credits Private Individual customer deposit account by $100B.',
        macroImpact: {
          m0Change: 'Unchanged ($1,100B)',
          m1Change: '+$100B ($1,450B)',
          tgaChange: '-$100B ($200B back to initial)',
          keyTakeaway: 'Fiscal spending CREATES broad money (M1) and restores bank reserves! The government spend-and-tax/issue cycle is a primary engine of private deposit creation.',
        },
        entityDeltas: {
          treasury: {
            assets: { tr_tga: -100 },
            equity: { tr_net_fiscal: 100 },
          },
          central_bank: {
            liabilities: { cb_tga: -100, cb_reserves_bank_a: 100 },
          },
          bank_a: {
            assets: { ba_reserves: 100 },
            liabilities: { ba_dep_ind: 100 },
          },
          individual: {
            assets: { ind_dep_bank_a: 100 },
            equity: { ind_net_worth: 100 },
          },
          bank_b: {},
          pension_fund: {},
        },
        flowingMoney: [
          {
            id: 'fm_1_3_1',
            fromEntity: 'treasury',
            toEntity: 'central_bank',
            assetType: 'TGA Balance',
            amount: 100,
            description: 'Treasury instructs Fed to release $100B TGA cash',
          },
          {
            id: 'fm_1_3_2',
            fromEntity: 'central_bank',
            toEntity: 'bank_a',
            assetType: 'Reserves Transfer',
            amount: 100,
            description: 'Fed transfers $100B Reserves back to Bank A',
          },
          {
            id: 'fm_1_3_3',
            fromEntity: 'bank_a',
            toEntity: 'individual',
            assetType: 'Customer Deposit Credit',
            amount: 100,
            description: 'Bank A credits $100B deposit into Individual checking account',
          },
        ],
        journalEntries: [
          {
            id: 'j1_3',
            stepNumber: 3,
            timestamp: '14:00:00',
            title: 'Fiscal Government Outlays',
            description: 'Treasury spends $100B into private household bank account.',
            entries: [
              { entityId: 'treasury', accountName: 'Sovereign Fiscal Deficit', type: 'debit', amount: 100, category: 'equity' },
              { entityId: 'treasury', accountName: 'TGA Cash (at Central Bank)', type: 'credit', amount: 100, category: 'asset' },
              { entityId: 'central_bank', accountName: 'Treasury General Account (TGA)', type: 'debit', amount: 100, category: 'liability' },
              { entityId: 'central_bank', accountName: 'Bank A Reserves', type: 'credit', amount: 100, category: 'liability' },
              { entityId: 'bank_a', accountName: 'Reserves at Central Bank', type: 'debit', amount: 100, category: 'asset' },
              { entityId: 'bank_a', accountName: 'Individual Deposits', type: 'credit', amount: 100, category: 'liability' },
              { entityId: 'individual', accountName: 'Bank A Deposits', type: 'debit', amount: 100, category: 'asset' },
              { entityId: 'individual', accountName: 'Household Net Worth', type: 'credit', amount: 100, category: 'equity' },
            ],
          },
        ],
      },
    ],
  },

  {
    id: 'qe-bank-vs-nonbank',
    title: '2. Quantitative Easing (QE): Bank vs. Non-Bank Counterparty',
    category: 'QE & Central Banking',
    difficulty: 'Advanced',
    description: 'Discover why Central Bank asset purchases (QE) have completely different money supply effects depending on whether the seller is a commercial bank or a non-bank pension fund.',
    realWorldContext: 'Central banks buy bonds to inject liquidity. But does QE create broad money in private checking accounts? It depends strictly on WHO holds the bond being bought.',
    initialState: createDefaultInitialState(),
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Fed Purchases $50B Treasuries from Bank A (Commercial Bank)',
        subtitle: 'QE with a Commercial Bank Counterparty',
        description: 'The Fed purchases $50B of Treasuries directly from Primary Dealer Bank A.',
        accountingExplanation: 'Fed Assets (Treasuries) increase by $50B; Fed Liabilities (Bank A Reserves) increase by $50B. Bank A swaps Treasuries (-$50B) for Reserves (+$50B). Bank A liabilities do not change!',
        macroImpact: {
          m0Change: '+$50B ($1,150B)',
          m1Change: 'Unchanged ($1,350B)',
          tgaChange: 'Unchanged ($200B)',
          keyTakeaway: 'QE with a commercial bank expands Base Money (M0/Reserves) but DOES NOT expand Broad Money (M1) because no customer deposit accounts are involved.',
        },
        entityDeltas: {
          central_bank: {
            assets: { cb_us_treasuries: 50 },
            liabilities: { cb_reserves_bank_a: 50 },
          },
          bank_a: {
            assets: { ba_treasuries: -50, ba_reserves: 50 },
          },
          bank_b: {},
          pension_fund: {},
          individual: {},
          treasury: {},
        },
        flowingMoney: [
          {
            id: 'fm_2_1_1',
            fromEntity: 'bank_a',
            toEntity: 'central_bank',
            assetType: 'US Treasuries',
            amount: 50,
            description: 'Bank A transfers $50B Treasuries to Fed SOMA portfolio',
          },
          {
            id: 'fm_2_1_2',
            fromEntity: 'central_bank',
            toEntity: 'bank_a',
            assetType: 'New Reserve Creation',
            amount: 50,
            description: 'Fed credits $50B newly created reserves to Bank A',
          },
        ],
        journalEntries: [
          {
            id: 'j2_1',
            stepNumber: 1,
            timestamp: '09:15:00',
            title: 'QE Open Market Purchase from Commercial Bank',
            description: 'Fed buys $50B Treasuries from Bank A.',
            entries: [
              { entityId: 'central_bank', accountName: 'US Treasuries (SOMA)', type: 'debit', amount: 50, category: 'asset' },
              { entityId: 'central_bank', accountName: 'Bank A Reserves', type: 'credit', amount: 50, category: 'liability' },
              { entityId: 'bank_a', accountName: 'Reserves at Central Bank', type: 'debit', amount: 50, category: 'asset' },
              { entityId: 'bank_a', accountName: 'US Treasuries', type: 'credit', amount: 50, category: 'asset' },
            ],
          },
        ],
      },

      {
        stepNumber: 2,
        title: 'Step 2: Fed Purchases $50B Treasuries from Pension Fund (Non-Bank)',
        subtitle: 'QE with a Non-Bank Financial Counterparty',
        description: 'The Fed purchases $50B of Treasuries from the Pension Fund. Since the Pension Fund cannot hold reserves at the Fed, the transaction settles through Bank A.',
        accountingExplanation: 'Fed Assets (Treasuries) +$50B; Fed Liabilities (Bank A Reserves) +$50B. Bank A receives $50B Reserves at Fed (Asset) and credits Pension Fund Deposit (Liability) +$50B. Pension Fund swaps Treasuries (-$50B) for Bank Deposit (+$50B).',
        macroImpact: {
          m0Change: '+$50B ($1,200B total Fed size)',
          m1Change: '+$50B ($1,400B broad money)',
          tgaChange: 'Unchanged ($200B)',
          keyTakeaway: 'QE with a non-bank institution CREATES NEW BROAD MONEY (M1)! The commercial bank balance sheet expands on both sides.',
        },
        entityDeltas: {
          central_bank: {
            assets: { cb_us_treasuries: 50 },
            liabilities: { cb_reserves_bank_a: 50 },
          },
          bank_a: {
            assets: { ba_reserves: 50 },
            liabilities: { ba_dep_pension: 50 },
          },
          pension_fund: {
            assets: { pf_treasuries: -50, pf_bank_dep: 50 },
          },
          bank_b: {},
          individual: {},
          treasury: {},
        },
        flowingMoney: [
          {
            id: 'fm_2_2_1',
            fromEntity: 'pension_fund',
            toEntity: 'central_bank',
            assetType: 'US Treasuries',
            amount: 50,
            description: 'Pension Fund sells $50B Treasuries to Fed via dealer',
          },
          {
            id: 'fm_2_2_2',
            fromEntity: 'central_bank',
            toEntity: 'bank_a',
            assetType: 'New Reserves',
            amount: 50,
            description: 'Fed credits $50B Reserves to clearing Bank A',
          },
          {
            id: 'fm_2_2_3',
            fromEntity: 'bank_a',
            toEntity: 'pension_fund',
            assetType: 'Commercial Bank Deposit',
            amount: 50,
            description: 'Bank A credits $50B deposit to Pension Fund account',
          },
        ],
        journalEntries: [
          {
            id: 'j2_2',
            stepNumber: 2,
            timestamp: '11:00:00',
            title: 'QE Open Market Purchase from Non-Bank Financial',
            description: 'Fed buys $50B Treasuries from Pension Fund via Bank A.',
            entries: [
              { entityId: 'central_bank', accountName: 'US Treasuries (SOMA)', type: 'debit', amount: 50, category: 'asset' },
              { entityId: 'central_bank', accountName: 'Bank A Reserves', type: 'credit', amount: 50, category: 'liability' },
              { entityId: 'bank_a', accountName: 'Reserves at Central Bank', type: 'debit', amount: 50, category: 'asset' },
              { entityId: 'bank_a', accountName: 'Pension Fund Deposits', type: 'credit', amount: 50, category: 'liability' },
              { entityId: 'pension_fund', accountName: 'Bank Deposits (at Bank A)', type: 'debit', amount: 50, category: 'asset' },
              { entityId: 'pension_fund', accountName: 'US Treasuries', type: 'credit', amount: 50, category: 'asset' },
            ],
          },
        ],
      },

      {
        stepNumber: 3,
        title: 'Step 3: Comparison & Macro Analysis',
        subtitle: 'Key Economic Structural Insight',
        description: 'Compare the two steps side by side: Step 1 swapped Bank A assets (Bonds → Reserves) without changing broad money. Step 2 created NEW commercial bank deposits for the Pension Fund, expanding M1 broad money.',
        accountingExplanation: 'Summary: Central Bank balance sheet grew by $100B. Total Bank Reserves grew by $100B. Broad money M1 grew by ONLY $50B (from the non-bank purchase).',
        macroImpact: {
          m0Change: '+$100B ($1,200B total)',
          m1Change: '+$50B ($1,400B total)',
          tgaChange: 'Unchanged ($200B)',
          keyTakeaway: 'This fundamental distinction explains why QE post-2008 (mostly bank counterparty) did not cause broad CPI inflation, whereas post-2020 fiscal stimulus + non-bank purchases expanded M1 rapidly.',
        },
        entityDeltas: {
          central_bank: {},
          bank_a: {},
          bank_b: {},
          pension_fund: {},
          individual: {},
          treasury: {},
        },
        flowingMoney: [],
        journalEntries: [],
      },
    ],
  },

  {
    id: 'commercial-bank-credit-creation',
    title: '3. Commercial Bank Credit & Loan Creation',
    category: 'Commercial Credit',
    difficulty: 'Beginner',
    description: 'Observe how commercial banks create new deposits "out of thin air" when originating loans, and how interbank clearing settles through central bank reserves.',
    realWorldContext: 'Contrary to the popular "loanable funds" myth, banks do not lend out pre-existing deposits. When a bank grants a loan, it simultaneously creates a brand new deposit liability and a loan asset.',
    initialState: createDefaultInitialState(),
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Bank A Grants a $40B Business Loan to Individual',
        subtitle: 'Endogenous Money Creation out of Thin Air',
        description: 'Bank A approves a $40B commercial loan to Private Individual. Instead of taking reserves or existing deposits, Bank A simply writes up $40B on both sides of its balance sheet.',
        accountingExplanation: 'Bank A Assets: Loans +$40B. Bank A Liabilities: Individual Customer Deposit +$40B. Individual Assets: Bank Deposit +$40B. Individual Liabilities: Bank Loan +$40B.',
        macroImpact: {
          m0Change: 'Unchanged ($1,100B)',
          m1Change: '+$40B ($1,390B)',
          tgaChange: 'Unchanged ($200B)',
          keyTakeaway: 'Banks create new money (deposits) whenever they issue loans. No central bank reserves were created or moved in this step!',
        },
        entityDeltas: {
          bank_a: {
            assets: { ba_loans: 40 },
            liabilities: { ba_dep_ind: 40 },
          },
          individual: {
            assets: { ind_dep_bank_a: 40 },
            liabilities: { ind_bank_loans: 40 },
          },
          central_bank: {},
          bank_b: {},
          pension_fund: {},
          treasury: {},
        },
        flowingMoney: [
          {
            id: 'fm_3_1_1',
            fromEntity: 'bank_a',
            toEntity: 'individual',
            assetType: 'Newly Created Deposit',
            amount: 40,
            description: 'Bank A credits $40B deposit into Individual account upon loan agreement',
          },
        ],
        journalEntries: [
          {
            id: 'j3_1',
            stepNumber: 1,
            timestamp: '09:30:00',
            title: 'Bank Loan Origination',
            description: 'Bank A grants $40B loan, creating $40B new deposit.',
            entries: [
              { entityId: 'bank_a', accountName: 'Commercial Loans', type: 'debit', amount: 40, category: 'asset' },
              { entityId: 'bank_a', accountName: 'Individual Deposits', type: 'credit', amount: 40, category: 'liability' },
              { entityId: 'individual', accountName: 'Bank A Deposits', type: 'debit', amount: 40, category: 'asset' },
              { entityId: 'individual', accountName: 'Bank Loans & Mortgages', type: 'credit', amount: 40, category: 'liability' },
            ],
          },
        ],
      },

      {
        stepNumber: 2,
        title: 'Step 2: Individual Transfers $20B to Bank B for a Property Purchase',
        subtitle: 'Interbank Settlement via Central Bank Reserves',
        description: 'Individual spends $20B of the new deposit to buy property from an individual banking at Bank B.',
        accountingExplanation: 'Individual shifts $20B from Bank A Deposits to Bank B Deposits. Bank A loses $20B deposit liability and $20B Fed Reserves. Bank B gains $20B deposit liability and $20B Fed Reserves. Fed shifts $20B reserves from Bank A to Bank B.',
        macroImpact: {
          m0Change: 'Unchanged ($1,100B)',
          m1Change: 'Unchanged ($1,390B)',
          tgaChange: 'Unchanged ($200B)',
          keyTakeaway: 'Interbank transfers do NOT change total money supply or total reserves — reserves merely reallocate between banks at the Central Bank settlement layer.',
        },
        entityDeltas: {
          individual: {
            assets: { ind_dep_bank_a: -20, ind_dep_bank_b: 20 },
          },
          bank_a: {
            assets: { ba_reserves: -20 },
            liabilities: { ba_dep_ind: -20 },
          },
          bank_b: {
            assets: { bb_reserves: 20 },
            liabilities: { bb_dep_ind: 20 },
          },
          central_bank: {
            liabilities: { cb_reserves_bank_a: -20, cb_reserves_bank_b: 20 },
          },
          pension_fund: {},
          treasury: {},
        },
        flowingMoney: [
          {
            id: 'fm_3_2_1',
            fromEntity: 'bank_a',
            toEntity: 'central_bank',
            assetType: 'Reserves Transfer',
            amount: 20,
            description: 'Bank A sends $20B Reserves to Fed for clearing',
          },
          {
            id: 'fm_3_2_2',
            fromEntity: 'central_bank',
            toEntity: 'bank_b',
            assetType: 'Reserves Transfer',
            amount: 20,
            description: 'Fed credits $20B Reserves to Bank B account',
          },
          {
            id: 'fm_3_2_3',
            fromEntity: 'bank_b',
            toEntity: 'individual',
            assetType: 'Deposit Credit',
            amount: 20,
            description: 'Bank B credits seller deposit account',
          },
        ],
        journalEntries: [
          {
            id: 'j3_2',
            stepNumber: 2,
            timestamp: '13:15:00',
            title: 'Interbank Payment Settlement',
            description: 'Individual transfers $20B from Bank A to Bank B.',
            entries: [
              { entityId: 'bank_a', accountName: 'Individual Deposits', type: 'debit', amount: 20, category: 'liability' },
              { entityId: 'bank_a', accountName: 'Reserves at Central Bank', type: 'credit', amount: 20, category: 'asset' },
              { entityId: 'central_bank', accountName: 'Bank A Reserves', type: 'debit', amount: 20, category: 'liability' },
              { entityId: 'central_bank', accountName: 'Bank B Reserves', type: 'credit', amount: 20, category: 'liability' },
              { entityId: 'bank_b', accountName: 'Reserves at Central Bank', type: 'debit', amount: 20, category: 'asset' },
              { entityId: 'bank_b', accountName: 'Individual Customer Deposits', type: 'credit', amount: 20, category: 'liability' },
            ],
          },
        ],
      },

      {
        stepNumber: 3,
        title: 'Step 3: Individual Repays $10B Existing Loan at Bank B',
        subtitle: 'Loan Principal Repayment Destroys Money',
        description: 'Individual uses $10B of deposit balance at Bank B to pay down mortgage principal owed to Bank B.',
        accountingExplanation: 'Individual Assets (Bank B Deposit) -$10B; Individual Liabilities (Bank Loans) -$10B. Bank B Liabilities (Customer Deposit) -$10B; Bank B Assets (Commercial Loans) -$10B.',
        macroImpact: {
          m0Change: 'Unchanged ($1,100B)',
          m1Change: '-$10B ($1,380B)',
          tgaChange: 'Unchanged ($200B)',
          keyTakeaway: 'Just as lending creates money, paying off bank loans DESTROYS broad money (M1)! The commercial banking system constantly expands and contracts money via credit cycles.',
        },
        entityDeltas: {
          individual: {
            assets: { ind_dep_bank_b: -10 },
            liabilities: { ind_bank_loans: -10 },
          },
          bank_b: {
            assets: { bb_loans: -10 },
            liabilities: { bb_dep_ind: -10 },
          },
          central_bank: {},
          bank_a: {},
          pension_fund: {},
          treasury: {},
        },
        flowingMoney: [
          {
            id: 'fm_3_3_1',
            fromEntity: 'individual',
            toEntity: 'bank_b',
            assetType: 'Deposit Principal Repayment',
            amount: 10,
            description: 'Individual extinguishes $10B debt liability against $10B deposit balance',
          },
        ],
        journalEntries: [
          {
            id: 'j3_3',
            stepNumber: 3,
            timestamp: '16:00:00',
            title: 'Loan Principal Debt Extinction',
            description: 'Individual repays $10B principal loan to Bank B.',
            entries: [
              { entityId: 'individual', accountName: 'Bank Loans & Mortgages', type: 'debit', amount: 10, category: 'liability' },
              { entityId: 'individual', accountName: 'Bank B Deposits', type: 'credit', amount: 10, category: 'asset' },
              { entityId: 'bank_b', accountName: 'Individual Customer Deposits', type: 'debit', amount: 10, category: 'liability' },
              { entityId: 'bank_b', accountName: 'Commercial & Retail Loans', type: 'credit', amount: 10, category: 'asset' },
            ],
          },
        ],
      },
    ],
  },

  {
    id: 'qt-treasury-rolloff',
    title: '4. Quantitative Tightening (QT) & Bond Roll-Off',
    category: 'QE & Central Banking',
    difficulty: 'Advanced',
    description: 'Examine how the Central Bank shrinks its balance sheet during Quantitative Tightening (QT) when Treasury debt matures without reinvestment.',
    realWorldContext: 'When the Fed stops reinvesting maturing Treasuries, Treasury must pay off the Fed and issue new debt to private buyers. This drains reserves and private liquidity.',
    initialState: createDefaultInitialState(),
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: $30B of Fed Treasuries Mature (Roll-Off)',
        subtitle: 'SOMA Maturity without Reinvestment',
        description: '$30B of Treasuries held by the Fed reach maturity. Treasury pays off the Fed using its TGA balance.',
        accountingExplanation: 'Fed Assets (Treasuries) -$30B; Fed Liabilities (TGA) -$30B. Treasury Assets (TGA) -$30B; Treasury Liabilities (Debt Issued) -$30B.',
        macroImpact: {
          m0Change: '-$30B ($1,070B Fed size)',
          m1Change: 'Unchanged ($1,350B)',
          tgaChange: '-$30B ($170B)',
          keyTakeaway: 'When the Fed lets bonds roll off, both Fed assets and TGA liabilities shrink. Broad money is not yet affected in this step.',
        },
        entityDeltas: {
          central_bank: {
            assets: { cb_us_treasuries: -30 },
            liabilities: { cb_tga: -30 },
          },
          treasury: {
            assets: { tr_tga: -30 },
            liabilities: { tr_debt_issued: -30 },
          },
          bank_a: {},
          bank_b: {},
          pension_fund: {},
          individual: {},
        },
        flowingMoney: [
          {
            id: 'fm_4_1_1',
            fromEntity: 'treasury',
            toEntity: 'central_bank',
            assetType: 'TGA Redemption Payment',
            amount: 30,
            description: 'Treasury pays $30B TGA cash to extinguish maturing SOMA bond',
          },
        ],
        journalEntries: [
          {
            id: 'j4_1',
            stepNumber: 1,
            timestamp: '09:00:00',
            title: 'SOMA Debt Redemption at Maturity',
            description: 'Treasury redeems $30B maturing bonds held by Fed using TGA cash.',
            entries: [
              { entityId: 'central_bank', accountName: 'Treasury General Account (TGA)', type: 'debit', amount: 30, category: 'liability' },
              { entityId: 'central_bank', accountName: 'US Treasuries (SOMA)', type: 'credit', amount: 30, category: 'asset' },
              { entityId: 'treasury', accountName: 'Total US Debt Issued', type: 'debit', amount: 30, category: 'liability' },
              { entityId: 'treasury', accountName: 'TGA Cash (at Central Bank)', type: 'credit', amount: 30, category: 'asset' },
            ],
          },
        ],
      },

      {
        stepNumber: 2,
        title: 'Step 2: Treasury Refinances by Selling $30B Bonds to Pension Fund',
        subtitle: 'Refinancing Maturing Debt in Private Markets',
        description: 'To replenish its TGA cash, Treasury issues $30B of replacement bonds, which are purchased by the Pension Fund via Bank A.',
        accountingExplanation: 'Pension Fund swaps $30B Bank Deposit (Asset) for $30B Treasuries (Asset). Bank A loses $30B Deposit Liability and $30B Fed Reserves. Fed shifts $30B from Bank A Reserves to TGA. Treasury gets $30B TGA cash.',
        macroImpact: {
          m0Change: 'Unchanged ($1,070B)',
          m1Change: '-$30B ($1,320B)',
          tgaChange: '+$30B (Back to $200B)',
          keyTakeaway: 'The full QT cycle (Fed roll-off + private market debt refinancing) DRAINS $30B of Broad Money (M1) and $30B of Bank Reserves!',
        },
        entityDeltas: {
          pension_fund: {
            assets: { pf_bank_dep: -30, pf_treasuries: 30 },
          },
          bank_a: {
            assets: { ba_reserves: -30 },
            liabilities: { ba_dep_pension: -30 },
          },
          central_bank: {
            liabilities: { cb_reserves_bank_a: -30, cb_tga: 30 },
          },
          treasury: {
            assets: { tr_tga: 30 },
            liabilities: { tr_debt_issued: 30 },
          },
          bank_b: {},
          individual: {},
        },
        flowingMoney: [
          {
            id: 'fm_4_2_1',
            fromEntity: 'pension_fund',
            toEntity: 'bank_a',
            assetType: 'Bank Deposit',
            amount: 30,
            description: 'Pension Fund uses $30B bank deposits to purchase new Treasury bond',
          },
          {
            id: 'fm_4_2_2',
            fromEntity: 'bank_a',
            toEntity: 'central_bank',
            assetType: 'Reserves Transfer',
            amount: 30,
            description: 'Bank A transfers $30B reserves to Fed TGA',
          },
          {
            id: 'fm_4_2_3',
            fromEntity: 'central_bank',
            toEntity: 'treasury',
            assetType: 'TGA Deposit',
            amount: 30,
            description: 'Fed credits $30B to Treasury General Account',
          },
        ],
        journalEntries: [
          {
            id: 'j4_2',
            stepNumber: 2,
            timestamp: '11:30:00',
            title: 'Treasury Refinancing Auction Purchase by Non-Bank',
            description: 'Pension Fund buys $30B new bonds, draining $30B reserves and $30B deposits.',
            entries: [
              { entityId: 'pension_fund', accountName: 'US Treasuries', type: 'debit', amount: 30, category: 'asset' },
              { entityId: 'pension_fund', accountName: 'Bank Deposits (at Bank A)', type: 'credit', amount: 30, category: 'asset' },
              { entityId: 'bank_a', accountName: 'Pension Fund Deposits', type: 'debit', amount: 30, category: 'liability' },
              { entityId: 'bank_a', accountName: 'Reserves at Central Bank', type: 'credit', amount: 30, category: 'asset' },
              { entityId: 'central_bank', accountName: 'Bank A Reserves', type: 'debit', amount: 30, category: 'liability' },
              { entityId: 'central_bank', accountName: 'Treasury General Account (TGA)', type: 'credit', amount: 30, category: 'liability' },
              { entityId: 'treasury', accountName: 'TGA Cash (at Central Bank)', type: 'debit', amount: 30, category: 'asset' },
              { entityId: 'treasury', accountName: 'Total US Debt Issued', type: 'credit', amount: 30, category: 'liability' },
            ],
          },
        ],
      },
    ],
  },

  {
    id: 'cash-drain-and-rrp',
    title: '5. Reverse Repo (ON RRP) & Physical Cash Drain',
    category: 'Liquidity & Cash',
    difficulty: 'Intermediate',
    description: 'Observe how overnight liquidity facilities like Reverse Repo (ON RRP) and physical cash withdrawals shift central bank liability composition.',
    realWorldContext: 'Central Bank liabilities consist of Bank Reserves, TGA, Reverse Repo (ON RRP), and Physical Cash. Money constantly shifts between these 4 buckets depending on market incentives.',
    initialState: createDefaultInitialState(),
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Private Individual Withdraws $15B Physical Cash from Bank B',
        subtitle: 'Commercial Bank Reserve to Physical Cash Conversion',
        description: 'Private Individual withdraws $15B in physical paper currency notes from Bank B checking account.',
        accountingExplanation: 'Individual Assets: Bank B Deposit -$15B, Physical Currency Notes +$15B. Bank B Liabilities: Customer Deposit -$15B, Bank B Assets: Reserves at Fed -$15B. Fed Liabilities: Bank B Reserves -$15B, Currency Notes +$15B.',
        macroImpact: {
          m0Change: 'Unchanged ($1,100B - liability composition shift)',
          m1Change: '-$15B in bank deposits (+$15B physical cash)',
          tgaChange: 'Unchanged ($200B)',
          keyTakeaway: 'Withdrawing cash converts digital commercial bank deposits into physical central bank liabilities (paper notes). It reduces bank reserves at the Fed!',
        },
        entityDeltas: {
          individual: {
            assets: { ind_dep_bank_b: -15, ind_physical_cash: 15 },
          },
          bank_b: {
            assets: { bb_reserves: -15 },
            liabilities: { bb_dep_ind: -15 },
          },
          central_bank: {
            liabilities: { cb_reserves_bank_b: -15, cb_currency_notes: 15 },
          },
          bank_a: {},
          pension_fund: {},
          treasury: {},
        },
        flowingMoney: [
          {
            id: 'fm_5_1_1',
            fromEntity: 'central_bank',
            toEntity: 'bank_b',
            assetType: 'Physical Cash Vault Delivery',
            amount: 15,
            description: 'Fed delivers $15B physical cash notes to Bank B vault, debiting Bank B reserves',
          },
          {
            id: 'fm_5_1_2',
            fromEntity: 'bank_b',
            toEntity: 'individual',
            assetType: 'Paper Currency',
            amount: 15,
            description: 'Bank B hands over $15B physical cash notes to Individual',
          },
        ],
        journalEntries: [
          {
            id: 'j5_1',
            stepNumber: 1,
            timestamp: '10:00:00',
            title: 'Physical Cash Withdrawal',
            description: 'Individual converts $15B deposit to cash notes.',
            entries: [
              { entityId: 'individual', accountName: 'Physical Currency Notes', type: 'debit', amount: 15, category: 'asset' },
              { entityId: 'individual', accountName: 'Bank B Deposits', type: 'credit', amount: 15, category: 'asset' },
              { entityId: 'bank_b', accountName: 'Individual Customer Deposits', type: 'debit', amount: 15, category: 'liability' },
              { entityId: 'bank_b', accountName: 'Reserves at Central Bank', type: 'credit', amount: 15, category: 'asset' },
              { entityId: 'central_bank', accountName: 'Bank B Reserves', type: 'debit', amount: 15, category: 'liability' },
              { entityId: 'central_bank', accountName: 'Currency Notes in Circulation', type: 'credit', amount: 15, category: 'liability' },
            ],
          },
        ],
      },
    ],
  },
];
