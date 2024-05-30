"use client";

import AccordionComponent from "@/components/AccordionComponent";
import AlertDialogComponent from "@/components/AlertDialogComponent";
import TooltipComponent from "@/components/TooltipComponent";
import { useTagsContext } from "@/my_components/providers/TagsProvider";
import axios from "axios";
import { Trash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

function page() {
  const { tagsInfo } = useTagsContext();
  const router = useRouter();
  const deletePeople = useCallback(async (id: string) => {
    try {
      const { data } = await axios.delete(
        `/api/v1/tags/tag-item?tagItem=${id}`
      );
      if (data.success) {
        router.refresh();
      } else {
        console.log(data);
      }
    } catch (err: any) {
      console.log(err.message);
    }
  }, []);
  return (
    <div className="h-full flex flex-col sm:flex-row justify-center gap-x-12">
      <div className="flex flex-col w-full gap-y-4">
        {/* {tagsInfo.map(
          ({ _id,name }) =>
            subItems && (
              <AccordionComponent
                content={subItems.subItems}
                key={subItems.trigger}
                itemKey={subItems?.trigger || ""}
                trigger={subItems?.trigger || ""}
              />
            )
        )} */}
      </div>
      <div className="flex flex-col w-full gap-y-4">
        {/* {tagsInfo.map(({ _id, name }) => (
          <div
            key={_id}
            className="flex items-center justify-between border-b py-4 text-white hover:cursor-pointer hover:underline "
          >
            <Link href={`${_id}`} className="flex-grow">
              {name}
            </Link>
            <AlertDialogComponent
              description={`Only the tag ${name} will be deleted not the people data.`}
              title={`Are you want to delete ${name} the tag ?`}
              _id={_id}
              onActionClick={deletePeople}
              trigger={
                <TooltipComponent
                  hoverElement={
                    <Trash className="size-4 mr-4 text-red-700 hover:text-red-600 transition" />
                  }
                >
                  <h1>Delete Tag</h1>
                </TooltipComponent>
              }
            />
          </div>
        ))} */}
      </div>
    </div>
  );
}

export default page;
