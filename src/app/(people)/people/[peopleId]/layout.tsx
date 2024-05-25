import Navbar from "@/my_components/Navbar/Navbar";
import { ReactNode } from "react";
import PeopleNavbar from "../../PeopleNavbar";

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

function layout({
  children,
  params,
}: {
  children: ReactNode;
  params: { peopleId: string };
}) {
  return (
    <div>
      <Navbar userInfo={UserInfo} />
      <div className="px-2 md:px-4 max-w-7xl mx-auto min-h-dvh">
        <div className="flex flex-col">
          <PeopleNavbar type="edit"/>
          {children}
          </div>
      </div>
    </div>
  );
}

export default layout;
