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

interface CreateContextValue {
  eventMonth: EventMonthValue | null;
  setEventMonth: Dispatch<SetStateAction<EventMonthValue | null>>;
}

const CreateEventsContext = createContext<CreateContextValue>({
  eventMonth: null,
  setEventMonth: () => {},
});

const CreateEventsContextProvider = CreateEventsContext.Provider;

export const useEventsContext = () => {
  return useContext(CreateEventsContext);
};

function EventsProvider({ children }: { children: ReactNode }) {
  const [eventMonth, setEventMonth] = useState<EventMonthValue | null>(null);
  return (
    <CreateEventsContextProvider value={{ eventMonth, setEventMonth }}>
      {children}
    </CreateEventsContextProvider>
  );
}

export default EventsProvider;
