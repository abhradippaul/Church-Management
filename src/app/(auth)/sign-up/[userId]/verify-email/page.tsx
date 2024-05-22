"use client";

import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import VerifyEmailSchema from "@/schema/VerifyEmailSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { memo, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/components/ui/use-toast";
import axios from "axios";
import { useParams, useRouter, useSearchParams } from "next/navigation";

const CustomFormInput = dynamic(
  () => import("@/my_components/Form/CustomFormInput")
);

function page() {
  const { userId } = useParams();
  const router = useRouter();
  const type = useSearchParams().get("type");

  const form = useForm<z.infer<typeof VerifyEmailSchema>>({
    resolver: zodResolver(VerifyEmailSchema),
    defaultValues: {
      emailOtp: "",
    },
  });
  const onSubmit = useCallback(
    async (values: z.infer<typeof VerifyEmailSchema>) => {
      try {
        if (userId) {
          const { data } = await axios.post("/api/v1/verify-email", {
            verificationCode: values.emailOtp,
            _id: userId,
            type,
          });
          if (data.success) {
            router.push("/sign-in");
          } else {
            toast({
              title: "Error",
              description: data.message,
            });
          }
        }
      } catch (err: any) {
        toast({
          title: "Error",
          description: err?.response?.data?.message,
        });
      }
    },
    []
  );
  useEffect(() => {
    const emailError = form.formState.errors.emailOtp?.message;
    if (emailError) {
      toast({
        title: "Error in email field",
        description: emailError,
      });
    }
  }, [form.formState.errors]);
  return (
    <div className="w-[90%] max-w-[500px]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CustomFormInput
            control={form.control}
            inputName="emailOtp"
            label="Verify Otp"
            type="number"
            placeholder="Enter your email otp"
            disabled={form.formState.isSubmitting}
            formMessage="Otp has been sent to your email"
          />
          <Button
            variant="secondary"
            size="lg"
            disabled={form.formState.isSubmitting}
            className="text-lg mt-4"
          >
            {form.formState.isSubmitting ? (
              <Loader2 className="size-6 animate-spin" />
            ) : (
              "Verify"
            )}
          </Button>
        </form>
      </Form>
      <Toaster />
    </div>
  );
}

export default memo(page);
