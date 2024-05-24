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
    // const userId = req.nextUrl.searchParams.get("userId");
    const access_token = req.cookies.get("access_token")?.value;
    if (!access_token) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "You are not logged in",
      });
    }

    // if (!userId) {
    //   return NextResponse.json<ApiResponse>({
    //     success: false,
    //     message: "User id not found",
    //   });
    // }

    const verifiedData = verifyToken(access_token);

    if (!verifiedData?._id || !verifiedData?.role) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "You are not logged in",
      });
    }

    let data;
    let newUserId;

    if (verifiedData.role === "admin") {
      const isAdmin = await PeopleModel.findOne(
        { _id: verifiedData._id },
        { _id: 1 }
      );

      if (!isAdmin) {
        return NextResponse.json<ApiResponse>({
          success: false,
          message: "You are not logged in",
        });
      }

      if (String(isAdmin?._id) !== verifiedData._id) {
        return NextResponse.json<ApiResponse>({
          success: false,
          message: "You are not logged in",
        });
      }

      // newUserId = new mongoose.Types.ObjectId(userId);
    } else if (verifiedData.role === "owner") {
      newUserId = new mongoose.Types.ObjectId(verifiedData._id);
    } else {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "You are not logged in",
      });
    }

    data = await OwnerModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(verifiedData._id),
        },
      },
      {
        $lookup: {
          from: "peoples",
          localField: "_id",
          foreignField: "church",
          as: "Peoples",
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
          _id: 0,
          "Peoples._id": 1,
          "Peoples.name": 1,
          "Peoples.date_of_birth": 1,
          "Peoples.email": 1,
          PeopleCount: 1,
        },
      },
    ]);

    if (!data?.length) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "User does not exist",
      });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "People found successfully",
      data: data[0],
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      message: err.message,
    });
  }
}

export async function POST(req: NextRequest) {
  dbConnect();
  try {
    const { name, date_of_birth, gender, address, phone_number, email } =
      await req.json();
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
    if (
      !name ||
      !date_of_birth ||
      !gender ||
      !address ||
      !phone_number ||
      !email
    ) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "All fields are required",
      });
    }

    const isUserAlreadyExists = await PeopleModel.findOne(
      {
        $or: [{ phone_number }, { email }],
      },
      { _id: 1 }
    );

    console.log(isUserAlreadyExists);

    if (isUserAlreadyExists) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "User already exist",
      });
    }

    const isUserCreated = await PeopleModel.create({
      name,
      date_of_birth,
      gender,
      address,
      phone_number,
      church: verifiedData._id,
      email,
    });
    if (!isUserCreated?._id) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "Failed to create user",
      });
    }
    return NextResponse.json<ApiResponse>({
      success: true,
      message: "User created successfully",
    });
  } catch (err: any) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: err.message,
      },
      { status: 500 }
    );
  }
}
