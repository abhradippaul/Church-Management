"use client";

import dynamic from "next/dynamic";
import { memo } from "react";
import { usePeopleContext } from "@/my_components/providers/PeopleProvider";
import PeopleFilterOptions from "./PeopleFilterOptions";

const UserCreateDialog = dynamic(() => import("./UserCreateDialog"));

function PeopleNavbar({ type }: { type: "create" | "edit" }) {
  const { peopleInfo } = usePeopleContext();
  return (
    <div className="mb-8 mt-4 flex items-center justify-between">
      {type === "create" && (
        <h1 className="text-lg text-zinc-200">
          {peopleInfo.PeopleCount} people found
        </h1>
      )}
      {type === "edit" && (
        <h1 className="text-lg text-zinc-200">People Infomation : </h1>
      )}
      <PeopleFilterOptions />
      <UserCreateDialog type={type} />
    </div>
  );
}

export default memo(PeopleNavbar);
