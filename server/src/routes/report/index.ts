import { Router } from "express";
import ReportController from "@/controllers/ReportController";
import { authenticate } from "@/middlewares/AuthMiddleware";

const router = Router();

// found
router.post("/found/v1", authenticate, ReportController.addFoundItem)
router.get("/found/v1", authenticate, ReportController.getFoundItems)
router.get("/found/v1/:id", authenticate, ReportController.getFoundItem)
// router.put("/found/v1/:id", authenticate, ReportController.updateFoundItem)

// lost
router.post("/lost/v1", authenticate, ReportController.addLostItem)
router.get("/lost/v1", authenticate, ReportController.getLostItems)
router.get("/found/v1/:id", authenticate, ReportController.getLostItem)

export default router;