import { Request, Response, NextFunction } from 'express'

interface ErrorWithCode extends Error {
  code?: number
  status?: number
}

export const errorHandler = (
  err: ErrorWithCode,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (process.env.NODE_ENV === 'development') {
    console.error(err)
  }

  const code = err?.code || err?.status || 500
  const message = err?.message || 'Internal Server Error'

  res.status(code).json({
    success: false,
    code,
    message,
  })
}

export default errorHandler
