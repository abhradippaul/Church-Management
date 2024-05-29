"use client";

import AccordionComponent from "@/components/AccordionComponent";
import { useTagsContext } from "@/my_components/providers/TagsProvider";
import Link from "next/link";

function page() {
  const { tagsInfo } = useTagsContext();
  return (
    <div className="h-full flex flex-col sm:flex-row justify-center gap-x-12">
      <div className="flex flex-col w-full gap-y-4">
        {tagsInfo.map(
          ({ subItems }) =>
            subItems && (
              <AccordionComponent
                content={subItems.subItems}
                key={subItems.trigger}
                itemKey={subItems?.trigger || ""}
                trigger={subItems?.trigger || ""}
              />
            )
        )}
      </div>
      <div className="flex flex-col w-full gap-y-4">
        {tagsInfo.map(
          ({ items }) =>
            items && (
              <Link
                key={items?.path}
                href={`${items?.path}`}
                className="border-b py-4 text-white hover:cursor-pointer hover:underline"
              >
                {items?.item}
              </Link>
            )
        )}
      </div>
    </div>
  );
}

export default page;
