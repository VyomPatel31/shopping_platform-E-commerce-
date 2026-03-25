import { Request, Response, NextFunction } from 'express'
import { check } from 'express-validator'
import validateRequest from '../utils/validateRequest.js'

const validateAddToCart = [
  check('productId')
    .exists()
    .withMessage('PRODUCT_ID_MISSING')
    .not()
    .isEmpty()
    .withMessage('PRODUCT_ID_EMPTY'),
  check('quantity')
    .optional()
    .isNumeric()
    .withMessage('QUANTITY_NOT_NUMBER'),
  (req: Request, res: Response, next: NextFunction) => {
    validateRequest(req, res, next)
  },
]

const validateRemoveFromCart = [
  check('productId')
    .exists()
    .withMessage('PRODUCT_ID_MISSING'),
  (req: Request, res: Response, next: NextFunction) => {
    validateRequest(req, res, next)
  },
]

const validateUpdateCart = [
  check('productId')
    .exists()
    .withMessage('PRODUCT_ID_MISSING'),
  check('quantity')
    .exists()
    .withMessage('QUANTITY_MISSING')
    .isNumeric()
    .withMessage('QUANTITY_NOT_NUMBER'),
  (req: Request, res: Response, next: NextFunction) => {
    validateRequest(req, res, next)
  },
]

export { validateAddToCart, validateRemoveFromCart, validateUpdateCart }
