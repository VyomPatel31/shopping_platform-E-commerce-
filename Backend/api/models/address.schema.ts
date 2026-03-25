import mongoose, { Document, Schema, Model } from "mongoose";

export interface IAddress extends Document {
  user: mongoose.Types.ObjectId;
  fullName: string;
  phone: string;
  pincode: string;
  city: string;
  state: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const addressSchema: Schema<IAddress> = new mongoose.Schema(
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

const Address: Model<IAddress> = mongoose.model<IAddress>("Address", addressSchema);
export default Address;