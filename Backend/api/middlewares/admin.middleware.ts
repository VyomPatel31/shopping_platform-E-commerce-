import { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'
import buildErrorObject from '../utils/buildErrorObject.js'
import handleError from '../utils/handleError.js'

const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user

    if (!user || user.role !== 'admin') {
      throw buildErrorObject(httpStatus.FORBIDDEN, 'FORBIDDEN_ONLY_ADMINS')
    }

    next()
  } catch (err: any) {
    handleError(res, err)
  }
}

export default adminMiddleware
