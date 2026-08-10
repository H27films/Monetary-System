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
