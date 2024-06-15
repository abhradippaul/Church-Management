"use client";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
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
  events: EventInfoValue[];
}

const CreateEventsContext = createContext<CreateContextValue>({
  eventMonth: null,
  setEventMonth: () => {},
  events: [],
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
  return (
    <CreateEventsContextProvider value={{ eventMonth, setEventMonth, events }}>
      {children}
    </CreateEventsContextProvider>
  );
}

export default EventsProvider;
