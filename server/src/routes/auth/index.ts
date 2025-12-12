import { Router } from "express";
import AuthController from "@/controllers/AuthController";
import { authenticate, authorizeModerators } from "@/middlewares/AuthMiddleware";

const router = Router();

router.post("/v1/signup", AuthController.signup)
router.post("/v1/login", AuthController.login)
router.post("/v1/signup/email", AuthController.signupWithEmail)
router.post("/v1/login/email", AuthController.loginWithEmail)

router.post("/v1/logout", authenticate, AuthController.logout)
router.get("/v1/me", authenticate, AuthController.getAuthUser)
router.get("/v1/users", authenticate, authorizeModerators, AuthController.getAllUsers)

router.post("/v1/theme/:theme", authenticate, AuthController.setTheme)

export default router;