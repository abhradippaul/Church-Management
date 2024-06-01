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
    _id: string;
    name: string;
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
        {content.map(({ _id, name }) => (
          <AccordionContent key={_id}>
            <Link href={`/tags/${_id}`}>{name}</Link>
          </AccordionContent>
        ))}
      </AccordionItem>
    </Accordion>
  );
}

export default memo(AccordionComponent);
