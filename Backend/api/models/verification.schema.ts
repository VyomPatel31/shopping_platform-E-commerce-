import mongoose, { Document, Schema } from 'mongoose'

export interface IVerification extends Document {
  email: string
  otp: string
  validTill: Date
}

const VerificationSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    otp: {
      type: String,
      required: true,
    },
    validTill: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

export default mongoose.model<IVerification>('Verification', VerificationSchema)
