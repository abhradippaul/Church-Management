"use client";

import { Button } from "@/components/ui/button";
import ProfileDialog from "./ProfileDialog";
import { Edit } from "lucide-react";
import { useProfileContext } from "@/my_components/providers/ProfileProvider";

function SubNavbar() {
  const { UserInfo } = useProfileContext();
  return (
    <div className="flex items-center justify-between">
      <h1>Profile page </h1>
      {UserInfo?.role !== "people" && (
        <ProfileDialog
          role={UserInfo?.role || ""}
          trigger={
            <Button
              variant="outline"
              size="lg"
              className="hover:bg-gray-900 flex items-center justify-between text-xl text-zinc-300 hover:text-zinc-100"
            >
              <Edit className="size-6 mr-2" />
              Edit Profile
            </Button>
          }
        />
      )}
    </div>
  );
}

export default SubNavbar;
