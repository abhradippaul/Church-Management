import Navbar from "@/my_components/Navbar/Navbar";
import { ReactNode } from "react";
import PeopleNavbar from "../../PeopleNavbar";
import { cookies, headers } from "next/headers";
import axios from "axios";
import PeopleProvider from "@/my_components/providers/PeopleProvider";

export const metadata = {
  title: "XYZ | Tags",
  description: "Tags",
};

interface UserInfoValue {
  name: string;
  imageUrl: string;
  role: string;
}
const UserInfo: UserInfoValue = {
  name: "Abhradip Paul",
  imageUrl: "",
  role: "Admin",
};

async function layout({
  children,
  params,
}: {
  children: ReactNode;
  params: { peopleId: string };
}) {
  let peopleInfo;
  try {
    const host = headers().get("host");
    const cookieStore = cookies();
    const access_token = cookieStore.get("access_token");
    const { data } = await axios.get(
      `http://${host}/api/v1/people/${params.peopleId}`,
      {
        headers: {
          Cookie: `${access_token?.name}=${access_token?.value}`,
        },
      }
    );
    if (data.success) {
      peopleInfo = data.data;
    }
  } catch (err: any) {
    console.log(err);
  }
  return (
    <PeopleProvider peopleInfo={peopleInfo.PeopleInfo}>
      <div>
        <Navbar userInfo={UserInfo} />
        <div className="px-2 md:px-4 max-w-7xl mx-auto min-h-dvh">
          <div className="flex flex-col">
            <PeopleNavbar type="edit" />
            {children}
          </div>
        </div>
      </div>
    </PeopleProvider>
  );
}

export default layout;
