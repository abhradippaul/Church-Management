"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import CustomFormInput from "@/my_components/Form/CustomFormInput";
import CreateUserSchema from "@/schema/CreateUserSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { memo, useCallback, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import PeopleProvider, {
  usePeopleContext,
} from "@/my_components/providers/PeopleProvider";

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
    inputName: "phoneNumber",
    type: "number",
    placeholder: "Enter a ph no",
    autoComplete: "phone number",
  },
];

function UserCreateForm() {
  const { setIsFormError } = usePeopleContext();
  const form = useForm<z.infer<typeof CreateUserSchema>>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      name: "",
      email: "",
      address: "",
      dateOfBirth: "",
      gender: "",
      phoneNumber: "",
    },
  });
  const onSubmit = useCallback((values: z.infer<typeof CreateUserSchema>) => {
    console.log(values);
  }, []);

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
        <Button className="text-lg mt-4" disabled={form.formState.isSubmitting}>
          {form.formState.isLoading ? (
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
