import { Router } from "express";
import AuthController from "@/controllers/AuthController";
import { authenticate, authorizeAdmin, authorizeModerators } from "@/middlewares/AuthMiddleware";

const router = Router();

router.post("/v1/signup", AuthController.signup)
router.post("/v1/login", AuthController.login)
router.post("/v1/signup/email", AuthController.signupWithEmail)
router.post("/v1/login/email", AuthController.loginWithEmail)

router.post("/v1/logout", authenticate, AuthController.logout)
router.get("/v1/me", authenticate, AuthController.getAuthUser)

router.post("/v1/theme/:theme", authenticate, AuthController.setTheme)

router.get("/v1/users", authenticate, authorizeModerators, AuthController.getAllUsers)
router.patch("/v1/user/:id", authenticate, authorizeAdmin, AuthController.toggleRole)
router.patch("/v1/user/:id/change-password", authenticate, authorizeAdmin, AuthController.changePassword)

export default router;