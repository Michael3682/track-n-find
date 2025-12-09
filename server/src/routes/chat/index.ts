import { Router } from "express";
import ChatController from "@/controllers/ChatController";
import { authenticate } from "@/middlewares/AuthMiddleware";

const router = Router();

router.post("/v1/conversation", authenticate, ChatController.findOrCreateConversation)
router.get("/v1/conversation/:conversationId", authenticate, ChatController.getConversationById)
router.get("/v1/conversations", authenticate, ChatController.getConversations)
router.patch("/v1/message/:id", authenticate, ChatController.updateMessage)
router.delete("/v1/message/:id", authenticate, ChatController.deleteMessage)

export default router;