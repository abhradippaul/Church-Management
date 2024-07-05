"use client";

import { usePeopleContext } from "@/my_components/providers/PeopleProvider";
import {
  Banknote,
  Loader2,
  Mail,
  MapPin,
  Phone,
  TagsIcon,
  UserRound,
} from "lucide-react";

const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL;

function Page() {
  const { peopleInfo, TotalPayment, Tags } = usePeopleContext();

  const info = [
    {
      title: <Phone />,
      value: peopleInfo.phone_number,
    },
    {
      title: <Mail />,
      value: peopleInfo.email,
    },
    {
      title: <UserRound />,
      value:
        new Date().getFullYear() -
        new Date(peopleInfo.date_of_birth).getFullYear(),
    },
    {
      title: <UserRound />,
      value: peopleInfo.gender,
    },
    {
      title: <MapPin />,
      value: peopleInfo.address,
    },
    {
      title: <Banknote />,
      value: TotalPayment,
    },
  ];

  return (
    <div className="flex w-full flex-col items-center md:flex-row justify-center h-full">
      <div className="w-1/2 flex items-center justify-center">
        <img
          src={`${imageUrl}/w_250/q_25/f_auto/${peopleInfo.image}`}
          alt="user image"
          className="size-48 rounded-full object-cover"
        />
      </div>
      <div className="flex flex-col w-1/2">
        <h1 className="text-xl font-semibold text-zinc-300 mb-4">
          {peopleInfo.name}
        </h1>
        {info.map((e) => (
          <div className="px-2 py-4 flex" key={e.value}>
            {e.title}
            <p className="ml-4">{e.value}</p>
          </div>
        ))}
        <div className="px-2 py-4 flex">
          <TagsIcon className="mr-4" />
          {Tags?.map(({ _id, name }, i) => (
            <span key={_id} className="mr-1">
              {name} {Tags.length - 1 !== i && ","}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Page;
