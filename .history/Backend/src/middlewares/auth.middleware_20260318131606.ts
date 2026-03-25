import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import decrypt from '../utils/decrypt.js'
import httpStatus from 'http-status'

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies?.accessToken

    if (!token) {
      res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        code: httpStatus.UNAUTHORIZED,
        message: 'No token provided',
      })
      return
    }

    const decrypted = decrypt(token)
    const decoded = jwt.verify(decrypted, process.env.AUTH_SECRET as string) as any

    req.user = {
      _id: decoded._id,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role,
      isVerified: decoded.isVerified,
    }

    next()
  } catch (err) {
    res.status(httpStatus.UNAUTHORIZED).json({
      success: false,
      code: httpStatus.UNAUTHORIZED,
      message: 'Invalid token',
    })
  }
}

export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.user?.role !== 'admin') {
    res.status(httpStatus.FORBIDDEN).json({
      success: false,
      code: httpStatus.FORBIDDEN,
      message: 'Admin access required',
    })
    return
  }

  next()
}

export default authMiddleware
