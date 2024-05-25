import Navbar from "@/my_components/Navbar/Navbar";
import { ReactNode } from "react";

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

async function layout({ children }: { children: ReactNode }) {
  //     let peopleInfo;
  //   try {
  //     const host = headers().get("host");
  //     const cookieStore = cookies();
  //     const access_token = cookieStore.get("access_token");
  //     const { data } = await axios.get(`http://${host}/api/v1/people`, {
  //       headers: {
  //         Cookie: `${access_token?.name}=${access_token?.value}`,
  //       },
  //     });
  //     if (data.success) {
  //       peopleInfo = data.data;
  //     }
  //   } catch (err: any) {
  //     console.log(err);
  //   }
  return (
    <div>
      <Navbar userInfo={UserInfo} />
      <div className="px-2 md:px-4 max-w-7xl mx-auto min-h-dvh">
        <div className="pt-24 flex flex-col">
          {/* <div className="mb-8 mt-4 flex items-center justify-between">
            <h1 className="text-lg text-zinc-200">
              {peopleInfo.PeopleCount} people found
            </h1>
            <UserCreateDialog />
          </div> */}
          {children}
        </div>
      </div>
    </div>
  );
}

export default layout;
