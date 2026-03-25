import { Request, Response, NextFunction } from 'express'
import { check } from 'express-validator'
import validateRequest from '../utils/validateRequest.js'

const validateCreateReview = [
  check('product')
    .exists()
    .withMessage('PRODUCT_ID_MISSING')
    .not()
    .isEmpty()
    .withMessage('PRODUCT_ID_EMPTY'),
  check('rating')
    .exists()
    .withMessage('RATING_MISSING')
    .isNumeric()
    .withMessage('RATING_NOT_NUMBER')
    .isFloat({ min: 1, max: 5 })
    .withMessage('RATING_NOT_IN_RANGE'),
  check('comment')
    .optional()
    .not()
    .isEmpty()
    .withMessage('COMMENT_EMPTY'),
  (req: Request, res: Response, next: NextFunction) => {
    validateRequest(req, res, next)
  },
]

export { validateCreateReview }
