import mongoose, { Document, Schema, Model } from "mongoose";

export interface IReview extends Document {
  user: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  order?: mongoose.Types.ObjectId;
  rating: number;
  comment?: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema: Schema<IReview> = new mongoose.Schema(
   {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },

    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },

    rating: {
      type: Number,
      required: true,
    },

    comment: String,
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
)

const Review: Model<IReview> = mongoose.model<IReview>("Review", reviewSchema);
export default Review;