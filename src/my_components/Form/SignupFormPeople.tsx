"use client";

import { CardContent, CardFooter } from "@/components/ui/card";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { memo, useCallback, useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import SignInSchema from "@/schema/SignInSchema";
import CustomFormInput from "./CustomFormInput";
import axios from "axios";
import { useRouter } from "next/navigation";

const SignUpFormValue = [
  {
    label: "User Email",
    inputName: "email",
    type: "email",
    placeholder: "Enter an email",
    autoComplete: "email",
  },
  {
    label: "Password",
    inputName: "password",
    type: "password",
    placeholder: "Create a password",
    autoComplete: "password",
  },
];

function SignUpForm() {
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isUserExist, setIsUserExist] = useState(false);
  const router = useRouter();
  let form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = useCallback(async (values: z.infer<typeof SignInSchema>) => {
    try {
      const { data } = await axios.post("/api/v1/sign-in", values);
      console.log(data);
      if (data.success) {
        router.push("/dashboard");
      } else {
        toast({
          title: "Error",
          description: data.message,
        });
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.response?.data?.message,
      });
    }
  }, []);

  const methodForUseEffect = useCallback(() => {
    const error = form.formState.errors;

    if (error) {
      if (error.email?.message) {
        toast({
          title: "Error in email field",
          description: error.email?.message,
        });
      } else if (error.password?.message) {
        toast({
          title: "Error in password field",
          description: error.password?.message,
        });
      }
    }
  }, [form.formState.errors]);

  useEffect(methodForUseEffect, [form.formState.errors]);

  return (
    <>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {SignUpFormValue.map((e) => (
              <CustomFormInput
                key={e.label}
                control={form.control}
                inputName={e.inputName}
                label={e.label}
                type={e.type}
                placeholder={e.placeholder}
                disabled={form.formState.isSubmitting || isUserExist}
                autoComplete={e.autoComplete}
              />
            ))}

            {isEmailVerified && isUserExist && (
              <Button variant="secondary" size="lg" className="text-lg mt-8">
                {form.formState.isSubmitting ? (
                  <Loader2 className="size-6 animate-spin" />
                ) : (
                  "Submit"
                )}
              </Button>
            )}
          </form>
          {!isEmailVerified && (
            <Button variant="secondary" size="lg" className="text-lg mt-8">
              {form.formState.isSubmitting ? (
                <Loader2 className="size-6 animate-spin" />
              ) : (
                "Verify"
              )}
            </Button>
          )}
        </Form>
      </CardContent>
      <CardFooter className="text-zinc-300 text-base">
        Give the email that you have provided to the church and write a strong
        password minimum 6 characters.
      </CardFooter>
      <Toaster />
    </>
  );
}

export default memo(SignUpForm);
