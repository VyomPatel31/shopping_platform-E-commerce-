import { Router } from "express"
import {
  createOrderController,
  getOrdersController,
  getOrderByIdController,
  updateOrderStatusController,
  cancelOrderController,
  checkReviewEligibility,
} from "../controllers/order.controller.js"
import { validateCreateOrder } from "../validators/order.validator.js"

import adminMiddleware from "../middlewares/admin.middleware.js"
import authMiddleware from "../middlewares/auth.middleware.js"

const router = Router()

router.post("/", authMiddleware, validateCreateOrder, createOrderController)
router.get("/check-review-eligibility/:productId", authMiddleware, checkReviewEligibility)
router.get("/", getOrdersController)
router.get("/:id", getOrderByIdController)
router.put("/status/:id", adminMiddleware, updateOrderStatusController)
router.post("/cancel/:id", cancelOrderController)

export default router
