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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/components/ui/use-toast";
import { memo, useEffect } from "react";
import { usePathname } from "next/navigation";

interface SignupFormProps {
  email: string;
  password: string;
  name: string;
  image: string;
}

function SignupForm({ email, image, name, password }: SignupFormProps) {
  const pathName = usePathname();
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
    if (pathName.includes("/admin")) {
      console.log("This is an admin page");
    }
  };

  useEffect(() => {
    const error = form.formState.errors;
    if (error) {
      if (error.name) {
        toast({
          title: "Error in Church Name field",
          description: error.name.message,
        });
      } else if (error.email) {
        toast({
          title: "Error in Church Email field",
          description: error.email.message,
        });
      } else if (error.password) {
        toast({
          title: "Error in Password field",
          description: error.password.message,
        });
      } else if (error.image) {
        toast({
          title: "Error in Upload Image field",
          description: error.image.message,
        });
      }
    }
  }, [form.formState.errors]);

  return (
    <CardContent>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{name} : </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Name should be unique"
                    type="text"
                    disabled={form.formState.isSubmitSuccessful}
                    required
                    {...field}
                    autoComplete="name"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="my-4"></div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{email} : </FormLabel>
                <FormControl>
                  <Input
                    placeholder="abc@gmail.com"
                    type="email"
                    required
                    disabled={form.formState.isSubmitSuccessful}
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
                <FormLabel>{password} : </FormLabel>
                <FormControl>
                  <Input
                    placeholder="password"
                    type="password"
                    required
                    disabled={form.formState.isSubmitSuccessful}
                    {...field}
                    autoComplete="current-password"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="my-4"></div>
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{image} : </FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    required
                    disabled={form.formState.isSubmitSuccessful}
                    {...field}
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
      <Toaster />
    </CardContent>
  );
}

export default memo(SignupForm);
