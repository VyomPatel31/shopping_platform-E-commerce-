import { Request, Response } from 'express'
import Razorpay from "razorpay"
import buildResponse from '../utils/buildResponse.js'
import handleError from '../utils/handleError.js'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export const createOrderController = async (req: Request, res: Response) => {
  try {
    const { amount } = req.body

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
    })

    res.status(200).json(buildResponse(200, order))
  } catch (err: any) {
    handleError(res, err)
  }
}