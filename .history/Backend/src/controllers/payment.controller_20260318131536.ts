import { Request, Response } from 'express'
import Razorpay from 'razorpay'
import buildResponse from '../utils/buildResponse.js'
import handleError from '../utils/handleError.js'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
})

export const createPaymentController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { amount } = req.body

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: 'INR',
    })

    res.status(200).json(buildResponse(200, order))
  } catch (err) {
    handleError(res, err)
  }
}

export const verifyPaymentController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body

    const crypto = require('crypto')
    const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET as string)
    shasum.update(
      JSON.stringify({ order_id: razorpay_order_id, payment_id: razorpay_payment_id })
    )
    const digest = shasum.digest('hex')

    if (digest !== razorpay_signature) {
      res.status(400).json(buildResponse(400, { message: 'Payment verification failed' }))
      return
    }

    res.status(200).json(buildResponse(200, { message: 'Payment verified successfully' }))
  } catch (err) {
    handleError(res, err)
  }
}
