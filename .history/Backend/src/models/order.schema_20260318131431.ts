import mongoose, { Document, Schema } from 'mongoose'

interface IOrderItem {
  product: mongoose.Types.ObjectId
  quantity: number
  price: number
}

interface IOrderAddress {
  fullName: string
  phone: string
  city: string
  state: string
  pincode: string
  addressLine1: string
  addressLine2?: string
}

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId
  items: IOrderItem[]
  address: IOrderAddress
  totalAmount: number
  paymentStatus: 'pending' | 'paid' | 'failed'
  orderStatus: 'placed' | 'shipped' | 'delivered' | 'cancelled'
  razorpayOrderId?: string
  razorpayPaymentId?: string
  createdAt: Date
  updatedAt: Date
}

const orderItemSchema = new Schema<IOrderItem>({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  quantity: Number,
  price: Number,
})

const orderSchema = new Schema<IOrder>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    items: [orderItemSchema],
    address: {
      fullName: String,
      phone: String,
      city: String,
      state: String,
      pincode: String,
      addressLine1: String,
      addressLine2: String,
    },
    totalAmount: Number,
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    orderStatus: {
      type: String,
      enum: ['placed', 'shipped', 'delivered', 'cancelled'],
      default: 'placed',
    },
    razorpayOrderId: String,
    razorpayPaymentId: String,
  },
  { timestamps: true }
)

export default mongoose.model<IOrder>('Order', orderSchema)
