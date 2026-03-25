import { Response } from 'express'
import { ErrorWithCode } from '../types/index.d.js'

const handleError = (res: Response, err: unknown): void => {
  if (process.env.NODE_ENV === 'development') {
    console.log(err)
  }

  const response: any = {
    success: false,
    code: 500,
    message: 'SOMETHING_WENT_WRONG',
  }

  if (err instanceof Error && err.message) {
    response.message = err.message
  }

  const errorWithCode = err as ErrorWithCode
  if (errorWithCode?.code && errorWithCode.code <= 500) {
    response.code = errorWithCode.code
  }

  res.status(response.code).json(response)
}

export default handleError
