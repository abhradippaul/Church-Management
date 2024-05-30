import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { memo } from "react";

interface AccordionComponentProps {
  itemKey: string;
  trigger: string;
  content: {
    item: string;
    path: string;
  }[];
}

function AccordionComponent({
  content,
  itemKey,
  trigger,
}: AccordionComponentProps) {
  return (
    <Accordion type="multiple">
      <AccordionItem value={itemKey}>
        <AccordionTrigger>{trigger}</AccordionTrigger>
        {content.map(({ item, path }) => (
          <AccordionContent key={path}>
            <Link href={`${path}`}>{item}</Link>
          </AccordionContent>
        ))}
      </AccordionItem>
    </Accordion>
  );
}

export default memo(AccordionComponent);
