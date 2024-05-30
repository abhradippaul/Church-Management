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

interface ItemValue {
  _id: string;
  name: string;
}

interface TagsContextValue {
  dialogType: "tags" | "groups";
  setDialogType: Dispatch<SetStateAction<"tags" | "groups">>;
  isFormError: boolean;
  setIsFormError: Dispatch<SetStateAction<boolean>>;
  groupOptions: {
    SubItem: {
      _id: string;
      name: string;
    }[];
  }[];
  tagsInfo: ItemValue[];
}

const CreateTagsContext = createContext<TagsContextValue>({
  dialogType: "tags",
  setDialogType: () => {},
  isFormError: false,
  setIsFormError: () => {},
  groupOptions: [],
  tagsInfo: [],
});

const TagsContextProvider = CreateTagsContext.Provider;

export const useTagsContext = () => {
  return useContext(CreateTagsContext);
};

function TagsProvider({
  children,
  groupOptions,
  tagsInfo,
}: {
  children: ReactNode;
  tagsInfo: ItemValue[];
  groupOptions: {
    SubItem: {
      _id: string;
      name: string;
    }[];
  }[];
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
        tagsInfo,
      }}
    >
      {children}
    </TagsContextProvider>
  );
}

export default memo(TagsProvider);
