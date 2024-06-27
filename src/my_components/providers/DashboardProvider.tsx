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

interface ChurchInfoForMessage {
  name?: string;
  imageUrl?: string;
  isChatLoading: boolean;
  chatDetails?: {
    _id: string;
    message: string;
    createdAt: string;
    receiver: string;
  }[];
}

interface UserInfoValue {
  _id: string;
  name: string;
  imageUrl: string;
  role: string;
}

interface DashboardContextValue {
  recentJoined: number;
  Events: EventInfoValue[];
  UserInfo: UserInfoValue | null;
  PaymentAmount: number;
  isChatSheetOpen: boolean;
  setIsChatSheetOpen: Dispatch<SetStateAction<boolean>>;
  chatInfo: ChurchInfoForMessage | null;
  setChatInfo: Dispatch<SetStateAction<ChurchInfoForMessage | null>>;
}

const CreateDashboardContext = createContext<DashboardContextValue>({
  recentJoined: 0,
  Events: [],
  UserInfo: null,
  PaymentAmount: 0,
  isChatSheetOpen: false,
  setIsChatSheetOpen: () => {},
  chatInfo: null,
  setChatInfo: () => {},
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
  const [isChatSheetOpen, setIsChatSheetOpen] = useState<boolean>(false);
  const [chatInfo, setChatInfo] = useState<ChurchInfoForMessage | null>(null);
  return (
    <CreateDashboardProvider
      value={{
        recentJoined,
        Events,
        UserInfo,
        PaymentAmount,
        chatInfo,
        isChatSheetOpen,
        setIsChatSheetOpen,
        setChatInfo,
      }}
    >
      {children}
    </CreateDashboardProvider>
  );
}

export default memo(DashboardProvider);
