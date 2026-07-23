import prisma from "../prisma/client";
import { generateAIResponse } from "./llm.service";
import { updateCustomerIntelligence } from "./customerIntelligence.service";
import {
  addConversationEvent,
  addConversationMessage,
  getConversationMessages,
  getOrCreateConversation,
} from "./conversations.service";

function parseStringArray(value?: string | null): string[] {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function buildEmployeePrompt(
  employeeId: string,
  orderId?: string
) {
  const employee = await prisma.aIEmployee.findUnique({
    where: {
      id: employeeId,
    },
  });

  if (!employee) {
    throw new Error("AI employee not found");
  }

  const knowledgeIds = parseStringArray(
    employee.knowledgeItemIds
  );

  const knowledgeItems = await prisma.knowledgeItem.findMany({
    where: {
      id: {
        in: knowledgeIds,
      },
    },
  });

  const order = orderId
    ? await prisma.order.findUnique({
        where: {
          id: orderId,
        },
        include: {
          customer: true,
        },
      })
    : null;

  const knowledgeText =
    knowledgeItems.length > 0
      ? knowledgeItems
          .map(
            (item) =>
              `### ${item.title}
Category: ${item.category}
${item.content}`
          )
          .join("\n\n")
      : "No knowledge base information configured.";

  const orderText = order
    ? `
Customer name: ${order.customer.name}
Customer phone: ${order.customer.phone}
Customer city: ${order.customer.city ?? "Unknown"}
Product: ${order.product}
Price: ${order.price ?? "Unknown"}
Current status: ${order.status}
`
    : "No order selected.";

  return `
You are ${employee.name}, an AI employee inside OmniAI.

ROLE:
${employee.role}

LANGUAGE:
${employee.language}

GOAL:
${employee.goal || "No goal configured."}

SCRIPT:
${employee.script || "No script configured."}

RULES:
${employee.rules || "No rules configured."}

AVAILABLE TOOLS:
${parseStringArray(employee.tools).join(", ") || "No tools configured."}

KNOWLEDGE BASE:
${knowledgeText}

CURRENT ORDER:
${orderText}

Follow the configured goal, script, rules, tools, and knowledge base.
Never invent information that is not provided.
`.trim();
}

export async function simulateEmployeeResponse(
  employeeId: string,
  customerMessage: string,
  orderId?: string
) {
  if (!orderId) {
    throw new Error(
      "orderId is required for conversation history"
    );
  }

  const prompt = await buildEmployeePrompt(
    employeeId,
    orderId
  );

  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
    include: {
      customer: true,
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  const conversation = await getOrCreateConversation(
    orderId,
    employeeId
  );

  const previousMessages = await getConversationMessages(
    conversation.id
  );

  const conversationHistory = previousMessages
    .map(
      (message) =>
        `${message.sender}: ${message.content}`
    )
    .join("\n");

  await addConversationMessage({
    conversationId: conversation.id,
    sender: "CUSTOMER",
    content: customerMessage,
  });

  await addConversationEvent({
    orderId,
    title: "Customer sent a message",
    description: customerMessage,
  });

  const aiResult = await generateAIResponse({
    systemPrompt: `${prompt}

CONVERSATION HISTORY:
${conversationHistory || "No previous messages."}`,
    customerMessage,
  });

  await addConversationMessage({
    conversationId: conversation.id,
    sender: "AI",
    content: aiResult.reply,
  });

  await addConversationEvent({
    orderId,
    title: "AI replied",
    description: aiResult.reply,
  });

  if (aiResult.suggestedStatus) {
    const currentOrder = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
    });

    if (
      currentOrder &&
      currentOrder.status !== aiResult.suggestedStatus
    ) {
      await prisma.order.update({
        where: {
          id: orderId,
        },
        data: {
          status: aiResult.suggestedStatus,
          events: {
            create: {
              type: "AI",
              title: "AI updated order status",
              description: `${currentOrder.status} → ${aiResult.suggestedStatus}`,
            },
          },
        },
      });
    }
  }

  const completeMessages = await getConversationMessages(
    conversation.id
  );

  const completeConversation = completeMessages
    .map(
      (message) =>
        `${message.sender}: ${message.content}`
    )
    .join("\n");

  await updateCustomerIntelligence(
    order.customer.id,
    completeConversation
  );

  return {
    prompt,
    customerMessage,
    reply: aiResult.reply,
    suggestedStatus: aiResult.suggestedStatus,
  };
}