"use client";

import TableComponentForEvents from "@/components/TableComponentForEvents";
import { Button } from "@/components/ui/button";
import { useDashboardContext } from "@/my_components/providers/DashboardProvider";
import axios from "axios";
import { MessageSquare } from "lucide-react";
import { memo, useCallback } from "react";

function DashboardPage() {
  const {
    recentJoined,
    Events,
    UserInfo,
    PaymentAmount,
    setIsChatSheetOpen,
    setChatInfo,
  } = useDashboardContext();
  const onMsgButtonClick = useCallback(async () => {
    try {
      setIsChatSheetOpen(true);
      setChatInfo({
        // imageUrl: image,
        // name,
        isChatLoading: true,
      });
      const { data } = await axios.get(`/api/v1/chat`);
      if (data.success) {
        setChatInfo((prev: any) => ({
          ...prev,
          chatDetails: data.data,
          isChatLoading: false,
        }));
      }
    } catch (err) {
      console.log(err);
    }
  }, []);
  return (
    <div className="pt-24">
      <div className="flex items-center justify-between mb-8">
        <h1>This is our dashboard page</h1>
        {UserInfo?.role === "people" && (
          <MessageSquare
            className="size-4 cursor-pointer text-zinc-300 hover:text-white"
            onClick={onMsgButtonClick}
          />
        )}
        {UserInfo?.role === "admin" && (
          <Button variant="outline" size="sm">
            Change Church
          </Button>
        )}
      </div>
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
