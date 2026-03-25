import { Router } from "express";
import {
    loginController,
    logoutController,
    forgotPasswordController,
    resetPasswordController,
    signupController,
    sendOtpController,
    verifyOtpController
} from "../controllers/auth.controller.js";

import {
    validateSignup,
    validateLogin,
    validateVerifyOTP,
    validateForgotPassword,
    validateResetPassword,
} from "../validators/auth.validator.js"


const router = Router()

router.post("/signup", validateSignup, signupController)
router.post("/send-otp", validateForgotPassword, sendOtpController)
router.post("/verify-otp", validateVerifyOTP, verifyOtpController)
router.post("/login", validateLogin, loginController)
router.post("/logout", logoutController)
router.post("/forgot-password", validateForgotPassword, forgotPasswordController)
router.post("/reset-password", validateResetPassword, resetPasswordController)

export default router