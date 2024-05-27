import { Schema, model, models, Model, Types } from "mongoose";

export interface TagsGroupInterfaceValue extends Document {
  name: string;
  church: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const TagsGroupSchema = new Schema<TagsGroupInterfaceValue>(
  {
    name: {
      type: String,
      required: true,
    },
    church: {
      type: Schema.Types.ObjectId,
      ref: "Owner",
      required: true,
    },
  },
  { timestamps: true }
);

const TagsGroupModel =
  (models.TagsGroup as Model<TagsGroupInterfaceValue>) ||
  model<TagsGroupInterfaceValue>("TagsGroup", TagsGroupSchema);

export default TagsGroupModel;
