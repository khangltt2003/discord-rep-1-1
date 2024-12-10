"use client";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { useModal } from "@/hooks/use-modal-store";
import { useEffect, useState } from "react";
import { ChannelType } from "@prisma/client";
import { Hash, Video, Volume2Icon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import queryString from "query-string";

const formSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Channel name is required.",
    })
    .refine((name) => name !== "general", {
      message: "Channel name cannot be 'general'.",
    }),
  type: z.enum([ChannelType.TEXT, ChannelType.AUDIO, ChannelType.VIDEO], {
    message: "Channel type is required.",
  }),
});

export const CreateChannelModal = () => {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  const { isOpen, onClose, type, data } = useModal();

  const isModalOpen = isOpen && type === "createChannel";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "TEXT",
    },
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { server } = data;
  const isLoading = form.formState.isSubmitting;

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = queryString.stringifyUrl({
        url: "/api/channels",
        query: {
          serverId: server?.id,
        },
      });

      await axios.post(url, { name: values.name, type: values.type });

      form.reset();
      onClose();
      router.refresh();
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  if (!isMounted) {
    return null;
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white dark:bg-neutral-700 dark:text-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold dark:text-white">Create a channel</DialogTitle>
          <DialogDescription className="text-center dark:text-white ">Give new channel a name and a type.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8 font-semibold">
            <div className="space-y-8 px-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500  dark:text-white">Channel Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-neutral-200 border-0 focus-visible:ring-0 text-black  focus-visible:ring-offset-0"
                        placeholder="Enter Channel Name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500  dark:text-white">Channel Type</FormLabel>
                    <FormControl>
                      <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col ">
                        <FormItem
                          className={cn("flex items-center space-x-3 space-y-0 rounded-lg", field.value === ChannelType.TEXT && "bg-neutral-800")}
                        >
                          <div className="w-full  flex items-center p-2">
                            <FormLabel className={"font-normal flex gap-2 items-center"}>
                              <Hash />
                              <div>
                                <p className="text-base">Text</p>
                                <FormDescription>Send messages, images, GIFs, emoji, opinions, and puns.</FormDescription>
                              </div>
                            </FormLabel>

                            <FormControl>
                              <RadioGroupItem className="ml-auto" value={ChannelType.TEXT} />
                            </FormControl>
                          </div>
                        </FormItem>

                        <FormItem
                          className={cn("flex items-center space-x-3 space-y-0 rounded-lg", field.value === ChannelType.AUDIO && "bg-neutral-800")}
                        >
                          <div className="w-full  flex items-center p-2">
                            <FormLabel className="font-normal flex gap-2 items-center">
                              <Volume2Icon />
                              <div>
                                <p className="text-base">Audio</p>
                                <FormDescription>Hang out with voice call.</FormDescription>
                              </div>
                            </FormLabel>

                            <FormControl>
                              <RadioGroupItem className="ml-auto" value={ChannelType.AUDIO} />
                            </FormControl>
                          </div>
                        </FormItem>

                        <FormItem
                          className={cn("flex items-center space-x-3 space-y-0 rounded-lg", field.value === ChannelType.VIDEO && "bg-neutral-800")}
                        >
                          <div className="w-full  flex items-center p-2">
                            <FormLabel className="font-normal flex gap-2 items-center">
                              <Video />
                              <div>
                                <p className="text-base">Video</p>
                                <FormDescription>Hang out with video call.</FormDescription>
                              </div>
                            </FormLabel>

                            <FormControl>
                              <RadioGroupItem className="ml-auto" value={ChannelType.VIDEO} />
                            </FormControl>
                          </div>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-100 dark:bg-neutral-700 dark:text-white px-6 pb-4">
              <Button variant="primary" className="bg-green-500 hover:bg-green-600" disabled={isLoading}>
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
