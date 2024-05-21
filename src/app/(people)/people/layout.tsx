import Navbar from "@/my_components/Navbar/Navbar";
import TestProvider from "@/my_components/providers/TestProvider";

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
  return (
    <TestProvider props="this is my props from context api">
      <Navbar userInfo={UserInfo} />
      <div className="px-2 md:px-4 max-w-7xl mx-auto min-h-dvh">{children}</div>
    </TestProvider>
  );
}