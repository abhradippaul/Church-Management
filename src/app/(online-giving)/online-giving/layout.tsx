import Navbar from "@/my_components/Navbar/Navbar";
import { ReactNode } from "react";

export const metadata = {
  title: "XYZ | Events",
  description: "Events",
};

async function layout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Navbar userInfo={{ name: "test", imageUrl: "", role: "owner" }} />
      <div className="px-2 pt-24 md:px-4 max-w-7xl mx-auto flex flex-col min-h-dvh">
        {children}
      </div>
    </div>
  );
}

export default layout;
