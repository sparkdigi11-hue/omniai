import { GoogleGenAI } from "@google/genai";

type GenerateAIResponseInput = {
  systemPrompt: string;
  customerMessage: string;
};

type GenerateAIResponseResult = {
  reply: string;
  suggestedStatus: string | null;
};

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function generateAIResponse(
  input: GenerateAIResponseInput
): Promise<GenerateAIResponseResult> {
  const { systemPrompt, customerMessage } = input;

  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing");
  }

  const response = await ai.models.generateContent({
   model: "gemini-3-flash-preview",
    contents: `
${systemPrompt}

CUSTOMER MESSAGE:
${customerMessage}

Respond ONLY with valid JSON using exactly this structure:

{
  "reply": "your reply to the customer",
  "suggestedStatus": null
}

The suggestedStatus must be exactly one of:
"Confirmed", "Callback", "Cancelled", or null.

Choose null when the customer's intent is unclear or when no order status change should happen.

Do not include markdown.
Do not include code fences.
Do not include any text outside the JSON object.
`,
  });

  const text = response.text?.trim();

  if (!text) {
    throw new Error("Gemini returned an empty response");
  }

  const cleanedText = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  const parsed = JSON.parse(cleanedText);

  return {
    reply:
      typeof parsed.reply === "string"
        ? parsed.reply
        : "I could not generate a response.",
    suggestedStatus:
      parsed.suggestedStatus === "Confirmed" ||
      parsed.suggestedStatus === "Callback" ||
      parsed.suggestedStatus === "Cancelled"
        ? parsed.suggestedStatus
        : null,
  };
}