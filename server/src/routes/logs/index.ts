import { Router } from "express";
import LogsContoller from "@/controllers/LogsContoller";
import { authenticate } from "@/middlewares/AuthMiddleware";

const router = Router();

router.post("/v1/log", authenticate, LogsContoller.record)

export default router;