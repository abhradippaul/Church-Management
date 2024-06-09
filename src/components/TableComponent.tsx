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
import { memo, useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { usePeopleContext } from "@/my_components/providers/PeopleProvider";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const TooltipComponent = dynamic(() => import("./TooltipComponent"));
const AlertDialogComponent = dynamic(() => import("./AlertDialogComponent"));

interface TableComponentProps {
  type: "people" | "tagpeople";
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
  image: string;
}

function TableComponent({ tableHeading, type }: TableComponentProps) {
  const { peopleInfo: info, tagInfo, filterOptions } = usePeopleContext();
  const [peopleInfo, setPeopleInfo] = useState(info);
  const router = useRouter();

  const deletePeople = useCallback(async (id: string) => {
    try {
      if (type == "people") {
        const { data } = await axios.delete(`/api/v1/people?peopleId=${id}`);
        if (data.success) {
          router.refresh();
        } else {
          console.log(data);
        }
      } else if (type === "tagpeople") {
        const { data } = await axios.delete(
          `/api/v1/tags?peopleId=${id}&tagId=${tagInfo?._id}`
        );
        if (data.success) {
          router.refresh();
        } else {
          console.log(data);
        }
      }
    } catch (err: any) {
      console.log(err.message);
    }
  }, []);

  const methodForFilterRequest = useCallback(async () => {
    try {
      if (filterOptions.gender || filterOptions.order) {
        const { data } = await axios.get(
          `/api/v1/people?page=${0}&gender=${filterOptions.gender}`
        );
        console.log(data);
        if (data.success) {
          setPeopleInfo(data.data.Peoples);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }, [filterOptions]);

  const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL;

  useEffect(() => {
    methodForFilterRequest();
  }, [filterOptions]);

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
          ({ email, name, date_of_birth, _id, image }: PeopleInfoValue) => (
            <TableRow
              key={_id}
              className="cursor-pointer"
              onClick={() => router.push(`/people/${_id}`)}
            >
              <TableCell>
                <div className="flex items-center">
                  <Avatar className="mr-4">
                    <AvatarImage
                      src={`${imageUrl}/w_250/q_25/f_auto/${image}`}
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  {name}
                </div>
              </TableCell>
              <TableCell>{email}</TableCell>
              <TableCell>
                {new Date().getFullYear() -
                  new Date(date_of_birth).getFullYear()}
              </TableCell>
              <TableCell>
                <AlertDialogComponent
                  description={
                    type === "people"
                      ? `Data of ${name} will be permanently deleted.`
                      : `Delete the people ${name} from the tag ${tagInfo?.name}.`
                  }
                  title={
                    type === "tagpeople"
                      ? `Are you want to delete the user from the ${tagInfo?.name}`
                      : `Are you want to delete ${name} ?`
                  }
                  _id={_id}
                  onActionClick={deletePeople}
                  trigger={
                    <TooltipComponent
                      hoverElement={
                        <Trash className="size-4 text-red-700 hover:text-red-600 transition" />
                      }
                    >
                      <div>
                        {type === "people" && <h1>Delete People</h1>}
                        {type === "tagpeople" && <h1>Delete From the tag</h1>}
                      </div>
                    </TooltipComponent>
                  }
                />
              </TableCell>
            </TableRow>
          )
        )}
      </TableBody>
    </Table>
  );
}

export default memo(TableComponent);
