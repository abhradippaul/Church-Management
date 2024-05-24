"use client";
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
import { usePeopleContext } from "@/my_components/providers/PeopleProvider";

const TooltipComponent = dynamic(() => import("./TooltipComponent"));

interface TableComponentProps {
  type: "people";
  tableHeading: string[];
  // tableRow: {
  //   imageUrl: string;
  //   name: string;
  //   email: string;
  //   age: string;
  // }[];
}

interface PeopleInfoValue {
  _id: string;
  name: string;
  email: string;
  date_of_birth: string;
}

function TableComponent({ tableHeading }: TableComponentProps) {
  const { peopleInfo } = usePeopleContext();
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
        {peopleInfo.map(
          ({ email, name, date_of_birth }: PeopleInfoValue, i: number) => (
            <TableRow key={i} className="cursor-pointer">
              <TableCell>
                {/* {imageUrl} */}
                {name}
              </TableCell>
              <TableCell>{email}</TableCell>
              <TableCell>
                {new Date().getFullYear() -
                  new Date(date_of_birth).getFullYear()}
              </TableCell>
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
          )
        )}
      </TableBody>
    </Table>
  );
}

export default memo(TableComponent);
