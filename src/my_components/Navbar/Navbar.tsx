import SheetComponent from "@/components/SheetComponent";
import { Menu } from "lucide-react";

function Navbar() {
  return (
    <div className="w-full fixed top-0 left-0 right-0 py-6 px-8 bg-slate-900">
      <SheetComponent trigger={<Menu className="size-8" />} />
    </div>
  );
}

export default Navbar;
