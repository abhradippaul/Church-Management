import OwnerModel from "@/model/Owner";
import mongoose from "mongoose";

export async function getTagsInfoFromEventsAggregate(ownerId: string) {
  return await OwnerModel.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(ownerId),
      },
    },
    {
      $lookup: {
        from: "tagitems",
        localField: "_id",
        foreignField: "church",
        as: "Tags_Item",
      },
    },
    {
      $lookup: {
        from: "taggroups",
        localField: "_id",
        foreignField: "church",
        as: "Tag_Group",
        pipeline: [
          {
            $lookup: {
              from: "tagitems",
              localField: "_id",
              foreignField: "tag_group",
              as: "Tag_Item",
            },
          },
          {
            $unwind: "$Tag_Item",
          },
        ],
      },
    },
    {
      $project: {
        _id: 0,
        "Tags_Item._id": 1,
        "Tags_Item.name": 1,
        "Tag_Group.Tag_Item._id": 1,
        "Tag_Group.Tag_Item.name": 1,
      },
    },
  ]);
}
