import { Router } from "express";
import AuthController from "@/controllers/AuthController";

const router = Router();

router.post("/v1/signup", AuthController.signup)

export default router;