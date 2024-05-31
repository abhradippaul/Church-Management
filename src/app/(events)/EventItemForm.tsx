import dynamic from "next/dynamic";
import { Form } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { memo, useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { string, z } from "zod";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import CreateEventSchema from "@/schema/CreateEventSchema";
import CustomDateInput from "@/my_components/Form/CustomDateInput";
import CustomTextArea from "@/my_components/Form/CustomTextArea";
import CustomSelectInput from "@/my_components/Form/CustomSelectInput";

const CustomFormInput = dynamic(
  () => import("@/my_components/Form/CustomFormInput")
);
const CustomComboBox = dynamic(() => import("@/components/CustomComboBox"));

interface TagsOptionValue {
  _id: string;
  name: string;
}

let hourArr = [] as { value: string; label: string }[];
for (let i = 0; i < 12; i++) {
  let newValue;
  if (i < 10) {
    newValue = String(`0${i}`);
  } else {
    newValue = String(i);
  }
  hourArr.push({
    value: newValue,
    label: newValue,
  });
}
let minArr = [] as { value: string; label: string }[];
for (let i = 0; i < 60; i += 10) {
  let newValue;
  if (i < 10) {
    newValue = String(`0${i}`);
  } else {
    newValue = String(i);
  }
  minArr.push({
    value: newValue,
    label: newValue,
  });
}

function EventItemForm() {
  const [tagsOption, setTagsIOption] = useState<TagsOptionValue[]>([]);
  const router = useRouter();
  let form = useForm<z.infer<typeof CreateEventSchema>>({
    resolver: zodResolver(CreateEventSchema),
    defaultValues: {
      name: "",
      tags: "",
      event_date: new Date(),
      event_hour: "00",
      event_minutes: "00",
      event_time: "am",
      event_description: "",
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
    (async () => {
      try {
        const { data } = await axios.get(`/api/v1/events/tags`);
        if (data.success) {
          let arr: any[] = data.data.Tag_Group.map((tag: any) => ({
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
          placeholder="Attach a tag"
          placeholderForEmptyValue="Tag not found"
          inputName="tags"
          label="Tag"
          disabled={form.formState.isSubmitting}
          options={tagsOption}
        />

        <div className="my-4"></div>
        <CustomDateInput
          control={form.control}
          inputName="event_date"
          label="Event Date"
        />

        <div className="my-4"></div>
        <div>
          <h1>Event time</h1>
          <CustomSelectInput
            control={form.control}
            inputName="event_hour"
            label="Hour"
            disabled={form.formState.isSubmitting}
            items={hourArr}
          />
          <CustomSelectInput
            control={form.control}
            inputName="event_minutes"
            label="Minutes"
            disabled={form.formState.isSubmitting}
            items={minArr}
          />
          <CustomSelectInput
            control={form.control}
            inputName="event_time"
            label="Time"
            disabled={form.formState.isSubmitting}
            items={[
              {
                value: "am",
                label: "am",
              },
              {
                value: "pm",
                label: "pm",
              },
            ]}
          />
        </div>

        <div className="my-4"></div>
        <CustomTextArea
          control={form.control}
          inputName="event_description"
          label="Event description"
          placeholder="Short description for the event"
          disabled={form.formState.isSubmitting}
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
