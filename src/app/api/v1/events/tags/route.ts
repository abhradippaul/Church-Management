import { getTagsInfoAggregate } from "@/aggregation/Tags";
import dbConnect from "@/lib/DbConnect";
import { verifyToken } from "@/lib/JsonWebToken";
import OwnerModel from "@/model/Owner";
import { ApiResponse } from "@/types/ApiResponse";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  dbConnect();
  try {
    const access_token = req.cookies.get("access_token")?.value;
    if (!access_token) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "You are not logged in",
      });
    }

    const verifiedData = verifyToken(access_token);

    if (!verifiedData?._id || !verifiedData?.role) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "You are not logged in",
      });
    }

    const tagsInfo = await await OwnerModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(verifiedData._id),
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

    if (!tagsInfo.length) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "No data found",
      });
    }
    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Tags found successfully",
      data: tagsInfo[0],
    });
  } catch (err: any) {
    return NextResponse.json<ApiResponse>({
      success: false,
      message: err.message,
    });
  }
}
