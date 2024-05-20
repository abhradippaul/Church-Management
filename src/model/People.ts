import { Schema, model, Document } from "mongoose";

export interface PeopleInterfaceValue extends Document {
  email: string;
  password: string;
  name: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

const PeopleSchema = new Schema<PeopleInterfaceValue>(
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
  },
  { timestamps: true }
);

const PeopleModel = model("People", PeopleSchema);
