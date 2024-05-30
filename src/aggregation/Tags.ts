import OwnerModel from "@/model/Owner";
import mongoose from "mongoose";

export async function getTagsInfoAggregate(ownerId: string) {
  return await OwnerModel.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(ownerId),
      },
    },
    {
      $lookup: {
        from: "taggroups",
        localField: "_id",
        foreignField: "church",
        as: "SubItems",
        pipeline: [
          {
            $lookup: {
              from: "tagitems",
              localField: "_id",
              foreignField: "tag_group",
              as: "SubItem",
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "tagitems",
        localField: "_id",
        foreignField: "church",
        as: "items",
      },
    },
    {
      $project: {
        _id: 0,
        "items._id": 1,
        "items.name": 1,
        "SubItems.SubItem._id" : 1,
        "SubItems.SubItem.name" : 1,
        "SubItems.name" : 1,
      },
    },
  ]);
}
