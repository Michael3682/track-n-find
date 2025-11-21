import { Router } from "express";
import authRoutes from "@/routes/auth"
import reportRoutes from "@/routes/report"

const router = Router();

router.get("/", (req, res) => res.send("API is running..."));

router.use('/auth', authRoutes)
router.use('/report', reportRoutes)

export default router;