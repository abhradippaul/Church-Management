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

interface CreatePeopleContextValue {
  peopleInfo: any;
  isFormError: boolean;
  setIsFormError: Dispatch<SetStateAction<boolean>>;
  tagInfo?: {
    _id: string;
    name: string;
  };
  PeopleCount?: number;
  filterOptions: FilterOptionsValue;
  setFilterOptions: Dispatch<SetStateAction<FilterOptionsValue>>;
}

const CreatePeopleContext = createContext<CreatePeopleContextValue>({
  peopleInfo: null,
  isFormError: false,
  setIsFormError: () => {},
  tagInfo: undefined,
  PeopleCount: 0,
  filterOptions: {},
  setFilterOptions: () => {},
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
  return (
    <PeopleContextProvider
      value={{
        peopleInfo,
        isFormError,
        setIsFormError,
        tagInfo,
        PeopleCount,
        filterOptions,
        setFilterOptions,
      }}
    >
      {children}
    </PeopleContextProvider>
  );
}

export default memo(PeopleProvider);
