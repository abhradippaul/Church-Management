"use server";

import axios from "axios";
import { cookies, headers } from "next/headers";

export async function getTagsPage() {
  try {
    const host = headers().get("host");
    const cookieStore = cookies();
    const access_token = cookieStore.get("access_token");
    const { data } = await axios.get(`http://${host}/api/v1/tags`, {
      headers: {
        Cookie: `${access_token?.name}=${access_token?.value}`,
      },
    });
    if (data.success) {
      return data.data;
    }
  } catch (err: any) {
    console.log(err);
  }
}

export async function createVerifyCodeForEmail(
  type: "admin" | "owner" | "people",
  _id: string
) {
  try {
    const host = headers().get("host");
    const cookieStore = cookies();
    const access_token = cookieStore.get("access_token");
    const { data } = await axios.put(
      `http://${host}/api/v1/send-verify-email?type=${type}`,
      { _id },
      {
        headers: {
          Cookie: `${access_token?.name}=${access_token?.value}`,
        },
      }
    );
    return data;
  } catch (err: any) {
    console.log(err);
  }
}
