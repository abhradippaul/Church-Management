import dbConnect from "@/lib/DbConnect";
import { verifyToken } from "@/lib/JsonWebToken";
import OwnerModel from "@/model/Owner";
import TagItemModel from "@/model/TagsItem";
import { ApiResponse } from "@/types/ApiResponse";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  dbConnect();
  try {
    const { name } = await req.json();
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

    if (!name) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "Provide tag name",
      });
    }

    const isChurchExist = await OwnerModel.findOne(
      { _id: verifiedData._id },
      { _id: 1 }
    );

    if (!isChurchExist) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "Church not found",
      });
    }

    const isTagCreated = await TagItemModel.create({
      name,
      church: verifiedData._id,
    });

    if (!isTagCreated) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "Tag not created",
      });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Tags created successfully",
    });
  } catch (err: any) {
    return NextResponse.json<ApiResponse>({
      success: false,
      message: err.message,
    });
  }
}

export async function DELETE(req: NextRequest) {
  dbConnect();
  try {
    const tagItem = req.nextUrl.searchParams.get("tagItem");
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

    if (!tagItem) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "Provide tag id",
      });
    }

    const isChurchAndTagValid = await OwnerModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(verifiedData._id),
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
                  new mongoose.Types.ObjectId(tagItem),
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
                $in: [new mongoose.Types.ObjectId(tagItem), "$Tag_Item._id"],
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

    if (!isChurchAndTagValid?.length) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "Tag not found",
      });
    }

    if (
      !isChurchAndTagValid[0]?.isInTag_Group &&
      !isChurchAndTagValid[0]?.isInTag_Item
    ) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "Problem with the tag",
      });
    }

    const isTagDeleted = await TagItemModel.deleteOne({
      _id: tagItem,
    });

    if (!isTagDeleted.deletedCount) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "Tag not deleted",
      });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Tags deleted successfully",
    });
  } catch (err: any) {
    return NextResponse.json<ApiResponse>({
      success: false,
      message: err.message,
    });
  }
}
