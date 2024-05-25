import OwnerModel from "@/model/Owner";
import mongoose from "mongoose";

export async function isPeopleExistAggregate(userId: string, peopleId: string) {
  return await OwnerModel.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(userId) },
    },
    {
      $lookup: {
        from: "peoples",
        localField: "_id",
        foreignField: "church",
        as: "Peoples",
      },
    },
    {
      $addFields: {
        isValid: {
          $cond: {
            if: {
              $in: [new mongoose.Types.ObjectId(peopleId), "$Peoples._id"],
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
        isValid: 1,
      },
    },
  ]);
}

export async function peopleDetailsAggregate(userId: string) {
  return await OwnerModel.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "peoples",
        localField: "_id",
        foreignField: "church",
        as: "Peoples",
      },
    },
    {
      $addFields: {
        PeopleCount: {
          $size: "$Peoples",
        },
      },
    },
    {
      $project: {
        _id: 0,
        "Peoples._id": 1,
        "Peoples.name": 1,
        "Peoples.date_of_birth": 1,
        "Peoples.email": 1,
        "Peoples.image": 1,
        PeopleCount: 1,
      },
    },
  ]);
}