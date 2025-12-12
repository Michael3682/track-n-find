import { Request, Response } from 'express';

class LogsController {
    async record(req: Request, res: Response) {
        try {
            
        } catch(err: any) {
            console.log(err)
            res.status(err.status || 500).json({
                success: false,
                message: "Internal Server Error",
                user: null
            })
        }
    }
}

export default new LogsController()