import dynamic from "next/dynamic";
import { Form } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import CreateTagItemSchema from "@/schema/CreateTagItemSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { memo, useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useTagsContext } from "../providers/TagsProvider";

const CustomFormInput = dynamic(() => import("./CustomFormInput"));
const CustomComboBox = dynamic(() => import("@/components/CustomComboBox"));

function TagItemForm() {
  const router = useRouter();
  const { dialogType, groupOptions, tagIdForUpdate, tagsInfo } =
    useTagsContext();
  const tagInfo = useMemo(
    () => tagsInfo.find(({ _id }) => _id === tagIdForUpdate),
    [tagIdForUpdate, dialogType]
  );
  // ||
  // useMemo(
  //   () =>
  //     groupOptions.find(({ SubItem }) =>
  //       SubItem.find(({ _id }) => _id === tagIdForUpdate)
  //     ),
  //   [tagIdForUpdate]
  // );

  let form = useForm<z.infer<typeof CreateTagItemSchema>>({
    resolver: zodResolver(CreateTagItemSchema),
    defaultValues: {
      name: tagInfo?.name || "",
      group: "",
    },
  });

  const onSubmit = useCallback(
    async (values: z.infer<typeof CreateTagItemSchema>) => {
      try {
        if (tagIdForUpdate) {
          const { data } = await axios.put(
            `/api/v1/tags/tag-item?tagItem=${tagIdForUpdate}`,
            values
          );
          if (data.success) {
            router.refresh();
          } else {
            toast({
              title: "Error",
              description: data.message,
            });
          }
        } else {
          const { data } = await axios.post(
            `/api/v1/tags/${dialogType === "tags" ? "tag-item" : "tag-group"}`,
            values
          );
          if (data.success) {
            router.refresh();
          } else {
            toast({
              title: "Error",
              description: data.message,
            });
          }
        }
      } catch (err: any) {
        toast({
          title: "Error",
          description: err?.response?.data?.message,
        });
      }
    },
    [tagIdForUpdate, dialogType]
  );

  const methodForUseEffect = useCallback(() => {
    const error = form.formState.errors;

    if (error) {
      if (error.name?.message) {
        toast({
          title: "Error in email field",
          description: error.name?.message,
        });
      }
    }
  }, [form.formState.errors]);

  useEffect(methodForUseEffect, [form.formState.errors]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CustomFormInput
          control={form.control}
          inputName="name"
          label="Tag Name"
          type="text"
          placeholder="Enter a tag name"
          disabled={form.formState.isSubmitting}
        />
        <div className="my-4"></div>
        {dialogType === "tags" && (
          <CustomComboBox
            control={form.control}
            placeholder="Attach a group"
            placeholderForEmptyValue="Group not found"
            inputName="group"
            label="Group"
            disabled={form.formState.isSubmitting}
            options={groupOptions}
          />
        )}

        <Button variant="secondary" size="lg" className="text-lg mt-8">
          {form.formState.isSubmitting ? (
            <Loader2 className="size-6 animate-spin" />
          ) : tagIdForUpdate ? (
            "Update"
          ) : (
            "Submit"
          )}
        </Button>
      </form>
    </Form>
  );
}

export default memo(TagItemForm);
