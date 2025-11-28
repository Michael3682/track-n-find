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
 *   description: API for managing lost and found items
 *
 * components:
 *   schemas:
 *     Item:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         category:
 *           type: string
 *         date_time:
 *           type: string
 *           format: date-time
 *         location:
 *           type: string
 *         attachments:
 *           type: array
 *           items:
 *             type: string
 *         status:
 *           type: string
 *         type:
 *           type: string
 *         associated_person:
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
 * /report/found/v1:
 *   post:
 *     summary: Add a found item
 *     description: Allows a user to report a found item
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
 *               date:
 *                 type: string
 *                 format: date
 *               time:
 *                 type: string
 *                 format: time
 *               location:
 *                 type: string
 *               attachments:
 *                 type: array
 *                 items:
 *                   type: string
 *               description:
 *                 type: string
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
 *                 item:
 *                   $ref: '#/components/schemas/Item'
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /report/lost/v1:
 *   post:
 *     summary: Report a lost item
 *     description: Allows a user to report a lost item
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
 *               date:
 *                 type: string
 *                 format: date
 *               time:
 *                 type: string
 *                 format: time
 *               location:
 *                 type: string
 *               attachments:
 *                 type: array
 *                 items:
 *                   type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Lost item successfully reported
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 item:
 *                   $ref: '#/components/schemas/Item'
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /report/v1/items:
 *   get:
 *     summary: Get all items
 *     description: Retrieves all lost and found items
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Item'
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /report/v1/items/{id}:
 *   get:
 *     summary: Get a specific item
 *     description: Retrieves a lost or found item by its ID
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The item ID
 *     responses:
 *       200:
 *         description: Item successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 item:
 *                   $ref: '#/components/schemas/Item'
 *       404:
 *         description: Item not found
 *       500:
 *         description: Internal server error
 */

class ReportController {

  async addFoundItem(req: Request, res: Response) {
    try {
      const {
        value: { itemName, date, time, location, attachments, description, itemId },
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

  async getItems(req: Request, res: Response) {
    try {
        const items = await ReportService.getItems()

        res.json({
            success: true,
            items
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

  async getItem(req: Request, res: Response) {
    try {
      const id = req.params.id
      const item = await ReportService.getItem(id)

      res.json({
        success: true,
        item
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

  async getUserFoundItems(req: Request, res: Response) {
    try {
      const userId = (req.user as JwtPayload).id
      const foundItems = await ReportService.getUserFoundItems(userId)

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

  async getUserLostItems(req: Request, res: Response) {
    try {
      const userId = (req.user as JwtPayload).id
      const lostItems = await ReportService.getUserLostItems(userId)

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
}

export default new ReportController();
