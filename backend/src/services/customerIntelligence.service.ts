import { GoogleGenAI } from "@google/genai";
import prisma from "../prisma/client";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function updateCustomerIntelligence(
  customerId: string,
  conversation: string
) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing");
  }

  const customer = await prisma.customer.findUnique({
    where: {
      id: customerId,
    },
  });

  if (!customer) {
    throw new Error("Customer not found");
  }

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `
You are an AI CRM analyst inside OmniAI.

Analyze the customer conversation below.

Return ONLY valid JSON using exactly this structure:

{
  "summary": "A short summary of the customer and conversation.",
  "insights": {
    "preferredLanguage": "French, Arabic, English, or Unknown",
    "customerMood": "Positive, Neutral, Worried, Angry, or Unknown",
    "riskLevel": "Low, Medium, or High",
    "recommendedStrategy": "A short recommended strategy.",
    "notes": ["note 1", "note 2"]
  }
}

Do not include markdown.
Do not include code fences.
Do not include any text outside the JSON object.

CUSTOMER:
Name: ${customer.name}
Phone: ${customer.phone}
City: ${customer.city ?? "Unknown"}

CONVERSATION:
${conversation}
`,
  });

  const text = response.text?.trim();

  if (!text) {
    throw new Error(
      "Gemini returned an empty customer intelligence response"
    );
  }

  const cleanedText = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  const result = JSON.parse(cleanedText);

  if (
    typeof result.summary !== "string" ||
    !result.insights
  ) {
    throw new Error(
      "Gemini returned invalid customer intelligence data"
    );
  }

  await prisma.customer.update({
    where: {
      id: customerId,
    },
    data: {
      aiSummary: result.summary,
      aiInsights: JSON.stringify(result.insights),
    },
  });
}