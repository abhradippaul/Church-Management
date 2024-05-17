import { ScrollArea } from "@/components/ui/scroll-area";

function RightSideNavbar() {
  return (
    <div className="bg-slate-900 px-4 pb-4 pt-24 fixed right-0 top-0 bottom-0 flex flex-col items-center">
      <ScrollArea>
        <div className="size-12 bg-white rounded-full"></div>
      </ScrollArea>
    </div>
  );
}

export default RightSideNavbar;
