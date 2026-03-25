import jwt from 'jsonwebtoken'
import encrypt from './encrypt.js'
import { AuthTokenPayload } from '../types/index.d.js'

const generateForgotToken = (user: AuthTokenPayload = {} as AuthTokenPayload): string => {
  return encrypt(
    jwt.sign(user, process.env.FORGOT_SECRET as string, {
      expiresIn: process.env.FORGOT_EXPIRATION,
    })
  )
}

export default generateForgotToken
global.generateForgotToken = generateForgotToken
