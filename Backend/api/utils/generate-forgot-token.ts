import jwt from 'jsonwebtoken'
import encrypt from './encrypt.js'

const generateForgotToken = (user: any = {}) => {
  return encrypt(
    jwt.sign(user, process.env.FORGOT_SECRET!, {
      expiresIn: process.env.FORGOT_EXPIRATION as any,
    })
  )
}

export default generateForgotToken