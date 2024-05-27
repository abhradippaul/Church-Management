"use client";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { memo } from "react";

interface ItemValue {
  items?: {
    item: string;
    path: string;
  };
  subItems?: {
    trigger: string;
    subItems: {
      item: string;
      path: string;
    }[];
  };
}

interface SubNavbarForTagsProps {
  menu: {
    trigger: string;
    items: ItemValue[];
  }[];
}

function SubNavbarForTags({ menu }: SubNavbarForTagsProps) {
  return (
    <Menubar>
      {menu.map(({ items, trigger }) => (
        <MenubarMenu key={trigger}>
          <MenubarTrigger className="cursor-pointer">{trigger}</MenubarTrigger>
          <MenubarContent>
            {items.map(({ subItems, items }) =>
              items ? (
                <MenubarItem key={items.item}>{items.item}</MenubarItem>
              ) : (
                <MenubarSub key={subItems?.trigger}>
                  <MenubarSubTrigger>{subItems?.trigger}</MenubarSubTrigger>
                  <MenubarSubContent>
                    {subItems?.subItems.map(({ item, path }) => (
                      <MenubarItem key={item}>{item}</MenubarItem>
                    ))}
                  </MenubarSubContent>
                </MenubarSub>
              )
            )}
          </MenubarContent>
        </MenubarMenu>
      ))}
    </Menubar>
  );
}

export default memo(SubNavbarForTags);
