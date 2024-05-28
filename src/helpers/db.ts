"use server";

import axios from "axios";
import { cookies, headers } from "next/headers";

export async function getTagsPage() {
  interface tags_Info {
    name: string;
    _id: string;
  }
  interface group_Info {
    name: string;
    _id: string;
    Tags_Item: { name: string; _id: string }[];
  }
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
      const tags_Info = data.data.Tags_Item.map((e: tags_Info) => ({
        items: {
          item: e.name,
          path: e._id,
        },
      }));

      const group_Info = data.data.Tag_Group.map((e: group_Info) => ({
        subItems: {
          trigger: e.name,
          _id: e._id,
          subItems:
            e?.Tags_Item?.map(({ _id, name }) => ({
              item: name,
              path: _id,
            })) || [],
        },
      }));
      const tagsInfo = [...tags_Info, ...group_Info];
      return { tagsInfo, group_Info };
    }
  } catch (err: any) {
    console.log(err);
  }
}
