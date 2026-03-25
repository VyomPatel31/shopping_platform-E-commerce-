import { Router } from "express"
import {
  addToWishlistController,
  getWishlistController,
  removeFromWishlistController,
  clearWishlistController,
} from "../controllers/wishlist.controller.js"

const router = Router()

router.post("/add", addToWishlistController)
router.get("/", getWishlistController)
router.delete("/remove/:productId", removeFromWishlistController)
router.delete("/clear", clearWishlistController)

export default router
