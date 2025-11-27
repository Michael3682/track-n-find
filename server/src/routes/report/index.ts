import { Router } from "express";
import ReportController from "@/controllers/ReportController";
import { authenticate } from "@/middlewares/AuthMiddleware";

const router = Router();

// found
router.post("/found/v1", authenticate, ReportController.addFoundItem)
// router.put("/found/v1/:id", authenticate, ReportController.updateFoundItem)

// lost
router.post("/lost/v1", authenticate, ReportController.addLostItem)

// both
router.get("/v1/items", authenticate, ReportController.getItems)
router.get("/v1/items/:id", authenticate, ReportController.getItem)

export default router;