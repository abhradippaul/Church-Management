"use client";

import dynamic from "next/dynamic";
import { memo } from "react";
// import UserCreateDialog from "./UserCreateDialog";
import { usePeopleContext } from "@/my_components/providers/PeopleProvider";
const UserCreateDialog = dynamic(() => import("./UserCreateDialog"));

function PeopleNavbar({ type }: { type: "create" | "edit" }) {
  const { peopleInfo } = usePeopleContext();
  return (
    <div
      className={`mb-8 mt-4 flex items-center ${
        type === "create" ? "justify-between" : "justify-end"
      }`}
    >
      {type === "create" && (
        <h1 className="text-lg text-zinc-200">
          {peopleInfo.PeopleCount} people found
        </h1>
      )}
      <UserCreateDialog type={type} />
    </div>
  );
}

export default memo(PeopleNavbar);
