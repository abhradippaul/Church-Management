import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { memo } from "react";

interface NavigationMenuComponentProps {
  title: string;
  path: string;
}

function NavigationMenuComponent({
  props,
  heading,
}: {
  props: NavigationMenuComponentProps[];
  heading: string;
}) {
  return (
    <div className="flex flex-col gap-y-2 items-center">
      <h1 className="sm:text-lg my-2">{heading}</h1>
      {props.map(({ title, path }) => (
        <Link
          href={path}
          key={title}
          className="w-full text-lg sm:text-xl hover:bg-slate-800 transition py-2 px-4 rounded-lg"
        >
          {title}
        </Link>
      ))}
      <Separator />
    </div>
  );
}

export default memo(NavigationMenuComponent);
