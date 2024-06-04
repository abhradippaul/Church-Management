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
        "SubItems.SubItem._id": 1,
        "SubItems.SubItem.name": 1,
        "SubItems.name": 1,
        "SubItems._id": 1,
      },
    },
  ]);
}

export async function isChurchAndTagValid(ownerId: string, tagId: string) {
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
        ],
      },
    },
    {
      $addFields: {
        isInTag_Group: {
          $cond: {
            if: {
              $in: [
                new mongoose.Types.ObjectId(tagId),
                "$Tag_Group.Tag_Item._id",
              ],
            },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $lookup: {
        from: "tagitems",
        localField: "_id",
        foreignField: "church",
        as: "Tag_Item",
      },
    },
    {
      $addFields: {
        isInTag_Item: {
          $cond: {
            if: {
              $in: [new mongoose.Types.ObjectId(tagId), "$Tag_Item._id"],
            },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        isInTag_Group: 1,
        isInTag_Item: 1,
      },
    },
  ]);
}

export async function getSpecificTagInfoAggregate(
  ownerId: string,
  tagId: string
) {
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
        as: "Tag_Info",
        pipeline: [
          {
            $lookup: {
              from: "tagjoineds",
              localField: "_id",
              foreignField: "tag_item",
              as: "Tag_Joined",
              pipeline: [
                {
                  $lookup: {
                    from: "peoples",
                    localField: "people",
                    foreignField: "_id",
                    as: "People_Info",
                  },
                },
                {
                  $addFields: {
                    People_Info: {
                      $first: "$People_Info",
                    },
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      $addFields: {
        People_Info: {
          $first: "$Tag_Info.Tag_Joined.People_Info",
        },
      },
    },
    {
      $addFields: {
        Tag_Info: {
          $first: "$Tag_Info",
        },
      },
    },
    {
      $project: {
        _id: 0,
        "Tag_Info._id": 1,
        "Tag_Info.name": 1,
        "People_Info._id": 1,
        "People_Info.name": 1,
        "People_Info.email": 1,
        "People_Info.image": 1,
        "People_Info.date_of_birth": 1,
      },
    },
  ]);
}
