import mongoose from "mongoose";

const CartSchema= new mongoose.Schema(
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

export default mongoose.model("Cart", CartSchema)