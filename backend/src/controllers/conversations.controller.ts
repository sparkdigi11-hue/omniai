import { Request, Response } from "express";
import prisma from "../prisma/client";
import {
  addConversationEvent,
  addConversationMessage,
  getAllConversations,
} from "../services/conversations.service";

export async function getConversations(
  _req: Request,
  res: Response
) {
  try {
    const conversations = await getAllConversations();

    return res.json(conversations);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to load conversations",
    });
  }
}

export async function sendOwnerMessage(
  req: Request,
  res: Response
) {
  try {
    const conversationId = String(
      req.params.conversationId
    );

    const content =
      typeof req.body.content === "string"
        ? req.body.content.trim()
        : "";

    if (!content) {
      return res.status(400).json({
        message: "Message content is required",
      });
    }

    const message = await addConversationMessage({
      conversationId,
      sender: "OWNER",
      content,
    });
    const conversation = await prisma.conversation.findUnique({
  where: {
    id: conversationId,
  },
});

if (conversation) {
  await addConversationEvent({
    orderId: conversation.orderId,
    title: "Owner replied",
    description: content,
  });
}

    return res.status(201).json(message);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to send owner message",
    });
  }
}

