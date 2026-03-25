import mongoose, { Document, Schema } from 'mongoose'

export interface IReview extends Document {
  user: mongoose.Types.ObjectId
  product: mongoose.Types.ObjectId
  rating: number
  comment?: string
  createdAt: Date
  updatedAt: Date
}

const reviewSchema = new Schema<IReview>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    rating: {
      type: Number,
      required: true,
    },
    comment: String,
  },
  { timestamps: true }
)

export default mongoose.model<IReview>('Review', reviewSchema)
