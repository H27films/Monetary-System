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
        title: 'Step 1: Treasury Issues $100 New Debt (Purchased by Primary Dealer Bank A)',
        subtitle: 'Auction Authorization & Immediate Reserve Settlement',
        description: 'The US Treasury issues $100 in new Treasury bonds. Primary Dealer Bank A automatically buys the $100 bonds using its reserves at the Central Bank, transferring $100 from Bank A Reserves to the Treasury General Account (TGA).',
        accountingExplanation: 'Treasury increases Total Debt Issued (Liability) by $100 and receives $100 TGA cash (Asset). Bank A swaps $100 Reserves (Asset) for $100 Treasuries (Asset). The Fed shifts $100 of Liabilities from Bank A Reserves to the TGA.',
        macroImpact: {
          m0Change: 'Unchanged ($1,100)',
          m1Change: 'Unchanged ($1,350)',
          tgaChange: '+$100 ($300)',
          keyTakeaway: 'Bond purchases by primary dealers drain commercial bank reserves into the TGA, temporarily locking up interbank cash while broad money (M1) remains unchanged until spent.',
        },
        entityDeltas: {
          treasury: {
            assets: { tr_tga: 100 },
            liabilities: { tr_debt_issued: 100 },
          },
          central_bank: {
            liabilities: { cb_reserves_bank_a: -100, cb_tga: 100 },
          },
          bank_a: {
            assets: { ba_reserves: -100, ba_treasuries: 100 },
          },
          bank_b: {},
          pension_fund: {},
          individual: {},
        },
        flowingMoney: [
          {
            id: 'fm_1_1_1',
            fromEntity: 'bank_a',
            toEntity: 'central_bank',
            assetType: 'Central Bank Reserves',
            amount: 100,
            description: 'Bank A sends $100 Reserves to Fed to settle Treasury bond auction',
          },
          {
            id: 'fm_1_1_2',
            fromEntity: 'central_bank',
            toEntity: 'treasury',
            assetType: 'TGA Deposit Credit',
            amount: 100,
            description: 'Fed credits $100 to Treasury General Account (TGA)',
          },
        ],
        journalEntries: [
          {
            id: 'j1_1',
            stepNumber: 1,
            timestamp: '09:00:00',
            title: 'Treasury Bond Auction & Settlement',
            description: 'Treasury issues $100 bonds automatically bought by Bank A with reserves.',
            entries: [
              { entityId: 'treasury', accountName: 'TGA Cash (at Central Bank)', type: 'debit', amount: 100, category: 'asset' },
              { entityId: 'treasury', accountName: 'Total US Debt Issued', type: 'credit', amount: 100, category: 'liability' },
              { entityId: 'bank_a', accountName: 'US Treasuries', type: 'debit', amount: 100, category: 'asset' },
              { entityId: 'bank_a', accountName: 'Reserves at Central Bank', type: 'credit', amount: 100, category: 'asset' },
              { entityId: 'central_bank', accountName: 'Bank A Reserves', type: 'debit', amount: 100, category: 'liability' },
              { entityId: 'central_bank', accountName: 'Treasury General Account (TGA)', type: 'credit', amount: 100, category: 'liability' },
            ],
          },
        ],
      },

      {
        stepNumber: 2,
        title: 'Step 2: Treasury Spends $100 TGA Cash into Economy',
        subtitle: 'Fiscal Spending & Commercial Deposit Expansion',
        description: 'The Treasury spends $100 from TGA to pay government contractors, workers, and citizens (Private Individual account at Bank A).',
        accountingExplanation: 'Treasury TGA cash (Asset) decreases by $100. On Fed liabilities, $100 shifts from TGA back to Bank A Reserves. Bank A credits Private Individual customer deposit account by $100.',
        macroImpact: {
          m0Change: 'Unchanged ($1,100)',
          m1Change: '+$100 ($1,450)',
          tgaChange: '-$100 ($200 back to initial)',
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
            id: 'fm_1_2_1',
            fromEntity: 'treasury',
            toEntity: 'central_bank',
            assetType: 'TGA Balance',
            amount: 100,
            description: 'Treasury instructs Fed to release $100 TGA cash',
          },
          {
            id: 'fm_1_2_2',
            fromEntity: 'central_bank',
            toEntity: 'bank_a',
            assetType: 'Reserves Transfer',
            amount: 100,
            description: 'Fed transfers $100 Reserves back to Bank A',
          },
          {
            id: 'fm_1_2_3',
            fromEntity: 'bank_a',
            toEntity: 'individual',
            assetType: 'Customer Deposit Credit',
            amount: 100,
            description: 'Bank A credits $100 deposit into Individual checking account',
          },
        ],
        journalEntries: [
          {
            id: 'j1_2',
            stepNumber: 2,
            timestamp: '14:00:00',
            title: 'Fiscal Government Outlays',
            description: 'Treasury spends $100 into private household bank account.',
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

  {
    id: 'government-interest-payments',
    title: '6. Government Interest Payments: Bank vs. Non-Bank Debt Holders',
    category: 'Fiscal & Debt',
    difficulty: 'Intermediate',
    description: 'Analyze what happens to broad money supply and bank reserves when the US Treasury pays interest on government debt held directly by a Commercial Bank versus held by a Non-Bank Pension Fund.',
    realWorldContext: 'When sovereign debt interest payments exceed $1 Trillion annually, whether those interest payments create new broad money (M1) depends entirely on WHO owns the bonds.',
    initialState: createDefaultInitialState(),
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Treasury Pays $10B Interest on Debt Held by Commercial Bank A',
        subtitle: 'Government Debt Interest Paid to a Commercial Bank',
        description: 'The Treasury pays $10B of interest to Commercial Bank A on the Treasury securities Bank A holds on its balance sheet.',
        accountingExplanation: 'Treasury TGA cash -$10B; Treasury Net Fiscal Equity -$10B. Fed shifts $10B from TGA to Bank A Reserves. Bank A gets +$10B Reserves (Asset) and +$10B Bank Equity/Income (Equity).',
        macroImpact: {
          m0Change: 'Unchanged ($1,100B - shift from TGA to Reserves)',
          m1Change: 'Unchanged ($1,350B)',
          tgaChange: '-$10B ($190B)',
          keyTakeaway: 'Interest paid directly to commercial banks increases bank reserves and bank equity, but DOES NOT create broad money (M1) because no customer deposit accounts were credited.',
        },
        entityDeltas: {
          treasury: {
            assets: { tr_tga: -10 },
            equity: { tr_net_fiscal: -10 },
          },
          central_bank: {
            liabilities: { cb_tga: -10, cb_reserves_bank_a: 10 },
          },
          bank_a: {
            assets: { ba_reserves: 10 },
            equity: { ba_equity: 10 },
          },
          bank_b: {},
          pension_fund: {},
          individual: {},
        },
        flowingMoney: [
          {
            id: 'fm_6_1_1',
            fromEntity: 'treasury',
            toEntity: 'central_bank',
            assetType: 'TGA Cash Release',
            amount: 10,
            description: 'Treasury authorizes $10B interest outlay from TGA account',
          },
          {
            id: 'fm_6_1_2',
            fromEntity: 'central_bank',
            toEntity: 'bank_a',
            assetType: 'Reserves Credit',
            amount: 10,
            description: 'Fed credits $10B Reserves to Bank A account',
          },
        ],
        journalEntries: [
          {
            id: 'j6_1',
            stepNumber: 1,
            timestamp: '09:00:00',
            title: 'Sovereign Debt Interest Payment to Commercial Bank',
            description: 'Treasury pays $10B interest on bond holdings to Bank A.',
            entries: [
              { entityId: 'treasury', accountName: 'Sovereign Fiscal Deficit', type: 'debit', amount: 10, category: 'equity' },
              { entityId: 'treasury', accountName: 'TGA Cash (at Central Bank)', type: 'credit', amount: 10, category: 'asset' },
              { entityId: 'central_bank', accountName: 'Treasury General Account (TGA)', type: 'debit', amount: 10, category: 'liability' },
              { entityId: 'central_bank', accountName: 'Bank A Reserves', type: 'credit', amount: 10, category: 'liability' },
              { entityId: 'bank_a', accountName: 'Reserves at Central Bank', type: 'debit', amount: 10, category: 'asset' },
              { entityId: 'bank_a', accountName: 'Bank Equity Capital', type: 'credit', amount: 10, category: 'equity' },
            ],
          },
        ],
      },

      {
        stepNumber: 2,
        title: 'Step 2: Treasury Pays $10B Interest on Debt Held by Pension Fund (Non-Bank)',
        subtitle: 'Government Debt Interest Paid to a Non-Bank Financial Institution',
        description: 'The Treasury pays $10B of interest on Treasuries owned by the Pension Fund. Payment clears through Bank A into Pension Fund’s bank account.',
        accountingExplanation: 'Treasury TGA cash -$10B; Treasury Net Fiscal Equity -$10B. Fed shifts $10B from TGA to Bank A Reserves. Bank A gets +$10B Reserves (Asset) and +$10B Deposit Liability to Pension Fund. Pension Fund gets +$10B Bank Deposit (Asset) and +$10B Fund Equity (Equity).',
        macroImpact: {
          m0Change: 'Unchanged ($1,100B)',
          m1Change: '+$10B ($1,360B)',
          tgaChange: '-$10B ($180B)',
          keyTakeaway: 'Interest paid to non-bank bondholders CREATES NEW BROAD MONEY (M1)! Commercial bank deposits expand directly on both sides.',
        },
        entityDeltas: {
          treasury: {
            assets: { tr_tga: -10 },
            equity: { tr_net_fiscal: -10 },
          },
          central_bank: {
            liabilities: { cb_tga: -10, cb_reserves_bank_a: 10 },
          },
          bank_a: {
            assets: { ba_reserves: 10 },
            liabilities: { ba_dep_pension: 10 },
          },
          pension_fund: {
            assets: { pf_bank_dep: 10 },
            equity: { pf_net_assets: 10 },
          },
          bank_b: {},
          individual: {},
        },
        flowingMoney: [
          {
            id: 'fm_6_2_1',
            fromEntity: 'treasury',
            toEntity: 'central_bank',
            assetType: 'TGA Cash Release',
            amount: 10,
            description: 'Treasury releases $10B TGA cash for non-bank interest payout',
          },
          {
            id: 'fm_6_2_2',
            fromEntity: 'central_bank',
            toEntity: 'bank_a',
            assetType: 'Reserves Credit',
            amount: 10,
            description: 'Fed credits $10B reserves to clearing Bank A',
          },
          {
            id: 'fm_6_2_3',
            fromEntity: 'bank_a',
            toEntity: 'pension_fund',
            assetType: 'Deposit Credit',
            amount: 10,
            description: 'Bank A credits $10B commercial deposit to Pension Fund',
          },
        ],
        journalEntries: [
          {
            id: 'j6_2',
            stepNumber: 2,
            timestamp: '11:00:00',
            title: 'Sovereign Interest Payment to Non-Bank Bondholder',
            description: 'Treasury pays $10B interest to Pension Fund, expanding broad money.',
            entries: [
              { entityId: 'treasury', accountName: 'Sovereign Fiscal Deficit', type: 'debit', amount: 10, category: 'equity' },
              { entityId: 'treasury', accountName: 'TGA Cash (at Central Bank)', type: 'credit', amount: 10, category: 'asset' },
              { entityId: 'central_bank', accountName: 'Treasury General Account (TGA)', type: 'debit', amount: 10, category: 'liability' },
              { entityId: 'central_bank', accountName: 'Bank A Reserves', type: 'credit', amount: 10, category: 'liability' },
              { entityId: 'bank_a', accountName: 'Reserves at Central Bank', type: 'debit', amount: 10, category: 'asset' },
              { entityId: 'bank_a', accountName: 'Pension Fund Deposits', type: 'credit', amount: 10, category: 'liability' },
              { entityId: 'pension_fund', accountName: 'Bank Deposits (at Bank A)', type: 'debit', amount: 10, category: 'asset' },
              { entityId: 'pension_fund', accountName: 'Fund Net Capital', type: 'credit', amount: 10, category: 'equity' },
            ],
          },
        ],
      },
    ],
  },

  {
    id: 'taxation-and-loan-servicing',
    title: '7. Taxation & Loan Servicing: Taxes, Loan Interest & Debt Extinction',
    category: 'Commercial Credit',
    difficulty: 'Intermediate',
    description: 'Understand how private sector payments contract the money supply: paying taxes drains deposits into the TGA, paying loan interest converts private wealth into bank profits, and paying loan principal extinguishes broad money.',
    realWorldContext: 'Just as fiscal spending and lending create broad money, taxation and debt repayments destroy deposits and drain system liquidity.',
    initialState: createDefaultInitialState(),
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Private Individual Pays $20B Income Taxes to Treasury',
        subtitle: 'Taxation Drains Commercial Deposits & Bank Reserves',
        description: 'Private Individual pays $20B in federal taxes from their Bank A checking account to the US Treasury.',
        accountingExplanation: 'Individual Bank A Deposit -$20B; Individual Net Worth -$20B. Bank A Deposit Liability -$20B; Bank A Reserves -$20B. Fed shifts $20B from Bank A Reserves to TGA. Treasury TGA Cash +$20B; Sovereign Fiscal Balance +$20B.',
        macroImpact: {
          m0Change: 'Unchanged ($1,100B - shift from Reserves to TGA)',
          m1Change: '-$20B ($1,330B)',
          tgaChange: '+$20B ($220B)',
          keyTakeaway: 'Taxation DRAINS broad money (M1) and shrinks bank reserves at the Fed! The TGA balance increases.',
        },
        entityDeltas: {
          individual: {
            assets: { ind_dep_bank_a: -20 },
            equity: { ind_net_worth: -20 },
          },
          bank_a: {
            assets: { ba_reserves: -20 },
            liabilities: { ba_dep_ind: -20 },
          },
          central_bank: {
            liabilities: { cb_reserves_bank_a: -20, cb_tga: 20 },
          },
          treasury: {
            assets: { tr_tga: 20 },
            equity: { tr_net_fiscal: 20 },
          },
          bank_b: {},
          pension_fund: {},
        },
        flowingMoney: [
          {
            id: 'fm_7_1_1',
            fromEntity: 'individual',
            toEntity: 'bank_a',
            assetType: 'Deposit Tax Debit',
            amount: 20,
            description: 'Individual account debited $20B for tax payment',
          },
          {
            id: 'fm_7_1_2',
            fromEntity: 'bank_a',
            toEntity: 'central_bank',
            assetType: 'Reserves Transfer',
            amount: 20,
            description: 'Bank A transfers $20B reserves to Fed TGA',
          },
          {
            id: 'fm_7_1_3',
            fromEntity: 'central_bank',
            toEntity: 'treasury',
            assetType: 'TGA Deposit Credit',
            amount: 20,
            description: 'Fed credits $20B to Treasury General Account',
          },
        ],
        journalEntries: [
          {
            id: 'j7_1',
            stepNumber: 1,
            timestamp: '09:30:00',
            title: 'Private Tax Collection Settlement',
            description: 'Individual pays $20B taxes to Treasury, draining reserves and deposits.',
            entries: [
              { entityId: 'individual', accountName: 'Household Net Worth', type: 'debit', amount: 20, category: 'equity' },
              { entityId: 'individual', accountName: 'Bank A Deposits', type: 'credit', amount: 20, category: 'asset' },
              { entityId: 'bank_a', accountName: 'Individual Deposits', type: 'debit', amount: 20, category: 'liability' },
              { entityId: 'bank_a', accountName: 'Reserves at Central Bank', type: 'credit', amount: 20, category: 'asset' },
              { entityId: 'central_bank', accountName: 'Bank A Reserves', type: 'debit', amount: 20, category: 'liability' },
              { entityId: 'central_bank', accountName: 'Treasury General Account (TGA)', type: 'credit', amount: 20, category: 'liability' },
              { entityId: 'treasury', accountName: 'TGA Cash (at Central Bank)', type: 'debit', amount: 20, category: 'asset' },
              { entityId: 'treasury', accountName: 'Sovereign Fiscal Deficit', type: 'credit', amount: 20, category: 'equity' },
            ],
          },
        ],
      },

      {
        stepNumber: 2,
        title: 'Step 2: Individual Pays $5B Interest on Bank Loan to Bank A',
        subtitle: 'Loan Interest Servicing Transfers Wealth to Bank Equity',
        description: 'Individual pays $5B interest expense on an existing mortgage/loan to Bank A using their checking deposit balance.',
        accountingExplanation: 'Individual Bank A Deposit -$5B; Household Net Worth -$5B. Bank A Deposit Liability -$5B; Bank Equity Capital +$5B.',
        macroImpact: {
          m0Change: 'Unchanged ($1,100B)',
          m1Change: '-$5B ($1,325B)',
          tgaChange: 'Unchanged ($220B)',
          keyTakeaway: 'Loan interest payments reduce broad deposit money M1 and shift wealth into bank equity profits. No bank reserves move.',
        },
        entityDeltas: {
          individual: {
            assets: { ind_dep_bank_a: -5 },
            equity: { ind_net_worth: -5 },
          },
          bank_a: {
            liabilities: { ba_dep_ind: -5 },
            equity: { ba_equity: 5 },
          },
          central_bank: {},
          bank_b: {},
          pension_fund: {},
          treasury: {},
        },
        flowingMoney: [
          {
            id: 'fm_7_2_1',
            fromEntity: 'individual',
            toEntity: 'bank_a',
            assetType: 'Interest Payment Deposit Transfer',
            amount: 5,
            description: 'Individual transfers $5B deposit to Bank A as interest income',
          },
        ],
        journalEntries: [
          {
            id: 'j7_2',
            stepNumber: 2,
            timestamp: '13:00:00',
            title: 'Bank Loan Interest Servicing',
            description: 'Individual pays $5B interest to Bank A from checking deposits.',
            entries: [
              { entityId: 'individual', accountName: 'Household Net Worth', type: 'debit', amount: 5, category: 'equity' },
              { entityId: 'individual', accountName: 'Bank A Deposits', type: 'credit', amount: 5, category: 'asset' },
              { entityId: 'bank_a', accountName: 'Individual Deposits', type: 'debit', amount: 5, category: 'liability' },
              { entityId: 'bank_a', accountName: 'Bank Equity Capital', type: 'credit', amount: 5, category: 'equity' },
            ],
          },
        ],
      },

      {
        stepNumber: 3,
        title: 'Step 3: Individual Repays $15B Mortgage Loan Principal to Bank A',
        subtitle: 'Loan Principal Debt Extinction (Money Destruction)',
        description: 'Individual repays $15B of principal on a bank loan owed to Bank A using their deposit account balance.',
        accountingExplanation: 'Individual Bank A Deposit -$15B; Bank Loans Liability -$15B. Bank A Deposit Liability -$15B; Commercial Loans Asset -$15B.',
        macroImpact: {
          m0Change: 'Unchanged ($1,100B)',
          m1Change: '-$15B ($1,310B)',
          tgaChange: 'Unchanged ($220B)',
          keyTakeaway: 'Repaying loan principal DESTROYS broad money (M1)! The bank deposit and the loan asset vanish simultaneously from both balance sheets.',
        },
        entityDeltas: {
          individual: {
            assets: { ind_dep_bank_a: -15 },
            liabilities: { ind_bank_loans: -15 },
          },
          bank_a: {
            assets: { ba_loans: -15 },
            liabilities: { ba_dep_ind: -15 },
          },
          central_bank: {},
          bank_b: {},
          pension_fund: {},
          treasury: {},
        },
        flowingMoney: [
          {
            id: 'fm_7_3_1',
            fromEntity: 'individual',
            toEntity: 'bank_a',
            assetType: 'Loan Principal Repayment',
            amount: 15,
            description: 'Individual pays off $15B principal loan liability against deposit balance',
          },
        ],
        journalEntries: [
          {
            id: 'j7_3',
            stepNumber: 3,
            timestamp: '15:30:00',
            title: 'Loan Principal Debt Extinction',
            description: 'Individual repays $15B loan principal, destroying $15B deposits and loan assets.',
            entries: [
              { entityId: 'individual', accountName: 'Bank Loans & Mortgages', type: 'debit', amount: 15, category: 'liability' },
              { entityId: 'individual', accountName: 'Bank A Deposits', type: 'credit', amount: 15, category: 'asset' },
              { entityId: 'bank_a', accountName: 'Individual Deposits', type: 'debit', amount: 15, category: 'liability' },
              { entityId: 'bank_a', accountName: 'Commercial Loans', type: 'credit', amount: 15, category: 'asset' },
            ],
          },
        ],
      },
    ],
  },

  {
    id: 'corporate-bond-issuance',
    title: '8. Corporate Bond Issuance & Business Capital Outlay',
    category: 'Advanced Mechanics',
    description: 'Observe the step-by-step T-account mechanics when a Private Corporation issues corporate debt/bonds directly to Pension Funds and uses deposit proceeds for worker payroll and capex.',
    realWorldContext: 'Corporate bond markets allow companies to borrow directly from institutional investors like Pension Funds. The transaction transfers commercial bank deposits from investors to the corporation.',
    initialState: createDefaultInitialState(),
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Private Corporation Issues $50B Corporate Bonds to Pension Fund',
        subtitle: 'Institutional Debt Financing via Bank Deposit Transfer',
        description: 'Private Corporation issues $50B in corporate bonds. Pension Fund purchases the bonds using $50B of its bank deposits held at Bank A.',
        accountingExplanation: 'Corporation increases Corporate Bonds Issued (Liability) by $50B and receives $50B Bank Deposits (Asset) at Bank A. Pension Fund swaps $50B Bank Deposit (Asset) for $50B Corporate Bonds (Asset). On Bank A liabilities, $50B shifts from Pension Fund Deposit to Corporation Deposit.',
        macroImpact: {
          m0Change: 'Unchanged ($1,100B)',
          m1Change: 'Unchanged ($1,350B - shift from institutional deposit to corporate deposit)',
          tgaChange: 'Unchanged ($200B)',
          keyTakeaway: 'Corporate bond sales do not create new deposits (unlike bank loan origination); instead, they reallocate existing broad money (M1) from investors to corporate bank accounts.',
        },
        entityDeltas: {
          corporation: {
            assets: { corp_bank_dep: 50 },
            liabilities: { corp_bonds_issued: 50 },
          },
          pension_fund: {
            assets: { pf_bank_dep: -50, pf_corp_bonds: 50 },
          },
          bank_a: {
            liabilities: { ba_dep_pension: -50, ba_dep_corp: 50 },
          },
          central_bank: {},
          bank_b: {},
          individual: {},
          treasury: {},
          hedge_fund: {},
        },
        flowingMoney: [
          {
            id: 'fm_8_1_1',
            fromEntity: 'pension_fund',
            toEntity: 'corporation',
            assetType: 'Commercial Bank Deposit',
            amount: 50,
            description: 'Pension Fund transfers $50B deposit to Private Corporation for new corporate bond issuance',
          },
        ],
        journalEntries: [
          {
            id: 'j8_1',
            stepNumber: 1,
            timestamp: '09:00:00',
            title: 'Corporate Bond Primary Issuance',
            description: 'Corporation issues $50B bonds purchased by Pension Fund using Bank A deposits.',
            entries: [
              { entityId: 'corporation', accountName: 'Bank Deposits (at Bank A)', type: 'debit', amount: 50, category: 'asset' },
              { entityId: 'corporation', accountName: 'Corporate Bonds Issued', type: 'credit', amount: 50, category: 'liability' },
              { entityId: 'pension_fund', accountName: 'Corporate Bonds Holdings', type: 'debit', amount: 50, category: 'asset' },
              { entityId: 'pension_fund', accountName: 'Bank Deposits (at Bank A)', type: 'credit', amount: 50, category: 'asset' },
              { entityId: 'bank_a', accountName: 'Pension Fund Deposits', type: 'debit', amount: 50, category: 'liability' },
              { entityId: 'bank_a', accountName: 'Corporate Deposits', type: 'credit', amount: 50, category: 'liability' },
            ],
          },
        ],
      },
      {
        stepNumber: 2,
        title: 'Step 2: Private Corporation Spends $30B Deposit on Payroll & Equipment',
        subtitle: 'Corporate Capital Outlays & Retail Deposit Reallocation',
        description: 'Private Corporation spends $30B of deposit funds to pay Private Individual workers and suppliers at Bank B.',
        accountingExplanation: 'Corporation Bank A Deposit -$30B; Property/Equipment Asset +$30B. Bank A loses $30B Deposit Liability and $30B Reserves at Fed. Fed shifts $30B Reserves from Bank A to Bank B. Bank B gets $30B Reserves and credits Individual Deposit +$30B. Individual Assets (Bank B Deposit) +$30B, Equity (Net Worth) +$30B.',
        macroImpact: {
          m0Change: 'Unchanged ($1,100B)',
          m1Change: 'Unchanged ($1,350B)',
          tgaChange: 'Unchanged ($200B)',
          keyTakeaway: 'Capital spending transfers corporate liquidity into household deposit accounts, driving velocity of broad money M1 without changing total base money.',
        },
        entityDeltas: {
          corporation: {
            assets: { corp_bank_dep: -30, corp_fixed_assets: 30 },
          },
          bank_a: {
            assets: { ba_reserves: -30 },
            liabilities: { ba_dep_corp: -30 },
          },
          bank_b: {
            assets: { bb_reserves: 30 },
            liabilities: { bb_dep_ind: 30 },
          },
          central_bank: {
            liabilities: { cb_reserves_bank_a: -30, cb_reserves_bank_b: 30 },
          },
          individual: {
            assets: { ind_dep_bank_b: 30 },
            equity: { ind_net_worth: 30 },
          },
          pension_fund: {},
          treasury: {},
          hedge_fund: {},
        },
        flowingMoney: [
          {
            id: 'fm_8_2_1',
            fromEntity: 'corporation',
            toEntity: 'individual',
            assetType: 'Payroll & Capex Deposit Transfer',
            amount: 30,
            description: 'Corporation pays $30B to Individual workers & suppliers at Bank B',
          },
        ],
        journalEntries: [
          {
            id: 'j8_2',
            stepNumber: 2,
            timestamp: '14:30:00',
            title: 'Corporate Capital & Payroll Expenditure',
            description: 'Corporation transfers $30B from Bank A to Individual account at Bank B.',
            entries: [
              { entityId: 'corporation', accountName: 'Property, Plant & Equipment', type: 'debit', amount: 30, category: 'asset' },
              { entityId: 'corporation', accountName: 'Bank Deposits (at Bank A)', type: 'credit', amount: 30, category: 'asset' },
              { entityId: 'bank_a', accountName: 'Corporate Deposits', type: 'debit', amount: 30, category: 'liability' },
              { entityId: 'bank_a', accountName: 'Reserves at Central Bank', type: 'credit', amount: 30, category: 'asset' },
              { entityId: 'central_bank', accountName: 'Bank A Reserves', type: 'debit', amount: 30, category: 'liability' },
              { entityId: 'central_bank', accountName: 'Bank B Reserves', type: 'credit', amount: 30, category: 'liability' },
              { entityId: 'bank_b', accountName: 'Reserves at Central Bank', type: 'debit', amount: 30, category: 'asset' },
              { entityId: 'bank_b', accountName: 'Individual Customer Deposits', type: 'credit', amount: 30, category: 'liability' },
              { entityId: 'individual', accountName: 'Bank B Deposits', type: 'debit', amount: 30, category: 'asset' },
              { entityId: 'individual', accountName: 'Household Net Worth', type: 'credit', amount: 30, category: 'equity' },
            ],
          },
        ],
      },
    ],
  },

  {
    id: 'hedge-fund-repo-treasury',
    title: '9. Hedge Fund Repo Leverage & Secondary Treasury Arbitrage',
    category: 'Advanced Mechanics',
    description: 'Examine how a Global Macro Hedge Fund enters into a Repo agreement with Bank A to obtain deposit leverage, then uses that leverage to purchase Treasuries from the Pension Fund on the secondary market.',
    realWorldContext: 'Repo markets allow hedge funds to borrow against collateral to buy government debt in secondary markets, creating financial leverage and bond market liquidity.',
    initialState: createDefaultInitialState(),
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Hedge Fund Enters $40B Repo Agreement with Commercial Bank A',
        subtitle: 'Leveraged Repo Loan Origination',
        description: 'Global Macro Hedge Fund enters a $40B Repurchase Agreement (Repo) with Primary Dealer Bank A. Bank A creates a $40B bank deposit for the Hedge Fund against a Repo loan liability.',
        accountingExplanation: 'Bank A Assets (Repo Loan) +$40B; Bank A Liabilities (Hedge Fund Deposit) +$40B. Hedge Fund Assets (Bank Deposit) +$40B; Hedge Fund Liabilities (Repo Borrowing) +$40B.',
        macroImpact: {
          m0Change: 'Unchanged ($1,100B)',
          m1Change: '+$40B ($1,390B - expanded dealer bank deposits)',
          tgaChange: 'Unchanged ($200B)',
          keyTakeaway: 'Bank repo financing expands the dealer bank balance sheet on both sides, providing cash leverage to institutional hedge funds.',
        },
        entityDeltas: {
          hedge_fund: {
            assets: { hf_bank_dep: 40 },
            liabilities: { hf_repo_liab: 40 },
          },
          bank_a: {
            assets: { ba_loans: 40 },
            liabilities: { ba_dep_corp: 40 },
          },
          central_bank: {},
          bank_b: {},
          pension_fund: {},
          individual: {},
          treasury: {},
          corporation: {},
        },
        flowingMoney: [
          {
            id: 'fm_9_1_1',
            fromEntity: 'bank_a',
            toEntity: 'hedge_fund',
            assetType: 'Repo Deposit Credit',
            amount: 40,
            description: 'Bank A extends $40B repo loan deposit credit to Hedge Fund',
          },
        ],
        journalEntries: [
          {
            id: 'j9_1',
            stepNumber: 1,
            timestamp: '08:30:00',
            title: 'Bank Repo Loan Origination to Hedge Fund',
            description: 'Bank A provides $40B repo financing deposit to Hedge Fund.',
            entries: [
              { entityId: 'bank_a', accountName: 'Repo Loan Assets', type: 'debit', amount: 40, category: 'asset' },
              { entityId: 'bank_a', accountName: 'Hedge Fund Deposits', type: 'credit', amount: 40, category: 'liability' },
              { entityId: 'hedge_fund', accountName: 'Bank Deposits (at Bank A)', type: 'debit', amount: 40, category: 'asset' },
              { entityId: 'hedge_fund', accountName: 'Bank Repo Liabilities', type: 'credit', amount: 40, category: 'liability' },
            ],
          },
        ],
      },
      {
        stepNumber: 2,
        title: 'Step 2: Hedge Fund Buys $40B Treasuries from Pension Fund in Secondary Market',
        subtitle: 'Secondary Market Bond Transaction Settled in Bank Deposits',
        description: 'Hedge Fund uses its $40B bank deposit at Bank A to purchase $40B of US Treasuries from Pension Fund.',
        accountingExplanation: 'Hedge Fund swaps $40B Bank Deposit (Asset) for $40B Treasuries (Asset). Pension Fund swaps $40B Treasuries (Asset) for $40B Bank Deposit (Asset). Bank A liabilities shift $40B from Hedge Fund Deposit to Pension Fund Deposit.',
        macroImpact: {
          m0Change: 'Unchanged ($1,100B)',
          m1Change: 'Unchanged ($1,390B)',
          tgaChange: 'Unchanged ($200B)',
          keyTakeaway: 'Secondary market bond trades redistribute asset ownership (Treasuries) and deposit liabilities among financial counterparties without changing central bank reserves.',
        },
        entityDeltas: {
          hedge_fund: {
            assets: { hf_bank_dep: -40, hf_treasuries: 40 },
          },
          pension_fund: {
            assets: { pf_treasuries: -40, pf_bank_dep: 40 },
          },
          bank_a: {
            liabilities: { ba_dep_corp: -40, ba_dep_pension: 40 },
          },
          central_bank: {},
          bank_b: {},
          individual: {},
          treasury: {},
          corporation: {},
        },
        flowingMoney: [
          {
            id: 'fm_9_2_1',
            fromEntity: 'hedge_fund',
            toEntity: 'pension_fund',
            assetType: 'Secondary Market Deposit Transfer',
            amount: 40,
            description: 'Hedge Fund pays $40B deposit to Pension Fund for $40B Treasury bonds',
          },
        ],
        journalEntries: [
          {
            id: 'j9_2',
            stepNumber: 2,
            timestamp: '11:15:00',
            title: 'Secondary Market Treasury Purchase',
            description: 'Hedge Fund purchases $40B Treasuries from Pension Fund using deposits.',
            entries: [
              { entityId: 'hedge_fund', accountName: 'US Treasuries', type: 'debit', amount: 40, category: 'asset' },
              { entityId: 'hedge_fund', accountName: 'Bank Deposits (at Bank A)', type: 'credit', amount: 40, category: 'asset' },
              { entityId: 'pension_fund', accountName: 'Bank Deposits (at Bank A)', type: 'debit', amount: 40, category: 'asset' },
              { entityId: 'pension_fund', accountName: 'US Treasuries', type: 'credit', amount: 40, category: 'asset' },
              { entityId: 'bank_a', accountName: 'Hedge Fund Deposits', type: 'debit', amount: 40, category: 'liability' },
              { entityId: 'bank_a', accountName: 'Pension Fund Deposits', type: 'credit', amount: 40, category: 'liability' },
            ],
          },
        ],
      },
    ],
  },
];
