import SpecificNavbarForTag from "@/my_components/Navbar/SpecificNavbarForTag";
import PeopleProvider from "@/my_components/providers/PeopleProvider";
import { ReactNode } from "react";

function layout({
  children,
  params,
}: {
  children: ReactNode;
  params: { tagId: string };
}) {
  console.log(params);
  return (
    <div>
      <SpecificNavbarForTag />
      {children}
    </div>
  );
}

export default layout;
