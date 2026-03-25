import mongoose from "mongoose";

const orderItemSchema= new mongoose.Schema(
    
)

const orderSchema= new mongoose.Schema(
      {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    orderStatus: {
      type: String,
      enum: ["placed", "shipped", "delivered", "cancelled"],
      default: "placed",
    },

    razorpayOrderId: String,
    razorpayPaymentId: String,
  },
  { timestamps: true }

)

export default mongoose.model("Order", orderSchema);