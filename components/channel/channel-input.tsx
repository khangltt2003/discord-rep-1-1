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
import { MessageType } from "@prisma/client";
import { EmojiPicker } from "../emoji-picker";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
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

      await axios.post(url, { ...values, type: MessageType.TEXT });
      form.reset();
      router.refresh();
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
                    autoFocus
                    className="focus-visible:ring-offset-0 focus-visible:ring-0 bg-neutral-700 pr-10 text-neutral-300 text-base"
                    placeholder={`Message ${type === "conversation" ? name : "# " + name}  `}
                    {...field}
                  />
                  <div className="absolute top-[50%] translate-y-[-50%] right-2 flex items-center gap-2">
                    <EmojiPicker onPick={(emoji) => field.onChange(`${field.value}${emoji}`)} />

                    <button
                      type="button"
                      className=" bg-neutral-400 rounded-full hover:bg-neutral-300"
                      onClick={() => onOpen("messageFile", { apiUrl, query })}
                    >
                      <Plus className="text-neutral-700 h-6 w-6" />
                    </button>
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
