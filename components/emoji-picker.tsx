"use client";

import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { Smile } from "lucide-react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface EmojiPickerProps {
  onPick: (value: string) => void;
}

export function EmojiPicker({ onPick }: EmojiPickerProps) {
  return (
    <Popover>
      <PopoverTrigger className="flex items-center justify-center">
        <Smile className="h-7 w-7 text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition" />
      </PopoverTrigger>
      <PopoverContent className="bg-transparent mb-16" sideOffset={40} side="right">
        <Picker theme="dark" data={data} onEmojiSelect={(emoji: any) => onPick(emoji.native)} />
      </PopoverContent>
    </Popover>
  );
}
