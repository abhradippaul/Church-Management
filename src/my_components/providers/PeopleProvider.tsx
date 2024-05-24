"use client";

import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
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
  _id: string;
  name: string;
  email: string;
  date_of_birth: string;
}

function PeopleProvider({
  peopleInfo,
  children,
}: {
  peopleInfo: PeopleInfoProps[];
  children: ReactNode;
}) {
  const [isFormError, setIsFormError] = useState(false);
  return (
    <PeopleContextProvider value={{ peopleInfo, isFormError, setIsFormError }}>
      {children}
    </PeopleContextProvider>
  );
}

export default PeopleProvider;