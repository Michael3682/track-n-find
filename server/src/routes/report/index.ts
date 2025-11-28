import { Router } from "express";
import ReportController from "@/controllers/ReportController";
import { authenticate } from "@/middlewares/AuthMiddleware";

const router = Router();

// found
router.post("/found/v1", authenticate, ReportController.addFoundItem)
router.get("/found/v1/", authenticate, ReportController.getUserFoundItems)

// lost
router.post("/lost/v1", authenticate, ReportController.addLostItem)
router.get("/lost/v1/", authenticate, ReportController.getUserLostItems)

// both
router.get("/v1/items", authenticate, ReportController.getItems)
router.get("/v1/items/:id", authenticate, ReportController.getItem)

export default router;