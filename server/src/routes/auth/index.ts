import { Router } from "express";
import AuthController from "@/controllers/AuthController";

const router = Router();

router.post("/v1/signup", AuthController.signup)
router.post("/v1/login", AuthController.login)

export default router;