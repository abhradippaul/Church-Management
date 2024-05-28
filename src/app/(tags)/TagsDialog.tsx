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
}

function TagsDialog({ trigger, descriptions }: TagsDialogProps) {
  const [isMounted, setIsMounted] = useState(false);
  const { dialogType, isFormError } = useTagsContext();
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Dialog>
      <DialogTrigger>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {dialogType === "groups" && "Create group to insert tags."}
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
