import { Router } from "express";
import AuthController from "@/controllers/AuthController";
import { authenticate } from "@/middlewares/AuthMiddleware";

const router = Router();

router.post("/v1/signup", AuthController.signup)
router.post("/v1/login", AuthController.login)

router.post("/v1/logout", authenticate, AuthController.logout)
router.get("/v1/me", authenticate, AuthController.getAuthUser)

export default router;