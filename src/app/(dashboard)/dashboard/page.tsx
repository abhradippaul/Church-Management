"use client";

import { useDashboardContext } from "@/my_components/providers/DashboardProvider";

function DashboardPage() {
  const { recentJoined, Events, UserInfo } = useDashboardContext();
  return (
    <div className="pt-24">
      <h1 className="mb-8">This is our dashboard page</h1>
      <div className="flex items-center justify-between gap-y-4 flex-col md:flex-row">
        {UserInfo?.role !== "people" && (
          <div className="size-48 flex flex-col border rounded-md">
            <h1 className="bg-gray-900 p-2">People Added in the Last 7 Days</h1>
            <div className="size-full flex items-center justify-center">
              {recentJoined}
            </div>
          </div>
        )}
        <div
          className={`flex flex-col items-center justify-center border rounded-md ${
            UserInfo?.role !== "people" ? "w-[90%] md:w-1/2" : "w-full"
          }`}
        >
          <h1 className="text-xl my-4">Upcoming Events</h1>
          {Events.map(
            ({ name, time, date_day, date_month, date_year, Tag_Name }) => (
              <div
                className="w-full bg-gray-900 my-2 p-2 flex items-center justify-between"
                key={name}
              >
                <h1>{name}</h1>
                <p>({Tag_Name})</p>
                <p>
                  {new Date(
                    `${date_month}-${date_day}-${date_year}`
                  ).toDateString()}
                </p>
                <p>{time}</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
