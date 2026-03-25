import { Request, Response, NextFunction } from 'express'
import { JwtPayload } from 'jsonwebtoken'

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string
        name: string
        email: string
        role: 'user' | 'admin'
        isVerified: boolean
      }
      sessionID?: string
    }
  }
}

export interface ApiResponse<T = any> {
  success: boolean
  code: number
  message?: string
  response?: T
  data?: T
}

export interface AuthTokenPayload extends JwtPayload {
  _id: string
  email: string
  role: string
}

export interface ErrorWithCode extends Error {
  code?: number
  status?: number
}

export type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>

export interface PaginationQuery {
  page?: number | string
  limit?: number | string
  sort?: string
  search?: string
  category?: string
  minPrice?: number | string
  maxPrice?: number | string
}
