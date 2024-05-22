import dbConnect from "@/lib/DbConnect";
import { createToken } from "@/lib/JsonWebToken";
import AdminModel from "@/model/Admin";
import OwnerModel from "@/model/Owner";
import { ApiResponse } from "@/types/ApiResponse";
import { compare } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  dbConnect();
  const cookieSettings = { httpOnly: true, secure: true };
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "Please enter email and password",
      });
    }
    let isOwnerExist = await OwnerModel.findOne({ email }, { password: 1 });
    if (isOwnerExist?._id) {
      const isPasswordCorrect = await compare(password, isOwnerExist.password);
      if (!isPasswordCorrect) {
        return NextResponse.json<ApiResponse>({
          success: false,
          message: "Credentials are incorrect",
        });
      }
      const { access_token, refresh_token } = createToken({
        _id: isOwnerExist._id.toString(),
        role: "owner",
      });
      const response = NextResponse.json<ApiResponse>({
        message: "Logged in successfully",
        success: true,
      });
      response.cookies.set("access_token", access_token, cookieSettings);
      response.cookies.set("refresh_token", refresh_token, cookieSettings);
      return response;
    }
    let isAdminExist = await AdminModel.findOne({ email }, { password: 1 });
    if (!isAdminExist?._id) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "User does not exist",
      });
    }

    const isPasswordCorrect = await compare(password, isAdminExist.password);
    if (!isPasswordCorrect) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "Credentials are incorrect",
      });
    }

    const { access_token, refresh_token } = createToken({
      _id: isAdminExist._id.toString(),
      role: "admin",
    });
    const response = NextResponse.json<ApiResponse>({
      message: "Logged in successfully",
      success: true,
    });
    response.cookies.set("access_token", access_token, cookieSettings);
    response.cookies.set("refresh_token", refresh_token, cookieSettings);
    return response;
  } catch (err: any) {
    return NextResponse.json<ApiResponse>({
      success: false,
      message: err.message,
    });
  }
}
