import mongoose, { Document, Schema, Model } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description?: string;
  price: number;
  category?: string;
  brand?: string;
  stock: number;
  images: string[];
  rating: number;
  numReviews: number;
  isFeatured: boolean;
  isTrending: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema: Schema<IProduct> = new mongoose.Schema(
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

const Product: Model<IProduct> = mongoose.model<IProduct>("Product", productSchema);
export default Product;