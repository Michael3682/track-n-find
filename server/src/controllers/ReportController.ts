import { Request, Response } from "express";
import ReportService from "@/services/report";
import { v4 as uuidV4 } from "uuid";
import { foundItemSchema, lostItemSchema } from "@/lib/validations/report";
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

  /**
 * @swagger
 * /report/found/v1:
 *   get:
 *     summary: Get all found & unclaimed items
 *     description: Returns all items of type FOUND with status UNCLAIMED.
 *     tags:
 *       - Reports
 *     responses:
 *       200:
 *         description: List of found items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 foundItems:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Item'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Item:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "c83e99c5-8b72-4d96-b7ee-4d45b0b9a673"
 *         name:
 *           type: string
 *           example: "Black Wallet"
 *         description:
 *           type: string
 *           example: "A black leather wallet with IDs inside"
 *         category:
 *           type: string
 *           nullable: true
 *           example: "Accessories"
 *         date_time:
 *           type: string
 *           format: date-time
 *           example: "2025-11-21T14:30:00.000Z"
 *         location:
 *           type: string
 *           example: "Library 2nd Floor"
 *         attachments:
 *           type: array
 *           items:
 *             type: string
 *           example: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
 *         status:
 *           type: string
 *           enum: [UNCLAIMED, CLAIMED]
 *           example: "UNCLAIMED"
 *         type:
 *           type: string
 *           enum: [FOUND, LOST]
 *           example: "FOUND"
 *         associated_person:
 *           type: string
 *           example: "John Doe"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-11-21T14:31:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-11-21T14:31:00.000Z"
 */
  async getFoundItems(req: Request, res: Response) {
    try {
        const foundItems = await ReportService.getFoundItems()

        res.json({
            success: true,
            foundItems
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

  /**
 * @swagger
 * /report/found/v1/{id}:
 *   get:
 *     summary: Get a specific found item
 *     description: Returns a single found item by its ID.
 *     tags: [Reports]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the found item
 *     responses:
 *       200:
 *         description: Found item retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 foundItem:
 *                   $ref: '#/components/schemas/Item'
 *       404:
 *         description: Item not found
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
 *                   example: "Item not found"
 *       500:
 *         description: Internal server error
 */
  async getFoundItem(req: Request, res: Response) {
    try {
      const id = req.params.id
      const foundItem = await ReportService.getFoundItem(id)

      res.json({
        success: true,
        foundItem
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

  /**
 * @swagger
 * /report/lost/v1:
 *   post:
 *     summary: Report a lost item
 *     description: Allows a user to report a lost item in the system.
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
 *                 description: Name of the lost item
 *                 example: "Phone"
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Date when the item was lost
 *                 example: "2025-11-21"
 *               time:
 *                 type: string
 *                 format: time
 *                 description: Time when the item was lost
 *                 example: "09:15"
 *               location:
 *                 type: string
 *                 description: Last known location of the item
 *                 example: "SM Cebu Food Court"
 *               attachments:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Optional array of file URLs or images
 *                 example: ["https://example.com/lost_phone.jpg"]
 *               description:
 *                 type: string
 *                 description: Additional details about the lost item
 *                 example: "Samsung S21, black case, minor scratches"
 *     responses:
 *       200:
 *         description: Lost item reported successfully
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
 */
  async addLostItem(req: Request, res: Response) {
    try {
      const {
        value: { itemName, date, time, location, attachments, description },
        error,
      } = lostItemSchema.validate(req.body);
      const userId = (req.user as JwtPayload).id;

      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details[0].message,
          user: null,
        });
      }

      const item = await ReportService.addLostItem({
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

  /**
 * @swagger
 * /report/lost/v1:
 *   get:
 *     summary: Get all lost & unclaimed items
 *     description: Returns all items of type LOST with status UNCLAIMED.
 *     tags:
 *       - Reports
 *     responses:
 *       200:
 *         description: List of lost items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 lostItems:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Item'
 *       500:
 *         description: Internal server error
 */
  async getLostItems(req: Request, res: Response) {
    try {
        const lostItems = await ReportService.getLostItems()

        res.json({
            success: true,
            lostItems
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

  /**
 * @swagger
 * /report/lost/v1/{id}:
 *   get:
 *     summary: Get a specific lost item
 *     description: Returns a single lost item by its ID.
 *     tags: [Reports]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the lost item
 *     responses:
 *       200:
 *         description: Lost item retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 lostItem:
 *                   $ref: '#/components/schemas/Item'
 *       404:
 *         description: Item not found
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
 *                   example: "Item not found"
 *       500:
 *         description: Internal server error
 */
  async getLostItem(req: Request, res: Response) {
    try {
      const id = req.params.id
      const lostItem = await ReportService.getLostItem(id)

      res.json({
        success: true,
        lostItem
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

export default new ReportController();
