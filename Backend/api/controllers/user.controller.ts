import { Request, Response } from 'express'
import User from '../models/user.schema.js'
import buildResponse from '../utils/buildResponse.js'
import handleError from '../utils/handleError.js'

// get profile
export const getProfileController = async (req: Request, res: Response) => {
  try {
    const user = await User.findById((req as any).user._id).select("-password")

    if (!user) {
      return res.status(404).json(buildResponse(404, { message: "User not found" }))
    }

    res.status(200).json(buildResponse(200, user))
  } catch (err: any) {
    handleError(res, err)
  }
}

// update profile
export const updateProfileController = async (req: Request, res: Response) => {
  try {
    const { name, phone } = req.body

    const user = await User.findByIdAndUpdate(
      (req as any).user._id,
      { name, phone },
      { returnDocument: 'after' }
    ).select("-password")

    if (!user) {
      return res.status(404).json(buildResponse(404, { message: "User not found" }))
    }

    res.status(200).json(buildResponse(200, user))
  } catch (err: any) {
    handleError(res, err)
  }
}

// change password (authenticated)
export const updatePasswordController = async (req: Request, res: Response) => {
  try {
    res.status(501).json(buildResponse(501, { message: "Not implemented yet" }))
  } catch (err: any) {
    handleError(res, err)
  }
}
