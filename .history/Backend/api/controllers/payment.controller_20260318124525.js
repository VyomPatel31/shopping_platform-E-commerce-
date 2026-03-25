import Razorpay from "razorpay"

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
})

export const createOrderController = async (req, res) => {
  try {
    const { amount } = req.body

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
    })

    res.status(200).json(buildResponse(200, order))
  } catch (err) {
    handleError(res, err)
  }
}