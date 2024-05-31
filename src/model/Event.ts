import { Schema, model, Document, Types, models, Model } from "mongoose";

export interface EventInterfaceValue extends Document {
  name: string;
  tag: Types.ObjectId;
  owner: Types.ObjectId;
  date: string;
  time: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<EventInterfaceValue>(
  {
    name: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "Owner",
      required: true,
    },
    tag: {
      type: Schema.Types.ObjectId,
      ref: "TagItem",
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const EventModel =
  (models.Event as Model<EventInterfaceValue>) ||
  model<EventInterfaceValue>("Event", EventSchema);

export default EventModel;
