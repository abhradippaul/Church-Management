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

interface CreatePeopleContextValue {
  peopleInfo: any;
  isFormError: boolean;
  setIsFormError: Dispatch<SetStateAction<boolean>>;
}

const CreatePeopleContext = createContext<CreatePeopleContextValue>({
  peopleInfo: null,
  isFormError: false,
  setIsFormError: () => {},
});

const PeopleContextProvider = CreatePeopleContext.Provider;

export const usePeopleContext = () => {
  return useContext(CreatePeopleContext);
};

interface PeopleInfoProps {
  PeopleCount: number;
  Peoples: {
    _id: string;
    name: string;
    email: string;
    date_of_birth: string;
    image: string;
  }[];
}

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
}: {
  peopleInfo: PeopleInfoProps | SpecificPeople;
  children: ReactNode;
}) {
  const [isFormError, setIsFormError] = useState(false);
  return (
    <PeopleContextProvider value={{ peopleInfo, isFormError, setIsFormError }}>
      {children}
    </PeopleContextProvider>
  );
}

export default memo(PeopleProvider);
