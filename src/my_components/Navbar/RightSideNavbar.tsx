
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { memo } from "react";

function RightSideNavbar() {
  return (
    <div className="bg-slate-900 pb-4 px-4 pt-20 fixed right-0 top-0 bottom-0 flex flex-col items-center">
      <Separator className="text-zinc-400" />
      <ScrollArea className="w-full my-4">
        <div className="flex flex-col items-center gap-y-4">
          <div className="size-12 bg-white rounded-full"></div>
          <div className="size-12 bg-white rounded-full"></div>
          <div className="size-12 bg-white rounded-full"></div>
          <div className="size-12 bg-white rounded-full"></div>
        </div>
      </ScrollArea>
    </div>
  );
}

export default memo(RightSideNavbar);
