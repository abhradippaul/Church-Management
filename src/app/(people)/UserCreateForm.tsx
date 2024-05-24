"use client";

import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import CreateUserSchema from "@/schema/CreateUserSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { memo, useCallback, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { usePeopleContext } from "@/my_components/providers/PeopleProvider";
import axios from "axios";
import { useRouter } from "next/navigation";

const CustomSelectImput = dynamic(
  () => import("@/my_components/Form/CustomSelectInput")
);
const CustomFormInput = dynamic(
  () => import("@/my_components/Form/CustomFormInput")
);
const CustomDateInput = dynamic(
  () => import("@/my_components/Form/CustomDateInput")
);
const CustomTextArea = dynamic(
  () => import("@/my_components/Form/CustomTextArea")
);

const CreateUserFormValue = [
  {
    label: "User Name",
    inputName: "name",
    type: "text",
    placeholder: "Enter a name",
    autoComplete: "name",
  },
  {
    label: "User Email",
    inputName: "email",
    type: "email",
    placeholder: "Enter an email",
    autoComplete: "email",
  },
  {
    label: "Phone Number",
    inputName: "phone_number",
    type: "number",
    placeholder: "Enter a ph no",
    autoComplete: "phone number",
  },
];

const itemsForSelectInput = [
  {
    label: "Male",
    value: "male",
  },
  {
    label: "Female",
    value: "female",
  },
  {
    label: "Others",
    value: "other",
  },
];

function UserCreateForm() {
  const { setIsFormError } = usePeopleContext();
  const router = useRouter();
  const form = useForm<z.infer<typeof CreateUserSchema>>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      name: "",
      email: "",
      phone_number: "",
      gender: "",
      address: "",
    },
  });
  const onSubmit = useCallback(
    async (values: z.infer<typeof CreateUserSchema>) => {
      try {
        const { data } = await axios.post("/api/v1/people", values);
        if (data.success) {
          router.refresh();
        } else {
          setIsFormError(true);
          toast({
            title: "Error",
            description: data.message,
          });
        }
      } catch (err: any) {
        setIsFormError(true);
        toast({
          title: "Error",
          description: err.message,
        });
      }
    },
    []
  );

  const methodForUseEffect = useCallback(() => {
    const error = form.formState.errors;
    Object.values(error).forEach((value) => {
      if (value?.message) {
        setIsFormError(true);
      }
      toast({
        title: "Error",
        description: value.message,
      });
    });
  }, [form.formState.errors]);

  useEffect(methodForUseEffect, [form.formState.errors]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {CreateUserFormValue.map((e) => (
          <CustomFormInput
            key={e.inputName}
            control={form.control}
            inputName={e.inputName}
            label={e.label}
            type={e.type}
            placeholder={e.placeholder}
            disabled={form.formState.isSubmitting}
            autoComplete={e.autoComplete}
          />
        ))}
        <CustomSelectImput
          control={form.control}
          inputName="gender"
          label="Gender"
          placeholder="Gender"
          items={itemsForSelectInput}
        />
        <div className="my-4"></div>
        <CustomDateInput
          control={form.control}
          inputName="date_of_birth"
          label="Date of Birth"
        />

        <CustomTextArea
          control={form.control}
          inputName="address"
          label="Enter the address"
          placeholder="Enter the address"
        />

        <Button className="text-lg mt-4" disabled={form.formState.isSubmitting}>
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

export default memo(UserCreateForm);
