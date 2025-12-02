import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import ChatRepository from "@/repositories/chat"

class ChatContoller {
    async findOrCreateConversation(req: Request, res: Response) {
        try {
            const { itemId, hostId } = req.body
            const senderId = (req.user as JwtPayload).id;

                const conversation = await ChatRepository.findOrCreateConversation({ itemId, hostId, senderId})

                res.json({
                    success: true,
                    conversation
                })
        } catch (err: any) {
            console.log(err);
            res.status(err.status || 500).json({
                success: false,
                message: "Internal Server Error",
                user: null,
             });
        }
    }

    async getConversationById(req: Request, res: Response) {
        try {
            const { conversationId } = req.params
            const userId = (req.user as JwtPayload).id

            const conversation = await ChatRepository.findConversationById(conversationId, userId)

            res.json({
                success: true,
                conversation
            })
        } catch (err: any) {
            console.log(err);
            res.status(err.status || 500).json({
                success: false,
                message: "Internal Server Error",
                user: null,
             });
        }
    }
    
    async getConversations(req: Request, res: Response) {
        try {
            const userId = (req.user as JwtPayload).id;

            const conversations = await ChatRepository.getUserConversations(userId)

            res.json({
                success: true,
                conversations
            })
        } catch (err: any) {
            console.log(err);
            res.status(err.status || 500).json({
                success: false,
                message: "Internal Server Error",
                user: null,
             });
        }
    }
}

export default new ChatContoller()