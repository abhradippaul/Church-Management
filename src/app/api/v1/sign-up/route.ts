import { SendVerificationEmail } from "@/helpers/SendVerificationEmail";
import dbConnect from "@/lib/DbConnect";
import AdminModel, { AdminInterfaceValue } from "@/model/Admin";
import OwnerModel from "@/model/Owner";
import { ApiResponse } from "@/types/ApiResponse";
import { NextRequest, NextResponse } from "next/server";
import { genSalt, hash } from "bcryptjs";

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

    const verificationCodeAndExpriy = () => {
      const verify_expiry = Math.floor(Date.now() / 1000);
      const verify_code = Math.floor(
        100000 + Math.random() * 900000
      ).toString();
      return { verify_code, verify_expiry };
    };

    const verficationEmail = async (code: string) => {
      const { success } = await SendVerificationEmail(email, name, code);

      if (!success) {
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            message: "Failed to send verification email",
          },
          { status: 400 }
        );
      }
    };

    if (type === "admin") {
      const isAdminAlreadyExist = await AdminModel.findOne(
        { email },
        { _id: 1 }
      );

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

      const { verify_code, verify_expiry } = verificationCodeAndExpriy();
      verficationEmail(verify_code);

      isUserCreated = await AdminModel.create({
        email,
        password: hashedPassword,
        name,
        image,
        verify_code,
        verify_expiry,
      });
      isUserCreated = {
        _id: isUserCreated._id,
        type: type,
      };
    } else if (type === "owner") {
      const isOwnerAlreadyExist = await OwnerModel.findOne(
        { email },
        { _id: 1 }
      );

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

      const { verify_code, verify_expiry } = verificationCodeAndExpriy();
      verficationEmail(verify_code);

      isUserCreated = await OwnerModel.create({
        email,
        password: hashedPassword,
        name,
        image,
        verify_code,
        verify_expiry,
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
