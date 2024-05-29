import clsx from "clsx";
import {
  eachDayOfInterval,
  endOfMonth,
  format,
  getDate,
  getDay,
  isToday,
  startOfMonth,
} from "date-fns";

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
              "border rounded-md px-2 text-center text-zinc-200",
              {
                "bg-gray-900": isToday(day),
                "text-white": isToday(day),
              }
            )}
          >
            {format(day, "d")}
          </div>
        ))}
      </div>
    </div>
  );
}

export default EventCalender;
