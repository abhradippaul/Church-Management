import { getPeopleInfoAggregate } from "@/aggregation/PeopleInfo";
import dbConnect from "@/lib/DbConnect";
import { verifyToken } from "@/lib/JsonWebToken";
import { ApiResponse } from "@/types/ApiResponse";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { peopleId: string } }
) {
  dbConnect();
  try {
    const { peopleId } = params;
    const access_token = req.cookies.get("access_token")?.value;
    if (!access_token || !peopleId) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "You are not logged in or does not provide people id",
      });
    }
    const verifiedData = verifyToken(access_token);
    if (!verifiedData?.role) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "You are not logged in",
      });
    }

    // Getting data of the specific people
    const peopleInfo = await getPeopleInfoAggregate(verifiedData, peopleId);

    if (!peopleInfo?.length) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "No data found",
      });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Successfully fetched users information",
      data: peopleInfo[0],
    });
  } catch (err: any) {
    return NextResponse.json<ApiResponse>({
      success: false,
      message: err.message,
    });
  }
}
