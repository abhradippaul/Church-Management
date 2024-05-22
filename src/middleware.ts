import axios from "axios";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ApiResponse } from "./types/ApiResponse";

export async function middleware(req: NextRequest) {
  const access_token = req.cookies.get("access_token");
  const pathName = req.nextUrl.pathname;
  const publicPath = "/sign-in /sign-up";
  const isPublicPath = publicPath.includes(pathName);

  const tokenVerify = async () => {
    const { data } = await axios.post(
      req.nextUrl.clone().origin + "/api/v1/verify-token",
      {
        token: access_token?.value,
      }
    );
    return data as ApiResponse;
  };

  if (!access_token?.value && !isPublicPath) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  } else if (access_token?.value && isPublicPath) {
    const isTokenValid = await tokenVerify();
    if (isTokenValid?.success) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    } else {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
  } else {
    const isTokenValid = await tokenVerify();
    if (isTokenValid?.success) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
  }
}

export const config = {
  matcher: ["/sign-in", "/sign-up", "/dashboard", "/people"],
};
