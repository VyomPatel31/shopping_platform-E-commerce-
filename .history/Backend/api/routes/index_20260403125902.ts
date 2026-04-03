import { Router, Request, Response } from 'express'
import authRoutes from "./authRoutes.js"
import productRoutes from "./productRoutes.js"
import cartRoutes from "./cartRoutes.js"
import wishlistRoutes from "./wishlistRoutes.js"
import orderRoutes from "./orderRoutes.js"
import addressRoutes from "./addressRoutes.js"
import reviewRoutes from "./reviewRoutes.js"
import adminRoutes from "./adminRoutes.js"
import paymentRoutes from "./paymentRoutes.js"
import userRoutes from "./userRoutes.js"

import authMiddleware from '../middlewares/auth.middleware.js'
import adminMiddleware from '../middlewares/admin.middleware.js'
// I'll use .js for all imports to stay consistent with ESM.

const router = Router()

router.get('/', (req, res) => {
  res.json({ message: 'Welcome to Shopping Platform API' })
})

// Public Routes
router.use("/auth", authRoutes)
router.use("/products", productRoutes)
router.use("/reviews", reviewRoutes) // reviews are public to read

// Protected Routes
router.use("/cart", authMiddleware, cartRoutes)
router.use("/wishlist", authMiddleware, wishlistRoutes)
router.use("/orders", authMiddleware, orderRoutes)
router.use("/address", authMiddleware, addressRoutes)
router.use("/payment", authMiddleware, paymentRoutes)
router.use("/user", authMiddleware, userRoutes)

// Admin Shared Routes
router.use("/admin", authMiddleware, adminMiddleware, adminRoutes)

export default router