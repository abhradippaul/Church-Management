import { ApiResponse } from "@/types/ApiResponse";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      await req.json();
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message:
          "razorpay_order_id, razorpay_payment_id and razorpay_signature are required",
      });
    }
    let body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRET!)
      .update(body.toString())
      .digest("hex");
    const response = { signatureIsValid: "false" };
    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "Signature is not valid",
      });
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Payment verified",
        data: response,
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json<ApiResponse>({
      success: false,
      message: err.message,
    });
  }
}
