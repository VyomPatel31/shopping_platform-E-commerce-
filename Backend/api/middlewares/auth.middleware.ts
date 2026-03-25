import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import httpStatus from 'http-status'
import User from '../models/user.schema.js'
import buildErrorObject from '../utils/buildErrorObject.js'
import handleError from '../utils/handleError.js'
import decrypt from '../utils/decrypt.js'

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.accessToken || req.headers.authorization?.split(' ')[1]

    if (!token) {
      throw buildErrorObject(httpStatus.UNAUTHORIZED, 'UNAUTHORIZED')
    }

    const decryptedToken = decrypt(token)
    const decoded: any = jwt.verify(decryptedToken, process.env.AUTH_SECRET!)

    const user = await User.findById(decoded._id)

    if (!user) {
      throw buildErrorObject(httpStatus.UNAUTHORIZED, 'USER_NOT_FOUND')
    }

    (req as any).user = user
    next()
  } catch (err: any) {
    handleError(res, err)
  }
}

export default authMiddleware
