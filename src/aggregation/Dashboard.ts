import OwnerModel from "@/model/Owner";
import mongoose from "mongoose";

export async function GetDashboardInfoForOwner(ownerId: string) {
  return await OwnerModel.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(ownerId),
      },
    },
    {
      $lookup: {
        from: "events",
        localField: "_id",
        foreignField: "owner",
        as: "Events",
        pipeline: [
          {
            $redact: {
              $cond: {
                if: {
                  $and: [
                    {
                      $gte: ["$date_day", new Date().getDate()],
                    },
                    {
                      $gte: ["$date_month", new Date().getMonth()],
                    },
                    {
                      $gte: ["$date_year", new Date().getFullYear()],
                    },
                  ],
                },
                then: "$$KEEP",
                else: "$$PRUNE",
              },
            },
          },
        ],
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
            $redact: {
              $cond: {
                if: {
                  $gte: [
                    "$createdAt",
                    new Date(new Date().setDate(new Date().getDate() - 7)),
                  ],
                },
                then: "$$KEEP",
                else: "$$PRUNE",
              },
            },
          },
        ],
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
        name: 1,
        image: 1,
        PeopleCount: 1,
        "Events.name": 1,
        "Events.date_day": 1,
        "Events.date_month": 1,
        "Events.date_year": 1,
        "Events.time": 1,
      },
    },
  ]);
}

export async function GetDashboardInfoForUser(
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
          {
            $lookup: {
              from: "tagjoineds",
              localField: "_id",
              foreignField: "people",
              as: "Tags",
              pipeline: [
                {
                  $lookup: {
                    from: "events",
                    localField: "tag_item",
                    foreignField: "tag",
                    as: "Events",
                  },
                },
                {
                  $unwind: "$Events",
                },

                // {
                //   $lookup: {
                //     from: "tagitems",
                //     localField: "tag_item",
                //     foreignField: "_id",
                //     as: "Tag_Info",
                //     pipeline: [
                //       {
                //         $lookup: {
                //           from: "events",
                //           localField: "_id",
                //           foreignField: "tag",
                //           as: "Events",
                //         },
                //       },
                //     ],
                //   },
                // },
              ],
            },
          },
        ],
      },
    },
    {
      $addFields: {
        People: {
          $first: "$Peoples",
        },
      },
    },
    {
      $addFields: {
        Events: "$People.Tags.Events",
      },
    },
    {
      $project: {
        name: 1,
        image: 1,
        "Events.name": 1,
        "Events.date_day": 1,
        "Events.date_month": 1,
        "Events.date_year": 1,
        "Events.time": 1,
      },
    },
  ]);
}

// {
//     $lookup: {
//       from: "events",
//       localField: "_id",
//       foreignField: "owner",
//       as: "Events",
//       pipeline: [
//         {
//           $redact: {
//             $cond: {
//               if: {
//                 $and: [
//                   {
//                     $gte: ["$date_day", new Date().getDate()],
//                   },
//                   {
//                     $gte: ["$date_month", new Date().getMonth()],
//                   },
//                   {
//                     $gte: ["$date_year", new Date().getFullYear()],
//                   },
//                 ],
//               },
//               then: "$$KEEP",
//               else: "$$PRUNE",
//             },
//           },
//         },
//       ],
//     },
//   },
