"use client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React, { memo } from "react";

function AddPersonButton() {
  return (
    <Button
      variant="outline"
      className="text-lg flex items-center justify-between font-semibold text-zinc-300 hover:text-white transition"
    >
      <Plus className="size-6 mr-2" />
      Add Person
    </Button>
  );
}

export default memo(AddPersonButton);
