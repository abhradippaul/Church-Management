"use client";

import NavigationMenuComponent from "@/components/NavigationMenuComponent";
import { LogOut } from "lucide-react";
import { memo } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const CommandComponent = dynamic(() => import("@/components/CommandComponent"));
const TooltipComponent = dynamic(() => import("@/components/TooltipComponent"));
const SheetComponent = dynamic(() => import("@/components/SheetComponent"));

interface UserInfoValue {
  name: string;
  imageUrl: string;
  role: string;
}

const AdminPages = [
  {
    title: "Dashboard",
    path: "/dashboard",
  },
  {
    title: "People",
    path: "/people",
  },
  {
    title: "Tags",
    path: "/tags",
  },
  {
    title: "Events",
    path: "/events",
  },
];

const OwnerPages = [
  {
    title: "Dashboard",
    path: "/dashboard",
  },
  {
    title: "People",
    path: "/people",
  },
  {
    title: "Tags",
    path: "/tags",
  },
  {
    title: "Events",
    path: "/events",
  },
  {
    title: "Giving",
    path: "/giving",
  },
  {
    title: "Check In",
    path: "/check-in",
  },
];

const Pages = [
  {
    title: "Dashboard",
    path: "/dashboard",
  },
  {
    title: "Tags",
    path: "/tags",
  },
  {
    title: "Events",
    path: "/events",
  },
];

const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL;

const onSignOutButtonClick = () => {
  try {
    console.log("sign out");
  } catch (err: any) {
    console.log(err);
  }
};

function Navbar({ userInfo }: { userInfo: UserInfoValue }) {
  const pathname = usePathname();
  return (
    <div className="w-full flex items-center justify-between fixed top-0 left-0 right-0  bg-slate-900">
      <div className="max-w-7xl w-full mx-auto flex items-center justify-between py-4 px-2 gap-x-4 md:px-4">
        <div className="flex lg:hidden">
          <SheetComponent
            userInfo={userInfo}
            Pages={
              userInfo.role !== "people"
                ? userInfo.role === "admin"
                  ? AdminPages
                  : OwnerPages
                : Pages
            }
          />
        </div>
        <h1 className="text-slate-300 font-bold text-lg sm:text-xl tracking-wider sm:tracking-widest">
          XYZ
        </h1>
        <div className="hidden lg:block">
          <NavigationMenuComponent
            Pages={
              userInfo.role !== "people"
                ? userInfo.role === "admin"
                  ? AdminPages
                  : OwnerPages
                : Pages
            }
          />
        </div>
        <div
          className={`flex items-center ${
            (pathname === "/people" || pathname === "/dashboard") &&
            userInfo.role !== "people" &&
            "max-w-[300px] w-[90%]"
          }`}
        >
          {pathname === "/people" && userInfo.role === "owner" && (
            <CommandComponent pathName="/people" />
          )}
          {userInfo.role === "admin" && (
            <CommandComponent pathName={pathname} />
          )}
          <TooltipComponent
            hoverElement={
              <img
                src={`${imageUrl}/${userInfo.imageUrl}`}
                alt="image"
                className="size-10 rounded-full ml-4"
              />
            }
          >
            <div className="flex flex-col justify-center">
              <div className="my-1">
                <h1 className="text-base text-zinc-200">{userInfo.name}</h1>
                <p className="text-zinc-300 text-sm">{userInfo.role}</p>
              </div>
              <Link
                href="/profile"
                className="my-1 w-full hover:bg-slate-900 rounded-md cursor-pointer p-1 text-base text-zinc-200 hover:text-white justify-center"
              >
                Profile
              </Link>
              <Button
                size="sm"
                variant="link"
                className="flex w-full items-center justify-between my-1 group hover:bg-slate-900 rounded-md cursor-pointer p-1"
                onClick={onSignOutButtonClick}
              >
                {" "}
                <h1 className="text-base text-zinc-200 group-hover:text-white">
                  Sign Out
                </h1>{" "}
                <LogOut className="size-4 ml-4 text-zinc-300 group-hover:text-white" />
              </Button>
            </div>
          </TooltipComponent>
        </div>
      </div>
    </div>
  );
}

export default memo(Navbar);
