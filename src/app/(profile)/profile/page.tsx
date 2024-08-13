"use client";
import { useProfileContext } from "@/my_components/providers/ProfileProvider";
import { Mail, MapPin, Phone, UserRound } from "lucide-react";
import { memo } from "react";

const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL;

function ProfilePage() {
  const { UserInfo } = useProfileContext();
  const peopleInfo =
    UserInfo?.role === "people"
      ? [
          {
            title: <Phone />,
            value: UserInfo?.phone_number,
          },
          {
            title: <Mail />,
            value: UserInfo?.email,
          },
          {
            title: <UserRound />,
            value:
              new Date().getFullYear() -
              new Date(UserInfo.date_of_birth || "").getFullYear(),
          },
          {
            title: <UserRound />,
            value: UserInfo.gender,
          },
          {
            title: <MapPin />,
            value: UserInfo.address,
          },
        ]
      : [
          {
            title: <Mail />,
            value: UserInfo?.email,
          },
        ];
  return (
    <div className="flex w-full flex-col items-center flex-grow md:flex-row">
      <div className="w-1/2 flex items-center justify-center">
        <img
          src={`${imageUrl}/w_250/q_25/f_auto/${UserInfo?.imageUrl}`}
          alt="user image"
          className="size-48 rounded-full object-cover"
        />
      </div>
      <div className="flex flex-col w-1/2">
        <h1 className="text-xl font-semibold text-zinc-700 mb-4">
          {UserInfo?.name}
        </h1>
        {peopleInfo.map(({ title, value }) => (
          <div className="px-2 py-4 flex" key={value}>
            {title}
            <p className="ml-4">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(ProfilePage);
