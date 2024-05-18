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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";

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
    console.log(values);
  };

  return (
    <div>
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
                  <FormMessage className="text-red-600" />
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
                  <FormMessage className="text-red-600" />
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
    </div>
  );
}

export default SigninForm;
