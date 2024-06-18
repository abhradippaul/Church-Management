"use client";

import TableComponentForEvents from "@/components/TableComponentForEvents";
import { useDashboardContext } from "@/my_components/providers/DashboardProvider";
import { memo } from "react";

function DashboardPage() {
  const { recentJoined, Events, UserInfo, PaymentAmount } =
    useDashboardContext();
  return (
    <div className="pt-24">
      <h1 className="mb-8">This is our dashboard page</h1>
      <div className="flex items-center justify-between gap-y-4 flex-col">
        {UserInfo?.role !== "people" && (
          <div className="flex gap-4 items-center justify-between w-full">
            <div className="size-48 flex flex-col border rounded-md">
              <h1 className="bg-gray-900 p-2">
                People Added in the Last 7 Days
              </h1>
              <div className="size-full flex items-center justify-center">
                {recentJoined}
              </div>
            </div>
            <div className="size-48 flex flex-col border rounded-md">
              <h1 className="bg-gray-900 p-2">
                People Donated in the Last 7 Days
              </h1>
              <div className="size-full flex items-center justify-center">
                {PaymentAmount}
              </div>
            </div>
          </div>
        )}
        <div className="w-full flex flex-col items-center justify-center rounded-md">
          <h1 className="text-xl mt-4">Upcoming Events</h1>
          <TableComponentForEvents Events={Events} />
        </div>
      </div>
    </div>
  );
}

export default memo(DashboardPage);
