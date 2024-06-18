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
      $project: {
        _id: 0,
        "Tags_Item._id": 1,
        "Tags_Item.name": 1,
      },
    },
  ]);
}

export async function GetEventsInfoForOwnerAggregate(
  ownerId: string,
  month: number
) {
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
                    { $eq: ["$date_month", month] },
                    { $eq: ["$date_year", new Date().getFullYear()] },
                  ],
                },
                then: "$$KEEP",
                else: "$$PRUNE",
              },
            },
          },
          {
            $lookup: {
              from: "tagitems",
              localField: "tag",
              foreignField: "_id",
              as: "Tag_Info",
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
            $addFields: {
              Tag_Name: "$Tag_Info.name",
            },
          },
          {
            $addFields: {
              Tag_Id: "$Tag_Info._id",
            },
          },
        ],
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
        "Events.description": 1,
        "Events.time": 1,
        "Events._id": 1,
        "Events.Tag_Name": 1,
        "Events.Tag_Id": 1,
      },
    },
  ]);
}

export async function GetEventsInfoForPeopleAggregate(
  ownerId: string,
  peopleId: string,
  month: number
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
                    pipeline: [
                      {
                        $redact: {
                          $cond: {
                            if: {
                              $and: [
                                { $eq: ["$date_month", month] },
                                {
                                  $eq: ["$date_year", new Date().getFullYear()],
                                },
                              ],
                            },
                            then: "$$KEEP",
                            else: "$$PRUNE",
                          },
                        },
                      },
                      {
                        $lookup: {
                          from: "tagitems",
                          localField: "tag",
                          foreignField: "_id",
                          as: "Tag_Info",
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
                        $addFields: {
                          Tag_Name: "$Tag_Info.name",
                        },
                      },
                    ],
                  },
                },
                {
                  $unwind: "$Events",
                },
                {
                  $addFields: {
                    "Events.Tag_Name": "$Events.Tag_Info.name",
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
        "Events.description": 1,
        "Events.time": 1,
        "Events._id": 1,
        "Events.Tag_Name": 1,
      },
    },
  ]);
}
