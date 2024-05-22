import { verifyToken } from "@/lib/JsonWebToken";
import { ApiResponse } from "@/types/ApiResponse";
import { NextRequest, NextResponse } from "next/server";

export async function POST(res: NextRequest) {
  try {
    const { token } = await res.json();
    if (!token) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "Token does not exist",
      });
    }
    const isValid = verifyToken(token);
    if (!isValid._id || !isValid.role) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "Invalid token",
      });
    }
    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Valid token",
      data: isValid,
    });
  } catch (err: any) {
    return NextResponse.json<ApiResponse>({
      success: false,
      message: err.message,
    });
  }
}
