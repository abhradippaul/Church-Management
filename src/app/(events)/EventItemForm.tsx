import dynamic from "next/dynamic";
import { Form } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import CreateEventSchema from "@/schema/CreateEventSchema";

const CustomFormInput = dynamic(
  () => import("@/my_components/Form/CustomFormInput")
);
const CustomComboBox = dynamic(() => import("@/components/CustomComboBox"));

function EventItemForm() {
  const [tagsOption, setTagsIOption] = useState([]);
  const router = useRouter();
  let form = useForm<z.infer<typeof CreateEventSchema>>({
    resolver: zodResolver(CreateEventSchema),
    defaultValues: {
      name: "",
      tags: "",
    },
  });

  const onSubmit = useCallback(
    async (values: z.infer<typeof CreateEventSchema>) => {
      console.log(values);
      //   try {
      //     const { data } = await axios.post(
      //       `/api/v1/tags/${dialogType === "tags" ? "tag-item" : "tag-group"}`,
      //       values
      //     );
      //     if (data.success) {
      //       router.refresh();
      //     } else {
      //       toast({
      //         title: "Error",
      //         description: data.message,
      //       });
      //     }
      //   } catch (err: any) {
      //     toast({
      //       title: "Error",
      //       description: err?.response?.data?.message,
      //     });
      //   }
    },
    []
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
  useEffect(() => {
    console.log("Form is loaded successfully");
    (async () => {
      try {
        const { data } = await axios.get(`/api/v1/events/tags`);
        if (data.success) {
          //   setTagsIOption(data.data);
          console.log(data);
          let arr: any[] = data.data.Tag_Group.map((tag) => ({
            _id: tag.Tag_Item._id,
            name: tag.Tag_Item.name,
          }));
          arr = [...arr, ...data.data.Tags_Item];
          setTagsIOption(arr);
        }
      } catch (err: any) {
        toast({
          title: "Error",
          description: err?.response?.data?.message,
        });
      }
    })();
  }, []);
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

        <CustomComboBox
          control={form.control}
          placeholder="Attach a group"
          placeholderForEmptyValue="Group not found"
          inputName="group"
          label="Group"
          disabled={form.formState.isSubmitting}
          options={tagsOption}
        />

        <Button variant="secondary" size="lg" className="text-lg mt-8">
          {form.formState.isSubmitting ? (
            <Loader2 className="size-6 animate-spin" />
          ) : (
            "Submit"
          )}
        </Button>
      </form>
    </Form>
  );
}

export default memo(EventItemForm);
