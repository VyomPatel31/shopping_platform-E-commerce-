import { Request, Response, NextFunction } from 'express'
import { check } from 'express-validator'
import validateRequest from '../utils/validateRequest.js'

const validateCreateProduct = [
  check('name')
    .exists()
    .withMessage('NAME_MISSING')
    .not()
    .isEmpty()
    .withMessage('NAME_EMPTY'),
  check('price')
    .exists()
    .withMessage('PRICE_MISSING')
    .isNumeric()
    .withMessage('PRICE_NOT_NUMBER'),
  check('category')
    .exists()
    .withMessage('CATEGORY_MISSING')
    .not()
    .isEmpty()
    .withMessage('CATEGORY_EMPTY'),
  check('stock')
    .optional()
    .isNumeric()
    .withMessage('STOCK_NOT_NUMBER'),
  (req: Request, res: Response, next: NextFunction) => {
    validateRequest(req, res, next)
  },
]

const validateUpdateProduct = [
  check('name')
    .optional()
    .not()
    .isEmpty()
    .withMessage('NAME_EMPTY'),
  check('price')
    .optional()
    .isNumeric()
    .withMessage('PRICE_NOT_NUMBER'),
  check('category')
    .optional()
    .not()
    .isEmpty()
    .withMessage('CATEGORY_EMPTY'),
  check('stock')
    .optional()
    .isNumeric()
    .withMessage('STOCK_NOT_NUMBER'),
  (req: Request, res: Response, next: NextFunction) => {
    validateRequest(req, res, next)
  },
]

export { validateCreateProduct, validateUpdateProduct }
