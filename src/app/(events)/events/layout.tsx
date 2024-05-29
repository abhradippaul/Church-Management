import Navbar from "@/my_components/Navbar/Navbar";
import { ReactNode } from "react";

export const metadata = {
  title: "XYZ | Events",
  description: "Events",
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
  return (
    <div>
      <Navbar userInfo={UserInfo} />
      <div className="px-2 pt-20 md:px-4 max-w-7xl mx-auto min-h-dvh">
        {children}
      </div>
    </div>
  );
}

export default layout;
