import dbConnect from "@/lib/DbConnect";
import PeopleModel from "@/model/People";
import { ApiResponse } from "@/types/ApiResponse";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  dbConnect();
  try {
    const peopleName = req.nextUrl.searchParams.get("peopleName");
    if (!peopleName) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "peopleName is required",
      });
    }

    const userInfo = await PeopleModel.aggregate([
      {
        $search: {
          autocomplete: {
            query: `${peopleName}`,
            path: "name",
          },
        },
      },
      {
        $limit: 5,
      },
      {
        $project: {
          name: 1,
          image: 1,
        },
      },
    ]);

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "People successfully retrieved",
      data: userInfo,
    });
  } catch (err: any) {
    return NextResponse.json<ApiResponse>({
      success: false,
      message: err.message,
    });
  }
}

export const dynamic = 'force-dynamic';
