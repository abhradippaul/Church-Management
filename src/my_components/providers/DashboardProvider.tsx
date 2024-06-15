"use client";

import { ReactNode, createContext, memo, useContext } from "react";

interface EventsValue {
  name: string;
  date_day: number;
  date_month: number;
  date_year: number;
  time: string;
}
interface DashboardContextValue {
  recentJoined: number;
  Events: EventsValue[];
}

const CreateDashboardContext = createContext<DashboardContextValue>({
  recentJoined: 0,
  Events: [],
});

const CreateDashboardProvider = CreateDashboardContext.Provider;

export const useDashboardContext = () => {
  return useContext(CreateDashboardContext);
};

function DashboardProvider({
  children,
  recentJoined,
  Events,
}: {
  children: ReactNode;
  recentJoined: number;
  Events: EventsValue[];
}) {
  return (
    <CreateDashboardProvider value={{ recentJoined, Events }}>
      {children}
    </CreateDashboardProvider>
  );
}

export default memo(DashboardProvider);
