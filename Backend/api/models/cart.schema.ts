import mongoose, { Document, Schema, Model } from "mongoose";

export interface ICartItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
}

export interface ICart extends Document {
  user?: mongoose.Types.ObjectId;
  sessionId?: string;
  items: ICartItem[];
  createdAt: Date;
  updatedAt: Date;
}

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  quantity: {
    type: Number,
    default: 1,
  },
})

const cartSchema: Schema<ICart> = new mongoose.Schema(
    {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    sessionId: String, // guest cart

    items: [cartItemSchema],
  },
  { timestamps: true }
)

const Cart: Model<ICart> = mongoose.model<ICart>("Cart", cartSchema);
export default Cart;