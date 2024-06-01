import dynamic from "next/dynamic";
import Navbar from "@/my_components/Navbar/Navbar";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import TagsProvider from "@/my_components/providers/TagsProvider";

const TagSelect = dynamic(() => import("../TagSelect"));
const SubNavbarForTags = dynamic(
  () => import("@/my_components/Navbar/SubNavbarForTags")
);
const TagsDialog = dynamic(() => import("../TagsDialog"));

export const metadata = {
  title: "XYZ | Tags",
  description: "Tags",
};

interface UserInfoValue {
  name: string;
  imageUrl: string;
  role: string;
}
const UserInfo: UserInfoValue = {
  name: "Abhradip Paul",
  imageUrl: "",
  role: "Admin",
};

async function layout({ children }: { children: ReactNode }) {
  const data = await (await import("@/helpers/db")).getTagsPage();
  if (!data) {
    return null;
  }
  return (
    <div>
      <Navbar userInfo={UserInfo} />
      <TagsProvider
        groupOptions={data.SubItems}
        groupsInfo={data.SubItems}
        tagsInfo={data.items}
      >
        <div className="px-2 md:px-4 max-w-7xl mx-auto min-h-dvh">
          <div className="pt-20 flex flex-col">{children}</div>
        </div>
      </TagsProvider>
    </div>
  );
}

export default layout;
