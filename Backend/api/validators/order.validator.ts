import { Request, Response, NextFunction } from 'express'
import { check } from 'express-validator'
import validateRequest from '../utils/validateRequest.js'

const validateCreateOrder = [
  check('addressId')
    .exists()
    .withMessage('ADDRESS_ID_MISSING')
    .not()
    .isEmpty()
    .withMessage('ADDRESS_ID_EMPTY'),
  check('paymentMethod')
    .exists()
    .withMessage('PAYMENT_METHOD_MISSING')
    .isIn(['online', 'cod'])
    .withMessage('INVALID_PAYMENT_METHOD'),
  (req: Request, res: Response, next: NextFunction) => {
    validateRequest(req, res, next)
  },
]

export { validateCreateOrder }
