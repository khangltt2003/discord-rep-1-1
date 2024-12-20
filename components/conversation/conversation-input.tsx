"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";

const formSchema = z.object({
  content: z.string().min(1),
});

interface ChatInputProps {
  apiUrl: string;
  query: Record<string, any>;
  name: string;
  type: "convesation" | "channel";
}

export const ChannelInput = ({ apiUrl, query, name, type }: ChatInputProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const handleSubmit = async (value: z.infer<typeof formSchema>) => {
    console.log(value);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel />
              <FormControl>
                <Input
                  autoComplete="off"
                  className="focus-visible:ring-offset-0 focus-visible:ring-0 bg-neutral-700"
                  placeholder="Say something ..."
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
