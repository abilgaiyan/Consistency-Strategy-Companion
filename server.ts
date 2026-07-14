import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with recommended User-Agent for AI Studio Build
const getGeminiClient = (customKey?: string) => {
  const apiKey = customKey || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Gemini API Key is not configured. Please provide your Gemini API key in the application settings or ask the developer to configure one.");
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// API Endpoint to generate the Consistency Blueprint using Gemini 3.5 Flash
app.post("/api/blueprint", async (req, res) => {
  try {
    const { taskName, context } = req.body;

    if (!taskName) {
      return res.status(400).json({ error: "taskName is required." });
    }

    const customKey = req.headers["x-gemini-api-key"] as string | undefined;
    const ai = getGeminiClient(customKey);

    const prompt = `You are an elite productivity and performance psychologist specializing in discipline and habit consistency, heavily inspired by the work of Darius Foroux and James Clear.
The user wants to do a hard thing that they currently have ZERO motivation for.
The hard thing is: "${taskName}".
${context ? `Additional user context: "${context}".` : ""}

Use the five strategies of consistency to break this down into a personalized Consistency Blueprint:
1. Focus on the bigger picture (Tricks focus on the how, but discipline requires a why. Help them see what they are fighting for. Define a clear, visceral 'must' rather than a 'should').
2. Use identity instead of motivation (Shift focus to the type of person who does this task. Formulate a strong identity statement starting with 'I am...').
3. Automate your choices (Pre-decide a simple routine, rule, or trigger. E.g., 'If it is Monday at 8 AM, then I will...').
4. Reduce friction (Set up their environment to make starting effortless. List 3 simple, physical or digital environment preparation actions).
5. Measure consistency, not intensity (Define the 'Smallest Possible Step' to get started—an action so tiny and fail-proof it takes less than 2 minutes and is impossible to talk themselves out of).

Provide a highly empathetic, direct, and non-sugarcoated, yet encouraging message as their coach to get them over the initial hurdle.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a master performance coach. Always respond strictly in the requested JSON structure.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["bigWhy", "identityStatement", "automationRule", "frictionReducers", "smallestStep", "coachMessage"],
          properties: {
            bigWhy: {
              type: Type.STRING,
              description: "The visceral, deep 'Big Why' that transforms this from a 'should' to a 'must' (inspired by Strategy 1). Limit to 2-3 sentences.",
            },
            identityStatement: {
              type: Type.STRING,
              description: "A strong identity statement that shifts who they are, starting with 'I am a person who...' or similar (inspired by Strategy 2).",
            },
            automationRule: {
              type: Type.STRING,
              description: "A pre-decided simple rule or situational trigger to automate when/where this task gets done (inspired by Strategy 3).",
            },
            frictionReducers: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Exactly 3 quick physical or digital setup steps in their immediate environment to reduce friction to zero (inspired by Strategy 4).",
            },
            smallestStep: {
              type: Type.STRING,
              description: "An incredibly micro, 2-minute action they can do RIGHT NOW to start, which is too small to fail (inspired by Strategy 5).",
            },
            coachMessage: {
              type: Type.STRING,
              description: "An encouraging, direct, no-BS short message from their consistency coach to spark momentum. Limit to 3-4 sentences.",
            },
          },
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response text received from the Gemini model.");
    }

    const blueprint = JSON.parse(text);
    return res.json(blueprint);
  } catch (error: any) {
    console.error("Gemini blueprint generation error:", error);
    return res.status(500).json({
      error: error.message || "Failed to generate your Consistency Blueprint. Please check your API key and try again.",
    });
  }
});

// Configure Vite or Serve Static Assets
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
