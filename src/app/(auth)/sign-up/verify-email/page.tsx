"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import VerifyEmailSchema from "@/schema/VerifyEmailSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

function page() {
  const form = useForm<z.infer<typeof VerifyEmailSchema>>({
    resolver: zodResolver(VerifyEmailSchema),
    defaultValues: {
      emailOtp: "",
    },
  });
  const onSubmit = (values: z.infer<typeof VerifyEmailSchema>) => {
    console.log(values);
  };
  return (
    <div className="w-[90%] max-w-[500px]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="emailOtp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verify Otp : </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your email otp"
                    type="text"
                    required
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-zinc-400">
                  Otp has been sent to your email
                </FormMessage>
              </FormItem>
            )}
          />
          <Button variant="secondary" size="lg" className="text-lg mt-4">
            {form.formState.isSubmitting ? (
              <Loader2 className="size-6 animate-spin" />
            ) : (
              "Verify"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default page;
