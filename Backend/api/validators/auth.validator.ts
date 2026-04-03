import { Request, Response, NextFunction } from 'express'
import { check } from 'express-validator'
import validateRequest from '../utils/validateRequest.js'

const validateSignup = [
  check('name')
    .exists()
    .withMessage('NAME_MISSING')
    .not()
    .isEmpty()
    .withMessage('NAME_EMPTY'),
  check('email')
    .exists()
    .withMessage('EMAIL_MISSING')
    .isEmail()
    .withMessage('EMAIL_NOT_VALID')
    .trim()
    .normalizeEmail({ gmail_remove_dots: false }),
  check('password')
    .exists()
    .withMessage('PASSWORD_MISSING')
    .not()
    .isEmpty()
    .withMessage('PASSWORD_EMPTY')
    .isLength({ min: 5 })
    .withMessage('PASSWORD_TOO_SHORT'),
  (req: Request, res: Response, next: NextFunction) => {
    validateRequest(req, res, next)
  },
]

const validateLogin = [
  check('email')
    .exists()
    .withMessage('EMAIL_MISSING')
    .isEmail()
    .withMessage('EMAIL_NOT_VALID')
    .trim()
    .normalizeEmail({ gmail_remove_dots: false }),
  check('password')
    .exists()
    .withMessage('PASSWORD_MISSING')
    .not()
    .isEmpty()
    .withMessage('PASSWORD_EMPTY'),
  (req: Request, res: Response, next: NextFunction) => {
    validateRequest(req, res, next)
  },
]

const validateVerifyOTP = [
  check('email')
    .exists()
    .withMessage('EMAIL_MISSING')
    .isEmail()
    .withMessage('EMAIL_NOT_VALID')
    .trim()
    .normalizeEmail({ gmail_remove_dots: false }),
  check('otp')
    .exists()
    .withMessage('OTP_MISSING')
    .not()
    .isEmpty()
    .withMessage('OTP_EMPTY'),
  (req: Request, res: Response, next: NextFunction) => {
    validateRequest(req, res, next)
  },
]

const validateForgotPassword = [
  check('email')
    .exists()
    .withMessage('EMAIL_MISSING')
    .isEmail()
    .withMessage('EMAIL_NOT_VALID')
    .trim()
    .normalizeEmail({ gmail_remove_dots: false }),
  (req: Request, res: Response, next: NextFunction) => {
    validateRequest(req, res, next)
  },
]

const validateResetPassword = [
  check('forgotToken')
    .exists()
    .withMessage('TOKEN_MISSING')
    .not()
    .isEmpty()
    .withMessage('TOKEN_EMPTY'),
  check('newPassword')
    .exists()
    .withMessage('PASSWORD_MISSING')
    .not()
    .isEmpty()
    .withMessage('PASSWORD_EMPTY')
    .isLength({ min: 5 })
    .withMessage('PASSWORD_TOO_SHORT'),
  (req: Request, res: Response, next: NextFunction) => {
    validateRequest(req, res, next)
  },
]

export {
  validateSignup,
  validateLogin,
  validateVerifyOTP,
  validateForgotPassword,
  validateResetPassword,
}
