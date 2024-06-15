import dbConnect from "@/lib/DbConnect";
import { verifyToken } from "@/lib/JsonWebToken";
import AdminModel from "@/model/Admin";
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
    } else if (verifiedData.role === "owner" && verifiedData.ownerId) {
      data = await OwnerModel.aggregate([
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
                $redact: {
                  $cond: {
                    if: {
                      $and: [
                        {
                          $gte: ["$date_day", new Date().getDate()],
                        },
                        {
                          $gte: ["$date_month", new Date().getMonth()],
                        },
                        {
                          $gte: ["$date_year", new Date().getFullYear()],
                        },
                      ],
                    },
                    then: "$$KEEP",
                    else: "$$PRUNE",
                  },
                },
              },
            ],
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
                $redact: {
                  $cond: {
                    if: {
                      $gte: [
                        "$createdAt",
                        new Date(new Date().setDate(new Date().getDate() - 7)),
                      ],
                    },
                    then: "$$KEEP",
                    else: "$$PRUNE",
                  },
                },
              },
            ],
          },
        },
        {
          $addFields: {
            PeopleCount: {
              $size: "$Peoples",
            },
          },
        },
        {
          $project: {
            name: 1,
            image: 1,
            PeopleCount: 1,
            "Events.name": 1,
            "Events.date_day": 1,
            "Events.date_month": 1,
            "Events.date_year": 1,
            "Events.time": 1,
          },
        },
      ]);
    } else if (verifiedData.role === "people" && verifiedData.peopleId) {
      data = await PeopleModel.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(verifiedData.peopleId),
          },
        },
        {
          $project: {
            name: 1,
            image: 1,
          },
        },
      ]);
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
