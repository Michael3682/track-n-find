import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import { signupSchema, loginSchema } from '@/lib/validations/auth';
import AuthService from '@/services/auth'


class AuthController {
    async signup(req: Request, res: Response) {
        try {
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
        } catch(err: any) {
            console.log(err)
            res.status(err.status || 500).json({
                success: false,
                message: "Internal Server Error",
                user: null
            })
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { value: { studentId, password }, error } = loginSchema.validate(req.body)

            if(error) {
                return res.status(400).json({
                    success: false,
                    message: error.details[0].message,
                    user: null
                });
            }

            const user = await AuthService.getUserById(studentId)
            
            if(!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found",
                    user: null
                })
            }

            const isMatch = await bcrypt.compare(password, user.password)

            if(!isMatch) {
                return res.status(400).json({
                    success: false,
                    message: "Incorrect Password",
                    user: null
                })
            }

            const JWT_SECRET = process.env.JWT_SECRET;
    
            if (!JWT_SECRET) {
                throw new Error("JWT_SECRET is not set in environment variables");
            }

            const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' })
    
            const localUser = JSON.parse(JSON.stringify(user))
            delete localUser.password
    
            res.cookie('auth_token', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                maxAge: 7 * 24 * 60 * 60 * 1000
            })
            
            res.json({ 
                success: true,
                message: 'Login Successful', 
                user: localUser 
            })

        } catch (err: any) {
            console.log(err)
            res.status(err.status || 500).json({
                success: false,
                message: "Internal Server Error",
                user: null
            })
        }
    }

    async logout(req: Request, res: Response) {
        try {
            res.clearCookie('auth_token', {
                httpOnly: true,
                secure: true,
                sameSite: 'none'
            })

            res.json({
                success: true, 
                message: "Logged out"
            })
        } catch(err: any) {
            res.status(err.status || 500).json({
                success: false,
                message: "Internal Server Error",
            })
        }
    }

    async getAuthUser(req: Request, res: Response) {
        res.json({ message: "Authenticated",  user: req.user })
    }
}

export default new AuthController()