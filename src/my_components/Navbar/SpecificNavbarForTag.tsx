"use client";
import InsertNewUserToTagDialog from "@/app/(tags)/InsertUserDialog";
import { useTagsContext } from "../providers/TagsProvider";

function SpecificNavbarForTag() {
  const { UserInfo } = useTagsContext();
  return (
    <div className="w-full flex items-center justify-between">
      SpecificNavbarForTag
      {UserInfo?.role === "owner" && <InsertNewUserToTagDialog />}
    </div>
  );
}

export default SpecificNavbarForTag;
