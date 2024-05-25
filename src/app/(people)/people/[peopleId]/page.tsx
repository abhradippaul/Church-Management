"use client";

import { usePeopleContext } from "@/my_components/providers/PeopleProvider";

const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL;

function page() {
  const { peopleInfo } = usePeopleContext();

  const info = [
    {
      title: "Full Name",
      value: peopleInfo.name,
    },
    {
      title: "Email",
      value: peopleInfo.name,
    },
    {
      title: "Age",
      value:
        new Date().getFullYear() -
        new Date(peopleInfo.date_of_birth).getFullYear(),
    },
    {
      title: "Gender",
      value: peopleInfo.gender,
    },
    {
      title: "Phone Number",
      value: peopleInfo.phone_number,
    },
    {
      title: "Address",
      value: peopleInfo.address,
    },
  ];

  return (
    <>
      <div className="flex w-full flex-col items-center flex-grow md:flex-row">
        <div className="w-1/2 flex items-center justify-center">
          <img
            src={`${imageUrl}/w_250/q_25/f_auto/${peopleInfo.image}`}
            alt="user image"
            className="size-48 rounded-full object-cover"
          />
        </div>
        <div className="flex flex-col w-1/2">
          {info.map((e) => (
            <div className="px-6 py-4 flex" key={e.title}>
              <h1 className="mr-4">{e.title} :</h1>{" "}
              <p className="ml-4">{e.value}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default page;
