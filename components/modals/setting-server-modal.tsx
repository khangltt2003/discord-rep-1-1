"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useModal } from "@/hooks/use-modal-store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import dynamic from "next/dynamic";

const FileUpload = dynamic(() => import("@/components/file-upload"), {
  ssr: false,
});

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Server name is required.",
  }),
  file: z.object({
    fileUrl: z.string().min(1, {
      message: "File URL is required.",
    }),
    type: z.string().min(1, {
      message: "File type is required.",
    }),
  }),
});

export const SettingServerModal = () => {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  const { isOpen, onClose, type, data } = useModal();

  const { server } = data;

  const isModalOpen = isOpen && type === "serverSetting";

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      file: {
        fileUrl: "",
        type: "",
      },
    },
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (server) {
      form.setValue("name", server.name);
      form.setValue("file", { fileUrl: server.imageUrl, type: "png" });
    }
  }, [server, form]);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/servers/${server?.id}`, {
        name: values.name,
        imageUrl: values.file.fileUrl,
      });
      form.reset();
      router.refresh();
      onClose();
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
      <DialogContent className="bg-white text-black p-0 overflow-hidden font-semibold">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Create your server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Give your server a name and an image.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="spae-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={form.control}
                  name="file"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint="serverImage"
                          fileUrl={field.value.fileUrl}
                          type={field.value.type}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Sever Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Enter Server Name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button variant="primary" disabled={isLoading}>
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
