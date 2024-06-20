"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Toaster } from "@/components/ui/toaster";
import { useTagsContext } from "@/my_components/providers/TagsProvider";
import dynamic from "next/dynamic";
import { ReactNode, memo, useEffect, useState } from "react";
const TagItemForm = dynamic(() => import("@/my_components/Form/TagItemForm"));

interface TagsDialogProps {
  trigger: ReactNode;
  descriptions: string;
  type: "create" | "update";
  title?: string;
}

function TagsDialog({ trigger, descriptions, type, title }: TagsDialogProps) {
  const [isMounted, setIsMounted] = useState(false);
  const { dialogType, isFormError, setTagIdForUpdate } = useTagsContext();
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Dialog onOpenChange={() => type === "create" && setTagIdForUpdate("")}>
      <DialogTrigger>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {dialogType === "groups" && title}
            {dialogType === "tags" && "Create tags for user."}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>{descriptions}</DialogDescription>
        <TagItemForm />
      </DialogContent>
      {isFormError && (
        <DialogFooter>
          <Toaster />
        </DialogFooter>
      )}
    </Dialog>
  );
}

export default memo(TagsDialog);
