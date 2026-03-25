import mongoose, { Document, Schema } from 'mongoose'

export interface IProduct extends Document {
  name: string
  description: string
  price: number
  category: string
  brand: string
  stock: number
  images: string[]
  rating: number
  numReviews: number
  isFeatured: boolean
  isTrending: boolean
  createdAt: Date
  updatedAt: Date
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    category: String,
    brand: String,
    stock: { type: Number, default: 0 },
    images: [String],
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isTrending: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export default mongoose.model<IProduct>('Product', productSchema)
