import bcrypt from 'bcrypt'
import { matchedData } from 'express-validator'
import httpStatus from 'http-status'
import jwt from 'jsonwebtoken'
import otpGenerator from 'otp-generator'

import sendMail from '../helpers/sendMail.js'
import User from '../models/user.schema.js'
import Verifications from '../models/verification.schema.js'

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
export const signupController = async (req, res) => {
  try {
    req = matchedData(req)

    const existingUser = await User.findOne({ email: req.email })

    if (existingUser) {
      throw buildErrorObject(httpStatus.CONFLICT, 'USER_ALREADY_EXISTS')
    }

    const hashedPassword = await bcrypt.hash(req.password, 10)

    await User.create({
      ...req,
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
export const loginController = async (req, res) => {
  try {
    req = matchedData(req)

    let user = await User.findOne({ email: req.email }).select('+password')

    if (!user) {
      throw buildErrorObject(httpStatus.UNAUTHORIZED, 'INVALID_CREDENTIALS')
    }

    const isMatch = await bcrypt.compare(req.password, user.password)

    if (!isMatch) {
      throw buildErrorObject(httpStatus.UNAUTHORIZED, 'INVALID_CREDENTIALS')
    }

    const { accessToken, refreshToken } = generateTokens(user)

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
export const logoutController = async (req, res) => {
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
export const sendOtpController = async (req, res) => {
  try {
    req = matchedData(req)

    const existingUser = await User.findOne({ email: req.email })

    if (existingUser) {
      throw buildErrorObject(httpStatus.CONFLICT, 'USER_ALREADY_EXISTS')
    }

    const otp = otpGenerator.generate(4, {
      upperCaseAlphabets: false,
      specialChars: false,
    })

    const validTill = new Date(Date.now() + 30 * 60000)

    await Verifications.findOneAndUpdate(
      { email: req.email },
      { otp, validTill },
      { upsert: true }
    )

    await sendMail(req.email, 'otp.ejs', { otp })

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
export const verifyOtpController = async (req, res) => {
  try {
    req = matchedData(req)

    const verification = await Verifications.findOne({ email: req.email })

    if (!verification) {
      throw buildErrorObject(httpStatus.NOT_FOUND, 'OTP_NOT_FOUND')
    }

    if (verification.otp !== req.otp) {
      throw buildErrorObject(httpStatus.UNAUTHORIZED, 'INVALID_OTP')
    }

    res.status(httpStatus.OK).json(
      buildResponse(httpStatus.OK, {
        message: 'OTP_VERIFIED',
      })
    )
  } catch (err) {
    handleError(res, err)
  }
}

/**
 * FORGOT PASSWORD
 */
export const forgotPasswordController = async (req, res) => {
  try {
    req = matchedData(req)

    const user = await User.findOne({ email: req.email })

    if (!user) {
      return res.status(httpStatus.OK).json(
        buildResponse(httpStatus.OK, {
          message: 'EMAIL_SENT',
        })
      )
    }

    const token = generateForgotToken(user)

    await sendMail(req.email, 'forgot-password.ejs', {
      token,
    })

    res.status(httpStatus.OK).json(
      buildResponse(httpStatus.OK, {
        message: 'RESET_LINK_SENT',
      })
    )
  } catch (err) {
    handleError(res, err)
  }
}

/**
 * RESET PASSWORD
 */
export const resetPasswordController = async (req, res) => {
  try {
    req = matchedData(req)

    const decryptedToken = decrypt(req.forgotToken)

    let decoded

    try {
      decoded = jwt.verify(decryptedToken, process.env.FORGOT_SECRET)
    } catch {
      throw buildErrorObject(httpStatus.UNAUTHORIZED, 'TOKEN_EXPIRED')
    }

    const userId = await isIDGood(decoded._id)

    const hashedPassword = await bcrypt.hash(req.newPassword, 10)

    await User.findByIdAndUpdate(userId, {
      password: hashedPassword,
    })

    res.status(httpStatus.OK).json(
      buildResponse(httpStatus.OK, {
        message: 'PASSWORD_UPDATED',
      })
    )
  } catch (err) {
    handleError(res, err)
  }
}