"use client";
import { useEffect, useState } from "react";
import EventCalender from "../EventCalender";

function page() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) {
    return null;
  }
  return (
    <div>
      <EventCalender />
    </div>
  );
}

export default page;
