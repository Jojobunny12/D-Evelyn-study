import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";
import { generateAcademicFallbackDeck, generateFallbackQuiz } from "./src/utils/academicFallback";

dotenv.config();

const app = express();
const PORT = 3000;

// Increase limits to support base64 study files
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("GEMINI_API_KEY environment variable is missing. Academic fallback generator will be utilized.");
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

const FALLBACK_MODELS = ["gemini-3.7-flash", "gemini-3.1-flash-lite", "gemini-flash-latest"];

async function executeGeminiWithRetry(
  callFn: (ai: GoogleGenAI, modelName: string) => Promise<any>
): Promise<any> {
  const ai = getGeminiClient();
  if (!ai) {
    throw new Error("NO_API_KEY");
  }

  let lastError: any = null;

  for (const model of FALLBACK_MODELS) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const result = await callFn(ai, model);
        return result;
      } catch (err: any) {
        lastError = err;
        const msg = (err?.message || "").toLowerCase();
        const isUnavailableOrRateLimited =
          err?.status === 503 ||
          err?.status === 429 ||
          err?.code === 503 ||
          err?.code === 429 ||
          msg.includes("503") ||
          msg.includes("unavailable") ||
          msg.includes("high demand") ||
          msg.includes("resource_exhausted") ||
          msg.includes("rate");

        if (isUnavailableOrRateLimited) {
          console.warn(`Gemini model ${model} attempt ${attempt + 1} experienced load/rate spike. Backing off...`);
          await new Promise((resolve) => setTimeout(resolve, 800 * (attempt + 1)));
          continue;
        } else {
          // If non-transient model specific issue, try next model immediately
          break;
        }
      }
    }
  }

  throw lastError || new Error("All Gemini models temporarily unavailable.");
}

// REST API endpoint to analyze study materials and map to dynamic high school curriculums
app.post("/api/analyze-finals-material", async (req, res) => {
  try {
    const {
      schoolName,
      courseCode,
      courseName,
      department,
      curriculumDetails,
      examFocus,
      studyStrategy,
      pastedText,
      additionalNotes,
      fileBase64,
      fileMimeType,
    } = req.body;

    if (!courseCode) {
      res.status(400).json({ error: "courseCode is required." });
      return;
    }

    const ai = getGeminiClient();
    const activeSchool = schoolName || "Infinite Campus High";
    const activeCourseName = courseName || `Course ${courseCode}`;

    // Prepare contents array for Gemini
    const systemPrompt = `You are the ultimate Academic Coach specialized in high-stakes high school curriculums, with a hilariously witty, sassy, but highly professional and academically flawless instruction style.
This study platform helps students prepping for finals in "${activeSchool}" based primarily on the Infinite Campus Course Code: "${courseCode}" (and official name if specified: "${activeCourseName}").

No study notes or PDF files are required! Your goal is to:
1. Deconstruct the Course Code "${courseCode}" to figure out the level, subject, and department (e.g. "SCI_CHEM" -> Chemistry, "ENG09" -> Freshman Literature & Composition, "MATH_AP_CALC_AB" -> Advanced Placement Calculus, etc.).
2. Generate an entire, custom, elite, and hilarious finals preparation study deck from your deep training data for this subject's actual academic syllabus.

CRITICAL FORMULA & MATH RENDERING GUIDELINES:
- DO NOT USE RAW LATEX SYMBOLS OR MATH BLOCKS (such as \\frac{a}{b}, \\sqrt{x}, \\bar{x}, \\hat{p}, \\pm, or $$...$$ / $...$) in your output, as standard browsers cannot render them without complex compilation packages.
- INSTEAD, write ALL mathematical formulas, fractions, limits, integrals, statistics terms, or balances in incredibly clean, beautiful, and immediately readable plain unicode text.
- Examples of how to write formulas beautifully in your markdown or output:
  - Write standard error as "SE_x̅ = s / √n" or "SE(_x-bar) = s / sqrt(n)"
  - Write standard error of proportion as "SE_p̂ = √(p̂(1 - p̂) / n)"
  - Write confidence interval as "Statistic ± (Critical Value) * (Standard Error)"
  - Write t-statistic as "t = (x̅ - μ0) / (s / √n) with df = n - 1"
  - Write slope formula as "m = (y2 - y1) / (x2 - x1)"
  - Write chemical equations as "2H2 + O2 --> 2H2O" with simple subscript style.
  - Write limits as "lim (x -> c) f(x) = L"
- This keeps the study cards, notes, and cheat sheets completely clean and readable!

HUMOR & ENGAGEMENT GUIDELINES:
- Make the tone highly dynamic, sassy, and incredibly humorous using modern teenage internet slang and memes! Empathize with the classic high school panic.
- Use slang terms like "ts" (slang meaning "this shit", e.g., "ts is light work", "learning ts is free points"), "Epstein" (e.g., "The answers on this test are more classified than Jeffrey Epstein's private guest list"), "Among Us" / "sussy imposter" (e.g., "spotting the sussy imposter among us in our linear equations"), and the viral Indonesian TikTok iron pan hit "tung tung tung sahur! sahur!" (for a loud energetic alarm wake-up vibe).
- Talk about "Infinite Campus database refreshes at 1:04 AM", the "Standard Deviation of tears in class", "forgetting the '+ C' integration constant which instantly vaporizes your points", "coping with the gradebook drop", and "trying to raise your GPA from absolute zero".
- Do this while maintaining absolute, 100% textbook accuracy for the core academic facts! Keep math unicode clean and LaTeX-free!

CRITICAL QUIZ CONTENT BENEFACTOR REQUIREMENT:
- EVERY single quiz question MUST be a real, highly useful academic study question directly testing core facts, formulas, theorems, dates, grammar patterns, historical figures, or problems from this course curriculum (e.g., actual integration, trigonometric equations, chemical formulas, historical events).
- Under NO circumstances generate filler questions about "high school panic", "generic testing advice", or "sussy imposter study habits" as the actual question. The questions must test real subject facts.
- Infuse the humorous slang or high school jokes purely inside the *options*, *explanation*, or sassy phrasing, but NEVER sacrifice real academic preparation substance!

The Course metadata we compiled:
- Course Code: ${courseCode} (Infinite Campus standard)
- High School: ${activeSchool}
- Provided Course Name: ${activeCourseName}
- Department: ${department || "Deduce from code"}
- Typical Curriculum Focus: ${curriculumDetails || "Deduce from code standards"}
- Typical Finals Exam Format: ${examFocus || "Traditional honors cumulative exam"}
- Core Recommended Strategy: ${studyStrategy || "Deduce optimal approach"}

Student's Added Special Directions or Panic: ${additionalNotes || "None"}

Please extract the core technical vocabulary, formulas, equations, texts, themes, key figures, or rules, and project how they will be tested in signature high school finals.

You must reply with a valid JSON object matching the exact structure requested, with no markdown code blocks format surrounding it (or return pure JSON text directly) with the following schema:
{
  "summary": {
    "title": string (A professional yet engaging, custom study companion title specific to this course and materials, e.g., 'AP Chem: The Equilibrium & Stoichiometry Survival Deck' or 'Western Civ: Medieval Thought (And Why It\'s Ruining Your Sleep) Final Companion'),
    "curriculumExplanation": string (A highly professional academic explanation mapping how this specific set of study concepts meshes with the course's guidelines, written beautifully with a touch of humor),
    "topTipsForFinal": [string] (Exactly 3-4 highly tactical, specific, and funny pieces of study/survival advice, e.g., 'If your stoichiometric variables aren\'t aligned, your teacher will summon standard deviation demons', or 'Brush up on Caesar\'s Indirect Statements before Infinite Campus updates at midnight'),
    "synthesizedNotesParagraph": string (A deep, academically authoritative narrative summarization of the core study notes for this course, serving as a rapid refresher),
    "coreCheatSheetMarkdown": string (A beautiful, dense, and well-structured Markdown-formatted review sheet representing the foundational knowledge, equations, dates, declensions, or chemical structures for this specific Course Code)
  },
  "timeline": [
    {
      "dayName": string (e.g., 'Day 1: Theory (And Denial)', 'Day 2: The Proofs (And Anger)', 'Day 5: Synthesis (Acceptance)'),
      "activityTitle": string,
      "activityDescription": string
    }
  ] (Plan a 5-day study countdown leading to their final),
  "flashcards": [
    {
      "question": string,
      "answer": string
    }
  ] (Provide 8 to 12 active-recall flashcards for key vocabulary, names, theorems, conjugations, or equations),
  "quiz": [
    {
      "question": string (A rigorous and specific quiz question. For math/science, include realistic values. Keep it very punchy and short. Must be a genuine academic test question),
      "options": [string] (Provide exactly 4 distinct options, e.g. ["A) ...", "B) ...", "C) ...", "D) ..."]),
      "correctIndex": number (0 to 3),
      "explanation": string (A short, step-by-step resolution of why this choice is mathematically/historically proofed, ending with a meme-filled survival punchline.)
    }
  ] (Provide exactly 25 premium multiple-choice questions. Be concise and crisp to guarantee swift parsing!)
}`;

    const promptMessage = `Make me a premium study companion deck for my course code: ${courseCode}. You MUST generate EXACTLY 25 multiple choice questions inside the "quiz" array. Keep each question's text and options very engaging and concise. Fleshed out subject details should be fully accurate with master equations, historical arguments, or literary texts. Add extensive humor about campus survival, ts, Epstein's client files, Among Us, and tung tung tung sahur alarms!
${pastedText ? `My additional notes/study guide reference:
"""
${pastedText}
"""` : ""}`;

    const contents: any[] = [];

    // If a base64 file is attached, add it as a part
    if (fileBase64 && fileMimeType) {
      try {
        const cleanBase64 = fileBase64.replace(/^data:.*;base64,/, "");
        contents.push({
          inlineData: {
            mimeType: fileMimeType,
            data: cleanBase64,
          },
        });
      } catch (fileErr) {
        console.error("Error setting inlineData for Gemini:", fileErr);
      }
    }

    contents.push({ text: promptMessage });

    try {
      const response = await executeGeminiWithRetry(async (aiInstance, modelName) => {
        return await aiInstance.models.generateContent({
          model: modelName,
          contents: contents,
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              required: ["summary", "timeline", "flashcards", "quiz"],
              properties: {
                summary: {
                  type: Type.OBJECT,
                  required: [
                    "title",
                    "curriculumExplanation",
                    "topTipsForFinal",
                    "synthesizedNotesParagraph",
                    "coreCheatSheetMarkdown",
                  ],
                  properties: {
                    title: { type: Type.STRING },
                    curriculumExplanation: { type: Type.STRING },
                    topTipsForFinal: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    synthesizedNotesParagraph: { type: Type.STRING },
                    coreCheatSheetMarkdown: { type: Type.STRING },
                  },
                },
                timeline: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    required: ["dayName", "activityTitle", "activityDescription"],
                    properties: {
                      dayName: { type: Type.STRING },
                      activityTitle: { type: Type.STRING },
                      activityDescription: { type: Type.STRING },
                    },
                  },
                },
                flashcards: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    required: ["question", "answer"],
                    properties: {
                      question: { type: Type.STRING },
                      answer: { type: Type.STRING },
                    },
                  },
                },
                quiz: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    required: ["question", "options", "correctIndex", "explanation"],
                    properties: {
                      question: { type: Type.STRING },
                      options: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                      correctIndex: { type: Type.INTEGER },
                      explanation: { type: Type.STRING },
                    },
                  },
                },
              },
            },
          },
        });
      });

      const replyText = response?.text;
      if (!replyText) {
        throw new Error("Empty response from Gemini API.");
      }

      const payload = JSON.parse(replyText.trim());
      res.json(payload);
    } catch (apiErr: any) {
      console.warn("Gemini API unavailable or experienced rate/503 limits. Generating academic fallback deck:", apiErr?.message);
      const fallbackDeck = generateAcademicFallbackDeck({
        schoolName: activeSchool,
        courseCode: courseCode,
        courseName: activeCourseName,
        department: department,
        curriculumDetails: curriculumDetails,
        examFocus: examFocus,
        studyStrategy: studyStrategy,
      });
      res.json(fallbackDeck);
    }
  } catch (error: any) {
    console.error("General study helper endpoint failure:", error);
    // Last-resort fallback
    const targetCode = req.body?.courseCode || "GEN101";
    const fallbackDeck = generateAcademicFallbackDeck({
      schoolName: req.body?.schoolName,
      courseCode: targetCode,
      courseName: req.body?.courseName,
      department: req.body?.department,
    });
    res.json(fallbackDeck);
  }
});

// REST API endpoint to generate 25 more questions on demand
app.post("/api/generate-more-questions", async (req, res) => {
  try {
    const {
      courseCode,
      courseName,
      department,
      existingQuestions,
    } = req.body;

    if (!courseCode) {
      res.status(400).json({ error: "courseCode is required." });
      return;
    }

    const activeCourseName = courseName || `Course ${courseCode}`;

    const systemPrompt = `You are the ultimate Academic Coach specialized in high-stakes high school curriculums, with a hilariously witty, sassy, but highly professional and academically flawless instruction style.

Your goal is to generate 25 MORE completely custom, elite, and academically rigorous multiple-choice questions for Course Code: "${courseCode}" (official name: "${activeCourseName}").

CRITICAL FORMULA & MATH RENDERING GUIDELINES:
- DO NOT USE RAW LATEX SYMBOLS OR MATH BLOCKS (such as \\frac{a}{b}, \\sqrt{x}, \\bar{x}, \\hat{p}, \\pm, or $$...$$ / $...$) in your output.
- INSTEAD, write ALL mathematical formulas, fractions, limits, integrals, statistics terms, or balances in incredibly clean, beautiful, and immediately readable plain unicode text.
- Examples of how to write formulas beautifully in your markdown or output:
  - Write standard error as "SE_x̅ = s / √n" or "SE(_x-bar) = s / sqrt(n)"
  - Write standard error of proportion as "SE_p̂ = √(p̂(1 - p̂) / n)"
  - Write confidence interval as "Statistic ± (Critical Value) * (Standard Error)"
  - Write slope formula as "m = (y2 - y1) / (x2 - x1)"
  - Write limits as "lim (x -> c) f(x) = L"

HUMOR & ENGAGEMENT GUIDELINES:
- Make the tone highly dynamic, sassy, and incredibly humorous using modern teenage internet slang and memes! Empathize with the classic high school panic.
- Use slang terms like "ts" (slang meaning "this shit", e.g., "ts is light work", "learning ts is free points"), "Epstein" (e.g., "The answers on this test are more classified than Jeffrey Epstein's private guest list"), "Among Us" / "sussy imposter" (e.g., "spotting the sussy imposter among us in our linear equations"), and the viral Indonesian TikTok iron pan hit "tung tung tung sahur! sahur!" (for a loud energetic alarm wake-up vibe).

CRITICAL QUIZ CONTENT REQUIREMENT:
- EVERY single quiz question MUST be a real, highly useful academic study question directly testing core facts, formulas, theorems, dates, grammar patterns, historical figures, or problems from this course curriculum.
- Under NO circumstances generate filler questions about "high school panic", "generic testing advice", or "sussy imposter study habits" as the actual question. The questions must test real subject facts.
- Infuse the humorous slang or high school jokes purely inside the *options*, *explanation*, or sassy phrasing, but NEVER sacrifice real academic preparation substance!

DO NOT duplicate any of the following questions that are already in the student's study deck:
${(existingQuestions || []).map((q: any) => `- ${q.question}`).slice(0, 50).join("\n")}

Please respond with a valid JSON object matching the exact structure requested, with no markdown code blocks format surrounding it (or return pure JSON text directly) with the following schema:
{
  "quiz": [
    {
      "question": string (A rigorous and specific quiz question. For math/science, include realistic values. Keep it very punchy and short. Must be a genuine academic test question),
      "options": [string] (Provide exactly 4 distinct options, e.g. ["A) ...", "B) ...", "C) ...", "D) ..."]),
      "correctIndex": number (0 to 3),
      "explanation": string (A short, step-by-step resolution of why this choice is mathematically/historically proofed, ending with a meme-filled survival punchline.)
    }
  ]
} (Provide exactly 25 premium multiple-choice questions. Be concise and crisp to guarantee swift parsing!)`;

    const promptMessage = `Make me 25 MORE premium multiple choice questions inside the "quiz" array for my course code: ${courseCode}. Fleshed out subject details should be fully accurate with master equations, historical arguments, or literary texts. Add extensive humor about campus survival, ts, Epstein's client files, and tung tung tung sahur alarms!`;

    try {
      const response = await executeGeminiWithRetry(async (aiInstance, modelName) => {
        return await aiInstance.models.generateContent({
          model: modelName,
          contents: promptMessage,
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              required: ["quiz"],
              properties: {
                quiz: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    required: ["question", "options", "correctIndex", "explanation"],
                    properties: {
                      question: { type: Type.STRING },
                      options: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                      correctIndex: { type: Type.INTEGER },
                      explanation: { type: Type.STRING },
                    },
                  },
                },
              },
            },
          },
        });
      });

      const replyText = response?.text;
      if (!replyText) {
        throw new Error("Empty response from Gemini API.");
      }

      const payload = JSON.parse(replyText.trim());
      res.json(payload);
    } catch (apiErr: any) {
      console.warn("Gemini API unavailable for extra questions. Generating academic fallback questions:", apiErr?.message);
      const fallbackQuestions = generateFallbackQuiz(activeCourseName, courseCode, department || "General", 25);
      res.json({ quiz: fallbackQuestions });
    }
  } catch (error: any) {
    console.error("General more questions endpoint failure:", error);
    const fallbackQuestions = generateFallbackQuiz(req.body?.courseName || "General Course", req.body?.courseCode || "GEN101", req.body?.department || "General", 25);
    res.json({ quiz: fallbackQuestions });
  }
});

// Serve frontend assets
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
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
