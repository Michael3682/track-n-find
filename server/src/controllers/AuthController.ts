import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken'
import { signupSchema, loginSchema } from '@/lib/validations/auth';
import AuthService from '@/services/auth'
import { v4 as uuidV4 } from 'uuid'
import message from '@/socket/services/message';

class AuthController {
    /**
     * @swagger
     * /auth/v1/signup:
     *   post:
     *     summary: User signup
     *     tags:
     *       - Auth
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - studentId
     *               - name
     *               - password
     *             properties:
     *               studentId:
     *                 type: string
     *                 example: 202310123
     *               name:
     *                 type: string
     *                 example: Juan Dela Cruz
     *               password:
     *                 type: string
     *                 example: mysecurepassword
     *     responses:
     *       201:
     *         description: User created successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 message:
     *                   type: string
     *                   example: User created
     *                 user:
     *                   type: object
     *       400:
     *         description: Validation error
     *       409:
     *         description: Student ID already exists
     *       500:
     *         description: Internal Server Error
     */
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

    /**
     * @swagger
     * /auth/v1/login:
     *   post:
     *     summary: User login
     *     tags:
     *       - Auth
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - studentId
     *               - password
     *             properties:
     *               studentId:
     *                 type: string
     *                 example: 202310123
     *               password:
     *                 type: string
     *                 example: mysecurepassword
     *     responses:
     *       200:
     *         description: Login successful
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 message:
     *                   type: string
     *                   example: Login Successful
     *                 user:
     *                   type: object
     *       400:
     *         description: Incorrect password or validation error
     *       404:
     *         description: User not found
     *       500:
     *         description: Internal Server Error
     */
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

    async signupWithEmail(req: Request, res: Response) {
        try {
            const { email, id = uuidV4(), name } = req.body

            const existingUser = await AuthService.getUserById(id)
    
            let user
            if(existingUser) {
                user = await AuthService.bindEmailToUser(id, email)
            } else {
                user = await AuthService.createPasswordlessUser(id, name, email)
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
            
            res.status(201).json({ 
                success: true,
                message: 'User created', 
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

    async loginWithEmail(req: Request, res: Response) {
        try {
            const { email } = req.body

            const user = await AuthService.getUserByEmail(email)

            if(!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found",
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
            
            res.status(201).json({ 
                success: true,
                message: 'User logged in', 
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

    /**
     * @swagger
     * /auth/v1/logout:
     *   post:
     *     summary: Logout user (clears auth cookie)
     *     tags:
     *       - Auth
     *     responses:
     *       200:
     *         description: Logout successful
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 message:
     *                   type: string
     *                   example: Logged out
     *       500:
     *         description: Internal Server Error
     */
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

    /**
     * @swagger
     * /auth/v1/me:
     *   get:
     *     summary: Get authenticated user
     *     tags:
     *       - Auth
     *     responses:
     *       200:
     *         description: Returns the authenticated user
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: Authenticated
     *                 user:
     *                   type: object
     *                   properties:
     *                     id:
     *                       type: string
     *                     name:
     *                       type: string
     *                     email:
     *                       type: string
     *                     role:
     *                       type: string
     *                     createdAt:
     *                       type: string
     *                       format: date-time
     *                     updatedAt:
     *                       type: string
     *                       format: date-time
     */
    async getAuthUser(req: Request, res: Response) {
        const userId = (req.user as JwtPayload).id
        const userData = await AuthService.getUserById(userId)

        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }

        const { password, ...user } = userData

        res.json({ message: "Authenticated",  user })
    }

    async setTheme(req: Request, res: Response) {
        try {
            const userId = (req.user as JwtPayload).id
            const { theme: themeParam } = req.params

            const theme = themeParam as "DARK" | "LIGHT"
            
            const user = AuthService.setTheme(userId, theme)

            res.json({
                success: true,
                message: "Theme changed",
                user
            })
        } catch(err: any) {
            res.status(err.status || 500).json({
                success: false,
                message: "Internal Server Error",
                err: err.message
            })
        }
    }
}

export default new AuthController()