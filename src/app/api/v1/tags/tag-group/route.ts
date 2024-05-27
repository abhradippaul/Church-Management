import dbConnect from "@/lib/DbConnect";
import { verifyToken } from "@/lib/JsonWebToken";
import OwnerModel from "@/model/Owner";
import TagGroupModel from "@/model/TagsGroup";
import { ApiResponse } from "@/types/ApiResponse";
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

    const isTagGroupCreated = await TagGroupModel.create({
      name,
      church: verifiedData._id,
    });

    if (!isTagGroupCreated) {
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
