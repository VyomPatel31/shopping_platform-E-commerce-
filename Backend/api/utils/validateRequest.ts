import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import httpStatus from 'http-status'

const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  try {
    validationResult(req).throw()
    next()
  } catch (err: any) {
    res.status(httpStatus.UNPROCESSABLE_ENTITY).json({
      success: false,
      code: httpStatus.UNPROCESSABLE_ENTITY,
      ...err,
    })
  }
}

export default validateRequest