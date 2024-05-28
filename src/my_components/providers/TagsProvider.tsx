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

interface TagsContextValue {
  dialogType: "tags" | "groups";
  setDialogType: Dispatch<SetStateAction<"tags" | "groups">>;
  isFormError: boolean;
  setIsFormError: Dispatch<SetStateAction<boolean>>;
  groupOptions:
    | {
        subItems: {
          trigger: string;
          _id: string;
        };
      }[]
    | [];
}

const CreateTagsContext = createContext<TagsContextValue>({
  dialogType: "tags",
  setDialogType: () => {},
  isFormError: false,
  setIsFormError: () => {},
  groupOptions: [],
});

const TagsContextProvider = CreateTagsContext.Provider;

export const useTagsContext = () => {
  return useContext(CreateTagsContext);
};

function TagsProvider({
  children,
  groupOptions,
}: {
  children: ReactNode;
  groupOptions:
    | {
        subItems: {
          trigger: string;
          _id: string;
        };
      }[]
    | [];
}) {
  const [isFormError, setIsFormError] = useState(false);
  const [dialogType, setDialogType] = useState<"tags" | "groups">("tags");
  return (
    <TagsContextProvider
      value={{
        dialogType,
        setDialogType,
        isFormError,
        setIsFormError,
        groupOptions,
      }}
    >
      {children}
    </TagsContextProvider>
  );
}

export default memo(TagsProvider);
