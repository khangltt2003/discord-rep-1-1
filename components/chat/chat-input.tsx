"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";

import { useModal } from "@/hooks/use-modal-store";
import { MessageType } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import queryString from "query-string";
import { EmojiPicker } from "../emoji-picker";
import { useRef } from "react";

const formSchema = z.object({
  content: z.string().min(1),
});

interface ChatInputProps {
  socketUrl: string;
  socketQuery: Record<string, string>;
  name: string;
  type: "conversation" | "channel";
}

export const ChannelInput = ({ socketUrl, socketQuery, name, type }: ChatInputProps) => {
  const router = useRouter();
  const { onOpen } = useModal();
  const inputRef = useRef<HTMLInputElement>(null);

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
        url: socketUrl,
        query: socketQuery,
      });

      await axios.post(url, { ...values, type: MessageType.TEXT });
      form.reset();
      router.refresh();
      //settimeout to wait for the form to reset completely

      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 300);
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
                    {...field}
                    disabled={isLoading}
                    autoComplete="off"
                    autoFocus={true}
                    className="focus-visible:ring-offset-0 focus-visible:ring-0 bg-neutral-700 pr-10 text-neutral-300 text-base"
                    placeholder={`Message ${type === "conversation" ? name : "# " + name}  `}
                    ref={inputRef}
                  />
                  <div className="absolute top-[50%] translate-y-[-50%] right-2 flex items-center gap-2">
                    <EmojiPicker onPick={(emoji) => field.onChange(`${field.value}${emoji}`)} />

                    <button
                      type="button"
                      className=" bg-neutral-400 rounded-full hover:bg-neutral-300"
                      onClick={() =>
                        onOpen("messageFile", {
                          socketUrl: socketUrl,
                          socketQuery: socketQuery,
                        })
                      }
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
