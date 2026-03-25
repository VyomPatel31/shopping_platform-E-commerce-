import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import { matchedData } from 'express-validator'
import httpStatus from 'http-status'
import jwt from 'jsonwebtoken'
import otpGenerator from 'otp-generator'

import sendMail from '../helpers/sendMail.js'
import User from '../models/user.schema.js'
import Verifications from "../models/verification.schema.js"

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
export const signupController = async (req: Request, res: Response) => {
  try {
    const data = req.body
    console.log('Signup attempt for:', data.email)

    // Check if email is admin email and set role accordingly
    const adminEmails = ['admin123@gmail.com', 'patelvyom734@gmail.com'];
    const isAdminEmail = adminEmails.includes(data.email.toLowerCase().trim());
    const role = isAdminEmail ? 'admin' : 'user';
    console.log('Assigning role:', role, 'for email:', data.email);

    let user = await User.findOne({ email: data.email })

    if (user?.isVerified) {
      console.log('User already exists and is verified:', data.email)
      throw buildErrorObject(httpStatus.CONFLICT, 'USER_ALREADY_EXISTS')
    }

    const hashedPassword = await bcrypt.hash(data.password, 10)

    if (!user) {
      // Create new unverified user
      user = await User.create({
        ...data,
        password: hashedPassword,
        role: role,
        isVerified: false,
      })

    } else {
      // Update existing unverified user (effectively a password reset/resend)
      user.password = hashedPassword
      user.role = role
      await user.save()
      console.log('Updated existing unverified user:', data.email, 'with role:', role)
    }

    // Generate and send OTP
    const otp = otpGenerator.generate(4, {
      upperCaseAlphabets: false,
      specialChars: false,
    })
    console.log('Generated OTP:', otp)
    // ALWAYS log OTP for easier local testing during evaluations
    console.log('================================================')
    console.log(`🔑 DEV MODE OTP for ${data.email}: ${otp}`)
    console.log('================================================')

    const validTill = new Date(Date.now() + 30 * 60000)

    await Verifications.findOneAndUpdate(
      { email: data.email },
      { otp, validTill },
      { upsert: true }
    )
    console.log('Verification record updated for signup')

    try {
      await sendMail(data.email, 'otp.ejs', { otp })
      console.log('Signup OTP email sent successfully')
    } catch (mailError) {
      console.error('Error sending signup OTP email:', mailError)
      if (process.env.NODE_ENV === 'production') {
        throw mailError
      }
      console.log('--- DEVELOPMENT MODE: BYPASSING EMAIL ERROR ---')
      console.log('Signup OTP for test:', otp)
      console.log('-------------------------------------------')
    }

    res.status(httpStatus.CREATED).json(
      buildResponse(httpStatus.CREATED, {
        message: 'USER_CREATED_VERIFY_EMAIL',
        email: data.email,
        isVerified: false,
        devOtp: otp,
        mailNote: 'If email fail to arrive, check your terminal for OTP.'
      })
    )
  } catch (err: any) {
    handleError(res, err)
  }
}

/**
 * LOGIN
 */
export const loginController = async (req: Request, res: Response) => {
  try {
    const data = req.body

    const user: any = await User.findOne({ email: data.email }).select('+password').lean();

    if (!user) {
      console.log('User not found:', data.email)
      throw buildErrorObject(httpStatus.UNAUTHORIZED, 'INVALID_CREDENTIALS')
    }

    if (!user.isVerified) {
      console.log('User not verified:', data.email)
      throw buildErrorObject(httpStatus.UNAUTHORIZED, 'EMAIL_NOT_VERIFIED')
    }

    const isMatch = await bcrypt.compare(data.password, user.password)

    if (!isMatch) {
      throw buildErrorObject(httpStatus.UNAUTHORIZED, 'INVALID_CREDENTIALS')
    }


    const safeUser = {
      _id: user._id.toString(),
      email: user.email,
      role: user.role || "user",
    }

    const { accessToken, refreshToken } = generateTokens(safeUser)

    delete user.password

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
      .json(buildResponse(httpStatus.OK, { 
        ...user, 
        accessToken, 
        refreshToken 
      }))
  } catch (err: any) {
    handleError(res, err)
  }
}

/**
 * LOGOUT
 */
export const logoutController = async (req: Request, res: Response) => {
  try {
    res
      .clearCookie('accessToken')
      .clearCookie('refreshToken')
      .status(httpStatus.OK)
      .json(buildResponse(httpStatus.OK, { message: 'Logged out' }))
  } catch (err: any) {
    handleError(res, err)
  }
}

/**
 * SEND OTP
 */
export const sendOtpController = async (req: Request, res: Response) => {
  try {
    const data = req.body
    console.log('Sending OTP to:', data.email)

    const existingUser = await User.findOne({ email: data.email })

    if (existingUser?.isVerified) {
      throw buildErrorObject(httpStatus.CONFLICT, 'USER_ALREADY_EXISTS')
    }

    // if (existingUser) {
    //   console.log('User already exists:', data.email)
    //   throw buildErrorObject(httpStatus.CONFLICT, 'USER_ALREADY_EXISTS')
    // }

    const otp = otpGenerator.generate(4, {
      upperCaseAlphabets: false,
      specialChars: false,
    })
    console.log('Generated OTP:', otp)

    const validTill = new Date(Date.now() + 30 * 60000)

    await Verifications.findOneAndUpdate(
      { email: data.email },
      { otp, validTill },
      { upsert: true }
    )
    console.log('Verification record updated')

    try {
      await sendMail(data.email, 'otp.ejs', { otp })
      console.log('OTP email sent successfully')
    } catch (mailError) {
      console.error('Error sending OTP email:', mailError)
      if (process.env.NODE_ENV === 'production') {
        throw mailError
      }
      console.log('--- DEVELOPMENT MODE: BYPASSING EMAIL ERROR ---')
      console.log('OTP for test:', otp)
      console.log('-------------------------------------------')
    }

    res.status(httpStatus.OK).json(
      buildResponse(httpStatus.OK, { message: 'OTP_SENT' })
    )
  } catch (err: any) {
    handleError(res, err)
  }
}

/**
 * VERIFY OTP
 */
export const verifyOtpController = async (req: Request, res: Response) => {
  try {
    const data = req.body
    console.log('Verifying OTP for:', data.email)

    const verification: any = await Verifications.findOne({ email: data.email })

    if (!verification) {
      console.log('OTP record not found for:', data.email)
      throw buildErrorObject(httpStatus.NOT_FOUND, 'OTP_NOT_FOUND')
    }

    console.log('Stored OTP:', verification.otp, 'Provided OTP:', data.otp)

    // Check if OTP is expired
    if (new Date() > verification.validTill) {
      console.log('OTP expired for:', data.email)
      throw buildErrorObject(httpStatus.UNAUTHORIZED, 'OTP_EXPIRED')
    }

    // String-safe comparison
    if (verification.otp.toString() !== data.otp.toString()) {
      console.log('Invalid OTP provided for:', data.email)
      throw buildErrorObject(httpStatus.UNAUTHORIZED, 'INVALID_OTP')
    }

    console.log('OTP verified successfully')

    // Mark user as verified
    await User.findOneAndUpdate({ email: data.email }, { isVerified: true })
    console.log('User status updated to verified:', data.email)

    // Optional: Delete verification record after success
    await Verifications.deleteOne({ email: data.email })

    res.status(httpStatus.OK).json(
      buildResponse(httpStatus.OK, {
        message: 'EMAIL_VERIFIED',
      })
    )
  } catch (err: any) {
    handleError(res, err)
  }
}

/**
 * FORGOT PASSWORD
 */
export const forgotPasswordController = async (req: Request, res: Response) => {
  try {
    const data = req.body

    const user = await User.findOne({ email: data.email })

    if (!user) {
      return res.status(httpStatus.OK).json(
        buildResponse(httpStatus.OK, {
          message: 'EMAIL_SENT',
        })
      )
    }

    // Generate and send OTP for password reset
    const otp = otpGenerator.generate(4, {
      upperCaseAlphabets: false,
      specialChars: false,
    })
    
    console.log('Password Reset OTP:', otp)
    // Log for easier dev testing
    console.log('================================================')
    console.log(`🔑 PASSWORD RESET PIN for ${data.email}: ${otp}`)
    console.log('================================================')

    const validTill = new Date(Date.now() + 30 * 60000)

    await Verifications.findOneAndUpdate(
      { email: data.email },
      { otp, validTill },
      { upsert: true }
    )

    try {
      await sendMail(data.email, 'otp.ejs', { otp })
      console.log('Reset PIN email sent successfully')
    } catch (mailError) {
      console.error('Error sending reset PIN email:', mailError)
      if (process.env.NODE_ENV === 'production') {
        throw mailError
      }
    }

    res.status(httpStatus.OK).json(
      buildResponse(httpStatus.OK, {
        message: 'RESET_PIN_SENT',
        email: data.email,
        devOtp: otp
      })
    )
  } catch (err: any) {
    handleError(res, err)
  }
}

/**
 * RESET PASSWORD
 */
export const resetPasswordController = async (req: Request, res: Response) => {
  try {
    const data = req.body
    
    // data should contain email, token (otp), and newPassword
    const verification: any = await Verifications.findOne({ email: data.email })

    if (!verification) {
      throw buildErrorObject(httpStatus.NOT_FOUND, 'RESET_PIN_NOT_FOUND')
    }

    if (new Date() > verification.validTill) {
      throw buildErrorObject(httpStatus.UNAUTHORIZED, 'PIN_EXPIRED')
    }

    if (verification.otp.toString() !== data.forgotToken.toString()) {
      throw buildErrorObject(httpStatus.UNAUTHORIZED, 'INVALID_PIN')
    }

    const hashedPassword = await bcrypt.hash(data.newPassword, 10)

    await User.findOneAndUpdate({ email: data.email }, {
      password: hashedPassword,
    })

    // Clean up
    await Verifications.deleteOne({ email: data.email })

    res.status(httpStatus.OK).json(
      buildResponse(httpStatus.OK, {
        message: 'PASSWORD_UPDATED',
      })
    )
  } catch (err: any) {
    handleError(res, err)
  }
}
