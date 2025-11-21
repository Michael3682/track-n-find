import { Request, Response } from "express";
import ReportService from "@/services/report";
import { v4 as uuidV4 } from "uuid";
import { foundItemSchema } from "@/lib/validations/report";
import { JwtPayload } from "jsonwebtoken";
import { it } from "node:test";

 /**
   * @swagger
   * tags:
   *   name: Reports
   *   description: API for managing found items
   */
class ReportController {

  /**
   * @swagger
   * /report/found/v1:
   *   post:
   *     summary: Add a found item
   *     description: Allows a user to add a found item to the system
   *     tags: [Reports]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - itemName
   *               - date
   *               - time
   *               - location
   *               - description
   *             properties:
   *               itemName:
   *                 type: string
   *                 description: Name of the found item
   *                 example: "Wallet"
   *               date:
   *                 type: string
   *                 format: date
   *                 description: Date when the item was found
   *                 example: "2025-11-21"
   *               time:
   *                 type: string
   *                 format: time
   *                 description: Time when the item was found
   *                 example: "14:30"
   *               location:
   *                 type: string
   *                 description: Location where the item was found
   *                 example: "Cebu City"
   *               attachments:
   *                 type: array
   *                 items:
   *                   type: string
   *                 description: Optional array of file URLs or attachment references
   *                 example: ["https://example.com/photo1.jpg"]
   *               description:
   *                 type: string
   *                 description: Description of the item
   *                 example: "Black leather wallet with ID cards"
   *     responses:
   *       200:
   *         description: Found item successfully created
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 item:
   *                   $ref: '#/components/schemas/Item'
   *       400:
   *         description: Validation error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "itemName is required"
   *                 user:
   *                   type: string
   *                   nullable: true
   *                   example: null
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Internal Server Error"
   *                 user:
   *                   type: string
   *                   nullable: true
   *                   example: null
   *
   * components:
   *   schemas:
   *     Item:
   *       type: object
   *       properties:
   *         id:
   *           type: string
   *           example: "c0a8015e-1dd2-11b2-8080-808080808080"
   *         name:
   *           type: string
   *           example: "Wallet"
   *         description:
   *           type: string
   *           example: "Black leather wallet with ID cards"
   *         category:
   *           type: string
   *           example: "Found"
   *         date_time:
   *           type: string
   *           format: date-time
   *           example: "2025-11-21T14:30:00Z"
   *         location:
   *           type: string
   *           example: "Cebu City"
   *         attachments:
   *           type: array
   *           items:
   *             type: string
   *           example: ["https://example.com/photo1.jpg"]
   *         status:
   *           type: string
   *           example: "UNCLAIMED"
   *         type:
   *           type: string
   *           example: "FOUND"
   *         associated_person:
   *           type: string
   *           example: "user-id-123"
   *         createdAt:
   *           type: string
   *           format: date-time
   *           example: "2025-11-21T14:31:00Z"
   *         updatedAt:
   *           type: string
   *           format: date-time
   *           example: "2025-11-21T14:31:00Z"
   */

  async addFoundItem(req: Request, res: Response) {
    try {
      const {
        value: { itemName, date, time, location, attachments, description },
        error,
      } = foundItemSchema.validate(req.body);
      const userId = (req.user as JwtPayload).id;

      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details[0].message,
          user: null,
        });
      }

      const item = await ReportService.addFoundItem({
        itemName,
        date,
        time,
        location,
        attachments,
        description,
        userId,
      });

      res.json({
        success: true,
        item,
      });
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

export default new ReportController();
