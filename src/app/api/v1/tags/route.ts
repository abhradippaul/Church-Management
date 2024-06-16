import { getTagsInfoAggregate, isChurchAndTagValid } from "@/aggregation/Tags";
import dbConnect from "@/lib/DbConnect";
import { verifyToken } from "@/lib/JsonWebToken";
import TagJoinedModel from "@/model/TagJoined";
import { ApiResponse } from "@/types/ApiResponse";
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

    if (!verifiedData?.role) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "You are not logged in",
      });
    }

    const tagsInfo = await getTagsInfoAggregate(verifiedData);

    if (!tagsInfo?.length) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "No data found",
      });
    }
    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Tags found successfully",
      data: {
        ...tagsInfo[0],
        role: verifiedData.role,
      },
    });
  } catch (err: any) {
    return NextResponse.json<ApiResponse>({
      success: false,
      message: err.message,
    });
  }
}

export async function POST(req: NextRequest) {
  dbConnect();
  try {
    const access_token = req.cookies.get("access_token")?.value;
    const { _id, tagId } = await req.json();
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

    if (!_id || !tagId) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "Provide _id and tagId",
      });
    }

    const isChurchTagValid = await isChurchAndTagValid(
      verifiedData.ownerId,
      tagId
    );

    if (!isChurchTagValid.length) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "Tag not found",
      });
    }

    if (!isChurchTagValid[0]?.isTagExist) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "Tag not found",
      });
    }

    _id.map(async ({ _id }: { _id: string }) => {
      await TagJoinedModel.create({ people: _id, tag_item: tagId });
    });

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
    const access_token = req.cookies.get("access_token")?.value;
    const peopleId = req.nextUrl.searchParams.get("peopleId");
    const tagId = req.nextUrl.searchParams.get("tagId");
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

    if (!peopleId || !tagId) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "Provide peopleId and tagId",
      });
    }

    const isValid = await isChurchAndTagValid(verifiedData.ownerId, tagId);

    if (!isValid) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "Tag not found",
      });
    }

    if (!isValid[0]?.isTagExist) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "Tag not found",
      });
    }

    const isDeleted = await TagJoinedModel.deleteOne({
      people: peopleId,
      tag_item: tagId,
    });

    if (!isDeleted.deletedCount) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "People not deleted",
      });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Delete people successfully",
    });
  } catch (err: any) {
    return NextResponse.json<ApiResponse>({
      success: false,
      message: err.message,
    });
  }
}
