import { Request, Response, NextFunction } from 'express'
import handleError from '../utils/handleError.js'

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  handleError(res, err)
}

export default errorHandler
