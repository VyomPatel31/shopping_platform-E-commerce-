import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { matchedData } from 'express-validator'
import httpStatus from 'http-status'
import jwt from 'jsonwebtoken'
import otpGenerator from 'otp-generator'

import User from '../models/user.schema.js'
import buildErrorObject from '../utils/buildErrorObject.js'
import buildResponse from '../utils/buildResponse.js'
import decrypt from '../utils/decrypt.js'
import generateForgotToken from '../utils/generate-forgot-token.js'
import generateTokens from '../utils/generateTokens.js'
import handleError from '../utils/handleError.js'
import isIDGood from '../utils/isIDGood.js'

/**
 * SIGNUP
 */
export const signupController = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedReq = matchedData(req)

    const existingUser = await User.findOne({ email: validatedReq.email })

    if (existingUser) {
      throw buildErrorObject(httpStatus.CONFLICT, 'USER_ALREADY_EXISTS')
    }

    const hashedPassword = await bcrypt.hash(validatedReq.password, 10)

    await User.create({
      ...validatedReq,
      password: hashedPassword,
    })

    res.status(httpStatus.CREATED).json(
      buildResponse(httpStatus.CREATED, {
        message: 'User Created Successfully',
      })
    )
  } catch (err) {
    handleError(res, err)
  }
}

/**
 * LOGIN
 */
export const loginController = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedReq = matchedData(req)

    let user = await User.findOne({ email: validatedReq.email }).select('+password')

    if (!user) {
      throw buildErrorObject(httpStatus.UNAUTHORIZED, 'INVALID_CREDENTIALS')
    }

    const isMatch = await bcrypt.compare(validatedReq.password, user.password)

    if (!isMatch) {
      throw buildErrorObject(httpStatus.UNAUTHORIZED, 'INVALID_CREDENTIALS')
    }

    const { accessToken, refreshToken } = generateTokens(user.toObject() as any)

    res
      .cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: false, // true in production
        sameSite: 'lax',
      })
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
      })
      .status(httpStatus.OK)
      .json(buildResponse(httpStatus.OK, user))
  } catch (err) {
    handleError(res, err)
  }
}

/**
 * LOGOUT
 */
export const logoutController = async (req: Request, res: Response): Promise<void> => {
  try {
    res
      .clearCookie('accessToken')
      .clearCookie('refreshToken')
      .status(httpStatus.OK)
      .json(buildResponse(httpStatus.OK, { message: 'Logged out' }))
  } catch (err) {
    handleError(res, err)
  }
}

/**
 * SEND OTP
 */
export const sendOtpController = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedReq = matchedData(req)

    const existingUser = await User.findOne({ email: validatedReq.email })

    if (existingUser) {
      throw buildErrorObject(httpStatus.CONFLICT, 'USER_ALREADY_EXISTS')
    }

    const otp = otpGenerator.generate(4, {
      upperCaseAlphabets: false,
      specialChars: false,
    })

    const validTill = new Date(Date.now() + 30 * 60000)

    // Store OTP in cache or database (Verifications model would be needed)
    // For now, storing in session or memory
    req.session = req.session || {}
    ;(req.session as any)[validatedReq.email] = { otp, validTill }

    res.status(httpStatus.OK).json(
      buildResponse(httpStatus.OK, { message: 'OTP_SENT' })
    )
  } catch (err) {
    handleError(res, err)
  }
}

/**
 * VERIFY OTP
 */
export const verifyOtpController = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedReq = matchedData(req)

    const sessionData = (req.session as any)?.[validatedReq.email]

    if (!sessionData) {
      throw buildErrorObject(httpStatus.NOT_FOUND, 'OTP_NOT_FOUND')
    }

    if (new Date() > new Date(sessionData.validTill)) {
      throw buildErrorObject(httpStatus.GONE, 'OTP_EXPIRED')
    }

    if (sessionData.otp !== validatedReq.otp) {
      throw buildErrorObject(httpStatus.UNAUTHORIZED, 'INVALID_OTP')
    }

    delete (req.session as any)[validatedReq.email]

    res.status(httpStatus.OK).json(
      buildResponse(httpStatus.OK, { message: 'OTP_VERIFIED' })
    )
  } catch (err) {
    handleError(res, err)
  }
}

/**
 * GET ME
 */
export const getMeController = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id)

    res.status(httpStatus.OK).json(buildResponse(httpStatus.OK, user))
  } catch (err) {
    handleError(res, err)
  }
}

/**
 * REFRESH TOKEN
 */
export const refreshTokenController = async (req: Request, res: Response): Promise<void> => {
  try {
    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) {
      throw buildErrorObject(httpStatus.UNAUTHORIZED, 'NO_REFRESH_TOKEN')
    }

    const decrypted = decrypt(refreshToken)
    const decoded = jwt.verify(decrypted, process.env.REFRESH_SECRET as string) as any

    const user = await User.findById(decoded._id)

    if (!user) {
      throw buildErrorObject(httpStatus.UNAUTHORIZED, 'USER_NOT_FOUND')
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user.toObject() as any)

    res
      .cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
      })
      .cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
      })
      .status(httpStatus.OK)
      .json(buildResponse(httpStatus.OK, { message: 'Token refreshed' }))
  } catch (err) {
    handleError(res, err)
  }
}
