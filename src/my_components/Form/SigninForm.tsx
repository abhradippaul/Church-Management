"use client";

import { CardContent, CardFooter } from "@/components/ui/card";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";

function SigninForm() {
  let formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(4),
  });

  let form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  let onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values.email);
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
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username : </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="abc@gmail.com"
                      type="email"
                      required
                      autoComplete="username"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="my-4"></div>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password : </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="password"
                      type="password"
                      required
                      {...field}
                      autoComplete="current-password"
                    />
                  </FormControl>
                </FormItem>
              )}
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

export default SigninForm;
