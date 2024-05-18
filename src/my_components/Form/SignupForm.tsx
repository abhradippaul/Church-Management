"use client";

import { CardContent } from "@/components/ui/card";
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
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/components/ui/use-toast";

function SignupForm() {
  let formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(4),
    name: z.string(),
    image: z.string(),
  });

  let form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      image: "",
    },
  });

  let onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    toast({
      title: "Success",
      description: "You have successfully signed up",
    });
  };

  return (
    <>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Church Name : </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Name should be unique"
                      type="name"
                      required
                      {...field}
                      autoComplete="name"
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />
            <div className="my-4"></div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Church Email : </FormLabel>
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
            <div className="my-4"></div>
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upload Image : </FormLabel>
                  <FormControl>
                    <Input type="file" required {...field} />
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
      <Toaster />
    </>
  );
}

export default SignupForm;
