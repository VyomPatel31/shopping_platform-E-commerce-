import { Router } from 'express'
import authMiddleware, { adminMiddleware } from '../middlewares/auth.middleware.js'

// Import controllers
import * as authController from '../controllers/auth.controller.js'
import * as cartController from '../controllers/cart.controller.js'
import * as productController from '../controllers/product.controller.js'
import * as orderController from '../controllers/order.controller.js'
import * as reviewController from '../controllers/review.controller.js'
import * as wishlistController from '../controllers/wishlist.controller.js'
import * as addressController from '../controllers/address.controller.js'
import * as adminController from '../controllers/admin.controller.js'
import * as paymentController from '../controllers/payment.controller.js'
import { mergeCartController } from '../controllers/cartMerge.controller.js'

const router = Router()

// AUTH ROUTES
router.post('/auth/signup', authController.signupController)
router.post('/auth/login', authController.loginController)
router.post('/auth/logout', authController.logoutController)
router.post('/auth/send-otp', authController.sendOtpController)
router.post('/auth/verify-otp', authController.verifyOtpController)
router.get('/auth/me', authMiddleware, authController.getMeController)
router.post('/auth/refresh', authController.refreshTokenController)

// CART ROUTES
router.post('/cart/add', authMiddleware, cartController.addToCartController)
router.post('/cart/remove', authMiddleware, cartController.removeFromCartController)
router.put('/cart/update', authMiddleware, cartController.updateCartController)
router.get('/cart', authMiddleware, cartController.getCartController)
router.delete('/cart/clear', authMiddleware, cartController.clearCartController)
router.post('/cart/merge', authMiddleware, mergeCartController)

// PRODUCT ROUTES
router.get('/products', productController.getProductsController)
router.get('/products/:id', productController.getProductByIdController)
router.get('/products/featured', productController.getFeaturedProductsController)
router.get('/products/trending', productController.getTrendingProductsController)
router.get('/search', productController.searchProductsController)

// ORDER ROUTES
router.post('/orders', authMiddleware, orderController.createOrderController)
router.get('/orders', authMiddleware, orderController.getOrdersController)
router.get('/orders/:id', authMiddleware, orderController.getOrderByIdController)
router.post('/orders/:id/cancel', authMiddleware, orderController.cancelOrderController)
router.put('/orders/:id/status', authMiddleware, adminMiddleware, orderController.updateOrderStatusController)

// REVIEW ROUTES
router.post('/reviews', authMiddleware, reviewController.createReviewController)
router.get('/reviews/product/:productId', reviewController.getReviewsController)
router.get('/reviews', authMiddleware, reviewController.getUserReviewsController)
router.put('/reviews/:id', authMiddleware, reviewController.updateReviewController)
router.delete('/reviews/:id', authMiddleware, adminMiddleware, reviewController.deleteReviewController)

// WISHLIST ROUTES
router.post('/wishlist/add', authMiddleware, wishlistController.addToWishlistController)
router.get('/wishlist', authMiddleware, wishlistController.getWishlistController)
router.delete('/wishlist/:productId', authMiddleware, wishlistController.removeFromWishlistController)
router.delete('/wishlist/clear', authMiddleware, wishlistController.clearWishlistController)

// ADDRESS ROUTES
router.post('/addresses', authMiddleware, addressController.addAddressController)
router.get('/addresses', authMiddleware, addressController.getAddressController)
router.put('/addresses/:id', authMiddleware, addressController.updateAddressController)
router.delete('/addresses/:id', authMiddleware, addressController.deleteAddressController)
router.post('/addresses/:id/default', authMiddleware, addressController.setDefaultAddressController)

// PAYMENT ROUTES
router.post('/payments/create', authMiddleware, paymentController.createPaymentController)
router.post('/payments/verify', authMiddleware, paymentController.verifyPaymentController)

// ADMIN ROUTES
router.get('/admin/dashboard', authMiddleware, adminMiddleware, adminController.getDashboardController)
router.get('/admin/users', authMiddleware, adminMiddleware, adminController.getAllUsersController)
router.delete('/admin/users/:id', authMiddleware, adminMiddleware, adminController.deleteUserController)
router.post('/admin/products', authMiddleware, adminMiddleware, adminController.createProductController)
router.put('/admin/products/:id', authMiddleware, adminMiddleware, adminController.updateProductController)
router.delete('/admin/products/:id', authMiddleware, adminMiddleware, adminController.deleteProductController)

export default router
