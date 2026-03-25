import { Router } from "express"
import {
  getProfileController,
  updateProfileController,
  updatePasswordController,
} from "../controllers/user.controller.js"
import { validateUpdateProfile, validateUpdatePassword } from "../validators/user.validator.js"

const router = Router()

router.get("/profile", getProfileController)
router.put("/profile", validateUpdateProfile, updateProfileController)
router.put("/password", validateUpdatePassword, updatePasswordController)

export default router
