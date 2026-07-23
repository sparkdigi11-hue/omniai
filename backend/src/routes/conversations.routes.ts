import { Router } from "express";
import {
  getConversations,
  sendOwnerMessage,
} from "../controllers/conversations.controller";

const router = Router();

router.get("/", getConversations);
router.post("/:conversationId/messages/owner", sendOwnerMessage);

export default router;