import { Request, Response, NextFunction } from 'express'
import { check } from 'express-validator'
import validateRequest from '../utils/validateRequest.js'

const validateCreateAddress = [
  check('fullName')
    .exists().withMessage('FULLNAME_MISSING')
    .not().isEmpty().withMessage('FULLNAME_EMPTY'),
  check('phone')
    .exists().withMessage('PHONE_MISSING')
    .not().isEmpty().withMessage('PHONE_EMPTY')
    .matches(/^[0-9]{10}$/).withMessage('PHONE_INVALID'),

  check('addressLine1')
    .exists().withMessage('ADDRESS_LINE_1_MISSING')
    .not().isEmpty().withMessage('ADDRESS_LINE_1_EMPTY'),
  check('city')
    .exists().withMessage('CITY_MISSING')
    .not().isEmpty().withMessage('CITY_EMPTY'),
  check('state')
    .exists().withMessage('STATE_MISSING')
    .not().isEmpty().withMessage('STATE_EMPTY'),
  check('pincode')
    .exists().withMessage('PINCODE_MISSING')
    .matches(/^[0-9]{6}$/).withMessage('PINCODE_INVALID'),
  (req: Request, res: Response, next: NextFunction) => {
    validateRequest(req, res, next)
  },
]

export { validateCreateAddress }
