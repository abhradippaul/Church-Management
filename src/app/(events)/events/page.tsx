"use client";
import { useEffect, useState } from "react";
import EventCalender from "../EventCalender";
import TableComponentForEvents from "@/components/TableComponentForEvents";
import { useEventsContext } from "@/my_components/providers/EventsProvider";
function page() {
  const [isMounted, setIsMounted] = useState(false);
  const { eventsInfo } = useEventsContext();

  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) {
    return null;
  }
  return (
    <div>
      <EventCalender />
      <TableComponentForEvents Events={eventsInfo} />
    </div>
  );
}

export default page;
