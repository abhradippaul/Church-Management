import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash } from "lucide-react";
import { memo } from "react";
import dynamic from "next/dynamic";

const TooltipComponent = dynamic(() => import("./TooltipComponent"));

interface TableComponentProps {
  type: "people";
  tableHeading: string[];
  tableRow: {
    imageUrl: string;
    name: string;
    email: string;
    age: string;
  }[];
}

function TableComponent({ tableHeading, tableRow }: TableComponentProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {tableHeading.map((row) => (
            <TableHead key={row}>{row}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {tableRow.map(({ email, imageUrl, name, age }, i) => (
          <TableRow key={i} className="cursor-pointer">
            <TableCell>
              {imageUrl}
              {name}
            </TableCell>
            <TableCell>{email}</TableCell>
            <TableCell>{age}</TableCell>
            <TableCell>
              <TooltipComponent
                hoverElement={
                  <Trash className="size-4 text-red-700 hover:text-red-600 transition" />
                }
              >
                <h1>Delete People</h1>
              </TooltipComponent>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default memo(TableComponent);
