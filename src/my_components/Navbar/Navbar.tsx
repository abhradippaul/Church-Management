import SheetComponent from "@/components/SheetComponent";
import { memo } from "react";

interface UserInfoValue {
  name: string;
  imageUrl: string;
  role: string;
}

function Navbar({ userInfo }: { userInfo: UserInfoValue }) {
  return (
    <div className="w-full flex items-center justify-between fixed top-0 left-0 right-0 py-4 px-2 md:px-4 bg-slate-900">
      <SheetComponent userInfo={userInfo} />
      <h1 className="text-slate-300 font-bold text-lg sm:text-xl tracking-wider sm:tracking-widest">
        XYZ
      </h1>
    </div>
  );
}

export default memo(Navbar);
