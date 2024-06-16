import AdminModel from "@/model/Admin";
import OwnerModel from "@/model/Owner";
import mongoose from "mongoose";

interface VerifiedDataValue {
  role: "admin" | "owner" | "people";
  adminId?: string;
  ownerId: string;
  peopleId?: string;
}

export async function getTagsInfoAggregate({
  role,
  adminId,
  ownerId,
  peopleId,
}: VerifiedDataValue) {
  async function modelAggregate() {
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
          pipeline: [
            {
              $redact: {
                $cond: {
                  if: {
                    $gt: ["$tag_group", null],
                  },
                  then: "$$PRUNE",
                  else: "$$KEEP",
                },
              },
            },
          ],
        },
      },
      {
        $project: {
          _id: 0,
          name: 1,
          image: 1,
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
  if (role === "admin") {
    if (!adminId || !ownerId) return [];

    const isAdminExist = await AdminModel.findOne({ _id: adminId }, { _id: 1 });
    if (!isAdminExist) return [];
    return await modelAggregate();
  } else if (role === "owner") {
    if (!ownerId) return [];

    return await modelAggregate();
  } else if (role === "people") {
  } else {
    return [];
  }
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
        from: "tagitems",
        localField: "_id",
        foreignField: "church",
        as: "Tag_Item",
      },
    },
    {
      $addFields: {
        isTagExist: {
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
        isTagExist: 1,
      },
    },
  ]);
}

export async function getSpecificTagInfoAggregate(
  { ownerId, role, adminId, peopleId }: VerifiedDataValue,
  tagId: string
) {
  async function modelAggregate() {
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
              $match: {
                _id: new mongoose.Types.ObjectId(tagId),
              },
            },
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

  if (role === "admin") {
    if (!adminId || !ownerId) return [];

    const isAdminExist = await AdminModel.findOne({ _id: adminId }, { _id: 1 });
    if (!isAdminExist) return [];
    return await modelAggregate();
  } else if (role === "owner") {
    if (!ownerId) return [];

    return await modelAggregate();
  } else if (role === "people") {
  } else {
    return [];
  }
}
