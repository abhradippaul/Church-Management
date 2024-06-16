"use client";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  memo,
  useContext,
  useState,
} from "react";

interface EventMonthValue {
  month: string;
  year: string;
}

interface EventInfoValue {
  name: string;
  description: string;
  date_day: number;
  date_month: number;
  date_year: number;
  time: string;
}

interface CreateContextValue {
  eventMonth: EventMonthValue | null;
  setEventMonth: Dispatch<SetStateAction<EventMonthValue | null>>;
  eventsInfo: EventInfoValue[];
  setEventsInfo: Dispatch<SetStateAction<EventInfoValue[]>>;
}

const CreateEventsContext = createContext<CreateContextValue>({
  eventMonth: null,
  setEventMonth: () => {},
  eventsInfo: [],
  setEventsInfo: () => {},
});

const CreateEventsContextProvider = CreateEventsContext.Provider;

export const useEventsContext = () => {
  return useContext(CreateEventsContext);
};

function EventsProvider({
  children,
  events,
}: {
  children: ReactNode;
  events: EventInfoValue[];
}) {
  const [eventMonth, setEventMonth] = useState<EventMonthValue | null>(null);
  const [eventsInfo, setEventsInfo] = useState<EventInfoValue[]>(events);
  return (
    <CreateEventsContextProvider
      value={{ eventMonth, setEventMonth, eventsInfo, setEventsInfo }}
    >
      {children}
    </CreateEventsContextProvider>
  );
}

export default memo(EventsProvider);
