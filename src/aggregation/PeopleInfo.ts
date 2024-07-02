import AdminModel from "@/model/Admin";
import OwnerModel from "@/model/Owner";
import mongoose from "mongoose";

interface VerifiedDataValue {
  role: "admin" | "owner" | "people";
  adminId?: string;
  ownerId: string;
  peopleId?: string;
}

// export async function getPeopleInfoAggregate(
//   { role, adminId, ownerId, peopleId }: VerifiedDataValue,
//   userId: string
// ) {
//   async function peopleAggregate() {
//     return await OwnerModel.aggregate([
//       {
//         $match: {
//           _id: new mongoose.Types.ObjectId(ownerId),
//         },
//       },
//       {
//         $lookup: {
//           from: "peoples",
//           localField: "_id",
//           foreignField: "church",
//           as: "Peoples",
//           pipeline: [
//             {
//               $match: {
//                 _id: new mongoose.Types.ObjectId(userId),
//               },
//             },
//           ],
//         },
//       },
//       {
//         $addFields: {
//           PeopleInfo: {
//             $first: "$Peoples",
//           },
//         },
//       },
//       {
//         $project: {
//           _id: 0,
//           "PeopleInfo._id": 1,
//           "PeopleInfo.email": 1,
//           "PeopleInfo.name": 1,
//           "PeopleInfo.phone_number": 1,
//           "PeopleInfo.gender": 1,
//           "PeopleInfo.address": 1,
//           "PeopleInfo.date_of_birth": 1,
//           "PeopleInfo.image": 1,
//         },
//       },
//     ]);
//   }

//   if (role !== "people") {
//     if (role === "admin" && adminId) {
//       const isAdmin = await AdminModel.findOne({ _id: adminId }, { _id: 1 });
//       if (!isAdmin) {
//         return [];
//       }
//       return await peopleAggregate();
//     }
//     return await peopleAggregate();
//   } else if (role === "people") {
//     if (peopleId === userId) {
//       return await peopleAggregate();
//     } else {
//       return [];
//     }
//   } else {
//     return [];
//   }
// }

export async function getPeopleInfoAggregateForOwner (ownerId: string, userId: string) {
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
              _id: new mongoose.Types.ObjectId(userId),
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
