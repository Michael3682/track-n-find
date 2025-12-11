import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import ChatRepository from "@/repositories/chat"

/**
 * @swagger
 * tags:
 *   name: Chat
 *   description: API for messaging between reporters and claimers
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Conversation:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         itemId:
 *           type: string
 *         hostId:
 *           type: string
 *         senderId:
 *           type: string
 *         participants:
 *           type: array
 *           items:
 *             type: string
 *         lastMessage:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /chat/v1/conversation:
 *   post:
 *     summary: Create or find an existing conversation
 *     description: Creates a new conversation between the reporter and claimer OR returns an existing one linked to the same item.
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - itemId
 *               - hostId
 *             properties:
 *               itemId:
 *                 type: string
 *                 description: The ID of the item involved in the conversation.
 *               hostId:
 *                 type: string
 *                 description: The ID of the item's reporter or holding user.
 *     responses:
 *       200:
 *         description: Conversation returned or created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 conversation:
 *                   $ref: '#/components/schemas/Conversation'
 *       400:
 *         description: Invalid input.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /chat/v1/conversation/{conversationId}:
 *   get:
 *     summary: Get conversation details
 *     description: Returns a specific conversation by ID if the user is a participant.
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         schema:
 *           type: string
 *         description: Conversation ID
 *     responses:
 *       200:
 *         description: Conversation retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 conversation:
 *                   $ref: '#/components/schemas/Conversation'
 *       403:
 *         description: Forbidden – User is not a participant.
 *       404:
 *         description: Conversation not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /chat/v1/conversations:
 *   get:
 *     summary: Get user conversations
 *     description: Retrieves all conversations where the authenticated user is a participant.
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of conversations.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 conversations:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Conversation'
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /chat/v1/message/{id}:
 *   patch:
 *     summary: Update a message
 *     description: Allows the author of the message to update its content.
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the message to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 description: New message content
 *     responses:
 *       200:
 *         description: Message updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 updatedMessage:
 *                   type: object
 *       400:
 *         description: Validation error
 *       403:
 *         description: Forbidden – not the author of the message
 *       404:
 *         description: Message not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /chat/v1/message/{id}:
 *   delete:
 *     summary: Delete a message
 *     description: Allows the author of the message to delete it.
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the message to delete
 *     responses:
 *       200:
 *         description: Message deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 deletedMessage:
 *                   type: object
 *       403:
 *         description: Forbidden – not the author of the message
 *       404:
 *         description: Message not found
 *       500:
 *         description: Internal server error
 */

class ChatContoller {
    async findOrCreateConversation(req: Request, res: Response) {
        try {
            const { itemId, hostId, senderId = (req.user as JwtPayload).id } = req.body

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

    async updateMessage(req: Request, res: Response) {
        try {
            const { id } = req.params
            const { content } = req.body
            const userId = (req.user as JwtPayload).id;

            const message = await ChatRepository.getMessage(id)

            if(!message) {
                return res.status(404).json({
                    success: false,
                    message: "Message not found"
                })
            }

            if(message.authorId != userId) {
                return res.status(403).json({
                    success: false,
                    message: "You are forbidden to do this action"
                })
            }

            const updatedMessage = await ChatRepository.updateMessage(id, content)

            res.json({
                success: true,
                message: "Message updated",
                updatedMessage
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

    async deleteMessage(req: Request, res: Response) {
        try {
            const { id } = req.params
            const userId = (req.user as JwtPayload).id

            const message = await ChatRepository.getMessage(id)

            if(!message) {
                return res.status(404).json({
                    success: false,
                    message: "Message not found"
                })
            }

            if(message.authorId != userId) {
                return res.status(403).json({
                    success: false,
                    message: "You are forbidden to do this action"
                })
            }

            const deletedMessage = await ChatRepository.deleteMessage(id)

            res.json({
                success: true,
                message: "Message deleted",
                deletedMessage
            })
        } catch (error) {
            
        }
    }
}

export default new ChatContoller()