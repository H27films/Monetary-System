import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API route for AI monetary mechanics explanations
  app.post("/api/explain", async (req: express.Request, res: express.Response) => {
    try {
      const { question, context } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        return res.json({
          explanation: null,
          message: "Gemini API key is not configured.",
        });
      }

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are an expert Central Banker and Monetary Economist specializing in double-entry T-account accounting, central bank reserves, TGA flows, and bank deposit mechanics.

User Query: ${question}

Context / Scenario details:
${JSON.stringify(context || {}, null, 2)}

Provide a clear, accurate, 2-3 paragraph explanation of what happens mechanically to T-accounts, Central Bank reserves, and M1 broad money. Use clear markdown formatting.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      return res.json({
        explanation: response.text,
      });
    } catch (error: any) {
      console.error("Error in /api/explain:", error);
      return res.status(500).json({ error: error?.message || "Internal server error" });
    }
  });

  // API route for AI Natural Language Sandbox Simulation
  app.post("/api/sandbox-ai-transaction", async (req: express.Request, res: express.Response) => {
    try {
      const { prompt: userPrompt, currentSheets } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        return res.status(400).json({
          error: "Gemini API key is not configured. Please add GEMINI_API_KEY in environment settings.",
        });
      }

      const ai = new GoogleGenAI({ apiKey });
      const systemInstructions = `You are a strict double-entry monetary accounting execution engine for a monetary system simulator.
The available entities and their IDs are:
- central_bank (Central Bank / Federal Reserve)
- treasury (US Treasury)
- bank_a (Commercial Bank A - Primary Dealer)
- bank_b (Commercial Bank B - Regional Bank)
- pension_fund (Pension Fund / Non-Bank)
- individual (Private Individual)
- corporation (Private Corporation)
- hedge_fund (Global Macro Hedge Fund)

User Natural Language Transaction Command:
"${userPrompt}"

Analyze this transaction carefully and determine the exact double-entry accounting changes required for all affected entities.
Ensure that for every debit there is an equal credit, and for every entity, total Assets always equal total Liabilities plus Equity.

Return JSON in this EXACT structure (no markdown formatting, no text before or after):
{
  "title": "Short title describing the transaction",
  "description": "Clear step-by-step summary of the double-entry accounting execution",
  "entries": [
    {
      "entityId": "bank_a",
      "accountName": "Commercial Loans",
      "type": "debit",
      "amount": 50,
      "category": "asset"
    }
  ],
  "accountingExplanation": "Educational explanation of what occurred across T-accounts, bank reserves, and broad money M1."
}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: systemInstructions,
      });

      const rawText = response.text || "";
      const cleanedJson = rawText.replace(/```json\n?/g, "").replace(/```/g, "").trim();
      const parsedData = JSON.parse(cleanedJson);

      return res.json(parsedData);
    } catch (error: any) {
      console.error("Error in /api/sandbox-ai-transaction:", error);
      return res.status(500).json({ error: error?.message || "Failed to process AI transaction simulation." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: express.Request, res: express.Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
