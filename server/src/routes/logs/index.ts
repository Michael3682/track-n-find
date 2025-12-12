import { Router } from "express";
import LogsContoller from "@/controllers/LogsContoller";
import { authenticate, authorizeModerators } from "@/middlewares/AuthMiddleware";

const router = Router();

router.get("/", authenticate, authorizeModerators, LogsContoller.getLogs)

export default router;