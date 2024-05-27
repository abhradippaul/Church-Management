import { Schema, model, models, Model, Types } from "mongoose";

export interface TagsItemInterfaceValue extends Document {
  name: string;
  tags_group: Types.ObjectId;
  church: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const TagsItemSchema = new Schema<TagsItemInterfaceValue>(
  {
    name: {
      type: String,
      required: true,
    },
    church: {
      type: Schema.Types.ObjectId,
      ref: "Owner",
    },
    tags_group: {
      type: Schema.Types.ObjectId,
      ref: "TagsGroup",
    },
  },
  { timestamps: true }
);

const TagsItemModel =
  (models.TagsItem as Model<TagsItemInterfaceValue>) ||
  model<TagsItemInterfaceValue>("TagsItem", TagsItemSchema);

export default TagsItemModel;
