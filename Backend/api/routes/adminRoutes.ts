import { Router } from "express"
import {
  getAdminDashboardController,
  getAllUsersController,
  deleteUserController,
  updateUserRoleController,
  getAllOrdersController,
  getAllReviewsController,
  updateReviewStatusController,
  getUserDetailsController,
} from "../controllers/admin.controller.js"

const router = Router()

router.get("/dashboard", getAdminDashboardController)
router.get("/users", getAllUsersController)
router.get("/users/details/:id", getUserDetailsController)
router.delete("/users/:id", deleteUserController)
router.put("/users/role/:id", updateUserRoleController)
router.get("/orders", getAllOrdersController)
router.get("/reviews", getAllReviewsController)
router.put("/reviews/status/:id", updateReviewStatusController)

export default router
