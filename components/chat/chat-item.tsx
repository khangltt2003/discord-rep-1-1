"use client";

import { MessageWithMemberProfile } from "@/type";
import { Member, MemberRole, MessageType } from "@prisma/client";
import { format } from "date-fns";
import { FileText, PenSquare, ShieldAlert, ShieldCheck, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { UserAvatar } from "../user-avatar";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useModal } from "@/hooks/use-modal-store";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import queryString from "query-string";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { EmojiPicker } from "../emoji-picker";
import { Button } from "../ui/button";

const formSchema = z.object({
  content: z.string().min(1),
});

const roleIconMap = {
  ADMIN: <ShieldAlert className="h-5 w-5 text-red-400" />,
  MODERATOR: <ShieldCheck className="h-5 w-5 text-blue-400" />,
  GUEST: null,
};

interface ChatItemProps {
  currentMember: Member;
  message: MessageWithMemberProfile;
  socketUrl: string;
  socketQuery: Record<string, string>;
}

export const ChatItem = ({ currentMember, message, socketUrl, socketQuery }: ChatItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { onOpen } = useModal();

  const { id, content, member, type, fileUrl, isDeleted, createdAt, updatedAt } = message;
  const { name, imageUrl } = member.profile;

  const timestamp = format(new Date(createdAt), "hh:mm a");

  const isAdmin = currentMember.role === MemberRole.ADMIN;
  const isMod = currentMember.role === MemberRole.MODERATOR;
  const isOwner = currentMember.id === member.id;

  const canDeleteMessage = !isDeleted && (isAdmin || isMod || isOwner);
  const canEditMessage = !isDeleted && isOwner && type == MessageType.TEXT;

  const isEdited = createdAt === updatedAt ? false : true;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: content,
    },
  });

  useEffect(() => {
    form.reset({
      content: content,
    });
  }, [content, form]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        form.reset();
        setIsEditing(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [form]);

  const isLoading = form.formState.isSubmitting;

  const handleEdit = () => {
    if (isEditing) {
      form.reset();
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = queryString.stringifyUrl({
        url: `${socketUrl}/${id}`,
        query: socketQuery,
      });

      await axios.patch(url, values);
      form.reset();
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="flex items-start gap-x-3 p-2 hover:bg-[#58585f4d]  rounded-xl group relative">
      {/* edit and delete */}
      {!isDeleted && (
        <div className="hidden group-hover:flex  gap-1 absolute top-[-10px] right-3  z-30 bg-[#424549] rounded-lg p-2">
          {canEditMessage && <PenSquare className="h-5 w-5 text-neutral-300 hover:text-neutral-100" onClick={handleEdit} />}
          {canDeleteMessage && (
            <Trash2
              className="h-5 w-5 text-rose-600 hover:text-rose-500 "
              onClick={() => onOpen("deleteMessage", { socketUrl, socketQuery, message })}
            />
          )}
        </div>
      )}
      <div className="cursor-pointer" onClick={() => onOpen("createConversation", { profile: member.profile })}>
        <UserAvatar src={imageUrl} className="md:h-10 md:w-10" />
      </div>
      <div className="flex flex-col w-full">
        <div className="flex items-center space-x-2">
          <span
            className="font-semibold group text-neutral-300 group-hover:text-neutral-200 hover:underline cursor-pointer"
            onClick={() => onOpen("createConversation", { profile: member.profile })}
          >
            {name}
          </span>
          {roleIconMap[member.role]}
          <span className="text-xs text-gray-400 ">{timestamp}</span>
        </div>

        {!isDeleted ? (
          <>
            {type === MessageType.TEXT && !isEditing && (
              <p className="text-base text-gray-300 group  group-hover:text-gray-200">
                {content}
                {isEdited && <span className="text-xs text-gray-400 hover:text-gray-300 "> (edited)</span>}
              </p>
            )}

            {type === MessageType.TEXT && isEditing && (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="flex items-center w-full gap-x-2 pt-2">
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <div className="relative">
                            <Input
                              disabled={isLoading}
                              autoComplete="off"
                              autoFocus
                              className="focus-visible:ring-1 bg-[#191919] pr-10 text-neutral-300 text-base"
                              {...field}
                            />
                            <div className="absolute top-[50%] translate-y-[-50%] right-2 flex items-center gap-2">
                              <EmojiPicker onPick={(emoji) => field.onChange(`${field.value}${emoji}`)} />
                            </div>
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button variant="primary">save</Button>
                </form>
                <span className="text-sm text-neutral-400 mt-1">press &apos;esc&apos; to cancel, or &apos;enter&apos; to save.</span>
              </Form>
            )}

            {type === MessageType.IMAGE && fileUrl && (
              <a href={fileUrl} className="relative items-center h-48 w-48 rounded-xl overflow-hidden" target="_blank" rel="noopener noreferrer">
                <Image src={fileUrl} alt={content} fill className="object-cover" />
              </a>
            )}

            {type === MessageType.PDF && fileUrl && (
              <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="w-48 border border-neutral-300 rounded-lg overflow-hidden">
                <div className="flex items-center gap-2 bg-[#242424] p-4 ">
                  <FileText className="h-12 w-12 font-thin text-neutral-300" />
                  <span className="text-sm text-neutral-300 hover:underline">{content}</span>
                </div>
              </a>
            )}
          </>
        ) : (
          <p className="text-sm text-neutral-500 italic">this message is deleted.</p>
        )}
      </div>
    </div>
  );
};
