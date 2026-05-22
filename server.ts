import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));

// Initialize Gemini
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// API Routes
app.post("/api/analyze-cv", async (req, res) => {
  try {
    const { fileData, mimeType } = req.body;

    if (!fileData) {
      return res.status(400).json({ error: "Missing file data" });
    }

    const prompt = `
      You are an expert CV anonymizer. Analyze the provided ${mimeType} file (CV).
      1. Extract all meaningful content (Professional Summary, Experience, Education, Skills).
      2. REMOVE all contact details (phone numbers, email addresses, home addresses, LinkedIn URLs, etc.).
      3. Identify the person's name. Anonymize it by initializing ONLY the given names (first/middle) and keeping the full surname (last name). For example, "John Doe" becomes "J. Doe" and "Jane Smith Jones" becomes "J. S. Jones".
      4. Return the data in a structured JSON format.
    `;

    const generateParams = {
      model: "gemini-3-flash-preview",
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: mimeType,
                data: fileData
              }
            }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            initials: { type: Type.STRING, description: "The person's initials" },
            summary: { type: Type.STRING, description: "Professional summary" },
            experience: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  role: { type: Type.STRING },
                  company: { type: Type.STRING },
                  period: { type: Type.STRING },
                  description: { type: Type.STRING },
                }
              }
            },
            skills: { type: Type.ARRAY, items: { type: Type.STRING } },
            education: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  degree: { type: Type.STRING },
                  institution: { type: Type.STRING },
                  year: { type: Type.STRING },
                }
              }
            }
          },
          required: ["initials", "summary", "experience", "skills", "education"]
        }
      }
    };

    // Multi-model fallback and retry logic for 503 errors
    const modelsToTry = ["gemini-flash-latest", "gemini-3.1-flash-lite", "gemini-3-flash-preview"];
    let response;
    let success = false;
    
    for (const modelName of modelsToTry) {
      let retries = 3;
      let delay = 1500;
      
      for (let i = 0; i < retries; i++) {
        try {
          generateParams.model = modelName;
          response = await ai.models.generateContent(generateParams);
          success = true;
          break;
        } catch (error: any) {
          const isUnavailable = error.message?.includes("503") || error.status === 503 || error.message?.includes("Service Unavailable");
          if (isUnavailable && i < retries - 1) {
            console.warn(`Gemini 503 [${modelName}] - Attempt ${i + 1} failed. Retrying in ${delay}ms...`);
            await new Promise(r => setTimeout(r, delay));
            delay *= 2;
            continue;
          }
          if (isUnavailable && modelsToTry.indexOf(modelName) < modelsToTry.length - 1) {
            console.warn(`Gemini 503 [${modelName}] - Model saturated. Switching to next fallback model...`);
            break; // Try next model in the list
          }
          throw error;
        }
      }
      if (success) break;
    }

    if (!response) throw new Error("All configured Gemini models returned 503 or failed.");

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (error: any) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: error.message });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(process.cwd(), "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
