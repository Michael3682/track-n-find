import { Router } from "express";
import ReportController from "@/controllers/ReportController";
import { authenticate } from "@/middlewares/AuthMiddleware";

const router = Router();

// found
router.post("/found/v1", authenticate, ReportController.addFoundItem)
router.get("/found/v1", authenticate, ReportController.getUserFoundItems)

// lost
router.post("/lost/v1", authenticate, ReportController.addLostItem)
router.get("/lost/v1/", authenticate, ReportController.getUserLostItems)

// archived
router.get("/v1/archived", authenticate, ReportController.getUserArchivedItems)

// both
router.get("/v1/items", authenticate, ReportController.getItems)
router.get("/v1/items/archived", authenticate, ReportController.getArchivedItems)
router.get("/v1/items/:id", authenticate, ReportController.getItem)
router.patch("/v1/items/:id", authenticate, ReportController.updateItem)
router.delete("/v1/items/:id", authenticate, ReportController.deleteItem)
router.put("/v1/items/:id", authenticate, ReportController.archiveItem)
router.put("/v1/items/:id/restore", authenticate, ReportController.restoreItem)
router.patch("/v1/items/:id/toggleStatus", authenticate, ReportController.toggleStatus)


// claim
router.post("/v1/claim", authenticate, ReportController.reportClaim)

// Return
router.post("/v1/return", authenticate, ReportController.reportReturn)
export default router;