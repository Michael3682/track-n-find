import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import { signupSchema } from '@/lib/validations/auth';
import AuthService from '@/services/auth'


class AuthController {
    async signup(req: Request, res: Response) {
        const { value: { studentId, name, password }, error } = signupSchema.validate(req.body)

        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message,
                user: null
            });
        }

        const existingStudent = await AuthService.getUserById(studentId)

        if(existingStudent) {
            return res.status(409).json({
                success: false,
                message: "An account with this student ID already exists",
                user: null,
            });
        }

        const JWT_SECRET = process.env.JWT_SECRET;

        if (!JWT_SECRET) {
            throw new Error("JWT_SECRET is not set in environment variables");
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await AuthService.createUser(studentId, name, hashedPassword);
        const token = jwt.sign({ id: newUser.id }, JWT_SECRET, { expiresIn: '7d' })

        const localUser = JSON.parse(JSON.stringify(newUser))
        delete localUser.password

        res.cookie('auth_token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        
        res.status(201).json({ 
            success: true,
            message: 'User created', 
            user: localUser 
        })
    }
}

export default new AuthController()