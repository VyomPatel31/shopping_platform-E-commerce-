import { Router } from "express"
import {
  createReviewController,
  getReviewsController,
  deleteReviewController,
  getUserReviewsController,
  updateReviewController,
} from "../controllers/review.controller.js"
import { validateCreateReview } from "../validators/review.validator.js"

import authMiddleware from "../middlewares/auth.middleware.js"
import adminMiddleware from "../middlewares/admin.middleware.js"

const router = Router()

router.post("/", authMiddleware, validateCreateReview, createReviewController)
router.get("/product/:productId", getReviewsController)
router.get("/user", authMiddleware, getUserReviewsController)
router.put("/:id", authMiddleware, updateReviewController)
router.delete("/:id", authMiddleware, adminMiddleware, deleteReviewController)

export default router
