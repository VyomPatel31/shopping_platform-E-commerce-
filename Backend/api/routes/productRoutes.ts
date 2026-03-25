import { Router } from "express";

import {
    getProductsController,
    getProductByIdController,
    getFeaturedProductsController,
    getTrendingProductsController,
    searchProductsController,
    createProductController,
    updateProductController,
    deleteProductController,
    uploadProductImageController
} from "../controllers/product.controller.js"

import { validateCreateProduct, validateUpdateProduct } from "../validators/product.validator.js"

import authMiddleware from "../middlewares/auth.middleware.js"
import adminMiddleware from "../middlewares/admin.middleware.js"
import upload from "../helpers/upload.helper.js"

const router = Router()

router.get("/", getProductsController)
router.get("/featured", getFeaturedProductsController)
router.get("/trending", getTrendingProductsController)
router.get("/search", searchProductsController)
router.get("/:id", getProductByIdController)

// Admin: upload image from PC
router.post("/upload-image", authMiddleware, adminMiddleware, upload.single("image"), uploadProductImageController)

// Admin: CRUD routes
router.post("/", authMiddleware, adminMiddleware, validateCreateProduct, createProductController)
router.put("/:id", authMiddleware, adminMiddleware, validateUpdateProduct, updateProductController)
router.delete("/:id", authMiddleware, adminMiddleware, deleteProductController)

export default router