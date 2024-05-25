import Navbar from "@/my_components/Navbar/Navbar";
import PeopleProvider from "@/my_components/providers/PeopleProvider";
import axios from "axios";
import dynamic from "next/dynamic";
import { headers, cookies } from "next/headers";
import UserCreateDialog from "../UserCreateDialog";
// const UserCreateDialog = dynamic(() => import("../UserCreateDialog"));

export const metadata = {
  title: "XYZ | People",
  description: "People",
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let peopleInfo;
  try {
    const host = headers().get("host");
    const cookieStore = cookies();
    const access_token = cookieStore.get("access_token");
    const { data } = await axios.get(`http://${host}/api/v1/people`, {
      headers: {
        Cookie: `${access_token?.name}=${access_token?.value}`,
      },
    });
    if (data.success) {
      peopleInfo = data.data;
    }
  } catch (err: any) {
    console.log(err);
  }
  return (
    <PeopleProvider peopleInfo={peopleInfo}>
      <Navbar userInfo={UserInfo} />
      <div className="px-2 md:px-4 max-w-7xl mx-auto min-h-dvh">
        <div className="pt-24 flex flex-col">{children}</div>
      </div>
    </PeopleProvider>
  );
}
