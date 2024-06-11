import { isChurchAndTagValid } from "@/aggregation/Tags";
import dbConnect from "@/lib/DbConnect";
import { verifyToken } from "@/lib/JsonWebToken";
import EventModel from "@/model/Event";
import OwnerModel from "@/model/Owner";
import { ApiResponse } from "@/types/ApiResponse";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  dbConnect();
  try {
    const { name, date_day, date_month, date_year, time, tag, description } =
      await req.json();
    const access_token = req.cookies.get("access_token")?.value;

    if (
      !name ||
      !date_day ||
      !date_month ||
      !date_year ||
      !time ||
      !tag ||
      !description
    ) {
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

    if (verifiedData?.role !== "owner") {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "You are not logged in",
      });
    }

    let isValid = await isChurchAndTagValid(verifiedData.ownerId, tag);

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

    const isEventCreated = await EventModel.create({
      name,
      date_day,
      date_month,
      date_year,
      time,
      tag,
      description,
      owner: verifiedData.ownerId,
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

    const data = await OwnerModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(verifiedData.ownerId),
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
          "Events.Tag_Info.name": 1,
        },
      },
    ]);

    if (!data?.length) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "No events found",
      });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Events found",
      data: {
        ...data[0],
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
