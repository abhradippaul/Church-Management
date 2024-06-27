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

interface FilterOptionsValue {
  gender?: "male" | "female" | "others" | null;
  order?: "recent" | "oldest" | null;
}

interface PeopleInfoForMessage {
  _id: string;
  name: string;
  imageUrl: string;
  isChatLoading: boolean;
  chatDetails?: {
    _id: string;
    message: string;
    createdAt: string;
    receiver: string;
  }[];
}

interface CreatePeopleContextValue {
  peopleInfo: any;
  isFormError: boolean;
  setIsFormError: Dispatch<SetStateAction<boolean>>;
  tagInfo?: {
    _id: string;
    name: string;
  };
  filterOptions: FilterOptionsValue;
  setFilterOptions: Dispatch<SetStateAction<FilterOptionsValue>>;
  peopleCount: number | undefined;
  setPeopleCount: Dispatch<SetStateAction<number | undefined>>;
  isChatSheetOpen: boolean;
  setIsChatSheetOpen: Dispatch<SetStateAction<boolean>>;
  chatInfo: PeopleInfoForMessage | null;
  setChatInfo: Dispatch<SetStateAction<PeopleInfoForMessage | null>>;
}

const CreatePeopleContext = createContext<CreatePeopleContextValue>({
  peopleInfo: null,
  isFormError: false,
  setIsFormError: () => {},
  tagInfo: undefined,
  filterOptions: {},
  setFilterOptions: () => {},
  peopleCount: 0,
  setPeopleCount: () => {},
  isChatSheetOpen: false,
  setIsChatSheetOpen: () => {},
  chatInfo: null,
  setChatInfo: () => {},
});

const PeopleContextProvider = CreatePeopleContext.Provider;

export const usePeopleContext = () => {
  return useContext(CreatePeopleContext);
};

interface PeopleInfoProps {
  _id: string;
  name: string;
  email: string;
  date_of_birth: string;
  image: string;
}
[];

interface SpecificPeople {
  _id: string;
  name: string;
  email: string;
  date_of_birth: string;
  phone_number: string;
  gender: string;
  address: string;
  image: string;
}

function PeopleProvider({
  peopleInfo,
  children,
  tagInfo,
  PeopleCount,
}: {
  peopleInfo: PeopleInfoProps | SpecificPeople;
  children: ReactNode;
  PeopleCount?: number;
  tagInfo?: {
    _id: string;
    name: string;
  };
}) {
  const [isFormError, setIsFormError] = useState(false);
  const [filterOptions, setFilterOptions] = useState<FilterOptionsValue>({});
  const [peopleCount, setPeopleCount] = useState<number | undefined>(
    PeopleCount
  );
  const [isChatSheetOpen, setIsChatSheetOpen] = useState<boolean>(false);
  const [chatInfo, setChatInfo] = useState<PeopleInfoForMessage | null>(null);
  return (
    <PeopleContextProvider
      value={{
        peopleInfo,
        isFormError,
        setIsFormError,
        tagInfo,
        peopleCount,
        setPeopleCount,
        filterOptions,
        setFilterOptions,
        isChatSheetOpen,
        setIsChatSheetOpen,
        chatInfo,
        setChatInfo,
      }}
    >
      {children}
    </PeopleContextProvider>
  );
}

export default memo(PeopleProvider);
