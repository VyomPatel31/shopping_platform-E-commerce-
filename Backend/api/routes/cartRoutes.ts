import { Router } from "express";

import {
    addToCartController,
    removeFromCartController,
    updateCartController,
    getCartController,
    clearCartController
} from "../controllers/cart.controller.js"



import { validateAddToCart, validateRemoveFromCart, validateUpdateCart } from "../validators/cart.validator.js"

const router = Router()

router.post("/add", validateAddToCart, addToCartController)
router.delete("/remove", validateRemoveFromCart, removeFromCartController)
router.put("/update", validateUpdateCart, updateCartController)
router.get("/", getCartController)
router.delete("/clear", clearCartController)

export default router