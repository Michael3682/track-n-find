import { Request, Response } from "express";
import ReportService from "@/services/report";
import AuthService from "@/services/auth";
import { v4 as uuidV4 } from "uuid";
import { claimSchema, itemSchema, returnSchema, updateItemSchema } from "@/lib/validations/report";
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

/**
 * @swagger
 * /report/v1/items/{id}:
 *   patch:
 *     summary: Update an item
 *     description: Allows the owner of the item or an admin to update a lost or found item
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the item to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
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
 *               status:
 *                 type: string
 *                 description: Current status of the item (e.g., PENDING, CLAIMED, RESOLVED)
 *     responses:
 *       200:
 *         description: Item successfully updated
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
 *       403:
 *         description: User does not have permission to update this item
 *       404:
 *         description: Item not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /report/v1/claim:
 *   post:
 *     summary: Report an item as claimed
 *     description: 
 *       Allows the reporter or an admin to submit a claim report once an item is handed over 
 *       to the verified claimer. This updates the item status to CLAIMED.
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
 *               - itemId
 *               - claimerId
 *               - claimerName
 *               - credentials
 *               - claimedAt
 *               - reporterId
 *               - conversationId
 *             properties:
 *               itemId:
 *                 type: string
 *               claimerId:
 *                 type: string
 *               claimerName:
 *                 type: string
 *               credentials:
 *                 type: object
 *                 properties:
 *                   yearAndSection:
 *                     type: string
 *                   studentId:
 *                     type: string
 *                   contactNumber:
 *                     type: string
 *                   proofOfClaim:
 *                     type: string
 *                 required:
 *                   - yearAndSection
 *                   - studentId
 *                   - contactNumber
 *               claimedAt:
 *                 type: string
 *                 format: date-time
 *               reporterId:
 *                 type: string
 *               conversationId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Claim successfully recorded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 claim:
 *                   type: object
 *                 updatedItem:
 *                   $ref: '#/components/schemas/Item'
 *       400:
 *         description: Validation error or item already claimed
 *       403:
 *         description: Not allowed to perform this action
 *       404:
 *         description: Item not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /report/v1/return:
 *   post:
 *     summary: Report an item as returned or turned over to admins
 *     description:
 *       Allows the reporter or an admin to submit a return/turnover report stating that the item
 *       has been officially turned over. This updates the item as CLAIMED (from admin side).
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
 *               - itemId
 *               - returnerId
 *               - returnerName
 *               - credentials
 *               - returnedAt
 *               - reporterId
 *               - conversationId
 *             properties:
 *               itemId:
 *                 type: string
 *               returnerId:
 *                 type: string
 *               returnerName:
 *                 type: string
 *               credentials:
 *                 type: object
 *                 properties:
 *                   yearAndSection:
 *                     type: string
 *                   studentId:
 *                     type: string
 *                   contactNumber:
 *                     type: string
 *                   proofOfClaim:
 *                     type: string
 *               returnedAt:
 *                 type: string
 *                 format: date-time
 *               reporterId:
 *                 type: string
 *               conversationId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Return/Turnover report successfully recorded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 returned:
 *                   type: object
 *                 updatedItem:
 *                   $ref: '#/components/schemas/Item'
 *       400:
 *         description: Validation error or item already claimed
 *       403:
 *         description: Not authorized
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
      } = itemSchema.validate(req.body);
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
      } = itemSchema.validate(req.body);
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

  async updateItem(req: Request, res: Response) {
    try {
      const {
        value: { itemName, date, time, location, attachments, description, status },
        error,
      } = updateItemSchema.validate(req.body)
      const userId = (req.user as JwtPayload).id
      const { id } = req.params

      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details[0].message,
        })
      }

      const item = await ReportService.getItem(id)
      const user = await AuthService.getUserById(userId)

      if (!item) {
        return res.status(404).json({
          success: false,
          message: "Item not found",
        });
      }

      if (item.associated_person !== userId && user?.role !== "ADMIN") {
        return res.status(403).json({
          success: false,
          message: "Forbidden: You are not allowed to perform this action",
        });
      }

      const isoDate = date?.split("T")[0];
      const dateTime = new Date(`${isoDate}T${time}:00`);

      const updatedItem = await ReportService.updateItem(id, {
        name: itemName,
        date_time: dateTime,
        location,
        attachments,
        description,
        status
      });

      return res.json({
        success: true,
        item: updatedItem,
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

  async toggleStatus(req: Request, res: Response) {
    try {
      const userId = (req.user as JwtPayload).id
      const { id } = req.params

      const item = await ReportService.getItem(id)
      const user = await AuthService.getUserById(userId)

      if (!item) {
        return res.status(404).json({
          success: false,
          message: "Item not found",
        });
      }

      if (item.associated_person !== userId && user?.role !== "ADMIN") {
        return res.status(403).json({
          success: false,
          message: "Forbidden: You are not allowed to perform this action",
        });
      }

      const toggledItem = await ReportService.updateItem(id, { status: item.status == 'CLAIMED' ? "UNCLAIMED" : "CLAIMED" })

      return res.json({
        success: true,
        item: toggledItem
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

  async reportClaim(req: Request, res: Response) {
    try {
      const { value: { 
        itemId, 
        claimerId,
        claimerName,
        credentials: {
          yearAndSection,
          studentId,
          contactNumber,
          proofOfClaim
        },
        claimedAt,
        reporterId,
        conversationId
      }, error } = claimSchema.validate(req.body)
      const userId = (req.user as JwtPayload).id

      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details[0].message,
        })
      }

      const item = await ReportService.getItem(itemId)
      const user = await AuthService.getUserById(userId)

      if (!item) {
        return res.status(404).json({
          success: false,
          message: "Item not found",
        });
      }
      
      if (item.associated_person !== userId && user?.role !== "ADMIN") {
        return res.status(403).json({
          success: false,
          message: "Forbidden: You are not allowed to perform this action",
        });
      }

      if (item.status === "CLAIMED") {
        return res.status(400).json({
          success: false,
          message: "Item is already claimed"
        })
      }

      // save claim to db
      const claim = await ReportService.reportClaim({ 
        itemId, 
        claimerId,
        claimerName,
        yearAndSection,
        studentId,
        contactNumber,
        proofOfClaim,
        claimedAt,
        reporterId,
        conversationId
      })

      // update item as claimed
      const updatedItem = await ReportService.updateItem(itemId, { status: "CLAIMED" })
      
      res.json({
        success: true,
        claim,
        updatedItem
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

  async reportReturn(req: Request, res: Response) {
    try {
      const { value: { 
        itemId, 
        returnerId,
        returnerName,
        credentials: {
          yearAndSection,
          studentId,
          contactNumber,
          proofOfClaim
        },
        returnedAt,
        reporterId,
        conversationId
      }, error } = returnSchema.validate(req.body)
      const userId = (req.user as JwtPayload).id

      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details[0].message,
        })
      }

      const item = await ReportService.getItem(itemId)
      const user = await AuthService.getUserById(userId)

      if (!item) {
        return res.status(404).json({
          success: false,
          message: "Item not found",
        });
      }
      
      if (item.associated_person !== userId && user?.role !== "ADMIN") {
        return res.status(403).json({
          success: false,
          message: "Forbidden: You are not allowed to perform this action",
        });
      }

      if (item.status === "CLAIMED") {
        return res.status(400).json({
          success: false,
          message: "Item is already claimed"
        })
      }

      const returned = await ReportService.reportReturn({ 
        itemId, 
        returnerId,
        returnerName,
        yearAndSection,
        studentId,
        contactNumber,
        proofOfClaim,
        returnedAt,
        reporterId,
        conversationId
      })

      // update item as claimed
      const updatedItem = await ReportService.updateItem(itemId, { status: "CLAIMED" })
      
      res.json({
        success: true,
        returned,
        updatedItem
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
