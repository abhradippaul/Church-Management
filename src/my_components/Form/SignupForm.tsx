"use client";

import { CardContent } from "@/components/ui/card";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/components/ui/use-toast";
import { ChangeEvent, memo, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import SignUpSchema from "@/schema/SignUpSchema";
import axios from "axios";
// import CustomFormInput from "./CustomFormInput";
// import { uploadCloudinary } from "@/lib/Cloudinary";
import dynamic from "next/dynamic";

const CustomFormInput = dynamic(() => import("./CustomFormInput"));

const SignUpFormValue = [
  {
    label: "Church Name",
    inputName: "name",
    type: "text",
    placeholder: "Enter a name",
    autoComplete: "name",
  },
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
  {
    label: "Upload Image",
    inputName: "image",
    type: "file",
  },
];

function SignupForm() {
  const pathName = usePathname();
  const [isUploadedImage, setIsUploadedImage] = useState("");
  const [isImageLoading, setIsImageLoading] = useState(false);

  let form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      image: "",
    },
  });

  let onSubmit = async (values: z.infer<typeof SignUpSchema>) => {
    values.image = isUploadedImage;
    if (pathName.includes("/admin")) {
      console.log("This is an admin page");
    } else {
      const res = await axios.post("/api/v1/sign-up", values);
      console.log(values);
      console.log(res);
    }
  };

  const uploadImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const image = e.target.files;
    if (image?.length) {
      setIsImageLoading(true);
      const { public_id } = await (
        await import("@/lib/Cloudinary")
      ).uploadCloudinary(image);
      if (public_id) {
        setIsUploadedImage(public_id);
        setIsImageLoading(false);
      }
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
          {SignUpFormValue.map((e) => (
            <CustomFormInput
              key={e.label}
              control={form.control}
              inputName={e.inputName}
              label={e.label}
              type={e.type}
              placeholder={e.placeholder}
              disabled={form.formState.isSubmitting}
              autoComplete={e.autoComplete}
              imageUpload={e.type === "file" ? uploadImage : null}
            />
          ))}

          <Button
            variant="secondary"
            size="lg"
            disabled={form.formState.isSubmitting || isImageLoading}
            className="text-lg mt-8"
          >
            {form.formState.isSubmitting || isImageLoading ? (
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
