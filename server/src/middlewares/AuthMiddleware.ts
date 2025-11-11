import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken'

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.auth_token

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Unauthenticated'
        });
    }

    try {

        const JWT_SECRET = process.env.JWT_SECRET;
    
        if (!JWT_SECRET) {
            throw new Error("JWT_SECRET is not set in environment variables");
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;

        next();
    } catch (err: any) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
}
