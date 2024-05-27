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
  dialogType: "tags" | "groups" | null;
  setDialogType: Dispatch<SetStateAction<"tags" | "groups" | null>>;
  isFormError: boolean;
  setIsFormError: Dispatch<SetStateAction<boolean>>;
}

const CreateTagsContext = createContext<TagsContextValue>({
  dialogType: null,
  setDialogType: () => {},
  isFormError: false,
  setIsFormError: () => {},
});

const TagsContextProvider = CreateTagsContext.Provider;

export const useTagsContext = () => {
  return useContext(CreateTagsContext);
};

function TagsProvider({ children }: { children: ReactNode }) {
  const [isFormError, setIsFormError] = useState(false);
  const [dialogType, setDialogType] = useState<"tags" | "groups" | null>(null);
  return (
    <TagsContextProvider
      value={{ dialogType, setDialogType, isFormError, setIsFormError }}
    >
      {children}
    </TagsContextProvider>
  );
}

export default memo(TagsProvider);
