import {
  isPeopleExistAggregate,
  peopleDetailsAggregate,
} from "@/aggregation/People";
import dbConnect from "@/lib/DbConnect";
import { verifyToken } from "@/lib/JsonWebToken";
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
      // Checking is the admin exist
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

    // Getting the people info of that owner
    data = await peopleDetailsAggregate(verifiedData._id);

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
    const { name, date_of_birth, gender, address, phone_number, email, image } =
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
      !email ||
      !image
    ) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "All fields are required",
      });
    }

    // Checking the people already exists or not
    const isUserAlreadyExists = await PeopleModel.findOne(
      {
        $or: [{ phone_number }, { email }],
      },
      { _id: 1 }
    );

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
      image,
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

export async function DELETE(req: NextRequest) {
  dbConnect();
  try {
    // peopleId is the id of the people that will be deleted
    const peopleId = req.nextUrl.searchParams.get("peopleId");
    const access_token = req.cookies.get("access_token")?.value;

    if (!access_token || !peopleId) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "You are not logged in or does not provide people id",
      });
    }

    const verifiedData = verifyToken(access_token);

    if (!verifiedData?._id || !verifiedData?.role) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "You are not logged in",
      });
    }
    console.log(peopleId);

    // Checking is the people under the owner or not
    const isPeopleExist = await isPeopleExistAggregate(
      verifiedData._id,
      peopleId
    );

    if (!isPeopleExist?.length) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "User not found",
      });
    }

    if (!isPeopleExist[0].isValid) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "Validation failed",
      });
    }

    // If everything is verified then deleting the person
    const isPeopleDeleted = await PeopleModel.deleteOne({
      _id: peopleId,
    });

    if (!isPeopleDeleted?.deletedCount) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "Failed to delete user",
      });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err: any) {
    return NextResponse.json<ApiResponse>({
      success: false,
      message: err.message,
    });
  }
}
