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
      <TagsProvider groupOptions={data.SubItems} groupsInfo={data.SubItems} tagsInfo={data.items}>
        <div className="px-2 md:px-4 max-w-7xl mx-auto min-h-dvh">
          <div className="pt-20 flex flex-col">
            <div className="mb-8 mt-4 flex items-center justify-between">
              <h1>Tags Infomation</h1>
              <SubNavbarForTags
                menu={[
                  {
                    type: "auto",
                    trigger: "Auto Tags",
                    items: [
                      { name: "Male", _id: "male" },
                      { name: "Female", _id: "female" },
                      { name: "Others", _id: "others" },
                    ],
                  },
                  {
                    type: "tag",
                    trigger: "Custome Tags",
                    items: data.items,
                  },
                  {
                    type: "group",
                    trigger: "Custome Groups",
                    SubItems: data.SubItems,
                  },
                ]}
              />
              <div className="flex border rounded-md">
                <TagsDialog
                  descriptions="You can create tags to attach multiple and optionally you can add the tags to any group."
                  trigger={
                    <Button
                      variant="link"
                      size="sm"
                      className="hover:bg-gray-900 group"
                    >
                      <Plus className="size-6 text-zinc-300 group-hover:text-zinc-100" />
                    </Button>
                  }
                />
                <TagSelect />
              </div>
            </div>
            {children}
          </div>
        </div>
      </TagsProvider>
    </div>
  );
}

export default layout;
