import {
  GetDashboardInfoForOwner,
  GetDashboardInfoForUser,
} from "@/aggregation/Dashboard";
import dbConnect from "@/lib/DbConnect";
import { verifyToken } from "@/lib/JsonWebToken";
import AdminModel from "@/model/Admin";
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

    if (!verifiedData?.role || !verifiedData.ownerId) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "You are not logged in",
      });
    }

    let data: any = [];

    if (verifiedData.role === "admin" && verifiedData.adminId) {
      const isAdminExist = await AdminModel.findOne(
        { _id: verifiedData.adminId },
        { name: 1, image: 1 }
      );

      if (!isAdminExist) {
        return NextResponse.json<ApiResponse>({
          success: false,
          message: "You are not logged in",
        });
      }

      data = await OwnerModel.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(verifiedData.ownerId),
          },
        },
      ]);
    } else if (verifiedData.role === "owner") {
      data = await GetDashboardInfoForOwner(verifiedData.ownerId);
    } else if (verifiedData.role === "people" && verifiedData.peopleId) {
      data = await GetDashboardInfoForUser(
        verifiedData.ownerId,
        verifiedData.peopleId
      );
    } else {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "Some thing went wrong in role",
      });
    }

    if (!data.length) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "No data found",
      });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Data found successfully",
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
