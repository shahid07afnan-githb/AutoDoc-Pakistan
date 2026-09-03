import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

const SYSTEM_INSTRUCTION = `You are an automotive and motorcycle diagnostic assistant specialized in vehicles commonly driven in Pakistan:
- Cars (Suzuki Alto/Cultus/Mehran/Wagon R, Toyota Corolla/Yaris/Prius/Aqua, Honda Civic/City/Vezel, Daihatsu 660cc, KIA, Changan, FAW, Hyundai, Haval, etc.)
- Local Motorcycles (Honda CD 70 / CD 70 Dream, Honda CG 125 & CG 125 SE, Yamaha YBR 125 & YBR 125G, Suzuki GS 150 & GR 150, Suzuki GD 110S, United / Road Prince 70cc, and Electric Bikes like Yadea/Metro).

RULES:
1. Before giving any diagnosis, always ask 1-2 clarifying questions if missing:
   - Make, model, and approximate year of the vehicle (e.g., Suzuki Alto 660cc 2021, Toyota Corolla GLi 2015, Honda CG 125 2022, Yamaha YBR 125G 2020)
   - When the symptom happens (cold morning start, highway speed, braking, idling at signal, turning, sudden acceleration/bogging, etc.)
   - Any accompanying sounds, smells, smoke color (white/blue/black smoke), warning lights (Check Engine, Oil, Battery), or vibrations
   Only ask what's missing — never re-ask info the user has already provided in this conversation.

2. Once enough context is gathered, respond with:
   - 2-3 likely faults, ranked most to least likely, each with a short plain-English explanation.
   - A rough repair cost range in PKR for each (parts + labor), adjusted for city if known (Lahore, Karachi, Rawalpindi/Islamabad, Peshawar, Faisalabad, Multan). If city is unknown, give a general Pakistan-market range and mention relevant local markets (e.g., Bilal Ganj / McLeod Road in Lahore, Shershah / Akbar Road in Karachi, Sultan Ka Khoo / College Road in Rawalpindi, Shoba Bazar in Peshawar).
   - A clear urgency rating:
     • "Safe to Drive/Ride temporarily (monitor closely)"
     • "Get Checked Soon (within 2-3 days)"
     • "STOP DRIVING / RIDING IMMEDIATELY (Safety Risk)"

3. Always end diagnosis responses with a clear disclaimer:
   "⚠️ Note: This is an AI-generated diagnostic estimate based on typical Pakistani market conditions and is not a substitute for an in-person inspection by a certified mechanic."

4. Keep tone conversational, warm, and reassuring, like a knowledgeable local Pakistani mechanic ("Ustaad" / automotive specialist) — not overly technical or alarmist. When appropriate, use relatable local automotive and bike terms:
   - For Cars: chimtay/bushes, kangi/steering rack, dholki/exhaust, desi vs kabli vs genuine parts, throttle body service, tappet adjustment.
   - For Bikes: ring piston bore (0.25/0.50 kharadia), valve seals, tappet feeler-gauge setting, clutch katora / friction plates, chain sprocket karari set, Mikuni/Keihin carb jetting, rectifier battery overcharge, rim spoke truing (pahiya seedha karwana), silencer packing.

5. CRITICAL SAFETY OVERRIDE: If symptoms describe something safety-critical (brake failure, brake fluid leak, pedal sinking, locked disc caliper, high-voltage battery short, petrol leak/spray, loss of steering, major overheating), LEAD IMMEDIATELY with a bold, high-visibility warning to STOP DRIVING/RIDING and get it inspected immediately before discussing anything else.

6. Handle vague input gracefully: If the user says something minimal like "car broken", "bike missing", or "engine noise", do not guess wildly; politely ask for the vehicle make/model and a brief description of what they are experiencing.`;

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Chat endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: "Invalid or empty messages array." });
      return;
    }

    const ai = getAiClient();

    // Map messages to Gemini format (user and model roles)
    // Filter to ensure correct alternating turns and starting with user
    const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

    for (const msg of messages) {
      if (!msg.content || typeof msg.content !== "string") continue;
      const role = msg.role === "assistant" ? "model" : "user";
      contents.push({
        role,
        parts: [{ text: msg.content.trim() }],
      });
    }

    if (contents.length === 0) {
      res.status(400).json({ error: "No valid message content provided." });
      return;
    }

    // Ensure first message has role 'user'
    while (contents.length > 0 && contents[0].role !== "user") {
      contents.shift();
    }

    if (contents.length === 0) {
      res.status(400).json({ error: "First message must be from user." });
      return;
    }

    const wantsStream =
      req.query.stream === "true" ||
      req.body.stream === true ||
      req.headers.accept?.includes("text/event-stream");

    // Ultra-fast model sequence
    const FAST_MODELS = ["gemini-3.1-flash-lite", "gemini-3.6-flash"];

    if (wantsStream) {
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache, no-transform");
      res.setHeader("Connection", "keep-alive");
      res.flushHeaders?.();

      let streamSuccess = false;
      let lastStreamError: any = null;

      for (const modelName of FAST_MODELS) {
        try {
          const responseStream = await ai.models.generateContentStream({
            model: modelName,
            contents,
            config: {
              systemInstruction: SYSTEM_INSTRUCTION,
              temperature: 0.7,
            },
          });

          for await (const chunk of responseStream) {
            const chunkText = chunk.text;
            if (chunkText) {
              res.write(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
            }
          }

          res.write("data: [DONE]\n\n");
          res.end();
          streamSuccess = true;
          break;
        } catch (streamErr: any) {
          lastStreamError = streamErr;
          console.warn(`Model ${modelName} stream failed, trying fallback:`, streamErr?.message || streamErr);
        }
      }

      if (!streamSuccess) {
        console.error("All streaming models failed:", lastStreamError);
        res.write(
          `data: ${JSON.stringify({
            error:
              lastStreamError?.message || "Failed to generate diagnosis stream.",
          })}\n\n`
        );
        res.end();
      }
      return;
    }

    // Non-streaming fallback
    let responseText = "";
    let lastErr: any = null;

    for (const modelName of FAST_MODELS) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.7,
          },
        });
        responseText = response.text || "";
        if (responseText) break;
      } catch (err: any) {
        lastErr = err;
        console.warn(`Model ${modelName} non-stream failed:`, err?.message || err);
      }
    }

    if (!responseText && lastErr) {
      throw lastErr;
    }

    const reply =
      responseText ||
      "I was unable to analyze this symptom. Please provide a bit more detail about your car and what you are noticing.";

    res.json({ reply });
  } catch (error: any) {
    console.error("Gemini API error in /api/chat:", error);
    const errorMessage =
      error?.message || "An error occurred while analyzing the car issue.";
    res.status(500).json({
      error: errorMessage,
      reply:
        "Sorry, I ran into a technical hiccup connecting to the diagnostic system. Please verify your connection or try again in a moment.",
    });
  }
});

// Start server with Vite middleware in dev or static files in prod
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
    console.log(`Car Fault Diagnosis server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
