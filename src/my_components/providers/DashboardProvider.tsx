"use client";

import { ReactNode, createContext, memo, useContext } from "react";

interface EventsValue {
  name: string;
  date_day: number;
  date_month: number;
  date_year: number;
  time: string;
}

interface UserInfoValue {
  name: string;
  imageUrl: string;
  role: string;
}

interface DashboardContextValue {
  recentJoined: number;
  Events: EventsValue[];
  UserInfo: UserInfoValue | null;
}

const CreateDashboardContext = createContext<DashboardContextValue>({
  recentJoined: 0,
  Events: [],
  UserInfo: null,
});

const CreateDashboardProvider = CreateDashboardContext.Provider;

export const useDashboardContext = () => {
  return useContext(CreateDashboardContext);
};

function DashboardProvider({
  children,
  recentJoined,
  Events,
  UserInfo,
}: {
  children: ReactNode;
  recentJoined: number;
  Events: EventsValue[];
  UserInfo: UserInfoValue;
}) {
  return (
    <CreateDashboardProvider value={{ recentJoined, Events, UserInfo }}>
      {children}
    </CreateDashboardProvider>
  );
}

export default memo(DashboardProvider);
