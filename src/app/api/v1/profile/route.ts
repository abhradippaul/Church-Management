import { getPeopleInfoAggregate } from "@/aggregation/PeopleInfo";
import dbConnect from "@/lib/DbConnect";
import { verifyToken } from "@/lib/JsonWebToken";
import OwnerModel from "@/model/Owner";
import PeopleModel from "@/model/People";
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
        message: "You are not logged in or does not provide people id",
      });
    }
    const verifiedData = verifyToken(access_token);
    if (!verifiedData?.role) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "You are not logged in",
      });
    }

    let info = [];

    if (verifiedData.role === "admin" && verifiedData.adminId) {
    } else if (verifiedData.role === "owner" && verifiedData.ownerId) {
      info = await OwnerModel.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(verifiedData.ownerId),
          },
        },
        {
          $project: {
            name: 1,
            image: 1,
            email: 1,
          },
        },
      ]);
    } else if (verifiedData.role === "people" && verifiedData.peopleId) {
      info = await PeopleModel.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(verifiedData.peopleId),
          },
        },
        {
          $project: {
            name: 1,
            image: 1,
            email: 1,
            phone_number: 1,
            gender: 1,
            date_of_birth: 1,
            address: 1,
          },
        },
      ]);
    } else {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "You are not logged in",
      });
    }

    if (!info.length) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "No data found",
      });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Successfully fetched users information",
      data: {
        role: verifiedData.role,
        ...info[0],
      },
    });
  } catch (err: any) {
    return NextResponse.json<ApiResponse>({
      success: false,
      message: err.message,
    });
  }
}
