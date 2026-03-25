import mongoose, { Document, Schema } from 'mongoose'

interface ICartItem {
  product: mongoose.Types.ObjectId
  quantity: number
}

export interface ICart extends Document {
  user?: mongoose.Types.ObjectId
  sessionId?: string
  items: ICartItem[]
  createdAt: Date
  updatedAt: Date
}

const cartItemSchema = new Schema<ICartItem>({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  quantity: {
    type: Number,
    default: 1,
  },
})

const cartSchema = new Schema<ICart>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    sessionId: String,
    items: [cartItemSchema],
  },
  { timestamps: true }
)

export default mongoose.model<ICart>('Cart', cartSchema)
