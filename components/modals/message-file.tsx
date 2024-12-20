"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

import { useModal } from "@/hooks/use-modal-store";
import { MessageType } from "@prisma/client";
import dynamic from "next/dynamic";
import queryString from "query-string";

const FileUpload = dynamic(() => import("@/components/file-upload"), {
  ssr: false,
});

const formSchema = z.object({
  file: z.object({
    content: z.string().min(1),
    fileUrl: z.string().min(1),
    type: z.string().min(1),
  }),
});

export const MessageFileModal = () => {
  const { isOpen, onClose, data, type } = useModal();

  const router = useRouter();

  const isModalOpen = isOpen && type === "messageFile";

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      file: {
        content: "",
        fileUrl: "",
        type: "",
      },
    },
  });

  const isLoading = form.formState.isSubmitting;

  const { apiUrl, query } = data;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = queryString.stringifyUrl({
        url: apiUrl || "",
        query: query,
      });
      await axios.post(url, {
        ...values,
        content: values.file.content,
        fileUrl: values.file.fileUrl,
        type: values.file.type === "pdf" ? MessageType.PDF : MessageType.IMAGE,
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

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-neutral-600 text-neutral-300 p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">Upload file</DialogTitle>
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
                          endpoint="messageFile"
                          content={field.value.content}
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
            </div>
            <DialogFooter className="bg-neutral-600 px-6 py-4">
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-white" variant="primary" disabled={isLoading}>
                Upload
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
