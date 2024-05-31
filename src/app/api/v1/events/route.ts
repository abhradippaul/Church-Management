import { isChurchAndTagValid } from "@/aggregation/Tags";
import dbConnect from "@/lib/DbConnect";
import { verifyToken } from "@/lib/JsonWebToken";
import EventModel from "@/model/Event";
import { ApiResponse } from "@/types/ApiResponse";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  dbConnect();
  try {
    const { name, date, time, tag, description } = await req.json();
    const access_token = req.cookies.get("access_token")?.value;

    if (!name || !date || !time || !tag || !description) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "Please fill all the fields",
      });
    }

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

    const isValid = await isChurchAndTagValid(verifiedData._id, tag);

    if (!isValid?.length) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "Tag not found",
      });
    }

    if (!isValid[0]?.isInTag_Group && !isValid[0]?.isInTag_Item) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "Problem with the tag",
      });
    }

    const isEventCreated = await EventModel.create({
      name,
      date,
      time,
      tag,
      description,
      owner: verifiedData._id,
    });

    if (!isEventCreated) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "Event not created",
      });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Event created successfully",
    });
  } catch (err: any) {
    return NextResponse.json<ApiResponse>({
      success: false,
      message: err.message,
    });
  }
}
