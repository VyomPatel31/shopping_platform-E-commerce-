import mongoose, { Document, Schema, Model } from "mongoose";

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  items: IOrderItem[];
  address: {
    fullName: string;
    phone: string;
    city: string;
    state: string;
    pincode: string;
    addressLine1: string;
    addressLine2?: string;
  };
  totalAmount: number;
  paymentStatus: "pending" | "paid" | "failed";
  paymentMethod: "online" | "cod";
  orderStatus: "placed" | "shipped" | "delivered" | "cancelled";
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema= new mongoose.Schema(
     {
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  quantity: Number,
  price: Number,
}
)

const orderSchema: Schema<IOrder> = new mongoose.Schema(
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
    paymentMethod: {
      type: String,
      enum: ["online", "cod"],
      required: true,
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

const Order: Model<IOrder> = mongoose.model<IOrder>("Order", orderSchema);
export default Order;