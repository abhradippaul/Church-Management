import Navbar from "@/my_components/Navbar/Navbar";
import PeopleProvider from "@/my_components/providers/PeopleProvider";
import axios from "axios";

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
  // const { data } = await axios.get("/api/v1/people");
  return (
    <PeopleProvider peopleInfo="this is my props from context api">
      <Navbar userInfo={UserInfo} />
      <div className="px-2 md:px-4 max-w-7xl mx-auto min-h-dvh">{children}</div>
    </PeopleProvider>
  );
}
