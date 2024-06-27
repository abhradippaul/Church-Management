"use client";

import { Sheet, SheetContent } from "@/components/ui/sheet";
import { usePeopleContext } from "@/my_components/providers/PeopleProvider";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useDashboardContext } from "@/my_components/providers/DashboardProvider";

const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL;

function ChatSheetComponent({ role }: { role: string }) {
  const { isChatSheetOpen, setIsChatSheetOpen, chatInfo, setChatInfo } =
    usePeopleContext();
  const {
    isChatSheetOpen: dashboardOpen,
    setIsChatSheetOpen: setDashboardOpen,
    chatInfo: dashboardChatInfo,
    setChatInfo: setDashboardChatInfo,
    UserInfo,
  } = useDashboardContext();
  const [message, setMessage] = useState<string | undefined>();
  const lastMessage: any = useRef(null);

  const submitMessage = useCallback(async () => {
    try {
      if (message && chatInfo?._id) {
        const { data } = await axios.post("/api/v1/chat", {
          message,
          peopleId: chatInfo?._id,
        });
        console.log(data);
        if (data.success) {
          if (chatInfo.chatDetails?.length) {
            if (role === "people") {
              setDashboardChatInfo((prev: any) => ({
                ...prev,
                chatDetails: [
                  ...prev?.chatDetails,
                  {
                    _id: Math.floor(Math.random() * 9999).toString(),
                    createdAt: new Date(),
                    message,
                    receiver: chatInfo._id,
                  },
                ],
              }));
            } else {
              setChatInfo((prev: any) => ({
                ...prev,
                chatDetails: [
                  ...prev?.chatDetails,
                  {
                    _id: Math.floor(Math.random() * 9999).toString(),
                    createdAt: new Date(),
                    message,
                    receiver: chatInfo._id,
                  },
                ],
              }));
            }
          } else {
            if (role === "people") {
              setDashboardChatInfo((prev: any) => ({
                ...prev,
                chatDetails: [
                  {
                    _id: Math.floor(Math.random() * 9999).toString(),
                    createdAt: new Date(),
                    message,
                    receiver: chatInfo._id,
                  },
                ],
              }));
            } else {
              setChatInfo((prev: any) => ({
                ...prev,
                chatDetails: [
                  {
                    _id: Math.floor(Math.random() * 9999).toString(),
                    createdAt: new Date(),
                    message,
                    receiver: chatInfo._id,
                  },
                ],
              }));
            }
          }
          setMessage("");
        }
      }
    } catch (err: any) {
      console.log(err);
    }
  }, [message, chatInfo]);

  useEffect(() => {
    lastMessage?.current?.scrollIntoView([{ behavior: "smooth" }]);
  }, [chatInfo]);

  console.log(dashboardChatInfo);

  return (
    <Sheet
      open={role === "people" ? dashboardOpen : isChatSheetOpen}
      onOpenChange={role === "people" ? setDashboardOpen : setIsChatSheetOpen}
    >
      <SheetContent className="sm:max-w-[500px] w-full py-6">
        <div className="flex items-center">
          <Avatar className="mr-4">
            <AvatarImage
              src={`${imageUrl}/w_250/q_25/f_auto/${chatInfo?.imageUrl}`}
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          {chatInfo?.name}
        </div>
        <div className="size-full flex flex-col items-center justify-between pb-16 my-4">
          {chatInfo?.isChatLoading ? (
            <div className="size-full">
              <Loader2 className="size-8 animate-spin text-zinc-300" />
            </div>
          ) : (
            <div className="size-full border my-1 max-h-[80dvh] overflow-y-auto">
              {role === "people"
                ? dashboardChatInfo?.chatDetails?.map(
                    ({ message, _id, createdAt, receiver }) => (
                      <div
                        key={_id}
                        className={`w-full flex items-center justify-between  ${
                          UserInfo?._id === receiver && "flex-row-reverse"
                        }`}
                      >
                        <div className="bg-slate-900 rounded-md p-2 m-1 w-1/2">
                          <p className="text-zinc-300">{message}</p>
                          <h1 className="text-end mt-2 text-white">
                            {`${new Date(createdAt).getHours()}:${new Date(
                              createdAt
                            ).getMinutes()}`}
                          </h1>
                        </div>
                        <div className="w-1/2"></div>
                      </div>
                    )
                  )
                : chatInfo?.chatDetails?.map(
                    ({ message, _id, createdAt, receiver }) => (
                      <div
                        key={_id}
                        className={`w-full flex items-center justify-between  ${
                          chatInfo._id === receiver && "flex-row-reverse"
                        }`}
                      >
                        <div className="bg-slate-900 rounded-md p-2 m-1 w-1/2">
                          <p className="text-zinc-300">{message}</p>
                          <h1 className="text-end mt-2 text-white">
                            {`${new Date(createdAt).getHours()}:${new Date(
                              createdAt
                            ).getMinutes()}`}
                          </h1>
                        </div>
                        <div className="w-1/2"></div>
                      </div>
                    )
                  )}
              <div ref={lastMessage}></div>
            </div>
          )}
          <div className="relative w-full mt-1">
            <Textarea
              className="w-full"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button
              size="sm"
              disabled={chatInfo?.isChatLoading}
              onClick={submitMessage}
              className="absolute right-2 bottom-2"
            >
              Send
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default memo(ChatSheetComponent);
