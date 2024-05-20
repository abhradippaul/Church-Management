import { Schema, model, Document, models, Model } from "mongoose";

export interface OwnerInterfaceValue extends Document {
  email: string;
  password: string;
  name: string;
  image: string;
  refresh_token: string;
  is_verified: boolean;
  verify_code: string;
  verify_expiry: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OwnerSchema = new Schema<OwnerInterfaceValue>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    is_verified: {
      type: Boolean,
      default: false,
    },
    refresh_token: {
      type: String,
    },
    verify_code: {
      type: String,
    },
    verify_expiry: {
      type: Date,
    },
  },
  { timestamps: true }
);

const OwnerModel =
  (models.Owner as Model<OwnerInterfaceValue>) ||
  model<OwnerInterfaceValue>("Owner", OwnerSchema);

export default OwnerModel;
