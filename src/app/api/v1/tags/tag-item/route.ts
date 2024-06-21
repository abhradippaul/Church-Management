import {
  getSpecificTagInfoAggregate,
  isChurchAndTagValid,
} from "@/aggregation/Tags";
import dbConnect from "@/lib/DbConnect";
import { verifyToken } from "@/lib/JsonWebToken";
import OwnerModel from "@/model/Owner";
import TagItemModel from "@/model/TagsItem";
import { ApiResponse } from "@/types/ApiResponse";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
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

    if (!verifiedData?.role) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "You are not logged in",
      });
    }

    if (!tagItem) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "Provide tagItem",
      });
    }

    const isChurchAndTagValid = await getSpecificTagInfoAggregate(
      verifiedData,
      tagItem
    );

    if (!isChurchAndTagValid) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "You are not authorized to access this tag",
      });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Tag found",
      data: isChurchAndTagValid[0],
    });
  } catch (err) {
    return NextResponse.json<ApiResponse>({
      success: false,
      message: "Something went wrong",
    });
  }
}

export async function POST(req: NextRequest) {
  dbConnect();
  try {
    const { name, group } = await req.json();
    const access_token = req.cookies.get("access_token")?.value;
    if (!access_token) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "You are not logged in",
      });
    }

    const verifiedData = verifyToken(access_token);

    if (verifiedData?.role !== "owner") {
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
      { _id: verifiedData.ownerId },
      { _id: 1 }
    );

    if (!isChurchExist) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "Church not found",
      });
    }

    let isTagCreated;

    if (group) {
      isTagCreated = await TagItemModel.create({
        name,
        tag_group: group,
        church: verifiedData.ownerId,
      });
    } else {
      isTagCreated = await TagItemModel.create({
        name,
        church: verifiedData.ownerId,
      });
    }

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

export async function PATCH(req: NextRequest) {
  dbConnect();
  try {
    const access_token = req.cookies.get("access_token")?.value;
    const tagItem = req.nextUrl.searchParams.get("tagItem");
    const value = await req.json();
    if (!access_token) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "You are not logged in",
      });
    }

    const verifiedData = verifyToken(access_token);

    if (verifiedData?.role !== "owner") {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "You are not logged in",
      });
    }

    if (!tagItem) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "Provide tagItem",
      });
    }

    const isValid = await isChurchAndTagValid(verifiedData.ownerId, tagItem);

    if (!isValid?.length) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "Tag not found",
      });
    }

    if (!isValid[0]?.isTagExist) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "Problem with the tag",
      });
    }

    let isUpdated: any;

    if (value?.group) {
      isUpdated = await TagItemModel.updateOne(
        { _id: tagItem },
        {
          $set: {
            name: value.name,
            tag_group: value.group,
          },
        }
      );
    } else {
      isUpdated = await TagItemModel.updateOne(
        { _id: tagItem },
        {
          $set: {
            name: value.name,
          },
        }
      );
    }

    if (!isUpdated.modifiedCount) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "Tag not updated",
      });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Insert people successfully",
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

    if (verifiedData?.role !== "owner") {
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

    const isValid = await isChurchAndTagValid(verifiedData.ownerId, tagItem);

    if (!isValid?.length) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "Tag not found",
      });
    }

    if (!isValid[0]?.isTagExist) {
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
