import jwt from 'jsonwebtoken'
import encrypt from './encrypt.js'
import { AuthTokenPayload } from '../types/index.d.js'

interface TokenResponse {
  accessToken: string
  refreshToken: string
}

const generateAuthToken = (user: AuthTokenPayload = {} as AuthTokenPayload): string => {
  return encrypt(
    jwt.sign(user, process.env.AUTH_SECRET as string, {
      expiresIn: process.env.AUTH_EXPIRATION,
    })
  )
}

const generateRefreshToken = (user: AuthTokenPayload = {} as AuthTokenPayload): string => {
  return encrypt(
    jwt.sign(user, process.env.REFRESH_SECRET as string, {
      expiresIn: process.env.REFRESH_EXPIRATION,
    })
  )
}

const generateTokens = (user: AuthTokenPayload = {} as AuthTokenPayload): TokenResponse => {
  const accessToken = generateAuthToken(user)
  const refreshToken = generateRefreshToken(user)

  return { accessToken, refreshToken }
}

export default generateTokens
global.generateTokens = generateTokens
