import dbConnect from "@/lib/DbConnect";
import AdminModel from "@/model/Admin";
import OwnerModel from "@/model/Owner";
import { ApiResponse } from "@/types/ApiResponse";
import { NextRequest, NextResponse } from "next/server";
import { genSalt, hash } from "bcryptjs";
import axios from "axios";

export async function POST(req: NextRequest) {
  dbConnect();
  try {
    const { name, password, email, image } = await req.json();
    const type = req.nextUrl.searchParams.get("type");

    if (!name || !password || !email || !image || !type) {
      return NextResponse.json(
        {
          message: "All fields are required",
        },
        { status: 400 }
      );
    }

    let isUserCreated;

    if (type === "admin") {
      const isAdminAlreadyExist = await AdminModel.findOne({ email });

      if (isAdminAlreadyExist) {
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            message: "Admin already exist",
          },
          { status: 400 }
        );
      }

      const salt = await genSalt(10);
      const hashedPassword = await hash(password, salt);

      isUserCreated = await AdminModel.create({
        email,
        password: hashedPassword,
        name,
        image,
      });
      isUserCreated = {
        _id: isUserCreated._id,
        type: type,
      };
    } else if (type === "owner") {
      const isOwnerAlreadyExist = await OwnerModel.findOne({ email });

      if (isOwnerAlreadyExist) {
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            message: "Owner already exist",
          },
          { status: 400 }
        );
      }

      const salt = await genSalt(10);
      const hashedPassword = await hash(password, salt);

      isUserCreated = await OwnerModel.create({
        email,
        password: hashedPassword,
        name,
        image,
      });
      isUserCreated = {
        _id: isUserCreated._id,
        type: type,
      };
    } else {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Type is required",
        },
        { status: 400 }
      );
    }

    if (!isUserCreated._id) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Failed to create user",
        },
        { status: 400 }
      );
    }

    return NextResponse.json<ApiResponse>(
      {
        message: "User is created successfully",
        success: true,
        data: isUserCreated,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.log(err.message);
    return NextResponse.json({
      error: err.message,
    });
  }
}
