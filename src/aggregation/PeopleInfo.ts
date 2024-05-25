import OwnerModel from "@/model/Owner";
import mongoose from "mongoose";

export async function getPeopleInfoAggregate(
  ownerId: string,
  peopleId: string
) {
  return await OwnerModel.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(ownerId),
      },
    },
    {
      $lookup: {
        from: "peoples",
        localField: "_id",
        foreignField: "church",
        as: "Peoples",
        pipeline: [
          {
            $match: {
              _id: new mongoose.Types.ObjectId(peopleId),
            },
          },
        ],
      },
    },
    {
      $addFields: {
        PeopleInfo: {
          $first: "$Peoples",
        },
      },
    },
    {
      $project: {
        _id: 0,
        "PeopleInfo._id": 1,
        "PeopleInfo.email": 1,
        "PeopleInfo.name": 1,
        "PeopleInfo.phone_number": 1,
        "PeopleInfo.gender": 1,
        "PeopleInfo.address": 1,
        "PeopleInfo.date_of_birth": 1,
        "PeopleInfo.image": 1,
      },
    },
  ]);
}
