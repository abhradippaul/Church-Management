"use client";
import { useEventsContext } from "@/my_components/providers/EventsProvider";
import clsx from "clsx";
import {
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isToday,
  startOfMonth,
} from "date-fns";
import { memo } from "react";

const WeekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function EventCalender() {
  const currentDate = new Date();
  const firstDayOfMonth = startOfMonth(currentDate);
  const lastDayOfMonth = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({
    start: firstDayOfMonth,
    end: lastDayOfMonth,
  });
  const startingDayIndex = getDay(firstDayOfMonth);
  const { events } = useEventsContext();
  console.log(events);
  return (
    <div className="mt-4">
      <div className="text-center text-2xl font-semibold text-zinc-300">
        {format(currentDate, "MMMM yyyy")}
      </div>
      <div className="grid grid-cols-7 gap-2 mt-8">
        {WeekDays.map((day, i) => (
          <div key={day} className="font-bold text-center">
            {day}
          </div>
        ))}
        {Array.from({ length: startingDayIndex }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {daysInMonth.map((day, i) => (
          <div
            key={i}
            className={clsx(
              "border rounded-md px-2 text-center overflow-hidden text-zinc-200 max-h-24 hover:overflow-y-auto scroll-smooth",
              {
                "bg-gray-900": isToday(day),
                "text-white": isToday(day),
              }
            )}
          >
            {format(day, "d")}
            {events.length ? (
              events.map(
                ({ name, description, date_day, time }) =>
                  date_day === Number(format(day, "d")) && (
                    <div
                      key={description}
                      className="my-2 w-full flex flex-wrap text-xs items-center justify-center gap-x-4 bg-blue-800 rounded-md"
                    >
                      <p>{name}</p>
                      <p>{time}</p>
                    </div>
                  )
              )
            ) : (
              <></>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(EventCalender);
