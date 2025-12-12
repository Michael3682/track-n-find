import { Request, Response } from 'express';
import LogService from "@/services/logs"

/**
 * @swagger
 * /logs:
 *   get:
 *     summary: Get paginated activity logs
 *     description: Retrieve activity logs using page and limit query parameters.
 *     tags:
 *       - Logs
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 20
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Logs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 20
 *       500:
 *         description: Internal Server Error
 */

class LogsController {
    async getLogs(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;

            const offset = (page - 1) * limit;

            const logs = await LogService.getLogs({ offset, limit})

            res.json({
                success: true,
                ...logs,
                page,
                limit
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

export default new LogsController()