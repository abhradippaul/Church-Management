"use client";

import TooltipComponent from "@/components/TooltipComponent";
import { Button } from "@/components/ui/button";
import { useEventsContext } from "@/my_components/providers/EventsProvider";
import axios from "axios";
import clsx from "clsx";
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isToday,
  parse,
} from "date-fns";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { memo, useCallback, useEffect, useState } from "react";

const WeekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function EventCalender() {
  const currentDate = new Date();
  const [currentMonth, setCurrentMonth] = useState(
    format(currentDate, "MMM-yyyy")
  );
  const [month, setMonth] = useState(new Date().getMonth());
  const firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());
  const daysInMonth = eachDayOfInterval({
    start: firstDayCurrentMonth,
    end: endOfMonth(firstDayCurrentMonth),
  });
  const startingDayIndex = getDay(firstDayCurrentMonth);
  const { eventsInfo: events, setEventsInfo } = useEventsContext();

  const previousMonth = useCallback(async () => {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
    setMonth((prev) => prev - 1);
    const { data } = await axios.get(`/api/v1/events?month=${month - 1}`);
    if (data.success) {
      setEventsInfo(data.data.Events);
    }
  }, [month]);

  const nextMonth = useCallback(async () => {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
    setMonth((prev) => prev + 1);
    const { data } = await axios.get(`/api/v1/events?month=${month + 1}`);
    if (data.success) {
      setEventsInfo(data.data.Events);
    }
  }, [month]);

  useEffect(() => {}, [currentMonth]);

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between">
        <TooltipComponent
          hoverElement={
            <Button variant="outline" onClick={previousMonth}>
              <ArrowLeft className="size-6" />
            </Button>
          }
        >
          <p>Previous month</p>
        </TooltipComponent>
        <h1 className="text-2xl font-semibold text-zinc-300">
          {format(currentMonth, "MMMM yyyy")}
        </h1>
        <TooltipComponent
          hoverElement={
            <Button variant="outline" onClick={nextMonth}>
              <ArrowRight className="size-6" />
            </Button>
          }
        >
          <p>Next month</p>
        </TooltipComponent>
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
              "border rounded-md px-2 text-center overflow-hidden text-zinc-200 h-20 hover:overflow-y-auto scroll-smooth",
              {
                "bg-gray-900": isToday(day),
                "text-white": isToday(day),
              }
            )}
          >
            {format(day, "d")}
            {events.length ? (
              events.map(
                ({ name, description, date_day, date_month, time }) =>
                  date_day === Number(format(day, "d")) &&
                  new Date(currentMonth).getMonth() === date_month && (
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
