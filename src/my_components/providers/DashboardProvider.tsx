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

interface EventInfoValue {
  name: string;
  description: string;
  date_day: number;
  date_month: number;
  date_year: number;
  time: string;
  Tag_Name: string;
  _id: string;
}

interface UserInfoValue {
  name: string;
  imageUrl: string;
  role: string;
}

interface DashboardContextValue {
  recentJoined: number;
  Events: EventInfoValue[];
  UserInfo: UserInfoValue | null;
  PaymentAmount: number;
}

const CreateDashboardContext = createContext<DashboardContextValue>({
  recentJoined: 0,
  Events: [],
  UserInfo: null,
  PaymentAmount: 0,
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
  PaymentAmount,
}: {
  children: ReactNode;
  recentJoined: number;
  Events: EventInfoValue[];
  UserInfo: UserInfoValue;
  PaymentAmount: number;
}) {
  return (
    <CreateDashboardProvider
      value={{
        recentJoined,
        Events,
        UserInfo,
        PaymentAmount,
      }}
    >
      {children}
    </CreateDashboardProvider>
  );
}

export default memo(DashboardProvider);
