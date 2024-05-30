import Navbar from "@/my_components/Navbar/Navbar";
import { ReactNode } from "react";

import { Plus } from "lucide-react";
import EventDialog from "../EventDialog";
import { Button } from "@/components/ui/button";

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
      <div className="px-2 pt-24 md:px-4 max-w-7xl mx-auto flex flex-col min-h-dvh">
        <div className="flex items-center justify-between">
          <h1>Event page </h1>
          <EventDialog
            trigger={
              <Button
                variant="outline"
                size="lg"
                className="hover:bg-gray-900 flex items-center justify-between text-xl text-zinc-300 hover:text-zinc-100"
              >
                <Plus className="size-6 mr-2" />
                Add Event
              </Button>
            }
          />
        </div>
        {children}
      </div>
    </div>
  );
}

export default layout;
