import { Router } from "express"
import {
  addAddressController,
  getAddressController,
  updateAddressController,
  deleteAddressController,
  setDefaultAddressController,
} from "../controllers/address.controller.js"
import { validateCreateAddress } from "../validators/address.validator.js"

const router = Router()

router.post("/", validateCreateAddress, addAddressController)
router.get("/", getAddressController)
router.put("/:id", updateAddressController)
router.delete("/:id", deleteAddressController)
router.put("/default/:id", setDefaultAddressController)

export default router
