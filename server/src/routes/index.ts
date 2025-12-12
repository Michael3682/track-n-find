import { Router } from "express";
import authRoutes from "@/routes/auth"
import reportRoutes from "@/routes/report"
import chatRoutes from "@/routes/chat"
import logsRoutes from "@/routes/logs"

const router = Router();

router.get("/", (req, res) => res.send("API is running..."));

router.use('/auth', authRoutes)
router.use('/report', reportRoutes)
router.use('/chat', chatRoutes)
router.use('/logs', logsRoutes)

export default router;