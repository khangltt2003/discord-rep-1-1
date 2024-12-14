"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { Plus } from "lucide-react";

import axios from "axios";
import queryString from "query-string";
import { useModal } from "@/hooks/use-modal-store";

const formSchema = z.object({
  content: z.string().min(1),
});

interface ChatInputProps {
  apiUrl: string;
  query: Record<string, any>;
  name: string;
  type: "conversation" | "channel";
}

export const ChannelInput = ({ apiUrl, query, name, type }: ChatInputProps) => {
  const { onOpen } = useModal();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = queryString.stringifyUrl({
        url: apiUrl,
        query,
      });

      await axios.post(url, values);
    } catch (error) {
      console.log(error);
    }
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
                <div className="relative">
                  <Input
                    disabled={isLoading}
                    autoComplete="off"
                    className="focus-visible:ring-offset-0 focus-visible:ring-0 bg-neutral-700 pr-10 text-neutral-300"
                    placeholder={`Message ${type === "conversation" ? name : "# " + name}  `}
                    {...field}
                  />

                  <button
                    type="button"
                    className="absolute top-[50%] translate-y-[-50%] right-2 bg-neutral-400 rounded-full hover:bg-neutral-300"
                    onClick={() => onOpen("messageFile", {})}
                  >
                    <Plus className="text-neutral-700  " />
                  </button>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
