"use client";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { getPeopleSearchInfo } from "@/helpers/db";
import { Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { memo, useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

interface PeopleItemValue {
  name: string;
  _id: string;
  image: string;
}

function CommandComponent() {
  const [open, setOpen] = useState(false);
  const [people, setPeople] = useState<PeopleItemValue[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const debounced = useDebouncedCallback(async (value) => {
    if (pathname === "/people") {
      const data = await getPeopleSearchInfo(value);
      if (data.success) {
        setPeople(data.data);
      }
    } else {
    }
  }, 500);

  return (
    <>
      <div
        onClick={() => setOpen((prev) => !prev)}
        className="group px-2 py-1 cursor-pointer border rounded-md flex items-center justify-between gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition"
      >
        <div className="flex items-center justify-center gap-x-2">
          <Search className="size-4 text-zinc-500 dark:text-zinc-300" />
          <h1 className="font-semibold max-w-max text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition">
            Search {pathname === "/dashboard" ? " Church" : " People"}
          </h1>
        </div>
        <kbd className="text-muted-foreground font-mono font-medium bg-muted border rounded px-2 flex items-center justify-center">
          <span className="text-xs">CTRL+</span>K
        </kbd>
      </div>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder={`Type to search ${
            pathname === "/dashboard" ? " Church" : " People"
          }`}
          onValueChange={(e) => debounced(e)}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {people.length ? (
            <CommandGroup heading="Suggestions">
              {people.map(({ _id, name }) => (
                <CommandItem key={_id}>{name}</CommandItem>
              ))}
            </CommandGroup>
          ) : (
            <></>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}

export default memo(CommandComponent);
