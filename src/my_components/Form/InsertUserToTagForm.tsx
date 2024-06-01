"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "@/components/ui/use-toast";
import { memo, useCallback, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import InsertUserToTagSchema from "@/schema/InsertUserToTagSchema";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useDebouncedCallback } from "use-debounce";
import { getPeopleSearchInfo } from "@/helpers/db";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PeopleItemValue {
  name: string;
  _id: string;
  image: string;
}

const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL;

function InsertUserToTagForm() {
  const router = useRouter();
  const [people, setPeople] = useState<PeopleItemValue[]>([]);
  let form = useForm<z.infer<typeof InsertUserToTagSchema>>({
    resolver: zodResolver(InsertUserToTagSchema),
    defaultValues: [],
  });

  const onSubmit = useCallback(
    async (values: z.infer<typeof InsertUserToTagSchema>) => {
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
    },
    []
  );

  const debounced = useDebouncedCallback(async (value) => {
    const data = await getPeopleSearchInfo(value);
    if (data.success) {
      console.log(data);
      setPeople(data.data);
    }
  }, 500);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Command className="h-[200px]">
          <CommandInput
            placeholder="Type a command or search..."
            onValueChange={(e) => debounced(e)}
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {people.map(({ _id, image, name }) => (
                <CommandItem key={_id} className="flex items-center">
                  {name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>

        <Button variant="secondary" size="lg" className="text-lg mt-8">
          {form.formState.isSubmitting ? (
            <Loader2 className="size-6 animate-spin" />
          ) : (
            "Submit"
          )}
        </Button>
      </form>
    </Form>
  );
}

export default memo(InsertUserToTagForm);
