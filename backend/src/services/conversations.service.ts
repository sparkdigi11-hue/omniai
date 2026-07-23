import prisma from "../prisma/client";

export async function getOrCreateConversation(
  orderId: string,
  aiEmployeeId?: string
) {
  const existingConversation =
    await prisma.conversation.findFirst({
      where: {
        orderId,
        aiEmployeeId: aiEmployeeId ?? null,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

  if (existingConversation) {
    return existingConversation;
  }

  return prisma.conversation.create({
    data: {
      orderId,
      aiEmployeeId,
    },
  });
}

export async function addConversationMessage(data: {
  conversationId: string;
  sender: "CUSTOMER" | "AI" | "OWNER";
  content: string;
}) {
  return prisma.conversationMessage.create({
    data: {
      conversationId: data.conversationId,
      sender: data.sender,
      content: data.content,
    },
  });
}

export async function getConversationMessages(
  conversationId: string
) {
  return prisma.conversationMessage.findMany({
    where: {
      conversationId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}
export async function getAllConversations() {
  return prisma.conversation.findMany({
    include: {
      order: {
  include: {
    customer: true,
    events: {
      orderBy: {
        createdAt: "asc",
      },
    },
  },
},
      aiEmployee: true,
      messages: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
}
export async function addConversationEvent(data: {
  orderId: string;
  title: string;
  description?: string;
}) {
  return prisma.orderEvent.create({
    data: {
      orderId: data.orderId,
      type: "CONVERSATION",
      title: data.title,
      description: data.description,
    },
  });
}