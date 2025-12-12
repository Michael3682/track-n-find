import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken'
import AuthService from "@/services/auth"

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

export const authorizeModerators =  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.user as JwtPayload).id
    const user = await AuthService.getUserById(userId)
    const adminRoles = ["MODERATOR", "ADMIN"]
    const role = user?.role

    if (!role) {
        return res.status(401).json({
            success: false,
            message: 'Unauthenticated'
        });
    }

    if(!adminRoles.includes(role)) {
        return res.status(403).json({
            success: false,
            message: 'Only admin is required'
        })
    }

    next()
}