import mongoose from "mongoose";

const addressSchema= new mongoose.Schema(
    {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    fullName: String,
    phone: String,
    pincode: String,
    city: String,
    state: String,
    addressLine1: String,
    addressLine2: String,
    landmark: String,

    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

export default mongoose.model("Address", addressSchema);