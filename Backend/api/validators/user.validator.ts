import { Request, Response, NextFunction } from 'express'
import { check } from 'express-validator'
import validateRequest from '../utils/validateRequest.js'

const validateUpdateProfile = [
  check('name')
    .optional()
    .not()
    .isEmpty()
    .withMessage('NAME_EMPTY'),
  check('phone')
    .optional()
    .matches(/^[0-9]{10}$/)
    .withMessage('PHONE_NOT_VALID'),
  (req: Request, res: Response, next: NextFunction) => {
    validateRequest(req, res, next)
  },
]

const validateUpdatePassword = [
  check('oldPassword')
    .exists()
    .withMessage('OLD_PASSWORD_MISSING'),
  check('newPassword')
    .exists()
    .withMessage('NEW_PASSWORD_MISSING')
    .isLength({ min: 5 })
    .withMessage('PASSWORD_TOO_SHORT'),
  (req: Request, res: Response, next: NextFunction) => {
    validateRequest(req, res, next)
  },
]

export { validateUpdateProfile, validateUpdatePassword }
