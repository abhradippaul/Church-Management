"use client";

import { CardContent, CardFooter } from "@/components/ui/card";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "@/components/ui/use-toast";
import { memo, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import SignInSchema from "@/schema/SignInSchema";
import CustomFormInput from "./CustomFormInput";

const SignInFormValue = [
  {
    label: "Church Email",
    inputName: "email",
    type: "email",
    placeholder: "Enter an email",
    autoComplete: "email",
  },
  {
    label: "Password",
    inputName: "password",
    type: "password",
    placeholder: "Enter a password",
    autoComplete: "password",
  },
];

function SigninForm() {
  let form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  let onSubmit = (values: z.infer<typeof SignInSchema>) => {
    console.log(values);
  };

  useEffect(() => {
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

  return (
    <>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {SignInFormValue.map((e) => (
              <CustomFormInput
                key={e.label}
                control={form.control}
                inputName={e.inputName}
                label={e.label}
                type={e.type}
                placeholder={e.placeholder}
                disabled={form.formState.isSubmitting}
                autoComplete={e.autoComplete}
              />
            ))}

            <Button variant="secondary" size="lg" className="text-lg mt-8">
              {form.formState.isSubmitting ? (
                <Loader2 className="size-6 animate-spin" />
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-center justify-end text-zinc-300 text-base md:text-lg">
          Create Account.
          <Link
            href="/sign-up"
            className="ml-2 hover:text-white transition font-semibold text-lg md:text-xl"
          >
            Sign Up
          </Link>
        </div>
      </CardFooter>
      <Toaster />
    </>
  );
}

export default memo(SigninForm);
