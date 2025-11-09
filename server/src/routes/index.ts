import { Router } from "express";
import authRoutes from "@/routes/auth"

const router = Router();

router.get("/", (req, res) => res.send("API is running..."));

router.use('/auth', authRoutes)

export default router;