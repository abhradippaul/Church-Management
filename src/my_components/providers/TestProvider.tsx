"use client";

import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

interface CreateTestContextValue {
  test: string;
  //   setTest: Dispatch<SetStateAction<string>>;
}

const CreateTestContext = createContext<CreateTestContextValue>({
  test: "",
  //   setTest: () => {},
});

const TestContextProvider = CreateTestContext.Provider;

export const useTestContext = () => {
  return useContext(CreateTestContext);
};

function TestProvider({
  props,
  children,
}: {
  props: string;
  children: ReactNode;
}) {
  //   const [test, setTest] = useState(props);
  const test = props;
  return <TestContextProvider value={{ test }}>{children}</TestContextProvider>;
}

export default TestProvider;
